# CHUSAR — PP abierto · Herramienta reposición (proforma sin cerrar)

**Código:** **2.3.1.29**  
**Keyword:** **Documenta** · Director 2026-07-20  
**Estado:** 🟢 v1 deploy prod  
**App:** Report · http://localhost:3000/herramienta-reposicion · prod https://rimec-report.vercel.app/herramienta-reposicion  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Qué es

Quinto bucket de stock en **Alejandro Magno reposición**: pares de una **proforma importada** (PP sin cerrar en sistema) que aún no están en PPD PE/CP/PROGRAMADO.

| Campo | Valor canónico |
|-------|----------------|
| Etiqueta pill | `PP abierto` (`PP_ABIERTO_LABEL`) |
| KPI cabecera | **PP abierto** · 7ª columna grid |
| Origen datos | Excel proforma · parser `parseProforma` (col **M = PAIRS**, col **L = BOXES**) |
| BD | `pp_abierto_import` + `pp_abierto_import_fila` · MIG-170 |

**Import inicial Director (2026-07-20):** factura **0004/2026** · **232 moléculas** · **10.152 pares**.

---

## 2 · Flujo operativo

1. **Importar PP abierto** (botón cabecera · borde índigo punteado) → POST `/api/herramienta-reposicion/pp-abierto/import`.
2. Import desactiva cabeceras `activo=false` anteriores · inserta nueva cabecera + filas molécula.
3. Merge reposición carga `listPpAbiertoProductos()` → bucket stock `PP abierto` por tarjeta.
4. Pills en tarjeta: borde **índigo punteado** (distinto de PE verde / CP azul).
5. **KPI PP abierto (clic):** toggle **filtro ON** → grilla solo tarjetas con `totales.ppAbierto > 0` · orden DESC por pares PP · tile índigo «filtro ON». Segundo clic apaga filtro.

---

## 3 · Leyes integridad

| Regla | Detalle |
|-------|---------|
| Clave molécula | `linea + referencia + material + color` (igual AM) |
| Σ KPI | `kpisHolding.ppAbierto` = suma holding · con filtro activo KPI muestra suma visible |
| Adaptador filtros | `reposicion-a-deposito-row` incluye `ppAbierto` en `cantidad` (fix 4.276→10.152) |
| JOIN pilares | `codigo_proveedor::text = TRIM(...)` |
| Cache | `invalidarCacheHerramientaReposicion()` post-import |

---

## 4 · Archivos clave

| Área | Rutas |
|------|-------|
| Migración | `report/migrations/170_pp_abierto_reposicion.sql` · `scripts/run_migration_170.mjs` |
| Import | `src/lib/herramienta-reposicion/pp-abierto-import.ts` · API `pp-abierto/import/route.ts` |
| Query | `queries-pp-abierto.ts` · `queries.ts` · `queries-cached.ts` |
| Merge / KPI | `merge-reposicion.ts` · `totales-reposicion.ts` · `reposicion-a-deposito-row.ts` |
| Orden / filtro | `orden-compra-previa.ts` (`ORDEN_PP_ABIERTO`) · `HerramientaReposicionClient.tsx` |
| UI | `ImportarPpAbiertoButton.tsx` · `ReposicionArticuloCard.tsx` |

---

## 5 · Scripts smoke

```bash
cd report
node scripts/run_migration_170.mjs
node scripts/import_pp_abierto_local.mjs   # Excel Director
node scripts/smoke_pp_abierto_query.mjs
node scripts/smoke_reposicion_pp_abierto.mjs
```

---

## 6 · Padres AM

- [CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md](./CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md) (**2.3.1.22**)
- [CHUSAR_ORDENAMIENTO_COMPRA_PREVIA_REPOSICION.md](./CHUSAR_ORDENAMIENTO_COMPRA_PREVIA_REPOSICION.md) (**2.3.1.24**)

---

**Última actualización:** 2026-07-20 · Documenta Director · deploy **2.3.4.0.15**
