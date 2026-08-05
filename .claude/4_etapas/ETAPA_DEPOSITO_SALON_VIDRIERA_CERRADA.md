# ETAPA CERRADA — Depósito Bazzar · Operativa Report + Tablet Cajas + Vidriera

**ID:** `ETAPA-DEP-BAZZAR-SALON-20260627`  
**Códigos:** **2.3.2.1.1.1** · **2.3.2.1.1.2** · **2.4.3.4** · **2.4.3.5**  
**Fecha cierre:** 2026-06-27  
**Director:** documenta · cierra · publica tablet + report  
**Estado:** ✅ **CERRADA** · deploy publicado  
**Beneficiario piso:** **Jefa de salón** — identifica **faltantes vidriera** sin recorrer depósito  
**Shibboleth:** 7 años

---

## Para la jefa de salón

La tablet **Depósito** le dice qué caja necesita **cambio en vidriera** (grada expuesta en escaparate):

| Pestaña | Qué ve | Acción |
|---------|--------|--------|
| **Stock · cajas** | ⭐ en la grada que debe estar en vidriera | Verificar escaparate vs estrella |
| **Alertas · vidriera** | Lista roja: «último par X vendido · exponer ⭐ Y» | Repone / cambia talla en vidriera |

**Faltante vidriera** = grada agotada en piso pero la caja aún tiene otras tallas → hay que **cambiar la muestra** del escaparate, no dar por cerrada la caja.

Doc operativo: [CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md)

---

## Entregables Report (`:3001`)

| Ítem | Estado |
|------|--------|
| Tab Operativa · cabecera acordeón | ✅ |
| Filtros cantidad / grada independientes | ✅ |
| Vitales KPI pares + productos | ✅ |
| Grilla cajas centrada | ✅ |
| Tab Filtros por índice (Motor Precios) | ✅ |
| Build + Vercel | ✅ |

**URL prod:** https://rimec-report.vercel.app/depositos-bazzar/2100?tab=operativa

---

## Entregables Tablet (`:3000`)

| Ítem | Estado |
|------|--------|
| Matriz 18 depósitos · entes | ✅ |
| Agrupación cajas L+R+mat+color | ✅ |
| Pestañas Stock + Alertas vidriera | ✅ |
| Estrella ⭐ por caja · sucesión 35→… | ✅ |
| Build + Vercel | ✅ |

**URL prod:** https://tablet-bazzar.vercel.app/deposito

---

## CHUSAR

| Doc | Tema |
|-----|------|
| [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](../2_modulos/2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_DEPOSITO.md) | Report operativa |
| [CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md](../2_modulos/2.3_report/depositos/CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md) | Puente índice |
| [CHUSAR_TABLET_DEPOSITO_CAJAS.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_CAJAS.md) | Cajas matriz 18 |
| [CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md) | Alerta 1 · jefa salón |

---

## Smoke post-deploy

1. Tablet `/deposito` → tab Alertas · badge si hay faltantes vidriera  
2. Tablet tab Stock → ⭐ en columna grada activa  
3. Report `/depositos-bazzar/2100?tab=operativa` → vitales + grilla  
4. Report `?tab=filtros-indice` → BCL 654  

Evidencia: `tablet-bazzar/docs/evidencia/CIERRE_DEPOSITO_CAJAS_20260627.json`

---

**Cerrada y publicada — orden Director — 2026-06-27**
