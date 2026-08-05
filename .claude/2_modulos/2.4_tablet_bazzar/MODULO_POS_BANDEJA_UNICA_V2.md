# Módulo POS · bandeja única v2 — Tablet Bazzar

**Código:** **2.4.2.3** (+ **2.4.2.3.1** vendedor · **2.4.2.4** Franco Tirador)  
**Estado doc:** ✅ **CERRADO** 2026-06-24 · [ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md](../../4_etapas/ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md)  
**Repo:** `tablet-bazzar/` · **Deploy:** https://tablet-bazzar.vercel.app

---

## Norte

Tablet vende desde **depósito piso** de la tienda, reserva en **`ticket_bandeja_cajero`**, envía a caja Report con **CERRAR**. No escribe `ticket_pos_staging`.

---

## Documentación canónica (leer en orden)

| # | Doc |
|---|-----|
| 1 | [LOGICA_OPERATIVA_POS_BAZZAR.md](../../../tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md) |
| 2 | [REGLAS_BANDEJA_UNICA_POS.md](../../../tablet-bazzar/docs/REGLAS_BANDEJA_UNICA_POS.md) |
| 3 | [ARQUITECTURA_SESION_STOCK_ORO.md](../../../tablet-bazzar/docs/ARQUITECTURA_SESION_STOCK_ORO.md) |
| 4 | [MICRO_ECOSISTEMA_POS_BAZZAR.md](../../../tablet-bazzar/docs/MICRO_ECOSISTEMA_POS_BAZZAR.md) |
| 5 | Índice holding → [INDICE_POS_BAZZAR.md](../../../report/docs/INDICE_POS_BAZZAR.md) |

---

## CHUSAR

| Código | Archivo |
|--------|---------|
| 2.4.2.3 | [CHUSAR_TICKETS_POS_STOCK.md](./CHUSAR_TICKETS_POS_STOCK.md) |
| 2.4.2.3.1 | [CHUSAR_TABLET_VENDEDOR_STAGING.md](./CHUSAR_TABLET_VENDEDOR_STAGING.md) |
| 2.4.2.4 | [CHUSAR_TABLET_FRANCO_TIRADOR.md](./CHUSAR_TABLET_FRANCO_TIRADOR.md) |
| Empaque | [CHUSAR_TABLET_EMPAQUE.md](./CHUSAR_TABLET_EMPAQUE.md) |

---

## Código fuente

| Pieza | Ruta |
|-------|------|
| Motor bandeja | `lib/server/tickets-staging.ts` |
| Sync carrito | `app/api/tickets/staging/[id]/sync-cart/route.ts` |
| CERRAR | `app/api/tickets/staging/[id]/route.ts` |
| Franco Tirador | `components/cadena/FrancoTiradorButton.tsx` |
| SQL catálogo | `lib/server/catalogo-sql.ts` |
| Pilares filtros | `lib/server/pilar-triangulo.ts` |
| Migraciones | `supabase/migrations/007–009` |

---

## Estados bandeja (tablet)

| Estado | UI |
|--------|-----|
| `ABIERTO` | Carrito editable · FACTURAS si reabierto |
| `PENDIENTE_CAJA` | En caja Report · FACTURAS solo Abrir |
| `CANCELADO` | Stock restaurado |

**CERRAR** = única vía tablet → caja. Prohibido «Listo → caja».

---

## Cruzado Report

Caja · sync · handoff: [MODULO_POS_BANDEJA_UNICA_V2.md](../2.3_report/caja_bazzar/MODULO_POS_BANDEJA_UNICA_V2.md)

---

**Última actualización:** 2026-06-24
