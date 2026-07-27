# CHUSAR — Logística OK · Puente Aprobaciones ↔ Logística PE (riesgo pendiente)

**Código:** `2.3.1.28.12`  
**Padre:** `2.3.1.28`  
**Fecha:** 2026-07-27 · **Documenta** (orden Director)  
**App:** Report `/aprobaciones` → `/logistica-ok` · RIMEC Web carrito PE  
**Shibboleth:** Andrés, el que viene.

---

## Caso Graciela (PE-220-001 · PVR-2026-127087)

| Campo | Valor |
|-------|--------|
| FI | `PE-220-001` · cliente **2100** · Vizzano · 8 p |
| PP | **55** · grupo UI **PE-D1** |
| Síntoma | FI **CONFIRMADA** en Aprobaciones · **invisible** en Logística OK pestaña **General** |
| Causa raíz | Pre-sync Web creó fila logística **antes** de confirmar FI (estado RESERVADA). Con `fecha_entrega_cliente` del carrito → fila quedó **`estado=CONFIRMADA`**. General solo lista **`PENDIENTE`**. |
| Rescate | Backfill manual #2640 → `PENDIENTE` · commits Report `f17da62` · Web `31a8773` |

---

## Cadena canónica (post-fix 2026-07-27)

```
RIMEC Web confirmar carrito
  → FI PE estado RESERVADA (sin insert logística)
Aprobaciones · Confirmar FI
  → confirmarFi() → syncLogisticaTrasConfirmarFi()
  → syncLogisticaPp() solo FI estado CONFIRMADA
  → PE: INSERT/UPDATE siempre estado PENDIENTE (ignora fecha_entrega_cliente para estado)
Logística OK · General
  → fila visible en acordeón Pronta entrega unificado
```

**Puerta única PE → Logística:** confirmación FI en Report (`aprobaciones-mutations.ts`).

---

## Qué quedó corregido (deploy)

| Pieza | Cambio |
|-------|--------|
| `rimec-web/.../carrito/confirmar/route.ts` | Eliminado pre-sync `syncLogisticaOkPostConfirmarPe` al confirmar carrito |
| `report/.../sync-pp.ts` | PE: `estado='PENDIENTE'` en INSERT y ON CONFLICT · sync solo `fi.estado='CONFIRMADA'` |
| `report/.../aprobaciones-mutations.ts` | Post-commit `syncLogisticaTrasConfirmarFi` (PE sin exigir bandera previa) |

Relacionado: [CHUSAR_LOGISTICA_OK_PE_SYNC_UI_20260726.md](./CHUSAR_LOGISTICA_OK_PE_SYNC_UI_20260726.md) (`2.3.1.28.8`).

---

## Pendiente técnico (cierra brecha restante)

| # | Riesgo | Acción | Prioridad |
|---|--------|--------|-----------|
| P1 | **MIG-181 RPC desalineado** | ✅ **MIG-187** 2026-07-27 · ver `2.3.1.28.13` | ~~🔴 Alta~~ |
| P2 | **Código muerto Web** | ✅ deprecado `syncLogisticaOkPostConfirmarPe.ts` | ~~🟡 Media~~ |
| P3 | **Sync falla en silencio** | ✅ toast + log en `confirmarFi` 2026-07-27 | ~~🟡 Media~~ |
| P4 | **Filas legacy CONFIRMADA** — ON CONFLICT solo actualiza si `estado='PENDIENTE'` | Script backfill PE `CONFIRMADA`→`PENDIENTE` cuando FI ya confirmada y sin entrega logística | 🟡 Media |
| P5 | **Sin smoke automatizado** Web→Aprobaciones→General | `scripts/_smoke_pe_aprobacion_logistica_general.ts` en CI local | 🟢 Baja |
| P6 | **Transacción partida** — confirm FI COMMIT antes del sync | Evaluar sync en misma TX o cola retry idempotente | 🟢 Baja |

---

## Probabilidad de recurrencia (estimación Director · 2026-07-27)

### Escenario A — Mismo bug Graciela (CONFIRMADA oculta en General)

| Condición | Prob. 30 días |
|-----------|----------------|
| **Hoy** (P1–P4 abiertos) | **~8 %** |
| Tras cerrar P1 + P4 | **~2 %** |
| Tras P1–P5 cerrados | **~1 %** |
| **Post-deploy 2026-07-27** (P1–P3 + acordeón + auto-refresh) | **~1 %** |

Desglose hoy: camino principal Web→Aprobaciones **corregido (~0 %)** · RPC legacy / reactivación accidental **~3 %** · filas históricas sin backfill **~3 %** · divergencia futura TS vs SQL **~2 %**.

### Escenario B — Cualquier «FI confirmada pero no en General» (más amplio)

Incluye sync silencioso (sin fila) además de CONFIRMADA oculta.

| Condición | Prob. 30 días |
|-----------|----------------|
| **Hoy** | **~12 %** |
| Tras P1–P3 + P5 | **~3 %** |

---

## Verificar (smoke manual)

1. Web PE nuevo → carrito confirmar → **no** debe existir fila logística aún.
2. Aprobaciones → Confirmar FI → fila `entidad_am=PE` **`estado=PENDIENTE`**.
3. `/logistica-ok` General → acordeón **Pronta entrega** (unificado) → FI visible.
4. Tras asignar fecha en Logística → pasa a Confirmadas (CONFIRMADA).

---

## Errores

- **4.02.03.024** — detalle Graciela · pre-sync · estado CONFIRMADA · [detalle](../../../5_errores/detalle/4.02.03.024_logistica-pe-invisible-pre-sync-aprobacion.md)

---

## Relacionados

- `2.3.1.28.8` · PE al confirmar FI
- `2.3.1.28.9` · Ley FI acordeón
- `report/migrations/181_sync_logistica_pp_if_bandera.sql` — **pendiente alinear**
- `rimec-web/lib/syncLogisticaOkPostConfirmarPe.ts` — **no usar**
