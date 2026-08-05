# CHUSAR — Report · Caja Bazzar (módulo cajero)

**Código madre:** `2.3.2.2` · **Hub:** `2.3.2.2.0` · **6 cajas:** `2.3.2.2.1–6`  
**Plan:** [PLANIFICACION_CAJA_BAZZAR_HIEDRA.md](../../4_etapas/PLANIFICACION_CAJA_BAZZAR_HIEDRA.md)  
**Tarea pendiente P0:** [TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md](../../4_etapas/TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md)  
**Índice:** [INDICE.md](./INDICE.md)  
**App:** `report/` → `/tablet-bazzar` · `:3001`

---

## Qué es este módulo

**El módulo de CAJA Bazzar en Report** — no monitoreo dev. El cajero factura desde aquí (CSV → facturador legacy → **Enviar a Empaque**). Parte **Hiedra venenosa Fase 1–2** · puerta chica tienda.

**Sales Report RIMEC = PROHIBIDO TOCAR.**

---

## Cambio de rumbo 2026-06-16 (Director)

| Antes (obsoleto) | Ahora (canónico) |
|------------------|------------------|
| 1 tabla `ticket_venta_pos` híbrida | **2 tablas:** `ticket_bandeja_cajero` + `bobeda_venta_pos` |
| Marcar FACTURADO | **Enviar a Empaque** → handoff a Bobeda |
| Bobeda mezclada con bandeja | Bobeda **solo** histórico + import + ENTREGADO |

Doc: [ARQUITECTURA_DOS_TABLAS_CAJA_BOBINA.md](../../../report/docs/ARQUITECTURA_DOS_TABLAS_CAJA_BOBINA.md) · [PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md](../../../report/docs/PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md)

**Estado código:** ✅ bandeja + bobeda · handoff · UI caja 2026-06-10 — legacy `ticket_venta_pos` solo fallback lectura.

---

## Leyes (agente)

1. **6 cajas UI · 2 tablas BD** — bandeja operativa + Bobeda ORO · filtrar por `cliente_id`.
2. **Usuario solo su caja y su depósito** — P-06 mandatorio.
3. **3 sub-cards por tienda:** A Caja operativa (bandeja) · B Archivo Bobeda · C Métricas.
4. **Cliente sin ticket físico** — búsqueda nombre/cédula · CSV export.
5. **Pilares en lectura** — L·R·Mat·Color·grada vía FK + snapshot.
6. **Tablet vende** (2.4.2.3) · **Report caja factura** — no invertir roles.
7. **Bobeda solo recibe** handoff post-CSV o import Director — **no** edición ítem a ítem en ORO.
8. **Usuarios en Bobeda:** solo marcan **`ENTREGADO`** (Empaque). Resto = Director.
9. **Pendientes bandeja:** sin filtro “solo hoy UTC”.
10. **Paridad queries:** Report bandeja = Tablet `/api/tickets/caja` — misma fuente `ticket_bandeja_cajero`.

---

## Rutas objetivo

| Ruta | Código |
|------|--------|
| `/tablet-bazzar` | 2.3.2.2.0 hub |
| `/tablet-bazzar/2100` … `/3200` | 2.3.2.2.1–6 |

---

## Docs numerados (planificación)

| # | Archivo |
|---|---------|
| P-01 | [01_VISION_HIEDRA_PUERTA_CHICA.md](./01_VISION_HIEDRA_PUERTA_CHICA.md) |
| P-02 | **[02_ARQUITECTURA_6_CAJAS_2_TABLAS.md](./02_ARQUITECTURA_6_CAJAS_2_TABLAS.md)** ← canónico |
| P-02 legacy | [02_ARQUITECTURA_6_CAJAS_1_TABLA.md](./02_ARQUITECTURA_6_CAJAS_1_TABLA.md) obsoleto |
| P-03 … P-13 | sin cambio índice |
| MS · 2.3.2.2.10 | [MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md](./MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md) |

---

## Protocolo cajero (CHUSAR — resumen)

1. Login Report · **solo su caja** (P-11).
2. Barra **Factura legal · Activa** — serial pendiente bóveda ([CHUSAR_FACTURA_LEGAL_CAJA.md](./CHUSAR_FACTURA_LEGAL_CAJA.md)).
3. Bandeja **`ticket_bandeja_cajero`** — ideal **VACÍA** al inicio.
4. Cliente: «¿Cuál es su nombre?» → match bandeja.
5. **Descargar CSV** → facturador legacy → estado `CSV_DESCARGADO`.
6. Asignar serial Activa a factura si falta · **Enviar a Empaque** → INSERT **`bobeda_venta_pos`** · avance Siguiente.
7. Empaque: Bobeda `PENDIENTE_ENTREGA` → `ENTREGADO`.

Doc completo: **P-12** · flujo [FLUJO_CANONICO_POS_BAZZAR.md](../../../report/docs/FLUJO_CANONICO_POS_BAZZAR.md)

---

## Estado código

| Pieza | Estado |
|-------|--------|
| COBRAR + staging + stock tablet | ✅ |
| Hub 6 cajas + cards A/B/C | ✅ |
| GET tickets · CSV · facturar (legacy 1 tabla) | 🟡 reemplazar P0 |
| Dos tablas bandeja + bobeda | ✅ P0 |
| Enviar a Empaque (handoff) | ✅ `handoff-bobeda.ts` · snapshot completo · serial legal obligatorio |
| Factura legal Activa / Siguiente / Anterior | ✅ `FacturaLegalBar` · `caja_factura_legal_turno` · migración 011 |
| UI vitales + CTA Bóveda ORO | ✅ 2026-06-10 |
| Empaque `/empaque` | 🟡 parcial Report |
| Import histórico bobeda | ⏳ |
| Sales Report Bazzar desde bobeda | ⏳ fase posterior |

---

## Prohibido

- JOIN `registro_ventas_general_v2`
- Mezclar bandeja y Bobeda en una tabla (nuevo código)
- Cajero cross-tienda sin rol DIOS
- Emitir venta desde Report (solo tablet)
- Import histórico en bandeja o staging

---

**CHUSAR Caja Bazzar — actualizado 2026-06-16 · cambio de rumbo dos tablas**
