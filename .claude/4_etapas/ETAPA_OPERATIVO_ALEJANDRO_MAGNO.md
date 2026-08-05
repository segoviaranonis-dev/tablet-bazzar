# ETAPA ABIERTA — Operativo Alejandro Magno

**ID:** `OPERATIVO-ALEJANDRO-MAGNO-2026`  
**Código:** **2.3.1.12** · Report + Nexus + RIMEC Web  
**Estado:** 🟢 **EN CURSO** · trampa PE documentada · venta stock <60 min  
**Apertura:** 2026-07-05 · orden Director **Maratón 4/4 · Hiedra Venenosa**  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

Absorber **venta de stock pronta entrega** en menos de 60 minutos con arquitectura temporal documentada, sin romper catálogo RIMEC Web ni Sales Report blindado.

**Destino canónico (post-recursos):** `pedido_proveedor` + `pedido_proveedor_detalle` con `quincena_desc = 'Pronta entrega'`.  
**Puente hoy:** `stock_pronta_entrega_rimec` + UNION MIG-134 en `v_stock_rimec`.

---

## Las cinco cabezas

| # | Cabeza | Fuente | Estado hoy |
|---|--------|--------|------------|
| **1** | **Stock Pronta Entrega** | CSV `sdrm####` → `stock_pronta_entrega_rimec` | ✅ Panel `/stock-pronta-entrega` · import `control_central/scripts/import_rimec_pronta_entrega_csv.py` |
| **2** | **Stock Pedido Proveedor (PREVENTA)** | `pedido_proveedor_detalle` · tránsito PP | ✅ `/deposito-rimec/proceso` · origen `TRÁNSITO_PP` en catálogo |
| **3** | **Stock tiendas Bazzar** | 18 tablas → 1 unificada (Madre A) | ⏳ OT unificación · panel Bazzar existente |
| **4** | **Registro PP (PROGRAMADO)** | `pedido_proveedor` · `compra_previa = false` | ⏳ Cabecera PP programados |
| **5** | **Análisis Sales Report 2025–2026** | `registro_ventas_general_v2` + Ventas+Fotos | ⏳ Cable comportamiento ventas |

---

## Cabeza 1 — Stock Pronta Entrega (detalle)

### Depósito legal (no es etiqueta libre)

| Columna CSV sistema legal | `deposito_codigo` BD | `columna_stock_legal` |
|---------------------------|----------------------|------------------------|
| `S00_D1` | `D1` | `S00_D1` |
| `S00_DEP2` | `DEP2` | `S00_DEP2` |
| `S00_D3` | `D3` | `S00_D3` |

MIG-135 persiste `columna_stock_legal` para export factura legal.

### Rutas Report

| Ruta | Rol |
|------|-----|
| `/deposito-rimec` | Hub · 2 tarjetas |
| `/stock-pronta-entrega` | Panel control PE · KPI calzado/confecciones · filtros depósito/tipo_v2 |
| `/deposito-rimec/importado` | Redirect → `/stock-pronta-entrega` |

### Import

```powershell
cd report
node scripts/aplicar_migracion_135.mjs

cd ..\control_central
python scripts/import_rimec_pronta_entrega_csv.py "..\csv's\stock's\sdrm0831.csv" --dry-run
python scripts/import_rimec_pronta_entrega_csv.py "..\csv's\stock's\sdrm0831.csv"
```

CSV canónico: `csv's/stock's/sdrm0831.csv` · batch `sdrm0831` · 12.109 filas.

### Catálogo RIMEC Web

MIG-134 UNION · origen `PRONTA_ENTREGA` · shell verde · filtro cabecera Tránsito | Pronta entrega.

---

## Cabeza 5 — Sales Report · preventa y categorías

Tabla blindada: `registro_ventas_general_v2`.

| Campo | Significado |
|-------|-------------|
| `preventa = 1` | Venta **ejecutada** |
| `preventa = 2` o `3` | **Tránsito** (aún no ejecutada) |
| `categoria_v2` | STOCK · PREVENTA · PROGRAMADO (mapeo Ventas+Fotos) |

Referencia código: `v_ventas_pivot` · `preventa` · `categoria_v2` · `report/src/modules/sales-report/constants.ts`.

Ventas en tránsito comparten la misma tabla; el discriminador es `preventa`, no tablas separadas.

---

## Trampa documentada (Hiedra Venenosa)

```
CSV sdrm → stock_pronta_entrega_rimec (staging)
         → v_stock_rimec UNION PRONTA_ENTREGA
         → catálogo RIMEC Web (venta)
         ↓ (deuda post-recursos)
         pedido_proveedor_detalle · quincena_desc = 'Pronta entrega'
```

**Violación consciente:** stock PE no nace en PPD hoy. **No tocar** filas `TRÁNSITO_PP` en `v_stock_rimec`.

Doc: [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](../2_modulos/2.3_report/deposito_rimec/ESTRATEGIA_HIEDRA_VENENOSA_PE.md) · [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md)

---

## Migraciones BD (Cursor responsable arquitectura)

| MIG | Objeto | Estado |
|-----|--------|--------|
| 132 | `stock_pronta_entrega_rimec` | ✅ |
| 133 | cliente 5000 Bazzar.py | ✅ |
| 134 | `v_stock_rimec` UNION PE | ✅ |
| 135 | `columna_stock_legal` | ⏳ aplicar |

---

## Entregables fase 0 (<60 min)

| # | Entregable | Estado |
|---|------------|--------|
| 1 | Panel `/stock-pronta-entrega` | ✅ |
| 2 | APIs resumen + productos | ✅ |
| 3 | Import con `columna_stock_legal` | ✅ script |
| 4 | MIG-135 + backfill | ⏳ |
| 5 | Catálogo web PE verde | ✅ MIG-134 |
| 6 | Esta etapa documentada | ✅ |

---

## Caso PROGRAMADO · Proforma 8604 (Director · 2026-07-05)

| Dato | Valor |
|------|-------|
| Archivo | `programacion/faturaProforma_8604_2026.xls` |
| Proforma | **8604/2026** · 26/06/2026 |
| Volumen | **836 cajas · 10.032 pares** calzados |
| Entidad | **PROGRAMADO** (`categoria_id = 3`) · **no** RIMEC Web |
| Corte legal | Igual CP vendida entera → **CSV ventas PP** (`csv-ventas` API) |
| FI | Proforma (moléculas) + IC (cliente · vendedor · FECHA DE EMBARQUE) |

**Ratificación Director 2026-07-05 noche:** tres entidades · un PPD · Sales Report = cabo Excel · proforma 8604 · shibboleth **Andrés, el que viene.** · usuario **ANDRES** id 38 · doc [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) · [ANDRES_INTEGRANTE_EQUIPO.md](../10_roles/ANDRES_INTEGRANTE_EQUIPO.md).

---

## Prep cierre 2026-07-15 (Documenta)

| Campo | Valor |
|-------|--------|
| Código AM UI | **2.3.1.22**–**2.3.1.24** listos local |
| Handoff | [CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md) **2.3.1.25** |
| Bloqueo | FI prueba **cliente 5000** (otro agente) · plantilla reporte §3 |
| Deploy | ⛔ hasta **Cierra etapa** u orden directa Director |

---

## CHUSAR relacionados

| Doc | Tema |
|-----|------|
| **[CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)** | **Tres entidades · un PPD · FI · CSV · Sales Report** |
| **[CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md)** | **Handoff cierre · FI 5000** · **2.3.1.25** |
| **[CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md)** | **Ratificación 2026-07-08** · Disp+Venta · Panel macro · programado solo venta |
| **[CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md)** | Hub compacto · drill grilla estándar |
| **[CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_PANEL_CONTROL_GRILLA_HEADER.md)** | **CABECERA sellada** · `PanelControlGrillaStack` · **2.3.1.20** ✅ 2026-07-09 |
| [CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_STOCK_PRONTA_ENTREGA_RIMEC.md) | Tabla staging · mapeo CSV |
| [CHUSAR_DOS_MADRES_GESTION_COMPRA.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_DOS_MADRES_GESTION_COMPRA.md) | Madre A + Madre B |
| **[CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md)** | **PP-16 cerrado ✅** · 39 FI · catálogo errores import |
| **[CHUSAR_INYECCION_DATOS_TRANSITO_IC.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_INYECCION_DATOS_TRANSITO_IC.md)** | **Sub-etapa abierta** · ≥412 IC Excel · inyección en tránsito |
| [ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709.md](./ETAPA_INYECCION_DATOS_TRANSITO_IC_20260709.md) | Etapa hija 2.3.1.7.3.3 |

---

**Director:** solo prioriza cabezas. **Cursor:** arquitectura BD + auditoría. **Claude:** cable venta/reserva PE → PPD cuando cierre trampa.
