# CHUSAR — Día operativo 13-07-26 · tres tracks

**Código:** **2.3.1.13**  
**Etapa:** [ETAPA_DIA_OPERATIVO_20260713](../../4_etapas/ETAPA_DIA_OPERATIVO_20260713.md)  
**Ratificado:** Director · 2026-07-13  
**Shibboleth:** Andrés, el que viene.

---

## Norte

| Track | Qué | Dónde |
|:-----:|-----|-------|
| **1** | Excel ↔ stock PE real | `/stock-pronta-entrega` · `stock_pronta_entrega_rimec` |
| **2** | IC/PP finales + CSV | Admin IC · proceso-importación |
| **3** | PE E2E **5000** + reversión | Facturación → Web → Bazzar → depósito PE |

**Ley día:** registros PE hoy = **cliente_id 5000** únicamente. Reversión al cierre **solo 5000**.

---

## §1 Track 1 — Sync Excel · stock RIMEC real

1. CSV/POS fuente = verdad legal del Director.  
2. Panel Report: **`/stock-pronta-entrega`**.  
3. Tabla staging: **`stock_pronta_entrega_rimec`** (MIG-132) · batch `20260713`.  
4. Mapeo depósitos: `S00_D1` → D1 · `S00_DEP2` → DEP2 · `S00_D3` → D3.  
5. Post-import: conteo filas vs Excel · smoke depósito RIMEC.  
6. Objetivo Alejandro Magno: puente → PPD · hoy validamos **stock real** en staging + vista PE.

**RIMEC Web (Cursor Track 1):** [CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md](../2.2_rimec_web/CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md) — CP home · PE detrás del telón · ≥30 tarjetas cache.

Doc: [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC](./deposito_rimec/CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md) · [MAPA CSV](../../../report/docs/MAPA_CSV_SDRM_STOCK_PRONTA_ENTREGA.md)

---

## §2 Track 2 — IC · PP · CSV

1. Retomar PP PROGRAMADO pendientes (Chusa · regenerar FI).  
2. Admin IC: alinear IC=PF=FI donde aplique.  
3. CSV según orden Director (Aprobaciones / ventas PP / otro).  
4. **No** mezclar con Track 3 hasta batch PE etiquetado.

**Contexto Cursor listo 2026-07-13:** [DOC_TRACK2_CONTEXTO_DIA_20260713](./proceso_importacion/DOC_TRACK2_CONTEXTO_DIA_20260713.md)  
Doc base: [DOC_REPARACION_PROGRAMADO…](./proceso_importacion/DOC_REPARACION_PROGRAMADO_PILARES_CASOS_20260712.md) · [DOC_ADMIN_IC_LOTE_PP28](./proceso_importacion/DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md)

---

## §3 Track 3 — PE · cliente 5000 · reversión

**Contexto Cursor:** [DOC_TRACK3_CONTEXTO_DIA_20260713](./proceso_importacion/DOC_TRACK3_CONTEXTO_DIA_20260713.md) · bugs Web: [DOC_BUG_PE…20260713](../2.2_rimec_web/DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md)

### Ida (compra → web)

```
Stock PE (Track 1)
  → FI / facturación PE
  → Aprobaciones
  → Facturación · traspaso enviar_factura_a_web_bazar
  → cliente 5000 · ALM_WEB_01
  → RIMEC Web catálogo PE (v_stock_pe_rimec / PPD)
  → Compra Bazzar Web
```

### Vuelta (reversión — fin de día)

```
Bazzar Web (solo cliente 5000)
  → revertir traspaso / stock web
  → RIMEC Web saldo
  → depósito pronta entrega RIMEC
  → estado pre-prueba verificado
```

Guardia 5000: [CHUSAR_FACTURACION](./facturacion/CHUSAR_FACTURACION.md) § Cliente 5000.  
Reversión: [CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION](../2.2_rimec_web/CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md) §4.

---

## Parking · sesión Cursor 12-07 (≠ Track 2)

PE residual / carteras RIMEC Web: [DOC_HANDOFF_CURSOR_PE_RESIDUAL_20260712](../2.2_rimec_web/DOC_HANDOFF_CURSOR_PE_RESIDUAL_20260712.md) · retoma en **Track 3** tras decisión unidad PE.

---

## Checklist cierre día

| # | Criterio | PASS |
|---|----------|:----:|
| 1 | Stock Excel = BD staging PE | ☐ |
| 2 | IC/PP objetivo alineado + CSV descargado | ☐ |
| 3 | E2E 5000 visible Web | ☐ |
| 4 | Reversión 5000 completa · depósito PE restaurado | ☐ |
