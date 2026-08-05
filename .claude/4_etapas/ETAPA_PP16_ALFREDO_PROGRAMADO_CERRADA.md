# ETAPA CERRADA — PP-2026-0016 · Caso Alfredo · Import proforma PROGRAMADO

**ID:** `PP16-ALFREDO-PROGRAMADO-20260708`  
**Código plan:** **2.3.1.7.5.3.3** · Alejandro Magno · PROGRAMADO  
**Apertura:** 2026-07-08 · **Cierre:** 2026-07-09 (noche)  
**Director:** Héctor · orden **Documenta** + **Inicia etapa** (sucesora: inyección IC)  
**Estado:** ✅ **CERRADA** — import local PASS · primera proforma PROGRAMADO operativa  
**Usuario:** ALFREDO · ADMIN RIMEC  
**Shibboleth:** Andrés, el que viene.

---

## Entregable operativo (PASS)

| Métrica | Esperado | Resultado |
|---------|----------|-----------|
| PPD | 722 | ✅ **722** |
| FI RESERVADA | 39 | ✅ **39** (25-PV001…039) |
| Σ pares PPD | 8.880 | ✅ **8.880** |
| Σ pares FI | 8.880 | ✅ **8.880** |
| `venta_transito` | 0 | ✅ **0** |
| `pares_vendidos = cantidad_pares` | 100% filas | ✅ **722/722** |
| IC vinculadas PP | 39 | ✅ **39** |
| UI mensaje verde Director | PASS | ✅ confirmado |

**Caso:** PP **PP-2026-0016** · BD id **25** · proforma **8600-4121** · Excel `8600IMPORTARWEB.xlsx` · **12 SHOP** · **39 IC**.

**URL local:** `http://localhost:3000/proceso-importacion/pedido-proveedor/25?tab=stock`  
**URL prod:** `https://rimec-report.vercel.app/proceso-importacion/pedido-proveedor/25?tab=stock`

---

## Secuencia que cerró la etapa

```
1. npm run dev:clean:3000 (report/)
2. Login ALFREDO / ADMIN123
3. PP 25 · tab Stock · Borrar importación (gate venta Web=0)
4. Subir 8600IMPORTARWEB.xlsx
5. Paso 1 Preview → 12 SHOP ✅ · 8.880 pares
6. Paso 2 Import → overlay 3–6 min
7. Tab FI → 39 RESERVADA
8. Audit: node scripts/audit_pp25_aritmetica.mjs 25
```

---

## Fixes aplicados en la etapa (commits report)

| Commit | Fix |
|--------|-----|
| `644f091` | Motor TS preview/import (sin Python Vercel) |
| `70f594f` | `categoria_id` string → PROGRAMADO real + borrar TS + pilares |
| `a34c660` | `id_cliente` string en Map SHOP↔IC |
| `777898c` | Overlay paso 1/2 + `maxDuration=300` |
| *(local 2026-07-09)* | Gate borrar · aritmética tier LP · KPI GREATEST · UI SHOP |

---

## Deuda heredada (no bloquea cierre PP16)

| # | Tema | Estado |
|---|------|--------|
| 1 | **27 IC** aún `listado_precio_id=1` (LPN) vs **12** LPC04 — FI cabecera LPC04 | 🟡 backfill o recalc FI antes CSV Carlos |
| 2 | CSV veneno Carlos tab FI (2.3.1.7.5.3.4) | ⏳ smoke post-alineación LP |
| 3 | Prod Alfredo repite smoke | ⏳ orden Director |
| 4 | Performance paso 2 >6 min | ⏳ optimización batch pilares |

---

## Docs CHUSAR de la etapa

| Código | Doc |
|--------|-----|
| 2.3.1.7.5.3.3.2 | [CHUSAR_CASO_ALFREDO_PP16_PROGRAMADO.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_CASO_ALFREDO_PP16_PROGRAMADO.md) |
| 2.3.1.7.5.3.3.3 | [CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO.md) |
| 2.3.1.7.5.3.4 | [CHUSAR_PROGRAMADO_INSTRUMENTO_VENTA_AM.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_PROGRAMADO_INSTRUMENTO_VENTA_AM.md) |
| 2.3.1.7.5.3.3.4 | [CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md) |
| Error | `4.02.03.006` ✅ **RESUELTO** |

---

## Cierre Navegador (:3004) — OBLIGATORIO

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → entrada en `cerradasPorModulo.report` | ✅ |
| Nueva etapa sucesora en `trabajoVivo` | ✅ |
| `actualizado` bump en raíz JSON | ✅ |
| Verificado `:3004/etapas` | ⏳ Director |

---

**Etapa sucesora:** [ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709.md](./ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709.md)
