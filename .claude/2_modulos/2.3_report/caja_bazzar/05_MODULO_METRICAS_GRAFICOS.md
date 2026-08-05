# P-05 — Sub-módulo · Métricas / gráficos (card C)

**Código plan:** P-05 · **Sub-card:** C

---

## Propósito

Visión gerencial **por tienda** — estándar tienda seria: KPIs + gráficos + movimientos recientes.

---

## Métricas mínimas (v1)

| KPI | Fuente |
|-----|--------|
| Pares vendidos hoy | SUM(cantidad) `ticket_venta_pos` |
| Tickets emitidos | COUNT |
| Pendientes vs facturados | GROUP BY estado |
| Top vendedores día | GROUP BY vendedor_id |
| Pares por hora | histograma |

---

## Gráficos (v1)

- Barras: pares por hora (hoy)
- Donut: pendiente / facturado
- Sparkline: últimos 7 días (cuando haya histórico)

---

## Movimientos recientes

Feed últimos 20 tickets — auto-refresh 30s — misma query que card A sin acciones destructivas.

---

## Pilares en agregación

Filtros opcionales por marca · estilo (desde `snapshot_json` o JOIN pilares) — **no mutar pilares** desde caja.

---

## Alcance

Solo **`cliente_id` de la caja**. Supervisor multi-tienda (rol DIOS) ve hub agregado — excepción documentada en P-06.
