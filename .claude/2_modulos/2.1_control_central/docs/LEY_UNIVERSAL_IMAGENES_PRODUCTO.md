# LEY UNIVERSAL — Imágenes de producto (inserción · Storage · UI · anti-desborde)

**Código:** `2.01.04.021`  
**Estado:** ✅ **CANÓNICA · ÚNICA ENTRADA** · 2026-07-10  
**Autoridad:** Director Héctor · keyword **Documenta**  
**Palabras clave:** `Protocolo Imágenes` · `Importar imágenes` · `Integridad visual` · `Recorte calzado` · `problemas de imagen` · `infección` · `marco violado` · `inyección fotos` · `meter fotos`

> **Esta es la ley madre.** Agrupa naming, tiers sm/md/lg, inserción/lote, herramientas, UI y garantía anti-desbordamiento.  
> Los docs anteriores quedan como **anexos / evidencia** — si hay conflicto, **manda este archivo**.

**No confundir con:** Importación de **precios** (`2.3.1.7.2`) — Excel motor listas · otro flujo.

---

## 0 · Norte (una frase)

> Toda foto de producto entra al holding con **naming por proveedor** (§2), vive en Supabase `productos/` como **flat + sm + md + lg** generados con **contain + padding blanco**, y se muestra en **un marco sagrado** con `object-fit: contain` + `overflow: hidden`.  
> **Desbordamiento = FAIL.** Crop en Storage = FAIL. Parche CSS solo = FAIL. **Mezclar ramas 654/638 = FAIL.**

---

## 1 · Garantía anti-desbordamiento (inquebrantable)

El desbordamiento **no ocurre** si y solo si **las dos capas PASS**. Una sola no basta.

| Capa | Qué garantiza | Si falla |
|------|---------------|----------|
| **Capa 1 — Archivo (Storage)** | JPEG cuadrado con zapato **entero** + márgenes blancos (contain) | Punta/tacón ya cortados en el archivo → CSS no recupera |
| **Capa 2 — Pantalla (UI)** | Contenedor fijo + `overflow: hidden` + img `object-fit: contain` centrada | Foto “sale de la cajita” aunque el JPEG esté bien |

### 1.1 Prohibido (causa raíz de infección)

| Prohibido | Por qué |
|-----------|---------|
| Generar sm/md/lg con **crop / cover** | Mutila calzado horizontal |
| `object-cover` en calzado (grilla, hero, PDF, modal) | Recorta punta/tacón en pantalla |
| `<img>` suelto sin marco único | Infección fila a fila |
| `h-full w-full` + padding en `<img>` sin `box-border` | Desborda el marco |
| Subir **solo flat** sin tiers | Apps piden sm/md/lg → 404 o flat gigante |
| Usar **IDs internos** Nexus en el nombre | URL no coincide con molécula comercial |
| Escalar `sm` a hero enorme | Pixelado + sensación de desborde |
| Cerrar ticket solo con CSS si HEAD del JPEG FAIL | Mentira operativa |

### 1.2 Criterio PASS visual (auditoría)

| PASS | FAIL (`IMG-FAIL-OVERFLOW-THUMB`) |
|------|----------------------------------|
| Zapato **entero** visible | Punta / tacón / suela cortados |
| **Aire blanco** entre zapato y borde del marco | Pegado al borde sin margen |
| Ningún píxel choca el radio del marco | Foto “más grande que la cajita” |
| Storage: márgenes laterales típicos ≥ 8 px en `lg/` (foto horizontal) | `margin_l = 0` y `margin_r = 0` en horizontal → crop |

### 1.3 Receta UI obligatoria (todas las apps)

```
MARCO (contenedor)
  → tamaño o aspect-ratio fijo
  → overflow: hidden
  → position relative

IMG (dentro del marco)
  → absolute inset-0 (o equivalente)
  → width/height 100%
  → object-fit: contain
  → object-position: center
```

**Un solo componente por app** (ej. `ProductImage` · `HeroProductImage`). Nadie inventa `<img>` en catálogo.

**Referencia PASS Tablet:** `data-hero-frame="v13-contain"`.

---

## 2 · Naming canónico — dual proveedor (2026-07-13)

**Regla:** el stem del archivo depende de `proveedor_importacion_id` / `tipo_v2_id`. **Mismos tiers Storage** (§3) para ambas ramas. **Nunca** aplicar guiones 654 sobre stock Kyly 638.

| Rama | `proveedor_importacion_id` | `tipo_v2_id` | Stem archivo | Ejemplo |
|------|---------------------------|--------------|--------------|---------|
| **Calzado RIMEC** | **654** | 1 | `linea-referencia-material-color.jpg` | `1184-1726-32240-15745.jpg` |
| **Confecciones Kyly** | **638** | 2 | `linea_color.jpg` (underscore · **solo L+C**) | `4520_1234.jpg` |

### 2.1 Rama 654 — calzado (4 pilares)

```
linea-referencia-material-color.jpg
```

| Segmento | Fuente | Prohibido |
|----------|--------|-----------|
| linea | `linea.codigo_proveedor` | `linea_id` |
| referencia | `referencia.codigo_proveedor` | `referencia_id` |
| material | código proveedor / F9 material | `material_id` |
| color | código proveedor / F9 color | `color_id` |

### 2.2 Rama 638 — Kyly confecciones (L + color)

```
linea_color.jpg
```

| Segmento | Fuente | Notas |
|----------|--------|-------|
| linea | `ppd.linea` / `linea_codigo_proveedor` staging | Numérico Kyly |
| color | `ppd.color_code` / `excel_color_code` | **Strip `K` inicial** si viene `K1234` |

**Variantes resolución cliente** (fallback img_art): color sin ceros · pad 4 dígitos · línea desde `cod_art_proveedor`.  
Implementación: `rimec-web/lib/productImageProtocol.ts` · `control_central/core/imagenes_protocolo.py`.

### 2.3 Regla transversal

Misma molécula comercial en: archivo local `img_art` · Storage `productos/` · `imagen_url` vista · helper TS/Python.  
**Prohibido:** URL 654 sobre fila 638 (0% match documentado 2026-07-13).

---

## 3 · Storage — bucket `productos` · tiers

```
productos/
├── {nombre}.jpg                 ← flat (original optimizado / backup)
├── sm/{nombre}.jpg              ← 200×200  ~20 KB   → listados · móvil · tablet thumbs
├── md/{nombre}.jpg              ← 400×400  ~45 KB   → desktop · Report · cards
└── lg/{nombre}.jpg              ← 800×800  ~95 KB   → zoom · modal · hero
```

| Tier | Uso | Nunca |
|------|-----|-------|
| **sm** | Grillas densas, sidebar | Hero a pantalla completa |
| **md** | Catálogo desktop, tarjetas Report | — |
| **lg** | Modal / ampliar / hero salón | Listado móvil masivo |
| **flat** | Fallback / admin / cadena flat-first | Único archivo en prod apps |

**Formato generación:** JPEG calidad **85%**, progressive, **`resize_contain`** + canvas blanco.

```python
# Lógica canónica (Pillow) — obligatoria en todo script de tiers
img.thumbnail((size, size), Image.Resampling.LANCZOS)
canvas = Image.new("RGB", (size, size), (255, 255, 255))
ox = (size - img.width) // 2
oy = (size - img.height) // 2
canvas.paste(img, (ox, oy))
```

**URL pública:**

```
{SUPABASE_URL}/storage/v1/object/public/productos/{tier}/{nombre}.jpg
# flat:
{SUPABASE_URL}/storage/v1/object/public/productos/{nombre}.jpg
```

Limpiar URL (espacios / `//`): trim + colapsar barras + restaurar `://`.

**Legacy deprecado:** `productos/thumbs/` → migrar a `sm/` o `md/`.

---

## 4 · Inserción / inyección / “meter fotos” (ops)

### 4.1 Keyword Director

| Frase exacta | Acción |
|--------------|--------|
| **Importar imágenes** | Ejecutar §4.2 (lote carpeta → Supabase) |
| **Protocolo Imágenes** | Aplicar esta ley completa (Storage + UI) |
| *problemas de imagen* / *infección* / *marco violado* | Leer esta ley + índice errores `4.90.03` **antes** de código |

### 4.2 Pipeline canónico de lote (mejor práctica)

**Script:** `control_central/tools/subir_carpeta_import_batch.py`

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
python tools\subir_carpeta_import_batch.py --carpeta "C:\ruta\a\carpeta\jpg"
```

| Paso | Qué hace |
|------|----------|
| 1 | Lista JPG · **dedupe** `.jpg`/`.JPG` (Windows) |
| 2 | Copia flat a origen canónico local si falta |
| 3 | Genera **sm/md/lg** contain |
| 4 | Sube **flat + sm + md + lg** (`x-upsert: true`) |
| 5 | Verifica **HEAD 200** en los 4 tiers |
| 6 | Escribe evidencia JSON |

**PASS lote:** `upload_fail = 0` · `verify_pass = verify_total` · `verify_fail_names: []`.  
**No declarar cerrado** si falla un solo HEAD.

**Requisitos:** Python 3.11+ · Pillow · requests · `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` en `.env`.

**Evidencia referencia:** incendio 2026-07-06 · **371/371** PASS · carpeta `8a2eeaa…`.  
**Evidencia 2026-07-10:** `Z:\hector\imagen 07-07-26` · **1510/1510** PASS · [CHUSAR_INYECCION_IMAGENES_EJECUCION_20260710.md](./CHUSAR_INYECCION_IMAGENES_EJECUCION_20260710.md) · etapa **CERRADA**.

### 4.3 Capa BD (post-upload)

Storage PASS **no alcanza** si la fila no referencia el archivo.

| Campo | Dónde |
|-------|--------|
| `imagen_nombre` | `registro_st_vt_rc_reposicion` (retail) |
| URL / nombre | vistas stock RIMEC (`v_stock_rimec` · PE) |

Checklist: stem JPG = L-R-M-C de la fila · smoke Network `productos/sm/` o cadena flat-first · Ctrl+Shift+R.

### 4.4 Matriz de herramientas (usar la correcta)

| Escenario | Herramienta | Notas |
|-----------|-------------|-------|
| **Lote carpeta import (default)** | `subir_carpeta_import_batch.py` | **Canónico** · flat+tiers+verify |
| Generar miniaturas locales masivas | `convertir_miniaturas_retail.py` | Origen → `miniaturas/sm\|md\|lg/` |
| Subir tier ya generado | `subir_miniaturas_supabase.py --tier …` | Carpeta `miniaturas/` |
| Gap desde BD depósito | `protocolo_imagenes_cerrar_gap.py --auditar` → `--cerrar` | Por marca |
| Regenerar crop Storage | `protocolo_imagenes_cerrar_gap.py --sanear-recorte` / `--cerrar` | Capa 1 |
| Erradicar recorte PE/CP | `erradicar_recorte_pe.py` · `erradicar_recorte_rimec_web.py` | RIMEC Web |
| Faltantes retail Excel | `buscador_de_fotos_retail.py` | Staging retail |
| Upload flat solo | `importador_imagenes_supabase.py` | ❌ **Incompleto** para apps |
| SKU unitario (plantilla) | `tablet-bazzar/scripts/regenerar_storage_*.py` | Caso a caso |

**Regla de oro:** para apps Nexus **siempre** flat + sm + md + lg contain. Nunca solo flat en operación.

---

## 5 · Consumo por app (mejores prácticas)

| App | Tier preferido | Componente / helper | Nota anti-desborde |
|-----|----------------|---------------------|--------------------|
| **Tablet Bazzar** | sm thumbs · lg hero | `HeroProductImage` · `product-image.ts` | `v13-contain` |
| **RIMEC Web** | cadena **flat → md → lg** (evitar sm crop legacy) | `ProductImage` · `cadena-thumb-frame` | Prefetch PE · default Calzados |
| **Report** | md cards · lg modal | `product-image.ts` | PDF: max-width/height |
| **Bazzar Web** | md cards · lg detalle | mismo contrato | — |
| **Control Central** | md | `image_utils.py` | — |

Helpers: construir URL **solo** vía helper — no hardcodear en JSX.

---

## 6 · Checklist agente (antes de tocar fotos)

1. ¿Leí **esta ley** (`2.01.04.021`)?  
2. ¿Keyword correcta? (**Importar imágenes** vs bug marco)  
3. ¿Naming correcto según **proveedor** (654 guiones · 638 underscore)?  
4. ¿Generación contain (no crop)?  
5. ¿Subí **4 tiers** + verify HEAD?  
6. ¿BD referencia el stem?  
7. ¿UI usa componente único + contain + overflow hidden?  
8. ¿Smoke visual PASS (aire blanco, zapato entero)?  
9. Si FAIL en un SKU → auditar **Storage primero**, CSS después.  
10. Índice errores § **4.90.03** si hay infección.

---

## 7 · Errores canónicos (índice)

| Código | Nombre | Capa |
|--------|--------|------|
| `4.90.03.001` | Desbordamiento miniatura grilla | UI |
| `4.90.03.002` | Recorte calzado en tier Storage | Storage |
| `4.90.03.003` | Thumb URL flat sin sm/ | Cadena URL |
| `4.90.03.004` | Padding en img desborda marco | UI |
| `4.90.03.005` | Hover scale rompe contención | UI |

Detalle: `.claude/5_errores/detalle/` · registro: `REGISTRO_ERRORES_IMAGEN.md`.

---

## 8 · Anexos (docs previos — no borrar; apuntan aquí)

| Anexo | Rol residual |
|-------|----------------|
| [LEY_INTEGRIDAD_VISUAL_IMAGEN.md](./LEY_INTEGRIDAD_VISUAL_IMAGEN.md) | Narrativa marco / infección |
| [NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md](./NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md) | Contrato sm/md/lg histórico |
| [CHUSAR_IMPORT_IMAGENES_BATCH.md](./CHUSAR_IMPORT_IMAGENES_BATCH.md) | Ops lote · keyword Importar imágenes |
| [CHUSAR_INYECCION_IMAGENES_EJECUCION_20260710.md](./CHUSAR_INYECCION_IMAGENES_EJECUCION_20260710.md) | Cierre lote 1510 · 2026-07-10 |
| [PUNTO_CRITICO_RECORTE_CALZADO.md](./PUNTO_CRITICO_RECORTE_CALZADO.md) | Caso 4215.1034 · auditoría márgenes |
| [POLITICA_THUMBNAILS.md](./POLITICA_THUMBNAILS.md) | Legacy PDF `thumbs/` |
| [PROTOCOLO_IMAGENES_CARGA_INTEGRAL_RIMEC_WEB.md](../../2.2_rimec_web/PROTOCOLO_IMAGENES_CARGA_INTEGRAL_RIMEC_WEB.md) | Prefetch PE · flat-first |
| [CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md](../../2.2_rimec_web/CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md) | NIIF PE |
| [MODULO_IMAGENES_PRODUCTO.md](../../2.4_tablet_bazzar/MODULO_IMAGENES_PRODUCTO.md) | Tablet |
| [CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md](./CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md) | Absorción 638 · ops + código · 2026-07-13 |
| [CURSOR_CONTINUAR_UPLOAD_IMAGENES.md](../../../1_fundamentos/1.1_protocolos/CURSOR_CONTINUAR_UPLOAD_IMAGENES.md) | Superseded → batch |

Origen local típico: `C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes\`

---

## 9 · Promesa operativa al Director

Si el agente y los scripts cumplen **§1 + §3 + §4 + §5**:

1. No hay crop en Storage.  
2. No hay `<img>` suelto en catálogo.  
3. Todo lote nuevo pasa verify 4 tiers.  
4. El desbordamiento **no debe ocurrir**; si aparece, es **violación de esta ley** (capa 1 o 2) — se diagnostica con §1.2 y §7, no con inventos.

**Shibboleth:** Andrés, el que viene.
