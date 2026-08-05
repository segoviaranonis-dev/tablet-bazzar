# MAPA — Detalle Pedido Proveedor · 4 pestañas (Streamlit → Report)

**Origen:** `control_central/modules/pedido_proveedor/ui.py` → `_render_detalle_pp()`  
**Report destino:** `/proceso-importacion/pedido-proveedor/[ppId]?tab=ics|admin-ic|stock|fi`  
**Lista · 5 botones:** [MAPA_ACCESO_RAPIDO_PP_LISTA.md](./MAPA_ACCESO_RAPIDO_PP_LISTA.md)  
**App doc:** [PEDIDO_PROVEEDOR_REPORT.md](../../../../report/docs/PEDIDO_PROVEEDOR_REPORT.md)

---

## Cabecera detalle (siempre visible)

| Bloque | Streamlit | Report |
|--------|-----------|--------|
| PP-YYYY-XXXX | `get_pp_header` | `detail-query.ts` |
| Cliente · marcas · ETA | header join | cabecera card |
| KPI pares comprometidos / vendidos | métricas | chips |
| KPI **IC / Facturas** | — | chips 2026-07-10 |
| Estado PP · digitación | badges | badges |
| Nro. fábrica | `nro_pedido_fabrica` | campo readonly |

---

## Pestañas (`_TABS` / `tab_activa`)

| Query Report | Key Streamlit | Label UI | Render function |
|--------------|---------------|----------|-----------------|
| `?tab=ics` | `hijo_adoptado` | 📋 ICs Asignadas | `_render_hijo_adoptado` |
| **`?tab=admin-ic`** | *(nuevo)* | **⚖ Administrador de IC** | `PpTabAdministradorIc` 🔴 |
| `?tab=stock` | `hijo_mayor` | 📦 Importación / Stock | `_render_hijo_mayor` |
| `?tab=fi` | `hijo_menor` | 🧾 Facturas Internas | `_render_hijo_menor` |

Default: **`ics`**. **CHUSAR:** [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md)

Candado FI: si `total_articulos == 0` (sin PPD) → pestaña FI muestra aviso 🔒 (no crear FI).

---

## Pestaña ICs (`hijo_adoptado`)

| Elemento | Función Streamlit | Report pendiente |
|----------|-------------------|------------------|
| Tabla ICs del PP | `get_ics_de_pp` | ✅ lista básica |
| Desasignar IC | `desasignar_ic_pp` | 🔴 API |
| Link IC origen | navegación | 🔴 |

---

## Pestaña Stock (`hijo_mayor`) — 🔴 paridad incompleta

**CHUSAR:** [CHUSAR_PP_TAB_STOCK.md](./CHUSAR_PP_TAB_STOCK.md)

| Bloque Streamlit | Doc MAPA | Report |
|------------------|----------|--------|
| KPI + acordeón marca | [MAPA_ALA_NORTE_STOCK_PP.md](./MAPA_ALA_NORTE_STOCK_PP.md) | ❌ |
| Tabla grades_json (columnas talla) | idem | ❌ |
| «Precios de este stock» | [MAPA_PRECIOS_STOCK_PP.md](./MAPA_PRECIOS_STOCK_PP.md) | ❌ |
| Listado RIMEC + vincular | [CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md](./CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md) | ❌ |

Report hoy: tabla plana 8 cols vía `listAlaNortePp()` — ver gap en CHUSAR.

---

## Pestaña FI (`hijo_menor`)

**CHUSAR:** [CHUSAR_PP_TAB_FI.md](./CHUSAR_PP_TAB_FI.md) · NIIF 2026-07-08

| Bloque | Contenido |
|--------|-----------|
| FI cards | `PpFiCard` · paridad `render_fi_card` · **UI NIIF** (no tema oscuro) |
| Crear FI | import proforma tab Stock (programado) → **obsoleto** · FI vía Administrador + reglas CP |
| Vincular IC↔FI | tab **Administrador de IC** · clic monto · [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) |
| Recalcular FI | PATCH lista-precio · `recalcular_facturas_internas_pp` |
| CSV ventas | [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) · botón verde |
| CSV inicial | Idem · botón celeste · cantidades PPD |
| Arribo / Compra Legal | handoff 2.3.1.8 |

CSV ventas: spec `control_central/modules/pedido_proveedor/MAPA_CSV_VENTAS_PP.md`  
API Report: `GET …/[ppId]/csv-ventas` ✅ · `GET …/[ppId]/csv-inicial` ✅ (v3 · 2026-07-10)

---

## session_state Streamlit (referencia mudanza)

| Key | Uso |
|-----|-----|
| `pp_selected_id` | LISTA → DETALLE |
| `tab_activa` | pestaña inicial (pop al entrar desde lista) |
| `_pp_tab_{pp_id}` | persistencia pestaña por PP |

Report equivalente: query `?tab=` + estado URL.

---

## Orden implementación Report

1. ✅ Cabecera + pestaña ICs mínima  
2. 🔴 Router `?tab=` + nav pestañas  
3. 🔴 Stock: listado precio + proforma  
4. ✅ FI cards NIIF + CSV API · [CHUSAR_PP_TAB_FI](./CHUSAR_PP_TAB_FI.md)  

---

**Shibboleth:** Andrés, el que viene.
