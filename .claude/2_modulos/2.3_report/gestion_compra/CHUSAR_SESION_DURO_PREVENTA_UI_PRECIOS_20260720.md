# CHUSAR — Sesión 2026-07-20 · Preventa Carlos · UI dato duro · Precios centena

**Código:** **2.3.1.32** · consolidación **2.3.1.31** + **2.3.1.7.1.0.2** + **2.2.1.0.10**  
**Keyword:** Documenta · Director · rigor máximo  
**Shibboleth:** Andrés, el que viene.

**Docs hijos:**

| Código | Tema | Archivo |
|--------|------|---------|
| 2.3.1.31 | Nº preventa Carlos · mapa superficies | [CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md](./CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md) |
| 2.2.1.18 | Hermanos siameses Tipo + cabecera | [CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md](../../2.2_rimec_web/CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md) |
| 2.2.1.0.10 | Acordeón dato duro catálogo | [CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md](../../2.2_rimec_web/CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md) |
| 2.3.1.7.1.0.1 | PROMOCIONAL LPN=LPC03=LPC04 | [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](../motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) |
| 2.3.1.7.1.0.2 | Redondeo centena próxima | [CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md](../motor_precios/CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md) |

---

## 1 · Objetivo Director (turno)

1. Exponer **`pedido_proveedor.nro_pedido_externo`** como **Nº preventa Carlos** en todo el ecosistema junto al **dato duro de llegada** (`quincena_arribo_id` 1–24).
2. **Protocolo Hermanos siameses:** mismo criterio **AM ↔ RIMEC Web** en el **mismo turno**.
3. **UI CP obligatoria:** preventa y quincena en **dos filas distintas**, **colores distintos**, **centradas**, **sin salto de línea** en la quincena.
4. **Aritmética precios:** LPN · LPC03 · LPC04 · excepción PROMOCIONAL + **redondeo centena próxima** (230.048→230.000 · 230.051→230.100).

---

## 2 · Campo BD — definición canónica

| Campo | Significado | Ejemplo UI |
|-------|-------------|------------|
| `numero_registro` | PP interno Nexus | `PP-2026-0012` |
| `numero_proforma` | Proforma fábrica / Excel | `8602/2026` |
| **`nro_pedido_externo`** | **Nº preventa Carlos** (sistema legal Carlos) | **`PP-4099`** |

### Normalización texto (`formatNumeroPreventaCarlos`)

| Entrada BD/UI | Salida canónica |
|---------------|-----------------|
| `4099` | `PP-4099` |
| `4134-4135` | `PP-4134-4135` |
| `PP - 4081` | `PP-4081` |
| vacío | *(no mostrar fila preventa)* |

**Archivos:** `rimec-web/lib/datoDuroCabecera.ts` · `report/src/lib/pedido-proveedor/dato-duro-cabecera.ts`

---

## 3 · Par dato duro CP — formato quincena

| Entrada catálogo | Salida UI |
|------------------|-----------|
| `1ra Q. de Octubre` | `1ra Oct.` |
| `2da Q. de Septiembre` | `2da Sep.` |

- Quitar «Q. de» / «Quincena de» / «de».
- Mes abreviado con punto: Ene. Feb. … Dic.
- **Espacio no separable** entre ordinal y mes: `2da\u00A0Sep.` — **prohibido** partir `2da` / `Sep.` en dos líneas.
- Función: `formatQuincenaCorta()` · `partesDatoDuroCp()` · `parseEtiquetaDatoDuroCp()` (legacy `PP-4099 · 1ra Oct.`).

**Texto plano combinado** (PDF · keys · sort): `etiquetaDatoDuroCp(preventa, quincena)` → `PP-4099 · 1ra Oct.`

---

## 4 · Ley UI — dos filas CP (inviolable · Director 2026-07-20)

**Prohibido** una sola línea `PP-4099 · 1ra Oct.` en acordeón catálogo y pills AM CP.

| Fila | Contenido | Color Tailwind | Tamaño (acordeón center) |
|------|-----------|----------------|--------------------------|
| **1** | `PP-4135` | `text-orange-600` · font-black | 13px |
| **2** | `2da Sep.` | `text-sky-800` · font-bold | 12px |

| Regla | Detalle |
|-------|---------|
| Layout acordeón | `layout="center"` · flex col · items-center · ocupa espacio libre del footer |
| PE | Una sola fila texto (Pronta entrega) — sin preventa/quincena CP |
| `whitespace-nowrap` | Ambas filas CP |
| Badge PROMO | Junto a marca · no reemplaza filas dato duro |

**Componentes:**

| App | Componente | Ruta |
|-----|------------|------|
| RIMEC Web | `DatoDuroCpFilas.tsx` | `rimec-web/components/catalog/` |
| RIMEC Web | `CatalogLotesAcordeon.tsx` | acordeón footer tarjeta |
| Report AM | `DatoDuroCpFilas.tsx` | `report/src/components/herramienta-reposicion/` |
| Report AM | `ReposicionArticuloCard.tsx` · `PillQty` | STOCK / VENTAS CP |

---

## 5 · Implementación código — preventa (estado 2026-07-20)

### 5.1 Alejandro Magno (Report)

| Archivo | Cambio |
|---------|--------|
| `report/src/app/api/depositos/[cliente_id]/route.ts` | Tipo `DepositoRow.numero_preventa` |
| `report/src/lib/stock-transito/queries-productos.ts` | SELECT `pp.nro_pedido_externo` → `numero_preventa` normalizado |
| `report/src/lib/stock-programado/queries-productos.ts` | Idem |
| `report/src/lib/herramienta-reposicion/merge-reposicion.ts` | `ReposicionBucket` + `preventa`/`quincena` · `cpBucketFromRow()` · `etiquetaDatoDuroCp` en label key |
| `report/src/components/herramienta-reposicion/ReposicionArticuloCard.tsx` | `PillQty` recibe partes · `DatoDuroCpFilas` |

**Smoke visual:** línea `1220.315` → fila1 `PP-4099` · fila2 `1ra Oct.` en STOCK CP y acordeón Web mismo turno.

### 5.2 RIMEC Web catálogo

| Archivo | Cambio |
|---------|--------|
| `rimec-web/lib/catalogoEnrich.ts` | `enrichPreventaCatalogoRows` — JOIN `pedido_proveedor` por `pp_id` |
| `rimec-web/lib/catalogoPaginado.ts` | **Siempre** enrich preventa (bug: `loteEnriquecidoDesdeVista` saltaba enrich si había género/tono) |
| `rimec-web/lib/catalogoData.ts` | Meta filtros incluye `pp_id` |
| `rimec-web/lib/agruparTarjetasCatalogo.ts` | `RimecVariante.numero_preventa` |
| `rimec-web/lib/catalogoOrigen.ts` | `origen.label` = `etiquetaDatoDuroCp` |
| `rimec-web/lib/catalogoFilters.ts` | Filtro sidebar **Nº preventa** · `buildPreventasFromRows` |
| `rimec-web/lib/catalogoServerCache.ts` | Warm cache `v5` (invalidar tras cambios UI) |
| `rimec-web/app/estadisticas/` | Chip preventa en árbol Compra previa |

### 5.3 Normalización BD

Script: `report/scripts/normalize_nro_pedido_externo.mjs` — dígitos puros → `PP-NNNN`.  
PP referencia Director: PP-4081 · PP-4082 · **PP-4099** · **PP-4135**.

### 5.4 Pendiente (no cerrado en sesión)

| Ítem | Acción |
|------|--------|
| MIG-169 | `numero_preventa` en `v_stock_rimec` / `v_stock_pe_rimec` (evitar enrich ad-hoc) |
| PDF FI | `fi-pdf-data.ts` cabecera preventa |
| Hub PP · Digitación | chip preventa |
| Label Tab Stock | «Nº preventa Carlos» en `PpTabStock.tsx` |

---

## 6 · Aritmética precios — LPN · LPC03 · LPC04 · PROMO

### 6.1 Tiers (lista sesión cliente)

| ID | Nombre | Regla habitual |
|----|--------|----------------|
| 1 | LPN | Precio base |
| 2 | LPC02 | Columna `lpc02` (caso específico) |
| 3 | LPC03 | **Default** · LPN × 1.12 → centena |
| 4 | LPC04 | LPN × 1.20 → centena |

### 6.2 Excepción PROMOCIONAL (`descp_caso = 'PROMOCIONAL'`)

```
LPN = LPC03 = LPC04   (sin +12% ni +20%)
```

Cliente con política LPC03 **ve y compra** a LPN del promocional. Badge **PROMO** verde en header tarjeta.

Doc: **2.3.1.7.1.0.1** · Código: `rimec-web/lib/precioLista.ts` → `esCasoPromocional` · `resolverLpc03/04`

### 6.3 Redondeo centena próxima (Director 2026-07-20)

**Ley:** todo precio comercial RIMEC → múltiplo de 100 Gs. **más próximo**.

```
precio_gs = ROUND(valor / 100) × 100
```

| Entrada | Salida |
|---------|--------|
| 230.048 | 230.000 |
| 230.051 | 230.100 |

**Pipeline completo (no promo):**

```
lpn   = ROUND((fob_ajustado × indice) / 100) × 100
lpc03 = ROUND((lpn × 1.12) / 100) × 100
lpc04 = ROUND((lpn × 1.20) / 100) × 100
```

**Ejemplo LPN 128.300:**

| Tier | Cálculo bruto | Tras centena |
|------|---------------|--------------|
| LPN | 128.300 | 128.300 |
| LPC03 | 143.696 | **143.700** |
| LPC04 | 153.960 | **154.000** |
| PROMO LPC03 | = LPN | 128.300 |

### 6.4 Archivos precios (siamese runtime)

| Capa | Archivo |
|------|---------|
| Web canon | `rimec-web/lib/redondeoCentenaGs.ts` |
| Web tiers | `rimec-web/lib/precioLista.ts` — `getPrecioActivo` · `getPrecioActivoPe` · `lpcDesdeLpn` |
| Web display | `rimec-web/lib/formatPrecioGs.ts` |
| Web acordeón precio | `rimec-web/lib/precioLoteCatalogo.ts` |
| Report | `report/src/lib/redondeoCentenaGs.ts` |
| Report FI SQL | `report/src/app/aprobaciones/lib/fi-precio-evento-lookup.ts` — ROUND (no FLOOR) |
| Motor Python | `control_central/modules/rimec_engine/logic.py` — `redondeo_centena_proxima` |
| Smoke | `rimec-web/scripts/smoke_ley_precios.ts` |

**Obsoleto:** `FLOOR(x/100)*100` en runtime nuevo · `Math.round(lpn×factor)` sin centena.

**Legacy BD:** migraciones 055/145 pueden tener FLOOR en backfill; recalcular evento alinea con ROUND.

---

## 7 · Hermanos siameses — checklist turno

Cuando se toca **preventa · quincena · precio CP**:

- [ ] AM `merge-reposicion` + `PillQty` / `DatoDuroCpFilas`
- [ ] Web `CatalogLotesAcordeon` + `DatoDuroCpFilas`
- [ ] `datoDuroCabecera.ts` (Web) = `dato-duro-cabecera.ts` (Report)
- [ ] `precioLista.ts` + smoke `smoke_ley_precios.ts`
- [ ] Cache warm Web bump versión (`catalogo-tarjetas-warm-v*`)
- [ ] Ctrl+Shift+R `:3000/herramienta-reposicion` + `:3001`

**Prohibido:** fix solo Web o solo AM sin deuda documentada.

---

## 8 · Servidores · verificación

| App | Puerto | Ruta smoke |
|-----|--------|------------|
| Report AM | `:3000` | `/herramienta-reposicion` |
| RIMEC Web | `:3001` | `/` catálogo CP |
| Estadísticas Web | `:3001` | `/estadisticas` |

```bash
cd rimec-web && npx tsx scripts/smoke_ley_precios.ts
cd rimec-web && npx tsc --noEmit
cd report && npx tsc --noEmit
```

---

## 9 · Índices actualizados (Documenta 2026-07-20)

- `2.3_report/gestion_compra/INDICE.md` — **2.3.1.32**
- `2.3_report/motor_precios/INDICE.md` — **2.3.1.7.1.0.2**
- `2.2_rimec_web/INDICE.md` — redondeo + acordeón
- `2.3.1.31` checklist parcialmente ✅ (ver §5.4)

---

## 10 · Respuesta visual al aplicar filtros — protocolo siamés

**Orden Director 2026-07-20:** la latencia aproximada de 2 segundos no puede
parecer una acción sin respuesta. Toda selección de filtro en **RIMEC Web** y
**Alejandro Magno** debe emitir la misma confirmación visual inmediata:

```
3 → 2 → 1 → Aplicando filtro… · [dimensión]
```

### Ley UX

| Regla | Implementación |
|-------|----------------|
| Inicio | Inmediato al seleccionar, limpiar o cambiar un filtro |
| Secuencia | `3`, `2`, `1` a 260 ms por paso; luego `Aplicando filtro…` |
| Duración | 2.100 ms total, cubre la latencia normal del catálogo |
| Nombre | Expone dimensión: Tipo, Marca, Estilo, Línea, Material, Color, Tono, etc. |
| Multiselección | **No bloquea** interacción (`pointer-events-none`) |
| Accesibilidad | `role=status` + `aria-live=polite` |
| Reinicio | Cada nueva selección reinicia la secuencia con el filtro más reciente |

### Mapa de código siamés

| App | Controlador | Overlay |
|-----|-------------|---------|
| RIMEC Web | `rimec-web/app/CatalogoClient.tsx` · `etiquetaCambioFiltro` + `updateFilters` | `rimec-web/components/catalog/FiltroAplicandoOverlay.tsx` |
| Report AM | `report/src/components/herramienta-reposicion/HerramientaReposicionClient.tsx` · `etiquetaCambioFiltro` + `aplicarFiltros` | `report/src/components/herramienta-reposicion/FiltroAplicandoOverlay.tsx` |

**Cobertura común:** Categoría · AB-CR · Marca · Tipo · Género · Estilo · Línea ·
Material · Color · Tono. Web suma Stock/origen, Depósito, Quincena y Preventa;
AM suma Grada, Cantidad y Cadena.

**Verificación local:** `npm run build` ✅ en `rimec-web/` y `report/`.
**Estado:** código local · **sin commit ni deploy** en este turno.

**Prohibido:** incorporar esta respuesta en una sola grilla o reemplazarla por
un bloqueo que impida marcar varios filtros consecutivos.

---

**Última actualización:** 2026-07-20 · Documentación Chusar · respuesta visual filtros siameses
