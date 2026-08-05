# CHUSAR — Tablet · Depósito · Burbuja fullscreen (4 áreas)

**Subcuenta:** **2.4.3.9** · Tablet Bazzar · `/deposito`  
**Padre:** [CHUSAR_TABLET_DEPOSITO_CAJAS.md](./CHUSAR_TABLET_DEPOSITO_CAJAS.md) · **2.4.3.4**  
**Cross-stock:** [CHUSAR_OTRAS_TIENDAS_STOCK.md](./CHUSAR_OTRAS_TIENDAS_STOCK.md)  
**Navegación:** [NAVEGACION_CADENA.md](../../../tablet-bazzar/docs/NAVEGACION_CADENA.md) · [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md)  
**Integridad:** [CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md](./CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md) · [CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md](./CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md)  
**Estado:** 🟢 **ACTIVO** — 2026-06-10  
**Shibboleth:** 7 años

---

## Qué es

Al **tocar la foto** de una tarjeta en `/deposito` (tab Stock), la tablet abre una **burbuja a pantalla completa** con el detalle del artículo y **cuatro áreas** heredadas del manual de movimientos Ventas (`/cadena/vista`), adaptadas a **consulta read-only** sobre el **resultado filtrado** activo.

| # | Área | Rol | Componente |
|---|------|-----|------------|
| **1** | Carrusel colores | Variantes **material + color** del par L+R activo | `DepositoCarruselColores.tsx` |
| **2** | Stock red 3 tiendas | **San Martín · local · Palma** (cohorte Adultos/Niños) | `DepositoFullscreenStockStrip.tsx` |
| **3** | Sidebar referencias | Saltos directos a otros **L+R** del filtro | `DepositoSidebarReferencias.tsx` |
| **4** | Cabecera azul | Marca · L.R · contadores L+R / mat·col · CERRAR | `DepositoCajaFullscreen.tsx` |

**Gestos (mismo eje que depósito fullscreen):**

| Gesto | Eje | Acción |
|-------|-----|--------|
| ↑ ↓ | Secundaria | Anterior / siguiente **línea · referencia** |
| ← → | Primaria + color | Anterior / siguiente **material · color** |
| Tap miniatura área 1 | Color | Salto directo a variante |
| Tap miniatura área 3 | L+R | Salto directo a par |

Índice navegación: `lib/depositos/nav-cajas.ts` · montaje: `app/deposito/page.tsx` (`fullscreenKey`).

---

## Área 2 — Stock otras tiendas (ley de layout)

Paridad **exacta** con Ventas `GradaVentaStrip` + `panelesLateralesVentas()`:

| Tienda activa (`cliente_id`) | Panel **izquierda** | Panel **centro** | Panel **derecha** |
|------------------------------|---------------------|------------------|-------------------|
| Fernando (2100 / 2900) | San Martín | **Fernando** | Palma |
| San Martín (2400 / 2700) | Fernando | **San Martín** | Palma |
| Palma (3100 / 3200) | San Martín | **Palma** | Fernando |

**Reglas inviolables:**

1. **Centro = siempre la tienda donde se consulta** (`ubicacionIdFromClienteId`).
2. **Laterales = las otras dos** de la **misma cohorte** (Adultos **o** Niños — nunca mezclar).
3. **Fuente única en burbuja:** `GET /api/deposito/{cliente_id}/live` con `scope=molecule` (L+R+mat+col activos).
4. **No** recalcular stock en React — **no** sumar filas del grid local para la red; el grid es snapshot de carga; la burbuja es **verdad en vivo**.

---

## Contrato API `/live` (integridad)

```
GET /api/deposito/{cliente_id}/live
  ?linea={codigo}&referencia={codigo}
  &material={excel_material}&color={excel_color}
```

| Campo respuesta | Uso UI |
|-----------------|--------|
| `ubicaciones[]` | 3 bloques · `buildStockBloques` |
| `ubicaciones[].esActual` | Marca panel centro |
| `ubicaciones[].tallas[]` + `stock[]` | Tabla grada · alineados 1:1 |
| `ubicaciones[].stockTotal` | Badge «N p» · **debe** = `SUM(stock[])` |
| `cantidad_local` | Total molécula tienda activa · **debe** = bloque `esActual.stockTotal` |

**SQL:** `lib/server/stock-par-grada.ts`  
- Molécula: `queryMoleculeGradaEnTabla` / `queryMoleculeTotalEnTabla`  
- **FK NULL en otras tiendas:** lookup por **código L+R + material_id + color_id** (fix 4.03.03.001)  
- Par sin color: `scope=par_lr` (no aplica en burbuja depósito — siempre hay color activo)

**Poll:** 20 s · `cache: no-store` · re-fetch al cambiar color · hook `useDepositoStockLive`.

---

## Ley de precisión (combustible trasbordador)

> Si el stock mostrado no es **matemáticamente exacto**, el producto **no sirve** para operación en piso. No basta que «aparezca».

### Invariantes obligatorios (PASS/FAIL)

| ID | Invariante | Verificación |
|----|------------|--------------|
| **I1** | `SUM(stock[i]) === stockTotal` por cada bloque | Unit / respuesta `/live` |
| **I2** | `cantidad_local === bloque_actual.stockTotal` | Comparar JSON `/live` |
| **I3** | Centro UI = bloque con `esActual: true` | Inspección layout |
| **I4** | Cohorte: 2100 consulta tablas Adultos 2400+3100, **no** 2700/3200 | `debug=1` en `/live` |
| **I5** | Cambio color → `/live` recibe nuevos `material`+`color` → totales cambian solo si molécula distinta | Tap carrusel área 1 |
| **I6** | Grilla local vs `/live` centro: pueden diferir **solo** por ventas/sync entre carga y poll — burbuja **manda** `/live` | Aceptable si sync < poll |

### Prohibido

- Parchear totales en cliente (redondeos «a ojo», `COALESCE` que pise stock).
- Mezclar filas de distintas moléculas en una tabla.
- Mostrar red 3 tiendas sin cohorte (Adultos + Niños en la misma fila).
- Usar `stock_red` del grid API como fuente de la burbuja.

### Diagnóstico

```bash
# Cohorte + tablas consultadas
curl "/api/deposito/2100/live?linea=1285&referencia=400&material=29711&color=102052&debug=1"

# Script holding
node scripts/diagnostico-cohorte-stock.mjs 2100 1285 400
```

Checklist piso: [PRUEBA_INTEGRIDAD_STOCK_FASE1.md](../../../tablet-bazzar/docs/PRUEBA_INTEGRIDAD_STOCK_FASE1.md).

---

## Mapa archivos

| Archivo | Rol |
|---------|-----|
| `components/deposito/DepositoCajaFullscreen.tsx` | Orquestador burbuja |
| `components/deposito/DepositoCarruselColores.tsx` | Área 1 |
| `components/deposito/DepositoFullscreenStockStrip.tsx` | Área 2 |
| `components/deposito/DepositoSidebarReferencias.tsx` | Área 3 |
| `lib/depositos/use-deposito-stock-live.ts` | Poll `/live` |
| `lib/depositos/nav-cajas.ts` | Índice L+R / mat·col |
| `lib/stock-otros-locales.ts` | `buildStockBloques`, `panelesLateralesVentas` |
| `components/cadena/StockOtrosLocales.tsx` | `StockTiendaMiniPanel` reutilizado |
| `app/api/deposito/[cliente_id]/live/route.ts` | API canónica |

---

## Diferencia vs Ventas

| | Ventas `/cadena/vista` | Depósito burbuja |
|---|------------------------|------------------|
| Modo | Venta + carrito + ticket | **Solo lectura** |
| Universo | Marca + cohorte estilo | **Filtro CABECERA** aplicado |
| Stock centro | Botones talla venta | Tabla grada + ⭐ vidriera |
| Header área 4 | Carrito · Franco Tirador | Solo CERRAR + contadores |

---

## Smoke test Director

1. `/deposito` · FER-A · filtrar marca VIZZANO · tap foto.  
2. Burbuja fullscreen · hero grande · estilo + L.R + precio.  
3. **Área 2:** centro Fernando · izq SM · der Palma (totales coherentes).  
4. **←→** cambia color · `/live` actualiza laterales.  
5. **↑↓** cambia L+R · sidebar marca ref activa.  
6. Cambiar depósito a **PAL-A** · repetir: **centro Palma**, izq SM, der Fernando.  
7. `debug=1` en `/live`: tablas cohorte correctas.

---

**Última actualización:** 2026-06-10 · burbuja 4 áreas + red `/live` + ley precisión I1–I6
