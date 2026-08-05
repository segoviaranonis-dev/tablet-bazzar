# CHUSAR — PROGRAMADO · Instrumento de venta · Alejandro Magno · Aritmética 100% BD

**Código:** **2.3.1.12.1** · **2.3.1.7.5.3.4**  
**Ratificado:** Director · 2026-07-09  
**Etapa:** [ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md](../../../4_etapas/ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md)  
**Shibboleth:** Andrés, el que viene.

> **Norte:** El módulo PP + IC PROGRAMADO + import proforma **no es solo logística** — es el **instrumento de venta estratégica Alejandro Magno**: intermediación fábrica → mayorista · 100% eficiencia (solo venta) · cierre **CSV veneno Carlos** → sistema legal.

**Padres:** [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) · [CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md](../gestion_compra/CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md) · [CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO.md](./CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO.md)

---

## 1 · Qué es este módulo (venta, no solo import)

| Capa | Rol comercial |
|------|----------------|
| **IC PROGRAMADO** | Cabecera comercial SHOP · LP · descuentos · vendedor → hereda FI |
| **PP + proforma** | Materializa PPD (lote) · empareja Excel col. J ↔ IC |
| **FI RESERVADA** | Documento de venta interno · 1 FI × IC |
| **CSV Carlos** | Inyección al sistema legal legacy · paridad Sales Report |

**Ley Alejandro Magno:** PROGRAMADO **no** aparece en RIMEC Web · disponibilidad **100% eficiente** = todo el lote es objeto de venta (FI).

---

## 2 · Regla de oro — aritmética en BD, UI solo refleja

| ✅ Canónico (BD / motor SQL) | ❌ Prohibido |
|-----------------------------|-------------|
| `pedido_proveedor_detalle.cantidad_pares` · `pares_vendidos` | KPI inventados en React |
| `descontar_stock_pp(ppd_id, pares)` | Restar pares solo en cliente |
| `precio_lista.lpn|lpc02|lpc03|lpc04` vía JOIN evento | Precio hardcodeado en formulario |
| `factura_interna.total_monto` persistido al INSERT | Neto solo en pantalla |
| `venta_transito` para venta Web post-alzado | Mezclar reserva FI con venta Web en gate borrar |

**UI (`PpTabStock`, IC forms):** captura · validación de presencia · overlays · **nunca** fuente de verdad aritmética.

---

## 3 · Fórmulas canónicas (CHUSAR · paridad Python)

### 3.1 · Molécula PPD (Ala Norte · Panel)

```text
INICIAL    = cantidad_pares
VENDIDO    = GREATEST(pares_vendidos, SUM(venta_transito))   -- por fila
DISPONIBLE = cantidad_pares − VENDIDO
```

**Cabecera PP KPI:** `total_vendido = GREATEST(SUM(vt), SUM(pares_vendidos))` — **no** sumar ambos (fix 2026-07-09).

### 3.2 · PROGRAMADO post-import

```sql
UPDATE pedido_proveedor_detalle
SET pares_vendidos = cantidad_pares
WHERE pedido_proveedor_id = :pp_id;
```

100% vendido al cerrar FI · Ley solo venta.

### 3.3 · Precio FI (tier LP desde IC)

```text
tier     = intencion_compra.listado_precio_id  ∈ {1,2,3,4}
base     = precio_lista.(lpn|lpc02|lpc03|lpc04)  -- JOIN evento + pilares
factor   = Π(1 − desc_i/100)   -- descuentos IC en % entero
precio_neto = round(base × factor)
subtotal    = pares × precio_neto
```

**Motor TS:** `report/src/lib/pedido-proveedor/aritmetica-programado.ts`  
**Import:** `proforma-programado-engine.ts` → `getSkusConPrecioParaFi` trae 4 columnas · `calcLineaFiPrecio` aplica tier IC.

### 3.4 · FOB proforma (cabecera PP)

```text
unit_fob_ajustado = unit_fob × factor_descuentos_PP(%)
```

Fix 2026-07-09: descuentos en **% entero** (antes TS trataba como fracción 0–1).

### 3.5 · Borrado import

Gate: `venta_transito = 0` AND `FI CONFIRMADA = 0` — **no** bloquear por `pares_vendidos` reserva FI.

---

## 4 · Cadena de consultas robustas (auditadas)

| Operación | Query / función BD | Transacción |
|-----------|-------------------|-------------|
| Preview SHOP↔IC | `loadIcsPpProgramado` + agregación cliente | read-only |
| Poblar PPD | INSERT `pedido_proveedor_detalle` | BEGIN…COMMIT |
| Precio SKU | JOIN `precio_lista` ON evento + L+R+M | en import |
| Crear FI | INSERT `factura_interna` + detalle | atómica |
| Reserva stock | `SELECT descontar_stock_pp($1,$2)` | por línea FI |
| Sync 100% programado | UPDATE `pares_vendidos = cantidad_pares` | post-FI |
| Borrar import | DELETE FI→PPD + reset PP | BEGIN…COMMIT |
| KPI cabecera | `getPpDetalle` SQL agregados | read-only |
| CSV Carlos | `csv-ventas-export.ts` ← FI + IC JOIN | read-only |

---

## 5 · Auditoría 2026-07-09 — hallazgos y fixes

| # | Hallazgo | Severidad | Fix |
|---|----------|-----------|-----|
| 1 | Import TS usaba solo `pl.lpn` ignorando LPC04 IC | 🔴 | `aritmetica-programado.ts` + 4 cols precio_lista |
| 2 | `calcFobAjustado` sin `/100` en descuentos | 🔴 | `calcFobAjustadoPct` |
| 3 | KPI `total_vendido` sumaba vt + pares_vendidos | 🟡 | `GREATEST` en `detail-query.ts` |
| 4 | Borrar bloqueado por reserva FI | 🔴 | Gate `venta_transito` · doc borrar CHUSAR |
| 5 | UI «Cliente 276» en IC programado | 🟡 | Replanteo SHOP · cabecera CHUSAR |

---

## 6 · Smoke aritmética (post re-import PP-16)

Ejecutar local:

```bash
cd report && node scripts/audit_pp25_aritmetica.mjs
```

**PASS esperado:**

| Check | Esperado |
|-------|----------|
| PPD count | 722 |
| FI RESERVADA | 39 |
| Σ pares PPD | 8.880 |
| Σ pares FI | 8.880 |
| IC con LP=4 (LPC04) | 39 |
| FI.lista_precio_id = IC.listado_precio_id | 100% match |
| pares_vendidos = cantidad_pares | 100% filas PPD |
| venta_transito | 0 |

---

## 7 · Archivos código (mapa)

| Archivo | Rol |
|---------|-----|
| `aritmetica-programado.ts` | **Única** fuente fórmulas tier/descuento TS |
| `proforma-programado-engine.ts` | Import atómico · FI · sync vendido |
| `borrar-import.ts` | Gate + delegación TS |
| `detail-query.ts` | KPI SQL · Ala Norte GREATEST |
| `csv-ventas-export.ts` | CSV Carlos · cols SHOP/LISTA/Desc |
| `IntencionCompraNuevaClient.tsx` | UI cabecera SHOP · **no calcula precios** |

**Python paridad:** `control_central/modules/pedido_proveedor/logic.py` · `_lookup_lp_evento` · `_factor_descuentos_fi`.

---

## 8 · Índice Moria

| Código | Doc |
|--------|-----|
| 2.3.1.12 | Alejandro Magno tres entidades |
| 2.3.1.7.3.0.1 | IC política LP |
| 2.3.1.7.5.3.3.3 | Borrar import |
| 2.3.1.7.5.3.4 | **Este doc** |
| 2.3.1.18 | Patrón Disponible+Venta |
