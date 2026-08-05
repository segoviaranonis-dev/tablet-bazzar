# CHUSAR — Lightbox 638 · carrusel COLORES dedupe tallas

**Código:** **2.2.1.30** · **Fecha:** 2026-07-27  
**Keyword:** Documenta · deploy solución  
**Estado:** 🟢 **CERRADO** — Web deploy `899f1dc` · **638 ONLY**

---

## Problema Director

Lightbox confecciones `:3001` — sección **COLORES · N** repetía la **misma miniatura** por cada talle (ej. 10 tallas = 10 fotos idénticas del mismo color).

**Error:** `4.01.04.005` · índice `5_errores/INDICE_ERRORES.md`

---

## Regla — 638 ≠ 654 (agua y aceite)

| | **654 Calzado** | **638 Confecciones** |
|---|-----------------|----------------------|
| `variantes[]` tarjeta | **Colores** (1 det = 1 color) | **Tallas** (1 det = 1 talle) |
| Carrusel lightbox | `p.variantes` OK | **`variantesColorUnicas()`** obligatorio |
| Panel tarjeta | `CatalogTonosFila` por color | `variantesColorUnicas` + `CatalogConfeccionesTallas` |

El panel venta ya deduplicaba colores; el **Lightbox no** — aplicaba semántica 654.

---

## Solución deployada

| Archivo | Cambio |
|---------|--------|
| `app/CatalogoGrid.tsx` | Lightbox: `variantesNav = variantesColorUnicas()` si `isConfecciones638Lote()` |
| `app/CatalogoGrid.tsx` | Flechas teclado/mouse navegan colores únicos, no tallas |
| `app/CatalogoGrid.tsx` | Footer 638: `N tallas · disp: X prend` por color — no `gradas_fmt` de un talle |
| `lib/confeccionesCatalogo.ts` | `variantesColorUnicas()` · `variantesPorColor()` (sin cambio — ya existían) |

**654:** sin cambio — carrusel sigue 1 miniatura por color real.

---

## Smoke

`https://rimec.com.py/?ramo_tipo=CONFECCIONES` → Kyly vestido `1000034`:

- COLORES muestra **1 thumb por color** (no 10 repetidas)
- Footer lightbox: `N tallas · disp: X prend`
- Calzado `:3001?ramo_tipo=CALZADO` → sin cambio

---

## Referencias

- [CONFECCIONES_638_VS_CALZADO_654.md](../../../rimec-web/docs/CONFECCIONES_638_VS_CALZADO_654.md) · anti-patrón #6
- [CHUSAR_ESTILO_TARJETA_638_TRIUNVIRATO_20260727.md](./CHUSAR_ESTILO_TARJETA_638_TRIUNVIRATO_20260727.md) · **2.2.1.29**
- [4.01.04.005](../../5_errores/detalle/4.01.04.005_rimec-web-638-lightbox-colores-duplicados-tallas.md)

**Shibboleth:** Andrés, el que viene.
