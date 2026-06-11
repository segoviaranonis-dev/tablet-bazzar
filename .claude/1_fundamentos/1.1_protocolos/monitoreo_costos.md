# 1.1.7 MONITOREO Y CONTROL DE COSTOS

**Tipo:** PROTOCOLO FINANCIERO  
**Nivel:** CRÍTICO - Control de gastos IA  
**Última actualización:** 2026-06-10

---

## 💰 LÍMITES MENSUALES

| Herramienta | Límite/mes | Alertas | Hard Stop |
|-------------|------------|---------|-----------|
| **Cursor** | $200 USD | $50, $100, $150 | $200 |
| **Claude Code** | $50 USD | $25, $40 | $50 |
| **TOTAL** | **$250 USD** | **$125, $200** | **$250** |

---

## 📊 CURSOR: MONITOREO DE TOKENS

### **Dashboard de Cursor**

**Ubicación:** Settings → Usage → Current Month

**Qué revisar:**

1. **Requests totales:**
   - Límite: 500 requests/mes (Fast model)
   - Alerta: >250 requests (50%)

2. **Tokens consumidos:**
   - Límite: ~5M tokens/mes (estimado $200)
   - Alerta: >2.5M tokens (50%)

3. **Costo acumulado:**
   - Monitorear DIARIO
   - Si > $50/semana → REDUCIR uso

---

### **Estimaciones por tarea**

| Tipo de tarea | Tokens estimados | Costo aprox | Tiempo |
|---------------|------------------|-------------|--------|
| Refactoring 10 archivos | 50K-100K | $2-4 | 10-15 min |
| Refactoring 39 archivos (NIIF) | 150K-250K | $6-10 | 20-30 min |
| Generación componente | 10K-30K | $0.50-$1.50 | 5-10 min |
| Migración patrón (8 archivos) | 80K-120K | $3-5 | 15-20 min |
| Debugging específico | 20K-40K | $1-2 | 5-15 min |

---

### **Cómo reducir costos en Cursor**

1. **Instrucciones específicas (NO genéricas)**
   ```
   ❌ "Mejorá el proyecto" → 500K tokens (tanteo)
   ✅ "Cambia stone-* por slate-* en estos 10 archivos" → 50K tokens
   ```

2. **Limitar archivos explícitamente**
   ```
   ❌ "Refactoriza todo src/" → lee TODO el directorio
   ✅ "Refactoriza SOLO src/app/retail/*.tsx" → lee solo retail
   ```

3. **NO usar para análisis (usar Claude)**
   ```
   ❌ Cursor: "Analiza arquitectura y dame reporte" → caro
   ✅ Claude: grep + análisis → más barato
   ```

4. **Deshabilitar auto-completions en archivos grandes**
   ```
   Settings → Auto-complete → Disable in files > 1000 lines
   ```

5. **Usar modelo "Normal" en lugar de "Fast"** cuando no hay urgencia
   ```
   Normal: 3x más barato que Fast
   Fast: Solo para tareas urgentes
   ```

---

## 📊 CLAUDE CODE: MONITOREO DE TOKENS

### **Dashboard Anthropic**

**Ubicación:** console.anthropic.com → Usage

**Qué revisar:**

1. **Tokens de entrada/salida:**
   - Modelo: Sonnet 4.5
   - Input: $3 / 1M tokens
   - Output: $15 / 1M tokens

2. **Costo acumulado mensual:**
   - Ver en dashboard
   - Alertas automáticas de Anthropic

---

### **Estimaciones por tarea**

| Tipo de tarea | Tokens in/out | Costo aprox | Tiempo |
|---------------|---------------|-------------|--------|
| Grep + análisis | 5K/2K | $0.05 | 1-2 min |
| Edit 1 archivo | 2K/1K | $0.02 | 30 seg |
| Edit 5 archivos | 10K/5K | $0.10 | 2-3 min |
| Documentación MD | 5K/10K | $0.20 | 5-10 min |
| Debugging complejo | 20K/10K | $0.30 | 10-15 min |
| Merge conflict | 15K/8K | $0.25 | 5-10 min |

---

### **Cómo reducir costos en Claude Code**

1. **Usar Grep en lugar de Read completo**
   ```
   ❌ Read archivo 5000 líneas → 15K tokens
   ✅ Grep patrón específico → 500 tokens
   ```

2. **replace_all en lugar de múltiples edits**
   ```
   ❌ Edit 50 veces (1 por cambio) → 100K tokens
   ✅ Edit con replace_all → 10K tokens
   ```

3. **Usar índices en lugar de búsquedas exhaustivas**
   ```
   ❌ "Busca todos los usos de X" → lee todo
   ✅ "Lee INDICE.md" → 2K tokens
   ```

4. **No re-leer archivos ya leídos**
   ```
   ❌ Read mismo archivo 5 veces → 75K tokens
   ✅ Read 1 vez, trabajar en memoria → 15K tokens
   ```

---

## 🚨 SISTEMA DE ALERTAS

### **NIVEL 1: PRECAUCIÓN (50% límite)**

**Cursor: $100/mes o 2.5M tokens**

**Acción:**
- Revisar qué tareas consumieron más
- Evaluar si se puede usar Claude para próximas tareas
- Notificar al Director

---

### **NIVEL 2: ADVERTENCIA (75% límite)**

**Cursor: $150/mes o 3.75M tokens**

**Acción:**
- STOP uso de Cursor para tareas no críticas
- Solo usar para emergencias o tareas donde es 10x mejor que Claude
- Priorizar Claude Code para resto del mes

---

### **NIVEL 3: CRÍTICO (90% límite)**

**Cursor: $180/mes o 4.5M tokens**

**Acción:**
- CONGELAR uso de Cursor hasta próximo mes
- SOLO Claude Code para el resto del mes
- Notificar urgente al Director

---

### **NIVEL 4: HARD STOP (100% límite)**

**Cursor: $200/mes**

**Acción:**
- NO usar Cursor hasta próximo mes (automático)
- TODO con Claude Code
- Si Claude también llega a límite → trabajo manual

---

## 📊 TRACKING SEMANAL

### **Hoja de tracking (Google Sheets o Excel)**

| Semana | Cursor $ | Claude $ | Total $ | % Límite | Tareas completadas |
|--------|----------|----------|---------|----------|--------------------|
| 1 | $45 | $8 | $53 | 21% | NIIF refactor (Cursor) |
| 2 | $30 | $12 | $42 | 17% | Docs motor precios (Claude) |
| 3 | $50 | $10 | $60 | 24% | Depositos BAZZAR (Cursor) |
| 4 | $25 | $8 | $33 | 13% | Bugfixes (Claude) |
| **Total** | **$150** | **$38** | **$188** | **75%** | |

**Alertas:**
- Semana >$75 → ADVERTENCIA
- Mes >$188 (75%) → REDUCIR uso

---

## 📈 OPTIMIZACIÓN DE COSTOS

### **Estrategia 1: División inteligente de tareas**

```
Tarea grande: "Refactorizar 100 archivos"

❌ TODO en Cursor: $50
✅ Híbrido:
   - Claude: Grep + identificar archivos problemáticos ($1)
   - Cursor: Refactorizar solo 30 archivos críticos ($15)
   - Claude: Ajustes finos en 5 archivos ($2)
   Total: $18 (ahorro $32)
```

---

### **Estrategia 2: Batch de tareas**

```
❌ 5 sesiones Cursor separadas: $25 (overhead)
✅ 1 sesión Cursor con 5 tareas batched: $15 (ahorro $10)
```

**Ejemplo:**
```markdown
CURSOR: BATCH DE 3 TAREAS

1. Aplicar NIIF a retail (10 archivos)
2. Renombrar variables en ventas-fotos (5 archivos)
3. Generar componentes depositos (6 archivos)

Total estimado: 120K tokens ($5)
```

---

### **Estrategia 3: Cache de contexto**

**Cursor:**
- Mantener sesión abierta → re-usa context
- Cerrar sesión → pierde context (más tokens próxima vez)

**Claude Code:**
- Usar memoria de proyecto (INDICE.md) → menos re-lectura
- Documentar bien → menos análisis repetido

---

## 🔍 AUDITORÍA MENSUAL

### **Al final de cada mes, revisar:**

1. **Costo total real**
   - ¿Cumplimos límite $250?
   - Si NO: ¿Por qué? ¿Qué tarea consumió más?

2. **Distribución Cursor vs Claude**
   - ¿Usamos cada uno para lo correcto?
   - ¿Hubo tareas que debieron ir a la otra herramienta?

3. **ROI (Return on Investment)**
   - Tiempo ahorrado vs costo
   - ¿Vale la pena $250/mes?

4. **Ajustes para próximo mes**
   - ¿Subir/bajar límites?
   - ¿Cambiar estrategia?

---

## 📋 CHECKLIST PRE-TAREA

Antes de ejecutar tarea con Cursor o Claude, preguntar:

- [ ] ¿Cuántos tokens estimados? (usar tabla estimaciones)
- [ ] ¿Estamos cerca del límite mensual?
- [ ] ¿Esta tarea REQUIERE la herramienta elegida o puede usar la otra?
- [ ] ¿Podemos batched con otras tareas pendientes?
- [ ] ¿Las instrucciones son específicas para minimizar tanteo?

---

## 🎯 OBJETIVO

**Gastar inteligentemente, no más de lo necesario.**

- $250/mes es el MÁXIMO, no el objetivo
- Si mes termina en $150 → EXCELENTE
- Calidad > velocidad si afecta mucho el costo

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-10  
**Responsable:** Claude Sonnet 4.5  
**Aprobado por:** Héctor Segovia (Director)  
**Estado:** ✅ ACTIVO - Monitoreo obligatorio
