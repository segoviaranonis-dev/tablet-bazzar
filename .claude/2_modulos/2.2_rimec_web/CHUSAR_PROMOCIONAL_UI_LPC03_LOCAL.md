# CHUSAR — RIMEC Web · PROMOCIONAL · UI + LPN=LPC03=LPC04 (solo local)

**Código:** **2.2.1.0.1** · **Etapa:** `RIMEC-WEB-PE-LOCAL-20260706`  
**Motor (regla precio):** [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](../2.3_report/motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) (**2.3.1.7.1.0.1**)  
**Corte:** [CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md](./CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md) (**2.2.1.0.11**)  
**Ratificado:** Director · 2026-07-07 · **Ampliado Documenta:** 2026-07-15  
**Deploy:** ⛔ **prohibido** Git/Vercel hasta cierre etapa — solo `:3001` local  
**Shibboleth:** Andrés, el que viene.

---

## Norte

Cuando el artículo es caso **PROMOCIONAL**:

1. **Precio visible** = LPN para listas LPN / LPC03 / LPC04 (sin +12% ni +20%).
2. **Ubicación precio:** bajo badge de pares **por lote** (acordeón) — no en ficha.
3. **Badge visual «PROMO»** junto a la marca — verde esperanza, sin saturar la tarjeta.

---

## UI — badge PROMO

| Elemento | Detalle |
|----------|---------|
| Componente | `rimec-web/components/catalog/PromoCasoBadge.tsx` |
| Host tarjeta | `CatalogTarjetaDeposito.tsx` · prop `esPromo` |
| Condición | `esCasoPromocional(descp_caso)` → `UPPER(TRIM) = 'PROMOCIONAL'` |
| Ubicación | Header tarjeta, **al lado de la marca** (antes del pill naranja de pares) |
| Lightbox | Misma pill `size="md"` junto al badge de marca |
| Colores | Fondo `#ECFDF5` · texto `#047857` · borde `#6EE7B7` |

**Prohibido:** badge en artículos no promocionales · no duplicar texto «PROMOCIONAL» completo en tarjeta compacta.

---

## UI — precio LPC03

| Archivo | Rol |
|---------|-----|
| `lib/precioLista.ts` | `getPrecioActivo` · `resolverLpc03/04` · **centena** |
| `lib/redondeoCentenaGs.ts` | `ROUND(n/100)*100` canon |
| `lib/formatPrecioGs.ts` | Display Gs. con centena |
| `store/sesionVenta.ts` | Re-export + fragmentación carrito |
| `app/CatalogoGrid.tsx` | Pasa `p.descp_caso` a `getPrecioActivo` |
| `lib/precioLoteCatalogo.ts` | Precio acordeón por lote |
| `app/api/carrito/factura/recalcular/route.ts` | Recálculo factura |
| `scripts/smoke_ley_precios.ts` | Smoke centena + promo |

**Redondeo:** [CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md](../2.3_report/motor_precios/CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md) (**2.3.1.7.1.0.2**)

---

## Preview local (dev)

| Ruta | Uso |
|------|-----|
| `http://localhost:3001/dev/promo-preview` | Comparativa tarjeta normal vs PROMO (solo `NODE_ENV !== production`) |
| `http://localhost:3001/` | Catálogo real · sesión LPC03 · MODARE **7401·102** |

---

## Caso referencia visual

| Tarjeta | L+R | Badge | Precio LPC03 |
|---------|-----|-------|----------------|
| Normal | **7378·223** | — | Gs. 224.600 (LPN×1.12) |
| Promocional | **7401·102** | **PROMO** | = LPN (≠ «Precio pendiente PP») |

Evidencia antes: captura Director 2026-07-07 (7378 OK vs 7401 pendiente).

---

## Estado avance (bitácora)

| Fecha | Hito | Estado |
|-------|------|--------|
| 2026-07-07 | Regla LPC03=LPN documentada + código motor/Web | ✅ local |
| 2026-07-07 | Badge PROMO + preview `/dev/promo-preview` | ✅ local |
| 2026-07-07 | `npm run build` rimec-web | ✅ |
| — | MIG-145 aplicada Supabase | ⏳ pendiente |
| — | Smoke catálogo real 7401·102 | ⏳ pendiente Director |
| — | Git / Vercel prod | ⛔ prohibido hasta cierre etapa |

---

## Regla Director — documentar avances

**Instrucción 2026-07-07:** ir documentando cada objetivo chico logrado en local **antes** de deploy — esta ficha + bitácora en etapa activa.

---

## Índice

- [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](../2.3_report/motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md)
- [ETAPA_RIMEC_WEB_PE_LOCAL_20260706.md](../../4_etapas/ETAPA_RIMEC_WEB_PE_LOCAL_20260706.md)
- [INDICE.md](./INDICE.md)
