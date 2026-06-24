# Reglas bandeja única POS — invariables (índice)

**Doc completo:** [LOGICA_OPERATIVA_POS_BAZZAR.md](./LOGICA_OPERATIVA_POS_BAZZAR.md)  
**Stock / sync:** `report/docs/LOGICA_STOCK_DEPOSITO_SYNC.md`  
**Tabla:** `ticket_bandeja_cajero` · **Migraciones:** 007 + 008 + **009**

---

## 1. Identificadores (todos numéricos en negocio)

| Campo | Tipo | Alcance | Uso |
|-------|------|---------|-----|
| `id` | bigserial | Global | PK fila · quitar par en caja |
| `staging_id` | bigint secuencia `ticket_bandeja_lote_id_seq` | Global | **Lote factura** · agrupa filas del mismo pedido |
| `numero_fi_fa` | bigint | **Por `cliente_id`** | Factura interna visible · `FI_FA: 1` en tienda 2100 ≠ tienda 2900 |
| `cliente_id` | bigint | Fijo 6 valores | **Aislamiento total** · nunca cruzar tiendas |
| `codigo_bandeja` | text UNIQUE | Trazabilidad técnica | No es ID de negocio · no mostrar al cajero |

**Primera venta tras reset:** `staging_id = 1`, `numero_fi_fa = 1` (tienda 2100).

**FI_FA por lote:** todas las filas del mismo `staging_id` comparten `numero_fi_fa`. Unicidad vía `pos_fi_fa_counter` (migración **009** eliminó índice erróneo por fila).

---

## 2. Ley de aislamiento (inviolable)

Toda lectura/escritura incluye:

```sql
WHERE cliente_id = :mi_tienda
```

Prohibido listar, editar o borrar filas de otra tienda aunque `staging_id` coincida.

---

## 3. Estados — una sola visibilidad

| Estado | Tablet catálogo | Tablet FACTURAS | Report caja |
|--------|-----------------|-----------------|-------------|
| `ABIERTO` | Edición carrito | No (salvo reabierto en curso) | **No** |
| `PENDIENTE_CAJA` | No editable | Lista · Abrir | **Sí** |
| `CSV_DESCARGADO` | No | Lista · Abrir | **Sí** |
| `CANCELADO` | — | — | **No** |

**Nunca** `ABIERTO` y `PENDIENTE_CAJA` simultáneos para el mismo `staging_id`.

Transiciones:

```
(nueva venta) → INSERT filas ABIERTO · stock depósito −
sync-cart     → restaurar bandeja vieja + re-insert · validar stock (depósito + reserva bandeja)
CERRAR tablet → UPDATE mismo lote → PENDIENTE_CAJA + numero_fi_fa
FACTURAS Abrir → UPDATE → ABIERTO (desaparece caja · stock sigue reservado)
CERRAR otra vez → PENDIENTE_CAJA (mismo numero_fi_fa)
Enviar Empaque → DELETE bandeja · INSERT bobeda_venta_pos
```

---

## 4. Acciones permitidas

| Quién | Acción |
|-------|--------|
| Tablet | **CERRAR** → envía a caja (única vía) |
| Tablet FACTURAS | **Abrir** / **Cancelar** |
| Report caja | Titular · quitar par · CSV · Enviar Empaque |
| Prohibido | “Listo → caja” en panel FACTURAS |

---

## 5. Stock — reglas cortas

| Evento | Depósito |
|--------|----------|
| sync-cart / crear carrito | −1 por par |
| cancelar / restaurarLineas | +1 por par |
| CERRAR / reabrir estado | sin cambio |
| sync depósito Report | reemplazo total desde Retail |
| reset POS | +1 solo desde bandeja activa antes de borrar |

**Validación sync-cart:** `stock_disponible = deposito + reserva_bandeja_lote_actual`.

---

## 6. Reset vs sync

| Script / API | Depósito | Transaccionales |
|--------------|----------|-----------------|
| `reset_pos_bazzar_ventas.mjs` | Solo restaura desde bandeja | DELETE bandeja/bobeda/counters |
| `POST /api/depositos/sync` | DELETE + INSERT desde Retail | No toca |

---

## 7. Verificación

```bash
cd report
node scripts/reset_pos_bazzar_ventas.mjs
node scripts/diag_pre_sync_pos.mjs 2100
node scripts/smoke_primera_factura_bandeja.mjs
node scripts/run_migration_009.mjs   # FI_FA index
```

---

## 8. Display canónico

```
{Nombre cliente} - FI_FA: {numero_fi_fa}
```

Helper: `lib/fi-fa-display.ts` (tablet + report).
