# Imágenes de producto — Tablet Bazzar

Convención unificada Nexus — **Protocolo Imágenes** (`sm` / `md` / `lg`).

> **Punto crítico holding:** [PUNTO_CRITICO_RECORTE_CALZADO.md](../../.claude/2_modulos/2.1_control_central/docs/PUNTO_CRITICO_RECORTE_CALZADO.md)  
> Casos resueltos: `4215.1034` (ACTVITTA) · **`2083.1133` (MOLEKINHA)** — ver [HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md](./HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md)

## URL pública

`lib/storage-url.ts` → `publicStorageObjectUrl("productos", path)` + `cleanSupabaseUrl`.

Base: `NEXT_PUBLIC_SUPABASE_URL` + `/storage/v1/object/public/productos/`

## Sistema sm/md/lg

| Tamaño | Ruta Storage | Uso Tablet |
|--------|--------------|------------|
| **sm** | `productos/sm/L-R-M-C.jpg` | Thumbs, sidebar, footer |
| **lg** | `productos/lg/...` | Hero salón (`HeroProductImage`) |
| **md** | `productos/md/...` | No usar — tiers legacy pueden estar recortados |

**Ley crítica:** tiers deben generarse con **fit contain**. Si Storage tiene crop, hero y thumbs fallan igual.

## Hero cadena (v16 — fill-host · contain + zoom leve)

| Elemento | Valor |
|----------|-------|
| Componente | `components/cadena/HeroProductImage.tsx` |
| Marco | `data-hero-frame="v16-fill-host"` |
| Hook | `lib/use-hero-progressive-src.ts` — preview sm/ → upgrade lg/ |
| Lightbox | `components/cadena/ProductLightbox.tsx` — tap hero |
| Layout | `.cadena-hero-host` **absolute inset-0** en card; labels overlay |
| CSS img | `object-fit: contain` · `transform: scale(1.12)` · **sin** `cover` |
| Fuente hero | `imagen_url_hero` (**lg/**) vía `pickHeroProgressive` |
| Prefetch | `lib/prefetch-images.ts` — lg antes que sm |

**Cierre aspecto visual:** [ETAPA_ASPECTO_VISUAL_CIERRE.md](./ETAPA_ASPECTO_VISUAL_CIERRE.md) · evidencia `docs/evidencia/ETAPA_ASPECTO_VISUAL_CIERRE_20260616.json`  
**Chusar agentes:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_ASPECTO_VISUAL_HERO.md`

**Prohibido en hero v16:**

- `object-fit: cover` (recorta punta/tacón)
- `aspect-square` / `58vmin` / marco cuadrado fijo
- Gradiente `from-white via-white/95` en overlay
- `width`/`height` HTML en `<img>`
- `filter: drop-shadow` en img hero

**Doc Chusar:** `.claude/2_modulos/2.4_tablet_bazzar/MODULO_IMAGENES_PRODUCTO.md`  
**Cierre etapa:** `docs/evidencia/CIERRE_IMAGENES_654_20260616.json`

**Antes de parchear CSS:** auditar JPEG (`scripts/auditar_hero_2083_1133.ts`). Si `margin_l_px` y `margin_r_px` = 0 en foto horizontal → **FAIL Storage**, no CSS. Ver `PUNTO_CRITICO_RECORTE_CALZADO.md` y `docs/evidencia/HERO_AUDIT_2083_1133.json`.

**Prohibido:** `h-full w-full` + `padding` en `<img>` sin `box-border` — desborda y recorta punta/tacón.

## URL canónica (servidor)

```typescript
import { enrichDepositoFilaImagenes } from "@/lib/product-image";
```

APIs depósito/cadena enriquecen filas en servidor.

## Generación / reparación Storage

| Acción | Script |
|--------|--------|
| Lote local sm/md/lg | `control_central/tools/convertir_miniaturas_retail.py` |
| Cierre gap por marca | `control_central/tools/protocolo_imagenes_cerrar_gap.py --cerrar` |
| Un SKU MOLEKINHA (plantilla) | `scripts/regenerar_storage_2083_1133.py` |
| Un SKU ACTVITTA (plantilla) | `scripts/regenerar_storage_4215_1034.py` |
| Auditoría HEAD | `scripts/auditar_hero_4215_1034.ts` |

Origen fotos: `C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes\`

## UI cadena

| Componente | Uso |
|------------|-----|
| `HeroProductImage` | Hero central — **v16-fill-host** · lg/ + contain + scale 1.12 |
| `ProductImage` variant thumb | Carruseles, mazo, naipes |
| `lib/prefetch-images.ts` | Prefetch thumb + hero |

## Evidencia y registro etapa

| Doc | Contenido |
|-----|-----------|
| **[ETAPA_ASPECTO_VISUAL_CIERRE.md](./ETAPA_ASPECTO_VISUAL_CIERRE.md)** | **✅ Cierre hero v16-fill-host (2026-06-16)** |
| `docs/evidencia/ETAPA_ASPECTO_VISUAL_CIERRE_20260616.json` | Evidencia máquina aspecto visual |
| [HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md](./HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md) | **Error crítico hero + solución (2026-06-15)** |
| `docs/evidencia/HERO_REGEN_2083_1133.json` | Evidencia Storage antes/después 1133 |
| `docs/evidencia/HERO_CASO_4215_1034.json` | Mapa error + fix Storage 4215 |
| `docs/evidencia/4215-1034-lg.jpg` | Antes (recortado) |
| `docs/evidencia/4215-1034-lg-FIXED.jpg` | Después (contain) |
| `docs/ETAPA_DISENO_REGISTRO.md` | Cronología etapa diseño |

## Dev

Reinicio sin `EADDRINUSE`: `REINICIAR_DEV.bat` (puerto 3002).

---

**Última actualización:** 2026-06-16 — **v16-fill-host** cierre aspecto visual hero
