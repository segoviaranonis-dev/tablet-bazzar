# ERROR: PEDIDOS DESINCRONIZADOS EN pedido_venta_rimec

**ID:** ERROR-2026-06-10-001  
**Fecha detección:** 2026-06-10  
**Módulo:** Aprobación de Pedidos (Streamlit)  
**Severidad:** MEDIA  
**Estado:** ✅ RESUELTO

---

## 🚨 DESCRIPCIÓN DEL ERROR

### **Síntoma:**
45 pedidos atascados en estado `PENDIENTE` cuando deberían estar en `CONFIRMADO`.

### **Impacto:**
- Pestaña "Pendientes" muestra solo 1 pedido (correcto)
- Pestaña "Confirmadas" muestra 145 FIs (correcto)
- PERO: 45 pedidos no aparecen en reportes de "Pedidos Confirmados"
- Métricas de gestión incorrectas

---

## 🔍 DIAGNÓSTICO

### **Hallazgo (por Cursor):**

**Tablas involucradas:**

1. **`pedido_venta_rimec`** (64 registros)
   ```sql
   estado      | cantidad
   ------------|----------
   PENDIENTE   | 46 (45 mal + 1 real)
   CONFIRMADO  | 16
   RECHAZADO   | 1
   EDITADO     | 1
   ```

2. **`factura_interna`** (148 registros)
   ```sql
   estado      | cantidad
   ------------|----------
   RESERVADA   | 1
   CONFIRMADA  | 145
   ANULADA     | 2
   ```

### **Desincronización detectada:**

```sql
-- 45 pedidos en PENDIENTE con TODAS sus FIs en CONFIRMADA
SELECT
    pvr.id,
    pvr.nro_pedido,
    pvr.estado AS estado_pedido,
    COUNT(fi.id) AS fis_totales,
    SUM(CASE WHEN fi.estado = 'CONFIRMADA' THEN 1 ELSE 0 END) AS fis_confirmadas
FROM pedido_venta_rimec pvr
JOIN factura_interna fi ON fi.pedido_id = pvr.id
WHERE pvr.estado = 'PENDIENTE'
GROUP BY pvr.id, pvr.nro_pedido, pvr.estado
HAVING
    COUNT(fi.id) = SUM(CASE WHEN fi.estado = 'CONFIRMADA' THEN 1 ELSE 0 END);

-- Resultado: 45 filas
```

---

## 🐛 CAUSA RAÍZ

### **Función que no se ejecutó:**

**Ubicación:** `modules/aprobacion_pedidos/logic.py:990-996`

```python
def _confirmar_pedido_web(pedido_id: int, conn) -> None:
    """Cambia el estado del pedido_venta_rimec de PENDIENTE → CONFIRMADO."""
    conn.execute(sqlt("""
        UPDATE public.pedido_venta_rimec
        SET estado = 'CONFIRMADO'
        WHERE id = :pedido_id AND estado = 'PENDIENTE'
    """), {"pedido_id": pedido_id})
```

### **Flujo esperado:**

1. Usuario confirma FI: `confirmar_fi(fi_id)` → RESERVADA → CONFIRMADA
2. Función verifica si TODAS las FIs del pedido están CONFIRMADAS
3. Si sí → llama `_confirmar_pedido_web(pedido_id, conn)`
4. Pedido cambia: PENDIENTE → CONFIRMADO

### **Hipótesis de fallo:**

**Opción A: FIs creadas ya confirmadas**
- Bypass del flujo RESERVADA → CONFIRMADA
- FIs creadas directamente en estado CONFIRMADA
- `_confirmar_pedido_web()` nunca se llamó

**Opción B: Fallo de transacción**
- Commit falló después de confirmar FI
- Pero antes de confirmar pedido
- Transacción parcial

**Opción C: FIs sin pedido_id**
- FIs creadas antes de migración 029
- No tenían FK formal a pedido_venta_rimec
- Verificación `_verificar_todas_fis_confirmadas()` falló

**Opción D: Condición de carrera**
- Múltiples FIs confirmadas en paralelo
- Verificación ejecutada antes de que se confirmaran todas

---

## 🔧 SOLUCIÓN APLICADA

### **Backfill SQL:**

```sql
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
  AND pvr.estado = 'PENDIENTE';
```

### **Scripts creados:**

1. `scripts/diagnostico_pedidos_desincronizados.sql` - Diagnóstico completo
2. `scripts/backfill_pedidos_confirmados.sql` - Corrección + verificación
3. `docs/OT_BACKFILL_PEDIDOS_DESINCRONIZADOS.md` - Documentación completa

---

## 📊 RESULTADO ESPERADO

**Antes:**
```
PENDIENTE:  46 pedidos
CONFIRMADO: 16 pedidos
```

**Después:**
```
PENDIENTE:  1 pedido (PVR-2026-834350 con FI 8-PV024 RESERVADA)
CONFIRMADO: 61 pedidos (16 + 45 corregidos)
```

---

## 🛡️ PREVENCIÓN

### **Refuerzo propuesto para `confirmar_fi()`:**

```python
def confirmar_fi(fi_id: int) -> tuple[bool, str]:
    """APROBAR: RESERVADA → CONFIRMADA."""
    fi_id = int(fi_id)
    
    try:
        pedido_id = _get_pedido_id_from_fi(fi_id)
        
        with engine.begin() as conn:
            # 1. Confirmar FI
            result = conn.execute(sqlt("""
                UPDATE public.factura_interna
                SET estado = 'CONFIRMADA'
                WHERE id = :id AND estado = 'RESERVADA'
            """), {"id": fi_id})
            
            if result.rowcount == 0:
                return False, "FI no encontrada o ya no está en estado RESERVADA."
            
            # 2. CRÍTICO: Verificar y confirmar pedido (misma transacción)
            if pedido_id:
                todas_confirmadas = _verificar_todas_fis_confirmadas(pedido_id)
                if todas_confirmadas:
                    _confirmar_pedido_web(pedido_id, conn)
                    # LOG EXPLÍCITO para auditoría
                    DBInspector.log(
                        f"[PEDIDO] {pedido_id} → CONFIRMADO (todas FIs confirmadas)",
                        "SUCCESS"
                    )
        
        # ... resto de la función
```

### **Cambios clave:**
1. ✅ Ejecutar `_confirmar_pedido_web()` dentro de la MISMA transacción
2. ✅ Log explícito cuando se confirma pedido
3. ✅ Verificación atómica (no puede fallar parcialmente)

---

## 📈 LECCIONES APRENDIDAS

### **1. Verificación post-migración insuficiente**
- Migración 029 agregó FK formal `factura_interna.pedido_id`
- No se verificó que pedidos antiguos se sincronizaran

### **2. Falta de logs en función crítica**
- `_confirmar_pedido_web()` no tenía log
- Imposible auditar si se ejecutó o no

### **3. Tests de integración faltantes**
- No había test que verificara:
  - Confirmar todas las FIs de un pedido
  - Verificar que pedido pasa a CONFIRMADO

---

## 🔗 ARCHIVOS RELACIONADOS

**Documentación:**
- `.claude/5_errores/ERROR_PEDIDOS_DESINCRONIZADOS.md` (este archivo)
- `control_central/docs/OT_BACKFILL_PEDIDOS_DESINCRONIZADOS.md`

**Scripts:**
- `control_central/scripts/diagnostico_pedidos_desincronizados.sql`
- `control_central/scripts/backfill_pedidos_confirmados.sql`

**Código:**
- `control_central/modules/aprobacion_pedidos/logic.py:990-996` (_confirmar_pedido_web)
- `control_central/modules/aprobacion_pedidos/logic.py:1035-1090` (confirmar_fi)

---

## ✅ ESTADO

**Detección:** 2026-06-10 (Cursor)  
**Análisis:** 2026-06-10 (Claude Code)  
**Corrección:** ✅ COMPLETADA (2026-06-10 - Cursor)  
**Verificación:** ✅ OK (0 pedidos desincronizados)  
**Prevención:** PROPUESTA (refuerzo de confirmar_fi)

---

## 📊 RESULTADO DE CORRECCIÓN

**Ejecución:** 2026-06-10  
**Ejecutor:** Cursor  

### **Métricas:**
- **Pedidos corregidos:** 45
- **Tokens utilizados:** ~12k
- **Estado final:** OK

### **Antes del backfill:**
```
PENDIENTE:  46 pedidos (45 desincronizados + 1 real)
CONFIRMADO: 16 pedidos
```

### **Después del backfill:**
```
PENDIENTE:  1 pedido (solo PVR-2026-834350 con FI RESERVADA)
CONFIRMADO: 61 pedidos (16 originales + 45 corregidos)
```

### **Verificación:**
- ✅ Pedidos desincronizados restantes: **0**
- ✅ Estados consistentes entre `pedido_venta_rimec` y `factura_interna`
- ✅ Métricas de gestión ahora correctas

---

**Responsable detección:** Cursor  
**Responsable documentación:** Claude Code  
**Responsable corrección:** Cursor  
**Aprobación:** Director  
**Estado:** ✅ RESUELTO
