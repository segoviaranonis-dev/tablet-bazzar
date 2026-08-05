# CHUSAR — Imágenes dual proveedor 654 + 638

**Código:** `2.01.04.022`  
**Estado:** ✅ **Integrado** · 2026-07-13 · keyword **Documenta**  
**Ley:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](./LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) (`2.01.04.021`) §2  
**Proveedor:** [REGLAS_PROVEEDOR_638.md](../../3_arquitectura/3.2_venta_tienda/REGLAS_PROVEEDOR_638.md) §7

> Segundo proveedor absorbido en el **mismo bucket** `productos/` con **mismo pipeline tiers** (contain · flat+sm+md+lg · HEAD verify). Solo cambia el **stem** del archivo.

---

## Norte

| Rama | Proveedor | Stem | Apps |
|------|-----------|------|------|
| Calzado | 654 | `L-R-M-C.jpg` | Catálogo CP · PE calzado · Retail calzado |
| Confecciones Kyly | 638 | `L_C.jpg` | PE confecciones · Retail tipo_v2=2 |

**Un bucket · dos convenciones · un marco UI (`ProductImage`).**

---

## Código integrado (2026-07-13)

| Capa | Archivo |
|------|---------|
| TS resolver Web | `rimec-web/lib/productImageProtocol.ts` |
| TS consumo Web | `rimec-web/lib/productImage.ts` |
| TS Report | `report/src/lib/retail/product-image-protocol.ts` · `product-image.ts` |
| Python ops | `control_central/core/imagenes_protocolo.py` |
| Gap PE batch | `control_central/tools/protocolo_imagenes_cerrar_gap.py` → `fetch_imagenes_pe()` |
| Vista BD PE | `report/migrations/148_v_stock_pe_rimec_imagen_dual_proveedor.sql` |
| Catálogo Web | `catalogo-types.ts` · `catalogoData.ts` · `agruparTarjetasCatalogo.ts` |

---

## Inyección (igual para 654 y 638)

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
python tools\subir_carpeta_import_batch.py --carpeta "C:\ruta\jpg_638"
```

| Paso | 654 | 638 |
|------|-----|-----|
| Nombre en carpeta | `1184-1726-32240-15745.jpg` | `4520_1234.jpg` |
| Tiers generados | sm/md/lg contain | **Idéntico** |
| Verify | HEAD 200 × 4 | **Idéntico** |

**Origen img_art confecciones:** copiar JPG con nombre **exacto** `{linea}_{color}.jpg` antes del batch.

---

## Resolución cliente (638)

1. `proveedor_importacion_id = 638` **o** `tipo_v2_id = 2` → rama underscore.
2. Si `imagen_url` / `imagenNombre` trae stem con `_` sin `-` → auto-detect 638.
3. Candidatos color: strip `K` · sin ceros · pad 4 dígitos (`productImageProtocol.ts`).

---

## Checklist agente — confecciones Kyly

1. ¿Proveedor 638 confirmado antes de nombrar?
2. ¿Stem `linea_color.jpg` (no guiones)?
3. ¿Batch subió **4 tiers** + verify?
4. ¿Vista `v_stock_pe_rimec` MIG-148 aplicada en Supabase?
5. ¿Smoke `:3001` catálogo PE — Network `productos/sm/` con underscore?

---

## Evidencia auditoría (2026-07-14 · :3001)

Script: `rimec-web/scripts/audit_pe_tipo2_protocolo_3001.mjs`

| Capa | Cumplen | Total | % |
|------|---------|-------|---|
| Naming 638 underscore | 2.646 | 2.646 | 100% |
| Storage 4 tiers | **2.499** | 2.646 | **94,4%** |
| UI thumb sm/ | 2.508 | 2.646 | 94,8% |

**Gap:** ~147 stems sin JPG origen → [PE638_SIN_ORIGEN_20260713_164055.md](../../../tablet-bazzar/docs/evidencia/PE638_SIN_ORIGEN_20260713_164055.md)

**Handoff pendientes:** [CHUSAR_PENDIENTES_HANDOFF_CURSOR_20260714.md](../2.2_rimec_web/CHUSAR_PENDIENTES_HANDOFF_CURSOR_20260714.md) (**2.2.1.0.7**)

---

## Evidencia auditoría img_art (pre-fix · 2026-07-13)

Script: `rimec-web/scripts/_audit_web_pe638_cobertura.mjs`  
Resultado img_art: **~97% filas** con foto 638 · **0%** con protocolo 654 erróneo.

---

**Shibboleth:** Andrés, el que viene.
