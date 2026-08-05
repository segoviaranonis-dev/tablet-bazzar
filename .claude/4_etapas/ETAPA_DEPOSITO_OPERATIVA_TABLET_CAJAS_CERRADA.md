# ETAPA CERRADA — Depósito Operativa Report + Tablet Cajas · Matriz 18

**ID:** `ETAPA-DEP-OP-TABLET-CAJAS-20260627`  
**Códigos:** **2.3.2.1.1.1** (Report Operativa UI) · **2.3.2.1.1.2** (Filtros índice UI) · **2.4.3.4** (Tablet depósito cajas)  
**Fecha cierre:** 2026-06-27  
**Director:** cierre etapa · documenta · preparar deploy  
**Estado:** ✅ **CERRADA** (build OK · deploy pendiente push)  
**Shibboleth:** 7 años

---

## Entregables

### Report — Panel Depósito Operativa (`:3001`)

| Ítem | Estado | Archivo clave |
|------|--------|---------------|
| CABECERA DE FILTROS · acordeón único | ✅ | `TrianguloHeaderDeposito.tsx` |
| Filtro **Cantidad** · acordeón independiente | ✅ | `FiltroCantidadOperativa.tsx` |
| Filtro **Grada** · dentro cabecera + Aplicar | ✅ | `FiltroGradaOperativa.tsx` |
| Vitales KPI (productos + pares filtrados) | ✅ | `VitalesStockDeposito.tsx` |
| Grilla centrada · agrupación cajas | ✅ | `GrillaOperativaDeposito.tsx` · `agrupar-operativa.ts` |
| Tab **Filtros por índice** · puente Motor Precios | ✅ | `TabFiltrosIndice.tsx` · `filtros-indice.ts` |
| Build producción | ✅ | `npm run build` PASS 2026-06-27 |

### Tablet — Depósito con fotos (`:3000/deposito`)

| Ítem | Estado | Archivo clave |
|------|--------|---------------|
| Matriz **18 depósitos** · entes · categorías | ✅ | `lib/depositos-config.ts` · `GET /api/deposito/status` |
| Agrupación **por cajas** L+R+mat+color | ✅ | `lib/depositos/agrupar-cajas.ts` |
| Grilla cajas + tabla grada × stock | ✅ | `GrillaCajasDeposito.tsx` · `TablaGradaDeposito.tsx` |
| Fetch stock completo (`?limit=all`) | ✅ | `app/deposito/page.tsx` |
| Build producción | ✅ | `npm run build` PASS 2026-06-27 |

---

## Matriz 18 · relación entes

Patrón canónico: `deposito_{nivel}_{cliente_id}_{categoria}`

| Nivel | Categoría | Tablet | Report |
|-------|-----------|--------|--------|
| 1 | `tienda` | ✅ 6 selectores | ✅ sync + operativa |
| 2 | `guardado` | solo status matriz | ✅ consulta |
| 3 | `averiado` | solo status matriz | ✅ consulta |

**Entes:** Fernando · San Martin · Palma × Adultos/Niños → FER-A/SM-A/PAL-A (+ N).

Doc: [NOMENCLATURA_DEPOSITOS_BAZZAR.md](../2_modulos/2.6_depositos_bazzar/NOMENCLATURA_DEPOSITOS_BAZZAR.md) · [CHUSAR_TABLET_DEPOSITO_CAJAS.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_CAJAS.md)

---

## Smoke post-build (local)

| App | Ruta | Check |
|-----|------|-------|
| Report | `/depositos-bazzar/2100?tab=operativa` | Cabecera acordeón · cantidad · grada · vitales · grilla cajas |
| Report | `?tab=filtros-indice` | Tab puente BCL · proveedor 654 |
| Tablet | `/deposito` | Selector 6 tiendas · cards cajas · tabla grada · badge pares |
| Tablet | `/api/deposito/status` | JSON `matriz` length 18 · `resumen.tablas_total` 18 |

---

## Deploy (pendiente push)

Ver:

- Tablet: [DEPLOY_PREPARACION_20260627.md](../../../tablet-bazzar/docs/DEPLOY_PREPARACION_20260627.md)
- Report: push `report/` → Vercel `rimec-report.vercel.app`

Evidencia build: [CIERRE_DEPOSITO_CAJAS_20260627.json](../../../tablet-bazzar/docs/evidencia/CIERRE_DEPOSITO_CAJAS_20260627.json)

---

## Pendiente post-cierre (no bloquea)

- Etapa padre **2.3.2.1.1** sigue abierta (sectores · reglas · mensajería)
- Stock red 3 tiendas en tablet `/deposito` (cohorte) — fase opcional
- Push + deploy Vercel — orden Claude Code / Director «Subilo»

---

**Cerrada por orden Director — 2026-06-27**
