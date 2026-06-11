# OT-INVESTIGACION-SUPABASE-ANON-CORRUPTA-002-EVIDENCIA-CLAUDE

**Ejecutor:** Claude Code  
**Fecha:** 2026-05-21  
**Proyecto:** rimec-web  
**Estado:** ✅ DETENIDA POR DIRECTOR (2026-05-21 13:05)

---

## Paso 0 — Higiene de evidencia

✅ **Commit de seguridad:**
```
594d980 - chore(security): redact JWT from DIAGNOSTICO_VERCEL.md
```

**Advertencia registrada:** service_role_key ya está en Git histórico; rotación pendiente (no ejecutada en esta OT).

---

## Paso 1 — Reproducir el bug de forma controlada

### 1.1 — Matar procesos node

**Stdout:**
```
   Id StartTime          Path                            
   -- ---------          ----                            
10548 21/5/2026 09:38:16 C:\Program Files\nodejs\node.exe
14168 20/5/2026 14:26:40 C:\Program Files\nodejs\node.exe
18588 20/5/2026 14:26:40 C:\Program Files\nodejs\node.exe
19212 20/5/2026 14:26:41 C:\Program Files\nodejs\node.exe
33840 21/5/2026 09:38:14 C:\Program Files\nodejs\node.exe
35544 21/5/2026 09:38:13 C:\Program Files\nodejs\node.exe
37068 21/5/2026 09:38:14 C:\Program Files\nodejs\node.exe
```

**Acción:** `Stop-Process -Name node -Force` ejecutado (7 procesos detenidos)

---

### 1.2 — Sondear 4 fuentes posibles de NEXT_PUBLIC_SUPABASE_ANON_KEY

**Stdout:**
```
=== USER ===
=== MACHINE ===
=== PROCESS (current PowerShell) ===
EMPTY
=== ALL ENV WITH SUPABASE ===

```

**Hallazgo:** Variables de entorno Windows (User/Machine/Process) **VACÍAS**. Sin variables SUPABASE en el entorno actual.

---

### 1.3 — Buscar .env fantasma

**Stdout:**
```
Name         Length LastWriteTime     
----         ------ -------------     
.env.example    443 18/5/2026 12:20:20
.env.local      305 26/4/2026 11:41:43
```

**Hallazgo:**
- ✅ `.env.local` existe (305 bytes, fecha 26/4/2026)
- ✅ `.env.example` existe (443 bytes)
- ❌ Sin `.env` en directorio padre (Nexus_Core)
- ❌ Sin `.env` en `C:\Users\hecto\`
- ❌ Sin archivos en `.vercel/` (o no existe)

---

### 1.4 — Revisar perfil PowerShell

**Stdout:** (sin output)

**Hallazgo:** Ningún perfil PowerShell contiene "SUPABASE".

---

### 1.5 — Limpiar caché y arrancar dev

**Stdout:**
```
Caché limpiado
```

**Caché eliminado:** `.next/` y `.turbo/`

**Dev server iniciado:**
```
▲ Next.js 16.2.4 (Turbopack)
- Local:         http://localhost:3001
- Network:       http://10.18.3.183:3001
- Environments: .env.local
✓ Ready in 540ms
```

---

## Paso 2 — Instrumentación temporal

**Archivo modificado:** `rimec-web/lib/supabase.ts`

**Código agregado** (después de `const anon = ...`, antes de `export const supabase = ...`):
```typescript
const RAW_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const RAW_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
console.log(
  '[rimec-web][supabase boot]',
  JSON.stringify({
    rawAnonLen: RAW_ANON.length,
    rawAnonHead: RAW_ANON.slice(0, 30),
    rawHasDupToken: RAW_ANON.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY='),
    sanitizedAnonLen: anon.length,
    sanitizedAnonHead: anon.slice(0, 30),
    rawUrlLen: RAW_URL.length,
    rawUrl: RAW_URL.slice(0, 60),
    nodeEnv: process.env.NODE_ENV,
  }),
)
```

**Recompilación:** Turbopack recompiló automáticamente.

---

## Paso 3 — Ejecución y captura del payload real

**Acción:** `curl http://localhost:3001/` ejecutado una vez.

**Stdout literal del dev server:**
```
[rimec-web][supabase boot] {"rawAnonLen":208,"rawAnonHead":"eyJhbGciOiJIUzI1NiIsInR5cCI6Ik","rawHasDupToken":false,"sanitizedAnonLen":208,"sanitizedAnonHead":"eyJhbGciOiJIUzI1NiIsInR5cCI6Ik","rawUrlLen":40,"rawUrl":"https://extrlcvcgypwazxipvqm.supabase.co","nodeEnv":"development"}
[rimec-web][supabase boot] {"rawAnonLen":208,"rawAnonHead":"eyJhbGciOiJIUzI1NiIsInR5cCI6Ik","rawHasDupToken":false,"sanitizedAnonLen":208,"sanitizedAnonHead":"eyJhbGciOiJIUzI1NiIsInR5cCI6Ik","rawUrlLen":40,"rawUrl":"https://extrlcvcgypwazxipvqm.supabase.co","nodeEnv":"development"}
 GET / 200 in 6.2s (next.js: 2.1s, proxy.ts: 10ms, application-code: 4.0s)
 GET /api/auth/me 200 in 327ms (next.js: 310ms, application-code: 17ms)
 GET /login 200 in 1287ms (next.js: 312ms, application-code: 975ms)
```

**Análisis del payload:**
- **`rawAnonLen: 208`** → Longitud normal de JWT Supabase
- **`rawAnonHead: "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik"`** → Comienza con header JWT válido (`eyJ` = base64 de `{"alg":"HS256","typ":"JWT"}`)
- **`rawHasDupToken: false`** ← **CRÍTICO: Sin duplicación**
- **`sanitizedAnonLen: 208`** → Igual a raw (sanitización no modificó nada)
- **`sanitizedAnonHead`** → Idéntico a rawAnonHead
- **`rawUrlLen: 40`** → URL Supabase correcta (https://extrlcvcgypwazxipvqm.supabase.co)

---

## Veredicto según tabla OT-002

| Caso | Estado | Significado |
|------|--------|-------------|
| `rawHasDupToken=false` | ✅ **CONFIRMADO** | **La duplicación NO viene del `process.env` del proceso Node.js** |
| `rawAnonLen` ≠ 242 chars JWT | N/A | `rawAnonLen=208` es longitud válida de JWT |
| `sanitizedAnonHead` empieza con `eyJ` | ✅ | JWT válido, sanitización innecesaria (valor ya limpio) |

**Conclusión Paso 3:** En este momento (2026-05-21 13:00+), **no hay duplicación en el entorno**. El valor de `NEXT_PUBLIC_SUPABASE_ANON_KEY` que llega a `process.env` es un JWT limpio de 208 caracteres.

---

## Observaciones de Claude para Cursor

### 1. Discrepancia temporal

El Director reportó el error:
```
TypeError: Headers.set:
  "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci… NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci…"
  is an invalid header value.
```

en `localhost:3001` el 2026-05-21 09:44. Sin embargo, tras ejecutar los pasos 1.1-1.5 (matar node, limpiar caché, reiniciar dev server), el error **no se reproduce**. 

**Hipótesis:**
1. **Caché de Turbopack/HMR:** El `.next/` y `.turbo/` antiguos tenían módulos con imports corruptos. Al limpiar en 1.5, el problema desapareció.
2. **Proceso node viejo:** Uno de los 7 procesos node del paso 1.1 tenía variables de entorno heredadas de una sesión anterior con valores duplicados. Al matar todos y arrancar limpio, el problema desapareció.
3. **Intermitencia por HMR:** El error aparece solo tras múltiples hot-reloads sin reiniciar el dev server (el código de sanitización se ejecuta, pero otro módulo leía la raw key antes).

### 2. Paso 4 y 5 no aplicables en este momento

Según la tabla del paso 3:
- Caso: `rawHasDupToken=false` → Paso 4 no aplica (solo si `sanitizedAnonHead` no fuera limpio).
- Paso 5: Solo si rawHasDupToken=false Y el bug persiste → no hay error para investigar ahora.

### 3. Recomendación para Cursor

Antes de cerrar la OT, considerar:
1. **Reproducir el bug original:** Si el Director puede volver a ver el error en `localhost:3001`, capturar **antes** de limpiar caché (paso 1.5). Eso confirmaría si la limpieza es la solución permanente.
2. **Monitorear tras HMR:** Dejar el dev server corriendo, hacer ediciones en `app/page.tsx` (disparar 5-10 hot-reloads), y verificar si el log `[rimec-web][supabase boot]` vuelve a mostrar `rawHasDupToken:true`.
3. **Vercel (paso 6):** Aún no ejecutado. Si el problema persiste en producción (`rimec-web.vercel.app`), el paso 6 es obligatorio.

### 4. Advertencia sobre .env.local

Fecha del archivo: `26/4/2026 11:41:43` (hace ~1 mes). Si se editó manualmente después (sin actualizar timestamp), el contenido puede diferir del esperado. Verificar con `cat .env.local` si es necesario.

---

## Estado actual

- ✅ Paso 0, 1, 2, 3 completos
- ⏸️ Paso 4, 5: No aplicables (sin error reproducible)
- ⏸️ Paso 6: Pendiente (Vercel env)
- ⏸️ Paso 7: Pendiente (limpieza de instrumentación)

**Próxima acción:** Cursor decide si:
- Cerrar OT si el bug no reaparece tras verificación extendida
- Ejecutar paso 6 (Vercel env ls) para investigar producción
- Solicitar al Director reproducir el error con el dev server instrumentado

---

**Evidencia recolectada por:** Claude Code  
**Timestamp:** 2026-05-21 13:02 GMT-4  
**Instrumentación temporal:** ✅ REMOVIDA (2026-05-21 13:05)

---

## Paso 7 — Limpieza (ejecutado al detener OT)

1. ✅ `console.log('[rimec-web][supabase boot]', …)` removido de `lib/supabase.ts`
2. ✅ Estado de evidencia actualizado a DETENIDA
3. ✅ DIAGNOSTICO_VERCEL.md ya tenía JWTs redactados (paso 0)

**OT detenida por instrucción del Director.**
