# OT-PRECIOS-HUERFANOS-USUARIO-004 — Investigar carrito huérfano de usuario en producción

**Prioridad:** ALTA — un vendedor reporta no poder operar
**Director:** Héctor Segovia
**Ejecutor:** **Claude Code** (Supabase + Streamlit/Nexus Core)
**Coordinador técnico:** Cursor
**Apertura:** 2026-05-22

---

## Contexto del incidente

Vendedor reporta literal:
> "Ayer comencé un pedido y no cerré mi sesión, dejé abierta para continuar hoy y al ingresar la sesión seguía abierta pero algunos botones y precios no estaban activos."

Captura adjunta muestra carrito persistido con **93 referencias / 856 pares** en `rimec-web.vercel.app`, donde varias tarjetas marcan **"Sin precio"** y el botón `+` queda desactivado.

### Causa probable confirmada por Cursor (frontend)

`store/sesionVenta.ts` persiste el carrito y `listaPrecioId` indefinidamente en `localStorage`. La vista `v_stock_rimec` se refresca cada 60 s desde Vercel. **Si entre ayer y hoy alguien en Nexus Core cambió el `precio_evento_id` del PP origen** de esos ítems (o cerró el evento), `v_stock_rimec.lpn` pasa a `NULL` y el frontend deja las tarjetas como "Sin precio" — correctamente, porque ya no hay precio asignado.

Cursor ya integró la capa de validación de cliente (banner de "sesión vieja", detector estructural de ítems huérfanos en carrito, bloqueo de checkout con motivo explícito). Esa capa es defensa en profundidad — no sustituye al saneamiento de DB que cubre esta OT.

---

## Tareas

### 1. Confirmar que MIG-071 está aplicada en producción

```sql
SELECT obj_description('public.v_stock_rimec'::regclass, 'pg_class') AS comentario;
```

Esperado: contiene la marca `MIG-071` o equivalente que indica que el evento se resuelve desde `intencion_compra_pedido`. Si no, aplicar:

```bash
cd C:\Users\hecto\Nexus_Core\control_central
python scripts/aplicar_vista_stock_cli.py
```

### 2. Identificar el universo de SKUs huérfanos (sin precio HOY)

```sql
WITH cobertura AS (
  SELECT
    COUNT(*)::int                                                AS total,
    COUNT(*) FILTER (WHERE lpn IS NOT NULL AND lpn > 0)::int     AS con_lpn,
    COUNT(*) FILTER (WHERE caso_id IS NOT NULL)::int             AS con_caso,
    COUNT(*) FILTER (WHERE cajas_disponibles > 0)::int           AS con_stock,
    COUNT(*) FILTER (WHERE cajas_disponibles > 0
                       AND (lpn IS NULL OR lpn <= 0))::int       AS con_stock_sin_precio
  FROM v_stock_rimec
)
SELECT * FROM cobertura;
```

**Criterio:** `con_stock_sin_precio` debería ser razonable (<10 % de `con_stock`). Si es mayor, hay degradación operativa.

### 3. Listar los PPs problemáticos

```sql
SELECT
  pp.id,
  pp.numero_registro AS pp_nro,
  pp.estado,
  pp.fecha_arribo_estimada::date AS eta,
  COUNT(DISTINCT vs.det_id) FILTER (WHERE vs.lpn IS NULL)             AS sku_sin_precio,
  COUNT(DISTINCT vs.det_id)                                            AS sku_total,
  ARRAY_AGG(DISTINCT icp.precio_evento_id) FILTER (WHERE icp.precio_evento_id IS NOT NULL) AS eventos_vigentes
FROM pedido_proveedor pp
JOIN v_stock_rimec vs ON vs.pp_id = pp.id
LEFT JOIN intencion_compra_pedido icp ON icp.pedido_proveedor_id = pp.id
WHERE pp.estado IN ('ABIERTO','ENVIADO')
GROUP BY pp.id, pp.numero_registro, pp.estado, pp.fecha_arribo_estimada
HAVING COUNT(DISTINCT vs.det_id) FILTER (WHERE vs.lpn IS NULL) > 0
ORDER BY sku_sin_precio DESC
LIMIT 50;
```

**Acción esperada:**
- Si un PP tiene `eventos_vigentes = {NULL}` → falta vincularlo en Streamlit (alguien debe ir al módulo de digitación y asignar `precio_evento_id`).
- Si tiene evento pero igual hay SKUs sin `pl.lpn` → el `precio_lista` de ese evento no incluye esos materiales (decisión de pricing).

Pegar los IDs de los PPs problemáticos en el reporte para que el Director decida si rehidratar o no.

### 4. Verificar el carrito del usuario que reportó

El vendedor que reportó es **HECTOR** (visible en la captura). Pedirle:
- Que vaya a `/carrito` en producción.
- Que abra la consola del navegador (F12).
- Que ejecute en consola: `JSON.parse(localStorage.getItem('rimec_sesion_venta')).state.carrito`.
- Le devuelve el listado de items con sus `det_id`.

Con esa lista, ejecutar:

```sql
SELECT det_id, descp_marca, linea_codigo, referencia_codigo, lpn, caso_id, descp_caso
FROM v_stock_rimec
WHERE det_id IN ( ... );
```

Confirma fila por fila cuáles SKUs perdieron precio.

### 5. Crear migración formal 072 del RPC (deuda pendiente)

**NOTA — esta tarea fue absorbida por OT-006.** El archivo huérfano `mig_070_rpc_confirmar_pedido_web.sql` que vivía en la raíz del repo (fuera del pipeline numerado) **fue eliminado por Cursor** el 2026-05-22 como parte del saneamiento. Su contenido se formaliza dentro de MIG-072 (`OT-VENDEDOR-NULL-CONTAMINACION-006-CLAUDE.md`) sumando validaciones estructurales que faltaban (vendedor NOT NULL + verificación de rol).

**Acción para esta OT-004:** ignorar este paso 5 y proceder solo con los pasos 1-4. La formalización del RPC la cubre OT-006.

---

## Evidencia (completar al cerrar)

```
1. obj_description v_stock_rimec: [texto]

2. Cobertura general:
   total: ___ , con_lpn: ___ , con_caso: ___,
   con_stock: ___, con_stock_sin_precio: ___ (___%)

3. PPs con SKUs huérfanos (primeros 10):
   [tabla]

4. Carrito del vendedor HECTOR:
   det_ids reportados: [lista]
   Con precio hoy: ___
   Sin precio hoy: ___
   Acción tomada en Streamlit (vincular evento / esperar al Director): ___

5. MIG-072 aplicada: SÍ / NO
   pg_proc.confirmar_pedido_web contiene caso_precio_biblioteca: SÍ / NO

6. Recomendación final al Director:
   [bullets: qué PPs reasignar, qué evento crear/cerrar, prioridad]
```

---

## NO HACER

- ❌ No tocar `rimec-web/` (lo está manejando Cursor + Gemini).
- ❌ No vincular `precio_evento_id` a PPs huérfanos sin autorización explícita del Director — esa es decisión comercial.
- ❌ No alterar registros del carrito del usuario directamente en DB. El usuario los va a limpiar desde la UI ahora que se agregó el botón "Quitar ítems sin precio".
