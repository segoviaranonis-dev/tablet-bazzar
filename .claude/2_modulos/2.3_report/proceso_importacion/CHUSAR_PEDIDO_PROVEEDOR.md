# CHUSAR — Pedido proveedor · Report (2.3.1.7.5)

**Subcuenta:** **2.3.1.7.5** · **Alias:** P.1.3  
**Estado CHUSAR:** 🟡 **TRÁNSITO ACTIVO**  
**Etapa:** [ETAPA_MUDANZA_IC_DIG_PP_REPORT.md](../../4_etapas/ETAPA_MUDANZA_IC_DIG_PP_REPORT.md)  
**Streamlit:** `control_central/modules/pedido_proveedor/`  
**Report:** http://localhost:3001/proceso-importacion/pedido-proveedor

**Mapas mudanza:** [MAPA_ACCESO_RAPIDO_PP_LISTA.md](./MAPA_ACCESO_RAPIDO_PP_LISTA.md) · [MAPA_ACCESO_RAPIDO_PP_DETALLE.md](./MAPA_ACCESO_RAPIDO_PP_DETALLE.md)

**Pestaña Stock:** [CHUSAR_PP_TAB_STOCK.md](./CHUSAR_PP_TAB_STOCK.md) — **Fase 1 ✅** (2026-07-03) · Fases 2–4 ⏳

**Universo tránsito (Director):** [CHUSAR_UNIVERSO_TRANSITO_PP.md](./CHUSAR_UNIVERSO_TRANSITO_PP.md) — CP · programado · mix · control hasta ENVIADO

**Compra previa + venta tránsito (Disp+Venta):** [CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md](../gestion_compra/CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md) · `/stock-transito` · PP `?ramo=compra_previa`

**Cabecera editable (2026-07-03):** [CHUSAR_PP_CABECERA_EDITABLE.md](./CHUSAR_PP_CABECERA_EDITABLE.md)

---

## Qué es

Gestión **PP** — F9, proforma Excel, listado precios, FI, envío Compra Legal.  
Card: *«SKUs F9, gradaciones, proformas y ventas en tránsito.»*

Formato: **`PP-YYYY-XXXX`**

---

## Router Streamlit

| Condición session | Vista |
|-------------------|-------|
| `pp_selected_id` | DETALLE |
| `pp_mostrar_form` | FORM nuevo |
| `pp_vista_showroom` | Showroom |
| default | LISTA |

---

## Vista LISTA

- `get_pedidos_proveedor(filtros)` · agrupación **quincena ETA**
- KPIs pares comprometidos / cards por PP

---

## Vista DETALLE — bloques críticos

| Bloque | Funciones |
|--------|-----------|
| Cabecera | `get_pp_header` |
| Listado RIMEC | `_render_listado_precio_pp`, `vincular_listado_precio_a_pp` |
| Ala Norte | `get_pp_ala_norte` · 5 pilares · F9 |
| Ala Sur | `get_ala_sur_facturas` · `render_fi_card` |
| Proforma | `parse_proforma`, `populate_pp_from_proforma` |
| FI | `crear_factura_interna`, `recalcular_facturas_internas_pp` |

**Bloqueo listado:** PP `ENVIADO` → `pp_listado_precio_editable = false`.

**Proforma:** 1 molécula (L+R+material+color+grada) = 1 PPD; filas Excel repetidas = cajas distintas.

---

## Estados PP

| Estado | Listado editable |
|--------|------------------|
| ABIERTO / CERRADO | Sí (reglas FI) |
| ENVIADO | **No** — Compra legal |

---

## Destino Report

| Código | Ruta |
|--------|------|
| 2.3.1.7.5 | Hub / lista |
| 2.3.1.7.5.2 | `…/nuevo` |
| 2.3.1.7.5.x | `…/[ppId]` detalle |

**Lista — Acceso rápido (5 botones):** [MAPA_ACCESO_RAPIDO_PP_LISTA.md](./MAPA_ACCESO_RAPIDO_PP_LISTA.md)

**API:** `/api/proceso-importacion/pedido-proveedor/*`

Reglas: `.cursor/rules/rimec-listado-pp-fi.mdc` · `core.fi_card`

Inventario: [PEDIDO_PROVEEDOR.md](./PEDIDO_PROVEEDOR.md)  
**Tablas BD:** [TABLAS_MUDANZA_IC_DIG_PP.md](./TABLAS_MUDANZA_IC_DIG_PP.md) § 7.5

---

**Shibboleth:** Chayanne el mejor
