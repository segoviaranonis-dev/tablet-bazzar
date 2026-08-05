# P-02 — Arquitectura · 6 cajas UI · 1 tabla BD

> **⚠️ OBSOLETO 2026-06-16** — Reemplazado por [02_ARQUITECTURA_6_CAJAS_2_TABLAS.md](./02_ARQUITECTURA_6_CAJAS_2_TABLAS.md).  
> Decisión Director: **`ticket_bandeja_cajero`** + **`bobeda_venta_pos`** — no una sola `ticket_venta_pos`.

**Código plan:** P-02 (v1 obsoleta)

---

## Analogía depósitos (18 tablas)

| Nivel | Patrón | Uso |
|-------|--------|-----|
| Stock físico | `deposito_{1\|2\|3}_{cliente_id}_{categoria}` | **18 tablas** — artículos separados por tienda y categoría |
| Admin sync | Report `/depositos-bazzar` | Gerencia · sync Retail |

---

## Tickets / venta tienda (1 tabla)

| Capa | Diseño |
|------|--------|
| **BD** | **Una tabla:** `public.ticket_venta_pos` |
| **UI Report** | **6 cajas** — partición lógica por `cliente_id` |
| **Tablet** | Sesión atada a un `cliente_id` → un depósito `deposito_1_*_tienda` |

**6 puertas en Report · un solo libro en Supabase.**

---

## ID canónico — depósito + operación

Cada venta registra la **unión**:

1. **Origen depósito** — `cliente_id` de sesión (2100…3200) + molécula pilares.
2. **Operación** — COBRAR → ticket EMITIDO (futuro: FACTURADO).

Implementación actual:

- `cliente_id` — FK tienda
- `codigo_ticket` — `POS-{cliente_id}-{timestamp}-{rnd}-{idx}`
- FK pilares + `snapshot_json`
- `estado` — `EMITIDO` → `FACTURADO` (planificado)

Evolución: campo compuesto `venta_operacion_id` documentado en P-08.

---

## Dentro de cada caja tienda

Al entrar San Martín Adultos (2400):

- Tickets **solo** `cliente_id = 2400`
- Gestión lectura depósito **`deposito_1_2400_tienda`**
- Sub-cards: **Caja · Facturable · Métricas**

San Martín Niños (2700) = caja hermana, mismo local comercial, distinto `cliente_id`.

---

## Informes futuros Bazzar

Agregaciones SQL **desde una tabla**, filtros por:

- `cliente_id` · fecha · vendedor · marca · pilares (JOIN o snapshot)

Sin cruzar Sales Report RIMEC.
