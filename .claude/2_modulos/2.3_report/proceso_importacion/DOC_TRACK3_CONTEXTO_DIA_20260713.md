# DOC — Track 3 · contexto listo · Día operativo 13-07-26

**Código:** **2.3.1.13.3** · Track 3  
**Etapa:** [ETAPA_DIA_OPERATIVO_20260713](../../../4_etapas/ETAPA_DIA_OPERATIVO_20260713.md)  
**CHUSAR día:** [CHUSAR_DIA_OPERATIVO_20260713](../CHUSAR_DIA_OPERATIVO_20260713.md) §3  
**Documenta:** Director · 2026-07-13  
**Ejecutor:** Cursor · foco **Track 3** (después de batch PE Track 1)  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Objetivo Track 3 (hoy)

| Paso | Acción | PASS |
|:----:|--------|:----:|
| 3.1 | Compra stock PE (origen Track 1 · batch `20260713`) | ☐ |
| 3.2 | Cadena IC/FI → Aprobaciones → Facturación PE → traspaso **5000** | ☐ |
| 3.3 | Visible en **RIMEC Web** catálogo PE (`?origen_tipo=PRONTA_ENTREGA`) | ☐ |
| 3.4 | Compra web Bazzar · **cliente 5000** | ☐ |
| 3.5 | **Reversión completa** 5000 → depósito PE RIMEC | ☐ |

**Ley día:** todo PE hoy = **cliente_id 5000** · reversión **solo** ese cliente al cierre.

**Apps:** Report `:3000` · RIMEC Web `:3001` · Bazzar Web según flujo.

---

## 2 · Qué ganamos ayer (12-07 → madrugada 13-07) · fuera Track 2

| Tema | Entrega | Doc / commit | Track |
|------|---------|--------------|:-----:|
| **PE cajas cerradas RIMEC Web** | Regla OT: `pares = cajas × pares/caja` · helpers `resolveParesPorCaja` | [DOC_BUG_PE…20260713](../../2.2_rimec_web/DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md) · `rimec-web` local | **3** |
| Botón «+» carteras PE | Techo carrito en cajas reales · tooltip motivo | mismo DOC § Bug 2 | **3** |
| Handoff noche 12-07 (1 par/click) | **Supersedido** por regla Director caja cerrada | [DOC_HANDOFF…20260712](../../2.2_rimec_web/DOC_HANDOFF_CURSOR_PE_RESIDUAL_20260712.md) | — |
| Moria Chusar · Alejandro Magno | 37 md + índice maestro en git `moria_chusar` | commit `6fd6077` · sin Vercel | — |
| Report hotfix PDF Ventas+Fotos | 80 filas serverless | `b60fd9d` · `4.02.02.004` | — |
| Report hotfix Stock tránsito PROMOCIONAL | Caso BCL + `caso_precio` | `3ffb9c2` · CHUSAR stock tránsito | — |

**Regla Director (13-07):** en Web **misma unidad de venta** CP y PE (caja cerrada). Residual carteras &lt; grada = decisión Track 3 tras smoke calzado.

---

## 3 · Precondiciones antes de E2E

| # | Requisito | Responsable |
|---|-----------|-------------|
| 1 | Batch PE importado Track 1 · `stock_pronta_entrega_rimec` | Track 1 |
| 2 | Smoke local RIMEC Web: 1 caja calzado PE → **12 pares** footer/carrito | Track 3 |
| 3 | `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` (Andrés cloud) | Infra |
| 4 | Usuario prueba Héctor DIOS · reversión explícita al cierre | Director |

---

## 4 · Cadena operativa (ida)

```
/stock-pronta-entrega (import batch 20260713)
  → FI / facturación PE
  → /aprobaciones
  → facturación · enviar_factura_a_web_bazar
  → cliente 5000 · ALM_WEB_01
  → rimec-web ?origen_tipo=PRONTA_ENTREGA
  → compra Bazzar Web
```

Doc: [CHUSAR_FACTURACION_PRONTA_ENTREGA](../facturacion/CHUSAR_FACTURACION_PRONTA_ENTREGA.md) · [CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION](../../2.2_rimec_web/CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md) §4

---

## 5 · Reversión (vuelta · fin de día)

1. Listar PVR/FI ventana prueba · usuario Héctor · **cliente 5000**.  
2. Anular FI confirmadas según protocolo holding.  
3. Reponer stock CP/PE si aplica.  
4. Evidencia: lista nros revertidos.

**Sin frase explícita Director** («revertí 5000») → **prohibido** borrar FI/PVR.

---

## 6 · Pendiente datos (no bloquea smoke calzado)

| Ítem | Detalle |
|------|---------|
| `v_stock_pe_rimec.grades_json` | NULL en muchas filas · default **12** en código hasta migración Supabase |
| `unit_fob_ajustado` NULL en PPD PE | Carteras sin precio tras fix conteo → completar en Track 1 sync |
| Deploy prod rimec-web | Solo cierre etapa / orden directa Héctor |

---

## 7 · Lectura mínima Track 3

1. Este archivo  
2. [DOC_BUG_PE…20260713](../../2.2_rimec_web/DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md)  
3. [CHUSAR_DIA_OPERATIVO_20260713](../CHUSAR_DIA_OPERATIVO_20260713.md) §3  
4. [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC](../deposito_rimec/CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md)  
5. [CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION](../../2.2_rimec_web/CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md)
