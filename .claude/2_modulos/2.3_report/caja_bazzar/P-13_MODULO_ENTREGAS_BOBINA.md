# P-13 — Módulo Entregas · consulta Bobeda · QC

**Código plan:** P-13 · **Producto:** Tablet / Report entregas · **Fuente:** `ticket_venta_pos` (Bobeda)

---

## 1. Propósito

Departamento **Entregas / Empaque** — tras caja y **módulo Empaque tablet** (2.4). Consulta **Bobeda** directo.

> **Tablet Empaque** = operación en piso (3er módulo). **Entregas** puede ser mismo equipo o rol Report — misma Bobeda.

Objetivo: **cero demora** · QC · cierre `ENTREGADO` · ciclo imposible de saltar.

---

## 2. Acceso

| Canal | Notas |
|-------|-------|
| Tablet entregas | ⏳ módulo dedicado |
| Report (rol entregas) | ⏳ ruta futura |

Solo tickets `estado = PENDIENTE_ENTREGA` de la tienda correspondiente.

---

## 3. Bandeja entregas

| Regla | Detalle |
|-------|---------|
| Orden | **Mismo criterio nombre** que caja (cliente / titular factura) |
| Vista | Lista densa + **miniaturas calzado** (`snapshot_json.imagen_url`) |
| Estado ideal | **VACÍO** — ningún `PENDIENTE_ENTREGA` |

---

## 4. Protocolo operador entregas

1. Cliente presenta comprobante / factura legal (fuera Nexus).
2. Operador busca por **nombre** en bandeja entregas (misma lógica que cajero).
3. **Control calidad:** verifica artículo vs miniatura + molécula L·R·Mat·Color·grada.
4. Entrega física · despedida.
5. Marca **`ENTREGADO`** en Bobeda → sale de pendientes entregas.

---

## 5. Estados Bobeda relevantes

```
PENDIENTE_ENTREGA  →  (operador entregas)  →  ENTREGADO
```

Reversión post-ENTREGADO: ⏳ solo autorización especial (Director).

---

## 6. Datos mostrados (mínimo)

| Campo | Origen |
|-------|--------|
| Nombre cliente / titular | `cedula_cliente` · `snapshot_cliente` · `clients_bazaar` |
| Vendedor tienda | `vendedor_nombre` · `vendedor_bazzar_id` |
| Molécula | snapshot + FK pilares |
| Miniatura | `snapshot_json.imagen_url` |
| Hora venta | `created_at` |
| Tienda | `cliente_id` |

---

## 7. APIs objetivo ⏳

| Método | Ruta | Acción |
|--------|------|--------|
| GET | `/api/entregas-bazzar/tickets` | Lista `PENDIENTE_ENTREGA` por tienda |
| POST | `/api/entregas-bazzar/tickets/entregar` | `→ ENTREGADO` |

---

## 8. Relación con caja (P-12)

| Rol | Bandeja | Acción clave |
|-----|---------|--------------|
| **Cajero** | CSV pendiente → Bobeda | Descargar CSV · Enviar a Bobeda |
| **Entregas** | Pendiente entrega | QC · ENTREGADO |

Un solo registro Bobeda — dos vistas por rol.

---

**P-13 — Entregas lee Bobeda · miniaturas · nombre · QC**
