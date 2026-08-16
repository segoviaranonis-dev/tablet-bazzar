# CHUSAR — RIMEC Web · UI responsiva (móvil + tablet)

**Código:** **2.2.1.55**  
**Fecha:** 2026-08-16  
**Keyword:** **Inicia etapa** · plan Director  
**Etapa:** [ETAPA_RIMEC_WEB_UI_RESPONSIVE_20260816.md](../../4_etapas/ETAPA_RIMEC_WEB_UI_RESPONSIVE_20260816.md)  
**App:** RIMEC Web `:3001` / prod  
**Estado:** 🟡 **EN CURSO**  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible · `5.01.00.025`

---

## 0 · Ley

| Sí | No |
|----|-----|
| Layout · CSS · Tailwind · markup wrapper · viewport · safe-area | Precios · filtros Tipo/Promo/LIQ · APIs · auth · confirm carrito · merge saldo |
| Breakpoints **375 / 768 / 1024+** | Refactor de estado de filtros |
| Un deploy prod al final tras smoke local | Deploy parcial mid-etapa |

---

## 1 · Superficies

| Pri | Ruta | Archivos |
|-----|------|----------|
| P0 | Shell + Header | `layout.tsx` · `Header.tsx` |
| P0 | Catálogo | `CatalogoClient` · `FiltrosCatalogo` · `CatalogoFiltrosSidebar` · `CatalogoGrid` · `globals.css` |
| P1 | Carrito / Pedidos / Mis facturas | `carrito/page` · `pedidos/page` · `mis-facturas/page` |
| P2 | Login / Estadísticas | `login/page` · `estadisticas/` |

---

## 2 · Hallazgos (audit)

| ID | Breakpoint | Hallazgo | Severidad | Fix |
|----|------------|----------|-----------|-----|
| RW-R-01 | 375 | Header: origen CP/PE + search en una fila → overflow | Alta | Labels cortos móvil · wrap · padding |
| RW-R-02 | 375 | Sin `viewport` export explícito Next 15 | Media | `export const viewport` |
| RW-R-03 | 375/768 | Lightbox / FAB `fixed` sin safe-area | Media | `100dvh` + safe-area |
| RW-R-04 | 375 | main `px-4` OK; header `px-6` apretado | Baja | `px-3 sm:px-6` |
| RW-R-05 | 375 | Carrito/pedidos tablas anchas | Alta | overflow-x / stack |
| RW-R-06 | 375 | Estadísticas `min-w-[480px]` | Media | wrap overflow |
| RW-R-07 | 768 | Sidebar details + filtros cabecera | Validar | touch + scroll |

---

## 3 · Checklist smoke

| Check | 375 | 768 | 1024 |
|-------|:---:|:---:|:----:|
| Sin scroll-x documento | ✅ | ✅ | ✅ |
| Header origen usable | ✅ | ✅ | ✅ |
| Catálogo filtros + grilla | ✅ | ✅ | ✅ |
| Lightbox usable | ✅ | ✅ | ✅ |
| Carrito / pedidos | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |

**Smoke local 2026-08-16:** `:3001` LOGIN/HOME/CARRITO/PEDIDOS HTTP **200** · viewport device-width presente.

---

## 4 · Archivos tocados (layout only)

- `app/layout.tsx` · `viewport` + main `overflow-x-clip`
- `app/globals.css` · html/body clip
- `app/components/Header.tsx` · fila origen + labels cortos + tap 44px
- `app/CatalogoClient.tsx` · filtros details · min-w-0
- `app/CatalogoGrid.tsx` · lightbox dvh/safe-area · FAB
- `app/carrito/page.tsx` · `app/pedidos/page.tsx` · `app/mis-facturas/page.tsx`
- `app/login/page.tsx` · `app/estadisticas/page.tsx` · `TablaJerarquicaControl.tsx`

---

## 5 · Deploy

| Campo | Valor |
|-------|-------|
| Commit | _(al deploy)_ |
| Prod | https://rimec-web.vercel.app |
| Sellado previo | `f408fc2` → se actualiza con este lote |

---

**Shibboleth:** Andrés, el que viene.
