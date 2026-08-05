# CHUSAR — Grilla Rimec · implementación catálogo RIMEC Web

**Código:** **2.2.1.11**  
**Clave Director:** **Grilla Rimec**  
**Estándar holding:** [GRILLA_RIMEC.md](../../3_arquitectura/3.2_venta_tienda/GRILLA_RIMEC.md) (`3.2.00.002`)  
**App:** `rimec-web/` · `:3001` · prod `https://rimec-web.vercel.app`  
**Deploy referencia:** `96870f3` (2026-07-14)  
**Shibboleth:** Andrés, el que viene.

---

## Qué es

Implementación **de referencia** del estándar **Grilla Rimec** en el catálogo mayorista. Incluye cabecera, grilla, agrupaciones, dato duro y herramientas de extensión.

---

## Mapa de componentes

| Capa | Archivo | Rol |
|------|---------|-----|
| Orquestación | `app/CatalogoClient.tsx` | `CatalogAcordeonProvider` · warm cache · filtros |
| **CABECERA DE FILTROS** | `app/components/FiltrosCatalogo.tsx` | Panel blanco · pie: `CatalogExtenderDatosToggle` |
| Grilla + tarjetas | `app/CatalogoGrid.tsx` | `TarjetaProducto` · `TarjetaProductoFusion` |
| Layout grilla | `components/catalog/CatalogGrillaDeposito.tsx` | Stats modelos/pares · flex wrap |
| Tarjeta shell | `components/catalog/CatalogTarjetaDeposito.tsx` | Imagen NIIF · footer slot |
| Acordeón contexto | `components/catalog/CatalogAcordeonContext.tsx` | Provider · toggle · `collectLoteKeysFromGrilla` |
| Acordeón lotes | `components/catalog/CatalogLotesAcordeon.tsx` | Colapsado minimal · expandir de a uno |
| Panel venta | `components/catalog/CatalogPanelOrigen.tsx` | Detalle expandido · carrito |
| Agrupación | `lib/agruparTarjetasCatalogo.ts` | `cardKey` por origen |
| Fusión Todos | `lib/fusionTarjetasCatalogo.ts` | SKU único · lotes apilados |
| Origen / shell | `lib/catalogoOrigen.ts` | Paleta quincena · dato duro FK |
| Cabecera doc | [CHUSAR_CATALOGO_CABECERA_FILTROS.md](./CHUSAR_CATALOGO_CABECERA_FILTROS.md) | Filtros detalle |
| Acordeón doc | [CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md](./CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md) | Dato duro |

---

## Flujo datos → UI

```
v_stock_rimec | v_stock_pe_rimec
    → catalogoPaginado / agruparTarjetasCatalogo
    → fusionarTarjetasPorSku (pill Todos)
    → TarjetaGrilla[]
    → collectLoteKeysFromGrilla → Provider
    → CatalogLotesAcordeon (1+ lotes por tarjeta)
```

---

## Comportamiento UX sellado

| Elemento | Regla |
|----------|-------|
| Colapsado | Solo `quincena_desc` (texto completo) + badge **pares** naranja |
| Expandido | Material · color · grada · tonos · Activar venta / ± cajas |
| CP vs PE | Mismo acordeón · borde izq azul CP / verde PE |
| Toggle global | Pie cabecera · «Extender todos los datos» ↔ «Compactar lotes» |
| Tarjeta única lote | Mismo acordeón (1 fila) — sin excepción CP/PE |
| **Ley TODOS** | Entrada `origen_tipo=TODOS` **sin** `ramo_tipo` · ver [2.2.1.28](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md) |

---

## Réplica en otro módulo (parametrizar)

1. Copiar **contrato** [GRILLA_RIMEC.md](../../3_arquitectura/3.2_venta_tienda/GRILLA_RIMEC.md) § Parametrización.
2. Implementar mapper `row → lote.cardKey + quincena_desc + variantes`.
3. Montar CABECERA DE FILTROS del universo local.
4. Extraer o importar `CatalogAcordeonContext` + `CatalogLotesAcordeon` (ideal: paquete compartido `holding-ui/` futuro OT).
5. Smoke: colapsado legible · toggle cabecera · expandir 1 lote · CP y PE.

**Report Panel CP:** alinear `GrillaPeImportadora` + `PeCardMiniatura` → acordeón dato duro (hoy `expandAll` booleano en tarjeta — migrar a patrón Grilla Rimec).

---

## Smoke

```bash
cd rimec-web
npm run build
node scripts/smoke_catalogo_local.mjs
```

Visual: `:3001` · Todos · MOLEKINHA · toggle cabecera · 2 quincenas colapsadas.

---

## Índice

- [INDICE.md](./INDICE.md) · [GRILLA_RIMEC holding](../../3_arquitectura/3.2_venta_tienda/GRILLA_RIMEC.md)
- [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)
