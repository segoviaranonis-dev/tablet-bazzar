# CHUSAR — PE · descuentos · grada · import sdrm1021 · errores 2026-07-24

**Código:** `2.2.1.22`  
**Fecha:** 2026-07-24  
**Apps:** RIMEC Web (`:3001`) · Report (`:3000` / Vercel) · BD Supabase  
**Keyword:** **Documenta** (Director)

---

## Auditoría post-import `sdrm1021.csv`

| Check | Resultado |
|-------|-----------|
| Líneas PPD PE | **12043** |
| Saldo pares (pre-sim) | **184031** |
| Vista `v_stock_pe_rimec` | **12043** filas con stock |
| PP nuevos | **55–58** (batch `sdrm1021`) |
| PP cáscara 33/35 | 0 líneas (FI históricas bloquean DELETE) |
| Grada texto PPD 55/57/58 | ✅ `ppd.grada` poblada |
| `grades_json` calzado | mayormente NULL (638 sí tiene) |

Import CLI: `control_central/scripts/import_pe_sdrm_pipeline.py` · CSV `csv's/stock's/sdrm1021.csv`.

---

## Simulación pedido Enrique (10% D1)

| Campo | Valor |
|-------|--------|
| Vendedor | Enrique · `id_usuario=18` · `id_vendedor=8` |
| Cliente | **5000** Bazzar.py (pruebas · no EVOLUTION) |
| Pedido | **PVR-2026-891496** · id **217** · `PENDIENTE` |
| FI | **PE-217-001** · MODARE · PROMOCIONAL · **D1=10%** · `RESERVADA` |
| Totales | **216** pares · Gs. **38.210.400** |
| Grada sample | `35(1 1 2 2 1 1)40` ✅ (no «Sin grada») · 3/3 ítems con grada |
| Saldo PE post-confirm | **183815** (= 184031 − 216) |
| PP real | **57** (`PE-D3-…-sdrm1021-654`) · carrito `pp_id=-57` |
| Script | `report/scripts/_audit_sim_enrique_pe.mjs` |

Líneas: 7414/102 · 7401/104 · 7402/112 (1 caja c/u · 72 pares).

**Nota:** el pedido comercial EVOLUTION del día (`PVR-2026-942359` / 216) fue **eliminado** por orden Director (reintegro 191 pares). Esta simulación es el camino correcto con gradas + facturas lote.

---

## Errores del día (catálogo)

| Código | Título | Estado |
|--------|--------|--------|
| `4.01.07.003` | Botón «Editar descuentos» ausente en carrito PE | 🟡 Fix **local** (sin push) |
| `4.01.07.004` | Aprobaciones «Sin grada» tras confirm script | 🟡 Parcial — sim 217 OK; UI fallback pendiente |
| `4.02.04.001` | Import PE CSV en Vercel · `spawn python ENOENT` | 🟡 API local + 501 claro en Vercel |
| `4.02.04.002` | Purge PE bloqueado por FI→PP (33/35) | ✅ Pipeline limpia PPD; PP cáscara quedan |
| `4.02.04.003` | Report `:3000` zombie / modal Import 0 p | ✅ Kill + `dev:3000`; no re-importar |

Detalle: `.claude/5_errores/detalle/4.01.07.00{3,4}_*.md` · `4.02.04.00{1,2,3}_*.md`.

---

## Causa raíz (resumen)

1. **Descuentos PE:** tras split `pp_id` negativo + R-FI-2, `descuentos_lote.facturas` no se regeneraba → botón solo si había facturas.
2. **Sin grada:** script Enrique mandó `gradas_fmt: ''`; UI Aprobaciones no caía a `ppd.grada` si snapshot vacío y `grades_json` NULL.
3. **Import Vercel:** serverless sin Python → ENOENT.
4. **Purge:** FK `factura_interna_pp_id_fkey` sobre PP con FI CONFIRMADAS.

---

## Fix local (código · no prod)

| Archivo | Rol |
|---------|-----|
| `rimec-web/lib/facturaConfigMatch.ts` | Match / síntesis célula FI |
| `rimec-web/lib/asegurarFacturasDescuentosLote.ts` | Sync facturas GET sesión / VALIDAR |
| `rimec-web/app/carrito/page.tsx` | Botón descuentos siempre visible |
| `rimec-web/lib/carritoDescuentosFi.ts` · `carritoValidarPe.ts` | Upsert + match etiqueta |
| `report/.../import-csv/route.ts` · `resolve-python.ts` | Resolver Python / 501 Vercel |
| `control_central/scripts/import_pe_sdrm_pipeline.py` | Purge seguro PPD |

**Prod rimec-web:** sigue sellada — hotfix descuentos **no** pusheado.

---

## Prevención

1. Smoke PE: carrito → facturas lote → «Editar descuentos» → VALIDAR → confirmar → Aprobaciones muestra grada.
2. Import PE masivo: **solo CLI local** (o máquina con Python); no Vercel UI.
3. Confirm scripts: **siempre** `gradas_fmt` desde `ppd.grada` / vista.
4. Post-import: chequear saldo BD vs modal; no re-importar si panel ya tiene pares.

---

## Referencias

- Cliente pruebas: `CHUSAR_CLIENTE_5000_PRUEBAS.md` (`2.2.1.0.9`)
- Carrito PE: `CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md` (`2.2.4.0.1`)
- FI segregación: `4.01.07.002` · R-FI-1/2
- Import batch stock: docs depósito PE / pipeline SDRM
