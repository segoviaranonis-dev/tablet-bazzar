# ETAPA — Deploy descuentos FI · liquidación PE · casos PP/PC/PE

**Código:** `DEPLOY-DESCUENTOS-LIQ-CASOS-20260716`  
**Fecha:** 2026-07-16  
**Tipo:** Deploy prod (orden directa Director — **no** etapa maratón en `:3004`)  
**Estado:** ✅ **DESPLEGADO**

---

## Objetivo

Llevar a producción el estado actual de:

1. **RIMEC Web** — descuentos por FI (modal Guardar descuento · MIG-160) · badge liquidación PE · casos/promo en catálogo y carrito CP/PE.
2. **Report** — Aprobaciones lee mismos % y neto floor · cabecera FI con caso desde PP/PC/PE.
3. **BD** — MIG-160 reaplicada · `es_liquidacion` PE operativo.

---

## Entregables

| Capa | Evidencia |
|------|-----------|
| Moria | [CHUSAR_DEPLOY_DESCUENTOS_LIQUIDACION_CASOS_20260716.md](../2_modulos/2.2_rimec_web/CHUSAR_DEPLOY_DESCUENTOS_LIQUIDACION_CASOS_20260716.md) **2.2.4.0.13** |
| BD | `scripts/aplicar_migracion_160.mjs` · smoke neto 85500 |
| Build | rimec-web + report `npm run build` OK |
| Prod | push `main` → Vercel |

---

## Smoke Director

1. https://rimec-web.vercel.app — PE con badge Liq. · carrito Guardar descuento FI.
2. https://rimec-report.vercel.app/aprobaciones — CASO + D1–D4 coherentes con Web.

**Shibboleth:** Andrés, el que viene.
