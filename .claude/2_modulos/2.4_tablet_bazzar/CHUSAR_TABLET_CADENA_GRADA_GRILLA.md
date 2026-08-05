# CHUSAR — Tablet Cadena · filtro GRADA + grilla depósito en entrada

**Subcuenta:** **2.4.2.6** · padre **2.4.2** Ventas · hermana [TONO 2.4.2.5](./CHUSAR_TABLET_CADENA_TONO.md)  
**Estado:** 🟢 **ACTIVO** — implementado 2026-07-03 · build `npm run build` OK  
**Paridad depósito:** [CHUSAR_TABLET_DEPOSITO_CAJAS.md](./CHUSAR_TABLET_DEPOSITO_CAJAS.md) · **2.4.3.4** · grada CABECERA [2.4.3.6](./CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md)

---

## Qué es

Evolución de **`/cadena`** (entrada CATÁLOGO · VENTAS):

1. **Filtro GRADA** — mismo patrón que depósito tablet (pills + botón **Aplicar grada**).
2. **Grilla de cajas con miniaturas** — reemplaza la lista vertical de referencias (solo código + pares).

El vendedor ve **fotos del calzado** antes de INGRESAR y puede acotar por talla en SQL.

**Sales Report** — blindado · no usa pilares.

---

## Flujo operativo

```
/cadena?cliente_id=2900
  → CABECERA: género · marca · estilo · tipo1 · categoría · buscar · TONO · GRADA
  → fetch paralelo: /filtros + /catalogo (mismos query params)
  → grilla molécula (L+R+mat+color) · max 120 tarjetas
  → tap miniatura → POST /ingresar (marca + refKey L|R) → /cadena/vista
  → botón INGRESAR (abajo) → flujo general sin ref fija
```

---

## UI

| Antes | Ahora |
|-------|-------|
| Bloque **REFERENCIAS** · filas `2083.1131` + estilo + pares | **GrillaCajasDeposito** · foto thumb · marca · badge pares · código + LPN |
| Sin filtro talla en entrada | **FiltroGradaDeposito** debajo de TONO |
| Tap fila ref | Tap **foto/tarjeta** → ingreso directo a esa L+R |

Parámetros grilla en entrada: `colapsarTodo` · `compactStats` · `maxCards=120` · sin burbuja fullscreen (solo depósito).

---

## URL y filtros

| Param | Ejemplo | Efecto |
|-------|---------|--------|
| `gradas` | `35,36,37` | `btrim(s.grada) = ANY(...)` en SQL catálogo |
| Resto | igual cadena | `generos`, `marcas`, `estilos`, `tipo1s`, `tipos`, `q`, `tonos`, `sin_tono` |

Serialización: `lib/filtros-url.ts` · `FiltrosEntrada.gradas` · `FILTROS_ENTRADA_VACIOS`.

**INGRESAR** y **POST /ingresar** incluyen `gradas` en body para que vista respete la talla elegida.

---

## Archivos clave (tablet-bazzar)

| Archivo | Rol |
|---------|-----|
| `app/cadena/page.tsx` | Fetch `/catalogo` + grilla · `ingresarDesdeCaja` |
| `components/cadena/FiltrosCabecera.tsx` | Embed `FiltroGradaDeposito` |
| `components/deposito/FiltroGradaDeposito.tsx` | UI grada (reutilizado) |
| `components/deposito/GrillaCajasDeposito.tsx` | Grilla · prop `maxCards` |
| `lib/cadena-entrada-filtros.ts` | `gradas` en tipo + `hayFiltrosEntradaActivos` |
| `lib/filtros-url.ts` | Query `gradas=` comma-separated |
| `lib/server/catalogo-sql.ts` | `appendGrada` · `sqlGradaOpcionesCadena` · `filtrosFromBody` |
| `app/api/deposito/[cliente_id]/filtros/route.ts` | Devuelve `gradas: string[]` |
| `app/api/deposito/[cliente_id]/catalogo/route.ts` | Filas stock + imágenes (`enrichDepositoFilaImagenes`) |
| `lib/depositos/agrupar-cajas.ts` | Agrupación molécula (sin cambio) |

**Nota arquitectura:** cadena usa **labels texto** en `catalogo-sql.ts` (no FK IDs de `deposito-filtros-sql.ts`). La lógica grada se portó a ese módulo, no se cableó el SQL del depósito operativo.

---

## Reglas operativas

1. **Grada en SQL, no en cliente** — el filtro aplicado refetch vía `/filtros` y `/catalogo`; no parche en memoria.
2. **Draft + Aplicar** — igual depósito: cambios de grada no disparan fetch hasta **Aplicar grada**.
3. **Tap tarjeta = ref única** — `refKey = linea|referencia` de la molécula; material/color quedan para vista cadena.
4. **Reutilizar grilla depósito** — misma tarjeta `TarjetaCajaDeposito` · mismas URLs thumb/hero.
5. **TOP 120 cajas** — cap visual en entrada; INGRESAR sin tap sigue viendo universo filtrado completo en vista.

---

## Smoke piso

**Ruta:** http://localhost:3002/cadena · **FER-N** `cliente_id=2900`

1. Sin grada → grilla muestra miniaturas (no lista refs).
2. Elegir grada **35** → Aplicar → contadores CABECERA bajan · grilla solo cajas con stock en 35.
3. Tap una tarjeta → entra a `/cadena/vista` en esa L+R.
4. Limpiar filtros → grada vacía · grilla vuelve al universo tienda.

---

## Relacionados

| Doc | Tema |
|-----|------|
| [CHUSAR_TABLET_VENTAS.md](./CHUSAR_TABLET_VENTAS.md) | Modo Ventas · stands · `/live` |
| [CHUSAR_TABLET_CADENA_TONO.md](./CHUSAR_TABLET_CADENA_TONO.md) | TONO entrada → vista |
| [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md) | Estándar holding filtros |

---

**Shibboleth:** Entrada con ojos · Grada en BD · Una tarjeta = una caja

*CHUSAR 2.4.2.6 · 2026-07-03*
