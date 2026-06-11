# Mapa de datos — Aprobación de Pedidos y numeración PV

**Módulo:** `2.1_control_central` / `aprobacion_pedidos`  
**Auditoría base:** 2026-06-10  
**Shibboleth V2:** Un gato tiene 5 patas ✅

---

## Universo PV (snapshot post-corrección)

| Métrica | Valor | Fuente |
|---------|-------|--------|
| `MAX(pv_global)` | **147** | `factura_interna` |
| FIs CONFIRMADA | **145** | Tab UI Confirmadas |
| FIs ANULADA numeradas | **2** | PV000056, PV000057 |
| FIs RESERVADA (sin PV) | **1** | `8-PV024` → pedido `PVR-2026-834350` |
| Pedidos `pedido_venta_rimec` | **64** | Cabeceras web |
| Huecos secuencia 1…147 | **0** | MIG-107 |

**Regla:** el número visible **PV000147** es `pv_global`, no el correlativo del tab Confirmadas.

---

## Diagrama entidad-relación (simplificado)

```
rimec-web (carrito)
       │
       ▼ confirmar_pedido_web (RPC)
pedido_venta_rimec ─────┬──── factura_interna (célula)
  PVR-2026-…           │      nro_factura legacy (8-PV0xx)
  estado pedido        │      pv_global → PV000xxx
                       │      estado FI
                       └──── factura_interna_detalle
                              linea_snapshot (5 pilares)
```

---

## Query — replicar tab Pendientes

```sql
SELECT pvr.id, pvr.nro_pedido, pvr.estado, pvr.total_monto
FROM pedido_venta_rimec pvr
WHERE pvr.estado = 'PENDIENTE'
  AND EXISTS (
    SELECT 1 FROM factura_interna fi
    WHERE fi.pedido_id = pvr.id AND fi.estado = 'RESERVADA'
  );
```

---

## Query — replicar tab Confirmadas

```sql
SELECT fi.id, fi.pv_global, fi.nro_factura, fi.total_monto, fi.marca, fi.caso
FROM factura_interna fi
WHERE fi.estado = 'CONFIRMADA'
ORDER BY fi.pv_global DESC
LIMIT 200;
```

---

## Query — integridad cabecera = detalle

```sql
SELECT fi.pv_global, fi.id, fi.total_monto,
       SUM(d.subtotal) AS sum_det
FROM factura_interna fi
JOIN factura_interna_detalle d ON d.factura_id = fi.id
WHERE fi.estado = 'CONFIRMADA'
GROUP BY fi.id, fi.pv_global, fi.total_monto
HAVING ABS(SUM(d.subtotal) - fi.total_monto) > 1;
```

Resultado esperado: **0 filas**.

---

## Query — pedidos desincronizados (post-backfill debe ser 0)

```sql
SELECT pvr.id, pvr.nro_pedido
FROM pedido_venta_rimec pvr
LEFT JOIN factura_interna fi ON fi.pedido_id = pvr.id
WHERE pvr.estado = 'PENDIENTE'
GROUP BY pvr.id, pvr.nro_pedido
HAVING COUNT(fi.id) > 0
   AND SUM(CASE WHEN fi.estado = 'CONFIRMADA' THEN 1 ELSE 0 END) = COUNT(fi.id);
```

---

## Ejemplos PV reales (BD)

| PV | Legacy | Estado | Cliente (extracto) | Monto |
|----|--------|--------|-------------------|-------|
| PV000147 | 8-PV020 | CONFIRMADA | BAZZAR… O'H | Gs. 830.400 |
| PV000146 | 8-PV021 | CONFIRMADA | DAHIANA BELEN… | Gs. 1.255.200 |
| PV000057 | 10-PV001 | ANULADA | PRUEBA WEB NEXUS | Gs. 6.350.400 |
| (sin PV) | 8-PV024 | RESERVADA | BESAIVO… | Gs. 1.495.200 |

---

## Migraciones relevantes

| MIG | Tema |
|-----|------|
| 029 | `factura_interna.pedido_id` FK formal |
| 068 | RLS `pedido_venta_rimec`, `factura_interna` |
| 092 | RPC aprobar/rechazar pedido web |
| 100 | Descuentos por factura en `confirmar_pedido_web` |
| 107 | Columna `pv_global` + trigger secuencial |
| 109 | Vista `v_factura_interna_preventa` |

---

## Export auditoría

Ejecutar desde `control_central/`:

```bash
set PYTHONPATH=.
python scripts/auditoria_pv_global_lite.py
```

Genera: `scripts/auditoria_pv_global_export.csv` (147 filas numeradas).

---

**Última actualización:** 2026-06-10
