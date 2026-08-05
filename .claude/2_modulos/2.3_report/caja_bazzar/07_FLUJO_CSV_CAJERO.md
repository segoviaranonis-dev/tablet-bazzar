# P-07 — Flujo CSV · cajero · Bobeda

**Código plan:** P-07 · **Protocolo completo:** [P-12_PROTOCOLO_CAJERO_BOBINA.md](./P-12_PROTOCOLO_CAJERO_BOBINA.md)

---

## Alcance Nexus

| SÍ | NO |
|----|-----|
| CSV producto + cliente | Factura fiscal legal |
| Bandeja cajero · Enviar a Bobeda | Plazos de pago · cobro en Nexus |
| Trazabilidad `ticket_venta_pos` | Lógica facturador legacy |

---

## Flujo canónico (2026-06-23)

```
Tablet: staging intermedia (stock sesión) → Cerrar → Promover
    ↓
ticket_venta_pos (PENDIENTE_CAJA)  ← bandeja cajero · Pendiente ON
    ↓ Descargar CSV
ticket_venta_pos (CSV_DESCARGADO)  ← Enviar a Bobeda habilitado
    ↓ Cajero: import legacy + cobro real + check coincidencia
ticket_venta_pos (PENDIENTE_ENTREGA)  ← BOBINA
    ↓ Entregas (P-13)
ticket_venta_pos (ENTREGADO)
```

**Pregunta clave cajero:** «¿Cuál es su nombre?» / «¿A nombre de quién emitió la factura el vendedor?»

Match por **nombre** en bandeja → CSV con mismo criterio de naming.

---

## CSV canónico (v1)

Ver columnas en versión anterior P-07 + bloque vendedor + `codigo_staging` origen.

| Bloque | Campos clave |
|--------|--------------|
| Producto | L·R·Mat·Color·grada · FK pilares |
| Cliente | cédula · nombre · `es_cliente_nuevo` |
| Operación | tienda · vendedor · hora · codigo_ticket |

Director valida columnas vs facturador antes de cierre v1.

---

## Bandeja ideal VACÍO

Máxima eficiencia: cliente pasa sin demora · cajero vacía bandeja tras cada **Enviar a Bobeda**.

---

## APIs

| Ruta | Estado |
|------|--------|
| `GET /api/tablet-bazzar/tickets/csv` | ✅ |
| `POST …/bobeda` (post-CSV) | ⏳ |
