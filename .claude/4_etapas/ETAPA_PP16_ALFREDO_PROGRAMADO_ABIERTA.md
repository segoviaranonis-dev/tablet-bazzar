# ETAPA ABIERTA — PP-2026-0016 · Caso Alfredo · Import proforma PROGRAMADO

**ID:** `PP16-ALFREDO-PROGRAMADO-20260708`  
**Estado:** ⛔ **SUPERSEDIDA** — ver [ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md](./ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md) ✅ 2026-07-09  
**Usuario operativo:** **ALFREDO** (ADMIN RIMEC · gerente)  
**Portal :3004:** pendiente tarjeta — retomar con **Inicia etapa** si Director quiere badge navegador  
**Códigos:** **2.3.1.7.5.3.3** · Alejandro Magno · PROGRAMADO (`categoria_id=3`)

---

## Objetivo mañana

**Primera proforma PROGRAMADO en producción** — cierre end-to-end:

1. Preview SHOP↔IC ✅ sin errores  
2. Paso 2 import → **722 PPD** + **39 FI RESERVADA** + pilares enriquecidos  
3. Tab **Facturas Internas** visible para Alfredo  
4. Smoke local `:3000` antes de nuevo deploy prod (salvo orden directa)

---

## Caso de prueba

| Campo | Valor |
|-------|--------|
| PP BD id | **25** |
| Número | **PP-2026-0016** |
| Proforma | **8600-4121** |
| Excel | `8600IMPORTARWEB.xlsx` (Beira Rio) |
| Listado | **PR-8600** · evento **#37** · POLITICA JUNIO 2026 |
| ICs | **39** · **12 clientes** distintos · **8.880 pares** |
| URL prod | `https://rimec-report.vercel.app/proceso-importacion/pedido-proveedor/25?tab=stock` |
| URL local | `http://localhost:3000/proceso-importacion/pedido-proveedor/25?tab=stock` |

---

## Estado BD al cierre del día (2026-07-08)

| Métrica | Valor | Nota |
|---------|-------|------|
| `ppd_count` | 722 | Import parcial previo (sin FI) |
| `fi_count` | **0** | ❌ Objetivo no cumplido |
| `pares_vendidos` PPD | 0 | Borrado permitido |
| Pilares LPN join | 722/722 | Listado #37 OK |

**Acción mañana #0:** **Borrar y reimportar** (vendidos=0) con motor TS corregido · overlay de espera visible.

---

## Cronología fixes (2026-07-08)

| Commit report | Qué |
|---------------|-----|
| `644f091` | Motor TS proforma en Vercel (sin Python) |
| `70f594f` | `categoria_id` string → programado real + borrar TS + pilares upsert |
| `a34c660` | `id_cliente` string en Map SHOP↔IC (errores falsos masivos) |
| `777898c` | Overlay paso 1/2 + `maxDuration` 300s |

**Prod activo al cierre:** `777898c` · `rimec-report.vercel.app`

---

## Checklist mañana (Director / agente)

| # | Paso | PASS |
|---|------|------|
| 0 | `npm run dev:clean:3000` en `report/` | ⏳ |
| 1 | Login **ALFREDO** / ADMIN123 | ⏳ |
| 2 | PP 25 · tab Stock · **Borrar y reimportar** | ⏳ |
| 3 | Subir Excel · **Preview** → 12 filas ✅ · 8.880 pares | ⏳ |
| 4 | **Confirmar import** · aguardar overlay 3–6 min | ⏳ |
| 5 | Tab FI → **39 FI** RESERVADA | ⏳ |
| 6 | Pilares: material descripción + color tono_canon | ⏳ |
| 7 | Repetir smoke prod solo tras PASS local | ⏳ |

---

## Riesgos conocidos

- **Tiempo paso 2:** 3–6 min (722 SKUs + 39 FI) — overlay informa; no cerrar pestaña  
- **Vercel timeout:** `maxDuration=300` en ruta proforma — verificar plan Pro  
- **Reimport con stock:** `borrar_previo=1` usa borrar TS (no Python) desde `777898c`  
- **Pilares:** import = fuente principal · tono **Otros/multicolor** = manual en Pilares → Color

---

## Docs vinculados

| Doc | Ruta |
|-----|------|
| CHUSAR caso | [CHUSAR_CASO_ALFREDO_PP16_PROGRAMADO.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_CASO_ALFREDO_PP16_PROGRAMADO.md) |
| Protocolo | [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](../2_modulos/2.3_report/proceso_importacion/PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) |
| Error índice | [4.02.03.006](../5_errores/detalle/4.02.03.006_caso-alfredo-import-programado-pp16.md) |
| Código TS | `report/src/lib/pedido-proveedor/proforma-programado-engine.ts` |

---

**Shibboleth:** Andrés, el que viene.
