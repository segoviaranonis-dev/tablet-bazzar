# Ley grada Carlos — 2.3.1.7.5.3.16 · LEY_GRADA_CEROS_CARLOS_PROFORMA.md
# Entre talla min y max, cada entero tiene qty; falta = 0. Ej: 35(1 0 5 4 2)39

**Código:** **2.3.1.7.5.3.16.1**  
**Fecha:** 2026-08-11  
**Keyword:** **Documenta** · orden Director  
**Alcance:** **Todos** los procesos de importación de proforma (PROGRAMADO · Compra previa) y serialización hacia Carlos

**Padres:** `2.3.1.7.5.3.16` · `PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO` · `CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO`

---

## 1 · Ley (inviolable)

| Capa | Regla |
|------|--------|
| **BD `grades_json`** | **Sparse permitido** — solo tallas con qty > 0 al importar Excel proforma |
| **Serialización Carlos** | Entre **min** y **max** de las tallas presentes, **cada entero** del rango lleva cantidad; talla ausente = **`0`** |
| **Formato texto** | `{min}({q_min} {q_min+1} … {q_max}){max}` · separador **espacio** |
| **Ejemplo** | Compra 35=1 · 37=5 · 38=4 · 39=2 → **`35(1 0 5 4 2)39`** |

**Prohibido** omitir ceros en: UI PP (Stock · Admin IC · FI) · PDF FI · CSV veneno ventas/inicial · export aprobaciones.

**No confundir** con curva caja cerrada `34(1 2 3 3 2 1)39` (12 pares) — si el rango es contiguo 34–39, la ley produce el mismo string.

---

## 2 · Implementación (Report · prod 2026-08-11)

| Archivo | Función |
|---------|---------|
| `report/src/lib/pedido-proveedor/grada-carlos-format.ts` | `expandGradesJsonCarlos` · `gradasFmtCarlosFromJson` · **`gradasFmtCarlosFromRaw`** |
| `report/src/app/aprobaciones/lib/linea-snapshot-display.ts` | `gradasFmtFromJson` → delega Carlos |
| `report/src/app/aprobaciones/lib/grades-csv-compact.ts` | `gradesJsonToCompacto` → Carlos |
| `report/src/lib/pedido-proveedor/csv-ventas-export.ts` | vía `gradasDisplayFromSnapshot` |
| `report/src/lib/depositos/grada-importadora-display.ts` | vía `gradasDisplayFromSnapshot` |
| `control_central/core/csv_utils.py` | `_grades_json_a_compacto` — paridad Python |

**Import proforma** (`parse-proforma.ts`): sigue guardando sparse — **correcto**; la ley aplica al **mostrar/exportar**, no duplicar ceros en BD salvo OT.

---

## 3 · Consumidores cubiertos

- Import proforma PROGRAMADO / CP (post-import display)
- Tab Stock PP · Administrador IC · FI card · PDF FI
- CSV veneno Carlos (`8604-26.csv`, `9888-26.csv`, …)
- Stock programado / tránsito (grilla PE)
- Aprobaciones · CSV general

---

## 4 · Caso Alfredo · PP-REC-001

| Campo | Valor |
|-------|-------|
| PP | PP-2026-0034 · proforma 9888/2026 |
| IC ejemplo | IC-2026-0906 · VIZZANO 7286 |
| Antes | `35(1 5 4 2)39` |
| Después | **`35(1 0 5 4 2)39`** |
| Reclamo | **`PP-REC-001`** → **cerrado** post-deploy |

---

## 5 · Shibboleth

Si pienso en el lo entiendo, pero si me lo explicarlo es imposible · Protocolo Moises Activado.
