# ETAPA ABIERTA — Tickets POS · Stock atómico · Monitoreo Report

**ID:** `ETAPA-TICKETS-POS-STOCK-REPORT-20260622`  
**Fecha apertura:** 2026-06-22  
**Estado:** 🟡 **DOC CERRADA** · **código v2 ✅** · smoke piso ⏳  
**Doc canónico:** [ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md](./ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md)  
**Superseded:** contenido dual staging — usar [INDICE_POS_BAZZAR.md](../../../report/docs/INDICE_POS_BAZZAR.md)  
**Director:** Héctor · **Ejecutor código:** Cursor (tablet + report APIs) · **Git/deploy:** Claude Code

---

## Resumen ejecutivo

Cuando un vendedor toca **COBRAR** en Tablet Bazzar, el sistema debe:

1. Validar stock **solo** en el depósito de la sesión (`deposito_1_{cliente_id}_tienda`).
2. Descontar `cantidad` en esa tabla **en la misma transacción** que emite el ticket.
3. Insertar **1 fila por par** en `public.ticket_venta_pos` (Ticket ORO / tikeCT).
4. Reflejar el cambio de stock en **~60 tablets** vía Supabase compartida + poll `/live`.
5. Permitir a dirección auditar tickets y stock desde **Report** (`/tablet-bazzar` + `/depositos-bazzar`).

**Brecha crítica hoy:** `confirmarTicketsPos` valida stock e inserta tickets, pero **no decrementa** `cantidad` en depósito.

---

## Códigos navegador holding

| Producto | Código | Ruta app | CHUSAR |
|----------|--------|----------|--------|
| Tablet · emisión + cobro | **2.4.2.3** | `/cadena/vista` · `POST /api/tickets/confirm` | [CHUSAR_TICKETS_POS_STOCK](../2_modulos/2.4_tablet_bazzar/CHUSAR_TICKETS_POS_STOCK.md) |
| Report · monitoreo | **2.3.2.2** | `/tablet-bazzar` | [CHUSAR_MONITOREO_TICKETS_POS](../2_modulos/2.3_report/tickets_pos/CHUSAR_MONITOREO_TICKETS_POS.md) |
| Report · admin depósitos | **2.3.2.1** | `/depositos-bazzar` | [CHUSAR_ADMIN_DEPOSITOS](../2_modulos/2.6_depositos_bazzar/CHUSAR_ADMIN_DEPOSITOS_REPORT.md) |

**Docs app:**  
- Tablet: `tablet-bazzar/docs/ETAPA_TICKETS_POS_STOCK.md`  
- Report: `report/docs/TICKETS_POS_MONITOREO.md`

**Evidencia apertura:** `tablet-bazzar/docs/evidencia/ETAPA_TICKETS_POS_APERTURA_20260622.json`

**Sub-sesiones absorbidas (redirigen aquí):**  
- [SUBSESION_TABLET_TICKETS_20260617.md](./SUBSESION_TABLET_TICKETS_20260617.md)  
- [SUBSESION_REPORT_MONITOREO_TICKETS.md](./SUBSESION_REPORT_MONITOREO_TICKETS.md)

---

## Objetivo de la etapa

Cerrar el circuito operativo **venta en piso → verdad en BD → visibilidad gerencial**, sin tocar Sales Report blindado (`registro_ventas_general_v2`).

| Entregable | Responsable | Estado doc | Estado código |
|------------|-------------|------------|---------------|
| Transacción COBRAR: validar + descontar + ticket | Tablet | ✅ | ⏳ |
| Tabla `ticket_venta_pos` aplicada en Supabase | DevOps / Claude Code | ✅ migración en repo | ⏳ apply prod |
| API listado tickets Report | Report | ✅ spec | ⏳ |
| UI monitoreo `/tablet-bazzar` (tickets + KPIs) | Report | ✅ spec | ⏳ |
| Refresh live post-cobro (~60 usuarios) | Tablet | ✅ spec | ⏳ |
| Métricas depósito: **pares** primario + registros | Ambos | ✅ hecho local | ✅ parcial |

---

## Arquitectura — flujo COBRAR

```
┌─────────────────────────────────────────────────────────────────┐
│ TABLET (sesión POS)                                              │
│  cliente_id sesión → ej. 2100 Fernando Adultos                   │
│  Carrito PosCartContext → PosCartSheet → COBRAR                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ POST /api/tickets/confirm
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ confirmarTicketsPos (lib/server/tickets-confirm.ts)              │
│  1. getDepositoByClienteId → deposito_1_2100_tienda              │
│  2. Por ítem: sqlCantidadMolecula → stock >= cantidad            │
│  3. BEGIN                                                        │
│  4. [GAP] UPDATE cantidad -= 1 por par (atómico, fila bloqueada) │
│  5. INSERT ticket_venta_pos (1 fila = 1 par, estado EMITIDO)     │
│  6. upsertClienteBazaar si cédula + nombre/tel                   │
│  7. COMMIT                                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────────────┐
│ Supabase public.*   │               │ Report (solo lectura audit)  │
│ deposito_1_*_tienda │               │ GET /api/tickets/pos (nuevo) │
│ ticket_venta_pos    │               │ /tablet-bazzar listado       │
└─────────┬───────────┘               │ /depositos-bazzar sync GET   │
          │                           └─────────────────────────────┘
          │ poll /api/live (molécula)
          ▼
┌─────────────────────────────────────────────────────────────────┐
│ Otras tablets mismo local + paneles cross-store (SM/Palma dock)  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Reglas de negocio (mandatorias)

### 1. Un ticket = un par

Cada unidad vendida genera **exactamente una fila** en `ticket_venta_pos` con `cantidad = 1` (CHECK en migración).

`codigo_ticket` único: patrón `POS-{cliente_id}-{YYYYMMDDHHmmss}-{RND}-{idx}`.

### 2. Stock solo del depósito de sesión

| cliente_id | Tienda | Tabla nivel 1 |
|------------|--------|---------------|
| 2100 | Fernando Adultos | `deposito_1_2100_tienda` |
| 2900 | Fernando Niños | `deposito_1_2900_tienda` |
| 2400 | San Martín Adultos | `deposito_1_2400_tienda` |
| 2700 | San Martín Niños | `deposito_1_2700_tienda` |
| 3100 | Palma Adultos | `deposito_1_3100_tienda` |
| 3200 | Palma Niños | `deposito_1_3200_tienda` |

**Prohibido** descontar de otra tienda aunque el dock muestre stock cross-local (San Martín / Palma son **consulta**, no origen de venta).

### 3. Molécula de validación

Clave de stock: `linea_id` + `referencia_id` + `material_id` + `color_id` + `grada` (talla).

Función SQL: `sqlCantidadMolecula` en `lib/server/catalogo-sql.ts`.

### 4. Transaccionalidad

Todo el lote del carrito en **una transacción**. Si un par falla stock → ROLLBACK completo, ningún ticket parcial.

### 5. Cliente comprador (opcional en v1)

Si hay cédula + (nombre o teléfono) → `upsertClienteBazaar` + FK `clients_bazaar_id` cuando la columna exista.

### 6. Sales Report blindado

**Prohibido** JOIN o escritura sobre `registro_ventas_general_v2`. Tickets POS viven en `ticket_venta_pos`.

### 7. Métricas depósito

En UI Tablet header y Report depósitos: mostrar **registros** (filas SKU) y **pares** (SUM cantidad). **Pares = métrica primaria** (naranja).

---

## Estado actual del código (2026-06-22)

| Pieza | Archivo | Hecho | Falta |
|-------|---------|-------|-------|
| Carrito UI | `lib/cart/PosCartContext.tsx`, `components/pos/*` | ✅ | — |
| API confirm | `app/api/tickets/confirm/route.ts` | ✅ | — |
| Lógica confirm | `lib/server/tickets-confirm.ts` | validar + INSERT | **UPDATE cantidad** |
| Migración BD | `supabase/migrations/001_ticket_venta_pos.sql` | en repo | apply Supabase |
| Live stock | `/api/live` | ✅ poll | invalidar post-COBRAR |
| Report monitoreo | `src/app/tablet-bazzar/page.tsx` | depósitos sync | listado tickets |
| Doc carrito v1 | `docs/ETAPA_4_TICKET_BOTON.md` | histórico | superseded por ETAPA_TICKETS_POS_STOCK |

---

## Plan de ejecución (código — siguiente turno)

### Fase A — Tablet · stock atómico

1. Dentro del `BEGIN` existente, **antes** de cada INSERT ticket:
   ```sql
   UPDATE deposito_1_{cliente_id}_tienda
   SET cantidad = cantidad - 1
   WHERE linea_id = $1 AND referencia_id = $2 AND material_id = $3
     AND color_id = $4 AND grada = $5 AND cantidad >= 1
   RETURNING cantidad;
   ```
2. Si `RETURNING` vacío → ROLLBACK + error stock.
3. Respuesta API incluir `stock_actualizado: true`.

### Fase B — Report · recepción audit

1. `GET /api/tickets/pos` — filtros `cliente_id`, `fecha`, `vendedor_id`, paginación.
2. Ampliar `/tablet-bazzar`: tabla tickets del día, totales pares por tienda, enlace depósito.
3. Roles: ADMIN RIMEC + DIOS (matriz holding).

### Fase C — Live ~60 usuarios

1. Tras COBRAR exitoso: evento cliente invalida cache `/live` molécula afectada.
2. Revisar intervalo poll (actual ~3–5 s) — no bajar de 2 s sin medir carga Supabase.
3. Smoke: vender 1 par en 2100 → header pares baja · dock SM/Palma sin cambio · Report ve ticket.

---

## Criterios de aceptación (cierre etapa)

- [ ] COBRAR en 2100 decrementa solo `deposito_1_2100_tienda`.
- [ ] Dos tablets mismo `cliente_id` ven stock coherente tras venta (< 10 s).
- [ ] Ticket visible en Report `/tablet-bazzar` con molécula + vendedor + timestamp.
- [ ] Venta sin stock suficiente → error claro, cero tickets, cero decrementos.
- [ ] `npm run build` OK en `tablet-bazzar` y `report`.
- [ ] Evidencia JSON cierre en `tablet-bazzar/docs/evidencia/`.

---

## Fuera de alcance

- Precio LPN Motor en ticket (campo precio — fase posterior).
- Export CSV legal / facturación.
- PWA offline con cola de ventas.
- Conexión tickets → Retail staging.
- Modificar pilares en venta (solo FK existentes).

---

## Referencias

| Doc | Ruta |
|-----|------|
| Arquitectura ORO | `.claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md` |
| Depósitos 6 tiendas | `.claude/3_arquitectura/3.2_venta_tienda/depositos.md` |
| Nomenclatura 18 tablas | `.claude/2_modulos/2.6_depositos_bazzar/NOMENCLATURA_DEPOSITOS_BAZZAR.md` |
| Carrito v1 | `tablet-bazzar/docs/ETAPA_4_TICKET_BOTON.md` |
| CHUSAR Tablet | `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TICKETS_POS_STOCK.md` |
| CHUSAR Report | `.claude/2_modulos/2.3_report/tickets_pos/CHUSAR_MONITOREO_TICKETS_POS.md` |

---

**Apertura formal etapa — Director — 2026-06-22 · Ejecución código: turno siguiente**
