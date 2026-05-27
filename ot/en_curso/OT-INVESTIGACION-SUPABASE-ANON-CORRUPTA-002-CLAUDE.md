# OT-INVESTIGACION-SUPABASE-ANON-CORRUPTA-002 — Reapertura (subordinada a Cursor)

**Prioridad:** ALTA (bloqueante UX en local **y** producción)
**Director:** Héctor Segovia
**Ejecutor:** **Claude Code**
**Receptor del informe + Coordinador técnico:** **Cursor**
**Repo principal:** `C:\Users\hecto\Nexus_Core\rimec-web`
**Estado:** ABIERTA (2026-05-21)
**Predecesora:** `OT-INVESTIGACION-SUPABASE-ANON-CORRUPTA-001-CLAUDE.md` — cerrada como “investigación completa” pero **el bug persiste**.

---

## Regla de operación (no negociable)

1. **Claude se subordina a las directivas de Cursor en esta OT.** No iniciá investigaciones laterales, no agregues archivos nuevos, no edites código de la app fuera de lo que Cursor especifica.
2. **Sí dejá comentarios** en una sección final llamada `Observaciones de Claude para Cursor` con cualquier cosa que veas pero que escape al guion (sospechas, alternativas, riesgos). Cursor decide qué hacer con esos comentarios; no los ejecutes vos.
3. **Cero suposiciones.** Cada paso devuelve **stdout literal** (copiá lo que imprime la terminal, no resúmenes).
4. **Cero secretos** en evidencia: si imprimís un JWT, truncalo a los primeros 8 caracteres + longitud (`eyJhbGci… len=240`). El `DIAGNOSTICO_VERCEL.md` actual tiene la **anon key y la service_role completas** — eso hay que ofuscarlo (paso 0).
5. **No tocar producción Vercel** sin instrucción explícita en esta OT.

---

## Estado actual (lo que ve el Director hoy 2026-05-21 09:44)

- En `http://localhost:3001` el catálogo vuelve a mostrar:
  ```
  Catálogo vacío — diagnóstico rápido
  Filas en v_stock_rimec: 0
  Supabase: TypeError: Headers.set:
    "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci… NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci…"
    is an invalid header value.
  ```
- `rimec-web/.env.local` en disco es **correcto** (2 líneas, sin duplicado).
- `lib/supabaseEnv.ts` + `lib/supabase.ts` con sanitización **existen en el repo y en el bundle `.next/dev/...`** (Cursor lo verificó).
- A pesar de eso, el error literal con el prefijo `NEXT_PUBLIC_SUPABASE_ANON_KEY=…` aparece en runtime → significa que el valor que entra a `createClient(...)` aún viene corrupto, o el módulo `lib/supabase.ts` que se está ejecutando **no es** el que tiene sanitización (HMR caching / SSR cache).
- Vercel: deploy `370f8c7` "trigger redeploy - fix env vars" está **Ready** pero el Director sigue viendo el problema; nadie ha confirmado el comportamiento en `rimec-web.vercel.app` con datos reales.

---

## Paso 0 — Higiene de evidencia (obligatorio antes de continuar)

1. Abrir `rimec-web/DIAGNOSTICO_VERCEL.md` y **reemplazar** los valores reales de `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` por:
   ```
   <COPIAR DESDE rimec-web/.env.local — NO COMMITEAR JWT EN MARKDOWN>
   ```
2. Commitear ese cambio aparte con mensaje `chore(security): redact JWT from DIAGNOSTICO_VERCEL.md`.
3. **Aviso para el Director (no acción):** la `service_role` ya está en Git; tarde o temprano debe rotarse desde Supabase Dashboard. No la rotes vos en esta OT.

---

## Paso 1 — Reproducir el bug de forma controlada

Ejecutar **uno por uno** y pegar **stdout** en la evidencia. No uses `grep`/`rg` para resumir; pegá las líneas tal cual.

### 1.1 Matar cualquier `node` viejo

```powershell
Get-Process node -ErrorAction SilentlyContinue | Format-Table Id, StartTime, Path
# si hay procesos: Stop-Process -Name node -Force
```

### 1.2 Sondear las 4 fuentes posibles de `NEXT_PUBLIC_SUPABASE_ANON_KEY`

```powershell
'=== USER ==='
[System.Environment]::GetEnvironmentVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY','User')
'=== MACHINE ==='
[System.Environment]::GetEnvironmentVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY','Machine')
'=== PROCESS (current PowerShell) ==='
if ($env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  'Len: ' + $env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Length
  'First 30: ' + $env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Substring(0, [Math]::Min(30, $env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Length))
  'Has dup token: ' + ($env:NEXT_PUBLIC_SUPABASE_ANON_KEY -match 'NEXT_PUBLIC_SUPABASE_ANON_KEY=')
} else { 'EMPTY' }
'=== ALL ENV WITH SUPABASE ==='
Get-ChildItem env: | Where-Object Name -like '*SUPABASE*' | Format-Table Name, @{n='Len';e={$_.Value.Length}} -AutoSize
```

### 1.3 Buscar `.env` fantasma en cualquier directorio padre o lateral

```powershell
$root='C:\Users\hecto\Nexus_Core\rimec-web'
Get-ChildItem -Path $root -Filter '.env*' -Force | Format-Table Name, Length, LastWriteTime
Get-ChildItem -Path (Split-Path $root) -Filter '.env*' -Force | Format-Table Name, Length, LastWriteTime
Get-ChildItem -Path 'C:\Users\hecto\.env*' -Force -ErrorAction SilentlyContinue | Format-Table Name, Length, LastWriteTime
# .vercel local pull?
Get-ChildItem -Path "$root\.vercel" -Recurse -Force -ErrorAction SilentlyContinue | Format-Table FullName, Length
```

### 1.4 Revisar perfil PowerShell por si exporta la var

```powershell
$PROFILE.AllUsersAllHosts, $PROFILE.AllUsersCurrentHost, $PROFILE.CurrentUserAllHosts, $PROFILE.CurrentUserCurrentHost |
  Where-Object { Test-Path $_ } |
  ForEach-Object {
    "=== $_ ==="
    Get-Content $_ | Select-String 'SUPABASE' -SimpleMatch
  }
```

### 1.5 Limpiar caché y arrancar dev en una **terminal nueva**

```powershell
cd C:\Users\hecto\Nexus_Core\rimec-web
if (Test-Path .next)    { Remove-Item -Recurse -Force .next }
if (Test-Path .turbo)   { Remove-Item -Recurse -Force .turbo }
npm run dev
```

Esperá `Ready in …`. **No abrir el navegador todavía.**

---

## Paso 2 — Instrumentación temporal (la quitamos después)

Editar **únicamente** `rimec-web/lib/supabase.ts` añadiendo arriba del `createClient`:

```ts
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

(insertar **después** de declarar `url` y `anon`, **antes** del `export const supabase = createClient(...)`).

Guardar y dejar que Turbopack recompile.

---

## Paso 3 — Ejecución y captura del payload real

1. Cargar **una sola vez** `http://localhost:3001/` (sin extender la sesión).
2. Volver a la terminal del dev server y **copiar literal** la línea `[rimec-web][supabase boot] {…}`.
3. Pegar también la primera línea `console.error('[rimec-web]', error.message)` que aparezca en la terminal (si aparece).

Eso es la prueba definitiva: dice si `RAW_ANON` viene con `…NEXT_PUBLIC_SUPABASE_ANON_KEY=…` adentro o si `sanitizedAnonHead` es un JWT limpio.

### Veredicto automático (lo decidís vos al leer el log)

| Caso | Qué significa |
|------|---------------|
| `rawHasDupToken=true` y `sanitizedAnonHead` empieza `eyJ` | La duplicación viene del `process.env`; la sanitización funciona y debería bastar — pero algo aún rompe (paso 4 obligatorio). |
| `rawHasDupToken=true` y `sanitizedAnonHead` **no** empieza con `eyJ` | La sanitización está mal escrita; reportá literal y esperá instrucción Cursor. No la “arregles”. |
| `rawHasDupToken=false` | La duplicación **no** viene del env del proceso → revisar header en la request (paso 5). |
| `rawAnonLen` ≠ longitud que muestra `.env.local` (242 chars JWT) | Confirmado origen externo (Windows env, perfil PS, `.env` padre, `.vercel/`). |

---

## Paso 4 — Si `sanitizedAnonHead` es limpio pero el bug persiste

Significa que el `apikey` que la SDK arma no usa `anon` sino otra fuente. Capturar request real:

1. En `app/page.tsx` línea 87, **temporalmente**, sustituir el `await supabase.from('v_stock_rimec')…` por una llamada paralela con `fetch` directo a `${url}/rest/v1/v_stock_rimec?select=count` con header `apikey: ${anon}` y `Authorization: Bearer ${anon}`.
2. Log el `response.status` y `response.headers.get('content-type')`.
3. Si la respuesta es 200 con datos → el bug está en la SDK leyendo otra var. Si vuelve 401/`invalid header value` → la limpieza de la SDK falla por otro motivo.

(Esto es solo para diagnóstico; no commitear el `fetch` directo.)

---

## Paso 5 — Si `rawHasDupToken=false` y aún así la SDK arma header inválido

Imprimir, en el mismo console.log de boot, también `process.env.SUPABASE_SERVICE_ROLE_KEY` length y head (truncado). Algunas SDKs intentan leer otra var del entorno. Si esa otra var trae duplicación, ahí está el origen.

---

## Paso 6 — Vercel (solo lectura, **no editar**)

```bash
cd C:\Users\hecto\Nexus_Core\rimec-web
npx vercel --version          # si responde, hay CLI
npx vercel env ls              # listar TODOS los scopes (Production / Preview / Development)
npx vercel env pull .vercel.env.production --environment=production --yes
```

Si `vercel env ls` muestra **dos** filas con nombre `NEXT_PUBLIC_SUPABASE_ANON_KEY` (o cualquier env duplicada) → ese es el bug de prod. Reportar literal, no borrar.

Si `.vercel.env.production` aparece como archivo nuevo → leelo, verificá que solo tenga UNA línea por var, anotá longitudes y borralo después (no commitear, está en `.gitignore` por Vercel).

---

## Paso 7 — Limpieza obligatoria al final

1. Quitar el `console.log('[rimec-web][supabase boot]', …)` del paso 2.
2. Quitar el `fetch` directo del paso 4 si lo agregaste.
3. Borrar `.vercel.env.production` si lo descargaste.
4. Asegurar que `DIAGNOSTICO_VERCEL.md` ya no tiene JWTs (paso 0).

---

## Entregable

`ot/INVESTIGACION-SUPABASE-ANON-CORRUPTA-002-EVIDENCIA-CLAUDE.md` con:

1. **stdout literal** de cada paso (1.1 → 1.5, 2, 3, 4 si aplica, 5 si aplica, 6).
2. Identificación de la **fuente exacta** del valor corrupto (Windows User / Machine / perfil PS / .env padre / Vercel / SDK).
3. **No** apliques fix permanente todavía. Cursor consolida con Gemini y devuelve plan integrado.
4. Sección final **Observaciones de Claude para Cursor** con cualquier hipótesis o riesgo adicional. (Esa es la zona donde sí podés opinar libre).

---

## Lo que NO hacés

- No tocar `app/page.tsx` salvo lo descrito en paso 4 (y revertirlo).
- No crear archivos nuevos ni componentes nuevos.
- No tocar `report/`, `control_central/`, ni Sales Report.
- No editar variables en Vercel.
- No subir secretos al repo (ni JWT, ni service_role).
- No cerrar la OT por tu cuenta. La cierra Cursor cuando el bug desaparezca en `localhost:3001`.

---

**Cierre solo cuando:** Cursor confirme que `localhost:3001/` carga el catálogo con tarjetas y sin recuadro amarillo, **y** la evidencia identifique con stdout la fuente del valor duplicado.
