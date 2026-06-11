# ÍNDICE: 1.1 PROTOCOLOS

**Protocolos operativos fundamentales de Nexus Core**

---

## 📋 PROTOCOLOS ACTIVOS

### **1.1.5 Workflow Híbrido Cursor + Claude**
**Archivo:** `workflow_hibrido_cursor_claude.md`  
**Tema:** División de responsabilidades entre asistentes IA  
**Estado:** ✅ ACTIVO

**Contenido:**
- División de responsabilidades (Cursor ejecuta, Claude gestiona)
- Flujo de trabajo paso a paso (6 pasos)
- Criterios de decisión: ¿cuándo usar cada uno?
- Casos de uso reales
- Anti-patrones a evitar

---

### **1.1.6 Templates de Instrucciones para Cursor**
**Archivo:** `template_instrucciones_cursor.md`  
**Tema:** Templates específicos para controlar ejecución de Cursor  
**Estado:** ✅ ACTIVO

**Contenido:**
- Template base (copiar/pegar)
- Templates por tipo de tarea:
  - Refactoring de estilos/colores
  - Renombrado masivo de variables
  - Generación de componentes
  - Migración de patrones
- Ejemplos de instrucciones malas (NO usar)
- Checklist pre-ejecución
- Plantilla rápida (1 minuto)

---

### **1.1.7 Monitoreo y Control de Costos**
**Archivo:** `monitoreo_costos.md`  
**Tema:** Control total de gastos en herramientas IA  
**Estado:** ✅ ACTIVO

**Contenido:**
- Límites mensuales: Cursor $200, Claude $50, Total $250
- Dashboard de Cursor: tokens, requests, costo
- Estimaciones por tipo de tarea
- Sistema de alertas (4 niveles)
- Estrategias de optimización
- Tracking semanal
- Auditoría mensual
- Checklist pre-tarea

---

### **1.1.8 Estrategia de Ramas Git**
**Archivo:** `estrategia_ramas.md`  
**Tema:** Uso controlado de ramas en git  
**Estado:** ✅ ACTIVO

**Contenido:**
- Naming convention: `tipo/nombre-descriptivo`
- Ciclo de vida: creación → trabajo → verificación → integración → limpieza
- Arquitectura: GitHub Flow simplificado
- 5 reglas fundamentales de ramas
- Manejo de conflictos
- Monitoreo de ramas huérfanas
- Casos de uso (feature, hotfix, experimento)
- Templates para crear ramas

---

### **1.1.9 Reporte de Tokens y Costos**
**Archivo:** `reporte_tokens_costos.md`  
**Tema:** Protocolo obligatorio de reporte de consumo  
**Estado:** ✅ ACTIVO - OBLIGATORIO

**Contenido:**
- Formato obligatorio de reporte
- Niveles de riesgo (BAJO/MEDIO/ALTO)
- Cálculo de tokens (Cursor y Claude)
- Integración con GUION_MAESTRO
- Templates actualizados
- Tracking acumulado mensual
- Reglas críticas (siempre reportar)

---

### **1.1.10 Protocolo de Cierre de Etapa**
**Archivo:** `1.1.10_protocolo_cierre_etapa.md`  
**Tema:** Workflow completo Cursor/Claude/Director hasta cierre  
**Estado:** ✅ ACTIVO - CRÍTICO

**Contenido:**
- Definición: ¿Qué es "cerrar etapa"?
- Los 5 pasos obligatorios
- Roles y responsabilidades (Cursor, Claude, Director)
- Diagrama de flujo completo
- Ejemplos prácticos
- Anti-patrones (qué NO hacer)
- Checklist de cierre
- Shibboleth de verificación
- Regla de oro: Git + Deploy + PC sincronizados

---

## 🔗 PROTOCOLOS RELACIONADOS

**Otros documentos de protocolos** (si existen en esta carpeta):
- Guardian Claude (seguridad)
- Workflow Local First
- Protocolo de Etapas
- Otros...

---

## 📊 ESTADÍSTICAS

- **Total protocolos:** 4 documentados
- **Última actualización:** 2026-06-10
- **Estado:** Sistema híbrido ACTIVO

---

## 🎯 USO RÁPIDO

**Para iniciar tarea con Cursor:**
1. Lee: `1.1.5_workflow_hibrido` → decide si usar Cursor
2. Lee: `1.1.6_template_instrucciones` → copia template
3. Lee: `1.1.7_monitoreo_costos` → verifica límites
4. Lee: `1.1.8_estrategia_ramas` → crea rama correcta

**Para control de costos:**
→ `1.1.7_monitoreo_costos.md` (alertas, límites, tracking)

**Para manejar git:**
→ `1.1.8_estrategia_ramas.md` (crear, mergear, borrar ramas)

---

**Responsable:** Claude Sonnet 4.5  
**Aprobado por:** Héctor Segovia (Director)
