# CHUSAR — Certificación integridad precios CP · RIMEC Web

**Código:** **2.3.1.7.5.3.8** · **Actualizado:** 2026-07-24 (Documenta · hotfixes colaterales auditoría)  
**Sub-bloque de:** [CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md](./CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md) · [CHUSAR_PP_TAB_STOCK.md](./CHUSAR_PP_TAB_STOCK.md)  
**Error origen:** `4.02.03.022` · **Migraciones:** MIG-176 · MIG-177  
**Apps:** Report (`:3000`) · RIMEC Web (`:3001`) · Supabase BD

---

## Doctrina — una sola verdad de venta en tránsito

| Concepto | Rol | Precio |
|----------|-----|--------|
| **Unidad de mando** | Motor / listado Excel / biblioteca | Donde el Director **ajusta estrategias** (nuevo evento, TC, casos) |
| **Unidad de dirección** | PP Compra Previa EN_TRANSITO | **Un solo precio de venta** = **LPN vinculado** en `pedido_proveedor_detalle` (PPD) |

**Reglas inviolables:**

1. **No existen dos orígenes de precio** en el mismo PP de preventa.
2. La proforma F9 trae moléculas/pares/FOB — **no trae LPN**.
3. Al **vincular listado** → snapshot Motor → PPD (`precio_lpn`, LPC, caso, TC).
4. **RIMEC Web · FI · carrito** leen **solo PPD vinculado** (vista `v_stock_rimec` MIG-176).
5. Cambio de estrategia en Motor → **re-vincular** (modo **Todos!!!** si hay vendidos) → recalc FI → **certificar**.

**Prohibido:** columnas duales «LPN vinculado vs LPN listado» en UI · fallback `precio_lista` vivo en catálogo Web · inventar «LPN proforma».

---

## Cadena de integridad (5 eslabones)

```
precio_lista (Motor, evento ICP)
        │ vincular_listado_a_pp / sincronizar_precios_vinculados_cp
        ▼
pedido_proveedor_detalle.precio_lpn  ← UNIDAD DE DIRECCIÓN
        │
        ├─► v_stock_rimec.lpn        (RIMEC Web catálogo CP)
        ├─► factura_interna_detalle  (tier LPN/LPC según lista)
        └─► carrito_item.precio_snapshot
```

---

## Migraciones BD

| MIG | Qué |
|-----|-----|
| **150** | `vincular_listado_a_pp(pp, ev, uid, incluir_vendidos)` |
| **151** | `apply_ley_precios_rimec_web_ppd` — LPC03/LPC04 desde LPN PPD |
| **176** | `v_stock_rimec` — **solo** `ppd.precio_lpn` (sin `COALESCE(pl.lpn)`) |
| **177** | `_pl_canonico_cp` · `certificar_precios_cp_rimec` · `sincronizar_precios_vinculados_cp` · vincular determinístico (`ORDER BY pl.id LIMIT 1`) |
| **178** | `redondear_centena_gs` · `fn_precio_tier_vista` paridad Web LPC03 · error `4.02.03.023` |

**Archivos SQL:** `report/migrations/176_v_stock_rimec_solo_precio_vinculado.sql` · `177_cp_precios_certificacion_integridad.sql` · `178_fn_precio_tier_centena_paridad_web.sql`

---

## Certificación — 6 gates

Función BD: `certificar_precios_cp_rimec(p_pp_id DEFAULT NULL)` → JSON.

| Gate | Qué valida | ¿Bloquea certificado? |
|------|------------|:--------------------:|
| **G1** | PPD sin LPN con saldo catálogo | ✅ Sí |
| **G2** | `v_stock_rimec.lpn` ≠ `ppd.precio_lpn` | ✅ Sí |
| **G3** | PPD ≠ listado canónico ICP | ⚠ Aviso (`listado_drift`) — re-vincular Motor |
| **G4** | FI RESERVADA/CONFIRMADA · `precio_unit` ∉ tiers PPD | ✅ Sí |
| **G5** | `carrito_item.precio_snapshot` ≠ Web LPN | ✅ Sí |
| **G6** | Vista no referencia `pl.lpn` | ✅ Sí |

**`ok = true`** cuando G1+G2+G4+G5+G6 = 0. G3 informa drift Motor sin romper venta vigente (doctrina unidad dirección).

---

## Comandos operativos (OBLIGATORIOS)

Desde `C:\Users\hecto\Nexus_Core\report`:

```powershell
# Certificación manual (exit 0 = CERTIFICADO OK)
npm run certificar:precios-cp

# Certificación + rescate automático (sync G3 · recalc FI G4 · carrito G5)
npm run certificar:precios-cp:sync

# Audit drift legacy (paridad control interno)
npm run audit:precios-cp
```

Scripts:

| Script | Rol |
|--------|-----|
| `scripts/certificar_precios_cp_rimec.mjs` | Certificación 6 gates · `--sync` · `--json` |
| `scripts/_audit_cp_pp_precios_drift.mjs` | Drift PPD vs listado (exit 1 = FAIL) |
| `scripts/_sync_ppd_desde_listado_cp.mjs` | Sync PPD manual por PP |
| `scripts/_fix_cp_pp_revincular_listado.mjs` | Re-vincular PP ABIERTO + Todos |
| `scripts/_recalc_fi_pp.mjs` | Recalc FI RESERVADA/CONFIRMADA |

---

## Flujo obligatorio post-cambio precios

1. **Motor:** cerrar/cargar listado → evento ICP correcto en PP.
2. **Report:** Vincular al PP → **Todos!!!** si hay vendidos · recalc FI ✓.
3. **Certificar:** `npm run certificar:precios-cp:sync` → **exit 0**.
4. **Smoke Web:** MOLECA u otra molécula emblemática vs PPD.
5. **Registrar:** fecha PASS en bitácora etapa.

Si **exit 1** → **no validar Web en prod** · no declarar «desplegado OK».

---

## Rescate histórico 2026-07-23 / certificación 2026-07-24

| Fecha | Acción |
|-------|--------|
| 2026-07-23 | Rescate 5 PP CP · error `4.02.03.022` · drift masivo PPD |
| 2026-07-23 | UI: una columna **LPN vinc.** · sin comparación dual |
| 2026-07-24 | MIG-176 vista solo PPD · MIG-177 certificación |
| 2026-07-24 | Pipeline `--sync`: sync + recalc 543 FI + carrito → **CERTIFICADO OK** |
| 2026-07-24 | **Hotfixes colaterales** post-cert (misma ventana prod) — ver § abajo |

---

## Hotfixes colaterales — auditoría 2026-07-24

Tras certificar CP en prod, la cadena **G4 → confirmar_pedido_web → catálogo Web** expuso tres bloqueos nivel operación. **No son drift PPD** (`4.02.03.022`); son paridad técnica y fragilidad Web.

| Código | Síntoma | Causa | Fix | Commit |
|--------|---------|-------|-----|--------|
| **4.02.03.023** | Confirmar LPC03: payload **127000** vs BD **127008** | `fn_precio_tier_vista` sin centena · Web sí centena | **MIG-178** | report `5087687` |
| **4.01.07.001** | Filtros catálogo «Sin opciones» · grilla OK | `/api/catalogo/filtros` timeout scan 6k filas post-RPC | RPC directa · sin scan TODOS | rimec-web `7c45166` |
| **4.01.07.002** | `PE_PP_MIXTO` PP 33+35 (Gricelda) | Carrito PE: un `pp_id` sintético para todos | Split servidor + `-pp_id` real | rimec-web `272cc99` |

**Checklist post-cert (obligatorio ampliado):**

1. `npm run certificar:precios-cp:sync` → exit 0  
2. Smoke Web: `node scripts/smoke_catalogo_local.mjs` (filtros TODOS+CALZADO)  
3. Confirmar molécula **LPC03** (centena) en prod o staging  
4. Confirmar carrito PE con **2 PP distintos** → 2 FI  

Detalle: `5_errores/detalle/4.02.03.023_*` · `4.01.07.001_*` · `4.01.07.002_*`

---

## Código aplicación

| Capa | Archivo |
|------|---------|
| TS cert | `report/src/lib/pedido-proveedor/certificar-precios-cp.ts` |
| Vincular API | `report/src/app/api/.../vincular-listado/route.ts` — devuelve `certificacion_ok` |
| UI Stock | `report/.../PpTabStock.tsx` — pie unidad mando/dirección |
| Web catálogo | `rimec-web/lib/catalogoData.ts` · `v_stock_rimec` |
| Web carrito | `rimec-web/store/sesionVenta.ts` · `precio_lpn` desde stock |

---

## Frecuencia control (hasta erradicar)

| Fase | Frecuencia |
|------|------------|
| Etapa CP activa | **Diaria** — `certificar:precios-cp:sync` |
| Estabilización | **Semanal** × **4 PASS** consecutivos |
| Post vincular UI | Automático cuando MIG-177 en BD (`certificacion` en respuesta API) |

---

## Referencias

- [4.02.03.022](../../../5_errores/detalle/4.02.03.022_cp-pp-vincular-listado-ppd-desincronizado-web.md)
- [4.02.03.023](../../../5_errores/detalle/4.02.03.023_confirmar-pedido-lpc03-centena-bd-web.md) · [4.01.07.001](../../../5_errores/detalle/4.01.07.001_rimec-web-catalogo-filtros-vacios-prod.md) · [4.01.07.002](../../../5_errores/detalle/4.01.07.002_rimec-web-pe-pp-mixto-carrito-sintetico.md)
- [CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md](./CHUSAR_VINCULACION_LISTADO_PRECIO_PP.md)
- [CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md](../../2.2_rimec_web/CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md)
- Ley LPC Web: MIG-151 · `apply_ley_precios_rimec_web_ppd`

---

**Shibboleth:** Andrés, el que viene.
