# OT-REPORT-RETAIL-TARJETAS-COMPACTAS-006 — Tarjetas `/retail` con estructura RIMEC Web

**Prioridad:** ALTA (UX y escalabilidad)  
**Director:** Héctor Segovia  
**Ejecutor:** **Gemini**  
**Repo:** `C:\Users\hecto\Nexus_Core\report`  
**Referencia visual:** `C:\Users\hecto\Nexus_Core\rimec-web/app/CatalogoGrid.tsx` (tarjeta `TarjetaProducto`)  
**Estado:** PENDIENTE EJECUCIÓN

---

## Problema (aclaración Director)

Hoy `/retail` muestra tarjetas en 3 columnas (`lg:grid-cols-3`) con **foto enorme** que ocupa toda la card; debajo de la foto vienen las 4 tablas (Tienda_1, Tienda_2, Tienda_3, RIMEC). El **detalle de información de las tablas está perfecto** y se conserva tal cual; **lo que sobra es el tamaño de la foto y el ancho de la card**, que hace que solo entren 3 SKUs por pantalla cuando vamos a tener cientos.

**Objetivo:** reducir el área visual de la foto y compactar el ancho de la card para que entren más columnas. **NO** cambiar la estructura interna (las 4 tablas siguen idénticas).

---

## Resultado esperado

| Aspecto | Antes (`/retail` hoy) | Después |
|---------|----------------------|---------|
| Columnas grilla | 3 fijas | **2 → 3 → 4** según viewport (apuntar a 3-4 en desktop) |
| Foto | Enorme, ocupa casi toda la card | Compacta arriba (`aspect-square` o `aspect-[4/5]` reducido) |
| Tablas Tienda_1/2/3 + RIMEC | Idénticas — se mantienen | **Idénticas — se mantienen sin tocar** |
| Cards visibles en 1440px | 3 | **8 (2 filas × 4)** |
| Estilo | Claro editorial `report-*` | Claro editorial `report-*` (no cambia paleta) |

> **NO** copiar el patrón de `rimec-web` para los datos (eso es para catálogo de compra). El retail conserva su estructura informativa actual. Solo se reduce la foto y se aprieta la grilla.

---

## Estructura final de la tarjeta retail (datos sin cambios)

```
┌──────────────────────────┐
│   [Foto compacta]         ← reducir tamaño
│                           
├──────────────────────────┤
│ L4202 R500 — 37 pares     ← etiqueta existente (sin cambios)
│ ACTVITTA · NAPA RELAX/…   
├──────────────────────────┤
│        34 35 36 37 38 39 40
│  T1 V  —  —  1  —  —  —  —    ← Tabla Tienda_1 (idéntica a hoy)
│     S  1  2  5  2  2  0  0
├──────────────────────────┤
│  T2 V ...                  ← Tabla Tienda_2 (idéntica)
│     S ...
├──────────────────────────┤
│  T3 V ...                  ← Tabla Tienda_3 (idéntica)
│     S ...
├──────────────────────────┤
│  RIMEC | 34(1 2 3 3 2 1)39 ← Tabla Importadora (idéntica)
│        | STOCK 324
└──────────────────────────┘
```

**Tablas Tienda y RIMEC: NO se tocan.** Mismo `<TablaTienda>` y `<TablaImportadora>` actuales — mismas columnas 34-40, misma fila VENTA/STOCK, mismos guiones `—` en ceros (regla `fmt` ya aplicada).

---

## Archivos a editar (mínimos)

| Archivo | Acción |
|---------|--------|
| `src/app/retail/components/RetailStockBoard.tsx` | **Solo**: grilla + tamaño foto en `ColumnaProducto`. NO tocar `TablaTienda` ni `TablaImportadora`. |

**NO tocar:**

- `TablaTienda`, `TablaImportadora` (estructura de información intacta).
- `src/lib/retail/build-stock-board.ts` (lógica de datos OK).
- `src/lib/retail/types.ts` (tipos OK).
- `tailwind.config.ts`, `globals.css`, `src/components/**`.
- `RetailFiltrosHeader.tsx` (otra OT — 005, ya cerrada).
- Lógica de fetch, filtros, batches, KPIs superiores.
- Rutas `/`, `/sales-report`, `/rimec`.

---

## Cambios concretos (mínimos)

### 1. Grilla — `RetailStockBoard` (componente raíz)

Hoy (`RetailStockBoard.tsx:113`):

```tsx
<div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-3 lg:gap-8">
```

Cambiar a:

```tsx
<div className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 pt-6 sm:gap-5 sm:px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

Sin tocar nada más en `RetailStockBoard`.

### 2. Card de producto — `ColumnaProducto` (foto compacta)

Hoy (`RetailStockBoard.tsx:85-105`):

```tsx
function ColumnaProducto({ col }: { col: ColumnaStockRetail }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <RetailProductImage ... />
      </div>
      <p className="text-center font-mono text-[11px] leading-snug text-white/65">{col.etiqueta}</p>
      <div className="flex flex-col gap-3">
        {col.tiendas.map((t) => <TablaTienda ... />)}
        <TablaImportadora ... />
      </div>
    </div>
  );
}
```

Cambiar a (solo foto y proporciones — **las tablas siguen igual**):

```tsx
function ColumnaProducto({ col }: { col: ColumnaStockRetail }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Foto compacta — cuadrada, mucho más chica */}
      <div className="rounded-xl bg-white p-2 shadow-sm border border-report-rule">
        <div className="aspect-square overflow-hidden">
          <RetailProductImage
            alt={col.etiqueta}
            candidates={col.imageCandidates ?? (col.imageSrc ? [col.imageSrc] : [])}
            placeholderClass={col.imagenClass}
            searchFileName={col.imageSearchName}
          />
        </div>
      </div>

      {/* Etiqueta — sin cambios funcionales, solo color */}
      <p className="text-center font-mono text-[10px] leading-snug text-report-muted">
        {col.etiqueta}
      </p>

      {/* Tablas — IDÉNTICAS, sin tocar */}
      <div className="flex flex-col gap-2">
        {col.tiendas.map((t) => (
          <TablaTienda key={`${col.id}-${t.nombre}`} bloque={t} />
        ))}
        <TablaImportadora bloque={col.importadora} />
      </div>
    </div>
  );
}
```

**Cambios respecto al actual:**
- `gap-5` → `gap-2` (menos aire vertical interno).
- `gap-3` entre tablas → `gap-2`.
- Contenedor foto: `p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)]` → `p-2 shadow-sm border border-report-rule` (sombra suave acorde a tema claro).
- Foto envuelta en `<div className="aspect-square overflow-hidden">` para garantizar que sea **cuadrada compacta** (no se estira al ancho de toda la card).
- Texto etiqueta: `text-[11px] text-white/65` → `text-[10px] text-report-muted` (coherente con tema claro).

### 3. Empty state (cuando filtros devuelven 0)

Hoy (líneas 114-117):

```tsx
<p className="col-span-full py-12 text-center text-sm text-white/45">
  Sin columnas para mostrar. Importá un lote en Streamlit o elegí otro batch.
</p>
```

Cambiar a:

```tsx
<div className="col-span-full rounded-2xl border border-dashed border-report-rule bg-white py-16 text-center">
  <p className="text-sm font-semibold text-report-ink">Sin referencias para estos filtros.</p>
  <p className="mt-1 text-xs text-report-muted">Limpiá los filtros o cambiá el lote.</p>
</div>
```

---

## Verificación

```bash
cd C:\Users\hecto\Nexus_Core\report
npm run build      # debe pasar sin errores TS
npm run dev
```

1. `http://localhost:3002/retail` (o el puerto activo).
2. **Antes / después**: contar cuántos SKUs caben en una pantalla 1440px.
   - Antes: ~3.
   - Después: **≥ 8** (idealmente 2 filas × 4 columnas).
3. Resize a móvil (375px): 1-2 columnas, sin desborde, tablas Tienda legibles.
4. Verificar que filtros (de OT-005) siguen reduciendo la grilla.
5. **Las 4 tablas Tienda_1/2/3 + RIMEC se ven IDÉNTICAS a hoy** dentro de cada card (estructura, columnas 34-40, filas VENTA/STOCK, guion `—` en ceros).
6. `localhost:3002/` y `/sales-report`: **idénticos**.

Capturas antes/después en bitácora.

---

## Reglas estrictas

- **NO** cambiar la estructura de información: tablas Tienda_1/2/3 + RIMEC quedan **idénticas**.
- **NO** tocar `TablaTienda`, `TablaImportadora`, ni la función `fmt`.
- **NO** introducir mini-KPIs, badges sobre la foto, drawer, modal ni resúmenes alternativos.
- **NO** copiar carrito/precio/sesión de `rimec-web` — retail NO compra.
- **NO** cambiar paleta `report-*`.
- **Solo** se reduce el tamaño de la foto y se aprieta la grilla.
- Mantener accesibilidad (`alt`, `aria-*`, contraste).

---

## Entregables

| Archivo | Acción |
|---------|--------|
| `src/app/retail/components/RetailStockBoard.tsx` | Solo: grilla + `ColumnaProducto` (foto compacta) + empty state |
| `ot/RESPUESTA_EJECUTOR.md` o `RESPUESTA_ANTIGRAVITY.md` | Bitácora + screenshots antes/después |

---

## Copiar a Gemini

```
OT-REPORT-RETAIL-TARJETAS-COMPACTAS-006 — Foto más chica + grilla más densa (NO tocar las tablas)

Repo: C:\Users\hecto\Nexus_Core\report
ÚNICO archivo a tocar: src/app/retail/components/RetailStockBoard.tsx

Director aclara: la estructura de información (4 tablas Tienda_1/2/3 + RIMEC con
columnas 34-40 y filas VENTA/STOCK) está PERFECTA y se conserva idéntica.
Lo único que sobra es la FOTO (ocupa toda la card) y el ancho de la card (3 cols fijas).

CAMBIOS:
1) Grid: lg:grid-cols-3 → sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
2) En ColumnaProducto: envolver la foto en <div className="aspect-square overflow-hidden">
   y reducir gaps (gap-5 → gap-2, gap-3 → gap-2)
3) Quitar shadow oscuro de la foto (era 0_20px_50px_rgba(0,0,0,0.45));
   usar shadow-sm + border border-report-rule
4) Color de etiqueta: text-white/65 → text-report-muted (tema claro)
5) Empty state: redactar con tema claro

NO tocar: TablaTienda, TablaImportadora, fmt, build-stock-board.ts, types.ts,
tailwind, globals, ni rutas fuera de /retail.

Spec completa: ot/en_curso/OT-REPORT-RETAIL-TARJETAS-COMPACTAS-006.md

Build obligatorio (npm run build).
Antes/después screenshots a 1440px y 375px.
```
