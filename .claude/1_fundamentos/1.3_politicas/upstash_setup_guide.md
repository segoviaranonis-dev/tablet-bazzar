# Guía de Configuración: Upstash Redis (5 minutos)

## ¿Qué es Upstash?

Base de datos Redis en la nube, **100% gratuita** hasta 10,000 requests/día.  
Usamos Redis para contar cuántos PDFs genera cada usuario por minuto.

---

## 🚀 PASO 1: Crear cuenta (2 min)

1. Ir a: https://console.upstash.com/
2. Clic en **"Sign up"**
3. Elegir una opción:
   - ✅ **GitHub** (recomendado) — 1 clic
   - ✅ Email (segoviaranonis@gmail.com)
   - ✅ Google

**Screenshot esperado:**
```
┌─────────────────────────────────────┐
│  Welcome to Upstash                 │
│                                     │
│  [Sign up with GitHub]              │
│  [Sign up with Google]              │
│  [Sign up with Email]               │
└─────────────────────────────────────┘
```

---

## 🗄️ PASO 2: Crear Redis Database (2 min)

1. Una vez dentro del dashboard, clic en **"Create Database"**
2. Configurar:
   - **Name:** `nexus-ratelimit` (o el nombre que quieras)
   - **Type:** `Regional` (más rápido)
   - **Region:** `US East (N. Virginia)` o el más cercano a tus usuarios
   - **Eviction:** `allkeys-lru` (default está bien)

3. Clic en **"Create"**

**Screenshot esperado:**
```
┌─────────────────────────────────────┐
│  Create Redis Database              │
│                                     │
│  Name: [nexus-ratelimit______]      │
│  Type: ( ) Global  (•) Regional     │
│  Region: [US East (N. Virginia) ▼]  │
│                                     │
│  [Create Database]                  │
└─────────────────────────────────────┘
```

---

## 🔑 PASO 3: Copiar credenciales (1 min)

1. Después de crear, verás la página de la database
2. En la sección **"REST API"**, encontrarás:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

3. Clic en **"Copy"** en cada una

**Screenshot esperado:**
```
┌─────────────────────────────────────────────────────────┐
│  nexus-ratelimit                                        │
│                                                         │
│  📊 Overview   🔌 REST API   ⚙️ Settings                │
│                                                         │
│  REST API                                               │
│  ┌────────────────────────────────────────────────┐   │
│  │ UPSTASH_REDIS_REST_URL                         │   │
│  │ https://us1-moving-panda-12345.upstash.io      │   │
│  │                                    [📋 Copy]    │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ UPSTASH_REDIS_REST_TOKEN                       │   │
│  │ AXX1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0••••│   │
│  │                                    [📋 Copy]    │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 PASO 4: Agregar a .env.local (local)

**Archivo:** `C:\Users\hecto\Nexus_Core\rimec-web\.env.local`

Agregar estas dos líneas al final:

```bash
# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://us1-moving-panda-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXX1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0...
```

⚠️ **Reemplaza con tus valores reales** (los que copiaste en Paso 3)

---

## ☁️ PASO 5: Agregar a Vercel (producción)

1. Ir a: https://vercel.com/your-project/settings/environment-variables
2. Agregar dos variables:

**Variable 1:**
- **Name:** `UPSTASH_REDIS_REST_URL`
- **Value:** `https://us1-moving-panda-12345.upstash.io` (tu URL)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- Clic **"Save"**

**Variable 2:**
- **Name:** `UPSTASH_REDIS_REST_TOKEN`
- **Value:** `AXX1...` (tu token completo)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- Clic **"Save"**

3. **Re-deploy:** Vercel pedirá re-deployar para aplicar cambios → Aceptar

---

## ✅ PASO 6: Verificar funcionamiento

### Test Local (desarrollo)

```bash
cd C:\Users\hecto\Nexus_Core\rimec-web
npm run dev
```

Abrir: http://localhost:3001/api/pdf/factura/1

**Comportamiento esperado:**
1. Primera request → ✅ PDF generado
2. Requests 2-10 → ✅ PDF generado
3. Request 11 (en mismo minuto) → ❌ HTTP 429

**Headers de respuesta (requests exitosas):**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1743456789000
```

**Response de rate limit excedido (request #11):**
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Demasiadas solicitudes. Por favor espera un momento antes de generar otro PDF.",
  "retryAfter": 45
}
```

### Test Production (Vercel)

1. Deploy debe completarse sin errores
2. Verificar logs en Vercel Dashboard:
   - ✅ Ver: `[RateLimit] Checking limit for user:123`
   - ❌ NO ver: `[RateLimit] Redis no configurado`

---

## 🔍 Troubleshooting

### Problema: Rate limiting no funciona

**Síntoma:** Puedes generar >10 PDFs/min sin error

**Solución:**
1. Verificar variables en `.env.local`:
   ```bash
   # Ver contenido
   cat .env.local | grep UPSTASH
   ```
2. Debe mostrar:
   ```
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=AXX...
   ```
3. Si no están → agregarlas
4. Reiniciar servidor: `Ctrl+C` → `npm run dev`

### Problema: Vercel da error 500

**Síntoma:** API falla después de deploy

**Causa:** Variables de entorno no configuradas en Vercel

**Solución:**
1. Ir a Vercel → Settings → Environment Variables
2. Verificar que existen:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. Si no están → agregarlas (Paso 5)
4. Re-deploy

### Problema: Redis da error de autenticación

**Síntoma:** Logs muestran `[RateLimit] Error verificando límite: Unauthorized`

**Causa:** Token inválido o expirado

**Solución:**
1. Ir a Upstash Console → Database → REST API
2. Copiar **nuevo** token
3. Actualizar `.env.local` Y Vercel
4. Reiniciar/Re-deploy

---

## 💰 Límites del Plan Gratuito

**Upstash Free Tier:**
- ✅ 10,000 commands/day
- ✅ 256 MB storage
- ✅ 1 database
- ✅ Sin tarjeta de crédito

**¿Cuánto usamos?**
- 1 PDF generado = 1 command Redis
- 10 PDFs/día = 10 commands
- 100 PDFs/día = 100 commands
- **1000 PDFs/día = 1000 commands** (10% del límite)

**Conclusión:** Con uso normal (50-200 PDFs/día), nunca llegaremos al límite gratuito.

---

## 📊 Monitoreo

**Ver uso en Upstash Dashboard:**
1. Ir a: https://console.upstash.com/
2. Clic en tu database `nexus-ratelimit`
3. Tab **"Metrics"**

**Métricas disponibles:**
- Commands/day (deberíamos ver ~100-500)
- Memory usage (deberíamos ver <10 MB)
- Latency (debería ser <50ms)

**Alertas:**
- Si commands/day >8000 → Considerar upgrade (pero muy improbable)
- Si latency >200ms → Cambiar región más cercana

---

## ❓ FAQ

**Q: ¿Qué pasa si me olvido de configurar Upstash?**  
A: El sistema funciona normal, pero SIN rate limiting. PDFs se generan sin límite.

**Q: ¿Qué pasa si Upstash está caído?**  
A: El código detecta el error y permite requests (fail-open). PDFs funcionan.

**Q: ¿Puedo cambiar el límite de 10/min?**  
A: Sí, editando `lib/rateLimit.ts` línea 20:
```typescript
limiter: Ratelimit.slidingWindow(10, '1 m'),  // Cambiar 10 por otro número
```

**Q: ¿Necesito pagar algo?**  
A: NO. El plan gratuito es suficiente para uso normal (<10K requests/día).

**Q: ¿Los datos de usuarios se guardan en Upstash?**  
A: NO. Solo se guarda un contador anónimo: `user:123 → 7 requests en último minuto`.  
   No hay nombres, emails, ni datos sensibles.

---

## ✅ Checklist Final

- [ ] Cuenta Upstash creada
- [ ] Database Redis creada
- [ ] Variables copiadas (URL + TOKEN)
- [ ] `.env.local` actualizado (local)
- [ ] Variables agregadas a Vercel (producción)
- [ ] Vercel re-deployed
- [ ] Test local: 11 requests → #11 da error 429 ✅
- [ ] Test producción: API funciona en Vercel ✅

---

**¿Dudas o problemas?** Pídemelo y te ayudo paso a paso.

**Tiempo total:** 5-10 minutos
