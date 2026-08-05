# SUB-SESIÓN — Report · Monitoreo tickets Tablet

**Código:** 2.3.2.2  
**Inicio:** 2026-06-17  
**Estado:** 🔀 **ABSORBIDA** → etapa unificada  
**Etapa vigente:** [ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md](./ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md) 🟢 ABIERTA  
**CHUSAR:** [CHUSAR_MONITOREO_TICKETS_POS.md](../2_modulos/2.3_report/tickets_pos/CHUSAR_MONITOREO_TICKETS_POS.md)

---

## Objetivo

Dashboard en Report donde dirección / ADMIN ve tickets emitidos desde Tablet Bazzar en tiempo operativo (Supabase).

**Éxito =** ruta `/tablet-bazzar` con listado tickets + depósitos · roles ADMIN/DI · sin tocar Sales Report blindado.

---

## Entregables (actualizado 2026-06-22)

- [x] Ruta `/tablet-bazzar` shell + depósitos sync
- [ ] API `GET /api/tickets/pos`
- [ ] Tabla tickets + filtros tienda / fecha
- [ ] Smoke prod post-deploy

**Doc app:** `report/docs/TICKETS_POS_MONITOREO.md`

---

## Fuera de alcance

- `registro_ventas_general_v2` — blindado
- Lógica emisión ticket (vive en Tablet `2.4.2.3`)

**Cruzado con Tablet:** [CHUSAR_TICKETS_POS_STOCK.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TICKETS_POS_STOCK.md)

---

**Redirigir todo trabajo nuevo a ETAPA_TABLET_TICKETS_POS_STOCK_REPORT — 2026-06-22**
