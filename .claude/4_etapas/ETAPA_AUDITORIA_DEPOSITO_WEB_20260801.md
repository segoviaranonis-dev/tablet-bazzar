# ETAPA — Auditoría Depósito Web · Report + Bazzar Web local

**ID:** `AUDITORIA-DEPOSITO-WEB-20260801`  
**Código módulo:** **2.5.1.3** (evolución **2.5.1.2**)  
**Estado:** 🟢 **EN CURSO**  
**Apertura:** 2026-08-01 · keyword Director **Nueva** + **Documenta** + protocolo Chusar  
**Apps:**  
- Report Depósito Web: http://localhost:3000/bazzar-web/deposito-web  
- Bazzar Web tienda: http://localhost:3002  
**Antecedente:** [CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md](../2_modulos/2.5_bazzar_web/CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md) (**2.5.1.2**)  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

Auditar en **local** el módulo **Depósito Web** de Report (`/bazzar-web/deposito-web`) — stock `ALM_WEB_01`, grilla/filtros siameses, Ingreso ALM vs Vendible tienda, protocolo imagen 654+638 — con Bazzar Web `:3002` levantado para contraste tienda.

---

## Alcance auditoría (checklist)

| # | Check | Estado |
|---|--------|--------|
| 1 | Report `:3000` + ruta `/bazzar-web/deposito-web` operativa | ✅ local (home 200 · ruta 307 login) |
| 2 | Bazzar Web `:3002` operativa | ✅ HTTP 200 |
| 3 | KPIs cabecera (prod · pares · Gs · 654/638) vs API | ⏳ |
| 4 | Toggle Ingreso ALM ↔ Vendible tienda | ⏳ |
| 5 | Filtros Stock / Categoría / AB-CR / molécula | ⏳ |
| 6 | Tabs Tipo (TODOS / NORMAL / PROMO / LIQ) | ⏳ |
| 7 | Imágenes sm contain (654 + Kyly 638) · sin crop | ⏳ |
| 8 | Grada / pares por tarjeta coherentes con ALM_WEB | ⏳ |
| 9 | Contraste catálogo tienda `:3002` (muestra) | ⏳ |
| 10 | Hallazgos → CHUSAR + fix solo con orden Director | ✅ LPN/CASO Motor **2.5.1.4** |
| 11 | Motor precio LPN/CASO (ppd huérfano) | ✅ 107/107 calculable |

---

## Fuera de alcance (salvo orden)

- Deploy prod Report / Bazzar Web.
- Purge / mutación masiva `movimiento` sin OT.
- Hotfix catálogo RIMEC Web (sigue abierta en paralelo).

---

## Docs

- CHUSAR etapa: [CHUSAR_AUDITORIA_DEPOSITO_WEB_REPORT_20260801.md](../2_modulos/2.5_bazzar_web/CHUSAR_AUDITORIA_DEPOSITO_WEB_REPORT_20260801.md)
- Código Report: `report/src/app/bazzar-web/deposito-web/` · `report/src/lib/bazzar-web/deposito-web/`
