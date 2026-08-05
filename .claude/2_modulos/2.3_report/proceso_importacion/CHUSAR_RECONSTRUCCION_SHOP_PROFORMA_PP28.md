# CHUSAR — Reconstrucción import proforma · SHOP canónico · PP-28

**Código:** **2.3.1.7.5.3.7**  
**Decisión Director:** 2026-07-10 / Documentación Chusar 2026-07-11  
**Caso:** PP-28 · proforma **8051/2026** · Excel `importar web_8051_2026.xlsx`  
**Estado:** 🟢 **Import PPD reconstruido local** · Admin IC operable · sin deploy prod  
**Shibboleth:** Andrés, el que viene.

---

## Síntoma (error encontrado por Director)

| Fuente | SHOP 286 |
|--------|----------|
| **Excel real** | **1 marca** — BEIRA RIO · 1.188 pares · 99 filas |
| **UI Admin IC (antes)** | **5 marcas** bajo shop 286 (BEIRA RIO, BR SPORT, MODARE, MOLECA, VIZZANO) |

→ Las Pre-FI mostraban marcas **fantasma**: `_shop` en PPD no venía de columna J del Excel.

**Consecuencia:** montos/pares no cuadraban IC↔PF · **GENERAR F.I.** imposible de forma mecánica.

---

## Causa raíz

| Pieza | Fallo |
|-------|--------|
| `inferProformaDetalleFromPpdAndIcs` | Repartía filas PPD por cupo IC agregado por `id_cliente` — **ignoraba SHOP×BRAND del Excel** |
| `aggregateIcsPorCliente` (preview viejo) | Sumaba **todas** las IC del cliente vs pares proforma por shop — válido solo si 1 IC = 1 shop |
| Snapshot inferido + backfill | Persistía `_shop` incorrecto en `grades_json` |
| `loadProformaDetalleParaFi` | `autoInfer` activo por defecto podía recontaminar |

**Regla canónica violada:** columna **J (SHOP)** del Excel = verdad en PPD (`grades_json._shop`). IC = **`id_cliente` + `id_marca`**. No intercambiables cuando un cliente tiene varias IC.

---

## Corrección motor (Report · local)

| Archivo | Cambio |
|---------|--------|
| `proforma-programado-engine.ts` | Preview **SHOP×BRAND** vs IC (`id_cliente` + marca); desajustes de pares → **avisos** (no bloquean import); borrar import limpia `pp_proforma_filas` |
| `proforma-snapshot.ts` | `autoInfer` **off** por defecto; backfill sincroniza `_shop` desde snapshot canónico |
| `populatePpFromProforma` | Sin cambio — ya escribía `_shop` desde Excel al insertar |
| `scripts/reimport-proforma-pp.ts` | CLI borrar + reimport fase `ppd` |

---

## Reimport PP-28 ejecutado (2026-07-10 · local)

| Métrica | Valor |
|---------|--------|
| PP id | **28** · PP-2026-0019 · **8051/2026** |
| IC vinculadas | **108** |
| PPD post-import | **912 SKUs** · **9.400 pares** |
| Pre-FI (Admin IC) | **106** grupos (shop × marca × caso) |
| Shop 286 verificado | **1 marca BEIRA RIO** · 1 Pre-FI · 1.224 pares PPD |
| FI previas | Borradas con importación anterior (reimport limpio) |

**Ruta smoke:** `http://localhost:3000/proceso-importacion/pedido-proveedor/28?tab=admin-ic`

---

## Preview post-fix — avisos esperados

Desajustes **SHOP×BRAND** pares proforma ≠ IC (ej. BEIRA RIO shop 382/663/974) y IC marca **CHINELO** sin filas proforma → **avisos**, import permitido. Cuadratura fina en **Administrador de IC** (montos sin descuento · LP editable).

---

## Admin IC — estado código (iteración 2)

| Pieza | Estado |
|-------|--------|
| Tab `?tab=admin-ic` | ✅ UI 3 paneles · columnas alineadas Cliente/Shop · Marca · LP · Cant · Monto |
| `administrador-ic-query.ts` | ✅ PF agrupada por `_shop` × marca × caso |
| `administrador-ic-monto.ts` | ✅ Match Δ monto/pares · montos sin descuento en fase parejas |
| `administrador-ic-generar-fi.ts` | ✅ INSERT FI cabecera IC completa |
| POST `…/generar-fi` | ✅ Persiste BD |
| PATCH listado IC | ✅ LP editable en panel IC |
| Auditoría proforma × pilares × caso | ✅ Preview/import avisos `sin_caso` / `sin_precio` |

---

## Próximo norte (etapa abierta)

Ver [ETAPA_ADMIN_IC_PP28_PROGRAMADO.md](../../../4_etapas/ETAPA_ADMIN_IC_PP28_PROGRAMADO.md).

1. Smoke parejas IC↔PF por monto en PP-28  
2. **GENERAR F.I.** masivo controlado + tab FI  
3. UI asignar caso (línea 8581 · `sin_caso`)  
4. CSV Carlos post-vínculo  
5. Deploy prod solo orden Director  

---

## Referencias

| Doc | Relación |
|-----|----------|
| [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) | Norte replanteo · 2.3.1.7.5.3.5 |
| [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) | Secuencia import · SHOP×BRAND |
| [CHUSAR_PP_TAB_STOCK](./CHUSAR_PP_TAB_STOCK.md) | Tab Stock · preview/import UI |

---

**Compilado — Documentación Chusar 2026-07-11 · reconstrucción SHOP PP-28.**
