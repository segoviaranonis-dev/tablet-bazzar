# 🎯 CURSOR: Continuar Upload de Imágenes a Supabase

> **⚠️ Superseded para lotes nuevos (2026-07-06):** usar CHUSAR canónico  
> [CHUSAR_IMPORT_IMAGENES_BATCH.md](../../2_modulos/2.1_control_central/docs/CHUSAR_IMPORT_IMAGENES_BATCH.md)  
> Script: `control_central/tools/subir_carpeta_import_batch.py` · keyword Director **Importar imágenes**

**Objetivo:** Completar upload de 3735 miniaturas profesionales (sm/md/lg) a Supabase Storage

**Prioridad:** ALTA  
**Tiempo estimado:** 30-40 minutos (uploads en background)  
**Fecha:** 2026-06-11

---

## 📊 ESTADO ACTUAL

### ✅ COMPLETADO (Claude)
- [x] 3735 fotos copiadas desde red → local
- [x] Miniaturas generadas (3 tamaños)
- [x] Carpetas renombradas a estándar profesional
- [x] Protocolo oficial documentado
- [x] Memoria secundaria activada
- [x] Script de upload actualizado
- [x] Upload **sm/** iniciado (en background, task ID: b21138erw)

### ⏳ EN PROCESO
- [ ] Verificar que sm/ terminó correctamente
- [ ] Upload md/ (400×400, 70 MB)
- [ ] Upload lg/ (800×800, 205 MB)
- [ ] Verificar URLs públicas funcionan
- [ ] Probar en Tablet Bazzar
- [ ] Documentar en cada repo

---

## 📂 UBICACIONES CLAVE

### Miniaturas locales
```
C:\Users\hecto\Documents\Prg_locales\proyectos\miniaturas\
├── sm\  (3735 archivos, 23 MB)   ← Subiendo ahora
├── md\  (3735 archivos, 70 MB)   ← Falta subir
└── lg\  (3735 archivos, 205 MB)  ← Falta subir
```

### Scripts
```
C:\Users\hecto\Nexus_Core\control_central\tools\
├── subir_miniaturas_supabase.py  ← Script principal
├── buscador_de_fotos_retail.py
└── convertir_miniaturas_retail.py
```

### Documentación
```
.claude/2_modulos/2.1_control_central/docs/NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md
memory/reference_protocolo_imagenes.md
```

---

## 🚀 TAREAS PENDIENTES

### **PASO 1: Verificar upload sm/ completado**

```powershell
cd C:\Users\hecto\Nexus_Core\control_central

# Ver si el proceso terminó
# (Claude dejó task ID: b21138erw corriendo en background)

# Verificar resultado en:
ls reportes_upload\
```

**Qué buscar:**
- ✅ Archivo `upload_supabase.csv`
- ✅ 3735/3735 archivos subidos
- ✅ Sin errores

---

### **PASO 2: Subir md/ (Desktop/Report)**

```powershell
cd C:\Users\hecto\Nexus_Core\control_central

python tools\subir_miniaturas_supabase.py --size md
```

**Duración estimada:** ~12-15 minutos  
**Heartbeat:** Cada 60s mostrará progreso

**Esperar a que termine antes de continuar.**

---

### **PASO 3: Subir lg/ (Zoom/Modal)**

```powershell
python tools\subir_miniaturas_supabase.py --size lg
```

**Duración estimada:** ~12-15 minutos  
**Heartbeat:** Cada 60s mostrará progreso

---

### **PASO 4: Verificar URLs públicas**

**Tomar 3 imágenes aleatorias y verificar que cargan:**

```powershell
# Ejemplo de URLs que deben funcionar:
# https://extrlcvcgypwazxipvqm.supabase.co/storage/v1/object/public/productos/sm/1122-897-7286-35312.jpg
# https://extrlcvcgypwazxipvqm.supabase.co/storage/v1/object/public/productos/md/1122-897-7286-35312.jpg
# https://extrlcvcgypwazxipvqm.supabase.co/storage/v1/object/public/productos/lg/1122-897-7286-35312.jpg
```

**Abrir en navegador:**
1. Elegir 3 nombres de archivo random de `sm/`
2. Construir URLs para sm/md/lg
3. Abrir en Chrome/Edge
4. Verificar que las 3 cargan

---

### **PASO 5: Crear helper para Tablet Bazzar**

**Archivo:** `tablet-bazzar/lib/product-image.ts`

```typescript
// lib/product-image.ts

type ImageSize = 'sm' | 'md' | 'lg';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export function getProductImageUrl(
  imageName: string,
  size: ImageSize = 'sm'
): string {
  const baseUrl = SUPABASE_URL.trim().replace(/\/+$/, '');
  return `${baseUrl}/storage/v1/object/public/productos/${size}/${imageName}`;
}

// Helper específico para Tablet (siempre sm)
export function getTabletImageUrl(imageName: string): string {
  return getProductImageUrl(imageName, 'sm');
}
```

**Usar en componentes:**
```typescript
import { getTabletImageUrl } from '@/lib/product-image';

// En componente
<img src={getTabletImageUrl(producto.imagen_nombre)} alt="..." />
```

---

### **PASO 6: Actualizar CLAUDE.md de Tablet Bazzar**

**Archivo:** `tablet-bazzar/CLAUDE.md`

**Agregar sección:**

```markdown
## Imágenes de Producto

**Sistema:** sm/md/lg responsivo (Protocolo Imágenes)

**Tamaño para Tablet:** SIEMPRE usar `sm` (200×200, ~20KB)

**Helper:**
\`\`\`typescript
import { getTabletImageUrl } from '@/lib/product-image';

const imageUrl = getTabletImageUrl(producto.imagen_nombre);
\`\`\`

**Por qué sm:**
- Móvil 3G/4G: carga instantánea
- 20 KB vs 2 MB original = 100× más rápido
- Calidad perfecta para listados

**NO usar:**
- ❌ md/lg en listados (muy pesado)
- ❌ Construir URLs manualmente
- ❌ Original (2 MB) nunca en frontend

**Protocolo completo:** `.claude/2_modulos/2.1_control_central/docs/NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md`
```

---

## 📋 CHECKLIST FINAL

### Uploads
- [ ] sm/ subido (3735 archivos, 23 MB)
- [ ] md/ subido (3735 archivos, 70 MB)
- [ ] lg/ subido (3735 archivos, 205 MB)

### Verificación
- [ ] 3 URLs aleatorias probadas (sm/md/lg)
- [ ] Todas cargan correctamente
- [ ] Sin errores 404

### Código
- [ ] Helper creado en `tablet-bazzar/lib/product-image.ts`
- [ ] CLAUDE.md actualizado en tablet-bazzar
- [ ] Probado en desarrollo local

### Reportes
- [ ] CSV de cada upload guardado
- [ ] Sin errores reportados
- [ ] 100% éxito en subidas

---

## 🎯 RESULTADO ESPERADO

Al terminar:

```
✅ 3735 × 3 tamaños = 11,205 imágenes en Supabase
✅ URLs públicas funcionando
✅ Helper implementado en Tablet
✅ Documentación actualizada
✅ Listo para usar en producción
```

**Storage usado:** ~298 MB (vs 120 MB originales)  
**Performance:** 100× más rápido en móvil

---

## ⚠️ TROUBLESHOOTING

### Error: "No encuentro SUPABASE_URL"
```powershell
# Verificar que existe
cat .env.local | grep SUPABASE

# Si no existe, copiar de report
cp ..\report\.env.local .env.local
```

### Error: "HTTP 401 Unauthorized"
```
Causa: Service role key inválida
Fix: Verificar SUPABASE_SERVICE_ROLE_KEY en .env.local
```

### Error: "HTTP 413 Payload Too Large"
```
Causa: Archivo muy grande (>5MB)
Fix: Verificar que son miniaturas, no originales
```

### Upload muy lento
```
Causa: Red lenta o muchos archivos
Solución: Normal, dejar correr. Heartbeat mostrará progreso.
```

---

## 📚 CONTEXTO ADICIONAL

### Sistema sm/md/lg

| Tamaño | Dimensiones | Peso | Uso |
|--------|-------------|------|-----|
| **sm** | 200×200px | ~20 KB | Móvil, Listados, Tablet Bazzar |
| **md** | 400×400px | ~45 KB | Desktop, Report, Tarjetas |
| **lg** | 800×800px | ~95 KB | Zoom, Modal, Detalle |

### Naming canónico
```
linea-referencia-material-color.jpg
Ejemplo: 4076-1350-9569-15745.jpg
```

### Bucket Supabase
```
Bucket: productos (público)
Base URL: https://extrlcvcgypwazxipvqm.supabase.co/storage/v1/object/public/productos/
```

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- **Protocolo oficial:** `.claude/2_modulos/2.1_control_central/docs/NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md`
- **Memoria secundaria:** `memory/reference_protocolo_imagenes.md`
- **Workflow completo:** `control_central/tools/README_WORKFLOW_FOTOS_RETAIL.md`
- **Origen datos:** `tablet-bazzar/ORIGEN_DATOS_RETAIL.md`

---

## 💬 COMUNICACIÓN CON EL DIRECTOR

**Cuando termines, reportar:**

```
✅ UPLOAD COMPLETADO

Resultados:
- sm: 3735/3735 ✅
- md: 3735/3735 ✅
- lg: 3735/3735 ✅

Total: 11,205 imágenes subidas
Storage: 298 MB
URLs verificadas: ✅

Listo para producción 🚀
```

---

**Fecha de creación:** 2026-06-11  
**Creado por:** Claude Code  
**Para:** Cursor AI  
**Prioridad:** ALTA
