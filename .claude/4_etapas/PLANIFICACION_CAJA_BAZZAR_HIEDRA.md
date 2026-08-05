# PLANIFICACIÓN — Caja Bazzar · Hiedra venenosa · Puerta chica

**ID:** `PLAN-CAJA-BAZZAR-HIEDRA-20260622`  
**Estado:** ✅ **PLANIFICACIÓN CERRADA** · P0 implementado · doc v2 ✅ [ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md](./ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md)  
**Tarea P0:** [TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md](./TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md)  
**CHUSAR:** [CHUSAR_CAJA_BAZZAR_REPORT.md](../2_modulos/2.3_report/caja_bazzar/CHUSAR_CAJA_BAZZAR_REPORT.md)  
**Índice numerado:** [INDICE.md](../2_modulos/2.3_report/caja_bazzar/INDICE.md)  
**App Report:** `/tablet-bazzar` · local `:3001`  
**Código navegador:** **2.3.2.2** (madre) · **2.3.2.2.0–6** (6 cajas tienda)

---

## 1. Decisión de arquitectura (debate cerrado)

| Tema | Decisión |
|------|----------|
| ¿App independiente para caja? | **No por ahora** — vive en **Report** · deploy Vercel compartido |
| ¿Split futuro? | Reevaluar cuando caja sea crítica 24/7 en pico |
| ¿Sales Report RIMEC? | **No tocar** — Excel · importador · `registro_ventas_general_v2` blindado |
| ¿Informe ventas Bazzar? | **Futuro cercano** — nace de **`bobeda_venta_pos`** (ORO limpio) |
| ¿Ventas importador? | **Después** — ahí se toca el dinero RIMEC |
| **¿Bandeja = Bobeda?** | **NO** — **2026-06-16 Director:** dos tablas · ver [TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md](./TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md) |

---

## 1b. Cambio de rumbo 2026-06-16 (Hiedra · puerta chica)

**Problema:** `ticket_venta_pos` mezclaba cola cajero con ORO histórico → imposible importar años anteriores sin ensuciar el turno.

**Solución canónica:**

| Tabla | Rol Hiedra |
|-------|------------|
| `ticket_bandeja_cajero` | Fase 1 operativa — cajero · CSV · desaparece al cerrar |
| `bobeda_venta_pos` | Fase 2 acumulación ORO — import histórico · Sales Report Bazzar · ENTREGADO |

Doc: [report/docs/ARQUITECTURA_DOS_TABLAS_CAJA_BOBINA.md](../report/docs/ARQUITECTURA_DOS_TABLAS_CAJA_BOBINA.md) · implementación [PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md](../report/docs/PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md)

**Estado:** ⏳ documentado · código pendiente

---

## 2. Hiedra venenosa — por qué esta puerta

**Fase 1 (actual):** infiltración por **venta tienda** — tablet COBRAR → stock real → ticket en BD → caja Report.

No replicamos Sales Report. Acumulamos **ORO retail** en una tabla canónica. Cuando haya masa crítica, Fase 2–4: dependencia → reemplazo → absorción Bazzar; más adelante reconciliación con venta importador.

Doc estrategia: `.claude/1_fundamentos/1.3_politicas/fundamentos_estrategicos.md`

---

## 3. Modelo de datos — depósitos vs tickets

| Concepto | Depósitos | Sesión piso | Bandeja cajero | Bobeda ORO |
|----------|-----------|-------------|----------------|------------|
| Partición física BD | **18 tablas** | `ticket_pos_staging` (+ líneas) | **`ticket_bandeja_cajero`** | **`bobeda_venta_pos`** |
| Partición lógica UI | 6 tiendas × 3 cat. | Tablet ventas | **6 cajas Report** | Empaque + informes |
| Origen venta | Stock `deposito_1_*_tienda` | Decremento staging | Copia desde staging | Handoff post-CSV o import Director |
| Ciclo de vida | Sync diario | Turno sesión | **Efímera** | **Permanente** |

**Idea profunda Hiedra:** 6 puertas en Report · **dos libros** en Supabase (bandeja + ORO) · informes Bazzar solo desde Bobeda.

> Legacy ⏳ migrar: `ticket_venta_pos` (1 tabla híbrida obsoleta).

---

## 4. Módulo Report = módulo de CAJA

`/tablet-bazzar` **no** es panel técnico de dev. Es el **módulo de caja Bazzar** donde trabaja el cajero.

### 4.1 Hub (2.3.2.2.0)

Selector con **6 tarjetas** (cards bonitas) — una por tienda:

| Código | cliente_id | Etiqueta |
|--------|------------|----------|
| 2.3.2.2.1 | 2100 | Fernando Adultos |
| 2.3.2.2.2 | 2900 | Fernando Niños |
| 2.3.2.2.3 | 2400 | San Martín Adultos |
| 2.3.2.2.4 | 2700 | San Martín Niños |
| 2.3.2.2.5 | 3100 | Palma Adultos |
| 2.3.2.2.6 | 3200 | Palma Niños |

### 4.2 Dentro de cada caja tienda — 3 sub-módulos (cards internas)

| # | Sub-módulo | Función |
|---|------------|---------|
| **A** | **Caja operativa** | Cola pendiente facturar · buscar cliente (nombre/cédula) · CSV export · marcar facturado · últimos movimientos |
| **B** | **Facturable / archivo caja** | Histórico facturado · trazabilidad ticket → factura · archivo por día/cierre |
| **C** | **Métricas / gráficos** | Pares hoy · por vendedor · tendencia · movimientos recientes (estándar retail) |

Cada sub-módulo respeta **pilares** en lectura (L·R·Mat·Color·grada vía `snapshot_json` + FK).

---

## 5. Flujo cajero (objetivo)

**Hoy (manual):** cliente lleva ticket físico → cajero re-ingresa.

**Objetivo Hiedra:**

1. Vendedor COBRAR en tablet (sesión atada a `cliente_id`).
2. Ticket en `ticket_venta_pos` con cliente opcional (`cedula`, `clients_bazaar_id`).
3. Cliente va **directo a caja** — sin ticket papel.
4. Cajero entra **su caja** (ej. San Martín Adultos) → busca por nombre/cédula.
5. Descarga **CSV canónico** → importa en facturador legacy → factura legal.
6. Marca ticket(s) como **CSV_DESCARGADO** → **Enviar a Empaque** → filas en **`bobeda_venta_pos`**.

Doc detalle: [07_FLUJO_CSV_CAJERO.md](../2_modulos/2.3_report/caja_bazzar/07_FLUJO_CSV_CAJERO.md) · [FLUJO_CANONICO_POS_BAZZAR.md](../report/docs/FLUJO_CANONICO_POS_BAZZAR.md)

---

## 6. Control de acceso — solo tu depósito y tu caja

**Regla mandatoria:** usuario Bazzar **solo** ve y opera:

- Su **depósito tienda** (`deposito_1_{cliente_id}_tienda`)
- Su **caja Report** (mismo `cliente_id`)

**Prohibido** que cajero San Martín vea Palma o venda en depósito ajeno. Tablet sesión + Report middleware + APIs filtradas por `cliente_id` del usuario.

Doc: [06_ACCESOS_SOLO_TU_DEPOSITO_CAJA.md](../2_modulos/2.3_report/caja_bazzar/06_ACCESOS_SOLO_TU_DEPOSITO_CAJA.md)

---

## 7. Estado implementación (2026-06-22)

| Pieza | Estado |
|-------|--------|
| Tablet COBRAR + decremento stock | ✅ |
| `ticket_venta_pos` + API listado | ✅ |
| `/tablet-bazzar` listado básico | ✅ |
| Hub 6 cajas + cards internas | ⏳ planificado |
| CSV cajero + estado FACTURADO | ⏳ |
| Acceso por tienda en auth | ⏳ |
| Informe ventas Bazzar agregado | ⏳ fase posterior |

Etapa código previa: [ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md](./ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md)

---

## 8. Orden de ejecución (desde esta planificación)

### ⏳ P0 — Dos tablas (MÁXIMA prioridad · pendiente)

Ver [TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md](./TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md) · sprints S1–S8 en [PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md](../report/docs/PLAN_IMPLEMENTACION_DOS_TABLAS_P0.md).

### Completado / en curso

1. Hub `/tablet-bazzar` — 6 cards tienda ✅
2. Ruta `/tablet-bazzar/[cliente_id]` — 3 sub-cards ✅
3. CSV export ✅ (rewire a bandeja en P0)
4. Handoff **Enviar a Empaque** ⏳
5. Matriz acceso `usuario → cliente_id` ⏳
6. Empaque tablet ⏳
7. Import histórico bobeda ⏳
8. Sales Report Bazzar desde bobeda ⏳

---

## 9. Referencias

| Doc | Ruta |
|-----|------|
| Índice numerado módulos | `caja_bazzar/INDICE.md` |
| CHUSAR agentes | `caja_bazzar/CHUSAR_CAJA_BAZZAR_REPORT.md` |
| App Report | `report/docs/PLANIFICACION_CAJA_BAZZAR.md` |
| Evidencia | `report/docs/evidencia/PLAN_CAJA_BAZZAR_20260622.json` |
| Tickets ORO arquitectura | `.claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md` |

---

**Planificación registrada — Director — 2026-06-22 · CHUSAR activo**
