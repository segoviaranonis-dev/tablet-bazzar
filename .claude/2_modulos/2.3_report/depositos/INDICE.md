# 2.3.6 Depósitos Bazzar — subcuenta Report

**Código plan:** `2.3.6` · **App:** `report/` → `/depositos-bazzar`  
**Etapa:** ✅ [CERRADA 2026-06-17](../../../4_etapas/ETAPA_DEPOSITOS_BAZZAR_CERRADA.md)  
**CHUSAR:** 🟢 activo — [CHUSAR_ADMIN_DEPOSITOS_REPORT.md](../../2.6_depositos_bazzar/CHUSAR_ADMIN_DEPOSITOS_REPORT.md)

---

## Qué es

Administrador de **18 depósitos** Bazzar (6 tiendas × 3 categorías).  
**Report** opera sync y consulta; **Tablet** consume solo **tienda** (nivel 1).

| Rol | Producto | Ruta |
|-----|----------|------|
| Admin sync + vista 3 categorías | Report | `/depositos-bazzar` |
| POS consulta / venta | Tablet | `/deposito` · `/cadena` |

**Producción:** https://rimec-report.vercel.app/depositos-bazzar  
**Local:** http://localhost:3000/depositos-bazzar

---

## Nomenclatura (18 tablas)

Patrón: `deposito_{1|2|3}_{ente}_{adultos|ninos}_{tienda|guardado|averiado}`

| Nivel | Sufijo | Rol | Sync |
|-------|--------|-----|------|
| 1 | `tienda` | Stock piso · Tablet POS | ✅ Retail |
| 2 | `guardado` | Bodega | ⏳ ETL pendiente |
| 3 | `averiado` | Dañado | ⏳ ETL pendiente |

**Matriz completa cliente_id ↔ tabla:** [NOMENCLATURA_DEPOSITOS_BAZZAR.md](../../2.6_depositos_bazzar/NOMENCLATURA_DEPOSITOS_BAZZAR.md)

**BD:** migración `control_central/migrations/113_depositos_bazzar_18_tablas.sql` · evidencia `report/docs/evidencia/MIGRACION_113_DEPOSITOS_20260617.json`

---

## UI Admin (entregado)

| Control | Comportamiento |
|---------|----------------|
| **Toggle TIENDA / GUARDADO / AVERIADO** | Cambia las 6 cards al instante · URL `?categoria=` |
| Stats header | Total registros + depósitos con stock / 6 |
| **Sincronizar TODOS** | Solo visible en **TIENDA** |
| Card por tienda | Abrir · Sincronizar (solo tienda) · badge Tablet |
| Detalle | Análisis + artículos · respeta categoría en query |

---

## API Report

| Método | Ruta | Notas |
|--------|------|-------|
| GET | `/api/depositos/sync?categoria=tienda\|guardado\|averiado` | Conteos 6 depósitos |
| POST | `/api/depositos/sync` | Sync tienda · `{ cliente_id }` opcional |
| GET | `/api/depositos/[cliente_id]?categoria=` | Productos TOP N |
| GET | `/api/depositos/[cliente_id]/filtros?categoria=` | Filtros pilares |
| GET | `/api/depositos/[cliente_id]/analisis?categoria=` | Árbol análisis |

**Fuente sync:** `registro_st_vt_rc_reposicion` · `tipo_movimiento = stock` · `tiendas_marcas`

---

## Código

| Pieza | Ruta |
|-------|------|
| Config 18 tablas | `report/src/lib/depositos/depositos-config.ts` |
| Admin page | `report/src/app/depositos-bazzar/page.tsx` |
| Toggle categoría | `report/src/app/depositos-bazzar/components/CategoriaDepositoToggle.tsx` |
| Tablet config (tienda) | `tablet-bazzar/lib/depositos-config.ts` |

---

## Subcuentas 2.3.6.x

| Código | Función | Estado |
|--------|---------|--------|
| 2.3.6 | Índice · etapa | ✅ cerrada |
| 2.3.6.1 | Admin sync · toggle 3 categorías | ✅ CHUSAR |
| 2.3.6.2 | Análisis / abrir depósito | ✅ tienda |
| 2.3.6.3 | Consumo Tablet | ✅ solo tienda |

---

## Reglas

- **Sales Report** (`registro_ventas_general_v2`) — blindado · no mezclar.
- Sync **nunca** escribe guardado/averiado hasta ETL dedicado.
- Tablet **solo** lee `deposito_1_*_tienda`.

---

**Shibboleth:** Chayanne el mejor
