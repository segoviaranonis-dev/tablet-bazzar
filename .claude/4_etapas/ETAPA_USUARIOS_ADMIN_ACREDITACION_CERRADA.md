# ETAPA CERRADA — Administrador Usuarios + Acreditación por Ente (Report)

**Código:** **2.3.5.4**  
**Fecha cierre:** 2026-06-10  
**Director:** cierre explícito — «cierra etapa y documenta todo · protocolo chusar»  
**Estado:** ✅ **CERRADA** (taller local + auth holding en dev)

---

## Objetivo

1. Módulo **Administrador de Usuarios** en `/pilares/usuarios` (solo dev local).  
2. **Usuario (`usuario_v2`) independiente de funcionario RRHH** — pilar de acceso, no hijo de `funcionarios`.  
3. **Acreditación Report por ente** — tienda Bazzar (cod 2–4) no ve módulos RIMEC ni Bazzar Web en header.

---

## Entregables ✅

| # | Entrega | Evidencia |
|---|---------|-----------|
| 1 | UI alta manual + import Excel → `usuario_v2` | `report/src/app/pilares/usuarios/` |
| 2 | API CRUD local | `report/src/app/api/pilares/usuarios-admin/` |
| 3 | Ley triada app (sin funcionario) | `report/src/lib/usuarios-admin/leyes.ts` |
| 4 | Trigger BD sin `funcionario_id` obligatorio | `fn_validar_usuario_triada()` · script `fix_fn_validar_usuario_triada.py` |
| 5 | Acreditación ente en sesión + hub + middleware | `ente-acceso.ts` · `REPORT_SESSION_VERSION=4` |
| 6 | Import RRHH tiendas (tabla `funcionarios`, separado) | `scripts/importar_rrhh_tiendas.py` |
| 7 | Doc CHUSAR + app | este archivo · `CHUSAR_USUARIOS_ADMIN.md` · `report/docs/USUARIOS_ADMIN_LOCAL.md` |

---

## Reglas de negocio (canónicas post-cierre)

### Usuario ≠ funcionario

| Entidad | Rol | Regla |
|---------|-----|-------|
| **`usuario_v2`** | Pilar acceso | login, `password_hash`, `ente_id`, `rol_id`, `categoria_id` |
| **`funcionarios`** | RRHH operativo | Nivel inferior; **nunca** requisito para crear usuario |

- Prohibido exigir `funcionario_id` en alta/edición de usuario.  
- Si hay vínculo futuro: **funcionario → usuario**, nunca al revés.

### Acreditación por ente (Report header + rutas)

| `entes.codigo` | Ente | Grupos hub visibles (rol ≠ 1) |
|----------------|------|-------------------------------|
| **1** | RIMEC | `rimec` + recursos |
| **2–4** | Fernando · San Martín · Palma | **`bazzar` solo** |
| **5** | Bazzar Web | `bazzar-web` |
| **6–12** | Puntos tablet (hoja) | `bazzar` |

**Usuarios verificados:** BZZSN → ente 3 (San Martín) · BZZPN → ente 4 (Palma) — solo Stock / Depósitos / Caja.

**Post-cierre:** logout + login obligatorio (`REPORT_SESSION_VERSION=4`).

---

## Archivos clave (report)

| Área | Ruta |
|------|------|
| Hub filtros | `src/lib/report/hub-modules.ts` |
| Ente acceso | `src/lib/auth/ente-acceso.ts` |
| Sesión JWT | `src/lib/auth/session.ts` · `constants.ts` (v4) |
| Login / me | `src/app/api/auth/login/route.ts` · `me/route.ts` |
| Middleware | `src/middleware.ts` |
| Admin usuarios | `src/lib/usuarios-admin/*` |
| Fix trigger BD | `scripts/fix_fn_validar_usuario_triada.py` |

---

## Migraciones / BD

```powershell
cd C:\Users\hecto\Nexus_Core\report
python scripts/aplicar_migracion_127.py   # usuario_categoria
python scripts/aplicar_migracion_129.py   # ente_id
python scripts/aplicar_migracion_130.py   # triada + trigger
python scripts/fix_fn_validar_usuario_triada.py   # quita regla funcionario (idempotente)
```

---

## Dev local — errores conocidos

| Código | Síntoma | Fix |
|--------|---------|-----|
| **4.02.02.002** | `Cannot find module './1331.js'` | `npm run dev:clean:3001` — no `build` + `dev` a la vez |

---

## Alcance deploy

| Componente | Producción |
|------------|------------|
| `/pilares/usuarios` | ❌ **LOCAL ONLY** (`NODE_ENV=development`) |
| Auth ente + middleware | ⚠️ Pendiente merge/push `main` + Vercel cuando Director autorice |
| Trigger Supabase | ✅ Aplicado en BD compartida |

---

## Smoke tests (manual)

| Usuario | Ente | Esperado header |
|---------|------|-----------------|
| BZZSN | 3 San Martín | Solo columna **BAZZAR** (3 módulos) |
| BZZPN | 4 Palma | Idem |
| Guido / rol 1 | 1 RIMEC | Tres columnas completas |
| Alta BZZSN admin sin funcionario | — | INSERT OK sin error trigger |

---

## Git

**Estado al cierre:** cambios en working tree `report/` — **sin commit** salvo orden explícita del Director.  
**Rama sugerida:** `cursor/usuarios-admin-acreditacion-ente`

---

## Documentación integrada (Chusar)

| Doc | Ruta |
|-----|------|
| CHUSAR operativo | `.claude/2_modulos/2.3_report/pilares/CHUSAR_USUARIOS_ADMIN.md` |
| Etapa abierta (histórico) | `.claude/4_etapas/ETAPA_USUARIOS_ADMIN_PILARES_REPORT.md` → remite aquí |
| App local | `report/docs/USUARIOS_ADMIN_LOCAL.md` |
| Ley triada | `report/docs/LEY_TRIADA_ACCESO_HOLDING.md` |
| ACTUAL | `.claude/4_etapas/ACTUAL.md` § cierres recientes |
| **Navegador etapas** | `nexus-navegador-holding/config/etapas.json` — `2.3.5.4` → `hecho` (2026-06-10) |
| Checklist UI :3004 | `nexus-navegador-holding/docs/CHUSAR_CIERRE_ETAPA.md` |

## Cierre Navegador (:3004) — OBLIGATORIO

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → `2.3.5.4` → `estado: "hecho"` | ✅ |
| `cerradasPorModulo.report` | ✅ |
| Verificado `:3004/etapas` | ✅ |

---

**Próxima etapa sugerida:** Panel Depósito Hiedra **2.3.2.1.1** (foco ACTUAL vigente).
