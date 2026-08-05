# MAPA — 5 botones «Acceso rápido» · Lista Pedido Proveedor (Streamlit)

**Origen:** `control_central/modules/pedido_proveedor/ui.py` → `_render_lista_pp()` · columna **Acceso rápido** (`col_btn`)  
**Pantalla:** LISTA · filas dentro del acordeón por quincena (`_quincena_label` / `fecha_eta`)  
**Report destino:** `/proceso-importacion/pedido-proveedor` → fila PP → detalle con pestañas  
**CSV spec extendida:** `control_central/modules/pedido_proveedor/MAPA_CSV_VENTAS_PP.md`  
**Shibboleth:** Chayanne el mejor

---

## Contexto UI (Streamlit)

| Elemento | Ubicación |
|----------|-----------|
| Vista | `LISTA` (default router `ui.py`) |
| Agrupación | Acordeón por quincena derivada de `fecha_arribo_estimada` (`fecha_eta`) |
| Fila PP | 5 columnas: Pedido/Marcas · ETA·Cliente · Pares · Estado · **Acceso rápido** |
| Detalle destino | `_render_detalle_pp(id_pp)` — cabecera + 3 pestañas («hijos») |

**Router detalle (session_state):**

| Key | Efecto |
|-----|--------|
| `pp_selected_id = int` | Cambia LISTA → DETALLE |
| `tab_activa` (pop al entrar) | Pestaña inicial en detalle |
| `_pp_tab_{pp_id}` | Pestaña activa persistente por PP |

**Pestañas detalle (`_TABS`):**

| `tab_activa` / `_pp_tab_*` | Label UI | Render |
|----------------------------|----------|--------|
| `hijo_adoptado` | 📋 ICs Asignadas | `_render_hijo_adoptado` |
| `hijo_mayor` | 📦 Importación / Stock | `_render_hijo_mayor` |
| `hijo_menor` | 🧾 / 🔒 Facturas Internas | `_render_hijo_menor` |

Default pestaña detalle: **`hijo_adoptado`**.

Candado FI: si `header["total_articulos"] == 0` → pestaña menor muestra 🔒 y `_render_hijo_menor` solo aviso (sin stock importado).

---

## Los 5 botones (orden visual Streamlit)

```
┌─────────────────────────┐
│      Abrir →            │  ← Fila 1 · primary · ancho completo
├───────┬───────┬─────────┤
│  📋   │  📦   │   🧾    │  ← Fila 2 · 3 columnas iguales
├───────┴───────┴─────────┤
│       📄 CSV              │  ← Fila 3 · condicional
└─────────────────────────┘
```

---

## Botón 1 — **Abrir →**

| Campo | Valor |
|-------|--------|
| **Etiqueta** | `Abrir →` |
| **Tipo** | `st.button` · `type="primary"` · `use_container_width=True` |
| **Key** | `pp_open_{pp.id}` |
| **Archivo** | `ui.py` L344–348 |

**Acción:**

```python
st.session_state["pp_selected_id"] = int(pp["id"])
st.session_state.pop("tab_activa", None)  # pestaña default del detalle
st.rerun()
```

**Destino:** DETALLE PP · pestaña **ICs Asignadas** (default `hijo_adoptado`).

**Report equivalente:**

| Código | Ruta |
|--------|------|
| 2.3.1.7.5.x | `/proceso-importacion/pedido-proveedor/[ppId]` |
| Query opcional | sin `tab` → default `ics` |

**API / datos:** `get_pp_header(pp_id)` · ya en `report/src/lib/pedido-proveedor/detail-query.ts`.

---

## Botón 2 — **📋** (ICs Asignadas)

| Campo | Valor |
|-------|--------|
| **Icono** | 📋 |
| **Help** | `ICs Asignadas` |
| **Key** | `pp_tab_ic_{pp.id}` |
| **Archivo** | `ui.py` L351–355 |

**Acción:**

```python
st.session_state["pp_selected_id"] = int(pp["id"])
st.session_state["tab_activa"] = "hijo_adoptado"
st.rerun()
```

**Contenido pestaña (`_render_hijo_adoptado`):**

| Bloque | Función / tabla |
|--------|-----------------|
| Listado IC | `get_datos_ics_de_pp(pp_id)` → `intencion_compra_pedido` + `intencion_compra` |
| KPIs | # ICs · total pares |
| Columnas | NRO IC · Marca · Pares · Nro Fábrica · ETA |
| Acción fila | **⬆ Mover** → `desasignar_ic_de_pp(ic_id, pp_id)` · devuelve IC al pool Digitación |

**Report equivalente:**

- Ruta: `…/pedido-proveedor/[ppId]?tab=ics`
- API existente: `GET /api/proceso-importacion/pedido-proveedor/[ppId]` → `ics[]`
- Pendiente mudanza: POST desasignar IC

---

## Botón 3 — **📦** (Importación / Stock)

| Campo | Valor |
|-------|--------|
| **Icono** | 📦 |
| **Help** | `Importación / Stock` |
| **Key** | `pp_tab_stock_{pp.id}` |
| **Archivo** | `ui.py` L356–360 |

**Acción:**

```python
st.session_state["pp_selected_id"] = int(pp["id"])
st.session_state["tab_activa"] = "hijo_mayor"
st.rerun()
```

**Contenido pestaña (`_render_hijo_mayor`) — dos modos:**

### A · Sin stock (`total_articulos == 0`)

| Bloque | Función |
|--------|---------|
| Import proforma | `_render_importar_proforma` → `parse_proforma` + `populate_pp_from_proforma` |
| Listado precios | `_render_listado_precio_pp` → `vincular_listado_precio_a_pp` |

### B · Con stock importado

| Bloque | Función / tabla |
|--------|-----------------|
| Ala Norte | `_render_ala_norte` → `get_pp_ala_norte` · `pedido_proveedor_detalle` |
| Borrar/reimportar | `_render_borrar_reimportar` · `borrar_importacion_pp` (solo ventas=0) |
| Precios LPN/LPC | `get_precios_stock_pp` · join `precio_lista` + evento PP |
| Listado RIMEC | `_render_listado_precio_pp` |

**Reglas listado:**

- Editable si `pp_listado_precio_editable(pp_id)` → PP **no** `ENVIADO`
- Evento desde `intencion_compra_pedido.precio_evento_id` o vínculo PP
- Vincular: `vincular_listado_precio_a_pp` · opción recalcular FI RESERVADA

**Report equivalente:**

- Ruta: `…/pedido-proveedor/[ppId]?tab=stock`
- Fase mudanza: proforma upload · ala norte grid · panel listado evento

---

## Botón 4 — **🧾** (Facturas Internas)

| Campo | Valor |
|-------|--------|
| **Icono** | 🧾 |
| **Help** | `Facturas Internas` |
| **Key** | `pp_tab_fi_{pp.id}` |
| **Archivo** | `ui.py` L361–365 |

**Acción:**

```python
st.session_state["pp_selected_id"] = int(pp["id"])
st.session_state["tab_activa"] = "hijo_menor"
st.rerun()
```

**Contenido pestaña (`_render_hijo_menor`) — requiere stock:**

| Bloque | Función |
|--------|---------|
| Candado | Sin PPD → warning «importá en pestaña anterior» |
| Arribo | `_render_arribo` → `registrar_arribo` · stock Bazar |
| Facturas | `_render_facturas_internas` → `get_facturas_interna_de_pp` · `render_fi_card` / `get_fi_detalles_canonico` |
| Reparar stock | `_render_boton_reparar_stock` · anula FI RESERVADA huérfanas |
| Compra legal | `_render_enviar_a_compra` → `estado = ENVIADO` |
| Legacy | expander showroom · `_render_ala_sur` · `venta_transito` |

**Ley FI:** `.cursor/rules/rimec-ley-fi-card.mdc` · 5 pilares + imagen en snapshot.

**Report equivalente:**

- Ruta: `…/pedido-proveedor/[ppId]?tab=fi`
- Si `total_articulos == 0`: UI bloqueada con mensaje (paridad 🔒)

---

## Botón 5 — **📄 CSV**

| Campo | Valor |
|-------|--------|
| **Etiqueta** | `📄 CSV` |
| **Help** | `Descargar CSV ventas` |
| **Key** | `pp_csv_{pp.id}` |
| **Archivo** | `ui.py` L367–401 |
| **Spec 21 cols** | `MAPA_CSV_VENTAS_PP.md` |

**Visibilidad (condición AND):**

```sql
SELECT COUNT(*) FROM factura_interna
WHERE pp_id = :pp_id AND estado = 'CONFIRMADA'
-- > 0 → mostrar botón
```

> **Nota schema:** en código Streamlit la columna es `factura_interna.pp_id`. Validar alias `pedido_proveedor_id` en Supabase vigente antes de portar SQL a Report.

**Flujo click:**

1. `generar_csv_resumen_ventas_pp(pp_id)` → escribe `control_central/temp/{numero_registro}_ventas_{timestamp}.csv`
2. Segundo paso: `st.download_button` «⬇ Descargar»
3. Encoding UTF-8 BOM · 21 columnas · una fila por `factura_interna_detalle` (solo FI CONFIRMADA)

**Report equivalente:**

| Código | Entrega |
|--------|---------|
| API ventas | `GET /api/proceso-importacion/pedido-proveedor/[ppId]/csv-ventas` |
| API inicial | `GET /api/proceso-importacion/pedido-proveedor/[ppId]/csv-inicial` |
| UI lista | **📄 Ventas** (verde) + **📋 Inicial** (celeste) · columna Acceso rápido |
| Ref ventas | FI confirmadas · pares facturados |
| Ref inicial | Stock importado · `cantidad_pares` PPD |
| Doc | [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) v3 |

---

## Botones adyacentes (NO son los 5 — columna ETA)

Documentados para no confundir con Acceso rápido:

| Botón | Columna | Función |
|-------|---------|---------|
| ✏ ETA | ETA · Cliente | `actualizar_eta_pp` · inline date_input |
| 📦 Quincena | ETA · Cliente | `update_quincena_pp` · slider 0–24 · `quincena_arribo` |

Report: edición ETA/quincena puede vivir en detalle cabecera (ya parcial en Digitación cierre).

---

## Matriz replicación Report (orden sugerido)

| # | Botón Streamlit | Report UI (lista) | Report detalle `?tab=` | Prioridad |
|---|-----------------|-------------------|-------------------------|-----------|
| 1 | Abrir → | Link PP + botón primary | default `ics` | ✅ parcial |
| 2 | 📋 | Icon shortcut | `ics` | 🟡 |
| 3 | 📦 | Icon shortcut | `stock` | 🔴 (proforma/F9) |
| 4 | 🧾 | Icon shortcut | `fi` | 🔴 (FI cards) |
| 5 | 📄 CSV | Download condicional | API blob | 🟡 |

---

## Archivos fuente Streamlit (índice)

| Archivo | Rol |
|---------|-----|
| `modules/pedido_proveedor/ui.py` | Lista + botones + router detalle |
| `modules/pedido_proveedor/logic.py` | Queries · vincular listado · ICs · FI |
| `modules/pedido_proveedor/MAPA_CSV_VENTAS_PP.md` | Contrato CSV 21 columnas |
| `core/csv_utils.py` | `generar_csv_resumen_ventas_pp` (import en ui) |
| `core/fi_card.py` | Tarjeta FI canónica |
| `.cursor/rules/rimec-listado-pp-fi.mdc` | Listado ↔ FI |

---

## Criterio PASS auditoría (Report)

- [ ] Los 5 botones visibles en cada fila PP del acordeón quincena
- [ ] Botones 2–4 abren detalle en pestaña correcta (deep link `?tab=`)
- [ ] Botón 5 oculto si `COUNT(FI CONFIRMADA)=0`
- [ ] Botón 4 respeta candado sin PPD
- [ ] Paridad KPI fila: pares · vendido · % ejecutado (lista ya agrupada)

**Última actualización:** 2026-06-23 · Cursor · mapa para mudanza 7.5
