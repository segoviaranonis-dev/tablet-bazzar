# Auditoría latencia catálogo RIMEC Web + plan de implementación

**Código:** `2.2.1.0.5`  
**Etapa:** `DIA-OPERATIVO-20260713` · Track 3 (RIMEC Web)  
**App:** `rimec-web/` · `:3001` · prod `https://rimec-web.vercel.app`  
**Autoridad:** Director · **Documenta** 2026-07-13  
**Riesgo global:** 🔴 ALTO — cambios en vistas BD + paginación pueden romper CP, PE, Todos, carrito y filtros si no se verifican por fase.

---

## 1 · Resumen ejecutivo

El catálogo funciona pero **escanea ~12k filas PE en memoria** por pill, por página y por warm cache. La auditoría prioriza mover filtros, meta sidebar y paginación a **BD (vistas / MV / RPC)** y eliminar **N+1 enrich** en Node.

**Regla de oro post-cambios:** nada debe empeorar latencia ni romper unidades de venta (caja cerrada / grada), imágenes, fusión Todos ni VALIDAR carrito.

**Orden sugerido (BD primero, app después):**

```
(0) Grada PE — HECHO · ver §2
(4) Columnas enrich en vista
(1) MV / RPC meta filtros
(2) Filtros SQL (género, tono, ramo, búsqueda)
(3) Vista unificada Todos o RPC paginada
(5) Cache servidor warm TTL
(6–12) Media · (13–15) Baja
```

---

## 2 · Ítem 0 — Grada Pronta Entrega (✅ HECHO · verificar siempre)

### Problema

- UI mostraba grada en CP vía `grades_json` pero **PE tenía `grades_json` null al 100%**.
- Dato real en BD: **`pedido_proveedor_detalle.grada`** texto (`34(1 2 3 3 2 1)39`) — ~12.106 / 12.109 filas STOCK.
- Vista `v_stock_pe_rimec` (MIG-149) no exponía `grada`.

### Fix aplicado (2026-07-13)

| Capa | Cambio |
|------|--------|
| **BD** | **MIG-150** `report/migrations/150_v_stock_pe_rimec_grada_texto.sql` — columna `grada` al final de la vista (DROP + CREATE; `CREATE OR REPLACE` no alcanzó) |
| **App** | `rimec-web/lib/gradasFmt.ts` — `gradasFmtFromRow()` · CP=`grades_json` · PE=`grada` texto |
| **App** | `agruparTarjetasCatalogo.ts` · `prontaEntregaVenta.ts` (`sumGradaPares`) · `disponibilidad.ts` · `sesionVenta.ts` |
| **UI** | `CatalogPanelOrigen.tsx` · `CatalogoGrid.tsx` — grada bajo material/color |
| **SELECT** | **`grada` solo en PE** — `CATALOGO_STOCK_SELECT_PE` y `CARRITO_STOCK_SELECT_PE`; **CP sin `grada`** |

### Incidente hotfix (obligatorio recordar)

Pedir `grada` en `CATALOGO_STOCK_SELECT_BASE` rompió **CP y Todos**:

```
column v_stock_rimec.grada does not exist
→ /api/catalogo/tarjetas 500 · :3001 colgado
```

**Regla:** columnas distintas por vista → selects distintos (`catalogoStockSelect(view)`).

### Verificación grada PE (cada deploy)

```bash
# BD
node report/scripts/diag_pe_grada_column.mjs      # stats con_grada ~12106
node report/scripts/verify_pe_grada_vista.mjs     # grada en v_stock_pe_rimec

# App :3001
GET /api/catalogo/tarjetas?origen_tipo=PRONTA_ENTREGA&ramo_tipo=CALZADO&limit=5 → 200
# Visual: tarjeta PE muestra ej. 34(1-2-3-3-2-1)39 bajo material/color
# Carrito: gradas_fmt en línea PE no vacío
```

### Archivos

```
report/migrations/150_v_stock_pe_rimec_grada_texto.sql
report/scripts/run_migration_150.mjs
report/scripts/diag_pe_grada_column.mjs
report/scripts/verify_pe_grada_vista.mjs
rimec-web/lib/gradasFmt.ts
rimec-web/lib/catalogoData.ts          # CP vs PE select
rimec-web/lib/carritoStockEnrich.ts    # CP vs PE select
```

---

## 3 · Auditoría latencia — backlog priorizado

### Prioridad ALTA

| # | Tema | Hoy | BD / app objetivo | Ganancia |
|---|------|-----|-------------------|----------|
| **1** | Meta sidebar `/api/catalogo/filtros` | `fetchCatalogoMetaRows` hasta 13 páginas PE + 2 CP · enrich · pills en memoria | RPC o MV `catalogo_filtros_meta(filtros…)` GROUP BY marca, línea, estilo, tipo, color, quincena, tono, depósito | ~12k filas/pill → 1 query pequeña |
| **2** | `applyMemoryFilters` | Género, tono, buscar, ramo PE, quincena/depósito Todos post-fetch | Columnas vista: `genero_codigo`, `descp_genero`, `color_tono_canon`, `ramo_tipo`, `busqueda_texto` + índice `gin_trgm` / `tsvector` | Paginación deja de escanear 12k para 30 tarjetas |
| **3** | Modo Todos | Doble query CP+PE por lote 80 + fusión SKU en Node | Vista `v_stock_catalogo` UNION o RPC paginada por SKU/tarjeta | Mitad latencia/página · paginación coherente |
| **4** | `enrichCatalogoRows` | 2 queries extra/lote: línea→género + color→tono | Exponer en vistas + ampliar `CATALOGO_STOCK_SELECT_*` | Eliminar N+1 en tarjetas y `/filtros` |
| **5** | Warm cache prefetch | TODOS+PE+CP disparan tarjetas+filtros · PE/Todos 12k · cada 10 min | Endpoint servidor cacheado TTL · MV refresh | Menos carga Supabase frío/sesión |

### Prioridad MEDIA

| # | Tema | Notas |
|---|------|-------|
| **6** | Ramo PE `inferPeRamoTipo` | Filtrar SQL `tipo_v2_id IN (1,2)` — vista ya tiene columna |
| **7** | `cajas_disponibles` / `pares_por_caja` PE MIG-144 | Vista contamina; app usa `cajasDisponiblesDeFila` — corregir expresión BD o columna `cajas_disponibles_web` |
| **8** | Header vs sidebar duplicados | `header-filtros` y `/filtros` escanean aparte → un MV/RPC + cache |
| **9** | Filtros SQL + memoria duplicados | Estilo/tipo/color en SQL y otra vez en `applyMemoryFilters` — confiar en SQL si no es Todos |
| **10** | Paginación por `det_id` | Agrupación/fusión en Node fuerza scans — `card_key` estable en BD |
| **11** | `gradas_fmt` + URLs thumb en app | Precomputar en vista si CPU Node pesa · **PE: usar `grada` (§2)** · CP: `grades_json` |
| **12** | Índices / MV PE | Mantener `idx_pp_pe_catalog`; MV refresh periódico (JOINs LATERAL pesados) |

### Prioridad BAJA

| # | Tema |
|---|------|
| **13** | `sinProntaEntrega` post-fetch CP — redundante si MIG-138 garantiza TRÁNSITO_PP |
| **14** | `/api/catalogo/tonos` — OK con cache HTTP |
| **15** | `buildFiltrosFromTarjetas` sin uso — meta desde payload tarjetas sin re-scan |

### Qué NO mover (ya correcto en BD)

- Vistas separadas CP/PE (MIG-138)
- Estilo/tipo vía `linea_referencia`
- Quincena en `quincena_arribo`
- Filtro `cajas_disponibles > 0` en SQL
- **Grada PE en `ppd.grada` + MIG-150** (§2)

---

## 4 · Mapa código actual (punto de partida)

| Archivo | Rol |
|---------|-----|
| `lib/catalogoData.ts` | `fetchCatalogoMetaRows` · selects CP/PE |
| `lib/catalogoPaginado.ts` | Batch CP+PE · `enrichCatalogoRows` · `applyMemoryFilters` |
| `lib/catalogoFilters.ts` | SQL filters + `applyMemoryFilters` |
| `lib/catalogoEnrich.ts` | N+1 género/tono |
| `lib/fusionTarjetasCatalogo.ts` | Fusión SKU Todos |
| `lib/catalogoPeWarmCache.ts` | Warm dual cache |
| `app/api/catalogo/filtros/route.ts` | Meta sidebar |
| `app/api/catalogo/tarjetas/route.ts` | Grilla paginada |
| `app/api/catalogo/header-filtros/route.ts` | Header duplicado |

---

## 5 · Plan de implementación por fases

### Fase A — Pre-requisitos (sin deploy prod hasta smoke)

1. Backup mental: tag git `rimec-web` pre-cambios BD.
2. Migraciones en `report/migrations/` numeradas secuencialmente.
3. Script `run_migration_NNN.mjs` + verificación SQL.
4. **Nunca** añadir columnas PE-only al SELECT base CP.

### Fase B — (4) Enrich en vista

**BD:** Ampliar `v_stock_rimec` y `v_stock_pe_rimec`:

- `genero_codigo`, `descp_genero`
- `color_tono_canon` (CP puede traer de join existente)

**App:** Quitar o vaciar `enrichCatalogoRows` cuando columnas vengan en SELECT.

**Verificar:** `/filtros` y `/tarjetas` — mismos conteos pills; tono/género en tarjetas; **grada PE intacta (§2)**.

### Fase C — (1) MV meta filtros

**BD:** `CREATE MATERIALIZED VIEW catalogo_filtros_meta AS …` o función `catalogo_filtros_meta(p_filtros jsonb)`.

**App:** `filtros/route.ts` → una query; eliminar 13 páginas PE scan.

**Verificar:** Cambiar pill marca/línea/tono < 2s; pills = mismos valores que antes (snapshot JSON comparación).

### Fase D — (2) Filtros SQL

**BD:** Columnas + índices búsqueda.

**App:** Reducir `applyMemoryFilters` a casos Todos-only o eliminar duplicados.

**Verificar:** Búsqueda texto, género, tono, ramo calzado/confecciones PE/CP/Todos.

### Fase E — (3) Vista unificada Todos

**BD:** `v_stock_catalogo` o RPC `catalogo_tarjetas_page(...)`.

**App:** Simplificar `catalogoPaginado.ts` — un round-trip.

**Verificar:** Fusión SKU · paneles PE arriba CP abajo · pares/grada por origen · sin duplicar tarjetas.

### Fase F — (5) Cache servidor

**App/API:** Route cacheada TTL 5–10 min página 1 Todos+Calzado.

**Verificar:** Segunda carga instantánea; invalidación tras import stock.

---

## 6 · Matriz «no romper» (smoke obligatorio)

Ejecutar **después de cada fase** en `:3001` local; prod solo tras Claude Code + orden Director.

| # | Caso | Esperado |
|---|------|----------|
| 1 | CP solo · calzado · 30 tarjetas | 200 · gradas_fmt desde `grades_json` |
| 2 | PE solo · Vizzano · grada visible | 200 · `34(1-2-3-3-2-1)39` o similar |
| 3 | Todos · fusión mismo SKU | Panel PE + CP · violeta pulse |
| 4 | Filtros sidebar | Pills cargan < timeout · sin 500 |
| 5 | Cambio CP↔PE | Cache warm · filtros compartidos (marca/búsqueda) |
| 6 | Carrito PE +1 caja | 12 pares (grada) · no 1 par |
| 7 | VALIDAR carrito | Sin ITEM_OBSOLETO falso |
| 8 | Imágenes PE 638 Kyly | Stem excel_color |
| 9 | API sin columna fantasma | **No** pedir `grada` en `v_stock_rimec` |
| 10 | `npm run build` | exit 0 |

### Comandos rápidos

```bash
cd rimec-web && npm run build
cd rimec-web && npm run dev:clean    # si :3001 cuelga

# APIs (PowerShell)
Invoke-WebRequest "http://localhost:3001/api/catalogo/tarjetas?origen_tipo=TODOS&ramo_tipo=CALZADO&limit=5" -UseBasicParsing
Invoke-WebRequest "http://localhost:3001/api/catalogo/tarjetas?origen_tipo=PRONTA_ENTREGA&ramo_tipo=CALZADO&limit=5" -UseBasicParsing
Invoke-WebRequest "http://localhost:3001/api/catalogo/filtros?origen_tipo=TODOS&ramo_tipo=CALZADO" -UseBasicParsing
```

---

## 7 · Rollback

| Nivel | Acción |
|-------|--------|
| **App** | Revert commit `rimec-web` · `dev:clean` |
| **Vista PE grada** | Restaurar MIG-149 sin columna `grada` (solo si emergencia; pierde grada UI) |
| **Vista enrich** | `CREATE OR REPLACE` versión anterior desde git migration |
| **MV** | `DROP MATERIALIZED VIEW` · app vuelve a scan legacy |

**No rollback destructivo** en `pedido_proveedor_detalle.grada` — dato fuente es correcto.

---

## 8 · Riesgos explícitos

| Riesgo | Mitigación |
|--------|------------|
| SELECT unificado CP+PE con columnas PE-only | Selects separados por vista (lección §2) |
| `CREATE OR REPLACE VIEW` no agrega columnas | DROP + CREATE o columna solo al final + prueba `pg_attribute` |
| MV stale tras import stock | Refresh job post-import o TTL corto |
| Paginación por tarjeta cambia orden | Snapshot test 30 tarjetas antes/después |
| Todos deja de fusionar | Test SKU conocido CP+PE |
| Grada PE vacía | `verify_pe_grada_vista.mjs` + visual |
| Timeout `/filtros` | Statement timeout Supabase — MV obligatoria fase C |

---

## 9 · Responsables

| Rol | Tarea |
|-----|-------|
| **Claude Code** | Migraciones BD prod · deploy Vercel · refresh MV |
| **Cursor** | App `rimec-web` · smoke local · docs |
| **Director** | Smoke visual · orden **Despliega** · import stock Track 1 |

---

## 10 · Documentos relacionados

- [CHUSAR_AUDITORIA_PRE_PROD_20260713.md](./CHUSAR_AUDITORIA_PRE_PROD_20260713.md) — checklist pre-deploy
- [CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md](./CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md) — grilla Todos
- [DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md](./DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md) — unidades PE
- [CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md](./CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md) — warm cache
- [CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md](./CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md) — sessionStorage filtros

---

**Shibboleth:** Andrés, el que viene.
