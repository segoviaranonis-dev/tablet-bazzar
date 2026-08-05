# CHUSAR — Catálogo latencia T2–T7 + deploy RIMEC Web

**Código:** `2.2.1.0.6`  
**Fecha:** 2026-07-14  
**Etapa:** `CATALOGO-LATENCIA-20260713` · **2.2.1.0.5**  
**App:** `rimec-web/` · `:3001` · prod `https://rimec-web.vercel.app`  
**Orden Director:** **Documenta** + **despliegue** 2026-07-14  
**Shibboleth:** Andrés, el que viene.

---

## Resumen

Implementación app + BD **MIG-152** para eliminar scan ~12k PE en meta filtros y mover filtros críticos a SQL. Smoke local `:3001` **PASS** (filtros RPC 181 ms Todos+Calzado).

---

## BD — MIG-152 (aplicada Supabase)

| Artefacto | Detalle |
|-----------|---------|
| Archivo | `report/migrations/152_rimec_catalogo_meta_rpc_ramo.sql` |
| Runner | `report/scripts/run_migration_152.mjs` |
| Vista PE | `ramo_tipo` (654=CALZADO · 638=CONFECCIONES) + enrich MIG-151 |
| Vista CP | `ramo_tipo = 'CALZADO'` al final |
| RPC | `rimec_catalogo_meta(p_es_pe, p_marca_id, …)` → JSON pills |

**Verificación:**

```bash
node report/scripts/verify_cat_lat_smoke.mjs
node report/scripts/verify_cat_lat_t1.mjs
```

---

## App — archivos clave

| Archivo | Cambio |
|---------|--------|
| `lib/catalogoMetaRpc.ts` | Cliente RPC · merge Todos CP+PE · **service role** servidor |
| `app/api/catalogo/filtros/route.ts` | RPC + cache 5 min · fallback legacy |
| `lib/catalogoFilters.ts` | género/ramo/búsqueda SQL · memoria solo tono/Todos |
| `lib/catalogoPaginado.ts` | skip enrich si vista completa · batch Todos 120 |
| `lib/catalogoServerCache.ts` | warm TTL tarjetas p1 |
| `lib/filtros.ts` | header vía RPC (4 géneros + global) |
| `scripts/smoke_catalogo_local.mjs` | smoke autenticado `:3001` |

---

## Tareas etapa — estado

| # | Código | Estado | Notas |
|---|--------|:------:|-------|
| 1 | CAT-LAT-T1 | ✅ | MIG-151 enrich + grada PE |
| 2 | CAT-LAT-T2 | ✅ | RPC meta · sin 13 páginas PE |
| 3 | CAT-LAT-T3 | ✅ | SQL género/ramo/buscar |
| 4 | CAT-LAT-T4 | ✅ parcial | batch 120 Todos · vista unificada pendiente OT |
| 5 | CAT-LAT-T5 | ✅ | unstable_cache filtros + tarjetas warm |
| 6 | CAT-LAT-T6 | ✅ parcial | header RPC · ramo SQL PE |
| 7 | CAT-LAT-T7 | ✅ smoke BD+build+local | deploy prod este doc |

---

## Smoke local 2026-07-14

```
filtros TODOS+CALZADO  181ms  metaSource=rpc  marcas=9 lineas=826 tonos=18
filtros PE+CALZADO      17ms
filtros CP              17ms
header-filtros        1115ms
tarjetas TODOS           57ms
tarjetas PE              16ms
```

**Regla crítica:** `grada` solo en SELECT PE — CP sin columna `grada`.

---

## Deploy prod

- Repo app: `segoviaranonis-dev/rimec-web` · commit **`b59cbdf`**
- Repo BD: `segoviaranonis-dev/report` · MIG-152 commit **`168d4e3`**
- URL: https://rimec-web.vercel.app

**Post-deploy Director:** pills marca→línea→tono · PE grada · Todos fusión SKU · carrito +1 caja PE.

---

## Relacionados

- [DOC_AUDITORIA_LATENCIA_CATALOGO_20260713.md](./DOC_AUDITORIA_LATENCIA_CATALOGO_20260713.md)
- [ETAPA_CATALOGO_LATENCIA_20260713.md](../../4_etapas/ETAPA_CATALOGO_LATENCIA_20260713.md)
- [CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md](./CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md)
- [CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md](./CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md) — fix Confecciones **local post-deploy** (**2.2.1.0.6**)
- [CHUSAR_PENDIENTES_HANDOFF_CURSOR_20260714.md](./CHUSAR_PENDIENTES_HANDOFF_CURSOR_20260714.md) (**2.2.1.0.7**)
