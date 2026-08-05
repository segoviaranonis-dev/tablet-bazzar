# CHUSAR — Aspecto visual hero cadena (Tablet Bazzar)

**Módulo:** 2.4 Tablet Bazzar · salón `/cadena/vista`  
**Build:** `v16-fill-host` · **Estado:** ✅ CERRADO 2026-06-16  
**Etapa:** [ETAPA_TABLET_ASPECTO_VISUAL_CERRADA.md](../../4_etapas/ETAPA_TABLET_ASPECTO_VISUAL_CERRADA.md)

---

## Qué es

Reglas **obligatorias** para el hero central de cadena: tamaño, CSS, layout y anti-patrones probados en piso con Director.

---

## Layout (page.tsx)

```text
.bazzar-card (relative, h-full, overflow-hidden)
├── .cadena-hero-host (absolute inset-0 z-0)     ← foto ocupa TODO el card
│   └── HeroProductImage → button.cadena-hero-frame
└── LineaReferenciaHero (absolute top z-20)      ← labels flotan, NO restan altura
```

**Prohibido:** hero en `flex-1` con labels en flujo si el objetivo es máximo área — labels deben ser overlay.

---

## CSS canónico (`app/globals.css`)

```css
.cadena-hero-host {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.cadena-hero-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

button.cadena-hero-frame {
  min-height: 0;
  min-width: 0;   /* anula min 44px global de button */
}

.cadena-hero-frame > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  transform: scale(1.12);
  transform-origin: center center;
}
```

| Propiedad | Valor | Por qué |
|-----------|-------|---------|
| `object-fit` | **contain** | Zapato entero (punta + tacón) |
| `transform: scale(1.12)` | fijo | Come margen blanco JPEG sin llegar a crop de `cover` |
| `object-fit: cover` | **PROHIBIDO** | Recortó punta/tacón — rechazado Director |
| `aspect-square` / `58vmin` | **PROHIBIDO** | Cuadrado chico flotando en card grande |
| Gradiente overlay | **PROHIBIDO** | `bg-gradient-to-b from-white…` — niebla innecesaria |
| `width`/`height` HTML en `<img>` | **PROHIBIDO** | Reserva caja incorrecta vs tier real |
| `filter: drop-shadow` en hero | **PROHIBIDO** | Simulaba niebla superior |

---

## Componente (`HeroProductImage.tsx`)

| Regla | Detalle |
|-------|---------|
| Marco | `className="cadena-hero-frame cursor-zoom-in"` |
| Audit attr | `data-hero-frame="v16-fill-host"` |
| Imagen | `<img>` directo — **sin** wrapper `ProductImage` |
| Tier | `useHeroProgressiveSrc` → sm/ preview → lg/ |
| Tap | `ProductLightbox` con `zoomSrc` (lg/) |
| SKU audit | `4215.1034` → `data-hero-sku="4215.1034"` |

---

## Overlay labels (`LineaReferenciaHero.tsx`)

- `absolute inset-x-0 top-0 z-20`
- **Sin** gradiente de fondo
- `pointer-events-none` en contenedor; `pointer-events-auto` en botones
- `[text-shadow:…]` opcional solo si labels sobre foto oscura

---

## Diagnóstico rápido

| Síntoma | Causa probable | Acción |
|---------|----------------|--------|
| Solo puntera o tacón cortado | `object-fit: cover` o Storage crop | Revertir a contain; auditar JPEG |
| Cuadrado gris/chico en card grande | `58vmin` / `aspect-square` | v16 fill-host |
| Niebla arriba | gradiente overlay o drop-shadow | Quitar |
| Zapato entero pero «mini» | margen blanco en JPEG Storage | Ops `resize_contain`, no CSS |
| Foto cruzada al navegar | key SKU / reset hook | `skuKey` L+R+M+C |

**Auditoría Storage:** `scripts/auditar_hero_2083_1133.ts` · pie **4.90.03.002**

---

## Smoke QA (Director)

1. `http://localhost:3002/cadena/vista` · cliente 2100 · marca ACTVITTA  
2. SKU **4202.500** — zapato azul entero, grande, centrado  
3. SKU **9077.202** (botas) — entero sin clip vertical  
4. Hard refresh Ctrl+Shift+R  
5. DevTools: `data-hero-frame="v16-fill-host"`, img `object-fit: contain`

---

## Archivos tocados (no reabrir sin OT)

- `components/cadena/HeroProductImage.tsx`
- `components/cadena/LineaReferenciaHero.tsx`
- `app/cadena/vista/page.tsx` (bloque hero card)
- `app/globals.css` (bloque `.cadena-hero-*`)

---

**Shibboleth:** 7 años
