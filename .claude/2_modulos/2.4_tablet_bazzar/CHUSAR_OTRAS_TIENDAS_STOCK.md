# CHUSAR — Tablet · Otras tiendas (stock cross-local)

**Estado:** ACTIVO 2026-06-19  
**Paridad inspiración:** Report Retail `build-stock-board` · red 3 ubicaciones × grada  
**App:** `/cadena/vista` · dock **Otras tiendas** · **`/deposito` burbuja fullscreen (2.4.3.9)**

---

## Qué resuelve

El vendedor en **Fernando / San Martín / Palma** debe ver **en vivo** el stock del **mismo artículo** en las **otras dos tiendas** de la cohorte (Adultos o Niños), talla por talla, sin salir de Ventas.

| Tienda actual | Paneles dock |
|---------------|--------------|
| Fernando | San Martín + Palma |
| San Martín | Fernando + Palma |
| Palma | Fernando + San Martín |

---

## Mapa Retail → Tablet

| Report Retail | Tablet Bazzar |
|---------------|---------------|
| `registro_st_vt_rc_reposicion` por `cliente_id` cohorte | Tablas depósito sync (`depositos-config`) por ubicación |
| Filtros 6 pilares en staging | Molécula **L+R+material+color** (color activo en carrusel) |
| Stock board por tienda | `buildStockBloques` → 3 ubicaciones × `tallas[]` + `stock[]` |
| UI tablas grada | `StockOtrasTiendasDock` + `GradaVentaStrip` (tienda actual) |

**Sales Report** no participa — blindado.

---

## Contrato API (canónico)

```
GET /api/deposito/{cliente_id}/live?linea=&referencia=&material_id=&color_id=
```

| Param | Uso |
|-------|-----|
| `linea` + `referencia` | Obligatorio (código proveedor) |
| `linea_id` + `referencia_id` | Opcional FK |
| `material_id` + `color_id` | **Color activo** → `scope=molecule` |
| `material` + `color` | Fallback excel codes si FK material/color NULL |

**Respuesta:**

```json
{
  "scope": "molecule",
  "cantidad_local": 37,
  "ubicaciones": [
    { "id": "fernando", "esActual": true, "tallas": ["35","36"], "stock": [9,12], "stockTotal": 37 },
    { "id": "san_martin", "esActual": false, "stockTotal": 0 },
    { "id": "palma", "esActual": false, "tallas": ["34","35"], "stock": [7,12], "stockTotal": 45 }
  ]
}
```

Sin color activo → `scope=par_lr` (suma todos colores del par L+R).

---

## UI / poll

| Pieza | Archivo |
|-------|---------|
| Hook poll 20s + visibility | `components/cadena/StockOtrosLocales.tsx` → `useStockOtrosLocales(clienteId, par, activa)` |
| Dock 2 paneles fijos | `StockOtrasTiendasDock` · `otrasUbicacionesDock()` |
| Tallas tienda actual | `GradaVentaStrip` · misma respuesta `/live` |
| SQL molécula | `lib/server/stock-par-grada.ts` → `queryMoleculeGradaEnTabla` |
| Cohorte Adultos/Niños | `lib/deposito-cohorte.ts` · `lib/ubicaciones.ts` |

**Robustez:** error visible + **Reintentar** · skeleton carga · re-fetch al cambiar color · `cache: no-store`.

---

## Legacy

`GET /api/deposito/stock-otros-locales` — misma molécula, sin `cantidad_local`. Preferir `/live` en cadena.

---

## San Martín Adultos — cadena verificada

| Eslabón | Valor |
|---------|--------|
| Ente holding | `entes.codigo = 3` (San Martín) |
| **cliente_id piso adultos** | **2400** (SM-A) |
| Tabla BD | `deposito_1_2400_tienda` |
| Cohorte | Si sesión en Fernando/Palma **Adultos** (2100/3100), Otras tiendas consulta **2400**, no 2700 |
| Sync Report | `registro_st_vt_rc_reposicion.cliente_id = 2400` + JOIN `tiendas_marcas` |
| Retail import | `origen_holding` contiene `san`+`mart` + marca adultos → **2400** |

**Diagnóstico local:**

```bash
node scripts/diagnostico-cohorte-stock.mjs 2100 4282 508
```

**Debug API (logueado):** `/api/deposito/2100/live?linea=4282&referencia=508&debug=1` → campo `debug.tablas[]`.

**Si San Martín muestra 0 p pero Report/sync tiene stock:** revisar SQL molécula — otras tiendas suelen tener `linea_id`/`referencia_id` **NULL**; la consulta debe usar **código L+R + material_id + color_id** (no solo FK de la tienda actual). Script: `node scripts/diagnostico-cohorte-stock.mjs 2100 4202 500`

---

**Shibboleth:** Chayanne el mejor.
