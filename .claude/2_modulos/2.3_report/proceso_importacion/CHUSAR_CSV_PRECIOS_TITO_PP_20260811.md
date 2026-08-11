# CHUSAR — CSV precios Tito · Pedido proveedor · tab FI

**Código:** **2.3.1.7.5.3.17**  
**Fecha:** 2026-08-11 · **Orden:** Documenta · despliega Director  
**App:** `report/` · **Ruta UI:** `/proceso-importacion/pedido-proveedor/[ppId]?tab=fi`  
**Pedido:** usuario Tito · formato simple de precios por línea FI

---

## Norte

Agregar un **tercer** export CSV en Facturas Internas **sin deshabilitar** CSV ventas Carlos ni CSV inicial.

| Export | Botón | API | Formato |
|--------|-------|-----|---------|
| Ventas Carlos | 📄 CSV ventas | `…/csv-ventas` | Veneno Carlos (**2.3.1.7.5.3.4**) |
| Inicial | 📋 CSV inicial | `…/csv-inicial` | Mismo header Carlos · stock PPD |
| **Precios Tito** | **💰 CSV precios** | `…/csv-precios` | Este doc |

Ubicación UI: **a la izquierda** de CSV ventas (barra de pestañas + cabecera Ala Sur).

---

## Columnas (`;` · BOM UTF-8)

```
LINEA;REFERENCIA;MARCA;C. Mat;C. Cor;CANT;FacturaInterna;CLIENTE;NOMBRE DEL CLIENTE;NOMBRE VENDEDOR;D1;D2;D3;D4;Monto Sin Desc;Monto Con Desc
```

| Columna | Fuente |
|---------|--------|
| LINEA / REFERENCIA | `pedido_proveedor_detalle` |
| MARCA | `marca_v2` / cabecera FI |
| C. Mat / C. Cor | `material_code` / `color_code` |
| CANT | `factura_interna_detalle.pares` |
| FacturaInterna | `factura_carlos` → `pv_global` → dígitos `nro_factura` → `nro_factura` |
| CLIENTE / NOMBRE | `cliente_v2` |
| NOMBRE VENDEDOR | `SQL_VENDEDOR_PP_FI_NOMBRE` (vendedor_v2 · IC manda) |
| D1–D4 | FI / IC pareada |
| Monto Sin Desc | `ROUND(precio_unit × pares)` |
| Monto Con Desc | `ROUND(subtotal)` (fallback `precio_neto × pares`) |

---

## Código

| Pieza | Ruta |
|-------|------|
| Export | `report/src/lib/pedido-proveedor/csv-precios-export.ts` |
| API | `report/src/app/api/proceso-importacion/pedido-proveedor/[ppId]/csv-precios/route.ts` |
| UI | `PedidoProveedorDetalleClient.tsx` · `PpTabFacturasInternas.tsx` |

**Filtro FI:** PROGRAMADO → `RESERVADA`+`CONFIRMADA` · resto → `CONFIRMADA` (igual CSV ventas).

**Archivo:** `{numero_registro}_csv_precios.csv`

---

## Smoke local (2026-08-11)

PP `97` · `PP-2026-0037` · 646 líneas · montos y D1–D4 poblados.

Ejemplo:

`8379;270;BEIRA RIO;32021;35312;24;97001;104;MARIELE S.R.L.;GRICELDA;25;10;0;0;4087200;2758872`

---

## Deploy

Ver [CHUSAR_DEPLOY_CSV_PRECIOS_TITO_20260811.md](./CHUSAR_DEPLOY_CSV_PRECIOS_TITO_20260811.md)

**Hermano:** [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) (**2.3.1.7.5.3.4**)
