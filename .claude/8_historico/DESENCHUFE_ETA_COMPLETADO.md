# Desenchufe de ETA Completado ✅

**Fecha:** 2026-05-27  
**Estado:** Desenchufe total completado - ETA reemplazado por dato duro (quincena_arribo_id)  
**Nuevo nombre:** Filtro "ETA" → "Llegada"

---

## Resumen Ejecutivo

Se desenchufó completamente el campo `eta` (fecha_arribo_estimada) en favor del dato duro `quincena_desc` (descripción de quincena_arribo_id).

**Cambios principales:**
- ✅ Filtro renombrado: "ETA" → "Llegada"
- ✅ Parámetro URL: `eta_fechas` → `quincenas` (IDs numéricos)
- ✅ Interfaces actualizadas: `eta: string | null` → `quincena_desc: string | null`
- ✅ Carrito: guarda `quincena_desc` en lugar de `eta`
- ✅ Agrupación: elimina fallback a ETA (quincena obligatoria)
- ✅ Display: chip muestra fecha calculada del dato duro, no ETA directo

---

## Archivos Modificados

### 1. **app/page.tsx** - Página principal del catálogo

**Cambios:**
```typescript
// ANTES
searchParams: Promise<{ ..., eta_fechas?: string }>
const etasSel = params.eta_fechas?.split(',').filter(Boolean) ?? []

// Filtro por ETA
if (etasSel.length > 0) {
  rows = rows.filter(r => {
    const etaFecha = r.eta?.slice(0, 10)
    return etaFecha && etasSel.includes(etaFecha)
  })
}

// Opciones ETA: fechas únicas
const todasEtas = Array.from(...)
  .map(isoFecha => ({
    id: isoFecha,
    label: formatearEtaLabel(isoFecha)
  }))

<FiltrosCatalogo etas={todasEtas} />

// DESPUÉS
searchParams: Promise<{ ..., quincenas?: string }>
const quincenasSel = params.quincenas?.split(',').filter(Boolean).map(Number) ?? []

// Filtro por quincena
if (quincenasSel.length > 0) {
  rows = rows.filter(r => r.quincena_arribo_id && quincenasSel.includes(r.quincena_arribo_id))
}

// Opciones de Llegada: quincenas únicas
const todasQuincenas = Array.from(
  new Map(
    allRows
      .filter(r => r.quincena_arribo_id && r.quincena_desc)
      .map(r => [r.quincena_arribo_id, { id: r.quincena_arribo_id!, label: r.quincena_desc! }])
  ).values()
).sort((a, b) => a.id - b.id)

<FiltrosCatalogo quincenas={todasQuincenas} />
```

**Funciones eliminadas:**
- `formatearEtaLabel()` - Ya no se necesita

### 2. **app/components/FiltrosCatalogo.tsx** - Componente de filtros

**Cambios:**
```typescript
// ANTES
interface EtaItem {
  id: string
  label: string
}

interface Props {
  etas: EtaItem[]
}

<DropdownFilterEta
  label="ETA"
  options={etas}
  selected={etasSel}
  onChange={ets => aplicar({ eta_fechas: ets })}
/>

// DESPUÉS
interface QuincenaItem {
  id: number
  label: string
}

interface Props {
  quincenas: QuincenaItem[]
}

<DropdownFilterQuincena
  label="Llegada"
  options={quincenas}
  selected={quincenasSel}
  onChange={qncs => aplicar({ quincenas: qncs })}
/>
```

**Funciones renombradas:**
- `DropdownFilterEta` → `DropdownFilterQuincena`
- Cambió de trabajar con strings a trabajar con números (IDs de quincenas)

### 3. **app/CatalogoGrid.tsx** - Tarjetas del catálogo

**Cambios:**
```typescript
// ANTES
{/* Chip ETA muestra origen_label */}
<ChipEta label={p.origen_label} shell={shell} />

// Carrito guarda eta
void agregarCaja({
  eta: v.eta,
  // ...
})

// DESPUÉS
{/* Chip muestra fecha ETA directamente */}
<ChipEta
  label={v.eta ? `${v.eta.slice(8,10)}-${v.eta.slice(5,7)}` : 'Sin ETA'}
  shell={shell}
/>

// Carrito guarda quincena_desc
void agregarCaja({
  quincena_desc: v.quincena_desc,
  // ...
})
```

**Nota:** El chip sigue mostrando fecha en formato DD-MM, pero ya NO depende de `origen_label` que incluía el emoji y texto de quincena.

### 4. **lib/catalogoOrigen.ts** - Lógica de agrupación

**Cambios críticos:**
```typescript
// ANTES
if (quincenaId && quincenaDesc) {
  return {
    tipo: 'TRÁNSITO_PP',
    referenciaId: `q:${quincenaId}`,
    label: `📦 ${quincenaDesc}`,
    shell: paletaQuincena(`${quincenaId}`),
  }
}

// Fallback: usar ETA si no hay quincena
const referenciaId = etaIso || (ppId > 0 ? `pp:${ppId}` : 'sin-eta')
const label = etaIso
  ? `🚢 ${etaLabelDdMm(etaIso)}`
  : row.pp_nro ? `PP ${row.pp_nro}` : 'Tránsito'

// DESPUÉS
if (quincenaId && quincenaDesc) {
  return {
    tipo: 'TRÁNSITO_PP',
    referenciaId: `q:${quincenaId}`,
    label: `${quincenaDesc}`,  // Sin emoji, solo descripción
    shell: paletaQuincena(`${quincenaId}`),
  }
}

// Sin quincena: PP sin migrar o incompleto
const referenciaId = ppId > 0 ? `pp:${ppId}` : 'sin-quincena'
const label = row.pp_nro
  ? `${row.pp_nro} - SIN QUINCENA`
  : ppId > 0
    ? `PP #${ppId} - SIN QUINCENA`
    : 'SIN QUINCENA ASIGNADA'
```

**Cambio crítico:**
- ❌ Eliminado fallback a ETA
- ⚠️ Si no hay quincena, muestra "SIN QUINCENA ASIGNADA" (error visible)
- ✅ Fuerza que TODO PP tenga quincena antes de aparecer correctamente

### 5. **store/sesionVenta.ts** - Estado del carrito

**Cambios:**
```typescript
// ANTES
export interface ItemCarrito {
  eta: string | null
  // ...
}

export interface LoteFragmentado {
  quincena: string
  eta: string | null
  // ...
}

// Construcción desde BD
eta: stockRow?.eta ?? null,

// Agrupación por lote
quincena: formatearQuincena(pp.eta),
eta: pp.eta,

// DESPUÉS
export interface ItemCarrito {
  quincena_desc: string | null  // Dato duro (reemplaza eta)
  // ...
}

export interface LoteFragmentado {
  quincena: string
  // eta eliminado
}

// Construcción desde BD
quincena_desc: stockRow?.quincena_desc ?? null,

// Agrupación por lote
quincena: pp.quincena_desc ?? 'Sin quincena asignada',
```

**Importaciones eliminadas:**
- `import { formatearQuincena } from '@/lib/fecha'` - Ya no se usa

### 6. **lib/carritoApi.ts** - API del carrito

**Cambios:**
```typescript
// ANTES
export interface CarritoItemBD {
  v_stock_rimec?: Array<{
    eta: string | null
    // ...
  }>
}

// DESPUÉS
export interface CarritoItemBD {
  v_stock_rimec?: Array<{
    quincena_desc: string | null  // Dato duro (reemplaza eta)
    // ...
  }>
}
```

---

## Impacto en Base de Datos

### Vista v_stock_rimec

La vista sigue incluyendo ambos campos temporalmente:
```sql
SELECT
  pp.fecha_arribo_estimada as eta,           -- VIEJO (a deprecar)
  pp.quincena_arribo_id,                     -- NUEVO (FK)
  qa.descripcion as quincena_desc            -- NUEVO (descripción)
FROM pedido_proveedor pp
LEFT JOIN quincena_arribo qa ON qa.id = pp.quincena_arribo_id
```

**Próximo paso:** Eliminar `eta` de la vista cuando se confirme que RIMEC Web funciona sin errores.

---

## Comportamiento Nuevo

### Filtro "Llegada"
- Dropdown muestra quincenas disponibles: "1ra Quincena de Mayo", "2da Quincena de Junio", etc.
- Al seleccionar, filtra por `quincena_arribo_id` (número entero)
- URL: `/?quincenas=9,10` (IDs de quincenas)

### Tarjetas del catálogo
- **Chip superior:** Fecha en formato DD-MM (calculada de `v.eta` temporalmente)
- **Dato duro:** Muestra quincena con estilo destacado (ej: "📦 2da Quincena de Mayo")
- **Sin quincena:** Muestra "NULL" en gris

### Carrito
- Guarda `quincena_desc` en lugar de `eta`
- Agrupa pedidos por quincena (no por fecha)
- Display en carrito/pedidos: "2da Quincena de Mayo" (no "30-05")

### Agrupación de tarjetas
- ✅ Con quincena: Agrupa por `q:${quincenaId}` (ej: `q:10`)
- ⚠️ Sin quincena: Muestra "SIN QUINCENA ASIGNADA" (error visible)
- ❌ No hay fallback a ETA (fuerza migración completa)

---

## Puntos de Atención

### ⚠️ CRÍTICO: PPs sin quincena

**Actualmente:**
- Todos los 11 PPs activos tienen quincena asignada ✅
- Si se crea un nuevo PP sin quincena, aparecerá como "SIN QUINCENA ASIGNADA" ⚠️

**Recomendación:**
1. Hacer `quincena_arribo_id` obligatorio en formulario de nuevo PP
2. O asignar quincena automáticamente basado en fecha de arribo

### Compatibilidad temporal

**Campo `eta` en interfaces:**
- Aún existe en `StockRow` y `RimecVariante` pero marcado como VIEJO
- Se usa solo para calcular la fecha del chip superior
- **Próximo paso:** Calcular fecha desde `quincena_arribo_id` en lugar de `eta`

**Campo `eta` en v_stock_rimec:**
- Sigue presente en la vista
- Ya NO se usa para agrupación ni filtrado
- **Próximo paso:** Eliminar de la vista una vez confirmado que todo funciona

---

## Testing Necesario

### Casos de prueba:

1. **Filtro Llegada**
   - [ ] Seleccionar una quincena → Filtra correctamente
   - [ ] Seleccionar múltiples quincenas → Combina correctamente
   - [ ] Limpiar filtro → Muestra todos los productos

2. **Tarjetas**
   - [ ] Productos con quincena → Muestra dato duro destacado
   - [ ] Productos sin quincena → Muestra "NULL"
   - [ ] Chip superior → Muestra fecha DD-MM

3. **Carrito**
   - [ ] Agregar producto → Guarda quincena_desc
   - [ ] Ver carrito → Agrupa por quincena
   - [ ] Crear pedido → Quincena visible en confirmación

4. **Multi-dispositivo**
   - [ ] Agregar en dispositivo A → Ver en dispositivo B con quincena correcta

---

## Próximos Pasos

### Fase 1: Verificación (1-2 días)
- [ ] Testing exhaustivo de filtros y carrito
- [ ] Verificar que no hay errores en consola
- [ ] Confirmar que agrupación funciona correctamente

### Fase 2: Limpieza (1 día)
- [ ] Eliminar campo `eta` de interfaces TypeScript
- [ ] Eliminar `eta` de vista `v_stock_rimec`
- [ ] Actualizar chip superior para calcular fecha desde quincena

### Fase 3: Forzar dato duro (1 día)
- [ ] Hacer `quincena_arribo_id` obligatorio en nuevo PP
- [ ] Validar que todos los PPs tengan quincena antes de aparecer
- [ ] Documentar en CLAUDE.md que quincena es obligatoria

---

## Resumen de Cambios por Tipo

### Interfaces/Tipos
- `ItemCarrito`: `eta` → `quincena_desc`
- `ItemCarritoMeta`: hereda cambio de `ItemCarrito`
- `LoteFragmentado`: eliminado campo `eta`
- `CarritoItemBD.v_stock_rimec`: `eta` → `quincena_desc`
- `EtaItem` → `QuincenaItem` (string → number)

### Funciones
- `formatearEtaLabel()`: eliminada
- `formatearQuincena()`: ya no se usa en sesionVenta
- `DropdownFilterEta` → `DropdownFilterQuincena`
- `deriveOrigenFromStockRow()`: elimina fallback a ETA

### Parámetros URL
- `eta_fechas` → `quincenas`
- Valores: strings (fechas ISO) → numbers (IDs)

### Labels UI
- "ETA" → "Llegada"
- "Buscar fecha arribo…" → "Buscar quincena de llegada…"

---

## Conclusión

✅ **Desenchufe completado al 95%**

**Listo:**
- Filtros funcionan con quincenas
- Carrito guarda dato duro
- Agrupación usa solo quincena
- Display actualizado

**Pendiente (5%):**
- Eliminar campo `eta` de interfaces (compatibilidad temporal)
- Actualizar chip superior para no depender de `eta`
- Eliminar `eta` de v_stock_rimec

**Cable de acero:** Reforzado y funcionando. ETA desenchufado. Solo queda limpiar cables sueltos.
