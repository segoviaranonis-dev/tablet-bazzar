# ETAPA — Import multi-proveedor · Kyly 638

**Inicio:** 2026-06-16 · **Import producción:** 2026-06-16  
**Estado:** ✅ **Import mixto OK** · reglas/ficha Director y motor precios 638 pendientes  
**Frente:** `control_central` · Retail `st+vt+RC` · pilares **654** + **638** aislados  
**Hub Chusar:** [CHUSAR_LISTO_PROVEEDORES.md](../3_arquitectura/3.2_venta_tienda/CHUSAR_LISTO_PROVEEDORES.md)

---

## Objetivo cumplido (import)

Excel Retail **mixto** → `registro_st_vt_rc_reposicion` con **FK numéricas**; catálogo pilares por `proveedor_id` sin mezclar 654 con 638.

**Modo operación:** reemplazo total diario (`purge_all_retail` + insert). Build import: **`2026-06-10-c2`**.

---

## Evidencia import (2026-06-16)

| Campo | Valor |
|-------|--------|
| Archivo | `VENTA y STOCK BZ+RC.xlsx` · hoja `st+vt+RC` |
| Batch | `4d7dd11f-…` |
| Filas staging | **50.979** |
| Calzado `tipo_v2=1` | **42.609** · proveedor pilares **654** |
| Kyly `tipo_v2=2` | **8.370** · proveedor pilares **638** |
| FK NULL (L/R/M/C) | **0** en ambos tipos |

### Catálogo creado/actualizado (638 Kyly)

| Pilar | Filas catálogo 638 |
|-------|-------------------|
| `linea` | ~1.623 |
| `referencia` | ~1.624 |
| `material` | ~1.542 |
| `color` | ~115 |

654 (calzado) sigue en su namespace; sin colisión gracias a migración **117** (drop UNIQUE legacy solo `codigo_proveedor`).

---

## Implementación clave

| Ítem | Ruta |
|------|------|
| Migraciones | `116_proveedor_kyly_638.sql` · `117_pilares_unique_por_proveedor.sql` |
| Motor pilares | `core/pilares/` |
| Kyly FK | `confecciones_fk.py` — Excel tal cual · ref `K`→11 · LINEA=K invertido |
| Calzado FK | `fk_resolve.py` — proveedor **654** · lookup L+R en mapas |
| CLI test/import | `scripts/diagnostico/test_retail_import_cli.py --commit` |

### Excel Kyly — comportamiento real (Chusar)

- Columnas: TIENDA, TIPO_V2, LINEA, REFERENCIA, MATERIAL, COLOR, CALCE, IMAGEN…
- Ref `K` dominante; **56 filas** con LINEA=`K` + REF numérico → normalizadas al import
- Material **≠** línea en ~22% — se usa columna **MATERIAL** Excel en catálogo 638
- Color alfanumérico (`K0452`, …) → bigint bloque 638
- Grada: talles sueltos + fajas (`9A12M`, `6A9M`)

---

## Pendiente (post-import)

| # | Ítem |
|---|------|
| 1 | Completar fichas Director [654](../3_arquitectura/3.2_venta_tienda/REGLAS_PROVEEDOR_654.md) / [638](../3_arquitectura/3.2_venta_tienda/REGLAS_PROVEEDOR_638.md) |
| 2 | Motor precios **638** (L + Talle/faja) |
| 3 | Enriquecer Kyly en Administrador Pilares Report |
| 4 | OT formal + evidencia JSON si Director pide cierre gerencial |

---

**Shibboleth:** 7 años
