# CHUSAR — Panel de Control · Hub compacto · Navegación al interior

**Código:** **2.3.1.17**  
**Ratificado:** Director · 2026-07-08  
**Ruta hub:** `/rimec?mundo=panel-control`  
**Shibboleth:** Andrés, el que viene.

---

## Ley de diseño (Director)

| Capa | Qué muestra | Qué **no** muestra |
|------|-------------|-------------------|
| **Hub Panel** | KPIs por entidad · badge RIMEC Web · CTA navegación | Grilla moléculas · filtros · cabecera estándar |
| **Hoja interior** | Cabecera estándar (`TrianguloHeaderDeposito`) + grilla productos | KPIs resumidos del hub (ya vistos) |

**«Adentro»** = navegar al **módulo hijo** en **página independiente**, no embeber la grilla en el hub.

> Error corregido 2026-07-08: se había apilado `PanelSectorGrilla` bajo cada tarjeta del hub. **Revocado** — el hub vuelve al diseño **compacto** (3 columnas en desktop).

---

## Hub · wireframe

```text
┌─────────────────────────────────────────────────────────────┐
│ Panel de Control · Alejandro Magno                          │
│ [ Herramienta de reposición!!! → ]  ← culminación 2.3.1.22  │
├──────────────┬──────────────┬───────────────────────────────┤
│ STOCK        │ COMPRA PREVIA│ PROGRAMADO                    │
│ KPIs         │ KPIs         │ KPIs                          │
│ [Ver prod →] │ [Ver prod →] │ [Ver prod →]                  │
└──────────────┴──────────────┴───────────────────────────────┘
```

Grid UI: `md:grid-cols-2` · `xl:grid-cols-3` · tarjetas `p-5` (no stack vertical con grilla).  
CTA reposición: `/herramienta-reposicion` · [CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md](./CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md).

---

## Rutas interior (hoja independiente)

| Entidad | CTA hub | Ruta Report | Shell |
|---------|---------|-------------|-------|
| **STOCK · Pronta entrega** | Ver productos → | `/stock-pronta-entrega` | `DepositoRimecShell` |
| **COMPRA PREVIA · Tránsito** | Ver hub → | `/stock-transito` | Hub 2 paneles |
| | Saldo disponible | `/stock-transito/disponible` | Grilla saldo > 0 |
| | Ventas ejecutadas | `/stock-transito/ventas` | Grilla pares_vendidos > 0 |
| **PROGRAMADO** | Ver productos → | `/stock-programado` | idem |
| **Reposición (fusión)** | Herramienta de reposición!!! → | `/herramienta-reposicion` | Grilla 4 paneles · **2.3.1.22** |

Cada hoja interior incluye:

1. **Breadcrumb** `← Panel de Control` → `/rimec?mundo=panel-control`
2. **Stack canónico** — `PanelControlGrillaStack` = `BibliotecaCasoBar` + **CABECERA DE FILTROS** (`PanelControlTrianguloHeader`) + `GrillaPeImportadora`
3. **Vitales** por entidad en `summaryTrailing` (comprado/vendido/saldo)
4. **Biblioteca / casos** — `BibliotecaCasoBar` (las tres entidades)

Doc cabecera sellada: [CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md](./CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md) · **2.3.1.20**.

El **Panel de Control** es la lente **macro** para analizar los tres grupos de venta con la **grilla estándar** — ver [CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md](../gestion_compra/CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md).

Docs hijos:

| Entidad | CHUSAR |
|---------|--------|
| STOCK PE | [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC](../deposito_rimec/CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md) |
| COMPRA PREVIA | [CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS](./CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md) |
| PROGRAMADO | [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS](./CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md) |

---

## Implementación Report

| Pieza | Archivo | Rol |
|-------|---------|-----|
| Hub UI | `report/src/app/rimec/components/MundoPanelControl.tsx` | Solo KPIs + link |
| Resumen KPI | `report/src/lib/panel-control/queries-resumen.ts` | `enlace_report` por entidad |
| API resumen | `GET /api/rimec/panel-control/resumen` | JSON entidades |
| Grilla embebida hub | ~~`PanelSectorGrilla`~~ | **No usar en hub** |
| Stack grilla interior | `PanelControlGrillaStack.tsx` | **Obligatorio** — ver [CHUSAR_PANEL_CONTROL_GRILLA_HEADER](./CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md) |
| API productos panel | `GET /api/rimec/panel-control/productos?entidad=` | Reservada · mismos datos que APIs sectoriales; no render en hub |

**Componente legacy:** `report/src/components/panel-control/PanelSectorGrilla.tsx` — mantener solo si un informe futuro lo requiere; **prohibido** montarlo en `MundoPanelControl`.

---

## Paridad KPI (sin cambio)

| Tarjeta | Fuente SQL |
|---------|------------|
| STOCK | `getStockProntaEntregaResumen` |
| COMPRA PREVIA | `getCompraPreviaEstadisticasWeb` — ley [CHUSAR_PANEL_CONTROL_COMPRA_PREVIA](./CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md) |
| PROGRAMADO | `aggPpPorCategoria(pool, 3)` |

Concepto madre: [CHUSAR_MERCADERIA_EN_TRANSITO](./CHUSAR_MERCADERIA_EN_TRANSITO.md) · corazón [CHUSAR_PANEL_CORAZON_CASO_PRUEBA_DUAL](./CHUSAR_PANEL_CORAZON_CASO_PRUEBA_DUAL.md).

---

## Smoke

1. `/rimec?mundo=panel-control` — **3 tarjetas compactas**, sin scroll de grilla en el hub.
2. Clic **Ver productos →** en COMPRA PREVIA → `/stock-transito` con cabecera + grilla.
3. Breadcrumb vuelve al hub sin perder sesión.
4. KPI hub COMPRA PREVIA = Estadísticas RIMEC Web (sin filtros).

---

## Índice

- [INDICE.md](./INDICE.md)
- [MAPA_PANEL_CP_TRANSITO_STOCK_VENTAS.md](./MAPA_PANEL_CP_TRANSITO_STOCK_VENTAS.md)
- [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)
