# CHUSAR — Hotfix confirmar PE · LPC03 null (paridad Web↔BD)

**Código:** `2.2.1.52`  
**Fecha:** 2026-08-10  
**Keyword:** Documenta · despliega (Director)  
**Error:** `4.02.03.025`  
**Estado:** ✅ MIG-206 en BD prod · ratificado **2.2.1.52.1** · smoke PASS

---

## Qué pasó

Patricia no podía confirmar pedido PE YESMAY (LPC03): payload **71500** vs BD **63800** en ppd **177089**.

Causa: PE en `v_stock_pe_rimec` trae **lpc03 null** (11.777/11.777). Web aplica ley LPN×1.12; `fn_precio_tier_vista` devolvía NULL y el RPC hacía COALESCE → LPN.

## Fix

- Migración: `report/migrations/206_fn_precio_tier_pe_lpc_null_paridad_web.sql`
- Función alineada a `resolverLpcTier` / `getPrecioActivoPe`
- Verificación: carrito Patricia 12/12 · smoke 63800→71500

## Operación

Patricia: **VALIDAR** de nuevo → Confirmar. Sin vaciar carrito.

## Prevención

Ver detalle error `4.02.03.025`. No vender PE LPC03 “como LPN” para silenciar el gate.

**Shibboleth histórico (pie docs):** Andrés, el que viene.
