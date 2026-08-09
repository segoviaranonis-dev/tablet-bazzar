# CHUSAR — Tablas SF numeradas + verificación de variaciones

**Código:** **2.3.1.50.4**  
**Fecha:** 2026-08-09  
**Keyword:** Documenta (implementación plan tablas SF)  
**Migración LAB:** [`report/migrations/203_sf_tablas_staging.sql`](../../../../report/migrations/203_sf_tablas_staging.sql)  
**Pipeline:** `report/scripts/situacion-financiera/pipeline/` (`persistencia.py` · `run_corte.py`)  
**🆕 MOISES post-20260807 · 2026-08-09**

---

## 0 · Ley

- Prefijo `sf_*` · **no** tocar `registro_ventas_general_v2` (F4).
- Cada proceso = un `sf_corte` + archivos + staging + check de variaciones.
- Variación nueva **no borra** el lote: queda `variaciones_pendientes` hasta aprobar huella.
- Prod: solo cierre etapa u orden directa Director.

---

## 1 · Numeración canónica

### Gobernanza

| # | Tabla | Rol |
|---|--------|-----|
| **T01** | `sf_corte` | Cabecera lote (fecha AL, tasa, estado, batch_id) |
| **T02** | `sf_archivo` | Archivo del lote (hash, tipo, programa ERP, confianza) |
| **T03** | `sf_tipo_reporte` | Catálogo tipos + versión parser + columnas esperadas |
| **T04** | `sf_huella_erp` | Huellas aceptadas por tipo (memoria variaciones) |
| **T05** | `sf_variacion_evento` | Eventos por lote (tipo/huella/columnas) |

### Staging

| # | Tabla | Fuente |
|---|--------|--------|
| **T06** | `sf_cheque_vencer` | Cheques a vencer |
| **T07** | `sf_saldo_cliente` | CxC resumen |
| **T08** | `sf_saldo_factura` | CxC detalle + aging |
| **T09** | `sf_pv_prog` | PV Y PROG |
| **T10** | `sf_venta_erp` | Ventas ERP (JSON `extra`) |

### Sit Fin

| # | Tabla | Rol |
|---|--------|-----|
| **T11** | `sf_manual_linea` | Bancos / gastos / Bazzar / etc. |
| **T12** | `sf_sit_fin_linea` | Snapshot tablero (auto/manual) |

### Fase 2 (cobros — DDL reservado, no MVP)

| # | Tabla | Rol |
|---|--------|-----|
| **T13** | `sf_pago` | Cierre pagos |
| **T14** | `sf_proyeccion_cuota` | detalle_auditable |

**MVP migrado:** T01–T12.

---

## 2 · Estados de `sf_corte`

| Estado | Significado |
|--------|-------------|
| `borrador` | Import en curso |
| `variaciones_pendientes` | Hay eventos T05 sin aprobar |
| `cerrado` | Huellas OK · snapshot Sit Fin oficial |

---

## 3 · Verificación por proceso

1. Insert `sf_corte` + `sf_archivo`.  
2. Clasificar TXT → match T03 + T04.  
3. Sin match → `sf_variacion_evento` + estado `variaciones_pendientes`.  
4. Parser carga staging igual.  
5. Aprobar variación → alta/act T04 · bump versión T03.  
6. Sin eventos abiertos → `cerrado` + `sf_sit_fin_linea`.

**LAB local (sin Supabase):** mismo flujo en  
`report/scripts/situacion-financiera/data/catalogo_local/`  
(`tipos.json`, `huellas.json`, `cortes/*.json`).

---

## 4 · Comandos

```bat
cd report\scripts\situacion-financiera\pipeline
python seed_huellas.py
python run_corte.py --persist-local
python run_corte.py --persist-local
rem 2ª corrida: variaciones_nuevas = 0
```

Supabase LAB (cuando haya URL):  
`python run_corte.py --persist-local --supabase`  
(requiere `DATABASE_URL` o `SUPABASE_DB_URL`).

Migración: aplicar **203** solo en LAB / orden Director — no prod automática.

---

## 5 · Registro

| Campo | Valor |
|-------|-------|
| Plan | Tablas SF staging + variaciones |
| Etapa | `SITUACION-FINANCIERA-RIMEC-20260806` |
