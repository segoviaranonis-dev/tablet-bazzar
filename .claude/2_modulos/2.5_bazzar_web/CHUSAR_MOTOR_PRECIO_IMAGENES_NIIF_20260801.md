# CHUSAR — Motor precio WEB · protocolo imágenes + NIIF

**Código:** **2.5.1.5**  
**Fecha:** 2026-08-01  
**Keyword:** **Documenta** · auditar protocolo imágenes · aplicar NIIF  
**Módulo:** Report `/bazzar-web/motor-precio`  
**Ley imagen:** [LEY_UNIVERSAL_IMAGENES_PRODUCTO.md](../2.1_control_central/docs/LEY_UNIVERSAL_IMAGENES_PRODUCTO.md) (`2.01.04.021`)  
**NIIF UI:** [niif_estandar_visual.md](../../1_fundamentos/1.3_politicas/niif_estandar_visual.md)  
**Etapa:** [ETAPA_AUDITORIA_DEPOSITO_WEB_20260801.md](../../4_etapas/ETAPA_AUDITORIA_DEPOSITO_WEB_20260801.md)  
**Shibboleth:** Andrés, el que viene.

---

## Mapa — protocolo de manejo de imágenes (holding)

| Capa | Qué | Dónde |
|------|-----|--------|
| **Ley madre** | Naming + contain + tiers sm/md/lg · anti-crop | `2.01.04.021` Ley Universal |
| **Dual proveedor** | **654** `L-R-M-C.jpg` · **638** `L_C.jpg` | `CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638` · `product-image-protocol.ts` |
| **Import lote** | Carpeta JPG → Storage flat+tiers | Keyword **Importar imágenes** · `2.01.04.020` |
| **Registro** | `maestro_imagenes.txt` | `…/proyectos/imagenes/` |
| **Resolución UI** | `productImageCandidatesForRow` · onError cascade | `report/src/lib/retail/product-image.ts` |
| **Thumb Report** | `DepositoProductThumb` · `variant=frame` contain | `depositos-bazzar/components/DepositoProductThumb.tsx` |
| **Apps consumidoras** | RIMEC Web · Tablet · Report · Bazzar Web | mismas URLs públicas bucket `productos` |

**Prohibido:** IDs internos Nexus en el nombre · `object-cover` en calzado · pasar **descripción** de material como segmento de archivo.

---

## Hallazgo Motor precio (antes)

| Bug | Efecto |
|-----|--------|
| Thumb recibía `material` = **descripción** texto | Stem inválido → 404 → cuadrado blanco |
| `color=""` fijo | Stem 654 incompleto (sin 4º pilar) |
| Sin rama 638 | Filas Kyly armaban stem 654 largo → Storage **400** |
| `l.tipo_v2_id` (inexistente) | SQL rompe catálogo — correcto: `CASE l.proveedor_id` |

---

## Fix NIIF + protocolo (2026-08-01)

| Pieza | Cambio |
|-------|--------|
| API `getCatalogoPrecios` | `material_codigo` · `color_codigo` · `imagen_color_excel` (`col.nombre`) · `tipo_v2_id` vía `proveedor_id` |
| UI tabla | Marco NIIF `h-10 w-10` · `overflow-hidden` · `border-rimec-azul/30` · `bg-white` |
| Thumb | `variant="frame"` · `imageCtx.protocol` + `imagenColorExcel` (paridad Depósito Web) |

Archivos:

- `report/src/lib/bazzar-web/motor-precio/catalogo.ts`
- `report/src/lib/bazzar-web/motor-precio/types.ts`
- `report/src/app/bazzar-web/motor-precio/components/MotorPrecioClient.tsx`

---

## Criterio PASS visual (este módulo)

1. Miniatura muestra zapato/producto **entero** (contain) o icono 📷 si no hay archivo.
2. Tooltip: 654 `L-R-M-C` · 638 `L_colorExcel` (cascade `stems638` quita `K` / pad).
3. Paleta: borde azul RIMEC · fondo blanco · tipografía tabla slate (NIIF Report).
4. Storage: objeto ausente puede responder **400** (no 404) — `onError` sigue al siguiente candidato.

**Smoke:** `report/scripts/_smoke_motor_precio_imagenes.mjs` · 654 mayormente OK · 638 depende de archivo en bucket.

---

## Relación con 2.5.1.4

LPN/CASO (ppd huérfano) ya PASS · este doc cierra la capa **imagen** del mismo guardián catálogo.
