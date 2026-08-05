# CHUSAR — Corte de control 2026-07-15 · Precios lote · Latencia · Tono único

**Código:** **2.2.1.0.11**  
**Ratificado Documenta:** Director · 2026-07-15  
**Ámbito:** RIMEC Web local `:3001` · **⛔ sin deploy prod** (sellado `f408fc2` / puerta cierre etapa)  
**Etapa viva:** `CATALOGO-LATENCIA-20260713` · refuerzo T6 + diagnóstico arranque frío  
**Shibboleth:** Andrés, el que viene.

---

## Norte (sesión)

1. **Precio de venta por lote** (bajo badge de pares) · no en ficha · no «Sin LPN».
2. **Ley aritmética** sobre LPN (app + PPD) · motor de precios **intacto**.
3. **Latencia meta/header** · MIG-157 local (índices + RPC 1 pase + header único).
4. **Un tono activo** por ficha (paneles CP/PE fusionados) · miniatura sincronizada.
5. Hotfix **`color_tono_canon`** ausente en PE → MIG-156.

---

## 1 · Ley precios RIMEC Web (CP + PE)

| Caso | LPC03 | LPC04 | LPC02 |
|------|-------|-------|-------|
| Normal | LPN × 1.12 | LPN × 1.20 | Sigue del motor / vínculo |
| **PROMOCIONAL** | = LPN | = LPN | No tocar |

**UI**

| Pieza | Rol |
|-------|-----|
| `rimec-web/lib/precioLista.ts` | `resolverLpc03` / `resolverLpc04` / `getPrecioActivo` · `getPrecioActivoPe` |
| `rimec-web/lib/precioLoteCatalogo.ts` | Precio del lote para acordeón |
| `CatalogLotesAcordeon.tsx` | Precio Gs. bajo badge «N p» |
| `CatalogPanelOrigen.tsx` | Precio + snapshots carrito |
| `CatalogTarjetaDeposito.tsx` | Sin precio en ficha |
| Lightbox | Sin precio Gs. (solo aviso si venta inactiva) |

**BD (local aplicada)**

| Artefacto | Nota |
|-----------|------|
| `control_central/migrations/151_ley_precios_rimec_web_lpc_ppd.sql` | Función `apply_ley_precios_rimec_web_ppd` · FK `pedido_proveedor_id` |
| Script | `control_central/scripts/aplicar_mig_151_ley_precios_rimec_web.py` |
| Enganche | Post-vincular PP (`pedido_proveedor/logic.py`) — no modifica motor |

⚠ **Colisión de número 151:** en `report/migrations/` existe **otro** `151_*` (enrich género/tono vistas). El de **ley precios PPD** vive en `control_central/migrations/` (+ copia report con nombre de ley). No confundir.

**PROMO UI** sigue badge `PromoCasoBadge` · ver [CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md](./CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md) (**2.2.1.0.1**)  
**Motor excepción** actualizada LPC03=LPC04=LPN: [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](../2.3_report/motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) (**2.3.1.7.1.0.1**)

---

## 2 · Hotfix vista PE · meta columnas (MIG-156)

**Síntoma UI:** `current transaction is aborted…` / 500 al filtrar con PE o `TODOS`.  
**Causa:** SELECT pedía `color_tono_canon` (y género/ramo/grada) ausentes en `v_stock_pe_rimec`.

| Artefacto | Rol |
|-----------|-----|
| `control_central/migrations/156_v_stock_pe_rimec_meta_catalogo.sql` | Recrea PE con tono+género+ramo+grada · **conserva** precios PPD |
| Script | `aplicar_mig_156_v_stock_pe_meta.py` |

**No** reaplicar el MIG-152 completo (pisa precios PPD / vista CP).

---

## 3 · Latencia · MIG-157 (local)

| Pieza | Resultado smoke local (sesión) |
|-------|--------------------------------|
| Índices `idx_pp_cp_catalog` · `idx_ppd_saldo_vendible` · pilares `(proveedor_id, codigo_proveedor)` | Creados |
| `rimec_catalogo_meta` CTE `MATERIALIZED` 1 pase | CP ~136 ms · PE ~106 ms (RPC directo) |
| `rimec_catalogo_header_meta` | ~134 ms · 1 escaneo CP |
| App | `lib/filtros.ts` → header RPC v2 · fallback 5× meta |

| Artefacto | Path |
|-----------|------|
| SQL | `control_central/migrations/157_catalogo_latencia_meta_header.sql` (+ copia `report/migrations/`) |
| Script | `control_central/scripts/aplicar_mig_157_catalogo_latencia.py` |

### Diagnóstico arranque «>1 minuto» (Director)

| Qué NO es | Qué SÍ es |
|-----------|-----------|
| `next dev` Ready (~7 s) | Primera pintura de datos del catálogo |
| HTML `/` (~300 ms) | Tormenta fría: `tarjetas?TODOS` (CP+PE vista) + header/filtros + dual warm |

Evidencia típica: tarjetas `TODOS` **23–25 s** o timeout · header **~13 s** con timeouts RPC · warm `ensureDualCatalogWarm` en paralelo.

**Pendiente (no hecho este corte):** MV `mv_catalogo_pe/cp` · RPC `rimec_catalogo_tarjetas` · home solo-CP con PE en idle.

---

## 4 · Tono único + miniatura (ficha fusión)

| Pieza | Rol |
|-------|-----|
| `lib/catalogoTonoActivo.ts` | Clave `c:{color_code}` / tono / descp |
| `CatalogoGrid` · `TarjetaProducto` / `TarjetaProductoFusion` | Estado `activeTonoKey` · thumb = variante del tono |
| `CatalogLotesAcordeon` + `CatalogPanelOrigen` | Props controladas · un solo anillo activo entre paneles |

**UX:** click en círculo de cualquier lote → desactiva anillos en paneles sin ese color · miniatura muestra la foto de ese tono.

---

## 5 · Vulnerabilidad precios pre-activación (`4.01.04.001`)

**Documenta 2026-07-15:** precio solo tras Activar venta (sesión + cliente).

| Superficie | Guard |
|------------|-------|
| Acordeón lote | `CatalogLotesAcordeon` · `activa` |
| Panel origen | `CatalogPanelOrigen` · `activa` |
| Tarjeta / fusión | `activa` = hydrated ∧ sesión ∧ `id_cliente > 0` |

Doc: [DOC_VULNERABILIDAD_PRECIO_LIGHTBOX_20260714.md](./DOC_VULNERABILIDAD_PRECIO_LIGHTBOX_20260714.md) (**2.2.1.0.8**) · índice errores ✅ RESUELTO UI.

---

## 6 · Estado deploy / memoria

| Capa | Estado |
|------|--------|
| Código app local | ✅ cortes 1–4 en working tree |
| BD local (Supabase) | ✅ MIG-151 ley · 156 · 157 aplicadas |
| Prod rimec-web | ⛔ no tocar sin **Cierra etapa** u orden directa |
| Documenta | Este CHUSAR · índices · ACTUAL · arbol NEW |

---

## Archivos clave (app)

```
rimec-web/lib/precioLista.ts
rimec-web/lib/precioLoteCatalogo.ts
rimec-web/lib/catalogoTonoActivo.ts
rimec-web/lib/filtros.ts
rimec-web/components/catalog/CatalogLotesAcordeon.tsx
rimec-web/components/catalog/CatalogPanelOrigen.tsx
rimec-web/components/catalog/CatalogTarjetaDeposito.tsx
rimec-web/app/CatalogoGrid.tsx
```

---

**Verificar UI Navegador:** http://localhost:3004/modulos → Catálogo · nodo **2.2.1.0.11**  
**Catálogo app:** http://localhost:3001
