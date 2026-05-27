# Diagnóstico — Migración 043 parcial incompatible con ON CONFLICT

**Fecha:** 2026-05-18  
**Contexto:** Error `f405` en bulk caso 33/evento 7

---

## Hallazgo crítico

**Migración 043 SÍ está aplicada en Supabase**, pero el índice es **parcial**:

```sql
CREATE UNIQUE INDEX idx_pele_evento_linea_unica 
  ON precio_evento_linea_excepcion (evento_id, linea_id) 
  WHERE evento_id IS NOT NULL
```

**PostgreSQL no permite `ON CONFLICT` con índices parciales** (con `WHERE` clause).

El `ON CONFLICT (evento_id, linea_id)` falla con `f405` porque:
- Necesita un UNIQUE CONSTRAINT completo (sin WHERE)
- O necesita que todas las filas cumplan la condición del WHERE

---

## Fix de Cursor — DELETE + INSERT (correcto para índice parcial)

**Estrategia:**
1. DELETE líneas de otros casos en mismo evento
2. INSERT con NOT EXISTS para evitar duplicados
3. Todo en una transacción

**Código aplicado:**
```sql
-- Paso 1: Limpiar asignaciones previas
DELETE FROM precio_evento_linea_excepcion pele
USING linea l
WHERE pele.evento_id = :eid
  AND pele.linea_id = l.id
  AND l.proveedor_id = :pid
  AND l.codigo_proveedor = ANY(:codes)
  AND pele.caso_id <> :cid

-- Paso 2: Insertar nuevas asignaciones
INSERT INTO precio_evento_linea_excepcion (caso_id, linea_id, evento_id)
SELECT DISTINCT ON (l.id) :cid, l.id, :eid
FROM linea l
WHERE l.proveedor_id = :pid
  AND l.codigo_proveedor = ANY(:codes)
  AND NOT EXISTS (
      SELECT 1 FROM precio_evento_linea_excepcion x
      WHERE x.caso_id = :cid AND x.linea_id = l.id
  )
```

**Ventaja vs ON CONFLICT:**
- Funciona con índice parcial actual
- No requiere migración 043b
- Reasigna líneas explícitamente

---

## Problema rendimiento — Paso 3 lento

**Síntoma reportado:** "Paso 3 sigue tardando mucho"

**Posibles causas:**

| # | Causa | Evidencia | Solución |
|---|-------|-----------|----------|
| 1 | DELETE + INSERT más lento que ON CONFLICT | DELETE hace full scan si no hay índice en (evento_id, caso_id, linea_id) | Migración 043b: índice adicional |
| 2 | Motor SQL no activo (migraciones 052-054) | `USE_CALCULO_SQL=True` pero funciones pueden fallar silenciosamente | Verificar logs Paso 3, confirmar uso SQL |
| 3 | N+1 en prefetch_materiales o build_pillar_cache | Muchos `Commit OK ~153ms` en terminal | Ya debería estar resuelto con resolver_pilares_sql |
| 4 | Spam commits por fallback loop | Cursor eliminó loop en bulk (return 0 on error) | Verificar que no hay fallback activo |

---

## Recomendaciones Director

### Opción A — Mantener fix Cursor + optimizar (corto plazo)

**Pros:** Sin migración nueva, funciona ahora  
**Cons:** DELETE puede ser lento con muchas líneas

**Optimización:**
```sql
-- Añadir índice para acelerar DELETE
CREATE INDEX idx_pele_evento_caso_linea 
  ON precio_evento_linea_excepcion (evento_id, caso_id, linea_id);
```

### Opción B — Migración 043b con UNIQUE completo (mediano plazo)

**Cambio:**
```sql
-- Reemplazar índice parcial por constraint completo
DROP INDEX idx_pele_evento_linea_unica;

ALTER TABLE precio_evento_linea_excepcion
  ADD CONSTRAINT uq_pele_evento_linea 
  UNIQUE (evento_id, linea_id);
```

**Pros:** ON CONFLICT funciona, más rápido que DELETE + INSERT  
**Cons:** Requiere migración, posible conflicto con filas `evento_id IS NULL`

---

## Tareas pendientes (para Claude)

### T1: Verificar motor SQL activo
```bash
# Lanzar Streamlit y revisar logs Paso 3
# Buscar: "Fase 4/5: Ejecución cálculo masivo en servidor"
# Confirmar: función calcular_precio_lista_evento_sql se ejecuta
```

### T2: Medir tiempo real Paso 3
- Caso 34 / evento 7 (bulk grande)
- Observar terminal: ¿cuántos commits? ¿duración total?
- Comparar vs tiempo esperado con motor SQL (<10s para 91 SKUs)

### T3: Revisar ui.py indentación (Cursor reportó fix)
- Línea ~1399: `if calc_ok` dentro de `with proceso_largo`
- Confirmar que celebración/rerun funcionan

### T4: Documento RESPUESTA_EJECUTOR
- Actualizar con hallazgo índice parcial
- T1-T6 con resultados reales
- Recomendaciones (Opción A vs B)

---

## Pregunta para Cursor

**¿Por qué 043 usó índice parcial en vez de UNIQUE constraint?**

Posible razón: compatibilidad con filas legacy `evento_id IS NULL` (pre-043).

Si ya no hay filas con `evento_id IS NULL`, podemos migrar a UNIQUE completo.

---

*Claude Code — Diagnóstico índice parcial — 2026-05-18*
