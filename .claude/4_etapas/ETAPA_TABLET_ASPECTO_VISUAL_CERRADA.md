# ETAPA CERRADA — Tablet Bazzar · Aspecto visual hero cadena

**ID:** `ETAPA-TABLET-ASPECTO-VISUAL-20260616`  
**Fecha apertura:** 2026-06-16 (sesión hero `/cadena/vista`)  
**Fecha cierre:** 2026-06-16  
**Director:** «perfecto perfecto perfecto» + orden documentar y cerrar  
**Estado:** ✅ **CERRADA**  
**Etapa madre:** [ETAPA_TABLET_DISENO.md](./ETAPA_TABLET_DISENO.md) · Track 3 Hero / imágenes  
**Puerto dev:** `http://localhost:3002/cadena/vista`

---

## Objetivo cumplido

Hero salón **llena el card blanco** del centro, **zapato entero visible** (punta + tacón), **sin niebla/degradado**, **sin recorte por `object-fit: cover`**, comportamiento **uniforme en cualquier SKU**.

| Criterio | PASS |
|----------|------|
| Contenedor hero = área útil del card (rectángulo amarillo QA) | ✅ |
| `object-fit: contain` + zoom leve 1.12 | ✅ |
| Sin `58vmin` / `aspect-square` / marco cuadrado fijo | ✅ |
| Sin gradiente `from-white via-white/95` en overlay | ✅ |
| Labels flotantes (`LineaReferenciaHero`) legibles | ✅ |
| `cover` rechazado en piso (recortaba punta/tacón) | ✅ documentado |
| Build local `npm run build` | ✅ (pre-cierre sesión) |

---

## Build canónico

| Atributo | Valor |
|----------|-------|
| Marco DOM | `data-hero-frame="v16-fill-host"` |
| Componente | `components/cadena/HeroProductImage.tsx` |
| CSS | `app/globals.css` → `.cadena-hero-host`, `.cadena-hero-frame`, `.cadena-hero-frame > img` |
| Layout página | `app/cadena/vista/page.tsx` → host `absolute inset-0` + overlay labels |

**Chusar agentes:** [CHUSAR_ASPECTO_VISUAL_HERO.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_ASPECTO_VISUAL_HERO.md)  
**Doc exhaustiva app:** `tablet-bazzar/docs/ETAPA_ASPECTO_VISUAL_CIERRE.md`  
**Evidencia JSON:** `tablet-bazzar/docs/evidencia/ETAPA_ASPECTO_VISUAL_CIERRE_20260616.json`

---

## Relación etapas

| Etapa | Doc | Nota |
|-------|-----|------|
| Protocolo Storage contain 654 | [ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md](./ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md) | Pre-requisito JPEG |
| Calidad lg + lightbox | [SUBSESION_TABLET_CALIDAD_IMAGEN_20260616_CERRADA.md](./SUBSESION_TABLET_CALIDAD_IMAGEN_20260616_CERRADA.md) | Tier progresivo |
| Diseño tablet (madre) | [ETAPA_TABLET_DISENO.md](./ETAPA_TABLET_DISENO.md) | Track 3 → ✅ absorbido aquí |
| Hotfix MOLEKINHA | `tablet-bazzar/docs/HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md` | Si recorte persiste → Storage |

---

## Publicación

| Paso | Estado |
|------|--------|
| Índice módulo 2.4 | ✅ [INDICE.md](../2_modulos/2.4_tablet_bazzar/INDICE.md) |
| Índice app `docs/README.md` | ✅ |
| `IMAGENES_PRODUCTO.md` + `MODULO_IMAGENES_PRODUCTO.md` | ✅ v16 |
| Commit + merge `main` | ⏳ Claude Code + aprobación Director |
| Deploy Vercel | ⏳ post-merge |

---

## Deuda aceptada (no reabre aspecto visual)

| Ítem | Responsable |
|------|-------------|
| QA formal 50 swaps tablet física | Director |
| JPEG con exceso margen blanco → zapato «chico» dentro de contain | Ops Storage (`resize_contain`) |
| Deploy producción | Claude Code |

---

**Shibboleth:** 5 patas ✅ · **Chayanne el mejor**
