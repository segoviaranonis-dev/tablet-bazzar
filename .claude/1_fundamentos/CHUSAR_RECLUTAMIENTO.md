# CHUSAR — Reclutamiento · Demo IA Nexus

**Código etapa:** **HOLD-RECLUTAMIENTO-2026**  
**Etapa:** [ETAPA_RECLUTAMIENTO.md](../4_etapas/ETAPA_RECLUTAMIENTO.md) — **mapa visual pasos**  
**Estado :3004:** 🟢 **1 de 3 abiertas** · foco sesión hoy · cierre semana 2026-07-03  
**Uso:** guión mínimo para agentes Cursor/Claude durante visita demo

---

## Pipeline visual (9 pasos)

```
[0 Pre-flight] → [1 Hub] → [2 Etapas] → [3 Agentes] → [4 Report] → [5 Depósito] → [6 Tablet?] → [7 IA vivo] → [8 Cierre]
```

| # | Paso | Check |
|---|------|-------|
| 0 | Apps :3001 + :3004 + login | ☐ |
| 1 | http://localhost:3004/hub | ☐ |
| 2 | http://localhost:3004/etapas/t/HOLD-RECLUTAMIENTO-2026 | ☐ |
| 3 | Equipo · `.cursorrules` · OT | ☐ |
| 4 | http://localhost:3001 | ☐ |
| 5 | Depósito 2100 operativa | ☐ |
| 6 | Tablet :3002 (opcional) | ☐ |
| 7 | Fix acotado o flujo demo | ☐ |
| 8 | Feedback Director | ☐ |

Diagrama Mermaid completo → [ETAPA_RECLUTAMIENTO.md](../4_etapas/ETAPA_RECLUTAMIENTO.md#mapa-visual--pasos-del-reclutamiento)

---

## CHUSAR (5 líneas)

1. **C**ontexto — holding RIMEC: importadora, pilares, Report + Nexus + Tablet.  
2. **H**oy — etapa demo; no tocar Sales Report ni resets transaccionales.  
3. **U**bicación — docs en `.claude/` · apps en sub-repos · OT en `ot/`.  
4. **S**cope — mostrar, no refactorizar; fixes solo si Director pide en vivo.  
5. **R**esultado — invitados entienden equipo de agentes + una pantalla real funcionando.

---

## Frases listas (Director)

| Situación | Decir |
|-----------|--------|
| Abrir demo | «Ejecuta la demo de reclutamiento — depósito operativa primero.» |
| Mostrar IA | «Cursor, explicá en 3 líneas qué es esta etapa y abrí el panel de etapas.» |
| Cierre visita | «Documentá feedback de la visita en la etapa reclutamiento.» |

---

## URLs demo

| Qué | URL |
|-----|-----|
| Hub holding | http://localhost:3004/hub |
| Etapas | http://localhost:3004/etapas |
| Esta etapa | http://localhost:3004/etapas/t/HOLD-RECLUTAMIENTO-2026 |
| Report | http://localhost:3001 |
| Depósito Operativa | http://localhost:3001/depositos-bazzar/2100?tab=operativa |

---

## Prohibido en sesión demo

- Commits/push sin orden explícita del Director  
- `TRUNCATE` / migraciones no ensayadas  
- Afirmar «funciona» sin ver pantalla del Director  
- Crear carpetas fuera de [ESTRUCTURA_OBLIGATORIA.md](./1.3_politicas/ESTRUCTURA_OBLIGATORIA.md)

---

**Agente memoria:** al cerrar visita, actualizar `ACTUAL.md` + `config/etapas.json` estado `hecho` si aplica.
