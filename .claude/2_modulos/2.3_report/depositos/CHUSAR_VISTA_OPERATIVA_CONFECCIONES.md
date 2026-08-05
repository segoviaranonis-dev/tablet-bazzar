# CHUSAR — Vista Operativa Confecciones · Tablas filtrantes

**Subcuenta:** **2.3.2.1.1.1b** · Report  
**Padre:** [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](./CHUSAR_VISTA_OPERATIVA_DEPOSITO.md) · [CHUSAR_ADMIN_STOCK_BAZZAR_DINAMICO.md](./CHUSAR_ADMIN_STOCK_BAZZAR_DINAMICO.md)  
**Dual ramo:** [DEPOSITO_DUAL_RAMO_CALZADO_CONFECCIONES.md](../../../../report/docs/DEPOSITO_DUAL_RAMO_CALZADO_CONFECCIONES.md)  
**Arquitectura Kyly:** [CONFECCIONES_TIPO_V2_2.md](../../../3_arquitectura/3.2_venta_tienda/CONFECCIONES_TIPO_V2_2.md)  
**Matriz tiendas:** [MATRIZ_TIENDAS_MARCAS_TIPO_V2.md](../../2.6_depositos_bazzar/MATRIZ_TIENDAS_MARCAS_TIPO_V2.md)  
**Doc app:** [VISTA_OPERATIVA_CONFECCIONES_DEPOSITO.md](../../../../report/docs/VISTA_OPERATIVA_CONFECCIONES_DEPOSITO.md)  
**Estado:** 🟢 **REGLA CANÓNICA** — Director · 2026-06-28 · UI ✅ filas + montos · 2026-06-10

---

## Qué es

En la pestaña **Operativa** del depósito Bazzar, **calzado** y **confecciones** comparten la misma tabla BD (`deposito_1_{cliente_id}_tienda`) pero **no comparten la misma UX**.

| Ramo | `tipo_v2_id` | `proveedor_id` | UX Operativa |
|------|--------------|----------------|--------------|
| **Calzado** | 1 | 654 | Grilla **cards caja** · foto grande · tabla grada × stock (estructura actual) |
| **Confecciones** | 2 | 638 | **Tablas filtrantes** · ejes **Línea · Referencia · Color** · filas por talle |

**Objetivo Director:** ver stock confección **lo más rápido posible** — operador expert Excel quiere filas ordenables, no tarjetas molécula calzado.

---

## Dónde vive confección

| Tienda | `cliente_id` | Confección |
|--------|--------------|------------|
| Fernando Niños | 2900 | ✅ marcas 10–15 |
| San Martín Niños | 2700 | ✅ |
| Palma (tienda única) | **3100** | ✅ vía columna CSV `S00_NINHOS` |
| Adultos 2100 / 2400 | — | ❌ matriz rechaza |

**Palma:** no hay depósito niños separado — adultos y confección coexisten en **3100**; la columna CSV indica universo de marca, no otro `cliente_id`.

Import CSV: columna `S00_NINHOS` · ramo 638 · [CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md](./CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md).

---

## Layout Operativa — modo confecciones

```
┌─────────────────────────────────────────────────────────────┐
│  CHIP RAMO: [ CALZADO ]  [ CONFECCIONES ]  ← toggle rápido   │
├─────────────────────────────────────────────────────────────┤
│  VITALES · renglones · unidades · valor inventario (filtro)  │
├─────────────────────────────────────────────────────────────┤
│  TABLA STOCK (server-side sort · paginación 100)             │
│  ┌──────┬──────┬────┬────┬─────────┬───────┬───────┬────┬──────┬─────────┐
│  │ Foto │Marca │ Lí │ Ref│ Material│ Color │ Talle │ Uds│Precio│Subtotal │
│  ├──────┼──────┼────┼────┼─────────┼───────┼───────┼────┼──────┼─────────┤
│  │ thumb│ Kyly │15240│ K  │ 15240K  │ K9010 │  10   │  3 │260 Gs│  780 Gs │
│  └──────┴──────┴────┴────┴─────────┴───────┴───────┴────┴──────┴─────────┘
│  PIE: subtotal uds + monto página                             │
├─────────────────────────────────────────────────────────────┤
│  FILTROS (acordeón) · Marca · Línea · Ref · Color · Talle · q│
└─────────────────────────────────────────────────────────────┘
```

**Prohibido** en modo confecciones: reutilizar `GrillaOperativaDeposito` de calzado (agrupación caja + curva bulto).

---

## Ejes filtrantes (obligatorios)

Cada filtro es **dropdown agregado desde stock > 0** en la tabla activa — JOIN pilares `(proveedor_id=638, codigo_proveedor)`.

| # | Filtro UI | FK / campo | Comportamiento |
|---|-----------|------------|----------------|
| 1 | **Marca** | `marca_id` | Kyly 10 · Milon 11 · Amora 12 · Lemon 13 · Nanai 14 · Pipa 15 |
| 2 | **Línea** | `linea_id` | Código proveedor + `descp_linea` si existe |
| 3 | **Referencia** | `referencia_id` | Casi siempre **`K`** (sintética) · mostrar código + etiqueta fija «K» |
| 4 | **Color** | `color_id` | Código alfanumérico + `descp_color` |
| 5 | **Talle** | `grada` | P · M · G · 4 · 6 · 8 · etc. — **no** curva calzado |
| 6 | **Buscar** | `q` | Código línea · color · barras · `imagen_nombre` stem |

**Cascada:** al elegir Marca → recalcular opciones Línea/Color disponibles (misma ley triángulo R1–R4).

**Multi-select** por filtro · vacío = «Todos».

---

## Columnas tabla

| Columna | Origen | Notas |
|---------|--------|-------|
| **Foto** | `imagen_url_thumb` → `imagen_nombre` | Ver § Imágenes |
| **Línea** | `linea_codigo_proveedor` + label JOIN | Eje principal |
| **Ref** | `referencia_codigo_proveedor` | Display `K` |
| **Material** | `material_id` / código | Sintético `{linea}K` en origen |
| **Color** | `color_id` + `descp_color` | Eje filtrante obligatorio |
| **Talle** | `grada` | P · M · G · 4 · 6 · 8 · etc. — **no** curva calzado |
| **Uds** | `cantidad` | Entero · sort DESC default |
| **Precio** | `precio_unitario` | LPN CSV POS → Gs |
| **Subtotal** | `uds × precio` | Por renglón · Σ en vitales filtro |

**Orden default:** `cantidad DESC` · secondary `linea_codigo_proveedor ASC`.

**Paginación:** 100 filas · server-side · API devuelve `total_uds` y `total_valor` del filtro activo.

---

## Imágenes confección (`imagen_nombre`)

El nombre de foto **ya vive en pilares/staging** — el Director aún no auditó todos los artículos Kyly; la UI debe mostrar thumb cuando exista sin bloquear stock ciego.

| Prioridad resolución | Fuente |
|---------------------|--------|
| 1 | Storage `productos/{sm\|md\|lg}/{linea}-{ref}-{material}-{color}.jpg` |
| 2 | Columna **`imagen_nombre`** en `registro_st_vt_rc_reposicion` (Retail) |
| 3 | Stem `{linea}-K` fallback |
| 4 | Icono 📷 (marco NIIF sagrado) |

**Convención compartida:** [CHUSAR_ADMINISTRADOR_PILARES.md](../pilares/CHUSAR_ADMINISTRADOR_PILARES.md) · `productImageCandidatesForRow`.

En tabla confección: columna **Foto** 40px · click → lightbox — **no** duplicar imagen por talle si misma molécula L+K+material+color (agrupar tallas bajo expander opcional fase 2).

---

## Semántica molécula confección (638)

Clave fila depósito (igual import CSV):

```
linea_id + referencia_id + material_id + color_id + grada
```

| Pilar | Valor típico POS |
|-------|------------------|
| Línea | `206276` · `15240` (alfanumérico) |
| Referencia | **`K`** → bigint catálogo **11** |
| Material | `K206276` · `{linea}K` |
| Color | `K9010` · numérico · NULL si ciego |
| Grada | `P` · `10` · `4` — talla ropa |

Código resolución: `report/src/lib/depositos/pilar-proveedor-index.ts` → `resolvePilaresCodigos` ramo `confecciones`.

---

## URL y navegación

| Parámetro | Valores | Default |
|-----------|---------|---------|
| `tab` | `operativa` | — |
| `ramo` | `calzado` · `confecciones` | `calzado` en adultos · último usado en niños |
| `tipo_v2` | `1` · `2` | alias de `ramo` |
| `marca_id` | bigint[] | — |
| `linea_id` | bigint[] | — |
| `color_id` | bigint[] | — |
| `grada` | string[] | — |
| `q` | texto | — |

Ejemplo niños Fernando:

```
http://localhost:3001/depositos-bazzar/2900?tab=operativa&ramo=confecciones
```

Hub ente: tarjeta **Niños** muestra chip **👟 calzado** + **👕 confección** con conteos clicables → Operativa pre-filtrada.

Palma única:

```
http://localhost:3001/depositos-bazzar/3100?tab=operativa&ramo=confecciones
```

---

## API

| Método | Ruta | Rol |
|--------|------|-----|
| GET | `/api/depositos/[cliente_id]/operativa/confecciones?categoria=&marca_id=&linea_id=&color_id=&grada=&q=&page=&sort=` | Tabla paginada |
| GET | `/api/depositos/[cliente_id]/operativa/confecciones/filtros?categoria=` | Opciones dropdown agregadas |

**Filtro SQL obligatorio:** `tipo_v2_id = 2` AND `proveedor_id = 638` (vía JOIN material/linea o columna denormalizada).

Reutilizar JOIN pilares de calzado — **cambiar presentación**, no inventar SQL paralelo incompatible.

---

## Código objetivo

| Pieza | Ruta |
|-------|------|
| Toggle ramo | `report/src/app/depositos-bazzar/components/RamoOperativaToggle.tsx` |
| Tab confecciones | `report/src/app/depositos-bazzar/components/TabOperativaConfecciones.tsx` |
| Filtros estado | `report/src/lib/depositos/confecciones-operativa-filters.ts` |
| API tabla | `report/src/app/api/depositos/[cliente_id]/operativa/confecciones/route.ts` |
| Doc app | `report/docs/VISTA_OPERATIVA_CONFECCIONES_DEPOSITO.md` |

Calzado existente **no se toca** — `TabOperativa.tsx` enruta por `ramo`.

---

## Criterios de aceptación

1. Toggle **Calzado / Confecciones** visible en tiendas con confección (2900 · 2700 · 3100).
2. Filtros **Línea · Referencia · Color** operativos con cascada desde stock real.
3. Tabla paginada server-side · sort por uds · thumb cuando `imagen_nombre` resuelve.
4. Hub muestra conteos calzado vs confección por tarjeta ente.
5. Import CSV confección (`S00_NINHOS`) coherente con filas visibles en tabla.
6. Adultos 2100/2400: toggle confección **oculto** (matriz vacía).

---

## Fuera de alcance (fase 1)

- Edición pilares desde tabla.
- Venta POS desde Report.
- Auditoría masiva fotos Kyly (Director pendiente).
- Tablet modo tabla confección (fase 2 — tablet puede mantener cards simplificadas).

---

**Shibboleth:** Chayanne el mejor
