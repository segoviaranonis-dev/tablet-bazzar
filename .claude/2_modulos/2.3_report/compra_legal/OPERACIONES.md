# 2.3.1.8 Compra legal — operaciones × tablas

**Catálogo tablas:** [TABLAS.md](./TABLAS.md) · **Estados:** [FLUJOS.md](./FLUJOS.md)  
**Archivo:** `control_central/modules/compra_legal/logic.py`

---

## Numeración

### `get_next_numero_cl(anio?)`

| Op | Tabla | SQL |
|----|-------|-----|
| R | `compra_legal` | `MAX(SPLIT_PART(numero_registro,'-',3))` WHERE `CL-{anio}-%` |

Retorna: `CL-{anio}-{ultimo+1:04d}`

### `_get_next_traspaso_num_conn(conn, anio)`

| Op | Tabla | SQL |
|----|-------|-----|
| R | `traspaso` | `MAX` split `TRP-{anio}-%` |

---

## `create_compra_legal(id_pp, numero_proforma)`

**TX:** `engine.begin()`

| Paso | Op | Tabla | Columnas |
|------|-----|-------|----------|
| 1 | INSERT | `compra_legal` | `numero_registro`, `anio_fiscal`, `numero_factura_proveedor`, `fecha_factura`, `moneda='USD'`, `estado='PENDIENTE'` |
| 2 | INSERT | `compra_legal_pedido` | `compra_legal_id`, `pedido_proveedor_id` |
| 3 | UPDATE | `pedido_proveedor` | `estado='ENVIADO'` WHERE `id=id_pp` |

---

## `add_pp_to_compra(compra_id, id_pp)`

| Paso | Op | Tabla |
|------|-----|-------|
| 1 | SELECT | `compra_legal_pedido` | guard duplicado |
| 2 | INSERT | `compra_legal_pedido` | nuevo vínculo |
| 3 | UPDATE | `pedido_proveedor` | `ENVIADO` |

---

## `finalizar_compra(id_cl)`

| Paso | Op | Tabla | Detalle |
|------|-----|-------|---------|
| 1 | SELECT | `compra_legal_pedido` | lista `pedido_proveedor_id` |
| 2 | loop | `_crear_traspasos_para_pp` | por cada PP |
| 3 | UPDATE | `compra_legal` | `estado='DISTRIBUIDA'` |
| 4 | UPDATE | `pedido_proveedor` | `estado_transito='EN_DEPOSITO'` WHERE PP ∈ CL |

---

## `_crear_traspasos_para_pp(conn, id_pp, cl_id)`

### Bloque A — legacy `venta_transito`

| Op | Tablas |
|----|--------|
| SELECT DISTINCT | `venta_transito` | FAC sin traspaso |
| SELECT | `venta_transito` ⋈ `pedido_proveedor_detalle` | tallas t33–t40 |
| CALL | `crear_traspaso_por_factura` | → `traspaso`, `traspaso_detalle` |
| UPDATE | `traspaso` | `compra_legal_id=cl_id` |

### Bloque B — `factura_interna`

| Op | Tablas |
|----|--------|
| SELECT | `factura_interna` ⋈ `factura_interna_detalle` ⋈ `pedido_proveedor_detalle` | FI sin traspaso, estado CONFIRMADA/RESERVADA |
| READ | `grades_json`, `linea_snapshot`, `fid.pares` | escala tallas |
| CALL | `crear_traspaso_por_factura` | |
| UPDATE | `traspaso` | `compra_legal_id` |

### Bloque C — vincular existentes

| Op | Tablas |
|----|--------|
| UPDATE | `traspaso` | SET `compra_legal_id` WHERE `documento_ref` IN (VT ∪ FI del PP) |

---

## `crear_traspaso_por_factura(conn, id_pp, id_marca, numero_factura, items_tallas)`

| Paso | Op | Tabla | Valores |
|------|-----|-------|---------|
| 1 | INSERT | `traspaso` | `TRP-*`, orig=3, dest=1, `BORRADOR`, `snapshot_json`, `documento_ref=numero_factura` |
| 2 | loop | `_resolve_combinacion_id` | por cada talla qty>0 |
| 3 | INSERT | `traspaso_detalle` | `traspaso_id`, `combinacion_id`, `cantidad` |

---

## `_resolve_combinacion_id(conn, linea, ref, mat, col, talla)`

| Paso | Op | Tablas |
|------|-----|--------|
| 1 | SELECT | `combinacion` ⋈ `linea` ⋈ `referencia` ⋈ `material` ⋈ `color` ⋈ `talla` |
| 2 | SELECT | `linea`, `referencia`, `material`, `color`, `talla` | IDs base |
| 3 | INSERT | `combinacion` | 5 FK + `activo_web=false` |

---

## `rechazar_pp_de_compra(id_cl, id_pp)`

| Paso | Op | Tabla |
|------|-----|-------|
| 1 | UPDATE | `traspaso` | `compra_legal_id=NULL` WHERE BORRADOR + VT del PP |
| 2 | DELETE | `compra_legal_pedido` | par CL+PP |
| 3 | UPDATE | `pedido_proveedor` | `estado='ABIERTO'` |

---

## `enviar_compra_a_web(id_cl)`

| Op | Tabla | SET |
|----|-------|-----|
| UPDATE | `traspaso` | `estado='ENVIADO'` WHERE `compra_legal_id` AND `BORRADOR` |
| UPDATE | `compra_legal` | `estado='ENVIADO'` |

---

## Lecturas — métricas y bandejas

### `get_compras_legales()`

| Tablas JOIN |
|-------------|
| `compra_legal` |
| subquery `compra_legal_pedido` → `pedido_proveedor` |
| subquery `traspaso` (count, confirmados) |

### `get_compra_header(id_cl)`

| Tablas |
|--------|
| `compra_legal` |
| `compra_legal_pedido` → `pedido_proveedor` |
| + `get_metricas_facturacion_compra` |

### `get_metricas_facturacion_compra(id_cl)` — **fuente única KPI**

CTE `pps` ← `compra_legal_pedido`  
CTE `fi_pp` ← `factura_interna` ⋈ `factura_interna_detalle`  
CTE `vt_pp` ← `venta_transito` anti-join FI  
CTE `pp_base` ← `pedido_proveedor.pares_comprometidos`

Retorna: `total_pares_f9`, `pares_facturados`, `pares_deposito`, `por_pp{}`

### `get_pps_de_compra(id_cl)`

| Tablas |
|--------|
| `compra_legal_pedido` → `pedido_proveedor` |
| `pedido_proveedor_detalle` → `marca_v2` |
| subquery FI + VT vendido |

### `get_facturas_internas_de_compra(id_cl)`

| Tablas |
|--------|
| `factura_interna` |
| `compra_legal_pedido` |
| `pedido_proveedor` |
| `cliente_v2`, `vendedor_v2` |

### `get_compra_hija_deposito(id_cl)`

| Tablas |
|--------|
| `compra_legal_pedido` → `pedido_proveedor_detalle` |
| `marca_v2` |
| subquery `venta_transito` por `ppd.id` |

Fórmula: `cantidad_pares - SUM(vt.cantidad_vendida) = saldo`

### `get_compra_hija_facturacion(id_cl)`

UNION ALL:

1. `factura_interna` ⋈ `factura_interna_detalle` ⋈ `cliente_v2` ⋈ `ppd`
2. `venta_transito` ⋈ `ppd` ⋈ `marca_v2` ⋈ `cliente_v2`

+ subquery `traspaso.estado` por `documento_ref`

---

## `get_traspasos(estado?)` / `get_traspaso_detail` / `get_traspaso_detalle_lines`

| Tablas principales |
|--------------------|
| `traspaso` |
| `compra_legal` |
| `traspaso_detalle` |
| `combinacion` + pilares |
| `factura_interna` → `pedido_proveedor` → `intencion_compra_pedido` → `precio_lista` |
| fallback: `traspaso.snapshot_json` |

Filtro cliente 5000: EXISTS en `factura_interna` o `venta_transito`.

---

## `procesar_ingreso_bazar(id_trp)`

| Paso | Op | Tabla |
|------|-----|-------|
| 1 | SELECT FOR UPDATE | `traspaso` |
| 2 | INSERT | `movimiento` |
| 3 | INSERT | `movimiento_detalle` ← `traspaso_detalle` |
| 4 | UPDATE | `traspaso` | `CONFIRMADO`, `confirmado_en=NOW()` |

Efecto: stock en `v_stock_actual` almacén 1.

---

**Shibboleth:** Chayanne el mejor
