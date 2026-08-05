# ETAPA ABIERTA — Pronta entrega · cierre módulo (Report + RIMEC Web)

**ID:** `PE-FINAL-CIERRE-MODULO-20260723`  
**Código:** **2.3.1.9.B.FINAL** · Facturación PE · Depósito RIMEC · RIMEC Web carrito  
**Estado:** 🟢 **EN CURSO**  
**Apertura:** 2026-07-23 · **Inicia etapa** · auditoría FI `PE-202-001` / PV255  
**Apps:** Report `:3000/facturacion/pronta-entrega` · RIMEC Web `:3001`  
**Docs:** [CHUSAR_FACTURACION_PRONTA_ENTREGA.md](../2_modulos/2.3_report/facturacion/CHUSAR_FACTURACION_PRONTA_ENTREGA.md) · [CHUSAR_CSV_VENTAS_PE_CARLOS.md](../2_modulos/2.3_report/facturacion/CHUSAR_CSV_VENTAS_PE_CARLOS.md) · [CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md](../2_modulos/2.3_report/facturacion/CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md)  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo (foco Director)

Cierre robusto del circuito **PE**: import SDRM → catálogo Web → carrito → FI → Facturación → **CSV Carlos** → traspaso 5000. Auditorías E2E + fixes de montos y campos CSV faltantes.

---

## Caso auditoría ancla (2026-07-23)

| Campo | Valor |
|-------|--------|
| FI | `PE-202-001` · `fi.id=2911` · PV000255 |
| Pedido web | `pedido_id=202` · cliente **2666** |
| CSV | `202_33930.csv` (`fid_id=33930`) |
| Pares UI | **40** (5 SKUs × 8) |
| Descuentos FI | 25% + 5% · LPN |

### Montos — hallazgo crítico

| Fuente | Gs |
|--------|-----|
| `factura_interna.total_monto` (UI) | **5.680.000** |
| Σ `factura_interna_detalle.subtotal` | **6.820.000** |
| CSV Precio Venta | LPN **bruto** por línea (202300…194700) — OK spec |

**Bug:** cabecera FI no recalculada tras confirmar descuentos / líneas. Script: `report/scripts/_audit_fi_pe_255.mjs`.

### CSV vs BD — viaje de datos

| Campo CSV | BD | Estado |
|-----------|-----|--------|
| Cliente 2666 | `fi.cliente_id` | ✅ |
| Cod. Oper. CR-2666001 | fórmula `CR-{cliente}{plazo}` · sin `payload.cod_oper` | ⚠️ pendiente regla Carlos |
| vendedor 16 | `fi.vendedor_id` GRICELDA (Nexus) | ❌ debía ser **60** (Código de vendedor real · Hoja2) |
| Des 25/5 | `fi.descuento_1/2` | ✅ |
| 5 SKUs mat/color/grada | `ppd` + snapshot | ✅ |
| Precio Venta | `unit_fob_ajustado` / LPN bruto | ✅ spec |
| COD.GRUPO / depósito / pares col | no existen en formato 15 cols | ❌ robustecer |

---

## Sub-etapas

| ID | Qué | App |
|----|-----|-----|
| PE-FIN-AUDIT | Auditorías FI vs CSV vs PPD (script + checklist) | Report |
| PE-FIN-MONTOS | Sync `total_monto`/`subtotal` post confirm + editor | Report |
| PE-FIN-CSV | Cod. Oper. · campos faltantes · `sdrm_cod_grupo_dim` | Report |
| **PE-FIN-DICCIONARIO** | **Grupo uno MIG-180 · diccionario · visual Web · [HANDOFF](./HANDOFF_DICCIONARIO_GRUPO_UNO_20260724.md)** | **Report + Web** |
| **PE-FIN-PLAZO** | **Traductor plazos Carlos · Excel Hector col A · Web + CSV** | **RIMEC Web + Report** |
| PE-FIN-WEB | Carrito PE · R-FI-2 · precios/discounts al confirmar | RIMEC Web |
| PE-FIN-SMOKE | E2E venta → CSV → validación Carlos | Report + Web |
| PE-FIN-DEPLOY | Build + Vercel (Claude Code) | — |

---

## Checklist

- [x] Auditoría ancla PE-202-001 / `202_33930.csv`
- [x] **Plazos Carlos MIG-172** — `plazo_carlos` · import Excel · selector Web · CSV Cod. Oper.
- [ ] Fix recalc `total_monto` FI PE
- [ ] CSV: Cod. Oper. + campos Director
- [ ] Smoke Web carrito → FI montos alineados
- [ ] Smoke import Carlos con CSV generado
- [ ] Cierre etapa + `etapas.json`

---

## Relacionados

- Traductor COD.GRUPO: `sdrm_cod_grupo_dim` (MIG-161)
- Export: `report/src/lib/facturacion/csv-pe-ventas-export.ts`
