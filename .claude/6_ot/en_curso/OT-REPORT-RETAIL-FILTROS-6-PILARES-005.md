# OT-REPORT-RETAIL-FILTROS-6-PILARES-005 — Arreglar filtros header (6 pilares)

**Prioridad:** ALTA (bloqueante UX)  
**Director:** Héctor Segovia  
**Ejecutor:** **Claude Code**  
**Repo principal:** `C:\Users\hecto\Nexus_Core\report`  
**Referencia UI:** `C:\Users\hecto\Nexus_Core\rimec-web` (`FiltrosCatalogo.tsx` + `Header` + `lib/filtros.ts`)  
**Estado:** ✅ CERRADA (2026-05-20) — código verificado por Cursor · capturas Director pendientes

---

## Diagnóstico Cursor (terminal + código)

### Terminal `report` (puerto 3000/3001)

Las APIs **sí responden** cuando se aplican filtros:

```
GET /api/retail/filtros?batch_id=cfb37e2e-... 200
GET /api/retail/stock-board?batch_id=...&top=12 200
GET /api/retail/stock-board?batch_id=...&top=12&marca_id=7 200
GET /api/retail/stock-board?batch_id=...&top=12&marca_id=4 200
```

El backend **recibe** `marca_id` y filtra. El problema es **incompletitud del contrato de 6 filtros** + bugs de UX que hacen parecer que “no funcionan”.

### Los 6 filtros de header (patrón RIMEC — todas las herramientas)

| # | Filtro | Pilar / dimensión | `rimec-web` catálogo | `report` `/retail` hoy | Estadísticas |
|---|--------|-------------------|----------------------|------------------------|--------------|
| 1 | **Género** | `genero_id` (Damas / Niñas / Niños / Caballeros) | ✅ Header + `lib/filtros.ts` | ❌ **FALTA** | ✅ Pills |
| 2 | **Marca** | `marca_id` | ✅ Pills | ✅ Pills | ✅ Pills |
| 3 | **Estilo** | `grupo_estilo_id` | ✅ Pills | ✅ Pills | ✅ Pills |
| 4 | **Línea** | `linea_id` (multi) | ✅ Dropdown | ✅ Dropdown | ❌ Falta |
| 5 | **Color** | `color_id` (multi) | ✅ Dropdown (hex swatches en catálogo) | ⚠️ Dropdown por **nombre** — filtro roto | ❌ Falta |
| 6 | **Tipo 1** | `tipo_1_id` (multi) | ✅ Dropdown "Tipo 1" | ⚠️ Label "Tipo" | ❌ Falta |

**Regla Director:** los 6 operan sobre **FKs materializadas en staging** (`marca_id`, `genero_id`, `grupo_estilo_id`, `linea_id`, `color_id`, `tipo_1_id`). Por eso importación de pilares + migración 063 es prerequisito (ya PASS).

---

## Bugs concretos a corregir en `report/`

### Bug A — Falta filtro **Género** (filtro #1)

`RetailFilterState` (`retail-filters.ts`) no tiene `generoId`.  
`RetailFiltrosHeader.tsx` no renderiza fila Género.  
`applyRetailFilters()` no filtra por género.  
`query-filtros.ts` no devuelve lista `generos`.

**Fix:**

1. Añadir `generoId: string` a `RetailFilterState` + query params `genero_id`.
2. `loadRetailFiltrosForBatch`: `SELECT DISTINCT s.genero_id, g.descripcion, g.codigo ... JOIN genero g`.
3. `RETAIL_STAGING_SELECT_SQL`: exponer `s.genero_id` y `g.id` para filtro server-side.
4. `applyRetailFilters`: `if (f.generoId) out = out.filter(r => r.genero_id === Number(f.generoId))`.
5. UI: fila de pills **Género** (Todas + Damas/Niñas/Niños/Caballeros) **igual patrón que Marca/Estilo**, arriba de Marca.

### Bug B — Filtro **Color** inconsistente

Hoy:

- Opciones en `query-filtros.ts` vienen de `col.nombre`.
- `applyRetailFilters` filtra por `descp_color` (string), no por `color_id`.

Si `descp_color` es NULL o distinto del label del dropdown, el filtro **no reduce filas** → parece roto.

**Fix:** filtrar por **`color_id`** (multi-select de IDs), igual que Línea y Tipo:

```typescript
if (f.colorIds.length) {
  const set = new Set(f.colorIds);
  out = out.filter((r) => r.color_id != null && set.has(r.color_id));
}
```

Renombrar estado: `colores: string[]` → `colorIds: number[]` (breaking interno report only).  
Dropdown Color: opciones `{ id: color_id, label: nombre }`.

### Bug C — Fallback a **demo** enmascara filtros vacíos

`RetailStockClient.tsx`:

```typescript
const columnas =
  configured && data && data.columnas.length > 0 ? data.columnas : STOCK_BOARD_DEMO_COLUMNAS;
```

Si un filtro deja 0 referencias en top 12, la UI **sigue mostrando datos demo** → Director cree que el filtro no hace nada.

**Fix:**

```typescript
const usandoDemo = !configured || (!data && !loading);
const columnas = usandoDemo
  ? STOCK_BOARD_DEMO_COLUMNAS
  : (data?.columnas ?? []);
```

Mostrar mensaje explícito: *"Sin referencias para estos filtros. Limpiar filtros."* cuando `configured && data?.columnas.length === 0`.

### Bug D — Encabezado KPIs no reflejan filtro activo

Tras filtrar, el subtítulo debe mostrar conteos **post-filtro** (ya vienen de `kpis` en API). Verificar que `totalModelos` / `totalPares` usen `data.kpis` filtrados, no totales del lote completo.

### Bug E — Alinear UX con `rimec-web` `FiltrosCatalogo.tsx`

Copiar **misma estructura** (no colores oscuros):

1. Fila **Género** (nuevo)
2. Fila **Marca**
3. Fila **Estilo**
4. Separador
5. Dropdowns **Línea · Color · Tipo 1** + búsqueda `q`

Labels exactos: **"Tipo 1"** (no solo "Tipo").

**Fuera de alcance retail:** ETA, Ofertas (solo catálogo tránsito PP).

---

## Archivos a modificar (`report/`)

| Archivo | Cambio |
|---------|--------|
| `src/lib/retail/retail-filters.ts` | `generoId`, `colorIds`; apply + query string |
| `src/lib/retail/staging-row.ts` | `genero_id`, `color_id` en tipo; SQL SELECT |
| `src/lib/retail/query-filtros.ts` | `generos[]`; color como `{id,label}` |
| `src/app/api/retail/filtros/route.ts` | Pasar generos si hace falta |
| `src/app/retail/components/RetailFiltrosHeader.tsx` | 6 filtros + labels |
| `src/app/retail/RetailStockClient.tsx` | Quitar demo trap; empty state |
| `src/lib/retail/types.ts` | Tipos filtros si aplica |

**Opcional recomendado:** extraer constante compartida

```
report/src/lib/retail/filtros-pilares-canonical.ts
```

Documentar los 6 nombres y query params para que Estadísticas y Bazzar los repliquen después.

---

## Verificación (obligatoria)

```bash
cd C:\Users\hecto\Nexus_Core\report
npm run build
npm run dev
```

En `http://localhost:3000/retail` (o 3001 si puerto ocupado):

| Acción | Resultado esperado |
|--------|-------------------|
| Clic Marca Vizzano | Rejilla cambia; solo refs Vizzano; KPIs bajan |
| Clic Género Damas | Solo líneas de género Damas |
| Dropdown Línea 1122 | Solo esa línea |
| Dropdown Color (1 color) | Solo SKUs con ese `color_id` |
| Dropdown Tipo 1 | Filtra por `tipo_1_id` |
| Combinación imposible | Mensaje vacío, **sin** datos demo |
| Limpiar filtros | Vuelve lote completo |

Capturas en evidencia.

---

## Alcance futuro (NO en esta OT — solo documentar en evidencia)

| Herramienta | Acción posterior |
|-------------|------------------|
| `rimec-web` Estadísticas | Añadir dropdowns Línea, Color, Tipo 1 (faltan 3) |
| `rimec-web` Bazzar/catálogo | Confirmar 6 completos (ya casi OK; género en Header) |
| `report` retail | Esta OT |

---

## Evidencia

`ot/REPORT-RETAIL-FILTROS-6-PILARES-005-EVIDENCIA.md`

---

## Copiar a Claude

```
PRIORIDAD ALTA — OT-REPORT-RETAIL-FILTROS-6-PILARES-005

Repo: C:\Users\hecto\Nexus_Core\report
Diagnóstico: APIs filtran (marca_id en stock-board OK) pero faltan 6 filtros pilares completos.

ARREGLAR:
1) Agregar filtro GÉNERO (genero_id) — falta por completo (filtro #1 de 6)
2) Color: filtrar por color_id, no por string descp_color
3) Quitar trampa STOCK_BOARD_DEMO cuando filtros devuelven 0 columnas
4) Alinear UI con rimec-web FiltrosCatalogo.tsx (6 filtros: género, marca, estilo, línea, color, tipo 1)
5) Labels "Tipo 1", empty state explícito

Referencia: rimec-web/app/components/FiltrosCatalogo.tsx
Instrucciones: ot/en_curso/OT-REPORT-RETAIL-FILTROS-6-PILARES-005.md
Evidencia: ot/REPORT-RETAIL-FILTROS-6-PILARES-005-EVIDENCIA.md

npm run build + probar /retail con capturas antes/después por filtro.
```
