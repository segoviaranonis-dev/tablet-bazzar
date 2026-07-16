# CHUSAR — Deploy prod · descuentos FI + liquidación + casos PP/PC/PE

**Código:** **2.2.4.0.13**  
**Fecha:** 2026-07-16  
**Puerta:** pedido **directo** Director (Héctor) — *desplegar estado actual*  
**Riesgo:** 🔴 ALTO (dinero) · mitigado con MIG-160 en BD + build OK

---

## Alcance desplegado

| Capa | Qué |
|------|-----|
| **RIMEC Web** | Modal Guardar descuento por FI · cascada floor Gs. · badge Liq. PE · casos/promo en tarjetas · carrito CP/PE |
| **Report Aprobaciones** | Lee `fi.descuento_1..4` · `precioNetoCascada` floor · muestra `fi.caso` · resync rellena caso desde PP |
| **BD** | MIG-160 (`fn_precio_neto_cascada_gs` + `confirmar_pedido_web` por FI) · `es_liquidacion` en PE (MIG-162) |

---

## Docs canónicos

| Doc | Código |
|-----|--------|
| [CHUSAR_DESCUENTOS_FI_TRANSACCION_20260715.md](./docs/CHUSAR_DESCUENTOS_FI_TRANSACCION_20260715.md) | **2.2.4.0.12** |
| [CHUSAR_MARCA_LIQUIDACION_PE.md](./CHUSAR_MARCA_LIQUIDACION_PE.md) | **2.2.1.0.13** |
| [CHUSAR_FI_CASO_CABECERA_DESDE_PP.md](../2.3_report/facturacion/CHUSAR_FI_CASO_CABECERA_DESDE_PP.md) | **2.3.1.9.D** |

---

## Cadena de verdad (casos)

```
PP / listado Motor (caso_precio_biblioteca)
  → PPD / precio activo CP·PE
  → Carrito Web (marca + caso por FI)
  → confirmar_pedido_web → factura_interna.caso / caso_id
  → Report /aprobaciones (FiCard)
```

Admin IC / proforma: `resolve-caso-cabecera-fi.ts` al generar FI.

---

## Smoke post-deploy

1. Catálogo PE: filtro/badge Liq. visible en artículos `es_liquidacion`.
2. Carrito: Editar descuentos FI → Guardar → Revalidar → Confirmar.
3. Aprobaciones: mismos % D1–D4 y neto; CASO ≠ «Sin caso» si el PP tenía caso.
4. No confirmar cliente 5000 de prueba sin revisión Director.

---

## URLs

| App | Prod |
|-----|------|
| RIMEC Web | https://rimec-web.vercel.app |
| Report | https://rimec-report.vercel.app |

**Shibboleth:** Andrés, el que viene.
