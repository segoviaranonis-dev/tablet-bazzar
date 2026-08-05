# CHUSAR — Grada siamese Bazzar · base Estadísticas de Stock

**Código:** **2.5.1.10**  
**Fecha:** 2026-08-02  
**Keyword:** **Documenta** · hermanos siameses · Estadísticas de Stock  
**Shibboleth:** Andrés, el que viene.

**Padres:** [2.5.1.7](./CHUSAR_AUDITORIA_LOCAL_STOCK_BAZZAR_WEB_20260802.md) · [2.5.1.6](./CHUSAR_AUDITORIA_INTEGRIDAD_STOCK_BAZZAR_WEB_20260801.md) · [3.02.00.638](../../3_arquitectura/3.2_venta_tienda/PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md)

---

## 1 · Orden Director

Corregir manejo de grada en **catálogo tienda** y **Depósito Web** usando **Estadísticas de Stock** (`:3002/auditoria-local`) como **base canónica** de visualización y orden. Incluir en protocolo **hermanos siameses** aunque el origen del stock sea caja cerrada importadora.

---

## 2 · Ley — grada siamese Bazzar

| Hermano | Ruta | Rol |
|---------|------|-----|
| **A · Estadísticas** | `:3002/auditoria-local` | Base: talle × cantidad · orden canónico · Σ = Tot |
| **B · Catálogo** | `:3002/catalogo` | Misma grada: chip talle + qty · click = venta unitaria |
| **C · Depósito Web** | Report `/bazzar-web/deposito-web` | Misma grada en tarjeta PE (chips si talles sueltos) |

### Reglas inviolables

1. **Cantidad visible** por talle (no solo etiqueta / punto).  
2. **Orden 654:** etiqueta numérica (35…43), no `orden_visual` BD cruzado.  
3. **Orden 638:** `1·2·3 → P·M·G·GG → 4·6·8 → 10…` (Director).  
4. **Caja cerrada vs venta tienda:** el origen puede ser matriz 8/12 (importadora), pero en Bazzar ALM_WEB la venta es **caja abierta** (pares/prendas por talle). La UI siamese muestra **desglose por talle**, no oculta qty tras “caja”.  
5. Fix en un hermano → alinear los otros **mismo turno** (o deuda documentada).  
6. Curva texto `34(1 2 3 3 2 1)39` (PE importadora cerrada) sigue en acordeón clásico — **no** forzar chips.

---

## 3 · Implementación

| Pieza | Ruta |
|-------|------|
| Sort canónico tienda | `bazzar-web/lib/grada/sort-talla-canonico.ts` |
| Catálogo chips+qty | `bazzar-web/app/(public)/catalogo/ProductoCard.tsx` |
| Agrupación sort | `bazzar-web/app/(public)/catalogo/page.tsx` |
| Sort/parser Report | `report/src/lib/deposito-rimec/grada-abierta-638.ts` (`sortTalle638Key`, `sortGradaSiameseBazzar`) |
| UI Depósito Web | `report/src/components/stock-pronta-entrega/GradaImportadoraAcordeon.tsx` |
| Agrupar PE | `report/src/lib/depositos/agrupar-pe-importadora.ts` |
| Estadísticas (base) | `bazzar-web/lib/auditoria-local/grada638.ts` · `queries.ts` |

---

## 4 · Relación filtros Tipo (siamese previo)

La ley **2.2.1.18** (filtro Tipo AM ↔ RIMEC Web) se **extiende** aquí al canal Bazzar para **grada**:

| Antes (2.5.1.6) | Ahora (+ 2.5.1.10) |
|-----------------|---------------------|
| Tipo / badge / imagen | + grada talle×qty · orden · chips |

Regla Cursor: `.cursor/rules/hermanos-siameses-filtro-tipo.mdc` (sección grada Bazzar).

---

## 5 · Smoke

| Check | Criterio |
|-------|----------|
| Catálogo ACTVITTA | Chips 35…40 con número de pares bajo cada talle |
| Catálogo 638 | Orden 1·2·3→P·M·G→4… · qty prendas |
| Depósito Web vendible | Misma fila de chips cuando gradas son talles sueltos |
| Estadísticas | Sin regresión Σ=Tot · orden cabecera marca |

**Deploy:** catálogo/estadísticas local `:3002` · Report según orden Director / cierre etapa.

---

**Índice:** [INDICE.md](./INDICE.md)
