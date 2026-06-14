# ETAPA 3 — Precisión + cierre diseño (UX piso)

**Estado:** PASS código (7/7) — QA piso pendiente Director  
**Fecha:** 2026-06-14  
**Auditor:** Cursor  
**Evidencia:** `docs/evidencia/ETAPA_3_PRECISION_AUDIT_20260614.json`  
**Script:** `scripts/auditoria_etapa3_precision.ts`

---

## Objetivo

Cero flash en 50 swaps, hero con cadena fallback 404, posición servidor respetada, CLS estable.

**Criterio cierre:** Director valida QA piso + checklist diseño en `ETAPA_DISENO_REGISTRO.md`.

---

## Implementado (2026-06-14)

| Fix | Archivos | Resultado |
|-----|----------|-----------|
| R1+R2 Hero fallback | `HeroProductImage.tsx` → `ProductImage` + `pickHeroLoadSequence` | lg → flat → sm unificado |
| R3 Thumbs sin fade | `ProductImage.tsx` | Sin `transition-opacity`; decode antes de mostrar |
| R4 decoding async | `ProductImage.tsx` hero | `decoding="async"` |
| R5 posicion servidor | `lib/cadena-boot.ts`, `vista/page.tsx` | `resolveCadenaBootState` — no reset post-seed |
| R6 boot consolidado | `vista/page.tsx` | 6 `useEffect` (antes 8) |

**Hero frame:** `data-hero-frame="v14-fallback"` (mantiene contain v13 layout)

---

## Hallazgos R1–R6

### R1 · Hero sin fallback — **PASS**

`HeroProductImage` delega a `ProductImage variant="hero"` con `loadSequence` desde `pickHeroLoadSequence`.

### R2 · Orden fallback — **PASS**

Canónico en `product-image.ts`: hero → flat → thumb.

### R3 · Thumbs opacity flash — **PASS**

Eliminado fade CSS; `opacity-100` solo tras `loaded`.

### R4 · decoding sync — **PASS**

Hero usa `decoding="async"`.

### R5 · posicion ignorada — **PASS**

`resolveCadenaBootState`: URL > servidor > búsqueda > filtro ref > 0. Sin reset en boot inicial.

### R6 · useEffect encadenados — **PASS (parcial)**

Boot unificado; filtros y color en efectos separados mínimos.

---

## QA piso — PENDIENTE Director

| Paso | Acción |
|------|--------|
| 1 | `REINICIAR_DEV.bat` |
| 2 | Ingresar ACTVITTA → vista |
| 3 | 50 swaps L+R + color/material |
| 4 | Sin flash blanco hero/thumbs |
| 5 | SKU `4215.1034` — punta/tacón visibles |

**Track B Antigravity:** solo si Director exige comparativa visual.

---

## Semáforo

| Criterio | Estado |
|----------|--------|
| R1–R6 código | 🟢 PASS |
| 50 swaps sin flash | 🟡 PENDIENTE Director |
| ≥95% Storage contain | 🟡 Etapa 1 en curso |
| Director diseño aprueba | 🔴 PENDIENTE |

---

**Registrado por Cursor — 2026-06-14**
