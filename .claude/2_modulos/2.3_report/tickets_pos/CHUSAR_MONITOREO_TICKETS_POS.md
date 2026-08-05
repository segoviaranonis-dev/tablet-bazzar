# CHUSAR — Report · Monitoreo tickets POS Tablet

> **⚠️ Evolucionado a Caja Bazzar** — usar [CHUSAR_CAJA_BAZZAR_REPORT.md](../caja_bazzar/CHUSAR_CAJA_BAZZAR_REPORT.md) · plan [PLANIFICACION_CAJA_BAZZAR_HIEDRA.md](../../../4_etapas/PLANIFICACION_CAJA_BAZZAR_HIEDRA.md)

**Código:** `2.3.2.2`  
**Etapa cruzada:** [ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md](../../../4_etapas/ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md) 🟢 ABIERTA  
**Tablet espejo:** [CHUSAR_TICKETS_POS_STOCK](../../2.4_tablet_bazzar/CHUSAR_TICKETS_POS_STOCK.md) (`2.4.2.3`)  
**App:** `report/` · puerto dev **3001**  
**Doc app:** `report/docs/TICKETS_POS_MONITOREO.md`

---

## Rol de Report aquí

Report **no vende**. Audita y monitorea:

- Tickets emitidos desde Tablet (`public.ticket_venta_pos`).
- Estado depósitos tienda (sync Retail → 6 tablas nivel 1).
- Puente gerencial entre piso (~60 tablets) y dirección.

**Ruta principal:** `/tablet-bazzar`  
**Admin depósitos:** `/depositos-bazzar` (código `2.3.2.1`)

---

## Datos fuente

| Tabla | Uso en Report |
|-------|---------------|
| `ticket_venta_pos` | Listado tickets · filtros tienda/fecha/vendedor |
| `deposito_1_*_tienda` | KPIs stock · pares + registros |
| `registro_st_vt_rc_reposicion` | Origen sync Retail (no tickets) |

**Blindado:** `registro_ventas_general_v2` — prohibido JOIN.

---

## Estado UI (2026-06-22)

| Pieza | Archivo | Estado |
|-------|---------|--------|
| Página monitoreo | `src/app/tablet-bazzar/page.tsx` | ✅ shell + depósitos sync |
| API sync depósitos | `src/app/api/depositos/sync/route.ts` | ✅ GET registros + **pares** |
| API tickets | `src/app/api/tickets/pos/route.ts` | ⏳ crear |
| Listado tickets UI | `/tablet-bazzar` | ⏳ tabla + filtros |

---

## API objetivo — `GET /api/tickets/pos`

**Auth:** sesión Report · roles ADMIN/DIOS (BAZZAR solo módulo Bazzar según matriz).

**Query params:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `cliente_id` | number? | Filtrar tienda |
| `desde` / `hasta` | ISO date? | Rango `created_at` |
| `vendedor_id` | number? | Filtrar vendedor |
| `limit` / `offset` | number? | Paginación |

**Respuesta mínima:**

```json
{
  "tickets": [
    {
      "codigo_ticket": "POS-2100-...",
      "cliente_id": 2100,
      "marca": "ACTVITTA",
      "vendedor_nombre": "...",
      "grada": "37",
      "estado": "EMITIDO",
      "created_at": "...",
      "snapshot_json": { "linea_codigo": "...", "referencia_codigo": "..." }
    }
  ],
  "total": 42,
  "pares_hoy": 42
}
```

---

## UI objetivo `/tablet-bazzar`

1. **Bloque POS** — enlace `tablet-bazzar.vercel.app` (ya existe).
2. **Depósitos** — cards con **pares** primario + registros (parcial ✅).
3. **Tickets hoy** — tabla orden `created_at DESC` · badge tienda · código ticket · molécula · grada · vendedor.
4. **Filtros** — select `cliente_id` (6 tiendas) · fecha.
5. **Enlaces** — cada tienda → `/depositos-bazzar/{cliente_id}`.

---

## Roles (matriz holding)

| Perfil | `/tablet-bazzar` |
|--------|------------------|
| RIMEC DIOS | ✅ |
| RIMEC ADMIN | ✅ |
| RIMEC VENDEDOR | ❌ |
| BAZZAR ADMIN | ✅ (solo acordeón Bazzar) |

---

## Validación mínima (agente)

```bash
cd report && npm run build
```

Smoke post-implementación:

1. COBRAR 1 ticket en Tablet 2100.
2. Abrir Report `/tablet-bazzar` → fila visible < 30 s (poll o refresh).
3. `/depositos-bazzar` → pares Fernando Adultos coherentes con venta.

---

## Prohibido

- Emitir tickets desde Report.
- Escribir en depósito desde Report (solo sync admin en `/depositos-bazzar`).
- Mezclar KPIs Sales Report NIIF con tickets POS.

---

**CHUSAR activo — enlazado navegador 2.3.2.2 — 2026-06-22**
