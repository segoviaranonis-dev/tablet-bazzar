# ETAPA CERRADA — Inyección de datos en tránsito · IC PROGRAMADO

**ID:** `INYECCION-DATOS-TRANSITO-IC-20260709`  
**Código plan:** **2.3.1.7.3.3** · Proceso importación · Alejandro Magno  
**Apertura:** 2026-07-09 · **Cierre:** 2026-07-09 (mañana)  
**Director:** Héctor · orden **Documenta** + **Cierra etapa** + deploy Report  
**Estado:** ✅ **CERRADA** — 373 IC PROGRAMADO en bandeja · orden Excel invertido · prod Vercel  
**Shibboleth:** Andrés, el que viene.

---

## Entregable operativo (PASS)

| Métrica | Resultado |
|---------|-----------|
| IC insertadas | ✅ **373** · `PENDIENTE_OPERATIVO` |
| `categoria_id` | **3** PROGRAMADO |
| Rango números | **IC-2026-0112** → **IC-2026-0484** (reutiliza serialización) |
| Orden bandeja | ✅ **Última fila Excel primero** · fila 3 al final (`numero_registro ASC`) |
| Smoke Director | ✅ IC-2026-0112 · Gs. **8.824.000** · shop **2400** · primera tarjeta |
| Excel fuente | `PARA INTENCION DE COMPRA (1).xlsx` → `_CHUSAR.xlsx` |
| Evento precio | **37** (PR-8600) |
| Proveedor | **654** Beira Rio |

**URL local:** `http://localhost:3000/proceso-importacion/intencion-compra/bandeja`  
**URL prod:** `https://rimec-report.vercel.app/proceso-importacion/intencion-compra/bandeja`

---

## Secuencia que cerró la etapa

```
1. adaptar_excel_ic_chusar.mjs → 373 filas OK (col F plazo intacta)
2. inject_ic_programado_excel.mjs --dry-run → orden invertido verificado
3. inject_ic_programado_excel.mjs → INSERT lote
4. Fix pendientes-query.ts → ORDER BY numero_registro ASC (no quincena primero)
5. Smoke Director PASS · primera IC = última fila Excel
6. npm run build · push report · deploy Vercel
7. Moria + etapas.json hecho
```

---

## Código Report (commit cierre)

| Campo | Valor |
|-------|--------|
| Commit | **`bd004c9`** · `feat(ic): cierre inyeccion PROGRAMADO orden Excel invertido bandeja` |
| Deploy Vercel | **READY** · `dpl_CdJ644pTf6AkC1sNoL8WE4TYN3zi` |

| Archivo | Cambio |
|---------|--------|
| `src/lib/intencion-compra/pendientes-query.ts` | Orden bandeja PENDIENTES por `numero_registro ASC` |
| `scripts/adaptar_excel_ic_chusar.mjs` | Excel legacy → CHUSAR |
| `scripts/inject_ic_programado_excel.mjs` | INSERT lote · orden invertido · números fijos 0112+ |
| `scripts/borrar_ic_lote_20260709.mjs` | Rollback lote PENDIENTE sin PP |
| `scripts/audit_ic_excel_fk.mjs` | Preview FK |

---

## Deuda heredada (fuera alcance cierre v1)

| # | Tema | Estado |
|---|------|--------|
| 1 | UI Report `…/intencion-compra/import-batch` (preview + commit) | ⏳ fase 2 |
| 2 | Autorización masiva 373 IC | ⏳ Director |
| 3 | PP-16: 27 IC LPN vs FI LPC04 | 🟡 backfill LP |
| 4 | CSV Carlos PP-16 | ⏳ post-autorización IC |

---

## Docs CHUSAR

| Código | Doc |
|--------|-----|
| 2.3.1.7.3.3 | [CHUSAR_INYECCION_DATOS_TRANSITO_IC.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_INYECCION_DATOS_TRANSITO_IC.md) |
| 2.3.1.7.3.3.1 | [CHUSAR_INYECCION_IC_EJECUCION_20260709.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_INYECCION_IC_EJECUCION_20260709.md) |
| Predecesora | [ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md](./ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md) |

---

**Portal :3004:** tarjeta `INYECCION-DATOS-TRANSITO-IC-20260709` → **`hecho`**
