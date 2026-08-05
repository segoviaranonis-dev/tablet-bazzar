# Módulo POS · bandeja única v2 — Caja Bazzar Report

**Código:** **2.3.2.2** (hub **2.3.2.2.0** · cajas **2.3.2.2.1–6**)  
**Estado doc:** ✅ **CERRADO** 2026-06-24 · [ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md](../../../4_etapas/ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md)  
**App:** `/tablet-bazzar` · **Deploy:** https://rimec-report.vercel.app/tablet-bazzar

---

## Norte

Report muestra bandeja **`ticket_bandeja_cajero`** (`PENDIENTE_CAJA` · `CSV_DESCARGADO`), permite titular · quitar par · CSV · **Enviar a Empaque** → `bobeda_venta_pos`. Sync depósito en **2.3.2.1** no toca bandeja.

---

## Documentación canónica (leer en orden)

| # | Doc |
|---|-----|
| 1 | [INDICE_POS_BAZZAR.md](../../../../report/docs/INDICE_POS_BAZZAR.md) |
| 2 | [LOGICA_STOCK_DEPOSITO_SYNC.md](../../../../report/docs/LOGICA_STOCK_DEPOSITO_SYNC.md) |
| 3 | [FLUJO_CANONICO_POS_BAZZAR.md](../../../../report/docs/FLUJO_CANONICO_POS_BAZZAR.md) |
| 4 | [PROTOCOLO_CAJA_BAZZAR_CAJERO.md](../../../../report/docs/PROTOCOLO_CAJA_BAZZAR_CAJERO.md) |
| 5 | Tablet madre → [LOGICA_OPERATIVA_POS_BAZZAR.md](../../../../tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md) |

---

## CHUSAR · protocolos

| Código | Archivo |
|--------|---------|
| CHUSAR caja | [CHUSAR_CAJA_BAZZAR_REPORT.md](./CHUSAR_CAJA_BAZZAR_REPORT.md) |
| P-12 | [P-12_PROTOCOLO_CAJERO_BOBINA.md](./P-12_PROTOCOLO_CAJERO_BOBINA.md) |
| P-13 | [P-13_MODULO_ENTREGAS_BOBINA.md](./P-13_MODULO_ENTREGAS_BOBINA.md) |
| Conexiones | [MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md](./MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md) |
| Índice P-01…P-13 | [INDICE.md](./INDICE.md) |

---

## Código fuente

| Pieza | Ruta |
|-------|------|
| Query bandeja | `report/src/lib/caja-bazzar/tickets-db.ts` |
| Edición cajero | `report/src/lib/caja-bazzar/tickets-edit.ts` |
| Handoff Empaque | `report/src/lib/caja-bazzar/handoff-bobeda.ts` |
| Guard sync | `report/src/lib/caja-bazzar/staging-guard.ts` |
| Sync depósito | `report/src/app/api/depositos/sync/route.ts` |
| APIs tickets | `report/src/app/api/tablet-bazzar/tickets/` |

---

## Guard sync depósito

409 si existe lote **`ABIERTO`** en bandeja (`ticket_bandeja_cajero`). `PENDIENTE_CAJA` no bloquea.

---

## Cruzado Tablet

Motor venta: [MODULO_POS_BANDEJA_UNICA_V2.md](../../2.4_tablet_bazzar/MODULO_POS_BANDEJA_UNICA_V2.md)

---

**Última actualización:** 2026-06-24
