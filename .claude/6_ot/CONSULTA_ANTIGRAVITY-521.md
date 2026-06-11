# Consultoría Antigravity — OT-521 (paralelo a OT-520)

> **No es la OT activa de código.** Claude Code sigue con **OT-MOTOR-SQL-520** en `COLA.md`.  
> Vos (Gemini / Antigravity) hacés **solo** esta consultoría.

---

## Tu misión (ahora)

1. Completar **`CAPACIDADES_EQUIPO.md`** → sección **Antigravity (Gemini)** (preguntas C1–C6).
2. Abrir en navegador (si tu herramienta lo permite):
   https://rimec-web-git-main-segoviaranonis-2610s-projects.vercel.app/login
3. Reportar **qué ves** y **por qué el Director podría no poder ingresar** (hipótesis UX/visuales, no SQL).
4. Escribir todo en **`RESPUESTA_ANTIGRAVITY.md`** (no uses `RESPUESTA_EJECUTOR.md` — lo usa Claude).

---

## Preguntas de capacidades (obligatorio)

Respondé en tabla en `CAPACIDADES_EQUIPO.md`:

| ID | Pregunta |
|----|----------|
| C1 | ¿Podés trabajar en **rimec-web** (Next.js, login, Vercel)? Sí / Parcial / No — **por qué** |
| C2 | ¿Podés guiar al Director para variables en Vercel? |
| C3 | ¿Podés depurar Supabase / `usuario_v2`? |
| C4 | ¿Podés abrir la URL de preview y describir pantalla + errores visibles? |
| C5 | ¿Qué **no** podés hacer (sin terminal, sin repo, etc.)? |
| C6 | **Modelo exacto** (Gemini 3 Flash, 3.1 Pro Low, 3.1 Pro High) |

Sé honesto: si no podés ejecutar rimec-web, decilo y qué **sí** podés (mockups, copy, flujos).

---

## Login RIMEC Web — qué reportar

En `RESPUESTA_ANTIGRAVITY.md`:

### A. Observación visual

- ¿Carga la página login? (logo, campos usuario/contraseña, botón)
- ¿Hay error en pantalla antes de enviar?
- Captura o descripción detallada

### B. Si podés simular login (sin credenciales reales)

- ¿Qué pasa con campos vacíos?
- Si el Director describe síntoma (401 / 403 / vuelve a login / pantalla blanca) — mapealo a posible causa **desde perspectiva usuario**

### C. Hipótesis (no código)

Lista 3–5 causas probables **desde diseño/UX/deploy**, ej.:

- Mensaje 403 poco claro (categoría no permitida)
- Error genérico que no guía al usuario
- Preview Vercel distinto a producción

### D. Qué pedirle a Claude después

1–3 ítems técnicos que **Claude** deba verificar en Fase A de `OT-EQUIPO-RIMEC-WEB-521-001.md`.

---

## Archivos de referencia (solo leer)

- `ot/en_curso/OT-EQUIPO-RIMEC-WEB-521-001.md` — contexto completo (no ejecutar Fase A SQL)
- `Nexus_Core/docs/CONTRATO_ARQUITECTURA.md` — pilares FK (contexto)

---

## Al terminar

1. Guardar `CAPACIDADES_EQUIPO.md` y `RESPUESTA_ANTIGRAVITY.md`
2. Avisar al Director: «Consultoría Gemini lista»
3. **No** cambiar `COLA.md` (lo actualiza Cursor)

**Preguntas para Cursor** → tabla en `RESPUESTA_ANTIGRAVITY.md` §4.
