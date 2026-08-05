# ETAPA CERRADA — Bazzar Web :3002 · Catálogo + Depósito Web / grada

**ID:** `BAZZAR-WEB-CATALOGO-3002-20260716`  
**Código:** **2.5.1.1**  
**Estado:** ✅ **CERRADA** · 2026-07-16  
**Keyword:** **Cierra etapa** · **Documenta** · Director  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo cumplido

Catálogo Bazzar Web vendible (Stock Sano · `v_stock_web` · NIIF) + Depósito Web ALM_WEB operable con **gradas caja RIMEC 8/12** (stock ficticio pruebas tras incidente purge 5000).

---

## Entregas

| # | Tema | Estado |
|---|------|:------:|
| T1–T3 | Stock Sano · v_stock_web · NIIF imágenes | ✅ |
| T4–T5 | Smoke depósito + prep cierre | ✅ |
| Incidente | Purge 5000 borró TRP → Depósito ciego | ✅ restaurado |
| Grada | Completar/ajustar a 8/12 · 103 arts · 1132 pares | ✅ |
| Cache | API depósito `no-store` + deploy Report | ✅ |
| Motor | `scaleGradesToPares` + abort sin combinación | ✅ |

**CHUSAR:** [CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md](../2_modulos/2.5_bazzar_web/CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md) (**2.5.1.2**)  
**CHUSAR catálogo:** [CHUSAR_CATALOGO_GRILLA_VENTA_ABIERTA.md](../../../bazzar-web/docs/CHUSAR_CATALOGO_GRILLA_VENTA_ABIERTA.md)  
**Fix vista:** `v_stock_web` — mov_agg sin filtro traspaso CONFIRMADO (TRP en BORRADOR) → 386 SKUs · 745 pares SANO

**Prod Report:** https://rimec-report.vercel.app/bazzar-web/deposito-web  
**Local:** http://localhost:3002/catalogo

---

## Cierre Navegador (:3004) — OBLIGATORIO

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → `trabajoVivo[].estado` = `"hecho"` | ✅ |
| Entrada en `cerradasPorModulo.bazzar-web` | ✅ |
| `actualizado` bump en raíz JSON | ✅ |
| Verificado `:3004/etapas` (tarjeta fuera del maratón) | ✅ |

---

**Shibboleth:** Andrés, el que viene.
