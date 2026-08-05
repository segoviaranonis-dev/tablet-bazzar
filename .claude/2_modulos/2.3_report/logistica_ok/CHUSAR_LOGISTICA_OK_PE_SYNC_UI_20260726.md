# CHUSAR — Logística OK · PE al confirmar FI + UI cabecera

**Código:** `2.3.1.28.8`  
**Padre:** `2.3.1.28`  
**Fecha:** 2026-07-26 · **Documenta** + **despliega** (orden Director)  
**App:** Report `/logistica-ok` · `/aprobaciones`  
**Shibboleth:** Andrés, el que viene.

---

## Problema

1. Al **Confirmar FI** PE en Aprobaciones, las FI **no entraban** a Logística OK: `syncLogisticaPpIfBandera` exigía bandera + `fecha_arribo_real` en PP (portón CP). PP PE locales las tenían en `false`/`null`.
2. Fechas basura `0020-…` (carrito) marcaban filas como CONFIRMADAS → no se veían en pestaña **GENERAL** (solo PENDIENTE).
3. UI GENERAL: pedido externo PE (`PE-D1-pe-import-…`) **rompía el layout** (overflow / solape).

Las simulaciones de descuento (payload → FI → aprobaciones) **no** cubrían el insert en `logistica_pendiente_confirmacion`.

---

## Ley

| Entidad | Post-Confirmar FI |
|---------|-------------------|
| **PE** | Entra a Logística OK **sin** exigir bandera previa. Activa bandera + `fecha_arribo_real` si faltan. Orden bandeja: **PE primero** (`sortPriority` 0). |
| **CP / PROGRAMADO** | Sigue el portón bandera + Fecha de entrega Real. |

Fecha orden: se rechazan años `< 2000` (ej. `0020-07-27`).

UI cabecera pedido: PE muestra label corto `PE · D{n} · {cola}`; batch completo solo en `title`.

---

## Código

| Archivo | Cambio |
|---------|--------|
| `report/src/lib/logistica-ok/sync-pp.ts` | `syncLogisticaTrasConfirmarFi` · fecha válida · INSERT sin fecha basura |
| `report/.../aprobaciones-mutations.ts` | `confirmarFi` → `syncLogisticaTrasConfirmarFi` |
| `report/.../LogisticaOkClient.tsx` | `labelPedidoExternoUi` · chips métricas · montos enteros |
| `report/.../aprobaciones-utils.ts` | `etiquetaCasoUiAprobaciones` → PE-LIQ/NORMAL/PROMO (`2.3.1.3.0.2`) |

---

## Destinos post-autorizar PE

1. **Facturación Pronta entrega** — FI `PE-*` CONFIRMADA.
2. **Logística OK** — fila en `logistica_pendiente_confirmacion` (`entidad_am=PE`), GENERAL si sin fecha cliente válida.

---

## Verificar

1. Confirmar FI PE en `:3000/aprobaciones`.
2. `/logistica-ok` GENERAL → bloque **Pronta entrega** arriba de PROGRAMADO.
3. Pedido externo corto (no batch `pe-import` a pantalla completa).
4. CASO en célula: **PE-LIQ / PE-NORMAL / PE-PROMO**.

---

## Relacionados

- [CHUSAR_LOGISTICA_OK_PLAN_OPERATIVO_PESTANAS_20260723.md](./CHUSAR_LOGISTICA_OK_PLAN_OPERATIVO_PESTANAS_20260723.md) (`2.3.1.28.5`)
- [CHUSAR_APROBACIONES_CASO_PE_CORTO_20260726.md](../../2.1_control_central/modules/aprobacion_pedidos/CHUSAR_APROBACIONES_CASO_PE_CORTO_20260726.md) (`2.3.1.3.0.2`)
- [CHUSAR_COMISION_D1_NO_DESCUENTO_UI_20260726.md](../../2.2_rimec_web/CHUSAR_COMISION_D1_NO_DESCUENTO_UI_20260726.md) (`2.2.1.26.1`)
