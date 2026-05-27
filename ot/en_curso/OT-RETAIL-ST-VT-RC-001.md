# OT-RETAIL-ST-VT-RC-001 — Retail en DB + verificación Supabase

**Prioridad:** P0  
**Director:** Héctor Segovia  
**Ejecutor:** Claude Code (con `DATABASE_URL` local de Nexus)  
**Estado:** LISTO PARA IMPORT (código con reemplazo total) — verificar 060 en Supabase si primera vez  
**Repo:** `C:\Users\hecto\Nexus_Core\control_central`

---

## Regla (no debatir)

| Módulo | Excel | Tabla Supabase |
|--------|-------|----------------|
| **Sales Report** | Su Excel de ventas | `registro_ventas_general_v2` — **no tocar** |
| **Retail** | VTA SM, **solo hoja `st+vt+RC`** | `registro_st_vt_rc_reposicion` |

- Otras hojas del VTA SM: **no importar, no vincular**.
- Pilares: solo FKs para **filtros e imágenes** en Retail.
- **No** mezclar con `retail_multitienda_staging` en código nuevo (legacy puede existir en DB).
- **Cada import:** `DELETE` completo de `registro_st_vt_rc_reposicion` → insert solo el Excel nuevo (reemplazo total).

---

## Entregables

1. Evidencia SQL (o salida de script) en `ot/RETAIL-ST-VT-RC-001-EVIDENCIA.md`
2. Migración **060** aplicada si la tabla no existe
3. (Opcional) 1 import de prueba desde Nexus UI si el Director pasa el xlsx

---

## Paso 1 — Verificar conexión

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
python scripts\verify_retail_db.py
```

Si falla por URL: usar `.env` o `.streamlit\secrets.toml` del mismo proyecto que Streamlit Nexus.

---

## Paso 2 — SQL en Supabase (si el script falla)

```sql
-- ¿Existe tabla Retail?
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'registro_st_vt_rc_reposicion'
ORDER BY ordinal_position;

-- Conteos
SELECT 'retail_st_vt_rc' AS fuente, COUNT(*)::bigint AS filas
FROM public.registro_st_vt_rc_reposicion
UNION ALL
SELECT 'sales_report', COUNT(*)::bigint
FROM public.registro_ventas_general_v2;
```

**PASS:** la primera query devuelve columnas (`batch_id`, `linea_codigo_proveedor`, `excel_material_code`, `material_id`, …).  
**FAIL:** 0 filas en `information_schema` → ejecutar Paso 3.

---

## Paso 3 — Aplicar migración 060 (solo si falta la tabla)

Archivo:

`control_central/migrations/060_registro_st_vt_rc_reposicion.sql`

Ejecutar en Supabase SQL Editor (o `psql` con URL del Director).  
**No** modificar el SQL salvo error explícito de Postgres (documentar en evidencia).

---

## Paso 4 — Re-verificar

Repetir Paso 1. Registrar en evidencia:

- Número de columnas de `registro_st_vt_rc_reposicion`
- `filas` retail (puede ser 0)
- `filas` en `registro_ventas_general_v2` (referencia Sales Report)

---

## Paso 5 — Código Nexus (solo lectura / smoke)

Confirmar que existe y no hay import roto:

- `modules/balance_tiendas_retail/st_vt_rc_import.py`
- `modules/balance_tiendas_retail/ui.py` → importa solo hoja `st+vt+RC`

**No** reactivar import a `retail_multitienda_staging` en esta OT.

---

## Paso 6 — Report (fuera de alcance salvo nota)

`report/` puede seguir leyendo `retail_multitienda_staging` hasta OT aparte.  
En evidencia: anotar si `/api/retail/stock-board` sigue en staging viejo.

---

## Criterios de cierre

- [ ] Tabla `public.registro_st_vt_rc_reposicion` existe en Supabase
- [ ] Script `verify_retail_db.py` termina sin `[FAIL]`
- [ ] `registro_ventas_general_v2` intacta (conteo reportado, sin DELETE)
- [ ] `ot/RETAIL-ST-VT-RC-001-EVIDENCIA.md` con fecha, quién ejecutó, conteos
- [ ] Director confirma PASS

---

## Copiar a Claude Code

```
Ejecutá OT-RETAIL-ST-VT-RC-001 en C:\Users\hecto\Nexus_Core\control_central.

1) python scripts\verify_retail_db.py
2) Si falta tabla → ejecutar migrations/060_registro_st_vt_rc_reposicion.sql en Supabase
3) Re-ejecutar verify y escribir ot/RETAIL-ST-VT-RC-001-EVIDENCIA.md

NO tocar registro_ventas_general_v2. NO importar otras hojas del Excel. NO mezclar con Sales Report.
Cada import BORRA registros Retail anteriores y deja solo el Excel nuevo.
```

---

## Referencias

- Doc: `control_central/docs/RETAIL_VS_SALES.md`
- UI Nexus: módulo **Retail (st+vt+RC)** en registry `balance_tiendas`
