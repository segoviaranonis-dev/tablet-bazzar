# 2.3.6 Depósitos Bazzar — subcuenta Report

**Código plan:** `2.3.6` · **App:** `report/` → `/depositos-bazzar`  
**Etapa:** ✅ [CERRADA 2026-06-17](../../../4_etapas/ETAPA_DEPOSITOS_BAZZAR_CERRADA.md)  
**CHUSAR:** 🟢 activo — [CHUSAR_ADMIN_DEPOSITOS_REPORT.md](../../2.6_depositos_bazzar/CHUSAR_ADMIN_DEPOSITOS_REPORT.md)

---

## Qué es

Administrador de **18 depósitos** Bazzar (6 tiendas × 3 categorías).  
**Report** opera sync y consulta; **Tablet** consume solo **tienda** (nivel 1).

| Rol | Producto | Ruta |
|-----|----------|------|
| Admin sync + vista 3 categorías | Report | `/depositos-bazzar` |
| Ejecución venta POS (cadena) | Tablet | `/cadena` · `/cadena/vista` |

**Panel control vs ejecución:** [DEPOSITO_BAZZAR_PANEL_CONTROL_VS_TABLET.md](./DEPOSITO_BAZZAR_PANEL_CONTROL_VS_TABLET.md)  
**Panel Control · catálogo + visión:** [CHUSAR_PANEL_CONTROL_BAZZAR.md](./CHUSAR_PANEL_CONTROL_BAZZAR.md) · **2.3.2.1.2** · etapa [ETAPA_PANEL_CONTROL_CABECERA_TABLET.md](../../4_etapas/ETAPA_PANEL_CONTROL_CABECERA_TABLET.md)

**Producción:** https://rimec-report.vercel.app/depositos-bazzar · deploy **2026-07-05** ([DEPLOY_REPORT_20260705.md](../DEPLOY_REPORT_20260705.md))  
**Local:** http://localhost:3001/depositos-bazzar  
**Hub agrupación:** [CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md](../../CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md) · § B.1 Depósitos admin

---

## Nomenclatura (18 tablas)

Patrón: `deposito_{1|2|3}_{cliente_id}_{tienda|guardado|averiado}`

| Nivel | Sufijo | Rol | Sync |
|-------|--------|-----|------|
| 1 | `tienda` | Stock piso · Tablet POS | ✅ Retail |
| 2 | `guardado` | Bodega | ⏳ ETL pendiente |
| 3 | `averiado` | Dañado | ⏳ ETL pendiente |

**Matriz completa cliente_id ↔ tabla:** [NOMENCLATURA_DEPOSITOS_BAZZAR.md](../../2.6_depositos_bazzar/NOMENCLATURA_DEPOSITOS_BAZZAR.md)

**Matriz tienda × tipo_v2 × marcas (Chusar):** [MATRIZ_TIENDAS_MARCAS_TIPO_V2.md](../../2.6_depositos_bazzar/MATRIZ_TIENDAS_MARCAS_TIPO_V2.md) — adultos calzado 1–4,7–9 · niños calzado 5–6 + confección 10–15

**Tickets POS (etapa abierta):** [TICKETS_POS_MONITOREO.md](../../../../report/docs/TICKETS_POS_MONITOREO.md) · **Caja Bazzar plan:** [caja_bazzar/INDICE.md](../caja_bazzar/INDICE.md) · [PLANIFICACION_CAJA_BAZZAR_HIEDRA.md](../../../4_etapas/PLANIFICACION_CAJA_BAZZAR_HIEDRA.md)

**BD:** migración `control_central/migrations/113_depositos_bazzar_18_tablas.sql` · evidencia `report/docs/evidencia/MIGRACION_113_DEPOSITOS_20260617.json`

---

## UI Admin (entregado)

| Control | Comportamiento |
|---------|----------------|
| **Hub 3 entes** | Columnas Fernando · San Martín · Palma · tiendas operativas por ente |
| **Toggle TIENDA / GUARDADO / AVERIADO** | Cambia hub al instante · URL `?categoria=` |
| Stats header | Total calzado · total uds · vendido (desde import) · import CSV |
| **Import CSV** | Global 3 archivos (admin) o 1 archivo (ente restringido) |
| Tarjeta tienda | Import fecha · lote · vendido · Abrir operativa por ramo |
| Detalle | Análisis + operativa calzado/confecciones · filtros índice |

**CHUSAR hub:** [CHUSAR_HUB_TRES_ENTES_METRICAS.md](./CHUSAR_HUB_TRES_ENTES_METRICAS.md) · **2.3.2.1.1.4**  
**Doc app:** [HUB_DEPOSITOS_BAZZAR.md](../../../../report/docs/HUB_DEPOSITOS_BAZZAR.md)

---

## API Report

| Método | Ruta | Notas |
|--------|------|-------|
| GET | `/api/depositos/hub?categoria=` | Hub 3 entes · stock ramo · import · vendido |
| GET | `/api/depositos/sync?categoria=tienda\|guardado\|averiado` | Conteos 6 depósitos (legacy admin) |
| POST | `/api/depositos/sync` | Sync tienda Retail · `{ cliente_id }` opcional |
| POST | `/api/depositos/import-csv` | Import POS · REPLACE/MERGE · multipart |
| GET | `/api/depositos/[cliente_id]?categoria=` | Productos TOP N |
| GET | `/api/depositos/[cliente_id]/filtros?categoria=` | Filtros pilares |
| GET | `/api/depositos/[cliente_id]/analisis?categoria=` | Árbol análisis |
| GET | `/api/depositos/[cliente_id]/operativa/confecciones` | Tabla confecciones · uds · montos |

**Fuente sync Retail:** `registro_st_vt_rc_reposicion` · `tipo_movimiento = stock` · `tiendas_marcas`  
**Fuente import CSV:** POS legacy · [CHUSAR Hiedra](./CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md)

**BD:** MIG-113 (18 tablas) · **MIG-131** `cantidad_importada` → `report/migrations/131_deposito_cantidad_importada.sql`

---

## Código

| Pieza | Ruta |
|-------|------|
| Config 18 tablas + hub entes | `report/src/lib/depositos/depositos-config.ts` |
| Hub client 3 entes | `report/src/app/depositos-bazzar/DepositosHubClient.tsx` |
| Admin page | `report/src/app/depositos-bazzar/page.tsx` |
| Hub API | `report/src/app/api/depositos/hub/route.ts` |
| Toggle categoría | `report/src/app/depositos-bazzar/components/CategoriaDepositoToggle.tsx` |
| Import CSV UI | `ImportCsvDepositoButton.tsx` |
| Tablet config (tienda) | `tablet-bazzar/lib/depositos-config.ts` |

---

## Subcuenta abierta 2.3.2.1.1 · Panel Depósito Hiedra

| Código | Función | Estado |
|--------|---------|--------|
| **2.3.2.1.1** | Panel admin · sectores pilares · reglas · muestrario · mensajería tablet | 🟢 ABIERTA |
| **2.3.2.1.1.1** | Pestaña **Operativa calzado** · triángulo + grilla stock (paridad tablet) | ✅ UI cerrada 2026-06-27 |
| **2.3.2.1.1.1b** | Pestaña **Operativa confecciones** · tabla filas · uds · precio · subtotal | ✅ UI 2026-06-10 |
| **2.3.2.1.1.2** | Pestaña **Filtros por índice** · puente Motor Precios → stock | ✅ UI cerrada 2026-06-27 |
| **2.3.2.1.1.3** | Import CSV · pilares · bulk · ritual 4708 | 🟡 import hub ✅ 2026-06-28 · PASS piso tablet ⏳ |
| **2.3.2.1.1.4** | Hub 3 entes · fecha import · lote · vendido | ✅ UI+API+MIG-131 · [CHUSAR](./CHUSAR_HUB_TRES_ENTES_METRICAS.md) |

| Doc | Enlace |
|-----|--------|
| **Hub 3 entes · métricas** | [CHUSAR_HUB_TRES_ENTES_METRICAS.md](./CHUSAR_HUB_TRES_ENTES_METRICAS.md) · [doc app](../../../../report/docs/HUB_DEPOSITOS_BAZZAR.md) |
| Visión | [VISION_PANEL_DEPOSITO_HIEDRA_2.3.2.1.1.md](../../../../report/docs/VISION_PANEL_DEPOSITO_HIEDRA_2.3.2.1.1.md) |
| CHUSAR | [CHUSAR_ADMIN_STOCK_BAZZAR_DINAMICO.md](./CHUSAR_ADMIN_STOCK_BAZZAR_DINAMICO.md) |
| **Vista Operativa calzado** | [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](./CHUSAR_VISTA_OPERATIVA_DEPOSITO.md) · [doc app](../../../../report/docs/VISTA_OPERATIVA_DEPOSITO_BAZZAR.md) |
| **Vista Operativa confecciones** | [CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md](./CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md) · [doc app](../../../../report/docs/VISTA_OPERATIVA_CONFECCIONES_DEPOSITO.md) |
| **Dual ramo calzado/confección** | [DEPOSITO_DUAL_RAMO_CALZADO_CONFECCIONES.md](../../../../report/docs/DEPOSITO_DUAL_RAMO_CALZADO_CONFECCIONES.md) |
| **Panel control vs Tablet** | [DEPOSITO_BAZZAR_PANEL_CONTROL_VS_TABLET.md](./DEPOSITO_BAZZAR_PANEL_CONTROL_VS_TABLET.md) |
| **CABECERA DE FILTROS** | [CABECERA_DE_FILTROS.md](../../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md) — estándar · paridad tablet/report/RIMEC |
| **Filtros por índice (puente motor)** | [CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md](./CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md) · [PUENTE](../../../3_arquitectura/3.3_integracion/PUENTE_MOTOR_PRECIOS_DEPOSITO_BAZZAR.md) |
| **Tablet cajas matriz 18** | [CHUSAR_TABLET_DEPOSITO_CAJAS.md](../../2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_CAJAS.md) · cierre [ETAPA_DEPOSITO_OPERATIVA_TABLET_CAJAS_CERRADA.md](../../../4_etapas/ETAPA_DEPOSITO_OPERATIVA_TABLET_CAJAS_CERRADA.md) |
| **Import CSV Hiedra** | [CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md](./CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md) |
| **Import CSV · pilares + timing** | [CHUSAR_IMPORT_CSV_PILARES_PROVISION.md](./CHUSAR_IMPORT_CSV_PILARES_PROVISION.md) · `:3004` **2.3.2.1.1.3** |
| **Registro integración completa** | [CHUSAR_DEPOSITO_INTEGRACION_COMPLETA_20260628.md](./CHUSAR_DEPOSITO_INTEGRACION_COMPLETA_20260628.md) · [doc app](../../../../report/docs/DEPOSITO_BAZZAR_INTEGRACION_20260628.md) |
| Mensajería | [CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md](./CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md) |
| **Prueba integridad stock** | [CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md](../../2.4_tablet_bazzar/CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md) · mañana Fase 1 |
| Etapa | [ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO.md](../../../4_etapas/ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO.md) |

---

## Subcuentas 2.3.6.x

| Código | Función | Estado |
|--------|---------|--------|
| 2.3.6 | Índice · etapa | ✅ cerrada |
| 2.3.6.1 | Admin sync · toggle 3 categorías | ✅ CHUSAR |
| 2.3.6.2 | Análisis / abrir depósito | ✅ tienda |
| 2.3.6.3 | Consumo Tablet | ✅ solo tienda |
| 2.3.6.4 | Matriz tienda × marca × tipo_v2 | ✅ Chusar 2026-06-17 |
| 2.3.6.5 | Import CSV · Hiedra Venenosa · REPLACE/MERGE | 🟢 CHUSAR 2026-06-10 |
| 2.3.6.5.1 | Provisión pilares · bulk REPLACE · timing · precio LPN | 🟡 import hub ✅ 2026-06-28 · PASS tablet ⏳ · [doc](./CHUSAR_IMPORT_CSV_PILARES_PROVISION.md) · [maestro](./CHUSAR_DEPOSITO_INTEGRACION_COMPLETA_20260628.md) |
| 2.3.6.5.2 | Hub 3 entes · `cantidad_importada` · vendido desde import | ✅ 2026-06-30 · [CHUSAR](./CHUSAR_HUB_TRES_ENTES_METRICAS.md) · MIG-131 |
| 2.3.6.6 | Operativa confecciones · tabla filas · uds · montos | ✅ UI 2026-06-10 |

---

## Protocolo Chusar · mapa documental

| Keyword Director | Acción agente | Este módulo |
|------------------|---------------|-------------|
| **Documenta** | Crear/actualizar `.md` + código en catálogo | Índice + CHUSAR + `report/docs/` |
| **Documentación Chusar** | Integrar memoria · `arbol-modulos.json` · `memoria-web/` | Nodo **2.3.2.1.1.4** NEW |
| **Verifica índice** | Auditar enlaces INDICE ↔ CHUSAR ↔ app | Esta sección |

Protocolo completo: [PROTOCOLO_DOCUMENTACION_CHUSAR.md](../../../1_fundamentos/1.1_protocolos/PROTOCOLO_DOCUMENTACION_CHUSAR.md)

**Checklist Hiedra (2026-06-30):**

| Ítem | Doc | Código |
|------|-----|--------|
| Import CSV | [CHUSAR Hiedra](./CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md) · [MAPA sdfm](../../../../report/docs/MAPA_CSV_SDFM_DEPOSITO_FERNANDO.md) § ratificación | `import-csv/route.ts` |
| Hub métricas | [CHUSAR hub](./CHUSAR_HUB_TRES_ENTES_METRICAS.md) | `hub/route.ts` · `DepositosHubClient.tsx` |
| MIG-131 prod | `report/migrations/131_*` | `aplicar_migracion_131.mjs` |
| Operativa calzado | [CHUSAR operativa](./CHUSAR_VISTA_OPERATIVA_DEPOSITO.md) | `TabOperativaCalzado.tsx` |
| Operativa confecciones | [CHUSAR confecciones](./CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md) | `TabOperativaConfecciones.tsx` |
| Integración maestro | [CHUSAR integración](./CHUSAR_DEPOSITO_INTEGRACION_COMPLETA_20260628.md) | — |

---

## Reglas

- **Sales Report** (`registro_ventas_general_v2`) — blindado · no mezclar.
- Sync **nunca** escribe guardado/averiado hasta ETL dedicado.
- Tablet **solo** lee `deposito_1_*_tienda`.
- Marcas por tienda: matriz **2.3.6.4** — adultos ≠ niños · confección 10–15 solo tiendas niños.

---

**Shibboleth:** Chayanne el mejor
