# CHUSAR — Stock PE · grilla lenta (>1 min) · perf + deploy

**Código:** **2.3.1.10.1.11**  
**Fecha:** 2026-08-16  
**Keyword:** **Documenta** · **despliega**  
**App:** Report `/stock-pronta-entrega`  
**Síntoma:** grilla operativa tarda **>60 s** en aparecer (prod).  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible · `5.01.00.025`

---

## 0 · Diagnóstico (bench local DATABASE_URL)

| Métrica | Valor |
|---------|-------|
| Filas PE base | **11.746** |
| SQL `listImportadoProductos` cold | **~12–15 s** (post-fix) |
| Causa principal | 2× `LATERAL` staging por fila + SSR resumen + Promise.all tono bloqueaba loading + sin cache |

---

## 1 · Mejoras (mandatorias)

| # | Cambio | Efecto |
|---|--------|--------|
| 1 | Staging **1 JOIN** `DISTINCT ON (ppd_id)` (antes 2 LATERAL) | Menos trabajo SQL por fila |
| 2 | Cache servidor **90 s** `queries-productos-cached.ts` (patrón AM) | 2ª carga API ~0 ms en misma instancia |
| 3 | sessionStorage SWR `nexus:pe-productos:v2` | Reabrir módulo <1 s percibido |
| 4 | Tono Admin **no bloquea** grilla | Loading termina con productos |
| 5 | Pintura **calzado primero** (`tipo_v2=1`) → merge confecciones | Primera grilla antes del full |
| 6 | SSR resumen **vacío** (no query pesada en TTFB) | HTML rápido |
| 7 | Import CSV invalida cache servidor + limpia session | Datos frescos post-import |

**Headers API:** `X-Pe-Productos-Ms` · `X-Pe-Productos-Cache` (`hit`/`miss`/`bypass`) · `?fresh=1` bypass.

---

## 2 · Archivos

- `report/src/lib/deposito-rimec/queries-productos-grilla.ts`
- `report/src/lib/stock-pronta-entrega/queries-productos-cached.ts`
- `report/src/app/api/stock-pronta-entrega/productos/route.ts`
- `report/src/lib/panel-control/prefetch-grilla-apis.ts`
- `report/src/components/stock-pronta-entrega/StockPeContext.tsx`
- `report/src/app/stock-pronta-entrega/page.tsx`
- `report/src/app/api/stock-pronta-entrega/import-csv/route.ts`

---

## 3 · Deploy / verificación

| Campo | Valor |
|-------|-------|
| Commit Report | `de3a2e8` |
| Prod | https://rimec-report.vercel.app/stock-pronta-entrega |
| Deploy id | `dpl_Fru5g9rEZNDCEmSEf3n9k6ziZgQG` · READY · alias prod |
| Smoke | PAGE HTTP **200** · API sin cookie **403** (auth OK) |

**Meta UX:** primera visita fría grilla calzado en **≤20 s**; reentrada / cache **≤2 s**.

---

## 4 · Relacionados

- **2.3.1.10.1** Stock PE · **2.3.5.3.2** TONO cable · AM cache `queries-cached.ts`

---

**Shibboleth:** Andrés, el que viene.
