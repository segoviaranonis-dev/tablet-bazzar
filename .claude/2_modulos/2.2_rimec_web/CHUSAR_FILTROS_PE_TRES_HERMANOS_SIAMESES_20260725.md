# CHUSAR — Filtros PE · Tres hermanos siameses · 2/3 certificado

**Código:** **2.2.1.25** · cruza **2.3.1.10.1.3** (Report `/stock-pronta-entrega`)  
**Fecha:** 2026-07-25  
**Keyword:** Documenta  
**Shibboleth:** Andrés, el que viene.  
**Estado:** 🟢 **3/3 certificado** · ley TODOS [2.2.1.28](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) · AM alineado

---

## 1 · Los tres hermanos (definición Director)

**Casa única RIMEC Web** — dos fuentes agua y aceite (CP + PE). Los **tres hermanos siameses** del filtro PE son:

| # | Hermano | Superficie | Qué certifica |
|---|---------|------------|---------------|
| **1** | **Report PE** | `:3000/stock-pronta-entrega` | Lógica operativa + sidebar · audit bancario 99 tests |
| **2** | **Paridad lógica Report↔Web** | Módulos TS compartidos + vectores | Misma regla en memoria antes de pintar UI |
| **3** | **RIMEC Web vivo** | `:3001` catálogo API/UI | Multi-select · AB-CR · diccionario TIPO · MEDIAS en runtime |

**No confundir** con el par CP (**Alejandro Magno** ↔ Web CP) — doc **`2.2.1.18`** · otro siamese.

---

## 2 · Veredicto auditado 2026-07-26

| Hermano | Resultado | Evidencia |
|---------|-----------|-----------|
| **1 · Report PE** | ✅ **100%** | `audit_pe_filtros_bancario.mts` → **99/99** |
| **2 · Lógica siamese** | ✅ **100%** | `siamese_paridad_pe_report_web.mts --run-audit` → **6/6 módulos · 6/6 vectores · manifest 100%** |
| **3 · Web runtime** | ✅ **100%** | Ley TODOS · VIZZANO 694/69 carteras · smokes PASS |
| **+AM** | ✅ **100%** | Diccionario PE · `tipo-grupos-hibrido` · smoke AM |

**Ley TODOS (obligatoria):** [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) (**2.2.1.28**)

**Total holding:** **3/3 hermanos al 100%** + AM.

Comando canónico:

```powershell
cd report
npx tsx scripts/siamese_paridad_pe_report_web.mts --run-audit
```

Manifest: `report/scripts/output/SIAMESE_PARIDAD_PE_MANIFEST.json`

---

## 3 · Fixes integrados (sesión 2026-07-25)

### 3.1 · Diccionario TIPO PE (labels siameses)

| Report (canónico) | Web (antes) | Web (ahora) |
|-------------------|-------------|---------------|
| NORMAL · PROMOCIONAL · LIQUIDACION · COMUN | Normal · Promo · Liquidación | **MAYÚSCULAS idénticas** |

- Report: `report/src/lib/stock-pronta-entrega/filtro-tipo-pe-diccionario.ts`
- Web: `rimec-web/lib/filtros/filtro-tipo-pe-diccionario.ts`
- UI Web: título sidebar **«Diccionario pronta entrega · COD.GRUPO»** cuando PE o Todos
- Filtro memoria: PE usa `rowMatchesPeTipoDiccionario` · CP sigue `rowMatchesTipoGrupos` (biblioteca)

Smoke: `rimec-web/scripts/_smoke_pe_tipo_diccionario_siames.mjs` ✅

### 3.2 · Promo CP vs PE · LIQ oro — visual grupo uno (2026-07-26)

| Origen | Detección | Latido shell | Badge |
|--------|-----------|--------------|-------|
| **CP** | `descp_caso` / BCL = PROMOCIONAL | Fucsia `catalog-card-casino-fucsia` | **PROMO** · borde grueso · texto oscuro |
| **PE** | `es_promo` / cadena / COD.GRUPO d45=02 | Fucsia `catalog-card-casino-fucsia` | **PRO** · fucsia claro · texto oscuro |
| **PE LIQ** | diccionario LIQUIDACION | Oro `catalog-card-casino-oro` 1,65 s | **LIQ** oro |

Matriz: `rimec-web/lib/catalogoShellLatidos.ts` · CSS `catalog-pe-pro-badge` · `catalog-cp-promo-badge`  
Smoke: `npx tsx scripts/_smoke_latidos_promo_siames.mjs` ✅

**Decisión Director:** LIQ **oro** · promo **fucsia** · **colores distintos** · dos corazones (PRO vs PROMO).

### 3.3 · Marcas MAYÚSCULAS

- `cap()` eliminado en sidebar/cabecera Web
- Canónico: `rimec-web/lib/marcaBadge.ts` → `labelMarcaCatalogo()`

### 3.4 · AB-CR · MEDIAS · multi-select

- MEDIAS ≠ carteras (estilo 2599 no pisa tipo_1)
- Multi-select Marca/Estilo/Tipo/Género · universo+cascada meta
- Smoke AB-CR: `rimec-web/scripts/smoke_abcr_tipos_meta.mts` ✅

---

## 4 · Módulos paridad (Hermano 2)

| Report | RIMEC Web | Exports clave |
|--------|-----------|---------------|
| `filtro-tipo-canonico.ts` | idem | LIQ > Promo > Normal/Carteras |
| `modulo-accesorios.ts` | idem | MEDIAS · CARTERAS · ANTEOJOS |
| `pe-modulo-medias.ts` | idem | `esFilaMedias` |
| `pe-valorizado-tipo1.ts` | idem | `resolvePeTipo1Canon` |
| `pe-abcr-tipo1.ts` | idem | `mergePeAbcrTipo1Items` |
| `filtro-tipo-pe-diccionario.ts` | idem | labels PE · `rowMatchesPeTipoDiccionario` |
| `pe-grupo-uno-visual.ts` | idem | `cadenaPeCanonico` · shell promo ámbar |

Vectores: `report/scripts/siamese/vectors-pe-filtros.json` · runner Web `siamese_vectors_pe.mts`

---

## 5 · Hermano 3 + Alejandro Magno — ✅ cerrado 2026-07-26

Ley TODOS + diccionario PE: [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) (**2.2.1.28**) · detalle AM: [2.2.1.27](./CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md).

Checklist (PASS):

- [x] Smoke `:3001` — MEDIAS · sintéticos AB-CR
- [x] Badges PRO/PROMO/LIQ legibles en runtime
- [x] **AM** — `tipo-grupos-hibrido` + sidebar `variant="am"`
- [ ] **Visión general** Panel Control — matriz TIPO PE (doc 2.3.1.21) — UI posterior
- [x] `filtro-tipo-pe-diccionario` en `MODULOS_PARIDAD` script siamese

---

## 6 · Dimensiones audit Report (Hermano 1 · referencia)

99 tests incluyen: ramo CALZADO/CONF/ACCESORIOS · AB-CR · diccionario normal/promo/liq/comun · marcas · géneros · combos CALZADO+MEDIAS · depósitos D1/D3.

---

## Relacionados

- [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) (**2.2.1.28** · ley TODOS)
- [CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md](./CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md) (**2.2.1.18** · CP AM↔Web)
- [CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md](./CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md) (**2.2.1.27** · Hermano 3 + AM)
- [CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md](./CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md) (**2.2.1.21.G1** · latidos)
- [CHUSAR_PE_TIPO1_ABCR_ACCESORIOS.md](../2.3_report/deposito_rimec/CHUSAR_PE_TIPO1_ABCR_ACCESORIOS.md)
- [CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md](./CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md) (**2.2.1.24**)
- Regla Cursor: `.cursor/rules/hermanos-siameses-filtro-tipo.mdc`

**Shibboleth:** Andrés, el que viene.
