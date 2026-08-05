# Prueba bóveda · stress Fase 1 — checklist piso

**Etapa:** BOVEDA-STRESS-BZZ-2026 · tienda **2100**  
**CHUSAR:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_BOVEDA_STRESS_TEST_BAZZAR.md`

---

## Ley recordatorio

**Tablet = generador de ticket.** No necesitás precio para CERRAR. La bóveda guarda la molécula vendida; el precio legal lo resuelve caja legacy después.

---

## Ciclo (repetir ≥ 3 veces)

| # | Paso | ✓ |
|---|------|---|
| 0 | `node report/scripts/reset_pos_bazzar_ventas.mjs` | |
| 1 | Tablet: vender 1–3 pares sin mirar precio | |
| 2 | CERRAR → FI_FA visible en FACTURAS | |
| 3 | Report caja 2100: ver lote | |
| 4 | CSV descargado | |
| 5 | Enviar a Empaque | |
| 6 | SQL: filas en `bobeda_venta_pos` = pares vendidos | |
| 7 | Anotar tiempo handoff + reset | |

---

## Evidencia JSON (plantilla)

Guardar en `docs/evidencia/BOVEDA_STRESS_2100_YYYYMMDD.json`:

```json
{
  "ciclo": 1,
  "cliente_id": 2100,
  "pares_vendidos": 2,
  "bobeda_count": 2,
  "numero_fi_fa": 1,
  "reset_ms": 0,
  "handoff_ms": 0,
  "pass": true
}
```

---

**Fase 1 — 2026-06-28**
