# CHUSAR — Logística VENDEDOR bloqueada (desarrollo)

**Código:** **2.3.1.28.17**  
**Fecha:** 2026-07-30 · Padre **2.3.1.28**  
**Keyword:** Documenta + despliega

---

## Ley

VENDEDOR RIMEC en Report (**rol 1 o legado 3** + `categoria=VENDEDOR`):

- **Hoy:** solo **Ventas con fotos** (`/ventas-fotos`).
- **Logística OK:** bloqueada mientras `LOGISTICA_VENDEDOR_LANZADA = false`.
- **Al lanzar:** poner `true` en `report/src/lib/auth/vendedor-rimec-report.ts` → hub + middleware + API habilitan pestaña Vendedor.

DIOS / ADMIN / JEFE_DEPOSITO siguen con Logística.

---

## También (BD 2026-07-30)

| Login | Cambio |
|-------|--------|
| BZZS · BZZP | `categoria` VENDEDOR → **ADMIN** (paridad BZZFN/BZZSN) |

**Código:** `vendedor-rimec-report.ts` · `middleware.ts` · `hub-modules.ts` · `logistica-ok/auth-api.ts`
