# Cadena — navegación sin pestañeo (2026-06-15)

## Diagnóstico

| Síntoma | Causa |
|---------|--------|
| Flash blanco / gradiente BAZZAR al cambiar color | `ProductImage` ponía `opacity-0` en cada cambio de `src` aunque la URL ya estuviera en caché del navegador |
| Hero parpadea al swipe | `HeroProductImage` cambiaba `src` antes de `decode()`; prefetch no esperaba decode |
| Primer swipe lento | Prefetch solo ±2 L+R thumbs; **no** precargaba todos los colores del grupo activo ni vecinos material/color |

El pestañeo **no** era Storage (ya resuelto en 2083.1133) — era timing imagen ↔ DOM.

## Fix aplicado

1. **`lib/image-decode-cache.ts`** — caché global: precarga + `img.decode()` antes de marcar lista.
2. **`HeroProductImage`** — mantiene foto anterior hasta que la nueva esté decodificada (sin flash vacío).
3. **`ProductImage` thumbs** — si URL en caché decode → `opacity-100` inmediato; overlay BAZZAR solo si falta decode.
4. **`prefetchCadenaNeighborhood`** — precarga hero+thumb de: activa, todos colores del grupo, ±1 color swipe, ±1 material, ±2 L+R.
5. **Carruseles / mazo** — `priority` en tarjetas visibles (sin fade innecesario).

## QA sugerido

50 cambios consecutivos (↑↓ color, ←→ material, swipe L+R) en MOLEKINHA — criterio: sin flash blanco en hero ni sidebar.

## Archivos

- `lib/image-decode-cache.ts` (nuevo)
- `lib/prefetch-images.ts`
- `components/cadena/HeroProductImage.tsx`
- `components/ProductImage.tsx`
- `app/cadena/vista/page.tsx`
- `components/cadena/Carrusel*.tsx`, `MazoMaterialNaipes.tsx`
