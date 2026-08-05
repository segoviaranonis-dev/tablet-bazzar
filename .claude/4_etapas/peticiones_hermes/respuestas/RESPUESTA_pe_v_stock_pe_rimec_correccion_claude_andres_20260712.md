# RESPUESTA — PE · v_stock_pe_rimec vs stock_pronta_entrega_rimec (corrección Claude PC Andrés)

**Canal:** Clase 5 · Hermes ↔ Cursor (Héctor → Claude Code / Cursor · PC Andrés)  
**Código:** `5.00.02.004`  
**Fecha:** 2026-07-12  
**Orden Director (Héctor):** corregir diagnóstico erróneo · instrucciones actualizadas  
**Estado:** **VIGENTE** — reemplaza conclusiones de `PREGUNTA_fix_pares_por_caja_pronta_entrega_20260712.md` en PC Andrés si contradice este archivo  
**Shibboleth:** Andrés, el que viene.

---

## 0 · Veredicto (tenías razón, Director)

| Afirmación Claude PC Andrés | ¿Correcta? |
|----------------------------|------------|
| «Hay que cargar grada en `v_stock_pe_rimec` en Supabase» como **solución primaria** | ❌ **NO** — modelo Alejandro Magno PE no usa grada en vista |
| «`v_stock_pe_rimec` tiene grades_json NULL → por eso falla todo PE» | ⚠️ **Parcial** — NULL es **esperado** en MIG-142; la app debe tratar PE aparte |
| «Excluimos la tabla/vista PE hace tiempo» | ⚠️ **Confusión** — ver §1 |
| Fix código `prontaEntregaVenta.ts` / carrito PE = 1 par/click | ✅ **SÍ** — ya en `main` rimec-web (Héctor) |

**Acción Claude Andrés:** **abortar** el hilo que pide migración SQL de grada en la vista como prerequisito. Leer §2–§4 y actuar en **código app** + clasificación CP vs PE.

---

## 1 · Qué se excluyó y qué NO (cronología canónica)

### Excluido del catálogo CP (MIG-138 · 2026-07-06)

- **Pronta entrega ya no hace UNION dentro de `v_stock_rimec`.**
- CP = solo tránsito compra previa (`categoria_id=2` · `EN_TRANSITO`).

Doc: `.claude/2_modulos/2.2_rimec_web/CHUSAR_HOTFIX_CATALOGO_DEPLOY_20260706.md`

### Drop + recreación (MIG-141 → MIG-142 · mismo sprint)

| Objeto | MIG-141 | MIG-142+ |
|--------|---------|----------|
| `v_stock_pe_rimec` | **DROP** (puente viejo) | **RECREATE** desde `pedido_proveedor_detalle` |
| Fuente datos PE catálogo web | — | **PPD** · quincena Pronta entrega · `categoria_id=1` |

**`v_stock_pe_rimec` NO está muerta** — es la vista **activa** del catálogo PE en RIMEC Web.

Migraciones: `report/migrations/141_drop_v_stock_pe_rimec.sql` · `142` · `143` · `144`

### Tabla aparte (no confundir)

| Objeto | Rol | ¿Catálogo vendedor web? |
|--------|-----|-------------------------|
| `stock_pronta_entrega_rimec` | Import CSV POS legacy · panel Report `/stock-pronta-entrega` (MIG-132) | ❌ **NO** |
| `v_stock_pe_rimec` | Vista PPD Alejandro Magno · RIMEC Web filtros PE | ✅ **SÍ** |

Doc tabla: `.claude/2_modulos/2.3_report/deposito_rimec/CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md`  
Doc catálogo PE: `.claude/2_modulos/2.2_rimec_web/CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md`

---

## 2 · Ley operativa PE en RIMEC Web (2026-07-12)

Fuente código: `rimec-web/lib/prontaEntregaVenta.ts`

| Regla | Detalle |
|-------|---------|
| **1 click PE = 1 par** | `PARES_POR_UNIDAD_PE = 1` |
| **No usar `pares_por_caja` de la vista para PE** | MIG-142 pone `pares_por_caja = saldo_pares` — **contaminación conocida** |
| **`cajas_disponibles` en PE = saldo en pares** | No es “cajas cerradas importadora” |
| **CP** | Caja cerrada · grada / default 12 · OT-NEXUS-FI-CAJAS-CERRADAS-RIMEC-001 |

Función canónica: `resolveParesPorCaja()` · `isProntaEntregaStockRow()` · `paresDesdeCajasCerradas()`

**Prohibido** diagnosticar PE como “falta grades_json en Supabase”.

---

## 3 · Caso L1184 R1101 · saldo 8 vs pide 12

Checklist de diagnóstico (en orden):

1. ¿Fila es **PE** o **CP**? → `origen_tipo` · `pp_id` · vista (`v_stock_pe_rimec` vs `v_stock_rimec`).
2. Si **PE** y pide 12 → bug app: no pasó por `resolveParesPorCaja` (PE debe ser ×1).
3. Si **CP** residual sin grada y saldo=8 → `resolveParesPorCaja` debe usar **saldo real**, no default 12 ciego.
4. Revisar **`sesionVenta.ts`** path META_CACHE: `paresCalc()` usa solo `cant_caja` — si cache guardó 12, multiplica mal (línea ~167).

**No abrir OT Supabase** hasta confirmar CP vs PE en el `det_id` concreto.

---

## 4 · Instrucciones Claude / Cursor — PC Andrés

### Antes de codear

1. `git pull origin main` en `rimec-web` y `Nexus_Core` / `moria_chusar`.
2. Leer este archivo + `prontaEntregaVenta.ts` + `agruparTarjetasCatalogo.ts`.
3. Shibboleth primera línea: **`Andrés, el que viene.`** — no «titán de ataque» ni variantes legacy.
4. Cierre: `Listo para tu orden.` + 💰 COSTO + `Terminal:`.

### Qué hacer

| Paso | Acción |
|------|--------|
| 1 | Verificar si L1184 R1101 viene de `v_stock_pe_rimec` o `v_stock_rimec` (script `rimec-web/scripts/diag-pe-fetch.mjs` o SQL `det_id`) |
| 2 | Si PE → auditar que **todo** el carrito use `resolveParesPorCaja` (incl. `sesionVenta.ts` `paresCalc`) |
| 3 | Si CP residual → usar saldo en fallback, no 12 fijo |
| 4 | **No** proponer ALTER VIEW grades_json como bloqueante |
| 5 | Commit local OK · **push/deploy solo OK WhatsApp Héctor** |

### Qué NO hacer

- ❌ Decir al Director «hay que cargar grada en v_stock_pe_rimec» como única salida.
- ❌ Mezclar `stock_pronta_entrega_rimec` (tabla Report) con catálogo web PE.
- ❌ Push sin OK WhatsApp.
- ❌ Escribir Moria sin keyword **Documenta**.

---

## 5 · Sincronización repos

| Repo | Commit referencia (Héctor · verificar `git log`) |
|------|--------------------------------------------------|
| `rimec-web` | `prontaEntregaVenta.ts` · PE ×1 · `resolveParesPorCaja` |
| `report` | MIG-142–144 vistas PE |
| `moria_chusar` / `Nexus_Core` | Este RESPUESTA tras merge |

Andrés: después de pull, repetir smoke carrito PE + ítem conflictivo L1184.

---

## 6 · Pregunta al Director (solo si persiste fallo tras §4)

Si tras fix app el RPC sigue bloqueando: pegar **`det_id` · origen_tipo · cajas pedidas · saldo_pares · cant_caja calculada** — no repetir diagnóstico genérico de grada.

---

*Cursor PC Héctor · Clase 5 · corrección a sesión Claude Andrés 2026-07-12 tarde.*
