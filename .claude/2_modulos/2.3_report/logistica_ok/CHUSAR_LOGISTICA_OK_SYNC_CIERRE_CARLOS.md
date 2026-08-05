# CHUSAR — Logística OK · sync post-import cierre Carlos

**Código:** **2.3.1.28.7** · **Ratificado:** Director · 2026-07-25  
**Puente principal:** [CHUSAR_IMPORT_CIERRE_CARLOS_NEXUS.md](../proceso_importacion/CHUSAR_IMPORT_CIERRE_CARLOS_NEXUS.md) (**2.3.1.7.5.3.9**)

---

## Qué dispara la bandeja

Tras import CSV cierre OK en PP tab FI:

1. Motor valida **78/78** emparejamientos IC + FI Nexus (+ Q/R auditoría).
2. Escribe `factura_interna.pv_global` solo si columna **V Factura Real** viene poblada.
3. Llama `syncLogisticaPpIfBandera(ppId)` si PP está **PUBLICADO**.

Resultado esperado en `/logistica-ok` pestaña **General**: una fila por FI en `logistica_pendiente_confirmacion` · estado **PENDIENTE**.

---

## PP-38 piloto (preventa 4105)

| Métrica | 2026-07-25 |
|---------|------------|
| Import roundtrip | ✅ `78/78` emparejamientos · `0` errores |
| `pv_global` escritos | **0** (columna V vacía — pendiente Carlos) |
| Sync logística | **78** filas |
| Auditoría IC↔FI | **78** IC con FI · **0** duplicadas |

---

## Causa raíz histórica (vacío)

PUBLICADO **antes** de generar FI desde proforma → bandeja vacía. Corregido: `completar-fi` POST invoca sync al completar FI.

---

## Verificación operativa

```powershell
cd C:\Users\hecto\Nexus_Core\report
node scripts/_audit_pair_ic_fi_pp38.mjs 38
npx tsx scripts/run-import-cierre-pp.mjs 38 tmp/cierre_pp38_export.csv
```

UI: `:3000/logistica-ok` · refrescar tras import.

---

## Siguiente paso Carlos

Excel/CSV con columna **V** (Factura Real) → re-import mismo PP → `pv_global` + bandeja ya sincronizada se mantiene.
