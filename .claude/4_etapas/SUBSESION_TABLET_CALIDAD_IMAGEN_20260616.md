# SUB-SESIÓN — Tablet FINAL · Calidad imagen + zoom (paridad web)

> **✅ CERRADA 2026-06-16** — ver [SUBSESION_TABLET_CALIDAD_IMAGEN_20260616_CERRADA.md](./SUBSESION_TABLET_CALIDAD_IMAGEN_20260616_CERRADA.md)

**ID:** `SUBSESION-TABLET-CALIDAD-IMAGEN-20260616`  
**Fecha apertura:** 2026-06-16  
**Estado:** ✅ **CERRADA** — Director: *imágenes perfectas aprobado*  
**Etapa madre:** [ETAPA_TABLET_FINAL.md](./ETAPA_TABLET_FINAL.md)  
**Director:** Héctor — *«peor calidad de todos los proyectos · vergüenza en salón · falta zoom como RIMEC/Bazzar Web»*  
**Shibboleth:** 7 años

---

## Jerarquía

| Nivel | Doc | Relación |
|-------|-----|----------|
| Candado Storage crop | [ETAPA_PROTOCOLO_IMAGENES_100.md](./ETAPA_PROTOCOLO_IMAGENES_100.md) | **Pre-requisito** — JPEG contain en `sm/md/lg` |
| **Esta sub-sesión** | Calidad visual + zoom UX | **Post/contemporáneo** — tier correcto + lightbox |
| Triángulo pilares | [SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md](./SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md) | ⏸ PAUSADA |

---

## Problema (Director)

Tablet Bazzar muestra fotos **peor que RIMEC Web y Bazzar Web** ya entregados:

- Hero en salón se ve **pixelado / baja resolución**.
- No hay **zoom / maximizar** al tocar la foto (RIMEC y Bazzar tienen lightbox + lupa).
- Sensación de «carga baja y no mejora» — sospecha acertada en código.

**No es solo recorte** (pie `4.90.03.002` — otro track). Es **tier equivocado + sin upgrade + sin modal**.

---

## Diagnóstico técnico (Cursor 2026-06-16)

### A · Hero se queda en `sm/` (200×200) para siempre

| Proyecto | Tier hero / card | Zoom |
|----------|------------------|------|
| **Bazzar Web** | URL plana / catálogo (`ProductoCard`) | ✅ lightbox click |
| **RIMEC Web** | `imagen_url` catálogo (`CatalogoGrid`) | ✅ lightbox click |
| **Tablet** | **`sm/` 200px** escalado a ~58vmin | ❌ no existe |

**Código tablet — causa raíz calidad:**

1. `lib/product-image.ts` → `pickHeroLoadSequence`: orden **`sm/` → `lg/` → flat** (legacy HOTFIX crop).
2. `HeroProductImage.tsx` → bucle preload: **al cargar el primero hace `return`** — **nunca promueve a `lg/`**.

```typescript
// HeroProductImage — hoy: se queda en sm si carga OK
for (const url of sequence) {
  if (await preloadImageDecoded(url)) {
    setShown(url);
    return; // ← BUG paridad: no sigue a lg
  }
}
```

3. Hero ocupa `size-[min(58vmin,...)]` (~400–600 px). Mostrar JPEG **200 px** con `object-contain` = **upscale borroso**.

### B · Thumbs correctos en `sm/` — hero no

Carruseles (`ProductImage` variant thumb) deben seguir en **`sm/`** (~20 KB). Solo **hero + modal zoom** usan **`lg/`** (800×800).

### C · Doble trabajo mal implementado

| Esperado (paridad web) | Tablet hoy |
|------------------------|------------|
| Placeholder rápido opcional | sm carga rápido ✅ |
| **Upgrade a alta res** en background | ❌ no ocurre |
| Tap → modal full / zoom | ❌ no existe |

---

## Objetivo sub-sesión

**Paridad visual salón** con RIMEC Web / Bazzar Web:

1. Hero muestra **`lg/`** (800×800) cuando Storage PASS.
2. Progresión opcional: sm blur → swap lg (sin quedarse en sm).
3. **Lightbox / pinch-zoom** en hero cadena y depósito.
4. Cero upscale perceptible en viewport hero.

---

## Administrador de tareas

### Bloqueado por Storage ⏸

| # | Tarea | Nota |
|---|-------|------|
| B1 | Cerrar 9 JPG faltantes + `--verificar` 100 % | [ETAPA_PROTOCOLO_IMAGENES_100.md](./ETAPA_PROTOCOLO_IMAGENES_100.md) |

### Implementación ⬜

| # | Tarea | Repo | Criterio PASS |
|---|-------|------|---------------|
| P1 | `pickHeroLoadSequence` → **`lg/` primero** (post-erradicación) | `tablet-bazzar/lib/product-image.ts` | Hero URL contiene `/lg/` |
| P2 | `HeroProductImage`: progresión sm→lg **sin return prematuro** | `components/cadena/HeroProductImage.tsx` | Network: lg descargado; img src = lg |
| P3 | Componente **`ProductLightbox`** (tap hero → modal lg, contain, cerrar) | `components/` nuevo | Paridad UX Bazzar `ProductoCard` lightbox |
| P4 | Depósito grid: tap thumb → mismo lightbox | `app/deposito/page.tsx` | Zoom en depósito |
| P5 | Prefetch vecino cadena: **`lg/`** del color siguiente | `lib/cadena` / hero | Menos wait al cambiar color |
| P6 | QA Director: comparar mismo SKU tablet vs RIMEC Web lado a lado | piso | «No se avergüenza» |
| P7 | Doc evidencia JSON + capturas antes/después | `docs/evidencia/` | |

### Fuera de alcance ❌

- Cambiar tiers Storage (etapa Imágenes 100 %)
- `object-cover` en calzado
- Next `<Image>` optimizer sin validar Supabase URLs

---

## Referencias paridad

| Proyecto | Archivo |
|----------|---------|
| Bazzar Web lightbox | `bazzar-web/app/(public)/catalogo/ProductoCard.tsx` |
| RIMEC Web lightbox | `rimec-web/app/CatalogoGrid.tsx` |
| Protocolo tiers | `.claude/2_modulos/2.1_control_central/docs/NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md` |
| Error recorte | `5_errores/detalle/4.90.03.002_storage-crop-calzado.md` |

---

## Criterio cierre sub-sesión

1. Hero cadena usa **`lg/`** visible (no upscale sm).
2. Lightbox funcional en hero (tap → maximizar, zapato entero contain).
3. Director aprueba calidad vs RIMEC/Bazzar mismo SKU.
4. Absorbida en Track 1 ETAPA_TABLET_FINAL al cerrar.

---

**Apertura Director — 2026-06-16**
