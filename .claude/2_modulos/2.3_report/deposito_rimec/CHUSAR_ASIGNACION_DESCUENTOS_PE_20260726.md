# CHUSAR — Asignación de descuentos PE + Ley división FI + LP03

**Código:** **2.3.1.10.1.4**  
**Par Web:** **2.2.1.26**  
**Ley anexa:** **2.3.1.10.1.4.1** (este doc §3–§5 = ley canónica)  
**Etapa:** `ASIGNACION-DESCUENTOS-PE-20260726`  
**Fecha:** 2026-07-26  
**Keyword:** Documenta · Documentación Chusar  
**Apps:** Report `/stock-pronta-entrega` · RIMEC Web carrito/FI · Aprobaciones  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Problema

El descuento lo define el **vendedor**. Eso genera fuga de margen.  
Además, sin reglas claras de **split de factura**, se mezclan cadenas/marcas/casos en una sola FI.

## 2 · Solución — Asignador (dictador) Stock PE

| Paso | Comportamiento |
|------|----------------|
| 1 | Botón en barra **FILTRO CATÁLOGO RIMEC WEB** (misma franja que TODOS · NORMAL · PROMOCIONAL · LIQUIDACION · COMUN) |
| 2 | Modo ON → panel asignación **+ grilla visible** (filtrar / ver moléculas) |
| 3 | Trabajo: filtrar universo → asignar % a **moléculas del filtro** |
| 4 | Valor = **%** entero o decimal (ej. `7.5`) |
| 5 | Aplica a **todas las moléculas** del filtro (dato de grilla / molécula) |
| 6 | % viaja a **RIMEC Web**, se incrusta en artículo → **factura sale con descuento** |

### Libertad vendedor + pintura admin

| Actor | Puede |
|-------|--------|
| **Dictador (Report · solo DIOS)** | Asigna el % oficial (botón + POST) |
| ADMIN Report (ej. EVERT) | Ve Stock PE · **no** asigna % · [**2.3.1.10.1.4.2**](./CHUSAR_USUARIO_EVERT_STOCK_PE_20260727.md) |
| Vendedor (Web) | Subir / bajar / alterar el % con libertad |
| Admin (Aprobaciones) | Casilla **blanca** = % dictado intacto · **sombreada** = editado por vendedor |

**Gate 2026-07-27:** POST `/api/stock-pronta-entrega/asignacion-descuento` = `requireMotorPreciosNivelDios`.

**Overwrite (2026-07-28 · verificado):** `ON CONFLICT (batch, L, R, mat, color) DO UPDATE` pisa el %. Web/carrito toma la fila con `updated_at` más reciente. Corte import nuevo: [2.3.1.10.1.5](./CHUSAR_PE_SDRM2121_IMPORT_ASIGNACION_20260728.md).

---

## 3 · Ley inviolable — División de facturas (RIMEC Web)

### 3.1 Pronta entrega (Stock PE) — R-FI-PE-CADENA

Los cuatro marcos de la barra filtro Web:

| UI | Cadena canónica |
|----|-----------------|
| **NORMAL** | `REGULAR` |
| **PROMOCIONAL** | `PROMOCIONAL` |
| **LIQUIDACION** | `LIQUIDACION` |
| **COMUN** | `COMUN` |

**Ley:** esas cuatro cadenas **nunca** pueden compartir la misma factura interna.  
**Sí o sí** se dividen. Cualquier mezcla = violación (extiende R-FI-2 a las **cuatro** cadenas, no solo Promo/LIQ).

```
1 FI = 1 cadena comercial PE ∈ {REGULAR, PROMOCIONAL, LIQUIDACION, COMUN}
```

Referencia código existente: `rimec-web/lib/facturaCelulaClave.ts` · `violacionSegregacionCadenas` (cualquier set.size > 1).

### 3.2 Compra previa (Stock CP) — R-FI-CP-CASO

Misma lógica de segregación, pero el eje es el **caso biblioteca** (no la cadena PE).

```
1 FI = 1 caso (caso_id / clave caso)
```

**Ley histórica R-FI-1:** 1 PP × 1 Marca × 1 Caso.  
Doc: [CHUSAR_HOTFIX_FI_CASOS_DISTINTOS_20260722.md](../../2.2_rimec_web/CHUSAR_HOTFIX_FI_CASOS_DISTINTOS_20260722.md) (**2.2.1.19** · `4.01.06.001`).

### 3.3 Marca — R-FI-MARCA (PE y CP)

**En ambos mundos (PE y CP):**

```
1 FI = 1 sola marca
```

**Prohibido** mezclar dos marcas distintas en una sola factura.

### 3.4 Matriz de split (resumen)

| Origen | Debe separar por | También separar por |
|--------|------------------|---------------------|
| **PE** | Cadena: NORMAL / PROMO / LIQ / COMUN | Marca |
| **CP** | Caso biblioteca | Marca |
| **Ambos** | — | Marca (siempre) |

Clave FI conceptual:

| Origen | Clave mínima |
|--------|----------------|
| PE | `marca_id × cadena_comercial` (+ caso si aplica) |
| CP | `marca_id × caso_id` |

---

## 4 · Ley — Cuatro grados de descuento + LP03

La FI lleva cascada **`descuento_1` … `descuento_4`** (MIG-100 · por factura).  
Director: **hay cuatro grados de descuento**.

### 4.1 Grado 1 — Regla LP03 (+10 %)

| Campo | Valor |
|-------|--------|
| **Nombre** | Regla LP03 |
| **Grado** | **1** (primero) |
| **Efecto** | **+10 % de descuento** si el artículo / lista está en **LP03** |
| **Apilamiento** | Es **aparte** del descuento que asigna el dictador en Stock PE |
| **Orden** | LP03 (10 %) **más** el % asignado en Asignación de descuentos |
| **Excepción** | **PROMOCIONAL** → **no** aplica Grado 1 (anti doble descuento) · **2.3.1.10.1.4.4** |

Ejemplo conceptual:

```
precio_lista (contexto LP03)
→ SI NO PROMOCIONAL: aplica Grado 1: −10 % (LP03)
→ aplica Grado N: −X % (asignado Report / editado vendedor)
→ precio_neto línea
```

> Nota implementación: alinear con `lista_precio_id = 3` / etiqueta LP03 en apps y con cascada `descuento_1…4`. El grado 1 canónico de esta ley = **slot LP03 10 %**.  
> **Enmienda Director 2026-07-29:** PROMOCIONAL bajo LPC03 **sin** +10 % — ver [CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_20260729.md](./CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_20260729.md).

### 4.2 Grados 2–4

| Grado | Rol (ley Director) |
|-------|---------------------|
| **1** | **LP03 = 10 %** (si aplica LP03) |
| **2–4** | Cascada restante FI (`descuento_2…4`) · incluye el **% dictado** por Asignación PE y/o edición vendedor · diccionario PE D1 por cadena (NORMAL/PROMO/LIQ/COMUN) convive según reglas de negocio ya en `pe_diccionario_cadena` |

**Regla de oro apilamiento:**

```
SI artículo bajo LP03 Y NO PROMOCIONAL:
  descuento_efectivo ⊇ { 10% LP03 } ∪ { % asignado dictador } ∪ { edición vendedor }
SI PROMOCIONAL (aunque lista = LP03):
  descuento_efectivo ⊇ { % asignado dictador } ∪ { edición vendedor }
  (sin el +10 % LP03 — anti doble descuento)
SI NO LP03:
  descuento_efectivo ⊇ { % asignado dictador } ∪ { edición vendedor }
  (sin el +10 % LP03)
```

### 4.3 Traza en Aprobaciones

| Estado casilla descuento | Significado |
|--------------------------|-------------|
| **Blanca** | Valor = % dictado (sin edición vendedor) |
| **Sombreada** | Vendedor alteró el % → admin debe notar |

---

## 5 · Ley general de descuentos (cerrada para esta etapa)

1. **Fuente dictada** = Asignación Report PE (persistida).  
2. **Unidad** = porcentaje (entero o decimal, ej. 7.5).  
3. **Alcance** = todas las moléculas del universo filtrado al asignar.  
4. **LP03** = grado 1 obligatorio +10 % cuando aplica (no-PROMO), **además** del dictado. **PROMOCIONAL:** sin ese +10 %.  
5. **Split FI** = §3 (cadenas PE / casos CP / marca).  
6. **Factura** = % efectivo post-edición vendedor; traza blanco/sombra en Aprobaciones.  
7. **Prohibido** que el vendedor sea la **única** fuente del descuento (solo puede alterar con traza).

---

## 6 · UI Report — contrato

| Estado | Pantalla |
|--------|----------|
| Modo normal | Grilla Stock PE + filtros + barra filtro Web |
| Modo Asignación ON | Sin grilla · filtros vivos · prompt asignar % · confirmación |

**Ubicación botón:** barra superior «FILTRO CATÁLOGO RIMEC WEB» (marco naranja Director).

---

## 7 · Cruces Moria

| Doc | Código |
|-----|--------|
| Etapa | `ASIGNACION-DESCUENTOS-PE-20260726` |
| Grupo uno | **2.3.1.10.1.2** |
| Filtros PE siameses | **2.3.1.10.1.3** · **2.2.1.25** |
| R-FI-1 casos | **2.2.1.19** |
| Descuentos PE hist. | **2.2.1.22** |
| Verificación PE Revisar | **2.3.1.10.1.4.3** · [CHUSAR_VERIFICACION_DESCUENTOS_PE_20260727.md](./CHUSAR_VERIFICACION_DESCUENTOS_PE_20260727.md) |
| Cascada D1–D4 FI | MIG-100 · Aprobaciones CONTEXT |

---

## 8 · Checklist implementación

- [x] Ley división FI documentada (PE cadenas · CP casos · marca)
- [x] Ley LP03 +10 % + cuatro grados documentada
- [x] Botón + toggle modo Asignación
- [x] Grilla + filtros en modo asignación
- [x] Input % + apply moléculas filtradas
- [x] Persistencia BD + GET último gana
- [x] Tab **Resumen asignación** · pivote % · política · panel Revisar → [**2.3.1.10.1.4.3**](./CHUSAR_VERIFICACION_DESCUENTOS_PE_20260727.md)
- [ ] Web: incrustar % · respetar split §3 · LP03 grado 1 (parcial local)
- [ ] Aprobaciones: blanco vs sombra
- [ ] Smoke E2E prod

---

**Última actualización:** 2026-07-26 · Documentación Chusar · ley FI + LP03 al detalle
