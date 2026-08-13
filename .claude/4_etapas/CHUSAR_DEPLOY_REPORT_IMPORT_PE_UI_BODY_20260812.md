# CHUSAR — Deploy Report · Import PE sdrm UI body 32 MB (2026-08-12)

**Keyword:** **Documenta** · orden directa Director **despliega**  
**App:** Report (`rimec-report`)  
**Doc funcional:** **2.3.1.10.1.7** · [CHUSAR_IMPORT_PE_SDRM_UI_BODY_NEXT15_20260812.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_IMPORT_PE_SDRM_UI_BODY_NEXT15_20260812.md)

---

## 0 · Qué sale a prod

| Campo | Valor |
|-------|--------|
| **Alcance** | Límite body Next 15.5 → 32 MB · UX import PE (cronómetro, recarga limpia) |
| **No incluye** | rimec-web · bazzar-web · resto del working tree Report |
| **Commits** | `a650788` (body+UX) · `997d836` (cast tipado Vercel) |
| **Deploy** | `dpl_2Ukazk1nZwoYDUk9wZMFgcrKMC1r` · READY |
| **URL** | https://report-plum-one.vercel.app/stock-pronta-entrega |

---

## 1 · Archivos commit

- `next.config.ts`
- `src/components/stock-pronta-entrega/PeImportSdrmButton.tsx`
- `src/components/stock-pronta-entrega/StockProntaEntregaClient.tsx`

---

## 2 · Checklist

| # | Ítem | Estado |
|---|------|:------:|
| 1 | Smoke pipeline + batch sdrm0218 local | ✅ |
| 2 | Commit acotado | ✅ `a650788` + tipado |
| 3 | Push + Vercel prod | ✅ READY |
| 4 | CHUSAR + índices + Moises #42 | ✅ |
| 5 | Sync `moria_chusar/content/claude` | ✅ |

---

## 3 · Héctor

1. Prod: login → `/stock-pronta-entrega` → **Importar CSV sdrm** (Ctrl+F5).  
2. Elegí `sdrm####.csv` (>1 MB OK) → Importar → cronómetro ~15–30 s.  
3. Sin agente.
