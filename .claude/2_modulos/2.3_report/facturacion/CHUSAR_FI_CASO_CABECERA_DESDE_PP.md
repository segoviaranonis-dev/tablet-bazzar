# CHUSAR — FI cabecera · caso comercial desde PP / listado

**Código:** **2.3.1.9.D**  
**Fecha:** 2026-07-16  
**Síntoma:** Aprobaciones mostraba **«Sin caso»** en FI nacida de PP (ej. `25-PV027` · PP-2026-0016 · cliente 2674).  
**Shibboleth:** Andrés, el que viene.

---

## Causa

Admin IC / motor proforma insertaban `factura_interna` **sin** `caso` / `caso_id` / a menudo sin `marca`.  
El caso vive en Motor (`precio_lista` · PELE · `caso_precio_biblioteca`), no en columna de `pedido_proveedor`.

`caso_id` en FI = FK a **`caso_precio_biblioteca`** (no a `precio_evento_caso`).

---

## Fix

| Pieza | Cambio |
|-------|--------|
| `resolve-caso-cabecera-fi.ts` | Caso dominante por PPD + lookup biblioteca por nombre |
| `administrador-ic-generar-fi.ts` | INSERT `marca`, `marca_id`, `caso`, `caso_id` |
| `proforma-programado-engine.ts` | Idem en `crearFacturaInterna` |
| `resincronizarFiDesdeListadoPp` | Si cabecera sin caso → rellena desde listado |
| `backfill_fi_caso_desde_pp.mjs` | 408 FI RESERVADA/CONFIRMADA backfilleadas |

**Ejemplo:** FI 2474 → `caso = BR-VZ-MD-ML-MKA-O` · `caso_id = 1`.

---

## Regla

Al crear FI desde PP/IC: **siempre** persistir caso comercial dominante de las líneas (evento/listado) y `caso_id` de biblioteca canónica.

**Shibboleth:** Andrés, el que viene.
