# CHUSAR — Índice botones · Tablet Depósito `/deposito`

**Subcuenta:** **2.4.3.11** · hijos **2.4.3.10.1–10.7**  
**Etapa cerrada:** [ETAPA_PANEL_CONTROL_CABECERA_TABLET_CERRADA.md](../../4_etapas/ETAPA_PANEL_CONTROL_CABECERA_TABLET_CERRADA.md) · **PANEL-CONTROL-CABECERA-2026**  
**Manual padre:** [CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md](./CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md)  
**App:** https://tablet-bazzar.vercel.app/deposito · dev `:3002`  
**Navegador:** http://localhost:3004/modulos/tablet-bazzar/manual-deposito  
**Estado:** ✅ **CERRADA 2026-07-03** · PASS piso Director

---

## Mapa rápido — todos los controles

| # | Botón / control | Zona | Componente | Anchor |
|---|-----------------|------|------------|--------|
| 1 | **ATRÁS** | Toolbar | `DepositoToolbar.tsx` | [§ toolbar](#toolbar) |
| 2 | **Stock · cajas** | Toolbar tab | `DepositoToolbar.tsx` | [§ toolbar](#toolbar) |
| 3 | **Alertas · vidriera ⭐** | Toolbar tab | `DepositoToolbar.tsx` | [§ alertas](#alertas) |
| 4 | **Estadísticas** | Toolbar tab | `DepositoToolbar.tsx` | [§ estadisticas](#estadisticas) |
| 5 | **Selector tienda** | Toolbar | `<select>` | [§ toolbar](#toolbar) |
| 6 | **Ver gradas ▾ / Colapsar todo ▴** | Toolbar (solo Stock) | `DepositoToolbar.tsx` | [§ stock-grilla](#stock-grilla) |
| 7 | **CABECERA ▾/▴** | Toolbar | `DepositoToolbar.tsx` | [§ cabecera](#cabecera) |
| 8 | **Top/marca** 80·200·500·1000 | CABECERA | `DepositoFiltrosHeader.tsx` | [§ top-marca](#top-marca) |
| 9 | **Limpiar filtros** | CABECERA | `DepositoFiltrosHeader.tsx` | [§ cabecera](#cabecera) |
| 10 | **Género** chips | CABECERA | `Pill` | [§ cabecera](#cabecera) |
| 11 | **Marca** chips | CABECERA | `Pill` | [§ cabecera](#cabecera) |
| 12 | **Estilo** chips | CABECERA | `Pill` (max 24) | [§ cabecera](#cabecera) |
| 13 | **Tipo 1** multi | CABECERA | `Pill` toggle | [§ cabecera](#cabecera) |
| 14 | **Línea** dropdown | CABECERA | `DropdownIds` | [§ cabecera](#cabecera) |
| 15 | **Buscar** texto | CABECERA | `<input search>` | [§ cabecera](#cabecera) |
| 16 | **TONO** círculos | CABECERA | `FiltroTonoRow` | [§ cabecera](#cabecera) |
| 17 | **Grada** curva | CABECERA | `FiltroGradaDeposito` | [§ cabecera](#cabecera) |
| 18 | **Ocultar cabecera ▲** | CABECERA footer | sticky button | [§ cabecera](#cabecera) |
| 19 | **Tap foto caja** | Grilla Stock | `GrillaCajasDeposito` | [§ stock-grilla](#stock-grilla) |
| 20 | **Toggle Pares / Precio Gs** | Estadísticas | `DepositoEstadisticasPanel` | [§ estadisticas](#estadisticas) |

---

## Toolbar {#toolbar}

**Archivo:** `tablet-bazzar/components/deposito/DepositoToolbar.tsx`  
**Estado URL:** `tab` en React state (no query) · `cliente_id` en state + refetch

### ATRÁS

| Campo | Valor |
|-------|-------|
| **UI** | `Link href="/"` · min 48×72px · `bg-rimec-azul` |
| **Lógica** | Navegación Next.js al panel modos (`app/page.tsx`). No preserva filtros depósito en URL al salir. |
| **Efecto BD** | Ninguno |
| **PASS** | ✅ Botón táctil grande · vuelve a selector Ventas/Depósito |

**Optimización futura:** guardar último `cliente_id` + filtros en `sessionStorage` para restaurar al re-entrar depósito.

### Tab Stock · cajas

| Campo | Valor |
|-------|-------|
| **UI** | `TabBtn` activo = azul RIMEC |
| **Lógica** | `onTabChange("stock")` · muestra `GrillaCajasDeposito` · habilita CABECERA + Ver gradas |
| **Datos** | `GET /api/deposito/{id}?{filtros}&limit={TOP}` |
| **PASS** | ✅ Grilla protagonista ~85–90% viewport CABECERA cerrada |

**Optimización futura:** virtualizar grilla si TOP 1000 + muchas gradas expandidas (react-window).

### Tab Alertas · vidriera ⭐

| Campo | Valor |
|-------|-------|
| **UI** | Tab naranja · badge contador si `alertasCount > 0` y tab ≠ alertas |
| **Lógica** | `onTabChange("alertas")` · `TabAlertasDeposito` · lista `listarAlertasVidriera(productos)` client-side |
| **Regla negocio** | Último par grada agotado → alerta exponer ⭐ siguiente talla |
| **PASS** | ✅ Badge + lista operativa jefa salón |

**Optimización futura:** endpoint `/api/deposito/{id}/alertas-vidriera` precomputado en SQL para tiendas grandes.

### Tab Estadísticas

| Campo | Valor |
|-------|-------|
| **UI** | Tab azul · CABECERA disponible (mismos filtros que Stock) |
| **Lógica** | `DepositoEstadisticasPanel` · agrega `productos` filtrados en cliente |
| **Paridad** | Misma lógica filtros que Report tab Artículos · distinto chrome |
| **PASS** | ✅ KPIs + gráficos vista filtrada |

**Optimización futura:** alinear acordeón 01–06 con Report (estilo→tono drill · grada parallel bars) en tablet.

### Selector tienda

| Campo | Valor |
|-------|-------|
| **UI** | `<select>` min-h 48px · `{codigo} · {nombre} ({pares} p)` |
| **Lógica** | `onDepositoChange(clienteId)` → `setClienteId` → `loadAll(id, filtros, limit)` |
| **Fuente lista** | `GET /api/deposito/status` → 6 tiendas Bazzar |
| **PASS** | ✅ Cambio tienda recarga grid + filtros-header |

**Optimización futura:** dropdown custom táctil (bottom sheet) en lugar de `<select>` nativo Android.

### CABECERA ▾ / ▴

| Campo | Valor |
|-------|-------|
| **UI** | Naranja · muestra `· TOP {limit}` cuando cerrada |
| **Lógica** | `filtrosExpanded` toggle · default **false** · solo tabs Stock + Estadísticas (`usesCabecera`) |
| **Sub-fila** | Si cerrada: `{totalMostrados} · TOP {limit}` + chips resumen |
| **PASS** | ✅ Default cerrada · stock protagonista |

**Optimización futura:** animación height CSS `dvh` · recordar preferencia expandida por usuario RRHH.

### Ver gradas ▾ / Colapsar todo ▴

| Campo | Valor |
|-------|-------|
| **UI** | Solo `tab === "stock"` · azul RIMEC cuando gradas visibles |
| **Lógica** | `colapsarTodo` state → prop a `GrillaCajasDeposito` / `TablaGradaDeposito` |
| **PASS** | ✅ Colapsar acelera scroll en TOP 500+ |

**Optimización futura:** colapsar por caja individual persistido en tap long-press.

---

## CABECERA filtros {#cabecera}

**Archivo:** `tablet-bazzar/components/deposito/DepositoFiltrosHeader.tsx`  
**Cascada:** cada cambio filtro → `onChange` → page `loadAll` → `GET .../filtros-header` recalcula chips con counts  
**Estándar holding:** [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)

### Orden filas (obligatorio)

Género → Marca → Estilo → Tipo 1 → Línea → Buscar → TONO → Grada

### Género / Marca / Estilo (Pill single-select)

| Campo | Valor |
|-------|-------|
| **Lógica** | Tap activo → deselecciona (string vacío) · tap otro → `patch({ generoId \| marcaId \| grupoEstiloId })` |
| **SQL** | Opciones desde `filtros-header` con `count` por dimensión |
| **Estilo cap** | UI muestra max **24** estilos en scroll horizontal |
| **PASS** | ✅ Cascada reduce chips al filtrar |

**Optimización futura:** paginar estilos >24 con botón «más» sin perder count.

### Tipo 1 (multi Pill)

| Campo | Valor |
|-------|-------|
| **Lógica** | `toggleTipo1(id)` · array `tipo1Ids[]` |
| **UI cap** | Primeros **20** en scroll |
| **PASS** | ✅ Multi-select operativo |

**Optimización futura:** mismo dropdown que Línea para listas largas.

### Línea (DropdownIds)

| Campo | Valor |
|-------|-------|
| **Lógica** | Panel flotante · checkboxes temp → **Aplicar** commit · **Limpiar** vacía temp |
| **Query** | ILIKE en panel sobre opciones |
| **PASS** | ✅ Multi línea sin saturar toolbar |

**Optimización futura:** debounce búsqueda server-side si >500 líneas.

### Buscar (texto)

| Campo | Valor |
|-------|-------|
| **Lógica** | `patch({ q: value })` · debounce implícito en `loadAll` al soltar teclado |
| **Alcance SQL** | Línea, ref, marca, material, color ILIKE |
| **PASS** | ✅ Filtra grilla + recascada header |

**Optimización futura:** debounce 300ms explícito · highlight match en grilla.

### TONO (FiltroTonoRow)

| Campo | Valor |
|-------|-------|
| **Lógica** | Multi `tonos[]` + flag `sinTono=1` · catálogo `tonoCatalog` |
| **Verdad BD** | `color.tono_canon` → `color_tono_estandar.etiqueta` |
| **PASS** | ✅ Círculos + Sin asignar |

**Optimización futura:** sub-etapa **2.3.5.3.1** Editor TONO completo en RIMEC Web.

### Grada (FiltroGradaDeposito)

| Campo | Valor |
|-------|-------|
| **Lógica** | Multi select curvas disponibles en depósito · `onApply({ gradas })` |
| **Opciones** | `data.gradas` desde filtros-header |
| **PASS** | ✅ Filtra moléculas por curva CALCE |

**Optimización futura:** preview unidades por talla al seleccionar curva.

### Limpiar filtros

| Campo | Valor |
|-------|-------|
| **Lógica** | `onChange(EMPTY_DEPOSITO_FILTERS)` · visible solo si `depositoFiltersActive` |
| **PASS** | ✅ Reset total sin tocar TOP/limit |

### Ocultar cabecera ▲

| Campo | Valor |
|-------|-------|
| **Lógica** | `onToggleExpanded(false)` · sticky bottom en panel expandido |
| **PASS** | ✅ Devuelve viewport a grilla |

---

## Top/marca {#top-marca}

**Control:** botones **80 · 200 · 500 · 1000** en CABECERA expandida  
**State:** `limit: DepositoLimit` en page · default **80**

| Campo | Valor |
|-------|-------|
| **Regla crítica** | Limita número de **cajas (moléculas)** · **NO** trunca gradas dentro de cada caja |
| **SQL** | `LIMIT` sobre subquery agrupada por L+R+material+color · grada JOIN posterior |
| **Diag** | `tablet-bazzar/scripts/diag-grada-truncada-2900.mjs` → 0 truncadas |
| **PASS** | ✅ TOP 80 default · gradas íntegras FER-N 2900 |

**Optimización futura:** infinite scroll en lugar de TOP fijo · indicador «+N cajas ocultas» con CTA subir TOP.

Doc técnico: [CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md](./CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md)

---

## Stock grilla {#stock-grilla}

**Archivos:** `GrillaCajasDeposito.tsx` · `TablaGradaDeposito.tsx` · `DepositoCajaFullscreen.tsx`

### Grilla cajas

| Campo | Valor |
|-------|-------|
| **Agrupación** | `agruparProductosPorCaja(productos)` · clave molécula |
| **Celda** | Foto thumb · badge tienda · tabla grada debajo |
| **Grada** | Todas tallas N° · qty · ⭐ vidriera activa |
| **PASS** | ✅ Scroll fluido CABECERA cerrada |

**Optimización futura:** lazy-load imágenes IntersectionObserver · prefetch `/live` al hover.

### Tap foto → fullscreen

| Campo | Valor |
|-------|-------|
| **Lógica** | `setFullscreenKey` → `DepositoCajaFullscreen` · 4 áreas burbuja · stock red |
| **API** | `/api/live` cross-tienda |
| **PASS** | ✅ Fullscreen operativo piso |

**Optimización futura:** gesto swipe entre cajas adyacentes en fullscreen.

---

## Alertas {#alertas}

**Archivo:** `TabAlertasDeposito.tsx` · `lib/depositos/vidriera-estrellas.ts`

| Campo | Valor |
|-------|-------|
| **Entrada** | Mismos `productos` cargados en page (post-filtro si venía de Stock) |
| **Lista** | Moléculas con regla vidriera pendiente |
| **Acción piso** | Jefa salón repone ⭐ en vidriera física |
| **PASS** | ✅ Tab naranja + contador toolbar |

**Optimización futura:** push notification tablet cuando nueva alerta post-sync CSV.

Doc: [CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md](./CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md)

---

## Estadísticas {#estadisticas}

**Archivo:** `DepositoEstadisticasPanel.tsx`

### Toggle Pares / Precio Gs

| Campo | Valor |
|-------|-------|
| **Lógica** | `modoValor: "pares" \| "precio"` · recalcula slices client-side |
| **KPIs** | Pares vista · total depósito · cajas sin LPN |
| **Gráficos** | Donut/bars tienda·marcas · estilo·marca · tonos · drill |
| **PASS** | ✅ Vista filtrada coherente con CABECERA |

**Optimización futura:** módulos numerados 01–06 como Report Artículos · `ParallelGradaBarChart` en tablet.

---

## Optimización futura {#optimizacion-futura}

### Roadmap consolidado (post-cierre etapa)

| Prioridad | Ítem | Beneficio | Depende |
|-----------|------|-----------|---------|
| **P0** | Panel Control Report hub | Mando gerencial 6 tiendas | [CHUSAR_PANEL_CONTROL_BAZZAR.md](../2.3_report/depositos/CHUSAR_PANEL_CONTROL_BAZZAR.md) |
| **P1** | Paridad Estadísticas 01–06 Report | Misma lectura admin/piso | Report Artículos deploy |
| **P1** | sessionStorage filtros depósito | UX re-entrada rápida | — |
| **P2** | Virtualización grilla TOP 1000 | Performance scroll | react-window |
| **P2** | API alertas vidriera SQL | Menos CPU cliente | backend |
| **P3** | Bottom sheet selector tienda | UX Android nativo | UI |
| **P3** | Swipe fullscreen cajas | Velocidad consulta piso | gestos |

### Fuera de alcance tablet depósito

- Edición stock (solo Report sync CSV)
- Precios venta (cadena POS)
- Pilares admin (Report `/pilares`)

---

## Navegador :3004 — subcuentas botón

| Código | Slug | Sección |
|--------|------|---------|
| 2.4.3.10.1 | `btn-toolbar-deposito` | toolbar |
| 2.4.3.10.2 | `btn-cabecera-filtros` | cabecera |
| 2.4.3.10.3 | `btn-top-marca-limit` | top-marca |
| 2.4.3.10.4 | `btn-stock-grilla` | stock-grilla |
| 2.4.3.10.5 | `btn-alertas-vidriera` | alertas |
| 2.4.3.10.6 | `btn-estadisticas` | estadisticas |
| 2.4.3.10.7 | `plan-optimizacion-deposito` | optimizacion-futura |

**Integrado:** Documentación Chusar · Cierra etapa **2026-07-03** · Director orden máximo nivel.
