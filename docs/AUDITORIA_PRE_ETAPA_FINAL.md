# Auditoría pre-etapa final — Tablet Bazzar + Holding

**Fecha:** 2026-06-14  
**Auditor:** Cursor (Composer)  
**Prioridad:** Velocidad + Precisión — ingeniería F1  
**Alcance:** `tablet-bazzar/` (flujo crítico `/cadena/vista`) + holding imágenes/ops + criterios cierre etapa  
**Veredicto:** **NO LISTO para etapa final (tickets ORO / deploy 60 tablets)**

---

## Resumen ejecutivo (3 líneas)

1. **Bloqueo P0:** gap masivo Storage `sm/md/lg` + scripts ops documentados pero **ausentes en disco** → precisión visual y velocidad de red degradadas en ~46%+ SKUs (VIZZANO).
2. **Bloqueo P1 velocidad:** `/cadena/vista` es 100% cliente, payload JSON duplicado, ISR 30s probablemente inerte, contención de red en hero vs 15 `fetchPriority=high`.
3. **Bloqueo P1 precisión:** hero sin cadena fallback 404, sin preload/decode unificado, parpadeo thumbs — criterio «50 swaps sin flash» sigue **FAIL**.

**Caso fundador `4215.1034`:** RESUELTO (Storage contain + CSS v13). No generaliza al holding.

---

## Semáforo de cierre

| Área | Estado | Gate etapa final |
|------|--------|------------------|
| Storage tiers contain (≥95% SKUs) | 🔴 FAIL | Sí |
| Hero UX 50 swaps sin flash | 🔴 FAIL | Sí |
| Scripts ops gap/upload | 🔴 FAIL | Sí |
| API cadena TTFB + payload | 🟡 RIESGO | Sí |
| Auth / middleware | 🟢 OK | No |
| Cadena UI / gestos / backend titanio | 🟢 CERRADO | No |
| Tickets ORO / carrito | ⚪ NO INICIADO | Etapa final |

---

## P0 — Bloqueantes (pit lane obligatoria)

### P0-1 · Scripts ops faltantes en repo

**Evidencia:** `control_central/tools/` contiene solo `convertir_miniaturas_retail.py`.  
Documentación marca como hechos: `protocolo_imagenes_cerrar_gap.py`, `subir_miniaturas_supabase.py`.

| Script | Estado workspace | Impacto |
|--------|------------------|---------|
| `protocolo_imagenes_cerrar_gap.py` | ❌ ausente | No hay cierre masivo VIZZANO/resto marcas |
| `subir_miniaturas_supabase.py` | ❌ ausente | Regeneración local no escala a Storage |
| `regenerar_storage_4215_1034.py` | ✅ unitario | Solo 1 SKU |

**Fix F1:** OT Claude Code — restaurar scripts desde historial git o reimplementar desde `PUNTO_CRITICO_RECORTE_CALZADO.md` + evidencia upload caso 4215.

---

### P0-2 · Gap Storage (precisión + velocidad)

Patrón documentado:

```text
sm/L-R-M-C.jpg  → 404
L-R-M-C.jpg       → 200 (flat legacy, a menudo crop)
```

| Marca | Estado doc |
|-------|--------------|
| ACTVITTA | Parcial PASS; masivo pendiente |
| VIZZANO | ~160/348 previews FAIL HEAD `sm/` |
| Holding | ≥95% SKUs sin auditoría márgenes contain |

**Impacto velocidad:** 2 HTTP por thumb (sm falla → flat).  
**Impacto precisión:** crop legacy en tiers no regenerados.

**Fix F1:** `--cerrar` por marca + auditoría márgenes (no solo HEAD 200). Ver `PUNTO_CRITICO_RECORTE_CALZADO.md`.

---

### P0-3 · `convertir_miniaturas_retail.py` — salida `thumb_*` vs `sm/md/lg`

```python
# L413 — incorrecto para protocolo
tamanios_dict = {f"thumb_{t}": t for t in tamanios_lista}
```

Protocolo exige carpetas `sm/`, `md/`, `lg/`. Dict `TAMANIOS` con nombres canónicos existe pero **no se usa en main()**.

**Fix F1:** Una línea — usar `TAMANIOS` directamente. Sin esto, lote local no alimenta upload.

---

### P0-4 · Criterios cierre diseño — FAIL mayoría

Fuente: `tablet-bazzar/docs/ETAPA_DISENO_REGISTRO.md`

| Criterio | Estado |
|----------|--------|
| Hero 4215.1034 | ✅ PASS |
| ≥95% SKUs contain | ❌ |
| 50 swaps sin flash | ❌ |
| CLS hero < 0.05 | ❌ sin medir |
| ≥95% HEAD `sm/` VIZZANO | ❌ |
| Director diseño aprobado | ❌ |
| Track B Antigravity | ❌ |

**Gate:** `ACTUAL.md` — no tickets/deploy hasta PASS diseño.

---

## P1 — Velocidad (F1 pit stops)

Orden por ganancia ms medible en piso.

### V1 · Payload API cadena inflado — **CRÍTICO velocidad**

**Archivos:** `lib/cadena.ts` L108–123 · `cadena/route.ts` L52–67

Cada SKU duplicado en `colores[]` + `gruposMaterial[].filas[]`. Respuesta incluye `pares` y `paresAll`. Con 300–800 SKUs + 3 URLs imagen → JSON MB-class → `JSON.parse` bloquea main thread tablet.

**Fix F1:** Omitir `filas` en JSON API; enviar solo `colores` deduplicados. Meta: **−50–70% bytes**.

---

### V2 · Waterfall 100% cliente en vista

**Archivo:** `app/cadena/vista/page.tsx` — `"use client"` + fetch L157–172

Secuencia: JS bundle → spinner → `/api/.../cadena` → parse → hero.

**Fix F1:** Seed desde `ingresar` (sessionStorage TTL 30s) o RSC wrapper server-fetch. **−1 RTT** al primer paint.

---

### V3 · `revalidate=30` probablemente inerte

**Archivo:** `cadena/route.ts` L16–17, L30

Lee cookies (`cookiePosIngreso`) → ruta dynamic; ISR no aplica. Cliente `fetch` sin `next: { revalidate }`.

**Fix F1:** Cache por `cliente_id+marca+filtros` sin cookie en clave; validar en `next build` que no salga `ƒ Dynamic`.

---

### V4 · Contención `fetchPriority="high"`

**Archivos:** `HeroProductImage`, `CarruselNaipesLR`, `CarruselMateriales`, `MazoMaterialNaipes`

Hasta ~15 imágenes compiten con hero `lg` (~96 KB).

**Fix F1:** `priority` / `high` **solo hero activo**. Thumbs: `lazy` + `low`. Ganancia estimada hero: **200–500 ms**.

---

### V5 · Poll live cada 20s — 6 queries + JWT

**Archivos:** `StockOtrosLocales.tsx` L113–171 · `live/route.ts` · `middleware.ts`

**Fix F1:** Excluir `/api/deposito/*/live` del matcher JWT; poll 45–60s; cache privada 10s.

---

### V6 · SQL cadena — scan completo marca

**Archivo:** `lib/server/catalogo-sql.ts` L45–87

6 LEFT JOIN + ORDER BY sin LIMIT. Cuello TTFB.

**Fix F1:** Índice `(marca_id, cantidad) WHERE cantidad > 0`; proyección mínima columnas; `EXPLAIN ANALYZE` antes prod.

---

### V7 · Prefetch sin límite

**Archivos:** `vista/page.tsx` L235–253 · `prefetch-images.ts`

`Set` global sin poda; prefetch todos grupos del par.

**Fix F1:** Hero + ±2 L+R; cap 200 URLs FIFO.

---

### V8 · `ingresar` duplica trabajo de vista

**Archivos:** `ingresar/route.ts` · `vista/page.tsx`

Mismo SQL+cadena dos veces en <30s.

**Fix F1:** Pasar payload en respuesta ingresar.

---

## P1 — Precisión (F1 pit stops)

### R1 · Hero sin fallback 404 — **CRÍTICO precisión**

**Archivo:** `HeroProductImage.tsx` L22–26, L45–60

Una sola URL; sin `onError`; sin `pickHeroLoadSequence` + preload.

`ProductImage.tsx` L53–87 tiene `useHeroDisplaySrc` — **no usado en hero live**.

**Fix F1:** Unificar hero en `ProductImage variant="hero"` o portar cadena fallback. Cero imágenes rotas.

---

### R2 · Orden fallback inconsistente

| Componente | Orden |
|------------|-------|
| `HeroProductImage` | hero → thumb → flat |
| `product-image.ts` | hero → flat → thumb |

**Fix F1:** Una función `pickHeroLoadSequence` en todo el stack.

---

### R3 · Thumbs `opacity-0` hasta load

**Archivo:** `ProductImage.tsx` L272–299

Flash blanco/gradiente en sidebar al cambiar molécula.

**Fix F1:** Sin fade en tiles `priority` cadena; decode antes de swap.

---

### R4 · `decoding="sync"` en hero

**Archivo:** `HeroProductImage.tsx` L57

Bloquea main thread en JPEG 800×800.

**Fix F1:** `decoding="async"` — 1 atributo.

---

### R5 · `posicion` servidor ignorada

**Archivos:** `cadena/route.ts` L56–59 · `vista/page.tsx` L166–221

4 `useEffect` compiten con URL `pi/gi/c1/c2` → flash SKU incorrecto.

**Fix F1:** Aplicar `data.posicion` post-fetch una vez.

---

### R6 · 8 `useEffect` encadenados en boot

**Archivo:** `vista/page.tsx` L147–253

Múltiples paints antes estado estable.

**Fix F1:** `useReducer` boot único — objetivo 1 render post-datos.

---

## P2 — Holding / proceso

| # | Hallazgo | Acción |
|---|----------|--------|
| H1 | Helpers `product-image.ts` solo en tablet | Portar a report/rimec-web o OT |
| H2 | Carga garantizada Report no portada a tablet | Prioridad 6 ETAPA_TABLET_BAZZAR |
| H3 | `COLA.md` sin OT Storage/tablet diseño | Agregar OT cierre gap |
| H4 | Doc drift hero tier sm vs lg | Unificar protocolo + `IMAGENES_PRODUCTO.md` |
| H5 | 3 fuentes Google en layout | `display: swap`; reducir pesos |
| H6 | `scroll-behavior: smooth` global | Quitar de `globals.css` L26 |
| H7 | SKU debug hardcodeado en hero | Quitar antes cierre |

---

## Lo que NO tocar (ya F1)

| Componente | Por qué |
|------------|---------|
| Separación cadena (30s) vs live (no-store) | Arquitectura correcta |
| `stockBloquesEqual` | Evita re-renders poll |
| `enrichDepositoFilaImagenes` en servidor | URLs una vez |
| `content-visibility` carrusel materiales | Scroll perf OK |
| Pool singleton `globalThis.__tabletPgPool` | Serverless warm |
| Cadena UI + backend titanio | Etapas CERRADAS |
| Auth JWT + middleware rutas | Etapa 1 PASS |

---

## Plan de ejecución (orden pit stop)

Ver **plan 3 etapas:** `tablet-bazzar/docs/PLAN_TRES_ETAPAS_PRE_FINAL.md`

```
Etapa 1 OPS + Storage  ← ACTIVA (ETAPA_1_OPS_STORAGE.md)
         ↓
Etapa 2 Velocidad F1
         ↓
Etapa 3 Precisión + cierre
         ↓
ETAPA FINAL (tickets ORO · deploy 60)
```

**Estimación impacto Fase P1 código (sin OPS):** primer paint vista −30–40%; hero visible −200–500 ms; parse JSON −50–70%.

---

## OT sugerida para COLA

| ID propuesto | Ejecutor | Objetivo |
|--------------|----------|----------|
| OT-TABLET-STORAGE-GAP-001 | Claude Code | Restaurar scripts + cerrar gap marcas |
| OT-TABLET-CADENA-PERF-001 | Cursor | Payload + hero fallback + priority |
| OT-TABLET-DISENO-PASS-001 | Director+Cursor | QA 50 swaps + evidencia PASS |

Cola canónica: `.claude/6_ot/COLA.md`

---

## Referencias

| Doc | Ruta |
|-----|------|
| Registro diseño | `tablet-bazzar/docs/ETAPA_DISENO_REGISTRO.md` |
| Punto crítico imágenes | `.claude/2_modulos/2.1_control_central/docs/PUNTO_CRITICO_RECORTE_CALZADO.md` |
| Etapa madre | `.claude/4_etapas/ETAPA_TABLET_BAZZAR.md` |
| Evidencia 4215.1034 | `tablet-bazzar/docs/evidencia/HERO_CASO_4215_1034.json` |
| ACTUAL | `.claude/4_etapas/ACTUAL.md` |

---

**Auditoría:** Cursor · 2026-06-14  
**Próximo paso recomendado:** OT-TABLET-STORAGE-GAP-001 antes de cualquier código etapa final.
