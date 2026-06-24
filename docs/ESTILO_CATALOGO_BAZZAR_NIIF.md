# Catálogo Tablet Bazzar — Estilo Bazzar NIIF (Chusar)

**Versión:** 1.1  
**Fecha:** 2026-06-20  
**Decisión Director:** Documenta · catálogo con más vida y naranja institucional  
**App:** `tablet-bazzar` · puerto **3000**  
**Rutas:** `/cadena` (entrada filtros) · `/cadena/vista` (producto + POS)

---

## Objetivo

Unificar el catálogo táctil con el lenguaje visual de **bazzar-web** y **rimec-web**, manteniendo el **shell NIIF** (fondo celeste, cards blancas, texto slate) y usando el **naranja Bazzar `#ea580c`** como acento principal de marca — no el régimen crema/Banana Republic.

---

## Paleta catálogo

| Token | Hex | Uso |
|-------|-----|-----|
| Fondo NIIF | `#f1f5f9` | `bg-app-bg` — página |
| Azul RIMEC | `#002B4E` | Títulos secundarios, línea en código L.R |
| Naranja Bazzar | `#ea580c` | CTAs, chips activos, referencia, badges pares |
| Naranja oscuro | `#c2410c` | `:active`, gradiente CTA |
| Naranja claro | `#fb923c` | Gradientes tabs/chips |
| Crema acento | `#fff7ed` | Hover filas, paneles abiertos |

**Prohibido:** `#f4f1ec` crema salón, Cormorant/`font-br`, tema oscuro.

---

## Clases CSS (`app/globals.css`)

| Clase | Rol |
|-------|-----|
| `.bazzar-band` | Header gradiente navy → naranja |
| `.bazzar-band-subtle` | Franja stats SKUs/pares |
| `.bazzar-badge` / `.bazzar-badge-navy` | Pills contadores |
| `.bazzar-card` / `.bazzar-card-accent` | Panel filtros (borde top naranja) |
| `.bazzar-ref-row` | Fila referencia en listado entrada |
| `.bazzar-btn-primary` | INGRESAR — gradiente naranja |
| `.chip-filter` / `.chip-filter-active` | Pills género/marca/estilo |
| `.bazzar-input` | Búsqueda con focus naranja |
| `.tile-selected` | Selección talla/color — borde naranja |

---

## Componentes

| Componente | Archivo |
|------------|---------|
| Header entrada catálogo | `components/cadena/CadenaEntradaHeader.tsx` |
| Header vista producto | `components/cadena/CadenaVistaHeader.tsx` |
| Filtros triángulo | `components/cadena/FiltrosCabecera.tsx` |
| Tabs depósito | `components/cadena/SelectorDepositos.tsx` |
| Strip filtros activos | `components/cadena/TrianguloResumenStrip.tsx` |
| Hero L.R + estilo | `components/cadena/LineaReferenciaHero.tsx` |
| Grada + carrito | `components/pos/GradaVentaStrip.tsx` |
| Sheet venta | `components/pos/PosCartSheet.tsx` |

---

## Referencia visual (bazzar-web)

Patrones tomados de `bazzar-web/app/(public)/catalogo/`:

- Línea en navy · referencia en naranja (`ProductoCard.tsx`)
- Badges marca/estilo con fondo naranja suave
- Cards con `box-shadow` suave y hover/active naranja
- CTA primario naranja (`btn-primary` → `.bazzar-btn-primary`)

---

## Verificación

1. `http://localhost:3000/cadena` — banda gradiente, chips naranja, filas con acento izquierdo
2. INGRESAR → `/cadena/vista` — header banda, hero L.R bicolor, footer naranja suave
3. Tocar grada → carrito con badge naranja; COBRAR naranja

Doc NIIF holding: `.claude/1_fundamentos/1.3_politicas/niif_estandar_visual.md`
