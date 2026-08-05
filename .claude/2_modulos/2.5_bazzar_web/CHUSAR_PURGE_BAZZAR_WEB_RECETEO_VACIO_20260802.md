# CHUSAR — Purge Bazzar Web · receteo vacío (1ª parte prueba cerrada)

**Código:** **2.5.1.13**  
**Fecha:** 2026-08-02  
**Orden Director:** cerrar 1ª parte prueba · Documenta · vaciar stock/procesos compra **solo** Bazzar Web · **no** devolver a RIMEC  
**Shibboleth:** Andrés, el que viene.

---

## Alcance (delimitado)

| Incluye | Excluye (intocable) |
|---------|---------------------|
| `ALM_WEB_01` (`almacen_id = 1`) | PE RIMEC / `v_stock_pe_*` |
| Movimientos origen/destino ALM 1 | PPD / pedido proveedor (pares_vendidos **sin** reintegro) |
| Traspasos destino ALM 1 o canal FI/VT cliente **5000** | Pilares · `combinacion` |
| `pedido_web` (+ detalle) | Sales Report (`registro_ventas_general_v2`) |
| `stock_sano_*` ALM 1 | Almacenes ≠ 1 |
| Precios lista `tipo=WEB` (cabecera lista se mantiene) | Cliente maestro `cliente_v2` 5000 (queda) |
| FI `cliente_id = 5000` **sin** reintegrar a RIMEC | Reset nuclear etapa 511 / otros canales |

**Ley de esta operación:** borrar del canal web · **prohibido** crear ingreso inverso a depósito RIMEC · **prohibido** bajar `pares_vendidos` PPD (no “devolver” disponibilidad a venta RIMEC).

---

## Script

```
report/scripts/purge_bazzar_web_alm_receteo.mjs

# Dry-run
node scripts/purge_bazzar_web_alm_receteo.mjs --dry-run

# Execute (confirmación dura)
node scripts/purge_bazzar_web_alm_receteo.mjs --execute --confirm BAZZAR-WEB-VACIO-RECETEO
```

≠ `purge_cliente_5000_pruebas.mjs` (ese reintegra / protege TRP confirmados).  
Este purge es **receteo total canal web** por orden Director.

---

## Ejecución 2026-08-02 (COMMIT OK)

| Tabla / métrica | Borrado |
|-----------------|---------|
| `movimiento` ALM 1 | 33 |
| `movimiento_detalle` | 988 |
| `traspaso` | 136 |
| `traspaso_detalle` | 3051 |
| `pedido_web` / detalle | 0 / 0 |
| `stock_sano_historial` | 278 |
| `stock_sano_deposito` | 108 |
| `stock_sano_almacen` | 1 |
| `precio` lista WEB id=1 | 2160 |
| `factura_interna` cliente 5000 | 18 |
| `factura_interna_detalle` | 43 |
| Stock neto ALM1 (aprox pre) | **1921** |

**POST:** `movimiento_alm1 = 0` · `pedido_web = 0` · `stock_sano_dep = 0`

---

## Cierre 1ª parte prueba

Cerrada la oleada de prueba/auditoría con stock de prueba en ALM_WEB (integridad · Depósito Web · grada siamese · ACTVITTA PRENDAS · filtros).  
Canal **www.bazzar.com.py** / Report `/bazzar-web/*` queda **vacío** para carga seria nueva (Compra Web / Stock Sano).

Docs fase: **2.5.1.6–12** · etapas `AUDITORIA-*` ya `hecho` en Portal.

---

## Siguiente (2ª parte)

1. Compra Web controlada RIMEC → ALM_WEB (nuevo lote serio).  
2. Regenerar precios lista WEB según motor.  
3. Smoke catálogo :3002 + Depósito Web Report.

**Cruce:** [2.5.1.2](./CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md) · [2.5.1.11](./CHUSAR_CATALOGO_GRADA_FILTROS_SIAMESES_RECETEO_20260802.md)

**Shibboleth:** Andrés, el que viene.
