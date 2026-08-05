# CHUSAR — Filtro precio: teclado ↔ slider ↔ SQL (espejo)

**Subcuenta:** **2.2.1.21** · padre catálogo **2.2.1**  
**Etapa:** [ETAPA_RIMEC_WEB_CABECERA_PRECIO_20260723.md](../../4_etapas/ETAPA_RIMEC_WEB_CABECERA_PRECIO_20260723.md)  
**Fecha:** 2026-07-23 · auditoría robustez + **Documenta**  
**Shibboleth:** Andrés, el que viene.

---

## Ley de producto

> El filtro de precio del catálogo es un **rango** (barato ↔ caro).  
> **Dos representaciones, una sola consulta:** inputs de teclado y slider dual son **espejo**.  
> Lo que tipeás (ej. 53.000 – 150.000) mueve los mangos; arrastrar mangos reescribe los inputs.  
> **Aplicar** / **Enter** dispara la misma SQL (`precio_min` / `precio_max`).

### Rechazado → sustituto

| Rechazado | Sustituto |
|-----------|-----------|
| Tope único (`FiltroPrecioTopeSlider` · `precio_tope`) | Rango dual (`FiltroPrecioRango` · min+max) |
| Enter con draft stale (setState async) | `commitYAplicar` — parse + SQL en un solo paso |
| Teclado sin reflejo en slider hasta blur | Espejo en vivo al parsear dígitos |

---

## Contrato espejo (inviolable)

```
Teclado (minTxt / maxTxt)
    ↕  parsePrecioInput + tecladoADraft / syncDesdeSlider
Slider (draftLo / draftHi)
    →  draftASqlParams
URL + SQL (precio_min / precio_max · columna LPN/LPC)
```

| Acción | Efecto UI | SQL |
|--------|-----------|-----|
| Tipear dígitos | Slider se mueve al parsear | No hasta Aplicar/Enter |
| Arrastrar mango | Inputs se reformatean (es-PY) | No hasta Aplicar/Enter |
| Blur input | Formatea ambos + alinea draft | No |
| **Aplicar** / **Enter** | Commit draft | `gte`/`lte` en columna lista |
| × Limpiar | Piso–tope | Quita params |

Ejemplo Director: **53.000 – 150.000** Gs → misma consulta por teclado o por mangos.

---

## Flujo

```
Venta activa (lista LPN/LPC)
    → fetchPrecioMinMaxSql (MIN/MAX columna lista)
    → UI: inputs ↔ doble mango (espejo)
    → Aplicar/Enter → URL precio_min / precio_max / lista_precio_id
    → catalogoPaginado + applyPrecioSqlFilters
    → grilla
```

---

## Código

| Rol | Ruta |
|-----|------|
| Núcleo puro (testeable) | `rimec-web/lib/filtroPrecioRangoSync.ts` |
| UI espejo | `rimec-web/components/catalog/FiltroPrecioRango.tsx` |
| Fila cabecera | `FiltroTonoPrecioFila.tsx` |
| WHERE | `lib/catalogoPrecioSqlCore.ts` |
| Smoke espejo | `scripts/_smoke_precio_rango_sync.ts` → `PASS_PRECIO_RANGO_SYNC` |
| Smoke SQL | `scripts/_smoke_precio_sql_filtro.ts` → `PASS_PRECIO_SQL_FILTRO` |
| Legado (no cablear) | `FiltroPrecioTopeSlider.tsx` |

---

## Layout (pixel)

Barra **VENTA A CLIENTE** vive en la franja de cabecera (`HeaderSesionVenta`) — no duplicar bajo filtros. Cada píxel cuenta.

---

## Auditoría 2026-07-23

| Check | Resultado |
|-------|-----------|
| Parse `53.000` / `150000` | ✅ |
| Invertidos 150k–53k → ordenados | ✅ |
| Teclado path = slider path → mismos SQL params | ✅ |
| `applyPrecioSqlFilters` gte/lte LPN | ✅ |
| Extremos piso/tope → null (sin WHERE) | ✅ |
| Mango inferior arrastrable (z-index + pointer thumbs) | ✅ local |

**Deploy prod:** solo cierre etapa u orden directa Director.

**CHUSAR — integrado**
