# Evidencia — OT-REPORT-RETAIL-FILTROS-6-PILARES-005

**Ejecutor:** Claude Code  
**Auditoría Cursor:** 2026-05-20  
**Veredicto:** ✅ **PASS (código verificado en disco; capturas en vivo pendientes)**

---

## Auditoría Cursor (grep en disco)

### Bug A — Filtro Género agregado ✅

| Archivo | Evidencia |
|---------|-----------|
| `src/lib/retail/retail-filters.ts` | `generoId: string` en `RetailFilterState` (línea 4) · default `""` (14) · parse `genero_id` (40) · query `genero_id` (52) · apply `r.genero_id === Number(f.generoId)` (65-67) |
| `src/lib/retail/query-filtros.ts` | `generos: RetailFilterItem[]` (6) · `s.genero_id` en SELECT (35) · `LEFT JOIN public.genero g` (51) · agregación en Map (60, 68-70, 84) |
| `src/lib/retail/staging-row.ts` | `genero_id: number \| null` en tipo (14) · expuesto en `RETAIL_STAGING_SELECT_SQL` (67) · JOIN `public.genero g` (109) |
| `src/app/retail/components/RetailFiltrosHeader.tsx` | Fila pills Género (191-206) · `Todos` + `Damas/Niñas/Niños/Caballeros` dinámicos |

### Bug B — Color por color_id ✅

| Archivo | Evidencia |
|---------|-----------|
| `retail-filters.ts` | `colorIds: number[]` (9) · parse `color_ids` (34) · query `color_ids` (57) · apply `Set(f.colorIds)` (85-88) |
| `RetailFiltrosHeader.tsx` | `DropdownIds` multi-select por ID (258-263), no string |

### Bug C — Demo trap eliminado ✅

| Archivo | Evidencia |
|---------|-----------|
| `RetailStockClient.tsx:81-84` | `usandoDemo = !configured \|\| (!data && !loading)` y `columnas = usandoDemo ? STOCK_BOARD_DEMO_COLUMNAS : (data?.columnas ?? [])` |
| `RetailStockClient.tsx:116-120` | Mensaje *"Sin referencias para estos filtros. Limpiar filtros."* cuando `configured && data?.columnas.length === 0` |

### Bug D — KPIs filtrados ✅

| Archivo | Evidencia |
|---------|-----------|
| `src/app/api/retail/stock-board/route.ts:55-62` | `rows = applyRetailFilters(rowsAll, filtros)` antes de `computeRetailKpis(rows)` |

### Bug E — Label "Tipo 1" ✅

| Archivo | Evidencia |
|---------|-----------|
| `RetailFiltrosHeader.tsx:265` | `label="Tipo 1"` |

---

## Reporte de Claude

> Bash Build report
> npm run build → exitoso
> Dev server: http://localhost:3002/retail

---

## Verificación manual pendiente (Director)

Probar en navegador y completar:

| # | Filtro | Acción | Cambia rejilla | KPIs reflejan | Screenshot |
|---|--------|--------|----------------|---------------|------------|
| 1 | Género | Damas | ☐ | ☐ | |
| 2 | Marca | Vizzano | ☐ | ☐ | |
| 3 | Estilo | TACO ALTO | ☐ | ☐ | |
| 4 | Línea | una línea | ☐ | ☐ | |
| 5 | Color | un color | ☐ | ☐ | |
| 6 | Tipo 1 | un tipo | ☐ | ☐ | |
| ∅ | Combinación imposible | mensaje "Sin referencias…" + sin demo | ☐ | — | |
| ↻ | Limpiar filtros | vuelve lote completo | ☐ | ☐ | |

---

## Conclusión

- ✅ 5/5 bugs corregidos a nivel código (verificado por Cursor).
- ✅ Los 6 filtros del header están implementados (género, marca, estilo, línea, color, tipo 1).
- ✅ Tipos coherentes: componente consume `filtros.generoId` / `filtros.colorIds` / `filtrosData.generos` y todos existen.
- ⏳ Capturas operativas pendientes (Director).

**Firma:** Claude Code · Audit Cursor — 2026-05-20
