# HOTFIX — Ventas stands stock par L+R

**Fecha:** 2026-06-17  
**Error holding:** `4.03.03.001`  
**Evidencia:** `docs/evidencia/SUBSESION_VENTAS_STANDS_HOTFIX_20260617.json`

---

## Problema

INGRESAR muestra **214 p** en ref `1184.1101`. Vista Ventas mostraba **1 grada** (ej. 4 p) y sin stands otras tiendas.

## Fix

| Pieza | Cambio |
|-------|--------|
| `lib/server/stock-par-grada.ts` | SQL agregado por par L+R (código o FK) |
| `/api/deposito/{id}/live` | `scope=par_lr` · cohorte 3 ubicaciones |
| `useStockOtrosLocales` | Poll por `parNav`, no molécula |
| `StockOtrasTiendasDock` | Mini-tabla tallas (stands) |
| `GradaVentaStrip` | Total «214 p» + botones 34–40 · carrito |

## API live (nuevo contrato)

```
GET /api/deposito/{cliente_id}/live?linea=1184&referencia=1101
```

Respuesta: `cantidad_local` + `ubicaciones[]` (Fernando, Palma, San Martín) con `tallas[]` y `stock[]`.

## Smoke

1. `/cadena` → VIZZANO → INGRESAR `1184.1101`
2. Footer: **Otras tiendas** + **Tallas · Fernando · 214 p**
3. Tap talla → carrito +1

---

**Shibboleth:** 7 años
