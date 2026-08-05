# MAPA — «Precios de este stock» · proforma × precio_lista

**Origen:** `ui.py` → `_render_hijo_mayor` L998–1056  
**Query:** `logic.py` → `get_precios_stock_pp(pp_id, evento_id)`  
**CHUSAR padre:** [CHUSAR_PP_TAB_STOCK.md](./CHUSAR_PP_TAB_STOCK.md)

---

## Cuándo aparece

- `total_articulos > 0` (hay PPD)
- `get_evento_precio_pp(pp_id)` retorna `evento_id` (vía `intencion_compra_pedido.precio_evento_id`)
- `get_precios_stock_pp` no vacío

Si hay artículos sin LPN: `st.warning` con conteo `sin_precio`.

---

## Caption evento

```
Listado vigente: {nombre_evento} · [{estado}] · evento #{id} · Biblioteca: {bib}
Columna Caso = regla aplicada (biblioteca + Excel)
```

Fuente metadatos: `get_evento_precio_pp_detalle(pp_id)`.

---

## Tabla — columnas UI

| # | Header | Campo resultado | Formato |
|---|--------|-----------------|---------|
| 1 | Línea | `linea_codigo` | texto |
| 2 | Ref. | `referencia_codigo` | texto |
| 3 | Cód.Mat | `cod_material` | texto |
| 4 | Material | `material` | texto |
| 5 | Disp. | `saldo` | entero · saldo disponible |
| 6 | LPN | `lpn` | verde si existe · rojo si null |
| 7 | LPC02 | `lpc02` | número |
| 8 | LPC03 | `lpc03` | número |
| 9 | LPC04 | `lpc04` | número |
| 10 | Caso aplicado | `caso_precio` | `nombre_caso_aplicado` |
| 11 | Dólar | `dolar_aplicado` | caption |
| 12 | Índice | `indice_aplicado` | caption |

---

## Join SQL (regla de negocio)

**Proforma (PPD)** se cruza con **precio_lista (evento)** por FK pilares:

```
ppd.linea         → linea.codigo_proveedor  → linea.id
ppd.referencia    → referencia.codigo_proveedor → referencia.id
ppd.material_code → material.codigo_proveedor → material.id

precio_lista WHERE evento_id = :evento
  AND linea_id = l.id
  AND referencia_id = ref.id
  AND material_id = m.id
```

Precio importadora = **L+R+material** (color/grada no cambian LPN).

Legacy fallback en `_lookup_lpn_evento`: `linea_codigo` / `material_descripcion` texto.

---

## Diferencia vs Ala Norte

| Ala Norte | Precios stock |
|-----------|---------------|
| Solo PPD + venta_transito | PPD + **precio_lista** |
| Todas las columnas molécula | Foco comercial LPN/LPC |
| grades_json / tallas | No (saldo en Disp.) |

Ambas tablas comparten el mismo universo de filas PPD (misma molécula).

---

## Report — implementación

**Lib nueva:** `report/src/lib/pedido-proveedor/precios-stock-query.ts`  
Port 1:1 de `get_precios_stock_pp` SQL.

**UI:** sección bajo Ala Norte en `PedidoProveedorDetalleClient` tab `stock` · subheader «Precios de este stock».

**API:** `GET /api/proceso-importacion/pedido-proveedor/[ppId]/precios-stock`

---

## Smoke PP-2026-0007

- Evento #18 · Biblioteca 1905 · estado CERRADO
- 164 filas · LPN visible en verde donde hay match en listado
- Caso ej. `BR-VZ-MD-ML-MKA-O` · Dólar 7200 · Índice 12960

---

**Shibboleth:** Chayanne el mejor
