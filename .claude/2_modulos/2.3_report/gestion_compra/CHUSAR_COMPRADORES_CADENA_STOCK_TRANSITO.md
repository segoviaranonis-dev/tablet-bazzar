# CHUSAR — Compradores por cadena · Stock Tránsito CP · Ratificación vendido

**Código:** **2.3.1.19**  
**Ratificado:** Director · 2026-07-08  
**Ruta UI:** `/stock-transito/ventas` · tarjetas extendidas  
**Padre:** [CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md) · [MAPA_PANEL_CP_TRANSITO_STOCK_VENTAS.md](./MAPA_PANEL_CP_TRANSITO_STOCK_VENTAS.md)  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Pregunta gerencial

Tras saber **cuánto** se vendió en tránsito CP, el Panel responde **¿a quién comprar de nuevo?**  
Prioridad: **cadena cliente** (`cliente_cadena_v2` → `cadena_v2`). Sin cadena: **dos primeros nombres** del `descp_cliente` (truncado). **Prohibido** etiqueta «S/C» o «sin cadena».

---

## 2 · Ratificación vendido (auditoría BD 2026-07-08)

| Check | Resultado | Evidencia |
|-------|-----------|-----------|
| **Pares vendidos KPI** | **10.928** | `getCompraPreviaEstadisticasWeb()` |
| **Solo PP abiertos operativos** | ✅ | `pedido_proveedor.estado_transito = 'EN_TRANSITO'` |
| **Solo compra previa** | ✅ | Todo el vendido sale de `categoria_id = 2` (PRE VENTA) |
| **PPD `pares_vendidos`** | **10.928** | Suma PPD en PP CP EN_TRANSITO |
| **FI `CONFIRMADA`** | **10.928** | Suma `factura_interna_detalle.pares` mismo universo |
| **Programado en tránsito** | 1 PP · **0 vendido** | No contamina KPI CP |

**Paridad triple indiscutible:**

```
SUM(ppd.pares_vendidos) = SUM(fid.pares FI CONFIRMADA) = KPI Panel VENDIDO = 10.928
```

**Nota universo Panel:** el KPI canónico filtra **`EN_TRANSITO`** (réplica Web Estadísticas). En la práctica **todo** el vendido de ese universo es CP — el filtro explícito `categoria_id = 2` (`SQL_FILTER_COMPRA_PREVIA`) da **el mismo total**. Hay 1 PP programado EN_TRANSITO sin ventas.

**Otros KPIs mismo universo (2026-07-08):** Inicial 39.104 · Saldo 28.176 · 4 PP con moléculas · 839 moléculas.

---

## 3 · Universo SQL — compradores (tarjeta extendida)

Implementación: `report/src/lib/stock-transito/queries-ventas-comprador.ts`

| Filtro | Columna / regla |
|--------|-----------------|
| PP abierto tránsito | `pp.estado_transito = 'EN_TRANSITO'` |
| Compra previa | `SQL_FILTER_COMPRA_PREVIA` → `categoria_id = 2` vía CTE `pp_cat` |
| Venta ejecutada | `fi.estado = 'CONFIRMADA'` |
| Línea trazable | `fid.ppd_id IS NOT NULL` |
| Cadena | `LEFT JOIN LATERAL` `cliente_cadena_v2` + `cadena_v2` (primera cadena por `id_cadena`) |
| Cliente | `cliente_v2.descp_cliente` |

**Agrupación molécula:** `linea + referencia + material_code + color_code` → mapa `ventasComprador` en API.

**Etiqueta UI:** `lib/clientes/etiqueta-comprador.ts` — máx. **28 caracteres** · cadena manda · sin cadena = 2 tokens nombre.

---

## 4 · Tabla puente cadena (Sales Report)

| Tabla | Columnas prod (2026-07-08) |
|-------|----------------------------|
| `cliente_cadena_v2` | `id_cliente`, `id_cadena` — **sin** columna `activo` |
| `cadena_v2` | `id_cadena`, `descp_cadena`, … |

**Error corregido:** query asumía `cc.activo` → `column cc.activo does not exist`. Fix: quitar filtro; API productos tolerante (grilla no cae si falla compradores).

---

## 5 · UI

| Acción | Comportamiento |
|--------|----------------|
| «Extender todos los datos» | Slot violeta **Compradores** bajo grada |
| Cada fila | Etiqueta truncada + `N v` (pares FI confirmados) |
| Top 3 + «+N más» | Evita desborde tarjeta |

Componentes: `CompradoresVentasSlot.tsx` · `PeCardMiniatura.tsx` · `GrillaPeImportadora.tsx` (prop `ventasPorMol`).

---

## 6 · Archivos Report

| Archivo | Rol |
|---------|-----|
| `src/lib/clientes/etiqueta-comprador.ts` | Truncado · cadena vs cliente · agregación |
| `src/lib/stock-transito/queries-ventas-comprador.ts` | SQL compradores |
| `src/app/api/stock-transito/productos/route.ts` | `ventasComprador` en JSON |
| `src/components/stock-transito/StockTransitoContext.tsx` | Map en cliente |
| `src/components/stock-pronta-entrega/CompradoresVentasSlot.tsx` | Slot UI |

---

## 7 · Smoke

1. `/stock-transito/ventas` — vitales **VENDIDO** = **10.928** (canónico sin filtros).
2. Extender tarjetas — bloque Compradores con cadena (ej. BAZZAR) o cliente corto (sin cadena).
3. Suma pares compradores por molécula ≤ vendido molécula en PPD.
4. No aparece «S/C» en UI.

---

## 8 · Índice

- [CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md](./CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md)
- [CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md](./CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md) · **2.3.1.20**
- [CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md](./CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md)
- [CHUSAR_MERCADERIA_EN_TRANSITO.md](./CHUSAR_MERCADERIA_EN_TRANSITO.md)
- Sales Report cadena: `.claude/3_arquitectura/3.1_sales_report/arquitectura_ventas.md`
- [INDICE.md](./INDICE.md)
