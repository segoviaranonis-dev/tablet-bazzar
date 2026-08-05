# ETAPA CERRADA — Accesos holding · Bazzar · RIMEC Web · usuarios BZZ

**Código:** **HOLD-ACCESOS-BZZ-2026** (Fase 2 de Roles y Accesos)  
**Fecha inicio:** 2026-06-10  
**Fecha cierre:** 2026-06-10  
**Director:** cierre explícito — «documenta todo · cierra la etapa · agrega al índice»  
**Estado:** ✅ **CERRADA** (taller local + BD Supabase + enforcement código)

---

## Objetivo

1. **Administrar accesos de verdad** — no solo UI de colores: login, matriz canónica y BD alineados.  
2. **RIMEC Web para tiendas Bazzar:** ADMIN tienda ✅ · VENDEDOR tienda ❌.  
3. **Contraseñas BZZ:** número de depósito visible y coherente con `password_hash`.  
4. **Organigrama gerencial** en Navegador Holding (`/accesos`).  
5. **Corrección datos:** `BZZSN` ente San Martín (cod 3).

---

## Matriz final (Director — 2026-06-10)

| Perfil | Report | Tablet | RIMEC Web |
|--------|--------|--------|-----------|
| **DIOS** (1+DIOS) | TOTAL | TOTAL | TOTAL |
| **ADMIN RIMEC** (1+ADMIN) | Parcial (sin Aprobaciones) | TOTAL | TOTAL |
| **VENDEDOR RIMEC** (1+VENDEDOR) | Solo ventas-fotos | PROHIBIDO | TOTAL |
| **ADMIN BAZZAR** (2+ADMIN · ente 2–4) | Solo Bazzar | TOTAL (1 depósito) | **TOTAL** (catálogo + carrito) |
| **VENDEDOR BAZZAR** (2+VENDEDOR) | PROHIBIDO | TOTAL (POS) | **PROHIBIDO** |

**Doc canónica:** [MATRIZ_ROLES_ACCESOS_HOLDING.md](../1_fundamentos/1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md)  
**Regla Cursor:** `.cursor/rules/matriz-roles-accesos-holding.mdc`

---

## Entregables ✅

| # | Entrega | Evidencia |
|---|---------|-----------|
| 1 | Matriz canónica actualizada (Bazzar ADMIN → RIMEC Web) | `1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md` |
| 2 | Bloqueo login RIMEC Web `rol_id=2` + `VENDEDOR` | `rimec-web/lib/auth/roles.ts` → `puedeAccederRimecWeb()` |
| 3 | Verificación password unificada (ignora `__hash_*`) | `rimec-web/lib/auth/verifyPassword.ts` · `tablet-bazzar/lib/auth/verifyPassword.ts` |
| 4 | Login RIMEC Web incluye `rol_id` | `rimec-web/lib/auth/validateUsuario.ts` · `app/api/auth/login/route.ts` |
| 5 | Login Tablet usa verify unificado | `tablet-bazzar/app/api/auth/login/route.ts` |
| 6 | Report login ignora basura `__hash_*` en columna password | `report/src/lib/auth/validateUsuario.ts` |
| 7 | Script sincronizar password BZZ = depósito | `report/scripts/sincronizar_password_bzz_deposito.py` |
| 8 | BD: password legible + hash bcrypt + fix ente BZZSN | Script ejecutado 2026-06-10 |
| 9 | Organigrama interactivo holding | `nexus-navegador-holding/src/components/OrganigramaAccesos.tsx` · `/accesos` |
| 10 | Ayuda memoria Director BZZ | `report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md` |

---

## Regla contraseña tienda BZZ

Patrón usuario: **`BZZ` + sede (F/S/P) + segmento (A/N)** → contraseña = **`cliente_id` del depósito**.

| Usuario | Contraseña | Depósito |
|---------|------------|----------|
| BZZFA | 2100 | Fernando Adultos |
| BZZFN | 2900 | Fernando Niños |
| BZZSA | 2400 | San Martín Adultos |
| BZZSN | 2700 | San Martín Niños |
| BZZPA | 3100 | Palma Adultos |
| BZZPN | 3200 | Palma Niños |

**Columnas BD:** `password` = número legible (Streamlit legacy) · `password_hash` = bcrypt.  
**Prohibido:** placeholders `__hash_*` en columna `password` (rompen lectura en Supabase y Streamlit).

```powershell
cd C:\Users\hecto\Nexus_Core\report
python scripts/sincronizar_password_bzz_deposito.py        # aplicar
python scripts/sincronizar_password_bzz_deposito.py --dry-run   # solo auditoría
```

---

## Corrección BD aplicada (2026-06-10)

| Usuario | Antes | Después |
|---------|-------|---------|
| BZZFN | `password` = `__hash_...` | `password` = **2900** |
| BZZSN | `password` = `__hash_...` · `ente_id` = 1 RIMEC | `password` = **2700** · `ente_id` = **3** San Martín |
| BZZPN | `password` = `__hash_...` | `password` = **3200** |

---

## Archivos clave por repo

| Repo | Ruta | Rol |
|------|------|-----|
| **rimec-web** | `lib/auth/roles.ts` | Matriz login |
| **rimec-web** | `lib/auth/verifyPassword.ts` | bcrypt + legacy |
| **rimec-web** | `lib/auth/validateUsuario.ts` | Query `rol_id` |
| **tablet-bazzar** | `lib/auth/verifyPassword.ts` | Idem tablet |
| **tablet-bazzar** | `lib/acceso-catalogo.ts` | Catálogo `/cadena` por ente |
| **report** | `scripts/sincronizar_password_bzz_deposito.py` | Admin passwords BZZ |
| **report** | `docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md` | Tarjeta Director |
| **nexus-navegador-holding** | `src/app/accesos/page.tsx` | UI organigrama |
| **nexus-navegador-holding** | `src/components/OrganigramaAccesos.tsx` | Matriz visual |

---

## URLs dev

| Herramienta | URL |
|-------------|-----|
| Organigrama accesos | http://localhost:3004/accesos |
| Report login | http://localhost:3000/login |
| RIMEC Web login | http://localhost:3001/login |
| Tablet Bazzar | http://localhost:3002/login |

---

## Smoke tests (manual)

| Usuario | Pass | RIMEC Web | Tablet | Report |
|---------|------|-----------|--------|--------|
| BZZSN | 2700 | ✅ ADMIN tienda | ✅ `/cadena` SM-N | ✅ solo Bazzar |
| BZZPN | 3200 | ✅ | ✅ Palma Niños | ✅ |
| BZZFN | 2900 | ✅ | ✅ Fdo. Niños | ✅ |
| BZZP (legacy rol 3 VENDEDOR) | 626070 | según rol/cat | ❌ | ventas-fotos |

---

## Pendiente (no bloquea cierre doc)

| Item | Nota |
|------|------|
| Git push `rimec-web` / `tablet-bazzar` / `report` | Taller local — push cuando Director autorice |
| Normalizar BZZPN/BZZFN a `rol_id=2` | Hoy algunos tienen `rol_id=1` (Report amplio) |
| Crear usuarios faltantes BZZFA · BZZSA · BZZPA | Alta manual `/pilares/usuarios` (dev) |
| Deploy Vercel auth changes | Tras push |

---

## Etapas relacionadas

| Etapa | Estado |
|-------|--------|
| Roles y accesos (Fase 1) | ✅ [ETAPA_ROLES_Y_ACCESOS_CERRADA.md](./ETAPA_ROLES_Y_ACCESOS_CERRADA.md) |
| Usuarios admin + ente | ✅ [ETAPA_USUARIOS_ADMIN_ACREDITACION_CERRADA.md](./ETAPA_USUARIOS_ADMIN_ACREDITACION_CERRADA.md) |
| **Accesos BZZ + RIMEC Web** | ✅ **Esta etapa** |

---

## Índices actualizados

- `.claude/1_fundamentos/INDICE.md` — matriz accesos  
- `.claude/2_modulos/2.2_rimec_web/INDICE.md` — auth Bazzar  
- `.claude/2_modulos/2.4_tablet_bazzar/INDICE.md` — passwords + accesos  
- `.claude/2_modulos/2.3_report/pilares/INDICE.md` — ayuda memoria BZZ  
- `.claude/4_etapas/ACTUAL.md` — cierre registrado  

---

## Cierre Navegador (:3004) — OBLIGATORIO

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → `2.3.5.4` + accesos → `estado: "hecho"` | ✅ |
| `cerradasPorModulo.report` (Usuarios + HOLD-ACCESOS-BZZ-2026) | ✅ |
| `actualizado` bump | ✅ |
| Verificado `:3004/etapas` (4 abiertas, Usuarios fuera) | ✅ |

---

## Addendum 2026-06-26 — Hotfix menú Report BZZ

| # | Entrega | Ruta |
|---|---------|------|
| 11 | Blindaje BZZ* → rol_id=2 en login + middleware + header | `report/src/lib/auth/bzz-acceso.ts` |
| 12 | Hub Report: solo columna Bazzar para rol 2 | `report/src/lib/report/hub-modules.ts` |
| 13 | Script corrección BD | `report/scripts/corregir_rol_bzz_usuario_v2.py` |
| 14 | Doc hotfix | `report/docs/HOTFIX_BZZ_MENU_REPORT_20260626.md` · `.claude/5_errores/HOTFIX_BZZ_MENU_REPORT_20260626.md` |
| 15 | Tablet login paridad BZZ + VENDEDOR POS | `tablet-bazzar/lib/auth/bzz-acceso.ts` |

**Deploy:** Report + Tablet Vercel prod 2026-06-26.

---

**Shibboleth:** 7 años
