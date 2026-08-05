# ETAPA — Panel Control Bazzar · CABECERA tablet (prueba estándar)

**Código:** **PANEL-CONTROL-CABECERA-2026** · **2.3.2.1.2** · **2.4.3.6–2.4.3.8**  
**Apertura:** 2026-06-10 · orden Director **Protocolo Chusar**  
**Estado:** ✅ **CERRADA 2026-07-03** · ver [ETAPA_PANEL_CONTROL_CABECERA_TABLET_CERRADA.md](./ETAPA_PANEL_CONTROL_CABECERA_TABLET_CERRADA.md)

---

## Objetivo

1. **Documentar** el depósito Bazzar Report (elementos actuales + visión Panel Control escalonado).
2. **Estandarizar CABECERA DE FILTROS** en tablet `/deposito` — misma lógica que Report operativa.
3. **Toolbar piso** — stock protagonista · ATRÁS · Estadísticas · una fila táctil.
4. **Integridad grada** — TOP/marca sobre cajas, no filas SKU.
5. **Validar** estándar en código **antes** del módulo Panel Control Report.

**Ley:** Report = panel de control · Tablet = ejecución. El futuro **Panel Control** vive en Report al lado/debajo de la tarjeta depósito — no reemplaza `/deposito` tablet.

---

## Entregables

| # | Artefacto | Ruta | Estado |
|---|-----------|------|--------|
| 1 | Catálogo depósito Report + visión Panel | [CHUSAR_PANEL_CONTROL_BAZZAR.md](../2_modulos/2.3_report/depositos/CHUSAR_PANEL_CONTROL_BAZZAR.md) | ✅ |
| 2 | Depósito tablet + cabecera estándar | [CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md) | ✅ |
| 3 | **Toolbar piso · stock protagonista** | [CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md) | ✅ |
| 4 | **Integridad grada SQL+UI** | [CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md) | ✅ |
| 5 | Implementación CABECERA + TONO | `tablet-bazzar/components/deposito/DepositoFiltrosHeader.tsx` | ✅ |
| 6 | Implementación toolbar | `tablet-bazzar/components/deposito/DepositoToolbar.tsx` | ✅ |
| 7 | Tab Estadísticas | `tablet-bazzar/components/deposito/DepositoEstadisticasPanel.tsx` | ✅ |
| 8 | Estándar holding (referencia) | [CABECERA_DE_FILTROS.md](../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md) | existente |
| 9 | Módulo Panel Control (fase 2) | Report `/depositos-bazzar` · slot UI junto tarjeta | ⏳ tras PASS piso |
| 10 | **Gap doc tablet+Report** | [DOC_PENDIENTE_TABLET_REPORT_20260703.md](../2_modulos/DOC_PENDIENTE_TABLET_REPORT_20260703.md) | ✅ 2026-07-03 |
| 11 | **Manual operaciones depósito piso** | [CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md) | ✅ 2026-07-03 |

---

## Criterio PASS (prueba cabecera + toolbar tablet)

| Check | Acción |
|-------|--------|
| Toolbar 1 fila | ATRÁS · tabs · selector · CABECERA en ~56px |
| ATRÁS | Botón grande → `/` panel modos |
| CABECERA default | **Cerrada** · grilla ~85–90% viewport |
| Filas orden estándar | Género → Marca → Estilo → Tipo 1 → Línea → Buscar → **TONO** |
| TONO | Círculos `color_tono_estandar` · `sin_tono=1` · SQL `tono_canon.etiqueta` |
| Cascada | `/api/deposito/{id}/filtros-header` recalcula chips al cambiar filtro |
| Grilla | Cajas + vidriera ⭐ + **todas las gradas** por caja seleccionada |
| TOP/marca | Limita **cajas** · script `diag-grada-truncada-2900.mjs` → 0 truncadas |
| Tab Estadísticas | KPIs + top marcas vista filtrada | ✅ PASS 2026-07-03 |
| Paridad Report | Misma lógica filtros · distinto chrome UX piso | ✅ PASS 2026-07-03 |
| **Prueba Director piso** | Éxito total tablet depósito | ✅ **2026-07-03** |

---

**Orden Director (siguiente fase)**

Tras **Cierra etapa** formal → diseñar **Panel Control** en Report:

- Ubicación: hub `/depositos-bazzar` · al lado o debajo de tarjeta tienda
- Alcance progresivo: ver todos los depósitos · drill-down por ente → tienda → operativa
- Reutilizar componentes `operativa/` ya probados en Report

---

**Shibboleth:** Chayanne el mejor · Cabecera primero · Stock protagonista · Panel Control después
