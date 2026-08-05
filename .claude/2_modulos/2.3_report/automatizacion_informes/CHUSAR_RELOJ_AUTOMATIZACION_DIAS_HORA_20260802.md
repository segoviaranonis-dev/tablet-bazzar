# 2.3.1.35.6 — Reloj interno · días + hora (sin interacción humana)

**Código:** **2.3.1.35.6**  
**Fecha:** 2026-08-02 · **Documenta**  
**Etapa:** `PLAN-AUTO-BANDEJA-PE-20260802`  
**Hermano bandeja:** **2.3.1.36**  
**Shibboleth:** Andrés, el que viene.

---

## Ley de producto

**Automatización** = el humano solo define parámetros una vez.  
El **reloj** ejecuta solo: **día(s) de semana + hora(s)** → PDF → bandeja (+ outbox/SMTP).

Ejemplo Director: **todos los lunes a las 08:03**.

| Campo | Dónde | Ejemplo |
|-------|--------|---------|
| `dias_semana` | `informe_automatizacion_envio` | `{1}` = lunes (ISO 1=lun…7=dom) |
| `horarios` | misma tabla | `{08:03}` |
| Zona | worker | `America/Asuncion` |

---

## Anti-doble

Tabla `informe_automatizacion_tick` · PK `(automatizacion_id, slot_key)`.  
`slot_key` = `YYYY-MM-DDTHH:MM` (fecha Asunción). Un slot = un disparo.

---

## Worker (local / servicio)

```bash
cd report
npm run worker:auto-informes
```

- Poll default 30s (`AUTO_RELOJ_MS`).  
- Debe quedar **corriendo** (PC/servicio). Sin worker = no hay disparo a las 08:03.  
- UI **Ejecutar ahora** = manual de prueba; el camino canónico es el reloj.

Mig: `195_informe_automatizacion_reloj.sql`.

---

## Código

| Pieza | Ruta |
|-------|------|
| Reloj TZ | `report/src/lib/automatizacion-informes/reloj.ts` |
| Tick | `report/src/lib/automatizacion-informes/tick-reloj.ts` |
| Worker | `report/scripts/_worker_automatizacion_reloj.ts` |
| UI días | `ControlProntaEntregaPanel.tsx` |
| API | `POST /api/automatizacion-informes/crear` · `dias_semana` |

---

## Prohibido

- Depender del click humano para el ciclo diario.  
- Disparar dos veces el mismo slot.  
- Ignorar zona Asunción (evitar “hora UTC”).
