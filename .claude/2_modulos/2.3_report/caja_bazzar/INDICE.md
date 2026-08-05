# ÍNDICE — Caja Bazzar Report (2.3.2.2)

**Madre navegador:** `2.3.2.2` · **App:** `/tablet-bazzar` · **Prod:** https://rimec-report.vercel.app/tablet-bazzar  
**Plan maestro:** [PLANIFICACION_CAJA_BAZZAR_HIEDRA.md](../../4_etapas/PLANIFICACION_CAJA_BAZZAR_HIEDRA.md) ✅  
**Módulo v2:** [MODULO_POS_BANDEJA_UNICA_V2.md](./MODULO_POS_BANDEJA_UNICA_V2.md) ✅  
**CHUSAR:** [CHUSAR_CAJA_BAZZAR_REPORT.md](./CHUSAR_CAJA_BAZZAR_REPORT.md)  
**Hub agrupación:** [CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md](../../CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md) · Tablet operativo + Report admin

---

## 0. Hub — selector 6 cajas tienda

| Código | Doc | Ruta app (objetivo) |
|--------|-----|---------------------|
| **2.3.2.2.0** | [00_HUB_SEIS_CAJAS.md](./00_HUB_SEIS_CAJAS.md) | `/tablet-bazzar` |

---

## 1. Documentos de planificación (numerados)

| # | Código doc | Archivo | Contenido |
|---|------------|---------|-----------|
| **1** | P-01 | [01_VISION_HIEDRA_PUERTA_CHICA.md](./01_VISION_HIEDRA_PUERTA_CHICA.md) | Estrategia · Bazzar ≠ Sales Report RIMEC |
| **2** | P-02 | [02_ARQUITECTURA_6_CAJAS_2_TABLAS.md](./02_ARQUITECTURA_6_CAJAS_2_TABLAS.md) | **6 UI · 2 tablas bandeja+Bobeda** |
| **2b** | P-02 legacy | [02_ARQUITECTURA_6_CAJAS_1_TABLA.md](./02_ARQUITECTURA_6_CAJAS_1_TABLA.md) | ⚠️ obsoleto |
| **3** | P-03 | [03_MODULO_CAJA_OPERATIVA.md](./03_MODULO_CAJA_OPERATIVA.md) | Cola · búsqueda · CSV · movimientos |
| **4** | P-04 | [04_MODULO_FACTURABLE_ARCHIVO.md](./04_MODULO_FACTURABLE_ARCHIVO.md) | Facturado · archivo · trazabilidad |
| **5** | P-05 | [05_MODULO_METRICAS_GRAFICOS.md](./05_MODULO_METRICAS_GRAFICOS.md) | KPIs · gráficos · estándar retail |
| **6** | P-06 | [06_ACCESOS_SOLO_TU_DEPOSITO_CAJA.md](./06_ACCESOS_SOLO_TU_DEPOSITO_CAJA.md) | Aislamiento tienda · anti cross-sell |
| **7** | P-07 | [07_FLUJO_CSV_CAJERO.md](./07_FLUJO_CSV_CAJERO.md) | Cliente sin ticket · import facturador |
| **8** | P-08 | [08_ID_DEPOSITO_OPERACION.md](./08_ID_DEPOSITO_OPERACION.md) | Clave canónica · informes futuros |
| **9** | P-09 | [09_BASE_DATOS_MOLECULAR_TICKETS.md](./09_BASE_DATOS_MOLECULAR_TICKETS.md) | BD molecular · índices · integridad |
| **10** | P-10 | [10_CEDULA_CLIENTE_NUEVO.md](./10_CEDULA_CLIENTE_NUEVO.md) | Cédula primero · CSV cliente nuevo |
| **11** | P-11 | [11_ROLES_USUARIOS_CAJA.md](./11_ROLES_USUARIOS_CAJA.md) | Matriz roles · 1 tienda por usuario |
| **12** | P-12 | [P-12_PROTOCOLO_CAJERO_BOBINA.md](./P-12_PROTOCOLO_CAJERO_BOBINA.md) | **Protocolo cajero · bandeja CSV · Bobeda** |
| **13** | P-13 | [P-13_MODULO_ENTREGAS_BOBINA.md](./P-13_MODULO_ENTREGAS_BOBINA.md) | Entregas · QC · consulta Bobeda |
| **Handoff** | — | [CHUSAR_HANDOFF_BOVEDA_ORO.md](./CHUSAR_HANDOFF_BOVEDA_ORO.md) | **Enviar a Empaque → bobeda** ✅ |
| **Factura legal** | **2.3.2.2.14** | [CHUSAR_FACTURA_LEGAL_CAJA.md](./CHUSAR_FACTURA_LEGAL_CAJA.md) | **Serial Activa · Siguiente · Anterior · bóveda** ✅ |
| **MS** | **2.3.2.2.10** | [MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md](./MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md) | Conexiones staging ↔ bandeja ↔ Bobeda |

---

## 1b. Cruzados obligatorios

| Tema | Doc |
|------|-----|
| Hiedra estrategia global | [fundamentos_estrategicos.md](../../1_fundamentos/1.3_politicas/fundamentos_estrategicos.md) §2 |
| Matriz roles holding | [MATRIZ_ROLES_ACCESOS_HOLDING.md](../../1_fundamentos/1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md) |
| Plan maestro etapa | [PLANIFICACION_CAJA_BAZZAR_HIEDRA.md](../../4_etapas/PLANIFICACION_CAJA_BAZZAR_HIEDRA.md) |
| Tarea P0 dos tablas | [TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md](../../4_etapas/TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md) ✅ |
| **Doc canónico v2** | [INDICE_POS_BAZZAR.md](../../../../report/docs/INDICE_POS_BAZZAR.md) |
| **Módulo Moria v2** | [MODULO_POS_BANDEJA_UNICA_V2.md](./MODULO_POS_BANDEJA_UNICA_V2.md) |
| Cierre doc | [ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md](../../4_etapas/ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md) |
| App Report | [PLANIFICACION_CAJA_BAZZAR.md](../../../../report/docs/PLANIFICACION_CAJA_BAZZAR.md) |
| Evidencia JSON | [PLAN_CAJA_BAZZAR_20260622.json](../../../../report/docs/evidencia/PLAN_CAJA_BAZZAR_20260622.json) |

## 2. Las 6 cajas tienda (módulos internos)

Cada caja comparte la **misma estructura A/B/C** (operativa · facturable · métricas), filtrada por `cliente_id`.

| Código | cliente_id | Tienda | Depósito venta | Doc |
|--------|------------|--------|----------------|-----|
| **2.3.2.2.1** | 2100 | Fernando Adultos | `deposito_1_2100_tienda` | [CAJAS/2100_FER_ADULTOS.md](./CAJAS/2100_FER_ADULTOS.md) |
| **2.3.2.2.2** | 2900 | Fernando Niños | `deposito_1_2900_tienda` | [CAJAS/2900_FER_NINOS.md](./CAJAS/2900_FER_NINOS.md) |
| **2.3.2.2.3** | 2400 | San Martín Adultos | `deposito_1_2400_tienda` | [CAJAS/2400_SM_ADULTOS.md](./CAJAS/2400_SM_ADULTOS.md) |
| **2.3.2.2.4** | 2700 | San Martín Niños | `deposito_1_2700_tienda` | [CAJAS/2700_SM_NINOS.md](./CAJAS/2700_SM_NINOS.md) |
| **2.3.2.2.5** | 3100 | Palma Adultos | `deposito_1_3100_tienda` | [CAJAS/3100_PAL_ADULTOS.md](./CAJAS/3100_PAL_ADULTOS.md) |
| **2.3.2.2.6** | 3200 | Palma Niños | `deposito_1_3200_tienda` | [CAJAS/3200_PAL_NINOS.md](./CAJAS/3200_PAL_NINOS.md) |

### Sub-módulos por caja (cards internas)

| Sub | Nombre | Doc genérico |
|-----|--------|--------------|
| **A** | Caja operativa | P-03 |
| **B** | Facturable / archivo | P-04 |
| **C** | Métricas / gráficos | P-05 |

---

## 3. Cruzado Tablet (2.4.2.3)

| Código | CHUSAR |
|--------|--------|
| 2.4.2.3 | [../../2.4_tablet_bazzar/CHUSAR_TICKETS_POS_STOCK.md](../../2.4_tablet_bazzar/CHUSAR_TICKETS_POS_STOCK.md) |
| 2.4.2.4 ⏳ | [../../2.4_tablet_bazzar/CHUSAR_TABLET_EMPAQUE.md](../../2.4_tablet_bazzar/CHUSAR_TABLET_EMPAQUE.md) · [P-01 3 módulos](../../2.4_tablet_bazzar/P-01_TRES_MODULOS_CICLO_CERRADO.md) |

---

## 4. Depósitos admin (2.3.2.1) — no confundir

Sync 18 tablas · admin gerencial — **distinto** de caja operativa diaria.

[../depositos/INDICE.md](../depositos/INDICE.md)

---

## 5. Legacy / etapa código POS

| Doc | Nota |
|-----|------|
| [../tickets_pos/CHUSAR_MONITOREO_TICKETS_POS.md](../tickets_pos/CHUSAR_MONITOREO_TICKETS_POS.md) | Redirige a CHUSAR caja |
| [../../4_etapas/ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md](../../4_etapas/ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md) | Etapa COBRAR + stock ✅ |

---

**Índice actualizado — 2026-06-24 · MODULO_POS v2 · doc cerrada**

---

## 6. P-12 / P-13 — mapa índice contable · implementación

**Flujo completo enumerado:** [report/docs/FLUJO_P12_P13_CAJA_BAZZAR.md](../../../../report/docs/FLUJO_P12_P13_CAJA_BAZZAR.md)

### 6.1 Códigos Moria · navegador (`arbol-modulos.json`)

| Código | Módulo | P-12 | P-13 | Estado |
|--------|--------|------|------|--------|
| **2.3.2.1** | Depósitos admin · sync | Cimiento stock | — | ✅ |
| **2.3.2.2.0** | Hub 6 cajas | Entrada cajero | — | ✅ |
| **2.3.2.2.1–6** | 6 tiendas (2100…3200) | Caja por tienda | — | ✅ |
| **2.3.2.2.x.1** | Card **A** operativa | Bandeja CSV · Bobeda | — | 🟡 |
| **2.3.2.2.x.2** | Card **B** facturable | Archivo FACTURADO | — | ✅ |
| **2.3.2.2.x.3** | Card **C** métricas | KPIs turno | — | ✅ |
| **2.3.2.2.7** | **P-12** protocolo cajero | CHUSAR | — | ✅ doc |
| **2.3.2.2.8** | **P-13** entregas Bobeda | — | CHUSAR | ✅ doc |
| **2.3.2.2.9** | Flujo P-12/P-13 · implementación | Índice APIs | Índice APIs | ✅ doc |
| **2.3.2.2.10** | Memoria secundaria conexiones | Staging · bandeja · Bobeda | Leyes agente | ✅ doc |
| **2.4.2.3** | Tablet COBRAR · staging | Alimenta bandeja | — | ✅ |
| **2.4.2.4** | Tablet Empaque | — | QC · ENTREGADO | ⏳ |

### 6.2 Matriz implementación (resumen)

| Código | Implementa | P-12 | P-13 | Estado |
|--------|------------|------|------|--------|
| 2.3.2.1 | Sync depósito · guard 409 | Cimiento | — | ✅ |
| 2.3.2.2.0 | Hub 6 cajas | Entrada cajero | — | ✅ |
| 2.3.2.2.1–6 · A | Card operativa | Bandeja CSV · Bobeda | — | 🟡 |
| 2.3.2.2.1–6 · B | Card facturable | Archivo FACTURADO | — | ✅ |
| 2.3.2.2.1–6 · C | Card métricas | KPIs turno | — | ✅ |
| 2.4.2.3 | Tablet COBRAR | Staging intermedia | — | ✅ |
| 2.4.2.4 | Tablet Empaque | — | QC · ENTREGADO | ⏳ |
| P-12 doc | Protocolo cajero | CHUSAR | — | ✅ doc |
| P-13 doc | Entregas Bobeda | — | CHUSAR | ✅ doc |

**Excluidos del flujo:** 2.3.1.1 Sales Report · 2.3.1.2 Ventas+Fotos · 2.3.1.7 Proceso importación.
