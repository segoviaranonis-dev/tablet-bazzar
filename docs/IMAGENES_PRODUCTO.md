# Imágenes de producto — Tablet Bazzar

Convención unificada Nexus — **Protocolo Imágenes** (`sm` / `md` / `lg`).

> **Punto crítico holding:** [PUNTO_CRITICO_RECORTE_CALZADO.md](../../.claude/2_modulos/2.1_control_central/docs/PUNTO_CRITICO_RECORTE_CALZADO.md)  
> Caso resuelto: `4215.1034` · evidencia `docs/evidencia/HERO_CASO_4215_1034.json`

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

## Hero cadena (v13)

| Elemento | Valor |
|----------|-------|
| Componente | `components/cadena/HeroProductImage.tsx` |
| Marco | `data-hero-frame="v13-contain"` |
| CSS | `absolute inset-0 h-full w-full object-contain` en contenedor cuadrado |
| Fuente | `imagen_url_hero` (lg/) → thumb → flat |

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
| Un SKU (plantilla) | `scripts/regenerar_storage_4215_1034.py` |
| Auditoría HEAD | `scripts/auditar_hero_4215_1034.ts` |

Origen fotos: `C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes\`

## UI cadena

| Componente | Uso |
|------------|-----|
| `HeroProductImage` | Hero central — lg/ + contain |
| `ProductImage` variant thumb | Carruseles, mazo, naipes |
| `lib/prefetch-images.ts` | Prefetch thumb + hero |

## Evidencia y registro etapa

| Doc | Contenido |
|-----|-----------|
| `docs/evidencia/HERO_CASO_4215_1034.json` | Mapa error + fix Storage |
| `docs/evidencia/4215-1034-lg.jpg` | Antes (recortado) |
| `docs/evidencia/4215-1034-lg-FIXED.jpg` | Después (contain) |
| `docs/ETAPA_DISENO_REGISTRO.md` | Cronología etapa diseño |

## Dev

Reinicio sin `EADDRINUSE`: `REINICIAR_DEV.bat` (puerto 3002).

---

**Última actualización:** 2026-06-14 — solución crítica recorte documentada
