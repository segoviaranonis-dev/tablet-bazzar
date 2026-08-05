# CORTE ADMINISTRATIVO — Moises (pre-mudanza)

**Fecha:** 2026-08-04  
**Orden Director:** cierre de **todas** las etapas abiertas + corte administrativo · mudanza a entorno profesional  
**Etapa viva que permanece:** `MOISES-20260804`  
**Shibboleth:** Andrés, el que viene.

---

## Por qué

El holding operaba en un **entorno personal** (cuenta/suscripciones dispersas). El Director ordena pasar a un entorno **más profesional, cerrado y seguro**, con **menos suscripciones**, anclado en `rimec.py@gmail.com` (GitHub + Supabase + Vercel enlazados).

Antes de mudarnos: **congelar el maratón de etapas de producto** — deuda queda registrada, no se sigue abriendo foco en la orilla vieja.

---

## Etapas cerradas por este corte (administrativo)

| Code | Módulo | Doc CERRADA | Naturaleza del cierre |
|------|--------|-------------|------------------------|
| `SALES-REPORT-PDFS-20260804` | report | [ETAPA_SALES_REPORT_PDFS_20260804_CERRADA.md](./ETAPA_SALES_REPORT_PDFS_20260804_CERRADA.md) | Admin · deuda PDF SR |
| `PLAN-AUTO-BANDEJA-PE-20260802` | report | [ETAPA_PLAN_AUTO_BANDEJA_PE_20260802_CERRADA.md](./ETAPA_PLAN_AUTO_BANDEJA_PE_20260802_CERRADA.md) | Admin · asignador/cron |
| `INFORMES-AUTO-MENSAJES-20260801` | report | [ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801_CERRADA.md](./ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801_CERRADA.md) | Admin · cocina viva |
| `LOGISTICA-RIMEC-TXT-20260728` | report | [ETAPA_LOGISTICA_RIMEC_TXT_20260728_CERRADA.md](./ETAPA_LOGISTICA_RIMEC_TXT_20260728_CERRADA.md) | Admin · TXT/prod |
| `CP-CONFECCIONES-OK-20260729` | rimec-web | [ETAPA_CP_CONFECCIONES_OK_20260729_CERRADA.md](./ETAPA_CP_CONFECCIONES_OK_20260729_CERRADA.md) | Admin · CP 638 |
| `HOTFIX-CATALOGO-TODOS-CALZADO-20260801` | rimec-web | [ETAPA_HOTFIX_CATALOGO_TODOS_CALZADO_20260801_CERRADA.md](./ETAPA_HOTFIX_CATALOGO_TODOS_CALZADO_20260801_CERRADA.md) | Admin · hotfix landing |

**No cerrada:** `MOISES-20260804` — es el vehículo de la mudanza.

---

## Qué significa “cierre administrativo”

| Sí | No |
|----|-----|
| `etapas.json` → `estado: "hecho"` + fila en `cerradasPorModulo` | Declarar features “terminadas” al 100% |
| Congelar foco producto en orilla personal | Borrar código ni repos |
| Deuda pasa a backlog post-Moises / orilla nueva | Cutover Git/Supabase/Vercel automático |
| Una sola etapa viva: Moises | Cerrar Moises |

**Reapertura:** solo con **Nueva etapa** / **Inicia etapa** en el entorno profesional, citando la deuda.

---

## Norte post-corte (Moises)

1. Rueda de auxilio (tags · backups · builds).  
2. Orilla `rimec.py@gmail.com` profesional.  
3. Menos suscripciones · cuentas enlazadas · OPS ≠ TEST.  
4. Agente portable (CHUNA igual en cualquier máquina).  
5. Cutover **solo** con orden explícita Director.

Doc plan: [ETAPA_MOISES_20260804.md](./ETAPA_MOISES_20260804.md)

---

## Cierre Navegador (:3004) — este corte

| Check | Hecho |
|-------|:-----:|
| 6 etapas → `hecho` en `trabajoVivo` | ✅ |
| Entradas en `cerradasPorModulo` | ✅ |
| `MOISES` sigue `en_curso` + `sesionActiva` | ✅ |
| `actualizado` bump | ✅ |
| Verificado `:3004/etapas` | ⏳ Director / smoke local |

---

**Corte administrativo 2026-08-04 — orden Director · mudanza Moises.**
