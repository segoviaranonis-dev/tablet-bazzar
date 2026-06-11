# 1.1.5 WORKFLOW HÍBRIDO: CURSOR + CLAUDE CODE

**Tipo:** PROTOCOLO FUNDAMENTAL  
**Nivel:** CRÍTICO - Gestión de asistentes IA  
**Última actualización:** 2026-06-10

---

## 🎯 PRINCIPIO FUNDAMENTAL

**Cursor ejecuta, Claude gestiona.**

Dos asistentes IA con roles COMPLEMENTARIOS:
- **Cursor:** Brazo ejecutor rápido (refactoring masivo)
- **Claude Code:** Arquitecto, estratega, gestor (análisis, git, documentación)

---

## 👥 DIVISIÓN DE RESPONSABILIDADES

### **CLAUDE CODE (Arquitecto + Manager)**

**Responsabilidades:**

1. **Análisis y diagnóstico**
   - Grep de errores
   - Identificar qué hay que hacer
   - Reportar opciones al Director

2. **Estrategia y decisión**
   - Proponer plan de acción
   - Decidir QUÉ herramienta usar (Cursor vs Claude)
   - Definir alcance de trabajo

3. **Control de versiones**
   - Gestión de git (commit, push, merge)
   - Creación/eliminación de ramas
   - Resolución de conflictos

4. **Verificación post-ejecución**
   - Revisar cambios de Cursor
   - Testing
   - Validar que cumple requisitos

5. **Documentación**
   - Actualizar `.claude/`
   - Registrar decisiones
   - Memoria del proyecto

6. **Monitoreo de costos**
   - Rastrear tokens consumidos
   - Alertar si se acerca a límites
   - Optimizar uso de recursos

---

### **CURSOR (Ingeniero Ejecutor)**

**Responsabilidades:**

1. **Refactoring masivo**
   - Cambios en 20+ archivos simultáneos
   - Migración de patrones
   - Actualización de estilos/colores

2. **Cambios repetitivos**
   - Renombrar variables/funciones
   - Actualizar imports masivos
   - Aplicar linters/formatters

3. **Generación de código**
   - Crear componentes con patrón
   - Generar tipos TypeScript
   - Boilerplate

4. **SOLO ejecución técnica**
   - NO decide estrategia
   - NO maneja git (sin commit/push)
   - NO crea ramas sin autorización

---

## 🔄 FLUJO DE TRABAJO PASO A PASO

### **PASO 1: ANÁLISIS (Claude Code)**

```
1. Director presenta problema/tarea
2. Claude Code analiza:
   - Grep de archivos afectados
   - Identificar cantidad de cambios
   - Estimar complejidad
3. Claude reporta:
   - "X archivos necesitan cambios"
   - "Tipo de cambio: Y"
   - "Recomiendo: Cursor/Claude"
```

**Ejemplo:**
```
Director: "Aplicar NIIF a todo Report"

Claude Code:
├─ Grep: 83 líneas con errores NIIF
├─ Archivos: 39 archivos afectados
├─ Tipo: Refactoring masivo de colores
└─ Recomendación: CURSOR (rápido, masivo)
```

---

### **PASO 2: DECISIÓN (Director)**

```
Director decide:
- ¿Usar Cursor o Claude?
- ¿Qué alcance?
- ¿Qué restricciones?
```

**Ejemplo:**
```
Director: "Ok, que Cursor lo haga pero:
- Trabajar en rama nueva 'feat/niif-completo'
- NO hacer push
- Reportar cuando termine"
```

---

### **PASO 3: PREPARACIÓN (Claude Code)**

```
1. Crear rama si es necesario
2. Preparar template de instrucciones para Cursor
3. Definir límites de costo
4. Briefing al Director sobre qué esperar
```

**Ejemplo:**
```bash
# Claude Code ejecuta:
git checkout -b feat/niif-completo
git push -u origin feat/niif-completo

# Claude prepara instrucciones para Cursor
```

---

### **PASO 4: EJECUCIÓN (Cursor)**

```
Director copia instrucciones de Claude → Cursor
Cursor ejecuta según template
Cursor reporta cuando termina
```

**Instrucciones tipo:**
```
TAREA: Aplicar paleta NIIF a 39 archivos

REGLAS ESTRICTAS:
1. Rama actual: feat/niif-completo (NO crear otra)
2. NO hacer git commit
3. NO hacer git push
4. Modificar SOLO archivos src/app/**

CAMBIOS ESPECÍFICOS:
- stone-* → slate-*
- #4a3f35 → #002B4E (RIMEC)
- #8b7355 → #ea580c (BAZZAR)

Al terminar reportá:
- Archivos modificados
- Total de cambios
- NO hagas build
```

---

### **PASO 5: VERIFICACIÓN (Claude Code)**

```
1. Claude revisa cambios:
   - git diff
   - Archivos modificados
   - Calidad técnica

2. Testing:
   - npm run build
   - npm run dev (verificar visual)

3. Reporte al Director:
   - ✅ Todo correcto / ⚠️ Ajustes necesarios
   - Archivos afectados
   - Resultado visual
```

---

### **PASO 6: INTEGRACIÓN (Claude Code)**

```
1. Si Director aprueba:
   - git commit con mensaje apropiado
   - git push (si cierre de etapa)
   - Documentar cambios

2. Si hay ajustes:
   - Claude hace ajustes finos
   - Re-testing
   - Vuelta a paso 5
```

---

## 📊 CRITERIOS DE DECISIÓN: ¿Cursor o Claude?

### **Usar CURSOR cuando:**

✅ Refactoring masivo (20+ archivos)  
✅ Cambios repetitivos en muchos archivos  
✅ Migración de patrones  
✅ Generación de boilerplate  
✅ Velocidad es prioridad  

**Ejemplos:**
- "Aplicar NIIF a todos los módulos"
- "Renombrar todas las variables X a Y"
- "Actualizar imports en 50 archivos"
- "Migrar de class components a hooks"

---

### **Usar CLAUDE CODE cuando:**

✅ Análisis de arquitectura  
✅ Decisiones estratégicas  
✅ Documentación  
✅ Git management complejo  
✅ Debugging de lógica  
✅ Cambios quirúrgicos (1-5 archivos)  

**Ejemplos:**
- "¿Cómo estructurar este módulo?"
- "Analizar performance de queries"
- "Documentar motor de precios"
- "Resolver conflicto de merge"
- "Auditoría de seguridad"

---

## 💰 CONTROL DE COSTOS

### **Monitoreo CONSTANTE**

**Cursor:**
```
- Límite: $200/mes
- Tracking: Revisar dashboard Cursor cada tarea
- Alerta: Si supera $50/semana → STOP
```

**Claude Code:**
```
- Modelo: Sonnet 4.5 (más barato)
- Límite: $50/mes
- Tracking: Automático por Anthropic
```

**Total combinado:** MAX $250/mes

---

### **Estrategias de reducción de costos:**

1. **Cursor:**
   - Instrucciones MUY específicas (menos tanteo)
   - Limitar archivos a modificar
   - NO usar para análisis (solo ejecución)

2. **Claude Code:**
   - Usar Grep en lugar de Read completo
   - replace_all en lugar de múltiples edits
   - Indices en lugar de búsquedas exhaustivas

---

## 🌿 ESTRATEGIA DE RAMAS

### **Naming Convention**

```
feat/<nombre-descriptivo>     # Nueva funcionalidad
fix/<nombre-bug>              # Corrección de bug
refactor/<nombre-cambio>      # Refactoring
docs/<tema>                   # Documentación
chore/<tarea>                 # Mantenimiento
```

**Ejemplos:**
- `feat/niif-completo`
- `fix/retail-filters-null`
- `refactor/motor-precios-dos-corazones`
- `docs/workflow-hibrido`

---

### **Ciclo de vida de ramas**

```
1. CREACIÓN (Claude Code)
   └─> git checkout -b feat/nombre

2. TRABAJO (Cursor o Claude según tarea)
   └─> Cambios en archivos

3. VERIFICACIÓN (Claude Code)
   └─> Testing, review

4. APROBACIÓN (Director)
   └─> Dar OK para merge

5. INTEGRACIÓN (Claude Code)
   └─> git checkout main
   └─> git merge feat/nombre
   └─> git push origin main

6. LIMPIEZA (Claude Code)
   └─> git branch -d feat/nombre
   └─> git push origin --delete feat/nombre
```

---

### **Reglas de ramas**

1. **UNA rama por tarea**
   - NO múltiples features en misma rama
   - Scope claro y limitado

2. **Branches de corta vida**
   - Máximo 3-5 días
   - Merge rápido a main

3. **SOLO Claude maneja git**
   - Cursor NO crea ramas
   - Cursor NO hace commit/push
   - Cursor NO hace merge

4. **Naming obligatorio**
   - Siempre tipo/nombre
   - Descriptivo pero conciso

---

## 📋 TEMPLATES DE INSTRUCCIONES

Ver: `1.1.6_template_instrucciones_cursor.md`

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

## 📝 CASOS DE USO REALES

### **Caso 1: Aplicación NIIF completa**

**Situación:** 83 errores NIIF en 39 archivos

**Decisión:** Cursor (masivo, rápido)

**Flujo:**
1. Claude: Grep → reporta 39 archivos
2. Director: "Cursor lo ejecuta"
3. Claude: Crea rama `feat/niif-completo`
4. Claude: Prepara template para Cursor
5. Director → Cursor: Ejecuta con template
6. Cursor: Modifica 39 archivos
7. Claude: Verifica, testing, OK
8. Claude: Merge a main, push, limpieza

**Resultado:** ✅ NIIF completo en 1 hora

---

### **Caso 2: Documentar Motor de Precios**

**Situación:** Explicar DOS CORAZONES

**Decisión:** Claude Code (análisis, documentación)

**Flujo:**
1. Claude: Lee código motor
2. Claude: Analiza flujo
3. Claude: Crea `motor_precios_dos_corazones.md`
4. Director: Revisa y aprueba
5. Claude: Commit + documentación completa

**Resultado:** ✅ Documentación permanente

---

### **Caso 3: Bug crítico en producción**

**Situación:** Retail filters rompen con null

**Decisión:** Claude Code (debugging, fix quirúrgico)

**Flujo:**
1. Claude: Analiza error
2. Claude: Identifica línea exacta
3. Claude: Fix en 1 archivo
4. Claude: Testing
5. Claude: Commit + push urgente

**Resultado:** ✅ Fix en 15 minutos

---

## ⚠️ ANTI-PATRONES

### **❌ NO hacer:**

1. **Cursor autónomo sin control**
   ```
   ❌ "Cursor, arreglá todo el proyecto"
   ✅ "Cursor, aplicá NIIF a estos 39 archivos específicos"
   ```

2. **Claude para refactoring masivo**
   ```
   ❌ Claude modifica 50 archivos incremental
   ✅ Cursor modifica 50 archivos masivo
   ```

3. **Sin verificación post-Cursor**
   ```
   ❌ Cursor termina → push directo
   ✅ Cursor termina → Claude verifica → Director aprueba → push
   ```

4. **Cursor maneja git**
   ```
   ❌ Cursor crea ramas, commit, push
   ✅ SOLO Claude maneja git
   ```

---

## 📊 MÉTRICAS DE ÉXITO

**Trackear mensualmente:**

1. **Costo total:** < $250/mes
2. **Tiempo de desarrollo:** Reducción 30-50%
3. **Errores:** Mantener bajo (< 5% rework)
4. **Satisfacción:** Director aprueba workflow

---

## 🔗 DOCUMENTOS RELACIONADOS

- `1.1.6_template_instrucciones_cursor.md` - Templates para Cursor
- `1.1.7_monitoreo_costos.md` - Control de gastos
- `1.1.8_estrategia_ramas.md` - Git branching strategy
- `feedback_workflow_local_first.md` - Memoria: workflow local

---

**Última actualización:** 2026-06-10  
**Responsable:** Claude Sonnet 4.5  
**Aprobado por:** Héctor Segovia (Director)  
**Estado:** ✅ ACTIVO - Workflow oficial
