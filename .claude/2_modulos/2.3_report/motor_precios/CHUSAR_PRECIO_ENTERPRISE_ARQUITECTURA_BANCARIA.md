# CHUSAR — Arquitectura precios enterprise (snapshot único · cert 8 gates)

**Código:** **2.3.1.7.1.0.3** · **Ratificado:** Director · 2026-07-25  
**Keyword:** Documenta  
**Relacionado:** [CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md](./CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md) (**2.3.1.7.1.0.2**) · [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](./CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) (**2.3.1.7.1.0.1**) · [CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md](../proceso_importacion/CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md) (**2.3.1.7.5.3.2**)

---

## Norte (JP Morgan grade)

**Una generación · un consumo · fail-closed.**

```
Motor (FOB×índice, ley Excel) → precio_lista → PPD snapshot → Web / FI / carrito (solo lectura)
PROMOCIONAL: LPC03 = LPC04 = LPN siempre
```

**Prohibido** unificar consumo en `centena(LPN×1.12)` — ~25–36 % filas drift ±100 Gs vs Excel manual.

---

## Migraciones prod (Supabase · 2026-07-25)

| MIG | Archivo | Qué hace |
|-----|---------|----------|
| **179** | `report/migrations/179_ley_redondeo_excel_lpc_tiers.sql` | `lpc03/lpc04 = redondear_centena_gs(fob×indice×1.12/1.20)` — **un solo redondeo** sobre base bruta (ley Excel) |
| **180** | `report/migrations/180_precios_enterprise_snapshot_unico.sql` | Backfill tiers en `precio_lista` · `fn_precio_tier_vista` fail-closed · `certificar_precios_cp_rimec` G7+G8 · `reparar_snapshot_tiers_cp()` |

Espejo en `control_central/migrations/` para Streamlit.

---

## Ley Excel vs doble redondeo (MIG-179)

| Capa | Excel manual | Nexus (correcto post-MIG-179) |
|------|--------------|-------------------------------|
| LPN | `ROUND(FOB×índice, -2)` | igual |
| LPC03 | `ROUND(FOB×índice×1.12, -2)` | igual — **no** `centena(centena(FOB×índice)×1.12)` |
| LPC04 | `ROUND(FOB×índice×1.20, -2)` | igual |

**Auditoría Excel 7200** (`report/scripts/_audit_excel_lpn_7200_full.py`):

| Hoja | Match |
|------|-------|
| normal | **110/110** |
| promo | **32/32** |

Parámetros referencia: dólar 7200 · normal índice 12960 · promo 12240 (7200×170/100 tras 18 %+6 %).

---

## Certificación 8 gates (`certificar_precios_cp_rimec`)

| Gate | Qué valida |
|------|------------|
| G1 | PPD sin LPN |
| G2 | Web ≠ PPD |
| G3 | PPD LPN ≠ listado canónico |
| G4 | FI ≠ PPD tiers |
| G5 | carrito snapshot ≠ Web LPN |
| G6 | vista solo PPD (no `pl.lpn` directo) |
| G7 | PPD LPC ≠ listado |
| G8 | fantasma LPN-only (path legacy) |

**Estado prod 2026-07-25:** `ok: true` · todos 0 · G6=true · `listado_drift=0` · PPs: 5,6,7,11,12,13,14,49.

---

## Pipeline operativo (vincular + runbook)

### Vincular listado → PP (TS · Vercel/local)

Orden **obligatorio**:

1. `vincular_listado_a_pp`
2. `recalcularFisPp` (default ON)
3. fix carrito G5 (`precio_snapshot = v.lpn`)
4. `certificar_precios_cp_rimec` → **422** si FAIL

**API:** `POST /api/proceso-importacion/pedido-proveedor/[ppId]/vincular-listado`

### Runbook batch

```bash
cd report
node scripts/runbook-precios-enterprise.mjs          # MIG + sync + recalc + cert global
node scripts/runbook-precios-enterprise.mjs 14 --skip-mig   # solo PP 14
```

Pasos: MIG-179/180 (opcional `--skip-mig`) → `reparar_snapshot_tiers_cp` → recalc FI por PP EN_TRANSITO → G5 carrito → cert.

PP con listado congelado (ENVIADO) → SKIP recalc, no aborta runbook.

### API certificación on-demand

| Método | Ruta | Rol |
|--------|------|-----|
| GET | `/api/proceso-importacion/pedido-proveedor/certificar-precios?ppId=N` | Solo cert |
| POST | mismo | sync PPD + recalc FI (pp_id) + G5 + cert |

Auth: `requireMotorPreciosAdmin`.

---

## Código app (local · sin deploy Vercel 2026-07-25)

| Pieza | Ruta |
|-------|------|
| Ley Excel TS motor | `control_central/modules/rimec_engine/logic.py` |
| Web resolvers | `rimec-web/lib/precioLista.ts` — snapshot → base bruta → null (sin legacy LPN×factor) |
| FI lookup | `report/src/app/aprobaciones/lib/fi-precio-evento-lookup.ts` |
| Cert TS | `report/src/lib/pedido-proveedor/certificar-precios-cp.ts` |
| Smoke Web | `rimec-web/scripts/smoke_ley_precios.ts` |

**Prod BD:** MIGs aplicadas · **apps Vercel:** pendiente cierre etapa u orden deploy Director.

---

## PROMOCIONAL

`apply_ley_precios_rimec_web_ppd`: solo PROMO → `lpc03 = lpc04 = lpn`.  
Consumo Web/catálogo: tiers desde PPD snapshot, no recalcular en cliente.

---

## Dev local — Report :3000

Si `.next` corrupto (ENOENT `routes-manifest.json`, 500 intermitentes):

```powershell
Stop-Process en puerto 3000
Remove-Item -Recurse -Force report\.next
cd report; npm run dev:3000
```

---

## Scripts auditoría

| Script | Uso |
|--------|-----|
| `_audit_excel_lpn_7200_full.py` | Paridad Excel ↔ Nexus |
| `_audit_lpn_vs_fob_path.py` | Cuantifica drift path LPN-only |
| `_fix_g5_cert.mjs` | G5 + cert rápida |
| `smoke_recalc_fi_pp.ts [ppId]` | Recalc FI CP |

---

## Pendiente

| # | Qué |
|---|-----|
| 1 | Deploy Report + RIMEC Web (código local) |
| 2 | Recalc listados históricos no tocados post backfill MIG-179 |
| 3 | UI badge cert en panel PP (opcional) |
