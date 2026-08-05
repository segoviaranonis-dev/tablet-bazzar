# ETAPA CERRADA — Documentación POS Bazzar · bandeja única v2

**ID:** `ETAPA-POS-BAZZAR-DOC-V2-20260624`  
**Apertura doc:** 2026-06-16 (dos tablas) · consolidación 2026-06-22–24  
**Cierre doc:** 2026-06-24 · **Director:** Héctor  
**Estado:** ✅ **CERRADA (documentación)** · código v2 ✅ · smoke piso ⏳

---

## Resumen

Documentación canónica del ecosistema **Tablet + Report caja + sync depósito** unificada en modelo **bandeja única** `ticket_bandeja_cajero` (sin escribir `ticket_pos_staging`). CHUSAR, índices módulo 2.4 / 2.3.2.2 y docs app alineados.

**Etapa código operativa** (smoke FI_FA, Empaque prod) sigue en [ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md](./ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md) — solo ejecución piso, no doc.

---

## Entregables documentación (cerrados)

| # | Entregable | Ruta canónica |
|---|------------|---------------|
| 1 | **Doc operativo madre** | `tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md` |
| 2 | Stock · sync depósito | `report/docs/LOGICA_STOCK_DEPOSITO_SYNC.md` |
| 3 | Índice holding POS | `report/docs/INDICE_POS_BAZZAR.md` |
| 4 | Flujo Director | `report/docs/FLUJO_CANONICO_POS_BAZZAR.md` v2 |
| 5 | Checklist agente | `report/docs/CHECKLIST_AGENTE_POS_BAZZAR.md` |
| 6 | Reglas bandeja | `tablet-bazzar/docs/REGLAS_BANDEJA_UNICA_POS.md` |
| 7 | Arquitectura capas | `tablet-bazzar/docs/ARQUITECTURA_SESION_STOCK_ORO.md` |
| 8 | Micro-ecosistema | `tablet-bazzar/docs/MICRO_ECOSISTEMA_POS_BAZZAR.md` |
| 9 | Módulo Moria tablet | `.claude/2_modulos/2.4_tablet_bazzar/MODULO_POS_BANDEJA_UNICA_V2.md` |
| 10 | Módulo Moria caja | `.claude/2_modulos/2.3_report/caja_bazzar/MODULO_POS_BANDEJA_UNICA_V2.md` |
| 11 | CHUSAR tickets v2 | `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TICKETS_POS_STOCK.md` |
| 12 | Tarea P0 dos tablas | [TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md](./TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md) ✅ doc+código |
| 13 | Evidencia cierre | `tablet-bazzar/docs/evidencia/CIERRE_DOC_POS_BAZZAR_V2_20260624.json` |

---

## Modelo documentado (v2)

```
Retail → sync Report → deposito_1_*_tienda
         ↓ sync-cart / CERRAR
ticket_bandeja_cajero (ABIERTO → PENDIENTE_CAJA → CSV)
         ↓ Enviar Empaque
bobeda_venta_pos (ORO)
```

**Legacy (solo lectura en docs históricos):** `ticket_pos_staging`, `ticket_venta_pos`.

**Migraciones:** 007 · 008 · 009 (FI_FA por lote).

---

## Etapas / sub-sesiones cerradas por esta documentación

| Doc etapa | Estado post-cierre |
|-----------|-------------------|
| [ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md](./ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md) | Doc ✅ · smoke ⏳ |
| [TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md](./TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md) | ✅ CERRADA |
| [PLANIFICACION_CAJA_BAZZAR_HIEDRA.md](./PLANIFICACION_CAJA_BAZZAR_HIEDRA.md) | Planificación ✅ · P0 doc cerrado |
| [SUBSESION_TABLET_VENDEDOR_STAGING_20260622.md](./SUBSESION_TABLET_VENDEDOR_STAGING_20260622.md) | Doc ✅ CERRADA |
| [ETAPA_TABLET_FRANCO_TIRADOR.md](./ETAPA_TABLET_FRANCO_TIRADOR.md) | MVP ✅ · doc indexado |
| `tablet-bazzar/docs/ETAPA_TICKETS_POS_STOCK.md` | Superseded → canónico v2 |

---

## Pendiente (no bloquea cierre doc)

- Smoke piso: CERRAR → caja → reabrir → sync depósito 2100
- Migración 009 en todos los entornos Supabase
- Import histórico Bobeda (script Director)
- Ajustes vista cadena (icono tuerca — lógica settings pendiente)

---

## Referencia rápida agente

1. Leer `report/docs/INDICE_POS_BAZZAR.md`
2. Leer `LOGICA_OPERATIVA_POS_BAZZAR.md` §1–18
3. No implementar dual staging+bandeja

---

**Cierre formal documentación POS Bazzar v2 — 2026-06-24**
