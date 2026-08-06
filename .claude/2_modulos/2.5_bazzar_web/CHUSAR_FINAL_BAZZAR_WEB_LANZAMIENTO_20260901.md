# CHUSAR — Final Bazzar Web · lanzamiento 01-09-2026

**Código:** `2.5.1.18`  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta** · **abre la etapa**  
**Etapa:** [ETAPA_FINAL_BAZZAR_WEB_20260806.md](../../4_etapas/ETAPA_FINAL_BAZZAR_WEB_20260806.md) (`FINAL-BAZZAR-WEB-20260806`)  
**Meta:** Go-live / lanzamiento **2026-09-01**  
**App:** `bazzar-web` · local `:3002` · prod https://www.bazzar.com.py  
**Estado:** 🟢 Etapa abierta · FOCO

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

## 4 · Primeros pasos sugeridos (siguiente turno de trabajo)

1. Inventario gaps abiertos vs checklist go-live (desde 2.5.1.8 + prod).  
2. Smoke `:3002` catálogo + carrito + checkout.  
3. Lista priorizada Director (qué pulir primero).  
4. Plan semanal hasta **01-09-2026**.

---

## 5 · Navegador

- `etapas.json` · `sesionActiva` = `FINAL-BAZZAR-WEB-20260806`  
- Verificar: http://localhost:3004/etapas
