# CHUSAR — Stock Programado · Ventas ejecutadas · FI · UI 2026-07-12

**Código:** **2.3.1.16.3**  
**Estado:** 🟢 **CANÓNICO** · deploy Report Vercel 2026-07-12  
**Shibboleth:** Andrés, el que viene.

> Sesión PP-8051 (PP-2026-0019 · id 28) · réplica canon CP · color venta verde · acordeones tarjeta.

**Padres:** [DOC_CANON_VENTAS_EJECUTADAS_PROGRAMADO_20260712.md](./DOC_CANON_VENTAS_EJECUTADAS_PROGRAMADO_20260712.md) · [CHUSAR_STOCK_PROGRAMADO_GRILLA_V1.md](./CHUSAR_STOCK_PROGRAMADO_GRILLA_V1.md)

---

## 1 · Alcance deploy

| Módulo | Rutas / piezas |
|--------|-----------------|
| **Panel Control** | `/rimec?mundo=panel-control` · vitales · tile Ventas ejecutadas CP |
| **Stock Programado** | `/stock-programado` · `?proforma=8051` |
| **Stock Tránsito** | `/stock-transito` · `/stock-transito/ventas` |
| **Grilla compartida** | `PeCardMiniatura` · `CompradoresVentasSlot` · `GradaImportadoraAcordeon` |
| **Pedido proveedor** | PP-28 admin IC · FI RESERVADA (115) · backfill snapshot imagen |

---

## 2 · Ley color — VENTA = VERDE

**Ratificado Director 2026-07-12.** Prohibido `rose-*` / rojo para métricas de venta.

| Token | Tailwind canónico | Uso |
|-------|-------------------|-----|
| Badge foto `{N} v` | `bg-emerald-600` · texto blanco | Esquina tarjeta |
| Cifra vendido | `text-emerald-700` … `900` | Bloque COMPRADO/VENDIDO |
| Vitales cabecera | `border-emerald-300` · `bg-emerald-50` | `*VentasVitales` |
| Tile Panel «Ventas ejecutadas» | `border-emerald-200` · `bg-emerald-50/80` | CP (y futuro Programado) |
| Compradores `{N} v` | `text-emerald-700` | Acordeón violeta · cifra verde |
| Grada `{N} v` | `text-emerald-700` | Acordeón naranja · cifra verde |

**Código único:** `report/src/lib/nexus/venta-visual.ts` → `VENTA_VISUAL`.

Saldo / comprado / entidad Programado (ámbar) / CP (azul) **no cambian**.

---

## 3 · Datos venta Programado — PP-8051

| Campo | Valor verificado BD |
|-------|---------------------|
| PP | PP-2026-0019 · `pp_id=28` |
| Proforma | `8051/2026` |
| FI | **115** · estado **RESERVADA** |
| Líneas FI | **912** · **9.400 pares** |
| PPD | saldo **0** · vendido **100%** |

### 3.1 · Query compradores

`listVentasCompradorProgramado` · `fi.estado IN ('RESERVADA','CONFIRMADA')` · clave `L-R-M-C|pp_id`.

### 3.2 · Bug fix filtro proforma

`applyOperativaFilters` excluía `cantidad=0` → PP 100% vendido = **0 tarjetas**.

**Fix:** `incluirVendidoSinSaldo: true` en `stock-programado-filters.ts`.

### 3.3 · Filtros duros

| Filtro | Dato | UI |
|--------|------|-----|
| Llegada | `quincena_arribo_id` | `FiltroLlegadaMulti` |
| Proforma | `pp_id` + `numero_proforma` | `FiltroProformaMulti` · badge `N FI` |
| URL | `?proforma=8051` | auto-selección PP |

---

## 4 · Tarjeta molécula — acordeones (riguroso)

| Bloque | Cerrado | Abierto |
|--------|---------|---------|
| **Compradores** | `N · X v` · 1 línea | **Lista completa** · sin «+N más» · scroll `max-h-[6.5rem]` |
| **Grada** | resumen curvas | filas curva + `v`/`p` · scroll `max-h-[5.5rem]` |
| **Tarjeta** | sin `min-h` fijos · `auto-rows-min` grilla | padding `p-2` |

Reset acordeón al **Compactar tarjetas** (`resetKey={!expanded}`).

---

## 5 · Inventario archivos código

| Archivo | Cambio |
|---------|--------|
| `lib/nexus/venta-visual.ts` | Tokens verde venta |
| `lib/stock-programado/queries-ventas-comprador.ts` | FI RESERVADA+CONFIRMADA |
| `lib/stock-programado/stock-programado-filters.ts` | vendido sin saldo · proforma |
| `lib/stock-programado/queries-resumen.ts` | `por_proforma` + `n_fi` |
| `lib/depositos/operativa-filters.ts` | `incluirVendidoSinSaldo` · buscar proforma |
| `lib/depositos/agrupar-pe-importadora.ts` | compradores por PP |
| `components/stock-programado/*` | Context · Client · FiltroProforma |
| `components/stock-pronta-entrega/PeCardMiniatura.tsx` | layout + verde |
| `components/stock-pronta-entrega/CompradoresVentasSlot.tsx` | acordeón full list |
| `components/stock-pronta-entrega/GradaImportadoraAcordeon.tsx` | sin h-20 fijo |
| `*VentasVitales.tsx` · `MundoPanelControl.tsx` | verde venta |

---

## 6 · PP programado sin FI (resto del día)

Otros PP cat. 3 **sin admin IC completo** → grilla visible · **COMPRADORES vacío** hasta generar FI.

**Piloto canónico:** solo **8051/2026** hasta cerrar emparejamiento IC↔prefactura (etapa hoy).

---

## 7 · Smoke local

```powershell
cd report
npm run build
npm run dev:clean:3000
# /stock-programado?proforma=8051 → Extender tarjetas → Compradores ▾ + Grada ▾
node scripts/_verify_prog8051_filter.mjs
node scripts/_diag_pp28_fi_ventas.mjs
```

---

**Documenta 2026-07-12 — Director · venta verde · Programado FI 8051 · deploy Report.**
