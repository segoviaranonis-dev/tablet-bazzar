# 2.3.1.8 Compra legal — índice documental (Report)

**Código Moria:** **2.3.1.8** · **Nivel:** hermano de Sales Report, RRHH, Proceso importación (2.3.1.7)  
**Report:** `/compra-legal` · **Streamlit:** `?modulo=compra_legal`  
**CHUSAR:** [CHUSAR_COMPRA_LEGAL.md](./CHUSAR_COMPRA_LEGAL.md)  
**Origen código:** `control_central/modules/compra_legal/{logic,ui,grades,sidebar}.py`

---

## Norte del módulo

Consolidación de **Pedidos Proveedor (PP)** en una **Compra Legal (CL)**. Tres sub-procesos visibles en Moria:

| Sub-proceso | Qué hace | Tablas núcleo |
|-------------|----------|---------------|
| **Consolidación PPs** | Vincular 1..N PP a una CL · PP→`ENVIADO` | `compra_legal`, `compra_legal_pedido`, `pedido_proveedor` |
| **Compras legales** | Cabecera CL · KPIs F9 vs facturado · finalizar | `compra_legal`, `factura_interna*`, `venta_transito` |
| **Traspasos** | Espejo logístico por FAC-INT hacia Bazar Web | `traspaso`, `traspaso_detalle`, `combinacion`, pilares |

---

## Plan de documentación (leer en este orden)

| # | Archivo | Contenido |
|---|---------|-----------|
| 1 | [CHUSAR_COMPRA_LEGAL.md](./CHUSAR_COMPRA_LEGAL.md) | Qué es · rutas · criterios mudanza Report |
| 2 | **[TABLAS.md](./TABLAS.md)** | **Catálogo completo BD** — cada tabla, cada columna usada, FK, índices |
| 3 | [OPERACIONES.md](./OPERACIONES.md) | Cada función Python → tablas R/W + SQL efectivo |
| 4 | [FLUJOS.md](./FLUJOS.md) | Máquinas de estado CL · PP · traspaso · secuencias TX |
| 5 | [../TABLAS_ABASTECIMIENTO_8_9_10.md](../TABLAS_ABASTECIMIENTO_8_9_10.md) | Vista cruzada 2.3.1.8–10 + diagrama ER |

---

## Inventario tablas (lista rápida)

## Código Report (implementado)

| Pieza | Ruta |
|-------|------|
| Hub | `report/src/app/compra-legal/page.tsx` |
| Detalle | `report/src/app/compra-legal/[id]/page.tsx` |
| Queries | `report/src/lib/compra-legal/queries.ts` |
| APIs | `report/src/app/api/compra-legal/` |

Ver estado línea a línea en [CHUSAR § Estado Report](./CHUSAR_COMPRA_LEGAL.md#estado-report--implementación-2026-06-19).

---

## Inventario tablas (lista rápida)

### Tablas propias / puente (escritura CL)

| Tabla | Rol en CL |
|-------|-----------|
| `compra_legal` | Cabecera consolidadora `CL-YYYY-XXXX` |
| `compra_legal_pedido` | Puente N:M `compra_legal_id` ↔ `pedido_proveedor_id` |
| `compra_legal_detalle` | *(futuro)* cirugía descuentos por línea invoice |
| `traspaso` | Documento `TRP-YYYY-XXXX` · espejo FAC-INT |
| `traspaso_detalle` | Líneas stock por `combinacion_id` + talla |
| `pedido_proveedor_log` | Auditoría estado PP al pasar a compra |

### Tablas upstream (lectura / UPDATE estado)

| Tabla | Rol en CL |
|-------|-----------|
| `pedido_proveedor` | PP enviado · `estado`, `estado_transito`, `pares_comprometidos` |
| `pedido_proveedor_detalle` | Moléculas F9 · grades · tallas t33–t40 |
| `factura_interna` | FAC-INT confirmadas/reservadas del PP |
| `factura_interna_detalle` | Líneas FI · `linea_snapshot` · `ppd_id` |
| `venta_transito` | Legacy preventa · fallback si no hay FI |

### Pilares y molécula (lookup / auto-insert)

| Tabla | Rol en CL |
|-------|-----------|
| `combinacion` | 5 FK + `talla_id` — puente PP→Bazar |
| `linea` | `codigo_proveedor` |
| `referencia` | `codigo_proveedor` |
| `material` | match por `descripcion` |
| `color` | match por `nombre` |
| `talla` | `talla_etiqueta` 33–40 |

### Maestras display (solo lectura UI)

| Tabla | Uso |
|-------|-----|
| `marca_v2` | Labels bandeja PP / depósito |
| `cliente_v2` | Nombre cliente en FI card |
| `usuario_v2` / `vendedor_v2` | Vendedor FI *(según join vigente)* |
| `categoria_v2` | Snapshot migr. 063 |
| `tipo_v2` | Snapshot migr. 063 |
| `precio_evento` | Snapshot listado predominante |
| `precio_lista` | Caso comercial en detalle traspaso |
| `almacen` | IDs 1 WEB · 3 TRANSITO · 4 DEPOSITO |

### Tablas downstream (CL dispara · otro módulo confirma)

| Tabla | Módulo | Rol |
|-------|--------|-----|
| `movimiento` | Compra Web / Bazar | Ingreso post-traspaso ENVIADO |
| `movimiento_detalle` | idem | Stock ALM_WEB_01 |
| `v_stock_actual` | idem | Vista saldo |
| `stock_sano_deposito` | Bazar Web | Protocolo aduanero |

---

## Funciones Python (`logic.py`) — índice

| Función | Doc |
|---------|-----|
| `get_next_numero_cl` | [OPERACIONES.md § numeración](./OPERACIONES.md#numeración) |
| `create_compra_legal` | [OPERACIONES.md § alta CL](./OPERACIONES.md#create_compra_legal) |
| `add_pp_to_compra` | [OPERACIONES.md § add PP](./OPERACIONES.md#add_pp_to_compra) |
| `finalizar_compra` | [OPERACIONES.md § finalizar](./OPERACIONES.md#finalizar_compra) |
| `rechazar_pp_de_compra` | [OPERACIONES.md § rechazar](./OPERACIONES.md#rechazar_pp_de_compra) |
| `_crear_traspasos_para_pp` | [OPERACIONES.md § traspaso auto](./OPERACIONES.md#_crear_traspasos_para_pp) |
| `crear_traspaso_por_factura` | [OPERACIONES.md § traspaso FI](./OPERACIONES.md#crear_traspaso_por_factura) |
| `_resolve_combinacion_id` | [OPERACIONES.md § combinacion](./OPERACIONES.md#_resolve_combinacion_id) |
| `get_metricas_facturacion_compra` | [OPERACIONES.md § métricas](./OPERACIONES.md#get_metricas_facturacion_compra) |
| `get_compra_hija_deposito` | [OPERACIONES.md § hija depósito](./OPERACIONES.md#get_compra_hija_deposito) |
| `get_compra_hija_facturacion` | [OPERACIONES.md § hija facturación](./OPERACIONES.md#get_compra_hija_facturacion) |
| `procesar_ingreso_bazar` | [OPERACIONES.md § ingreso web](./OPERACIONES.md#procesar_ingreso_bazar) *(compartido Compra Web)* |

---

## Entrada / salida del módulo

| Desde | Hacia CL | Tabla puente |
|-------|----------|--------------|
| **2.3.1.7.5** Pedido PP | Botón «Enviar a Compra» | INSERT `compra_legal_pedido` |
| **2.3.1.3** Aprobaciones | FI `CONFIRMADA`/`RESERVADA` | JOIN `factura_interna` por `pp_id` |
| **2.3.1.9** Facturación | Envío traspaso ENVIADO | UPDATE `traspaso.estado` |
| **2.3.3** Compra Web | Confirmar ingreso | `movimiento*` *(desde `procesar_ingreso_bazar`)* |

---

## Constantes de negocio (código)

```python
ALM_TRANSITO       = 3   # almacen.id — origen traspaso
ALM_WEB_BAZAR      = 1   # almacen.id — destino catálogo web
ALM_DEPOSITO_RIMEC = 4   # almacen.id — depósito físico importadora
CLIENTE_WEB_BAZAR_ID = 5000
```

---

## Migraciones SQL relevantes

| Migración | Qué añade a tablas CL |
|-----------|------------------------|
| `063_pp_sello_auditable.sql` | Snapshots `compra_legal*`, `pedido_proveedor_log`, UNIQUE puente |
| `056_nomenclatura_pilares_p0.sql` | Joins pilares en traspaso/movimiento |
| `115_stock_sano_protocolo.sql` | `stock_sano_*` post-movimiento |

---

**Shibboleth:** Chayanne el mejor
