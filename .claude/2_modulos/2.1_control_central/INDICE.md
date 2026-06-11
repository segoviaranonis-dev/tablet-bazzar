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
│   ├── COMPRA_WEB_LEY_FI.md
│   ├── CONTROL_INTEGRIDAD_HOLDING.md
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
- **NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md** - Manejo de imágenes de productos

### **Mapas y Verdad Operativa**
- **NEXUS_MAPA_VERDAD_OPERATIVA.md** - Fuente única de verdad
- **RETAIL_VS_SALES.md** - Diferencias entre modos Retail y Sales

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
Autorización de pedidos mayoristas desde rimec-web. Flujo FI RESERVADA → CONFIRMADA. Numeración global PV (`pv_global` / MIG-107).

**Documentos:**
- `modules/aprobacion_pedidos/CONTEXT.md` — arquitectura, tabs, tablas, reglas agente
- `modules/aprobacion_pedidos/MAPA_DATOS_PV.md` — auditoría PV, queries SQL, snapshot BD

**Scripts mantenimiento:** `control_central/scripts/auditoria_pv_global_lite.py`, `corregir_montos_fi_legacy.py`, `run_backfill_pedidos_desincronizados.py`

**Estado:** ✅ Producción (auditoría PV 2026-06-10)

### **3. Preventas**
Estado: Producción  
Función: Gestión de preventas por vendedor

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
