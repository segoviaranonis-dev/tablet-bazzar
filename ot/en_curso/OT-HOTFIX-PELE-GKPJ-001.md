# OT-HOTFIX-PELE-GKPJ-001 — Contenedor líneas (gkpj + f405)

**Estado:** `PENDIENTE_EJECUCION`  
**Prioridad:** **P0**  
**Ejecutor:** **Claude Code**  
**Coordinación:** Cursor + Director verifican en paralelo (`ot/PLAN_CURSOR-DIRECTOR-PELE-001.md`)

---

## Disparador

> **Ejecuta la OT**

Respondé en: **`ot/RESPUESTA_EJECUTOR.md`**  
Evidencia: **`control_central/OT-HOTFIX-PELE-GKPJ-001-EVIDENCIA.json`**

---

## Prohibido

- `git commit` / `git push` hasta cierre de etapa (Director).
- Volver a `ON CONFLICT (evento_id, linea_id)` sin confirmar que **043** está en Supabase.

---

## Contexto actualizado (no usar versión vieja de la OT)

### Error A — `gkpj`

- `NOT EXISTS` solo por `(caso_id, linea_id)` chocaba con línea ya en **otro** caso del mismo evento.

### Error B — `f405` (terminal reciente)

```text
InvalidColumnReference: no unique or exclusion constraint matching the ON CONFLICT specification
evento_id=7, caso_id=34, miles de códigos
```

- Intentativa `ON CONFLICT` falló porque **043 no está en prod**.
- Fallback N+1 = terminal con cientos de `Commit OK`.

### Fix esperado (ya en disco — validar y completar)

`logic.py`: **DELETE** cross-caso + **INSERT** bulk, sin ON CONFLICT, sin fallback N+1.

`ui.py`: indent Paso 3 corregida (~1399).

---

## Tareas Claude (orden)

### 1. Validar código

- [ ] Leer `_insert_lineas_contenedor_bulk` y `_insert_linea_en_contenedor`.
- [ ] Confirmar transacción única (DELETE + INSERT).
- [ ] Buscar otros `INSERT` a `precio_evento_linea_excepcion` con lógica vieja.

### 2. Probar local

- [ ] `.\streamlit_run.ps1` → Motor → listado evento **7** o **5**.
- [ ] Guardar matriz con muchas líneas (caso 34 o equivalente).
- [ ] Terminal: **sin** `f405`, **sin** ráfaga N× Commit OK.
- [ ] Paso 3 si aplica: sin crash; mensaje si faltan 052–054.

### 3. Documentar

- [ ] `RESPUESTA_EJECUTOR.md` completa.
- [ ] JSON evidencia con checks T1–T6.
- [ ] Recomendar al Director: aplicar **043** luego **052→053→054** en Supabase.

### 4. Preguntas a Cursor (si aplica)

Escribir en §4 de RESPUESTA (ej. ¿migración 055?, ¿datos sucios evento 7?).

---

## Referencias

- `migrations/043_contenedor_lineas_evento.sql`
- `modules/rimec_engine/logic.py` (~1193–1320)
- `modules/rimec_engine/ui.py` (~1043–1416)
- `ot/RESPUESTA_CURSOR_CONSULTA-DIRECTOR-01.md` §8.4

---

*Actualizado Cursor — coordinación con Director 2026-05-18*
