# CHUSAR — Solución integral · Import proforma PROGRAMADO · Errores y leyes



**Código:** **2.3.1.7.5.3.3.9**  

**Orden Director:** despliega + documenta · 2026-07-23 (actualizado cola + éxito PP-30)  

**Deploy vigente:** commit `22faede` · alias https://rimec-report.vercel.app  

**Ley replicable import extenso:** [LEY_IMPORTACION_EXTENSA_COLA_VERCEL](./LEY_IMPORTACION_EXTENSA_COLA_VERCEL.md) (**2.3.1.7.5.3.3.10**)  

**Norte:** **100% eficiencia** — no repetir errores conocidos en confirmar import / Logística OK / Admin IC lote.



**Shibboleth:** Andrés, el que viene.



---



## 1 · Flujo operativo canónico (inviolable)



```

1 · Preview totales IC ↔ proforma     (auditoría pilares×precio AQUÍ)

2 · Confirmar import — COLA por lotes (phase=ppd_plan → phase=ppd × N)

3 · Tab Administrador IC              (alinear IC↔PF · IC = PROFORMA = FI)

4 · Tab FI · CSV / aprobaciones

5 · Logística OK · Publicar           (solo con FI confirmadas)

```



| Prohibido | Por qué |

|-----------|---------|

| Confirmar sin preview verde | Gate totales + listado |

| Un solo POST para 500+ SKUs | 504 · `4.02.03.018` / `4.02.03.019` |

| Pilares de **todo** el Excel en lote 1 | Lotes falsos · `4.02.03.019` |

| Logística OK en paralelo con import | Pool max=1 · contención |

| FI automáticas al import | Ley 2026-07-21 · Admin IC |

| `pool.query()` durante `client.connect()` TX | Deadlock `4.02.03.017` |



---



## 2 · Leyes técnicas Vercel + Postgres



### L1 · Pool max=1 (serverless)



```

✅ Prefetch con pool.query() ANTES de connect()

✅ TX: connect → BEGIN → queries en client → COMMIT → release

✅ Post-work con pool.query() DESPUÉS de release

⛔ Segunda conexión al pool mientras TX abierta

```



Doc: [EMAXCONN_SOLUCION_INTEGRAL](../../../report/docs/EMAXCONN_SOLUCION_INTEGRAL.md) · [CHUSAR_HOTFIX_PP_POOL_DEADLOCK_20260722](./CHUSAR_HOTFIX_PP_POOL_DEADLOCK_20260722.md)



### L2 · Duración lambda (504)



| Ruta | `maxDuration` | `export const` en route |

|------|---------------|------------------------|

| `…/proforma` POST | **300** | `route.ts` + `vercel.json` wildcard |

| `…/proforma/preview` | 120 | idem |

| `…/generar-fi-lote` | 300 | idem |



### L3 · Cola import PPD (solución definitiva 2026-07-23)



| Fase | `phase` | Qué |

|------|---------|-----|

| Plan | **`ppd_plan`** | Parse + `gateProgramadoPpdFast` · SKUs · pares · IC · **N lotes** · offset retoma |

| Chunk | **`ppd`** | `preparePpdImportLookups(**slice**)` · INSERT slice · COMMIT |

| UI | `ProcesoImportacionQueueOverlay` | Inicio → Analizando → Realizando i/N → 100% exitoso → ¡Éxito! |



| Constante | Valor |

|-----------|-------|

| `PROFORMA_PPD_BATCH_SIZE` | **120** SKUs/request |



Archivo único motor: `proforma-programado-engine.ts` · UI: `PpTabStock.tsx`



**Ley completa:** [LEY_IMPORTACION_EXTENSA_COLA_VERCEL](./LEY_IMPORTACION_EXTENSA_COLA_VERCEL.md)



### L4 · Confirmar sin re-preview caro



| Paso | Dónde | Qué |

|------|-------|-----|

| Gate | `gateProgramadoPpdFast` | ICs · listado · totales — **no** re-auditoría preview |

| Pilares | por **slice** | **Fuera** de TX larga · idempotente upsert |

| Post-audit | skip en chunks | Avisos ya vistos en preview paso 1 |



### L5 · FI por lote



API `generar-fi-lote` · batches 12 · loop UI · una conexión por request.  

Doc: [CHUSAR_ADMIN_IC_PP26_LOTE_FI_20260721](./CHUSAR_ADMIN_IC_PP26_LOTE_FI_20260721.md)



### L6 · Marca vs caso (R-MARCA-PF-1)



BRAND Excel = caso comercial → `linea.marca_id` real.  

Doc: [CHUSAR_PP_PROGRAMADO_IMPORT_PROFORMA_20260721](./CHUSAR_PP_PROGRAMADO_IMPORT_PROFORMA_20260721.md)



---



## 3 · Matriz de errores — módulo import PP programado



| Código | Síntoma | Causa | Solución canónica | Estado |

|--------|---------|-------|-------------------|--------|

| **4.02.03.006** | PP-16 sin FI | Loop FI roto / Python prod | Motor TS · Admin IC | ✅ |

| **4.02.03.009** | PPD sin pilares | Import sin motor | `provisionPilaresFromProforma` | 🟡 parcial |

| **4.02.03.010** | Botón verde no FI | Pool / regenerar | `generar-fi-lote` batches | ✅ PP-26 |

| **4.02.03.012** | Vincular listado sin FI | TS sin recalc | `recalcular-fis-pp.ts` | ✅ |

| **4.02.03.013** | PDF FI falla prod | Sin Python Vercel | pdf-lib TS | ✅ |

| **4.02.03.017** | `timeout exceeded when trying to connect` | Deadlock pool max=1 en TX | Prefetch/release · `674b99c` | ✅ |

| **4.02.03.018** | **504** confirmar (monolito) | Re-preview + pilares TX larga | Gate rápido · prep fuera TX · `6683aca` | ✅ parcial |

| **4.02.03.019** | **504 con lotes 300** | Pilares **todo Excel** en lote 0 | Slice 120 · cola UI · `75be90a` | ✅ PP-30 |

| **4.02.03.020** | Build Vercel TS | `material_label` sin tipo | `parse-proforma.ts` · `22faede` | ✅ |

| EMAXCONN | `max client connections` | Lambdas × pooler 200 | `pool.ts` efímero + mutex | ✅ |



Errores hermanos: [DOC_PROCESO_PROGRAMADO_COMPLETO_ERRORES_SOLUCIONES_20260711](./DOC_PROCESO_PROGRAMADO_COMPLETO_ERRORES_SOLUCIONES_20260711.md)



---



## 4 · Evidencia éxito PP-30 (2026-07-23)



| Métrica | Valor |

|---------|-------|

| PP | PP-2026-0021 · proforma 7196/2026 |

| SKUs | 787 |

| Pares | 8.800 (= IC = proforma) |

| IC / FI | 80 / 80 |



Script: `report/scripts/_audit_pp30_import_ok.mjs`



---



## 5 · Checklist deploy Report (import programado)



- [ ] `npm run build` exit 0  

- [ ] Engine + `parse-proforma.ts` tipos sincronizados  

- [ ] Commit motor proforma + queue overlay + `vercel.json`  

- [ ] Push main · Vercel Ready  

- [ ] Smoke: preview + cola confirm PP grande  

- [ ] `npx tsx scripts/_smoke_pool_deadlock_pp.mjs [ppId]` PASS  



---



## 6 · Archivos código (referencia)



| Archivo | Rol |

|---------|-----|

| `proforma-programado-engine.ts` | `ppd_plan` · `ppd` · pilares por slice |

| `ProcesoImportacionQueueOverlay.tsx` | Cola animada + éxito |

| `PpTabStock.tsx` | Loop plan + chunks + reintento 504 |

| `parse-proforma.ts` | `ProformaRow` |

| `proforma/route.ts` | API POST · `maxDuration=300` |

| `vercel.json` | Wildcard duration PP |



---



## 7 · Regresión — antes de merge



1. ¿Confirmar repite preview completo? → **FAIL**  

2. ¿Pilares reciben `detalle` completo en chunk? → **FAIL** (`4.02.03.019`)  

3. ¿Segunda query al pool en TX? → **FAIL** (`4.02.03.017`)  

4. ¿Import >200 SKUs sin cola UI? → **FAIL**  

5. ¿`maxDuration` < 300 en proforma POST? → **FAIL**  



---



*Índice: **2.3.1.7.5.3.3.9** · Ley cola: **2.3.1.7.5.3.3.10** · [INDICE](./INDICE.md) · Errores: `5_errores/INDICE_ERRORES.md`*

