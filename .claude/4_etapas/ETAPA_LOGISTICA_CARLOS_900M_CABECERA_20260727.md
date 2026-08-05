# ETAPA (BORRADOR) — Logística · Cabeceras Carlos ~900M Gs

**ID:** `LOGISTICA-CARLOS-900M-CABECERA-20260727`  
**Código módulo:** **2.3.1.28.10**  
**Estado:** ⏸ **SUPERSEDIDO** — 2026-07-28 · activada como **Logística Rimec** (fuente = TXT, no Excel)  
**Etapa activa:** [ETAPA_LOGISTICA_RIMEC_TXT_20260728.md](./ETAPA_LOGISTICA_RIMEC_TXT_20260728.md) · code `LOGISTICA-RIMEC-TXT-20260728`  
**App:** http://localhost:3000/logistica-ok  
**Plan canónico:** [CHUSAR_LOGISTICA_CARLOS_900M_CABECERA_EXCEL_20260727.md](../2_modulos/2.3_report/logistica_ok/CHUSAR_LOGISTICA_CARLOS_900M_CABECERA_EXCEL_20260727.md)  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

Traer a **Logística OK** el backlog de cabeceras del sistema Carlos (~ **Gs 900M** sin confirmar) vía **Excel**, **integrado** al proceso de logística, con **color distinto** para no confundirlo con FI nativas / sync cierre completo.

---

## Alcance (Fase 1 — cabecera)

| # | Entregable | Estado |
|---|------------|--------|
| 1 | Spec columnas Excel cabecera | ⏳ al abrir etapa |
| 2 | Import → bandeja Logística + flag origen | ⏳ |
| 3 | UI color / chip diferenciador | ⏳ |
| 4 | Smoke montos ≈ 900M + pestaña GENERAL | ⏳ |
| 5 | Empareje detalle FI / Ley acordeón | ⏳ según dato |

---

## Fuera de alcance inicial

- Cierre CSV completo IC+FI+pv_global por PP (**2.3.1.7.5.3.9**) salvo puente explícito.
- Deploy prod sin cierre u orden directa.

---

## Checklist al activar (**Nueva etapa**)

1. Este archivo → estado **EN CURSO**.  
2. `ACTUAL.md` → foco = este code.  
3. `etapas.json` → `trabajoVivo` + `"estado": "en_curso"`.  
4. Arrancar spec Excel + color con Director.

---

## Docs

- Plan: **2.3.1.28.10**  
- Padre Logística: **2.3.1.28** · [logistica_ok/INDICE.md](../2_modulos/2.3_report/logistica_ok/INDICE.md)
