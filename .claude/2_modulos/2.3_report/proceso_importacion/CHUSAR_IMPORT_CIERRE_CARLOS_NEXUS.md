# CHUSAR — Import cierre Carlos ↔ Nexus (Factura Real · puente ERP)

**Código:** **2.3.1.7.5.3.9** · **Ratificado:** Director · 2026-07-25  
**Keyword:** Documenta · **Primera integración** Nexus ↔ sistema Carlos (pv_global)  
**Relacionado:** [CHUSAR_CERTIFICACION_PRECIOS_CP_RIMEC.md](./CHUSAR_CERTIFICACION_PRECIOS_CP_RIMEC.md) (**2.3.1.7.5.3.8**) · [logistica_ok/CHUSAR_LOGISTICA_OK_PLAN_OPERATIVO_PESTANAS_20260723.md](../logistica_ok/CHUSAR_LOGISTICA_OK_PLAN_OPERATIVO_PESTANAS_20260723.md) (**2.3.1.28.5**) · `factura-real.ts`

---

## Norte — puente Carlos

| Sistema | Identificador | Campo BD |
|---------|---------------|----------|
| **Nexus** | FI Nexus `38-PV004` | `factura_interna.nro_factura` |
| **Nexus** | Nro IC `IC-2026-0123` | `intencion_compra.numero_registro` |
| **Carlos** | Factura Real `PV000261` | `factura_interna.pv_global` |

**Palabra reservada:** **Factura Real** — nunca abreviar · ver `FACTURA_REAL_LABEL`.

Este proceso es la **primera vía formal** de ida y vuelta Excel/CSV entre operación Nexus y números del ERP Carlos.

---

## Mapa columnas CSV cierre (Excel A–V)

| Col | Header | Rol import |
|-----|--------|------------|
| **C** | Nro IC | Clave 1 · validación |
| **Q** | Evento precio | Auditoría listado/evento |
| **R** | Listado LP | Auditoría `listado_precio_id` / evento |
| **T** | FI Nexus | Clave 2 · match `nro_factura` |
| **V** | **Factura Real** | **WRITE** → `pv_global` |

Export: `GET …/csv-cierre-importacion` · Import: `POST …/import-cierre-importacion`

---

## Flujo operativo (PP tab FI)

```
1. ↓ CSV Cierre (78 IC + FI Nexus · V vacía)
2. Operador / Carlos completa columna V (Factura Real)
3. ↑ Import Factura Real
4. Motor valida C+T+Q+R · escribe pv_global
5. backfill notas FI←IC · sync Logística OK si PP PUBLICADO
```

---

## API · código

| Pieza | Ruta |
|-------|------|
| Export | `report/src/lib/pedido-proveedor/ic-cierre-importacion-csv.ts` |
| Import | `report/src/lib/pedido-proveedor/import-cierre-importacion.ts` |
| Parse PV | `parseFacturaRealCarlos()` · `factura-real.ts` |
| UI | `PpTabFacturasInternas.tsx` · botones ↓ CSV / ↑ Import |
| Runbook | `report/scripts/run-import-cierre-pp.mjs [ppId] [csv] [--dry-run]` |

---

## Reglas fail-closed

- Sin match **IC + FI Nexus** en el PP → fila rechazada · rollback total.
- **Q/R** mismatch evento/listado → fila rechazada.
- `Factura Real` vacía → fila OK · no escribe pv (modo pendiente Carlos).
- Tras import OK → `backfillFiIcNotasProgramado` + `syncLogisticaPpIfBandera`.

---

## Caso piloto PP-38 (0839-2026 · preventa 4105)

| Métrica | Valor 2026-07-25 |
|---------|------------------|
| IC vinculadas | **78** |
| FI RESERVADA | **78** |
| Emparejamiento IC↔FI | **78/78 (100%)** |
| pv_global pre-import | **0** (pendiente Carlos) |
| Logística post-sync | **78 PENDIENTE** |

**Import ejecutado 2026-07-25:** `run-import-cierre-pp.mjs 38 tmp/cierre_pp38_export.csv` → `ok:true` · `emparejamientos_ok:78` · `sync_logistica:78` · `pv_actualizados:0` (V vacía).

**Causa histórica bandeja vacía:** PUBLICADO antes de generar FI · proforma no llamaba sync → corregido en `completar-fi` POST.

---

## Pendiente

| # | Qué |
|---|-----|
| 1 | Excel Carlos con columna V rellena → re-import PP-38 |
| 2 | Soporte `.xlsx` nativo (hoy CSV) |
| 3 | Deploy Report prod |

---

## Comandos

```powershell
cd C:\Users\hecto\Nexus_Core\report
npx tsx scripts/run-import-cierre-pp.mjs 38              # roundtrip validate
npx tsx scripts/run-import-cierre-pp.mjs 38 ruta.csv   # import con Factura Real
node scripts/_audit_pair_ic_fi_pp38.mjs 38             # auditoría emparejamiento
```
