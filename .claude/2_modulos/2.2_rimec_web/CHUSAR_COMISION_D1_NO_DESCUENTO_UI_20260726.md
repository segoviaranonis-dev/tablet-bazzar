# CHUSAR — D1 diccionario PE = comisión vendedor (no descuento UI)

**Código:** **2.2.1.26.1**  
**Par Report:** **2.3.1.10.1.4** · Asignación de descuentos  
**Fecha:** 2026-07-26  
**Keyword:** Documenta  
**Shibboleth:** Andrés, el que viene.

---

## Ley (Director)

El campo `pe_diccionario_cadena.descuento_d1_pct` (fallback 2 % LIQ/PROMO · 4 % NORMAL/COMUN) **no es descuento comercial**.

Es la **lógica de comisión de vendedores** — dato de la factura interna / empalme para el **módulo de comisiones** (aún no construido).

| Qué | Dónde | UI carrito |
|-----|--------|------------|
| Comisión D1 | `pe_diccionario_cadena.descuento_d1_pct` · API `comisionD1PeDesdeDiccionario` | **Prohibido imprimir** «Desc.: X%» |
| Descuento comercial | Asignación Report → sync Web (etapa `ASIGNACION-DESCUENTOS-PE-20260726`) | Sí · cuando exista sync |
| Editar descuentos | Modal FI · descuentos reales del vendedor/dictador | Sí |

## Código

- `rimec-web/lib/peDiccionario.ts` — `aplicarDescuentoDiccionarioPe` **ya no rellena** Descuentos4 de precio.
- `rimec-web/app/carrito/page.tsx` — sin línea «Desc.:» en cabecera FI.
- Empalme futuro: leer `comisionD1PeDesdeDiccionario` / columna BD en módulo comisiones.

## Etiquetas UI PE (carrito **y** Aprobaciones CASO)

Clave interna de fragmentación **no cambia**. Solo badge UI:

| Cadena | Badge |
|--------|--------|
| LIQUIDACION | **PE-LIQ** |
| PROMOCIONAL | **PE-PROMO** |
| REGULAR | **PE-NORMAL** |
| COMUN | **PE-COMUN** |

- Web: `etiquetaCasoUiCarrito` · `etiquetaUiPeCorta` en `facturaCelulaClave.ts`.
- Report Aprobaciones campo **CASO**: `etiquetaCasoUiAprobaciones` · doc `2.3.1.3.0.2`.
