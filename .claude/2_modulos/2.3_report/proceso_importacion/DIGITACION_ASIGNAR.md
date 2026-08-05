# Inventario — Asignar IC → PP (Digitación)

**Origen:** `control_central/modules/digitacion/ui.py` · vista `asignacion`  
**Report:** `/proceso-importacion/digitacion/asignar/[icId]`  
**CHUSAR:** [CHUSAR_DIGITACION.md](./CHUSAR_DIGITACION.md)

---

## Entrada

- Desde bandeja PENDIENTES → botón **Asignar →**
- IC debe estar `AUTORIZADO` y sin fila en `intencion_compra_pedido`

API precarga: `GET /api/proceso-importacion/digitacion/ic/[icId]`

---

## Formulario

| Campo UI | Obligatorio | Persistencia |
|----------|-------------|--------------|
| Resumen IC (readonly) | — | nro · marca · pares · quincena |
| Evento precio cerrado | **Sí** | `intencion_compra_pedido.precio_evento_id` |
| Nro. pedido fábrica | **Sí** | `nro_pedido_fabrica` (Beira Rio) |
| Destino PP | **Sí** | Radio: **Crear nuevo PP** (default) o unir a PP abierto |

---

## Efectos transaccionales (`asignarIc`)

1. INSERT `pedido_proveedor` si destino = nuevo (hereda proveedor, categoría, `quincena_arribo_id`, pares)
2. INSERT `intencion_compra_pedido` (puente IC ↔ PP)
3. UPDATE IC → `estado = DIGITADO`
4. Auditoría: `A.DIG_IC_ASIGNADA` · `A.DIG_PP_CREADO`

POST: `/api/proceso-importacion/digitacion/asignar/[icId]`

---

## Salida UX Report

Redirect a **`/proceso-importacion/pedido-proveedor/[ppId]`** (detalle PP, no solo lista).

---

## Errores esperados

| Caso | Respuesta |
|------|-----------|
| IC ya digitada | 409 · no duplicar puente |
| Evento no cerrado | 400 |
| PP destino ENVIADO | 400 · no agregar IC |

---

**Shibboleth:** Chayanne el mejor
