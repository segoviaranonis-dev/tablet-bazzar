# ETAPA — RIMEC Web · Pronta entrega + CP (solo local)

**Código:** `RIMEC-WEB-PE-LOCAL-20260706`  
**Módulo:** `2.2_rimec_web` · puerto `:3001`  
**Estado:** ✅ **CERRADA** 2026-07-12 — ver [ETAPA_RIMEC_WEB_PE_LOCAL_20260706_CERRADA.md](./ETAPA_RIMEC_WEB_PE_LOCAL_20260706_CERRADA.md) · prod tip `c757dbf`  
**Director:** Héctor Segovia  
**Ejecutor:** Cursor (Auto) · Claude Code si SQL/migración

---

## Objetivo

Desarrollar y validar catálogo **Compra previa + Pronta entrega** en **local**, con imágenes NIIF y filtros completos, **sin** tocar Git prod ni Vercel hasta cierre de etapa.

**CHUSAR go-live:** [CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md](../2_modulos/2.2_rimec_web/CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md) (**2.2.1.2**)

---

## Prod sellada (go-live 2026-07-12)

| Campo | Valor |
|-------|--------|
| **Sello vigente** | **`c757dbf`** |
| Histórico | `f408fc2` (solo CP) |
| URL | https://rimec-web.vercel.app |
| Alcance | CP + PE (calzado/confecciones) |
| Regla | `chusar-deploy-solo-cierre-etapa.mdc` |

---

## Alcance local

| # | Entrega | Doc / código |
|---|---------|----------------|
| 1 | PE visible en catálogo local | `v_stock_pe_rimec` · flag local CP+PE |
| 2 | Filtros sidebar + header poblados | `/api/catalogo/filtros` · `header-filtros` |
| 3 | Imágenes NIIF PE (modal 4232·409) | [CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md](../2_modulos/2.2_rimec_web/CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md) |
| 4 | Tarjetas multi-origen CP vs PE | `lib/catalogoOrigen.ts` · `agruparTarjetasCatalogo.ts` |
| 5 | `/estadisticas` sin timeout | `lib/controlStock/fetchControl.ts` alineado MIG-138 |
| 6 | **PROMOCIONAL · LPC03=LPN + badge PROMO** | [CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md](../2_modulos/2.2_rimec_web/CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md) · `:3001` local |
| 7 | **CABECERA DE FILTROS catálogo** | [CHUSAR_CATALOGO_CABECERA_FILTROS.md](../2_modulos/2.2_rimec_web/CHUSAR_CATALOGO_CABECERA_FILTROS.md) · **2.2.1.1** |
| 8 | **Precio PE LPC03 → LPN + go-live doc** | [CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md](../2_modulos/2.2_rimec_web/CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md) · **2.2.1.2** |

---

## Bitácora avances local

| Fecha | Objetivo | Doc |
|-------|----------|-----|
| 2026-07-12 | Smoke CP + PE calzado + PE confecciones + build PASS · tip `c757dbf` | [CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md](../2_modulos/2.2_rimec_web/CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md) |
| 2026-07-11 | Precio pendiente PE → `getPrecioActivoPe` | `2cccc0e` |
| 2026-07-08 | Carrito PE · validar · confirmar · anti-duplicado | [CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md](../2_modulos/2.2_rimec_web/CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md) |
| 2026-07-08 | Aprobaciones · badge PRONTA ENTREGA | [CHUSAR_APROBACIONES_PE_BADGE.md](../2_modulos/2.1_control_central/modules/aprobacion_pedidos/CHUSAR_APROBACIONES_PE_BADGE.md) |
| 2026-07-08 | CABECERA DE FILTROS · TONO · hotfix `color_tono_canon` vista | [CHUSAR_CATALOGO_CABECERA…](../2_modulos/2.2_rimec_web/CHUSAR_CATALOGO_CABECERA_FILTROS.md) |
| 2026-07-07 | Excepción LPC03=LPN + código Web/motor | [CHUSAR_EXCEPCION…](../2.3_report/motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) |
| 2026-07-07 | Badge PROMO + preview dev | [CHUSAR_PROMOCIONAL_UI…](../2_modulos/2.2_rimec_web/CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md) |

**Regla Director:** documentar cada micro-objetivo aquí antes de deploy.

## Pausa sesión 2026-07-09 noche

Director: continuaremos mañana. Handoff Cursor:

→ [CURSOR_CONTINUAR_RIMEC_WEB_PE_LOCAL.md](../1_fundamentos/1.1_protocolos/CURSOR_CONTINUAR_RIMEC_WEB_PE_LOCAL.md)

Terminales dev **3000/3001/3002/3004** cerradas. Etapa **sigue abierta** — no es cierre de etapa.

## Criterio cierre (go-live)

- [x] Smoke local catálogo: CP + PE calzado + PE confecciones + `npm run build` PASS
- [ ] Smoke: PE agregar → VALIDAR → CONFIRMAR → badge en Aprobaciones (Director)
- [ ] Rechazar duplicado PVR si aplica (390121 / 936272)
- [ ] Lightbox 4232·409 PASS visual Director
- [x] `npm run build` PASS
- [x] Tip limpio `c757dbf` (sin scripts basura)
- [ ] 6 pasos cierre etapa + `etapas.json` → `hecho` → **recién ahí deploy prod**

---

## Contexto incendio resuelto

[CHUSAR_HOTFIX_CATALOGO_DEPLOY_20260706.md](../2_modulos/2.2_rimec_web/CHUSAR_HOTFIX_CATALOGO_DEPLOY_20260706.md)

---

## Comando rápido

```bash
cd rimec-web && npm run dev
# http://localhost:3001
# PE: ?origen_tipo=PRONTA_ENTREGA&ramo_tipo=CALZADO|CONFECCIONES
```

---

**Documenta:** 2026-07-12 · go-live smoke + CHUSAR 2.2.1.2
