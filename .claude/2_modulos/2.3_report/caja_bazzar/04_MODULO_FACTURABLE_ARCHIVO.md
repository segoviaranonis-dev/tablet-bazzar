# P-04 — Sub-módulo · Facturable / archivo caja (card B)

**Código plan:** P-04 · **Sub-card:** B

---

## Propósito

Todo lo **ya procesado en caja** — trazabilidad ticket → factura legal.

---

## Funciones

| # | Función |
|---|---------|
| 1 | Listado `estado = FACTURADO` |
| 2 | Filtro fecha · vendedor · cliente |
| 3 | Re-export CSV histórico (auditoría) |
| 4 | Archivo por día / cierre caja (futuro) |
| 5 | Vínculo referencia factura externa (campo opcional `ref_factura_legal`) |

---

## Separación operativa vs archivo

| Card A (Caja) | Card B (Facturable) |
|---------------|---------------------|
| Pendiente | Cerrado |
| Acción alta | Lectura + auditoría |
| CSV salida | CSV histórico |

---

## Estado BD planificado

```sql
-- Evolución ticket_venta_pos (OT futura)
-- estado: EMITIDO | FACTURADO | ANULADO
-- facturado_at timestamptz
-- ref_factura_legal text
```

---

## Estándar retail

Caja operativa limpia — lo facturado **sale de la cola** y vive en archivo consultable.
