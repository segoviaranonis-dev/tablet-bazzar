# Auditoría Caja Negra — Tablet Bazzar (Local)

**Fecha:** 2026-06-12  
**Entorno:** `http://localhost:3002` · dev server activo  
**Marca prueba:** VIZZANO · cliente 2100 · molécula 1184.1101  
**Script:** `scripts/audit-caja-negra.mjs`

---

## Resumen ejecutivo

| Área | Veredicto |
|------|-----------|
| 1. Ciclo de vida render (F1+S2) | **PASS** |
| 2. Gráfico de red (URLs canónicas) | **PASS** |
| 3. Aislamiento stock vs catálogo (F3) | **PASS** (nota ISR abajo) |

**16 PASS · 0 FAIL · 1 WARN** (automated API audit)

---

## 1. Render — ProductImage + decode (Fase 1 + S2)

**Código verificado** (`components/ProductImage.tsx`):
- Contenedor gradiente **siempre montado** (no swap 👟 ↔ img)
- Al cambiar `src`: `useEffect` → `loaded=false` → `opacity-0`
- `onLoad` → `await img.decode()` → **después** `setLoaded(true)` → fade-in 200ms

**Browser stress (1184.1101 · 30 clicks “Rotar colores” · 80ms intervalo):**
- 4 colores distintos en hero (`srcChanges: 4`)
- `opacity-0` durante transición en cada cambio (**esperado** — bloqueo hasta decode)
- `naturalWidth×Height`: **400×400** (md hero)
- Cero emoji 👟 en DOM

---

## 2. Network — ≤1 URL canónica por asset

**API `/api/deposito/2100/cadena?marca=VIZZANO`:**
- **3669/3669** filas con `imagen_url_thumb` + `imagen_url_hero`
- 100% thumbs → `/productos/sm/`
- 100% heroes → `/productos/md/`
- **0** URLs `/productos/lg/`
- **0** URLs planas sin prefijo sm/md

**Browser (sesión cadena cargada):**
- Recursos imagen: 12–46 según estrés (prefetch + carrusel + mazo)
- **0** requests a `/lg/`
- Hero: solo `/productos/md/…`
- Thumbs: solo `/productos/sm/…`

**Nota estrés:** en 30 cambios rápidos, Performance API puede registrar la misma URL sm/md más de una vez si el componente remonta thumbs del mazo/carrusel; no hay cadena `tryNext` ni ráfaga 404→200.

---

## 3. Stock vs catálogo (Fase 3)

| Segmento | Comportamiento auditado |
|----------|-------------------------|
| **Catálogo cadena** | `Cache-Control: public, s-maxage=30, stale-while-revalidate=60` · `export revalidate = 30` |
| **Cliente cadena** | Sin `cache: "no-store"` en fetch |
| **Idle 25s misma molécula** | **0** refetch `/cadena` · **1** poll `/live` (~20s) |
| **Cambio color** | `/live` inmediato (nueva FK) — correcto operativo |
| **useStockOtrosLocales** | `fetch(url, { cache: "no-store" })` · intervalo **20_000 ms** |

**WARN:** no hay `unstable_cache()` explícito; ISR vía `revalidate=30` + headers. Funcionalmente equivalente para catálogo en Edge.

---

## Comando reproducir

```bash
node scripts/audit-caja-negra.mjs
```

---

## Checklist tablet física (Director)

- [ ] 20+ cambios color sin flash emoji
- [ ] Network: solo `/sm/` en thumbs, `/md/` en hero
- [ ] Cantidad local actualiza al cambiar molécula y cada ~20s sin moverse

---

**Auditor:** Cursor Auto · build previo PASS
