# CHUSAR — Pestaña Stock · Pedido proveedor (2.3.1.7.5 · hijo_mayor)

**Sub-bloque de:** [CHUSAR_PEDIDO_PROVEEDOR.md](./CHUSAR_PEDIDO_PROVEEDOR.md)  
**Streamlit:** `ui.py` → `_render_hijo_mayor()` · `_render_ala_norte()` · `_render_listado_precio_pp()`  
**Report destino:** `/proceso-importacion/pedido-proveedor/[ppId]?tab=stock`  
**Componente:** `report/src/app/…/components/PpTabStock.tsx`  
**Estado:** ⚠️ **FASE 1 ✅** · Fase 4 programado ✅ (preview SHOP↔IC) · Fases 2–3 🔴  
**Protocolo programado:** [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md)  
**Actualizado:** 2026-07-06

**Inventario paridad:** [MUDANZA_PP_DETALLE_INVENTARIO.md](../../../../report/docs/MUDANZA_PP_DETALLE_INVENTARIO.md)

---

## Norte

La pestaña **Importación / Stock** es el corazón operativo del PP después de Digitación:

1. **Proforma/F9** → `pedido_proveedor_detalle` (Ala Norte · snapshot fijo)
2. **Cruce proforma ↔ precio_lista** → tabla «Precios de este stock»
3. **Vinculación listado RIMEC** → Motor Report `2.3.1.7.1/7.2` · evento `precio_evento`

Sin stock importado: cabecera comercial + descuentos + panel listado (sin precios cruzados).

---

## Router Streamlit vs Report

| Condición | Streamlit | Report (2026-07-03) |
|-----------|-----------|---------------------|
| `total_articulos == 0` | Upload + listado + §1–2 | ✅ §1–2 + listado · upload placeholder Fase 4 |
| `total_articulos > 0` | Ala Norte + precios + listado | ⚠️ tabla plana 8 cols + listado |

---

## §1 Cabecera comercial (Fase 1 ✅)

| Campo UI | Columna BD | Report |
|----------|-----------|--------|
| Nro Proforma * | `numero_proforma` | ✅ input |
| **Nº preventa Carlos** *(legacy «Nro PP externo»)* | `nro_pedido_externo` | ✅ input · mapa propagación: [CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md](../gestion_compra/CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md) |
| **FECHA DE EMBARQUE** * | `quincena_arribo_id` | ✅ `<select>` 1–24 · **dato duro** |

**Ley holding:** NO usar `type="date"` ni `fecha_arribo_estimada` para ETA operativa.  
Catálogo: `quincena_arribo` · fallback `QUINCENA_ARRIBO_CATALOGO` en `quincena-arribo.ts`.  
Label canónico: `FECHA_DE_EMBARQUE_LABEL` = «FECHA DE EMBARQUE».

Persistencia: `PATCH /api/…/pedido-proveedor/[ppId]` con `quincena_arribo_id` (validación 1–24).

---

## §2 Descuentos comerciales (Fase 1 ✅)

| Campo | Columna | Preview |
|-------|---------|---------|
| D1–D4 (%) | `descuento_1`…`descuento_4` | Factor neto FOB cascada |

Solo almacenan/muestran · **no** afectan precio venta (listado RIMEC).

---

## §3 Upload proforma — PROGRAMADO (Fase 4 ✅ · cola 2026-07-23)

Flujo **manual** — alineación IC↔PF en **Administrador de IC**:

1. Subir `.xls/.xlsx` · `POST …/proforma/preview` → tabla **SHOP×marca Excel** + chequeo **totales IC = proforma**
2. Confirmar solo si `totales_ok`
3. **Cola import:** `phase=ppd_plan` → loop `phase=ppd` (120 SKUs/lote) · overlay progreso · reintento 504
4. Tab **Administrador de IC** → alinear IC=PF · generar FI lote

**Doc canónico:** [CHUSAR_PP_PROGRAMADO_IMPORT_PROFORMA_20260721](./CHUSAR_PP_PROGRAMADO_IMPORT_PROFORMA_20260721.md)  
**Ley import extensa:** [LEY_IMPORTACION_EXTENSA_COLA_VERCEL](./LEY_IMPORTACION_EXTENSA_COLA_VERCEL.md) (**2.3.1.7.5.3.3.10**)  
**Componente cola:** `ProcesoImportacionQueueOverlay.tsx`

Parser: `shop` col J · `brand` col I · ver protocolo canónico.

Compra previa: upload directo sin preview totales.

---

## Panel listado RIMEC (Fase 1 ✅)

| Elemento | Función | Lib Report |
|----------|---------|------------|
| Banner vigente | evento + n precios + biblioteca | `getEventoPpDetalle()` |
| Selector eventos | todos `precio_evento` | `listEventosPrecioPp()` |
| Vincular al PP | SQL + ICs | `vincularListadoAPp()` |

**Join biblioteca:** `precio_evento.biblioteca_precio_id` → `biblioteca_precio.nombre` (no `biblioteca_id`).

Detalle: [CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md](./CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md)

---

## Bloques UI pendientes (Fase 2–3)

| # | Bloque | Report |
|---|--------|--------|
| 1 | KPI caption 4 métricas (post-stock) | ⚠️ parcial |
| 2 | Acordeón resumen por marca | 🔴 → [MAPA_ALA_NORTE_STOCK_PP.md](./MAPA_ALA_NORTE_STOCK_PP.md) |
| 3 | Tabla Ala Norte + columnas talla | ⚠️ 8 cols · 🔴 `grades_json` |
| 4 | Precios de este stock | 🔴 → [MAPA_PRECIOS_STOCK_PP.md](./MAPA_PRECIOS_STOCK_PP.md) |
| 5 | Borrar/reimportar | 🔴 |
| 6 | Recalcular FI | 🔴 |

---

## Datos duros

| Concepto | Tabla / columna |
|----------|-----------------|
| Molécula F9 | `pedido_proveedor_detalle` · 1 fila = L+R+mat+color+grada |
| Curva caja | `ppd.grades_json` JSON `{ "34": 1, "35": 2, … }` |
| Grada label | `ppd.grada` texto `34-39` |
| Quincena ETA | `pedido_proveedor.quincena_arribo_id` → `quincena_arribo` |
| Evento vigente PP | `intencion_compra_pedido.precio_evento_id` |
| Bloqueo listado | PP `estado = ENVIADO` → `listado_editable = false` |

---

## APIs Report

| Método | Ruta | Estado |
|--------|------|--------|
| GET | `…/pedido-proveedor/[ppId]` | ✅ cabecera + alaNorte + eventos |
| PATCH | mismo | ✅ comercial + quincena + descuentos |
| POST | `…/vincular-listado` | ✅ Fase 1 |
| GET | `…/precios-stock` | 🔴 Fase 2 |
| POST | `…/proforma/preview` | ✅ programado SHOP↔IC |
| POST | `…/proforma` | ✅ import (+ borrar_previo reintento) |
| POST | `…/recalcular-fi` | 🔴 Fase 3 |

Archivos: `stock-listado.ts` · `cabecera-actions.ts` · `PpTabStock.tsx`

---

## Orden implementación restante

1. Ala Norte completa (acordeón + grada)
2. Tabla «Precios de este stock»
3. Recalc FI · borrar/reimportar
4. Upload proforma Excel

---

## Validación smoke

PP sin stock (ej. **PP-2026-0014**):

- [ ] §1: proforma + PP externo + quincena selector (no date)
- [ ] §2: D1–D4 + factor neto
- [ ] Listado: banner evento #18 · selector · Vincular OK
- [ ] Cabecera superior «Quincena ETA» coincide tras guardar

PP con proforma (ej. **PP-2026-0007**): pendiente Fase 2.

---

## Precios CP — certificación (2026-07-24)

- **Doctrina:** una columna **LPN vinc.** · pie unidad mando/dirección · sin dual listado.
- **Doc:** [CHUSAR_CERTIFICACION_PRECIOS_CP_RIMEC.md](./CHUSAR_CERTIFICACION_PRECIOS_CP_RIMEC.md) (**2.3.1.7.5.3.8**)
- **Comando:** `npm run certificar:precios-cp:sync` (desde `report/`)

---

**Shibboleth:** Chayanne el mejor
