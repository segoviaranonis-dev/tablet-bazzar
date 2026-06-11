# Plan Cursor + Director — mientras Claude ejecuta OT-HOTFIX-PELE

**Fecha:** 2026-05-18  
**Modo:** Claude **ejecuta código** · Cursor + Director **planifican y verifican**  
**Git:** sin commit hasta cierre de etapa (orden Director)

---

## División de roles

| Rol | Qué hace | Qué NO hace |
|-----|----------|-------------|
| **Claude Code** | Implementar, probar local, completar `RESPUESTA_EJECUTOR.md` + JSON evidencia | commit/push; cerrar OT con PASS |
| **Cursor** | Auditar diff, leer terminal, browser spot-check, actualizar este plan | reescribir todo `logic.py` en paralelo sin coordinar |
| **Director (Héctor)** | Correr Streamlit, migraciones Supabase cuando indiquemos, decidir cierre etapa | auditar línea a línea el código |

---

## Estado acordado del problema (todos los agentes)

| # | Error | Causa | Fix en disco (Cursor) |
|---|-------|-------|------------------------|
| 1 | `gkpj` unique violation | `NOT EXISTS` solo `(caso_id, linea_id)` vs regla 1 línea/evento | Sustituido ON CONFLICT (ver #2) |
| 2 | `f405` ON CONFLICT sin constraint | Migración **043 no aplicada** en Supabase | **DELETE otros casos + INSERT bulk** en `logic.py` (sin ON CONFLICT) |
| 3 | Terminal spam `Commit OK` × N | Fallback N+1 tras fallo bulk | Fallback eliminado → log + 0 |
| 4 | Motor no abría | `IndentationError` ui.py ~1399 | Corregido (Paso 3 dentro de `proceso_largo`) |
| 5 | `streamlit run` roto | venv copiado de proyecto viejo | Usar `streamlit_run.ps1` o `python -m streamlit` |

---

## Órdenes para Claude (copiar en VS Code)

**Decile exactamente:**

> Ejecuta la OT. Leé `COLA.md` y `ot/en_curso/OT-HOTFIX-PELE-GKPJ-001.md` versión actualizada. El handoff en `RESPUESTA_EJECUTOR.md` §0 está desactualizado: **no uses ON CONFLICT**; validá el patrón DELETE+INSERT en `logic.py`. Sin git commit. Al terminar: `LISTO_PARA_AUDITORIA` en RESPUESTA + JSON evidencia.

---

## Checklist Claude (debe marcar en RESPUESTA)

- [ ] **T1** Bulk contenedor evento 7 / caso 34 (muchos códigos) — sin `f405` ni spam de commits
- [ ] **T2** Evento 5 / caso 26 códigos `[4305, 60011]` — sin `gkpj`
- [ ] **T3** `ui.py` compila; Motor abre en Streamlit (sin IndentationError)
- [ ] **T4** Paso 3: mensaje claro si faltan funciones SQL **052–054** (no traceback crudo)
- [ ] **T5** Documentar si conviene aplicar **043** en Supabase (script listo en `migrations/`)
- [ ] **T6** Lista de archivos tocados; **cero** commits

---

## Plan Cursor + Director (ahora, en paralelo)

### Fase A — Verificación inmediata (Director, ~10 min)

1. Reiniciar app: `cd control_central` → `.\streamlit_run.ps1`
2. Login DIRECTOR → **Motor de Precios**
3. Listado **evento 7** (o el que falló) → guardar matriz / Paso 3
4. **Mirar terminal:** no debe haber `InvalidColumnReference` ni ráfaga de cientos de `Commit OK`
5. Anotar: ¿Paso 3 terminó? ¿cuántos segundos? ¿error SQL distinto?

### Fase B — Cursor audita diff (mientras Claude trabaja)

- [ ] `logic.py` — `_insert_lineas_contenedor_bulk` y `_insert_linea_en_contenedor`
- [ ] Sin restos de `ON CONFLICT (evento_id, linea_id)` salvo comentario/doc
- [ ] `ui.py` Paso 3 — indentación bloque `if calc_ok`
- [ ] ¿Hace falta migración **055** solo-doc o basta **043**?

### Fase C — Supabase (Director, cuando Cursor + Claude alineen)

Orden sugerido en SQL Editor:

1. **043** — `idx_pele_evento_linea_unica` (refuerzo BD; código ya funciona sin ella)
2. **052 → 053 → 054** — motor SQL rápido (OT-FINAL, después del hotfix)

### Fase D — Cierre etapa (solo Director)

- [ ] Cursor emite PASS/FAIL en consulta o COLA
- [ ] Director autoriza **un** commit empaquetado (Claude o Cursor)
- [ ] Retomar `OT-MOTOR-OPTIMIZADO-FINAL-001`

---

## Criterios PASS para Cursor (auditoría)

| ID | PASS si… |
|----|----------|
| **V1** | Terminal sin `gkpj` / `f405` en contenedor durante guardar casos |
| **V2** | Bulk ≥100 líneas en &lt;5 s de commits visibles (no N×150 ms) |
| **V3** | Motor renderiza; Paso 3 llega a botón Continuar Paso 4 o cálculo completo |
| **V4** | `RESPUESTA_EJECUTOR.md` completa + JSON evidencia en disco |

---

## Comunicación entre agentes

| De → A | Canal |
|--------|--------|
| Claude → Cursor | `ot/RESPUESTA_EJECUTOR.md` §4 preguntas |
| Cursor → Claude | `ot/RESPUESTA_EJECUTOR.md` §0 handoff (actualizar) o comentario en OT |
| Cursor → Director | Este archivo + `RESPUESTA_CURSOR_CONSULTA-DIRECTOR-01.md` |
| Gemini | **No tocar** PELE; sigue `OT-REPORT-UX-HUB-523` en paralelo |

---

*Cursor — plan de coordinación 2026-05-18*
