# 2. MÓDULOS - CATÁLOGO DEL SISTEMA

**Tipo:** Memoria SECUNDARIA con Índice  
**Consulta:** Para entender arquitectura y funcionamiento de cada módulo  
**Actualización:** Al cerrar etapa con cambios en módulo  
**Última actualización:** 2026-07-16 · etapas Bazzar Web + Catálogo latencia **CERRADAS** · Ley UI Superior

---

## 📋 CATÁLOGO DE MÓDULOS

### **2.0 Navegador Holding** (Next.js · moriachusar)
**📖 Docs:** [CHUSAR_NAVEGADOR_PROGRAMA.md](../1_fundamentos/CHUSAR_NAVEGADOR_PROGRAMA.md) · [CHUSAR_ORGANIGRAMA_RAMA_UNICA.md](../1_fundamentos/CHUSAR_ORGANIGRAMA_RAMA_UNICA.md)

**Descripción:** Portal etapas + módulos · organigrama rama única (2.0.2) · **cotización viva** (`/cotizacion` · valor proporcional módulos en curso).

**Prod:** https://moriachusar.vercel.app · **Local:** `:3004`  
**Cotización 2026-07-22:** [CHUSAR_COTIZACION_NAVEGADOR_20260722.md](../1_fundamentos/CHUSAR_COTIZACION_NAVEGADOR_20260722.md)

---

### **2.1 Control Central** (Streamlit)
**📖 Índice completo:** [2.1_control_central/INDICE.md](2.1_control_central/INDICE.md)

**Descripción:**  
Hub operativo principal de RIMEC construido en Streamlit.

**Funciones:**
- Sales Report (8 tablas SQL + KPIs)
- Aprobación de Pedidos RIMEC (PV global, FIs) — doc: `2.1_control_central/modules/aprobacion_pedidos/`
- Preventas
- Importación y facturación

**Estado:** ✅ Producción  
**Documentos:** 17+ archivos

---

### **2.2 RIMEC Web** (Next.js + Vercel)
**📖 Índice completo:** [2.2_rimec_web/INDICE.md](2.2_rimec_web/INDICE.md)

**Descripción:**  
Catálogo digital para vendedores RIMEC y **ADMIN tiendas Bazzar** (Fase 2 accesos 2026-06-10).

**Funciones:**
- Catálogo de productos
- Preventas por vendedor
- Carrito de compras
- Confirmación de pedidos
- Auth por `rol_id` + `categoria` (`puedeAccederRimecWeb`)

**Estado:** ✅ Producción  
**URL:** https://rimec-web.vercel.app  
**Etapa accesos:** [ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md](../4_etapas/ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md)

---

### **2.3 Report** (Next.js Local) · **último deploy activo** 🆕
**📖 Índice completo:** [2.3_report/INDICE.md](2.3_report/INDICE.md)  
**🧭 Navegador:** http://localhost:3004/modulos/report · [CHUSAR_NAVEGADOR_PROGRAMA.md](../1_fundamentos/CHUSAR_NAVEGADOR_PROGRAMA.md)

**Descripción:**  
Sistema de reportes institucionales con NIIF UI 100% implementado.

**Submódulos (2.3.x):** Sales Report, Retail, Ventas+Fotos, Aprobaciones, Pilares, Depósitos, RRHH (**2.3.10.x**), Proceso importación (**2.3.11.x** 🆕)

**Estado:** ✅ Producción + NIIF UI · etapa abierta Motor (2.3.11.1)  
**Puerto:** 3000  
**Documentos:** 10+ archivos + `rrhh/` + `proceso_importacion/`

---

### **2.4 Tablet Bazzar** (Next.js PWA)
**📖 Índice completo:** [2.4_tablet_bazzar/INDICE.md](2.4_tablet_bazzar/INDICE.md)  
**📖 Arquitectura:** [2.4_tablet_bazzar/CONTEXT.md](2.4_tablet_bazzar/CONTEXT.md)

**Descripción:**  
Sistema POS para vendedores de tiendas BAZZAR.

**Funciones:**
- Modo cadena consecutiva (táctil BR) ✅
- Depósitos (6 tiendas) ✅
- Backend titanio (server-side) ✅
- Agrupación L+R+Mat · color ✅
- Carrito offline-first (pendiente)

**Estado:** ✅ Producción · **Tickets POS + vendedor** 🟡 prep cierre (2.4.2.3 / 2.4.2.3.1) · **Caja Bazzar** 🟢 (2.3.2.2)  
**Estrategia:** Fase 1 Hiedra Venenosa 🌿 · puerta chica tienda  
**Documentos:** [INDICE 2.4](2.4_tablet_bazzar/INDICE.md) · [CHUSAR vendedor staging](2.4_tablet_bazzar/CHUSAR_TABLET_VENDEDOR_STAGING.md) · [caja_bazzar](../2.3_report/caja_bazzar/INDICE.md)

---

### **2.5 Bazzar Web** (Next.js · catálogo B2C)
**📖 Índice completo:** [2.5_bazzar_web/INDICE.md](2.5_bazzar_web/INDICE.md)

**Descripción:**  
Catálogo público e-commerce · `:3002` · Stock Sano · NIIF.

**Estado:** ✅ Etapa **2.5.1.1 CERRADA** 2026-07-16 · MVP local vendible  
**Paleta:** BAZZAR Naranja #ea580c

---

### **2.6 Depósitos Bazzar** (Report admin + Tablet POS)
**📖 Índice completo:** [2.6_depositos_bazzar/INDICE.md](2.6_depositos_bazzar/INDICE.md)

**Descripción:**  
Sync stock 6 tiendas Bazzar · administrador Report · consumo Tablet.

**Estado:** 🟢 Etapa activa **2.6.1**  
**URL admin:** Report `/depositos-bazzar`

---

## 📊 RESUMEN

| Módulo | Tecnología | Estado | URL/Puerto | NIIF | Docs |
|--------|-----------|--------|------------|------|------|
| 2.1 Control Central | Streamlit | ✅ Prod | Local | - | 17+ |
| 2.2 RIMEC Web | Next.js | ✅ Prod | Vercel | - | 5+ |
| 2.3 Report (+ RRHH 2.3.10 · Import 2.3.11) | Next.js | ✅ Prod | :3000 | ✅ 100% | 12+ |
| 2.4 Tablet Bazzar | Next.js PWA | ✅ Prod | PWA | - | 5+ |
| 2.5 Bazzar Web | Next.js | ✅ MVP local | :3002 | ✅ | 6+ |
| **2.6 Depósitos Bazzar** | Report+Tablet | 🟢 Activa | `/depositos-bazzar` | ✅ | 2+ |

**Total archivos MD en módulos:** 234+ (centralizados en `.claude/`)

---

## 🔍 CÓMO USAR ESTE ÍNDICE

**Cada módulo tiene su propio INDICE.md completo con:**
- Descripción detallada
- Estructura de archivos
- Documentos clave ordenados
- Funcionalidades
- Links a documentación relacionada

**Para consultar un módulo:**
1. Abrir índice del módulo (ej: `2.1_control_central/INDICE.md`)
2. Leer tabla de contenidos
3. Navegar a documento específico
4. Consultar arquitectura en `3_arquitectura/` si necesitas más detalle

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- **Conector repos:** `ENLACES_REPOS.md` · catálogo `CODIGO_MAESTRO.md` Parte B
- **Arquitectura:** `3_arquitectura/INDICE.md`
- **Fundamentos:** `1_fundamentos/INDICE.md`
- **Errores:** `5_errores/INDICE.md`
- **Roles:** `10_roles/`
- **NIIF UI:** `.claude/ETAPA_NIIF_UI_COMPLETA.md`

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-18  
**Responsable:** Cursor (Chusar)
