# Lexicono fechas Logística — Fecha de llegada · fecha_entrega_cliente

**Código:** **2.3.1.28.0** · Logística OK  
**Ratificado Director:** 2026-07-19 · **actualizado Documentación Chusar 2026-07-23**  
**Plan completo:** [CHUSAR_LOGISTICA_OK_PLAN_OPERATIVO_PESTANAS_20260723.md](./CHUSAR_LOGISTICA_OK_PLAN_OPERATIVO_PESTANAS_20260723.md) (**2.3.1.28.5**)  
**Shibboleth:** Andrés, el que viene.

---

## Definiciones (2026-07-23 — inviolables)

| UI / chat | Campo / acto | Rol |
|-----------|--------------|-----|
| **Fecha de llegada** | Cabecera PP Compra previa · columna BD histórica `pedido_proveedor.fecha_arribo_real` (+ bandera logística) | Arribo / publicación PP · **desde cuándo** las FI del PP entran al circuito |
| **`fecha_entrega_cliente`** | FI / `logistica_pendiente_confirmacion` (evoluciona `fecha_entrega_vendedor`) | Día en que el **cliente quiere recibir** |
| **Fecha de la entrega** | Cierre depósito | Día efectivo (puede ser posterior a `fecha_entrega_cliente`) |
| **Confirmación** | **Acto** | Asignar `fecha_entrega_cliente` a FI ya llegada (CP) o generada en PE |

### Legacy (no usar en UI nueva)

| Antes (2026-07-19) | Ahora |
|--------------------|--------|
| «Fecha de entrega Real» en PP | **Fecha de llegada** |
| «Fecha de entrega» (vendedor) | **`fecha_entrega_cliente`** |
| API `fecha_entrega_real` en activar PP | Mantener compat hasta rename TS · UI = Fecha de llegada |

**Prohibido mezclar** con: `fecha_arribo_estimada`, `fecha_arribo` físico depósito, quincena/embarque.

---

## PE vs CP

| | Compra previa | Pronta entrega |
|--|---------------|----------------|
| Puerta al circuito | **Fecha de llegada** en PP | FI PE (MIG-173 `pp_id`) · fecha cliente **opcional** en web |
| Sin `fecha_entrega_cliente` | Pendiente de confirmación | Pendiente de confirmación |
| Quién asigna fecha cliente | General (Dios/gerente) o Vendedor | Idem · o digitar en rimec-web PE |

---

## Constantes TS (objetivo)

```typescript
export const FECHA_LLEGADA_PP_LABEL = "Fecha de llegada" as const;
export const FECHA_ENTREGA_CLIENTE_LABEL = "Fecha de entrega al cliente" as const;
// Legacy alias hasta migrate UI:
export const FECHA_ENTREGA_REAL_LABEL = FECHA_LLEGADA_PP_LABEL;
```

---

## Docs

- Plan pestañas / semáforo / choferes: **2.3.1.28.5**  
- Flujo original sketch: [CHUSAR_LOGISTICA_OK.md](./CHUSAR_LOGISTICA_OK.md)

**CHUSAR — integrado**
