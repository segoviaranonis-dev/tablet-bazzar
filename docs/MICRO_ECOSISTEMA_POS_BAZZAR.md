# Micro-ecosistema POS Bazzar — Tablet + Report + BD

**Versión:** 1.0 · **2026-06-16** · **Prioridad:** MÁXIMA  
**Apps:** Tablet `:3000` · Report `:3001` · **BD:** Supabase compartida  
**Plan código:** [PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md](../../report/docs/PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md)

---

## 1. Visión

Tres módulos tablet + caja Report forman un **micro-ecosistema cerrado** por tienda (`cliente_id`). No comparte lógica con Sales Report RIMEC.

| Módulo | App | Tablas que toca |
|--------|-----|-----------------|
| Depósito | Tablet `/deposito` | `deposito_1_*_tienda` (lectura) |
| Venta | Tablet `/cadena` | staging + depósito ± |
| Empaque | Tablet `/empaque` ⏳ | **`bobeda_venta_pos`** solo |
| Caja | Report `/tablet-bazzar` | **`ticket_bandeja_cajero`** + handoff bobeda |

---

## 2. Mapa de tablas (robustez)

```
                    ┌─────────────────────────┐
                    │ registro_st_vt_rc_*     │  Retail Excel
                    └───────────┬─────────────┘
                                │ sync (Report) · DELETE+INSERT
                                ▼
┌───────────────────────────────────────────────────────────┐
│ deposito_1_{2100|2900|2400|2700|3100|3200}_tienda  (×6) │
└───────────────────────────┬───────────────────────────────┘
                            │ sync-cart / cancelar (± stock)
                            ▼
              ticket_bandeja_cajero  ◄─── tablet + Report caja
              (ABIERTO → PENDIENTE_CAJA → CSV → handoff)
                            │ Enviar a Empaque
                            ▼
              bobeda_venta_pos  ◄─── Empaque · import histórico
```

**Doc:** [LOGICA_OPERATIVA_POS_BAZZAR.md](./LOGICA_OPERATIVA_POS_BAZZAR.md)

**Legacy (no escribir):** `ticket_pos_staging`, `ticket_venta_pos`.

**Prohibido:** mezclar bandeja y Bobeda en una tabla (error legacy `ticket_venta_pos`).

---

## 3. Comunicación entre apps

| Canal | Realidad |
|-------|----------|
| Tablet ↔ Report HTTP | **No existe** — solo Postgres |
| Consistencia | Mismas reglas SQL en ambos repos |
| Riesgo actual | Queries duplicadas desincronizadas |
| Objetivo P0 | Función/query compartida bandeja + handoff único en Report |

---

## 4. Aislamiento por tienda (6×6)

| `cliente_id` | Depósito | Staging | Bandeja | Bobeda |
|--------------|----------|---------|---------|--------|
| 2100 | ✅ solo 2100 | ✅ | ✅ | ✅ |
| … | … | … | … | … |

Toda API valida sesión + `cliente_id`. Cross-store dock = **lectura** stock ajeno, **venta prohibida**.

---

## 5. Estados — quién ve qué

| Estado | Tabla | Tablet Ventas | Tablet Empaque | Report Caja |
|--------|-------|---------------|----------------|-------------|
| ABIERTO | bandeja | Panel FACTURAS (reabierto) | — | — |
| PENDIENTE_CAJA | bandeja | En caja Report (solo abrir) | — | Bandeja operativa |
| CSV_DESCARGADO | bandeja | — | — | Bandeja A |
| PENDIENTE_ENTREGA | bobeda | — | Bandeja | — |
| ENTREGADO | bobeda | — | Archivo | Card B ⏳ |

---

## 6. Leyes de robustez

1. **Transacciones** — staging+stock, handoff bandeja→bobeda: BEGIN/COMMIT.
2. **Guard 409** — sync depósito bloqueado si bandeja `ABIERTO` (no PENDIENTE_CAJA).
3. **Sin filtro “hoy”** en pendientes bandeja/bobeda operativos.
4. **Bobeda inmutable** — usuarios solo `ENTREGADO`; Director ANULADO.
5. **Import histórico** — solo `bobeda_venta_pos`, nunca bandeja.
6. **Build** — `npm run build` ambos repos antes de smoke.

---

## 7. CHUSAR tablet (índice)

| Código | Doc |
|--------|-----|
| 2.4.2.3 | [CHUSAR_TICKETS_POS_STOCK.md](../.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TICKETS_POS_STOCK.md) |
| 2.4.2.3.1 | [CHUSAR_TABLET_VENDEDOR_STAGING.md](../.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_VENDEDOR_STAGING.md) |
| 2.4.2.4/5 | [CHUSAR_TABLET_EMPAQUE.md](../.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_EMPAQUE.md) |
| Ciclo 3 módulos | [P-01_TRES_MODULOS_CICLO_CERRADO.md](../.claude/2_modulos/2.4_tablet_bazzar/P-01_TRES_MODULOS_CICLO_CERRADO.md) |

---

## 8. Tarea pendiente

⏳ [TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md](../.claude/4_etapas/TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md)

**Documentación lista · código pendiente autorización Director.**
