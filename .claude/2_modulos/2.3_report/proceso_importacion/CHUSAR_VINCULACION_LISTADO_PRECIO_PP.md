# CHUSAR — Vinculación listado precios ↔ PP (Motor Report)

**Código:** **2.3.1.7.5.3.2** · **Actualizado:** 2026-07-24 (MIG-177 certificación · Documentación Chusar)  
**Sub-bloque de:** [CHUSAR_PP_TAB_STOCK.md](./CHUSAR_PP_TAB_STOCK.md)  
**Certificación:** [CHUSAR_CERTIFICACION_PRECIOS_CP_RIMEC.md](./CHUSAR_CERTIFICACION_PRECIOS_CP_RIMEC.md) (**2.3.1.7.5.3.8**)  
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

## Prod Vercel (2026-07-14)

**Error resuelto:** `4.02.03.012` · commit report `7b7d5d7`  
Doc consolidado: [CHUSAR_HOTFIX_REPORT_PP14_20260714.md](./CHUSAR_HOTFIX_REPORT_PP14_20260714.md)

En Vercel, `vincular-listado` con `recalcular_fi=true` invoca **`recalcularFisPp`** (TS). Sin esto, PPD actualizaba pero FI quedaba congelada.

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
| 7 | Propagación precios Web/FI tras vincular | ✅ Rescate 2026-07-23 · error `4.02.03.022` · audit `_audit_cp_pp_precios_drift.mjs` |

---

## Control interno — certificación integridad (OBLIGATORIO)

**Doc canónico:** [CHUSAR_CERTIFICACION_PRECIOS_CP_RIMEC.md](./CHUSAR_CERTIFICACION_PRECIOS_CP_RIMEC.md) (**2.3.1.7.5.3.8**) · MIG-176 · MIG-177 · **MIG-180 (8 gates)** · [CHUSAR_PRECIO_ENTERPRISE…](../motor_precios/CHUSAR_PRECIO_ENTERPRISE_ARQUITECTURA_BANCARIA.md) (**2.3.1.7.1.0.3**)  
**Error:** `4.02.03.022` · rescate 2026-07-23 · certificación 2026-07-24

**Doctrina:** unidad de **mando** (Motor/listado) vs unidad de **dirección** (PPD vinculado). Web/FI/carrito = **solo PPD**. Cambio listado → re-vincular → certificar.

```powershell
cd C:\Users\hecto\Nexus_Core\report
npm run certificar:precios-cp:sync    # exit 0 = CERTIFICADO OK
```

| FAIL | Acción |
|------|--------|
| G3 listado drift | Re-vincular **Todos!!!** o `sincronizar_precios_vinculados_cp` |
| G4 FI ≠ PPD | `_recalc_fi_pp.mjs` |
| G5 carrito | incluido en `--sync` |

**Audit legacy (paridad):** `npm run audit:precios-cp` · `_audit_cp_pp_precios_drift.mjs`

**Frecuencia:** diaria (etapa CP) → semanal × **4 PASS** consecutivos.

**Gate post-vincular API (2026-07-25):** orden **vincular → recalc FI → fix G5 carrito → cert 8 gates** · **422** si FAIL · rutas:

- `POST …/pedido-proveedor/[ppId]/vincular-listado`
- `GET|POST …/pedido-proveedor/certificar-precios`
- Runbook: `node scripts/runbook-precios-enterprise.mjs [--skip-mig]`

---

## Control interno — drift PPD vs listado (legacy audit)

## Validación

1. PP ABIERTO · modo tránsito → vendidas no cambian LP  
2. PP ABIERTO · modo Todos → PPD vendidas + FI actualizan LPN  
3. PP ENVIADO → blocked  
4. Evento sin filas en `precio_lista` → `filas_sin_match` / warning

---

**Shibboleth:** Andrés, el que viene.
