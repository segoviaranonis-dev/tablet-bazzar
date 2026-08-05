# P-10 — Cédula primero · cliente nuevo · CSV

**Código plan:** P-10

---

## Cultura operativa (mandatoria)

1. **Primera pregunta = número de cédula** (tablet vendedor · caja).
2. Consumidor final sin cédula = excepción explícita, no default silencioso.

---

## Cliente existente

- Lookup `clients_bazaar` por cédula.
- Ticket lleva `cedula_cliente` + `clients_bazaar_id` cuando aplique.
- CSV exporta código/datos para cruce con **listado clientes facturador**.

---

## Cliente nuevo (corte Hiedra)

| Nexus | Facturador |
|-------|------------|
| No existe en `clients_bazaar` | Cliente nuevo para ellos |
| `upsertClienteBazaar` en COBRAR (tablet) | CSV incluye **bloque alta completa** |
| Flag `es_cliente_nuevo = true` (⏳ columna) | Import con datos persona/empresa |

---

## Futuro — historial recompra

Desde **`ticket_venta_pos`** filtrado por `cedula_cliente` / `clients_bazaar_id`:

- Últimas moléculas compradas  
- Sugerencias en tablet/caja  

Requiere masa de datos + UI fase posterior.

---

## Fuera de alcance Nexus

Plazos · forma de pago · emisión factura legal.

Ver [P-07](./07_FLUJO_CSV_CAJERO.md).
