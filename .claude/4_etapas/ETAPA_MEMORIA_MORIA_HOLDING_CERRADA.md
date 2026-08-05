# ETAPA CERRADA — Memoria Moria · Holding conectado

**Código:** `6.00.00.040` · **Cerrada:** 2026-06-15 · **Director:** Héctor Segovia

---

## Objetivo cumplido

Unificar memoria del holding: **Moria primaria** (índice) + **secundaria** (`.claude/`) + **repos operativos indexados** (sin mover doc de app).

---

## Entregables

| Entrega | Ruta |
|---------|------|
| Moria primaria + leyes §0 | `.claude/MORIA_PRIMARIA.md` |
| Plan codificación | `.claude/PLAN_CODIFICACION.md` |
| Catálogo completo | `.claude/CODIGO_MAESTRO.md` (388 entradas) |
| Conector repos | `.claude/2_modulos/ENLACES_REPOS.md` |
| Generador | `control_central/scripts/generar_codigo_maestro.py` |

---

## Regla final (ratificada)

| Ubicación | Qué va | Índice |
|-----------|--------|--------|
| `.claude/` | Memoria holding, etapas, OT, arq, errores | `CODIGO_MAESTRO` Parte A |
| `[repo]/docs/` y raíz app | Doc operativa (deploy, módulo, AGENTS) | `CODIGO_MAESTRO` Parte B · grupo **90** |
| Raíz `Nexus_Core/` | **Solo** `README.md` + `SECURITY.md` | — |

---

## Acciones ejecutadas

- Huérfanos raíz → `.claude/` (CONTEXTO_PPT, CURSOR_CONTINUAR…)
- 17 `.md` sueltos en `.claude/` raíz → carpetas numeradas
- Legacy `etapas/` → redirige a `4_etapas/`
- 88 docs de repos indexados sin mover

---

## Mantenimiento

Tras crear doc: guardar en ubicación correcta → `python control_central/scripts/generar_codigo_maestro.py`

**Shibboleth:** 5 patas ✅
