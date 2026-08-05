# ETAPA — Informes automáticos + Mensajes internos

**ID:** `INFORMES-AUTO-MENSAJES-20260801`  
**Estado:** ⬛ **CERRADA ADMINISTRATIVA** 2026-08-04 · [CERRADA](./ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801_CERRADA.md) · corte Moises  
**Apertura:** 2026-08-01 · **Documenta** + orden Director (dos módulos · una etapa)  
**Plan hermano:** [ETAPA_PLAN_AUTO_BANDEJA_PE_20260802.md](./ETAPA_PLAN_AUTO_BANDEJA_PE_20260802.md) — circuito PDF→bandeja (no cierra esta etapa)  
**Absorbe:** `AUTOMATIZACION-INFORMES-20260730` (fachada 2.3.1.35)  
**Fuente bruta (no canónica):** `_absorcion_informes_correo/` · GitHub `informes_correo`  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

Armar en Report dos productos hermanos bajo una sola etapa:

| Código | Módulo | Ruta | Rol |
|--------|--------|------|-----|
| **2.3.1.35** | Automatización de informes | `/automatizacion-informes` | Admin gerentes · catálogo · export · envío email (SMTP servicio) |
| **2.3.1.36** | Mensajes internos | `/mensajes-internos` | Inbox por `usuario_v2` · avisos · PDF pesados en backend |

**Ley:** Nexus manda nombres, auth y códigos. El repo `informes_correo` es donante de piezas, no verdad Chusar.

---

## Alcance

| # | Entregable | Estado |
|---|------------|--------|
| 1 | Etapa unificada + ACTUAL + `etapas.json` + árbol | ✅ 2026-08-01 |
| 2 | CHUSAR 2.3.1.35 corregido (absorción selectiva · anti-2.3.1.29) | ✅ |
| 3 | CHUSAR 2.3.1.36 Mensajes internos (fachada) | ✅ |
| 4 | Lección violaciones arquitectura (plan estudios) | ✅ |
| 5 | Fachada UI ambos módulos + hub + middleware | ✅ scaffold |
| 5b | Control PE · multi-usuarios + multi-horarios (**2.3.1.35.5**) · mig 192+193 | ✅ Documenta 2026-08-01 |
| 6 | API descarga Cliente↔Cadena (Automatización) | ⏳ |
| 7 | SMTP / cron PDF worker (consume `horarios[]` + destinatarios) | ⏳ |
| 8 | Persistencia mensajes internos + PDF worker | ⏳ |
| 9 | Smoke + deploy (solo cierre u orden Director) | ⏳ |

---

## Prohibido

- Reclamar código **2.3.1.29** (ya es PP abierto reposición).
- Auth dual / IMAP personal como producto.
- Mutar Sales Report blindado (`registro_ventas_general_v2`).
- Deploy prod sin cierre de etapa u orden directa.

---

## Docs

- [CHUSAR Automatización 2.3.1.35](../2_modulos/2.3_report/automatizacion_informes/CHUSAR_AUTOMATIZACION_INFORMES_20260730.md)
- [CHUSAR Destinatarios multi-horarios 2.3.1.35.5](../2_modulos/2.3_report/automatizacion_informes/CHUSAR_DESTINATARIOS_MULTI_HORARIOS_20260801.md)
- [CHUSAR Mensajes 2.3.1.36](../2_modulos/2.3_report/mensajes_internos/CHUSAR_MENSAJES_INTERNOS_20260801.md)
- [Lección violaciones · plan estudios](../2_modulos/2.3_report/CHUSAR_LECCION_VIOLACIONES_INFORMES_CORREO_20260801.md)
- Etapa previa: [ETAPA_AUTOMATIZACION_INFORMES_20260730.md](./ETAPA_AUTOMATIZACION_INFORMES_20260730.md) (absorbida)
