# ETAPA 2 — Velocidad F1 (auditoría calidad)

**Estado:** PARCIAL — V1/V2/V4/V7/V8 implementados (2026-06-14)  
**Pendiente:** V3 ISR · V5 poll · V6 índice SQL  
**Auditor:** Cursor  
**Evidencia medida:** `docs/evidencia/ETAPA_2_VELOCIDAD_AUDIT_20260614.json`  
**Script:** `scripts/auditoria_etapa2_velocidad.ts`

**Prerequisito Etapa 1:** parcial — ACTVITTA PASS; VIZZANO cierre en curso. Auditoría Etapa 2 no bloqueada por mediciones de código.

---

## Objetivo

Medir y documentar cuellos de botella en `/cadena/vista` (API · red · parse · poll) sin tocar tickets ni hero UX (eso es Etapa 3).

**Criterio PASS Etapa 2:**
- Payload cadena ≤2 MB marca grande (VIZZANO) tras slim
- TTFB SQL medido y plan índice documentado
- `fetchPriority=high` solo en hero activo
- `posicion` servidor consumida (elimina 1 RTT lógico)
- Poll live ≥45s o cache privada

**Veredicto actual:** **FAIL** en los 8 hallazgos.

---

## Medición local (2026-06-14)

| Marca | Filas SQL | Pares | Payload actual | Payload slim (sin `filas`) | Reducción | SQL ms |
|-------|-----------|-------|----------------|----------------------------|-----------|--------|
| ACTVITTA | 378 | 63 | **956 KB** | 345 KB | **63.9%** | 1588 |
| VIZZANO | 2304 | 348 | **5.8 MB** | 2.3 MB | **60.8%** | 449 |

`pares` + `paresAll` duplicados en respuesta API → **×2 adicional** en wire si ambos idénticos.

**Impacto piso:** `JSON.parse` de 5.8 MB en tablet bloquea main thread; primer paint espera bundle + fetch + parse.

---

## Implementado (OT-PERF-001)

| Fix | Archivos | Resultado |
|-----|----------|-----------|
| V1 slim payload | `lib/server/cadena-payload.ts`, rutas cadena/ingresar | VIZZANO **6.1→1.2 MB** (−80%) |
| V8+V2 seed | `lib/cadena-seed.ts`, `cadena/page.tsx`, `vista/page.tsx` | Sin 2º fetch <30s post-ingreso |
| V4 priority | carruseles + `ProductImage` | `high` solo hero |
| V7 prefetch | `prefetch-images.ts`, `vista/page.tsx` | Cap 200 FIFO · ±2 L+R |

**Re-medición:** `ETAPA_2_VELOCIDAD_AUDIT_20260614.json` · veredicto PARCIAL

---

## Hallazgos V1–V8

### V1 · Payload API inflado — **FAIL CRÍTICO**

**Archivos:** `lib/cadena.ts` L108–123 · `cadena/route.ts` L61–67

Cada molécula aparece en `gruposMaterial[].filas[]` **y** en `colores[]` / `coloresLR[]`. Tres URLs por fila (`thumb`, `hero`, `flat`).

**Medido:** 378 filas redundantes ACTVITTA; 2304 VIZZANO.  
**Fix:** Omitir `filas` en JSON API; solo `colores` deduplicados. Meta **−60% bytes** (confirmado).

---

### V2 · Waterfall 100% cliente — **FAIL**

**Archivo:** `app/cadena/vista/page.tsx` L1, L157–172

`"use client"` + `fetch` post-hydration. Secuencia: bundle → spinner → API → parse → hero.

**Fix:** Seed sessionStorage desde `ingresar` o RSC server-fetch. **−1 RTT** primer paint.

---

### V3 · ISR `revalidate=30` inerte — **FAIL**

**Archivo:** `cadena/route.ts` L16–17, L30

`cookiePosIngreso(req)` fuerza ruta **dynamic**; cliente `fetch` sin `next: { revalidate }`. Header `Cache-Control` no ayuda si cada request lee cookie.

**Fix:** Cache por `cliente_id+marca+filtros` sin cookie en clave SQL; validar `next build` ≠ `ƒ Dynamic`.

---

### V4 · Contención `fetchPriority="high"` — **FAIL**

| Fuente | `priority` / `high` |
|--------|---------------------|
| HeroProductImage | 1 |
| CarruselNaipesLR horizontal (before=2, after=4) | 7 |
| CarruselNaipesLR vertical (before=1, after=3) | 5 |
| CarruselMateriales (before=1, after=3) | 5 |
| MazoMaterialNaipes (peek + activo) | 2 |
| **Total aprox** | **~15** |

Hero `lg` (~96 KB) compite con thumbs `sm`.

**Fix:** `high` solo hero activo; thumbs `lazy` + `fetchPriority="low"`.

---

### V5 · Poll live 20s + JWT en toda `/api` — **FAIL**

**Archivos:** `StockOtrosLocales.tsx` L13, L169–171 · `live/route.ts` · `middleware.ts` L62–65

Cada 20s: JWT verify + hasta 6 queries multi-depósito por molécula activa.

**Fix:** Excluir `/api/deposito/*/live` del matcher JWT (cookie ya validada en layout); poll 45–60s; `Cache-Control: private, max-age=10`.

---

### V6 · SQL cadena — scan marca completa — **FAIL**

**Archivo:** `lib/server/catalogo-sql.ts` L161–167

6 LEFT JOIN, sin `LIMIT`, `ORDER BY` amplio. VIZZANO 2304 filas por request.

**Medido:** ACTVITTA 1588 ms (378 filas); VIZZANO 449 ms (2304 filas — pool warm).

**Fix:** Índice `(marca_id, cantidad) WHERE cantidad > 0`; proyección mínima; `EXPLAIN ANALYZE` en OT.

---

### V7 · Prefetch sin límite — **FAIL**

**Archivos:** `vista/page.tsx` L235–253 · `prefetch-images.ts` L4

`Set` global `prefetched` sin poda FIFO. Por swap: hero + thumb activo + 7 L+R + todos grupos material ×2 colores.

**Fix:** Hero + ±2 L+R; cap 200 URLs FIFO.

---

### V8 · `ingresar` duplica trabajo — **FAIL**

**Archivos:** `ingresar/route.ts` L68–97 · `vista/page.tsx` L164

`ingresar` ejecuta `sqlFilasStock` + `buildCadenaServer` pero **no devuelve** `paresAll`; solo `vistaUrl` + `posicion`. Vista repite SQL+build en <30s.

**Fix:** Incluir `paresAll` slim en respuesta ingresar + sessionStorage TTL 30s.

---

## Lo que NO tocar (confirmado OK)

| Componente | Estado |
|------------|--------|
| Separación cadena (30s) vs live (no-store) | OK |
| `stockBloquesEqual` | OK |
| `enrichDepositoFilaImagenes` servidor | OK |
| `content-visibility` carrusel materiales | OK |
| Pool `globalThis.__tabletPgPool` | OK |
| Cadena UI + backend titanio | CERRADO |

---

## OT sugerida

| ID | Ejecutor | Scope |
|----|----------|-------|
| OT-TABLET-CADENA-PERF-001 | Cursor | V1 slim payload + V4 priority + V7 prefetch cap |
| OT-TABLET-CADENA-PERF-002 | Claude Code | V3 cache + V6 índice SQL + V5 live matcher |
| OT-TABLET-CADENA-PERF-003 | Cursor | V2/V8 seed ingresar + consumir `posicion` |

**Orden pit stop:** V1 → V4 → V8 → V2 → V5 → V6 → V7 → V3

---

## Semáforo cierre Etapa 2

| Hallazgo | Estado |
|----------|--------|
| V1 Payload | 🔴 FAIL |
| V2 Waterfall cliente | 🔴 FAIL |
| V3 ISR | 🔴 FAIL |
| V4 fetchPriority | 🔴 FAIL |
| V5 Poll live | 🔴 FAIL |
| V6 SQL scan | 🔴 FAIL |
| V7 Prefetch | 🔴 FAIL |
| V8 Ingresar duplicado | 🔴 FAIL |

**Auditoría Etapa 2:** **FAIL** — listo para OT implementación.  
**Etapa 3** (precisión hero/parpadeo) abre tras fixes V1+V4+V8 o en paralelo controlado.

---

**Registrado por Cursor — 2026-06-14**
