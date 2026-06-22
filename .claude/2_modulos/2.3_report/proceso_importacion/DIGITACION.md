# 2.3.1.7.4 Digitación — inventario Streamlit

**CHUSAR:** [CHUSAR_DIGITACION.md](./CHUSAR_DIGITACION.md)  
**Tablas BD:** [TABLAS_MUDANZA_IC_DIG_PP.md](./TABLAS_MUDANZA_IC_DIG_PP.md) § 7.4  
**Report:** `/proceso-importacion/digitacion`  
**Streamlit:** `control_central/modules/digitacion/`

---

## Rol en el ciclo

IC **`AUTORIZADO`** → asignación nro. fábrica → PP **`ABIERTO`** vía **`intencion_compra_pedido`**.

---

## Archivos

| Archivo | Rol |
|---------|-----|
| `ui.py` | `dg_vista`: `bandeja` · `asignacion` |
| `logic.py` | Lecturas · escrituras transaccionales · `log_flujo` |

---

## Lecturas

| Función | Tablas |
|---------|--------|
| `get_ics_pendientes` | `intencion_compra`, `marca_v2`, `categoria_v2`, `precio_evento`, `quincena_arribo` — sin fila en `intencion_compra_pedido` |
| `get_pps_abiertos` | `pedido_proveedor`, `intencion_compra_pedido` |
| `get_ics_de_pp` | `intencion_compra_pedido` ⋈ `intencion_compra` ⋈ `marca_v2` ⋈ `precio_evento` |
| `get_eventos_cerrados` | `precio_evento` WHERE `estado='cerrado'` |

---

## Escrituras

| Función | Tablas (orden) |
|---------|----------------|
| `crear_pp_digitacion` | **INSERT** `pedido_proveedor` (shell) |
| `asignar_ic` | **INSERT** `intencion_compra_pedido` · **UPDATE** `intencion_compra` · **UPDATE** `pedido_proveedor` |
| `cerrar_pp` | **UPDATE** `pedido_proveedor` (`estado_digitacion`, `nro_factura_importacion`) |
| `devolver_ic` | **UPDATE** `intencion_compra` → `DEVUELTO_ADMIN` |

### Puente `intencion_compra_pedido`

| Columna | Obligatorio |
|---------|-------------|
| `intencion_compra_id` | ✓ |
| `pedido_proveedor_id` | ✓ |
| `nro_pedido_fabrica` | ✓ |
| `precio_evento_id` | ✓ |
| `asignado_por` | usuario sesión |

### Side effects `asignar_ic`

- IC: `estado` → **`DIGITADO`**
- PP: acumula `pares_comprometidos`, hereda `proveedor_importacion_id`, `categoria_id`
- Auditoría: `A.DIG_IC_ASIGNADA`, `A.DIG_PP_CREADO`

---

## UI

- Métrica **ICs pendientes** (rojo si > 0)
- Devolver IC: `motivo_devolucion` obligatorio

---

## Destino Report

| Ruta | Paridad |
|------|---------|
| `…/digitacion` | `_render_bandeja` |
| `…/digitacion/asignar/[icId]` | `_render_asignacion` |

**API:** `/api/proceso-importacion/digitacion/*`

---

**Shibboleth:** Chayanne el mejor
