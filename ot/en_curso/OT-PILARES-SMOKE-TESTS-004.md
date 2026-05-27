# OT-PILARES-SMOKE-TESTS-004 — Smoke tests post motor de pilares

**Prioridad:** ALTA (validación en vivo)  
**Director:** Héctor Segovia  
**Ejecutor:** **Claude Code**  
**Repo:** `C:\Users\hecto\Nexus_Core\control_central` (+ `report/` lectura)  
**Prerequisito:** `OT-PILARES-LEYES-IMPORTACION-001` ✅ cerrada (commits `9eb2e05`, `00f50bb`, `ca8ae36`)  
**Regla:** `.cursor/rules/politicas-importacion-pilares.mdc`  
**Estado:** ✅ CERRADA — PASS (2026-05-20) · **Commit:** `62def01` · **Script:** `scripts/smoke_test_pilares.py`

---

## Objetivo

Confirmar en **entorno real** (Supabase + Nexus Streamlit) que el motor `core/pilares/` y los refactors de las tres fuentes se comportan según las leyes. No es desarrollo nuevo: es **prueba operativa + evidencia**.

**Duración estimada:** 30–45 min.

---

## Conexión DB

Usar siempre:

```bash
cd C:\Users\hecto\Nexus_Core\control_central
python scripts/run_migration_063.py   # solo si FKs dimensionales no están
```

Patrón de conexión: `scripts/backfill_combinacion_desde_ppd.py::_db_url()`  
(o el mismo entorno donde corrió el reset focal).

---

## Test 1 — Retail (`st+vt+RC`)

### Acción

1. Abrir Nexus → módulo **Retail** / Balance tiendas.
2. Importar `VTA SM.xlsx` (o el archivo vigente del Director), hoja **`st+vt+RC`**.
3. Confirmar política **REPLACE ALL** (tabla queda solo con este lote).

### Verificar en SQL

```sql
-- Conteos y gradas (no debe haber solo "(sin grada)")
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE grada = '(sin grada)') AS sin_grada,
  COUNT(*) FILTER (WHERE grada ~ '34.*\(.*\).*39') AS curva_canonica,
  COUNT(*) FILTER (WHERE grada ~ '^[0-9]+$') AS talla_simple
FROM public.registro_st_vt_rc_reposicion;

-- FKs dimensionales
SELECT
  COUNT(*) FILTER (WHERE linea_id IS NULL) AS sin_linea,
  COUNT(*) FILTER (WHERE referencia_id IS NULL) AS sin_ref,
  COUNT(*) FILTER (WHERE marca_id IS NULL) AS sin_marca
FROM public.registro_st_vt_rc_reposicion;
```

### Criterio PASS

- `sin_grada` = **0** (o casi 0; documentar excepciones).
- `curva_canonica` + `talla_simple` > 0.
- FKs: `sin_linea` / `sin_ref` / `sin_marca` = **0** (o justificar filas huérfanas).

### Report (opcional)

```bash
cd C:\Users\hecto\Nexus_Core\report
npm run build
# Abrir /retail y confirmar que carga sin error 500
```

---

## Test 2 — Proforma (regla no inversa §6)

### Preparación

Elegir un `codigo_proveedor` de **material** que exista en BD:

```sql
SELECT id, codigo_proveedor, descripcion
FROM public.material
WHERE descripcion IS NULL OR btrim(descripcion) = ''
LIMIT 5;
```

Anotar un `codigo_proveedor` de prueba (ej. uno creado por Retail en ciego).

### Caso A — Enriquecimiento (debe PASS)

1. Importar proforma que traiga ese material **con descripción** en texto.
2. Verificar:

```sql
SELECT codigo_proveedor, descripcion
FROM public.material
WHERE codigo_proveedor = :codigo;
-- descripcion debe tener texto NO vacío
```

### Caso B — No inversa (debe PASS)

1. Elegir material **con** descripción ya cargada.
2. Simular/importar fila con **descripción vacía** o ausente para ese código.
3. Verificar que `descripcion` en BD **no cambió** a NULL ni `''`.

### Criterio PASS

- Caso A: UPDATE descripción OK.
- Caso B: descripción anterior **intacta**.

---

## Test 3 — Listado de precios (herencia jerárquica)

### Preparación

Tras reset focal, listados están vacíos. Usar un Excel/listado de prueba con al menos una **línea nueva** (codigo que no exista en `linea`).

### Acción

1. Importar listado de precios en Nexus (módulo correspondiente).
2. Verificar alta de línea con dimensiones:

```sql
SELECT l.id, l.codigo_proveedor, l.marca_id, l.genero_id, l.grupo_estilo_id
FROM public.linea l
WHERE l.codigo_proveedor = :codigo_linea_nueva;
-- marca_id, genero_id, grupo_estilo_id NO deben ser NULL
```

### Criterio PASS

- Línea nueva insertada.
- Herencia aplicada (FKs de género/marca/estilo/tipo_1 pobladas, aunque sea vía sentinelas OTROS).

---

## Test 4 — Sales Report blindado (regresión)

```sql
SELECT COUNT(*) FROM public.registro_ventas_general_v2;
```

Anotar conteo **antes** y **después** de los 3 tests. Debe ser **idéntico**.

---

## Test 5 — Unit tests (rápido)

```bash
cd C:\Users\hecto\Nexus_Core\control_central
python -m pytest tests/test_pilares.py -v --tb=short
```

Criterio: **30 passed**, sin fallos.

---

## Evidencia obligatoria

Completar: `ot/PILARES-SMOKE-TESTS-004-EVIDENCIA.md`

Incluir:

| Campo | Contenido |
|-------|-----------|
| Fecha / ejecutor | Claude Code |
| Test 1 Retail | SQL output + screenshot Nexus import OK |
| Test 2 Proforma | codigo probado + SQL antes/después A y B |
| Test 3 Listado | codigo línea nueva + SQL herencia |
| Test 4 Sales | COUNT antes = después |
| Test 5 pytest | salida terminal (30 passed) |
| Veredicto | PASS / PASS_COND / FAIL + bloqueadores |

---

## Veredictos

| Resultado | Significado |
|-----------|-------------|
| **PASS** | Los 5 tests OK |
| **PASS_COND** | Retail + pytest OK; Proforma o Listado no probables por falta de archivo de prueba (documentar) |
| **FAIL** | Cualquier regla §6 violada, gradas en `(sin grada)`, o Sales Report tocado |

---

## Fuera de alcance

- Nuevas features en `core/pilares/`.
- DROP `retail_multitienda_staging`.
- Cambiar estrategia B de gradas.

---

## Copiar a Claude

```
Ejecutá OT-PILARES-SMOKE-TESTS-004 en C:\Users\hecto\Nexus_Core\control_central.

Smoke tests post motor de pilares (Retail + Proforma + Listado + Sales blindado + pytest).
Leé ot/en_curso/OT-PILARES-SMOKE-TESTS-004.md y completá ot/PILARES-SMOKE-TESTS-004-EVIDENCIA.md

Conexión DB: _db_url() de scripts/backfill_combinacion_desde_ppd.py
No tocar Sales Report. Reportar PASS / PASS_COND / FAIL con SQL y capturas.
```
