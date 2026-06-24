# Módulo Empaque — Tablet Bazzar

**Doc Moria:** `.claude/2_modulos/2.4_tablet_bazzar/P-01_TRES_MODULOS_CICLO_CERRADO.md`

## Estrategia

Tablet = **Depósito + Venta + Empaque**. El flujo **vuelve a la tablet** en empaque para que vendedor/cajero no puedan bypass Nexus.

## Estado (P0)

| Item | Estado |
|------|--------|
| Ruta `/empaque` | ✅ UI mínima |
| Panel home 3er card | ✅ `view-modes.ts` enabled |
| `GET /api/empaque/tickets` | ✅ `bobeda_venta_pos` PENDIENTE_ENTREGA |
| `POST /api/empaque/entregar` | ✅ UPDATE → ENTREGADO |

## Bobeda

Consulta **`bobeda_venta_pos`** con `PENDIENTE_ENTREGA` → confirma → `ENTREGADO`.

**Prohibido:** leer bandeja cajero o `ticket_venta_pos` legacy.

Handoff desde Report cajero: `POST /api/tablet-bazzar/tickets/enviar-empaque` (repo Report).
