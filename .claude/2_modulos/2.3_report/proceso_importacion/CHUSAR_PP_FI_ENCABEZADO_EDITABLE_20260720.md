# CHUSAR — PP tab FI · encabezado editable (plazo + descuentos)

**Código:** **2.3.1.7.5.3.2.1** · **Fecha:** 2026-07-20 · **Orden:** Documenta  
**App:** Report `:3000` · `/proceso-importacion/pedido-proveedor/[ppId]?tab=fi`

---

## Qué hace

En **PP ABIERTO**, cada tarjeta FI (`PpFiCard`) permite editar:

| Campo | Comportamiento |
|-------|----------------|
| Vendedor | PATCH inmediato · sync IC + logística pendiente |
| Plazo | Select catálogo IC |
| Desc. 1–4 | Inputs · botón **Guardar plazo y descuentos** |
| LP | `SelectorPoliticaLp` · recalcula líneas PPD |

Al guardar encabezado: recálculo `factura_interna_detalle` + totales FI + **sync IC** (desc/plazo/monto_neto).

---

## API

```
PATCH /api/proceso-importacion/pedido-proveedor/[ppId]/fi/[fiId]/encabezado
PATCH /api/proceso-importacion/pedido-proveedor/[ppId]/fi/[fiId]/vendedor
```

**Auth:** `requireMotorPreciosAdmin` (mismo gate LP PP).

**Motor:** `actualizarEncabezadoFi` (`aprobaciones-mutations.ts`) vía `actualizarEncabezadoFiDesdePp` (`fi-pp-actions.ts`).

---

## Paridad IC · CSV

- Descuentos FI = IC vinculada (mismo `cliente_id` en PP).
- CSV Carlos: `COALESCE(fi.descuento_*, ic.descuento_*)` — **FI manda** si poblada.
- Auditoría: `report/scripts/audit_fi_csv_completo.mjs [nro_fi]`

---

## Archivos

| Archivo | Rol |
|---------|-----|
| `PpFiCard.tsx` | UI editable |
| `fi-pp-actions.ts` | Mutations PP + sync IC |
| `detail-query.ts` | `plazo_id` en `PpFacturaInternaRow` |
| `encabezado/route.ts` | API PATCH |

**Deploy:** `dc7839d` (+ fixes deploy `13df3ee` · `46f43c9`).

---

**Shibboleth:** Andrés, el que viene.
