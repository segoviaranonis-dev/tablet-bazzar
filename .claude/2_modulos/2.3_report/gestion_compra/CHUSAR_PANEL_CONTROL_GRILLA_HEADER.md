# CHUSAR — Panel de Control · CABECERA DE FILTROS · grilla moléculas

**Código:** **2.3.1.20**  
**Ratificado:** Director · 2026-07-09 (noche)  
**Ruta hub:** `/rimec?mundo=panel-control`  
**Padre:** [CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md](./CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md) · **2.3.1.17**  
**Arquitectura:** [CABECERA_DE_FILTROS.md](../../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md) · `3.2.00.001`  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Ley (indiscutible)

Toda pantalla con **grilla de moléculas** que sale del Panel de Control Alejandro Magno **debe** montar el stack canónico:

```text
BibliotecaCasoBar
  → PanelControlTrianguloHeader   (CABECERA DE FILTROS sellada)
  → GrillaPeImportadora
```

**Convergencia Grilla Rimec (2026-07-14):** estándar holding [GRILLA_RIMEC.md](../../../3_arquitectura/3.2_venta_tienda/GRILLA_RIMEC.md) — cabecera + acordeón **dato duro** + toggle **Extender todos los datos**. Report Panel CP migra hacia ese patrón (ref RIMEC Web `96870f3`).

**Prohibido:** grilla sin cabecera · props distintas por módulo · embeber grilla en el hub compacto.

---

## 2 · Rutas obligatorias

| Entidad Panel | Ruta Report | Client |
|---------------|-------------|--------|
| STOCK · Pronta entrega | `/stock-pronta-entrega` | `StockProntaEntregaClient` |
| COMPRA PREVIA · Tránsito | `/stock-transito` · `/disponible` · `/ventas` | `StockTransitoClient` |
| PROGRAMADO | `/stock-programado` | `StockProgramadoClient` |

Breadcrumb en las tres: `← Panel de Control` → `/rimec?mundo=panel-control`.

---

## 3 · Implementación Report (2026-07-08/09)

| Pieza | Archivo | Rol |
|-------|---------|-----|
| Config sellada | `report/src/lib/panel-control/panel-control-grilla-header.ts` | `PANEL_CONTROL_GRILLA_HEADER` + lista rutas |
| Wrapper header | `report/src/components/panel-control/PanelControlTrianguloHeader.tsx` | Props fijas → `TrianguloHeaderDeposito` |
| Stack UI | `report/src/components/panel-control/PanelControlGrillaStack.tsx` | Biblioteca + header + grilla |
| Spec repo | `report/src/components/panel-control/PANEL_CONTROL_GRILLA_HEADER.md` | Espejo técnico en código |
| Motor cabecera | `report/src/app/depositos-bazzar/components/operativa/TrianguloHeaderDeposito.tsx` | Filas Género…TONO |
| Grilla | `report/src/components/stock-pronta-entrega/GrillaPeImportadora.tsx` | Moléculas · `ventasPorMol` opcional |

### Props selladas (`PANEL_CONTROL_GRILLA_HEADER`)

| Prop | Valor |
|------|-------|
| `gradaVariant` | `importadora` |
| `filtersDefaultOpen` | `false` |
| `hideVitalesHero` | `true` |
| `hideProductosVital` | `true` |
| `categoriaEnCabecera` | `true` |
| `summaryLayout` | `vitales-first` |
| `tonoCatalog` | `COLORES_ESTANDAR_DEFAULT` |

### Variantes por entidad (solo slots)

| Entidad | `summaryTrailing` | `extraFilters` | Grilla |
|---------|-------------------|----------------|--------|
| PE | `PeVentasRegistroBar` | Depósito legal D1/D2/D3 | `showVentas` |
| CP tránsito | `TransitoVentasVitales` | `FiltroLlegadaMulti` | `showLlegada` + `showVentas` + `ventasPorMol` |
| Programado | `ProgramadoVentasVitales` | `FiltroLlegadaMulti` | `showLlegada` + `showVentas` |

---

## 4 · Legacy

| Pieza | Estado |
|-------|--------|
| `PanelSectorGrilla.tsx` | **No usar** en hub · sin cabecera · reservado informes futuros |
| Duplicar `TrianguloHeaderDeposito` con props sueltas | **Revocado** — usar `PanelControlGrillaStack` |

---

## 5 · Smoke (Director · mañana)

1. `/rimec?mundo=panel-control` — hub compacto 3 tarjetas.
2. **Ver productos →** en cada entidad — misma cabecera (Género · Marca · Estilo · Tipo 1 · Línea · Buscar · TONO).
3. Expandir filtros — Calzado/Confecciones arriba · vitales por entidad.
4. Breadcrumb vuelve al hub.

---

## 6 · Pendiente técnico (continuar mañana)

| # | Tema | Estado |
|---|------|--------|
| 1 | Slot **CompradoresVentasSlot** en `PeCardMiniatura` (API `ventasPorMol` ya cableada) | ⏳ UI |
| 2 | Smoke visual navegador `:3000` post-cierre terminales | ⏳ Director |
| 3 | Etapa **INYECCION-DATOS-TRANSITO-IC-20260709** | 🔴 abierta |
| 4 | Deploy prod Report | 🔒 solo cierre etapa u orden directa |

---

## 7 · Índice

- [INDICE.md](./INDICE.md)
- [CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md](./CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md)
- [CHUSAR_COMPRADORES_CADENA_STOCK_TRANSITO.md](./CHUSAR_COMPRADORES_CADENA_STOCK_TRANSITO.md) · **2.3.1.19**
- [CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md)
- [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md)
- [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC](../deposito_rimec/CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md)
