# CHUSAR — Catálogo · percepción velocidad · 30 tarjetas + background

**Código:** **2.2.1.33** · **Característica UX pre-entrega**  
**App:** RIMEC Web `:3001` · **solo local** hasta cierre etapa u orden deploy Director  
**Ratificado:** Director · 2026-07-28  
**Shibboleth:** Andrés, el que viene.  
**Cruza:** **2.2.1.0.2** dual cache · **2.2.1.15** overlay sync · **2.2.1.31** home Calzado+Todos

---

## Objetivo

Que la navegación **se sienta veloz** (perceived performance) sin tocar BD ni lógica comercial:

| Promesa | Técnica |
|---------|---------|
| Grilla siempre **30 slots** | Skeleton `CatalogoGrillaSkeleton` (no spinner vacío) |
| Calzado ↔ Confecciones ↔ CP/PE instantáneo | Warm cache paralelo + stale-while-revalidate |
| Overlay sync no bloquea | Cierra con ≥30 tarjetas; warm sigue en background |
| Scroll fluido | Prefetch página 2 **inmediato** (`prefetchScrollPageSoon`) |

**No usa Web Workers ni hilos OS** — paralelismo = `Promise.all` + caché cliente + UI optimista.

---

## Riesgo (Director pre-entrega)

| Área | Riesgo | Notas |
|------|--------|-------|
| Productos / stock / precios | **NINGUNO** | Solo lectura vía API existente |
| Carrito / FI / confirmar | **NINGUNO** | Sin cambios en esos módulos |
| Pérdida de datos | **NINGUNO** | Caché en memoria del navegador (TTL 15 min) |
| UX edge | **BAJO** | Al cambiar pill puede verse grilla anterior 1–2 s + badge «Actualizando…» |

**Rollback:** revertir commits en `rimec-web` de los archivos listados abajo — cero migración BD.

---

## Archivos tocados (2026-07-28)

| Archivo | Cambio |
|---------|--------|
| `rimec-web/app/CatalogoClient.tsx` | SWR · overlay gate ≥30 · `refreshing` · skeleton · prefetch soon · `ensureDualCatalogWarm` en `updateFilters` |
| `rimec-web/components/catalog/CatalogoGrillaSkeleton.tsx` | **Nuevo** · 30 placeholders animados |
| `rimec-web/lib/catalogoPeWarmCache.ts` | `prefetchScrollPageSoon()` — microtarea, no idle |
| `rimec-web/lib/catalogoSyncStages.ts` | Etapa ya caliente → sin espera artificial 7,5 s; tail brand 1,5–4 s si todo warm |

**Sin cambios:** `/api/catalogo/tarjetas`, carrito, Supabase, pilares.

---

## Comportamiento detallado

### 1 · Grilla 30 + skeleton

- Constante canónica: `CARD_PAGE_LIMIT = MIN_WARM_CARDS = 30` (`catalogoPeWarmCache.ts`).
- Primera carga sin caché: `CatalogoGrillaSkeleton` × 30 (misma anchura tarjeta `CATALOG_CARD_WIDTH_CLASS`).

### 2 · Stale-while-revalidate (SWR)

```
Usuario cambia pill (Calzado / Confecciones / CP / PE)
  ├─ ¿Cache ≥30 para nueva clave? → pinta YA + refresh background
  ├─ ¿Cache parcial? → mantiene grilla anterior + badge «Actualizando…»
  └─ Miss total → skeleton 30 hasta primera respuesta
```

Guard `tarjetasRespetanOrigen()` se mantiene — no mezcla CP/PE en grilla.

### 3 · Warm paralelo (background)

`ensureDualCatalogWarm()` precarga sin bloquear UI:

- Todos fusionado  
- PE calzado  
- CP calzado (default)  
- PE confecciones + CP confecciones  

Hook global: `CatalogWarmProvider.tsx` + llamada en `updateFilters`.

### 4 · Overlay «RIMEC sincronizando»

- **Antes:** overlay esperaba `syncRunning=false` (~30 s mínimo en prod).  
- **Ahora:** cierra cuando `productos.length ≥ 30 && !loading`.  
- Sync stages siguen en background (`runCatalogSyncStages` `.finally`).

Etapas ya calientes: `waitStageMin` retorna de inmediato.

### 5 · Prefetch scroll

- `prefetchScrollPageSoon` — dispara página 2+ en `queueMicrotask` tras pintar página 1.  
- `loadMore` consume `getScrollWarmCache` primero → scroll sin spinner si ya calentó.

---

## Smoke local (pre-entrega)

1. `:3001` · F5 catálogo → skeleton o overlay breve → **≥30 tarjetas**.  
2. Pill **Confecciones** ↔ **Calzado** → cambio ≤2 s si warm corrió (ideal instantáneo).  
3. **Compra previa** ↔ **Pronta entrega** → mismas reglas.  
4. Scroll hasta «cargar más» → segunda página sin pausa larga.  
5. Tap talla confección 638 → carrito (track aparte carrito optimista).  
6. Consola: sin error rojo persistente; timeouts Supabase = tema BD (ver § fin de semana).

---

## Troubleshooting rápido

| Síntoma | Causa probable | Acción |
|---------|----------------|--------|
| Spinner/skeleton >15 s | Timeout `/api/catalogo/tarjetas` | BD lenta · no es bug SWR · ver § fin de semana |
| Grilla vieja al cambiar pill | SWR normal · cache miss | Esperar badge «Actualizando…» · segundo click debería ser instantáneo |
| Overlay no cierra | <30 tarjetas en respuesta | Revisar filtros estrechos · `hasSidebarFilters` |
| Origen inconsistente | Cache corrupto rare | Hard refresh F5 · limpiar sessionStorage filtros |
| Prod distinto a local | **Prod sellada `f408fc2`** | Deploy solo cierre etapa u orden directa Director |

### Revertir solo UX (sin tocar resto)

```text
git checkout HEAD -- rimec-web/app/CatalogoClient.tsx
git checkout HEAD -- rimec-web/components/catalog/CatalogoGrillaSkeleton.tsx
git checkout HEAD -- rimec-web/lib/catalogoPeWarmCache.ts
git checkout HEAD -- rimec-web/lib/catalogoSyncStages.ts
```

---

## Pendiente fin de semana (BD — sí requiere ventana)

**Índices / materialized views Supabase** para `/api/catalogo/tarjetas`:

- Objetivo: bajar `statement timeout` (17–28 s observados en logs).  
- Riesgo: **MEDIO** — migración prod · planificar smoke + rollback SQL.  
- **No mezclar** con este pack UX — son capas distintas (cliente vs BD).

Doc relacionada latencia: **2.2.1.0.12** · **2.2.1.0.7** · MIG-152 RPC meta.

---

## Deploy

| Estado | Commit / URL |
|--------|----------------|
| **Local** | Implementado · build OK 2026-07-28 |
| **Prod** | Sellada `f408fc2` — **no push** hasta cierre etapa u orden Héctor |

---

## Referencias

- [CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md](./CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md) — base warm ≥30  
- [CHUSAR_OVERLAY_SINCRONIZANDO_CATALOGO_20260717.md](./CHUSAR_OVERLAY_SINCRONIZANDO_CATALOGO_20260717.md) — overlay 30 s brand  
- [CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md](../../1_fundamentos/1.1_protocolos/CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md)
