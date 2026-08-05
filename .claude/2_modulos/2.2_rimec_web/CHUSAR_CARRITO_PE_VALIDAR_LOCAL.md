# CHUSAR — RIMEC Web · Carrito PE · validar · confirmar (solo local)

**Código:** `2.2.4.0.1`  
**Etapa:** `RIMEC-WEB-PE-LOCAL-20260706`  
**App:** `rimec-web/` · `:3001`  
**Ratificado:** 2026-07-08 · orden Director **Documentación Chusar**

---

## Qué se resolvió (2026-07-07/08)

Flujo **Pronta entrega** en carrito web: agregar → validar → confirmar → pedido `PVR-*` + FI `PE-*` en Report Aprobaciones.

| Síntoma | Causa | Fix app |
|---------|-------|---------|
| «Producto no encontrado» al agregar PE | Carrito buscaba solo `v_stock_rimec` | `lib/carritoStockResolve.ts` · fallback PE |
| Base/Neto 0 · banner SIN_PRECIO | Sesión/recalcular solo CP | `lib/carritoStockEnrich.ts` · CP+PE |
| VALIDAR no emite token · precios → 0 | RPC `carrito_validar` solo CP | `lib/carritoValidarPe.ts` · PE-only sin RPC |
| Doble pedido mismo carrito | Token no consumido al instante · doble clic | `confirmLock` useRef en `app/carrito/page.tsx` |

---

## Datos PE (BD actual — no confundir con doc legacy)

| Campo | Valor real |
|-------|------------|
| Vista stock | `v_stock_pe_rimec` |
| `det_id` | **Id crudo** `pedido_proveedor_detalle.id` (~4718) — **no** obligatorio ≥800M |
| `pp_id` carrito | Negativo sintético (ej. `-640418625`) |
| Precio venta | Casi siempre solo **`lpn`** · LPC02-04 null |
| `origen_tipo` | `PRONTA_ENTREGA` |

Doc MIG-136 con `det_id >= 800000000` aplica a **staging** `stock_pronta_entrega_rimec`; Alejandro Magno PE operativo usa **ppd** (MIG-141).

---

## Archivos código (canon)

```
rimec-web/
  lib/prontaEntregaVenta.ts      # isProntaEntregaStockRow · PE_DET_ID_BASE
  lib/carritoStockResolve.ts     # resolveCarritoStockRow
  lib/carritoStockEnrich.ts      # fetchCarritoStockByDetIds
  lib/carritoValidarPe.ts        # validarCarritoPeApp · parcheValidarProntaEntrega
  lib/precioLista.ts             # LPC03=PROMOCIONAL→LPN (PE comparte regla PP)
  app/api/carrito/validar/route.ts
  app/api/carrito/confirmar/route.ts
  app/api/carrito/sesion/route.ts
  app/carrito/page.tsx             # cargarDesdeBD post-validar OK · confirmLock
  store/sesionVenta.ts             # origen_tipo · cant_caja PE
```

---

## Validar — reglas

1. **Carrito 100% PE** (`pp_id < 0` en todos los ítems): **no** invocar RPC `carrito_validar` → `validarCarritoPeApp`.
2. **Mixto CP+PE:** RPC + `parcheValidarProntaEntrega` (revalida PE desde `v_stock_pe_rimec`).
3. PE tier vacío → fallback **LPN** (`getPrecioActivoPe`).
4. OK → token UUID 60s en `carrito_sesion` · UI recarga carrito (`cargarDesdeBD`).

---

## Confirmar — reglas

- RPC **`confirmar_pedido_web`** (MIG-141): lote `origen_pe` / `pp_id < 0` → FI `nro_factura = PE-{pedido_id}-{seq}` · `pp_id` FI = NULL.
- Payload incluye `origen_tipo: PRONTA_ENTREGA` por ítem (trazabilidad).
- Cliente prueba PE: **5000 Bazzar.py** · usuario **37** (sesión local).

---

## Incidente duplicado (2026-07-08)

Dos pedidos idénticos en Aprobaciones Pendientes:

- `PVR-2026-390121`
- `PVR-2026-936272`

Mismo cliente · 1 par · Gs. 43.300. **Acción Director:** rechazar uno en `/aprobaciones`.

**Deuda BD (Claude Code):** consumir `validacion_token` al **inicio** atómico del RPC (anti race doble confirm).

---

## Pendiente cierre etapa

- [ ] Smoke navegador: PE agregar → VALIDAR → CONFIRMAR → badge PE en Aprobaciones
- [ ] Anular/rechazar duplicado PVR si no procede
- [ ] MIG token one-shot en `confirmar_pedido_web`
- [ ] Opcional: migrar RPC `carrito_validar` para incluir `v_stock_pe_rimec` (largo plazo)

---

## Comandos dev

```bash
cd rimec-web && npm run dev    # :3001
cd report && npm run dev:3000  # Aprobaciones :3000/aprobaciones
```

**Prod:** congelada `f408fc2` — sin deploy hasta cierre etapa.
