# ETAPA ABIERTA — Prueba final IC → PP → Rimec Web

**ID:** `ETAPA-PRUEBA-FINAL-IC-MARATON-20260703`  
**Estado:** ⏸ **PAUSADA** 2026-07-04 · Director foco Reclutamiento · `etapas.json` → `hecho`  
**Portal :3004:** tarjeta **`2.3.1.7.3-5`** · «IC · Digitación · PP · prueba final maratón»  
**Unificación 2026-07-03:** absorbe ex tarjetas duplicadas «Mudanza IC» + «Prueba final IC» en `etapas.json`  
**Códigos:** **2.3.1.7.3** · **2.3.1.7.4** · **2.3.1.7.5**  
**Estado maratón:** 🟢 **ABIERTA** — cierre semana 2026-07-03  
**Padre:** [ETAPA_MUDANZA_IC_DIG_PP_REPORT.md](./ETAPA_MUDANZA_IC_DIG_PP_REPORT.md)  
**Hiedra (contexto Bazzar):** [CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md](../2_modulos/2.3_report/depositos/CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md) · [PLANIFICACION_CAJA_BAZZAR_HIEDRA.md](./PLANIFICACION_CAJA_BAZZAR_HIEDRA.md)

---

## Objetivo maratón

Recorrer en **Report (Next.js)** el ciclo importadora hasta levantar herramienta en **Rimec Web**:

```
IC COMPRA PREVIA ─┐
IC PROGRAMADO     ─┼→ Digitación → Pedido Proveedor → (Aprobaciones) → Rimec Web
```

Streamlit sigue operativo; Report es destino NIIF.

---

## Checklist prueba (Director)

| # | Paso | Ruta Report | Categoría | PASS |
|---|------|-------------|-----------|------|
| 1 | Nueva IC | `/proceso-importacion/intencion-compra/nueva` | **COMPRA PREVIA** (id 2) | ⏳ |
| 2 | Nueva IC | misma | **PROGRAMADO** (id 3) | ⏳ |
| 3 | Bandeja · autorizar | `/intencion-compra/bandeja` | ambas | ⏳ |
| 4 | Digitación · asignar PP | `/digitacion` | — | ⏳ |
| 5 | Pedido proveedor | `/pedido-proveedor` | proforma + listado | ⏳ |
| 6 | Smoke Rimec Web | catálogo / precios | post-PP | ⏳ |

---

## Hotfix #1 — Marcas vacías en `/nueva` (2026-07-03)

**Síntoma:** dropdown MARCA solo «— Elegir —» con CALZADOS + BEIRA RIO.

**Causa:** `IntencionCompraNuevaClient` dependía solo de `GET …/marcas`; la **bandeja** ya tenía fallback a `catalogos.marcas` — alta no.

**Fix:**

- `loadIcCatalogos` → `marcasPorTipo` desde `marca_tipo_v2`
- `resolveMarcasIcOptions()` — API marcas → marcasPorTipo[tipo] → marca_v2 completo
- Paridad **COMPRA PREVIA** y **PROGRAMADO** (mismo formulario, distinto bloque negociación)

**Archivos:** `catalogos-query.ts` · `marcas-ic-options.ts` · `IntencionCompraNuevaClient.tsx` · `IcPendienteCard.tsx`

**Diag:** `report/scripts/diag-ic-marcas.mjs`

---

## Hotfix #2 — PP Tab Stock Fase 1 (2026-07-03)

**Entrega:** cabecera comercial §1–2 · panel listado RIMEC · componente `PpTabStock`.

| Ítem | Detalle |
|------|---------|
| §1 | Nro proforma · PP externo · **quincena_arribo_id** (select 1–24, no date) |
| §2 | Descuentos D1–D4 + factor FOB preview |
| Listado | Banner evento · selector · POST vincular-listado |
| API | `stock-listado.ts` · extensión GET/PATCH PP |
| Doc | [CHUSAR_PP_TAB_STOCK.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_PP_TAB_STOCK.md) · [MUDANZA_PP_DETALLE_INVENTARIO.md](../../report/docs/MUDANZA_PP_DETALLE_INVENTARIO.md) |

**Pendiente Fase 2–4:** Ala Norte completa · precios stock · upload Excel · FI cards.

---

## Hotfix #3 — SQL biblioteca listado PP (2026-07-03)

**Síntoma:** `column pe.biblioteca_id does not exist` en tab Stock.

**Fix:** join `precio_evento.biblioteca_precio_id` → `biblioteca_precio.nombre`.

---

## Docs de referencia

| Tema | Doc |
|------|-----|
| IC CHUSAR | [CHUSAR_INTENCION_COMPRA.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_INTENCION_COMPRA.md) |
| PP Stock Fase 1 | [CHUSAR_PP_TAB_STOCK.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_PP_TAB_STOCK.md) |
| Gap tablet+Report | [DOC_PENDIENTE_TABLET_REPORT_20260703.md](../2_modulos/DOC_PENDIENTE_TABLET_REPORT_20260703.md) |
| Índice 7.3–7.5 | [proceso_importacion/INDICE.md](../2_modulos/2.3_report/proceso_importacion/INDICE.md) |
| Tablas BD | [TABLAS_MUDANZA_IC_DIG_PP.md](../2_modulos/2.3_report/proceso_importacion/TABLAS_MUDANZA_IC_DIG_PP.md) |
| Mudanza Report | [CHUSAR_MUDANZA_REPORT.md](../2_modulos/2.3_report/CHUSAR_MUDANZA_REPORT.md) |
| Hiedra CSV depósito | [CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md](../2_modulos/2.3_report/depositos/CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md) |

---

## Criterio cierre etapa

- [ ] COMPRA PREVIA + PROGRAMADO registradas y autorizadas en Report
- [ ] Digitación → PP con listado Motor vinculado
- [ ] Evidencia smoke (capturas o JSON)
- [ ] Deploy Report prod con hotfix marcas
- [ ] CHUSAR IC actualizado 🟢

---

**Shibboleth:** Chayanne el mejor · IC sin marca = bloqueo maratón
