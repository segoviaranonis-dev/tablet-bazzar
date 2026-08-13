# CHUSAR — PE SDRM EAN 79… · cobertura 638/654 · gate auditoría

**Código:** **2.3.1.10.1.8**  
**Fecha:** 2026-08-12  
**Keyword:** **Documenta** · orden Director post-hotfix import PE  
**App:** Report import PE · RIMEC Web catálogo PE · Depósito grilla importado  
**Padre:** **2.3.1.10.1** Stock pronta entrega · hermano **2.3.1.10.1.7** (UI body Next 15.5)  
**Estado:** 🟢 fix desplegado Report `85ef6a3` · re-import `sdrm0218` · gate PASS  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible · `5.01.00.025`

---

## 0 · Ley operativa (Hiedra)

> **Stock importado con uds > 0 nunca puede perderse en import 638/654.**  
> Las grillas solo muestran lo que entró a BD; el único punto de pérdida silenciosa era **resolveRow** en import.

---

## 1 · Síntoma (bug urgente)

| Campo | Valor |
|-------|-------|
| CSV | `Z:\hector\sdrm0218.csv` |
| Artículo | **106305** (Kyly confecciones) — **no** 106385 (0 filas en CSV) |
| Colores | K0001 + **K6826** |
| Stock D3 | 83 uds |
| Web | Pronta entrega · Confecciones — faltaba color 6826 |

**Causa raíz:** `resolveRow` descartaba filas cuyo `CODIGO ARTICULO` es EAN `79…` (sin prefijo `638.` / `654.`). De 14 filas 106305 solo entraba 1 (barcode `638.135878`).

---

## 2 · Fix canónico

Función única **`proveedorFromSdrmRow(codigoBarras, codGrupo, codMaterial)`**:

1. Prefijo barcode `638` → confecciones · `654` → calzado (como antes).
2. **Fallback EAN:** `COD.GRUPO` marca `10–15` → **638** · `01–09` → **654**.
3. Material `K*` → **638** (Kyly).

| Archivo | Rol |
|---------|-----|
| `report/src/lib/deposito-rimec/rimec-csv-sdrm.ts` | Definición TS |
| `report/src/lib/stock-pronta-entrega/pe-sdrm-pilares.ts` | `resolveRow` → `proveedorFromSdrmRow` |
| `control_central/scripts/import_rimec_pronta_entrega_csv.py` | Paridad Python `_proveedor_from_sdrm_row` |

**Commit Report:** `85ef6a3` — `fix(pe-import): aceptar filas EAN 79xx via COD.GRUPO Kyly confecciones`

---

## 3 · Evidencia post-fix (`sdrm0218`)

| Métrica | Antes | Después |
|---------|-------|---------|
| Filas expandidas | ~11.567 | **11.591** |
| fk_miss | — | **0** |
| 106305 filas CSV | 1/14 | **14/14** |
| Uds 106305 D3 | parcial | **83** |
| BD staging vs CSV expandido | — | **173.422 = 173.422** (Δ=0) |
| Filas sin proveedor (10 CSV repo + Z:) | 24 legacy | **0** |

**Recuperación legacy:** 24 filas conf / **95 uds** que el prefijo-only tiraba (EAN Kyly).

---

## 4 · Grillas auditadas (no filtran por prefijo barcode)

| Grilla | Fuente | Nota |
|--------|--------|------|
| Report `/stock-pronta-entrega` | `listImportadoProductos` → PPD | Sin filtro prefijo |
| Report `/deposito-rimec/importado` | misma query | Sin filtro prefijo |
| RIMEC Web catálogo PE | `v_stock_pe_rimec` | Filtros UI = elección usuario (ramo/LIQ) |
| Bazzar catálogo | `proveedor_importacion_id` | Por rol 638/654 — diseño |

**Caso catálogo:** PE + Confecciones + `106305` → **15 filas** (colores 1 + 6826).

---

## 5 · Gate regresión (obligatorio pre-import)

```bash
cd report
npx tsx scripts/_test_proveedor_sdrm_row.ts
npx tsx scripts/_audit_sdrm_cobertura_universo.ts Z:\hector\sdrm0218.csv
```

| Script | Exit 0 = |
|--------|----------|
| `_test_proveedor_sdrm_row.ts` | Casos 638 pref · EAN+grupo10 · 654 · K* |
| `_audit_sdrm_cobertura_universo.ts` | 0 `sin_proveedor_hoy` · batch activo BD = CSV |

Auditoría batch histórico: solo resolución CSV (no falla BD si batch no cargado).

**Auxiliar hotfix:** `rimec-web/scripts/_audit_hotfix_106305_106385.ts` · `report/scripts/_audit_hotfix_sdrm_ean.ts`

---

## 6 · Garantía razonable (no absoluta)

| ✅ Cubierto | ⚠️ Pendiente / hueco |
|------------|----------------------|
| Pipeline PE SDRM TS + Python unificado | Gate **manual** — no CI pre-import aún |
| 10 CSV auditados · 0 filas huérfanas | Fila sin prefijo + sin COD.GRUPO + sin K → `null` (0 hoy) |
| Re-import `sdrm0218` en prod BD | Nueva ruta import que no use `proveedorFromSdrmRow` |
| Grillas leen BD post-import | Filtro rol Web (654-only no ve 638) — diseño |

---

## 7 · Qué hace Héctor / Andrés

**Héctor:** Buscar **106305** (no 106385) · PE Confecciones · ver color 6826. Correr gate antes de cada lote nuevo.  
**Andrés (siguiente turno):** correcciones adicionales ordenadas por Director · leer este CHUSAR + **2.3.1.10.1.7**.  
**No tocar:** Sales Report · deploy rimec-web prod sellada `f408fc2` salvo cierre etapa u orden directa.

---

## 8 · Relacionados

| Código | Doc |
|--------|-----|
| 2.3.1.10.1.7 | [CHUSAR_IMPORT_PE_SDRM_UI_BODY_NEXT15_20260812.md](./CHUSAR_IMPORT_PE_SDRM_UI_BODY_NEXT15_20260812.md) |
| 2.3.1.10.1.1 | [CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md](./CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md) |
| 2.2.1.x | Filtros PE siameses Web — no son causa de este bug |

---

**Shibboleth:** Andrés, el que viene. Protocolo Moises Activado · Moria + ACTUAL acatados.
