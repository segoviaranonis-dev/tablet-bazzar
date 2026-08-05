# Plan de acción — Logística OK (limpio)

**Etapa:** `LOGISTICA-OK-20260719` · **2.3.1.28**  
**Orden:** secuencial · **prod** solo cierre etapa u orden directa Director  
**Shibboleth:** Andrés, el que viene.

---

## Fase 0 — Documentación ✅

| # | Entregable | Estado |
|---|------------|--------|
| 0.1 | CHUSAR norte + BD + palabra reservada | ✅ |
| 0.2 | MIG-167 SQL (local/staging) | ✅ archivo |
| 0.3 | Etapa · ACTUAL · :3004 · hub shell | ✅ |

---

## Fase 1 — Base de datos (OT-LOG-OK-001)

| # | Tarea | Criterio PASS |
|---|-------|---------------|
| 1.1 | Aplicar `167_logistica_ok_pendiente_confirmacion.sql` en dev | ✅ 2026-07-19 audit |
| 1.2 | Verificar `fecha_arribo_real` existe en PP | ✅ |
| 1.3 | Función `logistica_ok_resolver_entidad_am` | ✅ PP-37 → PROGRAMADO |

**Riesgo:** bajo · solo ADD COLUMN + tabla nueva · no ALTER AM views.

---

## Fase 2 — Pedido proveedor · botón bandera (OT-LOG-OK-002)

| # | Tarea | Archivo plan |
|---|-------|--------------|
| 2.1 | Botón **Activar logística** cabecera PP | `PedidoProveedorDetalleClient.tsx` |
| 2.2 | Modal **Fecha de entrega Real** | constante `FECHA_ENTREGA_REAL_LABEL` |
| 2.3 | API `POST /api/pedido-proveedor/[ppId]/activar-logistica` | body `{ fecha_entrega_real }` |
| 2.4 | Bandera visual encendida + desactivar si ENVIADO/ANULADO | mismo patrón cabecera editable |
| 2.5 | CP **y** PROGRAMADO — mismo componente | `formatCategoriaPp` sin fork |

**PASS:** ✅ smoke PP-2026-0014 · 22 FI · 2.324 pares (audit script).

---

## Fase 3 — Sync automático FI (OT-LOG-OK-003)

| # | Tarea | Detalle |
|---|-------|---------|
| 3.1 | `syncLogisticaPp(pool, ppId)` | UPSERT desde FI CONFIRMADA |
| 3.2 | Hook post-generar FI (Admin IC · aprobaciones) | ✅ generar-fi route |
| 3.3 | Backfill opcional PP ya con FI | script one-shot Director |

---

## Fase 4 — UI Logística OK (OT-LOG-OK-004)

| # | Tarea | Detalle |
|---|-------|---------|
| 4.1 | `/logistica-ok` bandeja **Pendiente de confirmación** | tabla + acordeones |
| 4.2 | Agrupación cadena → cliente | reutilizar `etiqueta-comprador.ts` |
| 4.3 | Chips color CP / PE / PROGRAMADO | tokens NIIF |
| 4.4 | Sort: PE primero · luego `fecha_orden` | ley BD |
| 4.5 | Vista gerencial vs vendedor | filtro `id_vendedor` |
| 4.6 | Modal vendedor **Fecha de entrega** | PATCH pendiente |
| 4.7 | Aspecto acordeón / drill-down | inspiración Sales Report `/rimec` |

---

## Fase 5 — Smoke + cierre etapa

| # | Check |
|---|-------|
| 5.1 | ATI ve solo sus FI · gerencia ve todo |
| 5.2 | Nueva FI en PP bandera ON aparece sin refresh manual (o refetch) |
| 5.3 | PE arriba de CP/PROGRAMADO en misma fecha |
| 5.4 | **Cierra etapa** → Moria + `etapas.json` |

---

## Fuera de alcance v1 (documentado)

- Mapa geo (`logistica_entrega_geo`)  
- Notificaciones push vendedor  
- Deploy prod sin cierre  

---

## Dependencias código existente

| Pieza | Ruta |
|-------|------|
| Cadena/cliente | `lib/clientes/etiqueta-comprador.ts` |
| PP cabecera | `lib/pedido-proveedor/cabecera-actions.ts` |
| FI confirmada | `lib/pedido-proveedor/administrador-ic-generar-fi.ts` |
| Colores entidad | `lib/logistica-ok/constants.ts` (crear Fase 4) |

---

**Integrado:** 2026-07-19 · **Documenta**
