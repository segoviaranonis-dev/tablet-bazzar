# CONSULTA DIRECTOR 01 — Diagnóstico Motor Streamlit

**Fecha:** 2026-05-18  
**Ejecutor:** Claude Code  
**Contexto:** Validación estado pre-lanzamiento Paso 3 Motor + fix gkpj

---

## Resumen ejecutivo

**Estado general:** ✅ **LISTO para lanzar** con corrección launcher  
**Comando correcto:** `.\venv\Scripts\python.exe -m streamlit run main.py`  
**Puerto:** 8502 (esperado según contexto OT)  
**Migraciones SQL:** ✅ Aplicadas en Supabase (052, 053, 054 verificadas)  
**Fix IntegrityError gkpj:** ✅ Código corregido (pendiente prueba funcional)

---

## Diagnóstico técnico

### 1. Entorno Python y venv

| Componente | Estado | Detalle |
|------------|--------|---------|
| **venv** | ✅ EXISTE | `control_central/venv/` con Python 3.14.0 |
| **Streamlit** | ✅ INSTALADO | v1.53.1 en venv |
| **DB engine** | ✅ CONECTADO | core.database.engine → Supabase OK |
| **main.py** | ✅ EXISTE | Entry point aplicación |

**Comando que falla:**
```bash
streamlit run main.py
```

**Razón del fallo:**
- `streamlit` launcher NO está en PATH del sistema
- Si existiera en PATH global, apuntaría a venv viejo en `Documents\Prg_locales\...` (según contexto OT)

**Comando correcto:**
```bash
cd C:\Users\hecto\Nexus_Core\control_central
.\venv\Scripts\python.exe -m streamlit run main.py
```

**Alternativa PowerShell (más explícito):**
```powershell
& .\venv\Scripts\python.exe -m streamlit run main.py
```

---

### 2. Motor SQL Ultra-Rápido (OT-MOTOR-OPTIMIZADO-FINAL-001)

| Flag | Valor | Implicación |
|------|-------|-------------|
| **USE_CALCULO_SQL** | `True` | Motor SQL activo (línea 13 ui.py) |
| **Migraciones 052-054** | ✅ APLICADAS | Funciones SQL creadas en Supabase |
| **Fallback Python** | DISPONIBLE | Si SQL falla, cae a método tradicional con log |

**Badge esperado en UI:**
```
⚡ MOTOR ULTRA-RÁPIDO (SQL en Postgres) — requiere migraciones 052–054 en Supabase.
```

**Verificación Supabase (ejecutada):**
- ✅ `idx_precio_lista_evento_triplete` (índice 052)
- ✅ `calcular_precio_lista_evento_sql(1 arg)` (función 053)
- ✅ `resolver_pilares_sql(6 args)` (función 054)
- ✅ `idx_linea_proveedor_codigo`, `idx_material_proveedor_codigo`, `idx_referencia_proveedor_codigo` (índices 054)

**Fix keyword reservado:** Migración 054 corregida (`desc` → `descripcion` línea 95)

---

### 3. Fix IntegrityError gkpj (OT-HOTFIX-PELE-GKPJ-001)

**Problema original:**
```
IntegrityError gkpj — INSERT precio_evento_linea_excepcion
evento_id=5, caso_id=26, proveedor_id=654, codes=[4305, 60011]
NOT EXISTS solo (caso_id, linea_id) — choca con UNIQUE (evento_id, linea_id)
```

**Root cause:**
- Migración 043 crea `UNIQUE INDEX idx_pele_evento_linea_unica ON (evento_id, linea_id)`
- Código viejo usaba `NOT EXISTS (caso_id, linea_id)` → conflicto si línea ya en otro caso mismo evento

**Fix aplicado por Cursor (validado por Claude):**

| Función | Línea | Fix |
|---------|-------|-----|
| `_insert_linea_en_contenedor` | 1206 | `ON CONFLICT (evento_id, linea_id) DO UPDATE SET caso_id = EXCLUDED.caso_id` |
| `_insert_lineas_contenedor_bulk` | 1268 | Mismo `ON CONFLICT` + `DISTINCT ON (l.id)` |

**Todos los paths auditados:**

✅ `guardar_lineas_excepcion` → llama bulk con `evento_id`  
✅ `reemplazar_lineas_excepcion` → llama guardar con `evento_id`  
✅ `persistir_caso_matriz_evento` (line 751) → llama reemplazar con `evento_id`  
✅ `asegurar_contenedor_lineas_excel` (line 901) → llama insert single con `evento_id`  
✅ `ui.py` Paso 3 (lines 1256, 2372) → llaman reemplazar con `evento_id`

**Comportamiento esperado post-fix:**
- Si línea ya asignada a caso A y se intenta asignar a caso B (mismo evento) → **reasignación silenciosa** (UPDATE caso_id)
- Sin error `gkpj`
- Contenedor coherente (una línea = un caso por evento)

**Documentación añadida:**
Comentario en `_insert_lineas_contenedor_bulk`:
```python
# ON CONFLICT permite reasignar líneas entre casos dentro del mismo evento
# (coherente con UNIQUE INDEX idx_pele_evento_linea_unica de migración 043)
```

---

### 4. Escenario de prueba recomendado

**Reproducir error original (esperado: sin error ahora):**

1. Lanzar Streamlit:
   ```bash
   cd C:\Users\hecto\Nexus_Core\control_central
   .\venv\Scripts\python.exe -m streamlit run main.py
   ```

2. Navegar a Paso 3 del Motor

3. Configurar:
   - Evento: 5
   - Caso: 26 (o equivalente)
   - Proveedor: 654
   - SKUs con líneas 4305, 60011

4. **Resultado esperado:**
   - ✅ Contenedor se actualiza sin error `gkpj`
   - ✅ Si líneas ya estaban en otro caso → reasignadas al caso 26
   - ✅ Paso 3 completa cálculo (91 SKUs en <10s con motor SQL)

**Validación motor SQL:**
- Observar badge "⚡ MOTOR ULTRA-RÁPIDO"
- Log debe mostrar: `Fase 4/5: Ejecución cálculo masivo en servidor (X SKUs)…`
- Tiempo <10s para 91 SKUs (vs ~147s método Python)

**Validación paridad (opcional):**
```bash
.\venv\Scripts\python.exe scripts/verificar_paridad_calculo_sql.py
```
Debe retornar: `diff_count = 0`

---

## Bloqueadores identificados

| # | Bloqueador | Severidad | Acción |
|---|------------|-----------|--------|
| 1 | Comando `streamlit run` directo falla | **P1** | Usar `.\venv\Scripts\python.exe -m streamlit run main.py` |
| 2 | Fix gkpj NO probado en runtime | **P0** | Ejecutar prueba Paso 3 con escenario original |
| 3 | Migraciones 052-054 aplicadas pero T1/T2 sin validar | **P1** | Ejecutar Paso 3 + script paridad |

**No bloqueantes:**
- Git push pendiente (prohibido hasta cierre etapa Director)
- RESPUESTA_EJECUTOR.md incompleta (se completa post-prueba)

---

## Recomendaciones Director

### Ruta crítica (next steps)

1. **Lanzar Streamlit** con comando correcto
2. **Reproducir escenario gkpj** (evento 5, caso 26, códigos 4305/60011)
3. **Validar Paso 3 completo** (91 SKUs, <10s, sin errores)
4. Si **PASS**: cerrar OT-HOTFIX-PELE-GKPJ-001 → commit + push
5. Si **FAIL**: documentar error específico → ajustar fix

### Opcional (mejora UX launcher)

**Problema:** `streamlit run` falla (launcher no en PATH o apunta a venv viejo)

**Solución rápida:** Script PowerShell `run_local.ps1`

```powershell
# run_local.ps1
Push-Location $PSScriptRoot
& .\venv\Scripts\python.exe -m streamlit run main.py --server.port 8502
Pop-Location
```

Uso: `.\run_local.ps1` (doble clic o desde terminal)

**Ventaja:** Un comando, puerto fijo 8502, sin memorizar path venv

---

## Preguntas para Cursor (post-prueba funcional)

| # | Pregunta | Contexto |
|---|----------|----------|
| Q1 | ¿`ON CONFLICT DO UPDATE` es la política correcta vs rechazar con error de barrera? | Línea reasignada entre casos mismo evento — ¿requiere warning UI? |
| Q2 | ¿Hace falta migración 055 para registrar histórico de reasignaciones? | Auditoría: quién movió línea X de caso A a caso B |
| Q3 | ¿Datos corruptos en evento 5 requieren script de limpieza? | Tras varios recálculos fallidos pre-fix |
| Q4 | ¿Motor SQL con fallback Python es suficiente o forzar falla si 052-054 ausentes? | Trade-off: robustez vs feedback explícito |

---

## Referencias

**OTs relacionadas:**
- `OT-HOTFIX-PELE-GKPJ-001` — Fix gkpj (en curso)
- `OT-MOTOR-OPTIMIZADO-FINAL-001` — Motor SQL (en pausa, condicional)

**Migraciones:**
- `migrations/043_contenedor_lineas_evento.sql` — UNIQUE (evento_id, linea_id)
- `migrations/052_precio_lista_indice_triplete.sql` — Índices triplete
- `migrations/053_calcular_precio_lista_evento_sql.sql` — Función cálculo masivo
- `migrations/054_resolver_pilares_sql.sql` — Función FK pilares (fix desc→descripcion)

**Código modificado (sin commit):**
- `modules/rimec_engine/logic.py` — Fix ON CONFLICT + comentarios

---

**Estado final diagnóstico:** ✅ VERDE (listo para prueba funcional)  
**Próximo paso:** Ejecutar comando correcto Streamlit + validar escenario gkpj

---

*Claude Code — Consulta Director 01 — 2026-05-18*
