# CHUSAR — NIIF Imágenes · RIMEC Web · Pronta entrega + carrito

**Código:** `2.2.1.04`  
**Estado:** ✅ Código aplicado 2026-07-06 · smoke visual Director **pendiente** (modal 4232·409)  
**Ley:** [LEY_INTEGRIDAD_VISUAL_IMAGEN.md](../2.1_control_central/docs/LEY_INTEGRIDAD_VISUAL_IMAGEN.md)  
**Protocolo:** [NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md](../2.1_control_central/docs/NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md)  
**Import batch (keyword Importar imágenes):** [CHUSAR_IMPORT_IMAGENES_BATCH.md](../2.1_control_central/docs/CHUSAR_IMPORT_IMAGENES_BATCH.md)  
**Paridad UI (PASS):** [CHUSAR_TABLET_DEPOSITO_FOTOS.md](../2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_FOTOS.md) · `TarjetaCajaDeposito` · `DepositoCajaFullscreen`  
**Recorte calzado:** [PUNTO_CRITICO_RECORTE_CALZADO.md](../2.1_control_central/docs/PUNTO_CRITICO_RECORTE_CALZADO.md)  
**Paridad Report:** `report/src/lib/retail/product-image.ts` · `RetailProductImage.tsx`

---

## Problema (segunda solicitud Director)

| Síntoma | Causa |
|---------|--------|
| Desbordamiento miniaturas PE / carrito | `<img>` suelto sin marco NIIF · `object-fit` sin `overflow:hidden` |
| Latencia catálogo PE | URLs **planas** (`productos/L-R-M-C.jpg`) — JPEG full-size en lugar de tier **sm/md** |

---

## Problema (tercera solicitud — modal 4232·409 BEIRA RIO)

| Síntoma | Causa |
|---------|--------|
| Lightbox PE corta punta/tacón | CSS inventado `rimec-modal-*` / `rimec-catalog-*` — **no** paridad Tablet depósito |
| Grilla OK en Tablet depósito, FAIL en RIMEC Web | Mismo SKU: Tablet usa `cadena-thumb-frame` + hero `absolute inset-0 object-contain` |
| SKU solo flat en Storage | `sm/`/`lg/` 400 — apps pedían tiers inexistentes |

**Caso fundador modal:** `4232·409` · `4232-409-18923-35312.jpg` · BEIRA RIO.

---

## Solución aplicada

### 1 · Motor tiers (`rimec-web/lib/productImage.ts`)

- Candidatos ordenados: **thumb** → `sm` → `md` → flat legacy  
- **card** → `md` → `sm` → flat  
- **modal / hero** → `lg` → `md` → `sm` → flat  
- **`isFlatOnlyImagenNombre()`** — si el SKU solo tiene flat en Storage, no intentar tiers (evita 400 en cadena)  
- **`enrichImagenUrls()`** — enriquece tarjetas con URLs canónicas por tier  
- Fallback en cadena (misma lógica que Report Retail).

### 2 · Componente único (`components/ProductImage.tsx`)

- Variantes: `thumb` | `card` | `hero` (modal/lightbox)  
- **Copia literal Tablet depósito:** `cadena-thumb-frame` (thumb) · hero con `absolute inset-0 h-full w-full object-contain`  
- Prop `candidates[]` — retry automático sm→md→flat  
- **`allowFlatFallback`** — grilla puede usar flat si tiers faltan; hero modal lo permite explícito  
- **Prohibido** `<img>` suelto en catálogo y carrito.

### 3 · CSS (`app/globals.css`)

- Mantener **`cadena-thumb-frame`** en `@layer components` (misma regla que Tablet)  
- **Eliminado:** clases custom `rimec-modal-*` y `rimec-catalog-*` — inventar CSS = FAIL (4.90.03)

### 4 · Superficies tocadas

| Superficie | Archivo |
|----------|---------|
| Agrupación catálogo | `lib/agruparTarjetasCatalogo.ts` — `imagen_url` canónica sm |
| Grilla + lightbox | `app/CatalogoGrid.tsx` — lightbox: contenedor `aspect-square` + `ProductImage variant="hero"` |
| Carrito / factura previsible | `app/carrito/page.tsx` |
| Fragmentación items | `store/sesionVenta.ts` — `material_code` + `color_code` en miniatura |

### 5 · Scripts verificación (local)

| Script | Qué valida |
|--------|------------|
| `scripts/verify-catalog-contain.mjs` | Grilla `cadena-thumb-frame` contain |
| `scripts/verify-modal-contain.mjs` | Fixture HTML modal SKU 4232·409 |
| `scripts/verify-modal-live.mjs` | Playwright `:3001` PE — requiere dev + SKU visible |
| `scripts/check-urls-4232.mjs` | HEAD tiers Storage 4232·409 |

**Regla CHUSAR:** fixture PASS **no** cierra ticket — falta confirmación visual Director en navegador.

---

## Criterio PASS auditoría

- Zapato **entero** dentro del marco (aire blanco OK).  
- Network: requests a `.../productos/sm/` o `md/` — **no** JPEG root salvo fallback flat-only.  
- Modal/lightbox: mismo criterio que Tablet depósito fullscreen.  
- Código: `IMG-FAIL-OVERFLOW-THUMB` = FAIL si falta `ProductImage` o CSS inventado.

---

## Smoke local

1. http://localhost:3001/?origen_tipo=PRONTA_ENTREGA — tarjetas verdes PE  
2. Ctrl+Shift+R · abrir lightbox **4232·409** — punta y tacón visibles  
3. DevTools → Network → filtrar `productos/sm` o `lg`  
4. Carrito → miniatura 42×42 contenida (PE + tránsito)

---

## Relación incendio Storage 2026-07-06

371 JPG subidos vía [CHUSAR_IMPORT_IMAGENES_BATCH.md](../2.1_control_central/docs/CHUSAR_IMPORT_IMAGENES_BATCH.md).  
Storage PASS **no** garantiza foto en PE si BD no tiene `imagen_nombre`/`imagen_url` alineado — ver checklist post-import en ese CHUSAR.

---

## Aprobaciones (contexto turno)

Consulta BD: **0 FIs `RESERVADA`** al verificar — bandeja vacía. Si el pedido HUGO de hoy no aparece, reconfirmar desde carrito; debe generar pedido `PENDIENTE` + FI `RESERVADA` para validar en http://localhost:3000/aprobaciones (Nivel Dios).

---

**Orden:** Director · **Documenta** · incendio apagado 2026-07-06 · keyword **Importar imágenes** + PE modal
