# OT-CARRITO-HIBRIDO-SUPABASE-007 — Persistencia híbrida del carrito (localStorage + snapshot Supabase)

**Prioridad:** MEDIA-ALTA — eleva la robustez del flujo de venta
**Director:** Héctor Segovia
**Ejecutor principal:** **Cursor** (frontend + diseño de tabla)
**Ejecutor secundario:** **Claude** (migración SQL + RLS + RPC)
**Apertura:** 2026-05-22
**Pre-requisito:** OT-006 cerrada (RPC blindado contra vendedor null)

---

## Por qué esta OT existe

El incidente reciente (PVR-2026-794967 con `vendedor_id = NULL`) reveló que la persistencia del carrito **solo en `localStorage`** tiene 3 limitaciones críticas:

1. **No es portable**: el vendedor empieza en una compu y no puede continuar en otra.
2. **No es auditable**: si algo se contamina (como pasó), no podemos saber cuándo ni quién lo modificó.
3. **No es supervisable**: el Director no tiene forma de ver qué están armando los vendedores en tiempo real.

La solución NO es mover el carrito **entero** a Supabase (perdería latencia y modo offline), sino una **arquitectura híbrida**: el `localStorage` sigue siendo la fuente de verdad para la edición rápida, y un **snapshot periódico** sincroniza a Supabase para portabilidad y auditoría.

---

## Decisiones de diseño

### 1. Tabla `pedido_borrador`

```sql
CREATE TABLE public.pedido_borrador (
  id              bigserial PRIMARY KEY,
  vendedor_id     bigint NOT NULL REFERENCES public.usuario_v2(id_usuario),
  cliente_id      bigint REFERENCES public.cliente_v2(id_cliente),
  plazo_id        bigint REFERENCES public.plazo_v2(id_plazo),
  lista_precio_id integer NOT NULL DEFAULT 1 CHECK (lista_precio_id BETWEEN 1 AND 4),
  descuentos_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  descuentos_por_lote_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  carrito_json    jsonb NOT NULL DEFAULT '{}'::jsonb,
  activado_at     timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  -- Solo puede haber un borrador activo por vendedor a la vez:
  CONSTRAINT pedido_borrador_uniq_vendedor UNIQUE (vendedor_id)
);

CREATE INDEX idx_pedido_borrador_updated_at ON public.pedido_borrador(updated_at DESC);

COMMENT ON TABLE public.pedido_borrador IS
  'OT-007: snapshot del carrito armado por un vendedor antes de confirmar.
   localStorage es la fuente activa; esta tabla recibe snapshots periódicos
   para portabilidad cross-device, recuperación tras crash y auditoría.';
```

### 2. RLS

```sql
ALTER TABLE public.pedido_borrador ENABLE ROW LEVEL SECURITY;

-- Bloquear escritura para anon
CREATE POLICY pol_pb_anon_no_write ON public.pedido_borrador
  AS RESTRICTIVE FOR ALL TO anon USING (false) WITH CHECK (false);

-- Lectura permitida solo del propio borrador (autenticado en Streamlit)
CREATE POLICY pol_pb_self_read ON public.pedido_borrador
  FOR SELECT TO authenticated
  USING (true);  -- Refinar si se incorpora JWT con claim de id_usuario en rimec-web

-- Service role: bypass total para upserts del backend de rimec-web
-- (rimec-web API route corre con service_role; controla acceso por sesión cookie)
```

### 3. RPCs

```sql
-- Upsert del borrador del vendedor actual
CREATE OR REPLACE FUNCTION public.guardar_borrador_pedido(
  p_vendedor_id     bigint,
  p_cliente_id      bigint,
  p_plazo_id        bigint,
  p_lista_precio_id integer,
  p_descuentos      jsonb,
  p_descuentos_lote jsonb,
  p_carrito         jsonb,
  p_activado_at     timestamptz
) RETURNS bigint
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE v_id bigint;
BEGIN
  IF p_vendedor_id IS NULL OR NOT fn_es_usuario_vendedor_o_admin(p_vendedor_id) THEN
    RAISE EXCEPTION 'vendedor_id inválido o sin rol VENDEDOR/ADMIN';
  END IF;

  INSERT INTO public.pedido_borrador (
    vendedor_id, cliente_id, plazo_id, lista_precio_id,
    descuentos_json, descuentos_por_lote_json, carrito_json,
    activado_at, updated_at
  ) VALUES (
    p_vendedor_id, p_cliente_id, p_plazo_id, p_lista_precio_id,
    p_descuentos, p_descuentos_lote, p_carrito,
    p_activado_at, now()
  )
  ON CONFLICT (vendedor_id) DO UPDATE SET
    cliente_id              = EXCLUDED.cliente_id,
    plazo_id                = EXCLUDED.plazo_id,
    lista_precio_id         = EXCLUDED.lista_precio_id,
    descuentos_json         = EXCLUDED.descuentos_json,
    descuentos_por_lote_json= EXCLUDED.descuentos_por_lote_json,
    carrito_json            = EXCLUDED.carrito_json,
    activado_at             = EXCLUDED.activado_at,
    updated_at              = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Leer el borrador del vendedor (al rehidratar la app)
CREATE OR REPLACE FUNCTION public.leer_borrador_pedido(p_vendedor_id bigint)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE v_data jsonb;
BEGIN
  SELECT jsonb_build_object(
    'cliente_id',      cliente_id,
    'plazo_id',        plazo_id,
    'lista_precio_id', lista_precio_id,
    'descuentos',      descuentos_json,
    'descuentos_lote', descuentos_por_lote_json,
    'carrito',         carrito_json,
    'activado_at',     activado_at,
    'updated_at',      updated_at
  ) INTO v_data
  FROM public.pedido_borrador
  WHERE vendedor_id = p_vendedor_id;

  RETURN v_data; -- NULL si no hay borrador
END;
$$;

-- Borrar el borrador (al confirmar pedido o al cerrar venta)
CREATE OR REPLACE FUNCTION public.borrar_borrador_pedido(p_vendedor_id bigint)
RETURNS void
LANGUAGE sql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  DELETE FROM public.pedido_borrador WHERE vendedor_id = p_vendedor_id;
$$;
```

### 4. Frontend (rimec-web)

#### a) Nuevo API route `app/api/borrador/route.ts`

- `POST` recibe el snapshot del carrito y llama a `guardar_borrador_pedido` via service_role.
- `GET` devuelve el borrador del vendedor logueado (`session.id_usuario` del JWT).
- `DELETE` borra el borrador.

#### b) Debounce en el store

En `store/sesionVenta.ts`, después de cualquier `set(...)`, schedule un snapshot debounced:

```ts
function syncSnapshot() {
  const state = useSesion.getState()
  if (!state.activa || !state.vendedor?.id_vendedor) return
  fetch('/api/borrador', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vendedor_id:     state.vendedor.id_vendedor,
      cliente_id:      state.cliente?.id_cliente ?? null,
      plazo_id:        state.plazo?.id_plazo ?? null,
      lista_precio_id: state.listaPrecioId,
      descuentos:      state.descuentos,
      descuentos_lote: state.descuentosPorLote,
      carrito:         state.carrito,
      activado_at:     state.activatedAt,
    }),
  }).catch(err => console.warn('[borrador] sync falló (no bloqueante):', err))
}

// Llamar syncSnapshot() con debounce de 2-3s tras cada set() significativo.
```

**Importante**: el snapshot **NO bloquea** la UI. Si falla, queda solo en localStorage. La UX no se degrada.

#### c) Restauración al login

Cuando el usuario hace login, el dashboard ahora chequea:

1. ¿Hay borrador en Supabase con `updated_at` más reciente que el `localStorage`?
2. Si sí, mostrar modal:
   > "Tenés un carrito abierto del [fecha/hora]
   > con [N ítems] para el cliente [X].
   > [Continuar borrador] [Iniciar venta nueva]"

#### d) Borrado al confirmar

Después de un `confirmar_pedido_web` exitoso, llamar a `DELETE /api/borrador` para limpiar el snapshot.

---

## Plan de ejecución (orden de pasos)

### Fase 1 — DB (Claude)
1. Aplicar migración `073_pedido_borrador_tabla_rls_rpc.sql` con el esquema completo de arriba.
2. Verificar RLS + RPCs con consultas de control.
3. Reportar evidencia.

### Fase 2 — Backend rimec-web (Cursor)
1. Crear `app/api/borrador/route.ts` con GET/POST/DELETE.
2. Modificar `store/sesionVenta.ts` para snapshot debounced.
3. Modificar `DialogoActivacion.tsx` para detectar borrador y ofrecer "continuar".
4. Modificar `app/carrito/page.tsx` para borrar el borrador al confirmar.

### Fase 3 — Deploy (Gemini)
1. `npm run build` + commit + push + `vercel --prod`.
2. Smoke test cross-device:
   - Armar carrito en pestaña A.
   - Cerrar pestaña.
   - Abrir nueva ventana, loguearse → debería ofrecer "continuar borrador".
3. Cierre formal.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Conflictos cuando 2 dispositivos editan a la vez | `UNIQUE (vendedor_id)` + `ON CONFLICT DO UPDATE` con merge por `updated_at`. Si timestamps colisionan, gana el último. UI muestra advertencia "tu carrito fue modificado en otro dispositivo, refrescar" via storage event. |
| Costo en writes Supabase | Debounce 2-3s + solo sincronizar cambios significativos (no cada `+/-` de cajas). Estimado: ~50 writes/vendedor/día → 5000/día con 100 vendedores → muy por debajo del límite. |
| Latencia en el snapshot bloquea UI | El snapshot es fire-and-forget. Si falla, queda en localStorage. Cero degradación UX. |
| Borrador queda huérfano si vendedor cambia de cliente | `borrar_borrador_pedido()` al "Cerrar venta". Cron mensual opcional para purgar borradores con `updated_at < now() - interval '30 days'`. |

---

## Evidencia (completar al cerrar)

```
Fase 1 - DB:
  [ ] MIG-073 aplicada
  [ ] Tabla pedido_borrador creada con UNIQUE (vendedor_id)
  [ ] RLS habilitado, anon bloqueado
  [ ] RPCs guardar/leer/borrar funcionan (test manual)

Fase 2 - Backend:
  [ ] app/api/borrador/route.ts implementado
  [ ] Snapshot debounced en store
  [ ] DialogoActivacion ofrece "Continuar borrador" si existe
  [ ] confirmar_pedido_web borra el borrador al éxito

Fase 3 - Deploy:
  [ ] Commit hash: ____
  [ ] Vercel URL: ____
  [ ] Smoke test cross-device pasó
  [ ] OT movida a ot/cerradas/
```

---

## NO HACER

- ❌ NO migrar el carrito **fuera** de localStorage. localStorage sigue siendo la fuente activa.
- ❌ NO sincronizar en cada cambio. Solo debounced cada 2-3s o tras cambios significativos.
- ❌ NO bloquear la UI si el snapshot a Supabase falla. Es fire-and-forget.
- ❌ NO arrancar esta OT antes de cerrar OT-006 (el RPC necesita estar blindado primero).
