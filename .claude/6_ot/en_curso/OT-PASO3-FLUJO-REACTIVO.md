# OT-PASO3-FLUJO-REACTIVO — Claude Code

**Prioridad:** P0  
**Director:** Héctor Segovia  
**Objetivo:** Paso 3 sin bloqueo de hilo UI (Streamlit); logs dinámicos; transacciones cortas por caso.

---

## Alcance (ya aplicado por Cursor — verificar / completar)

| Archivo | Rol |
|---------|-----|
| `modules/rimec_engine/ui_paso3_live.py` | `st.empty()` + métricas + heartbeat WebSocket |
| `modules/rimec_engine/paso3_pipeline.py` | Negocio sin Streamlit + `liberar_conexiones_paso3()` |
| `modules/rimec_engine/ui.py` | Paso 3 llama pipeline + panel (sin `st.spinner` global) |
| `modules/rimec_engine/logic.py` | `preparar_filas_staging_bulk(..., on_progress=)` |

---

## Protocolo GIT (Claude — obligatorio al cerrar)

Ejecutar desde `C:\Users\hecto\Nexus_Core\control_central` (o raíz `Nexus_Core` si el repo es monorepo):

```powershell
cd C:\Users\hecto\Nexus_Core
git status
git diff --stat
git diff control_central/modules/rimec_engine/ui.py control_central/modules/rimec_engine/logic.py control_central/modules/rimec_engine/paso3_pipeline.py control_central/modules/rimec_engine/ui_paso3_live.py
```

**Commit solo si el Director lo pide explícitamente.** Si pide commit:

```powershell
git add control_central/modules/rimec_engine/ui.py control_central/modules/rimec_engine/logic.py control_central/modules/rimec_engine/paso3_pipeline.py control_central/modules/rimec_engine/ui_paso3_live.py ot/en_curso/OT-PASO3-FLUJO-REACTIVO.md
git commit -m "$(cat <<'EOF'
Refactor Paso 3: pipeline reactivo sin spinner global.

Separa visualización (st.empty) del procesamiento por casos, libera pool SQL entre ciclos y expone progreso en preparar_filas_staging_bulk.
EOF
)"
git status
```

**NO** `git push` salvo orden explícita del Director.

---

## Protocolo de auditoría — Cursor (obligatorio tras Claude)

Cursor audita el trabajo de Claude con esta checklist. Resultado en `ot/RESPUESTA_AUDITORIA_PASO3_REACTIVO.md`.

### A. Arquitectura

- [ ] No existe `with st.spinner(...)` envolviendo todo el Paso 3 en `ui.py`
- [ ] `ejecutar_pipeline_paso3` no importa `streamlit`
- [ ] Panel usa `st.empty()` y se actualiza en cada caso / callback `on_progress`

### B. Base de datos

- [ ] Tras cada caso: `liberar_conexiones_paso3()` (pool dispose)
- [ ] Staging se carga **por caso** (transacción corta), no un bloque gigante al final
- [ ] SQL masivo sigue siendo 1 llamada `calcular_precio_lista_evento_sql`

### C. Prueba funcional (Director o Cursor con Streamlit)

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
.\streamlit_run.ps1
```

1. Listado nuevo → Paso 3 → Iniciar cálculo  
2. UI: tabla de métricas + log con timestamps (sin congelar 2+ min)  
3. Terminal: `[ENGINE-SQL] Cálculo masivo OK: N filas` con N>0, duración SQL <2s  
4. `SELECT COUNT(*) FROM precio_lista WHERE evento_id = <id>;` → N coincide  

### D. Regresión

- [ ] Recalcular con precios existentes sigue mostrando botón Paso 4  
- [ ] `USE_CALCULO_SQL = False` (si se prueba) no rompe pipeline  

**Veredicto:** PASS / FAIL + evidencia (captura log terminal + 3 líneas de métricas UI).

---

## Handoff Claude → Cursor

Cuando termines, dejá en `ot/RESPUESTA_EJECUTOR.md` sección:

```markdown
## OT-PASO3-FLUJO-REACTIVO
- Archivos tocados: ...
- Commit: <hash o "pendiente Director">
- Listo para auditoría Cursor: sí/no
```
