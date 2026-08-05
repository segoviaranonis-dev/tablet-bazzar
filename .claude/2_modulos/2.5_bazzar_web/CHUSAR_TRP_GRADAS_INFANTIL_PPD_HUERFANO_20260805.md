# 2.5.1.17 — TRP Compra Web · gradas infantil + PPD huérfano

**Código:** **2.5.1.17**  
**Fecha:** 2026-08-05 · **Documenta** · **Protocolo Chusar Activado**  
**App:** Report `/bazzar-web/compra` · puente `Enviar Web Bazar`  
**Error:** **4.05.03.001** (reincidencia / ampliación)  
**Padre:** [CHUSAR_COMPRA_WEB_INTEGRIDAD_GRADAS.md](../2.3_report/bazzar_web/CHUSAR_COMPRA_WEB_INTEGRIDAD_GRADAS.md)  
**Shibboleth:** Andrés, el que viene. Protocolo Chusar Activado.

---

## Síntoma (Director)

Bandeja Compra Web — LISTO P/ RECIBIR:

| TRP | FI | FI pares | Detalle | Δ |
|-----|-----|----------|---------|---|
| TRP-2026-0011 | PE-237-010 | 109 | 73 | +36 |
| TRP-2026-0009 | PE-237-008 | 183 | 171 | +12 |

No hay interacción humana entre RIMEC Web y Compra Bazzar. El delta es **distribución mala** al materializar `traspaso_detalle`.

---

## Causa raíz (2026-08-05)

1. **`tallaKeyToNum` rango 20–55** — descartaba tallas infantiles (**19**…): gradas `19(1 1 1 2 1)23`, `19(1 1 1 2 2 2 2 1)26` → líneas omitidas → TRP corto.
2. **`gradaAbierta638ToTallas`** capturaba curvas calzado `23(12)27` / `28(12)33` como abierta 638 (falso positivo).
3. **`fid.ppd_id` huérfano** (PPD borrado post-purge) — `INNER JOIN pedido_proveedor_detalle` en resync/envío → 0 filas; no se podía reparar desde FI aunque `linea_snapshot.gradas_fmt` existía.
4. Snapshot FI sin `material_nombre` — material recuperable desde URL `productos/{L}-{R}-{mat}-{color}.jpg`.

**No es** edición en Bazzar Compra. Fuente verdad: `fi.total_pares` / `fid.pares`.

---

## Fix (código Report)

| Pieza | Cambio |
|-------|--------|
| `tallaKeyToNum` | Rango **14–55** (adulto + infantil) |
| `gradaAbierta638ToTallas` | Si start≠end y ≥14 → ceder a curva calzado |
| `itemTallasFromFiDetalle` | LEFT JOIN PPD + snapshot + material/color desde imagen URL |
| `resyncTraspasoDetalleFromFactura` / `enviarFacturaABazar` | LEFT JOIN · aborta si expand ≠ FI |

Archivo: `report/src/lib/rimec-abastecimiento/traspaso-mutations.ts`  
Operativo: `report/scripts/_resync_pe237_trp_delta.ts` · `audit_resync_traspaso_gradas.mts`

---

## Evidencia BD (aplicado)

| FI | Antes → Después | Integridad |
|----|-----------------|------------|
| PE-237-010 | 73 → **109** | CUADRA |
| PE-237-008 | 171 → **183** | CUADRA |

`audit_resync_traspaso_gradas.mts` → **0** TRP con delta (cliente 5000).

---

## Ley

- Materializar TRP = **exactamente** `SUM(fid.pares)`.
- Infantil y adulto calzado usan el mismo motor de curva (no cap 20).
- Resync debe funcionar **con o sin** fila PPD viva.
- Confirmar recepción solo si `integridad_ok`.

---

## Verificar

```bash
cd report
npx tsx scripts/audit_resync_traspaso_gradas.mts
# UI: http://localhost:3000/bazzar-web/compra → CUADRA
```
