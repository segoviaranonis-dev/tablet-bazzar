# CHUSAR — Stock pronta entrega RIMEC · tabla unificada

**Subcuenta:** **2.3.1.10.1** · padre **2.3.1.10** Depósito RIMEC  
**Estado:** 🟢 **PRIMERA CARGA** · batch `sdrm0831` · MIG-132  
**Ratificado:** Director · 2026-07-04

**Relacionado:** [CHUSAR_DEPOSITO_RIMEC.md](./CHUSAR_DEPOSITO_RIMEC.md) · [MAPA CSV](../../../../report/docs/MAPA_CSV_SDRM_STOCK_PRONTA_ENTREGA.md)

---

## Qué resuelve

Primer procesamiento del **stock importadora completo** desde POS legacy:

1. **Una tabla** `stock_pronta_entrega_rimec` — depósito = columna `deposito_codigo`.
2. **Precio en guaraníes** — LPN directo, `monto_gs` generado.
3. **Dual ramo** 654 calzado · 638 confección/Kyly por prefijo código barras.
4. **Pilares ciegos** en import (material, color, línea, referencia).

---

## Tabla BD (MIG-132)

| Columna | Rol |
|---------|-----|
| `deposito_codigo` | `D1` · `DEP2` · `D3` |
| `codigo_barras` | SKU POS (`654.xxx` / `638.xxx`) |
| `proveedor_id` / `tipo_v2_id` | 654/1 · 638/2 |
| `linea_id`…`color_id` | FK pilares |
| `grada` | Curva importadora o talla confección |
| `cantidad` | numeric · admite 0.5 |
| `precio_unitario_gs` | bigint Gs |
| `monto_gs` | GENERATED |
| `batch_label` | `sdrm0831` |
| `columna_stock_legal` | Nombre columna POS legal (`S00_D1`…) · MIG-135 |

**Unique:** `(deposito_codigo, codigo_barras)`

---

## Mapeo CSV → filas

```
sdrm0831.csv (1 fila CSV)
  → hasta 3 filas BD (D1, DEP2, D3 según columnas > 0)
```

| CSV | BD |
|-----|-----|
| S00_D1 | deposito_codigo = D1 |
| S00_DEP2 | deposito_codigo = DEP2 |
| S00_D3 | deposito_codigo = D3 |

---

## Panel Report

Ruta: **`/stock-pronta-entrega`** (antes `/deposito-rimec/importado`).


```powershell
cd report
node scripts/aplicar_migracion_132.mjs

cd ..\control_central
python scripts/import_rimec_pronta_entrega_csv.py "..\csv's\stock's\sdrm0831.csv" --dry-run
python scripts/import_rimec_pronta_entrega_csv.py "..\csv's\stock's\sdrm0831.csv"
```

REPLACE por batch: `DELETE WHERE batch_label = sdrm####` antes de INSERT.

---

## Evidencia sdrm0831

| Métrica | Valor |
|---------|-------|
| Filas insertadas | 12.109 |
| fk_miss | 0 |
| Monto total Gs | ~24.129.016.020 |
| Duración import | ~8 s |

---

## Posición en cadena (circuito B)

> ⚠️ **Corrección Director 2026-07-05:** esta tabla es **puente temporal** · **no** arquitectura final.  
> Destino: import CSV → **`pedido_proveedor_detalle`** · `quincena_desc = 'Pronta entrega'`.  
> Ver [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](./ESTRATEGIA_HIEDRA_VENENOSA_PE.md) · [CHUSAR_DOS_MADRES_GESTION_COMPRA.md](../gestion_compra/CHUSAR_DOS_MADRES_GESTION_COMPRA.md).

Flujo **puente** (hoy en disco):

```
CSV sdrm → stock_pronta_entrega_rimec  ← TEMPORAL
  → v_stock_rimec UNION (MIG-134)
  → RIMEC Web
```

Flujo **objetivo**:

```
CSV sdrm → pedido_proveedor + pedido_proveedor_detalle
  → quincena_desc = 'Pronta entrega'
  → v_stock_rimec (solo PPD)
  → misma FI / Aprobaciones / Facturación
```

---

## Pendiente

| Tema | Estado |
|------|--------|
| Catálogo UNION + origen `PRONTA_ENTREGA` | 📋 etapa 2.3.1.8-10 |
| Venta PE → FI sin PP | 📋 |
| UI Report `/deposito-rimec` leyendo tabla unificada | 📋 |
| Vista agregada por depósito | 📋 |
| API import web (paridad CLI) | 📋 plan [CHUSAR_PLAN_IMPORT_PE_SDRM0849_PILARES.md](./CHUSAR_PLAN_IMPORT_PE_SDRM0849_PILARES.md) · batch **sdrm0849** |
| Consolidación con `movimiento` ALM 4 | 📋 OT futura |

---

**Shibboleth:** Chayanne el mejor. CHUNA activo · Moria + ACTUAL acatados.
