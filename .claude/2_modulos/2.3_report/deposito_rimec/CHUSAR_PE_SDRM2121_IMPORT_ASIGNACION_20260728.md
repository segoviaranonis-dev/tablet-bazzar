# CHUSAR — PE sdrm2121 · import Node · asignación Guido · overwrite

**Código:** **2.3.1.10.1.5**  
**Padre:** [Depósito RIMEC](./INDICE.md) · Asignación [2.3.1.10.1.4](./CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md)  
**Fecha:** 2026-07-28  
**Keyword:** Documenta · Protocolo Chusar activado  
**Ratificado:** Director · Andrés  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Batch operativo

| Campo | Valor |
|-------|--------|
| **CSV** | `Z:\hector\sdrm2121.csv` · copia `csv's/stock's/sdrm2121.csv` |
| **Batch PPD** | `sdrm2121` |
| **Filas / pares** | 12 005 · ~182 747 pares |
| **DPE** | `COD.GRUPO` → `sdrm_cod_grupo_dim` · `am_*` en PPD |
| **Import UI** | Node en `/api/stock-pronta-entrega/import-csv` (Vercel OK · sin Python) |
| **Vista Web** | MIG-191 `v_stock_pe_rimec` (sin hash `sdrm_articulo_comercial`) |

---

## 2 · Ley — overwrite descuentos (verificado 2026-07-28)

Tabla: `pe_descuento_comercial_molecula` (MIG-185).

| Regla | Comportamiento |
|-------|----------------|
| **Clave única** | `(batch_label, linea, referencia, material, color)` |
| **POST Report** | `ON CONFLICT … DO UPDATE` → **reescribe** `descuento_pct`, `assigned_by`, `assigned_at`, `updated_at` |
| **Quién asigna** | Solo **DIOS** (`requireMotorPreciosNivelDios`) |
| **Web / carrito** | Mapa por molécula L-R-M-C · gana fila con **`updated_at` más reciente** (cualquier batch) |

```
Guido asigna % en batch sdrm2121
  → UPSERT pisa la fila de ese batch+molécula
  → updated_at = now()
  → RIMEC Web lee updated_at DESC → usa el % nuevo
```

**Evidencia BD (corte 2026-07-28 ~14:49 UTC):**

| Batch | Filas descuento | Nota |
|-------|-----------------|------|
| `sdrm2121` | **3 845** | Guido en curso · ganan Web por `updated_at` |
| `pe-import-…-sdrm1021` | 7 677 | Histórico · **3 818** moléculas aún ganan Web si Guido no las reasignó |

**Implicación:** lo que Guido carga **sí reescribe** la opción anterior de la misma molécula. Moléculas del batch viejo **sin** reasignar en `sdrm2121` siguen con el % viejo hasta que Guido las toque otra vez.

---

## 3 · Flujo cerrado (asignación → carrito)

1. Report `/stock-pronta-entrega` · Resumen asignación / Revisar · % · POST.  
2. Persistencia `pe_descuento_comercial_molecula`.  
3. Web: `peDescuentoComercial.ts` → `descuento_comercial_pct` en tarjeta.  
4. Carrito: `carritoStockEnrich` reinyecta el mapa.  
5. FI: cascada LP03 D1=10 % (si lista 3) + dictado D2 · split cadena × marca × % dictado.

Doc padre: [CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md](./CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md) · LP03 [2.3.1.10.1.4.1](./CHUSAR_LEY_DIVISION_FI_LP03_20260726.md).

---

## 4 · Pendientes (Protocolo Chusar · inventario)

| # | Pendiente | Estado | Dueño |
|---|-----------|--------|-------|
| P1 | Guido completar asignación universo `sdrm2121` (pisar resto sdrm1021 en Web) | 🟡 EN CURSO | Guido · DIOS |
| P2 | Smoke vendedor: tarjeta PE → carrito → FI con % nuevo | ⏳ | QA / Director |
| P3 | Depósito Web Bazzar (4º siamese) local · no deploy | ⏳ | Cursor · orden deploy |
| P4 | MIG-188 Logística (si no aplicada en prod) | ⏳ verificar | Claude/Cursor |
| P5 | Etapa Logística Rimec TXT (`LOGISTICA-RIMEC-TXT-20260728`) en curso | 🟢 paralela | ACTUAL.md |
| P6 | rimec-web prod sellada `f408fc2` — PE usa BD compartida (MIG-191 ya en Supabase) | ✅ operativo | — |
| P7 | Documentar en Moria Web / badge NEW navegador | este turno | Cursor |

---

## 5 · Commits / migraciones (referencia)

| Artefacto | Valor |
|-----------|--------|
| Import Node Vercel | Report `82bf846` · fix BigInt `9ddb22f` |
| Vista PE rápida | MIG-191 · Report `b0485fb` · **aplicada Supabase** |
| Pipeline CLI | `control_central/scripts/import_pe_sdrm_pipeline.py` (legado) · motor canónico UI = Node |

---

## 6 · Relacionados

| Código | Doc |
|--------|-----|
| 2.3.1.10.1.4 | Asignación descuentos PE |
| 2.3.1.10.1.4.3 | Verificación · panel Revisar |
| 2.3.1.10.1.2.1 | Ley DPE sin BCL |
| 2.2.1.26 | Par Web descuentos PE |

**Índice:** [INDICE.md](./INDICE.md)
