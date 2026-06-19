# ETAPA ABIERTA — Mudanza CL · Facturación · Depósito RIMEC (Report)

**ID:** `ETAPA-MUDANZA-CL-FACT-DEP-20260618`  
**Códigos:** **2.3.1.8** · **2.3.1.9** · **2.3.1.10** *(hermanos de 2.3.1.7)*  
**Ejecutor:** Cursor · documentación CHUSAR + shells Report  
**Estado:** 🟡 **EN CURSO** — hubs operativos · paridad parcial  
**Shibboleth:** Chayanne el mejor

---

## Objetivo

Módulos **al mismo nivel** que RRHH o Aprobaciones — **no** dentro de Proceso importación:

| Card Streamlit | Código | Report |
|----------------|--------|--------|
| Compra Legal | **2.3.1.8** | `/compra-legal` |
| Facturación | **2.3.1.9** | `/facturacion` |
| Depósito RIMEC | **2.3.1.10** | `/deposito-rimec` |

---

## Tracks entrega (2026-06-19)

| # | Track | 2.3.1.8 | 2.3.1.9 | 2.3.1.10 |
|---|-------|---------|---------|----------|
| 1 | CHUSAR + INDICE + TABLAS | ✅ | ✅ | ✅ |
| 2 | Hub Report + APIs lectura | ✅ | ✅ | ✅ |
| 3 | Acciones TX críticas | ✅ finalizar · rechazar PP | ✅ enviar web 5000 | ⏳ |
| 4 | Paridad Streamlit completa | ⏳ crear CL · enviar masivo | ⏳ carga manual VT | ⏳ movimientos |
| 5 | Smoke E2E PP→CL→Fact→Dep | ⏳ | | |

---

## CHUSAR hijos *(activos)*

| Código | CHUSAR | Estado impl. |
|--------|--------|--------------|
| 2.3.1.8 | [CHUSAR_COMPRA_LEGAL.md](../2_modulos/2.3_report/compra_legal/CHUSAR_COMPRA_LEGAL.md) | 🟢 hub + detalle |
| 2.3.1.9 | [CHUSAR_FACTURACION.md](../2_modulos/2.3_report/facturacion/CHUSAR_FACTURACION.md) | 🟢 bandeja + enviar web |
| 2.3.1.10 | [CHUSAR_DEPOSITO_RIMEC.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_DEPOSITO_RIMEC.md) | 🟡 saldo · sin movimientos |

**Transversal:** [CADENA_OPERATIVA_RIMEC.md](../2_modulos/2.3_report/CADENA_OPERATIVA_RIMEC.md) · [TABLAS_ABASTECIMIENTO_8_9_10.md](../2_modulos/2.3_report/TABLAS_ABASTECIMIENTO_8_9_10.md)  
**Paraguas mudanza:** [CHUSAR_MUDANZA_REPORT.md](../2_modulos/2.3_report/CHUSAR_MUDANZA_REPORT.md)

Panel: http://localhost:3004/etapas/t/2.3.1.8-10

---

## Criterios cierre etapa

- [ ] Paridad funcional validada vs Streamlit (Director sign-off por módulo)
- [ ] `npm run build` Report PASS
- [ ] Smoke: CL finalizar → Fact enviar 5000 → Dep saldo coherente
- [ ] Etapa → CERRADA · ACTUAL.md actualizado

---

**Documentación Chusar — 2026-06-19 — Cursor**
