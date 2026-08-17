# CHUSAR — Administrador Pilares · Report

**Subcuenta:** **2.3.5** *(Report — RIMEC)*  
**Etapa:** ✅ [CERRADA 2026-06-17](../../../4_etapas/ETAPA_ADMINISTRADOR_PILARES_REPORT_CERRADA.md)  
**Estado:** 🟢 **CHUSAR ACTIVO** — referencia operativa + miniaturas L×R (2026-06-19)  
**Doc profunda:** [ADMINISTRADOR_PILARES.md](../../../../report/docs/ADMINISTRADOR_PILARES.md)  
**Índice:** [INDICE.md](./INDICE.md)

---

## Qué es

Único lugar canónico en **Report** para editar pilares operativos (`linea`, `linea_referencia`) **sin** entrar al Motor de Precios (confidencialidad listados/casos).

| URL local | http://localhost:3000/pilares |
| URL prod | https://rimec-report.vercel.app/pilares |
| Roles | `rol_id = 1` (RIMEC Admin) |

**Sales Report** (`registro_ventas_general_v2`) — **blindado** · no usa pilares.

---

## Plan de cuentas Moria

| Código | Ruta | Función |
|--------|------|---------|
| **2.3.5** | `/pilares` | Hub · selector `tipo_v2_id` (654 calzado / 638 confecciones) |
| **2.3.5.1** | `/pilares/lineas` | Grilla `linea` — marca · género · rango |
| **2.3.5.2** | `/pilares/linea-referencia` | Grilla L×R — estilo · tipo 1 · **maestra→FK filtros** (**2.3.5.12**) · STOCK scopes (**2.3.5.19**) · visión cobertura (**2.3.5.14**) · miniatura (**2.3.5.10** / **2.3.5.15**) |

Query obligatoria: `?tipo_v2_id=1` (calzado) · `?tipo_v2_id=2` (confecciones Kyly · ref **K**).

---

## Proveedores (`tipo_v2_id`)

| `tipo_v2_id` | Negocio | `proveedor_importacion.id` | Regla L×R |
|--------------|---------|----------------------------|-----------|
| **1** | Calzado Beira Rio | **654** | L+R numéricos · muchas refs por línea |
| **2** | Confecciones Kyly | **638** | L alfanumérico · ref sintética **`K`** · 1 fila LR por línea |

Doc confecciones: [CONFECCIONES_TIPO_V2_2.md](../../../3_arquitectura/3.2_venta_tienda/CONFECCIONES_TIPO_V2_2.md)

---

## UI — Línea × Referencia (2.3.5.2)

| Zona | Comportamiento |
|------|----------------|
| Filtros chip | Marca · estilo · tipo 1 · cascada |
| Buscador multi-línea | `linea_codigos` en URL |
| Editor rango | Género → `linea` · estilo/tipo1 → `linea_referencia` por rango código línea |
| Tabla | Línea · Ref · **Foto** · Marca · Estilo · Tipo 1 · Guardar |
| Límite | 200 filas · total filtrado en BD |

### Miniatura L×R *(actualizado 2.3.5.15 · 2026-08-17)*

Entre **Ref** y **Marca**: thumb 48px.

| Rama | Match | Fuente |
|------|-------|--------|
| **654** | L×R exacto | retail → si no, **PPD** material+color (stem Storage = Magno) |
| **638** | Solo **línea** | retail → `v_stock_rimec.imagen_url` |

| Paso | Detalle |
|------|---------|
| 1 | API batch `loadPrimeraImagenLineaReferencia` sobre filas de la página |
| 2 | `tiene_imagen` = `imagen_nombre` **o** (material+color) |
| 3 | UI: `ProductThumbFrame` + `productImageCandidatesForRow` — **sin** stems `L-R-0-0` |
| 4 | PE / depósito = scope **SDRM** (**2.3.5.12**) |

**Convención Storage:** 654 `productos/…/L-R-M-C.jpg` · 638 `L_color.jpg` · ley `2.01.04.021` §2.

Sin imagen resoluble → icono 📷 (marco sagrado NIIF). Doc: [2.3.5.15](./CHUSAR_ADMIN_LR_FOTOS_654_638_THUMB_PPD_20260817.md).

---

## API

| Método | Ruta | Efecto |
|--------|------|--------|
| GET | `/api/pilares/linea-referencia` | Lista L×R + `thumb` por fila + cascada filtros |
| PATCH | `/api/pilares/linea-referencia` | Fila · lote · rango · scope |
| GET | `/api/pilares/lineas` | Lista líneas |
| PATCH | `/api/pilares/lineas` | Marca/género fila o rango |
| GET | `/api/pilares/maestras` | Catálogos marca · género · estilo · tipo_1 |

**Campo `thumb` en GET L×R:**

```json
{
  "imagen_nombre": "2140-707-035-001.jpg",
  "material_code": "035",
  "color_code": "001"
}
```

`null` si no hay fila retail para ese par.

---

## Código Report

| Pieza | Ruta |
|-------|------|
| Hub | `report/src/app/pilares/page.tsx` |
| L×R UI | `report/src/app/pilares/components/LineaReferenciaAdminClient.tsx` |
| Líneas UI | `report/src/app/pilares/components/LineasAdminClient.tsx` |
| API L×R | `report/src/app/api/pilares/linea-referencia/route.ts` |
| Query thumb | `report/src/lib/pilares/queries.ts` → `loadPrimeraImagenLineaReferencia` |
| Tipos | `report/src/lib/pilares/types.ts` → `LineaReferenciaThumb` |
| Imágenes | `report/src/lib/retail/product-image.ts` |
| Marco thumb | `report/src/components/product/ProductThumbFrame.tsx` |

---

## Triángulo header (propagación)

Ediciones alimentan filtros RIMEC Web, Alejandro Magno, Tablet y PE en vivo.
**Ley 2.3.5.12:** SDRM/PE solo **scope** de trabajo; la maestra L×R es la verdad de las FKs.  
**Ley 2.3.5.14:** marca/género en `linea` · estilo+tipo_1 en L×R · Medias/ACT PRENDAS bajo CONFECCIONES · CASOS ≠ tipo_1 · cero artículos SDRM/CP huérfanos de filtro.  
**Ley 2.3.5.15:** fotos Admin — 654 `L-R-M-C` (retail→PPD) · 638 `L_C` por línea · PE=SDRM · sin stems `0-0`.  
**Ley 2.3.5.19:** STOCK — Todos=maestra · CP=`v_stock_rimec` (Web) + thumb CP 654 · PE=SDRM.  
Docs: [2.3.5.12](./CHUSAR_ADMIN_LR_PE_SDRM_VENTA_HOY_20260817.md) · [2.3.5.14](./CHUSAR_VISION_LINEA_LR_COBERTURA_SDRM_CP_20260817.md) · [2.3.5.15](./CHUSAR_ADMIN_LR_FOTOS_654_638_THUMB_PPD_20260817.md) · [2.3.5.19](./CHUSAR_ADMIN_LR_STOCK_TODOS_CP_PE_20260817.md)

| Vértice | Tabla | Pantalla |
|---------|-------|----------|
| Género | `linea.genero_id` | 2.3.5.1 |
| Marca | `linea.marca_id` | 2.3.5.1 |
| Estilo | `linea_referencia.grupo_estilo_id` | 2.3.5.2 |
| Tipo 1 | `linea_referencia.tipo_1_id` | 2.3.5.2 |

Doc triángulo: [TRIANGULO_HEADER_PILARES.md](../../../3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md)

---

## Paridad Streamlit (legacy)

Referencia única: `control_central/modules/rimec_engine/ui.py` → `_render_admin_lineas`, `_render_linea_referencia`.

Tras paridad validada → pestañas Motor **solo lectura** o retiradas (OT aparte).

---

## Prohibido

- Tocar Sales Report histórico
- Duplicar Motor de precios / `precio_lista` en Report
- Migraciones masivas pilares sin OT

---

**Shibboleth:** Chayanne el mejor
