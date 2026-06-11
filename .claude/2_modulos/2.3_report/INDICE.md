# 2.3 REPORT - Sistema de Reportes Institucionales

**Tipo:** Módulo Web Interno  
**Tecnología:** Next.js (Local)  
**Estado:** Producción + NIIF UI 100%  
**Puerto:** 3003  
**Última actualización:** 2026-06-09

---

## 🎯 DESCRIPCIÓN

Report es el sistema de reportes institucionales de Nexus, implementando el estándar NIIF UI completo.

**Empresas:**
- RIMEC (Azul #002B4E)
- BAZZAR (Naranja #ea580c)

**Módulos activos:**
- ✅ Aprobaciones (NIIF 100%)
- Stock / Retail
- Ventas
- Ventas + Fotos
- Depósitos (6 tiendas BAZZAR)

---

## 📂 ESTRUCTURA

```
2.3_report/
├── INDICE.md (este archivo)
├── README.md
├── DEPLOY_VERCEL.md
├── VERCEL_EMERGENCY_CONFIG.md
└── docs/
    ├── DEPLOY_VERCEL_REPORT.md
    ├── DISENO_DATOS_SQL_KPI_JERARQUIA.md
    ├── DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md
    └── RETAIL_FILTERS_ROBUSTNESS_REPORT.md
```

---

## 📚 DOCUMENTOS CLAVE

### **Deploy y Configuración**
- **DEPLOY_VERCEL.md** - Guía de deploy a Vercel
- **VERCEL_EMERGENCY_CONFIG.md** - Configuración de emergencia
- **docs/DEPLOY_VERCEL_REPORT.md** - Deploy detallado

### **Arquitectura de Datos**
- **DISENO_DATOS_SQL_KPI_JERARQUIA.md** - Jerarquía de KPIs
- **DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md** - 8 tablas SQL del informe

### **Reportes**
- **RETAIL_FILTERS_ROBUSTNESS_REPORT.md** - Robustez de filtros Retail

---

## 🎨 NIIF UI - SISTEMA COMPLETO

### **Estado:** ✅ IMPLEMENTADO 100%

**Documentación:**
- `.claude/ETAPA_NIIF_UI_COMPLETA.md` - Etapa completada
- `.claude/1_fundamentos/1.3_politicas/fundamentos_estrategicos.md` - Sección 1

### **Paleta Institucional**

**RIMEC:**
```
Azul:       #002B4E  (RGB 0, 43, 78)
Azul Dark:  #001829
Azul Light: #003d6b
```

**BAZZAR:**
```
Naranja:      #ea580c
Naranja Dark: #c2410c
```

**Fondos:**
```
app-bg:     #f1f5f9  (Celeste griseado anti-cansancio)
app-bg-alt: #e2e8f0
card-bg:    #ffffff  (Blanco puro)
```

### **Componentes NIIF**

**Ubicación:** `/src/components/ui/`

1. **Button.tsx** - 3 variantes + loading states
2. **Modal.tsx** - Confirmaciones con fricción
3. **FormField.tsx** - Validación inline
4. **LoadingState.tsx** - Spinner, Skeleton, Overlay
5. **VariationIndicator.tsx** - Doble indicador ▲/▼
6. **MoneyDisplay.tsx** - Formato moneda
7. **TextInput.tsx** - Input accesible
8. **index.ts** - Barrel export

### **Header Unificado**

**Componente:** `NexusHeaderZen.tsx`

**Estructura:**
- Top Bar: Logo NEXUS + Logout
- Tabs Empresariales: RIMEC 🏢 / BAZZAR 🏪
- Pills Sub-navegación

### **Accesibilidad WCAG AA**
- ✅ Mínimo 12px texto
- ✅ Contraste 4.5:1
- ✅ Doble indicadores (color + texto + icono)
- ✅ Optimizado para 8 horas sin cansancio

---

## 🏗️ MÓDULOS

### **1. Aprobaciones** ✅
**Estado:** NIIF UI 100% implementado (piloto completo)

**Funciones:**
- Lista de pedidos pendientes
- Filtros por vendedor/fecha
- Modal de confirmación
- Badges redondeados
- Hover effects celestes

**Accesibilidad:** WCAG AA completo

### **2. Stock / Retail**
**Estado:** Producción (pendiente migración NIIF)

**Funciones:**
- Stock multi-tienda
- Filtros robustos
- Reportes en PDF

### **3. Ventas**
**Estado:** Producción (pendiente migración NIIF)

**Funciones:**
- Informe multidimensional
- 8 tablas SQL
- KPIs jerárquicos

### **4. Ventas + Fotos**
**Estado:** Producción (pendiente migración NIIF)

**Funciones:**
- Catálogo con imágenes
- Trazabilidad por foto

### **5. Depósitos BAZZAR**
**Estado:** Producción

**Funciones:**
- 6 tiendas BAZZAR
- Stock por depósito
- Traspasos entre tiendas

**Arquitectura:** Ver `3_arquitectura/3.2_venta_tienda/depositos.md`

---

## 📊 ARQUITECTURA

### **8 Tablas SQL Informe Ventas**

Ver: `docs/DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md`

1. `ventas_base` - Datos raw de transacciones
2. `ventas_por_linea` - Agregado por línea
3. `ventas_por_vendedor` - Agregado por vendedor
4. `ventas_por_cliente` - Agregado por cliente
5. `ventas_por_fecha` - Series temporales
6. `kpis_jerarquicos` - KPIs calculados
7. `metas_vs_real` - Cumplimiento de metas
8. `tendencias` - Análisis de tendencias

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- **NIIF Completo:** `.claude/ETAPA_NIIF_UI_COMPLETA.md`
- **Fundamentos Estratégicos:** `.claude/1_fundamentos/1.3_politicas/fundamentos_estrategicos.md`
- **Arquitectura Ventas:** `.claude/3_arquitectura/3.1_sales_report/`
- **Depósitos BAZZAR:** `.claude/3_arquitectura/3.2_venta_tienda/depositos.md`
- **Roles:** `.claude/10_roles/report/`

---

## 🎯 PRÓXIMOS PASOS

1. Migrar RIMEC (Ventas) a NIIF UI
2. Migrar Retail (Stock) a NIIF UI
3. Migrar Ventas-Fotos a NIIF UI
4. Completar Depósitos BAZZAR con NIIF

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-09  
**Responsable:** Claude Sonnet 4.5
