# OT-RIMEC-WEB-FILTRO-ETA-001 — Filtro ETA (fecha de arribo) en catálogo

**Prioridad:** P1 — foco actual rimec-web  
**Ejecutor:** Claude Code  
**Director:** Héctor Segovia  
**Repo:** `Nexus_Core/rimec-web/`  
**Estado:** CERRADA — 2026-05-19 (Director: LISTO)

---

## Objetivo

Agregar en el **catálogo mayorista** (`/`) un filtro **multiselect** igual al de **Tipo 1**, para que el vendedor filtre productos en **tránsito** por **fecha ETA** (fecha de arribo estimada del PP).

Referencia visual Director: captura — dropdown junto a «Tipo 1»; la fecha en tarjeta es la del 🚢 (ej. `15-06`).

---

## Contexto técnico (auditoría Cursor)

| Dato | Origen |
|------|--------|
| Campo `eta` en filas | Vista `v_stock_rimec` → `pedido_proveedor.fecha_arribo_estimada` |
| UI tarjeta 🚢 | `CatalogoGrid.tsx` — formatea `eta` como `DD-MM` |
| Filtro Tipo 1 (patrón) | `FiltrosCatalogo.tsx` → `DropdownFilterId` + query `tipo_ids` |
| Página catálogo | `app/page.tsx` — filtra `rows` por searchParams |

**No requiere migración SQL** si `v_stock_rimec` ya expone `eta` (script `fix_v_stock_rimec.py`).

---

## Alcance

### Incluir

1. **Dropdown multiselect «ETA»** (o «Arribo») en la fila de filtros, al lado de Tipo 1.
2. Opciones = fechas ETA **distintas** presentes en el stock actual (solo filas con `eta` no nulo).
3. Etiqueta visible: **`DD-MM`** (misma convención que la tarjeta 🚢).
4. Valor en URL: fechas ISO `YYYY-MM-DD` separadas por coma — param **`eta_fechas`**.
5. Filtrado en `page.tsx`: mostrar modelos que tengan **al menos una variante** con ETA en el conjunto seleccionado (misma semántica que colores/tipos).
6. Persistir en `aplicar()` + «Limpiar filtros» incluye `eta_fechas`.
7. Contadores (modelos / pares) respetan el filtro.

### No incluir (fuera de alcance)

- Cambiar formato de la etiqueta 🚢 en tarjeta (ya existe).
- Filtro por rango de fechas (solo multiselect de fechas discretas v1).
- Bazzar-web (solo rimec-web salvo que Director pida paridad después).

---

## Diseño UX (copiar Tipo 1)

```text
[Línea ▼] [Color ▼] [Tipo 1 ▼] [ETA ▼]  [Ofertas]
```

- Mismo componente `DropdownFilterId` **o** `DropdownFilter` con `string` (fechas ISO).
- Badge en botón: `3` si hay 3 fechas seleccionadas (igual Tipo 1).
- Placeholder: `Buscar fecha arribo…`

---

## Implementación sugerida

### 1. `app/page.tsx`

```typescript
// searchParams
eta_fechas?: string  // "2025-06-15,2025-07-01"

const etasSel = params.eta_fechas?.split(',').filter(Boolean) ?? []

// Tras cargar allRows:
const todasEtas = buildOpcionesEta(allRows)  // { id: '2025-06-15', label: '15-06' }[]

if (etasSel.length) {
  rows = rows.filter(r => {
    const d = r.eta?.slice(0, 10)
    return d && etasSel.includes(d)
  })
}
```

Helper `buildOpcionesEta`:

- Agrupar por `eta.slice(0,10)`
- Ordenar cronológico
- `label`: `DD-MM` desde ISO (misma lógica que `CatalogoGrid`)

### 2. `app/components/FiltrosCatalogo.tsx`

- Prop `etas: FilterItem[]` (id = ISO string, label = DD-MM) **o** `FilterItem` con id numérico hash — preferir **string ISO** en `DropdownFilter` existente para colores.
- `etaSel` desde `searchParams.get('eta_fechas')`
- `aplicar({ eta_fechas?: string[] })` → `params.set('eta_fechas', ...)`
- `hayFiltros` incluye `etaSel.length`

### 3. `lib/filtros.ts` (opcional)

Si conviene poblar ETAs globales desde `v_stock_rimec` en SSR de filtros — o calcular solo en `page.tsx` desde `allRows` (más simple y coherente con stock filtrado por marca/estilo).

**Recomendación:** calcular `todasEtas` en `page.tsx` desde `allRows` **antes** de aplicar otros filtros, para que el dropdown muestre todas las fechas del catálogo base; o **después** de marca/estilo para fechas contextuales — **preguntar Director**: preferencia **todas las ETAs del catálogo** (más útil para multiselect).

**Default Cursor:** opciones desde `allRows` **sin** filtrar por estilo/marca (catálogo completo), igual que tipos en `getFiltros()`.

### 4. Tipos

- Extender `searchParams` Promise type en `HomePage`.
- Sin cambios en `v_stock_rimec` si `eta` ya viene.

---

## Pruebas (checklist)

| # | Caso | Esperado |
|---|------|----------|
| T1 | Sin selección ETA | Mismo catálogo que hoy |
| T2 | Una fecha ETA | Solo modelos con variante 🚢 esa fecha |
| T3 | Varias fechas | Unión (OR) de ETAs |
| T4 | URL compartible | `?grupo_estilo_id=…&eta_fechas=2025-06-15` restaura filtro |
| T5 | Limpiar filtros | Quita `eta_fechas` |
| T6 | Tarjeta sin eta | No aparece al filtrar una fecha concreta |

---

## Git

- Commit solo si Director lo pide en la OT de deploy; si no, commit dedicado:  
  `feat(rimec-web): filtro multiselect ETA en catálogo`

---

## Entregables

| Archivo | Acción |
|---------|--------|
| `ot/RESPUESTA_EJECUTOR.md` | Resumen + captura |
| Código en `rimec-web/` | Según alcance |

**Estado final:** `LISTO_PARA_AUDITORIA`

---

## Mensaje para Claude

```
Ejecuta la OT
```

Abrir este archivo. **No tocar** `control_central` salvo que falte `eta` en vista (verificar query a `v_stock_rimec`).
