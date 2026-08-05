# CHUSAR — Handoff Enviar a Empaque → Bóveda ORO

**Código:** **2.3.2.2.12** · **P-12 paso 5** · **Etapa:** [BOVEDA-STRESS-BZZ-2026](../../../4_etapas/ETAPA_BOVEDA_STRESS_TEST_BAZZAR.md)  
**Doc app:** [HANDOFF_BOVEDA_ORO_ENVIAR_EMPAQUE.md](../../../../report/docs/HANDOFF_BOVEDA_ORO_ENVIAR_EMPAQUE.md)  
**Estado:** ✅ UI + handoff · 2026-06-10 · **Vidriera:** https://rimec-report.vercel.app/tablet-bazzar

---

## Qué es

**Enviar a Empaque** es el **único puente** operativo entre la bandeja del cajero y la **Bóveda ORO** (`bobeda_venta_pos`). Sin este botón no hay registro permanente de venta ni base para análisis comercial Bazzar.

| Antes (bandeja) | Después (ORO) |
|-----------------|---------------|
| `ticket_bandeja_cajero` | `bobeda_venta_pos` |
| Efímera · editable titular · quitar par | **Inmutable** · 1 fila = 1 par vendido |
| `PENDIENTE_CAJA` / `CSV_DESCARGADO` | `PENDIENTE_ENTREGA` · `origen = POS_VIVO` |

---

## Ritual cajero (orden obligatorio)

1. Verificar **serial Activa** en barra superior ([CHUSAR_FACTURA_LEGAL_CAJA.md](./CHUSAR_FACTURA_LEGAL_CAJA.md)).
2. Corregir **titular / CI / contacto** en bandeja (antes del handoff).
3. **Descargar CSV** → facturador legacy → cobro real.
4. **Usar serial Activa** en card si bandeja sin `numero_factura_legal`.
5. **Enviar a Empaque → Bóveda ORO** — confirmación con pares + monto total · avance automático Siguiente.
6. Bandeja **vacía** para ese lote · filas visibles en Empaque / análisis futuro.

---

## Datos que viajan por par (molécula completa)

Cada INSERT ORO congela:

| Campo | Origen |
|-------|--------|
| FK pilares | `linea_id`, `referencia_id`, `material_id`, `color_id`, `grada` |
| `snapshot_json` | Códigos L·R·material·color · descripciones · `imagen_url` · `estilo` · `marca_label` |
| `snapshot_cliente` | Titular congelado al handoff (dentro de `snapshot_json`) |
| `precio_unitario` | Columna + snapshot (LPN CSV depósito) |
| Comercial | `marca`, `vendedor_nombre`, `vendedor_bazzar_id`, `numero_fi_fa`, **`numero_factura_legal`** (desde `caja_factura_legal_turno` / bandeja) |
| Cliente | `cedula_cliente`, `clients_bazaar_id` |
| Trazabilidad | `staging_id`, `bandeja_codigo` → `codigo_oro` = `ORO-{codigo_bandeja}` |
| Análisis | `fecha_venta`, `cliente_id`, `origen = POS_VIVO` |

**Función:** `report/src/lib/caja-bazzar/handoff-bobeda.ts` → `buildSnapshotOro()` + `enviarBandejaAEmpaque()`.

---

## API

| Método | Ruta | Body |
|--------|------|------|
| POST | `/api/tablet-bazzar/tickets/enviar-empaque` | `{ cliente_id, codigos?, staging_id? }` → tras OK avanza serial Siguiente |

Pre-handoff: `asegurarSerialLegalEnBandeja()` — aborta si no hay serial Activa.

Doc serial: [CHUSAR_FACTURA_LEGAL_CAJA.md](./CHUSAR_FACTURA_LEGAL_CAJA.md)

Transacción: INSERT bobeda → DELETE bandeja (mismos codigos insertados).

---

## UI Report (card operativa)

| Elemento | Rol |
|----------|-----|
| Vitales factura | Total Gs · pares · renglones |
| Bloque verde **Paso clave · Bóveda ORO** | CTA principal |
| Confirmación | Pares + monto antes de handoff |
| Líneas ítem | Precio unitario visible · quitar par solo en bandeja |

**Componente:** `report/src/components/caja-bazzar/TicketsPanel.tsx` · `PosFiLineaRow.tsx`

---

## Destino analítico

`bobeda_venta_pos` alimentará **Sales Report Bazzar** (fase posterior). **Prohibido** mezclar con `registro_ventas_general_v2` (RIMEC importadora).

Doc arquitectura: [ARQUITECTURA_DOS_TABLAS_CAJA_BOBINA.md](../../../../report/docs/ARQUITECTURA_DOS_TABLAS_CAJA_BOBINA.md)

---

## Criterios PASS piso

1. Handoff inserta N filas ORO = N pares factura.
2. Bandeja queda sin esas filas.
3. `snapshot_json` contiene artículo + titular + precio.
4. Empaque lee `PENDIENTE_ENTREGA` desde bobeda.
5. `numero_factura_legal` presente en ORO (mismo serial Activa del turno).
6. UI muestra total y artículos antes y en confirmación.

---

**Shibboleth:** Chayanne el mejor
