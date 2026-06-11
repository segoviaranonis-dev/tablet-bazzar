# Evidencia OT-RETAIL-ST-VT-RC-001

**Fecha:** 2026-05-19  
**Ejecutor:** Cursor (código) — import real: Director en Nexus  

## Política confirmada

- [x] Cada import **elimina todo** `registro_st_vt_rc_reposicion` y carga solo el Excel nuevo
- [x] Solo hoja `st+vt+RC`
- [x] `registro_ventas_general_v2` no se toca

## Código

- `modules/balance_tiendas_retail/st_vt_rc_import.py` → `purge_all_retail()` + `insert_batch(replace_all=True)`
- UI Nexus → aviso amarillo de reemplazo total

## SQL post-import (completar tras import del Director)

```sql
SELECT COUNT(*) AS total FROM registro_st_vt_rc_reposicion;
SELECT batch_id, archivo_origen, COUNT(*) AS filas
FROM registro_st_vt_rc_reposicion
GROUP BY batch_id, archivo_origen;
```

| Métrica | Valor |
|---------|-------|
| total filas retail | _(tras import)_ |
| filas sales_report | _(solo lectura)_ |

## Pasos Director

1. Supabase: migración **060** si la tabla no existe
2. Nexus → **Retail (st+vt+RC)** → subir Excel → **Importar**
3. Mensaje esperado: `Reemplazo total: −N / +M filas`

## Veredicto

- [x] **LISTO** para importar (código)
- [ ] Import en producción verificado por Director
