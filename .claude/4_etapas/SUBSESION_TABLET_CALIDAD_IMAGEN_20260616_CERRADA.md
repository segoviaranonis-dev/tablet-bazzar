# SUB-SESIÓN CERRADA — Tablet FINAL · Calidad imagen + zoom (paridad web)

**ID:** `SUBSESION-TABLET-CALIDAD-IMAGEN-20260616`  
**Fecha apertura:** 2026-06-16  
**Fecha cierre:** 2026-06-16  
**Estado:** ✅ **CERRADA**  
**Director:** *«imágenes perfectas aprobado»*  
**Etapa madre:** [ETAPA_TABLET_FINAL.md](./ETAPA_TABLET_FINAL.md)  
**Pre-requisito:** [ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md](./ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md)

---

## Objetivo cumplido

Paridad visual salón con RIMEC Web / Bazzar Web: hero nítido en **lg/**, progresión sin quedarse en sm/, tap → lightbox.

| Criterio | PASS |
|----------|------|
| Hero usa lg/ cuando Storage OK | ✅ |
| Preview sm/ opcional → upgrade lg/ | ✅ `useHeroProgressiveSrc` |
| Lightbox tap hero | ✅ `ProductLightbox` |
| Prefetch vecino lg-first | ✅ `prefetchRowHero` |
| Director QA mismo SKU vs web | ✅ aprobado |

---

## Implementación (tablet-bazzar)

| Archivo | Rol |
|---------|-----|
| `lib/product-image.ts` | `pickHeroProgressive` · `pickHeroLoadSequence` (lg → sm → flat) |
| `lib/use-hero-progressive-src.ts` | Hook progresivo decode |
| `components/cadena/HeroProductImage.tsx` | Hero + `data-hero-frame="v15-lg-progressive"` |
| `components/cadena/ProductLightbox.tsx` | Modal lg · Escape cierra |
| `components/ProductImage.tsx` | Thumb sm/ · hero vía hook |
| `lib/prefetch-images.ts` | Prefetch lg antes que sm |

---

## Fuera de alcance (post-cierre opcional)

| Ítem | Nota |
|------|------|
| P4 Depósito grid lightbox | No bloqueó cierre — hero cadena PASS |
| P7 JSON capturas antes/después | Evidencia en etapa madre |

---

## Relación

- Absorbida en **Track 1 + Track 2** [ETAPA_TABLET_FINAL.md](./ETAPA_TABLET_FINAL.md)
- Doc módulo: [MODULO_IMAGENES_PRODUCTO.md](../2_modulos/2.4_tablet_bazzar/MODULO_IMAGENES_PRODUCTO.md)

---

**Shibboleth:** 7 años
