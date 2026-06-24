# Lógica operativa POS Bazzar — documentación completa

**Versión:** 2.0 · **Fecha:** 2026-06-24  
**Apps:** Tablet `:3000` · Report `:3001` · **BD:** Supabase Postgres compartida  
**Motor:** `lib/server/tickets-staging.ts` · **Caja Report:** `report/src/lib/caja-bazzar/`  
**Relacionado:** [REGLAS_BANDEJA_UNICA_POS.md](./REGLAS_BANDEJA_UNICA_POS.md) · [ARQUITECTURA_SESION_STOCK_ORO.md](./ARQUITECTURA_SESION_STOCK_ORO.md) · `report/docs/FLUJO_CANONICO_POS_BAZZAR.md`

---

## 1. Norte en una frase

Cada tienda vende **solo desde su depósito piso**, reserva pares en **`ticket_bandeja_cajero`** (una sola tabla operativa), envía a **caja Report** con **CERRAR**, y archiva en **`bobeda_venta_pos`** al **Enviar a Empaque**. Nunca coexisten tablet y caja para el mismo lote.

---

## 2. Capas de datos (modelo vigente 2026-06)

```
registro_st_vt_rc_reposicion (Retail Excel · fuente nominal)
        │
        │  POST /api/depositos/sync  (Report)
        │  DELETE total + INSERT filtrado tiendas_marcas
        ▼
deposito_1_{cliente_id}_tienda  (×6)  ← stock vendible sesión
        │
        │  sync-cart / crear carrito: cantidad −1 por par
        │  cancelar / restaurarLineas: cantidad +1
        ▼
ticket_bandeja_cajero  ← ÚNICA tabla operativa POS (tablet + caja)
        │
        │  Enviar a Empaque (Report): DELETE bandeja + INSERT bobeda
        ▼
bobeda_venta_pos  ← ORO histórico · Empaque · Sales Report Bazzar futuro
```

### Tablas legacy (no escribir)

| Tabla | Estado |
|-------|--------|
| `ticket_pos_staging` | Legacy · no insertar en flujo nuevo |
| `ticket_pos_staging_linea` | Legacy |
| `ticket_venta_pos` | Legacy · reemplazada por bandeja + bobeda |

---

## 3. Identificadores de negocio

| Campo | Alcance | Descripción |
|-------|---------|-------------|
| `cliente_id` | 6 tiendas fijas | **Aislamiento total** · toda query incluye `WHERE cliente_id = :tienda` |
| `staging_id` | Global (secuencia `ticket_bandeja_lote_id_seq`) | **Lote factura** · agrupa filas del mismo pedido |
| `numero_fi_fa` | **Por `cliente_id`** | Factura interna secuencial · UI: `{Cliente} - FI_FA: {n}` |
| `id` | bigserial global | PK fila · **1 fila = 1 par** · quitar par en caja |
| `codigo_bandeja` | UNIQUE técnico | Trazabilidad · no es ID de negocio para cajero |

**Primera venta tras reset POS:** `staging_id = 1`, `numero_fi_fa = 1` en esa tienda.

**Contador FI_FA:** tabla `pos_fi_fa_counter (cliente_id, last_num)` · función `reservarNumeroFiFa()` en transacción al CERRAR.

---

## 4. Estados — bandeja única (`ticket_bandeja_cajero.estado`)

| Estado | Tablet catálogo | Tablet FACTURAS | Report caja | Stock depósito |
|--------|-----------------|-----------------|-------------|----------------|
| `ABIERTO` | Edición carrito · sync | Solo si reabierto | **No visible** | Descontado (reservado) |
| `PENDIENTE_CAJA` | No editable | Lista · **Abrir** | **Sí · bandeja** | Descontado |
| `CSV_DESCARGADO` | No | Lista · Abrir | **Sí** | Descontado |
| `CANCELADO` | — | — | No | Restaurado (+1 por par) |

**Ley inviolable:** un `staging_id` nunca está `ABIERTO` y `PENDIENTE_CAJA` a la vez.

### Diagrama de transiciones

```
[Nueva venta]
    INSERT filas estado=ABIERTO, staging_id=N, stock depósito −

[CERRAR tablet]  ← única vía a caja
    UPDATE estado → PENDIENTE_CAJA
    numero_fi_fa := reservarNumeroFiFa(cliente_id)
    cerrado_at := now()

[FACTURAS → Abrir]
    UPDATE estado → ABIERTO, cerrado_at := NULL
    (desaparece de caja · stock sigue reservado en bandeja)

[CERRAR otra vez]
    UPDATE → PENDIENTE_CAJA (mismo numero_fi_fa)

[Report → CSV]
    UPDATE → CSV_DESCARGADO

[Report → Enviar a Empaque]
    DELETE ticket_bandeja_cajero (lote)
    INSERT bobeda_venta_pos (inmutable)

[Cancelar pedido]
    restaurarLineas → stock +1
    DELETE o activo=false bandeja
```

---

## 5. Flujos detallados

### 5.1 Entrada catálogo (`/cadena`)

1. API `GET /api/deposito/{cliente_id}/filtros` — chips cascada: género, marca, estilo, **tipo_1**, categoría (`tipo_v2`).
2. Solo filas con `cantidad > 0` y `tipo_v2_id = 1` (calzado).
3. Pilares en lectura: `linea` + `linea_referencia` (ver [TRIANGULO_HEADER_PILARES.md](./TRIANGULO_HEADER_PILARES.md)).

### 5.2 Crear / sincronizar carrito (`sync-cart`)

**Endpoint:** `POST /api/tickets/staging/{staging_id}/sync-cart`  
**Motor:** `sincronizarStagingDesdeCarrito()`

Secuencia en transacción:

1. Validar `estado = ABIERTO`.
2. **Validar stock** (ver §6) — incluye reserva bandeja actual.
3. `restaurarLineas()` — devuelve al depósito los pares del lote anterior.
4. `DELETE` filas bandeja del `staging_id`.
5. `insertFilasDesdeCarrito()` — INSERT 1 fila por par · `moverStockMolecula(-1)` por unidad.

### 5.3 CERRAR → caja

**Endpoint:** `POST /api/tickets/staging/{id}` body `{ accion: "cerrar", cliente_id }`  
**Motor:** `enviarStagingACaja()`

1. Validar `estado = ABIERTO` y `total_pares > 0`.
2. `BEGIN` transacción.
3. `SELECT id … FOR UPDATE` — bloqueo filas del lote (no usar `MAX() … FOR UPDATE`).
4. Si no hay `numero_fi_fa` en el lote → `reservarNumeroFiFa()`.
5. `UPDATE` todas las filas activas → `PENDIENTE_CAJA`, asignar `numero_fi_fa`, `cerrado_at`.
6. `COMMIT`.

**Prohibido en UI:** botón «Listo → caja» en panel FACTURAS (eliminado).

### 5.4 Caja Report (`/tablet-bazzar/{cliente_id}`)

**Query:** `queryTickets()` · estado API `EMITIDO` → BD `PENDIENTE_CAJA` | `CSV_DESCARGADO`  
**Tabla:** `ticket_bandeja_cajero` · **sin filtro de fecha** en pendientes.

Acciones cajero: titular · quitar par · CSV · Enviar a Empaque.

### 5.5 Reabrir desde FACTURAS

**Motor:** `reabrirStagingDesdeCaja()` — solo `UPDATE estado → ABIERTO`.  
**No restaura stock** (sigue reservado en bandeja). Por eso la validación sync-cart debe sumar reserva bandeja (§6).

---

## 6. Lógica de stock (crítica)

### 6.1 Regla de oro

| Momento | Depósito | Bandeja |
|---------|----------|---------|
| Par entra al carrito (sync) | −1 | +1 fila ABIERTO |
| Editar carrito (re-sync) | restaurar viejos + descontar nuevos | replace filas |
| CERRAR | sin cambio | cambio estado only |
| Cancelar | +1 por par | delete |
| Sync depósito Report | **reemplazo total** desde Retail | **no toca** |

### 6.2 Validación stock en `sincronizarStagingDesdeCarrito`

**Error lógico corregido (2026-06-24):** no basta `SELECT SUM(cantidad) FROM deposito`.

Fórmula correcta por molécula (linea_id, referencia_id, material_id, color_id, grada):

```
stock_disponible = stock_deposito + pares_ya_reservados_en_bandeja_del_mismo_lote
```

Implementación: `reservadoBandejaMap(cur.lineas)` + `sqlCantidadMolecula()`.

**Motivo:** al reabrir FI_FA:1 el depósito muestra 0 pero el par sigue reservado en bandeja hasta el re-sync.

### 6.3 Decremento atómico

`sqlDecrementarUnParMolecula()` — `UPDATE … WHERE id = (SELECT id … FOR UPDATE SKIP LOCKED LIMIT 1)`.

### 6.4 Sync depósito vs ventas POS

- **Sync depósito** repone catálogo desde Retail · **ignora** ventas ya descontadas en sesión POS.
- Tras pruebas POS sin sync: depósito puede tener **menos** pares que Retail (moléculas consumidas).
- **Reset POS** no repone depósito — solo restaura stock desde bandeja activa antes de borrar transaccionales.

---

## 7. Sync depósito (Report)

**Endpoint:** `POST /api/depositos/sync` · `{ "cliente_id": 2100 }` opcional  
**Código:** `report/src/app/api/depositos/sync/route.ts`

Por cada `deposito_1_{id}_tienda`:

1. `DELETE FROM deposito_1_*_tienda` — **borra todo el stock operativo**.
2. `INSERT … SELECT` desde `registro_st_vt_rc_reposicion` WHERE:
   - `cliente_id = :id`
   - `tipo_movimiento = 'stock'`
   - `marca_id` ∈ `tiendas_marcas` activas.

**Guard 409:** bloqueado si existe lote `ABIERTO` en bandeja (`staging-guard.ts`).  
**No bloquea** por `PENDIENTE_CAJA` — solo ABIERTO.

**Nota técnica:** DELETE e INSERT no están en una sola transacción SQL; si INSERT falla, reintentar sync.

**No toca:** `ticket_bandeja_cajero`, `bobeda_venta_pos`, `pos_fi_fa_counter`.

---

## 8. Reset ventas POS

**Script:** `report/scripts/reset_pos_bazzar_ventas.mjs`

1. Restaura stock desde filas bandeja activas (`ABIERTO`, `PENDIENTE_CAJA`, `CSV_DESCARGADO`).
2. `DELETE` bandeja, bobeda, legacy staging, `pos_fi_fa_counter`.
3. Reinicia secuencias lote e id.

**No toca** tablas depósito. Tras reset: FACTURAS vacío = correcto.

---

## 9. FI_FA — reglas e integridad

### Display canónico

```
{Nombre} {Apellido} - FI_FA: {numero_fi_fa}
```

Helper: `lib/fi-fa-display.ts` (tablet + report).

### Unicidad

- **Fuente canónica:** `pos_fi_fa_counter` + `reservarNumeroFiFa()` en transacción.
- **Migración 009:** eliminado índice erróneo `uq_tbc_cliente_fi_fa_activo` en `(cliente_id, numero_fi_fa)` **por fila** — incompatible con N filas = 1 par compartiendo el mismo FI_FA.

### Bug CERRAR corregido

`MAX(numero_fi_fa) … FOR UPDATE` → inválido en PostgreSQL.  
Fix: bloquear filas con `SELECT id … FOR UPDATE`, luego `MAX` sin lock.

---

## 10. Filtros tablet (triángulo header)

| Chip UI | Fuente SQL | Join |
|---------|------------|------|
| Género | `COALESCE(l.genero_id, s.genero_id)` | `linea` |
| Marca | `COALESCE(l.marca_id, s.marca_id)` | `linea` |
| Estilo | `COALESCE(lr.grupo_estilo_id, s.grupo_estilo_id)` | `linea_referencia` |
| **Tipo 1** | `COALESCE(lr.tipo_1_id, s.tipo_1_id)` | `linea_referencia` |
| Categoría | `tipo_v2` depósito | CALZADO / CONFECCIONES |

Report análisis depósito agrupa por `genero_id` denormalizado en fila depósito (incluye filas cantidad=0). Tablet solo muestra géneros con **stock vendible** (`cantidad > 0`).

---

## 11. Migraciones SQL

| # | Archivo | Contenido |
|---|---------|-----------|
| 007 | `007_unify_bandeja_operativa.sql` | Estados bandeja · secuencia lote · sin FK staging |
| 008 | `008_bandeja_integridad_escala.sql` | `staging_id NOT NULL` · índices escala |
| 009 | `009_fix_fi_fa_unique_per_lote.sql` | Drop índice FI_FA por fila |

Aplicar desde report: `node scripts/run_migration_007.mjs` · `008` · `009`.

---

## 12. Scripts diagnóstico (report)

| Script | Uso |
|--------|-----|
| `diag_pre_sync_pos.mjs [cliente_id]` | Transaccionales vacíos · paridad depósito vs Retail |
| `diag_bandeja_caja_2100.mjs` | Estado bandeja por tienda |
| `diag_diff_deposito_retail_2100.mjs` | Filas donde depósito ≠ Retail |
| `diag_molecula_109701.mjs` | Rastreo molécula L·R·Mat·Color |
| `diag_genero_tipo1_tablet_vs_report.mjs` | Paridad filtros género / tipo1 |
| `promote_lote_caja.mjs [lote] [cliente]` | Emergencia: ABIERTO → PENDIENTE_CAJA |
| `reset_pos_bazzar_ventas.mjs` | Reset transaccionales POS |
| `smoke_primera_factura_bandeja.mjs` | Smoke FI_FA:1 + caja |

---

## 13. Matriz permisos (resumen)

| Acción | Vendedor tablet | Cajero Report | Director |
|--------|-----------------|---------------|----------|
| Editar carrito ABIERTO | ✅ | ❌ | ✅ |
| **CERRAR** → caja | ✅ | ❌ | ✅ |
| FACTURAS Abrir / Cancelar | ✅ | ❌ | ✅ |
| Ver bandeja caja | ❌ | ✅ su tienda | ✅ |
| Titular · quitar par · CSV | ❌ | ✅ pre-Empaque | ✅ |
| Enviar a Empaque | ❌ | ✅ | ✅ |
| Sync depósito Retail | ❌ | ❌ | ✅ |
| Reset POS | ❌ | ❌ | ✅ |

---

## 14. Referencias de código

| Pieza | Repo | Ruta |
|-------|------|------|
| Motor bandeja | tablet-bazzar | `lib/server/tickets-staging.ts` |
| Sync carrito | tablet-bazzar | `app/api/tickets/staging/[id]/sync-cart/route.ts` |
| CERRAR | tablet-bazzar | `app/api/tickets/staging/[id]/route.ts` |
| SQL catálogo / stock | tablet-bazzar | `lib/server/catalogo-sql.ts` |
| Pilares lectura | tablet-bazzar | `lib/server/pilar-triangulo.ts` |
| Filtros UI | tablet-bazzar | `components/cadena/FiltrosCabecera.tsx` |
| Query caja | report | `src/lib/caja-bazzar/tickets-db.ts` |
| Edición cajero | report | `src/lib/caja-bazzar/tickets-edit.ts` |
| Handoff Empaque | report | `src/lib/caja-bazzar/handoff-bobeda.ts` |
| Guard sync | report | `src/lib/caja-bazzar/staging-guard.ts` |
| Sync depósito | report | `src/app/api/depositos/sync/route.ts` |
| Estados API↔BD | report | `src/lib/caja-bazzar/pos-tables.ts` |

---

## 15. Checklist smoke (obligatorio tras cambios POS)

- [ ] Carrito 2 pares → CERRAR → FI_FA:1 visible en Report caja.
- [ ] FACTURAS Abrir → editar qty → sin error «hay 0, pediste 1».
- [ ] CERRAR otra vez → mismo FI_FA · visible caja.
- [ ] Tienda B no ve bandeja tienda A.
- [ ] Sync depósito bloqueado con lote ABIERTO (409).
- [ ] Sync depósito OK con transaccionales vacíos.
- [ ] `npm run build` tablet-bazzar + report.

---

## 16. Catálogo de funciones — motor tablet (`tickets-staging.ts`)

| Función | Cuándo se llama | Qué hace | Efecto stock | Transacción |
|---------|-----------------|----------|--------------|-------------|
| `contarStagingPendiente(clienteId?)` | Guard sync depósito (Report) | Cuenta lotes `ABIERTO` distintos | — | No |
| `listarStaging(clienteId, estado?)` | Panel FACTURAS tablet | Lista hasta 50 lotes por `staging_id` | — | No |
| `crearStagingDesdeCarrito(input, vendedor)` | Primera venta / COBRAR nuevo | `nextLoteId()` · valida stock depósito · `insertFilasDesdeCarrito` | −1 por par | Sí |
| `sincronizarStagingDesdeCarrito(loteId, input, vendedor)` | Editar carrito ABIERTO | Valida `stock_deposito + reserva_bandeja` · `restaurarLineas` · DELETE filas · re-insert | neto 0 si misma qty | Sí |
| `enviarStagingACaja(loteId, clienteId)` | **CERRAR** tablet | `FOR UPDATE` filas · `reservarNumeroFiFa` si falta · `PENDIENTE_CAJA` | sin cambio | Sí |
| `reabrirStagingDesdeCaja(loteId, clienteId)` | FACTURAS → Abrir | `PENDIENTE_CAJA\|CSV` → `ABIERTO` · `cerrado_at = NULL` | sin cambio | Sí |
| `reabrirStagingCompleto(loteId, clienteId)` | Router reabrir | Delega según estado actual | — | — |
| `cancelarPedidoCompleto(loteId, clienteId)` | Cancelar pedido | `restaurarLineas` · DELETE o `CANCELADO` | +1 por par | Sí |
| `cambiarEstadoStaging(loteId, clienteId, estado)` | API estado | `ABIERTO` → reabrir · `CANCELADO` → cancelar | según acción | Sí |
| `editarLineasStaging(loteId, clienteId, patches)` | Patch líneas | Solo `ABIERTO` · desactiva filas | parcial | Sí |
| `promoverStagingAOro(...)` | **Legacy alias** | Llama `enviarStagingACaja` — ya no copia a otra tabla | — | — |

### Helpers internos críticos

| Helper | Lógica |
|--------|--------|
| `insertFilasDesdeCarrito` | Por cada unidad: `moverStockMolecula(-1)` + INSERT 1 fila `cantidad=1` |
| `restaurarLineas` | Por cada fila activa del lote: `moverStockMolecula(+1)` |
| `reservadoBandejaMap(lineas)` | Agrupa pares ya en bandeja del lote por molécula (L·R·Mat·Color·grada) |
| `moverStockMolecula` | `sqlDecrementarUnParMolecula` o incremento simétrico en depósito tienda |
| `reservarNumeroFiFa(client, clienteId)` | `INSERT … ON CONFLICT UPDATE pos_fi_fa_counter RETURNING last_num` |
| `nextLoteId(client)` | `nextval('ticket_bandeja_lote_id_seq')` |
| `fetchStagingById` | Agrupa filas por `staging_id` → objeto `StagingTicket` |

### Endpoints tablet que invocan el motor

| Método | Ruta | Función |
|--------|------|---------|
| POST | `/api/tickets/staging` | `crearStagingDesdeCarrito` |
| POST | `/api/tickets/staging/{id}/sync-cart` | `sincronizarStagingDesdeCarrito` |
| POST | `/api/tickets/staging/{id}` `{ accion: "cerrar" }` | `enviarStagingACaja` |
| POST | `/api/tickets/staging/{id}` `{ accion: "reabrir" \| "cancelar" }` | `cambiarEstadoStaging` |
| GET | `/api/tickets/staging?cliente_id=` | `listarStaging` |

---

## 17. Catálogo de funciones — caja Report (`src/lib/caja-bazzar/`)

### Lectura y agrupación

| Función | Archivo | Descripción |
|---------|---------|-------------|
| `queryTickets(q)` | `tickets-db.ts` | Lista filas bandeja o bobeda. Pendientes **sin filtro de día**. API `EMITIDO` → BD `PENDIENTE_CAJA` |
| `groupTicketsByFactura(tickets)` | `group-facturas.ts` | Agrupa por `(cliente_id, staging_id, numero_fi_fa)` → cabecera factura |
| `formatFacturaInternaPos(...)` | `fi-fa-display.ts` | `{Nombre} - FI_FA: {n}` |
| `titularClientePos(row)` | `tickets-db.ts` | Prioridad: snapshot → clients_bazaar → cédula |
| `queryHubStats(clienteIds)` | `tickets-db.ts` | Contadores hub por tienda (bandeja + bobeda) |

### Mutaciones cajero (pre-Empaque)

| Función | Archivo | Descripción | Stock |
|---------|---------|-------------|-------|
| `actualizarTitularFacturaEmitida(...)` | `tickets-edit.ts` | PATCH nombre/teléfono en `snapshot_json` de todas las filas del lote | — |
| `eliminarLineaEmitida(codigo, clienteId)` | `tickets-edit.ts` | DELETE 1 fila bandeja · `restaurarStock` +1 en depósito | +1 |
| `marcarCsvDescargado(stagingId, clienteId)` | `handoff-bobeda.ts` | `UPDATE estado → CSV_DESCARGADO` | — |

### Handoff ORO

| Función | Descripción |
|---------|-------------|
| `enviarBandejaAEmpaque(input)` | Transacción: SELECT bandeja `PENDIENTE_CAJA\|CSV` → INSERT `bobeda_venta_pos` (`codigo_oro = ORO-{codigo_bandeja}`) → DELETE bandeja. **No restaura stock** — venta consumida |
| `marcarEntregadoBobeda(...)` | Bobeda `PENDIENTE_ENTREGA` → `ENTREGADO` |
| `marcarFacturados(codigos, clienteId)` | Legacy bobeda — marcar facturado legal |

### Guards y acceso

| Función | Descripción |
|---------|-------------|
| `assertSinStagingPendiente(clienteId?)` | 409 si hay lote `ABIERTO` — usado antes sync depósito |
| `contarTicketsStagingPendientes(clienteId?)` | Mismo conteo desde Report (duplicado lógico tablet) |
| `resolveCajaAccess(session)` | Rol BAZZAR + tienda permitida |
| `fuentePorEstadoApi` / `estadosFiltroBd` | Mapeo API ↔ columnas bandeja/bobeda |

### Rutas Report

| Ruta UI | API típica |
|---------|------------|
| `/tablet-bazzar/{cliente_id}` | GET tickets `estado=EMITIDO` |
| Acciones factura | PATCH titular · DELETE línea · POST CSV · POST empaque |

---

## 18. Mapa API ↔ estado BD

| UI / API | Valor API | Columna BD `ticket_bandeja_cajero.estado` |
|----------|-----------|-------------------------------------------|
| Carrito tablet | — | `ABIERTO` |
| Caja pendiente | `EMITIDO` | `PENDIENTE_CAJA` |
| Post CSV | `CSV_DESCARGADO` | `CSV_DESCARGADO` |
| Empaque | — | fila eliminada → `bobeda_venta_pos` |
| Cancelado | — | `CANCELADO` o DELETE |

Bobeda: `PENDIENTE_ENTREGA` → `ENTREGADO` (Empaque tablet P-13).

---

**Documento canónico v2 · bandeja única · reemplaza descripción dual staging+bandeja en docs anteriores.**
