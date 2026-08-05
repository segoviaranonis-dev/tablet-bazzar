# ÍNDICE: 1.1 PROTOCOLOS

**Protocolos operativos fundamentales de Nexus Core**

**Ingreso agente (obligatorio):** `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` · gato → **7 años**

---

## 📋 PROTOCOLOS ACTIVOS

### **5.01.00.001 Ingreso agente Chuna**
**Archivo:** `PROTOCOLO_INGRESO_AGENTE_CHUNA.md`  
**Tema:** Puerta única · shibboleth · rigurosidad portón de obra  
**Estado:** ✅ ACTIVO — shibboleth vivo = **Protocolo Moises Activado** (2026-08-04)

### **5.01.00.021 Protocolo Moises Activado**
**Archivo:** `CHUSAR_PROTOCOLO_MOISES_ACTIVADO_20260804.md`  
**Tema:** Relevo Chusar→Moises · misma planificación · orilla profesional  
**Estado:** ✅ VIGENTE — etapa `MOISES-20260804`

---
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

### **1.1.9 Protocolo Nueva / Cerrar Etapa (keyword Director)**
**Archivo:** `protocolo_etapas.md`  
**Keywords:** **Cierra etapa** · **CERRAR ETAPA** · **Nueva etapa**  
**Estado:** ✅ ACTIVO - CRÍTICO

**Contenido:**
- Checklist **mismo turno** — doc Moria + **`etapas.json`** + verificar `:3004/etapas`
- Plantilla bloque cierre al final de `ETAPA_*_CERRADA.md`
- Anti-patrón: Moria CERRADA sin JSON = **FAIL**
- Regla Cursor: `.cursor/rules/cierre-etapa-navegador.mdc`

---

### **1.1.10 Protocolo de Cierre de Etapa**
**Archivo:** `1.1.10_protocolo_cierre_etapa.md`  
**Atajo keyword:** `protocolo_etapas.md` — checklist «CERRAR ETAPA» + `etapas.json`  
**Tema:** Workflow completo Cursor/Claude/Director hasta cierre  
**Estado:** ✅ ACTIVO - CRÍTICO

**Contenido:**
- Definición: ¿Qué es "cerrar etapa"?
- Los **6 pasos** obligatorios (incl. **PASO 6 · `etapas.json` · :3004**)
- Roles y responsabilidades (Cursor, Claude, Director)
- Diagrama de flujo completo
- Ejemplos prácticos
- Anti-patrones (qué NO hacer)
- Checklist de cierre
- Shibboleth de verificación
- Regla de oro: Git + Deploy + PC + **Navegador etapas** sincronizados

---

### **1.1.11 Bitácora · Usuarios · Reversiones · Bloqueo**
**Archivo:** `PROTOCOLO_BITACORA_USUARIOS_Y_REVERSIONES.md`  
**Tema:** Cierre post-COMPRA · matriz roles · bitácora forense · reversión solo holding · bloqueo usuario  
**Estado:** ✅ ACTIVO — segunda piedra cimiento (2026-06-19)

### **1.1.12 Hermanos siameses · Filtro Tipo (AM ↔ RIMEC Web)**
**Archivo canónico:** `../2_modulos/2.2_rimec_web/CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md` (`2.2.1.18`)  
**Regla Cursor:** `.cursor/rules/hermanos-siameses-filtro-tipo.mdc` (alwaysApply)  
**Tema:** Fix en una grilla → chequear y alinear la otra en el mismo turno · LIQ>Promo>Normal  
**Estado:** ✅ ACTIVO — 2026-07-20 · lección `4.01.04.002`

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

### **Handoff Cursor — RIMEC Web PE local**
**Archivo:** `CURSOR_CONTINUAR_RIMEC_WEB_PE_LOCAL.md`  
**Tema:** Pendientes mañana · catálogo CABECERA · carrito PE · terminales cerradas  
**Estado:** ✅ ACTIVO · 2026-07-09 noche

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
