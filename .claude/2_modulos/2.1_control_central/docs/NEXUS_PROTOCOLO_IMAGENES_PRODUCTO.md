# Nexus Core — Protocolo Único de Imágenes de Producto

> **⚠️ 2026-07-10 — ENTRADA ÚNICA:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](./LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) (`2.01.04.021`)  
> Este archivo queda como **anexo** histórico del contrato sm/md/lg. Ante conflicto, manda la Ley Universal.

> **⚡ MEMORIA SECUNDARIA ACTIVADA**  
> **Palabra clave:** `Protocolo Imágenes`

---

## 🎯 LEY FUNDAMENTAL

> **Integridad visual:** toda imagen **contenida** en su marco — ver [LEY_INTEGRIDAD_VISUAL_IMAGEN.md](./LEY_INTEGRIDAD_VISUAL_IMAGEN.md). Mismo rigor que un dato contable.

Todas las apps del ecosistema deben resolver imágenes de calzado desde el mismo contrato:

```text
Supabase Storage bucket: productos
Archivo canónico: linea-referencia-material-color.jpg
Sistema responsivo: 3 tamaños (sm/md/lg)
```

**Ejemplo de nombre:**
```text
4076-1350-9569-15745.jpg
```

**Estructura completa:**
```
productos/
├── sm/4076-1350-9569-15745.jpg    (200×200, ~20KB)  → Móvil/Tablet
├── md/4076-1350-9569-15745.jpg    (400×400, ~45KB)  → Desktop/Report
├── lg/4076-1350-9569-15745.jpg    (800×800, ~95KB)  → Zoom/Modal
└── 4076-1350-9569-15745.jpg       (original)         → Backup/Admin
```

## 📋 Composición del Nombre

| Posición | Dato | Fuente | Ejemplo |
|----------|------|--------|---------|
| 1 | linea | `linea.codigo_proveedor` | `4076` |
| 2 | referencia | `referencia.codigo_proveedor` | `1350` |
| 3 | material | codigo proveedor/F9 del material | `9569` |
| 4 | color | codigo proveedor/F9 del color | `15745` |

**⚠️ REGLA CRÍTICA:** NO usar IDs internos Nexus (`linea_id`, `material_id`, etc.) para construir nombres de archivo.

---

## 📐 Sistema de Tamaños Responsivo (sm/md/lg)

| Tamaño | Dimensiones | Peso | Uso | Casos |
|--------|-------------|------|-----|-------|
| **sm** | 200×200px | ~20 KB | Móvil, Listados | Tablet Bazzar, Cards móviles |
| **md** | 400×400px | ~45 KB | Desktop, Tarjetas | Report, RIMEC Web |
| **lg** | 800×800px | ~95 KB | Zoom, Modal | Vista detalle, Ampliar |
| **original** | Variable | 1-3 MB | Backup | Solo admin/emergencias |

**Formato:** JPEG, Calidad 85%, Progressive, **fit contain** (calzado entero en cuadrado con padding blanco)

**Prohibido en calzado:** crop centrado cuadrado — corta tacón/punta en tiers sm/md/lg.

---

## 🚨 PUNTO CRÍTICO — Recorte calzado (cover vs contain)

> **Doc extendido:** [PUNTO_CRITICO_RECORTE_CALZADO.md](./PUNTO_CRITICO_RECORTE_CALZADO.md)  
> **Palabras clave:** `Recorte calzado` · caso fundador `4215.1034` (ACTVITTA, 2026-06-14)

### El problema que afecta muchas pantallas

Las fotos de importadora suelen ser **horizontales** (ej. 800×545). Si al generar `sm/md/lg` se usa **crop centrado** para forzar cuadrado, el JPEG en Storage **ya no tiene punta ni tacón**. El frontend con `object-contain` **no puede recuperarlos** — parece que «la imagen es más grande que el contenedor» pero el daño está en el archivo.

### Síntomas

| Síntoma en UI | Causa real |
|---------------|------------|
| Punta/tacón cortados en hero y thumbs | Tier Storage generado con **cover** (legacy) |
| Mismo recorte en sidebar y hero | Misma URL `sm/` o `lg/` corrupta |
| CSS `object-contain` «no arregla» | JPEG fuente mutilado — arreglar Storage primero |
| Zapato miniatura en panel enorme | Tier `sm` 200px sin escalar + marco grande (CSS secundario) |

### Criterio PASS en Storage (auditoría)

Tras `resize_contain` correcto, el calzado horizontal en canvas cuadrado debe tener **márgenes blancos laterales** (típico ≥ 8 px en `lg/`). Si `margin_l_px = 0` y `margin_r_px = 0` en foto horizontal → **FAIL — regenerar tier**.

Evidencia caso resuelto: `tablet-bazzar/docs/evidencia/HERO_CASO_4215_1034.json`

### Solución obligatoria (orden)

1. **Storage:** regenerar `sm/md/lg` con `convertir_miniaturas_retail.py` o `protocolo_imagenes_cerrar_gap.py --cerrar` desde origen en `imagenes/`.
2. **Caso unitario:** `tablet-bazzar/scripts/regenerar_storage_4215_1034.py` (plantilla por SKU).
3. **CSS:** `object-contain`; contenedor `overflow-hidden`; **nunca** `h-full w-full` + `padding` en `<img>` sin `box-border`.
4. **QA:** Ctrl+Shift+R tras upload; verificar `data-hero-frame="v13-contain"` en tablet.

### Prohibido

- ❌ Re-escalar un tier ya recortado pensando que «mejora»
- ❌ `object-cover` en calzado (catálogo, hero, FI, PDF)
- ❌ Cerrar ticket solo con parche CSS si HEAD del JPEG sigue en FAIL
- ❌ Asumir que `md/` legacy es seguro — puede estar recortado igual que `sm/`

**Performance:**
```
Móvil 3G: sm (20KB) = carga instantánea ⚡
Desktop: md (45KB) = carga rápida ✅
Zoom: lg (95KB) = detalle perfecto 🔍
Original: 2MB = NUNCA usar en frontend ❌
```

## 🔗 URLs Públicas

### **Estructura Base**
```
{SUPABASE_URL}/storage/v1/object/public/productos/{size}/{nombre}.jpg
```

### **Ejemplos Reales**
```typescript
// Móvil/Tablet (20 KB)
https://extrlcvcgypwazxipvqm.supabase.co/storage/v1/object/public/productos/sm/4076-1350-9569-15745.jpg

// Desktop/Report (45 KB)
https://extrlcvcgypwazxipvqm.supabase.co/storage/v1/object/public/productos/md/4076-1350-9569-15745.jpg

// Zoom/Modal (95 KB)
https://extrlcvcgypwazxipvqm.supabase.co/storage/v1/object/public/productos/lg/4076-1350-9569-15745.jpg

// Original (2 MB) - Solo admin
https://extrlcvcgypwazxipvqm.supabase.co/storage/v1/object/public/productos/4076-1350-9569-15745.jpg
```

### **⚠️ Limpieza de URL**
La URL de Supabase debe limpiarse antes de usarla porque en Windows/Vercel puede venir con espacios o barras duplicadas:

```typescript
function cleanSupabaseUrl(url: string): string {
  return url.trim().replace(/\/+/g, '/').replace(':/', '://');
}
```

## 🎨 Helpers Oficiales por Tecnología

### **TypeScript / JavaScript (Next.js)**

```typescript
// lib/product-image.ts

type ImageSize = 'sm' | 'md' | 'lg' | 'original';

export function getProductImageUrl(
  nombre: string,
  size: ImageSize = 'md'
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = 'productos';
  
  if (size === 'original') {
    return `${baseUrl}/storage/v1/object/public/${bucket}/${nombre}`;
  }
  
  return `${baseUrl}/storage/v1/object/public/${bucket}/${size}/${nombre}`;
}

// Uso
const urlMovil = getProductImageUrl('4076-1350-9569-15745.jpg', 'sm');
const urlDesktop = getProductImageUrl('4076-1350-9569-15745.jpg', 'md');
const urlZoom = getProductImageUrl('4076-1350-9569-15745.jpg', 'lg');
```

### **Python (Streamlit / Scripts)**

```python
# core/image_utils.py

from typing import Literal
import os

ImageSize = Literal['sm', 'md', 'lg', 'original']

def get_product_image_url(
    nombre: str,
    size: ImageSize = 'md'
) -> str:
    base_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    bucket = 'productos'
    
    if size == 'original':
        return f"{base_url}/storage/v1/object/public/{bucket}/{nombre}"
    
    return f"{base_url}/storage/v1/object/public/{bucket}/{size}/{nombre}"

# Uso
url_movil = get_product_image_url('4076-1350-9569-15745.jpg', 'sm')
url_desktop = get_product_image_url('4076-1350-9569-15745.jpg', 'md')
```

---

## 📱 Reglas por App

### **Tablet Bazzar** (Next.js PWA)
- **Listados / sidebar:** `sm` (200×200, ~20KB)
- **Hero salón:** `lg` (800×800) si Storage PASS contain; fallback `sm` → flat
- **Componente:** `HeroProductImage` v13 (`data-hero-frame="v13-contain"`)
- **Crítico:** ver [PUNTO_CRITICO_RECORTE_CALZADO.md](./PUNTO_CRITICO_RECORTE_CALZADO.md) antes de tocar hero

```typescript
import { getTabletImageUrl } from '@/lib/product-image';
import { HeroProductImage } from '@/components/cadena/HeroProductImage';

// Thumbs
const imageUrl = getTabletImageUrl(producto.imagen_nombre);
// Hero: HeroProductImage — lg/ con object-contain; Storage debe estar en contain
```

### **Report** (Next.js Local)
- **Tamaño:** `md` (400×400, 45KB) para tarjetas
- **Tamaño:** `lg` (800×800, 95KB) para modal/zoom
- **Por qué:** Desktop WiFi, calidad premium
- **Helper:** `src/lib/product-image.ts`

```typescript
// Tarjeta
<img src={getProductImageUrl(row.imagen, 'md')} />

// Modal zoom
<img src={getProductImageUrl(row.imagen, 'lg')} />
```

### **RIMEC Web** (Next.js Vercel)
- **Tamaño:** `md` (400×400, 45KB)
- **Por qué:** Catálogo vendedores, balance calidad/velocidad
- **Helper:** `lib/product-image.ts`

### **Bazzar Web** (Next.js - Futuro)
- **Tamaño:** `md` (400×400, 45KB) para cards
- **Tamaño:** `lg` (800×800, 95KB) para producto individual
- **Por qué:** E-commerce público, UX premium

### **Control Central** (Streamlit)
- **Tamaño:** `md` (400×400, 45KB)
- **Por qué:** Admin interno, no crítico performance
- **Helper:** `core/image_utils.py`

---

## 🔨 Construcción del Nombre

### **Opción 1: Ya viene construido**
```python
# Viene de BD (registro_st_vt_rc_reposicion.imagen_nombre)
imagen_nombre = "4076-1350-9569-15745.jpg"
url = get_product_image_url(imagen_nombre, 'md')
```

### **Opción 2: Construir desde pilares**
```python
def build_image_name(
    linea_codigo: str,
    referencia_codigo: str,
    material_codigo: str,
    color_codigo: str
) -> str:
    return f"{linea_codigo}-{referencia_codigo}-{material_codigo}-{color_codigo}.jpg"

# Ejemplo
nombre = build_image_name('4076', '1350', '9569', '15745')
# → "4076-1350-9569-15745.jpg"
```

### **⚠️ PROHIBIDO**
```python
# ❌ MAL - Usar IDs internos
nombre = f"{linea_id}-{referencia_id}-{material_id}-{color_id}.jpg"

# ✅ BIEN - Usar códigos proveedor
nombre = f"{linea_codigo_proveedor}-{referencia_codigo_proveedor}-{material_code}-{color_code}.jpg"
```

## 🎯 Motivo del Protocolo Único

Las fotos vienen del flujo Nexus/René y viven en Supabase Storage. Si cada app inventa su propia fórmula, aparecen errores falsos: **la foto existe, pero la app la busca con otro nombre**.

### **Beneficios del Sistema sm/md/lg**

| Beneficio | Impacto |
|-----------|---------|
| **Performance** | 95% reducción en tiempo de carga |
| **UX** | Carga instantánea en móvil |
| **Costos** | 95% reducción ancho de banda |
| **Escalabilidad** | Fácil agregar nuevos tamaños |
| **Profesional** | Estándar industria (Tailwind, Next.js) |

### **Métricas Reales (3735 productos)**

```
Originales:    120 MB  → Carga en móvil: ❌ Imposible
sm (200×200):   23 MB  → Carga en móvil: ✅ 5s
md (400×400):   70 MB  → Carga desktop: ✅ 8s  
lg (800×800):  205 MB  → Zoom detalle:  ✅ 15s
```

---

## ⚡ Reglas para Agentes (Claude/Cursor)

### **ANTES de tocar imágenes:**

1. ✅ **Verificar** si existe helper local (`product-image.ts` o `image_utils.py`)
2. ✅ **Usar helper** en lugar de construir URLs manualmente
3. ✅ **Elegir tamaño** apropiado según caso de uso:
   - Listados móviles → `sm`
   - Tarjetas desktop → `md`
   - Zoom/Modal → `lg`
4. ❌ **NO construir** URLs a mano dentro de componentes
5. ❌ **NO usar** service role ni API privada para imágenes públicas
6. ❌ **NO cambiar** formato del archivo sin migración planificada
7. ❌ **NO usar** IDs internos para nombres de archivo

### **Palabra Clave de Activación**

Cuando el Director diga **"Protocolo Imágenes"**, recordar:
- Sistema sm/md/lg
- Bucket único `productos`
- Naming `linea-ref-mat-color.jpg`
- Helpers por tecnología
- Elegir tamaño apropiado
- **PUNTO CRÍTICO:** calzado = contain en Storage; crop legacy = regenerar tiers, no parche CSS

---

## 📊 Checklist de Implementación

### **Generación de Miniaturas**
- [x] Script `convertir_miniaturas_retail.py` (salida `sm/`/`md/`/`lg/`, fit contain)
- [x] Generar 3 tamaños (sm/md/lg)
- [x] Calidad JPEG 85%, Progressive
- [x] Fit contain con padding blanco (no crop centrado)
- [x] Heartbeat cada 60s
- [x] **PUNTO CRÍTICO** documentado: [PUNTO_CRITICO_RECORTE_CALZADO.md](./PUNTO_CRITICO_RECORTE_CALZADO.md)
- [x] Caso fundador 4215.1034 regenerado y subido (evidencia en `tablet-bazzar/docs/evidencia/`)

### **Upload a Supabase**
- [x] Script `subir_miniaturas_supabase.py`
- [x] Script `protocolo_imagenes_cerrar_gap.py` (auditar/cerrar gap desde flat)
- [x] Script **`subir_carpeta_import_batch.py`** — lote carpeta import (**Importar imágenes** · CHUSAR)
- [x] Script unitario `tablet-bazzar/scripts/regenerar_storage_4215_1034.py`
- [ ] **Regenerar tiers legacy recortados** — `--cerrar` por marca (ACTVITTA resto, VIZZANO, etc.)
- [ ] Auditoría márgenes ≥95% PASS (no solo HEAD 200)

### **Helpers por Proyecto**
- [x] `tablet-bazzar/lib/product-image.ts` → size='sm' (thumb + hero)
- [ ] `report/src/lib/product-image.ts` → size='md'/'lg'
- [ ] `rimec-web/lib/product-image.ts` → size='md'
- [ ] `control_central/core/image_utils.py` → size='md'

### **Documentación**
- [x] Actualizar `NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md`
- [ ] Agregar ejemplos a cada repo
- [ ] Actualizar CLAUDE.md de cada proyecto
- [ ] Memoria secundaria con palabra clave

---

## 🔗 Referencias

- **Punto crítico recorte:** [PUNTO_CRITICO_RECORTE_CALZADO.md](./PUNTO_CRITICO_RECORTE_CALZADO.md)
- **Evidencia caso 4215.1034:** `tablet-bazzar/docs/evidencia/HERO_CASO_4215_1034.json`
- **Bucket Supabase:** `https://extrlcvcgypwazxipvqm.supabase.co/storage/v1/object/public/productos/`
- **Storage Total:** ~298 MB (3735 productos × 3 tamaños)
- **Scripts:** `control_central/tools/convertir_miniaturas_retail.py` · **`subir_carpeta_import_batch.py`** (CHUSAR [Importar imágenes](./CHUSAR_IMPORT_IMAGENES_BATCH.md))
- **Origen datos:** `C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes\` (origen) · `miniaturas\` (salida local)

---

**Última actualización:** 2026-06-14  
**Responsable:** Claude Code + Director Héctor  
**Palabra clave:** `Protocolo Imágenes`  
**Legacy deprecado:** `productos/thumbs/` → migrar a `productos/sm/`
