# Memoria del sistema OT — Nexus Core

**Director:** Héctor Segovia  
**Regla de oro:** Los agentes **no leen todo el contexto**. Leen solo lo que este archivo autoriza.

---

## ¿Es eficiente?

**Sí**, si se cumplen tres capas con límites claros:

| Capa | Tamaño objetivo | Cuándo se lee | Riesgo si se viola |
|------|-----------------|---------------|---------------------|
| Permanente | ~5–15 KB total | **Siempre** al entrar un agente | Contexto inflado, respuestas genéricas |
| Activa (OT actual) | 1 OT + 1–3 respuestas | Solo la OT en `COLA.md` | Mezclar OTs, código contradictorio |
| Archivo (largo plazo) | Ilimitado en disco | **Nunca** salvo orden explícita | Re-leer historia = lento y confuso |

Es el mismo principio que: *índice + ventana de trabajo + cajón cerrado*.

---

## 1. Memoria permanente (consultar siempre)

Leer **solo estos archivos** al integrar un agente nuevo o al responder:

| Archivo | Para qué |
|---------|----------|
| `ot/MEMORIA_SISTEMA.md` | Este contrato |
| **`control_central/docs/RIMEC_NOMENCLATURA_PILARES.md`** | **P0 — nombres únicos: `id`, `codigo_proveedor`, `{pilar}_id` (ley Director)** |
| `ot/COLA.md` | Qué OT está activa **ahora** |
| `ot/INDICE_OT.md` | Tabla de todas las OT (estado + ruta) |
| `ot/PROTOCOLO_EJECUTAR_OT.md` | Cómo ejecutar y dónde escribir |
| `ot/TARJETA_DIRECTOR.md` | Prioridades y reglas Git del Director |
| `ot/CAPACIDADES_EQUIPO.md` | Quién hace qué (Claude / Gemini / Cursor) |

**Regla Cursor obligatoria (siempre cargada):** `control_central/.cursor/rules/rimec-nomenclatura-pilares-p0.mdc`

**No leer por defecto:** `archivo/`, `CRONOLOGIA.md` completo, consultas viejas, `control_central/OT-*.md` salvo que `COLA` lo indique.

---

## 2. Memoria activa (solo proceso actual)

Solo la OT marcada como activa en `COLA.md`:

```
ot/en_curso/OT-<ID>.md          ← especificación (leer completa)
ot/RESPUESTA_EJECUTOR.md        ← Claude escribe aquí (trabajo en curso)
ot/RESPUESTA_ANTIGRAVITY.md     ← Gemini (trabajo en curso)
ot/RESPUESTA_AUDITORIA_*.md     ← Cursor auditoría del ciclo actual (si existe)
```

**Prohibido** leer otras OT en `en_curso/` que no estén en `COLA.md` como activas.

---

## 3. Memoria de largo plazo (archivo — guardar, no leer)

Al **cerrar** una OT (auditoría PASS + Director):

1. Crear carpeta: `ot/archivo/<AAAA-MM>/<OT-ID>/`
2. Copiar o mover:
   - `OT-<ID>.md` (especificación final)
   - `RESPUESTA_EJECUTOR.md` → `respuesta_claude.md`
   - `RESPUESTA_ANTIGRAVITY.md` → `respuesta_gemini.md` (si aplica)
   - `RESPUESTA_AUDITORIA_*.md` → `auditoria_cursor.md`
   - `CIERRE.md` (3–10 líneas: veredicto, commit, fecha)
3. Actualizar `INDICE_OT.md` → estado `CERRADA` + enlace a `archivo/...`
4. Añadir **una línea** en `CRONOLOGIA.md` (ver abajo)
5. Vaciar o resetear los `RESPUESTA_*.md` de la raíz `ot/` para el próximo ciclo
6. Quitar la OT de `COLA.md` o marcar siguiente

**Los agentes no abren `ot/archivo/`** salvo que el Director diga: «revisá OT-520 cerrada».

---

## 4. Índice único de OT (`INDICE_OT.md`)

Un solo archivo maestro con **todas** las OT enumeradas:

```markdown
| ID | Estado | Ejecutor | Carpeta | Cierre |
|----|--------|----------|---------|--------|
| OT-PASO3-FLUJO-REACTIVO | EN_CURSO | Claude | en_curso/ | — |
| OT-MOTOR-SQL-520-001 | CERRADA | Claude | archivo/2026-05/... | PASS 2026-05-18 |
```

`COLA.md` = vista mínima «qué hacer hoy» (1–3 OTs).  
`INDICE_OT.md` = inventario completo.

---

## 5. Cronología (`CRONOLOGIA.md`)

Archivo **append-only** (una línea por evento, orden cronológico):

```markdown
| Fecha (UTC/local) | Agente | OT | Evento |
|-------------------|--------|-----|--------|
| 2026-05-18 22:51 | Cursor | Intento 3 | SQL 91 filas 98ms PASS |
| 2026-05-18 23:10 | Claude | OT-PASO3-FLUJO-REACTIVO | Pipeline reactivo en disco |
```

**Lectura:** solo las últimas **N** líneas (ej. 15) si hace falta contexto reciente.  
**No** cargar las 500 líneas viejas en el prompt.

---

## 6. Flujo al entrar un agente

```
1. Leer MEMORIA_SISTEMA.md (este archivo) — 1 min
2. Leer COLA.md → ID OT activa
3. Leer INDICE_OT.md → solo fila de esa OT (opcional)
4. Leer ot/en_curso/<OT>.md
5. Ejecutar
6. Escribir RESPUESTA_<agente>.md
7. NO leer archivo/ ni CRONOLOGIA completa
```

---

## 7. Qué NO hacer (disparate real)

- Un solo `.md` gigante con todas las OT + todas las respuestas → **ineficiente** (tokens, ruido).
- Sobrescribir `RESPUESTA_EJECUTOR.md` sin archivar al cerrar → **pérdida de historia**.
- Leer transcripts de Cursor completos en cada turno → usar solo OT activa + permanente.

---

*Mantenido por Cursor — adoptar como regla de equipo en rules/skills si el Director confirma.*
