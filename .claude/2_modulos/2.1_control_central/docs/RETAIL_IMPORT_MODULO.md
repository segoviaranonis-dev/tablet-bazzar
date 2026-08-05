# Retail — Importación Excel (st+vt+RC)

**Módulo Nexus Streamlit:** `balance_tiendas` (sidebar: **Retail (st+vt+RC)**)  
**Repo:** `control_central/`  
**Última actualización:** 2026-06-14

---

## Índice documental (entrada)

| Orden | Documento | Uso |
|-------|-----------|-----|
| 1 | [INDICE.md](../INDICE.md) | Índice módulo Control Central |
| 2 | [index.md](../index.md) | Mapa documental canónico Nexus |
| 3 | **Este archivo** | Import Retail: código, UI, bugs conocidos |
| 4 | [RETAIL_VS_SALES.md](./RETAIL_VS_SALES.md) | Retail vs Sales Report (tablas distintas) |
| 5 | `.cursor/rules/politicas-importacion-pilares.mdc` | Leyes pilares en import |
| 6 | `.claude/RETAIL_VENTA_TIENDA_IMPLEMENTACION_COMPLETA.md` | FKs, cliente_id, tipo_v2 |
| 7 | `.claude/3_arquitectura/3.2_venta_tienda/CONFECCIONES_TIPO_V2_2.md` | **Kyly tipo_v2=2: L, K, material, color, grada** |
| 8 | `.claude/3_arquitectura/3.2_venta_tienda/multi_proveedor.md` | Índice proveedores 654 / 638 |
| 9 | `6_ot/en_curso/OT-RETAIL-ST-VT-RC-001.md` | Verificación tabla 060 |
| 10 | `6_ot/en_curso/OT-PILARES-LEYES-IMPORTACION-001.md` | Motor pilares + bug tabla destino |

---

## Cadena al pulsar **Importar** (reemplazo total)

```
Excel .xlsx (hoja st+vt+RC)
  → normalize_retail_dataframe()     validación línea+ref
  → insert_batch(replace_all=True)
       1. purge_all_retail()         DELETE FROM registro_st_vt_rc_reposicion  (todo lo anterior)
       2. resolve_retail_fks()        pilares + FKs
       3. to_sql(append)              solo filas del Excel nuevo
  → celebrate_import_done            toast + globos
  → list_batches                     un solo batch_id en tabla
```

**Política:** cada import **sustituye** el universo Retail; no acumula lotes. El batch anterior desaparece de la tabla (no hace falta borrar manualmente el lote viejo).

**Bloqueo UI:** si hay avisos de validación (`Hay N filas sin línea o referencia`), el botón **Importar** queda deshabilitado hasta corregir columnas Excel o mapping (`st_vt_rc_import.py` — STYLE `1184.100` y `LINE-REF` `1184-100`).

---

```
main.py
  └── core/navigation.py → sidebar
        └── registry key: balance_tiendas
              └── modules/balance_tiendas_retail/ui.py   ← pantalla import
```

**Operador:** Nexus Core → login → sidebar **Retail (st+vt+RC)** → subir Excel VTA SM (solo hoja `st+vt+RC`).

**Regla:** cada import hace `DELETE` total de `registro_st_vt_rc_reposicion` + insert del archivo nuevo (reemplazo total). **No tocar** `registro_ventas_general_v2` (Sales Report blindado).

---

## Código — mapa de archivos

| Archivo | Rol |
|---------|-----|
| `modules/balance_tiendas_retail/ui.py` | UI Streamlit: upload, botón import, feedback |
| `modules/balance_tiendas_retail/st_vt_rc_import.py` | Parser Excel → batch → `INSERT` / purge |
| `modules/balance_tiendas_retail/fk_resolve.py` | Resuelve FK pilares (`linea_id`, `referencia_id`, …) |
| `modules/balance_tiendas_retail/logic.py` | Queries, listados, legacy staging |
| `core/registry.py` | Registro módulo `balance_tiendas` |
| `migrations/060_registro_st_vt_rc_reposicion.sql` | DDL tabla destino |
| `scripts/verify_retail_db.py` | Smoke conexión + existe tabla |
| `scripts/lib/import_heartbeat.py` | Latido 60s en imports largos (obligatorio) |

**Tabla destino canónica:** `public.registro_st_vt_rc_reposicion`  
**Tabla legacy (no usar en import nuevo):** `retail_multitienda_staging`

---

## Bugs conocidos — dónde mirar

| # | Síntoma | Ubicación exacta | OT / nota |
|---|---------|------------------|-----------|
| **B1** | Import escribe staging viejo o datos no aparecen en Report retail | `st_vt_rc_import.py` ~L27 `TABLE_RETAIL = "retail_multitienda_staging"` | OT-PILARES-LEYES-001 — debe ser `registro_st_vt_rc_reposicion` |
| **B2** | Traceback al importar: `ModuleNotFoundError: scripts.lib.import_heartbeat` | `balance_tiendas_retail/ui.py` (import heartbeat) | OT-513 — restaurar `scripts/lib/import_heartbeat.py` |
| **B3** | FKs null tras import (`linea_id`, `referencia_id`) | `fk_resolve.py` (~L1030+) + llamada desde `st_vt_rc_import.py` (~L262+) | Ver `RETAIL_VENTA_TIENDA_IMPLEMENTACION_COMPLETA.md` |
| **B4** | Tabla no existe / columnas faltan | Supabase — migración 060 no aplicada | `OT-RETAIL-ST-VT-RC-001` Paso 3 |
| **B5** | Report `/retail` vacío o datos viejos | `report/` aún lee `retail_multitienda_staging` | OT-RETAIL-ST-VT-RC-001 Paso 6 — desacople staging |

### Diagnóstico rápido (Director / agente)

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
python scripts\verify_retail_db.py
rg -n "retail_multitienda_staging" modules/balance_tiendas_retail/
rg -n "TABLE_RETAIL" modules/balance_tiendas_retail/st_vt_rc_import.py
```

**PASS import:** terminal sin traceback · latido cada 60s · toast/celebrate post-commit · conteo filas en `registro_st_vt_rc_reposicion` > 0.

---

## Palabras clave Director

`bug urgente` / `hotfix urgente` en **Retail import** → revisar **B1–B2** primero (tabla destino + heartbeat), luego FKs (B3). No parchear en Report sin arreglar origen en Streamlit/BD.

---

**Shibboleth:** 5 patas ✅
