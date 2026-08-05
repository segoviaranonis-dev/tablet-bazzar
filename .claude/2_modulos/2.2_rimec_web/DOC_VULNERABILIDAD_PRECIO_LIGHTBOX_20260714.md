# Vulnerabilidad — fuga de precio catálogo (pre-activación)

**Código:** `2.2.1.0.8` · **Error:** `4.01.04.001`  
**Severidad:** 🟡 MEDIA (UI + datos cliente)  
**App:** `rimec-web/` · `:3001` · prod sellada (fix local ⛔ deploy hasta cierre)  
**Detectado:** 2026-07-14 · **Reabrió / cerró UI:** Documenta Director 2026-07-15 · **Reabrió confecciones:** 2026-07-17  
**Estado:** ✅ **RESUELTO UI 2026-07-17** (calzado + confecciones) · residual API JSON (opcional)  
**Shibboleth:** Andrés, el que viene.

---

## Hipótesis Director — **CONFIRMADA**

> Antes de **Activar venta** (cliente + lista + plazo), los precios deben estar **ocultos**.

---

## Línea de tiempo

| Fecha | Hallazgo |
|-------|----------|
| 2026-07-14 | Lightbox mostraba `Precio Gs.` sin sesión |
| 2026-07-15 | Corte precios-por-lote mostró **Gs.** bajo badge de pares y en panel expandido **sin** Activar venta (captura Vizzano / BeiraRio · marca_id=2 · TODOS) |
| 2026-07-17 | **Confecciones:** `CatalogConfeccionesTallas` mostraba `formatPrecioGs` en bandas por talla **sin** Activar venta (ley violada) |

---

## Comportamiento esperado (producto)

| Estado sesión | Badge pares | Precio lote / panel | Lightbox | Carrito + |
|---------------|-------------|---------------------|----------|-----------|
| No activa | Visible | **Oculto** | **Oculto** | Activar venta |
| `activa` + cliente + lista | Visible | Visible si hay precio | Visible | Habilitado |

Banner grilla: `🔒 Precios visibles tras activar venta (cliente + lista)`

---

## Causa (2026-07-15)

`CatalogLotesAcordeon` / `CatalogPanelOrigen` renderizaban `formatPrecioGs` **sin** guard `activa`. Lightbox ya estaba alineado; la fuga se movió al acordeón.

---

## Fix aplicado

| Fecha | Archivo | Cambio |
|-------|---------|--------|
| 2026-07-15 | `CatalogLotesAcordeon.tsx` | Precio solo si `activa` |
| 2026-07-15 | `CatalogPanelOrigen.tsx` | `precioCatalogo` solo si `activa` |
| 2026-07-15 | `CatalogoGrid.tsx` | `activa` = hydrated ∧ sesión ∧ `id_cliente > 0` |
| 2026-07-17 | `CatalogConfeccionesTallas.tsx` | Precio solo si `activa`; una banda de tallas pre-sesión |

### Smoke

1. `:3001` sin Activar venta → **ningún** `Gs.` en tarjeta, accordion, lightbox **ni** confecciones (tallas).
2. Activar venta (cliente + lista) → precios por lote / por talla visibles.
3. Desactivar → precios desaparecen.

---

## Vector residual

`/api/catalogo/tarjetas` sigue enviando `lpn`/`lpc*` en JSON. Mitigación opcional: omitir precios sin cookie de sesión de venta.

---

## Nota — descuentos rimec-web ↔ Report (investigación breve)

**Supuesto Director:** desconexión entre descuentos Web y Report.

| Canal | Dónde | Qué hace |
|-------|-------|----------|
| **RIMEC Web** | Carrito · `descuentos` / `descuentos_lote` · `aplicarDescuentos` encadenados % · confirm RPC | Descuentos **comerciales de sesión** sobre precio de lista |
| **Report** | Aprobaciones / FI · lookup `precio_lista` / PPD · historial `4.02.03.005` | Precio **congelado / evento** · no usa el JSON `descuentos_lote` del carrito Web |

**Hallazgo preliminar (este turno):** no hay un motor de descuentos compartido tipado entre apps. Web aplica cascada en carrito; Report opera sobre FI/PPD. Posibles desfases históricos al vincular listado (índice `4.02.03.*`) **no** son el mismo bug que la fuga UI de precio.

**Pendiente OT / turno aparte:** caso concreto Director (cliente + % + FI vs carrito) para cerrar si hay bug de negocio o solo dos capas distintas por diseño.

---

## Relacionados

- Error `4.01.04.001` · [detalle](../../5_errores/detalle/4.01.04.001_rimec-web-precio-lightbox-pre-activacion.md)
- Corte [CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md](./CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md) (**2.2.1.0.11**)
- Excepción PROMO [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](../2.3_report/motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md)
