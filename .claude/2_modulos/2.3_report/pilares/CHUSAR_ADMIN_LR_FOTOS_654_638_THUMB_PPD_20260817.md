# CHUSAR — Admin L×R · protocolo fotos 654/638 + thumb PPD + stem sin 0-0

**Código:** **2.3.5.15**  
**Fecha:** 2026-08-17  
**Keyword:** Documenta + **despliega** (Director)  
**App:** Report `:3000` / prod `https://rimec-report.vercel.app`  
**Ruta:** `/pilares/linea-referencia`  
**Error:** **4.90.03.012** (RESUELTO)  
**Commits Report:** `32b4ba3` · `0537401` · `5087efd`  
**Prod:** https://rimec-report.vercel.app · `5087efd` · READY 2026-08-17  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES · 2026-08-17**

---

## Problema Director

Admin Línea × Referencia (maestra de filtros Web · AM · PE) mostraba **cámara gris** en 654 (ej. línea **7230** refs 100–103) mientras **Alejandro Magno** ya mostraba la foto real (`7230-100-29516-…`).

Pregunta: *¿Cómo no vamos a tener imágenes?*

---

## Causa raíz

| Capa | Enfermedad |
|------|------------|
| Thumb 654 | Solo leía retail `registro_st_vt_rc_reposicion` |
| Caso 7230 | Solo **PROGRAMADO** / PPD — **0 filas retail** con esa L×R |
| Magno | Arma stem **L-R-M-C** desde `pedido_proveedor_detalle` (material+color) aunque `imagen_nombre` sea null |
| UI stem | `Number("") === 0` → candidatos falsos `7230-100-0-0.jpg` si faltaba thumb |

**Las fotos estaban en Storage.** Fallaba el **tratamiento** en el Admin, no el bucket.

---

## Ley — protocolo fotos en este Admin

Canon: `LEY_UNIVERSAL_IMAGENES_PRODUCTO.md` §2 · dual **2.01.04**.

| Rama | Proveedor | Stem Storage | Match Admin L×R | Cascada datos |
|------|-----------|--------------|-----------------|---------------|
| **654** calzado | `tipo_v2_id=1` | `L-R-M-C.jpg` (guiones) | Exacto **L×R** | 1) retail · 2) **PPD** material+color → misma foto Magno |
| **638** Kyly | `tipo_v2_id=2` | `L_color.jpg` (underscore) | **Solo línea** (no ref) | 1) retail por línea · 2) `v_stock_rimec.imagen_url` |

**Prohibido:** mezclar guiones 654 con underscore 638 · inventar segmentos `0` · declarar “sin foto” si Magno ya la muestra.

### Stock Pronta entrega = SDRM (**2.3.5.12**)

Cuando el Director dice **stock / Pronta entrega** en este Admin:

- Scope = **SDRM venta hoy** (`registro_st_vt_rc_reposicion` · `tipo_movimiento=stock` · qty&gt;0) ∩ fila PE.
- **SDRM/PE no son la verdad de FKs** — solo acotan qué filas editar.
- Verdad de filtros Web/AM/PE = maestra `linea` + `linea_referencia`.

---

## Ejecutado

| Archivo | Cambio |
|---------|--------|
| `report/src/lib/pilares/queries.ts` | `loadPrimeraImagenLineaReferencia` 654 → fallback PPD; `sqlExisteImagenRetail` OR molécula PPD |
| `report/src/app/api/pilares/linea-referencia/route.ts` | `tiene_imagen` = nombre **o** (material+color) |
| `report/src/lib/retail/product-image.ts` | `normCodigo` no convierte `""`→`0`; stem 4 solo si M **y** C reales |

**Smokes:**

```text
npx tsx scripts/_smoke_lr_654_thumb_ppd.ts   → PASS_654_THUMB_PPD
npx tsx scripts/_smoke_lr_638_thumb_por_linea.ts → PASS_638_THUMB_POR_LINEA
npx tsx scripts/_smoke_lr_filtro_pe_deposito.ts → PASS_LR_PE_DEPOSITO
```

---

## Smoke Director (prod)

1. https://rimec-report.vercel.app/pilares/linea-referencia?tipo_v2_id=1&q=7230 → thumbs visibles (no cámara) en refs 100–103.  
2. `tipo_v2_id=2` + STOCK **Pronta entrega** → solo universo SDRM; miniaturas por línea.  
3. Ctrl+F5 si cache.

---

## Relacionados

- Thumb 638 por línea **2.3.5.10** · PE=SDRM **2.3.5.12** · visión cobertura **2.3.5.14** · STOCK scopes **2.3.5.19**  
- Error **4.90.03.012** · Ley imágenes §2 / §4.6  
- AM Magno fotos (mismo stem 654)
