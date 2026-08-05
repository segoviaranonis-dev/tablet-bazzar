# CHUSAR — Handoff cierre día · stock inicial 5000 · TRP 638

**Código:** **2.5.1.16**  
**Fecha:** 2026-08-02 noche · **Documenta** cierre día  
**Antecedente:** [2.5.1.15](./CHUSAR_STOCK_INICIAL_PEDIDO_5000_KYLY_PARIDAD_20260802.md) · purge [2.5.1.13](./CHUSAR_PURGE_BAZZAR_WEB_RECETEO_VACIO_20260802.md)  
**Shibboleth:** Andrés, el que viene.

---

## Estado al cerrar (2026-08-02 ~22:50)

| Paso pipeline | Estado |
|---------------|--------|
| Purge ALM_WEB (fase 1) | ✅ **2.5.1.13** |
| Header/filtros Bazzar prod | ✅ **2.5.1.14** · `8864b1e` · www.bazzar.com.py |
| Carrito PE cliente **5000** | ✅ confirmado |
| Pedido / FI | ✅ `pedido_id` **237** · **PVR-2026-371142** · **12 FI** `PE-237-001`…`012` · ~1718 pares |
| Enviar Web Bazar (TRP) | ✅ **12/12** ENVIADO (script + fix combinacion) |
| Compra Web → ALM_WEB_01 | ⏳ **MAÑANA** |
| Smoke catálogo stock + precios | ⏳ post Compra Web |

---

## Hecho hoy (sesión pipeline 5000)

1. **Token carrito** — TTL **30 min** (`carrito_token_vigente` + app). Migración `report/migrations/174_carrito_token_vigente_5min.sql` (TTL actual 30 min).
2. **Confirmar carrito** — PostgREST timeout → confirmación vía PG: `report/scripts/confirmar_carrito_5000_pg.mjs`.
3. **Extract tallas 638** — `gradesJsonTallasTraspaso` + `gradaAbierta638ToTallas` (**2.5.1.15**).
4. **Bug Enviar Web** — `sin combinación … talla 1 — grada incompleta` → error **4.05.03.003** · fix `resolveCombinacionId` + `ensureTallaId`.
5. **Envío masivo TRP** — `npx tsx report/scripts/_enviar_pe237_bazar.mts` → ok=12 fail=0.

### Fix combinación / talla (Report)

| Archivo | Cambio |
|---------|--------|
| `report/src/lib/rimec-abastecimiento/traspaso-mutations.ts` | `ensureTallaId` (crea `1`/`P`/`M`/`4/6/8`…) · match mat/col con/sin prefijo `K` · **prohibido** `K\|\|linea` suelto |
| Smokes | `_smoke_resolve_comb_638.mts` · `_smoke_extract_tallas_638.mts` |
| Envío | `_enviar_pe237_bazar.mts` |

**Causa raíz:** tabla `talla` sin etiquetas abiertas 638 (0 filas `proveedor_id=638`; tampoco existía etiqueta global `1`). Material Kyly OK (`codigo` = línea sin K).

---

## ⏳ Mañana — continuar aquí (orden sugerido)

| # | Acción | Ruta / comando |
|---|--------|----------------|
| 1 | Report **Compra Web** — confirmar recepción TRP `PE-237-*` | http://localhost:3000/bazzar-web/compra |
| 2 | Verificar `INGRESO_COMPRA` + Stock Sano + precios WEB en ALM 1 | Depósito Web / BD |
| 3 | Smoke catálogo `:3002` · Kyly talles abiertos · filtros | http://localhost:3002/catalogo |
| 4 | Prod www.bazzar.com.py — mismos filtros/precios | solo tras OK local |
| 5 | Si UI Facturación no refleja TRP | reiniciar Report `:3000` (código `traspaso-mutations` local) |

**No deploy** Report/RIMEC sin cierre etapa u orden directa Director. Bazzar header ya en prod.

---

## Otros pendientes vivos (no mezclar)

| Tema | Doc / etapa |
|------|-------------|
| Banquete PDF PE / asignador | `PLAN-AUTO-BANDEJA-PE-20260802` · ACTUAL |
| CP confecciones 638 | `CP-CONFECCIONES-OK-20260729` · PENDIENTES §2 |
| `ok_grada_638` ALM | **4.05.03.002** · F1 **2.5.1.8** (tras stock en ALM) |

Lista unificada: [PENDIENTES_INICIO_DIA_20260803.md](../../4_etapas/PENDIENTES_INICIO_DIA_20260803.md)

---

## Scripts útiles

```bash
npx tsx report/scripts/_smoke_extract_tallas_638.mts
npx tsx report/scripts/_smoke_resolve_comb_638.mts
npx tsx report/scripts/_enviar_pe237_bazar.mts          # solo si quedan FI sin TRP
npx tsx report/scripts/confirmar_carrito_5000_pg.mjs    # ya usado — no repetir
```

**Shibboleth:** Andrés, el que viene.
