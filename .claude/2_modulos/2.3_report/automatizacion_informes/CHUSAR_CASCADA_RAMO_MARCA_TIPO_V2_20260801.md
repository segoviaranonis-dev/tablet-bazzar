# 2.3.1.35.3 — Cascada ramo → marca / AB-CR / listados (tipo_v2)

**Código:** **2.3.1.35.3**  
**Fecha:** 2026-08-01 · **Documenta**  
**Error:** [4.02.05.001](../../../5_errores/detalle/4.02.05.001_report-auto-informes-marcas-sin-cascada-ramo.md)  
**Etapa:** [ETAPA_INFORMES_AUTO_Y_MENSAJES…](../../../4_etapas/ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801.md)  
**Shibboleth:** Andrés, el que viene.

---

## Ley

En **Control de Pronta Entrega**, la Categoría (CALZADO / CONFECCIONES) es padre de cascada:

| Ramo UI | tipo_v2_id | Proveedor listados |
|---------|------------|--------------------|
| CALZADO | 1 | 654 |
| CONFECCIONES | 2 | 638 |

Marcas, AB-CR y listados de precios **solo** del subconjunto de ese ramo.

Extiende el espíritu de **hermanos siameses** (cascada filtros Web/AM) al panel de automatización — no basta pintar chips DPE si el índice de marcas es global.

---

## API

`GET /api/automatizacion-informes/meta-filtros?ramo=CALZADO|CONFECCIONES`
