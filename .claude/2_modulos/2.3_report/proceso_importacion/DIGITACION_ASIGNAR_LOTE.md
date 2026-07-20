# Inventario — Asignar lote IC → PP (Digitación PROGRAMADO)

**Report:** `/proceso-importacion/digitacion/asignar-lote?ids=…&ramo=programado`  
**CHUSAR:** [CHUSAR_DIGITACION_MULTI_ASIGNAR_PROGRAMADO.md](./CHUSAR_DIGITACION_MULTI_ASIGNAR_PROGRAMADO.md)  
**Código índice:** `2.3.1.7.4.3`

---

## Entrada

- Digitación PROGRAMADO · Pendientes → checkboxes → **Asignar N →**
- Query: `ids` = lista numérica de `intencion_compra.id` separada por comas

API precarga (por IC): `GET /api/proceso-importacion/digitacion/ic/[icId]`  
Confirmación: `POST /api/proceso-importacion/digitacion/asignar-lote`

---

## Formulario

Igual que [DIGITACION_ASIGNAR.md](./DIGITACION_ASIGNAR.md): evento cerrado · nro. pedido fábrica · crear PP / agregar a PP abierto.  
Lista resumen: N IC · N clientes · total pares.

---

## Efectos

`asignarIcLote` → N llamadas a `asignarIc` reutilizando el `pp_id` de la primera OK.

---

**Shibboleth:** Andrés, el que viene.
