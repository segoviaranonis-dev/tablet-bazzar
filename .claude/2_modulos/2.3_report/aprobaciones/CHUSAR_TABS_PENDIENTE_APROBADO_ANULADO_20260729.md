# CHUSAR — Aprobaciones: Pendiente · Aprobado · Anulado (sin pestaña Reservadas)

**Código:** 2.3.1.3.2 · **Estado:** 🟢 **IMPLEMENTADO + desplegado 2026-07-29**  
**Shibboleth:** Andrés, el que viene.  
**Padre:** Aprobaciones Report `/aprobaciones` · Nivel Dios  
**Commit Report:** `3588f9c` · Prod: https://rimec-report.vercel.app/aprobaciones

---

## Norte (orden Director)

UI de negocio solo tres estados:

| UI | BD (`factura_interna.estado`) |
|----|-------------------------------|
| **Pendiente** | `RESERVADA` |
| **Aprobado** | `CONFIRMADA` |
| **Anulado** | `ANULADA` |

**Prohibido** mostrar pestaña «Reservadas» / «Confirmadas» como flujo operativo.  
«Reservada» es nombre interno de BD, no etiqueta de negocio.

Flujo UI: **Pendiente** → **Aprobar** célula → **Aprobado** · o **Anulado**.

---

## Causa del hang («Cargando facturas…» muchos segundos)

SSR de `fetchAprobacionesData` cargaba **todas** las FIs de reservadas + confirmadas + anuladas (~800) y hacía batch de detalles. La grilla de Pendientes esperaba ese payload.

**Fix:** SSR liviano — solo pedidos `PENDIENTE` + FIs embebidas por `pedido_id` (`fisPorPedido`) + `COUNT` de aprobados/anulados. Listas Aprobados/Anulados via `GET /api/aprobaciones/lista?tab=…` (lazy). Detalle de ítems solo al abrir productos.

---

## Código

| Pieza | Ruta |
|-------|------|
| Tabs UI | `report/src/app/aprobaciones/AprobacionesClient.tsx` |
| SSR | `report/src/app/aprobaciones/lib/aprobaciones-queries.ts` → `fetchAprobacionesData` |
| Tipos | `aprobaciones-types.ts` · `TabAprobaciones = pendientes \| aprobados \| anulados` |
| Badges UI | `aprobaciones-utils.ts` · RESERVADA→PENDIENTE · CONFIRMADA→APROBADO |
| Lista lazy | `report/src/app/api/aprobaciones/lista/route.ts` |
| Célula | `FiCard.tsx` · botón **✓ Aprobar** · detalle on-demand |
| Pedido | `PedidoPendienteCard.tsx` |

Confirmar FI: POST `/api/aprobaciones/facturas/[fi_id]/confirmar` (logística en `after()` — no bloquea botón).

---

## Deuda datos (no bloquea UI)

~515 FIs `RESERVADA` en BD sin pedido Web en bandeja Pendientes (huérfanas / histórico). **No** vuelven a pestaña. Limpieza = OT aparte si el Director ordena.

---

## Smoke

1. `/aprobaciones` — 3 tabs · sin Reservadas.  
2. Pedido con FIs (ej. PVR-2026-508208) — células al instante (sin hang).  
3. **Aprobar** — badge APROBADO / sale de Pendientes.  
4. Tab Aprobados — carga lazy (últimas 200).

---

**Documenta** Director 2026-07-29 · deploy `3588f9c`.
