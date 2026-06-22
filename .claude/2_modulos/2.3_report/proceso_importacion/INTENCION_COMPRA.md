# 2.3.1.7.3 Intención de compra — inventario Streamlit

**CHUSAR:** [CHUSAR_INTENCION_COMPRA.md](./CHUSAR_INTENCION_COMPRA.md)  
**Tablas BD:** [TABLAS_MUDANZA_IC_DIG_PP.md](./TABLAS_MUDANZA_IC_DIG_PP.md) § 7.3  
**Report:** `/proceso-importacion/intencion-compra`  
**Streamlit:** `control_central/modules/intencion_compra/`

---

## Regla de oro

**Solo cabecera financiera.** Prohibido material, color, línea, referencia, proforma en UI IC.

---

## Archivos Streamlit

| Archivo | Rol |
|---------|-----|
| `ui.py` | Router `ic_vista` · bandejas · wizard · callbacks `on_change` |
| `logic.py` | CRUD · catálogos cache 1h · auditoría |
| `sidebar.py` | Navegación lateral |

---

## Catálogos (`logic.py` · `@st.cache_data ttl=3600`)

| Función | Tabla(s) |
|---------|----------|
| `get_proveedores` | `proveedor_importacion` |
| `get_clientes` | `cliente_v2` |
| `get_vendedores` | `usuario_v2` ⋈ `maestro_rol_acceso` |
| `get_marcas` | `marca_v2` |
| `get_plazos` | `plazo_v2` |
| `get_tipos` | `tipo_v2` |
| `get_categorias` | `categoria_v2` WHERE `id_categoria != 1` |
| `get_eventos_precio_cerrados` | `precio_evento` + `precio_lista` |
| `get_comisiones` | `comision_v2` |

---

## Bandejas

| Función | Filtro `estado` | UI |
|---------|-----------------|-----|
| `get_ics_pendientes` | `PENDIENTE_OPERATIVO` | Tarjetas editables inline |
| `get_ics_historial` | ≠ pendiente | Solo lectura |
| `get_ics_devueltas` | `DEVUELTO_ADMIN` | Reautorización |

JOINs bandeja: `marca_v2`, `cliente_v2`, `usuario_v2`, `proveedor_importacion`, `tipo_v2`, `categoria_v2`, `precio_evento`.

---

## CRUD

| Función | Tablas tocadas |
|---------|----------------|
| `save_intencion` | **INSERT** `intencion_compra` · **W** `flujo_auditoria` |
| `update_campo_ic` | **UPDATE** `intencion_compra` (campos permitidos) |
| `autorizar_ic` | **UPDATE** `intencion_compra.estado` → `AUTORIZADO` |
| `eliminar_ic` | **DELETE** `intencion_compra` (solo pendiente) |
| `anular_ic` | **UPDATE** → `ANULADO` |
| `reutorizar_ic` | **UPDATE** → `AUTORIZADO` desde devueltas |
| `calcular_neto` | — (aritmética) |

### Campos editables inline (`update_campo_ic`)

`tipo_id`, `categoria_id`, `id_marca`, `fecha_llegada`, `quincena_arribo_id`, `cantidad_total_pares`, `precio_evento_id`, `nota_pedido`, `monto_neto`

### INSERT completo (`save_intencion`)

Ver columnas en [TABLAS_MUDANZA_IC_DIG_PP.md](./TABLAS_MUDANZA_IC_DIG_PP.md).

---

## Preventa (sub-flujo)

| Función | Tablas |
|---------|--------|
| `get_pps_para_preventa` | `pedido_proveedor`, `pedido_proveedor_detalle` |
| `cargar_stock_preventa_pp` | PPD + stock |
| `crear_ic_preventa` | **INSERT** `intencion_compra` desde PP |

---

## Destino Report

| Código | Ruta |
|--------|------|
| 2.3.1.7.3 | hub |
| 2.3.1.7.3.1 | `…/bandeja` |
| 2.3.1.7.3.2 | `…/nueva` |

**API plan:** `/api/proceso-importacion/intencion-compra/*`

---

**Shibboleth:** Chayanne el mejor
