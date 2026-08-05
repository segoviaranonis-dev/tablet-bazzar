# CHUSAR — Depósitos Bazzar · Administrador Report

**Subcuenta:** **2.3.6.1** *(Report — no 2.6 suelto)*  
**Etapa:** ✅ [CERRADA 2026-06-17](../../4_etapas/ETAPA_DEPOSITOS_BAZZAR_CERRADA.md)  
**Estado:** 🟢 **CHUSAR ACTIVO** — referencia operativa · hub 3 entes 2026-06-30  
**Hub métricas:** [CHUSAR_HUB_TRES_ENTES_METRICAS.md](../2.3_report/depositos/CHUSAR_HUB_TRES_ENTES_METRICAS.md) · **2.3.2.1.1.4**
**Índice:** [2.3.6 depositos/INDICE.md](../2.3_report/depositos/INDICE.md)

---

## Qué es

Pantalla **Administrador de Depósitos Bazzar** en Report: vista de las **6 tiendas** en **3 categorías** (18 tablas BD) y **sincronización Retail** solo para **tienda**.

| URL local | http://localhost:3001/depositos-bazzar |
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

Patrón: `deposito_{nivel}_{cliente_id}_{tienda|guardado|averiado}`

Doc canónica: [NOMENCLATURA_DEPOSITOS_BAZZAR.md](./NOMENCLATURA_DEPOSITOS_BAZZAR.md)

| cliente_id | Código | Ente | Tipo | Tabla tienda (sync) | Tabla guardado | Tabla averiado |
|------------|--------|------|------|---------------------|----------------|----------------|
| 2100 | FER-A | Fernando | Adultos | `deposito_1_2100_tienda` | `deposito_2_2100_guardado` | `deposito_3_2100_averiado` |
| 2900 | FER-N | Fernando | Niños | `deposito_1_2900_tienda` | `deposito_2_2900_guardado` | `deposito_3_2900_averiado` |
| 2400 | SM-A | San Martin | Adultos | `deposito_1_2400_tienda` | `deposito_2_2400_guardado` | `deposito_3_2400_averiado` |
| 2700 | SM-N | San Martin | Niños | `deposito_1_2700_tienda` | `deposito_2_2700_guardado` | `deposito_3_2700_averiado` |
| 3100 | PAL-A | Palma | Adultos | `deposito_1_3100_tienda` | `deposito_2_3100_guardado` | `deposito_3_3100_averiado` |
| 3200 | PAL-N | Palma | Niños | `deposito_1_3200_tienda` | `deposito_2_3200_guardado` | `deposito_3_3200_averiado` |

**Stock verificado cierre:** 30.294 registros · 6/6 tiendas activas.

---

## Matriz tienda × tipo_v2 × marcas *(Chusar · permanente)*

Regla canónica **adultos vs niños** · calzado vs confección · `id_marca` por `cliente_id`:

→ **[MATRIZ_TIENDAS_MARCAS_TIPO_V2.md](./MATRIZ_TIENDAS_MARCAS_TIPO_V2.md)**

| Segmento | cliente_id | Calzado (tipo 1) | Confección (tipo 2) |
|----------|------------|------------------|---------------------|
| Adultos | 2100, 2400, 3100 | 1,2,3,4,7,8,9 | — |
| Niños | 2900, 2700, 3200 | 5, 6 | 10–15 |

Sync y ETL deben validar molécula contra esta matriz + `marca_tipo_v2`. BD `tiendas_marcas`: ampliación 10–15 en niños **pendiente OT**.

---

## UI

> **2026-06-30:** pantalla principal = **hub 3 entes** ([CHUSAR hub](../2.3_report/depositos/CHUSAR_HUB_TRES_ENTES_METRICAS.md)). Sync Retail sigue en API; botón «Sincronizar TODOS» puede no estar en hub — import CSV es fuente operativa Hiedra.

| Zona | Comportamiento |
|------|----------------|
| Header | Total calzado · uds · vendido · import CSV |
| **Toggle 3 categorías** | TIENDA / GUARDADO / AVERIADO |
| **Hub 3 columnas** | Ente → tiendas → import · vendido · ramos |
| **Import CSV** | 1 o 3 archivos · REPLACE/MERGE |

**Visual:** NIIF · naranja Bazzar · Adultos naranja · Niños verde.

---

## API

| Método | Ruta | Body / query | Efecto |
|--------|------|--------------|--------|
| GET | `/api/depositos/hub` | `?categoria=` | Hub 3 entes · import · vendido |
| GET | `/api/depositos/sync` | `?categoria=` | Conteos 6 depósitos |
| POST | `/api/depositos/sync` | `{ cliente_id }` opcional | Sync tienda (1 o 6) |
| GET | `/api/depositos/[id]` | `?categoria=&limit=` | Detalle productos |
| GET | `/api/depositos/[id]/filtros` | `?categoria=` | Opciones filtros |
| GET | `/api/depositos/[id]/analisis` | `?categoria=` | Árbol análisis |

**Algoritmo sync (solo tienda):**
1. `DELETE FROM deposito_1_{cliente_id}_tienda` (ej. `deposito_1_2100_tienda`)
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

- Migrar `tiendas_marcas` / `categoria_cliente_marca` — niños **+ marcas 10–15** (ver matriz)  
- ETL guardado / averiado · CSV Bazzar (`S00_D1` / `S00_D2` / `S00_NINHOS`)  
- Manual funciones §3.2.6  
- SLA sync diario

---

**Shibboleth:** Chayanne el mejor
