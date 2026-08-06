# CHUSAR — Hotfix · tachado LPN = LPC03 (precio de venta)

**Código:** `2.2.1.49`  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta** · orden Director **depliega**  
**App:** RIMEC Web (`rimec-web`) · CP + PE  
**Error:** `4.01.04.009`  
**Severidad:** 🔴 crítica (precio de venta / integridad comercial)  
**Deploy prod:** `bcc476c` · alias https://rimec.com.py · Vercel READY 2026-08-06

---

## 1 · Síntoma (Director)

Sesión **LPN** y sesión **LPC03** sobre el mismo SKU PE (ej. BEIRA RIO `4076-1304-9569-15745`):

| Lista | Tachado (antes) | Neto (antes) | Etiqueta desc |
|-------|-----------------|--------------|---------------|
| LPN | **153.300** | ~115.000 | 25% |
| LPC03 | **153.300** ← mismo | ~103.500 | 10% + 25% |

El precio **sin descuento** no puede ser idéntico entre LPN y LPC03 Normal. Impacto: venta e integridad del stock.

---

## 2 · Causa raíz

1. Vista PE (`v_stock_pe_rimec`) suele traer `lpn` lleno y **`lpc03` / `lpc04` null**.  
2. `resolverLpcTier` devolvía `null` sin `lpn_raw` ni LPC almacenado.  
3. `getPrecioActivoPe` **caía a LPN** → tachado LPC03 = LPN.  
4. Los descuentos PE (10% LPC03 + dictado) se aplicaban sobre base LPN → neto incorrecto (~103.500 en vez de ~115.898).

Compra previa: misma ley en `getPrecioActivo` / `precioDeLoteCatalogo` / snapshots carrito (`precio_lpc03`). CP con `lpc03` real en BD ya difería; el hueco grave era PE + fallback.

---

## 3 · Fix (erradicación)

Archivo canónico: `rimec-web/lib/precioLista.ts`

| Regla | Comportamiento |
|-------|----------------|
| PROMOCIONAL | LPC03 = LPC04 = LPN |
| Normal + LPC almacenado **≠** LPN | Usar tier BD |
| Normal + LPC null o **pegado a LPN** | `lpcDesdeLpn(LPN, 1.12\|1.20)` |
| `getPrecioActivoPe` lista 3/4 | **Jamás** fingir LPN si el tier falla |

Aplica a: grilla/acordeón, panel origen, carrito, validación FI — todos pasan por `getPrecioActivo` / `getPrecioActivoPe`.

---

## 4 · Números del SKU captura (post-fix)

| Lista | Tachado | Neto (25% / 10%+25%) |
|-------|---------|----------------------|
| LPN | 153.300 | 114.975 |
| LPC03 | **171.700** (×1.12) | **115.898** |

---

## 5 · Smokes

```bash
cd rimec-web
npx tsx scripts/smoke_ley_precios.ts
npx tsx scripts/_audit_precio_lpn_lpc03.ts   # PE SKU captura
npx tsx scripts/_audit_precio_cp_lpc.ts      # muestra CP: LPN ≠ LPC03 Normal
```

---

## 6 · Anti-patrones

1. Fallback silencioso LPC03→LPN en UI.  
2. Tratar `lpc03 === lpn` en BD como tier válido Normal.  
3. Smoke solo neto/descuento sin chequear **tachado por lista**.  
4. Asumir que PE siempre trae columnas LPC llenas.

---

## 7 · Relacionados

- Ley Web: `2.2.1.0.11` · `precioLista.ts`  
- PROMO = LPN: `2.2.1.0.1` · motor `2.3.1.7.1.0.1`  
- Redondeo centena: `2.3.1.7.1.0.2`
