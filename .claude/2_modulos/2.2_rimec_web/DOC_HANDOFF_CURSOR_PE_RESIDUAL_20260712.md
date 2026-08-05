# DOC — Handoff Cursor · sesión 12-07 noche · PE residual (fuera Track 2)

**Código:** **2.2.1.2.2**  
**Fecha trabajo:** 2026-07-12 (noche) · **Documenta:** 2026-07-13  
**App:** RIMEC Web local `:3001`  
**Relación día operativo:** **fuera de Track 2** · material para **Track 3**  
**Estado:** 🟡 código local · **sin push prod** · contradicción abierta vs [DOC_BUG_PE…](./DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md)  
**Shibboleth:** Andrés, el que viene.

---

## Qué se hizo (Cursor · chat PE)

| # | Hallazgo / fix |
|---|----------------|
| 1 | Bolsos VIZZANO **10047.1** · saldo **5p** / **3p** · «+» bloqueado o compra imposible |
| 2 | Vista `v_stock_pe_rimec` (MIG-144): `cajas_disponibles = saldo_pares` y **`pares_por_caja = saldo`** (columna contaminada) |
| 3 | Fix local: PE → **1 click = 1 par** (`PARES_POR_UNIDAD_PE = 1`) · badge/máximo = saldo · no inventar caja 12 sobre residual |
| 4 | Archivos: `prontaEntregaVenta.ts` · `disponibilidad.ts` · `CatalogoGrid.tsx` · `CatalogoClient.tsx` · `agruparTarjetasCatalogo.ts` · `sesionVenta.ts` |
| 5 | Smoke Node: bolsa 5/3 y residual 8 → 1 par/click · PASS |

**No deploy** rimec-web (regla CHUSAR deploy solo cierre etapa / orden directa).

---

## Contradicción abierta (Director decide · Track 3)

| Doc / código | Unidad PE |
|--------------|-----------|
| Este handoff + código local noche 12-07 | **1 par / click** (vende residual 3–8) |
| [DOC_BUG_PE…20260713](./DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md) | **Caja cerrada** (= CP · grada 12) · trata `PARES_POR_UNIDAD_PE=1` como bug |

Hasta orden Director: **no** mezclar este hilo con Track 2 IC/PP.

---

## Índice

- Padre Track 3: [CHUSAR_DIA_OPERATIVO_20260713](../2.3_report/CHUSAR_DIA_OPERATIVO_20260713.md) §3  
- Vista PE: [RESPUESTA_pe_v_stock…](../../4_etapas/peticiones_hermes/respuestas/RESPUESTA_pe_v_stock_pe_rimec_correccion_claude_andres_20260712.md)
