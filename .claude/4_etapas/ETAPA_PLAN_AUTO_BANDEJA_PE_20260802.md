# ETAPA — Planificación · circuito PDF → bandeja

**ID:** `PLAN-AUTO-BANDEJA-PE-20260802`  
**Estado:** ⬛ **CERRADA ADMINISTRATIVA** 2026-08-04 · [CERRADA](./ETAPA_PLAN_AUTO_BANDEJA_PE_20260802_CERRADA.md) · corte Moises  
**Apertura:** 2026-08-02 · plan Cursor confirmado · orden Director  
**Módulos:** **2.3.1.35** Automatización · **2.3.1.36** Mensajes internos  
**No cierra:** `INFORMES-AUTO-MENSAJES-20260801` (sigue en_curso · pausa foco)  
**Donante:** `_absorcion_informes_correo/` · DISCARD IMAP / login dual  
**Cierre día:** banquete local **408 PDF** HECTOR · [2.3.1.36.6](../2_modulos/2.3_report/mensajes_internos/CHUSAR_BANQUETE_BANDEJA_TIPO_V2_CIERRE_DIA_20260802.md)  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

Circuito: **Control PE (35)** → SQL + `horarios[]` → **worker** PDF (PPD AM · partición **Grupo1 × estrategia LP**) → depósito bandeja **Stock pronta entrega** (36) · SMTP servicio solo aviso (anti-saturación casillas).

Ley Documenta 2026-08-02: no son “tres PDFs” — son **tres estrategias LP** × diccionario Grupo 1. Nunca omitir fotos · nunca mezclar caso · nunca mezclar LP.

---

## Alcance (dentro)

| # | Entregable planificación | Estado |
|---|--------------------------|--------|
| 1 | Doc etapa + ACTUAL + `etapas.json` | ✅ 2026-08-02 |
| 2 | Contrato Grupo1 × LP · leyes supremas | ✅ [2.3.1.36.2](../2_modulos/2.3_report/mensajes_internos/CHUSAR_CONTRATO_ENVIO_PDF_BANDEJA_20260802.md) |
| 2b | Piloto HECTOR | ✅ [2.3.1.36.4](../2_modulos/2.3_report/mensajes_internos/CHUSAR_PILOTO_HECTOR_BANDEJA_PE_20260802.md) |
| 2c | Reloj días + hora (sin click) | ✅ [2.3.1.35.6](../2_modulos/2.3_report/automatizacion_informes/CHUSAR_RELOJ_AUTOMATIZACION_DIAS_HORA_20260802.md) · mig 195 |
| 2d | Prep PDF T−10 · mail a T | ✅ [2.3.1.35.7](../2_modulos/2.3_report/automatizacion_informes/CHUSAR_PREP_PDF_T_MENOS_10_20260802.md) |
| 3 | Checklist absorción KEEP → Report | ✅ [2.3.1.36.3](../2_modulos/2.3_report/mensajes_internos/CHUSAR_CHECKLIST_ABSORCION_MAILER_UI_20260802.md) |
| 4 | Frontera 35 vs 36 + anti-saturación | ✅ |
| 5 | Criterios PASS piloto HECTOR | ✅ § Criterios PASS |
| 6 | Hitos post-plan (código) | ✅ § Hitos |

## No-alcance (fuera)

- Compose libre tipo Gmail.  
- IMAP · casilla personal como almacén.  
- Precio listado Motor vivo.  
- Deploy prod sin cierre / orden directa.  
- Contraseñas en Moria.

---

## Frontera 35 vs 36

| | Automatización **2.3.1.35** | Mensajes internos **2.3.1.36** |
|--|----------------------------|--------------------------------|
| Quién | Admin | Destinatario `usuario_v2` (piloto HECTOR) |
| Qué | Ramas árbol Grupo1×LP · usuarios · horarios | Lee bandeja · PDF con fotos |
| Carpeta | — | `STOCK_PRONTA_ENTREGA` |

---

## Criterios PASS (smoke — sin deploy)

Escenario: **Moleca · familia Grupo1×LP · HECTOR**

| # | Check | PASS si |
|---|-------|---------|
| P1 | Automatización | Moleca · destinatario HECTOR · ≥1 horario |
| P2 | Partición | 1 PDF = marca × Grupo1/caso × LP · sin mezclar |
| P3 | Fotos | Ninguna omitida |
| P4 | Precio/qty | PPD AM + stock PE |
| P5 | Bandeja | HECTOR ve PDFs en Stock pronta entrega |
| P6 | Mail | No saturar `ventas_hector@rimec.com.py` |
| P7 | Anti-IMAP | Sin IMAP / login dual |
| P8 | Local | `:3000` · sin deploy prod |

Ejemplo nombres: `Moleca_LPN` · `moleca_comun_lpn` · `MOLECA_PROMO_LPN` · árbol LPC03/LPC04.

---

## Hitos post-plan (código)

| Orden | Hito | Estado |
|------:|------|--------|
| 1 | Mailer servicio (KEEP donante) | ✅ |
| 2 | Worker: particiones Grupo1×LP + PDF fotos | ✅ · banquete 408 |
| 3 | Depósito + aviso SMTP | ✅ depósito · mail selectivo |
| 4 | Descarga adjunto desde bandeja | ✅ |
| 5 | Smoke P1–P8 con HECTOR | 🟡 parcial · banquete en bandeja |
| 6 | Bandeja tipo_v2 · subtotales · pastel NIIF | ✅ **2.3.1.36.6** |
| 7 | **Asignador** por usuario | ⏳ mañana |
| 8 | Banquete en reloj / prep T−10 | ⏳ mañana |

---

## Docs

- [Contrato 2.3.1.36.2](../2_modulos/2.3_report/mensajes_internos/CHUSAR_CONTRATO_ENVIO_PDF_BANDEJA_20260802.md)
- [Piloto HECTOR 2.3.1.36.4](../2_modulos/2.3_report/mensajes_internos/CHUSAR_PILOTO_HECTOR_BANDEJA_PE_20260802.md)
- [Checklist 2.3.1.36.3](../2_modulos/2.3_report/mensajes_internos/CHUSAR_CHECKLIST_ABSORCION_MAILER_UI_20260802.md)
- [Banquete cierre día 2.3.1.36.6](../2_modulos/2.3_report/mensajes_internos/CHUSAR_BANQUETE_BANDEJA_TIPO_V2_CIERRE_DIA_20260802.md)
- [Espíritu 133×3 · 2.3.1.35.11](../2_modulos/2.3_report/automatizacion_informes/CHUSAR_ESPIRITU_GENERADOR_133_LPN_LPC03_LPC04_20260802.md)
- Etapa hermana: [INFORMES-AUTO-MENSAJES-20260801](./ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801.md)
