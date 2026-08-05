# CHUSAR — Plan corrección import PE · sdrm0849 · pilares FK · latencia DB

**Código:** **2.3.1.10.2** · padre **2.3.1.10** Depósito RIMEC / Stock Pronta Entrega  
**Estado:** 🟢 **IMPORT sdrm0849 EJECUTADO** · pipeline + UI · 2026-07-14 · herencia pilares Fase C pendiente OT  
**Archivo stock:** `csv's/stock's/sdrm0849.csv` (~12.121 filas · pipe `|`)  
**Keyword:** Documenta · orden Director  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Diagnóstico (qué falla hoy)

| Síntoma | Causa raíz |
|---------|------------|
| **Botón import no visible** en `/stock-pronta-entrega` | UI migró a grilla operativa; import quedó **solo CLI** (`import_rimec_pronta_entrega_csv.py`). CHUSAR padre listaba «API import web ⏳» sin implementar. |
| Batch UI fijo **`sdrm0831`** | Hardcode en `page.tsx`, API productos default batch — no refleja **`sdrm0849`**. |
| Filtros lentos / lógica en front | Pilares PE provisionados **a ciegas** (`INSERT … DO NOTHING`) **sin** herencia `genero_id` · `marca_id` · `grupo_estilo_id` · `linea_referencia.tipo_1_id` — mismas brechas que error **`4.02.03.009`** en proforma. |
| Doble verdad arquitectónica | Staging `stock_pronta_entrega_rimec` (puente) vs destino **Hiedra Venenosa** (`pedido_proveedor_detalle` · `quincena_desc = 'Pronta entrega'`) — [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](./ESTRATEGIA_HIEDRA_VENENOSA_PE.md). |
| Tercera categoría sin ley unificada | **Compra previa** y **Programado** ya pasan por `provisionPilaresFromProforma` (Report). **PE CSV** usa motor distinto e incompleto en Python `_provision_pilares`. |

**Ley que debe regir PE (tercera vía de nutrición operativa):**

- `.cursor/rules/politicas-importacion-pilares.mdc` §5 (retail alta densidad) + §6 (no inverso)  
- Paridad herencia: `proforma-pilares-provision.ts` · `CHUSAR_VULNERABILIDAD_IMPORT_PROFORMA_PILARES.md`  
- Patrón bulk medido: [CHUSAR_IMPORT_CSV_PILARES_PROVISION.md](../depositos/CHUSAR_IMPORT_CSV_PILARES_PROVISION.md) (Bazzar — **todo en DB, nada en front**)

**Norte Alejandro Magno:** PE = entidad **STOCK** en Panel de Control · misma máquina PPD/FI que CP/Programado · discriminador tarjeta `quincena_desc = 'Pronta entrega'`.

---

## 2 · Alcance batch sdrm0849

| Campo | Valor |
|-------|--------|
| Archivo | `C:\Users\hecto\Nexus_Core\csv's\stock's\sdrm0849.csv` |
| `batch_label` | `sdrm0849` |
| Columnas | `CODIGO ARTICULO` · `COD.ART.PROVEEDOR` · `COD.GRUPO` · `COD.MATERIAL` · `COD.COLOR` · `DESCRIPCION GRADA` · `LPN` · `S00_D1` · `S00_DEP2` · `S00_D3` |
| Ramos | Prefijo `654.*` calzado · `638.*` confecciones/Kyly |
| Regla depósito | 1 fila CSV → hasta 3 filas BD (solo qty **> 0**) |

**Pre-import:** dry-run obligatorio · conteo moléculas · `fk_miss = 0` antes de commit.

---

## 3 · Plan de corrección (fases)

### Fase A — UI · botón import visible (Report)

| # | Tarea | Archivo / ruta |
|---|--------|----------------|
| A1 | Botón **«Importar CSV sdrm»** en header `/stock-pronta-entrega` (patrón `ImportCsvDepositoButton` Bazzar) | `StockProntaEntregaClient.tsx` |
| A2 | Modal: selección archivo · validar nombre `sdrm####.csv` · modo **Reemplazar batch** / preview | nuevo `PeImportCsvPanel.tsx` |
| A3 | Mostrar batch activo dinámico (no hardcode `sdrm0831`) | `page.tsx` · `StockPeContext` |
| A4 | Banner Hiedra Venenosa (violación temporal documentada) | ya en CHUSAR_PANEL_IMPORTADO_PE §1 |

### Fase B — API import web (paridad CLI)

| # | Tarea | Detalle |
|---|--------|---------|
| B1 | `POST /api/stock-pronta-entrega/import/preview` | Parse pipe · stats por depósito/ramo · filas rechazadas |
| B2 | `POST /api/stock-pronta-entrega/import` | Transacción: pilares → stock/PPD · heartbeat import |
| B3 | Auth | Mismo gate que motor precios admin / depósito DIOS |
| B4 | Evidencia JSON | `batch_label` · duración ms fase pilares vs fase stock · `fk_miss` |

**Implementación preferida:** invocar lógica compartida TS (`report/src/lib/deposito-rimec/import-sdrm.ts`) — retirar duplicación Python/TS a mediano plazo; CLI Python llama mismo contrato vía subprocess o RPC.

### Fase C — Motor pilares PE unificado (crítico latencia)

Extraer **`provisionPilaresFromSdrm()`** — misma semántica que proforma:

```
Orden moléculas: codigo_proveedor numérico ASC (L↑ R↑)
Por molécula única (linea, ref, material, color):
  1. upsert material / color (ciego + enriquecimiento no inverso si Excel trae texto)
  2. upsert linea + herencia vecino inferior (genero, marca desde COD.GRUPO/marca_v2, grupo_estilo)
  3. upsert referencia
  4. upsert linea_referencia (estilo + tipo_1 desde ref-1 misma línea)
  5. tono_canon en color si aplica (Kyly)
```

| Reutilizar | Desde |
|------------|--------|
| Herencia L / LR | `proforma-pilares-provision.ts` |
| Codigos 654/638 | `control_central/core/pilares/codigos.py` · `rimec-csv-sdrm.ts` |
| Reporte gaps | Adaptar `proforma-pilares-import-report.ts` → `sdrm-pilares-import-report.ts` |

**Prohibido:** seguir con `_provision_pilares()` actual (solo INSERT ciego sin herencia) — viola ley Director.

### Fase D — Destino datos · Hiedra Venenosa (PPD)

| Etapa | Qué |
|-------|-----|
| D1 (corto plazo) | Mantener `stock_pronta_entrega_rimec` **pero** con FK pilares completas post Fase C → filtros SQL indexados |
| D2 (objetivo) | CSV → cabecera PP import PE + **INSERT PPD** · `quincena_desc = 'Pronta entrega'` · vista `v_stock_pe_rimec` única |
| D3 | Deprecar lectura UNION staging en catálogo cuando PPD cubra 100% batch |

Doc norte: [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](./ESTRATEGIA_HIEDRA_VENENOSA_PE.md) · [CHUSAR_DOS_MADRES_GESTION_COMPRA.md](../gestion_compra/CHUSAR_DOS_MADRES_GESTION_COMPRA.md).

### Fase E — Latencia · todo en DB

| Problema | Corrección |
|----------|------------|
| Filtros marca/estilo/género en front | JOIN pilares en **vista/materialized** · API devuelve solo IDs ya resueltos |
| Grilla 7.669 tarjetas | Paginación server-side · prefetch por lote (ya parcial en `prefetch-grilla-apis`) |
| Catálogo :3001 | `v_stock_pe_rimec` debe exponer `genero_id` · `marca_id` · `grupo_estilo_id` vía FK linea/LR — **cero** parse texto en Next |
| Panel Control PE | KPIs desde agregación SQL molécula (paridad CP canónico) |

**Índices sugeridos (OT):** `(proveedor_id, codigo_proveedor)` pilares · `(batch_label, deposito_codigo)` staging · `(linea_id, referencia_id, material_id, color_id)` PPD.

### Fase F — Import operativo sdrm0849

| Paso | Acción |
|------|--------|
| 1 | Dry-run preview API/CLI · diff vs batch `sdrm0831` |
| 2 | Backup / snapshot batch anterior |
| 3 | `DELETE WHERE batch_label = 'sdrm0849'` (idempotente) |
| 4 | Import con motor Fase C |
| 5 | Checklist §4 post-import |
| 6 | Smoke `:3001` catálogo PE · `/stock-pronta-entrega` filtros · Panel Control STOCK |

---

## 4 · Checklist post-import (obligatorio)

Copiado y extendido desde [CHUSAR_VULNERABILIDAD_IMPORT_PROFORMA_PILARES.md](../proceso_importacion/CHUSAR_VULNERABILIDAD_IMPORT_PROFORMA_PILARES.md):

- [ ] `fk_miss = 0` en insert stock/PPD  
- [ ] 100% filas con `linea_id` + `referencia_id` + `material_id` + `color_id`  
- [ ] Líneas nuevas con `genero_id` + `marca_id` + `grupo_estilo_id` (herencia o COD.GRUPO)  
- [ ] `linea_referencia` con estilo + `tipo_1_id`  
- [ ] Material/color enriquecidos · regla no inversa  
- [ ] Script auditoría gaps = 0 antes de declarar batch cerrado  
- [ ] KPI Panel STOCK = suma batch en BD (paridad molécula)

---

## 5 · Impacto cruzado (herramientas afectadas)

| Herramienta | Si pilares PE incompletos |
|-------------|---------------------------|
| **RIMEC Web :3001** | Filtros género/marca/estilo fallan o van lentos · Confecciones mezcla ramos |
| **Panel Control STOCK** | KPIs correctos en pares pero biblioteca/casos desalineados |
| **Motor precios / biblioteca** | Líneas sin caso BCL · chips biblioteca vacíos |
| **Facturación PE** | `linea_snapshot` FI pobre · reversión stock OK pero trazabilidad pobre |
| **Estadísticas :3001** | PE column OK · filtros dependen FK header |
| **Aprobaciones / FI** | LPN join `(linea_id, referencia_id, material_id)` falla si FK null |

**Velocidad = consecuencia de FK materializadas en import** — no optimizar front sin Fase C.

---

## 6 · Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Reemplazar batch borra ventas demo | Gate: bloquear REPLACE si `pares_vendidos > 0` en batch activo |
| 12k filas × 3 depósitos | Bulk INSERT staging · transacción única · heartbeat |
| Divergencia Python vs TS | Un solo motor TS; Python wrapper deprecado |
| Kyly ref `K` vs numérico | Mantener `_normalize_kyly` probado en sdrm0831 |

---

## 7 · Entregables código (siguiente OT)

1. `PeImportCsvPanel.tsx` + rutas API preview/import  
2. `report/src/lib/deposito-rimec/provision-pilares-sdrm.ts` (motor unificado)  
3. `sdrm-pilares-import-report.ts` + panel post-import en tab Operativa  
4. Actualizar `import_rimec_pronta_entrega_csv.py` → delegar motor TS o portar herencia  
5. Migración índices + vista filtros PE (si aplica)  
6. Smoke script `report/scripts/smoke_sdrm0849_import.mjs`

---

## 8 · Índice relacionado

| Doc | Rol |
|-----|-----|
| [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md](./CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md) | Tabla staging · CLI actual |
| [MAPA_CSV_SDRM_STOCK_PRONTA_ENTREGA.md](../../../../report/docs/MAPA_CSV_SDRM_STOCK_PRONTA_ENTREGA.md) | Columnas CSV |
| [CHUSAR_PANEL_IMPORTADO_PE.md](./CHUSAR_PANEL_IMPORTADO_PE.md) | UI panel |
| [CHUSAR_VULNERABILIDAD_IMPORT_PROFORMA_PILARES.md](../proceso_importacion/CHUSAR_VULNERABILIDAD_IMPORT_PROFORMA_PILARES.md) | Motor referencia proforma |
| [CHUSAR_IMPORT_CSV_PILARES_PROVISION.md](../depositos/CHUSAR_IMPORT_CSV_PILARES_PROVISION.md) | Patrón bulk Bazzar |
| Error `4.02.03.009` | Antecedente proforma — no repetir en PE |

---

*Plan ratificado por orden Director · import objetivo **sdrm0849** · integración Alejandro Magno tercera categoría stock.*
