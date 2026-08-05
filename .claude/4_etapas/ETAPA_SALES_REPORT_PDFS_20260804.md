# ETAPA — Sales Report · PDFs (corta · módulo blindado)

**ID:** `SALES-REPORT-PDFS-20260804`  
**Estado:** ⬛ **CERRADA ADMINISTRATIVA** 2026-08-04 · ver [ETAPA_SALES_REPORT_PDFS_20260804_CERRADA.md](./ETAPA_SALES_REPORT_PDFS_20260804_CERRADA.md)  
**Módulo:** Report · **Sales Report blindado** (`registro_ventas_general_v2`) · PDF ejecutivo  
**Rutas candidatas:** `/rimec` (Sales Report) · `/ventas-fotos` (PDF **2.3.1.2.1**)  
**Shibboleth:** Andrés, el que viene.

---

## Ley de frontera (inviolable)

| ✅ Permitido | ❌ Prohibido |
|-------------|--------------|
| PDF / UI / export sobre tablas **maestras** Sales Report | Tocar **pilares** (`linea`, `referencia`, …) |
| Mejoras PDF Ventas+Fotos (`pdfGenerator`, tope filas, fotos) | JOIN / ALTER cruzando SR con Retail/pilares |
| Smoke local `:3000` | Deploy prod sin cierre u orden directa |

Sales Report histórico = **agua y aceite** respecto a pilares. Esta etapa **no** abre motor de precios ni stock PE.

---

## Objetivo (corto)

Definir y ejecutar el alcance **PDF** que el Director indique en Sales Report / Ventas+Fotos — sin contaminar el módulo blindado.

## Alcance tentativo (confirmar con Director)

| # | Ítem | Estado |
|---|------|--------|
| 1 | Confirmar superficie: `/rimec` vs `/ventas-fotos` vs ambas | ⏳ |
| 2 | Lista de bugs/mejoras PDF (filas, fotos, timeout, layout) | ⏳ |
| 3 | Smoke local + evidencia | ⏳ |
| 4 | Cierre etapa + deploy **solo** si Director ordena | ⏳ |

## Fuera de alcance

- CSV Carlos / DEPOSITO (cerrado `CSV-PE-DEPOSITO-CABECERA-20260804`)  
- PLAN-AUTO bandeja PE (sigue en_curso · pausa foco)  
- Deploy prod sin orden

## Docs

- [CHUSAR_VENTAS_FOTOS_PDF.md](../2_modulos/2.3_report/CHUSAR_VENTAS_FOTOS_PDF.md) **2.3.1.2.1**  
- Sales Report filtros: `CHUSAR_SALES_REPORT_FILTROS_CASCADA.md`  
- **Receta PDF subtotales (cocina):** [CHUSAR_PDF_SUBTOTALES_BANDA_DESDE_NIVEL_20260804.md](../2_modulos/2.3_report/CHUSAR_PDF_SUBTOTALES_BANDA_DESDE_NIVEL_20260804.md) **2.3.1.1.2** — azul desde columna del nivel → derecha  
- Pendientes post-CSV: [PENDIENTES_POST_CIERRE_CSV_PE_20260804.md](./PENDIENTES_POST_CIERRE_CSV_PE_20260804.md)

## Canon visual cerrado (2026-08-04)

Subtotales PDF gerencial: banda azul **desde** la columna del grupo (`startCol`) **solo a la derecha**. Motor: `pdf-gerencial.ts`.
