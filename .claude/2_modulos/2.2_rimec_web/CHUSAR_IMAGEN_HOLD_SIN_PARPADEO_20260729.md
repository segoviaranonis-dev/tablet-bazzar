# CHUSAR — Imagen hold · sin parpadeo de nombre (catálogo / lightbox)

**Código:** **2.2.1.37**  
**Padre etapa:** `CP-CONFECCIONES-OK-20260729` · **2.2.1.36**  
**Fecha:** 2026-07-29  
**Keyword:** Documenta · publica  
**Shibboleth:** Andrés, el que viene.  
**Estado:** 🟢 **IMPLEMENTADO + desplegado** · commit Web `d673ef9` · prod Ready (`vercel deploy --prod`) · https://rimec-web.vercel.app · https://rimec.com.py

---

## Norte

Al cambiar de color (tarjeta o lightbox) o al fallar candidatos Storage, la UI **no** debe:

1. Apagar la foto (`opacity-0`) dejando hueco blanco.
2. Mostrar skeleton con texto `linea·referencia` / nombre de archivo en bucle (síntoma Director: “20 veces en un segundo”).

---

## Causa

`ProductImage` pintaba cada URL candidata (flat → md → lg → …). Si 404 en cadena (frecuente en CP 638 con stem incorrecto o tier faltante), `onError` rotaba decenas de URLs/s y el skeleton con **nombre** parpadeaba encima.

---

## Fix

| Pieza | Comportamiento |
|-------|----------------|
| `ProductImage.tsx` | Sin skeleton de nombre. Probar candidatos con `preloadImageDecoded` **en silencio**; solo `setDisplaySrc` si decode OK. Hold foto anterior. |
| `use-hero-progressive-src.ts` | No pisar `shown` con URL fría; upgrade sm→lg tras decode. |
| `CatalogoGrid.tsx` | Prefetch color ±1 (lightbox) · deps estables. |
| `catalogoSyncGate.ts` | Gate overlay en `sessionStorage` (misma pestaña). |
| `carrito/page.tsx` | `Link` SPA «Seguir comprando» (no `<a href>` hard reload). |

---

## Deuda (auditoría CP 638 — no bloquea este deploy)

P0 pendientes aparte: vista `v_stock_rimec` stem 638 con color Excel (no `descp_color`); exponer `imagen_color_excel` en select CP; carrito con protocolo 638 en `getImageCandidatesForUi`.

---

## Archivos

- `rimec-web/components/ProductImage.tsx`
- `rimec-web/lib/use-hero-progressive-src.ts`
- `rimec-web/app/CatalogoGrid.tsx`
- `rimec-web/lib/catalogoSyncGate.ts`
- `rimec-web/app/carrito/page.tsx`

## Smoke

1. Catálogo Confecciones CP · cambiar tonos en tarjeta → sin flash de nombre.
2. Lightbox · flechas / carrusel colores → foto hold hasta la nueva.
3. Carrito → Seguir comprando → catálogo sin overlay sync completo.

**Cruce:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](../1_fundamentos/1.3_politicas/LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) · [CHUSAR_LIGHTBOX_638…](./CHUSAR_LIGHTBOX_638_COLORES_DEDUPE_20260727.md) **2.2.1.30**
