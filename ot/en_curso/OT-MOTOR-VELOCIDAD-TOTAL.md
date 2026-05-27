# OT-MOTOR-VELOCIDAD-TOTAL — Exterminio bucle pre-cálculo

**Estado:** Aplicado en disco (2026-05-18)

## Cambios

- `logic.py`: `preparar_filas_staging_bulk`, `prefetch_pilares_faltantes_listado`, materiales prefetch 1×SELECT
- `ui.py` Paso 3: sin barra 1/N; `st.spinner` + staging único al final
- SQL masivo sin cambios (~98 ms)

## Prueba Director

1. Reiniciar Streamlit (`Ctrl+C` → `.\streamlit_run.ps1`)
2. Listado nuevo → Paso 3 → terminal sin `SKU 1/91…`
3. Esperado: spinners cortos + `[ENGINE-SQL] Cálculo masivo OK: N filas en <1s`
