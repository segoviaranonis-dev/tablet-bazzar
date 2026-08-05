# CHUSAR — Tablet · Depósito · CABECERA DE FILTROS estándar

**Subcuenta:** **2.4.3.6**  
**Padre:** [CHUSAR_TABLET_DEPOSITO_CAJAS.md](./CHUSAR_TABLET_DEPOSITO_CAJAS.md) · **2.4.3.4**  
**Toolbar piso:** [CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md](./CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md) · **2.4.3.7**  
**Grada integridad:** [CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md](./CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md) · **2.4.3.8**  
**Etapa:** [ETAPA_PANEL_CONTROL_CABECERA_TABLET.md](../../4_etapas/ETAPA_PANEL_CONTROL_CABECERA_TABLET.md)  
**Estándar:** [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)  
**Paridad Report:** [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](../2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_DEPOSITO.md)  
**Estado:** ✅ **PASS piso 2026-07-03** · manual [CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md](./CHUSAR_MANUAL_OPERACIONES_TABLET_DEPOSITO.md)

---

## Qué es

Ruta **`/deposito`** — consulta stock en piso con fotos y grilla **cajas** (molécula L+R+material+color).  
**No es panel de control gerencial** — herramienta tablet para salón / jefa vidriera.

La **CABECERA DE FILTROS** sigue el estándar holding (misma lógica que Report `TrianguloHeaderDeposito`).  
Desde **2026-06-10** vive **debajo** del [toolbar piso](./CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md) y **arranca cerrada**.

---

## Layout página (2026-06-10)

```
┌─ DepositoToolbar — 1 fila ─────────────────────────────────────────┐
│ ATRÁS │ tabs │ selector tienda │ CABECERA ▾                        │
├─ sub-fila resumen (CABECERA cerrada · tab stock) ──────────────────┤
├─ CABECERA DE FILTROS (solo si expandida) ───────────────────────────┤
│  Género → Marca → Estilo → Tipo 1 → Línea → Buscar → TONO         │
│  Top/marca: 80 · 200 · 500 · 1000                                  │
├─ Main: grilla cajas | alertas | estadísticas ──────────────────────┤
└─ Pie ⭐ vidriera (tab stock) ──────────────────────────────────────┘
```

Doc toolbar completo: [CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md](./CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md)

---

## Elementos CABECERA (orden obligatorio)

| # | Fila UI | Modo tablet | SQL / FK |
|---|---------|-------------|----------|
| 1 | Género | Chip single FK | `genero_id` |
| 2 | Marca | Chip single FK | `marca_id` |
| 3 | Estilo | Chip single FK | `grupo_estilo_id` |
| 4 | Tipo 1 | Chips multi FK | `tipo_1_id` |
| 5 | Línea | Dropdown multi | `linea_id` |
| 6 | Buscar | Texto ILIKE | `q` |
| 7 | **TONO** | Círculos + Sin asignar | `col.tono_canon->>'etiqueta'` |

**Retirado del estándar (legacy):** dropdown Color por nombre · paleta hex — migrado a **TONO** (2026-06-10).

**Sin en tablet depósito:** Categoría tipo_v2 (solo calzado en universo SQL) · Grada acordeón (Report) · Biblioteca caso.

---

## Código

| Pieza | Ruta |
|-------|------|
| Página | `tablet-bazzar/app/deposito/page.tsx` |
| Toolbar piso | `components/deposito/DepositoToolbar.tsx` |
| **CABECERA DE FILTROS** | `components/deposito/DepositoFiltrosHeader.tsx` |
| Estadísticas tab | `components/deposito/DepositoEstadisticasPanel.tsx` |
| Estado filtros | `lib/deposito-filters.ts` → `DepositoFilterState` |
| SQL cascada + grada | `lib/server/deposito-filtros-sql.ts` |
| TONO UI | `components/tono/EditorTono.tsx` → `FiltroTonoRow` |
| API opciones | `GET /api/deposito/{id}/filtros-header` |
| API grid filtrado | `GET /api/deposito/{id}?genero_id=…&tonos=…&limit=80` |
| Grilla cajas | `components/deposito/GrillaCajasDeposito.tsx` |
| Tabla grada | `components/deposito/TablaGradaDeposito.tsx` |
| Vidriera ⭐ | `lib/depositos/vidriera-estrellas.ts` · tab Alertas |

**Prop CABECERA:** `hideCollapsedBar={true}` cuando el toolbar maneja el toggle — evita barra duplicada.

---

## Params URL (FK + TONO)

| Param | Ejemplo |
|-------|---------|
| `genero_id` | `3` |
| `marca_id` | `12` |
| `grupo_estilo_id` | `5` |
| `tipo1_ids` | `1,4,7` |
| `linea_ids` | `1184,4313` |
| `tonos` | `Negro\|Bronce` |
| `sin_tono` | `1` |
| `q` | `vizzano` |
| `limit` | `80` · `200` · `500` · `1000` · `all` |

**Ley TOP/marca:** limita **cajas molécula**, no filas grada — [CHUSAR grada integridad](./CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md).

---

## Diferencias vs Report operativa

| Aspecto | Report | Tablet `/deposito` |
|---------|--------|-------------------|
| Rol | Panel control admin | Consulta piso |
| Header | Triángulo + acordeón | Toolbar 1 fila + CABECERA bajo demanda |
| Categoría tipo_v2 | Visible (calzado lock) | Oculta · SQL solo calzado |
| Grada acordeón | ✅ | Tabla scroll en card |
| Caso biblioteca BCL | ✅ | ❌ |
| Valor inventario KPI | ✅ precio CSV | ❌ (Estadísticas tab = vista filtrada) |
| Colapsar cabecera | Acordeón details | **Cerrada default** · toolbar CABECERA ▾ |
| Selector tienda | URL detalle | `<select>` 6 tiendas |

---

## Smoke piso

1. `http://localhost:3000/deposito` (puerto tablet local)
2. CABECERA **cerrada** al entrar · grilla ocupa viewport
3. **ATRÁS** → panel modos `/`
4. Expandir CABECERA → chip Marca → grilla reduce
5. TONO «Negro» → solo moléculas con `tono_canon` Negro
6. Tab **Estadísticas** · tab **Alertas ⭐**
7. FER-N 2900 · `2831.244` → 10 gradas · scroll horizontal

Checklist completo: [toolbar piso § smoke](./CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md#smoke-piso-checklist-director)

---

**Shibboleth:** Chayanne el mejor · CABECERA DE FILTROS = nombre único · tablet depósito = prueba antes Panel Control
