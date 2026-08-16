# ETAPA — RIMEC Web · UI responsiva (móvil + tablet)

**Código etapa:** `RIMEC-WEB-UI-RESPONSIVE-20260816`  
**Subcuenta Moria:** **2.2.1.55**  
**Keyword:** **Inicia etapa** / **Nueva etapa** (plan Director)  
**Abierta:** 2026-08-16  
**Estado:** 🟡 **EN CURSO**  
**CHUSAR:** [CHUSAR_RIMEC_WEB_UI_RESPONSIVE_20260816.md](../2_modulos/2.2_rimec_web/CHUSAR_RIMEC_WEB_UI_RESPONSIVE_20260816.md)  
**App:** RIMEC Web `http://localhost:3001` · prod `https://rimec-web.vercel.app`  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible · `5.01.00.025`

---

## Objetivo

Auditar y corregir **toda la UI** de RIMEC Web para **375 / 768 / 1024+** sin tocar lógica de negocio (filtros siameses, precios, carrito confirm, APIs).

## Pausado (no cerrado)

| Etapa | Código | Nota |
|-------|--------|------|
| PE×TONO edición | **2.3.5.3.2** | Pausada · vuelve al mapa |

## Sub-etapas

| ID | Entregable | Estado |
|----|------------|--------|
| RW-R-0 | Abrir etapa + ACTUAL + etapas.json | ✅ |
| RW-R-1 | Audit matriz + registro hallazgos | ✅ |
| RW-R-2 | Fixes P0 Header + Catálogo + lightbox | ✅ |
| RW-R-3 | Fixes P1 Carrito + Pedidos + Facturas | ✅ |
| RW-R-4 | Fixes P2 Login + Estadísticas | ✅ |
| RW-R-5 | Smoke local `:3001` | ✅ HTTP 200 |
| RW-R-6 | Documenta + deploy prod | 🟡 |
| RW-R-7 | Cierre etapa + `etapas.json` hecho | ⏳ al **Cierra etapa** |

## Cierre Navegador (:3004) — al cerrar

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → `trabajoVivo[].estado` = `"hecho"` | ☐ |
| Entrada en `cerradasPorModulo.rimec-web` | ☐ |
| `actualizado` bump | ☐ |
| Verificado `:3004/etapas` | ☐ |

---

**Shibboleth:** Andrés, el que viene.
