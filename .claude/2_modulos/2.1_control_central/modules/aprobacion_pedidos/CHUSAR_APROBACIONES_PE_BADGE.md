# CHUSAR — Aprobaciones · identificación Pronta entrega

**Código:** `2.3.1.3.0.1`  
**App:** `report/` · `/aprobaciones` · `:3000`  
**Ratificado:** 2026-07-08 · orden Director **Documentación Chusar**

---

## Problema

Pedidos web PE llegaban a tab **Pendientes** sin distinción visual vs tránsito PP. Director no veía que era **Pronta entrega**.

---

## Fix UI (Report Next.js)

| Componente | Cambio |
|------------|--------|
| `PedidoPendienteCard.tsx` | Badge naranja **PRONTA ENTREGA** · borde ámbar si `origen_pe` |
| `FiCard.tsx` | Mismo badge + `ppDisplay` → «Pronta entrega» · **CASO** corto PE → ver `2.3.1.3.0.2` |
| `aprobaciones-queries.ts` | `origen_pe` desde `payload_json.lotes[].origen_pe` o `pp_id < 0` |
| `aprobaciones-utils.ts` | `badgeProntaEntrega()` · `ppDisplay` · `etiquetaCasoUiAprobaciones` |

**CASO PE corto (Director 2026-07-26):** [CHUSAR_APROBACIONES_CASO_PE_CORTO_20260726.md](./CHUSAR_APROBACIONES_CASO_PE_CORTO_20260726.md) — UI **PE-LIQ** / **PE-NORMAL** / **PE-PROMO** / **PE-COMUN** (no batch `pe-import-…`).

---

## Detección PE

**Pedido pendiente (`pedido_venta_rimec`):**

```sql
EXISTS (
  SELECT 1 FROM jsonb_array_elements(payload_json->'lotes') l
  WHERE (l->>'origen_pe')::boolean
     OR (l->>'pp_id')::bigint < 0
) AS origen_pe
```

**Factura interna:**

- `fi.pp_id IS NULL`
- `fi.nro_factura LIKE 'PE-%'` (MIG-141)

---

## Flujo PE vs CP

| | CP (tránsito) | PE (local) |
|---|---------------|------------|
| FI `pp_id` | FK `pedido_proveedor` | NULL |
| FI `nro_factura` | `8-PV…` legacy | `PE-{pedido}-{seq}` |
| Stock descontado | `pedido_proveedor_detalle.pares_vendidos` | `v_stock_pe_rimec` / ppd |
| Badge UI | PP + proforma | **PRONTA ENTREGA** |

---

## Verificar

1. Confirmar carrito PE en `:3001`
2. `:3000/aprobaciones` → Pendientes
3. Badge visible en tarjeta + al expandir FI

---

## Pendiente

- [ ] Director confirma visual badge
- [ ] Rechazar pedido duplicado si aplica (ver [CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md](../../2.2_rimec_web/CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md))
- [ ] CSV general: columna `origen_pe` (opcional futuro)

---

## Código gemelo Streamlit

Streamlit `modules/aprobacion_pedidos/` **no** tiene badge PE aún — Report es fuente UI Nivel Dios. Paridad opcional en OT futura.
