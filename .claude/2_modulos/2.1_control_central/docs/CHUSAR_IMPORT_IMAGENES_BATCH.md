# CHUSAR — Importar imágenes · lote batch → Supabase

> **⚠️ 2026-07-10 — ENTRADA ÚNICA:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](./LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) (`2.01.04.021`) §4  
> Este CHUSAR es el **anexo ops** del lote. Ante conflicto, manda la Ley Universal.

**Código:** `2.01.04.020`  
**Palabra reservada Director:** **Importar imágenes**  
**Estado:** ✅ Operativo · lotes PASS: 371 (2026-07-06) · **1510 (2026-07-10)** · **PV Nov 2 · 508/12 nuevas (2026-08-01)**  
**Ley:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](./LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) · [NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md](./NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md) · [PUNTO_CRITICO_RECORTE_CALZADO.md](./PUNTO_CRITICO_RECORTE_CALZADO.md)  
**Cierre lote 2026-07-10:** [CHUSAR_INYECCION_IMAGENES_EJECUCION_20260710.md](./CHUSAR_INYECCION_IMAGENES_EJECUCION_20260710.md) · [ETAPA_INYECCION_IMAGENES_20260710_CERRADA.md](../../../4_etapas/ETAPA_INYECCION_IMAGENES_20260710_CERRADA.md)  
**No confundir con:** **Importación precios** (`2.3.1.7.2` · [CHUSAR_IMPORTACION_PRECIOS.md](../../2.3_report/proceso_importacion/CHUSAR_IMPORTACION_PRECIOS.md)) — otro flujo (motor listas Excel).

---

## Cuándo usar

| Situación | Acción |
|-----------|--------|
| Director dice **Importar imágenes** | Ejecutar este CHUSAR |
| Nueva importación retail / PE sin fotos en Storage | Carpeta JPG local → Supabase |
| Incendio «catálogo sin foto» post-import | Verificar BD + Storage + este pipeline |

---

## Qué resuelve

Subir **flat + sm/md/lg** (Protocolo Imágenes Nexus) desde una carpeta de JPG nombrados por molécula, con **contain + padding blanco** — nunca crop.

**Apps que consumen:** RIMEC Web · Tablet Bazzar · Report · Bazzar Web — vía `productImage.ts` / helpers (`sm/` grilla · `lg/` modal · flat fallback).

---

## Naming canónico (obligatorio)

**Dual proveedor** — ver [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](./LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) §2 · [CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md](./CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md)

| Rama | Stem |
|------|------|
| **654 calzado** | `linea-referencia-material-color.jpg` |
| **638 Kyly** | `linea_color.jpg` |

Ejemplo 654: `1184-1726-32240-15745.jpg` · Ejemplo 638: `4520_1234.jpg`

| Segmento | Fuente |
|----------|--------|
| linea | `linea.codigo_proveedor` |
| referencia | `referencia.codigo_proveedor` |
| material | código proveedor material |
| color | código proveedor color |

**Prohibido:** IDs internos Nexus (`linea_id`, `material_id`, …).

---

## Estructura Storage (bucket `productos`)

```
productos/
├── 1184-1726-32240-15745.jpg          ← flat (original optimizado)
├── sm/1184-1726-32240-15745.jpg       ← 200×200
├── md/1184-1726-32240-15745.jpg       ← 400×400
└── lg/1184-1726-32240-15745.jpg       ← 800×800
```

URL pública: `{SUPABASE_URL}/storage/v1/object/public/productos/{tier}/{nombre}.jpg`

---

## Pipeline ops — script canónico (lote carpeta)

**Script:** `control_central/tools/subir_carpeta_import_batch.py`  
**Creado:** incendio 2026-07-06 · reemplaza improvisación manual por corrida única verificada.

```powershell
cd C:\Users\hecto\Nexus_Core\control_central

python tools\subir_carpeta_import_batch.py --carpeta "C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes\{uuid-o-lote}"
```

### Qué hace el script

1. Lista JPG en carpeta (**dedupe** `.jpg`/`.JPG` — Windows cuenta doble si no).
2. Copia flat → canónico local `...\proyectos\imagenes\{nombre}.jpg` (si no existe).
3. Genera **sm/md/lg** con `resize_contain` (padding blanco).
4. Sube **flat + sm + md + lg** a Supabase (`x-upsert: true`).
5. Verifica **HEAD 200** en los 4 tiers por archivo.
6. Escribe evidencia JSON en `tablet-bazzar/docs/evidencia/IMPORT_BATCH_*.json`.

### Requisitos

| Requisito | Dónde |
|-----------|--------|
| Python 3.11+ | venv control_central |
| `Pillow`, `requests`, `psycopg2-binary` | pip |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | `control_central/.env` o `tablet-bazzar/.env.local` |

### Criterio PASS

| Check | PASS |
|-------|------|
| `upload_ok` | = total JPG carpeta |
| `upload_fail` | = 0 |
| `verify_pass` | = `verify_total` (HEAD flat/sm/md/lg) |
| Evidencia | JSON con `verify_fail_names: []` |

---

## Evidencia incendio 2026-07-06

| Campo | Valor |
|-------|--------|
| Carpeta | `...\imagenes\8a2eeaa7454c4ad38b2cd2bef5c9bbe2\` |
| Imágenes | **371** |
| Resultado | **371/371** upload · **371/371** verify |
| JSON | `tablet-bazzar/docs/evidencia/IMPORT_BATCH_8a2eeaa_20260706_104115.json` |
| Ejemplo SKU | `1184-1726-32240-15745.jpg` — tiers 200 |

**Incidente corregido:** primer intento abortado (742 contados por duplicado extensión Windows) — script actualizado con dedupe.

---

## Evidencia inyección 2026-07-10 · CERRADA

| Campo | Valor |
|-------|--------|
| Carpeta | `Z:\hector\imagen 07-07-26` |
| Imágenes | **1510** |
| Resultado | **1510/1510** upload · **1510/1510** verify |
| JSON | `tablet-bazzar/docs/evidencia/IMPORT_BATCH_8a2eeaa_20260710_154359.json` |
| Ejemplo SKU | `1220-392-29918-15745.jpg` — flat/sm/md/lg ✅ |
| CHUSAR | [CHUSAR_INYECCION_IMAGENES_EJECUCION_20260710.md](./CHUSAR_INYECCION_IMAGENES_EJECUCION_20260710.md) |
| Etapa | [ETAPA_INYECCION_IMAGENES_20260710_CERRADA.md](../../../4_etapas/ETAPA_INYECCION_IMAGENES_20260710_CERRADA.md) |

---

## Evidencia PV Noviembre · carpeta 2 · 2026-08-01

| Campo | Valor |
|-------|--------|
| Carpeta | `D:\IMAGENES PV NOVIEMBRE\2` |
| JPG carpeta | **508** (todas 654 L-R-M-C) |
| Ya en sistema | **496** |
| Nuevas Storage | **12** · verify **12/12 PASS** · ~63 s |
| JSON | `tablet-bazzar/docs/evidencia/IMPORT_BATCH_8a2eeaa_20260801_113431.json` |
| Maestro | `…\proyectos\imagenes\maestro_imagenes.txt` · **5312** · sello `# REGISTRO IMPORT · 2026-08-01` |
| CHUSAR lote | [CHUSAR_IMPORT_IMAGENES_PV_NOVIEMBRE_2_20260801.md](./CHUSAR_IMPORT_IMAGENES_PV_NOVIEMBRE_2_20260801.md) (**2.01.04.023**) |

**Próxima importación:** checklist en ese CHUSAR § «Próxima importación» · comando `--init-maestro` obligatorio.

---

## Scripts alternativos (otros escenarios)

| Escenario | Script | Notas |
|-----------|--------|-------|
| Generar miniaturas locales masivas | `convertir_miniaturas_retail.py` | Origen → `miniaturas/sm|md|lg/` |
| Subir tier ya generado | `subir_miniaturas_supabase.py --tier sm\|md\|lg` | Carpeta `miniaturas/` |
| Gap desde catálogo depósito BD | `protocolo_imagenes_cerrar_gap.py --auditar` → `--cerrar` | Lee `imagen_nombre` depósito |
| Faltantes retail Excel | `buscador_de_fotos_retail.py` | `registro_st_vt_rc_reposicion` |
| Upload flat simple carpeta | `importador_imagenes_supabase.py` | **Sin** tiers — incompleto para apps |
| Regenerar recorte Storage | `protocolo_imagenes_cerrar_gap.py --sanear-recorte` | Capa 1 crop |

**Regla:** para apps Nexus usar **siempre** flat + sm/md/lg contain — no subir solo flat.

---

## Capa BD (verificar post-upload)

Storage solo **no basta** si las filas del import no referencian el archivo.

| Campo | Tabla / vista típica |
|-------|---------------------|
| `imagen_nombre` | `registro_st_vt_rc_reposicion` |
| `imagen_url` | `v_stock_rimec` (RIMEC Web PE) |

**Checklist post-import:**

1. ¿El stem del JPG coincide con L-R-M-C de la fila?
2. ¿`imagen_nombre` o URL en BD apunta al mismo nombre?
3. Smoke RIMEC Web: Network → `productos/sm/` (no solo flat root).
4. Ctrl+Shift+R catálogo PE.

Si BD sin referencia → corregir en import retail / vista — **fuera** de este script.

---

## UI — paridad depósito (RIMEC Web)

Tras Storage PASS, catálogo PE usa `ProductImage` + `cadena-thumb-frame` (Tablet depósito). Doc: [CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md](../../2.2_rimec_web/CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md).

Errores marco: [LEY_INTEGRIDAD_VISUAL_IMAGEN.md](./LEY_INTEGRIDAD_VISUAL_IMAGEN.md) · índice `4.90.03`.

---

## Orden agente (Importar imágenes)

1. Confirmar carpeta origen + conteo JPG (dedupe) + ramo **654** / **638**.
2. Verificar naming (`L-R-M-C` o `linea_color` Kyly).
3. Ejecutar `python tools\subir_carpeta_import_batch.py --carpeta "RUTA" --init-maestro`.
4. Leer `FINAL:` — **no declarar cerrado** si `verify_pass < verify_total` o `fail>0`.
5. Confirmar maestro TXT actualizado (`maestro_imagenes.txt` · sello `# REGISTRO IMPORT` si Documenta).
6. Spot-check 3 URLs (flat/sm/lg) en navegador.
7. Confirmar BD referencia imagen en filas del import (si aplica).
8. Smoke catálogo PE/CP según lote.

**Git / deploy Storage:** Claude Code + aprobación Director — Cursor solo local ops.  
**Último lote documentado:** 2026-08-01 · [PV Noviembre 2](./CHUSAR_IMPORT_IMAGENES_PV_NOVIEMBRE_2_20260801.md).

---

**Orden:** Director · **Documenta** · incendio 2026-07-06 · keyword **Importar imágenes**
