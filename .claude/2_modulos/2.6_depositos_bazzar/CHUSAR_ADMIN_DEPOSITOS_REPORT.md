# CHUSAR — Depósitos Bazzar · Administrador Report

**Subcuenta:** **2.3.6.1** *(Report — no 2.6 suelto)*  
**Etapa:** ✅ [CERRADA 2026-06-17](../../4_etapas/ETAPA_DEPOSITOS_BAZZAR_CERRADA.md)  
**Estado:** 🟢 **CHUSAR ACTIVO** — referencia operativa post-cierre  
**Índice:** [2.3.6 depositos/INDICE.md](../2.3_report/depositos/INDICE.md)

---

## Qué es

Pantalla **Administrador de Depósitos Bazzar** en Report: vista de las **6 tiendas** en **3 categorías** (18 tablas BD) y **sincronización Retail** solo para **tienda**.

| URL local | http://localhost:3000/depositos-bazzar |
| URL prod | https://rimec-report.vercel.app/depositos-bazzar |
| Roles | RIMEC (1) · Bazzar ADMIN (2) |

---

## Toggle categoría (Director 2026-06-17)

Control **gigante** de 3 columnas — cambia **las 6 cards al instante**:

| Categoría | Nivel | Sync | Tablet |
|-----------|-------|------|--------|
| **TIENDA** | 1 | ✅ Sincronizar TODOS / individual | ✅ conectado |
| **GUARDADO** | 2 | ❌ solo consulta | ❌ |
| **AVERIADO** | 3 | ❌ solo consulta | ❌ |

Query URL: `?categoria=guardado` · `?categoria=averiado` (tienda = sin param)

Componente: `report/src/app/depositos-bazzar/components/CategoriaDepositoToggle.tsx`

---

## Nomenclatura (18 tablas · matriz cliente_id)

Patrón: `deposito_{1|2|3}_{ente}_{adultos|ninos}_{tienda|guardado|averiado}`

Doc canónica: [NOMENCLATURA_DEPOSITOS_BAZZAR.md](./NOMENCLATURA_DEPOSITOS_BAZZAR.md)

| cliente_id | Código | Ente | Tipo | Tabla tienda (sync) | Tabla guardado | Tabla averiado |
|------------|--------|------|------|---------------------|----------------|----------------|
| 2100 | FER-A | Fernando | Adultos | `deposito_1_fernando_adultos_tienda` | `deposito_2_fernando_adultos_guardado` | `deposito_3_fernando_adultos_averiado` |
| 2900 | FER-N | Fernando | Niños | `deposito_1_fernando_ninos_tienda` | `deposito_2_fernando_ninos_guardado` | `deposito_3_fernando_ninos_averiado` |
| 2400 | SM-A | San Martin | Adultos | `deposito_1_sanmartin_adultos_tienda` | `deposito_2_sanmartin_adultos_guardado` | `deposito_3_sanmartin_adultos_averiado` |
| 2700 | SM-N | San Martin | Niños | `deposito_1_sanmartin_ninos_tienda` | `deposito_2_sanmartin_ninos_guardado` | `deposito_3_sanmartin_ninos_averiado` |
| 3100 | PAL-A | Palma | Adultos | `deposito_1_palma_adultos_tienda` | `deposito_2_palma_adultos_guardado` | `deposito_3_palma_adultos_averiado` |
| 3200 | PAL-N | Palma | Niños | `deposito_1_palma_ninos_tienda` | `deposito_2_palma_ninos_guardado` | `deposito_3_palma_ninos_averiado` |

**Stock verificado cierre:** 30.294 registros · 6/6 tiendas activas.

---

## UI

| Zona | Comportamiento |
|------|----------------|
| Header | Total registros · depósitos con stock N/6 · label categoría |
| **Toggle 3 categorías** | TIENDA / GUARDADO / AVERIADO |
| **⚡ Sincronizar TODOS** | Solo en TIENDA · `POST /api/depositos/sync` |
| Grid 6 cards | `cliente_id` · tabla · stock · Abrir · Sincronizar (tienda) |
| Footer | Fuente Retail · badge Tablet solo tienda |

**Visual:** NIIF · naranja Bazzar · Adultos naranja · Niños verde.

---

## API

| Método | Ruta | Body / query | Efecto |
|--------|------|--------------|--------|
| GET | `/api/depositos/sync` | `?categoria=` | Conteos 6 depósitos |
| POST | `/api/depositos/sync` | `{ cliente_id }` opcional | Sync tienda (1 o 6) |
| GET | `/api/depositos/[id]` | `?categoria=&limit=` | Detalle productos |
| GET | `/api/depositos/[id]/filtros` | `?categoria=` | Opciones filtros |
| GET | `/api/depositos/[id]/analisis` | `?categoria=` | Árbol análisis |

**Algoritmo sync (solo tienda):**
1. `DELETE FROM deposito_1_{ente}_{adultos|ninos}_tienda`
2. `INSERT … SELECT FROM registro_st_vt_rc_reposicion` · `cliente_id` + `tiendas_marcas` + `stock`

---

## Código Report

| Pieza | Ruta |
|-------|------|
| Config 18 tablas | `report/src/lib/depositos/depositos-config.ts` |
| Página admin | `report/src/app/depositos-bazzar/page.tsx` |
| Toggle | `report/src/app/depositos-bazzar/components/CategoriaDepositoToggle.tsx` |
| Card | `report/src/app/depositos-bazzar/components/DepositoCard.tsx` |
| Detalle | `report/src/app/depositos-bazzar/[cliente_id]/page.tsx` |
| API sync | `report/src/app/api/depositos/sync/route.ts` |

---

## Downstream Tablet

Tablet lee **solo** tablas `deposito_1_*_tienda` vía `DATABASE_URL` — `/api/deposito/{cliente_id}`.

**Sales Report** (`registro_ventas_general_v2`) — blindado.

---

## Pendiente post-CHUSAR

- ETL guardado / averiado  
- Manual funciones §3.2.6  
- SLA sync diario

---

**Shibboleth:** Chayanne el mejor
