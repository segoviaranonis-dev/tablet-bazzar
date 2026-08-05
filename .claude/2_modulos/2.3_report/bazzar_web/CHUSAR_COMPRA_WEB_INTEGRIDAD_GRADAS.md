# CHUSAR — Bazzar Web Compra · integridad gradas vs FI

**Módulo:** Report `/bazzar-web/compra`  
**Error:** `4.05.03.001`  
**Fecha:** 2026-07-27 · **ampliado Documenta 2026-08-05**  
**Etapa origen:** CORTE-CONTROL-ENTREGA-20260727  
**Ampliación:** [2.5.1.17](../../2.5_bazzar_web/CHUSAR_TRP_GRADAS_INFANTIL_PPD_HUERFANO_20260805.md) · Protocolo Chusar Activado

---

## Síntoma (Director · 2026-07)

Compra prueba cliente 5000: cabecera FI **35 pares**, vista técnica stock por talla **~30 pares**.

| Línea | Card FI | Vista técnica | Grada |
|-------|---------|---------------|-------|
| L2260 R301 | 12 p | 6 p | `38(1 2 3 3 2 1)43` |
| L2258 R100 | 11 p | 12 p | `37/8(2-4-4-2)43/4` |
| L2258 R101 | 12 p | 12 p | OK |

---

## Reincidencia 2026-08-05 (PE-237)

| TRP | FI | Δ |
|-----|-----|---|
| TRP-2026-0011 | PE-237-010 | 109 vs 73 (+36) |
| TRP-2026-0009 | PE-237-008 | 183 vs 171 (+12) |

**Causa:** distribución TRP — tallas **&lt;20** descartadas + PPD huérfano en resync.  
Detalle: **2.5.1.17**.

---

## Causa raíz (histórico 07-27)

1. **`gradasFmtToTallas`** filtraba tallas **33–40** → gradas 38–43 perdían pares.
2. Fallback `gradas_fmt` **no escalaba** a `fid.pares`.
3. **`getTraspasoDetalleLines`** JOIN débil L+R a `precio_lista`.

Fuente verdad pares: **`factura_interna_detalle.pares`** + **`fi.total_pares`**.

---

## Fix código (vigente 2026-08-05)

| Archivo | Cambio |
|---------|--------|
| `traspaso-mutations.ts` | `tallaKeyToNum` **14–55** · abierta 638 no pisa `23(12)27` · `itemTallasFromFiDetalle` (LEFT JOIN PPD + snapshot + URL) · resync/envío abortan si expand ≠ FI |
| `compra-web/queries.ts` | CASO lateral (07-27) |

Scripts: `audit_resync_traspaso_gradas.mts` · `_resync_pe237_trp_delta.ts`

---

## Ley operativa

- **Prohibido** crear/enviar TRP si `SUM(traspaso_detalle) ≠ SUM(fid.pares)`.
- ENVIADO/BORRADOR con delta → `resyncTraspasoDetalleFromFactura` antes de confirmar.
- CONFIRMADO → `repararIngresoTraspasoConfirmado`.
- Resync **obligatorio** funcionar con PPD huérfano (snapshot FI).

---

## Verificación

```bash
cd report
npx tsx scripts/audit_resync_traspaso_gradas.mts
```

UI: `:3000/bazzar-web/compra` → badge **CUADRA**.
