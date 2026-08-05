# CHUSAR — Aprobaciones · CASO PE corto (PE-LIQ / PE-NORMAL / PE-PROMO)

**Código:** `2.3.1.3.0.2`  
**Padre:** `2.3.1.3` · badge PE `2.3.1.3.0.1`  
**Par Web:** `2.2.1.26.1` · `etiquetaCasoUiCarrito`  
**App:** Report `/aprobaciones` · células FI · campo **CASO**  
**Fecha:** 2026-07-26 · keyword **Documenta**  
**Shibboleth:** Andrés, el que viene.

---

## Ley (Director)

En **Células de Aprobación**, el campo **CASO** de una FI **Pronta entrega** **no** muestra el batch largo (`PE · pe-import-…`).

Muestra el badge corto de cadena comercial:

| Cadena / señal en `fi.caso` | UI CASO |
|-----------------------------|---------|
| LIQUIDACION / LIQUID | **PE-LIQ** |
| PROMOCIONAL / PROMO | **PE-PROMO** |
| COMUN | **PE-COMUN** |
| resto PE (REGULAR / sin marca) | **PE-NORMAL** |

Misma ley que carrito RIMEC Web (`PE-LIQ` · `PE-NORMAL` · `PE-PROMO` · `PE-COMUN`).

---

## Qué NO cambia

- `factura_interna.caso` en BD (texto batch / segregación R-FI-2) **no se reescribe**.
- Fragmentación FI (PP × Marca × Caso) sigue usando la clave interna.
- CP (compra previa): CASO sigue mostrando el caso comercial del PP / listado.

---

## Código

| Archivo | Rol |
|---------|-----|
| `report/.../aprobaciones-utils.ts` | `etiquetaCasoUiAprobaciones(caso, fi)` |
| `report/.../FiCard.tsx` | Campo CASO usa la etiqueta corta si PE |
| `rimec-web/lib/facturaCelulaClave.ts` | Canónico Web · `etiquetaUiPeCorta` |

---

## Verificar

1. Pedido PE con FI LIQUIDACION + NORMAL (ej. `PVR-2026-403522`).
2. `:3000/aprobaciones` → expandir célula.
3. CASO = **PE-LIQ** / **PE-NORMAL** / **PE-PROMO** — no el string `pe-import-…`.

---

## Relacionados

- [CHUSAR_APROBACIONES_PE_BADGE.md](./CHUSAR_APROBACIONES_PE_BADGE.md) (`2.3.1.3.0.1`)
- [CHUSAR_COMISION_D1_NO_DESCUENTO_UI_20260726.md](../../../2.2_rimec_web/CHUSAR_COMISION_D1_NO_DESCUENTO_UI_20260726.md) (`2.2.1.26.1`)
