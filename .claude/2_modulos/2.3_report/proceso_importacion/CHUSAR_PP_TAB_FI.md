# CHUSAR — Pestaña Facturas Internas · Pedido proveedor (NIIF)

**Sub-bloque de:** [CHUSAR_PEDIDO_PROVEEDOR.md](./CHUSAR_PEDIDO_PROVEEDOR.md)  
**Código:** **2.3.1.7.5.3.2**  
**Ruta:** `/proceso-importacion/pedido-proveedor/[ppId]?tab=fi`  
**Streamlit:** `ui.py` → `_render_hijo_menor()` · `render_fi_card`  
**Actualizado:** 2026-07-26  
**Shibboleth:** Andrés, el que viene.

**Listado motor FI:** [CHUSAR_LISTADO_MOTOR_FI_PP.md](./CHUSAR_LISTADO_MOTOR_FI_PP.md) (**2.3.1.7.5.3.14**) · select violeta · precio 0 sin match.

---

## Norte

**Ala Sur · Facturas internas** — **programado (nuevo):** FI desde proforma (cliente×marca×caso) + vínculo manual IC en **Administrador de IC** · **compra previa:** por marca/caso. Ver [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md). Paridad funcional Streamlit; **UI obligatoria NIIF** (sin tema oscuro inmersivo).

Estándar visual: [niif_estandar_visual.md](../../1_fundamentos/1.3_politicas/niif_estandar_visual.md)  
Patrón referencia: Report `/aprobaciones` → `FiCard.tsx`.

---

## Componentes Report

| Archivo | Rol |
|---------|-----|
| `PpTabFacturasInternas.tsx` | Lista FI · botón CSV · aviso PP ENVIADO |
| `PpFiCard.tsx` | Tarjeta FI colapsable · LP · **listado motor** · detalle moléculas |
| `FiProductThumb.tsx` | Miniatura L-R-M-C · POLITICA_THUMBNAILS |
| `fi-download-cache.ts` | Prefetch PDF/CSV · caché por PP |
| `run-fi-pdf.ts` | PDF serverless (pdf-lib) · fallback Python local |
| `fi-pdf-data.ts` · `fi-pdf-generator.ts` | Query + render FI |

---

## PDF FI — prod serverless (2026-07-14)

**Error resuelto:** `4.02.03.013` · commit report `7b7d5d7`

| Entorno | Ruta |
|---------|------|
| Vercel | `runFiPdf` → pdf-lib (sin Python) |
| Local | TS primero · Python fallback si falla |

Smoke: `tsx scripts/smoke_fi_pdf.ts [fiId]`

---

## UI NIIF — tarjeta FI (`PpFiCard`)

### ✅ Obligatorio

| Elemento | Clase / patrón |
|----------|----------------|
| Contenedor | `border-2 border-neutral-300` · `bg-card-bg` · `shadow-md` |
| Cabecera | `bg-gradient-to-r from-rimec-azul/5` · `border-b-2 border-rimec-azul/15` |
| Nº FI | Badge `bg-rimec-azul` · texto blanco · `font-mono` |
| Cliente / meta | `text-slate-900` · `text-slate-600` · `text-slate-500` |
| Totales | `text-rimec-azul-dark` · montos `text-slate-900` |
| Botón PDF | `border-rimec-azul/40` · `bg-rimec-azul/10` · `text-rimec-azul` |
| Estado | `ESTADO_STYLE` claro (violet/emerald/slate) |

### ⛔ Prohibido (tema oscuro)

```text
bg-slate-900 · bg-slate-950 en cabecera FI
text-amber-300 · text-yellow-* sobre fondo oscuro
text-white/* en cabeceras de tarjeta PP-FI
border-amber-400/60 + text-amber-200 (botón PDF legacy)
```

Corrección Director 2026-07-08: cabecera navy + amarillo **revocada**.

---

## Bloques funcionales

| Bloque | Comportamiento |
|--------|----------------|
| Header lista | Título «Ala Sur · Facturas internas (N)» · chip PROGRAMADO si `categoria_id=3` |
| CSV ventas | `GET …/[ppId]/csv-ventas` · botón **📄 Ventas** verde · FI confirmadas |
| CSV inicial | `GET …/[ppId]/csv-inicial` · botón **📋 Inicial** celeste · `cantidad_pares` PPD |
| Acordeón FI | Click cabecera · meta vendedor/LP/plazo/marca |
| **Listado motor** | Select violeta por FI · PATCH `listado-motor` · [2.3.1.7.5.3.14](./CHUSAR_LISTADO_MOTOR_FI_PP.md) |
| Selector LP | `SelectorPoliticaLp` · PATCH recalcula FI + sincroniza IC (tier 1–4) |
| Detalle líneas | Miniatura + 5 pilares + gradas + precios s/d y c/d |
| PDF | Descarga por FI · prefetch al expandir |

---

## Programado (`categoria_id = 3`)

| Regla | Detalle |
|-------|---------|
| 1 FI × IC | SHOP Excel = `id_cliente` |
| LP | Desde IC · recalc al cambiar tier en FI editable |
| CSV | Dual veneno Carlos · [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) · ventas + inicial |
| Miniaturas | L-R-M-C en detalle |

---

## Edición

```text
fiEditable = pp.listado_editable && estado FI ∈ {RESERVADA, CONFIRMADA}
pp.listado_editable ⇔ estado PP ∉ {ENVIADO, ANULADO}
```

API LP: `PATCH /api/proceso-importacion/pedido-proveedor/[ppId]/fi/[fiId]/lista-precio`

---

## Paridad Streamlit

| Streamlit | Report |
|-----------|--------|
| `render_fi_card` | `PpFiCard` (visual NIIF, misma data) |
| `get_fi_detalles_canonico` | `detallesPorFi` en page load |
| `recalcular_facturas_internas_pp` | PATCH lista-precio + backend |
| CSV ventas PP | `csv-ventas-export.ts` · `fetchCsvCarlosRows` |
| CSV inicial PP | `csv-ventas-export.ts` · `fetchCsvCarlosRowsInicial` |

---

## Smoke

1. PP programado con FI → `/…/15?tab=fi` — tarjetas **fondo blanco**, badge azul RIMEC.
2. Expandir FI → miniaturas + selector LP.
3. Descargar PDF — sin error toast.
4. PP ENVIADO — banner ámbar solo lectura · inputs LP deshabilitados.
5. **Prohibido** regresión visual: cabecera `bg-slate-900`.

---

## Índice

- [MAPA_ACCESO_RAPIDO_PP_DETALLE.md](./MAPA_ACCESO_RAPIDO_PP_DETALLE.md)
- [CHUSAR_PP_TAB_STOCK.md](./CHUSAR_PP_TAB_STOCK.md)
- [CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md](./CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md)
- [CHUSAR_HOTFIX_REPORT_PP14_20260714.md](./CHUSAR_HOTFIX_REPORT_PP14_20260714.md)
- [CHUSAR_LISTADO_MOTOR_FI_PP.md](./CHUSAR_LISTADO_MOTOR_FI_PP.md)
- [CHUSAR_PEDIDO_PROVEEDOR.md](./CHUSAR_PEDIDO_PROVEEDOR.md)
