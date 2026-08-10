# CHUSAR — Catálogo Bazzar · grilla 638 precio × talle (F1)

**Código:** **2.5.1.23** · catálogo maestro `2.05.03.024`  
**Fecha:** 2026-08-07  
**Keyword:** **Documenta** · **Documentación Chusar** · publicar · desplegar  
**App:** `bazzar-web` · local `:3002` · prod https://www.bazzar.com.py  
**Etapa:** `FINAL-BAZZAR-WEB-20260806` · F1 go-live (**2.5.1.18**)  
**Padres:** **2.5.1.11** (grada catálogo) · **2.5.1.9** / `3.02.00.638` · paridad rimec-web `agruparTallasPorPrecio`  
**Estado:** 🟡 **PARCIAL / FALSO PASS** (enmienda Documenta 2026-08-10) — UI buckets OK · **precio×talle vs PPD multi-LPN NO** · error **`4.05.03.004`** · hijo **2.5.1.25**  
**Git / Vercel:** `a96236c` · alias https://www.bazzar.com.py · dpl `79bfdYqRcaFyHh9P34cZV9NSSLSd` (deploy UI; **no** certifica paridad 638)  
**Shibboleth:** Andrés, el que viene.

---

## Espíritu

La tienda B2C debe vender **confecciones 638** como rimec-web: **caja abierta**, precio por **combinación/talle**, UI en **buckets** «Gs. /prenda» + chips de talle. El carrito cobra el precio del bucket elegido.

---

## Ley UI (638 / prendas)

| Pieza | Contrato |
|-------|----------|
| Helper | `bazzar-web/lib/catalogo/agrupar-tallas-precio-638.ts` → `agruparTallasPorPrecio638` |
| Card | `ProductoCard` · buckets precio × talles (`/prenda`) · rango en cabecera si hay >1 precio |
| Datos | Cada `Talla` lleva `precio_web`; remap PPD conserva precio |
| Carrito | `addItem.precio_web` = precio del bucket (fallback producto) |

**654 calzado:** chips de talla sin buckets (sin cambio de modelo).

---

## Fix catálogo vacío (PostgREST anon)

| Síntoma | Causa | Remedio |
|---------|-------|---------|
| `:3002/catalogo` → 0 modelos pese a SANO+precio en BD | `anon` + `v_stock_web` → **statement timeout** | Lectura SSR / search con **`createAdminClient()`** (service_role) |

Auditoría local ya usaba `DATABASE_URL` (por eso «Estadísticas» sí tenía datos).  
**Prod:** requiere `SUPABASE_SERVICE_ROLE_KEY` en Vercel (ya usada en checkout).

---

## Smoke 2026-08-07 (local) — ⚠ insuficiente

| Check | Resultado |
|-------|-----------|
| BD `v_stock_web` vendible | 930 (654: 882 · 638: 48) |
| Catálogo Confecciones | **36 modelos · 48 prendas** |
| Bucket + carrito | 1000031 · P → `precio_web: 54000` (**mono-LPN** — no prueba multi) |

**2026-08-10:** `1000034` PPD 65k+79.5k · grilla 1 bucket → **4.05.03.004** · ver **2.5.1.25**.

---

## Archivos código

- `lib/catalogo/agrupar-tallas-precio-638.ts` (nuevo)
- `app/(public)/catalogo/ProductoCard.tsx`
- `app/(public)/catalogo/page.tsx` · `createAdminClient`
- `app/api/search/route.ts` · idem
- `lib/catalogo/enrich-grada-638.ts` · `precio_web` en remap
- (relacionados lote) `lib/product-image.ts` · `productImageProtocol.ts` · `ProductImage.tsx` · `supabase/v_stock_web.sql`

---

## Navegador / deploy

- Nodo **2.5.1.23** en `arbol-modulos.json` (`nuevo: true`)
- `productos.json` → `bazzar-web.ultimoDeployActivo: true` tras deploy
- Verificar: http://localhost:3004/modulos · prod catálogo Confecciones
