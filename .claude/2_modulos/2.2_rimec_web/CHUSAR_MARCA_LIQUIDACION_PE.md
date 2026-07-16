# CHUSAR — Marca liquidación PE (catálogo RIMEC Web)

**Código:** **2.2.1.0.13**  
**Fecha:** 2026-07-16  
**Deploy:** orden directa Director · prod rimec-web  
**Shibboleth:** Andrés, el que viene.

---

## Qué es

En **Pronta entrega**, el flag comercial `es_liquidacion` (vista `v_stock_pe_rimec` · MIG-162) marca artículos de liquidación SDRM.  
CP (tránsito) **no** tiene `es_liquidacion`.

---

## UI

| Pieza | Rol |
|-------|-----|
| `LiquidacionPeBadge` | Badge «Liq.» esquina imagen |
| `CatalogoGrid` | `shellVariant = liquidacion` + badge si PE liq. |
| `CatalogTarjetaDeposito` | Pulso borde esmeralda (`catalog-card-liquidacion-pulse`) |
| `catalogoComercial.esLiquidacionPe` | Detección `es_liquidacion` / cadena |
| Filtro comercial | `catalogoFilters` · `eq('es_liquidacion', true)` en PE |

Casos promo (no liquidación): `PromoCasoBadge` + `esPromoTarjeta` — independientes del badge Liq.

---

## Datos

- Columna: `v_stock_pe_rimec.es_liquidacion`
- Select catálogo PE: `CATALOGO_STOCK_SELECT_PE` incluye `es_liquidacion`, `es_promo`, `cadena_comercial`
- Evidencia BD (2026-07-16): ~1709 / ~12100 filas PE en liquidación

---

## Relación con descuentos / FI

Liquidación es **marca de catálogo**. Los % D1–D4 siguen el flujo **Guardar descuento por FI** ([CHUSAR_DESCUENTOS_FI](./docs/CHUSAR_DESCUENTOS_FI_TRANSACCION_20260715.md) · MIG-160).  
Caso comercial en cabecera FI: [CHUSAR_FI_CASO](../2.3_report/facturacion/CHUSAR_FI_CASO_CABECERA_DESDE_PP.md).

**Shibboleth:** Andrés, el que viene.
