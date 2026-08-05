# CHUSAR — Stock Programado · Estrategia ventas PROGRAMADO

**Código:** **2.3.1.16**  
**Ratificado:** Director · 2026-07-07  
**Ruta Report:** `/stock-programado`  
**Shibboleth:** Andrés, el que viene.

---

## Norte

PROGRAMADO (`categoria_id=3`, `compra_previa=false`) **no** aparece en RIMEC Web (Ley 3). El Director necesita el mismo panel de estrategia que tránsito y PE: bibliotecas Motor, casos, listados, grilla moléculas y venta real — **solo en Report**.

**Diferencia clave vs tránsito:** la grilla lee **`pedido_proveedor_detalle` directo**, no `v_stock_rimec` (vista = solo CP `EN_TRANSITO` · MIG-138).

Mapa general: [CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md](../motor_precios/CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md)

---

## Paridad visual con Stock Tránsito / PE

| Bloque | Programado |
|--------|------------|
| `BibliotecaCasoBar` | ✅ `/api/stock-programado/filtros-indice` |
| `TrianguloHeaderDeposito` | ✅ pilares + calzado |
| Filtro quincena | **Llegada / embarque** (`quincena_arribo_id` IC) |
| `GrillaPeImportadora` | ✅ misma grilla · `showVentas` activo |
| Vitales vendido/saldo | **`ProgramadoVentasVitales`** — BD `pares_vendidos` |
| Origen datos grilla | **PPD** + CTE `pp_cat` · cat. 3 |

---

## Universo datos

```sql
-- CTE pp_cat: pp.categoria_id OR primera IC vinculada
WHERE pc.categoria_id = 3  -- PROGRAMADO
  AND ppd.linea IS NOT NULL
  AND (saldo_pares > 0 OR pares_vendidos > 0)  -- incluye agotados con venta
```

| Campo fila | Fuente |
|------------|--------|
| `cantidad_inicial` | `ppd.cantidad_pares` |
| `pares_vendidos` | `ppd.pares_vendidos` + `venta_transito` (GREATEST) |
| `saldo` | inicial − vendido |
| `caso_precio` | join `precio_lista` / evento IC |
| `quincena_desc` | `quincena_arribo.descripcion` (FECHA DE EMBARQUE IC) |

**Prohibido:** filtrar programado desde `v_stock_rimec` — devuelve 0 filas para cat. 3.

---

## KPI resumen

| Métrica | Fórmula | Universo |
|---------|---------|----------|
| **INICIAL** | `SUM(cantidad_pares)` | PPD cat. 3 · `linea IS NOT NULL` |
| **VENDIDO** | `SUM(pares_vendidos)` (+ venta_transito) | mismo |
| **SALDO** | INICIAL − VENDIDO | mismo |

Por quincena: agrupa moléculas por `quincena_arribo_id`.

Lib: `report/src/lib/stock-programado/queries-resumen.ts`

---

## Caso referencia — proforma 8604

| Métrica | Valor |
|---------|-------|
| Pares totales | 10.032 |
| ICs | 10 · SHOP ↔ `id_cliente` |
| PP | cat. 3 · evento único |
| Import | [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](../proceso_importacion/PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) |

Tras import: grilla programado muestra moléculas con ventas en tarjetas (`showVentas`).

---

## Archivos Report

| Ruta | Rol |
|------|------|
| `src/app/stock-programado/page.tsx` | Shell página |
| `src/components/stock-programado/StockProgramadoClient.tsx` | UI · tabs Operativa/Artículos |
| `src/components/stock-programado/TabArticulosProgramado.tsx` | Gráficos pilares |
| `src/components/stock-programado/StockProgramadoContext.tsx` | Estado filtros |
| **Grilla v1 doc** | [CHUSAR_STOCK_PROGRAMADO_GRILLA_V1.md](./CHUSAR_STOCK_PROGRAMADO_GRILLA_V1.md) |
| `src/lib/stock-programado/queries-productos.ts` | Grilla desde PPD |
| `src/lib/stock-programado/queries-resumen.ts` | KPI + por quincena |
| `src/lib/stock-programado/pp-categoria-sql.ts` | CTE `pp_cat` compartido con tránsito |
| `src/app/api/stock-programado/*` | productos · resumen · filtros-indice |

---

## Entrada

- Panel de Control → tarjeta **PROGRAMADO** → **Ver productos →** → `/stock-programado`
- Enlace directo en `queries-resumen.ts` panel-control: `enlace_report: "/stock-programado"`

---

## No confundir

| | Tránsito | Programado |
|---|----------|------------|
| Cat. | 2 | 3 |
| Web | ✅ catálogo | ❌ |
| Vista SQL grilla | `v_stock_rimec` TRÁNSITO_PP | PPD directo |
| `compra_previa` | true | false |
| Venta típica | FI desde carrito web | FI directa post-proforma |

---

## Índice

- [CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md)
- [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)
- [CHUSAR_PANEL_CORAZON_CASO_PRUEBA_DUAL.md](./CHUSAR_PANEL_CORAZON_CASO_PRUEBA_DUAL.md)
- [INDICE.md](./INDICE.md)
