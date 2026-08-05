# CHUSAR — Stock Tránsito · Estrategia ventas Compra Previa

**Código:** **2.3.1.14**  
**Ratificado:** Director · 2026-07-05  
**Ruta Report:** `/stock-transito`  
**Shibboleth:** Andrés, el que viene.

---

## Norte

RIMEC Web **vende** compra previa en tránsito (`v_stock_rimec` · `TRÁNSITO_PP`) pero **no tenía** panel de estrategia en Report. Este módulo es la **misma vista operativa que Stock Pronta Entrega**, aplicada a mercadería **EN_TRANSITO** — bibliotecas Motor Precios, casos, listados, grilla moléculas, venta real (`pares_vendidos`).

> **Universo Director (más amplio):** todo PP **no ENVIADO** a Compras — incluye programado y PP no alzados. Ver [CHUSAR_UNIVERSO_TRANSITO_PP.md](../proceso_importacion/CHUSAR_UNIVERSO_TRANSITO_PP.md). Este módulo (`/stock-transito`) cubre el **subconjunto catálogo** compra previa alzada.

**Agrupación canónica:** **`quincena_arribo_id`** (FK tabla `quincena_arribo` 1–24) — **no** ETA suelta. Ver `MAPEO_ETA_PARA_DESENCHUFE.md`.

> **Etiqueta UI:** **Llegada** (multi-select dropdown).  
> **Prohibido en UI:** «Dato duro» — término **solo documentación interna** (referencia conceptual al FK, igual que «Alejandro Magno» es nombre de etapa, no label de pantalla). Error: `4.02.03.004`.

---

## Paridad visual con Stock PE

| Bloque PE | Tránsito |
|-----------|----------|
| `BibliotecaCasoBar` | ✅ `/api/stock-transito/filtros-indice` |
| `TrianguloHeaderDeposito` | ✅ pilares + calzado |
| Chips depósito legal | **Filtro Llegada** (multi-select · paridad Web) |
| `GrillaPeImportadora` | ✅ misma grilla |
| Ventas demo localStorage | **`TransitoVentasVitales`** — vendido/saldo **BD** (`pares_vendidos`) |
| Origen datos | `stock_pronta_entrega_rimec` | `v_stock_rimec` WHERE `origen_tipo='TRÁNSITO_PP'` |

---

## Universo datos

```
pedido_proveedor.estado_transito = 'EN_TRANSITO'
v_stock_rimec.saldo_pares > 0
pedido_proveedor_detalle.referencia IS NOT NULL
```

| Campo fila | Fuente |
|------------|--------|
| `cantidad` (saldo UI) | `saldo_pares` |
| `cantidad_inicial` | `cantidad_pares` |
| `pares_vendidos` | columna PPD — paridad Estadísticas Web |
| `precio_unitario` | `lpn` vista → parse LPN |
| `caso_precio` | `precio_lista` / evento IC |
| `quincena_desc` | `quincena_arribo.descripcion` |

KPI Panel de Control **COMPRA PREVIA** = mismo SQL que [CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md](./CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md).

---

## KPI INICIAL — criterio unificado (2026-07-05)

**Fuente canónica (holding):** RIMEC Web → **Estadísticas** (`/estadisticas`) sin filtros.

Implementación Report idéntica: `getCompraPreviaEstadisticasWeb()` · espejo `fetchControl.ts` + `calcularKpis`.

| Métrica | Fórmula | Universo |
|---------|---------|----------|
| **INICIAL** | `SUM(cantidad_pares)` por molécula | PP `estado_transito='EN_TRANSITO'` · PPD `referencia IS NOT NULL` |
| **VENDIDO** | `SUM(pares_vendidos)` | mismo |
| **SALDO** | **INICIAL − VENDIDO** | mismo |

**Molécula** = GROUP BY `pp_id + linea + referencia + material_code + color_code + grada`.

### Dos modos en Stock Tránsito (no confundir)

| Modo | Cuándo | Inicial incluye agotados (saldo=0) |
|------|--------|-------------------------------------|
| **Canónico** | Sin filtros UI · vitales etiqueta **· canónico** | **Sí** — = Web 33.576 |
| **Filtrado** | Quincena · caso biblioteca · pilares | No — suma grilla (`saldo_pares>0` + filtros) |

La **grilla** siempre lista solo moléculas vendibles (`saldo_pares > 0`). Los KPIs superiores **sin filtros** usan resumen servidor, no suma de la grilla.

Violación corregida: `4.02.03.003` · lib `vitales-canonicos.ts`.

---

## Archivos Report

| Ruta | Rol |
|------|-----|
| `src/app/stock-transito/page.tsx` | Shell página |
| `src/components/stock-transito/FiltroLlegadaMulti.tsx` | Dropdown Llegada multi-select |
| `src/lib/stock-transito/queries-productos.ts` | Grilla desde `v_stock_rimec` |
| `src/lib/stock-transito/queries-resumen.ts` | KPI + por quincena |
| `src/lib/stock-transito/queries-ventas-comprador.ts` | Compradores cadena/cliente por molécula |
| `src/lib/clientes/etiqueta-comprador.ts` | Truncado etiqueta · cadena vs 2 nombres |
| `src/app/api/stock-transito/*` | API productos · resumen · biblioteca |

**Compradores en tarjeta extendida:** [CHUSAR_COMPRADORES_CADENA_STOCK_TRANSITO.md](./CHUSAR_COMPRADORES_CADENA_STOCK_TRANSITO.md) · ratificación vendido **10.928** · solo CP · PP `EN_TRANSITO`.

---

## Entrada

- Panel de Control → tarjeta **COMPRA PREVIA** → **Ver productos →** → `/stock-transito`
- RIMEC Web catálogo/estadísticas = canal venta · Report tránsito = **estrategia Director**

---

## Smoke

1. `/stock-transito` carga grilla con imágenes y casos biblioteca.
2. Filtro quincena reduce pares — KPIs desde `por_quincena` (**canónico** por quincena).
3. **Sin filtros UI:** vitales **· canónico** = **exacto** `/estadisticas` Web (INICIAL · VENDIDO · SALDO).
4. Con filtros caso/pilares: vitales **· filtrado** (subset grilla).

---

## Índice

- [CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md](../motor_precios/CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md)
- [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md)
- [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)
- [CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md](./CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md)
- [INDICE.md](./INDICE.md)
