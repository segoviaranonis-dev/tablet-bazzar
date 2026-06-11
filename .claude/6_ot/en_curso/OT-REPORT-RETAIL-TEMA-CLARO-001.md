# OT-REPORT-RETAIL-TEMA-CLARO-001 — Unificar `/retail` con la estética clara del informe

**Prioridad:** Media-Alta (UX)  
**Director:** Héctor Segovia  
**Ejecutor:** **Gemini**  
**Repo:** `C:\Users\hecto\Nexus_Core\report`  
**Ámbito:** SOLO ruta `localhost:3001/retail` (NO tocar `/`, `/sales-report`, `/rimec`, ni Sales)  
**Estado:** PENDIENTE EJECUCIÓN

---

## Contexto visual (Director)

El catálogo retail tiene dos zonas con estéticas **incoherentes**:

| Zona | Estado hoy | Director quiere |
|------|------------|-----------------|
| Encabezado de página + KPIs + secciones "Resumen operativo / Pilares" | ✅ **Estilo claro, elegante**, fondo crema, serif, navy oscuro | Mantener tal cual |
| Cliente del catálogo (filtros + tarjetas de producto + rejilla de stock) | ❌ **Fondo negro/oscuro**, texto blanco translúcido | **Migrar al MISMO estilo claro** del bloque superior |

**Aplicar a:** solo `/retail`.  
**Inicio (`/`) y Sales Report:** intocables. **No** cambiar `tailwind.config.ts`, `globals.css`, `ReportAppNav`, `ReportFooter`, `ReportSection`, ni nada en `src/components/`.

---

## Paleta que YA existe (usar estos tokens — no inventar colores)

Definidos en `report/tailwind.config.ts` → `colors.report.*`:

| Token | Hex | Uso sugerido |
|-------|-----|---------------|
| `report-paper` | `#faf8f4` | Fondo de página (ya aplicado en `page.tsx`) |
| `report-paper2` | `#f3f1ec` | Fondos secundarios (chips, code) |
| `report-ink` | `#1c1b19` | Texto principal |
| `report-navy` | `#0a2342` | Números/títulos serif destacados |
| `report-navy2` | `#133a5c` | Hover / acentos navy |
| `report-rule` | `#dcd6cc` | Bordes finos |
| `report-gold` | `#7a6233` | Acentos editoriales (números de sección "1.", "2." ya lo usan) |
| `report-muted` | `#5c5852` | Texto secundario, labels |

Fuentes ya configuradas: `font-serif` (Georgia stack) y `font-sans`. Reusarlas.

**Inspiración exacta:** mirá cómo se ven hoy las KPI cards de `src/app/retail/page.tsx` (cuadros blancos con borde `report-rule` y números `font-serif text-report-navy`). **Ese** es el lenguaje.

---

## Archivos a editar (3, solo dentro de `src/app/retail/`)

### 1. `src/app/retail/RetailStockClient.tsx`

Hoy el `<section>` y los contenedores usan colores oscuros (`text-white/50`, `bg-black/40`, `border-white/20`). Reemplazar **todos** los `text-white/*`, `bg-black/*`, `bg-white/[0.04]`, `border-white/*` por la paleta `report-*`.

**Patrón de mapeo:**

| Antes (oscuro) | Después (claro) |
|---------------|-----------------|
| `bg-black/40` | `bg-white` |
| `bg-white/[0.04]` | `bg-report-paper2` |
| `text-white` | `text-report-ink` |
| `text-white/85` o `text-white/65` | `text-report-ink` |
| `text-white/50` o `text-white/45` | `text-report-muted` |
| `text-white/35` | `text-report-muted/70` |
| `text-amber-300` | `text-amber-700` |
| `text-emerald-300/90` | `text-emerald-700` |
| `text-red-300` | `text-red-700` |
| `border-white/20` o `border-white/15` | `border-report-rule` |
| Sombras oscuras `shadow-[0_20px_50px_rgba(0,0,0,0.45)]` | `shadow-sm` o `shadow-md` |

**Sección `RetailBatchControls`** (selector "Lote" + botón "Actualizar"):

- `<select>`: `border border-report-rule bg-white px-2 py-1 text-xs text-report-ink rounded`.
- Botón "Actualizar": fondo `bg-report-navy text-white hover:bg-report-navy2` (en lugar de gradiente oscuro). Mantener tipografía sans.

**Encabezado "Stock retail"** y `94 referencias · 270 pares`:

- Título: `font-serif text-3xl text-report-navy`.
- Subtítulo: `text-sm text-report-muted`.

**Mensajes de Pilares (OK / pendientes)**:

- OK: `text-emerald-700`.
- Pendientes (amber): `text-amber-700`.
- Error: `text-red-700`.

### 2. `src/app/retail/components/RetailFiltrosHeader.tsx`

Hoy las píldoras de filtros tienen estética dark (fondos `bg-white/5`, texto `text-white/80`, anillos brillantes `RIMEC_BLUE`/`RIMEC_CELESTE`).

Reemplazar por:

- **Card del bloque filtros**: `bg-white border border-report-rule rounded-2xl shadow-sm p-4`.
- **Pill seleccionada**: `bg-report-navy text-white border-report-navy`.
- **Pill no seleccionada**: `bg-white text-report-ink border-report-rule hover:bg-report-paper2`.
- **Labels "MARCA / ESTILO / LÍNEA / COLOR / TIPO"**: `text-[10px] font-semibold uppercase tracking-wider text-report-muted`.
- **Input de búsqueda "Buscar línea, ref, marca…"**: `bg-white border-report-rule text-report-ink placeholder:text-report-muted/70`.
- **NO usar** las constantes `RIMEC_BLUE` ni `RIMEC_CELESTE` para fondos en /retail — esos colores son del módulo RIMEC dark, no del informe claro. Si las dejás definidas, mantenelas para que TS no rompa, pero **no las apliques en clases visibles** dentro de este componente.

### 3. `src/app/retail/components/RetailStockBoard.tsx`

La rejilla de stock (Tienda_1 / Tienda_2 / Tienda_3 + RIMEC) hoy es negra. Volverla clara:

- **Tarjeta de producto (`ColumnaProducto`)**: ya tiene `rounded-2xl bg-white p-3`. **Mantener el fondo blanco de la foto** (`bg-white`) pero el contenedor padre debe respirar sobre `report-paper`. Cambiar la sombra: `shadow-sm` (sin shadow gigante negra).
- **Etiqueta de producto (`p.etiqueta`)**: `text-report-ink` (era `text-white/65`).
- **Tabla por tienda (`TablaTienda`)**:
  - Borde de tabla: `border border-report-rule`.
  - Header de tallas: `bg-report-paper2 text-report-ink`.
  - Celda "VENTA/STOCK label": `bg-report-paper2 text-report-muted`.
  - Celdas numéricas: `text-report-ink` (mantener `tabular-nums`).
  - Filas hover: opcional `hover:bg-report-paper2/60`.
- **Tabla importadora (`TablaImportadora`)**: misma paleta clara.
  - Número grande del stock RIMEC: `font-serif text-2xl text-report-navy`.
  - Label "STOCK": `text-report-muted`.
  - Etiqueta de grada (`34(1 2 3 3 2 1)39`): `font-mono text-report-ink`.
- **No tocar** la función `fmt` (acabamos de ajustarla: `0` → `—`).

---

## Reglas estrictas (cumplir todas)

1. **NO** modificar `tailwind.config.ts`, `globals.css`, ni componentes en `src/components/`.
2. **NO** tocar archivos fuera de `src/app/retail/**`.
3. **NO** introducir colores nuevos: usar exclusivamente los tokens `report-*` y utilidades estándar de Tailwind (`emerald-700`, `amber-700`, `red-700` para semánticos).
4. **NO** romper la responsividad existente (grid de 3 columnas en `lg:grid-cols-3`).
5. **NO** alterar la lógica de datos, fetch, filtros ni estados; solo clases CSS.
6. La página `/` (inicio) y `/sales-report` deben verse **idénticas** después del cambio.

---

## Verificación visual (Director)

1. `cd C:\Users\hecto\Nexus_Core\report && npm run dev` (puerto 3001 o el que esté en uso).
2. Abrir `http://localhost:3001/retail`:
   - Fondo crema claro (`report-paper`) **en toda la página**, incluyendo cliente y rejilla.
   - Tarjetas de producto sobre fondo claro, foto en card blanca con sombra suave.
   - Filtros: pills blancas/navy, no oscuras.
   - Tablas Tienda_n / RIMEC: bordes finos `report-rule`, números legibles oscuros sobre claro.
3. Abrir `http://localhost:3001/` y `http://localhost:3001/sales-report`:
   - **Sin cambios**.
4. Tomar 1 screenshot antes / 1 después de `/retail` y adjuntar en bitácora.

---

## Entregables

| Archivo | Acción |
|---------|--------|
| `report/src/app/retail/RetailStockClient.tsx` | Reescribir clases CSS dark → tokens `report-*` |
| `report/src/app/retail/components/RetailFiltrosHeader.tsx` | Pills, inputs y card en estilo claro editorial |
| `report/src/app/retail/components/RetailStockBoard.tsx` | Tablas y bloques en paleta clara |
| `ot/RESPUESTA_EJECUTOR.md` o `ot/RESPUESTA_ANTIGRAVITY.md` | Bitácora corta + screenshots antes/después |

**No** crear archivos nuevos. **No** commitear sin auditoría de Cursor.

---

## Build check (obligatorio antes de avisar al Director)

```bash
cd C:\Users\hecto\Nexus_Core\report
npm run build
```

Debe terminar **sin errores TS** ni de Tailwind. Si Tailwind purga alguna clase nueva, ajustar (todas las usadas en esta OT ya están en `tailwind.config.ts`).

---

## Copiar a Gemini

```
OT-REPORT-RETAIL-TEMA-CLARO-001 — Unificar /retail con estética clara del informe

Repo: C:\Users\hecto\Nexus_Core\report
Solo tocar: src/app/retail/**

Hoy /retail tiene encabezado claro elegante (KPIs, "Resumen operativo")
pero el cliente del catálogo (filtros + tarjetas + rejilla de stock)
sigue en fondo negro. Migrar SOLO ese cliente al mismo estilo claro,
usando los tokens report-* que ya están en tailwind.config.ts.

NO tocar: tailwind.config.ts, globals.css, src/components/**,
ni las rutas / y /sales-report (deben seguir idénticas).

Mapeo dark→claro y reglas: ot/en_curso/OT-REPORT-RETAIL-TEMA-CLARO-001.md

Build obligatorio (npm run build) y screenshot antes/después.
Avisar a Cursor para auditoría visual antes de commit.
```
