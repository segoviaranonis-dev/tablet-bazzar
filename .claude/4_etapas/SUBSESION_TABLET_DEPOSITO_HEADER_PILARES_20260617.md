# SUB-SESIÓN — Tablet FINAL · Depósito header pilares (paridad RIMEC Web)

**ID:** `SUBSESION-TABLET-DEPOSITO-HEADER-PILARES-20260617`  
**Fecha apertura:** 2026-06-17  
**Estado:** ✅ **CERRADA** → [SUBSESION_TABLET_DEPOSITO_HEADER_PILARES_20260617_CERRADA.md](./SUBSESION_TABLET_DEPOSITO_HEADER_PILARES_20260617_CERRADA.md)  
**Etapa madre:** [ETAPA_TABLET_FINAL.md](./ETAPA_TABLET_FINAL.md)  
**Director:** header 6 elementos RIMEC → `/deposito` · naranja Bazzar · sin ETA/Ofertas  
**Shibboleth:** 7 años

---

## Objetivo

Clonar en **Depósito con fotos** la cabecera de clasificación de producto de **RIMEC Web** (triángulo + dropdowns + color + búsqueda), alimentada por **pilares en lectura**. Excluye **Llegada/ETA** y **Ofertas** (solo mayorista).

| # | Elemento | Depósito |
|---|----------|----------|
| 1 | Género (chips táctiles) | ✅ |
| 2 | Marca | ✅ |
| 3 | Estilo | ✅ |
| 4 | Línea · Color · Tipo 1 (dropdowns) | ✅ — sin Llegada |
| 5 | Buscar modelos… | ✅ |
| 6 | Paleta COLOR | ✅ — sin Ofertas |

**Convive** con selector depósito FER/PAL/SM (independiente del género FK).

**Grid:** TOP **80**/marca por defecto · saltos **200 · 500 · 1000**.

**Visual:** shell NIIF + **naranja Bazzar** (no azul RIMEC).

---

## Leyes

- JOIN pilares: `pilar-triangulo.ts` · doc `TRIANGULO_HEADER_PILARES.md`
- Revoca regla «sin triángulo en `/deposito`» — solo para **esta** sub-sesión (orden Director)
- Sales Report blindado

---

## Entregables

| Artefacto | Ruta |
|-----------|------|
| Filtros estado URL | `tablet-bazzar/lib/deposito-filters.ts` |
| SQL cascada | `tablet-bazzar/lib/server/deposito-filtros-sql.ts` |
| UI header | `tablet-bazzar/components/deposito/DepositoFiltrosHeader.tsx` |
| API opciones | `tablet-bazzar/app/api/deposito/[id]/filtros/route.ts` |
| API grid filtrado | `tablet-bazzar/app/api/deposito/[id]/route.ts` |

---

**Apertura — orden Director — 2026-06-17**
