# CHUSAR — RIMEC Web · Catálogo · CABECERA DE FILTROS

**Subcuenta:** **2.2.1.1**  
**Padre:** `2.2.1` Catálogo · [INDICE.md](./INDICE.md)  
**Etapa:** [ETAPA_RIMEC_WEB_PE_LOCAL_20260706.md](../../4_etapas/ETAPA_RIMEC_WEB_PE_LOCAL_20260706.md) · `RIMEC-WEB-PE-LOCAL-20260706`  
**Estándar:** [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)  
**TONO / color:** [CHUSAR_BUSQUEDA_COLOR_CANALES.md](../2.3_report/pilares/CHUSAR_BUSQUEDA_COLOR_CANALES.md)  
**Estado:** 🟢 **PROD 2026-07-17** · `:3001` · https://rimec.com.py  
**App:** http://localhost:3001 · CP / PE vía **header** · ver [CHUSAR_HEADER_ORIGEN_CP_PE_20260717.md](./CHUSAR_HEADER_ORIGEN_CP_PE_20260717.md)

---

## Qué es

Bloque **CABECERA DE FILTROS** en la home del catálogo mayorista — paridad visual/funcional con Report depósito y Tablet (pills naranjas, fila TONO con círculos canónicos, búsqueda integrada).

Reemplaza el layout anterior: dropdown Color · barra duplicada «Buscar modelos / Color / Ofertas» en `CatalogoGrid` · límite `estilos.slice(0,15)`.

---

## Layout (orden — vigente 2026-07-17)

```
HEADER     → Compra previa | Pronta entrega  (reemplaza Damas/Niñas/Niños/Caballeros/Catálogo)
CABECERA   → conteos · Limpiar · Extender · acordeón TONO (horizontal)
SIDEBAR    → DIMENSIONES (Stock CP+fechas | PE · Depósito · Categoría · AB-CR · Marca · Tipo · Género)
           → MOLÉCULA (Estilo → Línea → Material → Color)
GRILLA     → A→Z línea + referencia · todas las tarjetas del filtro
```

Legacy pills en `FiltrosCatalogo` (`variant` default) quedan para referencia; catálogo usa `variant="cabecera"` + `CatalogoFiltrosSidebar`.

---

## Layout histórico (pills 2026-07-08 — obsoleto UI)

```
Origen (Compra previa | Pronta entrega) + PE: Categoría · Depósito
Género   → Todos · Damas · Caballeros · Niñas · Niños
… (marca / estilo / tipo / línea / buscar / TONO / llegada)
```

---

## Universo y verdad BD

| Canal | Vista | Stock activo |
|-------|-------|--------------|
| Compra previa | `v_stock_rimec` | `cajas_disponibles > 0` · `origen_tipo = TRÁNSITO_PP` |
| Pronta entrega | `v_stock_pe_rimec` | idem · filtros ramo/depósito PE |

| Dimensión | Fuente | Nota |
|-----------|--------|------|
| Género | Pilar `linea.genero` | Enriquecimiento `cargarMetaLineasDesdePilar` en servidor |
| Marca / Estilo / Tipo 1 / Línea | Vista + meta `/api/catalogo/filtros` | SQL parcial + memoria |
| **TONO** | **`color.tono_canon`** | **No** `v_stock_rimec.color_tono_canon` — columna **no existe** en vista (2026-07-08) |
| TONO join | `stock.color_code` → `color.codigo_proveedor` | Batch en `lib/catalogoEnrich.ts` |
| Catálogo círculos UI | `color_tono_estandar` proveedor **654** | `GET /api/catalogo/tonos` · fallback `COLORES_ESTANDAR_DEFAULT` |

**Prohibido:** filtrar catálogo público solo con `descp_color` / hex regex cuando hay `tono_canon` en pilar.

---

## Hotfix columna inexistente (2026-07-08)

**Síntoma:** `column v_stock_rimec.color_tono_canon does not exist` · catálogo 0 tarjetas.

**Causa:** SELECT incluía columna no materializada en vista.

**Fix app (local):**

1. Quitar `color_tono_canon` de `CATALOGO_STOCK_SELECT` (`lib/catalogoData.ts`).
2. Enriquecer post-fetch en `lib/catalogoEnrich.ts`: género (línea) + tono (pilar `color`).

**Pendiente SQL (opcional):** migración vista `v_stock_rimec` / `v_stock_pe_rimec` con `color.tono_canon` denormalizado — no bloquea UI local.

---

## Código

| Pieza | Ruta |
|-------|------|
| **CABECERA DE FILTROS** | `rimec-web/app/components/FiltrosCatalogo.tsx` |
| Orquestación cliente | `rimec-web/app/CatalogoClient.tsx` |
| Fila TONO UI | `rimec-web/components/catalog/FiltroTonoCabecera.tsx` |
| Tonos canónicos | `rimec-web/lib/pilares/colores-estandar.ts` · `color-canon.ts` |
| Filtros memoria/SQL | `rimec-web/lib/catalogoFilters.ts` |
| Enriquecimiento género+tono | `rimec-web/lib/catalogoEnrich.ts` |
| Paginado tarjetas | `rimec-web/lib/catalogoPaginado.ts` |
| API tonos | `GET /api/catalogo/tonos` |
| API filtros meta | `GET /api/catalogo/filtros` |
| API tarjetas | `GET /api/catalogo/tarjetas` |
| Mega-header triangular | **retirado 2026-07-17** — ver Header origen CP/PE |
| Header origen CP/PE | `app/components/Header.tsx` |
| Sidebar Dimensiones/Molécula | `app/components/CatalogoFiltrosSidebar.tsx` |
| Grilla (sin barra duplicada) | `app/CatalogoGrid.tsx` |

---

## Params URL (RIMEC Web — mixto FK + tono)

| Param | Ejemplo | Fila |
|-------|---------|------|
| `genero_codigo` | `DAMAS` | Género |
| `marca_id` | `12` | Marca |
| `grupo_estilo_id` | `5` | Estilo |
| `tipo_ids` | `1,4` | Tipo 1 |
| `linea_ids` | `1184,4313` | Línea |
| `tonos` | `Negro,Marino` | TONO |
| `sin_tono` | `1` | Sin asignar |
| `buscar` | `vizzano` | Buscar |
| `origen_tipo` | `PRONTA_ENTREGA` | Origen |
| `ramo_tipo` / `deposito_codigo` | PE | Categoría / depósito |

**Gap vs URL canónica holding (`generos|`, `q`):** params actuales son legacy RIMEC Web — converger en etapa futura si Director ordena.

---

## Diferencias vs tablet / Report

| Aspecto | Tablet depósito | RIMEC Web catálogo |
|---------|-----------------|---------------------|
| Categoría tipo_v2 | ❌ | ❌ *(importadora)* |
| Género CP | ✅ pills | ✅ pills |
| Tipo 1 | dropdown multi | **pills** multi |
| Línea | dropdown multi | **pills** scroll |
| TONO | ✅ círculos | ✅ círculos naranja |
| Barra búsqueda duplicada en grilla | ❌ | **retirada** 2026-07-08 |

---

## Smoke local (Director)

1. `:3001` — tarjetas cargan sin error SQL rojo.
2. Header **Compra previa** / **Pronta entrega** — cambian origen y **conservan** marca/tipo/tono en URL.
3. Sidebar Dimensiones → Género **Damas** → URL `genero_codigo=DAMAS`.
4. TONO **Negro** → solo variantes con tono canónico.
5. **Activar venta** → precios · + cajas · carrito · confirmar.
6. Buscar línea/ref numérico → filtra.

**Prod:** deploy con orden **despliega** · commits `5032a86` · `3e57fa7` · `a8f425d` · [CHUSAR_CORTE_20260717](./CHUSAR_CORTE_20260717_HEADER_PRECIOS_PE.md) · [CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md](../../1_fundamentos/1.1_protocolos/CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md).

---

## Relacionado (misma etapa local)

| Tema | Doc |
|------|-----|
| Header CP/PE 2026-07-17 | [CHUSAR_HEADER_ORIGEN_CP_PE_20260717.md](./CHUSAR_HEADER_ORIGEN_CP_PE_20260717.md) |
| Carrito PE confirmar · MIG-138–141 | Bitácora etapa · RPC `confirmar_pedido_web` |
| Imágenes NIIF PE | [CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md](./CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md) |
| PROMOCIONAL LPC03 | [CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md](./CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md) |

---

**Documentación Chusar:** 2026-07-08 · Cursor · Director orden «documenta en chusar» · **actualizado 2026-07-17** (header origen)  
**Shibboleth:** Andrés, el que viene. · CABECERA DE FILTROS = nombre único holding
