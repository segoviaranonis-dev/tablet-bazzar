# CHUSAR — Hotfix catálogo · filtros · deploy sellado

**Código:** `2.2.1.05`  
**Fecha:** 2026-07-06 · **Director:** Héctor Segovia  
**Estado:** Incendio apagado · **prod sellada** · taller local PE en curso

---

## Síntomas (incendio)

| Síntoma | Causa |
|---------|--------|
| `statement timeout` (57014) | MIG-134: UNION PE en `v_stock_rimec` (~13k filas) |
| Catálogo 0 modelos intermitente | SSR masivo + 3 APIs concurrentes |
| Filtros desconectados (2 quincenas, 3 marcas) | Sidebar desde 30 tarjetas paginadas, no BD completa |
| Header mega-menú vacío | `EMPTY_HEADER` + delay + `getFiltros` pesado |

---

## Remediación BD — MIG-138

**Archivo:** `report/migrations/138_v_stock_rimec_saneamiento_catalogo_cp.sql`  
**Script apply:** `report/scripts/aplicar_migracion_138.mjs`

| Vista | Filas | Rol |
|-------|-------|-----|
| `v_stock_rimec` | ~875 | Catálogo mayorista **solo CP** (`TRÁNSITO_PP`, `EN_TRANSITO`, saldo>0) |
| `v_stock_pe_rimec` | ~12k | Pronta entrega **aparte** — no mezclar en catálogo CP prod |

**Regla negocio:** PP visible en web CP solo si `estado_transito = EN_TRANSITO` (Panel Report → DESPLEGAR EN RIMEC WEB).

---

## Remediación app — commit `f408fc2` (prod sellado)

| Pieza | Ruta |
|-------|------|
| Paginación client | `app/CatalogoClient.tsx` · `/api/catalogo/tarjetas` |
| Filtros sidebar BD | `/api/catalogo/filtros` · `fetchCatalogoMetaRows` |
| Header async | `/api/catalogo/header-filtros` · delay 800ms |
| SQL filtros CP | `lib/catalogoFilters.ts` · `CATALOGO_SOLO_COMPRA_PREVIA=true` |
| Blindaje | `next.config.ts` headers · `proxy.ts` matcher `/api/catalogo/*` |

**Prod:** https://rimec-web.vercel.app · commit **`f408fc2`** — **no alterar** hasta cierre etapa u orden directa Director.

**Sello operativo:** `ot/DEPLOY-RIMEC-WEB-SELLADO-20260706.md`

---

## Regla inviolable deploy (2026-07-06)

Git `main` + Vercel + migración prod **solo**:

1. Cierre etapa canónico (6 pasos + `etapas.json` `:3004`)  
2. Pedido **directo** Director (Héctor) en el turno

**CHUSAR Cursor:** `.cursor/rules/chusar-deploy-solo-cierre-etapa.mdc`

Incendio local **no** autoriza prod (lección incendio 2026-07-06).

---

## Taller local (siguiente)

- `:3001` — catálogo **CP + Pronta entrega** (`CATALOGO_SOLO_COMPRA_PREVIA` / vista PE en local)
- Etapa: [ETAPA_RIMEC_WEB_PE_LOCAL_20260706.md](../../4_etapas/ETAPA_RIMEC_WEB_PE_LOCAL_20260706.md)
- Imágenes PE: [CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md](./CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md)

---

## Scripts verificación

| Script | Uso |
|--------|-----|
| `rimec-web/scripts/test_filtros_catalogo.mjs` | 875 filas · 5 quincenas · 7 marcas |
| `report/scripts/query_quincenas_catalogo.mjs` | Quincenas duro BD |
| `report/scripts/diagnostico_pp_catalogo_web.mjs` | PP fuera de catálogo y causa |

---

**Keyword Documenta:** Director 2026-07-06 · sellado deploy + regla CHUNA
