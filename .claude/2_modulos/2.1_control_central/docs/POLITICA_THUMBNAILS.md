# Política de Thumbnails para PDFs — Nexus Core

> **⚠️ Actualización 2026-06-14:** Sistema canónico = `sm/md/lg` en [NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md](./NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md).  
> **Punto crítico calzado:** [PUNTO_CRITICO_RECORTE_CALZADO.md](./PUNTO_CRITICO_RECORTE_CALZADO.md) — fit **contain** obligatorio; crop legacy recorta punta/tacón.  
> Este doc (`thumbs/`) queda como referencia histórica PDF; migrar a `md/` o `sm/` según protocolo.

**Versión:** 1.0.0  
**Fecha:** 2026-06-03  
**Autor:** Héctor & Claude AI

---

## 🎯 OBJETIVO

Reducir tiempo de carga de imágenes en PDFs mediante thumbnails optimizados.

### Problema Actual
- Imágenes originales: 1-3 MB, 2000x2000px
- Timeout: 15s por imagen
- Con 20 productos → 300s de descarga total
- Ancho de banda desperdiciado

### Solución
- Thumbnails: ~50 KB, 400x400px
- Descarga 20× más rápida
- Calidad suficiente para PDFs

---

## 📋 ESPECIFICACIÓN TÉCNICA

### 1. Tamaño
- **Dimensiones:** 400×400px (máximo, mantiene aspect ratio)
- **Formato:** JPEG
- **Compresión:** 85% (balance calidad/tamaño)
- **Peso estimado:** 30-80 KB por thumbnail

### 2. Naming Convention

**Opción A - Subcarpeta (RECOMENDADA):**
```
productos/
  ├── 8246-1176.jpg          (original, 2MB)
  └── thumbs/
      └── 8246-1176.jpg      (thumbnail, 50KB)
```

**Opción B - Sufijo:**
```
productos/
  ├── 8246-1176.jpg          (original)
  └── 8246-1176_thumb.jpg    (thumbnail)
```

**Decisión:** Usar **Opción A** (subcarpeta `thumbs/`)
- Más limpio
- Fácil de gestionar permisos
- No contamina listado principal

### 3. Storage Structure

**Bucket:** `productos` (existente)

**Paths:**
- Original: `productos/8246-1176.jpg`
- Thumbnail: `productos/thumbs/8246-1176.jpg`

**Public URLs:**
```
Original:
https://[project].supabase.co/storage/v1/object/public/productos/8246-1176.jpg

Thumbnail:
https://[project].supabase.co/storage/v1/object/public/productos/thumbs/8246-1176.jpg
```

---

## 🔧 IMPLEMENTACIÓN

### Fase 1: Script de Generación
Crear `tools/generar_thumbnails_supabase.py`:
- Lee todas las imágenes del bucket `productos/`
- Descarga cada imagen original
- Redimensiona a 400x400px con PIL
- Sube a `productos/thumbs/`
- Progress bar + logging
- Heartbeat cada 60s (subidas largas)

### Fase 2: Helper Functions

**Python** (`core/pdf_utils.py`):
```python
def get_thumbnail_url(original_url: str) -> str:
    """
    Convierte URL original a thumbnail.
    
    Input: https://[...]/storage/v1/object/public/productos/8246-1176.jpg
    Output: https://[...]/storage/v1/object/public/productos/thumbs/8246-1176.jpg
    """
    return original_url.replace('/productos/', '/productos/thumbs/')
```

**JavaScript** (`rimec-web/lib/pdfImageUtils.ts`):
```typescript
export function getThumbnailUrl(originalUrl: string): string {
  return originalUrl.replace('/productos/', '/productos/thumbs/')
}
```

### Fase 3: Actualizar Generadores
- Modificar `get_pdf_image()` para intentar thumbnail primero
- Fallback a original si falla
- Logging de qué versión se usó

---

## 📊 MÉTRICAS ESPERADAS

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Tamaño por imagen | 1.5 MB | 50 KB | **30× menor** |
| Tiempo de descarga (1 imagen, 10 Mbps) | 1.2s | 0.04s | **30× más rápido** |
| Tiempo total (20 imágenes) | 24s | 0.8s | **30× más rápido** |
| Ancho de banda (20 imgs) | 30 MB | 1 MB | **97% reducción** |

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear script `generar_thumbnails_supabase.py`
- [ ] Ejecutar script en todas las imágenes existentes
- [ ] Agregar `get_thumbnail_url()` a `pdf_utils.py`
- [ ] Agregar `getThumbnailUrl()` a `pdfImageUtils.ts`
- [ ] Modificar `get_pdf_image()` para usar thumbnails
- [ ] Modificar `fetchPdfImage()` para usar thumbnails
- [ ] Testing con PDF real (verificar calidad)
- [ ] Documentar en CLAUDE.md

---

## 🚀 PRÓXIMOS PASOS

1. **Inmediato:** Generar thumbnails de imágenes existentes
2. **Futuro:** Hook automático al subir nuevas imágenes (generar thumbnail on-upload)
3. **Optimización:** Lazy loading de thumbnails en UI también

---

**Aprobación pendiente:** @Héctor