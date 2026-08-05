# CHUSAR — Preparación nueva etapa · handoff agente

**Fecha:** 2026-07-11  
**Orden Director:** documentate · preparate · protocolo Chusar  
**Shibboleth:** Andrés, el que viene.  
**Estado:** ⏳ **LISTO PARA `Inicia etapa`** — etapa viva hoy: **ADMIN-IC-PP28** · ver [ACTUAL.md](./ACTUAL.md)

---

## Etapa activa (2026-07-11)

| Campo | Valor |
|-------|--------|
| **Código** | `ADMIN-IC-PP28-20260711` |
| **Doc** | [ETAPA_ADMIN_IC_PP28_PROGRAMADO.md](./ETAPA_ADMIN_IC_PP28_PROGRAMADO.md) |
| **Objetivo** | Parejas IC↔Pre-FI · GENERAR F.I. · PP-28 · 8051/2026 |

---

## Contexto integrado (jornada 2026-07-10)

| Entrega | Estado | Doc |
|---------|--------|-----|
| Inyección imágenes 1510 JPG | ✅ cerrada | [ETAPA_INYECCION_IMAGENES_20260710_CERRADA.md](./ETAPA_INYECCION_IMAGENES_20260710_CERRADA.md) |
| Organigrama rama única Navegador | ✅ publicado | [CHUSAR_ORGANIGRAMA_RAMA_UNICA.md](../1_fundamentos/CHUSAR_ORGANIGRAMA_RAMA_UNICA.md) |
| Grilla Programado v1 | ✅ local | [CHUSAR_STOCK_PROGRAMADO_GRILLA_V1.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_STOCK_PROGRAMADO_GRILLA_V1.md) |
| Hotfix PDF Ventas+Fotos 80 filas | ✅ prod `b60fd9d` | [CHUSAR_VENTAS_FOTOS_PDF.md](../2_modulos/2.3_report/CHUSAR_VENTAS_FOTOS_PDF.md) |
| Hotfix grada CSV `_brand` | ✅ prod `12edb60` | `4.02.03.008` |

---

## Sesión maratón activa (Navegador)

| Campo | Valor |
|-------|--------|
| **Código** | `GRILLA-STOCK-TRES-CATEGORIAS-20260709` |
| **Foco** | CP tab Artículos · informes `/stock-transito/ventas` |
| **Doc** | [CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md) |
| **Etapa padre** | [ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md](./ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md) |

---

## Checklist — cuando el Director diga **Inicia etapa**

| # | Acción |
|---|--------|
| 1 | Crear `.claude/4_etapas/ETAPA_[NOMBRE].md` con objetivo + entregables |
| 2 | Actualizar [ACTUAL.md](./ACTUAL.md) — foco único arriba |
| 3 | `nexus-navegador-holding/config/etapas.json` → fila `trabajoVivo` · `"estado": "en_curso"` |
| 4 | Índice módulo afectado |
| 5 | `arbol-modulos.json` → `"nuevo": true` en nodos doc nuevos |
| 6 | Verificar `:3004/etapas` |

---

## Handoffs paralelos (no bloquean nueva etapa)

| Tema | Próximo paso |
|------|----------------|
| **PP-17** Alfredo | Tab Stock → Preview → Import |
| **373 IC** programado | Autorizar lote · digitación |
| **Facturación PE** | Smoke Carlos · E2E PE→CSV |
| **RIMEC Web PE** | Solo local · prod sellada `f408fc2` |

---

## Puertos dev

| Puerto | App |
|--------|-----|
| 3000 | Report · `npm run dev:clean:3000` si `.next` corrupto |
| 3001 | RIMEC Web |
| 3002 | Bazzar Web |
| 3004 | Navegador Holding |

---

**Agente:** CHUNA leído · Moria + ACTUAL acatados · listo para orden **Inicia etapa** con código y módulo.
