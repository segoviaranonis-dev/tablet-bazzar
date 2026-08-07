# CHUSAR — Final Bazzar Web · lanzamiento 01-09-2026

**Código:** `2.5.1.18`  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta** · **abre la etapa**  
**Etapa:** [ETAPA_FINAL_BAZZAR_WEB_20260806.md](../../4_etapas/ETAPA_FINAL_BAZZAR_WEB_20260806.md) (`FINAL-BAZZAR-WEB-20260806`)  
**Meta:** Go-live / lanzamiento **2026-09-01**  
**App:** `bazzar-web` · local `:3002` · prod https://www.bazzar.com.py  
**Estado:** 🟡 Etapa abierta · **APARCADA** (FOCO holding → Situación financiera Rimec 2026-08-06) · meta 01-09 intacta

---

## 1 · Orden Director

Unificar Moises (mudanza + orilla) en **una** etapa para más tarde / fin de semana.  
Abrir etapa **Final de Bazzar Web** como siguiente objetivo: terminar y pulir hasta lanzamiento **01-09-2026**.

---

## 2 · Qué significa “final”

No es un hotfix puntual: es la **recta final** del producto B2C Bazzar Web hacia fecha de lanzamiento.

| Incluye | No incluye (salvo orden) |
|---------|---------------------------|
| Catálogo · stock · grada · filtros · checkout | Moises cutover |
| Integridad ALM_WEB / TRP / precio-imagen | Oversell CP RIMEC |
| Deploy + dominio + smoke go-live | Cambios Sales Report blindado |

---

## 3 · Base documental previa (no rehacer)

| Code | Tema |
|------|------|
| 2.5.1.8 | Adecuación Bazzar↔RIMEC · gaps F0–F4 |
| 2.5.1.11–14 | Catálogo grada · header filtros · purge |
| 2.5.1.15–17 | Stock 5000 · TRP · PPD huérfano |
| Deploy | `DEPLOY_VERCEL_BAZZAR_WEB.md` |

---

## 4 · Arranque FOCO 2026-08-06

1. ✅ Etapa + JSON + Documenta pendientes (MIG-199 hecha · cascada UI en cola).  
2. ✅ Inventario inicial gaps (abajo).  
3. 🔄 Smoke `:3002` catálogo.  
4. Propuesta orden: **F1 638** → **F2 filtros** → **F3 seguridad** → **F4 NIIF**.

### Inventario go-live (prioridad)

| # | Gap | Fase | Fuente |
|---|-----|------|--------|
| 1 | Catálogo 638 · UI talles B2C (paridad RIMEC) | F1 | ✅ **2.5.1.23** buckets precio×talle · deploy 2026-08-07 |
| 2 | Filtros AB-CR / medias / cascada header | F2 | 2.5.1.14 · siameses |
| 3 | Checkout: rate-limit · ownership `/pedido/[id]` · cédula | F3 | AUDITORIA_BAZZAR_WEB críticas |
| 4 | CSP / service_role en actions | F3 | idem |
| 5 | Smoke NIIF + stock post-import ALM_WEB | F4 | 2.5.1.13–17 |
| 6 | Secretos en scripts repo (ops) | F3 | AUDITORIA 1.1 — rotación Director |

### Cola holding (no este FOCO)

| Ítem | Estado |
|------|--------|
| MIG-199 cascada RPC | ✅ aplicada |
| Smoke browser cascada rimec | ⏳ cola |
| Oversell CP | ⏳ espera SR |

---

## 5 · Navegador

- `etapas.json` · `sesionActiva` = `FINAL-BAZZAR-WEB-20260806`  
- Verificar: http://localhost:3004/etapas
