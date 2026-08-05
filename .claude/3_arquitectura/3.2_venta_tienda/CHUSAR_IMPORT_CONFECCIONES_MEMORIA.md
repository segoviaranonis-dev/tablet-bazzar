# CHUSAR — Import multi-proveedor · confecciones `tipo_v2=2`

**Integrado:** 2026-06-16 · **Import producción:** 2026-06-16 ✅  
**Hub:** [CHUSAR_LISTO_PROVEEDORES.md](./CHUSAR_LISTO_PROVEEDORES.md)

---

## Estado

**Primer import mixto OK** — calzado 654 + Kyly 638 en un solo Excel, pilares separados por `proveedor_id`, FK numéricas sin NULL.

---

## Evidencia (Excel real)

**Archivo:** `C:\Users\hecto\Downloads\VENTA y STOCK BZ+RC.xlsx`  
**Hoja:** `st+vt+RC` (ignora RESG, VENTA, STOCK)

| Segmento | Filas | Pilares |
|----------|-------|---------|
| `TIPO_V2=1` calzado | 42.609 | **654** Beira Rio |
| `TIPO_V2=2` Kyly | 8.370 | **638** |

**Staging:** `registro_st_vt_rc_reposicion` = 50.979 filas · batch `4d7dd11f`.

---

## Respuestas Chusar (desde Excel real — no teoría)

| Pregunta | Respuesta observada |
|----------|---------------------|
| Columna línea | `LINEA` — numérica Kyly |
| Ref | `K` en 8.314 filas; 56 con LINEA=`K` + REF numérico → **normalizado** en import |
| Material | Columna `MATERIAL` — **no siempre = línea** (~78% iguales) |
| Color | `K0452`, `K6826`, … alfanumérico → catálogo 638 |
| Grada | Talles `4,6,8…` + fajas `9A12M`, `6A9M` |
| TIPO_V2 | Presente · valores `1` y `2` |
| Dimensiones staging Kyly | `marca_id`…`tipo_1_id` **NULL** (no Otros) |

Ref sintética catálogo: **`K` → codigo_proveedor 11** por línea. Material/color: **código Excel** en namespace 638.

---

## Qué queda abierto (Director)

- Faja Kyly → reglas precio motor 638
- Marcas Kyly post-import → `/pilares`
- Imágenes Storage Kyly
- Ficha [REGLAS_PROVEEDOR_638.md](./REGLAS_PROVEEDOR_638.md) — enriquecer con listado Director

---

## Relacionado

- [CONFECCIONES_TIPO_V2_2.md](./CONFECCIONES_TIPO_V2_2.md)
- [LEY_FK_NUMERICO_RETAIL.md](./LEY_FK_NUMERICO_RETAIL.md) — `RETAIL_IMPORT_FAST=False` desde build c2

**Shibboleth:** 7 años
