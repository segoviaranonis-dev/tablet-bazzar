# CHUSAR — Catálogo «Todos» · fusión CP + PE en una grilla

**Código:** **2.2.1.0.4**  
**Estado:** 📋 Diseño ratificado · **pendiente implementación**  
**App:** `rimec-web/` · https://rimec-web.vercel.app  
**Palabra reservada Director:** **Documenta** (2026-07-13)  
**Relacionado:** [CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md](./CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md) · [CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md](./CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md) · [CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md](./CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md)

---

## 1 · Qué pide el Director

| Hoy | Objetivo |
|-----|----------|
| Pills **Compra previa** \| **Pronta entrega** — una vista u otra | Pill **Todos** — **una sola grilla** |
| Mismo SKU en CP y PE → **dos tarjetas** separadas en DOM | **Una tarjeta** por modelo (SKU) con **paneles apilados** por lote/origen |
| Cambio de pill = recarga + latencia | Ver ambos lotes sin cambiar de pantalla |
| Compra desde panel del origen activo | Botón **+/− cajas** en **cada panel** (PE y CP) desde el mismo card |

**Mockup Director (6262 · Vizzano):** foto única arriba; debajo panel verde «Pronta entrega» (sin gradas) + panel azul «1ra Quincena de Agosto» (con gradas `34(1-2-3-3-2-1)39`); cada panel con tonos, stock y controles de caja.

---

## 2 · Veredicto — ¿Es posible?

**Sí.** El holding ya tiene casi todas las piezas; falta **fusionar en capa UI + paginación dual**, no rehacer carrito ni BD.

| Capa | Estado actual | ¿Bloquea? |
|------|---------------|-----------|
| Vistas BD | `v_stock_rimec` (CP) + `v_stock_pe_rimec` (PE) | No — consulta dual en paralelo |
| Carrito | `det_id` por fila; PE usa `carritoValidarPe` | No — cada panel conserva su `det_id` |
| Precios | `getPrecioActivo` (CP) · `getPrecioActivoPe` (PE) | No — por panel según `origen_tipo` |
| Imágenes 638 | `imagen_color_excel` solo en vista PE (MIG-149) | No — import batch **no se toca** |
| Multi-origen | `lib/catalogoOrigen.ts` + shells por quincena/PE | No — reutilizar chips y colores |
| **Gradas PE** | **PE no muestra gradas** en `CatalogoGrid.tsx` (`!esPe`) | **Regla ya cumplida** — mantener en panel PE |

**Regla explícita Director:** Pronta entrega **no tiene gradas** — no mostrar `gradas_fmt` en panel PE; CP sí (curva importadora).

---

## 3 · Regla de agrupación (cambio respecto a hoy)

**Hoy** (`lib/agruparTarjetasCatalogo.ts`):

> No fusionar el mismo SKU si `origen_tipo` u `origen_referencia_id` difieren → `cardKey = sku + origen`.

**Modo Todos:**

```
TarjetaFusionada {
  sku_id, linea, referencia, material, foto compartida (variante activa)
  lotes: [
    { origen_tipo, origen_label, shell, variantes[], esPe }
  ]
}
```

- **1 modelo en grilla** = 1 `sku_id` (línea·referencia·material), aunque existan filas CP y PE.
- **Colores** pueden diferir por lote — carrusel **por panel**, no global (como mockup).
- Si solo existe CP o solo PE para ese SKU → tarjeta con **un solo panel** (degradación natural).

---

## 4 · Filtro «Todos» (UI)

Ubicación: fila **ORIGEN** en `FiltrosCatalogo.tsx` (cuadro rojo mockup).

| Pill | `origen_tipo` URL | Comportamiento |
|------|-------------------|----------------|
| **Todos** (default propuesto) | `''` o `TODOS` | Dual fetch CP+PE · fusión por SKU |
| Compra previa | `''` + flag legacy o quitar si Todos reemplaza | Solo `v_stock_rimec` |
| Pronta entrega | `PRONTA_ENTREGA` | Solo `v_stock_pe_rimec` |

**Filtros compartidos** (marca, línea, búsqueda, tono): siguen en `sessionStorage` — [CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md](./CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md).

**Filtros por origen en modo Todos:**

- **Quincenas** → aplica solo a lotes CP.
- **Categoría calzado/confecciones** → aplica solo a lotes PE.
- **Depósito PE** → solo paneles PE.

---

## 5 · Pipeline técnico (implementación)

```
Filtros Todos
    ├─ fetch v_stock_rimec (TRÁNSITO_PP)  ─┐
    └─ fetch v_stock_pe_rimec (PE)         ─┼─ merge filas → enrich → applyMemoryFilters
                                            └─ fusionarPorSku() → TarjetaFusionada[]
                                            └─ paginar 30 modelos (SKU únicos, no cardKey)
```

### Archivos a tocar

| Archivo | Cambio |
|---------|--------|
| `lib/agruparTarjetasCatalogo.ts` | `fusionarTarjetasPorSku(tarjetasCp, tarjetasPe)` |
| `lib/catalogoPaginado.ts` | Modo dual cuando `origen_tipo` = Todos |
| `lib/catalogoFilters.ts` | `catalogoStockView` → dual; filtros memoria por lote |
| `lib/catalogoPeWarmCache.ts` | Warm **Todos** = CP+PE ya calientes (reutilizar dual cache) |
| `app/components/FiltrosCatalogo.tsx` | Pill **Todos** |
| `app/CatalogoGrid.tsx` | `TarjetaProductoFusionada` — N paneles + foto única |
| `app/page.tsx` | Default `origen_tipo` opcional Todos |

### Carrito (sin cambio de contrato)

Cada panel llama `agregarCaja` / `quitarCaja` con el `det_id` y meta de **su** origen — mismo flujo que hoy. VALIDAR post-import sigue igual.

---

## 6 · Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Latencia primera carga Todos | Dual warm cache ≥30 SKU CP **y** PE en layout (`CatalogWarmProvider`) |
| Paginación «30 modelos» ambigua | Contar **SKU fusionados**, no filas BD |
| Tarjeta alta (2+ paneles) | `CatalogGrillaDeposito` ya es vertical; scroll natural |
| PDF catálogo | Iterar `lotes[]` por tarjeta fusionada |
| Import imágenes 638 en curso | **No tocar** Storage ni scripts batch — solo lectura vista PE |

---

## 7 · Estimación

| Fase | Alcance |
|------|---------|
| **MVP** | Pill Todos + fusión SKU + 2 paneles + carrito dual | ~1 etapa Cursor |
| **Pulido** | Warm Todos, filtros quincena/ramo cruzados, smoke E2E | +0.5 etapa |
| **Fuera de alcance** | Programado (Report) · unificar vistas BD en una sola SQL |

---

## 8 · Criterio de aceptación (smoke)

1. Pill **Todos** → grilla con modelos que tienen **solo CP**, **solo PE**, o **ambos**.
2. Modelo 6262 (mockup): panel PE verde sin gradas + panel CP con gradas y quincena.
3. `+` en panel PE agrega caja PE (`det_id` PE); `+` en panel CP agrega caja CP — carrito mixto OK.
4. Cambiar a pill PE o CP sigue funcionando (retrocompat).
5. Import batch confecciones **sigue corriendo** — cero cambios en `control_central/tools/`.

---

## 9 · Orden sugerido al Director

1. **Ratificar** mockup + default **Todos** al abrir catálogo (¿sí/no?).
2. **Inicia etapa** `RIMEC-WEB-CATALOGO-TODOS-20260713` (implementación).
3. Smoke local → **Despliega** prod.

---

**Documenta:** 2026-07-13 · fusión CP+PE grilla Todos · PE sin gradas · import 638 no afectado
