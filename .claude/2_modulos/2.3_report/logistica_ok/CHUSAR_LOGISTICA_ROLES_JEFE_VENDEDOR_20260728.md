# CHUSAR — Logística roles JEFE / VENDEDOR + deploy

**Código:** `2.3.1.28.15`  
**Fecha:** 2026-07-28  
**Keyword:** Documenta · DESPLIGA (orden directa Director)  
**App:** Report `/logistica-ok` · Proceso + Rimec  
**Etapa:** `LOGISTICA-RIMEC-TXT-20260728`

---

## Perfiles

### JEFE_DEPOSITO (EVERT · CRISTHIAN)

| Campo | Valor |
|-------|--------|
| `rol_id` | `1` |
| `categoria` | `JEFE_DEPOSITO` |
| Hub `/` | **2 tarjetas:** Depósito RIMEC + Logística |
| Pestañas Logística | Confirmadas · Entregas del día · Exitosas |
| Stock PE | Desde hub Depósito (no tarjeta suelta en home) |
| Descuentos PE | Solo DIOS |

Usuarios: **EVERT** (canónico) · **CRISTHIAN** / pass **1701** (mismo perfil).  
Script alta: `report/scripts/ensure_cristhian_jefe_deposito.mjs`  
Código: `report/src/lib/auth/jefe-deposito-rimec.ts` · `hub-modules.ts` · `middleware.ts` · login home `/`.

### VENDEDOR (`rol_id=1` o legado `rol_id=3`)

| Campo | Valor |
|-------|--------|
| Pestaña | Solo **Vendedor** |
| Filtro | FI cuyo `vendedor_v2` matchea `descp_usuario` |
| Match | `vendedor-usuario.ts` (alias LUISLV→LUIS, LILI→LILIANA, …) |
| Sin login | Ej. DARIO / FRANCIS ausente → los ve la jefa (DIOS) |

**Prohibido** resolver vendedor vía `usuario_v2` (colisión EVERT/BZZPN). Col F Excel = código Carlos → matriz + `vendedor_v2`.

---

## Fix UI — salto Confirmadas ↔ Entregas

**Síntoma:** al cambiar pestaña, volvía sola a la anterior.  
**Causa:** `setTab(data.tab)` + `tabsPermitidas` en deps del fetch → loop.  
**Fix:** clave estable `tabsKey`, generación de fetch, no pisar tab elegida por el usuario.  
Archivo: `LogisticaOkClient.tsx`.

ACL: esperar permisos antes del primer fetch; API coerce tab inválida a la primera permitida.

---

## Logística Rimec (resumen técnico)

| Pieza | Ubicación |
|-------|-----------|
| Hub Proceso \| Rimec | `/logistica-ok` → `/proceso` · `/rimec` |
| BD | MIG-190/191 · `logistica_rimec_*` |
| API | `/api/logistica-rimec/*` |
| UI | `LogisticaRimecClient` + `LogisticaOkClient` modo rimec |
| Fuente | `csv's/Logistica/Logistica Rimec.xlsx` |
| Multi + choferes | **2.3.1.28.14** |

---

## Deploy prod

**Orden Director 2026-07-28:** DESPLIGA (puerta directa · no requiere cierre etapa).  
Repo: `github.com/segoviaranonis-dev/report.git` · branch `main` · commit **`b64c3e1`** · Vercel Report.  
URL: https://rimec-report.vercel.app · rutas `/logistica-ok` · `/logistica-ok/rimec`.

Smoke post-deploy:

1. Login EVERT / CRISTHIAN → hub 2 tarjetas · Confirmadas/Entregas sin salto.
2. Login vendedor con match → solo pestaña Vendedor · FI propias.
3. DIOS → Proceso + Rimec · todas las pestañas · multi + choferes.
