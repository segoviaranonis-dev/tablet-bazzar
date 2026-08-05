# Auditoría pre-producción RIMEC Web — 2026-07-13

**Etapa:** `DIA-OPERATIVO-20260713` · Track 3  
**Alcance:** CP + PE · carrito · filtros · cache dual  
**Verificación Cursor:** build local + checklist código

---

## Resumen ejecutivo

| Área | Estado | Notas |
|------|--------|-------|
| PE cajas cerradas (12 pares) | ✅ FIX | `prontaEntregaVenta.ts` · paridad CP |
| Dual cache CP↔PE ≥30 tarjetas | ✅ FIX | `catalogoPeWarmCache.ts` |
| Filtros compartidos CP↔PE | ✅ FIX | `catalogoFiltrosCompartidos.ts` |
| VALIDAR carrito post-stock | ✅ FIX | mensajes + quitar sin stock |
| Build `npm run build` | ✅ PASS | 2026-07-13 · exit 0 |
| Deploy Vercel prod | ⏸️ | **Solo Claude Code** + orden **Despliega** |

---

## OK condicional para alzar a producción

**Cursor emite OK LOCAL** cuando:

1. `npm run build` en `rimec-web/` → exit 0
2. Smoke `:3001` manual (Director o Cursor): CP↔PE filtros + cache + carrito VALIDAR

**Deploy prod autorizado cuando:**

- Director confirma smoke visual
- Claude Code ejecuta push/deploy según [CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md](../../1_fundamentos/1.1_protocolos/CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md)

---

## Checklist código (auditoría estática)

### 1. Pronta entrega — unidades

- [x] `PARES_POR_UNIDAD_PE` eliminado / no fuerza 1 par por caja
- [x] `resolveParesPorCaja` / `cajasDisponiblesDeFila` usados en grid, carrito, validar
- [x] Doc: [DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md](./DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md)

### 2. Dual cache

- [x] `ensureDualCatalogWarm()` al montar catálogo
- [x] `MIN_WARM_CARDS = 30` CP y PE
- [x] Stale-while-revalidate en cambio origen
- [x] Doc: [CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md](./CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md)

### 3. Filtros compartidos

- [x] sessionStorage `rimec_catalog_shared_filters_v1`
- [x] Excluye origen, ramo, depósito, quincenas
- [x] Cross-tab storage + custom event
- [x] Limpiar filtros borra storage
- [x] Doc: [CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md](./CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md)

### 4. Carrito VALIDAR

- [x] PE: `validarCarritoPeApp` sin RPC que pisa precio
- [x] `ITEM_OBSOLETO` + `STOCK_INSUFICIENTE` mensaje «eliminar por falta de stock»
- [x] Botón bulk quitar sin stock / sin precio
- [x] Doc: [CHUSAR_POST_IMPORT_STOCK_VALIDAR_CARRITOS.md](./CHUSAR_POST_IMPORT_STOCK_VALIDAR_CARRITOS.md)

### 5. Fuera de alcance (pendiente datos)

- [ ] Carteras con «+» gris por `lpn=0` — requiere PPD con precio (Track 1 import)
- [ ] Import stock real Excel — Report depósito RIMEC (post-deploy)
- [ ] Latencia catálogo 12k PE — plan fases: [DOC_AUDITORIA_LATENCIA_CATALOGO_20260713.md](./DOC_AUDITORIA_LATENCIA_CATALOGO_20260713.md)

### 6. Grada PE (2026-07-13)

- [x] MIG-150 `v_stock_pe_rimec.grada` · `gradasFmt.ts` · UI paneles PE
- [x] Hotfix SELECT: `grada` solo PE (no `v_stock_rimec`)
- [ ] Verificar visual prod post-deploy Claude Code

---

## Secuencia post-deploy (Director)

```
Deploy prod (Claude Code)
    → Import stock real (Report /stock-pronta-entrega)
    → Vendedores VALIDAR carrito abierto
    → E2E cliente 5000 + reversión si prueba
```

---

## Archivos modificados (13-07-26)

```
rimec-web/lib/catalogoFiltrosCompartidos.ts          (nuevo)
rimec-web/lib/catalogoPeWarmCache.ts
rimec-web/lib/prontaEntregaVenta.ts
rimec-web/lib/disponibilidad.ts
rimec-web/lib/carritoValidarPe.ts
rimec-web/lib/carritoApi.ts
rimec-web/app/CatalogoClient.tsx
rimec-web/app/components/FiltrosCatalogo.tsx
rimec-web/app/carrito/page.tsx
```

---

**Firma Cursor:** auditoría código OK · deploy = paso Claude Code + smoke Director.
