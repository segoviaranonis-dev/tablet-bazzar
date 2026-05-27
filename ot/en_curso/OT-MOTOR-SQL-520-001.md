# OT-MOTOR-SQL-520-001 — Motor: cálculo masivo en Postgres + índice triplete

**Estado:** PENDIENTE_EJECUCION  
**Fecha:** 2026-05-18  
**Ejecutor:** Claude Code (VS Code)  
**Repo:** `control_central`  
**Auditoría:** Cursor (Auto) vía `ot/RESPUESTA_EJECUTOR.md`

---

## Objetivo gerencial

El cálculo de `precio_lista` no debe tardar 20–40 min en bucle Python por SKU. Debe ser **set-based en Postgres**: Excel mapeado a pilares FK → JOIN caso/biblioteca → índice aplicado → `ROUND` → INSERT masivo.

**Paridad obligatoria** con `calcular_precios_caso()` actual (FOB con descuentos, índice `(dólar×factor)/100`, redondeo centena inferior).

---

## Contexto técnico (estado actual)

| Hoy | Problema |
|-----|----------|
| `ui.py` Paso 3 loop `for _, row in skus_grupo` | O(N) Python + `get_or_create_*` |
| `calcular_precios_caso` en `logic.py` | Correcto en negocio, lento en escala |
| `guardar_precio_lista` | Bulk INSERT OK por lote |
| Índices `precio_lista` | Solo `evento_id`, `referencia_id` — **falta triplete** |
| PP lookup | `evento_id + linea_id + material_id` — lento sin índice |

**No crear** tabla `precio_listado_detalle` en esta OT salvo que migres con nombre acordado y doc; preferir staging temp + INSERT en `precio_lista`.

---

## Fase A — Migración índices (obligatorio)

Archivo: `control_central/migrations/052_precio_lista_indice_triplete.sql`

```sql
-- Índice para lookup PP/FI y cálculo por evento
CREATE INDEX IF NOT EXISTS idx_precio_lista_evento_triplete
  ON public.precio_lista (evento_id, linea_id, referencia_id, material_id);

-- Opcional si queries filtran vigente:
CREATE INDEX IF NOT EXISTS idx_precio_lista_evento_vigente_triplete
  ON public.precio_lista (evento_id, linea_id, referencia_id, material_id)
  WHERE vigente = true;
```

Verificar en evidencia: `\d precio_lista` o query `pg_indexes`.

---

## Fase B — Staging + función SQL (núcleo)

1. **Tabla staging** (temporal por sesión o permanente `precio_lista_staging`):

   Columnas mínimas: `evento_id`, `linea_id`, `referencia_id`, `material_id`, `fob_fabrica`, `marca`, códigos texto denormalizados para auditoría.

2. **Carga staging** desde SKUs ya resueltos en sesión O desde query que reproduzca el Excel del evento (documentar fuente).

3. **SQL cálculo** (un `INSERT INTO precio_lista … SELECT`):

   - JOIN `precio_evento_caso` + mapa línea→caso vía `precio_evento_linea_excepcion` (y marcas si aplica).
   - `fob_ajustado` = FOB × (1-d1)×(1-d2)×(1-d3)×(1-d4) en SQL.
   - `indice` = `(dolar_politica * factor_conversion) / 100.0`
   - `lpn` = `FLOOR(fob_ajustado * indice / 100) * 100` (paridad `redondeo_centena_inferior`).
   - `lpc03` / `lpc04` = mismo criterio que Python si `genera_lpc03_lpc04`.

4. **Función** `calcular_precio_lista_evento_sql(p_evento_id bigint)` en migración o `migrations/` + llamada desde Python.

---

## Fase C — Integración Streamlit (mínima)

Archivo: `modules/rimec_engine/logic.py` + `ui.py` Paso 3.

- Botón **Iniciar cálculo** debe llamar primero SQL masivo si flag `USE_CALCULO_SQL = True` (constante módulo).
- Mantener fallback Python si SQL falla (log + mensaje UI).
- **No** eliminar `calcular_precios_caso` — usarlo para tests paridad.

---

## Fase D — Paridad (obligatorio)

Script o test: `scripts/verificar_paridad_calculo_sql.py`

- Tomar **≥ 20 SKUs** de un evento de prueba (o fixture).
- Comparar `lpn`, `lpc03`, `lpc04` Python vs SQL — diferencia 0.

Incluir en evidencia JSON tabla diff count = 0.

---

## Fase E — Evidencia + Git

1. `control_central/OT-MOTOR-SQL-520-001-EVIDENCIA.json`:
   - `duracion_ms` cálculo SQL vs Python (mismo N SKUs si posible)
   - `indexes_created`: true
   - `paridad_skus`: N, `diff_count`: 0

2. Completar **`Nexus_Core/ot/RESPUESTA_EJECUTOR.md`** (todas las secciones).

3. Git (solo `control_central`):

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
git add migrations/052_*.sql modules/rimec_engine/ scripts/ OT-MOTOR-SQL-520-001-EVIDENCIA.json
git commit -m "feat(motor): calculo precio_lista set-based SQL + indice triplete (OT-520)"
git push origin main
```

4. `COLA.md` → estado `LISTO_PARA_AUDITORIA`

---

## Pruebas manuales (Director)

| ID | Escenario | Esperado |
|----|-----------|----------|
| T1 | Evento ~50 SKUs, cálculo SQL | &lt; 2 min en Cloud |
| T2 | PP con evento vinculado, línea+material | Precio sugerido instantáneo |
| T3 | Paridad script | diff_count = 0 |

---

## Prohibido

- `TRUNCATE` pilares / biblioteca / `registro_ventas_general_v2`
- `linea.caso_id` para caso comercial nuevo
- Cambiar redondeo a `ROUND(...,-2)` sin OT separada y prueba paridad
- `%` markup en UI web
- Cerrar OT con `auditoria_auto: PASS` (solo Cursor)

---

## Preguntas

Si hay ambigüedad → **solo** `ot/RESPUESTA_EJECUTOR.md` §4. No bloquear por chat lateral.

**No pedir confirmación al Director.**
