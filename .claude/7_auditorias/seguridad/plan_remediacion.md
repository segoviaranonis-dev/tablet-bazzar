# PLAN DE REMEDIACIÓN - VULNERABILIDADES CRÍTICAS

**Fecha**: 2026-06-08  
**Prioridad**: 🔴 URGENTE  
**Deadline**: HOY  
**Responsable**: Claude

---

## 🎯 OBJETIVO

Cerrar **5 vulnerabilidades críticas** que exponen datos comerciales sensibles de RIMEC.

---

## 📋 TAREAS PRIORITARIAS

### ✅ TAREA 1: Eliminar Endpoint DEBUG (15 min)

**Vulnerabilidad**: VUL-002  
**Archivo**: `rimec-web/app/api/debug/catalogo-pp/route.ts`  
**Acción**: **ELIMINAR archivo completo**

**Razón**: Este endpoint NO debe existir en producción - expone TODO el inventario.

```bash
# Comando:
rm rimec-web/app/api/debug/catalogo-pp/route.ts
```

**Validación**:
- Commit y push
- Verificar en producción: `https://rimec-web.vercel.app/api/debug/catalogo-pp` → 404

---

### ✅ TAREA 2: Proteger `/api/consulta-pilar` (10 min)

**Vulnerabilidad**: VUL-001  
**Archivo**: `rimec-web/app/api/consulta-pilar/route.ts`  
**Acción**: Agregar autenticación

**Código a agregar** (línea 5, después de imports):

```typescript
import { getSession } from '@/lib/auth/session'

export async function GET(req: NextRequest) {
  // ✅ AGREGAR ESTAS LÍNEAS:
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  // ... resto del código existente
}
```

**Validación**:
- Sin sesión → 401
- Con sesión → 200

---

### ✅ TAREA 3: Proteger `/api/estadisticas` (10 min)

**Vulnerabilidad**: VUL-003  
**Archivo**: `rimec-web/app/api/estadisticas/route.ts`  
**Acción**: Agregar autenticación

**Código a agregar** (línea 2, después de imports):

```typescript
import { getSession } from '@/lib/auth/session'

export async function GET(req: NextRequest) {
  // ✅ AGREGAR ESTAS LÍNEAS:
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  // ... resto del código existente
}
```

**Validación**:
- Sin sesión → 401
- Con sesión → 200

---

### ✅ TAREA 4: Proteger `/api/depositos/*` en report (5 min)

**Vulnerabilidad**: VUL-005  
**Archivo**: `report/src/middleware.ts`  
**Acción**: Agregar ruta al matcher

**Código a modificar** (línea 140):

```typescript
export const config = {
  matcher: [
    '/',
    '/rimec/:path*',
    '/retail/:path*',
    '/ventas-fotos/:path*',
    '/informes/:path*',
    '/aprobaciones/:path*',
    '/api/rimec/:path*',
    '/api/retail/:path*',
    '/api/ventas-fotos/:path*',
    '/api/aprobaciones/:path*',
    '/api/depositos/:path*',  // ← AGREGAR ESTA LÍNEA
  ],
}
```

**Validación**:
- Sin sesión → 401
- Con sesión válida → 200

---

## 🚀 SECUENCIA DE EJECUCIÓN

### **Paso 1: rimec-web fixes (35 min total)**

```bash
cd c:\Users\hecto\Nexus_Core\rimec-web

# 1. Eliminar debug endpoint
rm app/api/debug/catalogo-pp/route.ts

# 2. Editar consulta-pilar
# (usar Edit tool)

# 3. Editar estadisticas
# (usar Edit tool)

# 4. Commit consolidado
git add .
git commit -m "hotfix(seguridad): Cerrar 3 vulnerabilidades críticas en APIs"
git push origin main

# 5. Verificar deploy Vercel
# (automático tras push)
```

### **Paso 2: report fix (10 min total)**

```bash
cd c:\Users\hecto\Nexus_Core\report

# 1. Editar middleware
# (usar Edit tool)

# 2. Commit
git add src/middleware.ts
git commit -m "hotfix(seguridad): Proteger /api/depositos con middleware"
git push origin main

# 3. Verificar deploy Vercel
```

---

## ✅ CHECKLIST POST-DEPLOY

### **rimec-web**
- [ ] Archivo debug eliminado
- [ ] APIs protegidas con getSession()
- [ ] Commit creado
- [ ] Push a GitHub exitoso
- [ ] Vercel deploy completado
- [ ] Validación producción:
  - [ ] `/api/debug/catalogo-pp` → 404 ✓
  - [ ] `/api/consulta-pilar` (sin auth) → 401 ✓
  - [ ] `/api/consulta-pilar` (con auth) → 200 ✓
  - [ ] `/api/estadisticas` (sin auth) → 401 ✓
  - [ ] `/api/estadisticas` (con auth) → 200 ✓

### **report**
- [ ] Middleware actualizado
- [ ] Commit creado
- [ ] Push a GitHub exitoso
- [ ] Vercel deploy completado
- [ ] Validación producción:
  - [ ] `/api/depositos/1` (sin auth) → 401 ✓
  - [ ] `/api/depositos/1` (con auth) → 200 ✓

---

## 🔐 VALIDACIÓN FINAL

### **Test de Seguridad**:

```bash
# Test 1: Sin autenticación debe fallar
curl -I https://rimec-web.vercel.app/api/consulta-pilar?pares=1214:1073
# Esperado: HTTP/1.1 401 Unauthorized

# Test 2: Debug endpoint debe desaparecer
curl -I https://rimec-web.vercel.app/api/debug/catalogo-pp
# Esperado: HTTP/1.1 404 Not Found

# Test 3: Estadísticas sin auth debe fallar
curl -I https://rimec-web.vercel.app/api/estadisticas
# Esperado: HTTP/1.1 401 Unauthorized

# Test 4: Depósitos sin auth debe fallar
curl -I https://report.vercel.app/api/depositos/1
# Esperado: HTTP/1.1 401 Unauthorized
```

---

## 📊 MÉTRICAS DE ÉXITO

| Métrica | Antes | Después | Objetivo |
|---------|-------|---------|----------|
| APIs expuestas | 5 | 0 | 0 |
| Datos accesibles sin auth | 100% inventario | 0% | 0% |
| Endpoints debug en prod | 1 | 0 | 0 |
| Tiempo para fix | N/A | ~1 hora | <2 horas |

---

## 🎯 SIGUIENTE NIVEL (Opcional - No Urgente)

### **Defensa en Profundidad**:

1. **Habilitar RLS en Supabase** (1 hora)
   - Protección adicional a nivel de base de datos
   - Ver script en auditoría completa

2. **Implementar Rate Limiting** (2 horas)
   - Prevenir abuse de APIs
   - Ya existe en `/api/pdf/factura/[id]`, replicar

3. **Crear Auditoría Automática** (4 horas)
   - Script que detecta APIs sin auth
   - Ejecutar pre-deploy

---

## 📝 COMUNICACIÓN

### **Para Héctor**:
```
✅ Auditoría completa ejecutada
🚨 Encontradas 5 vulnerabilidades CRÍTICAS
⚡ Plan de remediación creado (1 hora de trabajo)
🔧 Listo para aplicar fixes - esperando aprobación

Archivos:
- .claude/AUDITORIA_SEGURIDAD_COMPLETA_2026-06-08.md (reporte detallado)
- .claude/PLAN_REMEDIACION_SEGURIDAD_URGENTE.md (este archivo)

¿Procedo con la remediación?
```

---

**Estado**: ⏳ ESPERANDO APROBACIÓN  
**Tiempo estimado**: 1 hora total  
**Riesgo actual**: 🔴 ALTO  
**Riesgo post-fix**: 🟢 BAJO