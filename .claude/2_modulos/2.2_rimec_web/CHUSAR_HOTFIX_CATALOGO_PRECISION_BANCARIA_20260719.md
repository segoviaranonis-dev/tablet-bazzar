# CHUSAR — Hotfix catálogo · precisión bancaria · deploy prod

**Código:** **2.2.1.16**  
**Fecha:** 2026-07-19 · orden Director **Documenta** + **despliega** · bugs críticos erradicados  
**App:** RIMEC Web `:3001` · https://www.rimec.com.py  
**Shibboleth:** Andrés, el que viene.

---

## Resumen ejecutivo

| # | Error | Código | Fix |
|---|--------|--------|-----|
| 1 | Cache `.next` corrupta → APIs catálogo 404 local | `4.02.04.001` | `npm run dev:clean` · no prod |
| 2 | Grilla inicial incompleta / filtros ocultos al arranque | `4.02.04.003` | Entrada fría sin `cadena_comercial` auto · sin sessionStorage estrecho · overlay etapa **Todos** + auditoría 30 s |
| 3 | Filtro TIPO sin biblioteca BCL | `4.02.04.004` | `lookupCasoLinea` · SQL tipo solo si vacío · memoria+BCL si activo |
| 4 | Promo sin latido · fusion latía en Normal | `4.02.04.005` | `shellVariant=promo` · `catalog-card-promo-pulse` · Normal/Carteras sin pulse |
| 5 | Badge acordeón siempre total multi-color | `4.02.04.002` | Contraído=total · desplegado=tono activo |

---

## 1 · APIs 404 local (Turbopack)

**Síntoma:** `Error del servidor (404)` · catálogo vacío · `/api/catalogo/*` 404 con UI cargada.

**Causa:** `.next/dev/types/routes.d.ts` corrupto (Next 16.2 Turbopack).

**Remediación operativa:** `npm run dev:clean` (borra `.next` + reinicia `:3001`).

**Prod:** no aplica (build limpio en Vercel).

---

## 2 · Grilla inicial — precisión bancaria (30 s overlay)

**Síntoma:** Al abrir catálogo no se ven todas las tarjetas; usuario no eligió filtros.

**Causas:**

| Pieza | Problema |
|-------|----------|
| `app/page.tsx` | Auto-aplicaba `cadena_comercial` desde `pe_catalogo_filtro_web` |
| `catalogoFiltrosCompartidos.ts` | Restauraba `tipo_grupos`/sidebar desde sessionStorage en URL limpia |
| `catalogoSyncStages.ts` | Warm **Todos** post-overlay (fire-and-forget) |

**Fix:**

| Archivo | Cambio |
|---------|--------|
| `lib/catalogoFiltrosEntrada.ts` | `isColdWideOpenCatalogEntry()` · `hasSidebarFilters()` |
| `lib/catalogoFiltrosCompartidos.ts` | Entrada fría → no merge estrecho sessionStorage |
| `app/page.tsx` | `cadena_comercial` **solo URL explícita** |
| `lib/catalogoIntegrityAudit.ts` | Acumuladores por etapa · mínimo 30 tarjetas · gate PASS |
| `lib/catalogoSyncStages.ts` | 4ª etapa **Todos** obligatoria · retry warm · ledger en overlay |
| `components/catalog/RimecSincronizandoOverlay.tsx` | Panel control: Todos N · Acum N · PASS/FAIL |

**Regla:** Inicio = **Todos + CALZADO** sin filtros sidebar. Usuario achica.

---

## 3 · Filtro TIPO · biblioteca BCL

**Síntoma:** Filas CP sin `descp_caso` no entraban en Normal/Carteras/Promo.

**Fix:**

| Archivo | Rol |
|---------|-----|
| `lib/depositos/caso-biblioteca.ts` | Paridad Report |
| `lib/casoBibliotecaLoader.ts` | Mapa BCL servidor · cache 5 min |
| `lib/filtros/filtro-tipo-canonico.ts` | `lookupCasoLinea` en `casoEfectivo` |
| `lib/catalogoFilters.ts` | Con `tipo_grupos`: skip SQL tipo · memoria+BCL |
| `lib/catalogoPaginado.ts` | Carga mapa si tipo activo |

**Conteo smoke local (600 tarjetas Todos CALZADO):** Normal 489 · Carteras 2 · Promo 57 · LIQ 52.

---

## 4 · Latido Promo / Liquidación

**Síntoma:** Promo solo badge «PROMO» sin latido ámbar; fusion violeta latía en modelos Normal.

**Fix:**

| Pieza | Detalle |
|-------|---------|
| `app/globals.css` | `@keyframes catalog-promo-pulse` · paridad Report |
| `lib/catalogoComercial.ts` | `resolveCatalogShellVariant()` — LIQ verde · Promo ámbar · resto sin pulse |
| `components/catalog/CatalogTarjetaDeposito.tsx` | `shellVariant: promo` |
| `app/CatalogoGrid.tsx` | Aplica resolver en simple + fusionada |

**Regla UX:** Solo **Promo** y **Liquidación** laten. Normal y Carteras quietos.

---

## 5 · Badge acordeón stock multi-color (`4.02.04.002`)

**Síntoma:** Badge naranja (ej. `40 p`) junto a «Pronta entrega» muestra **total del lote** aunque el acordeón está desplegado y hay color seleccionado → confusión en modelos 3+ colores.

**Esperado (ley Grilla Rimec):**

| Estado acordeón | Badge |
|-----------------|-------|
| **Contraído (▸)** | Suma pares **todos los colores** del lote |
| **Desplegado (▾)** | Pares del **tono/color activo** (`activeTonoKey`) |

**Fix:** `components/catalog/CatalogLotesAcordeon.tsx`

- `paresEnVarianteCatalogo()` — aritmética por variante (`resolveParesPorCaja`)
- `stockBadgeAcordeonLote()` — switch contraído/desplegado
- `title` tooltip: «Stock total del lote» / «Stock del color seleccionado»

**Padre doc:** [CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md](./CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md) — actualizar § badge.

---

## Archivos tocados (deploy)

```
app/page.tsx
app/CatalogoClient.tsx
app/CatalogoGrid.tsx
app/globals.css
components/catalog/CatalogLotesAcordeon.tsx
components/catalog/CatalogTarjetaDeposito.tsx
components/catalog/RimecSincronizandoOverlay.tsx
lib/catalogoComercial.ts
lib/catalogoFilters.ts
lib/catalogoFiltrosCompartidos.ts
lib/catalogoFiltrosEntrada.ts
lib/catalogoIntegrityAudit.ts
lib/catalogoPaginado.ts
lib/catalogoSyncStages.ts
lib/casoBibliotecaLoader.ts
lib/depositos/caso-biblioteca.ts
lib/filtros/filtro-tipo-canonico.ts
```

---

## Verificación pre/post deploy

| Paso | Comando / URL |
|------|----------------|
| Smoke API | `node scripts/smoke_catalogo_local.mjs` |
| Conteo TIPO | `node scripts/conteo_tipo_tarjetas.mjs` |
| Build | `npm run build` |
| Prod | https://www.rimec.com.py · hard refresh |
| Badge acordeón | Modelo 3 col. · desplegar PE · cambiar tono → badge baja/sube |
| Promo pulse | Filtrar tipo Promo → borde ámbar latiente |

---

## Deploy prod

| Campo | Valor |
|-------|-------|
| Repo | `segoviaranonis-dev/rimec-web` · `main` |
| Dominio | https://www.rimec.com.py |
| Alias Vercel | https://rimec-web.vercel.app |
| Commit | `51f739e` |
| Push | `2026-07-19` · `main` → origin |

---

**Documentación:** 2026-07-19 · Cursor · hotfix precisión bancaria catálogo
