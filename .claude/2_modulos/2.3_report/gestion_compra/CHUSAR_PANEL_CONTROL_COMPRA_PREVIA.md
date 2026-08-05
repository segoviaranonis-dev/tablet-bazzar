# CHUSAR — Panel de Control · Compra previa = Estadísticas RIMEC Web

**Código:** **2.3.1.13**  
**Ratificado:** Director · 2026-07-05  
**Violación corregida:** integridad KPI Compra previa Panel de Control ≠ Estadísticas catálogo mayorista  
**Shibboleth:** Andrés, el que viene.

---

## Ley (indiscutible)

**COMPRA PREVIA** en Panel de Control (`/rimec?mundo=panel-control`) debe ser **réplica exacta** de los KPIs superiores de **RIMEC Web → Estadísticas** (`/estadisticas`) **sin filtros aplicados** (todos los PP en tránsito seleccionados por defecto).

| Métrica Panel | Fuente canónica Web |
|---------------|---------------------|
| Pares inicial | `SUM(cantidad_pares)` |
| Vendido | `SUM(pares_vendidos)` |
| Saldo | **inicial − vendido** (no `GREATEST` fila a fila en el total) |
| Moléculas | filas normalizadas por 5 pilares + PP |
| Pedidos PP | `COUNT(DISTINCT pp_id)` con filas |

**Prohibido** inventar otro universo (p. ej. `categoria_id = 2` sin `estado_transito`, o `venta_transito` cuando Web usa `pares_vendidos`).

---

## Universo SQL (igual que Web)

Implementación Report: `report/src/lib/panel-control/compra-previa-estadisticas-web.ts`  
Espejo código Web: `rimec-web/lib/controlStock/fetchControl.ts` + `buildTree.ts` (`calcularKpis`, `normalizarFilasMolecula`).

```
pedido_proveedor
  WHERE estado_transito = 'EN_TRANSITO'   -- solo compra previa en tránsito (PP abiertos operativos web)

pedido_proveedor_detalle
  WHERE referencia IS NOT NULL            -- misma exclusión que .not('referencia', 'is', null)

GROUP BY pp_id, linea, referencia, material_code, color_code, grada
  → molécula (suma inicial/vendido por clave)
```

| Campo | Fórmula |
|-------|---------|
| `inicial` | `SUM(cantidad_pares)` por molécula |
| `vendido` | `SUM(pares_vendidos)` por molécula — **no** `venta_transito` en Panel |
| `saldo` KPI | `SUM(inicial) - SUM(vendido)` |

### Referencia cruzada — Stock Tránsito estrategia

En `/stock-transito` la grilla excluye moléculas agotadas (`saldo=0`). Los KPI **canónicos** (sin filtros UI) **no** usan suma de grilla — usan este mismo SQL. Ver [CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md) § KPI INICIAL.

---

## Violación grave (2026-07-05) — corregida

**Síntoma:** Panel mostraba p. ej. **53.128 / 11.912 / 41.216** vs Web **33.576 / 9.288 / 24.288**.

**Causa:** `aggPpPorCategoria(categoria_id=2)` contaba **todos** los PP de categoría IC sin filtrar `estado_transito`, mezclaba `venta_transito` con `pares_vendidos`, y usaba `linea IS NOT NULL` en lugar de `referencia IS NOT NULL`.

**Corrección:** función dedicada `getCompraPreviaEstadisticasWeb()` — solo tránsito Web.

---

## Qué NO es Compra previa en Panel

| Entidad | Panel | Web estadísticas |
|---------|-------|------------------|
| STOCK PE | `stock_pronta_entrega_rimec` | catálogo PE (otro módulo) |
| PROGRAMADO | `categoria_id = 3` (sin catálogo) | **no aparece** en estadísticas |
| PP cerrados / no tránsito | **excluidos** | **excluidos** |

---

## Smoke

1. RIMEC Web `/estadisticas` — anotar INICIAL · VENDIDO · SALDO · PP (sin filtros).
2. Report `/rimec?mundo=panel-control` — tarjeta **COMPRA PREVIA** debe coincidir **exacto**.
3. Si difiere → bug integridad · no publicar Panel.

---

## Índice

- [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)
- [INDICE.md](./INDICE.md)
- `protocolo_errores.md` → título **Panel Control CP ≠ Estadísticas Web**
