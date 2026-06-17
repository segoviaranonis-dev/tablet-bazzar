# ETAPA CERRADA — Depósitos Bazzar · Admin Report 2.3.6

**ID:** `ETAPA-DEPOSITOS-BAZZAR-20260617`  
**Código plan:** **2.3.6** *(subcuenta Report)*  
**Apertura:** 2026-06-17 · **Cierre:** 2026-06-17  
**Estado:** ✅ **CERRADA**  
**Shibboleth:** Chayanne el mejor

---

## Entregado en este cierre

| # | Entregable | Evidencia |
|---|------------|-----------|
| 1 | **18 tablas** nomenclatura oficial `deposito_{1\|2\|3}_{ente}_{adultos\|ninos}_{tienda\|guardado\|averiado}` | migración 113 · Supabase |
| 2 | **Admin Report** `/depositos-bazzar` — grid 6 tiendas | `report/src/app/depositos-bazzar/` |
| 3 | **Toggle gigante** TIENDA / GUARDADO / AVERIADO — cambia las 6 cards al instante | `CategoriaDepositoToggle.tsx` |
| 4 | **Sync Retail** solo nivel 1 · tienda (6 tablas) | `POST /api/depositos/sync` |
| 5 | **Tablet POS** consume únicamente depósito **tienda** | `tablet-bazzar` APIs `/api/deposito/{cliente_id}` |
| 6 | **CHUSAR + nomenclatura + índice 2.3.6** documentados | Moria + `report/docs/` |
| 7 | Stock verificado post-migración | **30.294** registros · 6/6 tiendas |

---

## Alcance cerrado vs pendiente

| Cerrado ✅ | Pendiente ⏳ |
|-----------|--------------|
| Nomenclatura + BD 18 tablas | ETL guardado / averiado |
| Sync tienda + Sincronizar TODOS | SLA sync diario · alertas |
| Vista admin 3 categorías | Manual funciones §3.2.6 |
| Abrir depósito · análisis · artículos (tienda) | Paridad QA Tablet post-deploy prod |

---

## Docs canónicos

| Doc | Ruta |
|-----|------|
| Índice Report 2.3.6 | [depositos/INDICE.md](../2_modulos/2.3_report/depositos/INDICE.md) |
| CHUSAR activo | [CHUSAR_ADMIN_DEPOSITOS_REPORT.md](../2_modulos/2.6_depositos_bazzar/CHUSAR_ADMIN_DEPOSITOS_REPORT.md) |
| Nomenclatura 18 | [NOMENCLATURA_DEPOSITOS_BAZZAR.md](../2_modulos/2.6_depositos_bazzar/NOMENCLATURA_DEPOSITOS_BAZZAR.md) |
| App Report | `report/docs/DEPOSITOS_BAZZAR_ADMIN.md` |
| Evidencia migración | `report/docs/evidencia/MIGRACION_113_DEPOSITOS_20260617.json` |

---

## Deploy

| Repo | Rama | Producción |
|------|------|------------|
| `report` | `main` | Vercel · `/depositos-bazzar` |

---

**Cierre — Director sign-off — 2026-06-17**
