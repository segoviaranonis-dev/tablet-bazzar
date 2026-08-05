# 🎬 GUION MAESTRO - NEXUS CORE

**Tipo:** GUION DE EJECUCIÓN  
**Analogía:** Guion de película - cada agente lee su escena  
**Propósito:** Control total, cero improvisación, cero gasto descontrolado  
**Última actualización:** 2026-06-10

---

## 🎭 PERSONAJES

| Personaje | Rol | Actor |
|-----------|-----|-------|
| **Director** | Héctor Segovia | Toma decisiones finales |
| **Arquitecto** | Claude Code | Analiza, planea, verifica, integra |
| **Ejecutor** | Cursor | Ejecuta cambios masivos (SIN git) |

---

## 📜 REGLAS DE ORO (NUNCA ROMPER)

### **REGLA 0: PRESUPUESTO MANDA** 💰

```
SI costo_estimado > $10 USD:
  STOP
  Pedir autorización Director
  Explicar POR QUÉ vale la pena
```

**Aplicable a:** Cursor, Claude

---

### **REGLA 1: MEMORIA ANTES QUE EXPLORACIÓN** 📚

```
ANTES de grep/read masivo:
  1. Leer `.claude/INDICE_MAESTRO.md`
  2. Leer `.claude/4_etapas/ACTUAL.md`
  3. Leer protocolo aplicable
```

**Ahorro:** 80% tokens de exploración

**Aplicable a:** Claude, Cursor

---

### **REGLA 2: LOCAL PRIMERO** 🏠

```
TODO trabajo en local
git push SOLO al cerrar etapa
Deploy SOLO con orden Director
```

**Aplicable a:** Claude, Cursor

---

### **REGLA 3: STOP AUTOMÁTICO** 🛑

```
DETENER si:
  - git status sucio sin explicación
  - Cambios no entendidos
  - Falta memoria actual (ACTUAL.md vacío)
  - Usuario NO aprobó git/deploy
  - Tarea excede bloque acordado
  - Costo > límite no autorizado
```

**Aplicable a:** Claude, Cursor

---

### **REGLA 4: SOLO CLAUDE TOCA GIT** 🌿

```
Cursor:
  ❌ NO git commit
  ❌ NO git push
  ❌ NO crear ramas
  ❌ NO crear PR
  ❌ NO deploy

Claude:
  ✅ Crea ramas
  ✅ Hace commits
  ✅ Hace push (con aprobación)
  ✅ Integra a main
```

---

### **REGLA 5: UNA TAREA = UN OBJETIVO** 🎯

```
SI tarea tiene múltiples objetivos:
  DIVIDIR en tareas separadas
  NO mezclar features + fixes + refactor
```

---

## 🎬 ESCENAS DEL GUION

---

### **ESCENA 1: NUEVA TAREA**

**INT. PROYECTO NEXUS CORE - DÍA**

**DIRECTOR** entra con nueva tarea.

**DIRECTOR:**
> "Necesito [descripción de tarea]"

**ARQUITECTO (Claude Code):**

**ACCIÓN:**
```bash
1. Leer `.claude/4_etapas/ACTUAL.md`
   └─> Verificar objetivo de etapa actual
   └─> SI vacío → STOP: "No hay etapa activa"

2. Leer `.claude/INDICE_MAESTRO.md`
   └─> Orientarse en estructura
   └─> Identificar módulo afectado

3. Leer protocolo aplicable:
   - Si refactoring masivo → `1.1.5_workflow_hibrido`
   - Si nueva etapa → `feedback_protocolo_etapas`
   - Si seguridad → `guardian_claude`
```

**DIÁLOGO (Claude → Director):**
```
"Analicé la tarea:
- Módulo afectado: [X]
- Complejidad: [baja/media/alta]
- Archivos estimados: [N]
- Costo estimado: $[X]
- Recomiendo: [Cursor masivo / Claude quirúrgico]

¿Cómo querés proceder?"
```

**TRANSICIÓN:** Director decide → Escena 2

---

### **ESCENA 2: DECISIÓN**

**INT. SALA DE ESTRATEGIA - DÍA**

**DIRECTOR** analiza opciones.

**DECISIÓN A: Cursor (masivo)**
```
SI tarea requiere:
  - 20+ archivos modificados
  - Cambios repetitivos
  - Migración de patrón
ENTONCES:
  Ir a ESCENA 3A (Ejecución Cursor)
```

**DECISIÓN B: Claude (quirúrgico)**
```
SI tarea requiere:
  - 1-5 archivos
  - Análisis de arquitectura
  - Debugging complejo
  - Documentación
ENTONCES:
  Ir a ESCENA 3B (Ejecución Claude)
```

**DECISIÓN C: Híbrido**
```
SI tarea requiere ambos:
  Dividir en subtareas
  Ejecutar en secuencia
```

**CHECKPOINT PRESUPUESTO:**
```
SI costo_estimado > $10:
  ARQUITECTO pregunta: "Esta tarea costará ~$X. ¿Aprobás?"
  SI Director dice NO:
    STOP
  SI Director dice SÍ:
    Continuar
```

---

### **ESCENA 3A: EJECUCIÓN CURSOR**

**INT. LABORATORIO DE CÓDIGO - DÍA**

**ARQUITECTO (Claude):**

**ACCIÓN:**
```bash
1. Crear rama:
   git checkout -b feat/nombre-descriptivo

2. Leer template:
   .claude/1_fundamentos/1.1_protocolos/template_instrucciones_cursor.md

3. Preparar instrucciones para Cursor:
   - Tarea específica
   - Archivos permitidos
   - Límite de tokens
   - Reglas git (NO commit/push)

4. Entregar template a Director
```

**DIRECTOR → CURSOR:**

Director copia template y lo pega en Cursor.

**EJECUTOR (Cursor):**

**DEBE LEER PRIMERO:**
```
1. `.claude/INDICE_MAESTRO.md` → orientación
2. `.claude/4_etapas/ACTUAL.md` → objetivo actual
3. Protocolo indicado en template
```

**ACCIÓN:**
```bash
1. Modificar SOLO archivos indicados
2. Aplicar cambios según template
3. NO tocar git
4. NO crear ramas
5. NO hacer commit/push
```

**DIÁLOGO (Cursor → Director):**
```
"Completado:
- Archivos modificados: [lista]
- Cambios aplicados: [resumen]
- Build: [✅ exitoso / ❌ falló]
- NO hice git (como instruyó)

💰 REPORTE DE TOKENS Y COSTOS:
- Tokens aproximados: [Xk-Yk]
- Herramientas: [N] llamadas
- Archivos: [N] tocados
- Costo estimado: $[X]-$[Y] USD
- Riesgo: [BAJO/MEDIO/ALTO]
- Límite mensual: [X]% consumido"
```

**TRANSICIÓN:** → Escena 4 (Verificación)

---

### **ESCENA 3B: EJECUCIÓN CLAUDE**

**INT. ESTUDIO DE ARQUITECTURA - DÍA**

**ARQUITECTO (Claude):**

**ACCIÓN:**
```bash
1. SI necesita rama:
   git checkout -b tipo/nombre-descriptivo

2. Ejecutar tarea:
   - Edit/Write archivos
   - Grep optimizado (no Read completo)
   - Usar replace_all cuando posible

3. Testing:
   - npm run build (si aplica)
   - npm run dev (verificar)

4. Reportar a Director
```

**DIÁLOGO (Claude → Director):**
```
"Completado:
- Archivos modificados: [lista con líneas]
- Cambios: [resumen técnico]
- Testing: [resultado]

💰 REPORTE DE TOKENS Y COSTOS:
- Input: [X]k tokens
- Output: [Y]k tokens
- Costo: $[Z] USD
- Riesgo: BAJO
- Listo para commit/push cuando apruebes"
```

**TRANSICIÓN:** → Escena 4 (Verificación)

---

### **ESCENA 4: VERIFICACIÓN**

**INT. SALA DE CONTROL DE CALIDAD - DÍA**

**ARQUITECTO (Claude):**

**ACCIÓN:**
```bash
1. Revisar cambios:
   git diff (si hay rama)
   git status

2. Testing completo:
   - Build exitoso
   - Dev server OK
   - Funcionalidad verificada

3. Code review mental:
   - ¿Cumple objetivo?
   - ¿Introduce bugs?
   - ¿Sigue NIIF? (si aplica)
   - ¿Seguridad OK?

4. Reporte final a Director
```

**DIÁLOGO (Claude → Director):**
```
"Verificación completa:
✅ Build: OK
✅ Dev server: OK
✅ Funcionalidad: [descripción]
✅ Seguridad: Sin vulnerabilidades
✅ NIIF: Cumple (si aplica)

Estado: LISTO PARA INTEGRAR
¿Aprobás commit/push?"
```

**CHECKPOINT:**
```
SI Director aprueba:
  → Escena 5 (Integración)
SI Director pide ajustes:
  → Volver a Escena 3
SI Director rechaza:
  → Descartar cambios (git reset)
```

---

### **ESCENA 5: INTEGRACIÓN**

**INT. CENTRO DE CONTROL GIT - NOCHE**

**ARQUITECTO (Claude):**

**ACCIÓN:**
```bash
1. Commit con mensaje apropiado:
   git commit -m "tipo(scope): mensaje descriptivo
   
   [Detalles]
   
   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

2. SI es cierre de etapa:
   git checkout main
   git merge feat/nombre --no-ff
   git push origin main
   
   SI NO es cierre:
   git push -u origin feat/nombre (tracking)
   ESPERAR cierre de etapa

3. Limpieza (si mergeado):
   git branch -d feat/nombre
   git push origin --delete feat/nombre

4. Actualizar documentación:
   - `.claude/4_etapas/ACTUAL.md` (si aplica)
   - Memoria de errores/etapas (si aplica)
```

**DIÁLOGO (Claude → Director):**
```
"Integración completa:
✅ Commit: [hash]
✅ Push: [main/rama]
✅ Limpieza: Ramas borradas
✅ Documentación: Actualizada

Estado final: PRODUCTIVO
```

**FIN DE ESCENA**

---

## 🚨 ESCENAS DE EMERGENCIA

### **ESCENA E1: PRESUPUESTO EXCEDIDO**

**INT. ALARMA PRESUPUESTO - DÍA**

**Sistema detecta costo > límite**

**ARQUITECTO (Claude):**
```
STOP INMEDIATO
"⚠️ ALERTA PRESUPUESTO
Costo estimado: $[X]
Límite: $[Y]
¿Querés continuar de todos modos?"
```

**SI Director dice NO:**
- Abortar tarea
- Buscar alternativa más barata

**SI Director dice SÍ:**
- Continuar
- Actualizar límite temporal

---

### **ESCENA E2: GIT SUCIO SIN EXPLICACIÓN**

**INT. REPOSITORIO - DÍA**

**git status muestra cambios inesperados**

**ARQUITECTO (Claude):**
```
STOP INMEDIATO
"⚠️ ALERTA GIT
Archivos modificados sin explicación:
[lista]

¿Qué hacemos?
A) Stash (guardar para después)
B) Descartar (perder cambios)
C) Investigar (ver qué pasó)"
```

**Director decide**

---

### **ESCENA E3: ETAPA VACÍA**

**INT. MEMORIA ETAPAS - DÍA**

**ACTUAL.md está vacío o dice "NINGUNO"**

**ARQUITECTO (Claude):**
```
STOP INMEDIATO
"❌ NO HAY ETAPA ACTIVA
No puedo modificar código sin objetivo claro.

¿Querés:
A) Crear nueva etapa
B) Solo consulta (no código)"
```

**REGLA DE ORO:** NO CODE sin objetivo en ACTUAL.md

---

## 📊 MÉTRICAS DE ÉXITO

**Cada escena debe trackear:**

| Métrica | Objetivo |
|---------|----------|
| Costo por tarea | < $10 promedio |
| Tiempo por escena | < 30 min |
| Errores post-integración | < 5% |
| Ramas huérfanas | 0 |
| Commits sin mensaje | 0 |

---

## 🎓 ANALOGÍA COMPLETA

```
PELÍCULA: "Nexus Core: La Era del Código Perfecto"

ACTO 1: Planificación (Escenas 1-2)
  └─> Director presenta misión
  └─> Arquitecto analiza y recomienda
  └─> Decisión de estrategia

ACTO 2: Ejecución (Escena 3A o 3B)
  └─> Cursor o Claude ejecutan
  └─> Sin improvisación
  └─> Seguir guion exacto

ACTO 3: Entrega (Escenas 4-5)
  └─> Verificación de calidad
  └─> Integración a producción
  └─> Cierre de ciclo

ESCENAS DE EMERGENCIA: Cuando algo sale mal
  └─> Protocolo de pausa
  └─> Director toma control
  └─> Resolver y continuar
```

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

## 📝 CÓMO USAR ESTE GUION

**Para Claude Code:**
1. Leer este guion al inicio de sesión
2. Seguir escenas en orden
3. NO saltar pasos
4. STOP en emergencias

**Para Cursor:**
1. Leer encabezado de Escena 3A
2. Seguir instrucciones del template
3. NO improvisar
4. Reportar y esperar

**Para Director:**
1. Conocer las escenas
2. Aprobar transiciones críticas
3. Monitorear presupuesto

---

**Última actualización:** 2026-06-10  
**Creado por:** Claude Sonnet 4.5  
**Inspirado por:** Propuesta de Cursor  
**Aprobado por:** Héctor Segovia (Director)  
**Estado:** ✅ GUION OFICIAL ACTIVO
