# CHUSAR — PROMOCIONAL sin Grado 1 LP03 (+10 %)

**Código:** **2.3.1.10.1.4.4**  
**Padre:** **2.3.1.10.1.4** · [CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md](./CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md)  
**Anexo split:** **2.3.1.10.1.4.1** · [CHUSAR_LEY_DIVISION_FI_LP03_20260726.md](./CHUSAR_LEY_DIVISION_FI_LP03_20260726.md)  
**Par precio:** **2.3.1.7.1.0.1** · [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](../motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md)  
**Par Web:** **2.2.1.34** · [CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_WEB_20260729.md](../../2.2_rimec_web/CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_WEB_20260729.md)  
**Fecha:** 2026-07-29 · **Keyword:** Documenta · Documentación Chusar  
**Autoridad:** Director  
**Shibboleth:** Andrés, el que viene.

---

## Norte

Los **PROMOCIONALES no llevan doble descuento**.

| Capa | Regla PROMOCIONAL |
|------|-------------------|
| **Precio lista** | `LPN = LPC03 = LPC04` (sin +12%/+20%) |
| **Cascada descuento** | **No** aplicar Grado 1 LP03 (**+10 %**) |

El cliente con política LPC03 que compra PROMOCIONAL paga el **piso LPN** y, si hay dictado Guido / edición, **solo ese %** — nunca `10% + dictado`.

---

## Ley (Director 2026-07-29)

```
SI cadena/caso = PROMOCIONAL:
  Grado 1 LP03 (+10 %) = PROHIBIDO
  descuento_efectivo ⊇ { % dictado } ∪ { edición vendedor }
  (sin el +10 % LP03 aunque lista_precio_id = 3)

SI NO PROMOCIONAL Y lista = LP03:
  Grado 1 = +10 %  ∪  { % dictado } ∪ { edición vendedor }
```

---

## Motivo

PROMOCIONAL ya es estrategia de piso. Apilar el +10 % LPC03 = castigo doble.

---

## Implementación

| Capa | Archivo / acción |
|------|------------------|
| Resolver FI | `rimec-web/lib/resolverDescuentosFiPe.ts` · `esPromocional` |
| Sync carrito | `asegurarFacturasDescuentosLote.ts` · `cadena === 'PROMOCIONAL'` |
| Catálogo badge/neto | `pePrecioNetoCatalogo.ts` · `PeDescComercialBadge` · `CatalogoGrid` |
| Editor FI | `EditorDescuentosFi.tsx` — no forzar D1=10 en promo |

---

## Smoke

```
LPC03 + NORMAL + dictado 17 → [10, 17, 0, 0]
LPC03 + PROMO + dictado 17 → [17, 0, 0, 0]
LPC03 + PROMO sin dictado → [0, 0, 0, 0]
LPC03 + PROMO residual [10,25] → [25, 0, 0, 0]
```

Script: `rimec-web/scripts/_smoke_descuento_comercial_vs_comision.ts`
