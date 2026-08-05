# 2.3.1.9 Facturación — índice documental (Report)



**Código Moria:** **2.3.1.9** · **Nivel:** hermano de 2.3.1.7 Proceso importación  

**Report:** `/facturacion` · **Streamlit:** `?modulo=facturacion`  

**CHUSAR:** [CHUSAR_FACTURACION.md](./CHUSAR_FACTURACION.md)  

**Origen código:** `control_central/modules/facturacion/{logic,ui}.py` · gemelo `report/src/lib/bazzar-web/compra-web/queries.ts`



---



## Norte del módulo



**FAC-INT en tránsito** — distribución a sucursales y cliente **5000** (Bazar Web).



| Sub-proceso | Qué hace | Tablas núcleo |

|-------------|----------|---------------|

| **Bandeja FI** | FI RESERVADA/CONFIRMADA en tránsito | `factura_interna`, `traspaso` |

| **Detalle FI** | Ley FI · 5 pilares · caso | `factura_interna_detalle.linea_snapshot` |

| **Envío Web Bazar** | Traspaso logístico por FAC | `traspaso`, `traspaso_detalle`, `combinacion` |

| **Legacy VT** | Fallback preventa sin FI | `venta_transito` |

---

## Código Report (implementado)

| Pieza | Ruta |
|-------|------|
| Hub | `report/src/app/facturacion/page.tsx` |
| Queries | `report/src/lib/facturacion/queries.ts` |
| APIs | `report/src/app/api/facturacion/` |
| CSV PE Carlos | `report/src/lib/facturacion/csv-pe-ventas-export.ts` |
| Bóveda RIMEC | `report/src/lib/facturacion/boveda.ts` · `/facturacion/boveda` · MIG-186 |
| Ley FI UI | `report/src/app/bazzar-web/compra/components/CompraWebFiPanel.tsx` |

Ver [CHUSAR § Estado Report](./CHUSAR_FACTURACION.md#estado-report--implementación-2026-06-19).

---



## Plan de documentación (leer en este orden)



| # | Archivo | Contenido |

|---|---------|-----------|

| 1 | [CHUSAR_FACTURACION.md](./CHUSAR_FACTURACION.md) | Qué es · rutas · criterios mudanza |

| 2 | **[TABLAS.md](./TABLAS.md)** | **Catálogo BD completo** — FI, FID, VT, traspaso, pilares |

| 3 | [OPERACIONES.md](./OPERACIONES.md) | Función → tablas R/W |

| 4 | [FLUJOS.md](./FLUJOS.md) | Estados FI · traspaso · secuencias envío web |

| 5 | [CHUSAR_FACTURACION_PRONTA_ENTREGA.md](./CHUSAR_FACTURACION_PRONTA_ENTREGA.md) | Bandeja PE · hub 2 tarjetas |
| **5b** | **[CHUSAR_FACTURACION_BOVEDA_RIMEC.md](./CHUSAR_FACTURACION_BOVEDA_RIMEC.md)** | **2.3.1.9.B.2** · bóveda permanente · PROCESAR · MIG-186 |

| 6 | **[CHUSAR_CSV_VENTAS_PE_CARLOS.md](./CHUSAR_CSV_VENTAS_PE_CARLOS.md)** | **CSV TSV · inyección Carlos PE** |
| **6a** | **[CHUSAR_CSV_PE_DEPOSITO_CABECERA_20260804.md](./CHUSAR_CSV_PE_DEPOSITO_CABECERA_20260804.md)** | **2.3.1.9.B.3** · col **DEPOSITO** cabecera `S00_D1\|DEP2\|D3` · Cant. Pares · veneno inviolable · 🟢 **2026-08-04** |
| **6a2** | **[CHUSAR_PENDIENTES_PE_CSV_20260804.md](./CHUSAR_PENDIENTES_PE_CSV_20260804.md)** | **2.3.1.9.B.4** · pendientes PE/CSV · etapa **CERRADA** 2026-08-04 · sin deploy · 🟡 piso |
| — | [ETAPA_CSV_PE_DEPOSITO_CABECERA_20260804_CERRADA.md](../../../4_etapas/ETAPA_CSV_PE_DEPOSITO_CABECERA_20260804_CERRADA.md) | Cierre · handoff → `SALES-REPORT-PDFS-20260804` |

| **6b** | **[CHUSAR_BOTON_DIOS_ANULAR_REINTEGRAR_FI.md](./CHUSAR_BOTON_DIOS_ANULAR_REINTEGRAR_FI.md)** | **2.3.1.9.C** · DIOS · FI entera · reintegrar stock · Anulaciones · PE+tránsito+Aprobaciones |
| **6c** | **[CHUSAR_FI_CASO_CABECERA_DESDE_PP.md](./CHUSAR_FI_CASO_CABECERA_DESDE_PP.md)** | **2.3.1.9.D** · caso/marca cabecera FI desde PP · Admin IC · backfill · resync |
| **6d** | **[CHUSAR_USUARIO_CAJA_RIMEC_PE.md](./CHUSAR_USUARIO_CAJA_RIMEC_PE.md)** | **2.3.1.9.E** · usuario CAJA_RIMEC · solo Facturación Pronta Entrega |
| **6f** | **[CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md](./CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md)** | **2.3.1.9.F** · traductor vendedor Carlos · PATRICIA **101** / DARIO **111** · **1ª PE 638** · colisión id **19** Guido↔Patricia · error **`4.02.04.004`** · 🟢 **2026-08-03** |
| **6g** | **[CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md](./CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md)** | **2.3.1.9.B.1** · diccionario único cadena PE · COD.GRUPO · excluye Carteras · seed 133 grupos |
| **6h** | **[../deposito_rimec/CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md](../deposito_rimec/CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md)** | **2.3.1.10.1.1** · traductor propio · dual biblioteca PE/PP · plan Hiedra · 92 % acertividad |

| 7 | [../TABLAS_ABASTECIMIENTO_8_9_10.md](../TABLAS_ABASTECIMIENTO_8_9_10.md) | Vista cruzada 8–10 |



---



## Inventario tablas (lista rápida)



### Tablas núcleo Facturación



| Tabla | Rol |

|-------|-----|

| `factura_interna` | Cabecera FAC-INT · `nro_factura`, `cliente_id`, `caso` |

| `factura_interna_detalle` | Líneas · `ppd_id`, `pares`, `linea_snapshot` |

| `venta_transito` | Legacy preventa · tallas t33–t40 |

| `traspaso` | Logística · `documento_ref = nro_factura` |

| `traspaso_detalle` | Stock por `combinacion_id` |

| `facturacion_boveda_rimec` | **2.3.1.9.B.2** · archivo permanente PE (MIG-186) · no muta estado FI |



### Upstream (lectura)



| Tabla | Rol |

|-------|-----|

| `pedido_proveedor` | FK `fi.pp_id` |

| `pedido_proveedor_detalle` | Moléculas · `grades_json` |

| `compra_legal` / `compra_legal_pedido` | Contexto CL |

| `precio_lista` / `precio_evento` | Caso · LPN |



### Pilares (lookup traspaso)



| Tabla | Rol |

|-------|-----|

| `combinacion` | 5 FK + talla |

| `linea`, `referencia`, `material`, `color`, `talla` | Match molécula |



### Maestras UI



| Tabla | Rol |

|-------|-----|

| `cliente_v2` | Nombre cliente · **5000** = web |

| `usuario_v2` | Vendedor FI (Nexus — nombre) |
| `vendedor_v2_deprecated` | **Solo Sales Report histórico** — no traductor PE |
| `vendedor_carlos_matriz` | **Pendiente MIG** · Código de vendedor real por caso |

| `marca_v2` | Marca display |



### Downstream (otro módulo escribe)



| Tabla | Módulo |

|-------|--------|

| `movimiento` / `movimiento_detalle` | Compra Web 2.3.3 |

| `v_stock_actual` | Bazar catálogo |

| `stock_sano_*` | Protocolo precio web |



---



## Funciones — índice



| Función | Doc |

|---------|-----|

| `get_fi_registro_por_numero` | [OPERACIONES.md](./OPERACIONES.md#get_fi_registro_por_numeronro_factura) |

| `get_fi_detalles_canonico` | [OPERACIONES.md](./OPERACIONES.md#get_fi_detalles_canonicofi_id) |

| `get_factura_lineas` | [OPERACIONES.md](./OPERACIONES.md#get_factura_lineasnumero_factura) |

| `enviar_factura_a_web_bazar` | [OPERACIONES.md](./OPERACIONES.md#enviar_factura_a_web_bazarnro_factura--fi_id) |



---



## Entrada / salida



| Desde | Hacia Facturación | Tabla puente |

|-------|-------------------|--------------|

| **2.3.1.3** Aprobaciones | FI CONFIRMADA | `factura_interna` |

| **2.3.1.8** Compra Legal | Traspaso BORRADOR masivo | `traspaso.compra_legal_id` |

| **2.3.1.9** | Envío web | UPDATE/INSERT `traspaso` |

| **2.3.3** Compra Web | Confirmar ingreso | `movimiento*` |



---



**Shibboleth:** Chayanne el mejor

