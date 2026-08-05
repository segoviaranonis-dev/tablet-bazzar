# Pendiente documentado — Tablet 2.4 + Report 2.3 · 2026-07-03

**Keyword Director:** Documenta · **Etapa:** ETAPA-PRUEBA-FINAL-IC-MARATON-20260703  
**Puertos dev:** Report `:3001` · Tablet `:3002` · Navegador `:3004`

---

## Report 2.3 — Mudanza IC · DG · PP (2.3.1.7.3–7.5)

### ✅ Documentado e implementado (2026-07-03)

| Ítem | Código | Doc |
|------|--------|-----|
| Cabecera PP editable (Categoría, Creador, proforma, notas) | 2.3.1.7.5 | [CHUSAR_PP_CABECERA_EDITABLE.md](./2.3_report/proceso_importacion/CHUSAR_PP_CABECERA_EDITABLE.md) |
| ICs vinculadas editables + desasignar | 2.3.1.7.5.3 | idem + API `ic/[icId]` |
| Tab Stock Fase 1 (§1 comercial, §2 descuentos, listado RIMEC) | 2.3.1.7.5.3.1 | [CHUSAR_PP_TAB_STOCK.md](./2.3_report/proceso_importacion/CHUSAR_PP_TAB_STOCK.md) |
| FECHA DE EMBARQUE = dato duro `quincena_arribo_id` (1–24) | 2.3.1.7.5.3.1 | idem · tabla `quincena_arribo` |
| Vincular listado Motor al PP | 2.3.1.7.5.3.2 | [CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md](./2.3_report/proceso_importacion/CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md) |
| Inventario paridad Streamlit→Report | — | [MUDANZA_PP_DETALLE_INVENTARIO.md](../../report/docs/MUDANZA_PP_DETALLE_INVENTARIO.md) |
| Hotfix marcas IC `/nueva` | 2.3.1.7.3.2 | [ETAPA_PRUEBA_FINAL_IC_MARATON_20260703.md](../4_etapas/ETAPA_PRUEBA_FINAL_IC_MARATON_20260703.md) § Hotfix #1 |
| Dev Report + `.next` corrupto | — | [COMO_EJECUTAR_REPORT.md](../../report/docs/COMO_EJECUTAR_REPORT.md) |

### 🔴 Report — código pendiente (doc alineada)

| Fase | Entrega | Doc destino |
|------|---------|-------------|
| **2** | Ala Norte acordeón marca · columnas `grades_json` · precios stock | [MAPA_ALA_NORTE_STOCK_PP.md](./2.3_report/proceso_importacion/MAPA_ALA_NORTE_STOCK_PP.md) · [MAPA_PRECIOS_STOCK_PP.md](./2.3_report/proceso_importacion/MAPA_PRECIOS_STOCK_PP.md) |
| **3** | Recalc FI · borrar/reimportar · CSV ventas API | CHUSAR_PP_TAB_STOCK § APIs |
| **4** | Upload proforma Excel (`parse_proforma` + `populate_pp_from_proforma`) | CHUSAR_PP_TAB_STOCK § C4 |
| **FI tab** | `render_fi_card` · crear FI 2 fases | [CHUSAR_PEDIDO_PROVEEDOR.md](./2.3_report/proceso_importacion/CHUSAR_PEDIDO_PROVEEDOR.md) |
| **Smoke maratón** | COMPRA PREVIA + PROGRAMADO end-to-end | [ETAPA_PRUEBA_FINAL_IC_MARATON_20260703.md](../4_etapas/ETAPA_PRUEBA_FINAL_IC_MARATON_20260703.md) checklist |

### ⚠️ Report — operación conocida

- **No** correr `npm run build` con `next dev` activo en `:3001` (corrompe `.next`).
- Join biblioteca en PP: `precio_evento.biblioteca_precio_id` → `biblioteca_precio.nombre` (no `biblioteca_id`).

---

## Tablet 2.4 — Depósito · CABECERA · Bóveda

### ✅ Documentado (código implementado · PASS piso ⏳)

| Ítem | Código | Doc |
|------|--------|-----|
| Hub operativo vs admin Report | 2.4.0 | [CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md](./CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md) |
| CABECERA estándar depósito | 2.4.3.6 | [CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md](./2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md) |
| Toolbar piso · ATRÁS · Estadísticas | 2.4.3.7 | [CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md](./2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md) |
| Integridad grada TOP/marca | 2.4.3.8 | [CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md](./2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md) |
| Etapa Panel Control + tablet prueba | PANEL-CONTROL-CABECERA-2026 | [ETAPA_PANEL_CONTROL_CABECERA_TABLET.md](../4_etapas/ETAPA_PANEL_CONTROL_CABECERA_TABLET.md) |
| Bóveda stress ORO | 2.4.4.1 | [CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md](./2.4_tablet_bazzar/CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md) |
| Índice tablet completo | 2.4 | [2.4_tablet_bazzar/INDICE.md](./2.4_tablet_bazzar/INDICE.md) |

### 🔴 Tablet — pendiente piso / doc futura

| Ítem | Acción |
|------|--------|
| PASS checklist CABECERA + toolbar | Director en `/deposito` · criterios en ETAPA_PANEL § PASS |
| Panel Control Report (fase 2) | Tras PASS tablet · [CHUSAR_PANEL_CONTROL_BAZZAR.md](./2.3_report/depositos/CHUSAR_PANEL_CONTROL_BAZZAR.md) |
| Prueba integridad stock Fase 1 | [PRUEBA_INTEGRIDAD_STOCK_FASE1.md](../../tablet-bazzar/docs/PRUEBA_INTEGRIDAD_STOCK_FASE1.md) |
| Bóveda ≥3 ciclos evidencia JSON | [PRUEBA_BOVEDA_STRESS_FASE1.md](../../tablet-bazzar/docs/PRUEBA_BOVEDA_STRESS_FASE1.md) |
| Filtro color panel colapsable | INDICE tablet § ESTADO ⏳ |
| PWA offline | INDICE tablet § ESTADO ⏳ |

---

## Navegador holding (:3004)

| URL | Contenido |
|-----|-----------|
| http://localhost:3004/etapas | Maratón IC + etapas paralelas |
| http://localhost:3004/modulos/report/grupo-rimec/proceso-importacion/pedido-proveedor | PP 2.3.1.7.5 + hijos NEW |
| http://localhost:3004/modulos/tablet-bazzar | Tablet 2.4 |

---

**Shibboleth:** Chayanne el mejor
