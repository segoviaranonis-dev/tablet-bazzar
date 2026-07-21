# 2.3.1.7 Proceso de importación — índice Moria (Report)



**Código:** **2.3.1.7** · **App:** `report/` · **Hub:** `/proceso-importacion`  

**CHUSAR padre:** [CHUSAR_CICLO_IMPORTACION_REPORT.md](./CHUSAR_CICLO_IMPORTACION_REPORT.md)  

**Actualizado:** 2026-07-18 · **Maratón proformas** · [CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md](./CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md) · etapa **2.3.1.27** · [ETAPA](../../../4_etapas/ETAPA_IMPORTACION_PROGRAMADOS_20260718.md)



---



## Norte



Ciclo importadora RIMEC en Report — paridad Streamlit **CICLO DE IMPORTACIÓN** (4 cards en launcher Streamlit · solo 2.3.1.7).  

**Cimiento:** [PIEDRA_CIMIENTO_COSTO_ARTICULO.md](../../1_fundamentos/PIEDRA_CIMIENTO_COSTO_ARTICULO.md) — COSTO · ARTÍCULO · estrategias.  
**Mapa motor + estrategias:** [CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md](../motor_precios/CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md) · **Cardinalidad bib↔listado 1:N:** §3.1 (**2.3.1.7.0.3** · Documenta 2026-07-21)

**Importación Excel (Corazón 2)** vive **dentro** de Motor de precios (2.3.1.7.1), no como card hermana en el hub ciclo.



---



## Plan de cuentas



| Código | Subcuenta | Ruta Report | CHUSAR | Inventario |

|--------|-----------|-------------|--------|------------|

| **2.3.1.7** | Proceso importación | `/proceso-importacion` | [CHUSAR_CICLO](./CHUSAR_CICLO_IMPORTACION_REPORT.md) | este archivo |

| **2.3.1.7.1** | Motor de precios | `…/motor-precios` | [CHUSAR_MOTOR](../motor_precios/CHUSAR_MOTOR_PRECIOS.md) | [motor_precios/](../motor_precios/INDICE.md) |

| 2.3.1.7.1.1 | Biblioteca histórico | `…/motor-precios/biblioteca` | idem | [HISTORIAL](../motor_precios/HISTORIAL_BIBLIOTECAS.md) |

| **2.3.1.7.1.1.1** | **Copiar casos bib→bib (clon)** | editor `…/biblioteca/[id]` | [CHUSAR_COPIAR_BIB](../motor_precios/CHUSAR_COPIAR_BIBLIOTECA_EDITOR.md) | [COPIAR_BIB_EDITOR](../motor_precios/COPIAR_CASOS_BIBLIOTECA_EDITOR.md) |

| 2.3.1.7.1.2 | Crear biblioteca | `…/biblioteca/nueva` | idem | [CREAR](../motor_precios/CREAR_BIBLIOTECA.md) |

| **2.3.1.7.2** | Importación precios *(hijo 7.1)* | `…/motor-precios/importacion-precios` | [CHUSAR_IMP](./CHUSAR_IMPORTACION_PRECIOS.md) | [IMPORTACION_PRECIOS.md](./IMPORTACION_PRECIOS.md) |

| 2.3.1.7.2.0 | Paso 0 carga | `…/importacion-precios/nuevo` | [CHUSAR_P0](./CHUSAR_IMPORTACION_PRECIOS_PASO0.md) | [PASO0](./PASO0_CARGA_EXCEL.md) |

| 2.3.1.7.2.1 | Paso 1 Memoria | `…/nuevo/memoria` | CHUSAR_IMP | IMPORTACION_PRECIOS |

| **2.3.1.7.2.1.1** | **Copiar casos biblioteca anterior** | Memoria · botón + API | [CHUSAR_COPIAR](./CHUSAR_COPIAR_CASOS_BIBLIOTECA.md) | [COPIAR_CASOS](./COPIAR_CASOS_BIBLIOTECA_ANTERIOR.md) |

| 2.3.1.7.2.2–4 | Pasos Preview · Conversión · Cierre | `…/nuevo/preview` … `cierre` | CHUSAR_IMP | [IMPORTACION_PRECIOS.md](./IMPORTACION_PRECIOS.md) |

| — | Historial listas | `…/importacion-precios/historial` | CHUSAR_IMP | IMPORTACION_PRECIOS |

| **2.3.1.7.3** | Intención compra | `…/intencion-compra` | [CHUSAR_IC](./CHUSAR_INTENCION_COMPRA.md) | [INTENCION_COMPRA.md](./INTENCION_COMPRA.md) · **[Problema 2 LP](./CHUSAR_IC_PROBLEMA_2_LISTADO_LP.md)** · [TABLAS §7.3](./TABLAS_MUDANZA_IC_DIG_PP.md) |

| 2.3.1.7.3.1 | Bandeja IC | `…/intencion-compra/bandeja` | CHUSAR_IC | [IC_BANDEJA.md](./IC_BANDEJA.md) |

| 2.3.1.7.3.2 | Nueva IC | `…/intencion-compra/nueva` | CHUSAR_IC | INTENCION_COMPRA |
| **2.3.1.7.3.3** | **Inyección datos en tránsito · IC Excel batch** | `…/intencion-compra/import-batch` *(fase 2)* | [CHUSAR_INYECCION_DATOS_TRANSITO_IC](./CHUSAR_INYECCION_DATOS_TRANSITO_IC.md) | ✅ **373 IC script** · [CERRADA](../../../4_etapas/ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709_CERRADA.md) |
| **2.3.1.7.3.3.1** | **Ejecución inyección 2026-07-09** | script | [CHUSAR_INYECCION_IC_EJECUCION_20260709](./CHUSAR_INYECCION_IC_EJECUCION_20260709.md) | ✅ IC-0112→0484 · orden invertido · prod |
| **2.3.1.7.3.4** | **Metodología IC administrativa (liviana)** | doc | [CHUSAR_IC_METODOLOGIA_ADMINISTRATIVA_20260718](./CHUSAR_IC_METODOLOGIA_ADMINISTRATIVA_20260718.md) | 🟢 **2026-07-18** · D1–D4 · sin LP obligatorio |

| **2.3.1.7.4** | Digitación | `…/digitacion` | [CHUSAR_DG](./CHUSAR_DIGITACION.md) | [DIGITACION.md](./DIGITACION.md) · [TABLAS §7.4](./TABLAS_MUDANZA_IC_DIG_PP.md) |

| 2.3.1.7.4.1 | Bandeja digitación | `…/digitacion` | CHUSAR_DG | [MAPA_DG_BANDEJA](./MAPA_ACCESO_RAPIDO_DG_BANDEJA.md) |

| **2.3.1.7.4.1a** | **Admin Compra previa** | `…/digitacion?ramo=compra_previa` | CHUSAR_DG | IC `categoria_id=2` · `AUTORIZADO` sin PP |

| **2.3.1.7.4.1b** | **Admin Programado** | `…/digitacion?ramo=programado` | CHUSAR_DG | IC `categoria_id=3` · bandeja + autorizadas · caso proforma 8604 |

| 2.3.1.7.4.2 | Asignar IC → PP | `…/digitacion/asignar/[icId]` | CHUSAR_DG | [DIGITACION_ASIGNAR.md](./DIGITACION_ASIGNAR.md) |

| **2.3.1.7.4.3** | **Multi-asignar IC → PP (PROGRAMADO)** | `…/digitacion/asignar-lote` | [CHUSAR_DIGITACION_MULTI_ASIGNAR](./CHUSAR_DIGITACION_MULTI_ASIGNAR_PROGRAMADO.md) | 🟢 **2026-07-19** · N IC → 1 PP · [DIGITACION_ASIGNAR_LOTE](./DIGITACION_ASIGNAR_LOTE.md) |

| **2.3.1.7.4.4** | **Bandeja · acordeón embarque + filtros multi** | `…/digitacion` pendientes | [CHUSAR_DIGITACION_BANDEJA_FILTROS](./CHUSAR_DIGITACION_BANDEJA_FILTROS_ACORDEON.md) | 🟢 **2026-07-20** · vendedor · nro fábrica · multi-select |

| **2.3.1.7.5** | Pedido proveedor | `…/pedido-proveedor` | [CHUSAR_PP](./CHUSAR_PEDIDO_PROVEEDOR.md) | [PEDIDO_PROVEEDOR.md](./PEDIDO_PROVEEDOR.md) · [TABLAS §7.5](./TABLAS_MUDANZA_IC_DIG_PP.md) |

| 2.3.1.7.5.1 | Lista por quincena | `…/pedido-proveedor` | CHUSAR_PP | PEDIDO_PROVEEDOR |

| **2.3.1.7.5.1a** | **Lista Compra previa** | `…/pedido-proveedor?ramo=compra_previa` | CHUSAR_PP | PP `categoria_id=2` |

| **2.3.1.7.5.1b** | **Lista Programado** | `…/pedido-proveedor?ramo=programado` | CHUSAR_PP | PP `categoria_id=3` · PP programación |

| **2.3.1.7.5.2** | **Mapa 5 botones acceso rápido** | fila lista PP | CHUSAR_PP | [MAPA_PP_LISTA](./MAPA_ACCESO_RAPIDO_PP_LISTA.md) |

| **2.3.1.7.5.3** | **Detalle PP · 4 pestañas** | `…/pedido-proveedor/[ppId]` | CHUSAR_PP | [MAPA_PP_DETALLE](./MAPA_ACCESO_RAPIDO_PP_DETALLE.md) · [CHUSAR_PP_CABECERA](./CHUSAR_PP_CABECERA_EDITABLE.md) |
| **2.3.1.7.5.3.L** | **Botón logística · Fecha de entrega Real** | cabecera PP CP+PROGRAMADO | [CHUSAR_LOGISTICA_OK](../logistica_ok/CHUSAR_LOGISTICA_OK.md) | 🟢 **2026-07-19** · bandera · sync FI → pendiente confirmación · **2.3.1.28** |

| **2.3.1.7.5.3.5** | **Administrador de IC · PROGRAMADO** | `?tab=admin-ic` | [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) | 🟢 **CANÓNICO 2026-07-10** · abandona IC=FI · paneles IC↔PF · vínculo monto |
| **2.3.1.7.5.3.5.1** | **Protocolo Chusa · FI por lote** | `?tab=admin-ic` | [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) | 🟢 **CANÓNICO 2026-07-11** · 3 niveles · contadores · canon · lote |
| **2.3.1.7.5.3.5.2** | **Auditoría PP-28 · Chusa · veneno** | doc | [AUDITORIA_ADMIN_IC_PP28_CHUSA_VENENO_20260711](./AUDITORIA_ADMIN_IC_PP28_CHUSA_VENENO_20260711.md) | 🟢 **2026-07-11** · OK condicional lote · CSV post-FI |
| **2.3.1.7.5.3.5.3** | **DOC PP-28 · lote · errores · réplica PROGRAMADO** | doc | [DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) | 🟢 **2026-07-11** · 13 errores · sin LPN · handoff mañana |
| **2.3.1.7.5.3.9** | **DOC Proceso PROGRAMADO completo · errores · soluciones** | doc | [DOC_PROCESO_PROGRAMADO_COMPLETO_ERRORES_SOLUCIONES_20260711](./DOC_PROCESO_PROGRAMADO_COMPLETO_ERRORES_SOLUCIONES_20260711.md) | 🟢 **2026-07-11** · Motor→IC→PP→FI · PP-16/17/28 · handoff |

| **2.3.1.7.5.3.7** | **Reconstrucción SHOP proforma · PP-28** | doc | [CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) | 🟢 **2026-07-11** · `_shop` Excel canónico · 8051/2026 · etapa abierta |
| **2.3.1.7.5.3.10** | **Vulnerabilidad import proforma · pilares** | doc | [CHUSAR_VULNERABILIDAD_IMPORT_PROFORMA_PILARES](./CHUSAR_VULNERABILIDAD_IMPORT_PROFORMA_PILARES.md) | 🟡 **2026-07-12** · error `4.02.03.009` · motor TS añadido · backfill parcial |
| **2.3.1.7.5.3.11** | **DOC Reparación pilares · casos · PF programado** | doc | [DOC_REPARACION_PROGRAMADO_PILARES_CASOS_20260712](./DOC_REPARACION_PROGRAMADO_PILARES_CASOS_20260712.md) | 🟢 **2026-07-12** · PELE sync BCL · FI flota · ley biblioteca |
| **2.3.1.7.5.3.12** | **Error Admin IC · botón verde no recalcula FI** | doc | [4.02.03.010](../../../5_errores/detalle/4.02.03.010_admin-ic-boton-verde-no-recalcula-fi.md) | 🟡 **2026-07-12** · PP-0015 · hotfix `regenerar` |
| **2.3.1.13.2** | **DOC Track 2 · contexto día operativo 13-07-26** | doc | [DOC_TRACK2_CONTEXTO_DIA_20260713](./DOC_TRACK2_CONTEXTO_DIA_20260713.md) | 🟢 **2026-07-13** · briefing Cursor · réplica PROGRAMADO |

| 2.3.1.7.5.3.3 | **Protocolo import programado SHOP↔IC** | doc | [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) | Import PPD ✅ · preview SHOP×BRAND · FI auto ⛔ |
| **2.3.1.7.5.3.3.5** | **CHUSAR PP-17 · 3ª proforma PROGRAMADO** | doc | [CHUSAR_PP17_TERCERA_PROFORMA_PROGRAMADO](./CHUSAR_PP17_TERCERA_PROFORMA_PROGRAMADO.md) | 🟡 handoff 2026-07-09 · 98 IC · evento #45 · sin hotfix código |
| **2.3.1.7.5.3.3.6** | **CHUSAR Deploy Alfredo prod 2026-07-09** | doc | [CHUSAR_DEPLOY_ALFREDO_20260709](./CHUSAR_DEPLOY_ALFREDO_20260709.md) | ✅ EMAXCONN · 504 conversión · motor→PP |
| **2.3.1.7.5.3.3.2** | **CHUSAR Caso Alfredo PP-16** | doc | [CHUSAR_CASO_ALFREDO_PP16_PROGRAMADO](./CHUSAR_CASO_ALFREDO_PP16_PROGRAMADO.md) | ✅ **CERRADO** 2026-07-09 · error `4.02.03.006` resuelto |
| **2.3.1.7.5.3.3.4** | **CHUSAR PP-16 éxito · errores detalle** | doc | [CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE](./CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md) | ✅ 722 PPD · 39 FI · 8.880 pares |
| **2.3.1.7.5.3.3.3** | **CHUSAR Borrar import proforma** | doc | [CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO](./CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO.md) | ✅ 2026-07-09 · gate venta Web · reserva FI no bloquea |
| **2.3.1.7.5.3.4** | **CHUSAR PROGRAMADO instrumento venta AM** | doc | [CHUSAR_PROGRAMADO_INSTRUMENTO_VENTA_AM](./CHUSAR_PROGRAMADO_INSTRUMENTO_VENTA_AM.md) | ✅ aritmética 100% BD · tier LP · audit script |
| 2.3.1.7.5.3.4 | **CSV veneno Carlos · ventas + inicial** | `csv-ventas` · `csv-inicial` | [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) | 🟢 v3 · dual CSV |

| 2.3.1.7.5.3.1 | **Tab Stock · Fase 1** | `?tab=stock` | [CHUSAR_PP_TAB_STOCK](./CHUSAR_PP_TAB_STOCK.md) | [MUDANZA_PP_INVENTARIO](../../../../../report/docs/MUDANZA_PP_DETALLE_INVENTARIO.md) |
| **2.3.1.7.5.3.1a** | **Nº preventa Carlos · mapa propagación** | cabecera PP | [CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO](../gestion_compra/CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md) | 🟢 **2.3.1.31** · UI 2 filas · siamese · [sesión 2.3.1.32](../gestion_compra/CHUSAR_SESION_DURO_PREVENTA_UI_PRECIOS_20260720.md) |

| **2.3.1.7.5.3.2** | **Tab FI · Ala Sur · NIIF** | `?tab=fi` | [CHUSAR_PP_TAB_FI](./CHUSAR_PP_TAB_FI.md) | `PpFiCard` · CSV · PDF |

| **2.3.1.7.5.5** | **Universo tránsito · quién controla** | doc | [CHUSAR_UNIVERSO_TRANSITO_PP](./CHUSAR_UNIVERSO_TRANSITO_PP.md) | CP + programado + mix 50/50 · hasta ENVIADO |

| **2.3.1.16** | **Mercadería en tránsito · Panel · informes** | doc | [CHUSAR_MERCADERIA_EN_TRANSITO](../gestion_compra/CHUSAR_MERCADERIA_EN_TRANSITO.md) | Concepto madre STOCK+VENTAS · Alejandro Magno |

| **2.3.1.16.1** | **Mapa Panel CP STOCK+VENTAS** | doc | [MAPA_PANEL_CP_TRANSITO](../gestion_compra/MAPA_PANEL_CP_TRANSITO_STOCK_VENTAS.md) | FI Web → pares_vendidos · paridad Estadísticas |

| **2.3.1.7.5.3.13** | **Cabecera PP · Biblioteca política** | cabecera detalle PP | [CHUSAR_PP_CABECERA_BIBLIOTECA](./CHUSAR_PP_CABECERA_BIBLIOTECA.md) | 🟢 **v2 2026-07-21** · BCL reconstruye PF · marca IC · POST admin_ic |
| **2.3.1.7.5.3.2** | **Vinculación listado · MIG-150 dos modos** | panel Stock | [CHUSAR_VINCULACION_LISTADO](./CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md) | ✅ **2026-07-14** · prod `7b7d5d7` · error `4.02.03.012` |
| **2.3.1.7.5.3.2.H** | **Hotfix PP-14 · vincular FI + PDF FI** | doc | [CHUSAR_HOTFIX_REPORT_PP14_20260714](./CHUSAR_HOTFIX_REPORT_PP14_20260714.md) | ✅ deploy · rescate BD · errores `012`+`013` |
| **2.3.1.27** | **Etapa · Importación programados** | doc | [CHUSAR_IMPORTACION_PROGRAMADOS_20260718](./CHUSAR_IMPORTACION_PROGRAMADOS_20260718.md) | 🟢 **2026-07-18** · [ETAPA](../../../4_etapas/ETAPA_IMPORTACION_PROGRAMADOS_20260718.md) |
| **2.3.1.27.1** | **Maratón proformas PROGRAMADO** | doc | [CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718](./CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md) | 🟢 checklist · tabla lote · Cursor+Director |
| **2.3.1.27.2** | **Lote IC 0839/26 → PP-0024** | doc | [CHUSAR_IC_LOTE_0839_PP24_20260718](./CHUSAR_IC_LOTE_0839_PP24_20260718.md) | ✅ **79 IC** · PP-37 · 7932 pares |

| **2.3.1.7.5.3.2.P** | **Pendientes handoff pre-nueva etapa** | doc | [PENDIENTES_HANDOFF_20260714](./PENDIENTES_HANDOFF_20260714.md) | 🟡 smoke prod · protocolo Excel sin sellar |
| **2.3.1.7.5.3.2.P2** | **Handoff 2026-07-20 · pre-nueva etapa** | doc | [PENDIENTES_HANDOFF_20260720](./PENDIENTES_HANDOFF_20260720.md) | ⏸ **esperando Nueva etapa** · FI encabezado · Logística deploy · CSV `015` |
| **2.3.1.7.5.3.2.1** | **PP FI encabezado editable** | tab FI | [CHUSAR_PP_FI_ENCABEZADO_EDITABLE_20260720](./CHUSAR_PP_FI_ENCABEZADO_EDITABLE_20260720.md) | ✅ deploy `dc7839d`+ |

**Fuera de 7 (hermanos RIMEC):** [CADENA_OPERATIVA_RIMEC.md](../CADENA_OPERATIVA_RIMEC.md) · 2.3.1.8 Compra legal · 2.3.1.9 Facturación · 2.3.1.10 Depósito RIMEC



**Alias P.1.x:** [SUBPROCESOS.md](./SUBPROCESOS.md)



---



## Jerarquía UI Report



```

/proceso-importacion                         ← 2.3.1.7 hub (Motor · IC · DG · PP)

├── motor-precios/                           ← 2.3.1.7.1

│   ├── biblioteca/ …                        ← 2.3.1.7.1.1
│   │   └── [id]/                            ← 2.3.1.7.1.1.1 clon casos
│   └── importacion-precios/                 ← 2.3.1.7.2
│       ├── nuevo/                           ← 2.3.1.7.2.0 Paso 0
│       └── nuevo/memoria/                   ← 2.3.1.7.2.1 + 2.3.1.7.2.1.1 copiar casos

├── intencion-compra/                        ← 2.3.1.7.3
│   ├── bandeja/                             ← 2.3.1.7.3.1
│   ├── nueva/                               ← 2.3.1.7.3.2
│   └── import-batch/                        ← 2.3.1.7.3.3 inyección Excel (plan)

├── digitacion/                              ← 2.3.1.7.4
│   ├── ?ramo=compra_previa|programado       ← 2.3.1.7.4.1a/b
│   ├── asignar/[icId]/                      ← 2.3.1.7.4.2
│   └── asignar-lote/                        ← 2.3.1.7.4.3 multi PROGRAMADO

└── pedido-proveedor/                        ← 2.3.1.7.5
    ├── ?ramo=compra_previa|programado       ← 2.3.1.7.5.1a/b
    └── [ppId]/                              ← 2.3.1.7.5.3 · ?tab=ics|stock|fi

/compra-legal                                ← 2.3.1.8 (hermano)

/facturacion                                 ← 2.3.1.9 (hermano)

/deposito-rimec                              ← 2.3.1.10 (hermano)

```



Legacy redirect: `/proceso-importacion/importacion-precios/*` → bajo motor.



---



## Streamlit launcher



`control_central/modules/home/ui.py` — **CICLO DE IMPORTACIÓN** (4 cards visibles):



| Card | module_key | Report |

|------|------------|--------|

| Motor de Precios | `rimec_engine` | 2.3.1.7.1 *(incluye importación Excel)* |

| Intención de Compra | `intencion_compra` | 2.3.1.7.3 |

| Digitación | `digitacion` | 2.3.1.7.4 |

| Pedido Proveedor | `pedido_proveedor` | 2.3.1.7.5 |



---



## Estado implementación



| Código | Estado |

|--------|--------|

| 2.3.1.7.1.1–2 | ✅ Biblioteca |

| **2.3.1.7.1.1.1** | ✅ **Clon bib→bib** (MIG-118 · doc ✅) |

| **2.3.1.7.2** | ✅ **Importación precios Corazón 2** · [cierre](../../4_etapas/ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md) |

| 2.3.1.7.2.0–2.4 | ✅ Pasos 0–4 + historial |

| **2.3.1.7.2.1.1** | ✅ Copiar casos bib→evento |

| 2.3.1.7.3–5 | ▶ **Track 2** · [DOC_TRACK2_CONTEXTO_DIA_20260713](./DOC_TRACK2_CONTEXTO_DIA_20260713.md) · [ETAPA_DIA_OPERATIVO_20260713](../../../4_etapas/ETAPA_DIA_OPERATIVO_20260713.md) |
| 2.3.1.13.3 | ▶ **Track 3** · [DOC_TRACK3_CONTEXTO_DIA_20260713](./DOC_TRACK3_CONTEXTO_DIA_20260713.md) |



---



## Navegador



- http://localhost:3004/modulos/report/grupo-rimec/proceso-importacion/motor-precios

- `nexus-navegador-holding/config/proceso-importacion.json`



---



**Shibboleth:** Chayanne el mejor

