# CHUSAR — Tablet · Tickets POS · bandeja única v2

**Código:** `2.4.2.3`  
**Sub-código vendedor:** `2.4.2.3.1` → [CHUSAR_TABLET_VENDEDOR_STAGING](./CHUSAR_TABLET_VENDEDOR_STAGING.md)  
**Módulo Moria:** [MODULO_POS_BANDEJA_UNICA_V2.md](./MODULO_POS_BANDEJA_UNICA_V2.md)  
**Doc madre:** [LOGICA_OPERATIVA_POS_BAZZAR.md](../../../tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md)  
**Cierre doc:** [ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md](../../4_etapas/ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md) ✅  
**App:** `tablet-bazzar/` · puerto dev **3000** · **Deploy:** tablet-bazzar.vercel.app

---

## Qué hace este módulo

Ventas POS en **una tabla operativa** `ticket_bandeja_cajero`:

1. **Carrito / sync-cart** → filas `ABIERTO` + stock − depósito sesión.  
2. **CERRAR** → `PENDIENTE_CAJA` + `numero_fi_fa` → visible Report caja.  
3. **FACTURAS Abrir** → vuelve `ABIERTO` (mismo FI_FA).  
4. Report **Enviar Empaque** → DELETE bandeja · INSERT `bobeda_venta_pos`.

**Prohibido:** «Listo → caja» · escribir `ticket_pos_staging`.

Requiere **cliente** (cédula) + **vendedor** (código por ente) antes de CERRAR.

---

## Rutas y archivos canónicos

| Pieza | Ruta |
|-------|------|
| Motor bandeja | `lib/server/tickets-staging.ts` |
| UI grada + carrito | `components/pos/GradaVentaStrip.tsx`, `PosCartSheet.tsx` |
| API sync-cart | `app/api/tickets/staging/[id]/sync-cart/route.ts` |
| API CERRAR | `app/api/tickets/staging/[id]/route.ts` |
| Staging CRUD | `app/api/tickets/staging/` |
| Config depósitos | `lib/depositos-config.ts` |
| SQL molécula | `lib/server/catalogo-sql.ts` |
| Migraciones | `007`–`009` en `supabase/migrations/` |

---

## Leyes (no negociables)

1. **Stock = depósito sesión** — `deposito_1_{cliente_id}_tienda` al sync-cart.  
2. **Validación reabrir** — `stock_disponible = deposito + reserva_bandeja_lote`.  
3. **CERRAR** = única vía tablet → caja · `enviarStagingACaja()`.  
4. **Sync depósito guard** — 409 si bandeja `ABIERTO` (no PENDIENTE_CAJA).  
5. **Cross-store es lectura** — no vender desde otro `cliente_id`.  
6. **No Sales Report** — cero touch a `registro_ventas_general_v2`.  
7. **FI_FA por lote** — migración 009 · contador `pos_fi_fa_counter`.

---

## Estado (2026-06-24)

| Ítem | Estado |
|------|--------|
| Bandeja única v2 | ✅ |
| Documentación | ✅ [INDICE_POS_BAZZAR](../../../report/docs/INDICE_POS_BAZZAR.md) |
| Deploy Vercel | ✅ |
| Smoke E2E piso | ⏳ |

---

## Flujo CERRAR (operador)

1. Login → `/cadena` → carrito.  
2. **CERRAR** → FI_FA asignado · `PENDIENTE_CAJA`.  
3. Report `/tablet-bazzar/{cliente_id}` → bandeja.  
4. CSV · Enviar Empaque → bobeda.

---

## Validación mínima (agente)

```bash
cd tablet-bazzar && npm run build
cd ../report && node scripts/smoke_primera_factura_bandeja.mjs
```

---

**CHUSAR v2 — 2.4.2.3 — doc cerrada 2026-06-24**
