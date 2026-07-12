# CHUSAR — Stock Programado · Grilla v1 · Operativa + Artículos

**Código:** **2.3.1.16.1**  
**Fecha:** 2026-07-10  
**Padre:** [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md) · **2.3.1.16**  
**Visión:** [CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md](./CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md) · **2.3.1.21**  
**Shibboleth:** Andrés, el que viene.

---

## Entregable v1

Primera pieza **PROGRAMADO** dentro de Alejandro Magno: paridad tabs **Operativa | Artículos** como PE/CP.

| Pieza | Estado |
|-------|--------|
| `PanelControlGrillaStack` + CABECERA | ✅ |
| Tab **Operativa** · `GrillaPeImportadora` | ✅ |
| Tab **Artículos** · gráficos pilares | ✅ `TabArticulosProgramado.tsx` |
| `BibliotecaCasoBar` + filtros quincena | ✅ |
| `ProgramadoVentasVitales` | ✅ |
| Informes venta (capa CP `/ventas`) | 🔴 pendiente |
| **Canon ventas ejecutadas → Programado** | ✅ [CHUSAR_STOCK_PROGRAMADO_VENTAS_FI_20260712.md](./CHUSAR_STOCK_PROGRAMADO_VENTAS_FI_20260712.md) · **2.3.1.16.3** |
| Smoke script | ✅ `report/scripts/verify_stock_programado_grilla.mjs` |

**Avance entidad 3:** ~**10% → ~40%** (Operativa + Artículos; falta informes).

---

## Archivos Report

| Ruta | Rol |
|------|-----|
| `src/components/stock-programado/StockProgramadoClient.tsx` | Tabs Operativa/Artículos |
| `src/components/stock-programado/TabArticulosProgramado.tsx` | KPI + gráficos pilares |
| `src/components/stock-programado/StockProgramadoContext.tsx` | Estado filtros |
| `src/components/panel-control/PanelControlGrillaStack.tsx` | CABECERA sellada |
| `src/lib/stock-programado/queries-productos.ts` | Moléculas PPD cat. 3 |

---

## Próximo paso (maratón grilla × 3)

1. **CP tab Artículos** en lente STOCK (`/stock-transito/disponible`).
2. **CP informes** `/stock-transito/ventas` — segmentación gerencial.
3. Clonar informes en Programado cuando CP cierre 60→90%.

---

## Índice

- [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md)
- [ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md](../../../4_etapas/ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md)
