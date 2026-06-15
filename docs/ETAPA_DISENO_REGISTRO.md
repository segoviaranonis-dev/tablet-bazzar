# Tablet Bazzar — Registro diseño / imágenes

**Estado:** ✅ **CERRADA** 2026-06-10  
**Cierre canónico:** [ETAPA_DISENO_CIERRE.md](./ETAPA_DISENO_CIERRE.md)  
**Evidencia:** [evidencia/ETAPA_DISENO_CIERRE_20260610.json](./evidencia/ETAPA_DISENO_CIERRE_20260610.json)  
**Etapa holding:** `.claude/4_etapas/ETAPA_TABLET_DISENO_INVESTIGACION_CERRADA.md`

---

> Registro histórico 2026-06-12 → 2026-06-10. No reabrir salvo orden Director.

**Fecha registro:** 2026-06-14  
**Auditor:** Cursor · **Director:** Héctor Segovia

---

## Cronología (2026-06-12 → 2026-06-14)

### Track A — Pipeline imágenes (Fases 1–3)

| Fase | Objetivo | Código | QA piso |
|------|----------|--------|---------|
| 1 | URL canónica `sm/`/`md/` + gradiente RIMEC | ✅ | ⚠️ fallback flat necesario |
| 2 | `width`/`height` nativos + min-h hero | ✅ | ❌ hero recorte |
| 3 | ISR cadena `revalidate=30` | ✅ | ✅ |
| 4 | `next/image` | backlog | — |

**Archivos tocados:** `lib/product-image.ts`, `components/ProductImage.tsx`, APIs cadena/depósito, `lib/prefetch-images.ts`, carruseles cadena.

### Incidentes reportados por Director

1. **Sidebar vertical (`CarruselNaipesLR`)** — tarjetas vacías / líneas grises  
   - **Causa:** ancho ~1.5px (`w-full` en flex-col sin ancho en botón).  
   - **Fix:** `w-[112px]` en naipes verticales. ✅ verificado en ACTVITTA.

2. **Tarjetas azules BAZZAR (fallback)** — VIZZANO / ACTVITTA  
   - **Causa:** tier `sm/`/`md/` responde 400; solo JPG plano legacy 200.  
   - **Fix parcial:** `imagen_url_flat` + un fallback en `ProductImage`.  
   - **Fix definitivo:** `control_central/tools/protocolo_imagenes_cerrar_gap.py --cerrar --marca …`  
   - ACTVITTA: PASS verificación. VIZZANO: ~160/348 previews fallan HEAD en `sm/`.

3. **Hero — zapato no contenido (tacón/punta cortados)** — **RESUELTO caso 4215.1034**  
   - **Causa raíz definitiva:** foto origen **800×545** convertida a cuadrado con **crop centrado** en Storage (`margin_l/r = 0`). CSS no repara JPEG mutilado.  
   - **Fix Storage:** `scripts/regenerar_storage_4215_1034.py` → `resize_contain` + upload sm/md/lg (`margin_l/r = 24 px`).  
   - **Fix CSS:** `HeroProductImage` v13 — `absolute inset-0 object-contain`; `data-hero-frame="v13-contain"`.  
   - **Documentación:** `PUNTO_CRITICO_RECORTE_CALZADO.md` + `docs/evidencia/HERO_CASO_4215_1034.json`.  
   - **Pendiente holding:** mismo tratamiento masivo en marcas con tiers legacy recortados.

4. **Gestos verticales** — arriba/abajo = par L+R; activo marcado en sidebar. ✅ código en `page.tsx` + `CarruselNaipesLR`.

5. **Console React:** spread de `key` en `{...imgProps}` — corregido (key directo en `<img>`).

6. **Hero MOLEKINHA 2083.1133 — recorte persistente pese a parches CSS** — **RESUELTO 2026-06-15**  
   - **Síntoma:** solo puntera visible; parches v15–v22 empeoraron layout.  
   - **Causa raíz:** tiers `sm/lg` en Storage generados con **crop** (JPEG mutilado). Origen local `800×545` intacto en `imagenes/`.  
   - **Fix Storage:** `scripts/regenerar_storage_2083_1133.py` → `resize_contain` + upload.  
   - **Fix CSS:** `HeroProductImage` v9-bare-img (img directo sm/, object-contain).  
   - **Doc:** [HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md](./HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md) · evidencia `HERO_REGEN_2083_1133.json`.  
   - **Ops pendiente:** lote `--cerrar --marca MOLEKINHA` (687 SKUs).

---

## Diagnóstico técnico acumulado

### Hero container (Norm II — estabilización geométrica)

| Medida | Antes (bug) | Después fix ratio |
|--------|-------------|-------------------|
| Marco ancho | ~1630px | ~1071px |
| Marco alto | ~803px | ~803px |
| Ratio | **2.03** | **1.33** |
| `overflow` marco | hidden | visible / sin clip en marco |

**Pendiente validación humana:** tacón y punta visibles con margen respecto al borde de tarjeta blanca en landscape 10" real.

### Parpadeo

| Patrón | Efecto |
|--------|--------|
| `opacity-0` hasta `onLoad` | flash blanco/gradiente |
| `setLoaded(false)` en cada cambio molécula | parpadeo al swipe color |
| md 400 → onError → flat | doble request + flash |
| Prefetch sin decode previo al swap | imagen en caché sin `onLoad` |

**Mitigaciones aplicadas (2026-06-14):** `useHeroDisplaySrc` (precarga+decode), sin opacity en hero, `prefetchRowHero`, marco en `page.tsx`.

**Criterio cierre:** 50 cambios consecutivos color/material sin flash visible (doc Fase 1).

### Storage — gap tiers

```
sm/1184-1101-….jpg  → 400 (no existe)
1184-1101-….jpg     → 200 (plano legacy)
```

Herramienta: `control_central/tools/protocolo_imagenes_cerrar_gap.py`  
Log ACTVITTA: `control_central/reportes_upload/gap_cierre_actvitta_continua.log`

---

## Arquitectura UI cadena (referencia)

| Zona | Componente | Gestos |
|------|------------|--------|
| Hero central | `ProductImage` variant hero | swipe en `heroTouch` |
| Footer | `CarruselMateriales` | ←→ material |
| Sidebar arriba | `CarruselNaipesLR` vertical | ↑↓ par L+R |
| Sidebar abajo | `MazoMaterialNaipes` | tap rotar color |

**Preview thumbnail par:** `filaPreviewPar` — color con más stock (no siempre primero).

---

## Archivos clave (estado 2026-06-14)

| Archivo | Rol |
|---------|-----|
| `components/cadena/HeroProductImage.tsx` | Hero v9-bare-img, sm/ paridad sidebar |
| `components/ProductImage.tsx` | Thumbs + fallback flat |
| `lib/product-image.ts` | enrich URLs, tiers sm/lg |
| `app/cadena/vista/page.tsx` | layout hero, gestos, overlays |
| `scripts/regenerar_storage_2083_1133.py` | Hotfix Storage MOLEKINHA 2083.1133 |
| `scripts/regenerar_storage_4215_1034.py` | Plantilla hotfix Storage un SKU |
| `components/cadena/CarruselNaipesLR.tsx` | ancho 112px, activo visual |
| `lib/prefetch-images.ts` | thumb + hero prefetch |
| `control_central/tools/protocolo_imagenes_cerrar_gap.py` | cierre Storage |

---

## Criterios de cierre (pendientes — todos FAIL o parcial)

- [x] Hero caso salón MOLEKINHA `2083.1133`: tacón y punta completos (Storage contain + v9-bare-img)
- [x] Hero caso fundador `4215.1034`: tacón y punta completos (Storage contain + CSS v13)
- [ ] Hero: **≥95% SKUs** con tiers contain (auditoría márgenes, no solo un SKU)
- [ ] Cero pestañeo en 50 cambios consecutivos (Network: 1 request/imagen visible)
- [ ] CLS hero &lt; 0.05
- [ ] ≥95% previews cadena con HEAD 200 en `sm/` (VIZZANO cerrado en Storage)
- [ ] Director: «diseño aprobado»
- [ ] Track B UX (Antigravity): paleta, densidad, copy — sin iniciar cierre

---

## Fixes aplicados 2026-06-14 (Cursor)

| Área | Cambio |
|------|--------|
| `HeroProductImage` | v13-contain; lg/ hero; Storage contain obligatorio |
| `PUNTO_CRITICO_RECORTE_CALZADO.md` | Ley holding — cover vs contain |
| `regenerar_storage_4215_1034.py` | Caso fundador subido a Supabase |
| `ProductImage` | precarga/decode en thumb; sin fade en priority; sin `key` en img |
| `page.tsx` + CSS | hero `overflow-visible`; marco sin clip lateral |
| `convertir_miniaturas_retail.py` | salida sm/md/lg + fit contain (no crop) |
| Protocolo canónico | fit contain; Tablet hero=sm; thumbs/ deprecado |

**Pendiente ops (Claude):** `protocolo_imagenes_cerrar_gap.py --cerrar` por marca (VIZZANO, etc.).

---

1. **Agente:** Sonnet 4.6 Medium o Codex 5.3 Medium, MAX Mode, Auto OFF.  
2. Reproducir en tablet física landscape; medir `getBoundingClientRect` hero vs img pintada.  
3. Validar si recorte es **CSS** o **JPG fuente** (plano sin margen).  
4. Ejecutar `--cerrar --marca VIZZANO` (y resto marcas) en Storage.  
5. Considerar hero siempre desde `md/` existente o flat único hasta gap 100%.  
6. Track B Antigravity: spec visual aprobado antes de cerrar etapa.

---

## Referencias

| Doc | Ruta |
|-----|------|
| Punto crítico recorte | `.claude/2_modulos/2.1_control_central/docs/PUNTO_CRITICO_RECORTE_CALZADO.md` |
| Protocolo imágenes | `.claude/2_modulos/2.1_control_central/docs/NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md` |
| Evidencia 2083.1133 | `docs/evidencia/HERO_REGEN_2083_1133.json` |
| Hotfix MOLEKINHA | `docs/HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md` |
| Etapa diseño (índice) | `.claude/4_etapas/ETAPA_TABLET_DISENO_INVESTIGACION.md` |
| Etapa madre tablet | `.claude/4_etapas/ETAPA_TABLET_BAZZAR.md` |
| Etapas activas | `.claude/4_etapas/ACTUAL.md` |
| Cadena UI cerrada | `.claude/4_etapas/ETAPA_TABLET_CADENA_UI_NAV_CERRADA.md` |

---

**Registrado por Cursor — etapa CERRADA 2026-06-10. Ver ETAPA_DISENO_CIERRE.md.**
