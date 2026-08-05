# CHUSAR — Hermano 3 · Alejandro Magno · Diccionario PE siamese

**Código Web:** **2.2.1.27** · cruza **2.3.1.34** (AM) · **2.3.1.10.1.3** (Report PE) · **2.2.1.25** (tres hermanos)  
**Fecha:** 2026-07-26  
**Keyword:** Documentación Chusar · Protocolo Alejandro Magno activado  
**Shibboleth:** Andrés, el que viene.  
**Estado:** 🟢 **3/3 + AM cerrado** · ley TODOS [2.2.1.28](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md)

---

## 1 · Norte Director (este turno)

Integrar memoria de lo cerrado en sesión (badges PRO/PROMO/LIQ) y fijar **siguiente objetivo**:

> **Misma ley de filtros TIPO diccionario PE** en las **tres superficies** + **Alejandro Magno** con su **tabla de visión general** alineada.

| Superficie | Ruta | Rol siamese |
|------------|------|-------------|
| **Diccionario PE** (Hermano 1) | `:3000/stock-pronta-entrega` | Canónico operativo · audit **99/99** |
| **RIMEC Web** (Hermano 3) | `:3001` catálogo PE/Todos | UI vendedor · badges + sidebar |
| **Alejandro Magno** | `:3000/herramienta-reposicion` | Grilla fusión PE+CP+PROGRAMADO · **falta diccionario PE** |
| **Visión general AM** | `:3000/rimec?mundo=panel-control` | Tabla tres categorías · operativa + artículos |

**Protocolo Alejandro Magno:** [PROTOCOLO_ALEJANDRO_MAGNO_PUERTA_CHUNA.md](../../1_fundamentos/1.1_protocolos/PROTOCOLO_ALEJANDRO_MAGNO_PUERTA_CHUNA.md) · doc maestro [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../2.3_report/gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md).

---

## 2 · Veredicto tres hermanos (actualizado 2026-07-26)

| Hermano | Superficie | Estado | Notas |
|---------|------------|--------|-------|
| **1** | Report `/stock-pronta-entrega` | ✅ **100%** | `PeTipoDiccionarioMultiSelectGroup` · audit 99/99 |
| **2** | Paridad TS Report↔Web | ✅ **100%** | 6/6 módulos · manifest 100% |
| **3** | RIMEC Web `:3001` runtime | ✅ **100%** | Ley TODOS · smokes PASS |
| **+AM** | `/herramienta-reposicion` | ✅ **100%** | `variant="am"` · `tipo-grupos-hibrido.ts` |

**Ley TODOS:** [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) (**2.2.1.28**)

---

## 3 · Integrado sesión 2026-07-25/26 — Visual grupo uno

### 3.1 · Psicología color · LIQ ≠ PROMO ≠ PRO

| Etiqueta | Origen | Motor precios | Shell latido | Badge |
|----------|--------|---------------|--------------|-------|
| **LIQ** | PE diccionario LIQUIDACION | PE · D1 2% | Oro `catalog-card-casino-oro` | LIQ oro · texto ámbar oscuro |
| **PRO** | PE diccionario PROMOCIONAL | PE · D1 2% | Fucsia `catalog-card-casino-fucsia` | PRO · fucsia claro · **texto oscuro** |
| **PROMO** | CP biblioteca caso | Corazón 1 · LPC03=LPN | Fucsia shell (mismo latido) | PROMO · pill borde grueso · **texto fucsia oscuro** |

**Decisión Director:** liquidación **oro** · promocional **fucsia** · **no mismo color** entre LIQ y promo.

Archivos:

- `rimec-web/lib/catalogoShellLatidos.ts`
- `rimec-web/components/catalog/PeProBadge.tsx` · `PromoCasoBadge.tsx` · `PeLiqBadge.tsx`
- `rimec-web/app/globals.css` · `catalog-pe-pro-badge` · `catalog-cp-promo-badge`
- `report/src/app/globals.css` (paridad Report)
- Lightbox: `CatalogoGrid.tsx` — PRO en PE · PROMO solo CP

Smokes: `npx tsx scripts/_smoke_latidos_promo_siames.mjs` ✅

### 3.2 · Dos corazones · dos etiquetas

| Corazón | Badge | Detección |
|---------|-------|-----------|
| **Biblioteca casos (CP)** | **PROMO** | `descp_caso` = PROMOCIONAL |
| **Diccionario PE (SDRM)** | **PRO** | `es_promo` / cadena / COD.GRUPO d45=02 |

Doc visual: [CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md](./CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md) (**2.2.1.21.G1**) — actualizado este Chusar.

---

## 4 · Alejandro Magno — ✅ integrado 2026-07-26

### 4.1 · Estado AM

| Pieza | Estado |
|-------|--------|
| Sidebar `ReposicionFiltrosSidebar` | ✅ `variant="am"` móvil + desktop |
| Filtro memoria | ✅ `rowMatchesTipoGruposSiamese` en `operativa-filters.ts` |
| Inicio filtros | ✅ `REPOSICION_FILTROS_INICIAL = EMPTY_OPERATIVA_FILTERS` (ley TODOS) |
| Labels TIPO | ✅ MAYÚSCULAS en overlay |
| Smoke | ✅ `report/scripts/_smoke_am_tipo_siames.mjs` |

### 4.2 · Ley aplicada

Ver [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) §2 y §5.

---

## 5 · Tabla visión general Alejandro Magno

Doc madre: [CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md](../2.3_report/gestion_compra/CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md) (**2.3.1.21**).

| `categoria_id` | Entidad | Avance | Filtro TIPO pendiente |
|:--:|---------|--------|------------------------|
| **1** | Stock PE | ~90% | ⏳ diccionario en AM + Panel |
| **2** | CP tránsito | ~60% | ✅ biblioteca caso en AM/Web |
| **3** | Programado | ~10% | N/A (sin catálogo browse) |

**Stack operativo canónico:** BibliotecaCasoBar → PanelControlTrianguloHeader → GrillaPeImportadora.

Pendiente: fila **«Operativa + filtro TIPO PE»** en matriz avance §4 del doc 2.3.1.21.

---

## 6 · Checklist cerrar 3/3 + AM — ✅ PASS 2026-07-26

Ley documentada: **2.2.1.28** · [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md)

### Hermano 3 · Web `:3001`

- [x] Smoke MEDIAS `tipo_ids=4`
- [x] Smoke sintéticos `-1` ACCESORIOS
- [x] `_smoke_multiselect_siames_web.mjs`
- [x] Ley TODOS · VIZZANO 694 tarjetas

### Alejandro Magno · `:3000/herramienta-reposicion`

- [x] `operativa-filters` híbrido PE/CP
- [x] Sidebar `variant="am"`
- [x] Inicio sin CALZADO forzado
- [ ] Visión general Panel Control — dimensión TIPO PE (UI posterior)

### Paridad automática

- [x] `filtro-tipo-pe-diccionario` en `MODULOS_PARIDAD`
- [x] Manifest 100%

Comando:

```powershell
cd report
npx tsx scripts/siamese_paridad_pe_report_web.mts --run-audit
```

---

## Relacionados

- [CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) (**2.2.1.28**)
- [CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md](./CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md) (**2.2.1.25**)
- [CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md](./CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md) (**2.2.1.18** · AM↔Web CP)
- [CHUSAR_FILTROS_PE_SIAMESE_REPORT_WEB.md](../2.3_report/deposito_rimec/CHUSAR_FILTROS_PE_SIAMESE_REPORT_WEB.md) (**2.3.1.10.1.3**)
- [CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md](../2.3_report/gestion_compra/CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md) (**2.3.1.22**)

**Shibboleth:** Andrés, el que viene.
