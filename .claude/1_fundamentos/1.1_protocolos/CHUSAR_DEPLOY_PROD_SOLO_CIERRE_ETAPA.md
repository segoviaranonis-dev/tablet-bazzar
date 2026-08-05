# CHUSAR — Deploy producción solo cierre etapa

**Código:** `5.01.00.020`  
**Ratificado:** Director Héctor · 2026-07-06  
**Estado:** INVIOLABLE · todos los agentes

---

## Regla

| Capa | Local | Producción (Git + Vercel + Supabase prod) |
|------|-------|-------------------------------------------|
| Código app | Desarrollo libre | **Solo** cierre etapa **o** orden directa Director |
| Migraciones BD | Rama / OT | **Solo** cierre etapa **o** orden directa Director |

**Incendio / hotfix local no autoriza prod.**

---

## Dos puertas válidas

1. **Cierre etapa canónico** — `1.1.10_protocolo_cierre_etapa.md` + `etapas.json` (`hecho` en `:3004`)
2. **Pedido directo Director (Héctor)** — frase explícita en el turno (*despliega*, *subilo*, *push*, etc.)

---

## Implementación Cursor

- Regla alwaysApply: `.cursor/rules/chusar-deploy-solo-cierre-etapa.mdc`
- Permissions: `.cursor/permissions.json`
- Sello vigente rimec-web: commit `f408fc2` · `ot/DEPLOY-RIMEC-WEB-SELLADO-20260706.md`

---

## Lección 2026-07-06

Deploy `f408fc2` durante incendio catálogo **sin** etapa cerrada. Prod OK; trazabilidad Portal incompleta. Regla creada para no repetir.

---

**Keyword Documenta:** Director 2026-07-06
