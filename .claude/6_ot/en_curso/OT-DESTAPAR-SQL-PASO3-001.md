# OT-DESTAPAR-SQL-PASO3-001 — Sin éxitos falsos en Paso 3 SQL

**Estado:** Cursor aplicó · Claude valida  
**Git:** prohibido hasta cierre Director

## Hecho (Cursor)

- `logic.py`: `diagnostico_staging_evento`, logs `[DEBUG-SQL]`, `calcular_precio_lista_sql` lee `row[2]` y falla si total=0
- `ui.py`: `st.error` explícito; no limpia staging si falla
- `scripts/auditar_staging_casos.py --evento 9`

## Claude — validar

1. Reiniciar `.\streamlit_run.ps1`
2. Paso 3 evento 9 → pantalla debe mostrar error **texto real** o éxito con N>0
3. Si falla: `python scripts/auditar_staging_casos.py --evento 9`
4. Completar `RESPUESTA_EJECUTOR.md`
