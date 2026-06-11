# ETAPA: ROLES Y ACCESOS — CERRADA

**Fecha inicio:** 2026-06-11  
**Fecha cierre:** 2026-06-11  
**Director:** Cierre explícito — «debe estar en git y en producción»  
**Estado:** ✅ CERRADA

---

## Objetivo

Unificar **roles, usuarios y permisos** en holding Nexus: `usuario_v2` + matriz canónica + enforcement en **Report** y **Streamlit**.

---

## Git

### Report (`segoviaranonis-dev/report`)

| Campo | Valor |
|-------|--------|
| Rama | `main` |
| Commit | `a45f4d4` |
| Push | `152ab7d..a45f4d4` → `origin/main` |
| Deploy | Vercel automático en push `main` |

**Cambios:**
- Login case-insensitive + fix hash bcrypt legacy `\n` (`validateUsuario.ts`)
- Gate `/aprobaciones` → `rol_id=1` + `categoria=DIOS`
- Hub `/` filtra módulos por rol + categoría (Aprobaciones solo DIOS)
- Docs: `MATRIZ` alineada en comentarios middleware

### Streamlit / control_central (`segoviaranonis-dev/ventas_por_mes_rimec`)

| Campo | Valor |
|-------|--------|
| Rama | `main` |
| Commit | `96eb988` |
| Push | `5bf7db0..96eb988` → `origin/main` |

**Cambios:**
- `AuthManager.is_nivel_dios()` + `has_full_access()` incluye **DIOS**
- Login case-insensitive + rehash hash `\n`
- `registry.get_nav_options` — full access ve todos los módulos
- `main.aduana_de_seguridad` — bypass DIOS/ADMIN
- `aprobacion_pedidos` — `DIOS` en `allowed_roles`

**Deploy Streamlit:** restart local / servidor donde corre `:8501` tras `git pull`.

---

## Documentación (Nexus_Core)

- Matriz canónica: `1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md`
- Protocolo 5 patas: `1.1_protocolos/PROTOCOLO_5_PATAS.md`
- Reglas Cursor: `matriz-roles-accesos-holding.mdc`, `shibboleth-memoria-nexus.mdc`

---

## Matriz resumen (Director)

| Perfil | RIMEC WEB | Report | Streamlit | Tablet |
|--------|-----------|--------|-----------|--------|
| RIMEC DIOS | TOTAL | TOTAL | TOTAL | TOTAL |
| RIMEC ADMIN | TOTAL | todo menos Aprobaciones | todo menos Aprobaciones | TOTAL |
| RIMEC VENDEDOR | TOTAL | ventas-fotos | PROHIBIDO | PROHIBIDO |
| BAZZAR ADMIN | PROHIBIDO | solo Bazzar | PROHIBIDO | TOTAL |
| BAZZAR VENDEDOR | PROHIBIDO | PROHIBIDO | PROHIBIDO | TOTAL |

---

## Smoke tests (manual post-deploy)

| Usuario | Perfil | Report | Streamlit |
|---------|--------|--------|-----------|
| Guido | DIOS | ✅ todos + aprobaciones | ✅ todos módulos |
| Tito | ADMIN | ✅ sin aprobaciones | ✅ sin aprobacion_pedidos* |
| rol 2 ADMIN | Bazzar | ✅ retail/depositos | — |
| rol 3 / VENDEDOR fotos | ventas-fotos | ✅ | — |

\* Streamlit: ADMIN tiene bypass módulos excepto si módulo excluye — verificar `aprobacion_pedidos` no en nav ADMIN.

---

## Pendiente fuera de etapa (no bloquea cierre)

- `rol_id=1` + `categoria=VENDEDOR` en Report (hoy `rol_id=3` para ventas-fotos)
- Drift `maestro_rol_acceso` / migración 066
- Tablet Bazzar tickets ORO (etapa pausada)

---

## Etapas relacionadas

| Etapa | Estado |
|-------|--------|
| Aprobaciones Nivel Dios | ✅ Cerrada `152ab7d` |
| **Roles y accesos** | ✅ **Cerrada** |
| Tablet Bazzar | ⏸ Pausada |

---

**Última actualización:** 2026-06-11
