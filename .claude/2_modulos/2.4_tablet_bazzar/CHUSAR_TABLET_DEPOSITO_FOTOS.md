# CHUSAR — Tablet · Depósito con fotos

**Sub-sesión:** [SUBSESION_TABLET_DEPOSITO_FOTOS_20260617_CERRADA.md](../../4_etapas/SUBSESION_TABLET_DEPOSITO_FOTOS_20260617_CERRADA.md)  
**Evolución cajas:** [CHUSAR_TABLET_DEPOSITO_CAJAS.md](./CHUSAR_TABLET_DEPOSITO_CAJAS.md) · **2.4.3.4** ✅ 2026-06-27  
**Estado:** ✅ **CERRADA** — 2026-06-17 · UI cajas en `/deposito` desde 2026-06-27  
**Paridad UX:** Report `/retail` · `RetailStockBoard` · `TablaOrigenTienda`  
**Shibboleth:** 7 años

---

## Qué es

Modo tablet **consulta stock visual** para vendedor Bazzar: **una foto por producto (molécula)** y **stock en las 3 tiendas de la cohorte** desglosado por **grada** en tablas — sin triplicar imágenes por talla.

| Capa | Ubicación |
|------|-----------|
| Tile panel | `/` → **Depósito con fotos** 🏪 · `lib/view-modes.ts` → `deposito-fotos` |
| Ruta | `/deposito` · `app/deposito/page.tsx` |
| API grid | `GET /api/deposito/status` · `GET /api/deposito/[cliente_id]` |
| Stock red | `lib/server/stock-red-batch.ts` · `lib/deposito-cohorte.ts` |
| UI tablas | `components/deposito/StockRedGradaTables.tsx` |
| Imágenes | `ProductImage` sm/ · `ProductLightbox` lg/ · `enrichDepositoFilaImagenes` |
| Config 6 depósitos | `lib/depositos-config.ts` |

**No es Ventas** (`/cadena`): Ventas = triángulo · L+R · carrito · ticket. Depósito = **solo lectura** · síntesis molécula · red 3 tiendas.

---

## Ley de síntesis (Director — obligatoria)

### Unidad de tarjeta = **molécula**

Identidad canónica en BD sync (2026-06-17):

```
linea_codigo_proveedor + referencia_codigo_proveedor + material_id + color_id
```

Cuando sync Report rellene `linea_id`/`referencia_id`, `moleculeKey()` usa FK completa. **Hoy** depósito suele tener línea/ref NULL — agrupar por códigos + material_id/color_id (ver error `4.03.03.002`).

| ✅ Correcto | ❌ Prohibido (error legacy) |
|-------------|----------------------------|
| 1 imagen · 1 tarjeta · tablas grada×stock × 3 tiendas | 1 imagen **por grada** (38, 36, …) |
| Badge = total pares molécula (local o red) | Badge «6 p» solo de talla 38 |
| TOP 80 **moléculas**/marca por stock local agregado | TOP 80 **filas**/marca (SKU+talla) |

**Clave:** sintetizar — el usuario no puede ver 500.000 fotos del mismo calzado.

### Cohorte Adultos / Niños

| Depósito activo | Tablas consultadas en red (3) |
|-----------------|-------------------------------|
| Cualquier **Adultos** (2100, 2400, 3100) | `fernando_adultos` · `sanmartin_adultos` · `palma_adultos` |
| Cualquier **Niños** (2900, 2700, 3200) | `fernando_ninos` · `sanmartin_ninos` · `palma_ninos` |

**Nunca** mezclar adultos + niños en la misma tarjeta.

Tienda del `cliente_id` activo → resaltada naranja («· tú») en tablas.

---

## Origen de datos (vs Retail)

```text
Excel st+vt+RC
      ↓
registro_st_vt_rc_reposicion  ← Retail /retail lee aquí (staging + venta + importadora)
      ↓ sync Report → Depósitos Bazzar
deposito_tienda_*  (6 tablas)  ← Depósito con fotos lee aquí (solo stock POS)
      ↓
Tablet GET /api/deposito/[id]
```

| | Retail | Depósito con fotos |
|---|--------|-------------------|
| Tabla | Staging batch | `deposito_tienda_*` |
| Card | Por `imagen_nombre` ranking venta | Por **molécula FK** ranking stock local |
| Tablas tienda | Venta + Stock | **Stock** (fase 2: venta si sync lo materializa) |
| Importadora | Sí | No en v1 molécula |

Misma verdad de negocio posible; **consulta distinta**. Paridad visual Retail; fuente depósito, no Excel directo.

---

## Flujo vendedor

1. Login → Panel → **Depósito con fotos**
2. Selector 1 de 6 depósitos (define cohorte Adultos/Niños + tienda «tú»)
3. Grid: **1 card = 1 molécula**
   - Foto sm/ · tap → lightbox lg/
   - Badge total pares (red o local)
   - Pills resumen: Fernando · Palma · San Martín (totales)
   - Marca · L.R · material/color · estilo
   - **3 tablas grada×stock** (paridad Retail)
4. Chips filtro marca · búsqueda texto
5. TOP 80 moléculas/marca (rank por `SUM(cantidad)` local)

---

## Arquitectura técnica

```text
GET /api/deposito/[cliente_id]?limit=80&stock_red=1
  │
  ├─ SQL: molecule_agg
  │     GROUP BY L código, R código, material_id, color_id
  │     SUM(cantidad) AS cantidad_local
  │     ROW_NUMBER() OVER (PARTITION BY marca ORDER BY cantidad_local DESC) ≤ limit
  │
  ├─ fetchStockRedBatch(molecules, cohorte)
  │     3 queries (1 tabla cohorte × ubicación)
  │     → stock_red[]: StockUbicacionBloque per molecule
  │
  └─ enrichDepositoFilaImagenes + cantidad_red (sum ubicaciones)

UI app/deposito/page.tsx
  └─ StockRedGradaTables · pills red · sin línea «Grada 38»
```

### Archivos clave

| Archivo | Rol |
|---------|-----|
| `app/api/deposito/[cliente_id]/route.ts` | Agregación molécula + TOP N/marca |
| `lib/server/stock-red-batch.ts` | Batch grada × 3 tablas cohorte |
| `lib/deposito-cohorte.ts` | `cohortePorUbicacion()` · `moleculeKey()` |
| `lib/stock-otros-locales.ts` | `buildStockBloques()` · tipos |
| `app/api/deposito/stock-otros-locales/route.ts` | Ventas: misma cohorte (fix adultos/niños) |
| `app/api/deposito/[cliente_id]/live/route.ts` | Poll Ventas: cohorte corregida |
| `components/deposito/StockRedGradaTables.tsx` | Tablas UI |
| `components/deposito/StockRedResumenPills.tsx` | Pills Fernando/Palma/SM |

### Contrato API producto (molécula)

```typescript
{
  linea_id, referencia_id, material_id, color_id,
  linea_codigo_proveedor, referencia_codigo_proveedor,
  material_code, color_code,
  marca, genero, estilo, tipo_v2, descp_material, descp_color,
  imagen_nombre, imagen_url_thumb, imagen_url_hero,
  cantidad_local: number,   // sum en depósito activo
  cantidad_red: number,     // sum 3 ubicaciones cohorte
  stock_red: StockUbicacionBloque[]
}
```

**Sin campo `grada` en card** — gradas solo dentro de `stock_red[].tallas/stock`.

---

## Imágenes

| Uso | Tier | Componente |
|-----|------|------------|
| Grid | sm/ 200×200 | `ProductImage` |
| Lightbox | lg/ 800×800 | `ProductLightbox` |

Doc: [MODULO_IMAGENES_PRODUCTO.md](./MODULO_IMAGENES_PRODUCTO.md) · etapa 654 ✅.

---

## Estilo

**NIIF institucional** — `#f1f5f9` · header blanco · naranja RIMEC. Grid 1–3 cols (cards altas por tablas). No tokens salón Ventas.

---

## Leyes (no romper)

1. Sin triángulo pilares en `/deposito`
2. Imágenes 654 contain — no crop
3. Sales Report blindado
4. Tablet lectura only — sync = Report → Depósitos Bazzar
5. **Síntesis molécula** — nunca card por grada
6. Documentación / git / deploy — solo orden Director · Claude Code deploy

---

## Protocolo agentes

Ver `LEY_UNIVERSAL_DOCUMENTACION_DIRECTOR.md`. Cursor: código local en tarea ordenada; **no** push/deploy.

---

## Dev

```bash
cd tablet-bazzar && npm run dev   # :3002
```

`/deposito` · smoke cliente **2100** (Fernando Adultos).

---

## Relación sub-sesiones

| Sub-sesión | Estado |
|------------|--------|
| Imágenes 654 | ✅ CERRADA |
| **Depósito fotos 20260617** | ✅ **CERRADA** — evolución cajas |
| **Vidriera estrellas 2.4.3.5** | ✅ [CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md](./CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md) |
| Ventas stands 20260617 | ✅ CERRADA |

## Errores relacionados

| Código | Tema |
|--------|------|
| `4.03.03.002` | Grid vacío — FK línea/ref NULL en sync |

Mapa Retail: [MAPA_RETAIL_RANKING_SUCURSALES.md](./MAPA_RETAIL_RANKING_SUCURSALES.md)

---

## Paridad RIMEC Web (2026-07-06)

RIMEC Web PE copia **`cadena-thumb-frame`** y hero de este módulo — no inventar CSS propio.  
Doc: [CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md](../2.2_rimec_web/CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md)

---

**Documentación Chusar — cierre sub-sesión · orden Director — 2026-06-17**
