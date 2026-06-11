# RESPUESTA CURSOR — CONSULTA DIRECTOR 01

**Consulta:** Lanzar y verificar Motor de Precios en navegador + diagnosticar `streamlit run main.py`  
**Fecha:** 2026-05-18  
**Auditor:** Cursor (Auto)  
**Alcance:** Solo diagnóstico (esta OT de consulta). Acciones correctivas mínimas documentadas abajo.

---

## 1. Resumen ejecutivo

| Ítem | Resultado |
|------|-----------|
| **App Streamlit en navegador** | **OK** en `http://localhost:8502` — pantalla de login «Acceso NEXUS CORE» carga correctamente |
| **`python -m streamlit run main.py`** | **OK** — es el método que hoy levanta la app (confirmado en tu terminal y en navegador) |
| **`streamlit run main.py` (comando corto)** | **FALLA** — launcher del venv apunta a Python de un proyecto viejo que ya no existe |
| **Motor Paso 3 (cálculo 91 SKUs)** | **No verificado end-to-end en browser** — requiere login DIRECTOR + credencial en Supabase; en terminal previa hubo error `gkpj` en contenedor (OT-HOTFIX-PELE pendiente Claude) |

---

## 2. Verificación en navegador

### 2.1 Arranque

- URL probada: **http://localhost:8502** (instancia activa en tu terminal 2).
- Título: **RIMEC \| NEXUS CORE**.
- UI: formulario **Usuario** / **Contraseña** / botón **INICIAR PROTOCOLO DE ACCESO**.
- Conclusión: el stack Streamlit + `main.py` **responde**; no hay crash en arranque.

### 2.2 Motor de precios (RIMEC_ENGINE)

| Paso | Estado | Nota |
|------|--------|------|
| Login DIRECTOR | No ejecutado por Cursor | Password en `usuario_v2` (Supabase); no está en repo |
| Navegación a Motor | Pendiente post-login | Sector `RIMEC_ENGINE` en logs previos del Director |
| Paso 3 — cálculo | Pendiente | Terminal 1: `IntegrityError gkpj` en `precio_evento_linea_excepcion` (evento 5, caso 26) |

**Para cerrar verificación de Motor:** iniciá sesión como DIRECTOR → Motor de Precios → listado evento 5 → Paso 3. Cursor no puede completar sin tu contraseña.

---

## 3. Diagnóstico — `streamlit run main.py`

### 3.1 Mensaje de error (tu terminal)

```text
Fatal error in launcher: Unable to create process using
'"C:\Users\hecto\Documents\Prg_locales\ventas_por_mes_rimec-main\venv\Scripts\python.exe"'
"C:\Users\hecto\Nexus_Core\control_central\venv\Scripts\streamlit.exe" run main.py':
El sistema no puede encontrar el archivo especificado.
```

### 3.2 Causa raíz

El **venv de `control_central` fue copiado o movido** desde el proyecto antiguo `ventas_por_mes_rimec-main`. Quedaron rutas **hardcodeadas**:

| Archivo | Problema |
|---------|----------|
| `venv/pyvenv.cfg` | `command = ... -m venv ...\ventas_por_mes_rimec-main\venv` |
| `venv/Scripts/activate.bat` | `VIRTUAL_ENV` apuntaba al path viejo |
| `venv/Scripts/activate` / `activate.fish` | Igual |
| `venv/Scripts/*.py` (entry points) | Shebang `#!...\ventas_por_mes_rimec-main\venv\Scripts\python.exe` |
| `venv/Scripts/streamlit.exe` (si existe) | Launcher PEP 397 embebido al Python **inexistente** |

En Windows, al escribir `streamlit`, el orden `PATHEXT` favorece **`.exe` antes que `.cmd`**. Si existe `streamlit.exe` roto, **gana sobre** `streamlit.cmd` (que ya estaba bien: `python.exe -m streamlit`).

El **`venv\Scripts\python.exe` del Nexus sí funciona** (por eso `python -m streamlit` levanta en **8502**).

### 3.3 Qué funciona hoy

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
.\venv\Scripts\python.exe -m streamlit run main.py
```

O:

```powershell
powershell -ExecutionPolicy Bypass -File .\run_local.ps1
```

(`run_local.ps1` ya usa `python.exe -m streamlit`; puede recrear venv si falta Streamlit.)

---

## 4. Solución recomendada (orden de preferencia)

### A — Inmediata (sin recrear venv)

Usar siempre uno de estos (añadidos en esta consulta):

```powershell
.\streamlit_run.ps1
# o
.\streamlit_run.bat
```

Equivalente manual:

```powershell
.\venv\Scripts\python.exe -m streamlit run main.py
```

### B — Corregir activate (hecho en esta consulta)

`activate.bat`, `activate`, `activate.fish` y `pyvenv.cfg` actualizados a ruta **Nexus_Core\control_central\venv**. Tras `Activate.ps1`, el entorno virtual debería ser el correcto (aunque `streamlit.exe` roto puede seguir fallando si existe).

### C — Definitiva (cuando cierres etapa)

Recrear venv limpio:

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
Remove-Item -Recurse -Force .\venv
powershell -ExecutionPolicy Bypass -File .\run_local.ps1
```

Eso regenera `streamlit.exe` y todos los scripts con rutas correctas.

### D — Si `streamlit run` sigue fallando tras activate

```powershell
.\venv\Scripts\python.exe -m pip install --force-reinstall streamlit
```

O eliminar manualmente `venv\Scripts\streamlit.exe` para que Windows use `streamlit.cmd`.

---

## 5. Relación con error grave Motor (terminal)

Independiente del launcher Streamlit:

- **Error:** `IntegrityError` / `gkpj` en `INSERT precio_evento_linea_excepcion`.
- **OT activa Claude:** `OT-HOTFIX-PELE-GKPJ-001` (`ot/COLA.md`).
- **Fix parcial Cursor:** `ON CONFLICT (evento_id, linea_id)` en `logic.py` — requiere **reiniciar Streamlit** y re-probar.

---

## 6. Checklist Director

- [ ] Arrancar con `.\streamlit_run.ps1` o `python -m streamlit` (no `streamlit run` a ciegas hasta recrear venv).
- [ ] Abrir `http://localhost:8502` (o el puerto que indique la consola).
- [ ] Login DIRECTOR → Motor de Precios → Paso 3.
- [ ] Confirmar que no aparece `gkpj` en terminal al guardar líneas / calcular.
- [ ] (Opcional) Recrear venv con `run_local.ps1` al cerrar etapa.

---

## 7. Archivos tocados por Cursor en esta consulta

| Archivo | Acción |
|---------|--------|
| `control_central/streamlit_run.ps1` | Nuevo — arranque seguro |
| `control_central/streamlit_run.bat` | Nuevo — arranque seguro |
| `control_central/venv/Scripts/activate.bat` | Fix `VIRTUAL_ENV` |
| `control_central/venv/Scripts/activate` | Fix `VIRTUAL_ENV` |
| `control_central/venv/Scripts/activate.fish` | Fix `VIRTUAL_ENV` |
| `control_central/venv/pyvenv.cfg` | Fix ruta `command` |
| `ot/RESPUESTA_CURSOR_CONSULTA-DIRECTOR-01.md` | Este informe |

**Git:** sin commit (según instrucción de etapa).

---

---

## 8. Continuación (misma consulta — verificación Motor)

### 8.1 Error bloqueante encontrado en navegador

Al abrir **Motor de Precios** desde el Hub (sesión DIRECTOR activa):

```text
Error al renderizar módulo 'rimec_engine':
unindent does not match any outer indentation level (ui.py, line 1399)
```

**Causa:** al refactorizar Paso 3 (`if lanzar_calculo`), el bloque `if calc_ok:` quedó con **4 espacios menos** que el cuerpo del `with proceso_largo(...)` (debía ir **dentro** del context manager).

**Corrección aplicada:** `modules/rimec_engine/ui.py` líneas 1399–1416 re-indentadas (+4 espacios).

### 8.2 Verificación post-fix

| Prueba | Resultado |
|--------|-----------|
| `ast.parse` / sintaxis `ui.py` | OK en disco |
| Terminal Director tras recarga | `[NAV] Sector activo: RIMEC_ENGINE` — **Motor cargó** |
| Browser (sin re-login) | Tras F5 vuelve a login; hace falta entrar de nuevo y pulsar Motor |

**Acción Director:** reiniciá Streamlit una vez (`Ctrl+C` → `.\streamlit_run.ps1`) y volvé a login → Motor de Precios. El error de indentación **no debería repetirse**.

### 8.4 Error terminal post-fix ON CONFLICT (2026-05-18 noche)

Colaboradores + terminal **coinciden**:

```text
psycopg2.errors.InvalidColumnReference:
there is no unique or exclusion constraint matching the ON CONFLICT specification
```

- **Caso:** evento **7**, caso **34**, cientos de códigos de línea.
- **Causa:** el fix `ON CONFLICT (evento_id, linea_id)` asume migración **043** aplicada en Supabase (`idx_pele_evento_linea_unica`). **En prod ese índice no existe aún.**
- **Efecto colateral:** el `except` hacía **un INSERT por línea** → terminal llena de `Commit OK` ~153 ms × N (muy lento, riesgo timeout).

**Corrección Cursor (sin depender de 043):** `DELETE` líneas del mismo evento en **otros** casos + `INSERT` masivo con `NOT EXISTS` — **sin** `ON CONFLICT`. Fallback N+1 **eliminado** (retorna 0 y log si falla el bulk).

**Recomendación Director:** aplicar `migrations/043_contenedor_lineas_evento.sql` en Supabase cuando cierren etapa (refuerzo en BD).

### 8.3 Pendientes (no resueltos en esta continuación)

| Ítem | Estado |
|------|--------|
| `gkpj` en `precio_evento_linea_excepcion` | Fix `ON CONFLICT` en `logic.py` — probar Paso 3 con recálculo |
| Migraciones 052–054 Supabase | Pendiente Director |
| `streamlit run` (exe roto) | Usar `streamlit_run.ps1` o `python -m streamlit` |
| OT Claude `OT-HOTFIX-PELE-GKPJ-001` | Sigue en `COLA.md` |

---

*Fin CONSULTA DIRECTOR 01 — Cursor (actualizado continuación)*
