# P-03 — Sub-módulo · Caja operativa (card A)

**Código plan:** P-03 · **Sub-card:** A (dentro de cada 2.3.2.2.x)  
**Protocolo:** [P-12_PROTOCOLO_CAJERO_BOBINA.md](./P-12_PROTOCOLO_CAJERO_BOBINA.md)

---

## Propósito

**Bandeja de entrada del cajero** — CSV pendiente de enviar a **Bobeda** (`ticket_venta_pos`).

**Estado ideal:** bandeja **VACÍA**.

---

## Funciones obligatorias

| # | Función | Detalle |
|---|---------|---------|
| 1 | Bandeja pendientes | Tickets `PENDIENTE_CAJA` / `CSV_DESCARGADO` · hoy · tienda fija |
| 2 | Indicador **Pendiente** | LED/fila — hay CSV por procesar |
| 3 | Buscar cliente | Nombre · cédula · «¿a nombre de quién facturó el vendedor?» |
| 4 | Detalle ticket | L.R · material · color · grada · vendedor · hora · miniatura |
| 5 | **Descargar CSV** | Import facturador legacy |
| 6 | **Enviar a Bobeda** | Habilitado **solo post-CSV** → `PENDIENTE_ENTREGA` · limpia bandeja |
| 7 | Últimos movimientos | Stream / poll 30s |

---

## Reglas

- Solo tickets del **`cliente_id`** de la caja (P-06).
- Cajero confirma **coincidencia exacta** ticket Nexus ↔ caja real antes de Bobeda.
- Cliente **no necesita ticket físico** — pregunta clave por nombre.
- Bobeda: reversiones solo autorización especial (Director) — ⏳.

---

## APIs

| Método | Ruta | Notas |
|--------|------|-------|
| GET | `/api/tablet-bazzar/tickets` | ✅ · filtrar tienda + estado |
| GET | `/api/tablet-bazzar/tickets/csv` | ✅ |
| POST | `/api/tablet-bazzar/tickets/facturar` | ✅ parcial · evolucionar a Enviar Bobeda |
| POST | `/api/tablet-bazzar/tickets/bobeda` | ⏳ post-CSV |

---

## UI

Por fila: **Pendiente** · Descargar CSV · Enviar a Bobeda (disabled hasta CSV). Cards táctiles · feedback < 1s.
