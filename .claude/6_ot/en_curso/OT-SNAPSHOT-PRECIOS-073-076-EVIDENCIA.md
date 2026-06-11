# OT-SNAPSHOT-PRECIOS — MIG-073 a MIG-076 (Evidencia de despliegue)

**Fecha:** 2026-05-22  
**Contrato:** Snapshot determinista en `pedido_proveedor_detalle`; vista plana sin `precio_lista`.

---

## Migraciones entregadas

| MIG | Archivo | Función |
|-----|---------|---------|
| 073 | `control_central/migrations/073_snapshot_precio_ppd_columnas.sql` | Columnas `precio_lpn`, `precio_lpc02..04`, `precio_dolar_origen`, `biblioteca_id`, `listado_precio_id`, auditoría |
| 074 | `control_central/migrations/074_fn_vincular_listado_a_pp.sql` | `vincular_listado_a_pp()` + `fn_resolver_evento_precio_ppd()` |
| 075 | `control_central/migrations/075_backfill_snapshot_precio_ppd.sql` | Backfill PPs ABIERTO/ENVIADO con saldo |
| 076 | `control_central/migrations/076_v_stock_rimec_snapshot_ppd.sql` | `v_stock_rimec` lee solo PPD |

---

## Reglas de negocio implementadas

- **Re-vincular (A):** Solo si `pp.estado = 'ABIERTO'` y ninguna línea con `pares_vendidos > 0`.
- **Staging (C):** Backfill y `vincular` leen `precio_lista` una vez; la vista **no** la consulta.
- **Web (E):** `lpn` = `ppd.precio_lpn`; `lpc02..04` persistidos, no expuestos en catálogo.

---

## Aplicar en Supabase (orden obligatorio)

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
python scripts\aplicar_mig_073_076.py
```

O pegar cada `.sql` en SQL Editor en orden 073 → 076.

---

## Verificación post-apply

```sql
-- 1) Cobertura catálogo
SELECT COUNT(*) AS total,
       COUNT(*) FILTER (WHERE lpn IS NOT NULL) AS con_lpn
FROM public.v_stock_rimec;

-- 2) Snapshot PPD
SELECT COUNT(*) AS total_saldo,
       COUNT(*) FILTER (WHERE ppd.precio_lpn IS NOT NULL) AS con_precio
FROM public.pedido_proveedor_detalle ppd
JOIN public.pedido_proveedor pp ON pp.id = ppd.pedido_proveedor_id
WHERE pp.estado IN ('ABIERTO','ENVIADO')
  AND GREATEST(0, COALESCE(ppd.cantidad_pares,0) - COALESCE(ppd.pares_vendidos,0)) > 0;

-- 3) Muestra SKU Director (PP1 det 60)
SELECT det_id, pp_id, linea_codigo, referencia_codigo, material_code,
       lpn, caso_id, descp_caso, listado_precio_id, precio_dolar_origen
FROM public.v_stock_rimec
WHERE det_id IN (60, 61, 441);
```

**Criterio de éxito:** `con_lpn` en vista ≈ `con_precio` en PPD y > 0. Si ambos = 0 → el match staging→PPD falló (OT-009); Alfredo debe regenerar listado y pulsar **Vincular al PP**.

---

## Streamlit

El botón **Vincular al PP** ahora, tras `guardar_configuracion_pp`, invoca `vincular_listado_a_pp()` y congela precios en PPD.

---

## Resultado de apply

**Estado:** ✅ COMPLETADO CON OBSERVACIONES

### Métricas Post-Apply

| Métrica | Valor | Estado |
|---------|-------|--------|
| SKUs vista con lpn | **879/953 (92%)** | ✅ PASS |
| PPD con precio_lpn | **879/953 (92%)** | ✅ PASS |
| precio_lista rows (eventos activos) | 474 | ✅ OK |
| det 60 lpn | 145,300 (ACT-BRSPORT) | ✅ PASS |
| det 61 lpn | 145,300 (ACT-BRSPORT) | ✅ PASS |
| det 441 lpn | 136,400 (ACT-BRSPORT) | ✅ PASS |

✅ **Vista y PPD alineados** (879 = 879)  
✅ **Los 3 SKUs de OT-009 recuperados con precio**

---

## Fix Crítico MIG-075

**Error inicial:**
```
ForeignKeyViolation: Key (biblioteca_id)=(7) is not present in table "caso_precio_biblioteca"
```

**Causa:** `precio_lista.caso_id` apunta a `precio_evento_caso`, NO a `caso_precio_biblioteca`. Los IDs no coinciden:
- `precio_lista.caso_id`: 6, 7, 8, 14, 15, 21, 27, 28, 29, 40, 46, 52, 53, 59
- `caso_precio_biblioteca.id`: 1, 2, 3, 4, 5

**Solución aplicada:** Resolver `biblioteca_id` por nombre (igual que MIG-072 RPC):
```sql
(SELECT cpb.id FROM public.caso_precio_biblioteca cpb 
 WHERE cpb.nombre_caso = pl.nombre_caso_aplicado LIMIT 1) AS caso_bib_id
```

---

## 74 SKUs Sin Precio (8%) — Data Quality Issue

**Todos pertenecen a PP 6 (PP-2026-0006)**

### Estado PP 6
- Estado: ABIERTO
- Proveedor: 654
- Evento vinculado: 6
- Filas precio_lista evento 6: **96** ← precio_lista SÍ tiene data

### Diagnóstico Causa Raíz

**Ejemplo SKU huérfano (det_id=468):**
```
Códigos PP:
  linea:    1456
  ref:      101  
  material: 29918

Match en catálogo:
  linea.id:       138  ✅
  referencia.id:  14   ✅ PERO linea_id=10 (NO 138!) ❌
  material.id:    2    ✅
```

**Problema:** Código de referencia "101" existe en tabla `referencia`, pero está asociado a `linea_id=10`, NO a la línea resuelta del PP (linea_id=138).

**Conclusión:** PP 6 fue cargado con **combinaciones inválidas** de códigos (referencia bajo línea incorrecta). No es bug del sistema → es **data quality / integridad del catálogo**.

---

## Recomendación al Director

### Acción Inmediata
1. **Catálogo listo para producción** con 879 SKUs (92% cobertura)
2. Habilitar rimec-web para pruebas → catálogo debe mostrar precios desde `v_stock_rimec`
3. Smoke test: BZZP → 1 SKU con LPN → Validar → Confirmar

### Acción Diferida (PP 6)
4. Revisar PP-2026-0006 con Alfredo:
   - ¿Los códigos de línea/ref/material del Excel de importación son correctos?
   - Si son correctos → actualizar catálogo (linea/referencia/material) para que coincidan
   - Si son incorrectos → re-importar PP 6 con códigos corregidos
5. Re-ejecutar backfill después de corrección:
   ```sql
   UPDATE pedido_proveedor_detalle 
   SET precio_lpn = NULL, biblioteca_id = NULL, listado_precio_id = NULL
   WHERE pedido_proveedor_id = 6;
   -- Re-aplicar MIG-075
   ```

### Siguiente Bloque (Post-Verificación Catálogo)
- Implementar `carrito_activo` (sesión persistente Supabase)
- Activar validación obligatoria en confirmar_pedido_web
- Decisiones F/H firmadas → aplicar

---

## Archivos Modificados en Apply

### Migraciones
- [073_snapshot_precio_ppd_columnas.sql](../../control_central/migrations/073_snapshot_precio_ppd_columnas.sql) — ✅ OK
- [074_fn_vincular_listado_a_pp.sql](../../control_central/migrations/074_fn_vincular_listado_a_pp.sql) — ✅ OK
- [075_backfill_snapshot_precio_ppd.sql](../../control_central/migrations/075_backfill_snapshot_precio_ppd.sql) — ✅ OK (FIX FK caso_id por nombre)
- [076_v_stock_rimec_snapshot_ppd.sql](../../control_central/migrations/076_v_stock_rimec_snapshot_ppd.sql) — ✅ OK

### Scripts
- [scripts/aplicar_mig_073_076.py](../../control_central/scripts/aplicar_mig_073_076.py) — ✅ OK (FIX Unicode encoding)

---

**OT-009 OBSOLETA**: diagnóstico de 7 vínculos no necesario → arquitectura snapshot elimina dependencia de JOINs dinámicos.
