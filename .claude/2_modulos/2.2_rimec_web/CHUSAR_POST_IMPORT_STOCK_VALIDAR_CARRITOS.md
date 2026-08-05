# CHUSAR — Post-import stock real · Revalidación carritos abiertos

**Código:** `2.2.4.0.2`  
**Fecha:** 2026-07-13  
**Secuencia:** deploy RIMEC Web → import Excel depósito RIMEC (Report) → VALIDAR carritos

---

## Contexto operativo

1. **Deploy** RIMEC Web con fixes PE (cajas cerradas, dual cache, filtros compartidos).
2. **Import stock real** desde módulo depósito RIMEC (`/stock-pronta-entrega` · Track 1 día operativo).
3. Vendedores con **sesión de venta abierta** y carrito en BD deben **re-coordinar** con botón **VALIDAR** — el carrito está aparte del catálogo; no se vacía solo.

---

## Regla de negocio

| Estado tras VALIDAR | Acción vendedor |
|---------------------|-----------------|
| Stock OK + precio OK | Token 60 s → confirmar pedido |
| `STOCK_INSUFICIENTE` (hay algo pero menos cajas) | Reducir cantidad o eliminar ítem |
| `ITEM_OBSOLETO` o stock = 0 | **Debés eliminar este artículo por falta de stock** |
| `SIN_PRECIO` | Quitar ítem — botón «Quitar N ítem(s) sin precio» |
| `PRECIO_CAMBIO` | Revalidar — precio se actualiza al confirmar según lista |

---

## Implementación

**Backend PE:** `lib/carritoValidarPe.ts`

- `ITEM_OBSOLETO` — `det_id` ya no existe en vista stock PE
- `STOCK_INSUFICIENTE` — `cajas_solicitadas > cajas_actuales`
- RPC `carrito_validar` solo para CP; PE puro usa `validarCarritoPeApp`

**UI:** `app/carrito/page.tsx`

- Banner DIFERENCIAS con texto explícito post-import
- Botón **Quitar N ítem(s) sin stock** (`ITEM_OBSOLETO` + stock 0)
- Botón **Quitar N ítem(s) sin precio**

**API:** `POST /api/carrito/validar`

---

## Procedimiento Director (después del deploy)

1. Importar Excel stock real en Report (depósito RIMEC).
2. Avisar vendedores: «Antes de confirmar, tocá VALIDAR en el carrito».
3. Smoke cliente prueba **5000** (Bazzar.py) — reversión al cierre del día si aplica.
4. Cualquier PVR/FI de prueba → solo revertir con orden explícita ([CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md](./CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md)).

---

## No mezclar

- Sales Report (`registro_ventas_general_v2`) — blindado
- Carrito CP+PE mixto — RPC + parche PE (`parcheValidarProntaEntrega`)
