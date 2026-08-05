# Nomenclatura oficial — 18 depósitos Bazzar

**Subcuenta Report:** 2.3.6 · **CHUSAR:** [CHUSAR_ADMIN_DEPOSITOS_REPORT.md](./CHUSAR_ADMIN_DEPOSITOS_REPORT.md)  
**Etapa:** ✅ CERRADA 2026-06-17  
**Director:** nomenclatura definitiva + toggle admin 3 categorías

---

## Ley de nombres *(migración 114)*

```
deposito_{nivel}_{cliente_id}_{tienda|guardado|averiado}
```

Ejemplo: `deposito_1_2100_tienda` · Fernando Adultos · cliente_id **2100**

| Nivel | Sufijo `categoria` | Rol |
|-------|-------------------|-----|
| **1** | `tienda` | Stock piso · sync Retail · Tablet POS |
| **2** | `guardado` | Reserva / bodega · consulta admin |
| **3** | `averiado` | Mercadería dañada · consulta admin |

**6 tiendas** × **3 categorías** = **18 tablas** en `public.*`

---

## Matriz completa (tabla ↔ cliente_id)

| cliente_id | Código | Ente | Tipo | **Tienda (nivel 1)** | **Guardado (nivel 2)** | **Averiado (nivel 3)** |
|------------|--------|------|------|----------------------|------------------------|------------------------|
| 2100 | FER-A | Fernando | Adultos | `deposito_1_2100_tienda` | `deposito_2_2100_guardado` | `deposito_3_2100_averiado` |
| 2900 | FER-N | Fernando | Niños | `deposito_1_2900_tienda` | `deposito_2_2900_guardado` | `deposito_3_2900_averiado` |
| 2400 | SM-A | San Martin | Adultos | `deposito_1_2400_tienda` | `deposito_2_2400_guardado` | `deposito_3_2400_averiado` |
| 2700 | SM-N | San Martin | Niños | `deposito_1_2700_tienda` | `deposito_2_2700_guardado` | `deposito_3_2700_averiado` |
| 3100 | PAL-A | Palma | Adultos | `deposito_1_3100_tienda` | `deposito_2_3100_guardado` | `deposito_3_3100_averiado` |
| 3200 | PAL-N | Palma | Niños | `deposito_1_3200_tienda` | `deposito_2_3200_guardado` | `deposito_3_3200_averiado` |

---

## Operación (cierre etapa)

| Flujo | Tablas |
|-------|--------|
| Report admin toggle **TIENDA** | 6 · sync + Tablet |
| Report admin **GUARDADO / AVERIADO** | 6 c/u · consulta · ETL pendiente |
| Tablet `/deposito` · `/cadena` | Solo **nivel 1 · tienda** |

**Config:** `report/src/lib/depositos/depositos-config.ts` · `tablet-bazzar/lib/depositos-config.ts`  
**Migración BD:** `control_central/migrations/113_depositos_bazzar_18_tablas.sql`  
**Evidencia:** `report/docs/evidencia/MIGRACION_113_DEPOSITOS_20260617.json` · **30.294** rows tienda

---

## Marcas por tienda y tipo_v2 *(Chusar)*

Qué marcas puede almacenar cada `cliente_id` según calzado (tipo 1) vs confección (tipo 2):

→ **[MATRIZ_TIENDAS_MARCAS_TIPO_V2.md](./MATRIZ_TIENDAS_MARCAS_TIPO_V2.md)** — ratificado Director 2026-06-17

---

**Shibboleth:** Chayanne el mejor
