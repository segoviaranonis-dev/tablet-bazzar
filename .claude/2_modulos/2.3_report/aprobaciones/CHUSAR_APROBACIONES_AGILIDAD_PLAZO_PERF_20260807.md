# CHUSAR — Aprobaciones · agilidad + plazo real + queja lentitud

**Código:** **2.3.1.3.6** · catálogo `2.03.04.003a`  
**Fecha:** 2026-08-07  
**Keyword:** **Documenta** · **despliega**  
**App:** Report · `/aprobaciones` · Nivel Dios  
**Padres:** **2.3.1.3.2** tabs · **2.3.1.3.3** indagar · **2.3.1.3.4** hotfix perf filtros  
**Estado:** ✅ Hotfix local + **deploy prod** (orden Director)  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Queja operativa (Director 2026-08-07)

Usuarios: módulo **lento / “colgado”** — “el peor sistema que probaron”.  
Síntomas en captura: timeout al expandir FI · plazo que “no cambia” · Indagar “Cargando listas…”.

**Veredicto:** no era solo percepción. Había bugs de caché, sync y tormenta de fetches.

---

## 2 · Causas raíz

| # | Causa | Efecto |
|---|--------|--------|
| 1 | Tras timeout, `fisPorPedido[id] = []` (truthy) | Re-expandir **no reintentaba** → “Sin facturas” |
| 2 | Cada `FiCard` fetch `/observaciones` al montar | Tormenta N×API en Aprobados |
| 3 | Indagar abierto + fetch opciones al entrar | Ruido + lentitud percibida |
| 4 | `syncPedidoEncabezadoDesdeFi` solo si **1** FI activa | Select PLAZO actualizaba FI pero **no** PVR (pedido multi-FI) |
| 5 | Plazo solo en célula FI | Si FIs no cargan → imposible editar plazo |

---

## 3 · Hotfix (código)

| Fix | Archivo |
|-----|---------|
| SSR batch FIs pendientes | `aprobaciones-queries.ts` `fetchFisDePedidosBatch` |
| Lista API sin N+1 | `api/aprobaciones/lista` |
| Caché: error **borra** key · retry · timeout 45s | `AprobacionesClient.tsx` |
| Lista **plegada** (no auto-expand) | idem |
| Indagar **cerrado** por defecto | `AprobacionesFiltrosPanel.tsx` |
| Observaciones **lazy** (auto solo PE RESERVADA) | `FiObservacionesPanel.tsx` |
| Plazo editable en **cabecera pedido** | `PedidoPendienteCard` + `actualizarPlazoPedido` |
| Plazo FI → **siempre** sync PVR | `aprobaciones-mutations.ts` |

Smoke plazo: FI `88-PV012` (PVR-950930) 16→14 (150 DIAS) en FI **y** PVR · restaurado.

---

## 4 · Deuda / norte (agilidad — no cerrado)

El módulo sigue denso (editores · descuentos · resync · obs). Próximas oleadas **solo con orden**:

1. Virtualizar lista Aprobados / menos paneles verdes.  
2. Edición pedido-level (cliente · vendedor · descuentos) sin abrir cada FI.  
3. Índices BD / pool si Vercel sigue lento con muchos DIOS concurrentes.  
4. Medir TTFB SSR en prod post-deploy.

---

## 5 · Deploy (prod · 2026-08-07)

- Repo: `report` · branch `main`  
- Tip git: **`a5c515a`** · `fix(aprobaciones): agilidad · plazo FI→PVR · anti-timeout`  
- Prod alias: https://report-plum-one.vercel.app · https://rimec-report.vercel.app/aprobaciones  
- Deployment: `dpl_3dkEwU3xjCJnUy7EULw2VMWUX6jo` · READY  
- Inspección: https://vercel.com/segoviaranonis-2610s-projects/report/3dkEwU3xjCJnUy7EULw2VMWUX6jo
