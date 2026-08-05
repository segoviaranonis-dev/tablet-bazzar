# CHUSAR — Inyección IC PROGRAMADO · Ejecución 2026-07-09 · Cierre

**Código:** **2.3.1.7.3.3.1**  
**Etapa cerrada:** [ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709_CERRADA.md](../../../4_etapas/ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709_CERRADA.md)  
**Padre:** [CHUSAR_INYECCION_DATOS_TRANSITO_IC.md](./CHUSAR_INYECCION_DATOS_TRANSITO_IC.md)  
**Estado:** ✅ **373 IC** · bandeja PENDIENTES · orden Excel invertido · **prod deploy**

---

## 1 · Resumen ejecutivo

| Métrica | Valor |
|---------|-------|
| Filas Excel (v2) | **373** |
| IC insertadas | **373** |
| Estado BD | **`PENDIENTE_OPERATIVO`** |
| Rango números | **IC-2026-0112** → **IC-2026-0484** |
| Orden visual bandeja | `numero_registro ASC` → **última fila Excel = primera tarjeta** |
| Evidencia smoke | **IC-2026-0112** · Gs. **8.824.000** · shop **2400** · 152 pares |
| Prod | `https://rimec-report.vercel.app/proceso-importacion/intencion-compra/bandeja` |

---

## 2 · Orden Excel (regla Director)

| Excel | Número IC | Posición bandeja |
|-------|-----------|------------------|
| Fila 3 (primera) | IC-2026-0484 | **Última** tarjeta |
| Última fila (375) | IC-2026-0112 | **Primera** tarjeta |

**Implementación:**
- Script: `--orden-invertido` (default) · `--numeros-nuevos` desactivado → reutiliza 0112+
- Report: `pendientes-query.ts` → `ORDER BY ic.numero_registro ASC` (sin quincena primero)

---

## 3 · Archivos Excel

| Archivo | Rol |
|---------|-----|
| `PARA INTENCION DE COMPRA (1).xlsx` | Fuente Director v2 (373 filas) |
| `PARA INTENCION DE COMPRA (1)_CHUSAR.xlsx` | Adaptado CHUSAR · import |

**Regla:** columna **F (plazo_legacy)** **no modificada** en Excel.

---

## 4 · Scripts (`report/scripts/`)

```bash
cd report
node scripts/adaptar_excel_ic_chusar.mjs "…/PARA INTENCION DE COMPRA (1).xlsx" "…/_CHUSAR.xlsx"
node scripts/inject_ic_programado_excel.mjs --dry-run "…/_CHUSAR.xlsx"
node scripts/inject_ic_programado_excel.mjs "…/_CHUSAR.xlsx"
node scripts/borrar_ic_lote_20260709.mjs   # solo si hay que vaciar lote 0112–0484
```

---

## 5 · Historial iteraciones (misma etapa)

| Fecha | Filas | Nota |
|-------|-------|------|
| 2026-07-09 noche | 412 | Primer lote · orden natural · borrado al reimportar |
| 2026-07-09 mañana | 373 | Excel v2 · orden invertido · **cierre etapa** |

---

## 6 · Deuda fase 2

| # | Tarea |
|---|-------|
| 1 | UI `…/import-batch` preview + commit |
| 2 | Autorizar 373 IC (Director) |
| 3 | Digitación programado → PP |

---

**Shibboleth:** Andrés, el que viene.
