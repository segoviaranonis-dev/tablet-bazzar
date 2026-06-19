# 2.3.1.9 Facturación — operaciones × tablas

**Catálogo tablas:** [TABLAS.md](./TABLAS.md) · **Estados:** [FLUJOS.md](./FLUJOS.md)  
**Streamlit:** `control_central/modules/facturacion/logic.py`  
**Report gemelo:** `report/src/lib/bazzar-web/compra-web/queries.ts`

---

## `get_fi_registro_por_numero(nro_factura)`

**Paridad TS:** `getFiRegistroPorNumero`

| Op | Tablas | Detalle |
|----|--------|---------|
| R | `factura_interna` | WHERE `nro_factura = :nro` OR `pv_global = :n` si `PV###` |
| R | `pedido_proveedor` | LEFT JOIN `pp.id = fi.pp_id` → `nro_pp` |
| R | `cliente_v2` | `descp_cliente` |
| R | `usuario_v2` | `descp_usuario` vendedor |

**Columnas retorno:** `id`, `nro_factura`, `pv_global`, `estado`, `pp_id`, `marca`, `caso`, `total_pares`, `total_monto`, `lista_precio_id`, `descuento_1`…`4`

---

## `get_fi_detalles_canonico(fi_id)` *(compartido PP)*

**Ubicación canónica:** `pedido_proveedor/logic.py`  
**Paridad TS:** `getFiDetallesCanonico`

| Op | Tabla | SQL |
|----|-------|-----|
| R | `factura_interna_detalle` | WHERE `factura_id = :fi_id` ORDER BY `id` |

**UI:** alimenta `core.fi_card.render_fi_card` — Ley FI obligatoria.

---

## `get_factura_lineas(numero_factura)` — legacy fallback

**Paridad TS:** `getFacturaLineas`

### Rama A — `venta_transito`

| Op | Tablas |
|----|--------|
| R | `venta_transito` ⋈ `pedido_proveedor_detalle` |
| GROUP BY | linea, referencia, material, color, grada |
| SUM | `t33`…`t40`, `cantidad_vendida` AS pares |

WHERE `vt.numero_factura_interna = :nro`

### Rama B — `factura_interna_detalle`

| Op | Tablas |
|----|--------|
| R | `factura_interna` ⋈ `factura_interna_detalle` ⋈ `pedido_proveedor_detalle` |
| FILTER | `fi.estado IN ('CONFIRMADA','RESERVADA')` |
| SUM | `fid.pares` |

UNION ALL → orden linea, referencia.

---

## `enviar_factura_a_web_bazar(nro_factura | fi_id)`

**Efecto:** crea traspaso Bazar Web para FI cliente **5000**.

| Paso | Op | Tablas | Detalle |
|------|-----|--------|---------|
| 1 | SELECT | `factura_interna` | validar `cliente_id = 5000` |
| 2 | SELECT | `factura_interna_detalle` ⋈ `pedido_proveedor_detalle` | grades + snapshot |
| 3 | SELECT | `traspaso` | guard: no duplicar si ya existe `documento_ref` |
| 4 | CALL | `crear_traspaso_por_factura` | `compra_legal/logic.py` |
| 5 | INSERT | `traspaso` | `TRP-*`, orig=3, dest=1, `BORRADOR` o `ENVIADO` |
| 6 | INSERT | `traspaso_detalle` | por talla vía `_resolve_combinacion_id` |
| 7 | INSERT W\* | `combinacion` | auto-create si no existe |

**Tablas pilares tocadas en paso 6–7:** `linea`, `referencia`, `material`, `color`, `talla`, `combinacion`.

---

## Bandeja FAC-INT en tránsito *(UI Streamlit)*

Consulta típica bandeja:

| Op | Tablas |
|----|--------|
| R | `factura_interna` |
| R | `pedido_proveedor` |
| R | `compra_legal_pedido` → `compra_legal` |
| R | `traspaso` | LEFT JOIN `documento_ref = nro_factura` |
| FILTER | `estado IN ('RESERVADA','CONFIRMADA')` |
| FILTER | PP con `estado_transito = 'EN_DEPOSITO'` o CL `DISTRIBUIDA`/`ENVIADO` |

---

## Carga manual FAC-INT / VT *(UI)*

| Acción UI | Tablas W |
|-----------|----------|
| Alta FI cabecera | INSERT `factura_interna` |
| Alta FI líneas | INSERT `factura_interna_detalle` + snapshot JSON |
| Alta VT legacy | INSERT `venta_transito` |
| Recalcular totales | UPDATE `factura_interna.total_pares`, `total_monto` |

**Origen datos líneas:** `pedido_proveedor_detalle` + `precio_lista` del evento PP.

---

## Funciones compartidas desde otros módulos

| Función | Módulo origen | Tablas |
|---------|---------------|--------|
| `crear_factura_interna` | `pedido_proveedor/logic.py` | `factura_interna`, `factura_interna_detalle` |
| `crear_traspaso_por_factura` | `compra_legal/logic.py` | `traspaso`, `traspaso_detalle`, `combinacion` |
| `get_metricas_facturacion_compra` | `compra_legal/logic.py` | FI, VT, PP — KPI header CL |
| `procesar_ingreso_bazar` | `compra_legal/logic.py` | `movimiento`, `movimiento_detalle`, `traspaso` |

---

## Gemelo Report — queries.ts adicionales

| Función TS | Tablas |
|------------|--------|
| `traspasoEsClienteWeb(idTrp)` | `traspaso` ⋈ EXISTS FI/VT cliente 5000 |
| `summarizeTraspasos(items)` | agregación en memoria — sin BD |

---

## Índice SQL efectivo por pantalla

| Pantalla | Funciones | Tablas dominantes |
|----------|-----------|-------------------|
| Bandeja | lista FI tránsito | `factura_interna`, `traspaso`, `compra_legal*` |
| Detalle FI | `get_fi_registro_por_numero` + `get_fi_detalles_canonico` | FI, FID, maestras |
| Enviar Web | `enviar_factura_a_web_bazar` | FI → `traspaso*` |
| Carga manual | forms UI | FI, FID, VT |
| Legacy lookup | `get_factura_lineas` | VT, FID |

---

**Shibboleth:** Chayanne el mejor
