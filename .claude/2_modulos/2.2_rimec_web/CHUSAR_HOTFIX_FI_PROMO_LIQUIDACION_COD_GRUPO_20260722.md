# CHUSAR — Hotfix FI promo ≠ liquidación · COD.GRUPO Carlos (R-FI-2)

**Subcuenta:** **2.2.1.20** · padre RIMEC Web  
**Error:** `4.01.06.002`  
**Fecha:** 2026-07-22  
**Keyword Director:** Documenta + soluciona (factura HECTOR 19 ítems)  
**Estado:** ✅ Deploy prod · `c7dc656` + tipado `db17dd8` · Vercel Ready

---

## Ley (inviolable)

**R-FI-2:** una FI = **1 PP × 1 Marca × 1 Caso × 1 cadena comercial**.

| Cadena | Origen Carlos (COD.GRUPO) | Flags PE |
|--------|---------------------------|----------|
| **LIQUIDACION** | Calzado dígitos 5–6 = `04` · Confecciones 7–8 = `04` | `es_liquidacion` / `cadena_comercial=LIQUIDACION` |
| **PROMOCIONAL** | Calzado `02` · Confecciones `03` | `es_promo` / `cadena_comercial=PROMOCIONAL` |
| **REGULAR** | Calzado `01` (u otro) | resto |

**Prohibido** mezclar LIQUIDACION y PROMOCIONAL (ni con REGULAR) en la misma FI.

Mapa: MIG-171 `grupo_digito_mapa` · decoder `report/src/lib/pilares/cod-grupo-decode.ts` · Web `lib/pilares/codGrupoCadena.ts`.

---

## Qué falló (HECTOR · 19 ítems)

Carrito vivo: **7 promo + 3 liq + 9 regular**, mismo `caso_id` BR-VZ.

1. R-FI-2 en **confirmar** (`ac02e15`) leía stock — OK al confirmar.
2. Al **hidratar** carrito, `carritoStockEnrich` **no** traía `es_liquidacion` / `es_promo` / `cadena_comercial` / `cod_grupo`.
3. `fragmentarCarrito` veía solo `caso_id` → una FI mezclada en UI.
4. Liquidación **es** el dígito Carlos (`0201040000` → LIQUIDACION), no el nombre del caso.

## Fix

| Archivo | Cambio |
|---------|--------|
| `lib/carritoStockEnrich.ts` | SELECT PE + señales + `cod_grupo` |
| `store/sesionVenta.ts` | Overlay señales al hidratar (stock > cache) |
| `lib/pilares/codGrupoCadena.ts` | Cadena desde COD.GRUPO |
| `lib/facturaCelulaClave.ts` | Fallback `cod_grupo` si faltan flags |
| `lib/asegurarSegregacionFiPayload.ts` | Lee `cod_grupo` en guardia servidor |
| Catálogo add-to-cart | Persiste `cod_grupo` en meta |

**Evidencia HECTOR:** 19 ítems → **7 FI** · una sola `· LIQUIDACION` (3 ítems) · sin mezcla.

## Deploy (quirúrgico)

| Campo | Valor |
|-------|--------|
| Repo | `rimec-web` `main` |
| Commits | `c7dc656` (hydrate + COD.GRUPO) · `db17dd8` (tipado TarjetaCatalogo) |
| Vercel | Production Ready |
| Prod | https://rimec-web.vercel.app · https://www.rimec.com.py |
| **NO incluido** | slider precios · filtros catálogo WIP |

Orden Director: Documenta + soluciona (factura HECTOR) 2026-07-22.

---

**CHUSAR — integrado**
