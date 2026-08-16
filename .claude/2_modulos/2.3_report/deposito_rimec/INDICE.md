# 2.3.1.10 Depósito RIMEC — índice documental (Report)



**Código Moria:** **2.3.1.10** · **Nivel:** hermano de 2.3.1.7  

**Report:** `/deposito-rimec` · **Streamlit:** `?modulo=deposito`  

**CHUSAR:** [CHUSAR_DEPOSITO_RIMEC.md](./CHUSAR_DEPOSITO_RIMEC.md)  

**Origen:** `control_central/modules/deposito/` · SQL compartido `get_compra_hija_deposito` en `compra_legal/logic.py`



---



## Norte del módulo

**Depósito importadora RIMEC** — hub **dos tarjetas** en Report:

| Tarjeta | Rol |
|---------|-----|
| **Saldo de proceso** | Saldo PP · resultante proceso compra (didáctico → CSV legal) |
| **Stock importado** | CSV `sdrm####` → `stock_pronta_entrega_rimec` · circuito PE |

Cada tarjeta propaga `origen_stock` → catálogo RIMEC Web → Aprobaciones → bandeja Facturación correspondiente.

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
| 1b | **[CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md](./CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md)** | **Stock POS unificado** · MIG-132 · sdrm |
| 1c | **[CHUSAR_PLAN_IMPORT_PE_SDRM0849_PILARES.md](./CHUSAR_PLAN_IMPORT_PE_SDRM0849_PILARES.md)** | **📋 Plan 2026-07-14** · botón import UI · motor pilares PE · batch sdrm0849 · latencia DB |
| 1d | **[CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md](./CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md)** | **2.3.1.10.1.1** · traductor propio COD.GRUPO · dual biblioteca PE/PP · Hiedra · acertividad 92 % |
| 1d2 | **[CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md](../facturacion/CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md)** | **2.3.1.9.F** · traductor vendedor Carlos · hermano 1d · Hoja2 CODxCASOS · 🟢 **2026-07-27** |
| 1e | **[CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](./CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md)** | **2.3.1.10.1.2** · palabra reservada **grupo uno** · 3 Excel · NORMAL/PROMO/LIQ · D1 · MIG-180 |
| 1e1 | **[CHUSAR_LEY_DPE_SIN_BCL_20260727.md](./CHUSAR_LEY_DPE_SIN_BCL_20260727.md)** | **2.3.1.10.1.2.1** · **Ley DPE** · etiqueta **NORMAL** (no REGULAR en UI) · BCL ≠ DPE · ver también Motor **2.5.1.19** |
| 1f | **[HANDOFF checkpoint](../../4_etapas/HANDOFF_DICCIONARIO_GRUPO_UNO_20260724.md)** | **2026-07-24** · derivación agentes · local sin deploy |
| 1g | **[CHUSAR_PE_TIPO1_ABCR_ACCESORIOS.md](./CHUSAR_PE_TIPO1_ABCR_ACCESORIOS.md)** | **2026-07-25** · ACCESORIOS Excel→ACT ROPAS · AB-CR CARTERAS+ANTEOJOS · backfill LINEA+REFE |
| 1h | **[CHUSAR_FILTROS_PE_SIAMESE_REPORT_WEB.md](./CHUSAR_FILTROS_PE_SIAMESE_REPORT_WEB.md)** | **2.3.1.10.1.3** · Hermano 1 Report PE · audit 99/99 · par [2.2.1.25](../../2.2_rimec_web/CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md) · siguiente [2.2.1.27](../../2.2_rimec_web/CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md) |
| 1i | **[CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md](./CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md)** | **2.3.1.10.1.4** · dictador % PE · **solo DIOS** · par **2.2.1.26** |
| 1i2 | **[CHUSAR_USUARIO_EVERT_STOCK_PE_20260727.md](./CHUSAR_USUARIO_EVERT_STOCK_PE_20260727.md)** | **2.3.1.10.1.4.2** · EVERT ADMIN · Stock PE sí · asignar descuento no |
| 1k | **[CHUSAR_VERIFICACION_DESCUENTOS_PE_20260727.md](./CHUSAR_VERIFICACION_DESCUENTOS_PE_20260727.md)** | **2.3.1.10.1.4.3** · pivote por % · política comercial · panel Revisar L+R+M+C · par Biblioteca casos |
| 1k2 | **[CHUSAR_PE_SDRM2121_IMPORT_ASIGNACION_20260728.md](./CHUSAR_PE_SDRM2121_IMPORT_ASIGNACION_20260728.md)** | **2.3.1.10.1.5** · batch `sdrm2121` · import Node · MIG-191 · **overwrite** descuentos Guido · pendientes |
| 1k3 | **[CHUSAR_IMPORT_PE_SDRM_UI_BODY_NEXT15_20260812.md](./CHUSAR_IMPORT_PE_SDRM_UI_BODY_NEXT15_20260812.md)** | **2.3.1.10.1.7** · UI import sin agente · Next 15.5 body 32 MB · `sdrm0218` · 🆕 MOISES post-20260807 · 2026-08-12 |
| 1k4 | **[CHUSAR_PE_SDRM_EAN_638_654_GATE_20260812.md](./CHUSAR_PE_SDRM_EAN_638_654_GATE_20260812.md)** | **2.3.1.10.1.8** · hotfix EAN 79… · `proveedorFromSdrmRow` · gate 638/654 · art. 106305 · 🟢 **2026-08-12** |
| 1k5 | **[CHUSAR_PE_SDRM_STALE_BATCH_MOL_COLOR_20260813.md](./CHUSAR_PE_SDRM_STALE_BATCH_MOL_COLOR_20260813.md)** | **2.3.1.10.1.9** · batch viejo · 7203-110-21736-15745 vs 52531 · re-import `sdrm5801` · 🟢 **2026-08-13** |
| — | **[CHUSAR_PE_STOCK_TONO_FILTRO_EDICION…](../pilares/CHUSAR_PE_STOCK_TONO_FILTRO_EDICION_20260816.md)** | **2.3.5.3.2** · cable TONO ↔ PE · filtro + edición · 🟡 FOCO **2026-08-16** |
| 1k6 | **[CHUSAR_COSTOS_ISLA_TXT_IFSTGP4_20260813.md](./CHUSAR_COSTOS_ISLA_TXT_IFSTGP4_20260813.md)** | **2.3.1.10.1.10** · **Desc. extra máx.** gerencia · snapshot · 🟢 OPERATIVO |
| 1k7 | **[CHUSAR_PE_GRILLA_PERF_20260816.md](./CHUSAR_PE_GRILLA_PERF_20260816.md)** | **2.3.1.10.1.11** · grilla >1 min → cache 90s + SWR + calzado primero · 🟢 **2026-08-16** |
| — | **[ETAPA_STOCK_PE_CALZADO_654_20260729_CERRADA.md](../../4_etapas/ETAPA_STOCK_PE_CALZADO_654_20260729_CERRADA.md)** | **⬛ CERRADA 2026-07-29** · Stock PE calzado **654** · compra previa · CODxCASOS `b463c18` |
| 1j | **[CHUSAR_LEY_DIVISION_FI_LP03_20260726.md](./CHUSAR_LEY_DIVISION_FI_LP03_20260726.md)** | **2.3.1.10.1.4.1** · split PE N/P/LIQ/COMUN · CP por caso · 1 marca · LP03 +10 % grado 1 · 4 grados |
| 1j4 | **[CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_20260729.md](./CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_20260729.md)** | **2.3.1.10.1.4.4** · PROMO sin Grado 1 +10 % · anti doble descuento · par Web **2.2.1.34** · 🟢 **2026-07-29** |
| 1j5 | **[CHUSAR_SIAMESE_ESTILO_GENERO_AM_DPE_20260729.md](./CHUSAR_SIAMESE_ESTILO_GENERO_AM_DPE_20260729.md)** | **2.3.1.10.1.6** · Estilo/Género FK `/pilares` · AM+DPE · par Web **2.2.1.35** · 🟢 **2026-07-29** |

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

### Stock pronta entrega POS (MIG-132 · 2026-07)

| Tabla | Rol |
|-------|-----|
| **`stock_pronta_entrega_rimec`** | CSV `sdrm####` · depósito = columna `D1\|DEP2\|D3` · precio Gs |

Doc: [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md](./CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md) · [MAPA CSV](../../../../report/docs/MAPA_CSV_SDRM_STOCK_PRONTA_ENTREGA.md)



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

## Grada abierta 638 · Stock PE (2026-07-16)

| Doc | Rol |
|-----|-----|
| [CHUSAR_GRADA_ABIERTA_638_STOCK_PE.md](./CHUSAR_GRADA_ABIERTA_638_STOCK_PE.md) | **2.3.1.10.12** · 1 fila = 1 talle · prendas · paridad Web |
| [GRADA_ABIERTA_638_ALEJANDRO_MAGNO.md](../../../../report/docs/GRADA_ABIERTA_638_ALEJANDRO_MAGNO.md) | App Report · MIG-165 |

---

**Shibboleth:** Andrés, el que viene.

