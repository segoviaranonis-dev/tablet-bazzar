# CHUSAR — Bazzar Web Compra · integridad gradas vs FI

**Módulo:** Report `/bazzar-web/compra`  
**Error:** `4.05.03.001`  
**Fecha:** 2026-07-27  
**Etapa:** CORTE-CONTROL-ENTREGA-20260727

---

## Síntoma (Director)

Compra prueba cliente 5000: cabecera FI **35 pares**, vista técnica stock por talla **~30 pares**.

| Línea | Card FI | Vista técnica | Grada |
|-------|---------|---------------|-------|
| L2260 R301 | 12 p | 6 p | `38(1 2 3 3 2 1)43` |
| L2258 R100 | 11 p | 12 p | `37/8(2-4-4-2)43/4` |
| L2258 R101 | 12 p | 12 p | OK |

Columna **CASO** en vista técnica mostraba `—` pese a caso modificado en cabecera FI.

---

## Causa raíz

1. **`gradasFmtToTallas`** (`traspaso-mutations.ts`) filtraba tallas **33–40** → gradas 38–43 perdían 41–43 (6 p de L2260).
2. Fallback `gradas_fmt` **no escalaba** a `fid.pares` → R100: grada caja 12 vs FI 11 p.
3. **`getTraspasoDetalleLines`** JOIN débil L+R a `precio_lista` sin `LPN_CASO_LATERAL_SQL` ni `fi.caso`.

Fuente verdad pares: **`factura_interna_detalle.pares`** + **`fi.total_pares`**.  
Traspaso debe materializar **exactamente** esa cantidad en `traspaso_detalle`.

---

## Fix aplicado (código Report)

| Archivo | Cambio |
|---------|--------|
| `report/src/lib/rimec-abastecimiento/traspaso-mutations.ts` | Rango talla 20–55 vía `tallaKeyToNum`; `scaleGradesToPares` en fallback fmt; `resyncTraspasoDetalleFromFactura()` |
| `report/src/lib/bazzar-web/compra-web/queries.ts` | CASO: `LPN_CASO_LATERAL_SQL` + `fi.caso` + `ppd.descp_caso_snapshot` |

Script operativo: `report/scripts/audit_resync_traspaso_gradas.mts`

---

## Ley operativa (holding)

- **Prohibido** crear/enviar TRP si `SUM(traspaso_detalle) ≠ SUM(fid.pares)` para esa FI.
- Traspasos **ENVIADO/BORRADOR** con delta → `resyncTraspasoDetalleFromFactura` antes de confirmar recepción.
- Traspasos **CONFIRMADO** → `repararIngresoTraspasoConfirmado` (hydrate + movimiento).

---

## Auditoría pendiente (Python legacy)

`control_central/modules/facturacion/logic.py` aún cap 33–40 en ruta legacy VT — **no afecta FI CP** si flujo pasa por Report TS. Revisar en etapa unificación Streamlit.

---

## Verificación

```bash
cd report
npx tsx scripts/audit_resync_traspaso_gradas.mts          # auditoría
npx tsx scripts/audit_resync_traspaso_gradas.mts --apply  # reparar ENVIADO/BORRADOR
```

Smoke local: `:3000/bazzar-web/compra` → vista técnica suma = cabecera FI.

---

**CHUSAR — integrado** · índice error `5_errores/detalle/4.05.03.001_bazzar-compra-gradas-fi-delta.md`
