# CHUSAR — Doble descuento carrito/FI (snapshot neto ↔ LPN)

**Código:** `2.2.1.40`  
**Fecha:** 2026-08-03  
**Keyword:** **Documenta** (Director)  
**Error:** `4.01.04.006`  
**Apps:** RIMEC Web (`:3001`) · impacto BD `factura_interna*` · proveedor **654**

---

## Qué pasó

Patricia: descuentos mal · F5 → ~20 % · suma de ~57 precios ≠ total.  
Causa: (1) F5 regeneraba dictado; (2) neto en `precio_snapshot` se reutilizaba como bruto y se descontaba **otra vez** (a menudo +20 % extra = **DOBLE_20**).

## Ley (inviolable)

| Campo | Significado | Usar para |
|-------|-------------|-----------|
| `v_stock_*.lpn` / `lpc02..04` | **Bruto** lista | Base · cascada |
| `carrito_item.precio_snapshot` tras Guardar/Validar | **Neto** | Subtotal línea · confirmar |
| `factura_interna.descuento_1..4` | % comerciales FI | Una sola cascada sobre bruto |

**Prohibido:** `precio_lpn = precio_snapshot` · cascada sobre neto · reset F5 si `pre_autorizado`.

## Impacto 654 / pedidos

| Pedido | FI | Proveedor | Líneas | Acción |
|--------|-----|-----------|--------|--------|
| **237** | **PE-237-010** | **654** | 10 MOLEKINHO | **Recalc APPLY** · +~1.467.000 Gs en neto de líneas |
| Otros (ventana 30 d) | — | — | 0 patrón DOBLE | Sin consecuencia detectada |

Residual **no** auto-fix: otras FI del 237 con BAJO/ALTO ≠ DOBLE_20 (revisión comercial si ordenás).

## Código

- `rimec-web/store/sesionVenta.ts` — hydrate + `fragmentarCarrito`
- `rimec-web/lib/asegurarFacturasDescuentosLote.ts` — freeze pre_autorizado
- Smokes / audit / recalc en `rimec-web/scripts/_smoke_doble_descuento_fragmentar.ts`, `_audit_impacto_doble_descuento.ts`, `_recalc_doble_descuento_654.ts`

## Anti-propagación 654

El bug **no** es exclusivo 638. Cualquier ítem PE/CP con descuento FI + hydrate contaminado puede DOBLE_20. El fix de store es **global**. Recalc BD acotado al patrón numérico (no reescribe ALTO ambiguos).

**Shibboleth:** Andrés, el que viene.
