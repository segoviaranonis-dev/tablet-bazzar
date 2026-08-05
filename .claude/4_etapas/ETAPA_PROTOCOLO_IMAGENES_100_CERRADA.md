# ETAPA CERRADA — Protocolo Imágenes · 100 % (proveedor 654 · Tablet Bazzar)

**ID:** `ETAPA-PROTOCOLO-IMAGENES-100-20260616`  
**Fecha apertura:** 2026-06-16  
**Fecha cierre:** 2026-06-16  
**Director:** Héctor Segovia — *«imágenes perfectas · aprobado · cierra»*  
**Estado:** ✅ **CERRADA**  
**Shibboleth:** 7 años

---

## Objetivo cumplido

Catálogo tablet proveedor **654** (Beira Rio) con fotos **enteras** (contain) en Storage y **calidad hero** en salón — paridad RIMEC Web / Bazzar Web. Candado holding levantado.

| Métrica | Resultado |
|---------|-----------|
| Imágenes distintas depósito tablet | **6.686** |
| Storage contain (sm/md/lg + flat) | **6.677 OK** |
| Omitidas por Director (sin JPG origen) | **9** — aceptado cierre |
| QA piso Director | ✅ **imágenes perfectas** |

---

## Entregables

| # | Entrega | Evidencia |
|---|---------|-----------|
| E1 | Erradicación masiva crop → contain | `erradicar_recorte_tablet.py` · `ERRADICAR_RECORTE_TABLET_20260616_172850.json` |
| E2 | Retry upload 263/263 | `control_central/reportes_upload/retry_erradicar.log` |
| E3 | Hero progresivo **lg/** + lightbox | `tablet-bazzar` · `HeroProductImage` · `use-hero-progressive-src.ts` |
| E4 | Prefetch vecindario lg-first | `lib/prefetch-images.ts` |
| E5 | Doc Chusar módulo imágenes | [MODULO_IMAGENES_PRODUCTO.md](../2_modulos/2.4_tablet_bazzar/MODULO_IMAGENES_PRODUCTO.md) |
| E6 | Pies error cerrados | **4.90.03.002** · **4.03.02.001** · **4.90.03.008** |
| E7 | Sub-sesión calidad hero | [SUBSESION_TABLET_CALIDAD_IMAGEN_20260616_CERRADA.md](./SUBSESION_TABLET_CALIDAD_IMAGEN_20260616_CERRADA.md) |

---

## 9 JPG omitidas (decisión Director)

Sin archivo en `imagenes\` ni `\\10.18.3.1\home\img_art\`. **No bloquean cierre.**

1. `108-619--PI.jpg`
2. `1447-105-7286-101441.jpg`
3. `1447-105-7286-15745.jpg`
4. `3092-102-23572-15745.jpg`
5. `3093-101-25561-90283.jpg`
6. `6506-126-7286-35312.jpg`
7. `6850-107-25365-15745.jpg`
8. `8488-108-30720-100203.jpg`
9. `9074-103-23654-89673.jpg`

SKUs afectados muestran fallback gradiente hasta que exista origen.

---

## Incidente resuelto (resumen)

| Capa | Código | Causa | Fix |
|------|--------|-------|-----|
| Storage JPEG | **4.90.03.002** | Tiers sm/md/lg con crop centrado | Regen desde origen con `resize_contain` |
| Tablet síntoma | **4.03.02.001** | Hero/carrusel cortado | Mismo fix Storage + contain CSS |
| Hero pixelado | **4.90.03.008** | Hero se quedaba en sm/ 200px | Progresivo lg/ + prefetch lg-first |

**Caso fundador:** `60012-102-5881-15745.jpg` — local PASS · Storage sm FAIL → regen OK.

Detalle: [4.90.03.002_storage-crop-calzado.md](../5_errores/detalle/4.90.03.002_storage-crop-calzado.md)

---

## Protocolo cierre etapa (1.1.10)

| Paso | Estado | Nota |
|------|--------|------|
| 1 Rama aislada | ✅ | Trabajo tablet-bazzar + control_central ops |
| 2 Aprobación Director | ✅ | «imágenes perfectas aprobado» 2026-06-16 |
| 3 Git commit + push | ⏳ | **Claude Code** — Cursor no pushea |
| 4 Deploy verificado | ⏳ | **Claude Code** — Vercel tablet |
| 5 PC sync | ⏳ | **Claude Code** — pull main |

**Doc cerrada en Chusar.** Git/deploy = siguiente paso Claude Code.

---

## Jerarquía post-cierre

| Etapa | Estado |
|-------|--------|
| **Esta etapa** | ✅ CERRADA |
| [ETAPA_TABLET_FINAL.md](./ETAPA_TABLET_FINAL.md) | 🚧 ACTIVA — Track 1 imágenes ✅ |
| Bazzar Web MVP | ⏸ reanudable |
| Import Kyly 638 | ⏸ reanudable post Director |
| SUBSESION triángulo pilares | ⏸ reanudable |

---

## Enlaces

- Apertura: [ETAPA_PROTOCOLO_IMAGENES_100.md](./ETAPA_PROTOCOLO_IMAGENES_100.md) (histórico)
- Módulo: [MODULO_IMAGENES_PRODUCTO.md](../2_modulos/2.4_tablet_bazzar/MODULO_IMAGENES_PRODUCTO.md)
- Ops: `control_central/tools/erradicar_recorte_tablet.py`
- Evidencia cierre: `tablet-bazzar/docs/evidencia/CIERRE_IMAGENES_654_20260616.json`

---

**Cierre Director — 2026-06-16 · Producto = imagen · 654 dominado.**
