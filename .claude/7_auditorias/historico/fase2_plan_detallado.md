# Fase 2 — Plan Detallado de Implementación

**Fecha:** 2026-05-29  
**Alcance:** Rate Limiting + Type Safety  
**Objetivo:** Mejorar seguridad y robustez SIN romper funcionalidad existente

---

## 🎯 RESUMEN EJECUTIVO

**¿Qué vamos a hacer?**
1. Agregar rate limiting a API de PDFs (máximo 10 requests/minuto por usuario)
2. Mejorar type safety eliminando `any` types (TypeScript estricto)

**¿Puede romper algo?**
- Rate limiting: ⚠️ Riesgo BAJO — Solo si usuario genera >10 PDFs/min
- Type safety: ✅ Riesgo CERO — Solo mejora validación en compile-time

**¿Cómo revertir si algo sale mal?**
- `git revert <commit_hash>` — 30 segundos de rollback

---

## 📋 CAMBIO #1: Rate Limiting

### ¿Qué es?

Limitar cuántas veces un usuario puede llamar a `/api/pdf/factura/[id]` en un período de tiempo.

**Límite propuesto:** 10 PDFs por minuto por usuario

### ¿Por qué es necesario?

**Escenario de abuso:**
```
Usuario malicioso:
- GET /api/pdf/factura/1 (genera PDF)
- GET /api/pdf/factura/2 (genera PDF)
- ... 1000 veces en 10 segundos
- Resultado: Vercel Serverless saturado → $$$$ en costos
```

**Con rate limiting:**
```
Usuario legítimo:
- GET /api/pdf/factura/1 ✅ (1/10)
- GET /api/pdf/factura/2 ✅ (2/10)
- ... 
- GET /api/pdf/factura/10 ✅ (10/10)
- GET /api/pdf/factura/11 ❌ HTTP 429 "Too Many Requests"
- Espera 60 segundos → contador resetea
```

---

### Archivos a modificar

#### 1. `package.json` (agregar dependencias)

**Cambio:**
```json
{
  "dependencies": {
    "@upstash/ratelimit": "^1.0.0",
    "@upstash/redis": "^1.28.0"
  }
}
```

**¿Qué hace?**
- Upstash Redis: Base de datos en memoria (gratuita hasta 10K requests/día)
- Upstash Ratelimit: Librería de rate limiting

**¿Puede romper algo?**
- ✅ NO — Solo agrega dependencias, no modifica código existente

---

#### 2. `.env.local` (agregar variables)

**Cambio:**
```bash
# Upstash Redis (para rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

**¿Qué hacer?**
1. Ir a https://console.upstash.com/
2. Crear cuenta gratuita (con tu email)
3. Crear Redis database (FREE tier)
4. Copiar URL y Token

**¿Puede romper algo?**
- ✅ NO — Si no configuras, el código tendrá fallback sin rate limiting
- ⚠️ SI no pones las variables → rate limiting NO funcionará (pero PDF sí)

---

#### 3. `lib/rateLimit.ts` (archivo NUEVO)

**Contenido completo:**
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Configuración de Redis
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Rate limiter: 10 requests por minuto por identificador
export const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'nexus:ratelimit:pdf',
    })
  : null

/**
 * Verifica rate limit para un identificador (usuario ID o IP)
 * 
 * @param identifier - ID de usuario o IP
 * @returns { success: boolean, limit: number, remaining: number, reset: number }
 */
export async function checkRateLimit(identifier: string) {
  // Si no hay Redis configurado, permitir siempre (fallback)
  if (!ratelimit) {
    console.warn('[RateLimit] Redis no configurado - rate limiting deshabilitado')
    return { success: true, limit: 10, remaining: 10, reset: Date.now() + 60000 }
  }

  try {
    const result = await ratelimit.limit(identifier)
    return result
  } catch (error) {
    console.error('[RateLimit] Error verificando límite:', error)
    // En caso de error, permitir (fail-open)
    return { success: true, limit: 10, remaining: 10, reset: Date.now() + 60000 }
  }
}
```

**¿Qué hace?**
- Si Redis está configurado → aplica rate limit
- Si Redis NO está configurado → permite todo (graceful degradation)
- Si Redis falla → permite todo (fail-open, no fail-closed)

**¿Puede romper algo?**
- ✅ NO — Es un archivo nuevo, no afecta código existente

---

#### 4. `app/api/pdf/factura/[id]/route.ts` (modificar)

**Líneas a agregar:** Al inicio del archivo

```typescript
import { checkRateLimit } from '@/lib/rateLimit'
```

**Líneas a agregar:** Dentro de la función `GET`, DESPUÉS de autenticación

```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Autenticación requerida
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // ============ NUEVO: Rate limiting ============
    const identifier = `user:${session.id_usuario}`
    const rateLimit = await checkRateLimit(identifier)

    if (!rateLimit.success) {
      console.warn('[PDF] Rate limit excedido para usuario:', session.id_usuario)
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Demasiadas solicitudes. Por favor espera un momento.',
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000), // segundos
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.reset),
          },
        }
      )
    }
    // ============================================

    const { id } = await params
    // ... resto del código sin cambios
  }
}
```

**¿Qué hace?**
1. Identifica al usuario por su `id_usuario`
2. Verifica si ha hecho más de 10 requests en el último minuto
3. Si SÍ → devuelve HTTP 429 con tiempo de espera
4. Si NO → continúa normal

**¿Puede romper algo?**
- ⚠️ **Riesgo BAJO:** Usuario que genere >10 PDFs/min verá error 429
- ✅ Usuario normal (1-5 PDFs/min) → NO afectado
- ✅ Si Redis falla → permite todo (no bloquea)

**Escenarios de impacto:**

| Escenario | Comportamiento |
|-----------|----------------|
| Usuario genera 1 PDF | ✅ Funciona normal |
| Usuario genera 10 PDFs en 1 min | ✅ Funciona normal |
| Usuario genera 11 PDFs en 1 min | ❌ Error 429 en el #11 |
| Usuario genera 15 PDFs en 2 min | ✅ Funciona (10 en min 1, 5 en min 2) |
| Redis está caído | ✅ Funciona (sin rate limit) |
| Redis no configurado | ✅ Funciona (sin rate limit) |

---

### Plan de rollback para Rate Limiting

**Si algo sale mal:**

```bash
# Opción 1: Revertir commit completo (30 segundos)
cd C:\Users\hecto\Nexus_Core\rimec-web
git revert HEAD
git push origin main

# Opción 2: Deshabilitar rate limiting sin revertir
# En route.ts, comentar el bloque:
/*
const rateLimit = await checkRateLimit(identifier)
if (!rateLimit.success) { ... }
*/
```

**Tiempo de recuperación:** < 2 minutos

---

## 📋 CAMBIO #2: Type Safety

### ¿Qué es?

Eliminar `any` types y reemplazarlos con interfaces TypeScript específicas.

**Ejemplo:**
```typescript
// ❌ ANTES: TypeScript no puede validar
const items = data.map((item: any) => {
  return item.precio_unit  // Si escribes mal "precio_unitt", no hay error
})

// ✅ DESPUÉS: TypeScript detecta errores
interface FIDetalleRaw {
  precio_unit: number
  precio_neto: number
}
const items = data.map((item: FIDetalleRaw) => {
  return item.precio_unitt  // ❌ Error en compile-time: Property doesn't exist
})
```

---

### Archivos a modificar

#### 1. `app/api/pdf/factura/[id]/route.ts` (modificar tipos)

**Líneas actuales con `any`:**

```typescript
// Línea 190 (actual)
ppdData.forEach((ppd: any) => {
  materialesMap.set(ppd.id, ppd.descp_material || '')
})

// Línea 237 (actual)
const itemsParaPDF = items.map((item: any) => {
  // ...
})
```

**Reemplazo propuesto:**

```typescript
// Agregar interfaces al inicio del archivo
interface PPDMaterial {
  id: number
  descp_material: string | null
}

interface FIDetalleRaw {
  ppd_id: number | null
  linea_snapshot: string | object | null
  cajas: number | null
  pares: number | null
  precio_unit: number | null
  precio_neto: number | null
  subtotal: number | null
}

interface LineaSnapshot {
  linea_codigo?: string
  ref_codigo?: string
  color_nombre?: string
  material_nombre?: string
  imagen_url?: string
  gradas_fmt?: string
}

// Línea 190 (nuevo)
ppdData.forEach((ppd: PPDMaterial) => {
  materialesMap.set(ppd.id, ppd.descp_material || '')
})

// Línea 237 (nuevo)
const itemsParaPDF = items.map((item: FIDetalleRaw) => {
  let snapshot: LineaSnapshot = {}
  // ... resto sin cambios
})
```

**¿Qué hace?**
- TypeScript valida que los campos existen
- Autocomplete en VS Code funciona mejor
- Errores de typo se detectan ANTES de deployar

**¿Puede romper algo?**
- ✅ **Riesgo CERO** — Solo cambia validación en compile-time
- ✅ El JavaScript generado es IDÉNTICO
- ✅ No afecta runtime behavior

---

### Comparación: Antes vs Después

| Aspecto | Con `any` | Con interfaces |
|---------|-----------|----------------|
| **Compilación** | ✅ Siempre pasa | ⚠️ Falla si hay errores de tipo |
| **Runtime** | Idéntico | Idéntico |
| **Errores** | Se descubren en producción | Se descubren en desarrollo |
| **Autocomplete** | ❌ No funciona bien | ✅ Funciona perfecto |
| **Refactoring** | ⚠️ Riesgoso | ✅ Seguro |

---

### Plan de rollback para Type Safety

**Si TypeScript no compila:**

```bash
# Ver errores de compilación
npm run build

# Si hay errores que no podemos fix rápido:
# Opción 1: Revertir commit
git revert HEAD

# Opción 2: Volver a usar `any` temporalmente
interface PPDMaterial = any  # Quick fix
```

**Tiempo de recuperación:** < 5 minutos

---

## 🧪 PLAN DE TESTING

### Antes de deployar

```bash
# 1. Compilar localmente
npm run build
# ✅ Debe compilar sin errores

# 2. Correr en desarrollo
npm run dev
# ✅ Debe iniciar sin errores

# 3. Testear generación de PDF
# Ir a: http://localhost:3000/api/pdf/factura/1
# ✅ Debe generar PDF correctamente

# 4. Testear rate limiting (si Redis configurado)
# Llamar endpoint 11 veces en 1 minuto
# ✅ Request #11 debe devolver HTTP 429
```

### Después de deployar

```bash
# 1. Verificar deploy en Vercel
# Ver logs en: https://vercel.com/your-project/deployments

# 2. Testear en production
# Ir a: https://your-app.vercel.app/api/pdf/factura/1
# ✅ Debe generar PDF

# 3. Verificar rate limiting (opcional)
# Llamar endpoint 11 veces rápido
# ✅ Request #11 debe devolver 429
```

---

## 📊 MATRIZ DE RIESGOS

| Cambio | Probabilidad de falla | Impacto si falla | Severidad | Rollback |
|--------|----------------------|------------------|-----------|----------|
| **Rate Limiting** | 5% | Usuario ve error 429 | 🟡 Bajo | 2 min |
| **Type Safety** | 1% | No compila | 🟢 Muy bajo | 5 min |
| **Upstash Redis** | 10% | Rate limit no funciona | 🟢 Muy bajo | N/A (fail-open) |

**Severidad general:** 🟢 BAJA — Cambios seguros

---

## ✅ CHECKLIST PRE-DEPLOY

Antes de ejecutar los cambios, verificar:

- [ ] Backup de código actual (commit actual: `ea80df3`)
- [ ] Cuenta de Upstash creada (si queremos rate limiting)
- [ ] Variables de entorno `.env.local` configuradas
- [ ] Plan de rollback documentado ✅ (este documento)
- [ ] Usuario (Héctor) revisó y aprobó el plan
- [ ] Testing local realizado
- [ ] Deploy en horario de bajo tráfico (opcional)

---

## 🎯 ORDEN DE EJECUCIÓN

**Paso 1:** Type Safety (sin riesgo)
1. Agregar interfaces
2. Reemplazar `any` types
3. `npm run build` para verificar
4. Commit + push

**Paso 2:** Rate Limiting (bajo riesgo)
1. Crear cuenta Upstash
2. Configurar variables `.env.local`
3. Instalar dependencias (`npm install`)
4. Agregar `lib/rateLimit.ts`
5. Modificar `route.ts`
6. Testear localmente (11 requests)
7. Commit + push

**Tiempo total estimado:** 20-30 minutos

---

## 📞 SOPORTE

**Si algo sale mal durante implementación:**

1. **NO PÁNICO** — Todos los cambios son reversibles
2. Copiar mensaje de error completo
3. Correr `git status` para ver estado
4. Si no es urgente: `git revert HEAD` y analizamos después
5. Si es urgente: Héctor puede contactar a Claude

---

## 🚀 SIGUIENTE PASO

**Héctor debe aprobar este plan antes de que yo ejecute cualquier cambio.**

**Preguntas para confirmar:**
1. ¿Quieres que implemente Rate Limiting? (requiere crear cuenta Upstash)
2. ¿Quieres que implemente Type Safety? (sin dependencias externas)
3. ¿Prefieres hacerlo paso a paso (uno a la vez)?
4. ¿Tienes alguna pregunta sobre algún cambio?

---

**Documento preparado por:** Claude Sonnet 4.5  
**Revisión pendiente:** Héctor Segovia  
**Estado:** ⏳ Esperando aprobación
