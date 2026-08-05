# CHUSAR — Reimport CP638 · PP-49 · Excel Primavera

**Código:** **2.3.1.33.3**  
**Fecha:** 2026-08-02 · **fix Hoja2** tarde  
**Keyword:** Documenta · protocolo gradas 638  
**Etapa viva:** [ETAPA_CP_CONFECCIONES_OK_20260729.md](../../../4_etapas/ETAPA_CP_CONFECCIONES_OK_20260729.md) · `CP-CONFECCIONES-OK-20260729`  
**Handoff:** [PENDIENTES_INICIO_DIA_20260803.md](../../../4_etapas/PENDIENTES_INICIO_DIA_20260803.md)  
**Shibboleth:** Andrés, el que viene.

**Padres:** [CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md](./CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md) · [PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md](../../../3_arquitectura/3.2_venta_tienda/PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md)

---

## 1 · Orden Director

1. Borrar proforma errónea PP-49 (0 ventas Web · datos inconsistentes).
2. Reimportar Excel **`Stock primavera (1).xlsx`** en PP-49 existente.
3. Documentar **gradas 638** para error recurrente Bazzar Web.
4. **Fix tarde:** usar **Hoja2** (totales Kyly 3131 + Milon 1857 = **4988**).

---

## 2 · Bug reportado — hoja y duplicados

| Síntoma | Causa |
|---------|--------|
| Usuario pivot **4988** · import **4528** | Script leía **Hoja3** col Qtde + filtro col AF (Pedido Externo) |
| «Duplicados saltaban en vez de sumar» | Hoja3 tiene 1140 filas duplicadas; **Hoja2** ya trae **986 filas únicas** |
| Col equivocada Hoja2 | Col **26 Fx** suma 2195 · col **25 Total** suma **4988** ✅ |

**Solución:** `reimport_pp49_primavera_638.mts` → default **Hoja2** · `qtdeCol: 25` · sin filtro AF.

---

## 3 · Import final (Hoja2 · 2026-08-02 tarde)

| Campo | Valor |
|-------|-------|
| Script | `report/scripts/reimport_pp49_primavera_638.mts` |
| Excel | `C:\Users\hecto\Downloads\Stock primavera (1).xlsx` |
| Hoja | **Hoja2** |
| Columna cantidad | **25** (`Total`) |

### Métricas post-import ✅

| Métrica | Valor |
|---------|------:|
| SKUs | **986** |
| Prendas totales | **4988** |
| Kyly | **3131** |
| Milon | **1857** |
| Precio audit | 113/117 OK · **4 SKUs sin caso** (175 pares) |
| Catálogo `v_stock` | 986 artículos · saldo **4988** |
| Alzado | `EN_TRANSITO` · preventa **4092** |

### Avisos import

- 4 líneas Milon nuevas sin caso matriz: **2001744, 2001787, 2001872, 2001880** (175 pares).
- 30 moléculas con aviso LPN listado (post-alzar).

### Import anterior (obsoleto — Hoja3+AF)

| Métrica | Valor |
|---------|------:|
| SKUs | 919 |
| Prendas | 4528 |

---

## 4 · Gradas en este import (638)

Cada fila = **1 SKU = 1 talle**. Ver [3.02.00.638](../../../3_arquitectura/3.2_venta_tienda/PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md).

---

## 5 · Pendientes (→ handoff 20260803)

1. Asignar caso Motor — 4 líneas Milon (175 pares).
2. Imágenes + precio tarjetas `:3001` CP.
3. Lightbox parpadeo color · pill Todos · carrito smoke.
4. `am_talle` ALM_WEB Bazzar.

---

## 6 · Scripts

```bash
npx tsx report/scripts/reimport_pp49_primavera_638.mts 49 "C:/Users/hecto/Downloads/Stock primavera (1).xlsx" "638-PR26-4092" Hoja2
npx tsx report/scripts/generar_informe_import_cp638.mts
npx tsx report/scripts/_metricas_pp49.mts
npx tsx rimec-web/scripts/_verify_cp_confecciones_20260729.ts
```
