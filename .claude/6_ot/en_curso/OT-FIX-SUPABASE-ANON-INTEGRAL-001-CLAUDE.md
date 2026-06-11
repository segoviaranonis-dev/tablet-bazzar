# OT-FIX-SUPABASE-ANON-INTEGRAL-001 — Cierre integral del bug del catálogo vacío

**Prioridad:** ALTA · BLOQUEANTE (afecta UX local del Director y posiblemente producción)
**Director:** Héctor Segovia
**Ejecutor:** **Claude Code**
**Coordinador / Receptor:** **Cursor**
**Repo:** `C:\Users\hecto\Nexus_Core\rimec-web`
**Predecesoras:** `OT-INVESTIGACION-SUPABASE-ANON-CORRUPTA-001-CLAUDE` (parcial), `OT-INVESTIGACION-SUPABASE-ANON-CORRUPTA-002-CLAUDE` (abierta), `OT-INVESTIGACION-CATALOGO-VACIO-001-GEMINI` (entregada).
**Estado:** ABIERTA (2026-05-21)

---

## Regla de operación

1. **Claude se subordina a Cursor.** Hacé exactamente lo que está en esta OT, en el orden indicado. No agregues investigaciones laterales, no inventes scripts nuevos fuera de `scripts/diagnostico/`.
2. **Comentarios al final.** Sección obligatoria `Observaciones de Claude para Cursor` para hipótesis o riesgos. No actuar sobre esos comentarios sin instrucción.
3. **Stdout literal** en evidencia. No resúmenes.
4. **Cero secretos** en evidencia ni commits. JWTs truncados a 8 chars + longitud.
5. **No tocar** `report/`, `control_central/`, Sales Report, leyes de pilares, migraciones.

---

## Diagnóstico previo (ya confirmado por Cursor)

- **Código de saneamiento** (`lib/supabaseEnv.ts` + `lib/supabase.ts` + `lib/auth/validateUsuario.ts`) está en el repo y se aplica.
- **`.env.local`** en `rimec-web` es **correcto** (2 líneas, sin duplicación).
- **Datos en Supabase**: `v_stock_rimec` tiene ~919 filas (validado por Claude vía SQL).
- **Cuando se arranca `npm run dev` desde un shell limpio** (caso Gemini): catálogo carga **478 modelos / 42 732 pares** y todas las pantallas funcionan.
- **Cuando se arranca desde el shell del Director**: catálogo muestra recuadro amarillo con `Headers.set: "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ… NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ…" is an invalid header value` y 0 tarjetas.
- **Conclusión Cursor:** el `process.env` que recibe Next se contamina **antes** de leer `.env.local`, en alguna sesión específica de Windows del Director. La sanitización extrae el JWT bueno, pero **el warning de `error.message` queda persistente** porque la pantalla está renderizada del primer fallo o porque hay una segunda ruta no saneada que aún rompe.

---

## Objetivo de esta OT

Cerrar el bug de tres formas a la vez:

1. **Identificar y eliminar la fuente del valor contaminado** en el entorno del Director (Windows + Vercel).
2. **Endurecer el código** para que aunque vuelva a llegar contaminado, el catálogo cargue sin mostrar mensajes técnicos al usuario.
3. **Validar end-to-end** en local **y** en producción (`rimec-web.vercel.app`).

---

## FASE A — Diagnóstico del origen del valor contaminado (1 sola pasada)

### A.1 Sondear las 4 fuentes de Windows (usuario / máquina / sesión / `.env` padre)

Ejecutar **una sola vez** y pegar stdout literal en la evidencia:

```powershell
'=== USER ==='
[System.Environment]::GetEnvironmentVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY','User')
'=== MACHINE ==='
[System.Environment]::GetEnvironmentVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY','Machine')
'=== PROCESS (current) ==='
if ($env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  'Len: ' + $env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Length
  'First 30: ' + $env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Substring(0, [Math]::Min(30, $env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Length))
  'Has dup token: ' + ($env:NEXT_PUBLIC_SUPABASE_ANON_KEY -match 'NEXT_PUBLIC_SUPABASE_ANON_KEY=')
} else { 'EMPTY' }
'=== ALL SUPABASE ENV ==='
Get-ChildItem env: | Where-Object Name -like '*SUPABASE*' | Format-Table Name, @{n='Len';e={$_.Value.Length}} -AutoSize
'=== .env files en padres ==='
Get-ChildItem -Path 'C:\Users\hecto\Nexus_Core\rimec-web' -Filter '.env*' -Force | Format-Table Name, Length, LastWriteTime
Get-ChildItem -Path 'C:\Users\hecto\Nexus_Core' -Filter '.env*' -Force | Format-Table Name, Length, LastWriteTime
Get-ChildItem -Path 'C:\Users\hecto' -Filter '.env*' -Force -ErrorAction SilentlyContinue | Format-Table Name, Length, LastWriteTime
'=== .vercel local pull ==='
Get-ChildItem -Path 'C:\Users\hecto\Nexus_Core\rimec-web\.vercel' -Recurse -Force -ErrorAction SilentlyContinue | Format-Table FullName, Length
'=== PowerShell profile setea SUPABASE? ==='
$PROFILE.AllUsersAllHosts, $PROFILE.AllUsersCurrentHost, $PROFILE.CurrentUserAllHosts, $PROFILE.CurrentUserCurrentHost |
  Where-Object { Test-Path $_ } |
  ForEach-Object { "=== $_ ==="; Get-Content $_ | Select-String 'SUPABASE' -SimpleMatch }
```

### A.2 Si A.1 detecta la fuente: **eliminarla**

- **User env** corrupta → `[System.Environment]::SetEnvironmentVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY', $null, 'User')`
- **Machine env** corrupta → requiere admin: avisar al Director, **no** ejecutar.
- **Process env** corrupta → `Remove-Item Env:\NEXT_PUBLIC_SUPABASE_ANON_KEY` (solo afecta esa sesión).
- **`.env` padre** corrupto → renombrarlo a `.env.legacy.bak` y avisar al Director.
- **Perfil PS** que la setea → comentar la línea y avisar al Director.
- **`.vercel/.env.development.local`** pulleado → eliminarlo (`.gitignore` ya lo excluye).

### A.3 Si A.1 no detecta nada anómalo

Eso significa que la contaminación ocurre **solo dentro del proceso de Node** (no en Windows). Pasar a Fase B.

---

## FASE B — Endurecimiento de código (3 cambios mínimos)

Aplicar en orden, commits separados:

### B.1 `lib/imagen.ts` — sanear URL del bucket

```ts
import { resolveSupabaseUrl } from './supabaseEnv'

const BUCKET = `${resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)}/storage/v1/object/public/productos`

export function getImageUrl(
  linea: string,
  referencia: string,
  material: string,
  color: string,
): string {
  return `${BUCKET}/${linea}-${referencia}-${material}-${color}.jpg`
}
```

### B.2 `app/page.tsx` — sanear URL del bucket en SSR

Cambiar **solo** la línea 53:

```ts
import { resolveSupabaseUrl } from '@/lib/supabaseEnv'

const BUCKET = `${resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)}/storage/v1/object/public/productos`
```

(El import va en el bloque de imports de arriba; la const queda donde está.)

### B.3 `app/page.tsx` — recuadro de diagnóstico solo en dev

Reemplazar el bloque actual (líneas 186–219 aprox., la condicional `{productos.length === 0 && (…)}`) por:

```tsx
{productos.length === 0 && process.env.NODE_ENV === 'development' && (
  <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
    <p className="font-semibold mb-1">Catálogo vacío — diagnóstico rápido (DEV)</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Filas en <code className="text-xs">v_stock_rimec</code>: <strong>{filasVista}</strong></li>
      <li>Tras filtros URL: <strong>{rows.length}</strong> · con cajas &gt; 0: <strong>{filasConCajas}</strong> · tarjetas: <strong>{productos.length}</strong></li>
      <li>App catálogo: <strong>http://localhost:3001</strong> (no :3000)</li>
      {error && (
        <li>
          Supabase: {error.message}
          {error.message.includes('invalid header value') && (
            <span className="block mt-1 text-xs">
              La clave ANON llegó duplicada en el entorno (no en el código). Revisá{' '}
              <code className="text-xs">rimec-web/.env.local</code>: una sola línea{' '}
              <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...</code> sin repetir el nombre.
              Reiniciá <code className="text-xs">npm run dev</code>. Si persiste, borrá la variable en Windows
              (Variables de entorno del usuario).
            </span>
          )}
        </li>
      )}
      {filasVista === 0 && (
        <li>
          Si la vista está en 0: ejecutar migración{' '}
          <code className="text-xs">061_fix_v_stock_rimec_estados_catalogo.sql</code> en Supabase.
          Los PP deben estar <strong>ABIERTO</strong> o <strong>ENVIADO</strong> (no solo «aprobado»).
        </li>
      )}
      {etasSel.length > 0 && filasVista > 0 && productos.length === 0 && (
        <li>Probá quitar filtro ETA en la URL (<code className="text-xs">eta_fechas</code>).</li>
      )}
    </ul>
  </div>
)}

{productos.length === 0 && process.env.NODE_ENV === 'production' && (
  <div className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-report-rule/40 bg-white px-6 py-16 text-center shadow-sm">
    <span className="mb-4 text-5xl" aria-hidden>📦</span>
    <h2 className="mb-2 text-xl font-semibold text-report-navy">Catálogo sin existencias por el momento</h2>
    <p className="mb-6 max-w-md text-sm text-report-muted">
      No hay artículos disponibles con los filtros aplicados. Probá quitar filtros o reintentá la carga.
    </p>
    <a
      href="/"
      className="rounded-lg bg-report-navy px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-report-navy2"
    >
      Reintentar
    </a>
  </div>
)}
```

**Notas:**
- Si las clases `report-*` no existen en `rimec-web/globals.css`, sustituir por `text-slate-900 / text-slate-500 / bg-slate-900 / hover:bg-slate-800` (NO inventes tema nuevo, usá Tailwind base).
- El botón debe ser un `<a href="/">Reintentar</a>` y **no** `onClick={() => window.location.reload()}`, así sigue siendo Server Component.

---

## FASE C — Validación local

### C.1 Reiniciar limpio

```powershell
cd C:\Users\hecto\Nexus_Core\rimec-web
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
if (Test-Path .next)  { Remove-Item -Recurse -Force .next }
if (Test-Path .turbo) { Remove-Item -Recurse -Force .turbo }
npm run dev
```

### C.2 Smoke tests

Cargar las 4 pantallas con cookie de admin (Gemini ya dejó `scripts/generate_cookie.js` + `scripts/test_fetch.js`; reutilizar):

| URL | Esperado |
|---|---|
| `http://localhost:3001/` | Carga con N>0 tarjetas, sin recuadro amarillo. |
| `http://localhost:3001/?marca_id=4` | Carga con N≤catálogo, filtro aplicado. |
| `http://localhost:3001/estadisticas` | Árbol con KPIs > 0. |
| `http://localhost:3001/pedidos` | UI estable (lista o "sin pedidos"). |
| `http://localhost:3001/carrito` | UI estable. |

Capturar **stdout de la terminal del dev server** (las líneas `GET / 200 in …ms` y, si aparece, cualquier warning del saneamiento).

### C.3 Reproducir el caso roto

Para garantizar que la sanitización resuelve aún con shell contaminado:

```powershell
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "NEXT_PUBLIC_SUPABASE_ANON_KEY=" + (Get-Content C:\Users\hecto\Nexus_Core\rimec-web\.env.local | Select-String 'ANON_KEY' | ForEach-Object { ($_ -split '=',2)[1] })
echo "Len contaminado: $($env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Length)"
# Matar y rearrancar el dev server en ESTA sesión:
Get-Process node | Stop-Process -Force
cd C:\Users\hecto\Nexus_Core\rimec-web
Remove-Item -Recurse -Force .next
npm run dev
```

Volver a cargar `/` y verificar que **igual carga tarjetas** (no recuadro técnico, no error). Si carga → la sanitización + endurecimiento están bien. Si no carga → reportar literal y parar.

---

## FASE D — Verificación de Vercel (producción)

### D.1 Listar env vars (solo lectura)

```bash
cd C:\Users\hecto\Nexus_Core\rimec-web
npx vercel whoami   # si pide login, AVISAR al Director y parar Fase D
npx vercel env ls
```

Anotar:
- ¿Cuántas filas hay para `NEXT_PUBLIC_SUPABASE_ANON_KEY`?
- ¿En qué scopes (Production / Preview / Development)?
- ¿Aparece alguna con valor que **incluya** `NEXT_PUBLIC_SUPABASE_ANON_KEY=` adentro?

### D.2 Si hay duplicado o valor corrupto en Vercel

**No editar nada.** Reportar el hallazgo. Cursor decide el plan de rotación + reset.

### D.3 Si todo está limpio

- Hacer pull para verificar:

  ```bash
  npx vercel env pull .vercel.env.production --environment=production --yes
  ```

- Leer el archivo, anotar longitudes (sin pegar el JWT entero).
- Verificar que UN solo JWT por var.
- **Borrar el archivo** (`Remove-Item .vercel.env.production`); no commitear.

### D.4 Validar producción

Cargar `https://rimec-web.vercel.app/` y `https://rimec-web.vercel.app/estadisticas`. Verificar que no aparece el recuadro amarillo (debería estar oculto por B.3 en `NODE_ENV=production`) y que muestra tarjetas o el placeholder UX nuevo.

Si todavía hay error técnico visible: redeploy del último commit que incluya las correcciones de Fase B.

---

## FASE E — Higiene de evidencia y scripts

### E.1 Redactar `DIAGNOSTICO_VERCEL.md`

Reemplazar los valores reales de `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` por:

```
<COPIAR DESDE rimec-web/.env.local — NO COMMITEAR JWT EN MARKDOWN>
```

Commit aparte: `chore(security): redact JWT from DIAGNOSTICO_VERCEL.md`.

### E.2 Mover scripts de diagnóstico de Gemini

```powershell
New-Item -ItemType Directory -Force -Path C:\Users\hecto\Nexus_Core\rimec-web\scripts\diagnostico
Move-Item C:\Users\hecto\Nexus_Core\rimec-web\scripts\generate_cookie.js scripts\diagnostico\
Move-Item C:\Users\hecto\Nexus_Core\rimec-web\scripts\test_fetch.js      scripts\diagnostico\
Move-Item C:\Users\hecto\Nexus_Core\rimec-web\scripts\test_fetch_api.js  scripts\diagnostico\
Move-Item C:\Users\hecto\Nexus_Core\rimec-web\scripts\analyze_html.js    scripts\diagnostico\
Move-Item C:\Users\hecto\Nexus_Core\rimec-web\scripts\analyze_cart_orders.js scripts\diagnostico\
Move-Item C:\Users\hecto\Nexus_Core\rimec-web\scripts\inspect_headings.js scripts\diagnostico\
```

Crear `scripts/diagnostico/README.md` (2 líneas) explicando que esos scripts son herramientas de diagnóstico y no parte de la app.

### E.3 Rotación de service_role

**No** rotes la `service_role`. Solo dejá en `Observaciones de Claude para Cursor` el recordatorio para que el Director la rote desde Supabase Dashboard (ya estuvo expuesta en `DIAGNOSTICO_VERCEL.md`).

---

## Entregable

`ot/FIX-SUPABASE-ANON-INTEGRAL-001-EVIDENCIA-CLAUDE.md` con:

1. **Fase A**: stdout literal completo + fuente identificada (o "no detectada en Windows").
2. **Fase B**: diff de los 3 cambios (`imagen.ts`, `app/page.tsx` × 2).
3. **Fase C**: capturas/stdout de las 5 URLs locales + reproducción del shell contaminado (C.3).
4. **Fase D**: salida de `vercel env ls` + estado de `rimec-web.vercel.app/`.
5. **Fase E**: confirmación de redacción de `DIAGNOSTICO_VERCEL.md` + ubicación nueva de scripts.
6. **Observaciones de Claude para Cursor** (opcional pero recomendado).

---

## Criterios de aceptación (los valida Cursor)

- [ ] `http://localhost:3001/` carga con **N>0** tarjetas, sin recuadro amarillo, en **dos** sesiones de PowerShell distintas (la "limpia" y la "contaminada artificialmente" de C.3).
- [ ] `https://rimec-web.vercel.app/` carga con tarjetas (o placeholder UX neutro), **sin** texto técnico de Supabase visible al usuario.
- [ ] `DIAGNOSTICO_VERCEL.md` no contiene JWTs en texto plano.
- [ ] Scripts de diagnóstico están en `scripts/diagnostico/`.
- [ ] Evidencia entregada en `ot/FIX-SUPABASE-ANON-INTEGRAL-001-EVIDENCIA-CLAUDE.md`.
- [ ] Cursor confirma cierre. Claude **no** cierra por su cuenta.

---

## Lo que NO hacés

- No tocar `report/`, `control_central/`, Sales Report, migraciones, leyes de pilares.
- No crear nuevos componentes UI ni nuevas APIs.
- No ejecutar `npx vercel login` ni cambiar variables de Vercel (solo lectura en Fase D).
- No commitear `.vercel.env.production`, `.vercel/`, ni cualquier `.env*` con valor real.
- No rotar la `service_role` (lo hace el Director).
- No cerrar la OT por tu cuenta.
