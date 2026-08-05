# CHUSAR — Mensajería Depósito · Report → Tablet

**Subcuenta padre:** **2.3.2.1.1** · Panel Depósito Hiedra  
**Visión:** [VISION_PANEL_DEPOSITO_HIEDRA_2.3.2.1.1.md](../../../../report/docs/VISION_PANEL_DEPOSITO_HIEDRA_2.3.2.1.1.md)  
**Tablet receptor:** módulo depósito · `/deposito` · bandeja alertas (fase 10)

---

## Principio

**Report emite · Tablet recibe y ejecuta.** Ninguna alerta se crea en tablet. El operador administrativo actúa desde `/depositos-bazzar`; el vendedor ve tareas/avisos en tablet y confirma (ack).

---

## Tipos de mensaje (v1)

| `tipo` | Uso | Payload mínimo |
|--------|-----|----------------|
| `REPOSICION_MUESTRA` | Reponer par muestrario en piso | `cliente_id`, sector o SKU, grada |
| `MOVER_LIQUIDACION` | Aplicar regla liquidación a sector | `sector_id`, `regla_id`, vigencia |
| `DESTACAR` | Resaltar mercadería en cadena | `marca`, filtros pilares, prioridad |
| `PROMO_ACTIVA` | Promo visible en POS | `sector_id`, texto, hasta |
| `SYNC_AVISO` | Aviso pre-sync / mantenimiento | `cliente_id`, mensaje, `scheduled_at` |
| `VIDRIERA` | Cambio grada escaparate · Alerta 1 | `molecule_key`, `grada_agotada`, `grada_siguiente` · ver [CHUSAR tablet vidriera](../../2.4_tablet_bazzar/CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md) |

Extensible vía catálogo `deposito_alerta_tipo` (OT futura).

---

## Ciclo de vida

```
CREADA (Report admin)
  → ENVIADA (visible tablet)
  → LEIDA (vendedor abrió)
  → ACK (vendedor confirmó acción)
  → CERRADA (admin o timeout)
  → CANCELADA (admin revoca)
```

| Estado | Report | Tablet |
|--------|--------|--------|
| ENVIADA | Lista en panel tienda | Badge / bandeja alertas |
| LEIDA | Timestamp lectura | Detalle mensaje |
| ACK | Auditoría quién/cuándo | Botón «Hecho» |
| CERRADA | Histórico | Desaparece de bandeja activa |

---

## Reglas obligatorias

1. **Origen único:** solo API Report crea mensajes (`POST` admin). Tablet solo `GET` + `PATCH ack`.
2. **Scope tienda:** cada mensaje lleva `cliente_id` (2100–2105). No cruzar tiendas.
3. **No bloquea venta:** alertas son operativas; no reemplazan guard bandeja POS.
4. **Idempotencia:** reenvío mismo `idempotency_key` no duplica fila.
5. **Pilares en payload:** referencias por FK/códigos proveedor · no texto libre `col.nombre` crudo.
6. **Sales Report blindado** — mensajes no leen `registro_ventas_general_v2`.

---

## Modelo propuesto (BD · fase 9)

Tabla candidata: `deposito_alerta` (nombre sujeto a migración OT)

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | serial | PK |
| `cliente_id` | int | Tienda destino |
| `tipo` | text | Catálogo arriba |
| `estado` | text | ENVIADA · LEIDA · ACK · CERRADA · CANCELADA |
| `titulo` | text | Corto para tablet |
| `cuerpo` | text | Detalle operador |
| `payload_json` | jsonb | Sector · SKU · regla_id |
| `sector_id` | int nullable | FK futura sectores |
| `creado_por` | int | usuario_v2 |
| `created_at` | timestamptz | |
| `leido_at` | timestamptz nullable | |
| `ack_at` | timestamptz nullable | |
| `ack_vendedor_id` | int nullable | |

Índice: `(cliente_id, estado)` WHERE estado IN ('ENVIADA','LEIDA').

---

## API propuesta

| Método | Ruta | App | Rol |
|--------|------|-----|-----|
| GET | `/api/depositos/[cliente_id]/alertas` | Report + Tablet | Lista activas |
| POST | `/api/depositos/[cliente_id]/alertas` | Report | Crear (admin) |
| PATCH | `/api/depositos/alertas/[id]/ack` | Tablet | Confirmar |
| PATCH | `/api/depositos/alertas/[id]/cancelar` | Report | Revocar |

Tablet poll o SSE en fase 10 — preferir poll simple v1 (30s) en `/deposito`.

---

## UI Report (fase 9)

- Card tienda en `/depositos-bazzar`: badge «N alertas activas».
- Modal «Enviar instrucción a tienda»: tipo · sector · texto · preview pilares.
- Histórico colapsable por tienda.

---

## UI Tablet (fase 10)

- Icono campana en header depósito/cadena (junto Franco Tirador / carrito).
- Bandeja táctil: tarjetas por alerta · ack obligatorio en REPOSICION_MUESTRA.
- `DESTACAR` / `PROMO_ACTIVA` pueden aplicar filtros cadena sin ack estricto (config por tipo).

---

## Enlaces

| Módulo | Código |
|--------|--------|
| Panel admin | 2.3.2.1.1 |
| Admin sync padre | 2.3.2.1 |
| Tablet depósito | 2.4 · `/deposito` |
| POS bandeja | 2.4.2.3 |

---

**Shibboleth:** Chayanne el mejor
