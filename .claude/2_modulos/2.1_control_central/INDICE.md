# 2.1 CONTROL CENTRAL - Streamlit

**Tipo:** Módulo Principal  
**Tecnología:** Python + Streamlit  
**Estado:** Producción  
**Última actualización:** 2026-06-09

---

## 🎯 DESCRIPCIÓN

Control Central es el hub operativo de RIMEC construido en Streamlit.

**Funciones principales:**
- Sales Report (Informe de Ventas multidimensional)
- Aprobaciones de pedidos
- Gestión de preventas
- Importación y facturación
- Herramientas de análisis

---

## 📂 ESTRUCTURA

```
2.1_control_central/
├── INDICE.md (este archivo)
├── README.md
├── docs/
│   ├── NEXUS_HOLDING_PROTOCOLO_CLAUDE_CODE.md
│   ├── NEXUS_MAPA_VERDAD_OPERATIVA.md
│   ├── NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md
│   ├── PUNTO_CRITICO_RECORTE_CALZADO.md
│   ├── COMPRA_WEB_LEY_FI.md
│   ├── CONTROL_INTEGRIDAD_HOLDING.md
│   ├── RETAIL_IMPORT_MODULO.md
│   ├── RETAIL_VS_SALES.md
│   ├── RIMEC_MISION_VISION_POLITICA.md
│   ├── RIMEC_WEB_FIX_LIMITE_SUPABASE.md
│   ├── OT_REGISTRO_ESTADO.md
│   ├── POLITICA_THUMBNAILS.md
│   └── COMO_EJECUTAR.md
└── modules/
    ├── sales_report/
    │   ├── CONTEXT.md
    │   └── GESTION_DETALLADA_MAPA_TABLA8.md
    └── aprobacion_pedidos/
        ├── CONTEXT.md
        └── MAPA_DATOS_PV.md

```

---

## 📚 DOCUMENTOS CLAVE

### **Protocolos**
- **NEXUS_HOLDING_PROTOCOLO_CLAUDE_CODE.md** - Protocolo de trabajo con Claude
- **LEY_UNIVERSAL_IMAGENES_PRODUCTO.md** (`2.01.04.021`) — **ENTRADA ÚNICA** · inserción · sm/md/lg · anti-desborde · **dual 654/638**
- **CHUSAR_IMAGENES_DUAL_PROVEEDOR_654_638.md** (`2.01.04.022`) — Absorción Kyly 638 · ops + código · 2026-07-13
- **CHUSAR_INYECCION_IMAGENES_EJECUCION_20260710.md** (`2.01.04.022`) — ✅ Cerrada · 1510 JPG Supabase
- **NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md** - Anexo contrato sm/md/lg
- **LEY_INTEGRIDAD_VISUAL_IMAGEN.md** - Anexo marco / infección
- **RIMEC Web integral:** [PROTOCOLO_IMAGENES_CARGA_INTEGRAL_RIMEC_WEB.md](../2.2_rimec_web/PROTOCOLO_IMAGENES_CARGA_INTEGRAL_RIMEC_WEB.md) — prefetch PE + default Calzados
- **CHUSAR_IMPORT_IMAGENES_BATCH.md** - Anexo ops · keyword **Importar imágenes**
- **CHUSAR_IMPORT_IMAGENES_PV_NOVIEMBRE_2_20260801.md** (`2.01.04.023`) — lote 508 · 12 nuevas · maestro 5312 · checklist próxima importación
- **CHUSAR_IMAGEN_DE_PORTADA_20260807.md** (`2.01.04.024`) — keyword **imagen de portada** · banners marca · `productos/portada/` · 8/8 PASS 2026-08-07
- **PUNTO_CRITICO_RECORTE_CALZADO.md** - Anexo caso 4215.1034 contain vs crop

### **Mapas y Verdad Operativa**
- **NEXUS_MAPA_VERDAD_OPERATIVA.md** - Fuente única de verdad
- **RETAIL_VS_SALES.md** - Diferencias entre modos Retail y Sales
- **RETAIL_IMPORT_MODULO.md** - Import Excel st+vt+RC
- **Confecciones tipo_v2=2** → `3_arquitectura/3.2_venta_tienda/CONFECCIONES_TIPO_V2_2.md`

### **Leyes y Controles**
- **COMPRA_WEB_LEY_FI.md** - Ley de Facturación e Importación
- **CONTROL_INTEGRIDAD_HOLDING.md** - Integridad de datos del holding

### **Políticas**
- **RIMEC_MISION_VISION_POLITICA.md** - Identidad corporativa RIMEC
- **POLITICA_THUMBNAILS.md** - Política de miniaturas de imágenes

### **Módulos**
- **modules/sales_report/** - Informe de Ventas (8 tablas SQL + KPIs)

---

## 🚀 MÓDULOS ACTIVOS

### **1. Sales Report**
**Ubicación:** `modules/sales_report/`

**Descripción:**  
Informe multidimensional de ventas con 8 tablas SQL y KPIs jerárquicos.

**Documentos:**
- `CONTEXT.md` - Contexto del módulo
- `GESTION_DETALLADA_MAPA_TABLA8.md` - Mapeo detallado de las 8 tablas

**Ver arquitectura completa:** `3_arquitectura/3.1_sales_report/`

### **2. Aprobación de Pedidos RIMEC**
**Ubicación código:** `control_central/modules/aprobacion_pedidos/`  
**Registry:** `modules.aprobacion_pedidos` (4.5)

**Descripción:**  
Autorización de pedidos mayoristas desde rimec-web. **UI:** Pendiente → Aprobado / Anulado. **BD:** `RESERVADA`→`CONFIRMADA`/`ANULADA`. Numeración global PV (`pv_global` / MIG-107). Gemelo Report: **2.3.1.3.2**.

**Documentos:**
- `modules/aprobacion_pedidos/CONTEXT.md` — arquitectura, tabs, tablas, reglas agente
- `modules/aprobacion_pedidos/MAPA_DATOS_PV.md` — auditoría PV, queries SQL, snapshot BD
- `modules/aprobacion_pedidos/CHUSAR_APROBACIONES_PE_BADGE.md` — `2.3.1.3.0.1` badge PRONTA ENTREGA
- `modules/aprobacion_pedidos/CHUSAR_APROBACIONES_CASO_PE_CORTO_20260726.md` — `2.3.1.3.0.2` CASO = PE-LIQ/NORMAL/PROMO
- `../2.3_report/aprobaciones/CHUSAR_TABS_PENDIENTE_APROBADO_ANULADO_20260729.md` — **2.3.1.3.2** tabs UI + SSR liviano

**Scripts mantenimiento:** `control_central/scripts/auditoria_pv_global_lite.py`, `corregir_montos_fi_legacy.py`, `run_backfill_pedidos_desincronizados.py`

**Estado:** ✅ Producción (auditoría PV 2026-06-10)

### **3. Preventas**
Estado: Producción  
Función: Gestión de preventas por vendedor

### **4. Retail — Importación Excel (st+vt+RC)**
**Ubicación código:** `control_central/modules/balance_tiendas_retail/`  
**Registry Streamlit:** `balance_tiendas` (sidebar: **Retail (st+vt+RC)**)

**Documentos:**
- [docs/RETAIL_IMPORT_MODULO.md](docs/RETAIL_IMPORT_MODULO.md) — **mapa UI, código y bugs conocidos**
- [docs/RETAIL_VS_SALES.md](docs/RETAIL_VS_SALES.md) — tabla `registro_st_vt_rc_reposicion` vs Sales Report
- `.cursor/rules/politicas-importacion-pilares.mdc` — leyes pilares
- OT: `6_ot/en_curso/OT-RETAIL-ST-VT-RC-001.md`, `OT-PILARES-LEYES-IMPORTACION-001.md`

**Bug bloqueante documentado:** `st_vt_rc_import.py:27` — `TABLE_RETAIL` apuntando a staging legacy.

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- **Arquitectura:** `3_arquitectura/3.1_sales_report/`
- **Fundamentos:** `1_fundamentos/1.2_leyes/pilares_rimec.md`
- **OT cerradas:** `6_ot/cerradas/`

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-10  
**Responsable:** Claude Sonnet 4.5 / Cursor (doc Aprobaciones)
