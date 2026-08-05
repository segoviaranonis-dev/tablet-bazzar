# ETAPA ACTIVA — Día operativo 13-07-26

**ID:** `DIA-OPERATIVO-20260713`  
**Código:** **2.3.1.13** · **2.3.1.7.5** · **2.3.1.10.1**  
**Estado:** 🟢 **ABIERTA**  
**Ejecutor:** Cursor · **Director valida resultado**  
**Portal:** http://localhost:3004/etapas  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo del día (Director · 2026-07-13)

Tres tracks **en paralelo** — conversaciones distribuidas:

| Track | Objetivo | Módulo |
|:-----:|----------|--------|
| **1** | Sincronizar **Excel ↔ stock pronta entrega** · cargar stock RIMEC real | Report `/stock-pronta-entrega` · `stock_pronta_entrega_rimec` |
| **2** | Ajustes finales **IC ↔ PP** · toques finales · **descarga CSV** | Report proceso-importación · Admin IC |
| **3** | Compra PE **cliente 5000** → trazar hasta **RIMEC Web** · **reversión completa** al cierre (Bazzar Web → depósito PE RIMEC) | Report → Aprobaciones → Facturación → Web |

**Regla día:** todo registro **pronta entrega** de hoy = **cliente 5000** (Bazzar.py · guard OT-002). Reversión **solo** ese cliente al final.

---

## Track 1 — Sync Excel · stock PE real

| Paso | Acción | PASS |
|:----:|--------|:----:|
| 1.1 | Obtener Excel/POS stock RIMEC actual (Director) | ☐ |
| 1.2 | Import panel `/stock-pronta-entrega` · batch etiquetado `20260713` | ☐ |
| 1.3 | Verificar conteos vs Excel legal · depósitos D1/DEP2/D3 | ☐ |
| 1.4 | Cruzar con `v_stock_pe_rimec` / PPD destino si aplica | ☐ |

**CHUSAR:** [CHUSAR_DIA_OPERATIVO_20260713](../2_modulos/2.3_report/CHUSAR_DIA_OPERATIVO_20260713.md) §1 · [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC](../2_modulos/2.3_report/deposito_rimec/CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md)

---

## Track 2 — IC · PP · CSV

| Paso | Acción | PASS |
|:----:|--------|:----:|
| 2.1 | Retomar flota PP PROGRAMADO (post PP-28) | ☐ |
| 2.2 | Alinear IC ↔ proforma ↔ FI · botón verde regenerar donde aplique | ☐ |
| 2.3 | Chusa N1 verde en lote objetivo | ☐ |
| 2.4 | Descarga CSV operativo (Director define cuál) | ☐ |

**URL foco:** `/proceso-importacion/pedido-proveedor/*?tab=admin-ic`  
**Contexto Cursor:** [DOC_TRACK2_CONTEXTO_DIA_20260713](../2_modulos/2.3_report/proceso_importacion/DOC_TRACK2_CONTEXTO_DIA_20260713.md)  
**Briefing Cursor:** [DOC_TRACK2_CONTEXTO_DIA_20260713](../2_modulos/2.3_report/proceso_importacion/DOC_TRACK2_CONTEXTO_DIA_20260713.md)

---

## Track 3 — E2E PE · cliente 5000 · reversión

| Paso | Acción | PASS |
|:----:|--------|:----:|
| 3.1 | Compra stock PE (origen Track 1) | ☐ |
| 3.2 | Cadena: IC/FI → Aprobaciones → Facturación PE → traspaso **5000** | ☐ |
| 3.3 | Visible en **RIMEC Web** catálogo PE | ☐ |
| 3.4 | Compra web Bazzar (cliente 5000) | ☐ |
| 3.5 | **Reversión completa** Bazzar Web → depósito PE RIMEC · solo 5000 | ☐ |

**CHUSAR:** [CHUSAR_FACTURACION_PRONTA_ENTREGA](../2_modulos/2.3_report/facturacion/CHUSAR_FACTURACION_PRONTA_ENTREGA.md) · [CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION](../2_modulos/2.2_rimec_web/CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md) §4 · [DOC_TRACK3_CONTEXTO](../2_modulos/2.3_report/proceso_importacion/DOC_TRACK3_CONTEXTO_DIA_20260713.md)

---

## Conversaciones paralelas

El Director abrirá **varias conversaciones** con Cursor — una por track o sub-tarea. Todas referencian este archivo + `ACTUAL.md`.

---

## Cierre etapa (futuro)

Keyword **Cierra etapa** cuando los tres tracks PASS + reversión 5000 verificada.
