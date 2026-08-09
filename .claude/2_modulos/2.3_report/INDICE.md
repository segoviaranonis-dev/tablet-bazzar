# 2.3 REPORT - Sistema de Reportes Institucionales

**Tipo:** Módulo Web Interno  
**Tecnología:** Next.js (Local)  
**Estado:** Producción + NIIF UI 100%  
**Puerto:** 3000 (dev local) · **3001** si Tablet ocupa 3000  
**Última actualización:** 2026-08-07 · **FOCO Bitácora monitoreo (2.3.1.51)** · sesión + venta activa

---

## 🎯 MUDANZA (objetivo general)

**CHUSAR padre:** [CHUSAR_MUDANZA_REPORT.md](CHUSAR_MUDANZA_REPORT.md) · **Etapa:** [ETAPA_MUDANZA_REPORT.md](../4_etapas/ETAPA_MUDANZA_REPORT.md)

Portar ciclo importadora RIMEC Streamlit → Report por sub-etapas (Motor · Excel · IC-DG-PP · CL-Fact-Dep).

---

Report es el sistema de reportes institucionales de Nexus, implementando el estándar NIIF UI completo.

**Empresas:**
- RIMEC (Azul #002B4E)
- BAZZAR (Naranja #ea580c)

**Módulos activos:**
- ✅ Aprobaciones (NIIF 100%) · **tabs** **2.3.1.3.2** · indagación **2.3.1.3.3** · **agilidad/plazo/perf** **2.3.1.3.6** 🟢 2026-08-07 [CHUSAR](aprobaciones/CHUSAR_APROBACIONES_AGILIDAD_PLAZO_PERF_20260807.md)
- ✅ **Administrador de Pilares** (`/pilares` — **2.3.5 CERRADA** 2026-06-17)
- ✅ **RRHH** (`/rrhh` — **2.3.10** · subcuentas 2.3.10.1–2.3.10.2)
- ✅ **Proceso importación** (`/proceso-importacion` — **2.3.1.7** · **2.3.1.7.2 Importación precios CERRADA** ✅)
- Stock / Retail
- Ventas
- Ventas + Fotos
- **Sales Report inmersivo (`/rimec` — 2.3.1.1)** → [CHUSAR_SALES_REPORT_FILTROS_CASCADA.md](CHUSAR_SALES_REPORT_FILTROS_CASCADA.md) · error **4.02.02.005** · v1.0.3 · **foco etapa** `SALES-REPORT-PDFS-20260804` [ETAPA](../../4_etapas/ETAPA_SALES_REPORT_PDFS_20260804.md) · CSV PE **CERRADA** [20260804](../../4_etapas/ETAPA_CSV_PE_DEPOSITO_CABECERA_20260804_CERRADA.md) sin deploy
- **PDF gerencial · subtotales banda desde nivel (`2.3.1.1.2`)** 🆕 → [CHUSAR_PDF_SUBTOTALES_BANDA_DESDE_NIVEL_20260804.md](CHUSAR_PDF_SUBTOTALES_BANDA_DESDE_NIVEL_20260804.md) · receta cocina · azul solo a la derecha de `startCol`
- **🔍🕵️ Gestión de compra · Director (2.3.1.11)** 🆕 → [gestion_compra/INDICE.md](gestion_compra/INDICE.md)
- **⚔️ Operativo Alejandro Magno (2.3.1.12)** → [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) · Día operativo / pruebas 5000 **CERRADA** [ETAPA_DIA_OPERATIVO_20260713_CERRADA.md](../4_etapas/ETAPA_DIA_OPERATIVO_20260713_CERRADA.md) ✅ 2026-07-16
- **Depósito RIMEC · Stock PE (2.3.1.10)** → [deposito_rimec/INDICE.md](deposito_rimec/INDICE.md) · `/stock-pronta-entrega` · **⬛ etapa calzado 654 CERRADA** [ETAPA_STOCK_PE_CALZADO_654…](../4_etapas/ETAPA_STOCK_PE_CALZADO_654_20260729_CERRADA.md) 2026-07-29 · **Ley DPE sin BCL** (**2.3.1.10.1.2.1**) · **Asignación descuentos** (**2.3.1.10.1.4**) · **sdrm2121** (**2.3.1.10.1.5**) · **Filtros PE** (**2.3.1.10.1.3**) · **Grada abierta 638** (**2.3.1.10.12**)
- **Logística OK (2.3.1.28)** 🆕 → [logistica_ok/INDICE.md](logistica_ok/INDICE.md) · `/logistica-ok` · Rimec **2.3.1.28.10** · multi **2.3.1.28.14** · roles **2.3.1.28.15** · orden tradicional **2.3.1.28.16** · VENDEDOR bloqueado desarrollo **2.3.1.28.17**
- **Automatización de informes (2.3.1.35)** 🆕 → [automatizacion_informes/INDICE.md](automatizacion_informes/INDICE.md) · `/automatizacion-informes` · Control PE · multi-usuarios/horarios **2.3.1.35.5** · plan PDF→bandeja `PLAN-AUTO-BANDEJA-PE-20260802` · **espíritu cocina 133×LPN/LPC03/LPC04** (**2.3.1.35.11**) · **cocina ≠ PDF** snapshot (**2.3.1.35.15**)
- **Mensajes internos (2.3.1.36)** 🆕 → [mensajes_internos/INDICE.md](mensajes_internos/INDICE.md) · `/mensajes-internos` · inbox `usuario_v2` · PDF backend · banquete tipo_v2 **2.3.1.36.6**
- **📋 Bitácora monitoreo sesión/venta (2.3.1.51)** 🆕 → [bitacora/INDICE.md](bitacora/INDICE.md) · `/holding/bitacora` · tabla L–V · respaldo carrito · [CHUSAR](bitacora/CHUSAR_BITACORA_MONITOREO_SESION_VENTA_20260807.md) · par carrito **2.2.1.42** · etapa [ETAPA_BITACORA…](../4_etapas/ETAPA_BITACORA_MONITOREO_SESION_VENTA_20260807.md) · 🆕 MOISES 2026-08-07 · aparcada (FOCO → SF)
- **📊 Situación financiera Rimec (2.3.1.50)** 🆕 **FOCO** → [situacion_financiera/INDICE.md](situacion_financiera/INDICE.md) · hub `/situacion-financiera` **2.3.1.50.5** · pestañas Guido+gráficos **2.3.1.50.6** · [CHUSAR módulo](situacion_financiera/CHUSAR_MODULO_HUB_SITUACION_FINANCIERA_20260809.md) · tablas **2.3.1.50.4** · etapa [ETAPA_SITUACION_FINANCIERA…](../4_etapas/ETAPA_SITUACION_FINANCIERA_RIMEC_20260806.md) · 🆕 MOISES post-20260807 · 2026-08-09
- **Etapa unificada** → [ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801.md](../4_etapas/ETAPA_INFORMES_AUTO_Y_MENSAJES_INTERNOS_20260801.md) · lección [CHUSAR_LECCION_VIOLACIONES…](CHUSAR_LECCION_VIOLACIONES_INFORMES_CORREO_20260801.md)
- **Depósitos Bazzar (2.3.2.1)** → [depositos/INDICE.md](depositos/INDICE.md) · app `/depositos-bazzar`
- **Caja Bazzar · Tickets (2.3.2.2)** 🆕 → [caja_bazzar/INDICE.md](caja_bazzar/INDICE.md) · app `/tablet-bazzar` · **Hub operativo/admin:** [CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md](../CHUSAR_BAZZAR_OPERATIVO_VS_ADMIN.md)
- **Motor de Precios (2.3.1.7.1 — Report)** 🆕

---

## 📂 ESTRUCTURA

```
2.3_report/
├── INDICE.md (este archivo)
├── depositos/                   — 2.3.2.1 Depósitos Bazzar (Report admin)
│   └── INDICE.md
├── caja_bazzar/                 — 2.3.2.2 Caja Bazzar · 6 tiendas · P-01…P-13
│   ├── INDICE.md
│   ├── CHUSAR_CAJA_BAZZAR_REPORT.md
│   ├── P-12 · P-13 · 00…11 + CAJAS/
│   └── report/docs/FLUJO_P12_P13_CAJA_BAZZAR.md
├── rrhh/                        — 2.3.10 RRHH (+ 2.3.10.1 · 2.3.10.2)
│   ├── INDICE.md
│   └── FUNCIONAMIENTO_ACTUAL.md
├── proceso_importacion/         — 2.3.1.7 ciclo importación (+ 7.1–7.5)
│   ├── INDICE.md
│   ├── CHUSAR_CICLO_IMPORTACION_REPORT.md
│   └── CHUSAR_*.md + inventarios Streamlit
├── motor_precios/               — 2.3.1.7.1 Motor (Corazón 1)
│   ├── INDICE.md
│   └── CHUSAR_MOTOR_PRECIOS.md
├── pilares/                     — 2.3.5 Administrador Pilares
│   ├── INDICE.md
│   └── CHUSAR_ADMINISTRADOR_PILARES.md
├── bitacora/                    — 2.3.1.51 Bitácora monitoreo sesión/venta (FOCO)
├── situacion_financiera/        — 2.3.1.50 Situación financiera Rimec
│   ├── INDICE.md
│   └── CHUSAR_SITUACION_FINANCIERA_RIMEC_CONSTITUCION_20260806.md
├── README.md
├── DEPLOY_VERCEL.md
└── docs/
    ├── DEPLOY_VERCEL_REPORT.md
    ├── DISENO_DATOS_SQL_KPI_JERARQUIA.md
    ├── DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md
    ├── RETAIL_FILTERS_ROBUSTNESS_REPORT.md
    └── ADMINISTRADOR_PILARES.md
```

---

## 📚 DOCUMENTOS CLAVE

### **Hotfix UI · Nivel Superior (2026-07-16)**
- **[LEY_ETIQUETA_NIVEL_SUPERIOR_UI.md](../1_fundamentos/1.3_politicas/LEY_ETIQUETA_NIVEL_SUPERIOR_UI.md)** — **5.01.00.020** · aprobaciones · facturación · reposición · error `4.05.02.001` ✅
- **[CHUSAR_DEPLOY_REPORT_SUPERIOR_REPOSICION_20260717.md](CHUSAR_DEPLOY_REPORT_SUPERIOR_REPOSICION_20260717.md)** — **2.3.4.0.14** · deploy prod Superior UI + reposición LIQ/PROMO · 2026-07-17

### **RRHH (2.3.10)**
- **[rrhh/INDICE.md](rrhh/INDICE.md)** — subcuentas **2.3.10.1** Vacaciones · **2.3.10.2** Funcionarios
- **[rrhh/FUNCIONAMIENTO_ACTUAL.md](rrhh/FUNCIONAMIENTO_ACTUAL.md)** — operación + tablas DB

### **Proceso importación (2.3.1.7 · dentro RIMEC)**
- **[proceso_importacion/INDICE.md](proceso_importacion/INDICE.md)** — plan de cuentas 7.1–7.5
- **[CHUSAR_CICLO_IMPORTACION_REPORT.md](proceso_importacion/CHUSAR_CICLO_IMPORTACION_REPORT.md)** — CHUSAR padre
- **[motor_precios/CHUSAR_MOTOR_PRECIOS.md](motor_precios/CHUSAR_MOTOR_PRECIOS.md)** — **2.3.1.7.1** Corazón 1
- **2.3.1.7.2 Importación precios** — [CHUSAR_IMPORTACION_PRECIOS.md](proceso_importacion/CHUSAR_IMPORTACION_PRECIOS.md) · **✅ CERRADA**
- **Cierre etapa:** [ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md](../4_etapas/ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md)
- **Inventario profundo:** [IMPORTACION_PRECIOS.md](proceso_importacion/IMPORTACION_PRECIOS.md)
- **App doc:** [report/docs/IMPORTACION_PRECIOS_REPORT.md](../../report/docs/IMPORTACION_PRECIOS_REPORT.md)
- **[CHUSAR_INTENCION_COMPRA.md](proceso_importacion/CHUSAR_INTENCION_COMPRA.md)** · **[CHUSAR_DIGITACION.md](proceso_importacion/CHUSAR_DIGITACION.md)** · **[CHUSAR_DIGITACION_MULTI_ASIGNAR_PROGRAMADO.md](proceso_importacion/CHUSAR_DIGITACION_MULTI_ASIGNAR_PROGRAMADO.md)** · **[CHUSAR_DIGITACION_BANDEJA_FILTROS_ACORDEON.md](proceso_importacion/CHUSAR_DIGITACION_BANDEJA_FILTROS_ACORDEON.md)** · **[CHUSAR_PEDIDO_PROVEEDOR.md](proceso_importacion/CHUSAR_PEDIDO_PROVEEDOR.md)** — 7.3–7.5
- **Etapa doc:** [ETAPA_CICLO_IMPORTACION_DOC_CHUSAR.md](../4_etapas/ETAPA_CICLO_IMPORTACION_DOC_CHUSAR.md)
- Navegador: http://localhost:3004/modulos/report · http://localhost:3004/procesos/importacion

### **Usuarios y accesos BZZ (Director)** 🎴
- **[report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md](../../../report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md)** — tarjetas usuario · triada · módulos · depósitos
- **[report/docs/ACCESOS_BZZ_RIMEC_WEB.md](../../../report/docs/ACCESOS_BZZ_RIMEC_WEB.md)** — accesos · passwords · enforcement (✅ etapa cerrada 2026-06-10)
- **[ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md](../4_etapas/ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md)** — cierre etapa HOLD-ACCESOS-BZZ-2026
- Índice Moria: [pilares/INDICE.md](pilares/INDICE.md) (tarjeta especial arriba)
- Matriz: [MATRIZ_ROLES_ACCESOS_HOLDING.md](../1_fundamentos/1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md)

### **Pilares (2.3.5 — Report)**
- **[pilares/CHUSAR_ADMINISTRADOR_PILARES.md](pilares/CHUSAR_ADMINISTRADOR_PILARES.md)** — CHUSAR operativo · 2.3.5 / 2.3.5.1 / 2.3.5.2 · miniaturas L×R
- **[pilares/INDICE.md](pilares/INDICE.md)** — índice subcuenta
- **docs/ADMINISTRADOR_PILARES.md** — doc profunda arquitectura
- **Cierre:** `.claude/4_etapas/ETAPA_ADMINISTRADOR_PILARES_REPORT_CERRADA.md`
- **Sub-sesión tablet:** `.claude/4_etapas/SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md`
- **Evidencia:** `report/docs/EVIDENCIA_SESION_PILARES_TRIANGULO_20260616.md`
- **Kyly:** `.claude/3_arquitectura/3.2_venta_tienda/CONFECCIONES_TIPO_V2_2.md`

### **Depósitos Bazzar (2.3.6 — Report)**
- **[depositos/INDICE.md](depositos/INDICE.md)** — subcuenta Report · admin sync
- **[DEPOSITOS_BAZZAR_ADMIN.md](../../../report/docs/DEPOSITOS_BAZZAR_ADMIN.md)** — doc app
- **Etapa:** `.claude/4_etapas/ETAPA_DEPOSITOS_BAZZAR.md`

### **Motor de Precios (2.3.1.7.1 — Report)** 🆕
- **[motor_precios/CHUSAR_MOTOR_PRECIOS.md](motor_precios/CHUSAR_MOTOR_PRECIOS.md)** — biblioteca · eventos
- **[motor_precios/INDICE.md](motor_precios/INDICE.md)** — índice subcuenta
- **[MOTOR_PRECIOS_REPORT.md](../../../report/docs/MOTOR_PRECIOS_REPORT.md)** — plan app
- **Etapa doc:** [ETAPA_MOTOR_PRECIOS_REPORT.md](../4_etapas/ETAPA_MOTOR_PRECIOS_REPORT.md) · **Importación:** [ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md](../4_etapas/ETAPA_IMPORTACION_PRECIOS_REPORT_CERRADA.md)
- **Ley:** `.claude/1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md`

### **Depósitos Bazzar (legacy 2.6 — redirigido)**
- Ver [2.6_depositos_bazzar/INDICE.md](../2.6_depositos_bazzar/INDICE.md) → apunta a 2.3.6

### **Deploy y Configuración**
- **DEPLOY_VERCEL.md** - Guía de deploy a Vercel
- **DEPLOY_REPORT_20260726.md** - Deploy listado motor · Logística · PP · Hiedra PE · `2a18c90`
- **CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md** - Tres entidades · un PPD · proforma 8604 · CSV · SR · checklist import (gestion_compra/)
- **PROTOCOLO_ALEJANDRO_MAGNO_PUERTA_CHUNA.md** - Puerta CHUNA etapa prioritaria (1.1_protocolos/)
- **ANDRES_INTEGRANTE_EQUIPO.md** - Usuario ANDRES · aprendizaje (10_roles/)
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
**Estado:** Producción · PDF 80 filas serverless ✅ 2026-07-10

**Funciones:**
- Catálogo con imágenes
- PDF ejecutivo hasta 80 filas · timeout 120s
- Trazabilidad por foto

**Doc:** [CHUSAR_VENTAS_FOTOS_PDF.md](CHUSAR_VENTAS_FOTOS_PDF.md) · **2.3.1.2.1**

### **6. Administrador de Pilares** ✅
**Estado:** **CERRADA 2026-06-17** · Vercel prod · multi-proveedor 654+638

**Norte:** Abandonar edición pilares en Streamlit Motor (confidencialidad). Paridad `_render_admin_lineas` + `_render_linea_referencia`, UX mejor en Report.

**Funciones (entregadas):**
- Selector proveedor **654** (calzado) / **638** (confecciones `tipo_v2=2`)
- Editar `linea`: marca, género · filtros chip · datos generales
- Editar `linea_referencia`: estilo, tipo_1 · cascada marcas · buscador multi-línea · editor rango
- Triángulo header instantáneo → RIMEC Web + Tablet

**Doc:** `report/docs/ADMINISTRADOR_PILARES.md` · Cierre: `.claude/4_etapas/ETAPA_ADMINISTRADOR_PILARES_REPORT_CERRADA.md`

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

---

## 🧭 Navegador holding (Portal 2)

**App:** `nexus-navegador-holding/` · http://localhost:3004/modulos/report

| Pantalla | Rol |
|----------|-----|
| `/modulos` | Report (2.3) badge **NEW** + fecha último `git log` en `report/` |
| `/modulos/report` | Acordeón RIMEC / Bazzar · tarjetas NIIF uniformes |
| `/modulos/report/rrhh` | Grid 2.3.10.1 · 2.3.10.2 |
| `/modulos/report/proceso-importacion` | Grid 2.3.11.1 · 2.3.11.2 |

Doc programa: [CHUSAR_NAVEGADOR_PROGRAMA.md](../../1_fundamentos/CHUSAR_NAVEGADOR_PROGRAMA.md) · config: `nexus-navegador-holding/config/arbol-modulos.json`

---

**Última actualización:** 2026-06-22  
**Responsable:** Cursor (Chusar autorizado Director)
