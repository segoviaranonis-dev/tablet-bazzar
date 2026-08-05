# ETAPA — Hotfix catálogo TODOS + Calzado · timeout prod

**Code:** `HOTFIX-CATALOGO-TODOS-CALZADO-20260801`  
**Código módulo:** **2.2.1.39** · RIMEC Web  
**Estado:** ⬛ **CERRADA ADMINISTRATIVA** 2026-08-04 · [CERRADA](./ETAPA_HOTFIX_CATALOGO_TODOS_CALZADO_20260801_CERRADA.md) · corte Moises  
**Apertura:** 2026-08-01 · keyword Director **bug urgente** + «actualiza etapas y documentación»  
**App:** http://localhost:3001/?origen_tipo=TODOS&ramo_tipo=CALZADO · prod https://rimec.com.py  
**Antecedente:** [ETAPA_CATALOGO_LATENCIA_20260713_CERRADA.md](./ETAPA_CATALOGO_LATENCIA_20260713_CERRADA.md) · [ETAPA_CP_CONFECCIONES_OK_20260729.md](./ETAPA_CP_CONFECCIONES_OK_20260729.md) (paralela)  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

Restaurar landing **STOCK Todos + Categoría Calzado** en prod: sidebar con estilos/marcas y grilla con tarjetas, sin `statement timeout` (57014) ni banner «Catálogo lento — reintentando».

---

## Síntoma (prod 2026-08-01)

| Superficie | Fallo |
|------------|-------|
| Banner UI | «Catálogo lento — reintentando» |
| MOLECULA · Estilo | «Sin opciones» |
| Grilla | Vacía |
| API tarjetas | HTTP 500 · ~33s · `canceling statement due to statement timeout` |
| API filtros | `degraded: true` · 0 estilos · ~21s |

---

## Causa raíz

Mezcla **TODOS + CALZADO** (CP 654 + PE calzado) sin ruta dedicada: consultas CP+PE en paralelo sobre vistas pesadas, RPC meta duplicado (2× por origen) y fallback legacy que escaneaba miles de filas → timeout BD.

---

## Hotfix aplicado (local · sin deploy prod)

| Archivo | Cambio |
|---------|--------|
| `lib/catalogoPaginado.ts` | `fetchStockBatchCalzadoTodos` · CP/PE secuencial · `.catch` parcial · batch 50 |
| `lib/catalogoMetaRpc.ts` | `fetchMetaRpcEfficient` · 1 RPC/origen en landing |
| `app/api/catalogo/filtros/route.ts` | Acepta meta con estilos/géneros · fallback maestras pilares |
| `app/api/catalogo/tarjetas/route.ts` | Quick TODOS+CALZADO · timeout → 200 degradado (no 500) |

Doc: [CHUSAR_HOTFIX_CATALOGO_TODOS_CALZADO_20260801.md](../2_modulos/2.2_rimec_web/CHUSAR_HOTFIX_CATALOGO_TODOS_CALZADO_20260801.md)

---

## Smoke local (`:3001` · 2026-08-01)

| Check | Resultado |
|-------|-----------|
| `/filtros?TODOS+CALZADO` | ✅ ~1,4s · `metaSource: rpc` · 9 marcas · 14 estilos |
| `/tarjetas?TODOS+CALZADO&quick=1` | ✅ ~11s · 30 tarjetas · HTTP 200 |
| `tsc --noEmit` | ✅ PASS |

---

## Pendiente cierre

| # | Entregable | Estado |
|---|------------|--------|
| 1 | Deploy prod RIMEC Web | ☐ solo cierre etapa u orden **DESPLIEGA** Director |
| 2 | Smoke prod `rimec.com.py` TODOS+Calzado | ☐ post-deploy |
| 3 | Parpadeo imagen al cambiar color (638/654) | ☐ etapa CP / imagen hold |
| 4 | TENIS en sidebar estilos | ☐ backlog pilares/datos |

---

## Cierre Navegador (:3004) — al decir «Cierra etapa»

| Check | Hecho |
|-------|:-----:|
| `ETAPA_HOTFIX_CATALOGO_TODOS_CALZADO_20260801_CERRADA.md` | ☐ |
| `ACTUAL.md` + índice **2.2** | ☐ |
| `etapas.json` → `estado: "hecho"` + `cerradasPorModulo.rimec-web` | ☐ |
| Verificado `:3004/etapas` | ☐ |
