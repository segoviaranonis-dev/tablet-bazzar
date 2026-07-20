# CHUSAR — Digitación multi-asignar PROGRAMADO (N IC → 1 PP)

**Código:** `2.3.1.7.4.3`  
**Fecha:** 2026-07-19  
**App:** Report `:3000`  
**Estado:** 🟢 local

---

## Qué resuelve

Antes: 1 IC → formulario → 1 PP (ruta `asignar/[icId]`).  
Ahora: en **Digitación · PROGRAMADO · Pendientes**, se seleccionan **N IC** y se asignan **de una vez** al mismo PP (crear nuevo o agregar a abierto). Caso típico: 24 IC → un pedido fábrica / un PP.

## Mapa UI

| Paso | Ruta / control |
|------|----------------|
| 1 | `/proceso-importacion/digitacion?ramo=programado` · vista Pendientes |
| 2 | Checkbox por fila + «seleccionar todas» |
| 3 | Barra fija **Asignar N →** |
| 4 | `/proceso-importacion/digitacion/asignar-lote?ramo=programado&ids=1,2,3` |
| 5 | Mismo criterio que asignar 1: evento cerrado · nro. fábrica · PP nuevo / abierto |
| 6 | Redirect al detalle del PP |

Compra previa: sin multi-select (sigue 1×1). Acciones → individuales se mantienen.

## API / código

| Pieza | Ubicación |
|-------|-----------|
| Acción lote | `report/src/lib/digitacion/actions.ts` → `asignarIcLote` (reusa `asignarIc`; reutiliza `pp_id` tras la 1ª) |
| POST | `/api/proceso-importacion/digitacion/asignar-lote` |
| Helper ruta | `digitacionAsignarLote(ids, "programado")` en `routes.ts` |
| Hub | `DigitacionHubClient.tsx` |
| Form | `digitacion/asignar-lote/components/DigitacionAsignarLoteClient.tsx` |

Body POST: `{ ic_ids, precio_evento_id, nro_pedido_fabrica, pedido_proveedor_id? }`.  
Si falla a mitad: responde error con `asignadas` parciales y `pp_id` si ya se creó.

## Efectos (igual que 1×1, en loop)

Por cada IC: puente `intencion_compra_pedido` · IC → `DIGITADO` (PROGRAMADO puede autorizar desde bandeja al asignar) · mismo `nro_pedido_fabrica` y `precio_evento_id`.

## Inventario hermano

[DIGITACION_ASIGNAR.md](./DIGITACION_ASIGNAR.md) · [DIGITACION_ASIGNAR_LOTE.md](./DIGITACION_ASIGNAR_LOTE.md) · [CHUSAR_DIGITACION.md](./CHUSAR_DIGITACION.md)

**Shibboleth:** Andrés, el que viene.
