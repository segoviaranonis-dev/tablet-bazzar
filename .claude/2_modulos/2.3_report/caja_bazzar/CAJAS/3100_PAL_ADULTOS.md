# Palma — tienda única · 1 caja · marca = segmento

**cliente_id:** 3100 · **Código caja:** 2.3.2.2.5  
**Ratificado:** Director · 2026-06-28

---

## Relación depósito ↔ tablet

| Fernando / San Martín | Palma |
|----------------------|-------|
| 2 locales contiguos | **1 local** |
| 2 `cliente_id` (adultos + niños) | **solo 3100** |
| 2 rutas tablet (`/2100` + `/2900`, etc.) | **`/tablet-bazzar/3100`** |
| Columna CSV → depósito distinto | Columna CSV → **misma tienda** · **marca** define adultos vs niños |

**3200** existe en nomenclatura 18 tablas como legacy — **no tiene caja operativa ni import CSV**.

---

## Marcas por columna CSV (sdpl)

| id_marca | Marca | Columna POS |
|----------|-------|-------------|
| 1–4, 7–9 | Calzado adultos | `S00_D1` / `S00_D2` |
| 5, 6 | Molekinha / Molekinho | `S00_NINHOS` |
| 10–15 | Confecciones Kyly… | `S00_NINHOS` |

Código: `report/src/lib/depositos/bazzar-csv-ente-map.ts` · `PALMA_TIENDA_UNICA`

---

**Shibboleth:** Chayanne el mejor
