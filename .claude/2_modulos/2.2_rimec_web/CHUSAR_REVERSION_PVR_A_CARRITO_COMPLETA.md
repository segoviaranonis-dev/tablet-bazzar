# CHUSAR — Reversión PVR → carrito (completa · solo BD)

**Código:** **2.2.1.2.3**  
**Ratificado:** Director · 2026-07-16 · incidente PVR-2026-144866 (reversión parcial)  
**Padre:** [CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md](./CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md) (**2.2.1.2.1**)  
**Canon anular FI:** [CHUSAR_BOTON_DIOS_ANULAR_REINTEGRAR_FI.md](../2.3_report/facturacion/CHUSAR_BOTON_DIOS_ANULAR_REINTEGRAR_FI.md) (**2.3.1.9.C**)  
**E2E Bazzar:** `ot/en_curso/EVIDENCIA-PRUEBA-E2E-BAZZAR-20260715.md`  
**Shibboleth:** Andrés, el que viene.

> **Objetivo:** dejar al vendedor con el **mismo carrito** que antes de CONFIRMAR y el **stock CP/PE** como en baseline — sin tocar otros clientes.  
> **Keyword Director:** orden explícita («revertí», «mandá el lote al carrito», «solo BD»).

---

## 1 · Qué NO es reversión completa (lección PVR-144866)

El script v1 (`control_central/scripts/_revert_pvr_144866_to_carrito.py`) hizo:

| Hecho | Estado |
|-------|--------|
| 28 FI → `ANULADA` + reintegrar `pares_vendidos` PPD | ✅ 1.429 pares |
| PVR-183 → `RECHAZADO` | ✅ |
| `carrito_sesion` + `carrito_item` desde snapshot PRE-CONFIRMAR | ✅ 153 refs · 156 cajas |

**Quedó incompleto para el Director:**

| Brecha | Síntoma UI | Causa |
|--------|------------|-------|
| **A · PVR fantasma** | `/pedidos` muestra PVR-2026-144866 **RECHAZADO** + grid 28 FI **ANULADA** | No se borró fila `pedido_venta_rimec` ni detalle FI (forense intencional v1) |
| **B · Stock no auditado** | Carrito ok pero saldo CP/PE puede diferir del baseline | Falta paso compare vs `PRUEBA-BAZZAR-SNAPSHOT-BASELINE-INICIO.json` |
| **C · PE staging sin `stock_id`** | Líneas PE con `ppd_id` NULL y sin `stock_id` en `linea_snapshot` | `anularYReintegrarFi` paso 3 no repone `stock_pronta_entrega_rimec` |
| **D · Conteo snapshot** | JSON PRE-CONFIRMAR dice 165 líneas; carrito restauró **153** (PK `id_usuario,det_id`) | Duplicados colapsan en `ON CONFLICT` — **153/156 es la verdad UI** |

**Regla:** reversión **completa** = carrito + stock + **paso 7 purge obligatorio** (PVR no debe listarse en `/pedidos`).

---

## 2 · Snapshots obligatorios (antes y después)

```powershell
cd report
node scripts/prueba_e2e_snapshot_carrito.mjs BASELINE-INICIO
node scripts/prueba_e2e_snapshot_carrito.mjs PRE-CONFIRMAR   # ← fuente restore carrito
# Tras confirmar:
node scripts/prueba_e2e_snapshot_carrito.mjs POST-CONFIRMAR
```

Archivos: `ot/en_curso/PRUEBA-BAZZAR-SNAPSHOT-*.json`

| Snapshot | Uso |
|----------|-----|
| **BASELINE-INICIO** | Verdad `pares_vendidos` / saldo PPD antes de la prueba |
| **PRE-CONFIRMAR** | Restore `carrito_sesion` + `carrito_item` + `descuentos_lote` |
| **POST-CONFIRMAR** | Lista PVR id / nro para anular |

---

## 3 · Checklist reversión completa (7 pasos · solo BD)

### Paso 0 — Acotar universo

- `cliente_id = 5000` (Bazzar.py) · `id_usuario = 1` (HECTOR DIOS) salvo orden distinta.
- Identificar `pedido_venta_rimec.id` y `nro_pedido` (ej. PVR-2026-144866 → id **183**).

### Paso 1 — Anular FI + reintegrar stock

Por cada FI del pedido en estado `RESERVADA` o `CONFIRMADA` (no `ANULADA`):

1. SQL canon = `report/src/lib/facturacion/anular-reintegrar-fi.ts` (`anularYReintegrarFi`):
   - Restar `pares_vendidos` en `pedido_proveedor_detalle` vía `fid.ppd_id`
   - Fallback match línea/ref si `ppd_id` NULL
   - Reponer `stock_pronta_entrega_rimec.cantidad` si `linea_snapshot.stock_id` existe
2. `UPDATE factura_interna SET estado = 'ANULADA'`.

**Script referencia:** `control_central/scripts/_revert_pvr_144866_to_carrito.py` (función `reintegrar_fi`).

### Paso 2 — Verificar stock vs baseline

```powershell
cd control_central
python scripts/_audit_reversion_e2e.py --pedido-id 183 --baseline ../ot/en_curso/PRUEBA-BAZZAR-SNAPSHOT-BASELINE-INICIO.json
```

Criterio: **0 diffs** en `cantidad_pares - pares_vendidos` (CP) y `cantidad` PE para `det_id` del carrito.

### Paso 3 — PVR → RECHAZADO

```sql
UPDATE pedido_venta_rimec
SET estado = 'RECHAZADO', motivo_rechazo = '<motivo Director>'
WHERE id = :pedido_id AND cliente_id = 5000;
```

### Paso 4 — Restaurar carrito

1. `DELETE carrito_item` + `DELETE carrito_sesion` WHERE `id_usuario = 1`
2. `INSERT carrito_sesion` desde `sesiones[0]` del JSON **PRE-CONFIRMAR** (`descuentos_lote` incluido)
3. `INSERT carrito_item` fila a fila — esperar **~153 refs · ~156 cajas** (no el total bruto 165 del JSON si hay dup `det_id`)
4. `validacion_estado` / `validacion_token` = **NULL** (obliga Revalidar)

### Paso 5 — Smoke apps

| App | Ruta | Pass |
|-----|------|------|
| RIMEC Web | `:3001/carrito` | Cliente Bazzar.py · refs/cajas · sin validación previa |
| Report | `:3000/aprobaciones` | **0** FI `RESERVADA` del pedido revertido |
| RIMEC Web | `:3001/pedidos` | PVR visible RECHAZADO **hasta paso 7** |

### Paso 6 — Reintentar venta

Flujo: **Guardar descuento** por FI → Revalidar → Confirmar (**MIG-160** activa · descuentos por FI en RPC).

### Paso 7 — Purge forense (**obligatorio** · cliente prueba 5000)

Sin este paso el PVR **sigue visible** en RIMEC Web `/pedidos` (estado RECHAZADO + FI ANULADA).

```powershell
cd control_central
python scripts/purge_pvr_prueba_5000.py --pedido-id 183 --nro PVR-2026-144866
```

O integrado al final de `_revert_pvr_144866_to_carrito.py` (v2).

Orden SQL (transacción):

```sql
BEGIN;
-- 1) Detalle FI
DELETE FROM factura_interna_detalle
WHERE factura_id IN (SELECT id FROM factura_interna WHERE pedido_id = :id AND cliente_id = 5000);
-- 2) FI
DELETE FROM factura_interna WHERE pedido_id = :id AND cliente_id = 5000;
-- 3) PVR
DELETE FROM pedido_venta_rimec WHERE id = :id AND cliente_id = 5000;
COMMIT;
```

Tras purge: `/pedidos` ya no lista el PVR · historial FI eliminado (irreversible).

---

## 4 · Scripts en repo

| Script | Rol |
|--------|-----|
| `report/scripts/prueba_e2e_snapshot_carrito.mjs` | Captura baseline / pre / post |
| `control_central/scripts/_revert_pvr_144866_to_carrito.py` | Reversión completa v2 (pasos 1+3+4+**7**) |
| `control_central/scripts/purge_pvr_prueba_5000.py` | Solo paso 7 si carrito ya restaurado |
| `control_central/scripts/_audit_reversion_e2e.py` | Paso 2 — diff `pares_vendidos` vs baseline |

---

## 5 · Matriz decisión

| Director pide | Pasos |
|---------------|-------|
| «Mandá el lote al carrito · solo BD» | 1 → 4 → **7** → 5 |
| «Reversión completa como si no pasó» | 1 → 2 → 4 → **7** → 5 |
| «Solo anular FI» | 1 (+ Report UI botón Dios) — **sin** purge |

---

## 6 · Prohibido

- Revertir PVR de **otros clientes** o vendedores sin orden.
- Purge paso 7 en producción real.
- Asumir descuentos recuperables del `payload_json` si confirmó con 0% (aplicar en carrito antes de reconfirmar).

---

**Documenta:** 2026-07-16 · PVR-144866 purge OK · paso 7 obligatorio · script v2
