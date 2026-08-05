# CHUSAR — Tablet · Vendedor · Staging · CERRAR venta

**Código:** `2.4.2.3.1`  
**Etapa:** [ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md](../../4_etapas/ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md) 🟢 ABIERTA  
**Sub-sesión:** [SUBSESION_TABLET_VENDEDOR_STAGING_20260622.md](../../4_etapas/SUBSESION_TABLET_VENDEDOR_STAGING_20260622.md) — prep cierre · smoke pendiente  
**App:** `tablet-bazzar/` · dev **localhost:3000**  
**Doc app:** `tablet-bazzar/docs/PRUEBA_VENDEDOR_STAGING.md` · `tablet-bazzar/docs/ARQUITECTURA_SESION_STOCK_ORO.md`

---

## Qué hace este sub-módulo

Cierra el circuito **venta en piso** con tres identidades obligatorias antes de **CERRAR**:

1. **Tienda** — sesión JWT (`cliente_id` 2100…3200)  
2. **Cliente** — cédula + **Buscar** (`clients_bazaar`)  
3. **Vendedor** — **código** (no PIN biométrico) · FK `vendedor_bazzar` por **ente**

**CERRAR** crea `ticket_pos_staging` **ABIERTO** y descuenta stock de sesión. **Listo → caja** inserta **`ticket_bandeja_cajero`** (P0) — Bobeda **`bobeda_venta_pos`** solo tras handoff cajero (ver [MEMORIA_SECUNDARIA 2.3.2.2.10](../2.3_report/caja_bazzar/MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md)).

---

## Vendedores cargados (2026-06-22)

| Ente | Nombre | CI | Código | Cargo |
|------|--------|-----|--------|-------|
| Fernando | Sara Caceres | 2433908 | **36** | Gerente de salón |
| Fernando | Marly Arami Mendoza Mora | 5393866 | **2** | Vendedor |
| San Martín | Cynthia Elena Barboza | 1908565 | **505** | Gerente de salón |
| San Martín | Sergio Martínez | 5888045 | **18** | Vendedor |

**Regla ente:** Sara/Marly venden en Fernando **2100 + 2900**; Cynthia/Sergio en San Martín **2400 + 2700**. No cruzan entes.  
**Unicidad:** migración `004_vendedor_por_ente.sql` → `(ente_id, codigo_pin)` único.

---

## Rutas y archivos canónicos

| Pieza | Ruta |
|-------|------|
| UI carrito + CERRAR | `components/pos/PosCartSheet.tsx` |
| Código vendedor | `components/pos/VendedorPinButton.tsx` |
| Switch mismo ente | `components/pos/VendedorEnteSwitch.tsx` |
| Estado vendedor (sin persistir) | `lib/vendedor/VendedorContext.tsx` |
| API lista | `GET /api/vendedor/lista?cliente_id=` |
| API confirm | `POST /api/tickets/confirm` → `lib/server/tickets-staging.ts` |
| Identificación | `lib/server/vendedor-bazzar.ts` |
| Cliente cédula | `lib/server/clients-bazaar.ts` · [CHUSAR_POS_CLIENTE_CEDULA](./CHUSAR_POS_CLIENTE_CEDULA.md) |
| Staging CRUD | `app/api/tickets/staging/` · `staging/[id]/` |
| Panel Tickets (solo staging) | `components/pos/StagingTicketsPanel.tsx` — ABIERTO +/− · **no Bobeda** |
| Migraciones | `001` ticket · `002` clients · `003` staging · `004` vendedor por ente |

---

## Leyes operativas (tablet compartida)

| Ley | Detalle |
|-----|---------|
| **No persistir vendedor** | Tablet pasa de mano en mano — `clearVendedor()` al vaciar carrito o venta exitosa |
| **CERRAR bloqueado** | Sin cliente identificado **y** vendedor asignado |
| **Stock sesión** | Descuento al crear staging; restaura al cancelar/editar |
| **Sync Retail bloqueado** | Si staging `ABIERTO` o `CERRADO` pendiente de ORO |
| **Bobeda intocable** | `ticket_venta_pos` — sin DELETE en UI · ver MS 2.3.2.2.10 |
| **Sales Report blindado** | Cero touch a `registro_ventas_general_v2` |

---

## Flujo operador (smoke pre-cierre)

```
/cadena → tienda + marca → INGRESAR → agregar par
  → carrito → cédula + Buscar
  → código vendedor (ej. 36) o picker Sara/Marly
  → CERRAR → staging ABIERTO + stock −
  → panel Tickets → Cerrar → → ORO
  → Report /tablet-bazzar/XXXX?mod=operativa
```

---

## Estado prep cierre etapa (2026-06-22)

| Ítem | Estado |
|------|--------|
| Tablas BD (`staging`, `ticket_venta_pos`, `vendedor_bazzar`) | ✅ aplicadas Supabase |
| Stock depósitos 6 tiendas | ✅ |
| Código tablet (local) | ✅ |
| Índice Moria + navegador | ✅ este Chusar |
| Smoke E2E 1 venta | ⏳ **siguiente paso Director** |
| Deploy Vercel tablet | ⏳ Claude Code |

---

## Enlaces

| Doc | Tema |
|-----|------|
| [CHUSAR_TICKETS_POS_STOCK](./CHUSAR_TICKETS_POS_STOCK.md) | Padre 2.4.2.3 · stock atómico |
| [P-01_TRES_MODULOS_CICLO_CERRADO](./P-01_TRES_MODULOS_CICLO_CERRADO.md) | Depósito · Venta · Empaque |
| [CHUSAR_CAJA_BAZZAR_REPORT](../2.3_report/caja_bazzar/CHUSAR_CAJA_BAZZAR_REPORT.md) | P-12 Bobeda Report |
| [MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS](../2.3_report/caja_bazzar/MEMORIA_SECUNDARIA_CONEXIONES_INTERNAS.md) | **2.3.2.2.10 · mapa completo** |

---

**CHUSAR activo — 2.4.2.3.1 — prep cierre antes de prueba venta**
