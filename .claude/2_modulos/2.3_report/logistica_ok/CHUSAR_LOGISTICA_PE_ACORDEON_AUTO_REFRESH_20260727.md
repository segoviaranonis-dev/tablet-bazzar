# CHUSAR — Logística OK · PE acordeón único + auto-refresh + deploy puente

**Código:** `2.3.1.28.13`  
**Padre:** `2.3.1.28`  
**Fecha:** 2026-07-27 · **Documenta** + **despliega** (orden Director)  
**App:** Report `/logistica-ok` · `/aprobaciones` · RIMEC Web carrito  
**Shibboleth:** Andrés, el que viene.

---

## Entregas

| # | Qué | Dónde |
|---|-----|--------|
| 1 | **Un solo acordeón Pronta entrega** en General (no PE-D1/D3 separados) | `queries-bandeja.ts` · `LogisticaOkClient.tsx` |
| 2 | **Puente inmediato** Aprobaciones → Logística al confirmar FI | `aprobaciones-mutations.ts` · toast + campo `logistica` |
| 3 | **MIG-187** RPC alineado TS · PE PENDIENTE · solo FI CONFIRMADA | `migrations/187_sync_logistica_pp_pe_pendiente.sql` |
| 4 | **Auto-refresh 5 s** + botón ↻ en todas las pestañas | `LogisticaOkClient.tsx` |
| 5 | Pre-sync Web **deprecado** | `rimec-web/lib/syncLogisticaOkPostConfirmarPe.ts` |

---

## UI — General PE

- Clave grupo: `pe-unificado` · `pedido_proveedor_id = 0` en cabecera.
- Marcas (Vizzano, Modare…) dentro del mismo bloque STOCK Bazzar.
- Sin PDF listado en acordeón consolidado PE.

---

## UI — Refresh

- Botón **↻ Refrescar** junto a pestañas (todas).
- Poll **5 s** si pestaña navegador visible.
- Sync al volver a la pestaña (`visibilitychange`).
- Toast «N pedido(s) nuevo(s)» sin F5.
- `cache: no-store` en fetch bandeja.

---

## Cadena PE (canónica)

```
Web confirmar → FI RESERVADA (sin logística)
Aprobaciones Confirmar FI → syncLogisticaTrasConfirmarFi → PENDIENTE General
Logística auto-refresh ≤5 s → visible en acordeón Pronta entrega
```

---

## BD — MIG-187 (obligatorio post-deploy Report)

Aplicar en Supabase/Postgres:

`report/migrations/187_sync_logistica_pp_pe_pendiente.sql`

Incluye: RPC paridad · backfill PE CONFIRMADA fantasma · purga filas con FI RESERVADA.

Smoke: `npx tsx scripts/_smoke_pe_aprobacion_logistica_puente.ts`

---

## Verificar prod

1. `:3000/aprobaciones` → confirmar FI PE → mensaje «Logística OK: Pronta entrega actualizada».
2. `:3000/logistica-ok` General → **un** bloque verde PE · pedido aparece ≤5 s sin F5.
3. Botón ↻ + hora «última sync» bajo pestañas.

---

## Relacionados

- `2.3.1.28.12` · puente riesgo Graciela · error `4.02.03.024`
- `2.3.1.28.8` · PE al confirmar FI (base)
