# ETAPA: TABLET BAZZAR — Botón tikeCT (Ticket ORO)

> **⚠️ UNIFICADA** — Absorbida por **[ETAPA_TABLET_FINAL.md](./ETAPA_TABLET_FINAL.md)** Track 4 (Tickets ORO).  
> Doc operativo: `tablet-bazzar/docs/ETAPA_4_TICKET_BOTON.md`

**Fecha inicio:** 2026-06-14  
**Estado:** → ver [ETAPA_TABLET_FINAL.md](./ETAPA_TABLET_FINAL.md)

---

## Objetivo

Primer entregable de la **etapa final tickets**: botón **tikeCT** en Tablet POS para iniciar el flujo de venta (carrito o línea directa) con FK pilares + tienda + vendedor.

---

## Relación con etapas previas

| Etapa | Estado | Enlace |
|-------|--------|--------|
| Cadena backend titanio | ✅ CERRADA | [ETAPA_TABLET_CADENA_BACKEND_TITANIO_CERRADA.md](./ETAPA_TABLET_CADENA_BACKEND_TITANIO_CERRADA.md) |
| Cadena UI + filtros | ✅ CERRADA | [ETAPA_TABLET_CADENA_UI_NAV_CERRADA.md](./ETAPA_TABLET_CADENA_UI_NAV_CERRADA.md) |
| Diseño / hero imágenes | 🟡 NO CERRADA | [ETAPA_TABLET_DISENO_INVESTIGACION.md](./ETAPA_TABLET_DISENO_INVESTIGACION.md) |
| Pre-final 3 etapas (OPS/velocidad/precisión) | 🟡 PARCIAL | `tablet-bazzar/docs/PLAN_TRES_ETAPAS_PRE_FINAL.md` |

**Nota:** `ACTUAL.md` tenía gate “no tickets hasta diseño PASS”. Director abrió esta etapa explícitamente — prioridad manda.

---

## Alcance inicial

- Definición UX + ubicación botón tikeCT
- Esquema y API ticket (server-side)
- Integración desde molécula activa en cadena
- Smoke venta prueba (depósito 2100)

## Fuera de alcance (salvo orden)

- Deploy masivo 60 tablets
- Report dashboard tickets
- Retail ← tickets

---

## Referencias

- `tickets_oro.md` — `.claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md`
- `tablet-bazzar/docs/CADENA_CONSECUTIVA.md` — pendiente línea 186 carrito/ticket

---

**Última actualización:** 2026-06-14 · **Shibboleth:** 5 patas ✅
