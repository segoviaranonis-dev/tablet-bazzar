# CHUSAR — PP-17 · Tercera proforma PROGRAMADO · Handoff jornada 2026-07-09

**Código:** **2.3.1.7.5.3.3.5**  
**Estado:** ✅ **CERRADO** 2026-07-21 · Admin IC + 100 FI  
**Operador:** ALFREDO · ADMIN RIMEC  
**Prod:** https://rimec-report.vercel.app/proceso-importacion/pedido-proveedor/26?tab=stock  
**Padres:** [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) · [CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE](./CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md) · [CHUSAR_DEPLOY_ALFREDO_20260709](./CHUSAR_DEPLOY_ALFREDO_20260709.md)

**Shibboleth:** Andrés, el que viene.

---

## 1 · Respuesta Director — ¿hay error de código que modificar?

**No.** Para import proforma PROGRAMADO en prod **no queda hotfix pendiente** en el repo `report/` (commit `fcd2fba` en `main`).

| Capa | Estado prod |
|------|-------------|
| Motor import proforma | **TS** en Vercel (`run-python-pp.ts` → `importProformaProgramadoTs`) |
| Preview SHOP↔IC | TS · `maxDuration=120` |
| Import + N FI | TS · `maxDuration=300` |
| Vincular listado | TS fallback Vercel (`vincularListadoAPp`) |
| Pool PG | Singleton `max:1` + retry (`pool.ts`) |

**Solo gates operativos** (UI/BD), no bugs de código:

1. Todas las IC del PP con **un solo** `precio_evento_id` (evento listado cerrado).
2. Evento con **`precio_lista` > 0** (motor Paso 3 + cierre).
3. **Preview verde** — pares proforma = pares IC por SHOP.
4. **Nro proforma** en cabecera PP antes de import.

**Prohibido prod hoy (deuda conocida — no bloquean import):**

- PDF FI (`run-python-fi-pdf.ts` — solo Python).
- Botón **↻ Recalcular FI** masivo (solo Python).

---

## 2 · Las tres proformas PROGRAMADO — tabla comparativa

Referencia canónica en BD (2026-07-09 noche):

| # | PP | Proforma | Evento listado | IC | Pares | PPD | FI | Estado import |
|---|-----|----------|----------------|-----|-------|-----|-----|---------------|
| **1ª** | **PP-2026-0015** (id 15) | `PRG_8604-2026` | **#31** PR-8604-PRUEBA_1 · cerrado · 39 SKUs lista | 10 | 10.032 | 836 | 10 | ✅ **CERRADO** · caso Alejandro Magno original |
| **2ª** | **PP-2026-0016** (id 25) | `8600-4121` | **#37** PR-8600 · cerrado · 28 SKUs lista | 39 | 8.880 | 722 | 39 | ✅ **CERRADO** · [CHUSAR_PP16](./CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md) |
| **3ª** | **PP-2026-0017** (id 26) | **`5436/2026`** | **#45** `28) 08-06-2026` · cerrado · **2.388** `precio_lista` | **100** | **~9.068** | **949+** | **100** | ✅ **CERRADO** 2026-07-21 · [CHUSAR_PP26](./CHUSAR_ADMIN_IC_PP26_LOTE_FI_20260721.md) |

**Escala 3ª vs anteriores:** ~2,5× IC de PP-16 · listado 2.388 SKUs Excel (evento motor #45; borradores #40–#44 descartados). Import puede tardar **3–8 min** — normal con overlay; timeout API **300 s**.

---

## 3 · PP-17 — ficha operativa

| Campo | Valor |
|-------|--------|
| PP BD id | **26** |
| Quincena arribo | **18** |
| Proveedor | BEIRA RIO (654) |
| Excel motor | evento **#45** · 2.388 SKUs · biblioteca **#8** |
| IC PROGRAMADO | **98** · todas en evento **#45** (unificado fin jornada) |
| Cabecera proforma | **`5436/2026`** cargada |
| PPD / FI | **0** — limpio para primer import |

**Script diagnóstico:** `node scripts/_diag_pp_programado_resumen.mjs` · `DIAG_PP=26 node scripts/_diag_pp26_eventos.mjs`

---

## 4 · Secuencia mañana (copiar PP-15 / PP-16)

Misma UI tab **Stock** · bloque programado (`PpTabStock`):

| Paso | Acción | Referencia PP-16 |
|------|--------|------------------|
| 0 | Confirmar IC → evento **#45** único | PP-16: 39 IC evento #37 |
| 1 | Subir `.xls/.xlsx` proforma **5436** | PP-16: `8600IMPORTARWEB.xlsx` |
| 2 | **Preview emparejamiento** | 12 SHOP · todos `match: true` |
| 3 | Checklist UI verde (archivo · nro proforma · preview) | — |
| 4 | **Importar proforma →** | 3–6 min local · hasta ~8 min prod |
| 5 | Tab **FI** — ver N FI = N IC | PP-16: 39 FI RESERVADA |
| 6 | CSV Carlos (opcional) | No usar PDF FI en prod |

**Si preview falla:** revisar columna **SHOP** = `id_cliente` IC · suma pares por SHOP = `cantidad_total_pares` IC (múltiples IC mismo cliente se suman — ver `aggregateIcsPorCliente`).

**Si import falla post-preview:** captura + terminal Vercel; revisar pilares material/color en filas Excel.

**Reintento:** [CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO](./CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO.md) — solo sin FI CONFIRMADA.

---

## 5 · Motor precios — jornada Alfredo (contexto)

| Evento | Estado | Nota |
|--------|--------|------|
| #44 | borrador · 0 `precio_lista` | URL vieja en capturas — **no usar** |
| **#45** | **cerrado** · 2.388 `precio_lista` | **Listado vigente PP-17** |

Fix deploy **504 Conversión Paso 3:** commit `fcd2fba` — bulk pilares + chunks staging + `maxDuration=300` calcular/cerrar/carga.

Detalle commits: [CHUSAR_DEPLOY_ALFREDO_20260709](./CHUSAR_DEPLOY_ALFREDO_20260709.md).

---

## 6 · Smoke post-import PP-17 (checklist)

- [ ] Preview: todos emparejamientos `match: true` · pares total = 9.068
- [ ] `COUNT(ppd)` > 0 · suma pares PPD = comprometidos
- [ ] `COUNT(fi RESERVADA)` = **98**
- [ ] Suma pares FI = 9.068
- [ ] Tab FI desbloqueada · miniaturas visibles
- [ ] **No** probar PDF FI en prod
- [ ] CSV Carlos descarga OK (formato `;`)

---

## 7 · Evidencia scripts repo

| Script | Uso |
|--------|-----|
| `scripts/_diag_pp_programado_resumen.mjs` | Resumen PP 15/25/26 |
| `scripts/_diag_pp26_eventos.mjs` | IC por evento en PP |
| `scripts/_diag_evento44_proforma.mjs` | `DIAG_EVENTO=45` — listado + PP |
| `scripts/audit_pp25_aritmetica.mjs 25` | Paridad aritmética PP-16 |

---

**Índice:** [INDICE.md](./INDICE.md) · **Protocolo:** [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md)
