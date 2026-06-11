# API Depósito — Tablet Bazzar



Todas las rutas requieren sesión (`tablet-session`) vía middleware.



---



## Status y catálogo legacy



### `GET /api/deposito/status`



Conteo de registros y pares por cada uno de los 6 depósitos. Usado en `/deposito`.



### `GET /api/deposito/[cliente_id]/catalogo`



Filas con stock (`cantidad > 0`) — SQL vía `lib/server/catalogo-sql.ts`.  

Acepta mismos query params de filtros que `/filtros` (opcional).  

**Preferir `/filtros` + `/cadena` en flujo POS** (no descargar catálogo entero).



---



## Backend titanio (POS cadena)



### `GET /api/deposito/[cliente_id]/filtros`



Opciones de filtro **agregadas en SQL** (sin dump de filas).



**Query:** `generos`, `marcas`, `estilos`, `tipos` (pipe `|`), `refs`, `q`, `marca`



**Respuesta:** `generos[]`, `marcas[]`, `estilos[]`, `tipos[]`, `marcasEntrada[]`, `referencias[]`, `resumen`, `ms`



### `POST /api/deposito/[cliente_id]/ingresar`



Inicio de turno POS + resolución de destino catálogo.



**Body JSON:** `{ generos, marcas, estilos, tipos, referenciaKeys, buscar, marca? }`



**Respuesta:** `{ ok, vistaUrl, marca, posicion, stats, ms }`  

Set-Cookie: `tablet-pos-ingreso` (12 h, httpOnly)



### `GET /api/deposito/[cliente_id]/cadena`



Cadena filtrada ya construida en servidor.



**Query:** mismos filtros + `marca` obligatorio (o cookie ingreso)



**Respuesta:** `{ pares, paresAll, posicion, totalFilas, ingreso, ms }`



### `GET /api/deposito/[cliente_id]/live`



Stock en vivo molécula activa + 3 ubicaciones.



**Query:** `linea_id`, `referencia_id`, `material_id`, `color_id`, `grada?`



**Respuesta:** `{ cantidad_local, ubicaciones[], server_time, ms }`  

UI: poll cada **4 s** en `/cadena/vista`.



---



## Stock cross-tienda (legacy)



### `GET /api/deposito/stock-otros-locales`



Misma molécula en Fernando / San Martín / Palma.  

**Preferir `/live`** en cadena (incluye local + ubicaciones en una llamada).



---



## Tipo fila



`DepositoFila` en `lib/cadena.ts` — campos L+R, material, color, FK pilares, `grada`, `cantidad`.



## Config



- `lib/depositos-config.ts` — `cliente_id` → tabla

- `lib/ubicaciones.ts` — agregación adultos+niños



---



**Última actualización:** 2026-06-11 (cierre backend titanio)
