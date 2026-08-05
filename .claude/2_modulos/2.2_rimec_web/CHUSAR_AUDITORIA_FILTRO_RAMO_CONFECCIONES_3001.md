# CHUSAR — Auditoría filtro Categoría · Confecciones · :3001

**Código:** **2.2.1.0.6**  
**Estado:** 🟢 Fix local 2026-07-14 · `:3001`  
**Palabra Director:** **Documenta** (2026-07-14)  
**Relacionado:** [CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md](./CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md) §4 · [CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md](../2.1_control_central/docs/CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md) · MIG-152 `ramo_tipo`

---

## 1 · Síntoma Director

URL: `http://localhost:3001/?origen_tipo=TODOS&ramo_tipo=CONFECCIONES`

| Observación | Esperado | Real (pre-fix) |
|-------------|----------|----------------|
| Contador grilla | Miles de modelos PE Kyly | **0 modelos · 0 pares** |
| Pills **Marca** | Kyly · Milon · RIMEC | Actvitta · Beira Rio · Vizzano · **+ Kyly** (mezcla calzado) |
| Pills **Estilo** | Confecciones / vacío | Chatita · Taco alto · Tenis (calzado CP) |

---

## 2 · Auditoría ejecutada

### 2.1 Universo BD (Supabase · misma fuente catálogo)

| Métrica | Valor |
|---------|-------|
| PE `ramo_tipo=CONFECCIONES` · vendible | **6.225 filas** |
| PE `tipo_v2_id=2` | **6.225** (paridad) |
| PE `ramo_tipo=CALZADO` | 5.882 |
| CP `TRÁNSITO_PP` · `ramo_tipo=CALZADO` | 797 |

### 2.2 Protocolo imágenes tipo_v2=2 (auditoría previa)

| Capa | Cumplen | Total | % |
|------|---------|-------|---|
| Moléculas `linea_color` naming 638 | 2.646 | 2.646 | 100% |
| Storage 4 tiers (flat+sm+md+lg) | **2.499** | 2.646 | **94,4%** |
| UI thumb sm/ HEAD 200 | 2.508 | 2.646 | 94,8% |
| Sin origen local (gap) | ~147 stems | — | pendiente JPG Director |

Script: `rimec-web/scripts/audit_pe_tipo2_protocolo_3001.mjs`

### 2.3 RPC meta sidebar

| Llamada | Marcas devueltas |
|---------|------------------|
| `rimec_catalogo_meta` CP · sin ramo | ACTVITTA, BEIRA RIO, MODARE, MOLECA… |
| `rimec_catalogo_meta` PE · `p_ramo_tipo=CONFECCIONES` | **KYLY, MILON, RIMEC** |

Script: `rimec-web/scripts/audit_filtro_confecciones_3001.mjs`

---

## 3 · Causa raíz (3 bugs encadenados)

### Bug A — Meta «Todos» mezclaba CP + PE sin respetar ramo

`lib/catalogoMetaRpc.ts` en modo `origen_tipo=TODOS` hacía merge de meta CP (**sin** `p_ramo_tipo`) + meta PE (con ramo). Resultado: marcas calzado 654 visibles al activar 👕 Confecciones.

**Regla CHUSAR 2.2.1.0.4 §4:** categoría calzado/confecciones aplica **solo a lotes PE**. CP no tiene confecciones.

### Bug B — Filtro memoria dejaba pasar CP en Confecciones

`applyMemoryFilters` en `catalogoFilters.ts`: filas `TRÁNSITO_PP` pasaban siempre (`return true`) aunque `ramo_tipo=CONFECCIONES`. Paginación dual además escaneaba `v_stock_rimec` en paralelo con mismos offsets.

### Bug C — sessionStorage compartido CP↔PE

`catalogoFiltrosCompartidos.ts` persiste `linea_ids`, `marca_id`, `grupo_estilo_id`, `tipo_ids` entre CP y PE. Al cambiar a Confecciones **sin limpiar**, SQL filtraba PE por `linea_id` de calzado → **0 tarjetas** aunque BD tenga 6.225 filas.

---

## 4 · Fix aplicado (local · sin deploy prod)

| Archivo | Cambio |
|---------|--------|
| `lib/catalogoMetaRpc.ts` | TODOS+CONFECCIONES → solo RPC PE; TODOS+CALZADO → CP+PE con `ramo_tipo=CALZADO` |
| `lib/catalogoFilters.ts` | `applyMemoryFilters`: CONFECCIONES excluye CP; CALZADO filtra PE calzado + CP |
| `lib/catalogoPaginado.ts` | TODOS+CONFECCIONES → fetch solo `v_stock_pe_rimec` |
| `app/api/catalogo/filtros/route.ts` | Legacy meta: mismo criterio PE-only confecciones |
| `app/components/FiltrosCatalogo.tsx` | Al togglear categoría: reset `marca_id`, `linea_ids`, `tipo_ids`, `grupo_estilo_id` |

**Post-fix esperado:** marcas **Kyly · Milon · RIMEC** · grilla ≥30 tarjetas al abrir Confecciones en Todos.

---

## 5 · Verificación Director

1. Hard refresh `:3001` (o limpiar sessionStorage clave `rimec_catalog_shared_filters_v1`).
2. Origen **Todos** → **👕 Confecciones**.
3. Contador > 0 · marcas sin Vizzano/Actvitta.
4. Imágenes 638: ~94,4% con tiers; gap 147 pendiente origen JPG.

---

## 6 · Pendiente

- [x] Fix local meta/paginación/sessionStorage — **build OK 2026-07-14**
- [ ] Smoke visual Director post-fix (ver handoff **2.2.1.0.7**)
- [ ] 147 fotos sin 4 tiers — lote JPG Director (lista `PE638_SIN_ORIGEN_*.md`)
- [ ] Deploy prod fix Confecciones — cierre etapa u orden directa Héctor
- [ ] Smoke Playwright autenticado `/api/catalogo/tarjetas` (cookie `rimec_session`)

**Handoff consolidado:** [CHUSAR_PENDIENTES_HANDOFF_CURSOR_20260714.md](./CHUSAR_PENDIENTES_HANDOFF_CURSOR_20260714.md)

---

## 7 · Extensión 2026-07-24 · Calzado + carteras (Mario Bros)

Misma URL `TODOS+CALZADO` reveló **segundo iceberg**:

| Capa | Bug | Fix |
|------|-----|-----|
| RPC CP | Ignoraba `p_ramo_tipo` → pijamas/Kyly en ESTILO | **MIG-181** |
| Regla grupo uno | 236 carteras PE en pill Calzado | Exclusión CARTERAS por defecto |

Doc completo: [CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md](./CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md) (**2.2.1.24** · `4.01.04.003`).

---

**Integrado:** 2026-07-14 · etapa `DIA-OPERATIVO-20260713` · Cursor Auto  
**Ampliado:** 2026-07-24 · Documenta Director · Calzado ≠ Carteras
