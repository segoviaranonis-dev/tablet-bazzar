# Reglas proveedor 638 — Kyly (CONFECCIONES)

**Código:** `3.02.01.638`  
**Estado:** ✅ **Import producción OK** (2026-06-16) · build `2026-06-10-c2`  
**`proveedor_importacion`:** 638 ✅ · **`tipo_v2_id`:** 2 · Excel `TIPO_V2` = `2`

**Ley triplete:** [LEY_FK_NUMERICO_RETAIL.md](./LEY_FK_NUMERICO_RETAIL.md) — ref/material sintéticos = filas en catálogo con bigint, no solo texto.

---

## 1. Identidad

| Campo | Valor |
|-------|--------|
| Código negocio | 638 |
| Nombre / categoría | *(Director)* |
| `tipo_v2.id_tipo` | 2 · CONFECCIONES |
| Marcas | *(Director)* |
| Primera import multi-proveedor | Sí |

---

## 2. Pilares — catálogo → FK

| Pilar | ¿Viene en Excel Kyly? | `codigo_proveedor` (638) | Upsert si falta | FK operación |
|-------|------------------------|--------------------------|-----------------|--------------|
| **Línea** | Sí | numérico directo · alfanumérico → `638_000_000_000 + hash` | alta perezosa | `linea_id` |
| **Referencia** | Texto `K` (sintética) | **11** (K = 11.ª letra) | sí | `referencia_id` |
| **Material** | Columna `MATERIAL` | **código Excel** (bigint) — a menudo = línea, no siempre | sí | `material_id` |
| **Color** | Código Excel | numérico o hash `638_001_000_000 + hash` | sí | `color_id` |
| **Grada / talle** | Sí | P/M/G · 4-6-8 · etc. | — | texto fila `grada` |

*(Director completa — reemplaza borrador Moria)*

---

## 3. Referencia y material sintéticos

- Ref origen Kyly: no existe en proveedor → texto retail **`K`** · catálogo bigint **`11`**
- Material: **columna Excel `MATERIAL`** en catálogo 638 (fallback línea si vacío)
- 56 filas LINEA=`K` + REF numérico → normalizadas en `confecciones_fk.py`
- Línea alfanumérica: bloque **`638_000_000_000 + hash`** (`core/pilares/codigos.py`)
- Implementación: `confecciones_fk.py` + `core/pilares/upsert.py`

---

## 4. Grada (talle ropa)

**Protocolo canónico holding:** [PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md](./PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md) · código **`3.02.00.638`**

| Regla | Valor |
|-------|-------|
| Modo venta | `am_modo_venta = UNIDAD` |
| 1 fila Excel | 1 talle = 1 SKU |
| Notación | Carlos: `1(1)1` · `P(1)M` · `4/6/8` |
| Campo operativo | **`am_talle`** + `grades_json` |
| Talles válidos | P·M·G·GG · 1·2·3 · 4·6·8 · 10·12·14·16 |
| **Prohibido** | Curva calzado 654 · tallas **33–45** en confecciones |

---

## 5. Excel Retail (`st+vt+RC`)

| Columna Excel | Mapeo | Notas |
|---------------|-------|-------|
| TIPO_V2 | `tipo_v2_id=2` | Valor `2` en producción |
| LINEA | `linea_codigo_proveedor` | Numérica Kyly |
| REF | `referencia_codigo_proveedor` | `K` (→ bigint 11) |
| MATERIAL | `excel_material_code` | Código proveedor 638 |
| COLOR | `excel_color_code` | Alfanumérico `K…` |
| CALCE | `grada` | Talle / faja |

---

## 6. NULL al import (hasta enriquecer)

| Campo | NULL permitido |
|-------|----------------|
| `linea.marca_id`, `genero_id`, `grupo_estilo_id` | ✅ al import |
| `linea_referencia` estilo/tipo_1 | ✅ al import |
| Staging `marca_id`…`tipo_1_id` confecciones | ✅ (no sentinela Otros) |

---

## 7. Imágenes

**Ley madre:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](../../2.1_control_central/docs/LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) §2.2 · CHUSAR [CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md](../../2.1_control_central/docs/CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md)

| Campo | Valor 638 |
|-------|-----------|
| Stem Storage | `{linea}_{color}.jpg` — **underscore**, no guiones |
| Pilares en filename | **Línea + color** únicamente (no R/M) |
| Color Excel | Strip `K` inicial (`K1234` → `1234`) |
| Tiers obligatorios | flat + sm + md + lg · **contain** · verify HEAD 4× |
| Origen local | `\\10.18.3.1\home\img_art` (~32k JPG formato underscore) |
| Vista PE | `v_stock_pe_rimec.imagen_url` · MIG-148 bifurca por `proveedor_importacion_id` |
| Resolver TS | `productImageProtocol.ts` · `proveedor_importacion_id=638` o `tipo_v2_id=2` |

**Prohibido:** naming 654 (`L-R-M-C`) sobre confecciones Kyly — gap Web 0% hasta MIG-148 + resolvers.

---

## 8. Delta vs proveedor 654

*(Director — mismo código numérico = distinto `id` por proveedor_id)*

---

## 9. Determinación de precios (638)

| Dimensión | ¿Entra al precio? |
|-----------|-------------------|
| **Línea** | ✅ |
| **Talle** | ✅ |
| Referencia / material | ❌ |

**No usa** el triplete L+R+Material del 654.

---

## 10. Faja (empaque proveedor)

Concepto Kyly: **Faja** ≈ grada calzado — rango de talles vendidos **cerrados** por el proveedor.

| Canal | Comportamiento |
|-------|----------------|
| **RIMEC importadora** | Faja **cerrada** — ej. talles 4-6-8 de línea 1184 → **un solo precio** (viene cerrado) |
| **Bazzar tienda** | **Minorista** — talle suelto; filosofía análoga, granularidad distinta |

**Excel Bazzar:** mismo archivo aporta **pilares + precios de venta** → ventaja para import retail (una fuente).

Motor de precios 638: **por diseñar** (L + Talle). Doc maestro: [DETERMINACION_PRECIOS_PROVEEDOR.md](./DETERMINACION_PRECIOS_PROVEEDOR.md)

---

## 11. Importación (paralelo 654)

Proceso similar al 654 (Excel → catálogo triplete → FK → staging) pero **reglas propias** — documentación desde cero en esta ficha, no arrastrar L+R+Material al precio.

---

- L alfanumérico · ref/material sintéticos · tallas ropa — ver [CONFECCIONES_TIPO_V2_2.md](./CONFECCIONES_TIPO_V2_2.md)
- Import: build **`2026-06-10-c2`** · 8.370 filas Kyly · FK 0 NULL · Chusar [CHUSAR_IMPORT_CONFECCIONES_MEMORIA.md](./CHUSAR_IMPORT_CONFECCIONES_MEMORIA.md)

**Shibboleth:** 7 años
