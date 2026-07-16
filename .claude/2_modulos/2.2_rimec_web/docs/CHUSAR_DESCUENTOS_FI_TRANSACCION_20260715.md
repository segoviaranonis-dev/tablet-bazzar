# CHUSAR — Descuentos FI transaccionales (RIMEC Web ↔ RPC ↔ Report)

**Código:** `2.2.4.0.12`  
**Fecha:** 2026-07-15  
**Migración BD:** `MIG-160` (`control_central/migrations/160_descuentos_fi_transaccional.sql`)  
**Riesgo:** 🔴 ALTO — afecta dinero (Gs.) en toda la cadena venta

---

## Problema corregido

**MIG-155** revirtió **MIG-100**: `confirmar_pedido_web` grababa **todas** las FIs con `p_descuento_1..4` globales (casi siempre **0**), ignorando `payload.lotes[].facturas[].descuento_1..4` que RIMEC Web calcula bien.

**Síntoma bancario:** cabecera FI «Sin descuento» + líneas con `precio_neto < precio_lista` → Report/Aprobaciones recalcula mal; PP `pares_vendidos` puede cuadrar pero el **monto no**.

**MIG-094** usaba `ROUND()` en cascada; Web y Report usan **`Math.floor(precio/100)*100`** → diferencias de Gs. en validar vs carrito.

---

## Regla única de precio neto (única verdad)

```
neto = floor( base × (1-d1/100) × (1-d2/100) × (1-d3/100) × (1-d4/100) / 100 ) × 100
```

| Capa | Implementación |
|------|----------------|
| **RIMEC Web** | `rimec-web/lib/carritoDescuentosFi.ts` → `precioNetoCascada` |
| **Report Aprobaciones** | `report/src/app/aprobaciones/lib/aprobaciones-utils.ts` → `precioNetoCascada` |
| **PostgreSQL** | `fn_precio_neto_cascada_gs` (**MIG-160**) |
| **Validar carrito** | `carrito_validar` usa `fn_precio_neto_cascada_gs` (**MIG-160**) |
| **Confirmar** | Payload trae neto por ítem; cabecera FI guarda d1..d4 por factura |

Descuentos: **4 slots** `[d1,d2,d3,d4]`, 0 = vacío. Normalización: `normalizarDescuentos4`.

---

## UX vigente (Director aprueba — NO usar Desc. lote)

1. **Eliminado:** input «Desc. lote» en carrito (`descuentosPorLote` ya no se mezcla en fragmentación).
2. **Modal bloqueante:** `EditorDescuentosFi.tsx` → **Editar descuentos** → **Guardar descuento**.
3. **API commit único:** `POST /api/carrito/factura/guardar-descuentos` → `guardarDescuentosFacturaInterna`.
4. Tras guardar: invalida validación → **Revalidar obligatorio** antes de confirmar.

Config por FI en sesión: `carrito_sesion.descuentos_lote.facturas[]`  
Clave: `(pp_id, marca, caso)` + `lista_precio_id` + `descuentos[4]`.

---

## Cadena confirmar (transacción)

```
Carrito Web
  → fragmentarCarrito (desc por facturasConfig)
  → payload.lotes[].facturas[].descuento_1..4 + items[].precio_base/precio_neto
  → POST /api/carrito/confirmar
  → RPC confirmar_pedido_web (MIG-160)
       · INSERT factura_interna (descuento_1..4 POR FI desde payload)
       · INSERT factura_interna_detalle (precio_lista, precio_neto del payload)
       · UPDATE pedido_proveedor_detalle.pares_vendidos (CP)
       · UPDATE stock_pronta_entrega_rimec (PE staging)
  → Report /aprobaciones lee fi.descuento_* + recalcula con precioNetoCascada
```

**Prioridad descuentos en RPC (MIG-160):**

1. `payload.facturas[].descuento_1..4` (Web — autoritativo)
2. `carrito_sesion.descuentos_lote.facturas[].descuentos[]` (si payload sin claves)
3. `p_descuento_1..4` cabecera pedido (legacy)

---

## CP vs PE

| Origen | Vista precio | Guardar descuentos |
|--------|--------------|-------------------|
| **CP (tránsito PP)** | `v_stock_rimec` | `getPrecioActivo` + cascada |
| **PE ppd** | `v_stock_pe_rimec` | `getPrecioActivoPe` + cascada |
| **PE staging** | `stock_pronta_entrega_rimec` | precio unitario staging |

Lista por FI: `lista_precio_id` 1=LPN, 2=LPC02, 3=LPC03 (PROMOCIONAL→LPN), 4=LPC04.

---

## Report — Aprobaciones

- **Lectura:** `aprobaciones-queries.ts` → `fi.descuento_1..4`
- **Edición:** `FiEncabezadoEditores.tsx` + `guardarDescuentosFi` → `normalizarDescuentos4` al persistir
- **Recálculo líneas:** `aprobaciones-mutations.ts` → `precioNetoCascada(base, d1..d4)` + `floor/100`
- **Display:** inputs vacíos si 0 (`descuentoInput.ts` / `descuentoInputDisplay`)

No recalcular con cabecera 0% si las líneas ya tienen neto descontado — **MIG-160 evita crear ese estado en pedidos nuevos**.

---

## Auditoría (pre/post deploy MIG-160)

Script: `control_central/scripts/auditoria_descuentos_fi.sql`

| Query | Qué detecta |
|-------|-------------|
| **#1** | FIs cabecera 0% con líneas neto < lista (legacy MIG-155) |
| **#2** | Líneas donde `precio_neto` ≠ `fn_precio_neto_cascada_gs(lista, d1..d4)` |
| **#3** | `ppd.pares_vendidos` ≠ suma pares en FIs activas |
| **#4** | Sesiones carrito: descuentos FI vs ítems |

**Pedido E2E HECTOR (cliente 5000):** no confirmar hasta MIG-160 en BD + Revalidar + Guardar descuento por FI.

---

## Archivos tocados (2026-07-15)

| Archivo | Cambio |
|---------|--------|
| `rimec-web/app/carrito/page.tsx` | Quita UI Desc. lote |
| `rimec-web/lib/carritoDescuentosFi.ts` | Lógica modal + floor |
| `rimec-web/store/sesionVenta.ts` | fragmentarCarrito sin merge lote |
| `report/.../aprobaciones-utils.ts` | floor + normalizarDescuentos4 |
| `report/.../FiEncabezadoEditores.tsx` | normalizar al guardar |
| `control_central/migrations/160_*.sql` | RPC + validar + fn SQL |
| `report/migrations/160_*.sql` | Copia espejo |

---

## Deploy

1. **MIG-160** aplicada en Supabase (2026-07-16 · `fn_precio_neto_cascada_gs` + `confirmar_pedido_web` por FI · smoke neto 100000@10+5% = 85500).
2. Ejecutar auditoría #1–#3; documentar filas legacy (no auto-reparar sin OT).
3. Smoke: carrito → Guardar descuento FI → Validar → Confirmar → Aprobaciones muestra mismos % y neto.
4. **Prod apps** (orden directa Director 2026-07-16): ver [CHUSAR_DEPLOY_DESCUENTOS_LIQUIDACION_CASOS_20260716.md](../CHUSAR_DEPLOY_DESCUENTOS_LIQUIDACION_CASOS_20260716.md) (**2.2.4.0.13**).

---

## Errores relacionados

- `4.01.04.xxx` — precio/lightbox (catálogo, distinto módulo)
- Ruptura descuentos: tratar como **incidente financiero** — MIG-160 **aplicada** 2026-07-16

**Shibboleth:** Andrés, el que viene.
