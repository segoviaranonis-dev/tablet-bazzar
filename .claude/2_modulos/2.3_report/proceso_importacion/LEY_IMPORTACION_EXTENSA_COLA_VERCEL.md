# Ley — Importación extensa · Cola por lotes · Vercel + Postgres

**Código:** **2.3.1.7.5.3.3.10**  
**Alcance:** **Todo** proceso de importación Report que pueda superar ~45s serverless: proforma PROGRAMADO, conversión Retail masiva, FI lote, Logística OK, etc.  
**Orden Director:** **Documenta** · 2026-07-23  
**Caso validado:** PP-30 · proforma **7196/2026** · 787 SKUs · 8.800 pares · 80 IC · 80 FI  
**Commits:** `674b99c` → `6683aca` → `75be90a` → `22faede`  
**Doc matriz errores:** [CHUSAR_SOLUCION_INTEGRAL_PP_PROGRAMADO_IMPORT_20260723](./CHUSAR_SOLUCION_INTEGRAL_PP_PROGRAMADO_IMPORT_20260723.md) (**2.3.1.7.5.3.3.9**)

**Shibboleth:** Andrés, el que viene.

---

## 1 · Cuándo aplica esta ley

| Condición | Obligatorio cola |
|-----------|------------------|
| > **~200 SKUs** o > **~3.000 pares** en un solo upload | ✅ |
| Provisión pilares + INSERT en mismo request | ✅ dividir |
| Usuario en red lenta (oficina RIMEC · proxy) | ✅ requests cortos + UI |
| `maxDuration` 300 pero trabajo **serial** O(N) en request 1 | ✅ **FAIL** sin cola |

**Mención «importación» en diseño nuevo:** leer esta ley + matriz **4.02.03.017–020** antes de codear.

---

## 2 · Patrón obligatorio (tres fases)

```
Fase A · PLAN     → parse + validaciones baratas · sin TX pesada
Fase B · CHUNK i  → trabajo proporcional al slice · idempotente · retomable
Fase C · FINALIZE → solo al último chunk (snapshot · backfill · totales)
```

### A · Plan (`phase=ppd_plan` o equivalente)

- Parse archivo (o leer staging).  
- Gates de negocio (totales IC, listado, permisos).  
- Respuesta: `{ total_items, batch_size, n_lotes, resume_offset }`.  
- **UI:** «Analizando…» + cifras (SKUs · pares · IC · N lotes).

### B · Chunk loop

- Tamaño lote PROGRAMADO PPD: **`PROFORMA_PPD_BATCH_SIZE = 120`**.  
- **Cada chunk:** pilares **solo del slice** · TX corta · COMMIT.  
- **UI:** «Realizando importación i/N» → «**100% exitoso**» por lote · barra % · reintento 504 (máx. 3).  
- **Retoma:** offset = `COUNT` filas ya persistidas · **no** borrar progreso.

### C · Finalize

- Último chunk: `finalizePpdImport` · snapshot proforma · backfill FK.  
- **UI:** «¡Importación exitosa!» 2,5 s antes de cerrar overlay.

---

## 3 · Leyes técnicas (no repetir)

### L1 · Pool max=1 — sin deadlock

```
⛔ pool.query() mientras client TX abierta
✅ Prefetch pool → connect → BEGIN → client queries → COMMIT → release → pool
```

Error: **4.02.03.017** · [CHUSAR_HOTFIX_PP_POOL_DEADLOCK_20260722](./CHUSAR_HOTFIX_PP_POOL_DEADLOCK_20260722.md)

### L2 · No repetir preview caro en confirmar

Error: **4.02.03.018** · `gateProgramadoPpdFast` en paso 2.

### L3 · Pilares proporcionales al slice — no al archivo entero

Error: **4.02.03.019** · lotes falsos.

### L4 · Tipos parser sincronizados con engine en mismo deploy

Error: **4.02.03.020** · `material_label`.

### L5 · Duración Vercel

| Ruta import | `maxDuration` |
|-------------|---------------|
| `…/proforma` POST | 300 |
| `…/generar-fi-lote` | 300 |

`vercel.json` wildcard + `export const maxDuration` en route.

---

## 4 · Matriz errores import extensa (Report)

| Código | Síntoma | Solución |
|--------|---------|----------|
| **4.02.03.017** | `timeout exceeded when trying to connect` | Prefetch/release pool |
| **4.02.03.018** | 504 confirmar (monolito) | Gate rápido · pilares fuera TX |
| **4.02.03.019** | 504 con «lotes» | Pilares por slice · cola UI · 120 SKUs |
| **4.02.03.020** | Build TS deploy | Parser + engine mismo commit |
| EMAXCONN | max client connections | Pool efímero · mutex |

---

## 5 · Archivos referencia (PP programado · 2026-07-23)

| Archivo | Rol |
|---------|-----|
| `proforma-programado-engine.ts` | `ppd_plan` · `ppd` · `preparePpdImportLookups(slice)` |
| `ProcesoImportacionQueueOverlay.tsx` | Animación cola + éxito |
| `PpTabStock.tsx` | Loop plan + chunks + reintento |
| `proforma/route.ts` | `phase=ppd_plan` · `maxDuration=300` |
| `parse-proforma.ts` | `ProformaRow` completo |

---

## 6 · Checklist agente — nueva importación extensa

- [ ] ¿Hay fase PLAN sin escribir BD pesada?  
- [ ] ¿Cada request procesa **≤ batch_size** ítems en pilares **y** insert?  
- [ ] ¿Retoma desde offset persistido?  
- [ ] ¿UI muestra progreso por lote + éxito final?  
- [ ] ¿Pool L1 respetada en TX?  
- [ ] ¿`npm run build` antes de push?  
- [ ] ¿Smoke / auditoría script con PP real?

---

## 7 · Réplica a otros motores

| Motor | Patrón equivalente |
|-------|-------------------|
| Admin IC · FI lote | `generar-fi-lote` batches 12 · loop UI |
| Conversión Retail Alfredo | `PilaresBulkResolver` + chunks 400 · `fcd2fba` |
| Import precios Motor | batches + maxDuration 300 |

**Principio único:** ningún request serverless debe hacer **O(archivo completo)** en pilares o auditoría si el archivo tiene miles de filas.

---

*Índice: **2.3.1.7.5.3.3.10** · [INDICE](./INDICE.md) · Errores: `5_errores/INDICE_ERRORES.md`*
