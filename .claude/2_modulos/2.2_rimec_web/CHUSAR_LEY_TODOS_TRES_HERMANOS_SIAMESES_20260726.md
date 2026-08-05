# CHUSAR — Ley TODOS · Tres hermanos siameses · Construcción de grillas

**Código:** **2.2.1.28** · cruza **2.2.1.25** · **2.2.1.27** · **2.3.1.10.1.3** · **3.2.00.002** (Grilla Rimec)  
**Fecha:** 2026-07-26  
**Keyword:** Documenta · Fija ley TODOS  
**Shibboleth:** Andrés, el que viene.  
**Estado:** 🟢 **LEY VIGENTE** — tres hermanos + AM alineados · audit **100%**

---

## 1 · Ley (texto Director — obligatoria)

> **RIMEC Web (entrada canónica 2026-07-27 · 2.2.1.31):**  
> Home = **`origen_tipo=TODOS` + `ramo_tipo=CALZADO`** — fusión CP+PE en Calzado.  
> **Prohibido** arrancar en Confecciones o con `ramo=""`.

> **Universo sin ramo (hermanos Report/AM · checklist grillas nuevas):**  
> En superficies que aún usan TODOS sin categoría, `origen_tipo=TODOS` **no** fuerza Calzado solo para ocultar carteras — ver §1.1.  
> **`ramo_tipo=CALZADO`** en Web = home + exclusión carteras por defecto (chip Carteras vía tipo_v2).

### 1.0 · Enmienda Web home (2.2.1.31)

| Regla | Detalle |
|-------|---------|
| Entrada `/` | `TODOS` + `CALZADO` |
| Toggle Categoría | No vaciar ramo → universo mixto |
| Doc | [CHUSAR_HOME_CALZADO_TODOS_OVERLAY_ORDEN_20260727.md](./CHUSAR_HOME_CALZADO_TODOS_OVERLAY_ORDEN_20260727.md) |

### 1.1 · Corolarios

| Regla | Detalle |
|-------|---------|
| **Exclusión carteras** | Solo aplica con `ramo_tipo=CALZADO` **y** sin chip Tipo «Carteras» — función `calzadoExcluyeCarterasPorDefecto` |
| **Paginación TODOS** | Si el lote SQL se corta a mitad de página, la siguiente página **re-procesa el mismo lote** con `exclude` (cliente POST) — no perder tarjetas al final del orden |
| **Meta RPC CP** | En TODOS+Calzado, meta CP filtra calzado operativo |
| **Hermano canónico** | Stock PE `:3000/stock-pronta-entrega` — modelo de filtros para Web y AM |
| **Orden grilla Web** | Ascendente **L+R+M+C** (`compareLineaRefMatColor`) |

### 1.2 · Prohibido (violación)

- Default Web TODOS → Confecciones o `ramo=""` (mezcla prendas en home).
- Ocultar carteras en Calzado sin chip Tipo — usar `calzadoExcluyeCarterasPorDefecto`.
- Paginar TODOS sin mecanismo `exclude` cuando el batch mezcla ramos en un solo lote SQL.

---

## 2 · Aplicación por hermano

| Hermano | Superficie | Estado inicial filtros | Motor universo |
|---------|------------|------------------------|----------------|
| **1** | Report `/stock-pronta-entrega` | `EMPTY_OPERATIVA_FILTERS` · `ramoTipo=""` | `operativa-filters.ts` · `calzadoExcluyeCarterasPorDefecto` solo si ramo=CALZADO |
| **2** | Paridad TS Report↔Web | Misma firma `calzadoExcluyeCarterasPorDefecto` | `filtro-tipo-canonico.ts` ambos repos |
| **3** | RIMEC Web `:3001` | **`TODOS` + `CALZADO`** (2.2.1.31) | `page.tsx` · `catalogoPaginado.ts` · `catalogoFilters.ts` |
| **+AM** | `/herramienta-reposicion` | `REPOSICION_FILTROS_INICIAL = EMPTY_OPERATIVA_FILTERS` | `tipo-grupos-hibrido.ts` · sidebar `variant="am"` |

---

## 3 · Construcción de grillas (protocolo Chusar)

Toda **grilla browse** del holding que mezcle CP + PE (o use pill **Todos**) debe obedecer esta ley antes de merge UI.

### 3.1 · Checklist OT grilla nueva

| # | Paso | Criterio PASS |
|---|------|---------------|
| 1 | **Estado vacío** | Filtros iniciales sin `ramo_tipo` / `tipoV2Ids` forzados salvo módulo mono-ramo (ej. solo PE) |
| 2 | **SQL / RPC** | `origen_tipo=TODOS` no inyecta `p_ramo_tipo=CALZADO` en meta ni en vista principal |
| 3 | **Memoria client** | `applyMemoryFilters` / `applyOperativaFilters` — exclusión accesorios solo vía `calzadoExcluyeCarterasPorDefecto` |
| 4 | **Paginación** | Batch TODOS con `exclude` en scroll · re-procesar lote incompleto |
| 5 | **Sidebar** | Pill categoría Calzado → set `ramo_tipo=CALZADO` · pill Todos → clear ramo |
| 6 | **Coteo** | Script audit con marca conocida (VIZZANO `marca_ids=2`) — carteras > 0 en TODOS sin ramo |
| 7 | **Paridad** | Si existe espejo Web/Report → `siamese_paridad_pe_report_web.mts --run-audit` |

### 3.2 · Estándar holding Grilla Rimec

Integrado en [GRILLA_RIMEC.md](../../3_arquitectura/3.2_venta_tienda/GRILLA_RIMEC.md) (`3.2.00.002`) § Ley TODOS.  
Implementación referencia: [CHUSAR_GRILLA_RIMEC.md](./CHUSAR_GRILLA_RIMEC.md) (`2.2.1.11`).

### 3.3 · Flujo cabecera · pill Todos (Web · 2.2.1.31)

```
Usuario entra / catálogo
    → origen_tipo=TODOS · ramo_tipo=CALZADO     ← HOME
Usuario elige 👕 Confecciones
    → ramo_tipo=CONFECCIONES
Usuario vuelve / apaga Confecciones
    → ramo_tipo=CALZADO (nunca ramo vacío)
Usuario elige Pronta entrega
    → origen_tipo=PRONTA_ENTREGA · ramo_tipo=CALZADO
Usuario elige Todos (desde CP/PE)
    → origen_tipo=TODOS · ramo_tipo=CALZADO · fusión CP+PE
```

---

## 4 · Evidencia coteo VIZZANO (2026-07-26)

Filtro: `marca_ids=2` · solo VIZZANO

| Métrica | Antes (CALZADO forzado) | Ley TODOS (sin ramo) |
|---------|-------------------------|----------------------|
| Total tarjetas | 615 | **694** |
| Compra previa | 56 | 56 |
| Pronta entrega | 559 | 638 |
| Carteras | 0 | **69** |
| Anteojos | 0 | 0 (sin stock VIZZANO) |

**Overlap carteras:** 69/69 vs grilla ACCESORIOS sin filtro ramo.

URL smoke: `http://localhost:3001/?origen_tipo=TODOS&marca_ids=2`

Script: `rimec-web/scripts/_audit_marca_vizzano_coteo.mjs`

---

## 5 · Archivos canónicos

### RIMEC Web (`:3001`)

| Archivo | Rol |
|---------|-----|
| `app/page.tsx` | SSR default TODOS sin ramo |
| `app/components/CatalogoFiltrosSidebar.tsx` | Pills origen/categoría |
| `app/components/FiltrosCatalogo.tsx` | Cabecera filtros |
| `lib/catalogoPeWarmCache.ts` | `TODOS_DEFAULT_FILTERS` |
| `lib/catalogoServerCache.ts` | Warm sin CALZADO forzado |
| `lib/catalogoPaginado.ts` | Batch TODOS + exclude + memoria |
| `lib/catalogoFilters.ts` | `calzadoExcluyeCarterasPorDefecto` |

### Report PE + AM (`:3000`)

| Archivo | Rol |
|---------|-----|
| `src/lib/filtros/filtro-tipo-canonico.ts` | `calzadoExcluyeCarterasPorDefecto` |
| `src/lib/depositos/operativa-filters.ts` | Filtro memoria Hermano 1 + AM |
| `src/lib/filtros/tipo-grupos-hibrido.ts` | Tipo PE diccionario + CP biblioteca en AM |
| `src/components/stock-pronta-entrega/StockPeContext.tsx` | `EMPTY_OPERATIVA_FILTERS` |
| `src/components/herramienta-reposicion/HerramientaReposicionClient.tsx` | `REPOSICION_FILTROS_INICIAL` |
| `src/components/herramienta-reposicion/ReposicionFiltrosSidebar.tsx` | `variant="pe"|"am"` |

---

## 6 · Veredicto tres hermanos (post-ley)

| Hermano | Resultado | Evidencia |
|---------|-----------|-----------|
| **1 · Report PE** | ✅ **100%** | Audit **99/99** |
| **2 · Paridad lógica** | ✅ **100%** | **6/6** módulos · **6/6** vectores · manifest **100%** |
| **3 · Web runtime** | ✅ **100%** | VIZZANO 694 · smokes multiselect + MEDIAS + latidos PASS |
| **+AM** | ✅ **100%** | Sidebar diccionario · filtro híbrido · smoke `_smoke_am_tipo_siames.mjs` |

Comando canónico:

```powershell
cd report
npx tsx scripts/siamese_paridad_pe_report_web.mts --run-audit
cd ..\rimec-web
node scripts/_audit_marca_vizzano_coteo.mjs
```

---

## 7 · Deuda conocida (no bloquea ley)

- Pill sidebar **«Carteras y accesorios»** mal ubicada en Web y Stock PE cuando el universo es Calzado — fix UI posterior.

---

## Relacionados

- [CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md](./CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md) (**2.2.1.25**)
- [CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md](./CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md) (**2.2.1.27**)
- [CHUSAR_FILTROS_PE_SIAMESE_REPORT_WEB.md](../2.3_report/deposito_rimec/CHUSAR_FILTROS_PE_SIAMESE_REPORT_WEB.md) (**2.3.1.10.1.3**)
- [CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md](./CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md) (**2.2.1.24** · contexto histórico)
- [GRILLA_RIMEC.md](../../3_arquitectura/3.2_venta_tienda/GRILLA_RIMEC.md) (**3.2.00.002**)
- Error índice: `4.01.04.003` (Mario Bros calzado/carteras)

**Shibboleth:** Andrés, el que viene.
