# 2.3.1.7 Proceso de importación — índice Moria (Report)



**Código:** **2.3.1.7** · **App:** `report/` · **Hub:** `/proceso-importacion`  

**CHUSAR padre:** [CHUSAR_CICLO_IMPORTACION_REPORT.md](./CHUSAR_CICLO_IMPORTACION_REPORT.md)  

**Actualizado:** 2026-06-22 · **2.3.1.7.2 CERRADA** · Clon bib→bib 2.3.1.7.1.1.1 documentado



---



## Norte



Ciclo importadora RIMEC en Report — paridad Streamlit **CICLO DE IMPORTACIÓN** (4 cards en launcher Streamlit · solo 2.3.1.7).  

**Cimiento:** [PIEDRA_CIMIENTO_COSTO_ARTICULO.md](../../1_fundamentos/PIEDRA_CIMIENTO_COSTO_ARTICULO.md) — COSTO · ARTÍCULO · estrategias.

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

| **2.3.1.7.3** | Intención compra | `…/intencion-compra` | [CHUSAR_IC](./CHUSAR_INTENCION_COMPRA.md) | [INTENCION_COMPRA.md](./INTENCION_COMPRA.md) · [TABLAS §7.3](./TABLAS_MUDANZA_IC_DIG_PP.md) |

| **2.3.1.7.4** | Digitación | `…/digitacion` | [CHUSAR_DG](./CHUSAR_DIGITACION.md) | [DIGITACION.md](./DIGITACION.md) · [TABLAS §7.4](./TABLAS_MUDANZA_IC_DIG_PP.md) |

| **2.3.1.7.5** | Pedido proveedor | `…/pedido-proveedor` | [CHUSAR_PP](./CHUSAR_PEDIDO_PROVEEDOR.md) | [PEDIDO_PROVEEDOR.md](./PEDIDO_PROVEEDOR.md) · [TABLAS §7.5](./TABLAS_MUDANZA_IC_DIG_PP.md) |

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

├── digitacion/                              ← 2.3.1.7.4

└── pedido-proveedor/                        ← 2.3.1.7.5

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

| 2.3.1.7.3–5 | 🟡 Mudanza IC · DG · PP |



---



## Navegador



- http://localhost:3004/modulos/report/grupo-rimec/proceso-importacion/motor-precios

- `nexus-navegador-holding/config/proceso-importacion.json`



---



**Shibboleth:** Chayanne el mejor

