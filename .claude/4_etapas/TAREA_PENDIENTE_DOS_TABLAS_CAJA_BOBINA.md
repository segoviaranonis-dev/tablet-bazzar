# TAREA CERRADA — Separación Bandeja cajero / Bobeda ORO

**ID:** `TAREA-DOS-TABLAS-20260616`  
**Estado:** ✅ **CERRADA** 2026-06-24 · documentación ✅ · código v2 ✅ · smoke piso ⏳  
**Cierre doc:** [ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md](./ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md)

---

## Resultado

| # | Tarea | Estado |
|---|-------|--------|
| T1 | Tablas `ticket_bandeja_cajero` + `bobeda_venta_pos` | ✅ migraciones 005–009 |
| T2 | Backfill legacy | ✅ según entorno |
| T3 | Tablet CERRAR → bandeja | ✅ `tickets-staging.ts` |
| T4 | Report caja + CSV | ✅ `caja-bazzar/*` |
| T5 | Enviar a Empaque | ✅ `handoff-bobeda.ts` |
| T6 | Tablet caja-read | ✅ bandeja única |
| T7 | Empaque → bobeda | ✅ |
| T8 | Deprecar escritura legacy | ✅ no escribir staging/venta_pos |
| T9 | Import histórico Director | ⏳ script pendiente |
| T10 | CHUSAR + módulos Moria | ✅ [MODULO_POS_BANDEJA_UNICA_V2](../2_modulos/2.4_tablet_bazzar/MODULO_POS_BANDEJA_UNICA_V2.md) |

---

## Documentación canónica v2

Ver [INDICE_POS_BAZZAR.md](../../../report/docs/INDICE_POS_BAZZAR.md) — reemplaza plan P0 y docs dual staging.

---

**Cerrada — Director — 2026-06-24**
