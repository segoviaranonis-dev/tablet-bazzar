# AUDITORÍA DE SEGURIDAD COMPLETA - NEXUS CORE

**Fecha**: 2026-06-08  
**Responsable**: Claude (Responsabilidad Total de Seguridad)  
**Alcance**: Todos los proyectos (rimec-web, report, control_central, bazzar-web)  
**Criticidad Global**: 🔴 **ALTA - 5 VULNERABILIDADES CRÍTICAS ENCONTRADAS**

---

## 📋 RESUMEN EJECUTIVO

| Proyecto | APIs Auditadas | Vulnerabilidades | Severidad |
|----------|----------------|------------------|-----------|
| **rimec-web** | 20 | 4 Críticas | 🔴 ALTA |
| **report** | 25 | 1 Crítica | 🔴 ALTA |
| **control_central** | N/A (Streamlit) | 0 | ✅ SEGURO |
| **bazzar-web** | 2 | 0 | ✅ SEGURO |
| **Secrets** | Todo el repo | 0 | ✅ SEGURO |

**Total**: **5 vulnerabilidades críticas** que exponen datos comerciales sensibles.

---

## 🚨 VULNERABILIDADES CRÍTICAS ENCONTRADAS

### **VUL-001: rimec-web - API `/api/consulta-pilar` Expuesta**

**Severidad**: 🔴 CRÍTICA  
**Archivo**: `rimec-web/app/api/consulta-pilar/route.ts`  
**Tipo**: API sin autenticación

**Problema**:
```typescript
export async function GET(req: NextRequest) {
  // ❌ NO HAY VALIDACIÓN DE SESIÓN
  const pares = req.nextUrl.searchParams.get('pares') ?? ''
  const filas = await consultarPilarPorCodigos(pares)
  return NextResponse.json({ pares: filas })
}
```

**Datos Expuestos**:
- Códigos de líneas y referencias
- Información de pilares de productos
- Estructura de catálogo RIMEC

**Impacto**:
- Competencia puede mapear catálogo completo
- Información comercial sensible expuesta públicamente

**URL Pública**:
```
https://rimec-web.vercel.app/api/consulta-pilar?pares=1214:1073,1214:1075
```

---

### **VUL-002: rimec-web - Endpoint DEBUG Público**

**Severidad**: 🔴 CRÍTICA  
**Archivo**: `rimec-web/app/api/debug/catalogo-pp/route.ts`  
**Tipo**: Endpoint de debugging en producción sin autenticación

**Problema**:
```typescript
export async function GET(req: NextRequest) {
  // ❌ ENDPOINT DE DEBUG PÚBLICO
  const { data: rawRows } = await fetchCatalogoRows<StockRow>(supabase)
  // Expone TODO el catálogo con detalles internos
  return NextResponse.json({
    etapa1_rawRows: { count, cantidad_pares, saldo_pares },
    etapa2_activeRows: { ... },
    // ... 7 etapas de procesamiento interno expuestas
  })
}
```

**Datos Expuestos**:
- **TODO el stock** de RIMEC (pares, cajas, saldos)
- Números de PP (pedidos proveedor)
- Quincenas de arribo
- Estructura interna de procesamiento (7 etapas)
- Marcas, estilos, materiales, colores
- Algoritmo de agrupación de tarjetas

**Impacto**:
- **EXPOSICIÓN TOTAL** del inventario
- Competencia ve stock en tiempo real
- Lógica de negocio expuesta
- **Endpoint NO debería existir en producción**

**URL Pública**:
```
https://rimec-web.vercel.app/api/debug/catalogo-pp
https://rimec-web.vercel.app/api/debug/catalogo-pp?pp=PP001&quincena=5
```

---

### **VUL-003: rimec-web - API `/api/estadisticas` Expuesta**

**Severidad**: 🔴 CRÍTICA  
**Archivo**: `rimec-web/app/api/estadisticas/route.ts`  
**Tipo**: API sin autenticación

**Problema**:
```typescript
export async function GET(req: NextRequest) {
  // ❌ NO HAY VALIDACIÓN DE SESIÓN
  const data = await fetchControlStock({ ppIds, generos, marcas, estilos, soloSaldo })
  return NextResponse.json(data)
}
```

**Datos Expuestos**:
- Estadísticas de stock por PP
- Filtros por género, marca, estilo
- Control de inventario
- Saldos disponibles

**Impacto**:
- Análisis de inventario por competencia
- Identificación de productos populares/lentos

**URL Pública**:
```
https://rimec-web.vercel.app/api/estadisticas?generos=MUJER&solo_saldo=1
```

---

### **VUL-004: rimec-web - Tabla `pedido_venta_rimec` Sin Filtro Cliente**

**Severidad**: 🔴 CRÍTICA (✅ SOLUCIONADA - Commit e105d03)  
**Archivo**: `rimec-web/app/pedidos/page.tsx`  
**Tipo**: Acceso directo desde cliente a Supabase

**Problema (ANTES)**:
```typescript
// ❌ Componente cliente accedía directo a Supabase
const { data } = await supabase
  .from('pedido_venta_rimec')
  .select('*')  // Sin filtro por vendedor!
```

**Solución Aplicada**:
- Creada API Route `/api/pedidos` con autenticación
- Filtro por `vendedor_id` de sesión
- Cliente ahora usa `fetch('/api/pedidos')`
- **Hotfix desplegado**: Commit e105d03

**Estado**: ✅ CERRADO (2026-06-07)

---

### **VUL-005: report - APIs `/api/depositos/*` Sin Protección**

**Severidad**: 🔴 CRÍTICA  
**Archivo**: `report/src/middleware.ts` (configuración incompleta)  
**Tipo**: Middleware no cubre rutas críticas

**Problema**:
```typescript
// middleware.ts
export const config = {
  matcher: [
    '/api/rimec/:path*',
    '/api/retail/:path*',
    '/api/ventas-fotos/:path*',
    '/api/aprobaciones/:path*',
    // ❌ FALTA: '/api/depositos/:path*'
  ],
}
```

**APIs Expuestas**:
- `/api/depositos/[cliente_id]` - Datos de depósitos por cliente
- `/api/depositos/[cliente_id]/analisis` - Análisis de inventario
- `/api/depositos/[cliente_id]/filtros` - Filtros disponibles
- `/api/depositos/preview/[cliente_id]` - Preview de datos
- `/api/depositos/sync` - Sincronización de datos

**Datos Expuestos**:
- Inventario completo de clientes
- Análisis de rotación
- Datos financieros de depósitos
- Información sensible de cada cliente

**Impacto**:
- Cualquiera puede ver datos de CUALQUIER cliente
- Solo necesita adivinar/iterar `cliente_id` (números)
- Violación de confidencialidad entre clientes

**URL Pública**:
```
https://report.vercel.app/api/depositos/1
https://report.vercel.app/api/depositos/2/analisis
```

---

## ✅ HALLAZGOS POSITIVOS

### **1. control_central (Streamlit)**
- ✅ AuthManager robusto
- ✅ Login obligatorio en `main.py:156-158`
- ✅ Control de acceso por roles
- ✅ Bloqueo temporal tras intentos fallidos
- ✅ No hay acceso sin autenticación

### **2. bazzar-web (E-commerce Público)**
- ✅ Arquitectura correcta para catálogo público
- ✅ Validación de precios en servidor (checkout)
- ✅ Protección contra manipulación de precios
- ✅ Reserva atómica de stock
- ✅ Ninguna vulnerabilidad detectada

### **3. Secrets**
- ✅ No hay secrets hardcodeados en código
- ✅ No hay API keys expuestas
- ✅ Variables de entorno correctamente usadas
- ✅ Historial git limpio

### **4. report - Middleware Parcial**
- ✅ Tiene autenticación con JWT
- ✅ Control por roles (Admin/Retail/Ventas)
- ✅ Protege la mayoría de APIs
- ⚠️ Falta incluir `/api/depositos/*` en matcher

---

## 🔥 PLAN DE REMEDIACIÓN URGENTE

### **PRIORIDAD 1 - CRÍTICO (Hoy)**

#### **1. rimec-web - Cerrar endpoint DEBUG**
```typescript
// app/api/debug/catalogo-pp/route.ts
export async function GET(req: NextRequest) {
  // AGREGAR INMEDIATAMENTE:
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // O MEJOR: BORRAR ARCHIVO COMPLETO
  // Este endpoint NO debe existir en producción
}
```

**Acción Recomendada**: **ELIMINAR el archivo** completamente.

#### **2. rimec-web - Proteger `/api/consulta-pilar`**
```typescript
// app/api/consulta-pilar/route.ts
export async function GET(req: NextRequest) {
  // AGREGAR:
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  // ... resto del código
}
```

#### **3. rimec-web - Proteger `/api/estadisticas`**
```typescript
// app/api/estadisticas/route.ts
export async function GET(req: NextRequest) {
  // AGREGAR:
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  // ... resto del código
}
```

#### **4. report - Agregar `/api/depositos` al middleware**
```typescript
// src/middleware.ts
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

---

### **PRIORIDAD 2 - OPCIONAL (Defensa en Profundidad)**

#### **5. Habilitar RLS en Supabase**

Aunque las APIs ya filtran en servidor, RLS agrega capa adicional:

```sql
-- Habilitar RLS en tablas críticas
ALTER TABLE pedido_venta_rimec ENABLE ROW LEVEL SECURITY;
ALTER TABLE factura_interna ENABLE ROW LEVEL SECURITY;
ALTER TABLE v_factura_interna_preventa ENABLE ROW LEVEL SECURITY;

-- Policy para service_role (usado por servidor)
CREATE POLICY "service_role_full_access"
ON pedido_venta_rimec
FOR ALL
TO service_role
USING (true);

-- Repetir para otras tablas
```

**Beneficio**: Protección adicional si alguna API olvida filtrar.

---

## 📊 MÉTRICAS DE SEGURIDAD

### **Antes de Auditoría**:
- APIs sin protección: **5**
- Datos expuestos: **Inventario completo + pedidos + estadísticas**
- Riesgo de fuga: **100%**
- Compliance: ❌ FAIL

### **Después de Remediación**:
- APIs sin protección: **0**
- Datos expuestos: **Ninguno**
- Riesgo de fuga: **~0%**
- Compliance: ✅ PASS

---

## 🔐 CHECKLIST DE VALIDACIÓN POST-FIX

Antes de cerrar cada vulnerabilidad, validar:

### **VUL-001 (consulta-pilar)**
- [ ] Código modificado agregando `getSession()`
- [ ] Commit creado
- [ ] Push a GitHub
- [ ] Deploy en Vercel completado
- [ ] Validación: `curl https://rimec-web.vercel.app/api/consulta-pilar` → 401
- [ ] Validación: Con sesión válida → 200

### **VUL-002 (debug endpoint)**
- [ ] Archivo `app/api/debug/catalogo-pp/route.ts` ELIMINADO
- [ ] Commit creado
- [ ] Push a GitHub
- [ ] Deploy en Vercel completado
- [ ] Validación: `curl https://rimec-web.vercel.app/api/debug/catalogo-pp` → 404

### **VUL-003 (estadisticas)**
- [ ] Código modificado agregando `getSession()`
- [ ] Commit creado
- [ ] Push a GitHub
- [ ] Deploy en Vercel completado
- [ ] Validación: Sin sesión → 401
- [ ] Validación: Con sesión → 200

### **VUL-004 (pedidos)**
- [x] ✅ COMPLETADO (Commit e105d03)
- [x] Push a GitHub
- [x] Deploy en Vercel
- [ ] Validación en producción pendiente

### **VUL-005 (depositos)**
- [ ] Middleware actualizado
- [ ] Commit creado
- [ ] Push a GitHub
- [ ] Deploy en Vercel completado
- [ ] Validación: `curl https://report.vercel.app/api/depositos/1` → 401
- [ ] Validación: Con sesión rol válido → 200

---

## 📝 LECCIONES APRENDIDAS

### **Qué Salió Mal**:
1. **Endpoints de debugging en producción** - VUL-002
2. **APIs sin autenticación** - VUL-001, VUL-003
3. **Middleware incompleto** - VUL-005
4. **Falta de auditorías regulares** - Problemas no detectados hasta ahora

### **Causas Raíz**:
1. No había checklist de seguridad pre-deploy
2. No había proceso de revisión de APIs nuevas
3. Endpoints de debug no se removieron al ir a producción
4. Middleware config fácil de olvidar rutas nuevas

### **Prevención Futura**:

#### **1. Checklist Pre-Deploy Obligatorio**
```
[ ] Todas las APIs tienen autenticación (excepto login/logout/público)
[ ] No hay endpoints de debug/testing en producción
[ ] Middleware cubre todas las rutas protegidas
[ ] RLS habilitado en tablas sensibles
[ ] No hay secrets hardcodeados
[ ] No hay console.log con datos sensibles
```

#### **2. Template para Nueva API Route**
```typescript
/**
 * API: /api/nueva-ruta
 * Requiere: Autenticación + Rol específico
 */
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function GET() {
  // ✅ SIEMPRE PRIMERO: Autenticación
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  // ✅ OPCIONAL: Verificar rol
  if (session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }
  
  // ... lógica de negocio
}
```

#### **3. Auditoría Trimestral Automatizada**
```bash
# Script de auditoría automática
./scripts/security-audit.sh

# Busca:
# - APIs sin getSession()
# - Archivos *debug* o *test* en producción
# - Middleware matcher incompleto
# - Secrets hardcodeados
# - console.log con datos sensibles
```

---

## 📚 REFERENCIAS

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security
- **Next.js Security**: https://nextjs.org/docs/app/building-your-application/configuring/authentication

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Auditoría completa ejecutada
2. ⏳ **URGENTE**: Implementar fixes para VUL-001, VUL-002, VUL-003, VUL-005
3. ⏳ Validar en producción
4. ⏳ Crear scripts de auditoría automática
5. ⏳ Documentar proceso de revisión de seguridad
6. ⏳ Capacitar sobre mejores prácticas

---

**Estado**: ⚠️ **PENDIENTE REMEDIACIÓN URGENTE**  
**Responsable**: Claude (Seguridad Total)  
**Aprobación**: Héctor  
**Fecha Límite**: HOY (2026-06-08)