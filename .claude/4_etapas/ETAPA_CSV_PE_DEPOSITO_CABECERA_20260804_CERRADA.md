# ETAPA CERRADA — CSV PE Carlos · DEPOSITO cabecera (veneno)

**Code:** `CSV-PE-DEPOSITO-CABECERA-20260804`  
**Apertura implícita:** 2026-08-04 (sesión Documenta + Chusar)  
**Cierre:** 2026-08-04 · orden Director **Cierra etapa** · **sin deploy**  
**Módulo:** Report · Facturación PE **2.3.1.9.B**  
**Shibboleth:** Andrés, el que viene.

---

## Entregado (local)

| # | Entrega | Doc / código |
|---|---------|--------------|
| 1 | Col **DEPOSITO** cabecera una vez (`S00_D1\|DEP2\|D3`) | **2.3.1.9.B.3** · `csv-pe-ventas-export.ts` |
| 2 | **Cant. Pares** por artículo · 15 cols fijas | mismo |
| 3 | Rechazo 3 cols S00_* como cantidad | Director 2026-08-04 |
| 4 | Neto post-descuento sin centena | `precioNetoCascada` · ej. 88695 |
| 5 | HECTOR → Carlos **90** · caso PE enriquecido · anti-colisión vendedor | **2.3.1.9.F** · `4.02.04.004` |
| 6 | Pendientes documentados | **2.3.1.9.B.4** |

**Smoke:** `npx tsx scripts/_smoke_csv_pe_depositos.ts` → OK · `vendedor=25` · `DEPOSITO=S00_D1` · `Cant=10`.

---

## No entregado (explícito)

| # | Ítem | Motivo |
|---|------|--------|
| 1 | Deploy Report / rimec-web prod | Director: **no despliegues** |
| 2 | Import CSV en sistema Carlos | Humano piso |
| 3 | Asignador banquete / PLAN-AUTO | Queda en_curso · pausa foco |

---

## Siguiente

**Etapa corta:** `SALES-REPORT-PDFS-20260804` · Sales Report **módulo blindado** · PDFs.  
Doc etapa: [ETAPA_SALES_REPORT_PDFS_20260804.md](./ETAPA_SALES_REPORT_PDFS_20260804.md)

Pendientes unificados: [PENDIENTES_POST_CIERRE_CSV_PE_20260804.md](./PENDIENTES_POST_CIERRE_CSV_PE_20260804.md)

---

## Cierre Navegador (:3004) — OBLIGATORIO

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → `trabajoVivo[].estado` = `"hecho"` | ✅ |
| Entrada en `cerradasPorModulo.report` | ✅ |
| `actualizado` bump en raíz JSON | ✅ |
| Verificado `:3004/etapas` (HTTP 200 · JSON `hecho`) | ✅ |
| Deploy prod | ❌ **no** (orden Director) |
