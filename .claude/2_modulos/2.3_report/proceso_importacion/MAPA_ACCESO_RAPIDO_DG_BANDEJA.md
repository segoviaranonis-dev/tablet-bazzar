# MAPA — Bandeja Digitación (Streamlit → Report)

**Origen:** `control_central/modules/digitacion/ui.py` · vista `bandeja`  
**Report:** `/proceso-importacion/digitacion` · `DigitacionBandejaClient`  
**CHUSAR:** [CHUSAR_DIGITACION.md](./CHUSAR_DIGITACION.md)  
**App doc:** [DIGITACION_REPORT.md](../../../../report/docs/DIGITACION_REPORT.md)

---

## Tabs bandeja Report

| Tab | Streamlit | Query | Acciones fila |
|-----|-----------|-------|---------------|
| **PENDIENTES** | Sección superior | IC `AUTORIZADO` sin puente PP | **Asignar →** · **Devolver** |
| **EN PROCESO** | Expander por PP | PP digitación abierta | **Cerrar PP** · link detalle PP |
| Tab Cerrados | PP `estado_digitacion=CERRADO` | acordeón **quincena** (igual Pedido PP) |

API bandeja: `GET /api/proceso-importacion/digitacion/bandeja`

---

## Fila PENDIENTES (IC)

| Columna | Fuente |
|---------|--------|
| IC-YYYY-XXXX | `intencion_compra.numero_registro` |
| Marca | join `marca_v2` |
| Categoría | `categoria_v2` |
| FECHA DE EMBARQUE | `quincena_arribo` label |
| Pares | `pares_comprometidos` |
| Evento precio | `precio_evento` (si ya ligado en IC) |

**Asignar →** navega a `…/digitacion/asignar/[icId]`  
**Devolver** → modal motivo → POST `…/devolver/[icId]` → IC `DEVUELTO_ADMIN`

---

## Fila EN PROCESO (PP)

| Elemento | Detalle |
|----------|---------|
| Cabecera expander | PP-YYYY-XXXX · nro. fábrica · pares · # ICs |
| Lista ICs | Puente `intencion_compra_pedido` |
| Cerrar PP | POST `…/digitacion/pp/[ppId]` · nro. factura importación |

Tras asignar IC → redirect **detalle PP** (`/pedido-proveedor/[ppId]`).

---

## Regla crítica

**El PP solo nace aquí.** No existe «Nuevo PP» en Pedido proveedor.

Lib: `report/src/lib/digitacion/actions.ts` → `asignarIc()`

---

**Shibboleth:** Chayanne el mejor
