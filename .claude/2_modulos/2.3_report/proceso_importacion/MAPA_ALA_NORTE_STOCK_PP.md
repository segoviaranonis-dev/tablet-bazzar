# MAPA — Ala Norte · tabla stock F9/proforma

**Origen:** `ui.py` → `_render_ala_norte(id_pp)` · L1982–2110  
**Query:** `logic.py` → `get_pp_ala_norte()`  
**CHUSAR padre:** [CHUSAR_PP_TAB_STOCK.md](./CHUSAR_PP_TAB_STOCK.md)

---

## KPI caption (siempre visible)

```
{N} artículos · {inicial:,} pares iniciales · {vendido:,} vendidos · {saldo:,} disponibles
```

Cálculo: `SUM(cantidad_inicial)`, `SUM(vendido)`, `SUM(saldo)` sobre `get_pp_ala_norte`.

---

## Acordeón 1 — «Ver resumen por marca»

**Condición:** `df["marca"].nunique() > 1`  
**UI:** `st.expander("Ver resumen por marca", expanded=False)`

| Columna | Agregación |
|---------|------------|
| Marca | `groupby("marca")` |
| Inicial | `sum(cantidad_inicial)` |
| Vendido | `sum(vendido)` |
| Saldo | `sum(saldo)` |

Report: componente `MarcaResumenExpander` — misma tabla, colapsada por defecto.

---

## Tabla principal Ala Norte

### Columnas fijas (info)

| Streamlit header | Campo SQL | Notas |
|------------------|-----------|-------|
| Marca | `mv.descp_marca` | |
| Línea | `ppd.linea` | código proveedor |
| Ref. | `ppd.referencia` | |
| Código | `ppd.style_code` | L.R compacto |
| Cód.Mat | `ppd.material_code` | |
| Material | `ppd.descp_material` | |
| Cód.Col | `ppd.color_code` | |
| Color | `ppd.descp_color` | |
| Tallas | `ppd.grada` | rango texto `34-39` |
| x Caja | calc | `Inicial / cantidad_cajas` (entero) |

### Columnas dinámicas — distribución grada

**Fuente:** `ppd.grades_json` (JSON por fila)

1. Recorrer todas las filas → recolectar keys talla únicas
2. Ordenar con `extraer_valor_numerico_talla` (numérico)
3. Por cada talla `g`: columna con unidades = `grades_json[g]`

Ejemplo fila MOLECA 5259.805: columnas `33…40` con patrón `0,1,2,3,3,2,1,0` (12 pares/caja).

**Formato compacto (CSV):** `_fmt_grades` → `"34:1  35:2  36:3…"` — ver `MAPA_CSV_VENTAS_PP.md`.

### Columnas totales

| Inicial | Vendido | Saldo |
|---------|---------|-------|
| `cantidad_pares` | `max(pares_vendidos, sum vt)` | inicial − vendido |

---

## Acordeón tabla completa (Report — recomendado)

Streamlit muestra la tabla **sin** expander envolvente (scroll horizontal).  
En Report (pantalla clara): envolver tabla en `<details>` o acordeón **«Ver detalle moléculas ({N})»** para no saturar — paridad UX con lista PP por quincena.

---

## Report hoy vs destino

| Elemento | Report actual | Destino |
|----------|---------------|---------|
| KPI caption | parcial (moléculas · pares) | 4 métricas |
| Resumen marca | ❌ | acordeón |
| Columnas talla | ❌ solo `grada` texto | columnas dinámicas JSON |
| x Caja | ❌ | calc |
| Código / Cód.Mat / Cód.Col | ❌ | columnas opcionales toggle |

---

## SQL canónico

Ver `get_pp_ala_norte` en `control_central/modules/pedido_proveedor/logic.py` L408–449.  
Report: extender `listAlaNortePp()` → incluir `grades_json`, `style_code`, `material_code`, `color_code`, `cantidad_cajas`.

---

**Shibboleth:** Chayanne el mejor
