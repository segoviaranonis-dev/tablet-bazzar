# CHUSAR — Home Calzado+Todos · Overlay 30s · Orden L+R+M+C

**Código:** **2.2.1.31** · cruza **2.2.1.15** · **2.2.1.28** · **2.2.1.24** · **2.2.1.0.4**  
**Fecha:** 2026-07-27  
**Keyword:** Documenta · Documentación Chusar · **despliega**  
**Shibboleth:** Andrés, el que viene.  
**Estado:** 🟢 **PROD** · commit `0fdc7a5` · https://rimec-web.vercel.app

---

## 1 · Qué ordenó el Director

| Tema | Ley operativa |
|------|----------------|
| **Entrada catálogo** | Siempre **Calzado** + **Todos** (CP+PE fusionados) — **no** Confecciones ni ramo vacío |
| **Ley TODOS** | Fusión CP+PE en una grilla **desde** ese home (Calzado+Todos) |
| **Overlay sync** | Mínimo **~30 s** · % avanza con el reloj · **fotos reales** en preview/marquee (usuario no se aburre) |
| **Warm** | ≥30 primeras tarjetas por etapa (CP calzado · PE calzado · Confecciones · Todos) → cambio de pill ~**3 s** |
| **Orden grilla** | Ascendente **Línea → Referencia → Material → Color** |
| **CATEGORÍA** | Sin chip «Carteras y accesorios» — carteras vía **TIPO / tipo_v2** (error `4.01.04.003`) |

---

## 2 · Enmienda a Ley TODOS (2.2.1.28) — solo entrada Web

| Antes (2.2.1.28) | Ahora (Web home · 2.2.1.31) |
|------------------|----------------------------|
| `origen=TODOS` · `ramo=""` (universo mixto) | `origen=TODOS` · `ramo=CALZADO` |
| Toggle Categoría podía vaciar ramo → confecciones en grilla | **Prohibido** vaciar ramo: off Confecciones → Calzado; Calzado no se apaga |

**Conserva:** fusión SKU CP+PE · paginación `exclude` · exclusión carteras solo con Calzado + sin chip Carteras · PE operativo calzado.

Doc padre: [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md).

---

## 3 · Overlay (restaura 2.2.1.15)

| Constante / pieza | Valor |
|-------------------|--------|
| `CATALOG_SYNC_MIN_TOTAL_MS` | **30_000** |
| `%` | Solo por tiempo (no saltar a 100% por etapas warm) |
| Cupo por etapa | ~7,5 s (sin atajo 350 ms) |
| Preview / marquee | Tarjetas reales + `ProductImage` (stem si falta URL) |
| Gate documento | Solo F5 / entrada fría · `catalogoSyncGate.ts` (no al volver del carrito) |
| Local | `NEXT_PUBLIC_CATALOG_SYNC_OVERLAY=1` |

Detalle: [CHUSAR_OVERLAY_SINCRONIZANDO_CATALOGO_20260717.md](./CHUSAR_OVERLAY_SINCRONIZANDO_CATALOGO_20260717.md).

---

## 4 · Archivos canónicos

| Pieza | Ruta |
|-------|------|
| Home SSR | `rimec-web/app/page.tsx` |
| Sidebar / cabecera categoría | `CatalogoFiltrosSidebar.tsx` · `FiltrosCatalogo.tsx` |
| Sync etapas | `lib/catalogoSyncStages.ts` · `catalogoSyncPreview.ts` · `RimecSincronizandoOverlay.tsx` |
| Orden L+R+M+C | `lib/catalogoPaginado.ts` · `compareLineaRefMatColor` |
| Warm ≥30 | `lib/catalogoPeWarmCache.ts` |
| Filtro ~3 s | `FiltroAplicandoOverlay.tsx` · `TOTAL_MS=3000` |

---

## 5 · Deploy

| Campo | Valor |
|-------|--------|
| Repo | `segoviaranonis-dev/rimec-web` · `main` |
| Commit | `0fdc7a5` |
| URL | https://rimec-web.vercel.app |
| Smoke | Incógnito · overlay ~30 s con fotos · grilla Calzado+Todos · orden L-R-M-C · Confecciones solo al elegir categoría |

---

**Última actualización:** 2026-07-27 · Documenta + Documentación Chusar · despliega Director
