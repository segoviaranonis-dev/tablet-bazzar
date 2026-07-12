# DOC — Reparación PROGRAMADO · Pilares · Biblioteca · Prefacturas

**Código:** **2.3.1.7.5.3.11**  
**Fecha:** 2026-07-12  
**Estado:** 🟢 **CANÓNICO** — sesión reparación flota PP programado  
**Orden Director:** **Documenta** + deploy Vercel Report  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Resumen ejecutivo

Tres capas de error encadenadas afectaron **toda la flota PP PROGRAMADO** (`categoria_id=3`):

| # | Error | Severidad | Estado post-sesión |
|---|--------|-----------|-------------------|
| **A** | Import proforma **sin motor pilares** (FK L·R·M·C · herencia línea) | 🔴 **GRAVE** | 🟡 Motor TS añadido · backfill retroactivo ejecutado · gaps estilo LR pendientes en PP históricos |
| **B** | Caso comercial resuelto por **heurísticas** (STYLE/BAG) en lugar de **biblioteca BCL→PELE** | 🔴 **GRAVE** | 🟢 `resolve-caso-comercial.ts` simplificado · PELE resync desde BCL |
| **C** | Scripts de “reparación” que **no tocaban biblioteca BCL** ni PELE — Director veía biblioteca sin cambios | 🔴 **Capital operativo** | 🟢 `sync PELE ← BCL` + traslados + regeneración FI |

**Ley acordada (no negociable):**

> Caso comercial = **solo motor/biblioteca** (BCL → PELE → `precio_lista`).  
> Import proforma = **obligatorio** nutrir pilares + FK PPD antes de FI.  
> Biblioteca = paso humano (o script explícito); import **no** auto-asigna caso.

---

## 2 · Error A — Import proforma sin pilares (4.02.03.009)

### Qué pasó

`populatePpFromProforma` insertaba **solo texto** en `pedido_proveedor_detalle` (`linea`, `referencia`, `material_code`) con upsert parcial M/C. **No ejecutaba:**

- `upsert_linea` + herencia vecino (`genero_id`, `marca_id`, `grupo_estilo_id`)
- `upsert_referencia` + `linea_referencia` (estilo · tipo_1)
- Resolución FK en PPD (`linea_id`, `referencia_id`, `id_material`, `id_color`)

**Imposible operativamente:** header género/marca/estilo · filtros · LPN · FI · Admin IC · CSV legal dependen de FK materializadas.

### Evidencia (2026-07-12)

Script: `report/scripts/_diag_proforma_pilares_cp.mjs` · error índice `4.02.03.009`

| PP | Proforma | Mol. | Sin estilo línea | Sin estilo L×R |
|----|----------|------|------------------|----------------|
| 021 | 7196/2026 | 787 | 612 (78%) | 441 |
| 015 | PRG_8604 | 836 | 702 (84%) | 600 |
| 019 ⭐ | 8051/2026 | 912 | 797 (87%) | 546 |
| 017 | 5436/2026 | 949 | 867 (91%) | 679 |

### Fix código

| Archivo | Rol |
|---------|-----|
| `proforma-pilares-provision.ts` | Motor TS: línea/ref/LR/M/C · herencia vecino · regla no inversa |
| `proforma-pilares-import-report.ts` | Post-import: avisos · líneas sin BCL · ya en biblioteca |
| `ppd-pilares-fk.ts` | Backfill FK PPD desde pilares |
| `proforma-programado-engine.ts` | Invoca provisión pilares en import · propaga stats UI |
| `PpTabStock.tsx` | Panel pilares×biblioteca + link asignación |

### Backfill retroactivo ejecutado

| Script | Qué hizo |
|--------|----------|
| `repair_programado_retroactivo.ts` | Pilares + FK + marca + `_shop` en 8 PP con stock |
| `repair_pp_programado_pilares_fk.ts` | FK PPD idempotente por PP |
| `backfill_pp_pilares_from_ppd.ts` | Líneas faltantes desde PPD |

**Pendiente ámbar:** reimport o backfill masivo `grupo_estilo_id` / `linea_referencia` en PP ya importados (tabla §2 Error A).

---

## 3 · Error B — Caso comercial fuera de biblioteca

### Qué pasó

El motor resolvía caso con heurísticas (`STYLE CARTERAS`, material `BAG`) en lugar de **PELE/biblioteca**. Ejemplo PP-30 shop 1511:

| Línea | Caso erróneo | Caso correcto (BCL) |
|-------|--------------|-------------------|
| 10118 | BR-VZ-MD-ML-MKA-O | **CARTERAS** |
| 10119 | BR-VZ-MD-ML-MKA-O | **CARTERAS** |
| 10003 | — | **CARTERAS** ✅ |

Auditoría mostró “0 líneas sin BCL” — **engañoso**: las líneas **ya estaban en BCL** pero en **caso equivocado**, no como libres.

### Fix código

| Archivo | Cambio |
|---------|--------|
| `resolve-caso-comercial.ts` | Solo PELE → `precio_lista` · sin STYLE/BAG |
| `administrador-ic-query.ts` | PF artículo con `caso` motor |
| `PpTabStock.tsx` | Bloque «Ya en biblioteca (revisar caso)» |

### Fix BD (Director corrigió BCL manual + agente sync)

1. `trasladar_lineas_biblioteca.ts` — mueve líneas entre casos BCL + PELE (ej. 10118/10119 → CARTERAS bib #8 evento 45).
2. `reemparejar_casos_pf_programado.ts` — **PELE full resync** desde BCL (eventos cerrados OK) + regeneración FI.

---

## 4 · Error C — PELE desincronizado de BCL

Eventos **31 · 37 · 45** estaban **cerrados** → `aplicarBibliotecaAEvento` **bloqueado**. Correcciones manuales en biblioteca #8 **no llegaban a PELE** hasta sync directo.

### Sync ejecutado 2026-07-12

| Evento | Biblioteca | Líneas PELE insertadas | Diff dry-run |
|--------|------------|------------------------|--------------|
| 31 | 7 | 1739 | 162 |
| 37 | 8 | 1739 | 72 |
| 45 | 8 | 1739 | 18 |

Script: `reemparejar_casos_pf_programado.ts` (`syncPeleDesdeBiblioteca`).

---

## 5 · Regeneración FI + prefacturas (flota completa)

Prefacturas = **calculadas** en Admin IC desde PPD + PELE (no tabla persistida). Tras PELE sync → regenerar FI.

| PP | nro | FI post-repair | Chusa N1 | PF CARTERAS |
|----|-----|----------------|----------|-------------|
| 15 | PP-2026-0015 | 10 | ❌ IC≠PF | 0 |
| 25 | PP-2026-0016 | 39 | ❌ | 0 |
| 26 | PP-2026-0017 | 98 | ❌ | 0 |
| 27 | PP-2026-0018 | 24 | ✅ | 0 |
| 28 | PP-2026-0019 | **115** | ❌ | 4 shops |
| 30 | PP-2026-0021 | 80 | ✅ | shop 1511 |
| 31 | PP-2026-0022 | 48 | ❌ | 0 |
| 32 | PP-2026-0023 | 14 | ❌ | 0 |

**Chusa N1 falla** cuando 1 shop tiene **varios casos** (IC≠PF) — no es bug de caso; FI generadas igual vía motor programado.

**Incidente PP-28:** Chusa borró 115 FI y falló recrear; `completar_fi_pp.ts 28` restauró 115/115.

### Scripts regeneración

| Script | Uso |
|--------|-----|
| `reemparejar_casos_pf_programado.ts` | Sync PELE + Chusa (fallback manual si falla) |
| `regenerar_fi_programado_cp.ts` | Motor programado 1 IC = 1 FI por lote |
| `completar_fi_pp.ts` | Completar FI faltantes por PP |
| `audit_caso_prefactura_programado.ts` | Auditoría carteras × motor |
| `audit_pilares_programado_canonico.ts` | Auditoría pilares + FK + BCL |

---

## 6 · Ámbar residual (no bloqueante deploy)

| Ítem | Detalle |
|------|---------|
| Línea **6531** | PELE = PROMOCIONAL por biblioteca · material BAG · PP-17/19 |
| Línea **2502** | PELE = BR-VZ · no CARTERAS · PP-17/19/21 |
| Línea **1206** shop 1511 | Sigue BR-VZ — Director no confirmó traslado a CARTERAS |
| Gaps estilo LR | PP históricos sin reimport — ver §2 |
| PP-29 | Sin proforma — pendiente Excel |

---

## 7 · Checklist obligatorio post-import proforma (nuevo)

Antes de declarar import cerrado:

- [ ] `provisionPilaresFromProforma` ejecutado · stats en UI
- [ ] PPD con `linea_id` + `referencia_id` + `id_material` + `id_color`
- [ ] Líneas nuevas en pilares · aviso si sin caso en biblioteca
- [ ] **No** FI automática sin revisión biblioteca para líneas nuevas
- [ ] Caso = PELE/biblioteca · **nunca** heurística Excel
- [ ] Tras editar BCL en evento cerrado → `reemparejar_casos_pf_programado.ts --solo-sync` + regenerar FI

---

## 8 · Índice cruzado

| Doc | Rol |
|-----|-----|
| [CHUSAR_VULNERABILIDAD_IMPORT_PROFORMA_PILARES](./CHUSAR_VULNERABILIDAD_IMPORT_PROFORMA_PILARES.md) | Error A origen |
| [4.02.03.009](../../../5_errores/detalle/4.02.03.009_import-proforma-sin-motor-pilares.md) | Índice errores |
| [DOC_PROCESO_PROGRAMADO_COMPLETO_…20260711](./DOC_PROCESO_PROGRAMADO_COMPLETO_ERRORES_SOLUCIONES_20260711.md) | Cadena end-to-end |
| [CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) | `_shop` Excel |
| `politicas-importacion-pilares.mdc` | Ley pilares |

---

*Director: esta sesión cierra la confusión biblioteca/libres/caso erróneo. La ley pilares en import queda codificada; backfill estilo LR = siguiente OT si se exige 0 gaps.*
