# CHUSAR — Hotfix AB-CR CARTERAS/ANTEOJOS · RIMEC Web siamese Report

**Código:** **2.2.1.32**  
**Error Moria:** `4.01.04.003` (regresión AB-CR)  
**Fecha:** 2026-07-27  
**Keyword Director:** **Documentación Chusar** · publicar  
**App:** RIMEC Web `:3001` / prod `rimec-web.vercel.app`  
**Estado:** ✅ Fix local verificado · deploy prod post-push

---

## 1 · Síntoma Director

| Filtro UI | Esperado | Observado (pre-fix) |
|-----------|----------|---------------------|
| Vizzano + pill **Calzado** + **CARTERAS** (`tipo_ids=-1`) | Decenas de carteras PE | Catálogo vacío o 1 tarjeta |
| **ANTEOJOS** (`tipo_ids=-2`) | Línea 90000 refs 1–4 | 0 resultados |
| Vizzano Calzado sin AB-CR | Solo calzado (Mario Bros) | 1 cartera suelta |

**Violación:** ley «mostrar todos» al marcar subfamilia AB-CR explícita · paridad Report [2.3.1.10.2](../2.3_report/deposito_rimec/CHUSAR_PE_TIPO1_ABCR_ACCESORIOS.md).

---

## 2 · Causa raíz

1. **`calzadoExcluyeCarterasPorDefecto`** ignoraba IDs sintéticos `-1`/`-2` — SQL y memoria seguían excluyendo accesorios aunque el sidebar pidiera CARTERAS/ANTEOJOS.
2. **Web sin traductor PE** (`pe-traductor-tipo1`) — línea **90000** refs 1–4 tienen `descp_tipo_1=CARTERAS` en vista pero Excel/backfill = **LENTES/ANTEOJOS** (Report ya resolvía vía traductor).
3. **Scan TODOS** mezclaba CP+PE en mismo `range` — accesorios PE diluidos en paginado (carteras = stock PE).

---

## 3 · Fix aplicado

| Archivo | Cambio |
|---------|--------|
| `lib/filtros/filtro-tipo-canonico.ts` | `tipo_ids` sintéticos anulan exclusión calzado |
| `lib/catalogoFilters.ts` | SQL `include` si subfamilia AB-CR · memoria paridad `stock-pe-filters.ts` Report |
| `lib/catalogoPaginado.ts` | TODOS + AB-CR → scan **solo** `v_stock_pe_rimec` |
| `lib/filtros/modulo-accesorios.ts` | `subtipoAccesoriosKey` + traductor LINEA+REFE |
| `lib/filtros/pe-traductor-tipo1.ts` | Seed valorizado Carlos (paridad Report) |
| `scripts/_smoke_medias_siames_web.mjs` | Assert Vizzano CARTERAS ≥10 · ANTEOJOS ≥2 |

**Regla canónica:**

```
SI tipo_ids incluye -1 o -2 (subfamilia AB-CR)
 → NO excluir accesorios en Calzado
 → SQL include accesorios · memoria solo accesorios
 → traductor resuelve 90000.1–4 como LENTES (chip ANTEOJOS)
```

Cruces: [2.2.1.24](./CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md) (exclusión por defecto) · [2.2.1.25](./CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md).

---

## 4 · Evidencia smoke (local `:3001`)

| Caso | Resultado |
|------|-----------|
| Vizzano + CALZADO + `tipo_ids=-1` | **60** tarjetas · hasMore |
| Vizzano + CALZADO + `tipo_ids=-2` | **4** tarjetas (90000 vía traductor) |
| Calzado sin AB-CR | **0** carteras visibles en grilla |
| `npm run build` | Ok |
| `_smoke_medias_siames_web.mjs` | PASS |

Scripts auditoría: `scripts/_audit_vizzano_carteras_pe.ts` · `_audit_api_carteras_vizzano.ts`.

---

## 5 · Checklist Director prod

- [ ] `:3001/?marca_ids=2&tipo_ids=-1&ramo_tipo=CALZADO` — grilla Vizzano carteras poblada
- [ ] `tipo_ids=-2` — ≥4 anteojos línea 90000
- [ ] Calzado sin AB-CR — sin carteras mezcladas (Mario Bros intacto)

---

## 6 · Cruces Moria

| Código | Título |
|--------|--------|
| `2.2.1.32` | Este hotfix |
| `2.2.1.24` | Mario Bros · exclusión carteras por defecto |
| `2.3.1.10.2` | AB-CR PE Tipo 1 · backfill |
| `4.01.04.003` | Calzado/carteras |

---

**Orden Director:** Documentación Chusar · publicar · 2026-07-27.
