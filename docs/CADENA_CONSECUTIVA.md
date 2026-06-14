# Cadena consecutiva — Modo de vista

**Rutas:** `/cadena` · `/cadena/vista?cliente_id=&marca=`  
**Estado:** UI + backend titanio cerrados 2026-06-11. Precio LPN: pendiente.

---

## Propósito

Recorrer el catálogo de una **marca** en una tienda como una **cadena ordenada** de pares línea+referencia (L+R), con foto grande, variantes de color/material y filtros multi-select — pensado para tablet en landscape.

---

## Ley de agrupación (2 niveles)

Documento canónico holding: `.claude/2_modulos/2.4_tablet_bazzar/agrupacion_dos_niveles.md`

| Nivel | Clave | UI en cadena |
|-------|-------|----------------|
| **1 — Principal** | `linea` + `referencia` + `material` | Mazo de naipes (colores apilados) abajo-derecha |
| **2 — Color** | `color_id` / `color_code` | Swipe ↑↓ · tap en mazo · filtro Color (pendiente UI) |
| **Cadena** | `linea` + `referencia` (sin material) | Carruseles vertical + horizontal · swipe ←→ |

Implementación: `lib/cadena.ts` → `buildCadenaFromFilas`, `ParLineaRef`, `GrupoPrincipal`.

---

## Flujo de pantallas

```
/login → / (panel) → /cadena
                        ├─ chips depósito (6 tiendas)
                        ├─ filtros SQL (GET /filtros)
                        ├─ INGRESAR (POST /ingresar → cookie turno 12 h)
                        └─ /cadena/vista?marca=…&pi=…
                              └─ stock live (GET /live cada 4 s)
```

---

## Layout vista (`app/cadena/vista/page.tsx`)

```
┌──────────────────────────────────────────────────────────────────┐
│ ← │ MARCA │ ⌕  (header táctil)                                   │
├────┬─────────────────────────────────────────────┬───────┬───────┤
│[E] │                                             │ [R]   │ L+R   │  ← solo si >1 ref
│ s  │   HERO — foto object-contain                │  e    │ vert  │
│ t  │   overlay: estilo (tap) · ref (tap)         │  f    │ naipes│
│ i  │   tap centro = detalle                      │       ├───────┤
│ l  │   swipe / flechas ←→ = L+R o material       │       │ MAZO  │
│ o  │   swipe / flechas ↑↓ = color                │       │ colores│
│    │                                             │       │       │
├────┴─────────────────────────────────────────────┴───────┴───────┤
│ Footer: naipes horizontales L+R+MAT (material) — sin ◀▶ visibles │
└──────────────────────────────────────────────────────────────────┘

[E] = panel Estilo (colapsable, oculto por defecto, ~108px)
[R] = panel Referencia (colapsable, oculto por defecto, ~116px)
```

### Paneles colapsables (decisión 2026-06-11)

| Panel | Cómo abrir/cerrar | Contenido |
|-------|-------------------|-----------|
| **Estilo** | Tap en nombre de estilo del hero (o botón «Estilos» si sin resultados) | `MultiSelectFlotante` izquierda |
| **Referencia** | Tap en `linea.referencia` del hero (o botón «Referencias») | `MultiSelectFlotante` derecha |

- **Ocultos por defecto** — no ocupan espacio hasta el tap.
- **Segundo tap** en el mismo control → cierra el panel.
- Tap en un chip **dentro** del panel → toggle filtro; **no** cierra el panel.
- Componente wrapper: `PanelColapsable` en `page.tsx` (transición width 200ms).

### Aside derecho (cadena secundaria + nivel 1)

- **Carrusel vertical L+R:** solo si `paresNav.length > 1` — cadena secundaria, sin duplicar tarjetas.
- **Mazo colores (L+R+Mat):** siempre visible — stack apilado; navegación de **color** (↑↓ / tap).
- Se alimenta con `paresNav` = `pares` filtrados, o `paresAll` si el filtro deja 0 resultados en hero.

### Footer (nivel 1 — L+R+material)

- **CarruselMateriales:** una tarjeta por triplete L+R+Mat del par activo.
- Sin botones ◀▶ visibles; flechas teclado ←→ cuando hay una sola ref en cadena.
- Evita duplicación infinita de la misma foto (bug corregido 2026-06-11).

Doc detallada: [NAVEGACION_CADENA.md](./NAVEGACION_CADENA.md)

### Estilo visual (Banana Republic)

- Crema `#f4f1ec`, carbón `#1a1a1a`, acento navy `#1b2a41`
- Serif **Cormorant Garamond** (`.font-br`) en títulos de estilo
- Chips de filtro con CSS explícito (`.chip-br`) — contraste alto en tablet
- Fondo sutil que cambia al cambiar par L+R (`cadenaBackgroundStyle` en `lib/product-image.ts`)

---

## Navegación táctil y teclado

| Gesto / tecla | Acción |
|---------------|--------|
| Swipe ← / **ArrowRight** | Siguiente: L+R si hay varias refs; **material** si hay una sola ref |
| Swipe → / **ArrowLeft** | Anterior (misma regla) |
| Swipe ↑ / **ArrowUp** | Color anterior (material activo) |
| Swipe ↓ / **ArrowDown** | Color siguiente |
| Tap centro hero | Abre/cierra panel detalle |
| Bordes laterales invisibles del hero | Mismo ←→ que swipe |
| Sidebar vertical naipes | Salto directo a par L+R (si >1) |
| Footer materiales | Salto directo a L+R+Mat |
| Tap mazo colores | Rota color del grupo activo |
| Tap **estilo** en hero | Abre/cierra panel Estilo |
| Tap **referencia** en hero | Abre/cierra panel Referencia |

Hooks: `lib/use-touch-nav.ts` · `lib/use-cadena-keyboard.ts`  
**Sin botones ◀▶ visibles** en footer ni carruseles.

---

## Filtros (multi-select en paneles)

**Componente:** `components/cadena/MultiSelectFlotante.tsx`  
**Eliminado:** `FiltrosElegantes.tsx` (reemplazado por paneles colapsables)

| Dimensión | Ubicación | Comportamiento |
|-----------|-----------|----------------|
| **Estilo** | Panel izquierdo colapsable | Tap chip = toggle. Varios = OR |
| **Referencia** | Panel derecho colapsable | Tap `4135.384` = toggle. Varios = OR |
| **Color** | Pendiente | Misma UX colapsable cuando Director lo pida |

**Lógica:**

- Sin selección en una columna → no filtra esa dimensión (muestra todos)
- Estilo + referencia activos → **AND** entre columnas
- Cascada: opciones de referencia se acotan si hay estilos elegidos
- Cabecera de columna con selección → «N · limpiar»
- Estado vacío: hero muestra «Sin coincidencias · limpiar» + botones Estilos/Referencias

Estado: `FiltrosCadena` en `lib/cadena-filtros.ts` (`estilos[]`, `referenciaKeys[]`, `colorCode` reservado).

---

## Búsqueda por código

Modal ⌕ en header. Formatos (`lib/codigo-busqueda.ts`):

- `1122.828` — par L+R
- `1122.828-100` — + material
- `1122.828-100-5` — + color

---

## Imágenes y velocidad

- Miniaturas: bucket `productos/thumbs/` primero (convención RIMEC/Report)
- Fallback a `productos/` full size
- Prefetch de vecinos L+R y colores del par activo: `lib/prefetch-images.ts`
- Sin foto: gradiente navy RIMEC + código L·R (no emoji): `components/ProductImage.tsx`

Ver [IMAGENES_PRODUCTO.md](./IMAGENES_PRODUCTO.md).

---

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `app/cadena/vista/page.tsx` | Orquestación, `PanelColapsable`, `paresNav`, aside fijo |
| `lib/cadena.ts` | Tipos, build cadena, dedupe colores |
| `lib/cadena-filtros.ts` | Filtros cascada, `toggleEstilo`, `toggleReferencia` |
| `lib/cadena-carousel.ts` | Preview thumb por par |
| `lib/codigo-busqueda.ts` | Parser + resolver índices |
| `components/cadena/CarruselNaipesLR.tsx` | Naipes L+R (sidebar vertical) |
| `components/cadena/CarruselMateriales.tsx` | Naipes L+R+Mat (footer) |
| `components/cadena/MazoMaterialNaipes.tsx` | Stack colores Nivel 1 |
| `lib/use-cadena-keyboard.ts` | Flechas teclado ←→ ↑↓ |
| `lib/filtros-url.ts` | Params URL; parser `refs` (coma entre claves) |
| `components/cadena/LineaReferenciaHero.tsx` | Overlay + toggles paneles estilo/ref |
| `components/cadena/MultiSelectFlotante.tsx` | Columnas multi-select |
| `components/cadena/TouchPad.tsx` | Target táctil ≥52px |

---

## Pendiente (no bloquea demo UI)

- [ ] Filtro **Color** con panel colapsable (mismo patrón)
- [ ] Resolución **precio LPN** desde triplete + evento Motor (server API)
- [ ] Agregar al carrito / ticket ORO desde cadena
- [ ] Persistir último depósito/marca en sesión local
- [ ] Service worker caché catálogo offline

---

**Última actualización:** 2026-06-11 (navegación 2 niveles + teclado + fix refs URL)
