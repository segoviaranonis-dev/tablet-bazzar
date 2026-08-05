# 2.3.1.35.7 — Preparación PDF T−10 · aviso mail a la hora

**Código:** **2.3.1.35.7**  
**Fecha:** 2026-08-02 · **Documenta**  
**Padre reloj:** [2.3.1.35.6](./CHUSAR_RELOJ_AUTOMATIZACION_DIAS_HORA_20260802.md)  
**Shibboleth:** Andrés, el que viene.

---

## Problema

Generar PDF con **todas las fotos** en el mismo minuto del envío provoca timeouts, fotos vacías o incompletas.

## Ley

| Momento | Acción |
|---------|--------|
| **T − 10 min** (configurable `AUTO_PREP_MINUTES`) | Generar PDF (fotos) + depositar en bandeja Stock PE |
| **T** (hora del horario) | Solo **email de aviso** liviano (sin adjuntos PDF por defecto) |

Ejemplo: envío **12:00** → prep arranca **11:50** · mail **12:00**.

Zona: `America/Asuncion`. Slots anti-doble: `…:prep` y `…:mail`.

Si a las T no hay prep OK → fallback **full** de emergencia (log warning).

---

## Worker

```bash
npm run worker:auto-informes
```

Env opcional: `AUTO_PREP_MINUTES=10` · `PE_PDF_MAX` · `PE_PDF_ROW_LIMIT`.

---

## Prueba Director 2026-08-02

Envío **12:00** todos los días · HECTOR · prep **11:50**.
