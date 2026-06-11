# ETAPA: APROBACIONES REPORT — NIVEL DIOS — CERRADA

**Fecha inicio:** 2026-06-10  
**Fecha cierre:** 2026-06-11  
**Ejecutor:** Cursor (Auto)  
**Director:** Aprobación explícita — «Perfecto cierra etapa»  
**Estado:** ✅ CERRADA (git + push verificados)

---

## Git (report)

**Estado al cierre:** ✅ **EN GIT**

| Campo | Valor |
|-------|--------|
| Repo | `segoviaranonis-dev/report` |
| Rama | `main` |
| Commit | `152ab7d` |
| Mensaje | `feat(aprobaciones): Nivel Dios — editores FI, gate DIOS y sync PP/PVR` |
| Push | `87d1a0b..152ab7d` → `origin/main` |
| Working tree | limpio |

Deploy Vercel: automático en push a `main` — verificar `/aprobaciones` tras ~2 min.

---

## Objetivo

Gemelo operativo Streamlit `aprobacion_pedidos` en Report `/aprobaciones`, con **Nivel Dios**: instancia de control superlativo donde cada edición persiste en BD en la misma transacción y sincroniza FI + PVR + PP.

---

## Entregables

### Auth Nivel Dios
- `rol_id = 1` + `categoria = DIOS` en `usuario_v2`
- Gate: middleware, SSR page, server actions (`nivel-dios.ts`, `require-nivel-dios.ts`)
- Usuario operativo verificado: **Guido** (login case-insensitive tras fix)
- API auditoría: `GET /api/aprobaciones/nivel-dios-audit` (solo sesión DIOS)

### Editores (ley en BD — sin agregar ítems)
| Campo | Mutación | Sync |
|-------|----------|------|
| Cliente (código) | `cambiarClienteFi` | FI + PVR |
| Vendedor | `cambiarVendedorFi` | FI + PVR |
| Plazo + desc. 1–4 | `actualizarEncabezadoFi` | FI + PVR, precios desde PPD |
| Lista LPN/LPC | `actualizarListaPrecioFi` | FI + PVR |
| Cantidad ítem | `modificarCantidadItemFi` | PPD `pares_vendidos` + totales |
| Eliminar ítem | `eliminarItemFi` | DELETE detalle + revierte PP |

### UI
- `FiCard` — 3 filas comerciales + acordeón productos
- `FiEncabezadoEditores`, `ListaPrecioEditor`, `ItemRow` editable
- 4 tabs gemelo Streamlit (Pendientes / Reservadas / Confirmadas / Anuladas)

### Infra dev
- `REINICIAR_DEV.bat` — fix `.next` corrupto
- Login: `LOWER(descp_usuario)` en `validateUsuario.ts`

### Documentación
- `report/docs/APROBACIONES.md`
- `report/docs/NIVEL_DIOS_USUARIOS.md`
- `.claude/.../aprobacion_pedidos/CONTEXT.md` (sección gemelo Report)

---

## Verificación Director

- Login Guido → OK (`role: DIOS`)
- `/aprobaciones` carga con editores
- Cambio lista precio probado en BD (sesión anterior)
- Dev local: `http://localhost:3000` + `REINICIAR_DEV.bat`

---

## Fuera de alcance (etapa siguiente)

- Agregar ítems a FI desde Report
- Email PDF post-confirmación (Streamlit)
- Deploy producción Vercel

---

## Próxima etapa activa

Ver `ACTUAL.md` — **Tablet Bazzar** (sin cambio de norte).

---

**Shibboleth:** como serta la barranca → que el sapo la sube al trote.
