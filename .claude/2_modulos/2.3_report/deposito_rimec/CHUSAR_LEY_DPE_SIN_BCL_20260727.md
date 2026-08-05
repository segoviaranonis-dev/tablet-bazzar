# CHUSAR — Ley DPE sin BCL · blindaje segregación PE

**Código:** **2.3.1.10.1.2.1**  
**Padre:** [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](./CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) (**2.3.1.10.1.2**)  
**Fecha:** 2026-07-27  
**Keyword:** Documenta  
**Ratificado:** Director · Andrés  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Ley (indiscutible)

| Ámbito | Fuente segregación | BCL |
|--------|-------------------|-----|
| **Programado** | Biblioteca casos (BCL) + PELE | ✅ |
| **Compra previa** | Biblioteca casos (BCL) + tránsito | ✅ |
| **DPE — Diccionario Pronta Entrega** | **Triunvirato Excel Grupo 1** | **⛔ PROHIBIDO** |

> **BCL no tiene ni una incidencia en el DPE.**  
> El DPE se construye con el triunvirato Excel y es el respaldo documental de nuestras opciones de segregación (NORMAL · PROMOCIONAL · LIQUIDACIÓN · COMÚN).

**Error más grave:** imponer PROMOCIONAL / LIQUIDACIÓN / segmentación desde el asignador de descuentos o desde caso BCL cuando **ningún Excel del triunvirato** lo dice en esa fila.

---

## 2 · Triunvirato (única puerta DPE)

| # | Archivo | Rol |
|---|---------|-----|
| 1 | `csv's/stock's/sdrm####.csv` | Stock · `COD.GRUPO` por artículo |
| 2 | `sdrm0849.xlsx` | Traductor → `sdrm_cod_grupo_dim` |
| 3 | Stock valorizado | Control etiquetas · **gana dígito** |

Decoder canónico: `report/src/lib/pilares/cod-grupo-decode.ts`  
Hermano Web: `rimec-web/lib/pilares/codGrupoCadena.ts`

| Ramo | Dígitos cadena | Promo | Liq |
|------|----------------|-------|-----|
| Calzado 654 | pos 5–6 | `02` | `04` |
| Confecciones 638 | pos 7–8 | `03` | `04` |

**AB-CR** (VERANO/INVIERNO en confecciones) ≠ cadena comercial — no confundir.

---

## 3 · Blindaje código (2026-07-27)

Puerta única Report:

```
report/src/lib/stock-pronta-entrega/cadena-dpe-triunvirato.ts
  → cadenaDpeTriunvirato(row)   // solo decodeCodGrupo
  → esPromoDpe / esLiquidacionDpe / esComunDpe
```

| Consumidor | Cambio |
|------------|--------|
| `pe-grupo-uno-visual.ts` | Ya no llama `esPromoRow` (BCL) |
| `diccionario-pe.ts` | Cadena vía triunvirato |
| `stock-pe-filters.ts` | Filtros COMERCIAL vía `cadenaPeCanonico` |
| `resumen-asignacion-pe.ts` | Política % vía DPE |
| `_fix_canon_descuentos_pe.ts` | Clasifica por dígitos COD.GRUPO · conf promo **10%** |
| `vincular-biblioteca` API | Snapshot BCL **informativo** · no DPE |
| `filtros-indice` API | Motor precios referencia · no segregación |

Hermano Web:

```
rimec-web/lib/filtros/cadena-dpe-triunvirato.ts
rimec-web/lib/filtros/pe-grupo-uno-visual.ts
rimec-web/lib/facturaCelulaClave.ts   → PE con cod_grupo: DPE primero
rimec-web/lib/agruparTarjetasCatalogo.ts → bucket PE: cod_grupo primero
```

**Prohibido en PE:** `filtro-tipo-canonico.esPromoRow` / `descp_caso` / `lookupCasoLinea` para cadena grupo uno.

Badge «Sin caso BCL» en tarjeta PE = **informativo** (motor precios) · no colorea shell DPE.

---

## 4 · Auditoría regresión

Scripts smoke (batch `pe-import-1784921538902-sdrm1021`):

```bash
cd report
npx tsx scripts/_audit_dpe_sin_bcl_pe.ts
npx tsx scripts/_audit_promo_triunvirato_pe.ts
```

Criterio pass:

- UI DPE = triunvirato · **0** falsos PROMOCIONAL
- BCL vinculada ≠ segregación DPE
- **0** PPD promo BCL sin d67/d45 promo

---

## 5 · Relacionados

| Código | Doc |
|--------|-----|
| 2.3.1.10.1.2 | Grupo uno · tres Excel |
| 2.3.1.10.1.4.3 | Verificación descuentos PE |
| 2.3.1.7.1.0 | Casos BCL (solo CP/programado) |
| 2.2.1.25 | Filtros PE siameses Web |

---

**Índice:** [INDICE.md](./INDICE.md)
