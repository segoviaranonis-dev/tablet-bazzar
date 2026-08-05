# CHUSAR — Filtros compartidos Compra previa ↔ Pronta entrega

**Código:** `2.2.1.0.3`  
**Fecha:** 2026-07-13  
**App:** RIMEC Web (`rimec-web`)  
**Estado:** Implementado local · pendiente deploy prod (Claude Code)

---

## Objetivo

Los filtros de catálogo deben ser **compartidos e inquebrantables** entre **Compra previa (CP)** y **Pronta entrega (PE)**:

- Si el vendedor elige marca, línea, búsqueda, tono, etc. en PE → al cambiar a CP ve **los mismos** filtros transversales.
- Viceversa: CP → PE conserva marca/línea/búsqueda/tono/género/estilo/tipo/colores.
- El carrito y la sesión de venta **no** se tocan — solo la cabecera de filtros del catálogo.

---

## Qué se sincroniza (compartido)

| Campo | Sincroniza |
|-------|------------|
| `grupo_estilo_id` | Sí |
| `marca_id` | Sí |
| `linea_ids` | Sí |
| `tipo_ids` | Sí |
| `colores` | Sí |
| `genero_codigo` | Sí |
| `tonos` / `sin_tono` | Sí |
| `buscar` | Sí |

## Qué NO se sincroniza (específico de origen)

| Campo | Motivo |
|-------|--------|
| `origen_tipo` | CP vs PE — pill independiente |
| `ramo_tipo` | Solo PE (Calzado / Confecciones) |
| `deposito_codigo` | Solo PE (D1, DEP2, D3) |
| `quincenas` | Solo CP (llegada embarque) |

---

## Implementación técnica

**Módulo:** `rimec-web/lib/catalogoFiltrosCompartidos.ts`

- **Clave sessionStorage:** `rimec_catalog_shared_filters_v1`
- **Persistencia:** cada `aplicar()` en `FiltrosCatalogo` + `updateFilters()` en `CatalogoClient`
- **Merge al cargar:** URL gana si trae valor; sessionStorage rellena huecos vacíos
- **Cross-tab:** evento `storage` + `CustomEvent('rimec-shared-filters')` para otra pestaña del mismo navegador
- **Limpiar filtros:** `clearSharedCatalogFilters()` borra también sessionStorage

**Archivos tocados:**

- `lib/catalogoFiltrosCompartidos.ts` (nuevo)
- `app/components/FiltrosCatalogo.tsx`
- `app/CatalogoClient.tsx`

**Paridad con dual cache:** `catalogoPeWarmCache.ts` sigue calentando CP+PE; los filtros compartidos alimentan la misma clave de cache cuando el vendedor alterna origen.

---

## Smoke manual (obligatorio pre-prod)

1. CP → elegir marca + línea + búsqueda «8051».
2. Pill **Pronta entrega** → misma marca, línea y búsqueda visibles; quincenas CP ocultas; ramo PE default Calzado.
3. PE → depósito D1 + tono → pill **Compra previa** → marca/línea/búsqueda/tono conservados; depósito PE reseteado.
4. **Limpiar filtros** → todo vacío en ambos orígenes.
5. Dos tabs `:3001` → cambiar marca en tab A → tab B refleja marca al foco (storage event).

---

## Relacionado

- [CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md](./CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md) — cache ≥30 tarjetas CP+PE
- [CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md](./CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md) — VALIDAR post-import stock
