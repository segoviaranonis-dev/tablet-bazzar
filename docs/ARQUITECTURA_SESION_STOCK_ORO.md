# Arquitectura sesión stock · bandeja única · ORO

**Actualizado:** 2026-06-24 · Migraciones **007–009**  
**Doc completo:** [LOGICA_OPERATIVA_POS_BAZZAR.md](./LOGICA_OPERATIVA_POS_BAZZAR.md)

## Dos capas operativas + Bobeda

| Capa | Tabla | Visible tablet | Visible caja Report |
|------|--------|----------------|---------------------|
| **Stock piso** | `deposito_1_*_tienda` | Catálogo vendible | Admin sync |
| **Operativa** | `ticket_bandeja_cajero` | `ABIERTO` (edición) | `PENDIENTE_CAJA` · `CSV_DESCARGADO` |
| **ORO histórico** | `bobeda_venta_pos` | Empaque | Facturado / métricas |

**Regla Director:** nunca `ABIERTO` y `PENDIENTE_CAJA` a la vez — mismo lote (`staging_id`), cambio de `estado`.

**Legacy (solo lectura / no escribir):** `ticket_pos_staging`, `ticket_venta_pos`.

## Máquina de estados — `ticket_bandeja_cajero.estado`

```
Carrito tablet → INSERT filas ABIERTO (stock −)
     │ sync-cart: validar (depósito + reserva bandeja) · restaurar · re-insert
     ▼ CERRAR (único botón tablet · reservarNumeroFiFa)
PENDIENTE_CAJA  ← visible Report caja · FI_FA asignado
     │
     ├── FACTURAS → Abrir → ABIERTO (desaparece de caja · stock sigue reservado)
     │        └── CERRAR otra vez → PENDIENTE_CAJA (mismo FI_FA)
     │
     ├── CSV → CSV_DESCARGADO
     └── Enviar a Empaque → DELETE bandeja · INSERT bobeda (corte ORO)
```

| Estado | Tablet FACTURAS | Report caja | Stock depósito |
|--------|-----------------|-------------|----------------|
| `ABIERTO` | Edición catálogo | **No** | Descontado (reservado bandeja) |
| `PENDIENTE_CAJA` | Lista “en caja” (solo abrir) | **Sí** | Descontado |
| `CSV_DESCARGADO` | idem | **Sí** | Descontado |
| `CANCELADO` | — | **No** | Restaurado |

## Acciones permitidas

- **Tablet:** solo **CERRAR** envía a caja. **FACTURAS → Abrir** reabre desde caja.
- **Report caja:** titular, quitar par, CSV, **Enviar a Empaque** (handoff → `bobeda_venta_pos`).
- **Prohibido:** botón “Listo → caja” en panel FACTURAS (eliminado).

## Agrupación lote

- `staging_id` = **ID de lote** (`ticket_bandeja_lote_id_seq`).
- `numero_fi_fa` por tienda · contador `pos_fi_fa_counter` · **009** corrige unicidad (no por fila).
- Formato UI: `{Cliente} - FI_FA: {n}`.

## Bobeda

Tras handoff la fila **sale** de bandeja y queda inmutable en `bobeda_venta_pos` (`PENDIENTE_ENTREGA` → `ENTREGADO`).

Doc protocolo: `.claude/2_modulos/2.3_report/caja_bazzar/P-12_PROTOCOLO_CAJERO_BOBINA.md`
