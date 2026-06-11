# Protocolo — «Ejecuta la OT»

> Si el Director o Cursor te dicen **«Ejecuta la OT»**, hacé **solo** esto. No pidas otra ruta ni otro nombre de archivo.

---

## Paso 1 — Cola (30 segundos)

Abrí: **`C:\Users\hecto\Nexus_Core\ot\COLA.md`**

Ahí está la **OT activa**: ID, ruta del archivo `.md`, quién ejecuta (vos o el otro agente), y estado.

Si `COLA.md` dice **SIN OT ACTIVA** → pará y reportalo en `RESPUESTA_EJECUTOR.md`.

---

## Paso 2 — Leer la OT (obligatorio)

Abrí el archivo indicado en **Ruta del archivo OT** (suele estar en `ot/en_curso/` o `control_central/`).

La OT tiene: objetivo, fases, prohibidos, pruebas, comandos git. **Seguí la OT al pie de la letra.**

Antes de código, leé también (solo referencia, no reemplaza la OT):

- `Nexus_Core/docs/CONTRATO_ARQUITECTURA.md`
- Si la OT es Streamlit/SQL: `control_central/docs/CONTROL_INTEGRIDAD_HOLDING.md`

---

## Paso 3 — Ejecutar

| Ejecutor | Herramienta | Alcance típico |
|----------|-------------|----------------|
| **Claude Code** | VS Code | Código, migraciones SQL, push git, evidencia JSON |
| **Antigravity** | Gemini | Solo lo que diga la OT (diseño, mockups, copy UI) |

- No cerrés la OT vosotros (`auditoria_auto: PASS` lo pone **Cursor**).
- No inventes alcance fuera de la OT.

---

## Paso 4 — Responder (obligatorio) — ¿DÓNDE ESCRIBIR?

| Agente | Archivo (ruta fija) | Cuándo |
|--------|---------------------|--------|
| **Claude Code** | `C:\Users\hecto\Nexus_Core\ot\RESPUESTA_EJECUTOR.md` | Toda OT de **código**, SQL, migraciones, Motor, webs |
| **Antigravity (Gemini)** | `C:\Users\hecto\Nexus_Core\ot\RESPUESTA_ANTIGRAVITY.md` | Solo **consultorías** de diseño/UX (`CONSULTA_ANTIGRAVITY-*.md`) |

**Prohibido:** intercambiar archivos; decir «listo» o «Consultoría lista» **sin guardar** el archivo en disco.

### Contenido mínimo (Claude → `RESPUESTA_EJECUTOR.md`)

1. **Resumen** de lo hecho (commits, archivos).
2. **Preguntas para Cursor** — tabla con `# | Pregunta | Contexto |`. Si no hay dudas, escribí «Sin preguntas».
3. **Evidencia** — ruta a `control_central/OT-*-EVIDENCIA.json` si la OT lo pide.
4. **Estado** — `LISTO_PARA_AUDITORIA` o `BLOQUEADO` (con motivo).
5. Si la OT pide **capacidades del equipo** → también actualizá **`ot/CAPACIDADES_EQUIPO.md`** (tu sección).

### Contenido mínimo (Gemini → `RESPUESTA_ANTIGRAVITY.md`)

1. Resumen Director (5 líneas).
2. Tablas de la consulta (G1–G7 o las que indique el `CONSULTA_*.md`).
3. Copy listo para pegar (si aplica).
4. **No** tocar `RESPUESTA_EJECUTOR.md`.

---

## Paso 5 — Avisar

En `COLA.md` cambiá solo la línea **Estado cola** a:

`LISTO_PARA_AUDITORIA` (o `BLOQUEADO`)

El **Director** no audita; **Cursor** lee `RESPUESTA_EJECUTOR.md` y emite PASS/FAIL.

---

## Mapa de archivos (memorizar)

| Archivo | Quién escribe | Quién lee |
|---------|---------------|-----------|
| `ot/COLA.md` | **Cursor** | Todos |
| `ot/en_curso/*.md` | **Cursor** (OT nueva) | Ejecutor |
| `ot/RESPUESTA_EJECUTOR.md` | **Claude Code** (implementación) | Cursor, Director |
| `ot/RESPUESTA_ANTIGRAVITY.md` | **Antigravity / Gemini** (consultoría UX) | Cursor, Director |
| `control_central/OT-*-EVIDENCIA.json` | **Claude** | Cursor |

---

## Frases que NO hacen falta

El ejecutor **no** necesita: «¿cuál OT?», «¿dónde está?», «¿qué repo?» — todo está en **COLA.md**.

Si falta información **dentro** de la OT → preguntá en **RESPUESTA_EJECUTOR.md**, sección preguntas.
