# CHUSAR — Factura legal · serial Activa por caja (bóveda ORO)

**Código:** **2.3.2.2.14** · **Etapa:** [BOVEDA-STRESS-BZZ-2026](../../../4_etapas/ETAPA_BOVEDA_STRESS_TEST_BAZZAR.md)  
**Navegador:** http://localhost:3004/modulos/report/bazzar/caja-bazzar → **Factura legal · serial Activa** (badge NEW)  
**Relacionado:** [CHUSAR_HANDOFF_BOVEDA_ORO.md](./CHUSAR_HANDOFF_BOVEDA_ORO.md) · P-12 paso 5  
**Estado:** ✅ Report UI + API + BD · 2026-06-25 · formato legal fiscal **TBD**

---

## Qué es

Dato **vital** para la bóveda: cada handoff **Enviar a Empaque** debe llevar `numero_factura_legal` en `bobeda_venta_pos`.  
El cajero gestiona el **serial pendiente** desde una barra común en **las 6 cajas** (todas las pestañas: operativa · facturable · empaque · métricas).

| Concepto | Significado |
|----------|-------------|
| **Activa** | Serial alfanumérico que se usará en la próxima factura / handoff |
| **Siguiente** | Avanza al próximo serial (incremento numérico final o sufijo `-1`) |
| **Anterior** | Restaura el serial previo del historial del turno |
| **Fijar Activa** | Override manual (formato legal externo aún no definido) |

**Preparación:** validación `^[A-Z0-9][A-Z0-9._\-/]*$` · máx. 64 chars · uppercase.

---

## Tabla BD

`public.caja_factura_legal_turno` — **1 fila por tienda** (`cliente_id` PK).

| Columna | Uso |
|---------|-----|
| `serial_activo` | Pendiente visible en UI |
| `prefijo` | Reservado formato fiscal futuro |
| `contador` | Reservado secuencia interna |
| `historial` | JSON array últimos 50 seriales (Anterior) |
| `updated_at` / `updated_by` | Trazabilidad |

**Migración:** `tablet-bazzar/supabase/migrations/011_caja_factura_legal_turno.sql`  
**Seed:** `PEND-{cliente_id}-000001` para 2100 · 2400 · 2700 · 2900 · 3100 · 3200.

**Aplicar:** `node report/scripts/apply-migration-011-factura-legal.mjs`

---

## Código Report

| Pieza | Ruta |
|-------|------|
| Motor turno | `report/src/lib/caja-bazzar/factura-legal-turno.ts` |
| Handoff stamp | `report/src/lib/caja-bazzar/handoff-bobeda.ts` → `asegurarSerialLegalEnBandeja()` |
| Barra UI | `report/src/components/caja-bazzar/FacturaLegalBar.tsx` |
| Página caja | `report/src/app/tablet-bazzar/[cliente_id]/page.tsx` (debajo sub-nav) |
| Card bandeja | `TicketsPanel.tsx` — bloque legal + «Usar serial Activa» |

---

## API

| Método | Ruta | Body / query |
|--------|------|--------------|
| GET | `/api/tablet-bazzar/factura-legal?cliente_id=` | Turno actual |
| POST | `/api/tablet-bazzar/factura-legal` | `{ cliente_id, action: "siguiente" \| "anterior" \| "set", serial? }` |
| POST | `/api/tablet-bazzar/factura-legal/asignar` | `{ cliente_id, codigos?, staging_id?, serial? }` → UPDATE bandeja |
| POST | `/api/tablet-bazzar/tickets/enviar-empaque` | Tras OK handoff → `avanzarSiguienteFacturaLegal()` |

---

## Ritual cajero (actualizado)

1. Barra superior: verificar **Activa** (o Fijar / Siguiente según facturador).
2. Bandeja: titular · CSV · cobro.
3. Card factura: **Usar serial Activa** si bandeja aún sin `numero_factura_legal`.
4. **Enviar a Empaque** — obligatorio serial; si falta, error explícito.
5. Handoff sella serial en ORO y **avance automático Siguiente** para la próxima venta.

---

## Flujo datos

```
caja_factura_legal_turno.serial_activo
    → ticket_bandeja_cajero.numero_factura_legal  (asignar / asegurar pre-handoff)
    → bobeda_venta_pos.numero_factura_legal       (INSERT ORO)
    → avanzarSiguiente → nuevo serial_activo
```

Empaque tablet/report lee `numero_factura_legal` ya congelado en ORO.

---

## 6 cajas

Misma barra y misma tabla — aislamiento por `cliente_id` (P-06).  
URLs: `/tablet-bazzar/2100` … `/3200` · query `?mod=` no oculta la barra.

---

## Pendiente Director

- Definir **formato serial legal fiscal** (SET / timbrado) → ajustar `prefijo` + reglas `incrementarSerialAlfanumerico`.
- Sincronizar con facturador legacy cuando exista contrato de número.
