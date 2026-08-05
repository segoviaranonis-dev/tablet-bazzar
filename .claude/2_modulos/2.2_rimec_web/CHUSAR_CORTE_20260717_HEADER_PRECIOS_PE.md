# CHUSAR — RIMEC Web · Corte 2026-07-17 (filtros · header · precios · PE)

**Subcuenta:** **2.2.1.14**  
**Padre:** `2.2.1` Catálogo · [INDICE.md](./INDICE.md)  
**Orden Director:** **Documenta** + **despliega** · 2026-07-17  
**App:** http://localhost:3001 · prod https://rimec.com.py / https://rimec-web.vercel.app  
**Shibboleth:** Andrés, el que viene.

---

## Resumen ejecutivo

En un mismo día se cerraron tres frentes de producto en **rimec-web**:

| # | Tema | Error / doc | Estado |
|---|------|-------------|--------|
| 1 | Header: Damas/Niñas/… → **Compra previa \| Pronta entrega** | [CHUSAR_HEADER_ORIGEN_CP_PE_20260717.md](./CHUSAR_HEADER_ORIGEN_CP_PE_20260717.md) · **2.2.1.13** | ✅ prod |
| 2 | Fuga precio **confecciones** sin Activar venta | `4.01.04.001` · reapertura | ✅ UI + deploy |
| 3 | PE mostraba tarjetas **pedido proveedor** (quincenas) | `4.01.05.001` | ✅ UI + deploy |

También en prod previo del mismo día: sidebar Dimensiones/Molécula · Tono acordeón · orden línea/ref · carga completa del filtro (`5032a86`).

---

## 1 · Header origen (sustitución mega género)

**Orden:** eliminar Damas / Niñas / Niños / Caballeros / Catálogo; poner **Compra previa** y **Pronta entrega**.

| Pieza | Ruta |
|-------|------|
| Header | `app/components/Header.tsx` |
| Doc | [CHUSAR_HEADER_ORIGEN_CP_PE_20260717.md](./CHUSAR_HEADER_ORIGEN_CP_PE_20260717.md) |

Al cambiar CP↔PE se **conservan** filtros compartidos en la URL (marca, tipo, tono, etc.) para no romper el proceso de venta.

---

## 2 · Ley precios ocultos — reapertura confecciones (`4.01.04.001`)

**Ley:** ningún `Gs.` / `formatPrecioGs` visible hasta **Activar venta** (cliente + lista + plazo).

| Antes (2026-07-15) | Reapertura (2026-07-17) |
|--------------------|-------------------------|
| Fix calzado: acordeón + panel + lightbox | `CatalogConfeccionesTallas` seguía pintando `formatPrecioGs(grupo.precio)` **siempre** |

**Fix:** precio solo si `activa`; sin sesión, tallas en una sola banda (sin tipificar precios).

Detalle: [4.01.04.001](../../5_errores/detalle/4.01.04.001_rimec-web-precio-lightbox-pre-activacion.md) · [DOC vulnerabilidad](./DOC_VULNERABILIDAD_PRECIO_LIGHTBOX_20260714.md)

---

## 3 · PE con origen pedido proveedor (`4.01.05.001`)

**Síntoma:** URL `origen_tipo=PRONTA_ENTREGA`, header PE activo, grilla con chips «2da Q. de Septiembre» / «1ra Q. de Octubre» (CP).

**Causa:** `useDeferredValue(filters)` difería también `origen_tipo` → la grilla seguía en cache TODOS/CP mientras el chrome ya decía PE.

**Fix:**

1. Origen / ramo / depósito / quincenas = **inmediatos** (`filtersConOrigenInmediato`).
2. Warm cache rechazado si las tarjetas no respetan el origen pedido (`tarjetasRespetanOrigen`).
3. Chip PE nunca muestra `quincena_desc` de PP (`etiquetaOrigenChip`).

Detalle: [4.01.05.001](../../5_errores/detalle/4.01.05.001_rimec-web-pe-muestra-tarjetas-cp.md)

---

## Layout catálogo vigente

```
HEADER     → Compra previa | Pronta entrega
CABECERA   → conteos · Limpiar · Extender · Tono (acordeón)
SIDEBAR    → DIMENSIONES + MOLÉCULA (paridad Report)
GRILLA     → A→Z línea+referencia · todas las tarjetas del filtro
VENTA      → Activar venta → precios · + cajas/tallas → carrito → confirmar
```

Relacionados: [CHUSAR_CATALOGO_CABECERA_FILTROS.md](./CHUSAR_CATALOGO_CABECERA_FILTROS.md) · [CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md](./CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md)

---

## Commits / deploy (orden Director)

| Commit | Contenido |
|--------|-----------|
| `5032a86` | Sidebar dual · Tono · CP fechas · orden línea/ref |
| `3e57fa7` | Header CP/PE |
| *(este deploy)* | Confecciones sin Gs. pre-venta + PE sin tarjetas CP |

**Prod:** https://rimec.com.py · https://rimec-web.vercel.app

---

## Smoke Director

1. Sin Activar venta · confecciones → **cero** `Gs.` en tallas.
2. Activar venta → precios /p visibles · + talla al carrito.
3. Header **Pronta entrega** → chips «Pronta entrega» / stock local · **sin** quincenas «Q. de …».
4. Header **Compra previa** → quincenas PP OK · filtros marca/tipo se conservan al saltar PE↔CP.

---

**Documentación Chusar:** 2026-07-17 · Cursor · Director «documenta todo todo todo» + «despliega nuevamente»
