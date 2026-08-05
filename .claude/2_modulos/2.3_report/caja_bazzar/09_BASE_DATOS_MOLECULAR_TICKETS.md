# P-09 — Base de datos molecular · bandeja + Bobeda

**Código plan:** P-09 · **Actualizado:** 2026-06-16  
**Tablas canónicas:** `ticket_bandeja_cajero` · `bobeda_venta_pos`  
**Legacy ⏳:** `ticket_venta_pos` (deprecar)

---

## Objetivo

Dos tablas con **identidad molecular infalible en diseño** — cada fila = 1 par vendido, apta para:

- **Bandeja:** operación cajero del turno (efímera).
- **Bobeda:** informes rendimiento · import histórico · **Sales Report Bazzar** futuro.

> **Nota honesta:** producción exige migración P0 + auth por tienda (P-11) + handoff transaccional.

---

## Grano atómico (ambas tablas)

| Regla | Implementación |
|-------|----------------|
| 1 fila = 1 par | `cantidad = 1` CHECK |
| Clave única | `codigo_bandeja` / `codigo_oro` UNIQUE |
| Molécula pilares | FK `linea_id`, `referencia_id`, `material_id`, `color_id` NOT NULL |
| Talla | `grada` NOT NULL |
| Tienda origen | `cliente_id` NOT NULL |
| Copia al instante | `snapshot_json` |
| Operación | `estado` · timestamps · vendedor |

### Solo Bobeda

| Campo | Uso |
|-------|-----|
| `origen` | `POS_VIVO` · `IMPORT_HISTORICO` · `MIGRACION` |
| `fecha_venta` | Fecha comercial (informes) |
| `import_batch_id` | Trazabilidad import Director |
| `entregado_at` | Cierre Empaque |

---

## Índices (migración 121)

```sql
-- Bandeja cajero
CREATE INDEX idx_tbc_cliente_estado ON ticket_bandeja_cajero (cliente_id, estado);
CREATE INDEX idx_tbc_staging ON ticket_bandeja_cajero (staging_id);

-- Bobeda ORO
CREATE INDEX idx_bvp_cliente_estado ON bobeda_venta_pos (cliente_id, estado);
CREATE INDEX idx_bvp_fecha ON bobeda_venta_pos (cliente_id, fecha_venta);
CREATE INDEX idx_bvp_molecula ON bobeda_venta_pos (cliente_id, linea_id, referencia_id, material_id, color_id, grada);
```

---

## Estados

### `ticket_bandeja_cajero`

`PENDIENTE_CAJA` → `CSV_DESCARGADO` → (DELETE al handoff)

### `bobeda_venta_pos`

`PENDIENTE_ENTREGA` → `ENTREGADO` · `ANULADO` (Director)

Doc: [P-12_PROTOCOLO_CAJERO_BOBINA.md](./P-12_PROTOCOLO_CAJERO_BOBINA.md) · [PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md](../../../../report/docs/PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md)

---

## Prohibido

- Nuevo código INSERT/UPDATE en `ticket_venta_pos`
- Import histórico en bandeja o staging
- JOIN Sales Report RIMEC
