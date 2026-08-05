# 2.3.1.1.2 — PDF gerencial · subtotales: banda azul desde el nivel (receta cocina)

**Código:** **2.3.1.1.2**  
**Fecha:** 2026-08-04 · **Documenta** + **Documentación Chusar**  
**Padre:** Sales Report **2.3.1.1** · etapa `SALES-REPORT-PDFS-20260804`  
**Motor:** `report/src/lib/rimec/pdf-gerencial.ts` · filas `pdf-rows-from-snapshot.ts`  
**Shibboleth:** Andrés, el que viene.

> **Receta del menú (cocina PDF):** si alguien toca el PDF gerencial de Sales Report, **esto** es la ley visual de subtotales. No improvisar. No pintar la fila entera.

---

## Entendimiento Director (canónico)

El subtotal se identifica en la columna del **nivel jerárquico** donde nace el grupo. El azul (fondo de banda) **empieza ahí** y corre **solo a la derecha** hasta el final de la fila.

**Prohibido** que el azul invada columnas padre a la izquierda (lo marcado en naranja por el Director en Cartera Completa).

### Ejemplo Cartera Completa

Jerarquía: **CADENA → CLIENTE → MARCA → MES** · MONTO OBJ · MONTO 26 · VARIACIÓN %

| Subtotal de… | Columna de inicio (`startCol`) | Azul pinta | Blanco (sin azul) |
|--------------|--------------------------------|------------|-------------------|
| Marca (`+ BEIRA RIO`) | **MARCA** | MARCA → VARIACIÓN % | CADENA · CLIENTE |
| Cliente (`+ CAFSA…`) | **CLIENTE** | CLIENTE → VARIACIÓN % | CADENA |
| Cadena (`+ …`) | **CADENA** | toda la fila desde CADENA | — |

```
Antes (FAIL):  [████ azul ███████████████████████████████]
               CADENA  CLIENTE  MARCA+  …montos…

Ahora (OK):    [blanco][blanco][████ azul desde MARCA →]
               CADENA  CLIENTE  + MARCA  …montos…
```

---

## Receta (pasos del motor)

1. Al armar el subtotal (`pushSub`), guardar `startCol = indexOf(gCol)` — columna del grupo.
2. Celdas `i < startCol` → texto vacío · sin banda azul.
3. Pintar rectángulo azul **solo** desde `x = MARGIN + Σ(widths[0..startCol))` hasta el borde derecho útil.
4. Acento lateral (raya navy) en el **borde izquierdo de esa banda**, no en el margen de página si `startCol > 0`.
5. Etiqueta: `+  Nombre` (WinAnsi-safe; **no** usar `Σ`).
6. Sin subtotal en último nivel (MES); sin eco si el grupo tiene una sola hoja.

---

## Implementación

| Pieza | Dónde |
|-------|--------|
| `BuiltRow.startCol` | `pdf-gerencial.ts` |
| Paint banda / acento / borde | loop draw · rama `isSub` |
| Datos Cartera Completa | `rowsCarteraCompleta` · `groupCols` Cadena→Cliente→Marca→Mes |
| Smoke | `report/scripts/_smoke_rimec_pdf_ampliado.ts` · `_probe_cartera_mes.mts` |

---

## Anti-patrones (prohibidos)

1. `drawRectangle` de subtotal con `x: MARGIN` y `width: usable` (pinta izquierda).  
2. Zebra / fondo azul en columnas padre vacías.  
3. Cambiar solo UI `/rimec` y dejar el PDF con banda full-width.  
4. Inventar otro color/estilo sin orden Director — la familia azul subtítulo (`SUB` / `SUB_SOFT` / `SUB_DEEP`) es la cocina vigente.

---

## Alcance

- **Sí:** PDF gerencial Sales Report (Cartera Completa y cualquier tabla que use el mismo motor + subtotales).  
- **No:** UI segmentos Clientes (crecimiento/riesgo) · Streamlit UI cartera · pilares · deploy sin cierre/orden.
