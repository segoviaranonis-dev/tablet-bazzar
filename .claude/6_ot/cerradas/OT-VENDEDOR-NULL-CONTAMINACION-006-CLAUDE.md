# OT-VENDEDOR-NULL-CONTAMINACION-006 — Blindaje DB + saneamiento de pedidos sin vendedor

**Prioridad:** ALTA — corrupción de datos en producción confirmada
**Director:** Héctor Segovia
**Ejecutor:** **Claude Code** (Supabase / DB)
**Coordinador técnico:** Cursor
**Apertura:** 2026-05-22

---

## Incidente detectado en producción

El Director identificó que el pedido **PVR-2026-794967** (creado 22-05-2026 11:42 a.m. por BAZZAR NINOS (PALMA) DE SERGIO MARTINEZ OHIGG, 76 pares, Gs. 9.300.000) llegó a Streamlit con **Vendedor: None**.

Misma anomalía replicada en la captura del módulo "Células de Aprobación" donde el campo *Vendedor* muestra literalmente `None`.

### Causa raíz (Cursor)

La sesión de venta en `rimec-web` se persiste en `localStorage`. Un vendedor abrió la sesión con una versión vieja del cliente (anterior al fix del 2026-05-22 que mapea `user.id_usuario → vendedor.id_vendedor`), agregó ítems, y hoy confirmó el pedido. El payload del RPC `confirmar_pedido_web` llegó con `p_vendedor_id = NULL`, y la función **lo aceptó sin protestar**.

### Capa de validación de cliente (Cursor en este turno)

El frontend de `rimec-web` ahora aplica **defensa en profundidad** complementaria al RPC. Esto no es un atajo — es la capa de UX que siempre debió existir y faltaba:

- `DialogoActivacion.tsx` rechaza activar la venta si `/api/auth/me` no devuelve un `id_usuario` válido (HTTP 401, 5xx, payload incompleto). Muestra error rojo y obliga a re-loguear.
- `store/sesionVenta.ts` define `onRehydrateStorage` como hook estructural del store: cualquier sesión persistida con `activa=true` pero `vendedor.id_vendedor` inválido se rehidrata como `activa=false`. Esto expulsa de forma determinista a usuarios que arrastren localStorage de versiones anteriores.
- `app/carrito/page.tsx` agrega un banner rojo "⛔ Sesión de venta sin vendedor asignado" y bloquea el botón CONFIRMAR PEDIDO con motivo explícito.

**Esta OT NO depende de esa capa para ser válida.** El RPC blindado de abajo es la barrera de DB definitiva. El frontend agrega UX y reduce ruido de errores; la DB es la única autoridad sobre integridad de datos.

---

## Tareas

### 1. Auditoría: cuántos pedidos están contaminados

```sql
-- Pedidos sin vendedor en producción
SELECT
  id, nro_pedido, cliente_id, total_pares, total_monto, estado,
  created_at::timestamp(0) AS creado
FROM public.pedido_venta_rimec
WHERE vendedor_id IS NULL
ORDER BY id DESC;

-- Facturas internas sin vendedor (deberían coincidir 1:N con pedidos)
SELECT
  fi.id, fi.nro_factura, fi.pp_id, fi.pedido_id, fi.estado,
  fi.total_pares, fi.total_monto, fi.created_at::timestamp(0) AS creada
FROM public.factura_interna fi
WHERE fi.vendedor_id IS NULL
ORDER BY fi.id DESC;
```

Reportar en la sección Evidencia.

### 2. Reasignar el pedido afectado (PVR-2026-794967)

**Decisión del Director (2026-05-22):** el vendedor de ese pedido es el usuario **BZZP** (es el dueño real del pedido). Resolver el `id_usuario` por descripción:

```sql
-- Paso 2.0 — Resolver id_usuario de BZZP
SELECT id_usuario, descp_usuario, categoria, rol_id
FROM public.usuario_v2
WHERE UPPER(TRIM(descp_usuario)) = 'BZZP'
  OR UPPER(TRIM(descp_usuario)) LIKE 'BZZP%';
```

Si el rol no es `VENDEDOR` ni `ADMIN`, **avisar al Director antes de continuar** (BZZP debería tener rol válido; si no lo tiene es otro bug aparte). Si efectivamente tiene rol válido, ejecutar:

```sql
-- Paso 2.1 — UPDATE atómico. Reemplazar :id_bzzp por el id_usuario obtenido arriba.
BEGIN;

UPDATE public.pedido_venta_rimec
SET vendedor_id = :id_bzzp
WHERE nro_pedido = 'PVR-2026-794967'
  AND vendedor_id IS NULL;

UPDATE public.factura_interna
SET vendedor_id = :id_bzzp
WHERE pedido_id IN (
  SELECT id FROM public.pedido_venta_rimec WHERE nro_pedido = 'PVR-2026-794967'
)
  AND vendedor_id IS NULL;

-- Verificación dentro de la transacción
SELECT 'pedido' AS tabla, nro_pedido, vendedor_id
FROM public.pedido_venta_rimec
WHERE nro_pedido = 'PVR-2026-794967'
UNION ALL
SELECT 'factura', nro_factura, vendedor_id
FROM public.factura_interna
WHERE pedido_id IN (
  SELECT id FROM public.pedido_venta_rimec WHERE nro_pedido = 'PVR-2026-794967'
);

COMMIT;
```

Si la auditoría del Paso 1 detectó **otros pedidos con `vendedor_id IS NULL`** además de PVR-2026-794967, NO los toques en este paso. Listalos en la evidencia y esperá decisión del Director para cada uno.

### 3. Formalizar el RPC `confirmar_pedido_web` con validaciones estructurales

**Contexto importante:** el archivo `mig_070_rpc_confirmar_pedido_web.sql` que estaba en la raíz del repo (fuera del pipeline numerado de `control_central/migrations/`) fue ELIMINADO por Cursor el 2026-05-22 como acto de saneamiento. Su contenido se absorbe íntegramente en la migración formal MIG-072 que se define a continuación, sumando las validaciones de identidad que faltaban.

Crear `control_central/migrations/072_rpc_confirmar_pedido_web_blindaje_vendedor.sql` con el cuerpo COMPLETO:

```sql
-- MIG-072 — RPC confirmar_pedido_web con validaciones estructurales de identidad.
-- Reemplaza definitivamente el archivo huérfano mig_070_rpc_confirmar_pedido_web.sql
-- que vivía fuera del pipeline numerado.
-- Agrega validaciones que faltaban:
--   1. p_vendedor_id NOT NULL
--   2. p_cliente_id NOT NULL
--   3. vendedor existe en usuario_v2 con rol VENDEDOR o ADMIN
-- Conserva la lógica de resolución de caso_id desde caso_precio_biblioteca por nombre_caso.

CREATE OR REPLACE FUNCTION public.confirmar_pedido_web(
  p_cliente_id      bigint,
  p_vendedor_id     bigint  DEFAULT NULL,
  p_plazo_id        bigint  DEFAULT NULL,
  p_lista_precio_id integer DEFAULT 1,
  p_descuento_1     numeric DEFAULT 0,
  p_descuento_2     numeric DEFAULT 0,
  p_descuento_3     numeric DEFAULT 0,
  p_descuento_4     numeric DEFAULT 0,
  p_total_pares     integer DEFAULT 0,
  p_total_monto     numeric DEFAULT 0,
  p_payload         jsonb   DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  v_nro_pedido    TEXT;
  v_pedido_id     BIGINT;
  v_lote          JSONB;
  v_factura       JSONB;
  v_item          JSONB;
  v_pp_id         BIGINT;
  v_pp_nro        TEXT;
  v_marca_txt     TEXT;
  v_marca_id      BIGINT;
  v_caso_txt      TEXT;
  v_caso_id       BIGINT;
  v_fi_id         BIGINT;
  v_nro_fi        TEXT;
  v_fi_pares      INTEGER;
  v_fi_monto      NUMERIC;
  v_det_id        BIGINT;
  v_pares         INTEGER;
  v_cajas         INTEGER;
  v_facturas_out  JSONB := '[]'::JSONB;
  v_total_fi      INTEGER := 0;
  v_db_cantidad_pares INTEGER;
  v_db_pares_vendidos INTEGER;
BEGIN
  -- ── 0. Validación de identidad del operador (NUEVO MIG-072) ─────────────
  IF p_vendedor_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error',   'p_vendedor_id es obligatorio. La sesión de venta debe identificar al vendedor.',
      'detail',  'VENDEDOR_FALTANTE'
    );
  END IF;

  IF p_cliente_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error',   'p_cliente_id es obligatorio.',
      'detail',  'CLIENTE_FALTANTE'
    );
  END IF;

  PERFORM 1 FROM public.usuario_v2 u
  WHERE u.id_usuario = p_vendedor_id
    AND public.fn_es_usuario_vendedor_o_admin(u.id_usuario);

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error',   format('Usuario %s no existe o no tiene rol VENDEDOR/ADMIN.', p_vendedor_id),
      'detail',  'VENDEDOR_INVALIDO'
    );
  END IF;

  -- ── 1. Validación de payload ─────────────────────────────────────────────
  IF p_payload IS NULL OR jsonb_typeof(p_payload->'lotes') <> 'array' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payload inválido: falta lotes[]');
  END IF;

  IF jsonb_array_length(p_payload->'lotes') = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Carrito vacío');
  END IF;

  -- ── 2. Generar número de pedido ─────────────────────────────────────────
  v_nro_pedido := 'PVR-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' ||
                  LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');

  -- ── 3. Insertar cabecera ────────────────────────────────────────────────
  INSERT INTO public.pedido_venta_rimec (
    nro_pedido, cliente_id, vendedor_id, plazo_id, lista_precio_id,
    descuento_1, descuento_2, descuento_3, descuento_4,
    total_pares, total_monto, estado, payload_json
  ) VALUES (
    v_nro_pedido, p_cliente_id, p_vendedor_id, p_plazo_id, p_lista_precio_id,
    p_descuento_1, p_descuento_2, p_descuento_3, p_descuento_4,
    p_total_pares, p_total_monto, 'PENDIENTE', p_payload
  )
  RETURNING id INTO v_pedido_id;

  -- ── 4. Procesar cada lote (= un PP) ─────────────────────────────────────
  FOR v_lote IN SELECT * FROM jsonb_array_elements(p_payload->'lotes')
  LOOP
    v_pp_id  := (v_lote->>'pp_id')::BIGINT;
    v_pp_nro := COALESCE(v_lote->>'pp_nro', v_pp_id::TEXT);

    IF jsonb_typeof(v_lote->'facturas') <> 'array'
       OR jsonb_array_length(v_lote->'facturas') = 0 THEN
      RAISE EXCEPTION 'Lote PP=% sin facturas[]', v_pp_id;
    END IF;

    -- ── 5. Procesar cada FI (1 por PP×Marca×Caso) ─────────────────────────
    FOR v_factura IN SELECT * FROM jsonb_array_elements(v_lote->'facturas')
    LOOP
      v_marca_txt := NULLIF(TRIM(COALESCE(v_factura->>'marca', '')), '');
      v_marca_id  := NULLIF(v_factura->>'marca_id', '')::BIGINT;
      v_caso_txt  := NULLIF(TRIM(COALESCE(v_factura->>'caso', '')), '');

      -- Resolver caso_id desde caso_precio_biblioteca usando el nombre del caso
      -- para evitar errores de FK (la vista entrega ids de precio_evento_caso
      -- que no coinciden con caso_precio_biblioteca.id).
      IF v_caso_txt IS NOT NULL THEN
        SELECT id INTO v_caso_id
        FROM public.caso_precio_biblioteca
        WHERE nombre_caso = v_caso_txt
        LIMIT 1;
      ELSE
        v_caso_id := NULLIF(v_factura->>'caso_id', '')::BIGINT;
      END IF;

      v_fi_pares := COALESCE((v_factura->>'total_pares')::INTEGER, 0);
      v_fi_monto := COALESCE((v_factura->>'total_monto')::NUMERIC, 0);

      IF jsonb_typeof(v_factura->'items') <> 'array'
         OR jsonb_array_length(v_factura->'items') = 0 THEN
        RAISE EXCEPTION 'Factura PP=%, marca=%, caso=% sin items[]',
          v_pp_id, COALESCE(v_marca_txt, '∅'), COALESCE(v_caso_txt, '∅');
      END IF;

      v_nro_fi := generar_nro_factura_interna(v_pp_id);

      INSERT INTO public.factura_interna (
        nro_factura, pp_id, pedido_id,
        cliente_id, vendedor_id, plazo_id, lista_precio_id,
        descuento_1, descuento_2, descuento_3, descuento_4,
        total_pares, total_monto, estado,
        marca, marca_id, caso, caso_id
      ) VALUES (
        v_nro_fi, v_pp_id, v_pedido_id,
        p_cliente_id, p_vendedor_id, p_plazo_id, p_lista_precio_id,
        p_descuento_1, p_descuento_2, p_descuento_3, p_descuento_4,
        v_fi_pares, v_fi_monto, 'RESERVADA',
        v_marca_txt, v_marca_id, v_caso_txt, v_caso_id
      )
      RETURNING id INTO v_fi_id;

      -- ── 6. Detalle FI + descuento de stock ───────────────────────────────
      FOR v_item IN SELECT * FROM jsonb_array_elements(v_factura->'items')
      LOOP
        v_det_id := NULLIF(v_item->>'det_id', '')::BIGINT;
        v_pares  := COALESCE((v_item->>'pares')::INTEGER, 0);
        v_cajas  := COALESCE((v_item->>'cajas')::INTEGER, 0);

        INSERT INTO public.factura_interna_detalle (
          factura_id, ppd_id, cajas, pares,
          precio_unit, precio_lista, precio_neto, subtotal,
          linea_snapshot
        ) VALUES (
          v_fi_id,
          v_det_id,
          v_cajas,
          v_pares,
          COALESCE((v_item->>'precio_neto')::NUMERIC, 0),
          COALESCE((v_item->>'precio_base')::NUMERIC, 0),
          COALESCE((v_item->>'precio_neto')::NUMERIC, 0),
          COALESCE((v_item->>'subtotal')::NUMERIC, 0),
          jsonb_build_object(
            'linea_codigo', v_item->>'linea_codigo',
            'ref_codigo',   v_item->>'ref_codigo',
            'color_nombre', v_item->>'color_nombre',
            'gradas_fmt',   v_item->>'gradas_fmt',
            'imagen_url',   v_item->>'imagen_url',
            'marca',        v_marca_txt,
            'caso',         v_caso_txt
          )
        );

        IF v_det_id IS NOT NULL AND v_pares > 0 THEN
          SELECT cantidad_pares, COALESCE(pares_vendidos, 0)
          INTO v_db_cantidad_pares, v_db_pares_vendidos
          FROM public.pedido_proveedor_detalle
          WHERE id = v_det_id;

          IF (v_db_pares_vendidos + v_pares) > v_db_cantidad_pares THEN
            RAISE EXCEPTION 'No hay suficiente stock para L% R% (Lote: %). Solicitado: % pares, Disponible: % pares.',
              v_item->>'linea_codigo',
              v_item->>'ref_codigo',
              v_pp_nro,
              v_pares,
              (v_db_cantidad_pares - v_db_pares_vendidos);
          END IF;

          UPDATE public.pedido_proveedor_detalle
          SET pares_vendidos = COALESCE(pares_vendidos, 0) + v_pares
          WHERE id = v_det_id;
        END IF;
      END LOOP;

      v_facturas_out := v_facturas_out || jsonb_build_object(
        'fi_id',       v_fi_id,
        'nro_factura', v_nro_fi,
        'pp_id',       v_pp_id,
        'pp_nro',      v_pp_nro,
        'marca',       v_marca_txt,
        'marca_id',    v_marca_id,
        'caso',        v_caso_txt,
        'caso_id',     v_caso_id,
        'total_pares', v_fi_pares,
        'total_monto', v_fi_monto
      );
      v_total_fi := v_total_fi + 1;
    END LOOP;
  END LOOP;

  RETURN jsonb_build_object(
    'success',         true,
    'pedido_id',       v_pedido_id,
    'nro_pedido',      v_nro_pedido,
    'total_facturas',  v_total_fi,
    'facturas',        v_facturas_out
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error',   SQLERRM,
    'detail',  SQLSTATE
  );
END;
$function$;

COMMENT ON FUNCTION public.confirmar_pedido_web IS
  'MIG-072: validación estructural de identidad (vendedor_id NOT NULL + rol VENDEDOR/ADMIN). ' ||
  'Resolución de caso_id desde caso_precio_biblioteca por nombre_caso. ' ||
  'Reemplaza al archivo huérfano mig_070_rpc_confirmar_pedido_web.sql.';
```

Aplicar en Supabase y validar:

```sql
SELECT pg_get_functiondef(oid)
FROM pg_proc WHERE proname = 'confirmar_pedido_web';
```

Debe contener:
- `IF p_vendedor_id IS NULL THEN`
- `fn_es_usuario_vendedor_o_admin`
- `FROM public.caso_precio_biblioteca`

### 4. Endurecer la tabla `pedido_venta_rimec` con `CHECK NOT NULL`

```sql
-- Inspección
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'pedido_venta_rimec'
  AND column_name IN ('cliente_id','vendedor_id','plazo_id','lista_precio_id');

-- Si vendedor_id permite null, agregar NOT NULL (después de sanear los registros existentes — paso 2)
ALTER TABLE public.pedido_venta_rimec
  ALTER COLUMN vendedor_id SET NOT NULL;

ALTER TABLE public.factura_interna
  ALTER COLUMN vendedor_id SET NOT NULL;
```

**NO ejecutar este paso 4 antes de completar el paso 2** (sanear PVR-2026-794967 y cualquier otro huérfano). Postgres rechaza el `SET NOT NULL` si hay filas con `NULL`.

### 5. Limpieza de migraciones sueltas

Eliminar de raíz de `Nexus_Core/`:
- `mig_070_rpc_confirmar_pedido_web.sql` — ya superado por MIG-072 de esta OT.
- Cualquier `mig_070_*.py` o `mig_070_*.sql` huérfano.

---

## Evidencia (completar al cerrar)

```
1. Pedidos con vendedor_id IS NULL: ____
   IDs: ______________________________

2. Facturas internas con vendedor_id IS NULL: ____
   IDs: ______________________________

3. Pedido PVR-2026-794967 reasignado a usuario_v2.id_usuario = ____
   Decisión del Director: [pegar o "pendiente"]
   COMMIT ejecutado: SÍ / NO

4. MIG-072 aplicada:  SÍ / NO
   pg_proc.confirmar_pedido_web contiene "IF p_vendedor_id IS NULL": SÍ / NO
   pg_proc.confirmar_pedido_web contiene "fn_es_usuario_vendedor_o_admin": SÍ / NO

5. NOT NULL aplicado en pedido_venta_rimec.vendedor_id: SÍ / NO
   NOT NULL aplicado en factura_interna.vendedor_id:    SÍ / NO

6. Limpieza de raíz Nexus_Core: archivos eliminados ____
```

---

## NO HACER

- ❌ No modificar `rimec-web/` — los fixes de frontend ya están desplegados.
- ❌ No asignar `vendedor_id` de pedidos huérfanos sin consultar al Director. NO improvisar identidades.
- ❌ No correr `ALTER COLUMN ... SET NOT NULL` antes de sanear los pedidos huérfanos.
- ❌ No reabrir OT-004 hasta cerrar esta. Esta es prioridad máxima por ser corrupción confirmada.

---

## Relación con OTs anteriores

- **OT-004 (Claude, EN CURSO sin evidencia)** — el Director pide que la **cerrés primero** con archivo `OT-PRECIOS-HUERFANOS-USUARIO-004-EVIDENCIA-CLAUDE.md` antes de arrancar esta OT-006. No se acepta cierre verbal.
- **OT-005 (Gemini, cerrada)** — desplegó los fixes UX de sesión vieja. No se reabre.
- **OT-007 (próxima, Cursor + Claude)** — arquitectura híbrida de carrito (localStorage + snapshot Supabase). Se abrirá después de cerrar esta OT-006. Esto blinda el flujo aún más, pero NO es prerequisito de OT-006.
