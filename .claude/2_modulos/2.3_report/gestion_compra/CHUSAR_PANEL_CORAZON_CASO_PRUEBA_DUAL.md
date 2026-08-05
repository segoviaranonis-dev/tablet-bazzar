# CHUSAR — Panel corazón · Aprobaciones dual · Caso prueba +12

**Código:** **2.3.1.15**  
**Ratificado:** Director · 2026-07-05  
**Shibboleth:** Andrés, el que viene.

---

## Corazón Alejandro Magno

El **Panel de Control** (`/rimec?mundo=panel-control`) es el **corazón central de la estrategia** — no decoración. Cada tarjeta **debe orbitar la venta real** confirmada en el mismo entorno PPD/FI.

**Concepto madre:** [CHUSAR_MERCADERIA_EN_TRANSITO.md](./CHUSAR_MERCADERIA_EN_TRANSITO.md) — dos lentes **STOCK** (inventario en tránsito) y **VENTAS** (FI CP + programado + PE en tabla compartida).

| Tarjeta | Vendido canónico | Saldo | Tras confirmar FI |
|---------|------------------|-------|-------------------|
| **STOCK · Pronta entrega** | `SUM(GREATEST(cantidad_importada − cantidad, 0))` | `SUM(cantidad)` vivo | −12 pares en staging PE |
| **COMPRA PREVIA · Tránsito** | `SUM(pares_vendidos)` PP `EN_TRANSITO` | inicial − vendido | `descontar_stock_pp` en PPD |
| **PROGRAMADO** | idem cat. 3 · PP sin Web | — | ⏳ primera import 8604 |

**Ley:** confirmación FI → KPI Panel **sin refresh manual inventado** · CP ya replica Estadísticas Web · PE usa `cantidad_importada` (MIG-132 · [CHUSAR_HUB_TRES_ENTES_METRICAS.md](../depositos/CHUSAR_HUB_TRES_ENTES_METRICAS.md)).

---

## Caso de prueba Director (+12 + +12)

**Escenario:** carrito RIMEC Web (`:3001`) con **1 molécula tránsito** + **1 molécula Pronta entrega · D3** → mismo pedido web → **dos FI** en Aprobaciones.

| Paso | App | Resultado esperado Panel |
|------|-----|--------------------------|
| 1 | RIMEC Web · Activar venta · carrito · confirmar | FI `RESERVADA` ×2 |
| 2 | Report `/aprobaciones` | Ver **dos ramas** (ver abajo) |
| 3 | Confirmar ambas FI (Nivel Dios) | STOCK **Vendido +12** · CP **Vendido +12** |
| 4 | Refrescar Panel | Saldo baja · moléculas coherentes |

---

## Aprobaciones — dos ramas (mismo módulo · distinto circuito)

**Ruta:** `/aprobaciones` · **2.3.1.3** · blindaje `pv_global` intacto en preventas.

### Rama A — Preventa / Compra previa (blindada · proceso normal)

| Pieza | Valor |
|-------|--------|
| Origen catálogo | `origen_tipo = TRÁNSITO_PP` |
| FI | `pp_id` real · `ppd_id` en detalle |
| Stock | `pedido_proveedor_detalle.pares_vendidos` |
| Panel | Tarjeta **COMPRA PREVIA** |
| Sales Report | `preventa` + `categoria_v2` PREVENTA · **blindado** |

### Rama B — Stock pronta entrega (nueva · mismo entorno)

| Pieza | Valor |
|-------|--------|
| Origen catálogo | `origen_tipo = PRONTA_ENTREGA` · `det_id ≥ 800000000` |
| FI | sin PP clásico · decremento `stock_pronta_entrega_rimec` |
| Stock | `cantidad_importada − cantidad` |
| Panel | Tarjeta **STOCK** |
| UI Aprobaciones | **Track visual distinto** (color PE · sin quincena PP) · roadmap UI |
| RPC | MIG-136 `confirmar_pedido_web` rama PE |

**Regla:** un `pedido_venta_rimec` puede traer **ambas ramas** — Aprobaciones lista **2+ FI** · Director confirma **cada una** · Panel suma en **dos tarjetas**.

---

## Programado — de reojo (8604 · 10.032 pares)

| # | Pendiente | Doc |
|---|-----------|-----|
| 1 | IC PROGRAMADO cat. 3 | [CHUSAR_INTENCION_COMPRA.md](../proceso_importacion/CHUSAR_INTENCION_COMPRA.md) |
| 2 | PP + proforma 8604 | [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) |
| 3 | Panel stock programado | **`/stock-programado`** · misma shell PE · **sin** RIMEC Web · grilla PPD |
| 4 | IC → vista panel | IC bandeja + tarjeta PROGRAMADO Panel (KPI cat. 3) |
| 5 | FI + CSV legal | Paridad compra previa agotada |

**Mismo entorno PPD** · tercera tarjeta Panel · **no mezclar** con CP ni PE en KPI.

---

## Paneles stock estrategia (mapa)

| Entidad | Ruta Report | Agrupación |
|---------|-------------|------------|
| STOCK PE | `/stock-pronta-entrega` | depósito legal CSV |
| COMPRA PREVIA | `/stock-transito` | **quincena dato duro** |
| PROGRAMADO | `/stock-programado` | quincena embarque IC |

---

## Implementación Report (2026-07-05)

| Pieza | Estado |
|-------|--------|
| Hub compacto (sin grilla embebida) | ✅ 2026-07-08 · [CHUSAR_PANEL_CONTROL_HUB_NAVEGACION](./CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md) |
| Panel PE vendido real | ✅ `queries-resumen.ts` · `cantidad_importada` |
| Panel CP vendido | ✅ `compra-previa-estadisticas-web.ts` |
| `/stock-transito` | ✅ |
| Aprobaciones UI dual track | ⏳ roadmap · lógica FI ya separa por `pp_id` vs PE |
| MIG-136 RPC PE en prod | ⏳ Claude Code |
| `/stock-programado` | ✅ · doc [CHUSAR_STOCK_PROGRAMADO](./CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md) |

---

## Smoke post-confirmación

1. Panel STOCK: `Vendido` > 0 tras FI PE confirmada.
2. Panel CP: `Vendido` sube +N coherente con Estadísticas Web.
3. Aprobaciones: 2 FI del mismo pedido web visibles.
4. Sales Report: **no tocar** — orbita montos por categoría heredada.

---

## Índice

- [CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md](./CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md)
- [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)
- [CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md](./CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md)
- [CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md)
- [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md)
- [CADENA_OPERATIVA_RIMEC.md](../CADENA_OPERATIVA_RIMEC.md) · circuitos A y B
- [INDICE.md](./INDICE.md)
