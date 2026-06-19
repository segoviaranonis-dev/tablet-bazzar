# 2.3.1.10 Depósito RIMEC — índice documental (Report)



**Código Moria:** **2.3.1.10** · **Nivel:** hermano de 2.3.1.7  

**Report:** `/deposito-rimec` · **Streamlit:** `?modulo=deposito`  

**CHUSAR:** [CHUSAR_DEPOSITO_RIMEC.md](./CHUSAR_DEPOSITO_RIMEC.md)  

**Origen:** `control_central/modules/deposito/` · SQL compartido `get_compra_hija_deposito` en `compra_legal/logic.py`



---



## Norte del módulo



**Saldo físico importadora** — compra inicial menos venta en tránsito.



| Sub-proceso | Qué hace | Tablas núcleo |

|-------------|----------|---------------|

| **Saldo lógico** | PPD − VT por molécula | `pedido_proveedor_detalle`, `venta_transito` |

| **Saldo físico** | Stock confirmado almacén 4 | `movimiento`, `movimiento_detalle`, `v_stock_actual` |

| **Movimientos** | Historial TRANSITO↔DEPOSITO↔WEB | `movimiento*` |

| **Por CL** | Vista acotada a PPs de una compra | `compra_legal_pedido` |

---

## Código Report (implementado)

| Pieza | Ruta |
|-------|------|
| Hub | `report/src/app/deposito-rimec/page.tsx` |
| Queries | `report/src/lib/deposito-rimec/queries.ts` |
| APIs | `report/src/app/api/deposito-rimec/saldo` · `…/compras` |

Ver [CHUSAR § Estado Report](./CHUSAR_DEPOSITO_RIMEC.md#estado-report--implementación-2026-06-19).

---



## Plan de documentación (leer en este orden)



| # | Archivo | Contenido |

|---|---------|-----------|

| 1 | [CHUSAR_DEPOSITO_RIMEC.md](./CHUSAR_DEPOSITO_RIMEC.md) | Qué es · almacenes · rutas |

| 2 | **[TABLAS.md](./TABLAS.md)** | **Catálogo BD completo** — movimiento, PPD, stock sano |

| 3 | [OPERACIONES.md](./OPERACIONES.md) | Queries · funciones planificadas |

| 4 | [FLUJOS.md](./FLUJOS.md) | Cadena almacenes · saldo lógico vs físico |

| 5 | [../TABLAS_ABASTECIMIENTO_8_9_10.md](../TABLAS_ABASTECIMIENTO_8_9_10.md) | Vista cruzada 8–10 |



---



## Inventario tablas (lista rápida)



### Cálculo saldo (lectura intensiva)



| Tabla | Rol |

|-------|-----|

| `pedido_proveedor_detalle` | `cantidad_pares` = inicial |

| `venta_transito` | `cantidad_vendida` = vendido |

| `factura_interna` / `factura_interna_detalle` | KPI facturado (métricas CL) |

| `marca_v2` | Labels UI |



### Stock físico



| Tabla | Rol |

|-------|-----|

| `movimiento` | Cabecera TX · origen/destino almacén |

| `movimiento_detalle` | `combinacion_id` + cantidad + signo |

| `v_stock_actual` | Vista agregada por almacén |

| `almacen` | id **4** = ALM_DEPOSITO_RIMEC |



### Molécula



| Tabla | Rol |

|-------|-----|

| `combinacion` | 5 FK + talla |

| `linea`, `referencia`, `material`, `color`, `talla` | Display / filtros FK |



### Salida hacia web



| Tabla | Rol |

|-------|-----|

| `traspaso` / `traspaso_detalle` | Egreso lógico hacia ALM_WEB |



### Protocolo Stock Sano (post-web)



| Tabla | Rol |

|-------|-----|

| `stock_sano_deposito` | Precio canon L+R+material |

| `stock_sano_almacen` | Depósitos activos |

| `stock_sano_historial` | Auditoría ingresos |

| `v_stock_sano_deposito` | Vista operativa |



### Filtro por CL



| Tabla | Rol |

|-------|-----|

| `compra_legal` | Cabecera |

| `compra_legal_pedido` | PPs incluidos |



---



## Almacenes holding



| id | Código | Rol depósito |

|----|--------|--------------|

| 3 | ALM_TRANSITO_01 | Entrada marítima |

| **4** | **ALM_DEPOSITO_RIMEC** | **Este módulo** |

| 1 | ALM_WEB_01 | Destino traspaso Bazar |



---



## Funciones — índice



| Función | Doc |

|---------|-----|

| `get_compra_hija_deposito` | [OPERACIONES.md](./OPERACIONES.md#get_compra_hija_depositoid_cl) |

| Dashboard saldo global | [OPERACIONES.md](./OPERACIONES.md#dashboard-saldo-global) |

| `confirmar_compra_legal` | [OPERACIONES.md](./OPERACIONES.md#confirmar_compra_legalp_compra_id) *(planificado)* |

| `confirmar_traspaso` | [OPERACIONES.md](./OPERACIONES.md#confirmar_traspasop_traspaso_id) *(planificado)* |



---



## NO confundir



| Código | Producto |

|--------|----------|

| **2.3.1.10** | Depósito RIMEC importadora |

| **2.3.2.1** | Depósitos Bazzar tiendas → [../depositos/INDICE.md](../depositos/INDICE.md) |



---



**Shibboleth:** Chayanne el mejor

