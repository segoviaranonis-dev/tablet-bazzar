# CHUSAR — Web · PROMOCIONAL sin +10 % LPC03

**Código:** **2.2.1.34**  
**Par Report:** **2.3.1.10.1.4.4** · [CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_20260729.md](../2.3_report/deposito_rimec/CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_20260729.md)  
**Fecha:** 2026-07-29 · **Keyword:** Documenta  
**Shibboleth:** Andrés, el que viene.

---

## Contrato UI / carrito

| Superficie | Comportamiento PROMOCIONAL + lista LPC03 |
|------------|------------------------------------------|
| Badge imagen | Solo % dictado (ej. `−25%`) — **nunca** `−10%+25%` |
| Precio neto acordeón | Cascada sin Grado 1 |
| FI carrito | `descuento_1` = dictado · no fuerza 10 |
| Editor descuentos | No autocompleta D1=10 si cadena/caso PROMOCIONAL |

Detección promo: `cadena_comercial === 'PROMOCIONAL'` (FI) · `esPromoTarjeta` (catálogo).

---

## Archivos

- `lib/resolverDescuentosFiPe.ts`
- `lib/pePrecioNetoCatalogo.ts`
- `lib/asegurarFacturasDescuentosLote.ts`
- `components/catalog/PeDescComercialBadge.tsx`
- `components/EditorDescuentosFi.tsx`
- `components/catalog/CatalogLotesAcordeon.tsx`
- `app/CatalogoGrid.tsx`
