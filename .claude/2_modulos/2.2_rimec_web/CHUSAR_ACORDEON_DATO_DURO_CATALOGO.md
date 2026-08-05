# CHUSAR — Acordeón dato duro · tarjetas fusionadas catálogo

**Código:** **2.2.1.0.10** · ampliado Documenta **2026-07-20**  
**Padre:** [CHUSAR_GRILLA_RIMEC.md](./CHUSAR_GRILLA_RIMEC.md) (**2.2.1.11**) · [CHUSAR_SESION_DURO_PREVENTA_UI_PRECIOS_20260720.md](../2.3_report/gestion_compra/CHUSAR_SESION_DURO_PREVENTA_UI_PRECIOS_20260720.md) (**2.3.1.32**)  
**Estándar:** [GRILLA_RIMEC.md](../../3_arquitectura/3.2_venta_tienda/GRILLA_RIMEC.md) (`3.2.00.002`)  
**Shibboleth:** Andrés, el que viene.

---

## Concepto clave — dato duro CP (2026-07-20)

Par **siamese** obligatorio en compra previa (CP / `TRÁNSITO_PP`):

| Fila UI | Dato | Fuente BD | Color |
|---------|------|-----------|-------|
| **1** | **PP-4099** (Nº preventa Carlos) | `pedido_proveedor.nro_pedido_externo` | Naranja `text-orange-600` |
| **2** | **1ra Oct.** (llegada) | `quincena_arribo.descripcion` vía FK 1–24 | Azul `text-sky-800` |

| Término Moria | UI catálogo (antes) | UI catálogo (ahora) |
|---------------|---------------------|---------------------|
| Dato duro llegada | Chip quincena larga | Fila 2 abreviada |
| Preventa Carlos | *(ausente)* | Fila 1 `PP-NNNN` |

- **Cable de acero:** FK `quincena_arribo_id` (1–24) — **no** ETA variable.
- **Prohibido:** una sola línea `PP-4099 · 1ra Oct.` en acordeón footer.
- **Prohibido:** salto de línea dentro de `2da Sep.` — espacio `\u00A0` + `whitespace-nowrap`.
- **Prohibido en UI:** texto literal «Dato duro» (error Report `4.02.03.004`).
- Mismo SKU con **distintas quincenas/preventas** → tarjeta **fusionada** (pill Todos) con **varios lotes**.

Doc quincena: [FECHA_DE_EMBARQUE.md](../2.3_report/proceso_importacion/FECHA_DE_EMBARQUE.md) · preventa: [CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md](../2.3_report/gestion_compra/CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md) (**2.3.1.31**)

---

## Layout acordeón footer (CP)

```
┌─────────────────────────────────────┐
│ ▸ │     PP-4135      │  32 p       │
│   │     2da Sep.     │  Gs. …      │
└─────────────────────────────────────┘
     ↑ centrado          ↑ derecha
     2 filas             stock+precio
```

| Prop | Valor |
|------|-------|
| `layout` | `"center"` en `DatoDuroCpFilas` |
| Tipografía fila 1 | 13px font-black |
| Tipografía fila 2 | 12px font-bold |
| Precio | Solo con venta activa · bajo badge pares (ley 4.01.04.001) |

---

## Comportamiento acordeón (2026-07-14 + 2026-07-20)

Pill **Todos** · modelo con 2+ lotes CP/PE apilados:

| Estado | Visible |
|--------|---------|
| **Colapsado** | Dos filas dato duro CP + badge pares + precio (si venta) |
| **Expandido** | Material · color · grada · tonos · carrito |
| **Badge pares contraído** | Total lote (todos los colores) |
| **Badge pares desplegado** | Solo tono/color activo — fix `4.02.04.002` |

Controles:
- **Extender todos los datos** / **Compactar lotes** — pie CABECERA DE FILTROS
- **+ / −** por lote (de a uno)

Un solo lote → panel plano con mismo footer dos filas.

---

## Archivos (implementación)

| Archivo | Rol |
|---------|-----|
| `lib/datoDuroCabecera.ts` | `formatNumeroPreventaCarlos` · `formatQuincenaCorta` · `partesDatoDuroCp` · `etiquetaDatoDuroCp` |
| `components/catalog/DatoDuroCpFilas.tsx` | **Dos filas · colores · center/left** |
| `components/catalog/CatalogLotesAcordeon.tsx` | Acordeón multi-lote · `layout="center"` |
| `components/catalog/CatalogPanelOrigen.tsx` | Panel venta · `hideOrigenChip` en acordeón |
| `lib/catalogoEnrich.ts` | Preventa por `pp_id` si vista no trae columna |
| `lib/precioLoteCatalogo.ts` | Precio tier + centena (ver **2.3.1.7.1.0.2**) |
| `app/CatalogoGrid.tsx` | PDF catálogo · `dato_duro_label` |
| `lib/catalogoServerCache.ts` | Warm `catalogo-tarjetas-warm-v5` |

**Paridad AM:** `report/…/DatoDuroCpFilas.tsx` · `merge-reposicion.ts` · `ReposicionArticuloCard.tsx`

---

## Smoke

```bash
cd rimec-web && npm run build
cd rimec-web && npx tsx scripts/smoke_ley_precios.ts
```

Visual: VIZZANO · CP acordeón → fila1 `PP-4135` naranja · fila2 `2da Sep.` azul · sin wrap.

**Deploy prod:** ⛔ regla CHUSAR deploy solo cierre etapa — validar local `:3001`.

---

## Índice

- [CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md](./CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md) (**2.2.1.0.4**)
- [CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md](./CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md) (**2.2.1.18**)
- [CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md](../2.3_report/motor_precios/CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md) (**2.3.1.7.1.0.2**)
- [INDICE.md](./INDICE.md)

**Última actualización:** 2026-07-20 · Documenta Director
