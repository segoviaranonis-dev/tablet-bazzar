# CHUSAR — Cierre pendientes Report · documenta + despliega (2026-08-13)

**Keyword:** **Documenta** · **despliega** — orden Director antes de tarea nueva  
**App:** Report · https://report-plum-one.vercel.app  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible

---

## 0 · Resumen ejecutivo

| # | Entrega | Código Moria | Commit Report | Prod |
|---|---------|--------------|---------------|------|
| 1 | Import PE UI body 32 MB | **2.3.1.10.1.7** | `a650788` | ✅ |
| 2 | PE SDRM EAN 638/654 gate | **2.3.1.10.1.8** | `85ef6a3` | ✅ |
| 3 | CSV Carlos bruto dual · LP vendedor | **2.3.1.9.B.7** | `78a1fb5` | ✅ |
| 4 | Filtros PE espejo AB-CR Web | **2.2.1.52** | `46d8497` | ✅ este deploy |
| 5 | CSV CASO + LISTADO columnas | — | `381bc7c` | ✅ este deploy |

---

## 1 · Ley CSV Carlos (2.3.1.9.B.7)

- Cols **Precio con descuento** y **Precio sin descuento** = **mismo bruto** del `lista_precio_id` del vendedor.
- **Prohibido** LPN si cabecera LPC02/03/04.
- Carlos aplica Des.1–4 — no mandar neto.
- Doc: [CHUSAR_CSV_PE_CARLOS_BRUTO_LP_VENDEDOR_20260812.md](../2_modulos/2.3_report/facturacion/CHUSAR_CSV_PE_CARLOS_BRUTO_LP_VENDEDOR_20260812.md)

---

## 2 · Ley PE import SDRM (2.3.1.10.1.8)

- `proveedorFromSdrmRow` — EAN 79… + COD.GRUPO Kyly · gate `_audit_sdrm_cobertura_universo.ts`
- Doc: [CHUSAR_PE_SDRM_EAN_638_654_GATE_20260812.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_PE_SDRM_EAN_638_654_GATE_20260812.md)

---

## 3 · Smokes post-deploy

```bash
cd report
npx tsx scripts/_smoke_csv_pe_depositos.ts
npx tsx scripts/_test_proveedor_sdrm_row.ts
```

---

## 4 · Fuera de alcance (no mezclar en este cierre)

- rimec-web prod sellada `f408fc2`
- Working tree Report sin commit (mensajes, SF, scripts tmp)
- Bancard **2.5.1.39** — foco ACTUAL separado

---

**Shibboleth:** Andrés, el que viene. Protocolo Moises Activado · Moria + ACTUAL acatados.
