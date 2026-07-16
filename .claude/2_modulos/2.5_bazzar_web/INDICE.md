# 2.5 BAZZAR WEB — Catálogo público + Checkout

**Tipo:** App Next.js B2C  
**Repo:** `bazzar-web/`  
**Estado:** ✅ Etapa catálogo :3002 **CERRADA** 2026-07-16  
**Última actualización:** 2026-07-16  
**Etapa:** [ETAPA_BAZZAR_WEB_CATALOGO_3002_20260716_CERRADA.md](../../4_etapas/ETAPA_BAZZAR_WEB_CATALOGO_3002_20260716_CERRADA.md) · `BAZZAR-WEB-CATALOGO-3002-20260716`

---

## Descripción

E-commerce **cliente final Bazzar**. Separado de RIMEC Web (B2B mayoristas).

| App | Clientes | Tabla |
|-----|----------|-------|
| **Bazzar Web** | Consumidor final tiendas | `cliente_web` |
| RIMEC Web | Mayoristas | `cliente_v2` |

---

## CHUSAR — operaciones documentadas

| Código | Doc | Tema |
|--------|-----|------|
| **2.5.1.2** | **[CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md](./CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md)** | **Depósito Web · grada 8/12 · purge 5000 · cache API** |
| 2.5.1.1 | [ETAPA … CERRADA](../../4_etapas/ETAPA_BAZZAR_WEB_CATALOGO_3002_20260716_CERRADA.md) | Cierre etapa Stock Sano · NIIF · :3002 |
| — | **[CHUSAR_CHECKOUT_CLIENTE_CEDULA.md](./CHUSAR_CHECKOUT_CLIENTE_CEDULA.md)** | Carrito → checkout → cédula → `cliente_web` |
| — | [CHUSAR_CATALOGO_GRILLA_VENTA_ABIERTA.md](../../../bazzar-web/docs/CHUSAR_CATALOGO_GRILLA_VENTA_ABIERTA.md) | Grilla SANO · Stock Sano · v_stock_web |
| — | [ESTADO_BAZZAR_WEB_2026.md](../../../bazzar-web/docs/ESTADO_BAZZAR_WEB_2026.md) | Snapshot histórico (pre-grada ficticia) |
| — | [docs/CONTEXT.md](../../../bazzar-web/docs/CONTEXT.md) | Contexto app |

**Depósito Web (Report):** https://rimec-report.vercel.app/bazzar-web/deposito-web · ALM_WEB_01 ~1132 pares (post-ajuste 2026-07-16)

---

## Flujo carrito (resumen)

1. `CartContext` + `CartDrawer` en catálogo  
2. `/checkout` — cédula con autocomplete (`buscarClientePorCedula`)  
3. `crearPedido` — upsert `cliente_web` + `pedido_web`

**Código:** `app/actions/checkout.ts` · `app/(public)/checkout/page.tsx`

---

## Índice Moria / Portal

http://localhost:3004/modulos/bazzar-web

---

## Réplica Tablet

Tablet POS debe usar la **misma tabla `cliente_web`** — ver:

`.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_POS_CLIENTE_CEDULA.md`

---

## NIIF / marca

Naranja institucional `#ea580c` · Navy `#1E3A5F` en catálogo web.

---

**Shibboleth:** Andrés, el que viene.
