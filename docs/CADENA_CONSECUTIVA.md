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
│[E] │                                             │ [R]   │ vert  │
│ s  │   HERO — foto object-contain                │  e    │ naipes│
│ t  │   overlay: estilo (tap) · ref (tap)         │  f    │ L+R   │
│ i  │   tap centro = detalle                      │       ├───────┤
│ l  │   swipe ←→ = L+R                            │       │ mazo  │
│ o  │                                             │       │ colores│
│    │                                             │       │       │
├────┴─────────────────────────────────────────────┴───────┴───────┤
│ ◀ │ naipes L+R anterior · actual · siguientes │ ▶               │
└──────────────────────────────────────────────────────────────────┘

[E] = panel Estilo (colapsable, oculto por defecto, ~108px)
[R] = panel Referencia (colapsable, oculto por defecto, ~116px)
vert naipes + mazo = SIEMPRE visibles (aside fijo, no se eliminan)
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

### Carrusel lateral (inviolable)

- **Aside derecho fijo** (~120–128px): carrusel vertical L+R + mazo L+R+Mat abajo.
- Se alimenta con `paresNav` = `pares` filtrados, o `paresAll` si el filtro deja 0 resultados — así las fotos laterales **nunca desaparecen** aunque el hero muestre «Sin coincidencias».
- Footer horizontal de naipes L+R se mantiene con la misma regla `paresNav`.

### Estilo visual (Banana Republic)

- Crema `#f4f1ec`, carbón `#1a1a1a`, acento navy `#1b2a41`
- Serif **Cormorant Garamond** (`.font-br`) en títulos de estilo
- Chips de filtro con CSS explícito (`.chip-br`) — contraste alto en tablet
- Fondo sutil que cambia al cambiar par L+R (`cadenaBackgroundStyle` en `lib/product-image.ts`)

---

## Navegación táctil

| Gesto / zona | Acción |
|--------------|--------|
| Swipe ← | Siguiente par L+R en cadena |
| Swipe → | Par L+R anterior |
| Swipe ↑ | Color/material anterior |
| Swipe ↓ | Color/material siguiente |
| Tap centro hero | Abre/cierra panel detalle (material, grada, pares) |
| Bordes laterales invisibles del hero | Mismo ←→ que swipe |
| Naipes (carruseles vertical + footer) | Salto directo a índice L+R |
| Tap mazo colores | Rota color del grupo L+R+Mat |
| Tap **estilo** en hero | Abre/cierra panel Estilo (no toggle del ítem) |
| Tap **referencia** en hero | Abre/cierra panel Referencia |

Hook: `lib/use-touch-nav.ts` · Botones mínimos 52×52px: `components/cadena/TouchPad.tsx`

**Sin botones ▲▼ visibles** — solo gestos para eje vertical.  
**Sin flechas ◀▶ visibles en hero** — zonas táctiles opacas; footer sí tiene ◀▶.

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
- Sin foto: placeholder 👟 (no icono roto): `components/ProductImage.tsx`

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
| `components/cadena/CarruselNaipesLR.tsx` | Naipes L+R (vertical + horizontal) |
| `components/cadena/MazoMaterialNaipes.tsx` | Stack colores Nivel 1 |
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

**Última actualización:** 2026-06-11
