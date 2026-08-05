# Memoria secundaria — Conexiones internas Caja · Staging · Bobeda

**Código:** `2.3.2.2.10` · **Tipo:** Memoria secundaria (estructura + leyes agente)  
**Autoridad:** Director — **2026-06-16** (cambio de rumbo: **dos tablas** bandeja + Bobeda)  
**Tarea P0:** ✅ [TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md](../../4_etapas/TAREA_PENDIENTE_DOS_TABLAS_CAJA_BOBINA.md) · doc v2 [MODULO_POS_BANDEJA_UNICA_V2.md](./MODULO_POS_BANDEJA_UNICA_V2.md)  
**Cierre doc:** [ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md](../../4_etapas/ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md)  
**Índice madre:** [INDICE.md](./INDICE.md) · **Flujo:** [FLUJO_P12_P13_CAJA_BAZZAR.md](../../../../report/docs/FLUJO_P12_P13_CAJA_BAZZAR.md)  
**Tablet cruzado:** [CHUSAR_TABLET_VENDEDOR_STAGING.md](../../2.4_tablet_bazzar/CHUSAR_TABLET_VENDEDOR_STAGING.md)

> **Leer este doc antes de tocar código** en `report/` (caja) o `tablet-bazzar/` (venta POS).  
> **Sales Report** (`registro_ventas_general_v2`) = **blindado** — fuera de este mapa.

---

> **Modelo v2 (2026-06-24):** operativa = solo **`ticket_bandeja_cajero`** (tablet + caja). No escribir `ticket_pos_staging`. Ver [LOGICA_OPERATIVA_POS_BAZZAR.md](../../../../tablet-bazzar/docs/LOGICA_OPERATIVA_POS_BAZZAR.md).

---

## 1. Vocabulario sagrado (no mezclar)

| Término | Qué es | Tabla / UI | ¿Se edita ítem a ítem? |
|---------|--------|------------|------------------------|
| **Depósito sesión** | Stock del día en tienda | `deposito_1_{cliente_id}_tienda` | Sync Report · sync-cart ± |
| **Bandeja operativa** | Venta POS tablet + caja | **`ticket_bandeja_cajero`** | Tablet ABIERTO · cajero pre-Empaque |
| **Bobeda / mina de oro** | Registro permanente | **`bobeda_venta_pos`** | **NO** — usuarios solo ENTREGADO |
| ~~**Intermedia / staging**~~ | Legacy | `ticket_pos_staging` | **No escribir** |
| ~~`ticket_venta_pos`~~ | Legacy híbrido | solo lectura | **prohibido en código nuevo** |

### Ley Director (2026-06-23)

1. **Bobeda (`bobeda_venta_pos`)** — usuarios solo **`ENTREGADO`**; import histórico Director directo a Bobeda.  
2. **Bandeja (`ticket_bandeja_cajero`)** — operación cajero; se vacía al handoff Empaque.  
3. **Solo el Director** autoriza mutaciones excepcionales en Bobeda (`ANULADO`, etc.).  
4. **Arrepentimiento ítem a ítem** = staging `ABIERTO` (+/−) o bandeja pre-handoff — **nunca** Bobeda post-handoff.  
5. **Cajero:** CSV → facturador legal → **Enviar a Empaque** → INSERT Bobeda.

---

## 2. Tres capas — diagrama de conexión

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CAPA 0 · CIMIENTO (Report 2.3.2.1)                                      │
│  Excel Retail → registro_st_vt_rc_reposicion → sync → deposito_*_tienda │
│  Guard 409 si staging ABIERTO o CERRADO pendiente                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CAPA 1 · INTERMEDIA (Tablet 2.4.2.3 · :3000)                            │
│  /cadena → carrito → CERRAR → ticket_pos_staging ABIERTO                 │
│  Stock − al crear staging · Stock + al cancelar/editar −                 │
│  Botón header **Tickets** → panel staging ABIERTO/CERRADO solamente      │
│  APIs: /api/tickets/confirm · /api/tickets/staging · staging/[id]       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │ promover (→ caja)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CAPA 2 · BANDEJA CAJERO (Report 2.3.2.2 · :3001 · card A operativa)     │
│  UI: /tablet-bazzar/{cliente_id}?mod=operativa                           │
│  Lee ticket_venta_pos estado EMITIDO* (hoy) · agrupa por staging_id      │
│  Acciones: Descargar CSV · Marcar FACTURADO* · **no Eliminar ítem**      │
│  APIs: GET tickets · GET csv · POST facturar                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │ post-CSV · legal · Enviar Bobeda (objetivo)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CAPA 3 · BOBINA / BOBINA PERMANENTE                                     │
│  ticket_venta_pos — sobrevive “Actualizar stock” fin de sesión          │
│  Estados objetivo P-12: PENDIENTE_ENTREGA → ENTREGADO (Empaque 2.4.2.4) │
└─────────────────────────────────────────────────────────────────────────┘

* Transición código 2026-06: EMITIDO / FACTURADO hasta migrar nombres P-12.
```

---

## 3. Tablas BD — relaciones internas

| Tabla | PK / clave | FK / enlaces | Rol |
|-------|------------|--------------|-----|
| `deposito_1_{id}_tienda` | `id` | pilares L,R,Mat,Color,grada | Stock sesión |
| `ticket_pos_staging` | `id` | `cliente_id`, `vendedor_bazzar_id`, `clients_bazaar_id` | Header intermedia |
| `ticket_pos_staging_linea` | `id` | `staging_id` + 5 FK pilares | Pares agrupados (cantidad) |
| `ticket_venta_pos` | `codigo_ticket` UNIQUE | `staging_id`, 5 FK pilares, `cliente_id` | **Bobeda** · 1 fila = 1 par |
| `clients_bazaar` | `id` | cédula por origen ente | Cliente POS |
| `vendedor_bazzar` | `id_vendedor` | `funcionario_id`, `ente_id`, `codigo_pin` | Vendedor piso |

**Join bandeja cajero:** `ticket_venta_pos.staging_id` → agrupa factura interna por venta tablet (`group-facturas.ts`).

**Snapshot:** `snapshot_json` en staging_linea y ticket_venta_pos guarda códigos + imagen URL (no depende de JOIN pilares en UI).

---

## 4. Estados — staging vs Bobeda

### 4.1 `ticket_pos_staging.estado`

| Estado | Stock sesión | UI tablet Tickets | Pasa a caja |
|--------|--------------|-------------------|-------------|
| `ABIERTO` | Descontado · editable +/− | Sí | Tras CERRAR + promover |
| `CERRADO` | Descontado | Reabrir / → caja | Listo promover |
| `CANCELADO` | Restaurado | — | — |
| `ORO` | Sin movimiento | **No listado** en panel Tickets | Header archivado |

### 4.2 `ticket_venta_pos.estado`

| Objetivo P-12 | Hoy en código | Quién actúa | Acción UI |
|---------------|---------------|-------------|-----------|
| `PENDIENTE_CAJA` | `EMITIDO` | Cajero | Aparece bandeja |
| `CSV_DESCARGADO` | *(pendiente migrar)* | Cajero | Tras descargar CSV |
| `FACTURADO` / legal | `FACTURADO` | Cajero | POST facturar |
| `PENDIENTE_ENTREGA` | *(pendiente)* | Cajero | Enviar a Bobeda |
| `ENTREGADO` | *(pendiente)* | Empaque tablet | Confirmar entrega |
| `ANULADO` | *(pendiente)* | **Solo Director** | — |

**Regla cajero (Director):** Bobeda se consolida tras **CSV + paso legal** — la bandeja es paso previo; **no** se mutan filas atómicas desde UI.

---

## 5. Matriz app ↔ acción ↔ archivo

### 5.1 Tablet (`tablet-bazzar` · `:3000`)

| Acción operador | Estado BD | API | Código servidor | UI |
|-----------------|-----------|-----|-----------------|-----|
| COBRAR / CERRAR venta | staging `ABIERTO` + stock − | `POST /api/tickets/confirm` | `tickets-staging.ts` → `crearStagingDesdeCarrito` | `PosCartSheet.tsx` |
| Auto enviar caja | CERRADO → promover → staging `ORO` + filas `ticket_venta_pos` | confirm → `enviarStagingACaja` | `promoverStagingAOro` | confirm route |
| Editar ítem +/− | staging `ABIERTO` | `PATCH /api/tickets/staging/[id]` | `editarLineasStaging` | `StagingTicketsPanel.tsx` |
| Cancelar ticket | `CANCELADO` + stock + | `POST staging/[id]` accion cancelar | `cambiarEstadoStaging` | panel Tickets |
| Listar borradores | ABIERTO,CERRADO | `GET /api/tickets/staging` | `listarStaging` | panel Tickets |

**Prohibido en tablet (2026-06-23):** APIs o UI que hagan `DELETE` en `ticket_venta_pos`.

### 5.2 Report caja (`report` · `:3001`)

| Acción cajero | API | Código | UI |
|---------------|-----|--------|-----|
| Ver bandeja EMITIDO | `GET /api/tablet-bazzar/tickets` | `tickets-db.ts` | `TicketsPanel.tsx` mod=operativa |
| Descargar CSV factura | `GET /api/tablet-bazzar/tickets/csv` | csv route | botón naranja |
| Marcar FACTURADO | `POST /api/tablet-bazzar/tickets/facturar` | `marcarFacturados` | botón azul |
| Archivo día | `GET tickets?estado=FACTURADO` | idem | mod=facturable |
| Métricas turno | `GET tickets` sin filtro estado | idem | mod=metricas |

**Prohibido en caja (2026-06-23):** `eliminar-linea`, DELETE Bobeda, editar cantidades en bandeja.

### 5.3 Depósitos admin (Report 2.3.2.1 — distinto)

| Acción | API | Guard |
|--------|-----|-------|
| Sync Retail → 18 tablas | `POST /api/depositos/sync` | 409 si staging ABIERTO/CERRADO |

---

## 6. Seis tiendas — misma lógica, distinto `cliente_id`

| cliente_id | Ente | Tabla sesión | Ruta caja Report |
|------------|------|--------------|------------------|
| 2100 | Fernando Adultos | `deposito_1_2100_tienda` | `/tablet-bazzar/2100` |
| 2900 | Fernando Niños | `deposito_1_2900_tienda` | `/tablet-bazzar/2900` |
| 2400 | San Martín Adultos | `deposito_1_2400_tienda` | `/tablet-bazzar/2400` |
| 2700 | San Martín Niños | `deposito_1_2700_tienda` | `/tablet-bazzar/2700` |
| 3100 | Palma Adultos | `deposito_1_3100_tienda` | `/tablet-bazzar/3100` |
| 3200 | Palma Niños | `deposito_1_3200_tienda` | `/tablet-bazzar/3200` |

Config única tablet: `tablet-bazzar/lib/depositos-config.ts`  
Config caja Report: `report/src/lib/caja-bazzar/tiendas.ts`

---

## 7. Flujo operador canónico (una venta)

```
1. Tablet /cadena/vista → agregar par → carrito
2. Cédula cliente + código vendedor → CERRAR
   → ticket_pos_staging ABIERTO (stock ya −)
   → (código actual) enviarStagingACaja → ticket_venta_pos EMITIDO + staging ORO
3. Si arrepentimiento ANTES de caja:
   → solo si aún existiera staging ABIERTO: Tickets tablet +/−
   → una vez en bandeja/Bobeda: NO editar filas — protocolo cajero
4. Report /tablet-bazzar/2100?mod=operativa → **consulta BD al entrar** (pendientes EMITIDO)
   → **Actualizar bandeja** solo cuando llega otro cliente desde tablet (cola seguida)
   → acordeón por cliente · miniaturas · solo lectura ítems
5. Descargar CSV → import facturador legacy → cobro legal
6. Marcar FACTURADO (hoy) / Enviar Bobeda (objetivo P-12)
7. Fin sesión: sync depósito (Bobeda intacta)
8. Empaque (futuro): ENTREGADO
```

---

## 8. Errores de agente — lista de confusions prohibidas

| Error | Por qué está mal | Correcto |
|-------|------------------|----------|
| “Eliminar ítem en bandeja caja” | Borra/muta Bobeda | Solo staging ABIERTO tablet |
| “Panel Tickets tablet lista ORO para quitar pares” | Bobeda no editable | Panel solo ABIERTO/CERRADO |
| “ORO = editable como staging” | `staging.estado ORO` es archivo | Bobeda = `ticket_venta_pos` fija |
| “FACTURADO borra EMITIDO” | Solo cambia estado | UPDATE estado, no DELETE |
| Mezclar Sales Report con Bobeda | Ámbitos blindados separados | Cero JOIN pilares ↔ ventas v2 |
| `npm run build` con dev abierto | Corrompe `.next` (chunk 1331.js) | Parar dev → borrar `.next` → dev |

---

## 9. Migraciones Supabase (orden)

| # | Archivo | Contenido |
|---|---------|-----------|
| 001 | `001_ticket_venta_pos.sql` | Bobeda base |
| 002 | `002_clients_bazaar.sql` | Cliente cédula |
| 003 | `003_vendedor_ticket_staging.sql` | Staging + FK ticket |
| 004 | `004_vendedor_por_ente.sql` | PIN por ente |

Ruta: `tablet-bazzar/supabase/migrations/` (compartida conceptualmente con Report misma BD).

---

## 10. Índice documental cruzado

| Código | Documento | Tema |
|--------|-----------|------|
| 2.3.2.2 | [INDICE.md](./INDICE.md) | Plan P-01…P-13 |
| 2.3.2.2.10 | **Este archivo** | Conexiones internas |
| 2.3.2.2.7 | [P-12_PROTOCOLO_CAJERO_BOBINA.md](./P-12_PROTOCOLO_CAJERO_BOBINA.md) | Protocolo cajero |
| 2.3.2.2.8 | [P-13_MODULO_ENTREGAS_BOBINA.md](./P-13_MODULO_ENTREGAS_BOBINA.md) | Empaque |
| 2.3.2.2.9 | [FLUJO_P12_P13](../../../../report/docs/FLUJO_P12_P13_CAJA_BAZZAR.md) | APIs · implementación |
| 2.4.2.3 | [CHUSAR_TICKETS_POS_STOCK.md](../../2.4_tablet_bazzar/CHUSAR_TICKETS_POS_STOCK.md) | Tablet padre |
| 2.4.2.3.1 | [CHUSAR_TABLET_VENDEDOR_STAGING.md](../../2.4_tablet_bazzar/CHUSAR_TABLET_VENDEDOR_STAGING.md) | Vendedor + CERRAR |
| — | [ARQUITECTURA_SESION_STOCK_ORO.md](../../../../tablet-bazzar/docs/ARQUITECTURA_SESION_STOCK_ORO.md) | 3 capas stock |
| — | [CHUSAR_CAJA_BAZZAR_REPORT.md](./CHUSAR_CAJA_BAZZAR_REPORT.md) | Leyes agente Report |

---

## 11. Pendiente implementación (no confundir con leyes)

| Ítem | Estado |
|------|--------|
| Renombrar EMITIDO → PENDIENTE_CAJA | ⏳ |
| Estado CSV_DESCARGADO post-descarga | ⏳ |
| Botón Enviar a Bobeda post-CSV | ⏳ |
| Empaque ENTREGADO (P-13) | ⏳ |
| ANULADO solo Director | ⏳ |
| Retrasar INSERT Bobeda hasta post-legal (si Director lo ordena) | ⏳ evaluar |

---

**Memoria secundaria activa — 2.3.2.2.10 — consulta obligatoria antes de mutar caja o staging.**
