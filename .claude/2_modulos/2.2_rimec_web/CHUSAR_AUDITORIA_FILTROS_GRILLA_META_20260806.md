# CHUSAR — Auditoría filtros · grilla ∥ molécula (AB-CR)

**Código:** `2.2.1.48`  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta**  
**App:** RIMEC Web (`rimec-web`)  
**Relacionados:** **2.2.1.45** ESCOLAR · **2.2.1.46** CP∥PE · **2.2.1.47** instalación · **2.2.1.44** siameses  
**Estado:** 🟢 En prod (`bcc476c` · 2026-08-06) · sesión **2.2.1.50**

---

## 1 · Problema estructural

La grilla (`/api/catalogo/tarjetas` → `catalogoPaginado`) y la molécula (`/api/catalogo/filtros` → RPC + scan + `acotarMetaRpcDesdeFilas`) **no compartían siempre la misma ley**:

| Síntoma | Causa |
|---------|--------|
| Chip ESCOLAR / Carteras “dormido” | `tipo_ids` / estilo / línea / precio en **deferred** mientras grilla iba atrás |
| Molécula «Sin opciones» con grilla OK | Scan dual CP+PE o `acotar` que borraba chips sintéticos (−1/−2/−8) |
| TODOS+Calzado+Carteras (−1) raro | Dual CP corría **antes** del atajo PE de accesorios |

**Ley operativa:** mismo turno → misma ley SQL + misma memoria + mismos chips AB-CR en sidebar.

---

## 2 · Fixes aplicados (local)

### 2.1 Solo PE para AB-CR sintético (grilla + meta)

`peSoloAbcrSinCp` = ESCOLAR (−8) **o** Carteras/Anteojos (−1/−2):

- `catalogoPaginado.ts` → `fetchStockBatchCalzadoTodos` no dual-CP.
- `api/catalogo/filtros/route.ts` → `rowsForFiltrosLegacy` mismo atajo.

`peTieneSubfamiliaAccesorios` **nunca** incluye −8 (ESCOLAR ≠ accesorios).

### 2.2 `acotarMetaRpcDesdeFilas`

`tipos` = `f.todosTipos` (filas + `mergeTiposCatalogoTodos` / AB-CR).  
**Prohibido** filtrar `meta.tipos` por FK de fila y matar −1/−2/−8.

### 2.3 Cliente live

`filtersConOrigenInmediato` incluye estilo, línea, género, colores, tonos, buscar, cadena, familias, precios, lista.  
Deps del `useEffect` de grilla usan `filters.*` (no deferred) en esas dimensiones.  
`hasSidebarFilters` cuenta `precio_min/max/tope`.  
Meta vacía **no** limpia línea/estilo (anti race AB-CR).

### 2.4 Cache

`sortedCatalogCacheKey` + `precio_tope` + `cadena_comercial`.

### 2.5 Audit script

`_audit_scan_acotar_combo.ts` → `peView: true` en SQL PE.

---

## 3 · Smokes

```bash
cd rimec-web
npx tsx scripts/_smoke_abcr_auditoria_fix.ts
npx tsx scripts/_smoke_escolar_abcr.ts
npx tsx scripts/_smoke_escolar_sql.ts
```

Esperado: `SMOKE_ABCR_AUDITORIA PASS` · `PASS_ESCOLAR_ABCR` · `PASS_ESCOLAR_SQL` · `SIN_PEVIEW_COUNT 0`.

---

## 4 · Checklist verificación manual (local :3001)

1. TODOS · Calzado · AB-CR **ESCOLAR** → grilla Molekinha/ho + molécula con estilos/líneas.  
2. TODOS · Calzado · **CARTERAS** (−1) → solo PE, sin flash CP.  
3. Marca + estilo + ESCOLAR → sin «Sin opciones».  
4. Precio min/max → grilla reacciona al instante (live).

---

## 5 · Deploy

Incluido en prod **`bcc476c`** (orden Director **depliega** junto al hotfix precio **2.2.1.49**).  
Cadena ESCOLAR previa: `3eee0e3` · `86cd8f2` · `c8f32b5`.

---

## 6 · Anti-patrones (no repetir)

1. Smoke solo de filas/grilla sin chequear molécula.  
2. Dual CP+PE cuando el chip es sintético solo-PE.  
3. Acotar `tipos` por IDs de fila sin reinyectar AB-CR.  
4. Dejar estilo/línea/precio en deferred si achican grilla.  
5. Auto-clear de línea/estilo cuando meta llega vacía un tick.
