# Nomenclatura oficial — 18 depósitos Bazzar

**Subcuenta Report:** 2.3.6 · **CHUSAR:** [CHUSAR_ADMIN_DEPOSITOS_REPORT.md](./CHUSAR_ADMIN_DEPOSITOS_REPORT.md)  
**Etapa:** ✅ CERRADA 2026-06-17  
**Director:** nomenclatura definitiva + toggle admin 3 categorías

---

## Ley de nombres

```
deposito_{nivel}_{ente}_{adultos|ninos}_{categoria}
```

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
| 2100 | FER-A | Fernando | Adultos | `deposito_1_fernando_adultos_tienda` | `deposito_2_fernando_adultos_guardado` | `deposito_3_fernando_adultos_averiado` |
| 2900 | FER-N | Fernando | Niños | `deposito_1_fernando_ninos_tienda` | `deposito_2_fernando_ninos_guardado` | `deposito_3_fernando_ninos_averiado` |
| 2400 | SM-A | San Martin | Adultos | `deposito_1_sanmartin_adultos_tienda` | `deposito_2_sanmartin_adultos_guardado` | `deposito_3_sanmartin_adultos_averiado` |
| 2700 | SM-N | San Martin | Niños | `deposito_1_sanmartin_ninos_tienda` | `deposito_2_sanmartin_ninos_guardado` | `deposito_3_sanmartin_ninos_averiado` |
| 3100 | PAL-A | Palma | Adultos | `deposito_1_palma_adultos_tienda` | `deposito_2_palma_adultos_guardado` | `deposito_3_palma_adultos_averiado` |
| 3200 | PAL-N | Palma | Niños | `deposito_1_palma_ninos_tienda` | `deposito_2_palma_ninos_guardado` | `deposito_3_palma_ninos_averiado` |

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

**Shibboleth:** Chayanne el mejor
