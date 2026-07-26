# CHUSAR — Botón impositor «Asignar listado de Precios» (v1 · Logística)

**Código:** **2.3.1.7.5.3.10** · **Ratificado:** Director · 2026-07-25  
**Actualizado:** 2026-07-26 · **Listado motor FI por select** · botón tier retirado tab FI · ver [CHUSAR_LISTADO_MOTOR_FI_PP](./CHUSAR_LISTADO_MOTOR_FI_PP.md) **2.3.1.7.5.3.14**

---

## Palabra reservada UI

**Asignar listado de Precios** — Botón impositor (único activo post-ENVIADO).

---

## Superpoder

| Regla | Detalle |
|-------|---------|
| **Ignora biblioteca** | No valida caso BCL · impone LP elegido |
| **Recalc pilares** | Línea + referencia + material → `precio_lista` evento PP |
| **Exactitud** | Redondeo comercial MIG-179 · `sqlPrecioComercialDesdePl` |
| **Logística** | `syncLogisticaMontosDesdeFi` → `monto_neto` = `fi.total_monto` |
| **Post-ENVIADO** | `allowPpEnviado: true` · única acción tab FI |

---

## Flujo impositor

```
1. Operador elige LP 1–4 (obligatorio)
2. Checkbox FI (RESERVADA/CONFIRMADA)
3. ☝ Asignar listado de Precios
4. actualizarListaPrecioFi (impone tier + recalc líneas PPD)
5. resincronizarFiDesdeListadoPp (override tier · comercial)
6. sync Logística fila a fila
```

---

## API

`POST …/recalcular-fi-logistica`

```json
{
  "fi_ids": [3423, 3424],
  "lista_precio_id": 3,
  "modo_impositor": true
}
```

---

## Código

| Pieza | Ruta |
|-------|------|
| Motor | `recalc-fi-lp-logistica.ts` · `BOTON_IMPOSITOR_LABEL` |
| UI | `PpBotonRecalcLpLogistica.tsx` |
| Override tier | `aprobaciones-mutations.ts` · `listaPrecioIdOverride` |
| Lookup L+R+M | `fi-precio-evento-lookup.ts` |

---

## Evidencia local PP-38 (2026-07-25)

| Métrica | v1 impositor LP3 |
|---------|------------------|
| FI procesadas | **78** |
| OK | **77/78** |
| Fail | **38-PV004** — sin precio LPC03 en listado PP |
| Logística sync | **77** filas |
| Δ montos FI | **Gs. 79.988.484** |
| Biblioteca | **ignorada** |

Smoke: `npx tsx scripts/_smoke_recalc_lp_logistica.mjs 38 3`

---

## v2 pendiente (lunes)

Procedimiento estándar · auditoría caso vs LP · gate prod.
