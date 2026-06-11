# Plan de cierre — Nomenclatura P0 (antes flujo comercial)

**Director autorizó ejecución completa — 2026-05-19**

## Hecho en disco (Cursor)

| Capa | Cambio |
|------|--------|
| **PP** | Proforma: keys `linea_codigo_proveedor` / `referencia_codigo_proveedor`; botón borrar/reimportar |
| **Motor UI** | Pilares: aliases SQL P0 |
| **Retail Nexus** | `balance_tiendas_retail`: `linea_code` → `linea_codigo_proveedor` |
| **Report** | `report/src/lib/retail/*` alineado |
| **Webs** | Sin cambio TS (legacy `linea_codigo` OK; vista 056 añade alias canónico) |
| **SQL** | `migrations/056_nomenclatura_pilares_p0.sql` |

## Director — Supabase (orden, ~5 min)

```text
1. 055_precio_lista_backfill_codigos.sql  — solo Paso 1 UPDATE (si no corriste)
2. 056_nomenclatura_pilares_p0.sql        — vista + staging retail  
   (si falló 42P16: archivo corregido — alias P0 **al final** de la vista; volver a pegar entero)
```

## Director — Operación PP (orden, ~3 min)

```text
1. streamlit_run.ps1
2. PP → Borrar y reimportar (ventas = 0)
3. Cargar proforma (STYLE con punto: 1184.100)
4. Verificar Precios de este stock: Ref. + LPN
```

## Verificación rápida SQL

```sql
-- Vista con alias P0
SELECT linea_codigo, linea_codigo_proveedor FROM v_stock_web LIMIT 3;

-- Staging renombrado
SELECT column_name FROM information_schema.columns
WHERE table_name = 'retail_multitienda_staging'
  AND column_name LIKE '%codigo%';
```

## Git

Sin commit hasta que Director lo pida.
