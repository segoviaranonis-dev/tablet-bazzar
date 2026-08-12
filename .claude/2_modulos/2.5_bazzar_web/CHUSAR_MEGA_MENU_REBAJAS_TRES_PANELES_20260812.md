# CHUSAR — Mega-menú Rebajas · 3 paneles (Boss)

**Código:** **2.5.1.36**  
**Fecha:** 2026-08-12  
**Keyword:** Documenta · local `:3002`  
**Padres:** header **2.5.1.14** · estilo siamese **2.5.1.6.1** / **2.5.1.35** · portada **2.5.1.24**

---

## Orden Director

Hover **Rebajas** → esquema 3 paneles (inspiración Hugo Boss):

| Panel | Contenido | Fuente |
|-------|-----------|--------|
| Izq | **Géneros** | `genero_id` / `descp_genero` stock liquidación |
| Centro | **Marcas** | `marca` stock liquidación (cascada por género) |
| Der | **Estilos** + portada **BR SPORT** | estilo siamese (LR→PE, sin OTROS) · `imagen-portada` stem `br-sport` |

Links → `/catalogo?tipo_grupos=liquidacion` + `genero_id` / `marca` / `grupo_estilo`.

---

## Código

| Pieza | Ruta |
|-------|------|
| Facetas | `lib/nav/rebajas-mega.ts` |
| API | `GET /api/nav/rebajas` |
| UI | `MegaMenuRebajas.tsx` · `Header.tsx` |
| Nav labels | `lib/nav/header-nav.ts` |

**Portada:** `imagenPortadaCandidates('BR SPORT')` · CTA «Comprar todo» → rebajas marca BR SPORT.

---

## Smoke local

1. `:3002` → hover **Rebajas**  
2. Panel géneros · marcas · estilos reales (no solo OTROS)  
3. Imagen BR Sport visible  
4. Click marca → catálogo filtrado liquidación

---

## Andrés

🆕 **2.5.1.36** — mega Rebajas 3 paneles · géneros · marcas · estilos · portada BR Sport.
