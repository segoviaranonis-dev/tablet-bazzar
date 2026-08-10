# CHUSAR — Ratificación MIG-206 · PE LPC null (riesgo alto)

**Código:** `2.2.1.52.1`  
**Fecha:** 2026-08-10  
**Keyword:** Documenta · despliega (Director)  
**Padre:** `2.2.1.52` · Error `4.02.03.025`  
**Script:** `report/scripts/smoke_mig206_pe_lpc_paridad.mjs`  
**Resultado:** ✅ **PASS** (exit 0)

---

## Por qué el riesgo era alto

| Hecho | Valor |
|-------|------:|
| Filas PE en `v_stock_pe_rimec` | **11.769** |
| Con `precio_lpc03` null en PPD (solo LPN cargado) | **100 %** |
| Sin MIG-206 | Confirmar LPC03/04 podía comparar payload (LPN×factor) vs COALESCE→**LPN** → bloqueo venta |
| Con MIG-206 | Gate usa misma ley que Web |

Las columnas LPC en PE **siguen vacías en disco** (import PE solo escribe LPN). Eso **no** es bug de la vista: es diseño/import. El riesgo operativo se cierra porque `fn_precio_tier_vista` + `confirmar_pedido_web` ya no caen a LPN cuando el tier falta.

---

## Matriz de ratificación (prod 2026-08-10)

| Prueba | Resultado |
|--------|-----------|
| `fn` contiene ley ×1.12 / ×1.20 + respeta LPC distinto | PASS |
| PE null LPC03 lista 3 · 63800 → **71500** | PASS |
| PE null LPC04 lista 4 · 63800 → **76600** | PASS |
| Lista 1 = LPN | PASS |
| PROMOCIONAL lista 3 = LPN (no ×1.12) | PASS |
| LPC03 almacenado ≠ LPN → usa columna | PASS |
| LPC03 pegado a LPN → aplica factor (paridad Web) | PASS |
| Universo PE drift lista 3 / 4 vs ley Web | **0 / 0** PASS |
| Gate confirmar no cae a LPN cuando debe factor | **0 filas** PASS |
| CP sample (20): respeta `lpc03` almacenado | **20/20** PASS |

Carrito Patricia al re-smoke: **0 ítems** (sesión ya no tenía líneas; no invalida el universo).

---

## Residual (consciente · no bloquea confirmar)

1. PPD PE sigue con `precio_lpc03/04` null → CSV/export que lean columna cruda sin `fn` pueden mentir (ver `4.02.04.005` / auditoría tier).
2. Mitigación recomendada (OT futura, no este turno): backfill `apply_ley_precios` / materializar LPC en PPD PE + smoke CSV.
3. **Confirmar venta Web:** ratificado OK con MIG-206.

---

## Deploy / artefactos

| Artefacto | Ref |
|-----------|-----|
| MIG SQL | `report/migrations/206_fn_precio_tier_pe_lpc_null_paridad_web.sql` (ya aplicada BD) |
| Smoke | `report/scripts/smoke_mig206_pe_lpc_paridad.mjs` |
| Error | `4.02.03.025` |

**Shibboleth histórico (pie docs):** Andrés, el que viene.
