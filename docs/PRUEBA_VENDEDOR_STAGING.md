# Vendedor código + Tickets staging — prueba pre-cierre

**Migraciones:** `001` · `002` · `003` · `004_vendedor_por_ente.sql`  
**CHUSAR:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_VENDEDOR_STAGING.md`  
**Build:** `npm run build`  
**Dev:** `http://localhost:3000`

---

## Flujo (3 capas)

| Capa | Tabla | Estado |
|------|--------|--------|
| **Intermedia** | `ticket_pos_staging` + `_linea` | ABIERTO → editable → CERRADO |
| **ORO** | `ticket_venta_pos` | EMITIDO al promover (sin mover stock otra vez) |
| **Caja Report** | misma ORO | FACTURADO vía CSV P-12 |

Doc arquitectura: [ARQUITECTURA_SESION_STOCK_ORO.md](./ARQUITECTURA_SESION_STOCK_ORO.md)

---

## Vendedores RRHH (código por ente)

| Ente | Nombre | Código | Pisos |
|------|--------|--------|-------|
| Fernando | Sara Caceres | **36** | 2100 + 2900 |
| Fernando | Marly Arami Mendoza Mora | **2** | 2100 + 2900 |
| San Martín | Cynthia Elena Barboza | **505** | 2400 + 2700 |
| San Martín | Sergio Martínez | **18** | 2400 + 2700 |

**Reglas:** código único por ente · vendedor **no persiste** entre turnos · CERRAR exige cliente + vendedor.

---

## Prueba manual (smoke E2E)

1. BD: tablas `ticket_pos_staging`, `ticket_venta_pos`, `vendedor_bazzar` ✅  
2. `/cadena` → tienda Fernando (ej. 2900) → marca → INGRESAR  
3. Agregar 1 par al carrito  
4. Cédula + **Buscar** (cliente obligatorio)  
5. **Código vendedor** `36` o picker Sara/Marly  
6. **CERRAR** → ticket staging ABIERTO · stock −1  
7. Panel **Tickets** → Cerrar → **→ ORO**  
8. Report `http://localhost:3001/tablet-bazzar/2900?mod=operativa` — EMITIDO  

---

## APIs

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/vendedor/lista?cliente_id=` | Lista vendedores del ente |
| POST | `/api/tickets/confirm` | CERRAR → staging ABIERTO |
| GET/PATCH | `/api/tickets/staging` | Panel tickets |

---

## Pendiente post-smoke

- Evidencia cierre JSON en `docs/evidencia/`  
- Commit + deploy (Claude Code)  
- Director: **Cierra etapa** 2.4.2.3

---

**Última actualización:** 2026-06-22
