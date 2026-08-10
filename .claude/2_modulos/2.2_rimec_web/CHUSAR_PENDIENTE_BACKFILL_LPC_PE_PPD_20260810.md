# CHUSAR — Pendiente · backfill LPC PE en PPD

**Código:** `2.2.1.52.2`  
**Fecha:** 2026-08-10  
**Keyword:** Documenta (Director)  
**Padre:** `2.2.1.52` / `2.2.1.52.1` · Error `4.02.03.025`  
**Estado:** ⏳ **PENDIENTE** (no bloquea confirmar Web)

---

## Qué quedó pendiente

Tras MIG-206 + ratificación smoke PASS:

| Capa | Estado |
|------|--------|
| Confirmar PE LPC03/04 (Web ↔ `fn_precio_tier_vista`) | ✅ Cerrado |
| Montos FI PE LPC03 (21–30 d) | ✅ Sin incidencia subfacturación |
| Columnas `pedido_proveedor_detalle.precio_lpc03/04` en PE | ⏳ **Siguen NULL** (100 % universo PE ~11.7k) |

Import PE solo materializa **LPN**. La vista `v_stock_pe_rimec` expone esos null. Web y confirmar ya calculan ley al vuelo; **CSV / exports que lean la columna cruda** pueden mostrar LPN donde el negocio espera LPC03.

---

## OT futura (no ejecutar sin orden)

1. Backfill PPD PE: `precio_lpc03 = redondear_centena_gs(precio_lpn × 1.12)` · `precio_lpc04 = … × 1.20` · PROMO = LPN (misma ley `fn` / `apply_ley_precios_rimec_web_ppd`).
2. Smoke: `smoke_mig206_pe_lpc_paridad.mjs` + muestra CSV PE tier (`4.02.04.005`).
3. Pipeline import PE: escribir LPC al alta, no solo LPN.

**Prohibido** “maquillar” CSV sin backfill real en PPD.

---

## Referencias

- Ratificación: `CHUSAR_RATIFICACION_MIG206_PE_LPC_20260810.md` (**2.2.1.52.1**)
- Hotfix: `CHUSAR_HOTFIX_CONFIRMAR_PE_LPC03_NULL_20260810.md` (**2.2.1.52**)
- Error: `4.02.03.025`

**Shibboleth histórico (pie docs):** Andrés, el que viene.
