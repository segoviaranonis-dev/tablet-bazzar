# ETAPA — Tickets POS · Stock · Report

**ID:** `ETAPA-TICKETS-POS-STOCK-20260622`  
**Estado:** 🟢 ABIERTA · código ✅ · **smoke venta ⏳**  
**Etapa holding:** `.claude/4_etapas/ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md`  
**CHUSAR:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TICKETS_POS_STOCK.md` · `CHUSAR_TABLET_VENDEDOR_STAGING.md` (2.4.2.3.1)  
**Puerto dev:** 3000  
**Deploy:** `tablet-bazzar.vercel.app`

---

## Objetivo app

Completar venta POS: **CERRAR** → staging intermedia (stock sesión) → **ORO** (`ticket_venta_pos`) → monitoreo Report / caja P-12.

Supersede parcialmente [ETAPA_4_TICKET_BOTON.md](./ETAPA_4_TICKET_BOTON.md) (carrito v1 — histórico).

---

## Qué ya funciona (2026-06-22)

| Componente | Detalle |
|------------|---------|
| Carrito | `PosCartContext` · localStorage `tablet_pos_cart_v1` |
| Grada venta | `GradaVentaStrip` — tap = +1 par |
| Sheet venta | `PosCartSheet` — cédula + vendedor + **CERRAR** |
| Vendedor | `vendedor_bazzar` por ente · código 36/2/505/18 |
| API CERRAR | `POST /api/tickets/confirm` → staging ABIERTO |
| Stock sesión | Decremento atómico en `tickets-staging.ts` |
| Panel Tickets | Editar · cancelar · cerrar · promover ORO |
| Cliente | `upsertClienteBazaar` — cédula obligatoria para CERRAR |

Ver [PRUEBA_VENDEDOR_STAGING.md](./PRUEBA_VENDEDOR_STAGING.md) · [ARQUITECTURA_SESION_STOCK_ORO.md](./ARQUITECTURA_SESION_STOCK_ORO.md)

---

## Pendiente pre-cierre etapa

**Smoke E2E** 1 venta real (cédula → código → CERRAR → ORO → Report).  
**Deploy** tablet local → Vercel (Claude Code).

---

## Tabla `ticket_venta_pos`

Migración: `supabase/migrations/001_ticket_venta_pos.sql`

| Columna | Notas |
|---------|-------|
| `codigo_ticket` | UNIQUE · `POS-{cliente_id}-{stamp}-{rnd}-{idx}` |
| `cliente_id` | Tienda sesión (2100…3200) |
| `linea_id` … `color_id` | FK pilares |
| `grada` | Talla vendida |
| `cantidad` | Siempre 1 (1 ticket = 1 par) |
| `estado` | Default `EMITIDO` |
| `snapshot_json` | Códigos + descripciones + imagen URL |
| `vendedor_id` / `vendedor_nombre` | Desde JWT sesión |
| `cedula_cliente` / `clients_bazaar_id` | Opcional |

---

## Depósitos sesión (6 tiendas)

Config: `lib/depositos-config.ts`

| cliente_id | Tabla venta |
|------------|-------------|
| 2100 | `deposito_1_2100_tienda` |
| 2900 | `deposito_1_2900_tienda` |
| 2400 | `deposito_1_2400_tienda` |
| 2700 | `deposito_1_2700_tienda` |
| 3100 | `deposito_1_3100_tienda` |
| 3200 | `deposito_1_3200_tienda` |

Origen datos tienda: Excel Retail → Report sync → estas tablas.

---

## Flujo operador

```
Login (cliente_id tienda)
  → /cadena → molécula
  → tap grada (+1 par)
  → Venta → PosCartSheet
  → COBRAR
  → POST /api/tickets/confirm
  → [objetivo] stock −N · N tickets · live refresh
```

---

## Live y ~60 usuarios

- `/api/live` consulta stock por molécula (3 ubicaciones en cadena).
- Post-COBRAR: invalidar poll cliente para molécula vendida.
- Venta en 2100 **no** cambia stock SM/Palma — solo refresca sus paneles al poll.

---

## Header métricas

`CadenaEntradaHeader` muestra **registros** + **pares** (pares naranja primario). Coherente con Report `/depositos-bazzar`.

---

## Criterios cierre (app)

- [ ] UPDATE cantidad en transacción con INSERT ticket
- [ ] Error claro sin stock — cero side effects
- [ ] Migración aplicada Supabase prod
- [ ] Build OK · smoke 2100 documentado en evidencia JSON

---

## Referencias

- Holding etapa: `.claude/4_etapas/ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md`
- Report monitoreo: `report/docs/TICKETS_POS_MONITOREO.md`
- Arquitectura ORO: `.claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md`
- Evidencia apertura: [evidencia/ETAPA_TICKETS_POS_APERTURA_20260622.json](./evidencia/ETAPA_TICKETS_POS_APERTURA_20260622.json)

---

**Apertura 2026-06-22**
