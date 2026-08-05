# Protocolo integral — Imágenes + carga catálogo RIMEC Web

**Palabras clave Director:** `imagen` · `desbordamiento de imagen` · `las imagenes no se ven bien` · `problemas de imagen` · `infección` · `marco violado` · `Recorte calzado`  
**App:** RIMEC Web (`rimec-web/`) · puerto local **3000**  
**Director:** Héctor Segovia · **2026-07-07**  
**Estado:** ✅ Aplicado en código + Storage batch cerrado para SKUs con origen

---

## Qué resuelve (integral, no parches SKU a SKU)

| Síntoma | Capa | Solución canónica |
|---------|------|-------------------|
| Punta/tacón cortados en grilla | Storage `sm/` con crop | Regen **contain** desde `img_art` · scripts `erradicar_recorte_*.py` |
| Grilla carga tier recortado aunque CSS sea contain | Front URL chain | `productImageCandidatesForUi` — **flat → md → lg**, excluir `sm/` |
| Foto “sale del cuadro” / infección marco | UI | `ProductImage` + `cadena-thumb-frame` · paridad Tablet `/cadena` |
| Usuario espera segundos al pasar CP → PE | Carga | **Prefetch PE** tras primera carga CP · cache + decode imágenes |
| PE abre vacío o en confecciones | UX default | **Pronta entrega preestablecida en Calzados** (`ramo_tipo=CALZADO`) |

**Ley madre:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](../2.1_control_central/docs/LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) (`2.01.04.021`) · anexo [LEY_INTEGRIDAD_VISUAL_IMAGEN.md](../2.1_control_central/docs/LEY_INTEGRIDAD_VISUAL_IMAGEN.md)  
**Tiers Storage:** [NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md](../2.1_control_central/docs/NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md)  
**Errores:** [INDICE_ERRORES.md § 4.90.03](../../5_errores/INDICE_ERRORES.md)

---

## Flujo de carga catálogo (orden obligatorio)

### 1 · Compra previa (default)

- URL sin `origen_tipo` → vista `v_stock_rimec` (CP).
- Carga **síncrona** en pantalla — objetivo: lista visible en **pocos segundos**.
- No bloquear con prefetch PE.

### 2 · Prefetch Pronta entrega (background)

Tras CP **terminada** (`loading=false` + tarjetas > 0):

```
CatalogoClient → prefetchPeCatalogWhenIdle()
  → GET /api/catalogo/tarjetas?origen_tipo=PRONTA_ENTREGA&ramo_tipo=CALZADO
  → GET /api/catalogo/filtros (mismos filtros)
  → cache 15 min + preloadImageDecoded (36 thumbs)
```

**Código:** `rimec-web/lib/catalogoPeWarmCache.ts`  
**Hook:** `rimec-web/app/CatalogoClient.tsx` (useEffect post-CP)

### 3 · Pronta entrega (instantánea si cache caliente)

- Pill **Pronta entrega** → `origen_tipo=PRONTA_ENTREGA` + **`ramo_tipo=CALZADO`**.
- URL directa `?origen_tipo=PRONTA_ENTREGA` → default **Calzados** si no hay `ramo_tipo`.
- Si hay cache warm: pintar tarjetas **sin spinner**; refresh en background.

**Código:** `rimec-web/app/page.tsx` · `FiltrosCatalogo.tsx`

---

## Capa imagen — front (contención)

| Pieza | Ruta |
|-------|------|
| Cadena URL flat-first | `lib/productImage.ts` |
| Componente único | `components/ProductImage.tsx` |
| Marco grilla | `app/globals.css` — `cadena-thumb-frame` |
| Tarjeta catálogo | `components/catalog/CatalogTarjetaDeposito.tsx` |
| Decode cache | `lib/image-decode-cache.ts` |

**Regla:** prohibido `<img>` suelto en catálogo. Thumb **nunca** prioriza `sm/` si BD apunta ahí.

---

## Capa imagen — Storage (origen)

| Job | Vista | Evidencia |
|-----|-------|-----------|
| PE | `v_stock_pe_rimec` | `control_central/evidencia/PE_ERRADICAR_LOG.txt` |
| CP | `v_stock_rimec` | `control_central/evidencia/RIMEC_WEB_ERRADICAR_LOG.txt` |
| Retry unificado | PE+CP fallos | `RETRY_UNIFICADO_20260707_*.json` |

Scripts: `control_central/tools/erradicar_recorte_pe.py` · `erradicar_recorte_rimec_web.py` · `retry_fallos_unificado.py`

**Cobertura:** 100 % SKUs **con JPG en img_art/local**. ~2626 PE sin archivo en red — requiere sync img_art (no arreglable solo en CSS).

---

## Confecciones (material 638)

- El stock PE cargado es **mayormente confección** (Kyly 638).
- Default **Calzados** en PE es correcto para operación calzado; si grilla vacía → pill **👕 Confecciones**.
- Imágenes confección: mismo protocolo contain; gaps restantes = SKUs sin origen en `img_art` o material 638 pendiente batch.
- Reglas proveedor: `3_arquitectura/3.2_venta_tienda/REGLAS_PROVEEDOR_638.md`

---

## Checklist agente (keyword imagen / desbordamiento)

1. Leer **este doc** + `LEY_INTEGRIDAD_VISUAL_IMAGEN.md`
2. Índice errores § **4.90.03** — abrir pie que coincida
3. ¿FAIL solo algunos SKU? → auditar Storage tier, no parchear CSS aislado
4. ¿Espera al cambiar CP→PE? → verificar `catalogoPeWarmCache` + Network prefetch
5. Smoke: `http://localhost:3000` CP → esperar carga → Pronta entrega → **sin spinner largo** + zapatos **contenidos** en marco

---

## Índices que apuntan aquí

- [2.2 RIMEC Web INDICE.md](./INDICE.md)
- [2.1 Control Central INDICE.md](../2.1_control_central/INDICE.md)
- [PALABRAS_CLAVE_DIRECTOR.md](../../1_fundamentos/1.1_protocolos/PALABRAS_CLAVE_DIRECTOR.md) fila #10

---

**Shibboleth:** 7 años · La foto es dato de primera clase — Storage + UI + carga, las tres patas.
