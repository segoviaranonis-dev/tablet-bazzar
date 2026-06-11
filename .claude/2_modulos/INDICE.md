# 2. MÓDULOS - CATÁLOGO DEL SISTEMA

**Tipo:** Memoria SECUNDARIA con Índice  
**Consulta:** Para entender arquitectura y funcionamiento de cada módulo  
**Actualización:** Al cerrar etapa con cambios en módulo  
**Última actualización:** 2026-06-09

---

## 📋 CATÁLOGO DE MÓDULOS

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
Catálogo digital para vendedores de RIMEC.

**Funciones:**
- Catálogo de productos
- Preventas por vendedor
- Carrito de compras
- Confirmación de pedidos

**Estado:** ✅ Producción  
**URL:** https://rimec-web.vercel.app  
**Errores conocidos:** HOTFIX_001 ✅ Resuelto

---

### **2.3 Report** (Next.js Local)
**📖 Índice completo:** [2.3_report/INDICE.md](2.3_report/INDICE.md)

**Descripción:**  
Sistema de reportes institucionales con NIIF UI 100% implementado.

**Empresas:**
- RIMEC (Azul #002B4E)
- BAZZAR (Naranja #ea580c)

**Funciones:**
- ✅ Aprobaciones (NIIF completo - piloto)
- Stock / Retail
- Ventas multidimensionales
- Ventas + Fotos
- Depósitos BAZZAR (6 tiendas)

**Estado:** ✅ Producción + NIIF UI  
**Puerto:** 3003  
**Documentos:** 8+ archivos

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

**Estado:** ✅ Producción (Etapa 2 cerrada)  
**Estrategia:** Fase 1 Hiedra Venenosa 🌿  
**Documentos:** 5 archivos (CONTEXT + LEY agrupación)

---

### **2.5 Bazzar Web** (Next.js - Futuro)
**📖 Índice completo:** [2.5_bazzar_web/INDICE.md](2.5_bazzar_web/INDICE.md)

**Descripción:**  
Catálogo público para clientes finales (e-commerce).

**Estado:** 🔴 Especificación inicial  
**Paleta:** BAZZAR Naranja #ea580c

---

## 📊 RESUMEN

| Módulo | Tecnología | Estado | URL/Puerto | NIIF | Docs |
|--------|-----------|--------|------------|------|------|
| 2.1 Control Central | Streamlit | ✅ Prod | Local | - | 17+ |
| 2.2 RIMEC Web | Next.js | ✅ Prod | Vercel | - | 5+ |
| 2.3 Report | Next.js | ✅ Prod | :3003 | ✅ 100% | 8+ |
| 2.4 Tablet Bazzar | Next.js PWA | ✅ Prod | PWA | - | 2+ |
| 2.5 Bazzar Web | Next.js | 🔴 Espec | - | Pend | 2+ |

**Total archivos MD en módulos:** 230 (centralizados en `.claude/`)

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

- **Arquitectura:** `3_arquitectura/INDICE.md`
- **Fundamentos:** `1_fundamentos/INDICE.md`
- **Errores:** `5_errores/INDICE.md`
- **Roles:** `10_roles/`
- **NIIF UI:** `.claude/ETAPA_NIIF_UI_COMPLETA.md`

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-10  
**Responsable:** Claude Sonnet 4.5
