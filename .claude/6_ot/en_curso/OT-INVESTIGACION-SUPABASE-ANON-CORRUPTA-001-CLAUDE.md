# OT-INVESTIGACION-SUPABASE-ANON-CORRUPTA-001 — Backend/DevOps

**Prioridad:** ALTA (bloqueante producción)  
**Director:** Héctor Segovia  
**Ejecutor:** **Claude Code** (backend / DevOps / Supabase / Vercel)  
**Receptor del informe:** **Cursor** (Antigravity / Director técnico)  
**Repo principal:** `C:\Users\hecto\Nexus_Core\rimec-web`  
**Estado:** ABIERTA (2026-05-21)

---

## Contexto observado

1. En `http://localhost:3001` el catálogo de `rimec-web` muestra:

   ```
   Filas en v_stock_rimec: 0
   App catálogo: http://localhost:3001
   Supabase: TypeError: Headers.set:
     "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi… NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi…"
     is an invalid header value.
   ```

   El **valor recibido en runtime** trae el nombre de la variable repetido y/o el JWT duplicado. El JWT en sí es válido (formato `eyJ…`), pero el header `apikey` que arma `@supabase/supabase-js` queda inválido → fetch a Supabase falla → la app cree que `v_stock_rimec` tiene 0 filas.

2. En disco `rimec-web/.env.local` está bien (una sola línea, JWT limpio):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://extrlcvcgypwazxipvqm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…
   ```

3. Cursor agregó **saneamiento defensivo** en `rimec-web/lib/supabase.ts` y `lib/supabaseEnv.ts` (extrae el JWT aunque la var venga duplicada) — eso evita el crash, pero **no explica el origen**.

4. En Vercel el último deploy se llama "trigger redeploy - fix env vars" — sugiere que ya se intentó corregir variables y aún así rompió (apareció el modal de **Instant Rollback**).

5. El mismo `.env.local` está replicado en `bazzar-web/.env.local` con el mismo JWT correcto. `report/.env.local` tiene la línea vacía → comportamiento distinto.

---

## Objetivo

Determinar **dónde** se está duplicando el valor de `NEXT_PUBLIC_SUPABASE_ANON_KEY` antes de llegar a `process.env`. Hay 4 fuentes posibles, hay que descartar/confirmar cada una con evidencia.

---

## Tareas

### 1. Variables de entorno de Windows (usuario y sistema)

```powershell
[System.Environment]::GetEnvironmentVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY','User')
[System.Environment]::GetEnvironmentVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY','Machine')
[System.Environment]::GetEnvironmentVariable('NEXT_PUBLIC_SUPABASE_URL','User')
[System.Environment]::GetEnvironmentVariable('NEXT_PUBLIC_SUPABASE_URL','Machine')
```

- Si **alguna** existe → ese es el culpable (Next.js mezcla con `.env.local`).
- Capturar valor exacto, longitud y si contiene `NEXT_PUBLIC_SUPABASE_ANON_KEY=` dentro.

### 2. Variables del shell de PowerShell de la sesión actual

```powershell
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Length
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY -match 'NEXT_PUBLIC_SUPABASE_ANON_KEY='
Get-ChildItem env: | Where-Object Name -like '*SUPABASE*' | ForEach-Object { "$($_.Name) ($($_.Value.Length))" }
```

### 3. `.env.local` local — verificar todos los proyectos

```powershell
foreach ($p in 'rimec-web','report','bazzar-web') {
  $f = "C:\Users\hecto\Nexus_Core\$p\.env.local"
  if (Test-Path $f) {
    "=== $p ===";
    Get-Content $f | Select-String 'NEXT_PUBLIC_SUPABASE' |
      ForEach-Object { "[$($_.Line.Length) chars] $($_.Line.Substring(0,[Math]::Min(80,$_.Line.Length)))…" }
  }
}
```

- Confirmar que **ninguno** trae el nombre repetido en la misma línea.
- Confirmar que **no hay** múltiples líneas con el mismo nombre.
- Confirmar saltos de línea CRLF/LF (un CRLF mal puesto puede concatenar dos vars).

### 4. Vercel — variables de entorno de producción

Si `vercel` CLI está disponible:

```bash
cd C:\Users\hecto\Nexus_Core\rimec-web
vercel env ls
vercel env pull .vercel.env.production
```

- Listar todas las entradas con nombre `NEXT_PUBLIC_SUPABASE_ANON_KEY` (puede haber duplicadas en distintos scopes: Production / Preview / Development).
- Si hay **dos** entradas con el mismo nombre → Vercel las une con coma o las pisa de forma rara → ese es el bug.
- Verificar que el valor en Vercel sea **solo el JWT** sin `NEXT_PUBLIC_SUPABASE_ANON_KEY=` adelante.

### 5. Build/deploy reciente

```bash
git log --oneline -10
git log --all --oneline --grep='env' -20
git show 370f8c7 --stat   # commit "trigger redeploy - fix env vars"
```

- ¿Algún commit reciente metió `.env*` al repo por error?
- ¿Algún workflow / script de CI exporta la variable dos veces?
- Revisar `vercel.json`, `.github/workflows/*.yml`, scripts en `package.json`.

### 6. Validar el cliente Supabase con la clave saneada

```javascript
import { createClient } from '@supabase/supabase-js'
import { resolveSupabaseAnonKey, resolveSupabaseUrl } from './lib/supabaseEnv'
const sb = createClient(
  resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
  resolveSupabaseAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
)
const { count, error } = await sb
  .from('v_stock_rimec')
  .select('*', { count: 'exact', head: true })
console.log('count', count, 'error', error?.message)
```

- Si `count > 0` con saneamiento → catalogo vacío era **solo** por la var corrupta.
- Si `count = 0` aun con saneamiento → revisar migración `061_fix_v_stock_rimec_estados_catalogo.sql` y estados PP.

### 7. Migración 061

```sql
SELECT proname FROM pg_views WHERE schemaname='public' AND viewname='v_stock_rimec';
SELECT estado, COUNT(*) FROM proforma_pedido GROUP BY 1;  -- adaptar al nombre real
SELECT COUNT(*) FROM v_stock_rimec;
```

- Confirmar que la vista existe y devuelve filas.
- Confirmar PP en estado `ABIERTO` o `ENVIADO`.

---

## Entregables para Cursor

Crear `ot/INVESTIGACION-SUPABASE-ANON-CORRUPTA-001-EVIDENCIA-CLAUDE.md` con:

1. Resultado exacto de cada bloque PowerShell/CLI/SQL.
2. **Hipótesis confirmada** del origen (sistema / usuario / shell / Vercel / CI).
3. Plan de remediación en 3 niveles:
   - **Local** (Windows + `.env.local` + `npm run dev`).
   - **Vercel producción** (UI o `vercel env`).
   - **Git/repo** (que esto no vuelva a pasar — `.env.example`, `.gitignore`, hook pre-commit, validación arranque).
4. Tabla de impacto: qué proyectos afectados (`rimec-web`, `report`, `bazzar-web`), qué entornos (local / preview / prod).

---

## No tocar

- `Sales Report` (blindado).
- `registro_ventas_general_v2`.
- Migración 063 (FKs ya validadas).
- Las leyes de importación de pilares (OT-001 cerrada).

---

## Cómo entregar

- Commit con la evidencia en `ot/INVESTIGACION-SUPABASE-ANON-CORRUPTA-001-EVIDENCIA-CLAUDE.md`.
- Si encontrás el culpable y es de **un solo lugar**, dejá el fix en ese mismo PR; si toca varios sitios, listalos y esperá que Cursor sintetice con la OT de Gemini antes de aplicar.
