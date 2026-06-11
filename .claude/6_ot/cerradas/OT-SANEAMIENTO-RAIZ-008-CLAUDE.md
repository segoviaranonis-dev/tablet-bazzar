# OT-SANEAMIENTO-RAIZ-008 — Barrer archivos sueltos fuera del pipeline

**Prioridad:** MEDIA  
**Ejecutor:** Claude Code  
**Apertura:** 2026-05-22

## Objetivo

Eliminar o reubicar archivos `.sql` / `.py` / `.js` / `.json` / `.md` que viven en la **raíz** de `Nexus_Core/` o `rimec-web/` fuera de `control_central/migrations/` y `control_central/scripts/`.

## Inventario conocido (Cursor)

### Raíz `Nexus_Core/`
- `mig_070_post_validacion.py`, `mig_070_post_validacion.json`
- `mig_070_pre_validacion.py`, `mig_070_pre_validacion.json`
- `mig_070_auditoria_rpc.py`, `mig_070_auditoria_rpc.json`
- `MIG_070_REPORTE_FINAL_REFACTOR_PRECIOS.md`

### Raíz `rimec-web/`
- `execute_smoke_test.py`
- `check_factura_interna_schema.py`, `check_precio_lista_schema.py`, `check_precio_evento_caso.py`
- `check_precio_lista_fk.py`, `check_all_casos.py`, `check_fk.py`
- `check_db.py`, `check_db_v2.py`
- `inspect_pp_ic.js`, `inspect_smoke_skus.js`, `inspect_constraints.js`

### Raíz `control_central/` (no en `scripts/`)
- `check_packages.py`, `check_excel_grada.py`, `inspect_excel_simple.py`, `inspect_xlsx.py`
- `verify_colors_grouped.py`, `verify_test_model.py`, `check_v_stock_web.py`, `check_aggrid_types.py`

## Reglas

1. **Borrar** si es duplicado de migración formal ya aplicada (todo `mig_070_*` en raíz).
2. **Mover** a `control_central/scripts/diagnostico/` o `rimec-web/scripts/diagnostico/` si aún sirve para auditoría.
3. **No tocar** `control_central/migrations/*.sql` ni código activo de apps.
4. Entregar `OT-SANEAMIENTO-RAIZ-008-EVIDENCIA-CLAUDE.md` con lista de archivos borrados/movidos.

## Evidencia

```
Archivos eliminados: ____
Archivos movidos:    ____
Verificación: git status limpio en raíces
```
