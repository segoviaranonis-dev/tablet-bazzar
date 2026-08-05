# ETAPA: ROLES Y ACCESOS — ACTIVA

**Fecha inicio:** 2026-06-11  
**Estado:** ✅ CERRADA — Fase 2 [ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md](./ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md)  
**Ejecutores:** Cursor (auditoría + doc + Report + BD) · Claude Code (Streamlit + SQL `usuario_v2`)  
**Verificador:** Cursor

---

## Objetivo de la etapa

Unificar y blindar **roles y accesos** en todo el holding Nexus: una sola verdad en `usuario_v2`, misma semántica en **Streamlit**, **Report** y apps Next.js.

**Éxito =** cualquier usuario entra donde le corresponde; nadie ve módulos prohibidos; Nivel Dios operativo sin fricción; matriz documentada y enforced en código.

---

## Matriz canónica (Director — 2026-06-11)

**Documento único:** [MATRIZ_ROLES_ACCESOS_HOLDING.md](../1_fundamentos/1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md)

| Empresa | rol | Categoria | Resumen |
|---------|-----|-----------|---------|
| RIMEC | 1 | DIOS | TOTAL en las 4 herramientas |
| RIMEC | 1 | ADMIN | Todo menos Aprobación de pedidos |
| RIMEC | 1 | VENDEDOR | Web total; Report ventas-fotos; Streamlit/Tablet prohibido |
| BAZZAR | 2 | ADMIN | Report Bazzar + Tablet + **RIMEC Web** |
| BAZZAR | 2 | VENDEDOR | Solo Tablet total; sin RIMEC Web/Report/Streamlit |

**Regla:** `rol_id` = empresa; `categoria` = matiz o **DIOS** (Nivel Dios).

---

## Trabajo ya hecho (base de la etapa)

| App | Cambio |
|-----|--------|
| **Report** | Gate `/aprobaciones` → `rol_id=1` + `DIOS`; resto rol 1 sin DIOS OK |
| **Report** | Login case-insensitive; fix hash legacy `\n` |
| **Streamlit** | `AuthManager.is_nivel_dios()` + `has_full_access()`; DIOS pase libre |
| **Streamlit** | Login case-insensitive; hash legacy; `rol_id` en sesión |

Pendiente subir a git en `control_central/` (Streamlit auth) si Director autoriza.

---

## Entregables de la etapa

1. **Doc única** — ✅ `1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md` + regla Cursor + memoria Claude
2. **SQL auditoría** — listar `usuario_v2` con `rol_id`, `categoria`, inconsistencias
3. **Report** — commit/push pendientes (auth + aprobaciones + roles UI)
4. **Streamlit** — commit auth DIOS + registry
5. **Smoke tests** — Guido (DIOS), Tito (ADMIN rol 1), rol 2 retail, rol 3 fotos
6. **Alineación** `maestro_rol_acceso` / migración 066 si hay drift

---

## Fuera de alcance

- Nuevos módulos de negocio
- Tablet Bazzar tickets ORO (pausado — retoma al cerrar esta etapa o por orden Director)
- Cambiar permisos de Sales Report blindado

---

## Etapas relacionadas

| Etapa | Estado |
|-------|--------|
| Aprobaciones Nivel Dios Report | ✅ Cerrada — `ETAPA_APROBACIONES_NIVEL_DIOS_CERRADA.md` |
| Tablet Bazzar | ⏸ Pausada |
| **Roles y accesos** | ✅ Cerrada — `ETAPA_ROLES_Y_ACCESOS_CERRADA.md` |

---

## Regla activa

**ACTUAL.md apunta aquí → CODE permitido en auth, middleware, `usuario_v2`, docs de roles.**

---

**Última actualización:** 2026-06-11
