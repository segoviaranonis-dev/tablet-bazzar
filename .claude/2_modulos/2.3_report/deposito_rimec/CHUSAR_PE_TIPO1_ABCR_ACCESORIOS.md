# CHUSAR — PE Tipo 1 · Accesorios vs Confecciones · AB-CR

**Subcuenta:** **2.3.1.10.2** · padre [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md](./CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md)  
**Estado:** 🟢 **RATIFICADO** · Director · 2026-07-25  
**Error Moria:** `4.01.04.003` · calzado/carteras Mario Bros

---

## Problema

En filtros AB-CR de Stock PE aparecían chips **Accesorios** y **Anteojos** sin artículos o con casing mixto. Causa raíz: confusión entre Excel **ACCESORIOS** (confecciones activas) y módulo carteras/lentes.

---

## Verdad canónica (Stock valorizado · Tipo 1)

| Excel Tipo 1 | Pilares `tipo_1.descp_tipo_1` | Chip AB-CR UI |
|--------------|-------------------------------|---------------|
| **ACCESORIOS** | **ACT ROPAS** | NO (vive en confecciones / resto AB-CR) |
| **CARTERA** | **CARTERAS** | **CARTERAS** |
| **LENTES** | **LENTES** | **ANTEOJOS** |

**Regla indiscutible:** Excel `ACCESORIOS` ≠ chip «Accesorios». Es **Actv. confecciones** → `ACT ROPAS`.

---

## Clave molécula en BD (no parche UI)

**Carlos `654-196044` = codigo_barras `654.196044` — NO es `linea.codigo_proveedor`.**

Backfill y futuros imports deben usar columnas Excel:

| Excel | BD |
|-------|-----|
| `LINEA` | `linea.codigo_proveedor` |
| `REFE` | `referencia.codigo_proveedor` |
| `Tipo 1` | `linea_referencia.tipo_1_id` → `tipo_1` |

Script: `report/scripts/backfill_pe_tipo1_valorizado.mts`  
Mapa código: `report/src/lib/filtros/pe-valorizado-tipo1.ts`

---

## UI Report · AB-CR

Archivo: `report/src/lib/filtros/modulo-accesorios.ts`

- Subfiltros sintéticos: **CARTERAS** (-1) · **ANTEOJOS** (-2, clave `LENTES`)
- **Eliminado** chip Accesorios
- Labels **UPPERCASE** en merge PE (`mergePeAbcrTipo1Items`)
- Ramo efectivo `ACCESORIOS` solo cuando hay ID sintético negativo o categoría Carteras y accesorios

Paridad siamese pendiente Web: `rimec-web/lib/filtros/modulo-accesorios.ts` + `pe-valorizado-tipo1.ts`

**✅ Paridad Web cerrada 2026-07-27** — [CHUSAR_HOTFIX_ABCR_CARTERAS_ANTEOJOS_WEB_20260727.md](../../2.2_rimec_web/CHUSAR_HOTFIX_ABCR_CARTERAS_ANTEOJOS_WEB_20260727.md) (**2.2.1.32**): traductor PE · subfamilia `-1/-2` · scan PE-only TODOS.

---

## Evidencia backfill 2026-07-25

| Métrica | Valor |
|---------|-------|
| Filas únicas LINEA+REFE valorizado | 2.618 |
| `linea_referencia` actualizados | 69 |
| Moléculas PE con `LENTES` y stock | 4 refs (90000.1–4) |
| PE con `ACT ROPAS` | 19 líneas |
| Fila `tipo_1` «ACCESORIOS» | 0 (no crear) |

---

## Smoke Director

1. `:3000/stock-pronta-entrega` → AB-CR sin «Accesorios»; **CARTERAS** + **ANTEOJOS** en mayúsculas.
2. Marcar **ANTEOJOS** → ≥4 moléculas (línea 90000 refs 1–4).
3. **ACT ROPAS** aparece en lista AB-CR resto (no en subchip accesorios).
4. Calzado activo + Carteras no vacía la grilla por exclusión cruzada.

---

## Próximo (cimientos 1000 años)

- Tabla persistente `pe_articulo_tipo1` (codigo_barras → tipo_1_id) en migración MIG-xxx
- Import SDRM/valorizado escribe tipo_1 al alta pilares
- Paridad RIMEC Web filtros siamese
