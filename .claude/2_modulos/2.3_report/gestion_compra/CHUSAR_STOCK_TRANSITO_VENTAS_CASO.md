# CHUSAR — Stock Tránsito · Ventas ejecutadas · Filtro caso biblioteca

**Código:** **2.3.1.14.1**  
**Ruta:** `/stock-transito/ventas`  
**Deploy:** Report prod · 2026-07-11  
**Shibboleth:** Andrés, el que viene.

---

## Síntoma (Director · 2026-07-11)

Al elegir chip **PROMOCIONAL (22)** en biblioteca Motor:

- Header mostraba ~28k pares (catálogo completo).
- Grilla vacía: «Sin productos o sin coincidencias con los filtros».
- Vitales **VENDIDO · TRÁNSITO 0 PARES**.

---

## Causa

| # | Bug |
|---|-----|
| 1 | Filtro caso solo cruzaba `lineaCasoMap` BCL — moléculas con `caso_precio` en PPD no entraban. |
| 2 | Vista **ventas** exigía `pares_vendidos > 0` aun con caso activo — chip (22) = líneas BCL, no ventas. |
| 3 | KPIs header (`cardsCount`, `totalPares`) no seguían la grilla visible. |

**BD (tránsito CP):** 48 moléculas `PROMOCIONAL` · 468 pares vendidos · 20 SKUs con vendido > 0.

---

## Fix

| Archivo | Cambio |
|---------|--------|
| `caso-biblioteca.ts` | `filterRowsByCasoActivo` · BCL **o** `caso_precio` |
| `vista-transito.ts` | Con `casoActivo` en ventas → muestra **todo el caso** |
| `StockTransitoClient.tsx` | KPIs alineados a `filtradasGrid` |
| `agrupar-pe-importadora.ts` | Badge caso desde `caso_precio` fallback |
| PE / Programado / Bazzar operativa | Mismo filtro caso unificado |

---

## Regla operativa

| Vista | Sin caso | Con caso activo |
|-------|----------|-----------------|
| `/stock-transito/disponible` | saldo > 0 | saldo > 0 en caso |
| `/stock-transito/ventas` | solo vendido > 0 | **todo el universo del caso** (vendido puede ser 0) |

Chip `(N)` = líneas en biblioteca BCL · no garantiza N ventas.

---

## Smoke

1. `:3000/stock-transito/ventas` · biblioteca canónica.
2. Clic **PROMOCIONAL** → tarjetas calzado visibles · header coherente.
3. **Todos** → solo moléculas con vendido > 0.

---

## Índice

- [CHUSAR_COMPRADORES_CADENA_STOCK_TRANSITO.md](./CHUSAR_COMPRADORES_CADENA_STOCK_TRANSITO.md)
- [CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md)
- [CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md](./CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md)
