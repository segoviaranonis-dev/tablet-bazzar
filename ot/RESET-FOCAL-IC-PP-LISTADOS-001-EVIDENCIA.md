# Evidencia OT-RESET-FOCAL-IC-PP-LISTADOS-001

**Fecha:** _  
**Ejecutor:** _  
**Modo:** dry-run / execute

## Pre-snapshot (a borrar)

| Tabla | Filas |
|-------|-------|
| intencion_compra | |
| intencion_compra_pedido | |
| pedido_proveedor | |
| pedido_proveedor_detalle | |
| snapshot_costos | |
| precio_evento | |
| precio_evento_caso | |
| precio_lista | |
| precio_evento_linea_excepcion | |
| precio_auditoria | |

## Downstream (debe estar en 0)

| Tabla | Filas |
|-------|-------|
| factura_interna | |
| compra_legal | |
| traspaso | |
| movimiento | |
| pedido_web | |

## Conservar (pre = post)

| Tabla | Pre | Post |
|-------|-----|------|
| linea | | |
| referencia | | |
| material | | |
| color | | |
| talla | | |
| caso_precio_biblioteca | | |
| biblioteca_caso_linea | | |
| caso_precio_web_regla | | |
| registro_ventas_general_v2 | | |
| registro_st_vt_rc_reposicion | | |

## Checks

- [ ] C1 IC = 0
- [ ] C2 PP = 0
- [ ] C3 precio_evento = 0
- [ ] C4 linea pre = post
- [ ] C5 caso_precio_biblioteca pre = post
- [ ] C6 registro_ventas_general_v2 sin cambio
- [ ] C7 registro_st_vt_rc_reposicion sin cambio

## Veredicto

- [ ] PASS
- [ ] FAIL — motivo:
