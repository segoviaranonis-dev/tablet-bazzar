# Diagnóstico — Motor SQL retorna 0 filas pero debería retornar 91

**Fecha:** 2026-05-18  
**Contexto:** Paso 3 completado pero función SQL reporta 0 inserciones

---

## Hallazgo crítico

**Motor SQL se ejecuta pero retorna 0 filas insertadas:**

```
[SUCCESS] [ENGINE-SQL] Staging cargado: 86 SKUs
[ENGINE] Completado caso 'BR-VZ-MD-ML-MKA-O' (86 SKUs, 86 guardados).
[ENGINE] Iniciando cálculo de caso: 'PROMOCIONAL' (5 SKUs)
[SUCCESS] [ENGINE-SQL] Staging cargado: 5 SKUs
[ENGINE] Completado caso 'PROMOCIONAL' (5 SKUs, 5 guardados).
[SUCCESS] [ENGINE-SQL] Cálculo masivo completado: 0 filas en 10ms  ← PROBLEMA
[SUCCESS] Commit OK | Afectadas: 91 | ⏱️ 156.08ms            ← DELETE staging
[SUCCESS] [ENGINE-SQL] Staging limpiado para evento 9
```

**Flujo real:**
1. `cargar_staging_precio_lista` → 91 SKUs insertados en `precio_lista_staging`
2. `calcular_precio_lista_evento_sql(9)` → retorna `{total: 0, duracion_ms: 10, error: None}`
3. `limpiar_staging_precio_lista(9)` → DELETE 91 filas de staging (por eso commit dice "91")

**Consecuencia:** No se insertaron precios en `precio_lista`. Motor SQL activo pero NO funcional.

---

## Causa raíz — 3 hipótesis

### H1: INNER JOIN falla (caso_id no existe en precio_evento_caso)

```sql
-- En función 053b, línea 43-44:
FROM precio_lista_staging s
INNER JOIN precio_evento_caso c ON s.caso_id = c.id
WHERE s.evento_id = p_evento_id
```

Si `caso_id` en staging **no existe** en tabla `precio_evento_caso`, el CTE queda vacío.

**Verificación:**
```sql
-- En Supabase SQL Editor:
SELECT DISTINCT s.caso_id, s.evento_id, c.id as caso_existe
FROM precio_lista_staging s
LEFT JOIN precio_evento_caso c ON s.caso_id = c.id
ORDER BY s.evento_id DESC
LIMIT 10;
```

Buscar `caso_existe = NULL`.

---

### H2: WHERE evento_id no encuentra filas (tipo de dato / NULL)

Si `evento_id` en staging es NULL o tiene tipo incompatible:

```sql
-- Verificar staging actual (debería estar vacío ya):
SELECT evento_id, caso_id, COUNT(*) as qty
FROM precio_lista_staging
GROUP BY evento_id, caso_id;

-- Si hay filas, verificar tipos:
SELECT pg_typeof(evento_id), pg_typeof(caso_id)
FROM precio_lista_staging
LIMIT 1;
```

---

### H3: Error silencioso capturado en EXCEPTION

La función tiene bloque `EXCEPTION WHEN OTHERS` que retorna 0 en caso de error (línea 166-172 de 053b).

Si hubo error SQL, debería estar en `resultado_sql.get("error")` pero ui.py no lo muestra porque `error` es `NULL`.

**Problema:** `EXCEPTION` retorna `NULL::text` como error, NO el mensaje `SQLERRM`.

Revisando código 053b línea 171:
```sql
RETURN QUERY SELECT
    0::bigint,
    EXTRACT(MILLISECONDS FROM (v_end_time - v_start_time)),
    SQLERRM;  -- ← ESTO debería capturar el error
```

Pero si no hay error de excepción sino que el CTE está vacío, retorna path normal con 0 filas.

---

## Diagnóstico rápido — 3 pasos

### Paso A: Verificar staging tiene datos ANTES del cálculo

Modificar temporalmente `calcular_precio_lista_sql` en logic.py:

```python
def calcular_precio_lista_sql(evento_id: int) -> dict:
    """Ejecuta cálculo masivo SQL para evento_id."""
    try:
        with engine.begin() as conn:
            # DEBUG: contar staging antes de calcular
            check = conn.execute(
                text("SELECT COUNT(*) FROM precio_lista_staging WHERE evento_id = :eid"),
                {"eid": evento_id}
            ).scalar()
            DBInspector.log(f"[DEBUG-SQL] Staging tiene {check} filas antes de calcular", "INFO")
            
            result = conn.execute(
                text("SELECT * FROM calcular_precio_lista_evento_sql(:eid)"),
                {"eid": evento_id}
            )
            ...
```

**Esperado:** `[DEBUG-SQL] Staging tiene 91 filas antes de calcular`

---

### Paso B: Verificar FK caso_id existe

```python
# Antes de calcular, verificar INNER JOIN:
check_fk = conn.execute(text("""
    SELECT COUNT(*) as sin_caso
    FROM precio_lista_staging s
    LEFT JOIN precio_evento_caso c ON s.caso_id = c.id
    WHERE s.evento_id = :eid AND c.id IS NULL
"""), {"eid": evento_id}).scalar()

if check_fk > 0:
    DBInspector.log(f"[ERROR-SQL] {check_fk} filas en staging con caso_id inválido", "ERROR")
```

**Esperado:** 0 filas sin caso

---

### Paso C: Probar función SQL directamente en Supabase

```sql
-- En Supabase SQL Editor (usar evento_id real del terminal):
-- Primero cargar datos de prueba en staging:
INSERT INTO precio_lista_staging (evento_id, caso_id, marca, linea_id, referencia_id, material_id, fob_fabrica)
VALUES (999, 1, 'TEST', 1, 1, 1, 100.0);

-- Ejecutar función:
SELECT * FROM calcular_precio_lista_evento_sql(999);

-- Debería retornar: (total, duracion_ms, error)
-- Esperado: (1, <tiempo>, null)
```

Si retorna `(0, ...)` → Problema en la función SQL (revisar INNER JOIN).

---

## Recomendaciones

### Opción A — Debug local (Claude Code)

1. Aplicar modificación Paso A + B en logic.py
2. Relanzar Streamlit
3. Ejecutar Paso 3 con un caso pequeño
4. Capturar logs `[DEBUG-SQL]`
5. Reportar hallazgos al Director

### Opción B — Verificación Supabase (Cursor)

1. Ejecutar Paso C en SQL Editor
2. Si retorna 0, revisar estructura `precio_evento_caso` y `precio_lista_staging`
3. Verificar migración 053b está aplicada correctamente

---

## Pregunta para Director

**¿Prefieres que Claude Code aplique debug local (Opción A) o que Cursor verifique en Supabase (Opción B)?**

Debug local es más rápido pero requiere re-ejecutar Paso 3.  
Verificación Supabase es más precisa pero requiere acceso a SQL Editor.

---

*Claude Code — Diagnóstico motor SQL 0 filas — 2026-05-18*
