# CHUSAR — Overlay «RIMEC sincronizando!!!!» · catálogo frío

**Código:** **2.2.1.15** · **Característica producto ★★**  
**App:** RIMEC Web `:3001` · prod `rimec-web.vercel.app`  
**Ratificado:** Director · 2026-07-17 · **restaurado 2026-07-27** (`0fdc7a5`)  
**Shibboleth:** Andrés, el que viene.  
**Cruce:** [CHUSAR_HOME_CALZADO_TODOS_OVERLAY_ORDEN_20260727.md](./CHUSAR_HOME_CALZADO_TODOS_OVERLAY_ORDEN_20260727.md) (**2.2.1.31**)

---

## Por qué existe

El arranque en frío del catálogo puede tardar **>30 s** (warm CP + PE + filtros + Todos). El vendedor no debe ver pantalla vacía ni spinner mudo — la animación con **fotos** evita el aburrimiento.

| Promesa UX | Comportamiento |
|------------|----------------|
| Pantalla completa | Overlay `fixed` + portal `document.body` · bloquea scroll |
| Mínimo **30 s** | 4 etapas × ~7,5 s aunque cache responda antes |
| `%` | Solo por **reloj** — no salta a 100% porque el warm terminó antes |
| Etapas visibles | CP → PE calzado → Confecciones → Todos |
| Tarjetas reales | Hasta **9** por etapa · preview + marquee con imagen/stem |
| Omitir si caliente | `areAllSyncStagesWarm()` → sin overlay |
| Solo F5 / documento | `catalogoSyncGate.ts` — no al volver del carrito |

Relacionado: [CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md](./CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md) (**2.2.1.0.11**).

---

## Arquitectura

```
CatalogoClient mount (sin filtros sidebar · cache fría · prod o FORCE=1)
  └─ runCatalogSyncStages(onProgress)
       ├─ Etapa CP  → prefetch + preview CP calzado
       ├─ Etapa PE  → prefetch + preview PE calzado
       ├─ Etapa Confecciones → PE 638 + warm CP confecciones
       └─ Etapa Todos → grilla fusionada + filtros meta
  └─ RimecSincronizandoOverlay (portal)
       ├─ SyncBackgroundMarquee
       └─ SyncStagePreview
  └─ Tras 30 s → overlay off · ensureDualCatalogWarm · home Calzado+Todos
```

---

## Implementación

| Pieza | Ruta |
|-------|------|
| Orquestación etapas | `rimec-web/lib/catalogoSyncStages.ts` |
| Gate documento | `rimec-web/lib/catalogoSyncGate.ts` |
| Priorizar imagen / merge marquee | `rimec-web/lib/catalogoSyncPreview.ts` |
| Overlay UI | `rimec-web/components/catalog/RimecSincronizandoOverlay.tsx` |
| Grilla central | `rimec-web/components/catalog/SyncStagePreview.tsx` |
| Marquee fondo | `rimec-web/components/catalog/SyncBackgroundMarquee.tsx` |
| Hook catálogo | `rimec-web/app/CatalogoClient.tsx` |
| Estilos | `rimec-web/app/globals.css` · `.rimec-sync-*` |

### Constantes

| Constante | Valor |
|-----------|-------|
| `CATALOG_SYNC_MIN_TOTAL_MS` | **30_000** (no 12_000) |
| `CATALOG_SYNC_GRID_SLOTS` | 9 |
| Etapas | `cp` · `pe` · `confecciones` · `todos` |
| Local | `NEXT_PUBLIC_CATALOG_SYNC_OVERLAY=1` |

### Filtros warm por etapa

| Etapa | Filtros |
|-------|---------|
| CP | `origen_tipo: CP` · `ramo_tipo: CALZADO` |
| PE | PE calzado |
| Confecciones | `PE_CONFECCIONES_FILTERS` + warm CP confecciones |
| Todos | `effectiveTodosWarmFilters()` · `withFiltros: true` |

---

## Deploy

| Campo | Valor |
|-------|--------|
| Repo | `segoviaranonis-dev/rimec-web` · rama `main` |
| Commits | `fc8edea` · `710805b` · **`0fdc7a5`** (2026-07-27) |
| Vercel | Auto-deploy `main` → https://rimec-web.vercel.app |
| Smoke | Hard refresh frío · ~30 s · fotos · % no salta a 100% |

---

## Verificación Director

1. Incógnito · entrar catálogo sin cache.
2. Overlay · **RIMEC sincronizando!!!!**
3. CP / PE / Confecciones con fotos · % avanza ~30 s.
4. Cierra → grilla **Calzado + Todos** orden L+R+M+C.

---

**Última actualización:** 2026-07-27 · Documenta + despliega · `0fdc7a5`
