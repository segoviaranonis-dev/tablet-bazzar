# CHUSAR — Filtros PE Report · espejo RIMEC Web (Hermano 1)

**Subcuenta:** **2.3.1.10.1.3** · padre **2.3.1.10** Depósito RIMEC  
**Ruta Report:** `/stock-pronta-entrega`  
**Par Web:** `:3001/?origen_tipo=PRONTA_ENTREGA`  
**Estado:** 🟢 Hermano 1 **100%** · audit **99/99** (2026-07-25)

---

## Rol

Report PE es el **hermano canónico de operativa** para filtros Pronta Entrega. RIMEC Web replica la ley vía módulos siameses (ver [CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md](../../2.2_rimec_web/CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md) **2.2.1.25**).

---

## UI Report

| Pieza | Ruta |
|-------|------|
| Client | `report/src/app/stock-pronta-entrega/StockProntaEntregaClient.tsx` |
| Sidebar | `report/src/components/herramienta-reposicion/ReposicionFiltrosSidebar.tsx` |
| Tipo PE | `PeTipoDiccionarioMultiSelectGroup` · labels **NORMAL/PROMOCIONAL/LIQUIDACION/COMUN** |
| Filtros memoria | `report/src/lib/stock-pronta-entrega/stock-pe-filters.ts` |
| Diccionario | `report/src/lib/stock-pronta-entrega/filtro-tipo-pe-diccionario.ts` |

---

## Audit bancario

```powershell
cd report
npx tsx scripts/audit_pe_filtros_bancario.mts
npx tsx scripts/siamese_paridad_pe_report_web.mts --run-audit
```

**Último PASS:** 99/99 · eficiencia 100% · manifest `scripts/output/SIAMESE_PARIDAD_PE_MANIFEST.json`

---

## Tres hermanos — posición Report

| Hermano | Estado |
|---------|--------|
| 1 · Report PE (este doc) | ✅ 100% |
| 2 · Paridad lógica Web | ✅ 100% |
| 3 · Web runtime | ✅ 100% |
| Ley TODOS | ✅ [2.2.1.28](../../2.2_rimec_web/CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) |

**Shibboleth:** Andrés, el que viene.
