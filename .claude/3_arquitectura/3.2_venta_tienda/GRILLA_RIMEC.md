# GRILLA RIMEC — estándar holding · moléculas · cabecera · dato duro

**Código plan:** `3.2.00.002`  
**Clave Director:** **Grilla Rimec** *(dos palabras — nombre único)*  
**Ratificado:** 2026-07-14 · orden Director  
**Relacionado:** [CABECERA DE FILTROS](./CABECERA_DE_FILTROS.md) (`3.2.00.001`) · [CHUSAR_GRILLA_RIMEC.md](../../2_modulos/2.2_rimec_web/CHUSAR_GRILLA_RIMEC.md) (`2.2.1.11`)

---

## Instrucción de uso

> Cuando el Director dice **«Grilla Rimec»**, se refiere a **este stack completo**: cabecera de filtros + grilla de tarjetas molécula + acordeón por **dato duro** + toggle **Extender todos los datos** — no solo la grilla CSS ni solo los filtros.

| ✅ Incluye | ❌ No confundir con |
|-----------|---------------------|
| Panel blanco CABECERA DE FILTROS | Solo `CatalogGrillaDeposito` (layout) |
| Tarjeta molécula (foto L-R · pilares) | Sales Report blindado |
| Acordeón colapsado por lote/origen | Tabla jerárquica `/estadisticas` |
| Toggle naranja pie cabecera | Botón dentro de cada tarjeta |
| Agrupación SKU + fusión multi-quincena | Lista plana sin `cardKey` |

---

## Stack canónico (4 capas)

```
┌─ CABECERA DE FILTROS (panel blanco) ─────────────────────┐
│ Origen · Categoría · Género · Marca · … · TONO · Buscar  │
│ Pie derecho: [ Extender todos los datos ]  ← toggle      │
└──────────────────────────────────────────────────────────┘
┌─ Grilla responsive (CatalogGrillaDeposito) ──────────────┐
│  Tarjeta molécula × N                                     │
│  ├─ imagen + L-R + badge marca                           │
│  └─ pie venta: acordeón por lote                         │
│       colapsado: quincena_desc + pares (naranja)         │
│       expandido: color · grada · tonos · carrito         │
└──────────────────────────────────────────────────────────┘
```

**Provider global:** `CatalogAcordeonProvider` envuelve cabecera + grilla (mismo turno de página).

---

## Dato duro — regla transversal

| Moria (doc) | UI Grilla Rimec | BD |
|-------------|-----------------|-----|
| **Dato duro** | Texto quincena legible en fila colapsada | `quincena_arribo.descripcion` vía `quincena_arribo_id` |
| Prohibido UI | Literal «Dato duro» | Error `4.02.03.004` |
| PE | «Pronta entrega» | `origen_tipo = PRONTA_ENTREGA` |
| CP | «1ra Q. de Agosto» etc. | FK 1–24 |

**Agrupación:**

| Nivel | Clave | Regla |
|-------|-------|-------|
| Tarjeta DOM | `cardKey` | `sku_id + origen_tipo + origen_referencia_id` |
| Fusión Todos | `TarjetaCatalogoFusionada` | Mismo SKU · varios lotes apilados |
| Acordeón | `lote.cardKey` | Un acordeón por lote · CP y PE mismo chrome |
| Variantes | `det_id` | Colores dentro del lote expandido |

---

## Toggle «Extender todos los datos»

Paridad Report `GrillaPeImportadora` · **ubicación obligatoria:** pie CABECERA DE FILTROS (no en tarjeta).

| Estado | Label | Efecto |
|--------|-------|--------|
| Colapsado | **Extender todos los datos** | Abre todos los acordeones visibles |
| Extendido | **Compactar lotes** / **Compactar tarjetas** | Cierra todos |

Estilo: borde naranja · relleno naranja activo · `min-h-[40px] rounded-xl`.

---

## Parametrización — réplica en otro módulo

Checklist OT (adaptar fuente · conservar lógica):

| # | Pieza | Contrato | Adaptar |
|---|-------|----------|---------|
| 1 | Cabecera | [CABECERA DE FILTROS](./CABECERA_DE_FILTROS.md) | Tabla/vista del módulo |
| 2 | Provider acordeón | `allKeys[]` de lotes visibles | Mapper de filas → keys |
| 3 | Toggle cabecera | `CatalogExtenderDatosToggle` o homólogo | Mismo copy/estilo |
| 4 | Grilla layout | `CatalogGrillaDeposito` o `GrillaPeImportadora` | Columnas responsive |
| 5 | Tarjeta | `CatalogTarjetaDeposito` / `PeCardMiniatura` | Slots imagen + footer |
| 6 | Acordeón lote | `CatalogLotesAcordeon` | `etiquetaDatoDuroLote(row)` |
| 7 | Agrupador | `agruparTarjetasCatalogo` + `fusionTarjetasCatalogo` | Reglas origen del canal |

**Prohibido:** copiar SQL de `v_stock_rimec` en módulo cuya fuente es otra tabla sin mapper.

---

## Ley TODOS — universo inicial de grilla (2026-07-26)

**Doc canónico:** [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](../../2_modulos/2.2_rimec_web/CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) (**2.2.1.28**)

Toda grilla browse con pill **Todos** (CP + PE mezclados) obedece:

| Regla | Implementación |
|-------|----------------|
| Entrada sin ramo | `origen_tipo=TODOS` · `ramo_tipo=""` — universo completo |
| Calzado explícito | Solo si usuario elige categoría Calzado o entra PE |
| Exclusión carteras | `calzadoExcluyeCarterasPorDefecto` — solo con `ramo_tipo=CALZADO` |
| Paginación | Batch TODOS + `exclude` si corte a mitad de lote |
| Checklist OT | §3.1 del Chusar 2.2.1.28 antes de merge |

**Hermano modelo:** Stock PE `:3000/stock-pronta-entrega` · espejo Web `:3001` · AM `:3000/herramienta-reposicion`.

---

## Implementaciones actuales

| App | Módulo | Grilla Rimec | Notas |
|-----|--------|:------------:|-------|
| **RIMEC Web** `:3001` | Catálogo `/` | ✅ **referencia** | Deploy `96870f3` · [CHUSAR](../../2_modulos/2.2_rimec_web/CHUSAR_GRILLA_RIMEC.md) |
| **Report** `:3000` | Panel CP · PE · Tránsito | 🟡 **parcial** | `GrillaPeImportadora` + cabecera sellada · converger acordeón dato duro |
| **Tablet** `:3000` | Cadena depósito | ⏳ | CABECERA sí · acordeón dato duro pendiente OT |
| **Bazzar Web** | Catálogo retail | ⏳ | Evaluar tras RIMEC Web aprobado Director |

---

## Índice

- [CHUSAR_GRILLA_RIMEC.md](../../2_modulos/2.2_rimec_web/CHUSAR_GRILLA_RIMEC.md) — código app
- [CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md](../../2_modulos/2.2_rimec_web/CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md)
- [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](../../2_modulos/2.2_rimec_web/CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) — **2.2.1.28** · ley TODOS · construcción grillas
- [CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md)
- [BUENAS_PRACTICAS.md](../../1_fundamentos/1.1_protocolos/BUENAS_PRACTICAS.md) § quincena

**Shibboleth:** Andrés, el que viene.
