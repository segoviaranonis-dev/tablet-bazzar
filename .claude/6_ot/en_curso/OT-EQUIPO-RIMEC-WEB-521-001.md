# OT-EQUIPO-RIMEC-WEB-521-001 — Capacidades del equipo + login RIMEC Web (Vercel)

**Estado:** EN_COLA (ejecutar **después** de OT-MOTOR-SQL-520-001)  
**Fecha:** 2026-05-18  
**Ejecutores:** Claude Code (diagnóstico técnico) + Antigravity (UX/login visual) — ver fases  
**Repo principal:** `rimec-web`  
**URL problema:** https://rimec-web-git-main-segoviaranonis-2610s-projects.vercel.app/login

---

## Objetivo gerencial

1. **Inventario de capacidades** — quién puede ejecutar qué (Nexus, rimec-web, bazzar-web, report, SQL, diseño).
2. **Diagnóstico** — por qué el Director **no puede ingresar** al login de RIMEC Web en Vercel.
3. Dejar **plan de acción** con dueño (Claude / Antigravity / Director config Vercel).

---

## Fase 0 — Encuesta de capacidades (todos los ejecutores)

Completar **`Nexus_Core/ot/CAPACIDADES_EQUIPO.md`** (sección correspondiente) **y** resumen en `RESPUESTA_EJECUTOR.md` §6.

### Preguntas obligatorias (cada agente)

| # | Pregunta |
|---|----------|
| C1 | ¿Podés trabajar en repo `rimec-web` (Next.js 14, Vercel, middleware auth)? Sí / Parcial / No — **por qué** |
| C2 | ¿Podés configurar variables en **Vercel Dashboard** (solo guiar al Director)? |
| C3 | ¿Podés depurar login contra **Supabase** `usuario_v2`? |
| C4 | ¿Podés abrir URLs de preview Vercel y reportar error de pantalla/red? |
| C5 | ¿Límite de contexto o herramientas (sin browser, sin red, etc.)? |
| C6 | Modelo que usás (ej. Claude Sonnet, Gemini 3.1 Pro High) |

**Antigravity:** foco C4 + UX del formulario login (mensajes de error, estados loading).  
**Claude Code:** foco C1–C3 + logs Vercel + código `lib/auth/*`.

---

## Fase A — Diagnóstico login (Claude Code)

### Hipótesis iniciales (Cursor — validar o descartar con evidencia)

| # | Hipótesis | Cómo verificar |
|---|-----------|----------------|
| H1 | Falta **`SESSION_SECRET`** en Vercel (OT-514 PASS condicional) | Vercel → Settings → Environment Variables |
| H2 | Falta **`SUPABASE_SERVICE_ROLE_KEY`** en servidor | Login API devuelve 500; logs `[login]` |
| H3 | Usuario no es **VENDEDOR** ni **ADMIN** en `usuario_v2` | Response 403 «Acceso denegado» |
| H4 | Credenciales incorrectas o usuario inexistente | 401 «Credenciales inválidas» |
| H5 | `NEXT_PUBLIC_SUPABASE_URL` / anon key incorrectos en Vercel | Error en validateUsuario |
| H6 | Cookie `httpOnly` bloqueada (dominio preview, HTTPS mixto) | Sesión no persiste tras login OK |
| H7 | Build viejo en Vercel sin middleware OT-514 | `/login` no existe o catálogo abierto sin auth |

### Tareas técnicas

1. Reproducir en navegador la URL del Director (captura + Network tab):
   - POST `/api/auth/login` → status, body JSON, Set-Cookie
2. Revisar código: `middleware.ts`, `app/api/auth/login/route.ts`, `lib/auth/validateUsuario.ts`
3. Comparar con OT-514 cerrada: `OT-RIMEC-WEB-AUTH-514-001.md`, evidencia `rimec-web/OT-RIMEC-WEB-AUTH-514-001-EVIDENCIA.json`
4. Listar **env vars requeridas** vs documentadas en `.env.example`
5. Si falta config Vercel → instrucciones paso a paso para el Director (sin pegar secrets en git)

### Entregable diagnóstico

Sección en `RESPUESTA_EJECUTOR.md` §6 titulada **Diagnóstico login RIMEC Web**:

```markdown
## Síntoma
## Pasos reproducidos
## Causa raíz (una línea)
## Fix (código | Vercel | datos usuario_v2)
## Quién ejecuta el fix
```

---

## Fase B — UX login (Antigravity, opcional si Claude no bloqueado)

- ¿La página `/login` carga marca RIMEC?
- ¿Mensajes de error son legibles?
- Mockup mínimo si hace falta mejorar copy (403 vs 401)

---

## Fase C — Evidencia + Git

| Item | Ruta |
|------|------|
| Evidencia JSON | `rimec-web/OT-EQUIPO-RIMEC-WEB-521-001-EVIDENCIA.json` |
| Capacidades | `ot/CAPACIDADES_EQUIPO.md` actualizado |
| Fix código (si aplica) | PR/commit en `rimec-web` |

**No** commitear `.env` ni secrets.

---

## Pruebas de aceptación (Director)

| ID | Prueba | PASS si… |
|----|--------|----------|
| T1 | Login VENDEDOR/ADMIN conocido | Entra al catálogo `/` |
| T2 | Usuario SU/USER | 403 o `/acceso-denegado`, sin datos |
| T3 | Capacidades documentadas | Tabla clara «quién hace rimec-web» |

---

## Prohibido

- Desactivar auth «para probar»
- Hardcodear usuario/password en código
- Exponer `SERVICE_ROLE` en `NEXT_PUBLIC_*`

---

## Cola

Activar esta OT solo cuando `COLA.md` indique **520** en `LISTO_PARA_AUDITORIA` o el Director priorice web.

**Preguntas** → `RESPUESTA_EJECUTOR.md` §4 solamente.
