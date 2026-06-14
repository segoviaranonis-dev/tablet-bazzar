# Plan de Solución Integral — Imágenes Tablet Bazzar

**Alcance:** `tablet-bazzar` frontend + API Routes.  
**Fuera de alcance:** DB, Storage, ticket, lógica cadena.

---

## Fase 1 — URL canónica (80 %)

### Problema

`ProductImage` generaba hasta 6 URLs y encadenaba `tryNext()` en `onError`/`onLoad`. Cada cambio de molécula desmontaba el `<img>` y mostraba 👟.

### Solución

1. `resolveCanonicalImageUrl()` — una URL por variant (`sm` thumb / `md` hero)
2. `enrichDepositoFilaImagenes()` en API cadena y depósito
3. `ProductImage` — contenedor gradiente fijo + fade-in; sin `onError` encadenado

### Archivos

- `lib/product-image.ts`
- `components/ProductImage.tsx`
- `lib/prefetch-images.ts`
- `app/api/deposito/[cliente_id]/cadena/route.ts`
- `app/api/deposito/[cliente_id]/route.ts`
- `lib/cadena.ts`

---

## Fase 2 — Layout estable (15 %)

- `IMAGE_INTRINSIC`: sm 200×200, md 400×400
- Atributos nativos `width`/`height` en `<img>`
- `min-h-[280px]` en contenedor hero cadena

---

## Fase 3 — ISR catálogo (5 %)

- `export const revalidate = 30` en route cadena
- `Cache-Control: public, s-maxage=30, stale-while-revalidate=60`
- Cliente: quitar `cache: "no-store"` en fetch cadena
- Stock (`useStockOtrosLocales`) sigue dinámico

---

## Fase 4 — next/image (futuro)

Viabilidad alta tras Fases 1–3. Evaluar solo si hero md sigue siendo cuello en 3G tienda.

---

**Referencia:** cuestionario técnico 2026-06-11 · auditoría Cursor
