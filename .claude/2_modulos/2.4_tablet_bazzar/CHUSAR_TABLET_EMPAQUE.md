# CHUSAR — Tablet · Módulo Empaque

**Código:** 2.4.2.5 ⏳ · **Plan:** [P-01_TRES_MODULOS_CICLO_CERRADO.md](./P-01_TRES_MODULOS_CICLO_CERRADO.md)

---

## Qué es Empaque

Tercer módulo tablet — **cierra el ciclo físico**. Lee **solo Bobeda** (`bobeda_venta_pos` · P0). Hoy legacy `ticket_venta_pos` ⏳.

**Estrategia:** vendedor y cajero **no pueden excluir** Nexus — el cliente no retira sin paso Empaque.

---

## Leyes agente

1. **Tres módulos panel:** Depósito · Venta · Empaque — no eliminar Empaque del roadmap.
2. **Fuente única:** **`bobeda_venta_pos`** — nunca bandeja cajero ni staging.
3. **Mismo nombre** que caja: bandeja ordenada por titular/cliente/vendedor.
4. **Miniaturas obligatorias** — agilidad QC (`snapshot_json.imagen_url`).
5. **Estado ideal bandeja VACÍO** — igual que cajero.
6. **Reversiones Bobeda** — solo Director ⏳.

---

## Flujo operador empaque

1. Abrir tablet → **Empaque** (solo su tienda).
2. Bandeja `PENDIENTE_ENTREGA` desde Bobeda.
3. Match nombre (cliente llega de caja).
4. QC calzado vs miniatura + molécula.
5. Confirmar → `EMPAQUE_LISTO` / `ENTREGADO`.
6. Bandeja vacía.

---

## Rutas objetivo

| Ruta | Uso |
|------|-----|
| `/empaque` | Bandeja principal |
| `/api/empaque/tickets` | GET Bobeda filtrada |
| `/api/empaque/confirmar` | POST estado |

---

## Prohibido

- Entregar bulto sin ticket Bobeda
- Empaque fuera de tablet (papel)
- Saltar caja (CSV → Bobeda)

---

**CHUSAR Empaque — activo documentación 2026-06-23**
