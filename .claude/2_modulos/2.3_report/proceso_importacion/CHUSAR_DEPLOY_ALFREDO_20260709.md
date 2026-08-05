# CHUSAR — Deploy Report prod · Jornada Alfredo PROGRAMADO · 2026-07-09

**Código:** **2.3.1.7.5.3.3.6**  
**Estado:** ✅ **DESPLEGADO** en `main` → Vercel `rimec-report.vercel.app`  
**Operador:** ALFREDO · flujo IC → motor → digitación → PP programado  
**Repo:** `report/` · https://github.com/segoviaranonis-dev/report.git

**Shibboleth:** Andrés, el que viene.

---

## Norte

Regresiones **EMAXCONN** y timeouts Vercel tras despliegues previos. Jornada restauró cadena **PROGRAMADO** end-to-end en prod hasta **preview proforma PP-17**.

---

## Commits prod (orden cronológico reciente)

| Commit | Fix |
|--------|-----|
| `b39af08`–`dca6c24` | EMAXCONN v3 — cliente efímero, mutex, prefetch off |
| `9ebc2c6` | Restaurar `pool.connect` — `pg.Pool` max:1 + retry |
| `945ccb4` | Deadlock asignar PP · vincular listado TS Vercel · try/catch APIs |
| `6e643fc` | `IcProgramadoCabeceraGuide.tsx` — build fail |
| `4377428` / `942d303` | Tipos PE/panel — build Vercel |
| `211e32d` | Biblioteca Memoria — transacción única + maxDuration 300 |
| `a170a43` | Import `loadBibliotecaEditor` faltante |
| **`fcd2fba`** | **504 Conversión Paso 3** — `PilaresBulkResolver` + chunks 400 + maxDuration calcular/cerrar/carga |

---

## Síntomas resueltos

| Síntoma | Causa | Fix |
|---------|-------|-----|
| `a.connect is not a function` | Pool efímero sin `.connect()` | `9ebc2c6` |
| Asignar IC / crear PP JSON vacío | Deadlock `getNextNumeroPp(pool)` en TX | `945ccb4` |
| Vincular listado falla prod | Solo Python | TS `vincularListadoAPp` en Vercel |
| Biblioteca Memoria timeout ~60s | N× connect | TX única + maxDuration 300 |
| Conversión 2.388 SKUs **504** | N× queries pilares + 60s | Bulk + `fcd2fba` |

---

## Funciona prod (verificado jornada)

1. Motor precios: carga → biblioteca → preview → conversión → validación → **cierre** (evento **#45**).
2. Digitación → asignar IC programado → crear/ampliar PP.
3. PP tab Stock: preview proforma TS · import TS (pendiente PASS PP-17).
4. Vincular listado TS · import proforma TS · CSV Carlos.

---

## No funciona prod (workaround — documentar operador)

| Feature | Motivo |
|---------|--------|
| **PDF FI** | `run-python-fi-pdf.ts` — sin runtime Python Vercel |
| **Recalcular FI** masivo | Solo Python |

---

## Archivos clave código

| Ruta | Rol |
|------|-----|
| `src/lib/rimec/pool.ts` | Pool singleton Vercel |
| `src/lib/motor-precios/evento-pilares.ts` | Bulk resolver Paso 3 |
| `src/lib/motor-precios/evento-paso3.ts` | Staging chunks |
| `src/lib/pedido-proveedor/run-python-pp.ts` | Gate TS proforma Vercel |
| `src/lib/pedido-proveedor/proforma-programado-engine.ts` | Preview + import + N FI |
| `src/lib/pedido-proveedor/stock-listado.ts` | Vincular listado TS |

---

## Handoff siguiente sesión

→ [CHUSAR_PP17_TERCERA_PROFORMA_PROGRAMADO](./CHUSAR_PP17_TERCERA_PROFORMA_PROGRAMADO.md)

---

**Índice:** [INDICE.md](./INDICE.md)
