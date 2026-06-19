# 2.3.1.10 Depósito RIMEC — operaciones × tablas

**Catálogo tablas:** [TABLAS.md](./TABLAS.md) · **Estados:** [FLUJOS.md](./FLUJOS.md)  
**Streamlit:** `control_central/modules/deposito/`  
**SQL compartido CL:** `get_compra_hija_deposito` en `compra_legal/logic.py`

---

## Dashboard saldo global *(módulo deposito)*

Consulta equivalente a hija depósito CL sin filtro `compra_legal_id`:

| Op | Tablas |
|----|--------|
| R | `pedido_proveedor_detalle` |
| R | `pedido_proveedor` | FILTER `estado_transito = 'EN_DEPOSITO'` |
| R | `venta_transito` | subquery SUM vendido por `ppd_id` |
| R | `marca_v2` | LEFT JOIN `ppd.id_marca` |

**Columnas retorno:** `marca`, `linea`, `referencia`, `material`, `color`, `cantidad_inicial`, `vendido`, `saldo`

---

## `get_compra_hija_deposito(id_cl)` *(compartido Compra Legal)*

| Op | Tablas | SQL |
|----|--------|-----|
| R | `compra_legal_pedido` | WHERE `compra_legal_id = :id_cl` |
| R | `pedido_proveedor_detalle` | JOIN por `pedido_proveedor_id` |
| R | `venta_transito` | subquery SUM por `ppd.id` |
| R | `marca_v2` | display |

**Fórmula:** `saldo = cantidad_pares − SUM(vt.cantidad_vendida)`

---

## Consulta saldo por almacén físico — `v_stock_actual`

| Op | Objeto | Filtro |
|----|--------|--------|
| R | `v_stock_actual` | `almacen_id = 4` (ALM_DEPOSITO_RIMEC) |

JOIN display:

```sql
v_stock_actual v
JOIN combinacion c ON c.id = v.combinacion_id
JOIN linea l ON l.id = c.linea_id
JOIN referencia r ON r.id = c.referencia_id
LEFT JOIN material m ON m.id = c.material_id
LEFT JOIN color col ON col.id = c.color_id
JOIN talla t ON t.id = c.talla_id
```

---

## Historial movimientos depósito

| Op | Tablas |
|----|--------|
| R | `movimiento` | WHERE `almacen_origen_id = 4 OR almacen_destino_id = 4` |
| R | `movimiento_detalle` | líneas por movimiento |
| R | `traspaso` | JOIN `documento_ref = traspaso.numero_registro` |

ORDER BY `movimiento.fecha DESC`, `movimiento.id DESC`.

---

## `confirmar_compra_legal(p_compra_id)` *(planificado)*

**Efecto:** nacionalizar stock TRANSITO → DEPOSITO RIMEC.

| Paso | Op | Tablas |
|------|-----|--------|
| 1 | SELECT | `compra_legal_pedido` → PPs |
| 2 | SELECT | `pedido_proveedor_detalle` → moléculas |
| 3 | INSERT | `movimiento` | tipo TRASPASO, orig=3, dest=**4**, ref=CL |
| 4 | INSERT | `movimiento_detalle` | combinacion + cantidad + signo |
| 5 | UPDATE | `compra_legal` | estado avance |

---

## `confirmar_traspaso(p_traspaso_id)` *(planificado)*

**Efecto:** egreso depósito importadora → ingreso web.

| Paso | Op | Tablas |
|------|-----|--------|
| 1 | SELECT | `traspaso`, `traspaso_detalle` |
| 2 | INSERT | `movimiento` | orig=**4**, dest=1 |
| 3 | INSERT | `movimiento_detalle` | desde traspaso_detalle |
| 4 | UPDATE | `traspaso` | `CONFIRMADO` |

---

## `procesar_ingreso_bazar(id_trp)` *(Compra Web — referencia)*

Ejecutado desde 2.3.3; afecta cadena depósito:

| Paso | Op | Tabla |
|------|-----|-------|
| INSERT | `movimiento` | orig=3, dest=1, tipo INGRESO_COMPRA |
| INSERT | `movimiento_detalle` | desde `traspaso_detalle` |
| UPDATE | `traspaso` | CONFIRMADO |
| INSERT W* | `stock_sano_historial` | post-protocolo |

\* Si protocolo activo en `stock_sano_almacen`.

---

## Vista Stock Sano — `v_stock_sano_deposito`

| Op | Tablas base |
|----|-------------|
| R | `movimiento_detalle` ⋈ `movimiento` |
| R | `combinacion` + pilares |
| R | `stock_sano_deposito` |
| R | `stock_sano_almacen` |

FILTER: `movimiento.tipo = 'INGRESO_COMPRA'` AND `estado = 'CONFIRMADO'`.

---

## Pantallas Streamlit ↔ tablas

| Pantalla | Tablas dominantes |
|----------|-------------------|
| Dashboard saldo | PPD, VT, `marca_v2` |
| Detalle molécula | PPD, FI, VT, `traspaso` |
| Movimientos | `movimiento`, `movimiento_detalle` |
| Por CL | `compra_legal_pedido` + query hija depósito |

---

## Gemelo Report planificado

| Ruta | API | Tablas |
|------|-----|--------|
| `/deposito-rimec` | `/api/deposito-rimec/saldo` | PPD, VT, maestras |
| `/deposito-rimec/movimientos` | `/api/deposito-rimec/movimientos` | `movimiento*` |

Estado actual: shell UI — lógica pendiente migración.

---

**Shibboleth:** Chayanne el mejor
