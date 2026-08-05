# CHUSAR — Hotfix catálogo TODOS + Calzado · timeout prod

**Código:** **2.2.1.39**  
**Fecha:** 2026-08-01  
**Etapa:** [ETAPA_HOTFIX_CATALOGO_TODOS_CALZADO_20260801.md](../../4_etapas/ETAPA_HOTFIX_CATALOGO_TODOS_CALZADO_20260801.md)  
**Keyword origen:** **bug urgente**  
**App:** RIMEC Web `:3001` · prod https://rimec.com.py

---

## Problema

Landing por defecto vendedores: **STOCK Todos + Calzado**. Prod mostraba banner «Catálogo lento — reintentando», estilos «Sin opciones», grilla vacía. Supabase `57014` statement timeout.

---

## Solución (código)

### 1. Grilla — `lib/catalogoPaginado.ts`

Ruta **`fetchStockBatchCalzadoTodos`** (paridad confecciones):

- Filtros explícitos: `cpCalzadoFilters` (TRÁNSITO_PP · ramo CALZADO · 654) y `peCalzadoFilters` (PRONTA_ENTREGA · CALZADO).
- CP y PE **secuenciales** (menos contención BD que `Promise.all`).
- `.catch(() => [])` por vista — una fuente puede fallar sin tumbar la otra.
- `rowBatchSize` TODOS+CALZADO = **50** (antes 120).

### 2. Sidebar meta — `lib/catalogoMetaRpc.ts`

**`fetchMetaRpcEfficient`:** en landing sin cascada Color/Tono/Línea → **1 RPC/origen** (`fetchMetaRpcOnce` + universo facetas). Evita duplicar 4 RPC en TODOS.

### 3. API filtros — `app/api/catalogo/filtros/route.ts`

- Condición RPC: acepta respuesta si hay **estilos o géneros** (no solo marcas/líneas/tipos).
- Catch degradado: fallback **maestras pilares** (`loadMaestrasTrianguloCatalogo`) antes de vaciar sidebar.

### 4. API tarjetas — `app/api/catalogo/tarjetas/route.ts`

- `useQuick` forzado para `isCatalogoOrigenTodos && ramo_tipo === CALZADO`.
- Timeout → HTTP **200** con `degraded: true` y grilla vacía (no 500).

---

## Mensaje UI

`CatalogoClient.tsx` → `mensajeErrorCatalogo()` mapea timeout a:

> Catálogo lento — reintentando. Esperá unos segundos.

Regex: `statement timeout|57014|canceling statement|schema cache|transaction is aborted`.

---

## Smoke local (JWT admin · 2026-08-01)

```
GET /api/catalogo/filtros?origen_tipo=TODOS&ramo_tipo=CALZADO
→ 200 · ~1,4s · rpc · 9 marcas · 14 estilos

GET /api/catalogo/tarjetas?origen_tipo=TODOS&ramo_tipo=CALZADO&limit=30&quick=1
→ 200 · ~11s · 30 tarjetas
```

Scripts útiles: `scripts/_timing_filtros.mjs` · `scripts/smoke_catalogo_local.mjs`

---

## Deploy

**Prod sin fix hasta deploy.** Regla: [CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md](../../1_fundamentos/1.1_protocolos/CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md) — solo cierre etapa u orden directa Director.

---

## Relacionados

- Latencia catálogo cerrada: [CHUSAR_CATALOGO_LATENCIA_CIERRE_20260716.md](./CHUSAR_CATALOGO_LATENCIA_CIERRE_20260716.md) (**2.2.1.0.12**)
- Pill Todos CP+PE: [CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md](./CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md) (**2.2.1.0.4**)
- Imagen hold / parpadeo: [CHUSAR_IMAGEN_HOLD_SIN_PARPADEO_20260729.md](./CHUSAR_IMAGEN_HOLD_SIN_PARPADEO_20260729.md) (**2.2.1.37**)
