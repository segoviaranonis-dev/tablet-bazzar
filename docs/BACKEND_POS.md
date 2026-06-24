# Backend POS — Capa titanio (Tablet Bazzar)

> **POS ventas / bandeja / CERRAR:** doc canónico → [LOGICA_OPERATIVA_POS_BAZZAR.md](./LOGICA_OPERATIVA_POS_BAZZAR.md)  
> Este archivo cubre **catálogo depósito** (filtros, cadena, live). No duplica lógica `ticket_bandeja_cajero`.

**Principio:** nada crítico en el navegador. Filtros, agregados, cadena y stock viven en Postgres vía API Next.js.

**Cierre sub-etapa:** 2026-06-11

---

## Flujo vendedor

```
/login → /cadena
           ├─ GET /filtros?generos=…&marcas=…     (chips + marcas/refs SQL)
           ├─ POST /ingresar { filtros, marca? }  (cookie tablet-pos-ingreso 12 h)
           └─ → /cadena/vista?marca=…&pi=…
                    ├─ GET /cadena?marca=…         (paresAll + posición)
                    └─ GET /live?linea_id=…        (poll 4 s — stock 3 locales)
```

**INGRESAR** = inicio de turno en tienda (sesión POS), no reemplaza login JWT (`tablet-session`).

---

## Cookies

| Cookie | Duración | Uso |
|--------|----------|-----|
| `tablet-session` | 8 h | Auth vendedor (middleware) |
| `tablet-pos-ingreso` | 12 h | Turno POS: `cliente_id` + marca activa |

Secret: `TABLET_SESSION_SECRET` (mismo env que auth).

---

## SQL (`lib/server/catalogo-sql.ts`)

- Tabla **solo** desde `depositos-config.ts` (whitelist, nunca input usuario)
- `cantidad > 0` en todo catálogo POS
- JOINs pilares: `material`, `color`, `marca_v2`, `genero`, `grupo_estilo_v2`, `tipo_v2`
- Agregados paralelos en `/filtros` (`Promise.all`)
- Molécula live: `(linea_id, referencia_id, material_id, color_id)` + grada opcional

---

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `lib/server/catalogo-sql.ts` | Queries parametrizadas |
| `lib/server/cadena-server.ts` | `buildCadenaServer`, `resolverMarcaIngreso` |
| `lib/server/pos-sesion.ts` | JWT ingreso |
| `lib/filtros-url.ts` | Params URL compartidos cliente/servidor |
| `lib/cadena.ts` | `buildCadenaFromFilas` (reutilizado en servidor) |

### Param `refs` (URL vista)

```typescript
// Una ref:   refs=1184|1101        → ["1184|1101"]
// Varias:    refs=1184|1101,1184|1161
parseReferenciaKeysParam(sp.get("refs"))
serializeReferenciaKeysParam(keys)  // join con coma
```

**No usar** `.split("|")` directo sobre `refs` — el pipe es parte de la clave L+R.

### Normalización cadena

- `buildCadenaFromFilas`: trim en comparación de `marca` y `cantidad`
- `filtrarParesServer` / `filtrarPares`: trim en claves L+R
- `resolverMarcaIngreso`: búsqueda amplia sin `refKey` único cuando hay múltiples coincidencias

---

## Rendimiento

- Entrada: ya **no** descarga ~5.660 filas al browser
- Vista: solo pares de **una marca** filtrada
- Live: query ligera por molécula; índices en migración `111_depositos_bazzar_tiendas.sql`

---

## Dev

```bash
cd tablet-bazzar
npm run dev   # :3002
```

Fernando Adultos prueba: `cliente_id=2100`.

---

**Ver también:** [API_DEPOSITO.md](./API_DEPOSITO.md) · [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md)
