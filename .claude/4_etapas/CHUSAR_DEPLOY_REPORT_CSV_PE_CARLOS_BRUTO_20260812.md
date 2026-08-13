# Deploy Report — CSV PE Carlos bruto LP vendedor

**Fecha:** 2026-08-12 · bump deploy **2026-08-13** (`381bc7c`)  
**Keyword:** despliega · Documenta  
**CHUSAR:** **2.3.1.9.B.7** · cierre [CHUSAR_CIERRE_PENDIENTES_REPORT_20260813.md](./CHUSAR_CIERRE_PENDIENTES_REPORT_20260813.md)  
**Repo:** `report` · Vercel prod · https://report-plum-one.vercel.app

---

## Cambio

CSV Facturación Pronta entrega: ambas columnas precio = bruto del LP elegido por vendedor; nunca LPN si cabecera LPC.

## Commits prod (acumulado)

| Commit | Tema |
|--------|------|
| `78a1fb5` | bruto dual cols LP vendedor |
| `46d8497` | filtros PE espejo AB-CR |
| `381bc7c` | CSV CASO + LISTADO columnas |

## Smoke

`npx tsx scripts/_smoke_csv_pe_depositos.ts` → PASS
