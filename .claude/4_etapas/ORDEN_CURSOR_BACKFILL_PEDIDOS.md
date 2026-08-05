# CURSOR: BACKFILL PEDIDOS DESINCRONIZADOS

## PROBLEMA

45 pedidos están atascados en estado `PENDIENTE` cuando deberían estar en `CONFIRMADO`.

**Tabla:** `pedido_venta_rimec`  
**Causa:** La función `_confirmar_pedido_web()` nunca se ejecutó

## DIAGNÓSTICO

**Ubicación:** `C:\Users\hecto\Nexus_Core\control_central\`

### Paso 1: Ejecutar diagnóstico

```bash
# Conectar a BD y ejecutar
psql $DATABASE_URL -f scripts/diagnostico_pedidos_desincronizados.sql
```

O desde Python:

```python
from core.database import get_dataframe

# Query 1: Ver pedidos desincronizados
sql = """
SELECT
    pvr.id AS pedido_id,
    pvr.nro_pedido,
    pvr.estado AS estado_pedido,
    COUNT(fi.id) AS total_fis,
    SUM(CASE WHEN fi.estado = 'CONFIRMADA' THEN 1 ELSE 0 END) AS fis_confirmadas
FROM pedido_venta_rimec pvr
LEFT JOIN factura_interna fi ON fi.pedido_id = pvr.id
WHERE pvr.estado = 'PENDIENTE'
  AND EXISTS (SELECT 1 FROM factura_interna WHERE pedido_id = pvr.id)
GROUP BY pvr.id, pvr.nro_pedido, pvr.estado
HAVING
    COUNT(fi.id) > 0
    AND SUM(CASE WHEN fi.estado = 'CONFIRMADA' THEN 1 ELSE 0 END) = COUNT(fi.id)
ORDER BY pvr.id;
"""

df = get_dataframe(sql)
print(f"Pedidos desincronizados: {len(df)}")
print(df.to_string())
```

**Debe mostrar ~45 pedidos**

## CORRECCIÓN

### Paso 2: Ejecutar backfill

```python
from core.database import engine
from sqlalchemy import text as sqlt

# BACKFILL: Cambiar PENDIENTE → CONFIRMADO
with engine.begin() as conn:
    result = conn.execute(sqlt("""
        WITH pedidos_a_confirmar AS (
            SELECT pvr.id AS pedido_id
            FROM pedido_venta_rimec pvr
            INNER JOIN factura_interna fi ON fi.pedido_id = pvr.id
            WHERE pvr.estado = 'PENDIENTE'
            GROUP BY pvr.id
            HAVING
                COUNT(fi.id) > 0
                AND SUM(CASE WHEN fi.estado = 'CONFIRMADA' THEN 1 ELSE 0 END) = COUNT(fi.id)
        )
        UPDATE pedido_venta_rimec pvr
        SET estado = 'CONFIRMADO'
        FROM pedidos_a_confirmar pac
        WHERE pvr.id = pac.pedido_id
          AND pvr.estado = 'PENDIENTE'
        RETURNING pvr.id, pvr.nro_pedido, pvr.estado
    """))
    
    rows = result.fetchall()
    print(f"Pedidos actualizados: {len(rows)}")
    for row in rows:
        print(f"  {row.nro_pedido} → {row.estado}")
```

**Debe actualizar ~45 pedidos**

### Paso 3: Verificar resultado

```python
# Contar pedidos por estado
df_estados = get_dataframe("""
    SELECT estado, COUNT(*) as cantidad
    FROM pedido_venta_rimec
    GROUP BY estado
    ORDER BY estado
""")

print("Estados después del backfill:")
print(df_estados.to_string())
```

**Debe mostrar:**
```
CONFIRMADO: 61 (16 + 45)
PENDIENTE: 1 (solo el real con FI RESERVADA)
```

## VERIFICACIÓN FINAL

Ejecutar:

```python
# Verificar que NO quedan pedidos desincronizados
df_check = get_dataframe("""
    SELECT
        pvr.id,
        pvr.nro_pedido,
        pvr.estado,
        COUNT(fi.id) AS total_fis,
        STRING_AGG(DISTINCT fi.estado, ', ') AS estados_fis
    FROM pedido_venta_rimec pvr
    LEFT JOIN factura_interna fi ON fi.pedido_id = pvr.id
    WHERE pvr.estado = 'PENDIENTE'
      AND EXISTS (SELECT 1 FROM factura_interna WHERE pedido_id = pvr.id AND estado = 'CONFIRMADA')
    GROUP BY pvr.id, pvr.nro_pedido, pvr.estado
    HAVING
        COUNT(fi.id) > 0
        AND SUM(CASE WHEN fi.estado = 'CONFIRMADA' THEN 1 ELSE 0 END) = COUNT(fi.id)
""")

if len(df_check) == 0:
    print("✅ OK: No hay pedidos desincronizados")
else:
    print(f"❌ ERROR: Aún hay {len(df_check)} pedidos desincronizados")
    print(df_check.to_string())
```

## REPORTAR

Cuando termines, reportá:

```
BACKFILL EJECUTADO

Diagnóstico:
- Pedidos desincronizados encontrados: [cantidad]

Corrección:
- Pedidos actualizados PENDIENTE → CONFIRMADO: [cantidad]

Verificación:
- Estado CONFIRMADO: [cantidad total]
- Estado PENDIENTE: [cantidad]
- Pedidos desincronizados restantes: [0 si OK]

Build: N/A
Tokens: [estimado]
Estado: [OK/ERROR]
```

NO menciones nada más.
