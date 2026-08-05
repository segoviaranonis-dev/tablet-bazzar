# 2.3.1.35.8 — PDF PE · grada y cantidad en dos contenedores (654)

**Código:** **2.3.1.35.8**  
**Fecha:** 2026-08-02 · **Documenta**  
**Padre:** Automatización informes **2.3.1.35** · Prep PDF **2.3.1.35.7**  
**Canon grada 654:** `rimec-web/docs/CONFECCIONES_638_VS_CALZADO_654.md` · notación `34(1 2 3 3 2 1)39`  
**Código:** `report/src/lib/automatizacion-informes/generar-pdf-stock-pe.ts`  
**Shibboleth:** Andrés, el que viene.

---

## Entendimiento Director (canónico)

En el PDF de stock PE (calzado **proveedor 654**) cada curva de grada y su cantidad son **dos contenedores distintos** en la misma fila, con **espacio considerable** entre ellos.  
**Prohibido** concatenar varias gradas en un solo string (`…/34(…)39/35(…)40…`) que se pisa con la tarjeta vecina.

### Forma obligatoria (una fila por curva)

```
[ 34(1 2 3 3 2 1)39 ]          [ 12 ]
[ 34(1 1 2 2 1 1)39 ]          [ 16 ]
[ 35(1 2 3 3 2 1)40 ]          [ 48 ]
[ 35(1 1 2 2 1 1)40 ]          [ 32 ]
```

| Contenedor izquierdo | Contenedor derecho |
|----------------------|--------------------|
| Fórmula grada canónica 654 | Cantidad (pares) de **esa** curva |
| Espacios dentro del `()` | Alineada / caja propia |
| Una curva = una fila | Nunca mezclar qtys en la fórmula |

---

## Verificación canónica

| Regla | Fuente | PDF |
|-------|--------|-----|
| Notación grada calzado | `34(1 2 3 3 2 1)39` (espacios) | `normalizarGradaCanon` — guiones web → espacios |
| Agrupación tarjeta | L+R+M+C (mismo color) | `agruparPorMolecula` |
| Varias curvas mismo color | Filas PPD distintas | `gradaLineas[]` — merge por fórmula + suma qty |
| Anti-patrón | `mat/col grada1/grada2/grada3` en una línea | **FAIL** — violado en PDF legacy 3 cols |
| Columnas grilla | 2 (no 3) | `COLS = 2` |
| Material · color | Nombres (`descp_*`) | Cabecera de tarjeta |
| Nombre imagen | stem archivo / `imagen_color_excel` | `img: …` |
| Excel padre | `stock_pronta_entrega_rimec.archivo_origen` vía `stock_pe_staging_migrated` | Cabecera + pie tarjeta |
| Sello OK | Solo si `saldo_pares = cantidad` Excel | `OK` / `NO` |

**638 confecciones:** este layout **no** aplica (peras ≠ manzanas). PDF PE automatizado filtra 654 / CALZADO.

---

## Implementación

| Pieza | Ruta |
|-------|------|
| Layout + `PeGradaLinea` | `generar-pdf-stock-pe.ts` |
| Query + Excel padre | `query-particion-pe.ts` |
| Smoke | `report/scripts/_smoke_pdf_layout_654.ts` → `.tmp/pdf-layout-654/` |

---

## Anti-patrones (prohibidos)

1. Unir gradas con `/` o `·` en un solo `drawText` que desborda la celda.  
2. Mostrar `34:1 35:2…` como sustituto de la fórmula canónica en este PDF (el Director pidió la fórmula completa + qty aparte).  
3. Tres columnas que estrechan el texto hasta pisarse.  
4. Inventar split de cantidad cuando una fila ya viene concatenada sin qty por curva (mostrar `—` en qty hasta corregir fuente).
