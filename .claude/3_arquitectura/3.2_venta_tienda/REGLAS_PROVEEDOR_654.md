# Reglas proveedor 654 — Beira Rio (CALZADOS)

**Código:** `3.02.01.654`  
**Estado:** 📋 **ESPERANDO LISTADO DIRECTOR**  
**`proveedor_importacion`:** 654 · **`tipo_v2_id`:** 1 · Excel `TIPO_V2` = `1` o `654`

**Ley triplete:** [LEY_FK_NUMERICO_RETAIL.md](./LEY_FK_NUMERICO_RETAIL.md) — operación solo FK; catálogo `(proveedor_id=654, codigo_proveedor)`.

---

## 1. Identidad

| Campo | Valor |
|-------|--------|
| Código negocio | 654 |
| Nombre | *(Director)* |
| `tipo_v2.id_tipo` | 1 · CALZADOS |
| Marcas | *(Director)* |
| Fuentes de alta pilares | *(Director: listado F9 / proforma / retail / otro)* |

---

## 2. Pilares — catálogo → FK

| Pilar | ¿Viene en Excel? | `codigo_proveedor` (654) | Upsert si falta | FK operación |
|-------|------------------|--------------------------|-----------------|--------------|
| **Línea** | | | | `linea_id` |
| **Referencia** | | | | `referencia_id` |
| **Material** | | | | `material_id` |
| **Color** | | | | `color_id` |
| **Grada / talla** | | *(texto fila o FK talla)* | | |

*(Director completa fila por fila)*

---

## 3. Línea + referencia

- Formato STYLE: *(Director — ej. 1184.100)*
- Separadores permitidos: `.` `-` `/`
- Herencia marca/género/estilo/tipo_1 al alta: *(Director)*

---

## 4. Grada

- Curva bulto: *(Director — ej. 34(1 2 3 3 2 1)39)*
- Talla suelta tienda: *(Director)*

---

## 5. Excel Retail (`st+vt+RC`)

| Columna Excel | Mapeo | Notas |
|---------------|-------|-------|
| TIPO_V2 | `tipo_v2_id=1` | |
| LINEA / REF / STYLE | | |
| MATERIAL / COLOR | | |
| CALCE / GRADA | | |
| *(otras)* | | |

---

## 6. Imágenes

- Path Storage: *(Director)*
- Pilares en filename: *(Director — ej. L-R-M-C)*

---

## 7. Enriquecimiento post-import

*(Director — NULL al import · quién completa · `/pilares` vs Motor)*

---

## 8. Determinación de precios (654)

| Dimensión | ¿Entra al precio? |
|-----------|-------------------|
| Línea | ✅ |
| Referencia | ✅ |
| Material | ✅ |
| Color / grada | ❌ (stock, no LPN) |

**Motor:** Streamlit `modules/rimec_engine/` — **funcionando**. Migración a Report pendiente (doc + UI).

Detalle: [DETERMINACION_PRECIOS_PROVEEDOR.md](./DETERMINACION_PRECIOS_PROVEEDOR.md)

---

## 9. Delta vs proveedor 638

*(Director — qué no debe mezclarse · ej. mismo número 1184)*

---

## Referencias heredadas (calzado producción)

- Curva canónica · alta ciega retail · no inverso — ver `politicas-importacion-pilares.mdc`
- Código: `fk_resolve.py` · `st_vt_rc_import.py`

**Shibboleth:** 7 años
