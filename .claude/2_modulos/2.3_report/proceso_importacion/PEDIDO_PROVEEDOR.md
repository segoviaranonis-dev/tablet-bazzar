# 2.3.1.7.5 Pedido proveedor — inventario Streamlit

**CHUSAR:** [CHUSAR_PEDIDO_PROVEEDOR.md](./CHUSAR_PEDIDO_PROVEEDOR.md)  
**Mapas UI:** [MAPA_ACCESO_RAPIDO_PP_LISTA.md](./MAPA_ACCESO_RAPIDO_PP_LISTA.md) · [MAPA_ACCESO_RAPIDO_PP_DETALLE.md](./MAPA_ACCESO_RAPIDO_PP_DETALLE.md)  
**App:** [PEDIDO_PROVEEDOR_REPORT.md](../../../../report/docs/PEDIDO_PROVEEDOR_REPORT.md)  
**Tablas BD:** [TABLAS_MUDANZA_IC_DIG_PP.md](./TABLAS_MUDANZA_IC_DIG_PP.md) § 7.5  
**Report:** `/proceso-importacion/pedido-proveedor`  
**Streamlit:** `control_central/modules/pedido_proveedor/`

---

## Archivos

| Archivo | Rol |
|---------|-----|
| `ui.py` | Router LISTA / DETALLE / FORM / showroom |
| `logic.py` | CRUD · parsers · listado · FI |
| `showroom.py` | Vista showroom |

---

## Router (`session_state`)

| Key | Vista |
|-----|-------|
| `pp_selected_id` | DETALLE |
| `pp_mostrar_form` | FORM |
| `pp_vista_showroom` | Showroom |
| default | LISTA |

---

## Tablas por bloque UI

| Bloque UI | Tablas principales |
|-----------|-------------------|
| Lista PP | `pedido_proveedor`, `pedido_proveedor_detalle`, `intencion_compra_pedido`, `venta_transito`, `marca_v2`, `cliente_v2`, `usuario_v2` |
| Cabecera detalle | `pedido_proveedor`, `proveedor_importacion`, `quincena_arribo` |
| Ala Norte (F9/proforma) | `pedido_proveedor_detalle`, `material`, `color`, `marca_v2` |
| Ala Sur (FI) | `factura_interna`, `factura_interna_detalle`, `venta_transito` |
| Listado precios | `precio_evento`, `precio_lista`, `intencion_compra_pedido` |
| Import proforma | **UPDATE** `pedido_proveedor` · **INSERT** `pedido_proveedor_detalle` · **UPSERT** `material`/`color` |
| Enviar compras | **UPDATE** `pedido_proveedor.estado` → `ENVIADO` · `compra_legal_pedido` |

---

## Funciones críticas → tablas

| Función | Escritura |
|---------|-----------|
| `save_pp` | **INSERT** `pedido_proveedor` + `pedido_proveedor_detalle` · **UPDATE** IC |
| `populate_pp_from_proforma` | **UPDATE** PP cabecera · **INSERT** PPD · pilares |
| `vincular_listado_precio_a_pp` | `guardar_configuracion_pp` + SQL `vincular_listado_a_pp` |
| `recalcular_facturas_internas_pp` | **UPDATE** `factura_interna` + detalle |
| `crear_factura_interna` | **INSERT** FI + `factura_interna_detalle` |
| `borrar_importacion_pp` | **DELETE** PPD / reset import |
| `parse_f9` / `parse_proforma` | — (parse → memoria) |

---

## `pedido_proveedor_detalle` — columnas clave

Pilares: `linea`, `referencia`, `id_material`, `id_color`, `id_marca`, `grada`, `grades_json`  
Tallas: `t33`…`t40`, `cantidad_cajas`, `cantidad_pares`  
FOB: `unit_fob`, `unit_fob_ajustado`, `amount_fob`  
Precio: `lpn_congelado` (post-vincular listado)

---

## Estados PP

| `estado` | Listado PP editable |
|----------|---------------------|
| ABIERTO / CERRADO | Sí (`pp_listado_precio_editable`) |
| ENVIADO | **No** — Compra Legal |

---

## Vinculación listado ↔ FI

Ver `.cursor/rules/rimec-listado-pp-fi.mdc`:

- Un `precio_evento_id` sincronizado en PP + ICs (`intencion_compra_pedido`)
- `recalcular_facturas_internas_pp` al cambiar evento
- `render_fi_card` + `get_fi_detalles_canonico`

---

## Destino Report

| Código | Ruta |
|--------|------|
| 2.3.1.7.5 | hub / lista |
| 2.3.1.7.5.2 | `…/nuevo` |
| 2.3.1.7.5.x | `…/[ppId]` detalle |

**Lista — 5 botones Acceso rápido (Streamlit):** [MAPA_ACCESO_RAPIDO_PP_LISTA.md](./MAPA_ACCESO_RAPIDO_PP_LISTA.md)

**API:** `/api/proceso-importacion/pedido-proveedor/*`

---

**Shibboleth:** Chayanne el mejor
