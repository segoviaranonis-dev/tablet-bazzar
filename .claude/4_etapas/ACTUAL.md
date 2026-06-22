# ACTUAL — Etapa activa Nexus · Maratón

**Actualizado:** 2026-06-22 · **CHUSAR mudanza:** [CHUSAR_MUDANZA_REPORT.md](../2_modulos/2.3_report/CHUSAR_MUDANZA_REPORT.md)

**Panel:** http://localhost:3004/etapas · **CHUSAR:** ACTIVO · **Governance P8–P11:** ACTIVO

---

## Cierre reciente

| Etapa | Código | Doc |
|-------|--------|-----|
| **Importación precios Report** | **2.3.1.7.2** | [ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md](./ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md) |

Flujo 0–4 + historial listas · dev `:3001` · Moria actualizada.

---

## Objetivo general — MUDANZA + GOVERNANCE

Portar ciclo RIMEC **Streamlit → Report** por sub-etapas. Etapa paraguas: [ETAPA_MUDANZA_REPORT.md](./ETAPA_MUDANZA_REPORT.md)

**Cimiento:** [PIEDRA_CIMIENTO_COSTO_ARTICULO.md](../1_fundamentos/PIEDRA_CIMIENTO_COSTO_ARTICULO.md)  
**Bitácora / bloqueo / reversiones:** [PROTOCOLO_BITACORA_USUARIOS_Y_REVERSIONES.md](../1_fundamentos/1.1_protocolos/PROTOCOLO_BITACORA_USUARIOS_Y_REVERSIONES.md)

---

## Governance activo (2026-06-19)

| Capacidad | Dónde |
|-----------|--------|
| Cierre post-COMPRA (PP ENVIADO) | `core/holding_governance.py` · PP UI bloqueada |
| Bitácora holding | Report → http://localhost:3000/holding/bitacora |
| Bloqueo usuario BD | MIG-119 · API `/api/holding/usuarios` |
| Reversión PP desde CL | Solo `NEXUS_HOLDING_REVERSAL=1` + OT en Streamlit |
| Sesiones Report invalidadas | `REPORT_SESSION_VERSION=3` |

---

## Foco Cursor — Abastecimiento (hermanos RIMEC)

**Sub-etapa:** [ETAPA_MUDANZA_CL_FACT_DEP_REPORT.md](./ETAPA_MUDANZA_CL_FACT_DEP_REPORT.md)

| Módulo | Código | App |
|--------|--------|-----|
| Compra legal | **2.3.1.8** | http://localhost:3000/compra-legal |
| Facturación | **2.3.1.9** | http://localhost:3000/facturacion |
| Depósito RIMEC | **2.3.1.10** | http://localhost:3000/deposito-rimec |

**2.3.1.7** Proceso importación — **7.2 ✅ cerrada** · pendiente **7.3 IC · 7.4 Digitación · 7.5 PP**.

Panel: http://localhost:3004/etapas/t/2.3.1.8-10

**Shibboleth:** Chayanne el mejor
