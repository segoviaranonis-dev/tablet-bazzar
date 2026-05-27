# OT-RESTABLECIMIENTO-NEXUS-CORE-001 — Orden de la casa post-migración

**Estado:** IMPLEMENTADA (documentación + `.cursorrules`) — pendiente validación Director  
**Fecha:** 2026-05-18  
**Ejecutor:** Cursor (estructura) + Director (abrir workspace) + Claude (git en cada repo si hace falta)

## Objetivo

Dejar **Nexus Core** como entorno único, gobernado y sin mezcla con `Documents\Prg_locales`, con:

- Reglas únicas (`.cursorrules` en raíz holding)
- Red `docs/` + `roles/`
- Mapa de 4 repos
- Deprecación explícita de reglas `.mdc` duplicadas

## Rutas oficiales

```
C:\Users\hecto\Nexus_Core\
├── .cursorrules
├── README.md
├── docs\
├── roles\
├── control_central\    ← ex ventas_por_mes_rimec
├── rimec-web\
├── bazzar-web\
└── report\
```

## Fase A — Estructura holding (Cursor) ✅

| Entregable | Ruta |
|------------|------|
| Reglas únicas | `.cursorrules` |
| Índice casa | `README.md` |
| Contrato arquitectura | `docs/CONTRATO_ARQUITECTURA.md` |
| Equipo | `docs/EQUIPO_Y_ROLES.md` |
| Flujo OT | `docs/FLUJO_OT_Y_AUDITORIA.md` |
| Mapa repos | `docs/MAPA_REPOS.md` |
| Roles agentes | `roles/CURSOR-AUTO.md`, `CLAUDE-CODE-DB.md`, `ANTIGRAVITY-DISENO.md` |

## Fase B — Director (manual)

1. **Cursor → Open Folder** → `C:\Users\hecto\Nexus_Core`
2. Verificar que el chat cite `.cursorrules` y pilares FK
3. En cada repo: `git remote -v` y `git status` (sin paths rotos)
4. Streamlit Cloud: apuntar repo `control_central` si cambió nombre carpeta en GitHub (solo si el remoto cambió)

## Fase C — Claude Code (opcional, 1 commit por repo)

- [ ] `control_central/docs/NEXUS_CORE_INDEX.md` — enlace a `../../docs/`
- [ ] Archivar o eliminar `.cursor/rules/*.mdc` si el Director confirma solo `.cursorrules` padre
- [ ] Actualizar paths en OTs viejos que digan `Prg_locales` → `Nexus_Core`

## Fase D — Antigravity (opcional)

- [ ] Revisar barra 4 pasos Motor (post OT-519) vs guía visual marca

## Prohibido

- Mover secretos a Git
- TRUNCATE pilares/biblioteca en “limpieza”
- Duplicar contrato en 5 archivos `.mdc` sin sincronizar

## Criterios de aceptación

| # | Criterio |
|---|----------|
| T1 | Workspace Cursor = `Nexus_Core` |
| T2 | Un solo `.cursorrules` activo (raíz holding) |
| T3 | Equipo puede citar `roles/*.md` sin ambigüedad |
| T4 | `control_central` corre Streamlit local/remoto |

## Siguiente OT sugerida

**OT-MOTOR-SQL-520** — Cálculo `precio_lista` set-based + índice `(evento_id, linea_id, referencia_id, material_id)` (auditoría rendimiento Director).

**No pedir confirmación al director para Fase A (ya aplicada).**
