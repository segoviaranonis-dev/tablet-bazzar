# CHUSAR — Vinculación listado precios ↔ PP (Motor Report)

**Código:** **2.3.1.7.5.3.2** · **Actualizado:** 2026-07-14 (MIG-150 · dos modos)  
**Sub-bloque de:** [CHUSAR_PP_TAB_STOCK.md](./CHUSAR_PP_TAB_STOCK.md)  
**UI Report:** `PpTabStock.tsx` · panel Listado de precios RIMEC  
**Logic:** `logic.py` → `vincular_listado_precio_a_pp` · `recalcular_facturas_internas_pp`  
**SQL:** `vincular_listado_a_pp(pp, evento, uid, p_incluir_vendidos)` · MIG-150  
**Migración:** `control_central/migrations/150_vincular_listado_incluir_vendidos.sql` (+ copia `report/migrations/`)

---

## Qué es

Un PP importador lleva **un** `precio_evento_id` (listado cerrado). Se puede **cambiar** mientras el PP esté `ABIERTO` (no `ENVIADO`). El snapshot escribe LPN/LPC en **`pedido_proveedor_detalle`** y, si se pide, recalcula FI.

Caso de negocio 2026-07-13: listado equivocado cargado por usuarios → nuevo evento → corregir precios **incluso en filas 100 % vendidas** mientras la mercadería no llegó al país.

---

## Dos modos (UI — únicos botones de confirmación)

Tras **🔗 Vincular al PP** (elige evento):

| Botón | `incluir_vendidos` | Efecto |
|-------|:------------------:|--------|
| **Actualizar precios solo tránsito** | `false` | Solo PPD con saldo > 0 (MIG-139 legacy) |
| **Actualizar precios de venta Todos!!!** | `true` | **Todas** las filas PPD con match LPN (incl. 100 % vendidas) + FI según checks |

Checks (siguen):

- Al vincular, recalcular FI RESERVADA (default sí)
- Incluir también FI CONFIRMADA (avanzado)

PP `ENVIADO` → listado congelado (banner rojo).

---

## Flujo técnico

1. Validar `pp_listado_precio_editable` / estado `ABIERTO`
2. `guardar_configuracion_pp` / UPDATE ICP + IC → `precio_evento_id`
3. SQL `vincular_listado_a_pp(pp_id, evento_id, uid, incluir_vendidos)`
4. Opcional Python: `recalcular_facturas_internas_pp(..., incluir_vendidos=…)` — no congela LP si Todos
5. Respuesta: `actualizados`, `filas_congeladas_venta` (modo tránsito) o `filas_vendidas_forzadas` (modo Todos)

### Capas

| Capa | Archivo / ruta |
|------|----------------|
| SQL | MIG-150 · firma 4 args |
| Python | `modules/pedido_proveedor/logic.py` · CLI `scripts/report_vincular_listado_pp.py --incluir-vendidos` |
| API | `POST …/vincular-listado` body `{ evento_id, recalcular_fi, incluir_confirmadas, incluir_vendidos }` |
| API FI | `POST …/recalcular-fi` body `{ incluir_confirmadas, incluir_vendidos }` |
| TS mirror | `stock-listado.ts` → `vincularListadoAPp` + **`recalcular-fis-pp.ts`** → `recalcularFisPp` (Vercel) |
| Bridge | `run-python-listado.ts` flag `--incluir-vendidos` |

---

## Bloqueo Compra Legal

```python
pp_listado_precio_editable(pp_id)  # False si estado == ENVIADO
```

SQL también exige `ABIERTO` para re-snapshot.

---

## Pendiente operativo (handoff 2026-07-14)

| # | Ítem | Estado |
|---|------|--------|
| 1 | Código + MIG-150 en BD (firma 4 args verificada) | ✅ |
| 2 | UI dos botones en Report local | ✅ |
| 3 | Smoke real: Vincular → **Todos!!!** en PP ABIERTO con ventas | ✅ PP14 2026-07-14 |
| 4 | **Deploy Report** (commit/push/Vercel) | ✅ 2026-07-14 hotfix recalc FI |
| 5 | Paridad Streamlit `_render_listado_precio_pp` dos botones | ⏳ si Director lo pide |
| 6 | Botón UI «Recalcular FI» con dos modos (API ya acepta flag) | ✅ API TS prod |
| 7 | Propagación precios en ventas Web ya emitidas (si aplica) | ⏳ evaluar por caso |

---

## Validación

1. PP ABIERTO · modo tránsito → vendidas no cambian LP  
2. PP ABIERTO · modo Todos → PPD vendidas + FI actualizan LPN  
3. PP ENVIADO → blocked  
4. Evento sin filas en `precio_lista` → `filas_sin_match` / warning

---

**Shibboleth:** Andrés, el que viene.
