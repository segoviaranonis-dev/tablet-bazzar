# CHUSAR — Tablet · Depósito · Toolbar piso · Stock protagonista

**Subcuenta:** **2.4.3.7**  
**Padre:** [CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md](./CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md) · **2.4.3.6**  
**Etapa:** [ETAPA_PANEL_CONTROL_CABECERA_TABLET.md](../../4_etapas/ETAPA_PANEL_CONTROL_CABECERA_TABLET.md) · **PANEL-CONTROL-CABECERA-2026**  
**Integridad grada:** [CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md](./CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md) · **2.4.3.8**  
**Estado:** ✅ **PASS piso 2026-07-03** · [Manual operaciones](./CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md)

---

## Qué es

Rediseño de la **cabecera operativa** de `/deposito` para el **caos de una tienda**: vendedora o jefa de salón con una mano ocupada, poco tiempo y necesidad de ver **cajas con fotos y grada** lo antes posible.

**Ley de producto:** el **stock es el protagonista**. Chrome (título, tabs, selector, filtros) ocupa el mínimo vertical posible. Todo lo táctil en **una fila principal** + una **sub-fila delgada** solo cuando CABECERA está cerrada.

**No es** panel gerencial — eso vive en Report (`/depositos-bazzar`). Tablet = **consulta y alertas vidriera** en piso.

---

## Antes vs después

| Aspecto | Antes (multi-fila) | Después (toolbar piso) |
|---------|-------------------|------------------------|
| Volver al panel | Link pequeño «← Panel modos» | Botón **ATRÁS** 48×72px mín · azul RIMEC |
| Título | H1 + subtítulo 3 líneas | Compacto en `sm+` · codigo + pares en 11px |
| Tabs Stock / Alertas | Fila separada full-width | Chips en la **misma fila** que ATRÁS |
| Estadísticas | ❌ | Tab **Estadísticas** · KPIs vista filtrada |
| CABECERA filtros | Expandida por defecto | **Cerrada por defecto** · panel bajo toolbar |
| Barra colapsada filtros | Segunda fila 52px + botón duplicado | Sub-fila 1 línea · toggle solo en toolbar |
| Stats cajas/pares | Pills grandes sobre grilla | `compactStats` · pills más chicas |
| Viewport útil stock | ~60–65% | ~85–90% con CABECERA cerrada |

---

## Layout canónico (2026-06-10)

```
┌─ STICKY HEADER ─────────────────────────────────────────────────────────────┐
│ FILA 1 (~56px) · scroll horizontal si pantalla estrecha                      │
│ [ATRÁS] │ Depósito FER-N · 6266p (sm+) │ [Stock·cajas][Alertas⭐][Estadíst.] │
│         │                               │              [select tienda][CABECERA▾] │
├─ SUB-FILA (solo tab stock + CABECERA cerrada) ──────────────────────────────┤
│ 1190 · TOP 80 · Sin filtros activos  (o chips resumen filtros)             │
├─ PANEL CABECERA (solo si CABECERA ▴) ───────────────────────────────────────┤
│ Género → Marca → Estilo → Tipo 1 → Línea → Buscar → TONO · Top/marca      │
└─────────────────────────────────────────────────────────────────────────────┘
┌─ MAIN ──────────────────────────────────────────────────────────────────────┐
│ tab stock    → GrillaCajasDeposito (compactStats)                          │
│ tab alertas  → TabAlertasDeposito                                          │
│ tab estadíst → DepositoEstadisticasPanel                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Ley UX piso (Director)

1. **Target táctil mínimo 48px** en ATRÁS, tabs, selector, CABECERA (`min-h-[48px]`).
2. **ATRÁS** siempre visible · lleva a `/` (panel modos) · no texto diminuto.
3. **Una fila de navegación** — tabs no van en fila aparte.
4. **CABECERA cerrada al abrir** — filtros son secundarios; jefa abre solo si necesita acotar.
5. **Scroll horizontal** en toolbar antes que wrap a segunda fila (tablet vertical en mostrador).
6. **Badge alertas** naranja en tab Alertas cuando hay `VIDRIERA_CAMBIO` pendiente.
7. **Estadísticas** = vista rápida sin salir del depósito · no reemplaza Report analítico.

---

## Tabs (`TabDeposito`)

| Tab | Valor state | Contenido | Visible en toolbar |
|-----|-------------|-----------|-------------------|
| Stock · cajas | `stock` | Grilla molécula + grada | Siempre |
| Alertas · vidriera ⭐ | `alertas` | [CHUSAR vidriera](./CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md) | Siempre · badge si urgentes |
| Estadísticas | `estadisticas` | KPIs + top marcas vista actual | Siempre |

**CABECERA ▾** solo aparece en tab `stock`. En alertas/estadísticas no hay filtros de cabecera.

---

## Componente `DepositoToolbar`

| Prop | Tipo | Rol |
|------|------|-----|
| `tab` | `TabDeposito` | Tab activa |
| `onTabChange` | fn | Cambio tab |
| `depositoActivo` | `{ cliente_id, codigo, nombre, pares }` | Meta tienda actual |
| `depositos` | array | Opciones `<select>` 6 tiendas |
| `onDepositoChange` | fn | Cambia `cliente_id` |
| `filtrosExpanded` | bool | CABECERA abierta/cerrada |
| `onToggleFiltros` | fn | Toggle CABECERA |
| `filtros` | `DepositoFilterState` | Para chips resumen |
| `filtrosData` | `DepositoFiltrosData` | Labels chips |
| `totalMostrados` | number | Filas API (sub-fila) |
| `limit` | number | TOP/marca activo |
| `alertasCount` | number | Badge tab Alertas |

**Ruta:** `tablet-bazzar/components/deposito/DepositoToolbar.tsx`

**Export:** `TabDeposito` type reutilizable desde página.

---

## Tab Estadísticas · `DepositoEstadisticasPanel`

Vista **client-side** sobre `cajas = agruparProductosPorCaja(productos)` ya cargados — **no** API nueva.

| KPI | Fuente |
|-----|--------|
| Código / nombre depósito | `meta` + `depositoActivo` |
| Pares totales depósito | `GET /api/deposito/status` → `pares` del `cliente_id` |
| Vista actual (pares + cajas + %) | Suma `totalPares` cajas filtradas vs total depósito |
| Marcas visibles | `Map` por `producto.marca` |
| Top 12 marcas | Ranking pares DESC en vista filtrada |

**Ruta:** `tablet-bazzar/components/deposito/DepositoEstadisticasPanel.tsx`

**Futuro (fase 2):** drill-down por estilo/tipo · enlace Report operativa · gráficos turno. **No** implementado en esta entrega.

---

## CABECERA DE FILTROS · integración

| Estado | Comportamiento |
|--------|----------------|
| Cerrada (default) | `DepositoFiltrosHeader` con `hideCollapsedBar` → **null** · resumen en sub-fila toolbar |
| Abierta | Panel scroll `max-h-[min(52dvh,520px)]` bajo toolbar · orden estándar holding |

Doc estándar completo: [CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md](./CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md)

Prop nueva en filtros header:

```typescript
hideCollapsedBar?: boolean; // true cuando toolbar maneja CABECERA
```

---

## Página orquestadora

**Ruta:** `tablet-bazzar/app/deposito/page.tsx`

| State | Default | Notas |
|-------|---------|-------|
| `tab` | `"stock"` | |
| `filtrosExpanded` | **`false`** | Stock protagonista |
| `limit` | `80` | TOP cajas/marca |
| `clienteId` | `2100` | Auto si una sola tienda con stock |

Flujo datos sin cambio: `loadStatus` → `loadAll(clienteId, filtros, limit)` debounced.

---

## Grilla · stats compactas

`GrillaCajasDeposito` acepta `compactStats?: boolean`:

- Pills cajas/pares más pequeñas (`text-xs`, `py-0.5`).
- Oculta texto «FER-N · agrupación L+R+material+color» (ya en sub-fila toolbar).

---

## Mapa código (entrega completa depósito tablet)

| Pieza | Ruta |
|-------|------|
| Página | `app/deposito/page.tsx` |
| **Toolbar piso** | `components/deposito/DepositoToolbar.tsx` |
| CABECERA filtros | `components/deposito/DepositoFiltrosHeader.tsx` |
| Estadísticas | `components/deposito/DepositoEstadisticasPanel.tsx` |
| Grilla cajas | `components/deposito/GrillaCajasDeposito.tsx` |
| Tabla grada | `components/deposito/TablaGradaDeposito.tsx` |
| Alertas vidriera | `components/deposito/TabAlertasDeposito.tsx` |
| Estado filtros | `lib/deposito-filters.ts` |
| SQL cascada + grada | `lib/server/deposito-filtros-sql.ts` |
| Agrupación caja | `lib/depositos/agrupar-cajas.ts` |
| Vidriera ⭐ | `lib/depositos/vidriera-estrellas.ts` |
| Diagnóstico grada | `scripts/diag-grada-truncada-2900.mjs` |

---

## APIs (sin cambio de contrato)

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/deposito/status` | 6 tiendas + matriz 18 |
| GET | `/api/deposito/{id}?…&limit=80` | Productos filtrados · grilla |
| GET | `/api/deposito/{id}/filtros-header?…` | Chips cascada CABECERA |
| GET | `/api/tono` | Catálogo TONO |

Params filtros: ver [CABECERA estándar](./CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md#params-url-fk--tono).

---

## Smoke piso (checklist Director)

| # | Acción | Esperado |
|---|--------|----------|
| 1 | Abrir `/deposito` | CABECERA cerrada · grilla visible de inmediato |
| 2 | Tocar **ATRÁS** | Vuelve a `/` panel modos |
| 3 | FER-N 2900 · sin filtros | Sub-fila «N · TOP 80 · Sin filtros activos» |
| 4 | CABECERA ▾ → expandir | Panel filtros · chip Marca reduce grilla |
| 5 | CABECERA ▴ | Panel cierra · sub-fila reaparece |
| 6 | Tab **Estadísticas** | 4 KPIs + ranking marcas |
| 7 | Tab **Alertas** | Lista vidriera · badge si hay cambio grada |
| 8 | Molécula 2831.244 FER-N | 10 gradas · 51 p · scroll horizontal grada |
| 9 | `node scripts/diag-grada-truncada-2900.mjs` | 0 moléculas truncadas |

---

## Paridad Report

| Aspecto | Report operativa | Tablet toolbar |
|---------|------------------|----------------|
| Rol | Panel control admin | Piso · dedo grande |
| Header | Triángulo + acordeón | Toolbar 1 fila |
| Estadísticas | KPIs + valor inventario | KPIs vista filtrada · sin precio CSV |
| Grada | Acordeón filas | Tabla scroll en card |

Doc Report: [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](../2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_DEPOSITO.md)

---

## Relación etapa Panel Control

Esta toolbar es la **capa UX** de la prueba **PANEL-CONTROL-CABECERA-2026**:

1. ✅ CABECERA estándar + TONO (2.4.3.6)
2. ✅ Toolbar piso + Estadísticas (2.4.3.7)
3. ✅ Integridad grada SQL+UI (2.4.3.8)
4. ⏳ PASS piso Director
5. ⏳ Panel Control Report (fase 2) — [CHUSAR_PANEL_CONTROL_BAZZAR.md](../2.3_report/depositos/CHUSAR_PANEL_CONTROL_BAZZAR.md)

---

**Shibboleth:** Chayanne el mejor · Stock primero · CABECERA cuando haga falta · ATRÁS grande en el caos
