# PUNTO CRÍTICO — Recorte de calzado (cover vs contain)

> **⚠️ 2026-07-10 — ENTRADA ÚNICA:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](./LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) (`2.01.04.021`) §1 + §3  
> Este archivo es **anexo** del caso fundador 4215.1034. Ante conflicto, manda la Ley Universal.

> **Palabra clave:** `Recorte calzado` · `Protocolo Imágenes`  
> **Estado:** CANÓNICO — obligatorio en todo el holding  
> **Caso fundador:** SKU `4215.1034` · ACTVITTA · 2026-06-14  
> **Caso salón MOLEKINHA:** SKU `2083.1133` · CHATITA · 2026-06-15 · [HOTFIX tablet](../../tablet-bazzar/docs/HOTFIX_HERO_RECORTE_MOLEKINHA_2083_1133.md)  
> **Caso RIMEC Web modal:** SKU `4232.409` · BEIRA RIO · 2026-07-06 · CSS sin paridad Tablet + flat-only Storage  
> **Import batch:** [CHUSAR_IMPORT_IMAGENES_BATCH.md](./CHUSAR_IMPORT_IMAGENES_BATCH.md) · 371 JPG PASS 2026-07-06  
> **Evidencia:** `tablet-bazzar/docs/evidencia/HERO_CASO_4215_1034.json` · `HERO_REGEN_2083_1133.json`

---

## Resumen ejecutivo

El síntoma «**la imagen es más grande que su contenedor**» o «**falta punta/tacón**» puede ser **CSS** o **JPEG en Storage**. En el holding, el caso más frecuente es el **segundo**: tiers `sm/md/lg` generados con **crop centrado** al pasar fotos **horizontales** (ej. 800×545) a cuadrado 200/400/800.

**Regla:** Ningún tier de calzado se genera con crop. Siempre **fit contain** + padding blanco. Si el tier ya está mal en Storage, **ningún `object-contain` en frontend lo repara**.

---

## Mapa del error (caso 4215.1034)

| Paso | Qué | Resultado |
|------|-----|-----------|
| 1 | Origen local `imagenes/4215-1034-28458-98904.jpg` | **800×545** — zapato completo |
| 2 | Storage `lg/` **antes** | **800×800** — margin lateral **0 px** → punta/tacón cortados en archivo |
| 3 | CSS hero tablet (`v13-contain`) | Img dentro del marco ✅ — pero JPEG ya mutilado ❌ |
| 4 | Regeneración `resize_contain` + upload | margin lateral **24 px** — zapato completo ✅ |

### Archivos evidencia

| Archivo | Descripción |
|---------|-------------|
| `tablet-bazzar/docs/evidencia/4215-1034-lg.jpg` | Storage ANTES (recortado) |
| `tablet-bazzar/docs/evidencia/4215-1034-lg-FIXED.jpg` | Storage DESPUÉS (contain) |
| `tablet-bazzar/docs/evidencia/HERO_CASO_4215_1034.json` | Auditoría completa |
| `tablet-bazzar/docs/evidencia/HERO_AUDIT_4215_1034.json` | HEAD tiers Storage |

---

## Cómo detectar el problema (auditoría obligatoria)

### A — Archivo JPEG en Storage (prioridad 1)

Descargar `sm/` o `lg/` y medir **márgenes del calzado** respecto al canvas cuadrado:

```python
# Criterio PASS calzado importadora (horizontal en cuadrado)
# margin_l_px >= 8  Y  margin_r_px >= 8
# Si margin_l == 0 y margin_r == 0 con foto horizontal → FAIL (crop)
```

Script referencia: `tablet-bazzar/scripts/auditar_hero_4215_1034.ts` (adaptar por SKU).

### B — CSS frontend (prioridad 2)

Solo si el JPEG PASS:

```text
Contenedor: overflow-hidden + tamaño fijo
Imagen: absolute inset-0 h-full w-full object-contain
PROHIBIDO: h-full w-full + padding en <img> sin box-border (desborda y clip)
```

Implementación tablet: `HeroProductImage` → `data-hero-frame="v13-contain"`.

### C — No confundir con bbox naive

Contar píxeles no-blancos en x=0 no basta: un crop puede dejar píxeles en el borde. Validar **visualmente** punta y tacón o medir márgenes con umbral de fondo blanco.

---

## Solución canónica

### 1. Generación local (lotes)

```bash
cd control_central
python tools/convertir_miniaturas_retail.py
# Salida: sm/md/lg con thumbnail + paste centrado (contain)
```

Lógica obligatoria (`convertir_miniaturas_retail.py` / `protocolo_imagenes_cerrar_gap.py`):

```python
img.thumbnail((size, size), Image.Resampling.LANCZOS)
canvas = Image.new("RGB", (size, size), (255, 255, 255))
ox = (size - img.width) // 2
oy = (size - img.height) // 2
canvas.paste(img, (ox, oy))
```

### 2. Cierre masivo Storage

```bash
cd control_central
python tools/protocolo_imagenes_cerrar_gap.py --auditar
python tools/protocolo_imagenes_cerrar_gap.py --cerrar --marca ACTVITTA
python tools/protocolo_imagenes_cerrar_gap.py --cerrar --marca VIZZANO
python tools/protocolo_imagenes_cerrar_gap.py --verificar
```

**Importante:** `--cerrar` debe usar `resize_contain` desde **origen plano** (`imagenes/` o flat de calidad), no re-escalar un tier ya recortado.

### 3. Caso unitario (hotfix un SKU)

```bash
cd control_central
python ../tablet-bazzar/scripts/regenerar_storage_4215_1034.py
```

Plantilla para otros SKUs: cambiar `NOMBRE` y `ORIGEN` en el script.

### 4. Frontend (todas las apps)

| App | Regla |
|-----|-------|
| Tablet hero | `HeroProductImage` v13 — `lg/` o `sm/` con `object-contain` |
| Thumbs | `ProductImage` thumb — `absolute inset-0 object-contain` |
| RIMEC Web | `ProductImage` + `cadena-thumb-frame` · lightbox `variant="hero"` — **no** CSS `rimec-modal-*` inventado |
| Report / FI | Mismo patrón; nunca `object-cover` en calzado |

Tras upload Storage: **Ctrl+Shift+R** o cache-bust (`?v=timestamp`) en QA.

---

## Ámbitos afectados en el holding

| Ámbito | Riesgo |
|--------|--------|
| Tablet `/cadena/vista` hero | Alto — salón venta |
| Tablet carruseles / mazo | Medio — mismo tier `sm/` |
| RIMEC Web catálogo + modal PE | Medio — paridad **`cadena-thumb-frame`** Tablet depósito · CHUSAR [2.2.1.04](../../2.2_rimec_web/CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md) |
| Report ventas-fotos | Medio |
| PDF catálogo | Alto si embed tier recortado |
| Streamlit FI card | Bajo (thumb pequeño) |

**Acción holding:** ejecutar `--cerrar` por marca hasta ≥95% PASS auditoría márgenes.

---

## Checklist agente (antes de cerrar ticket imagen)

- [ ] ¿Origen es horizontal (ancho > alto)?
- [ ] ¿HEAD 200 en tier usado por la app?
- [ ] ¿Márgenes laterales en JPEG ≥ 8 px (sm/lg)?
- [ ] ¿CSS usa `object-contain` sin padding que desborde?
- [ ] ¿Evidencia JSON + captura antes/después?
- [ ] ¿Director validó en dispositivo real?

---

## Referencias

- Protocolo madre: [NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md](./NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md)
- Tablet registro etapa: `tablet-bazzar/docs/ETAPA_DISENO_REGISTRO.md`
- Pipeline: `control_central/tools/convertir_miniaturas_retail.py`
- Gap Storage: `control_central/tools/protocolo_imagenes_cerrar_gap.py`
- **Lote import carpeta:** [CHUSAR_IMPORT_IMAGENES_BATCH.md](./CHUSAR_IMPORT_IMAGENES_BATCH.md) · `subir_carpeta_import_batch.py`

---

**Registrado:** 2026-06-14 · Cursor + Director Héctor  
**Cierre parcial:** caso 4215.1034 RESUELTO · gap masivo marcas PENDIENTE ops
