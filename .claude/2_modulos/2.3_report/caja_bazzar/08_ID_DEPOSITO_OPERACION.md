# P-08 — ID canónico · depósito + operación

**Código plan:** P-08

---

## Definición

Identidad única de una **operación de venta tienda** = concatenación lógica de:

1. **Depósito origen** — `cliente_id` + contexto tabla `deposito_1_{id}_tienda`
2. **Operación** — secuencia COBRAR (1 par = 1 operación atómica)

---

## Implementación actual

| Campo | Rol |
|-------|-----|
| `codigo_ticket` | ID público único |
| `cliente_id` | Partición tienda |
| `linea_id`…`color_id` + `grada` | Molécula depósito |
| `estado` | Ciclo vida operación |
| `snapshot_json` | Copia descriptiva al momento venta |

Patrón código: `POS-{cliente_id}-{YYYYMMDDHHmmss}-{RND}-{idx}`

---

## Evolución propuesta

| Campo nuevo | Uso |
|-------------|-----|
| `venta_operacion_id` | UUID o bigint serial — FK informes |
| `deposito_tabla` | Texto `deposito_1_2400_tienda` — trazabilidad |
| `batch_caja_id` | Agrupa tickets de un CSV/factura |

---

## Informes Bazzar futuros

Toda agregación sale de **`ticket_venta_pos`**:

- Por tienda · periodo · vendedor · pilares
- Sin 6 tablas tickets
- Sin Sales Report RIMEC

---

## Integridad

Decremento stock + INSERT ticket = **misma transacción** (tablet) — operación indivisible atada al depósito sesión.

Doc código: `tablet-bazzar/lib/server/tickets-confirm.ts`
