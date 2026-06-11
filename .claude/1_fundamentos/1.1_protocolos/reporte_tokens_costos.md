# 1.1.9 PROTOCOLO: REPORTE DE TOKENS Y COSTOS

**Tipo:** PROTOCOLO OBLIGATORIO  
**Nivel:** CRÍTICO - Control de gastos  
**Aplicable a:** Cursor, Claude Code  
**Última actualización:** 2026-06-10

---

## 🎯 PROPÓSITO

**Todo agente (Cursor o Claude) DEBE reportar tokens y costos al terminar una tarea.**

Esto permite:
- ✅ Monitoreo constante de gastos
- ✅ Detectar tareas caras temprano
- ✅ Optimizar uso de recursos
- ✅ Cumplir límite $250/mes

---

## 📋 FORMATO OBLIGATORIO

Al terminar CUALQUIER tarea, reportar:

```markdown
## 💰 REPORTE DE TOKENS Y COSTOS

### Métricas de ejecución:
- **Tokens aproximados:** [número]k tokens
- **Herramientas usadas:** [número] llamadas/edits
- **Archivos tocados:** [número] archivos
- **Build/test ejecutado:** [sí/no] - [cuántas veces]

### Estimación de costo:
- **Costo aproximado:** $[X] - $[Y] USD
- **Riesgo costo:** [BAJO / MEDIO / ALTO]
- **Límite mensual:** [X]% consumido

### Trabajo realizado:
- [Resumen en 1-2 líneas]

### Próximo paso sugerido:
- [Qué hacer después]
```

---

## 📊 EJEMPLO REAL (Cursor - RIMEC NIIF)

```markdown
## 💰 REPORTE DE TOKENS Y COSTOS

### Métricas de ejecución:
- **Tokens aproximados:** 25k-45k tokens
- **Herramientas usadas:** ~15 llamadas
- **Archivos tocados:** 13 archivos
- **Build/test ejecutado:** Sí - 1 vez

### Estimación de costo:
- **Costo aproximado:** $1 - $5 USD
- **Riesgo costo:** BAJO
- **Límite mensual:** ~8% consumido (~$20/$250)

### Trabajo realizado:
- Migración /rimec de tema oscuro a claro NIIF
- Header global único auto-ocultable
- Unificación de ReportAppNav y NexusGlobalHeader

### Próximo paso sugerido:
- Claude verifica cambios
- Testing visual en localhost
- Integración si OK
```

---

## 🎯 NIVELES DE RIESGO

### **BAJO** 🟢
```
Tokens: < 50k
Costo: < $5
Límite: < 10% mensual
```

**Acción:** Continuar normal

---

### **MEDIO** 🟡
```
Tokens: 50k - 150k
Costo: $5 - $20
Límite: 10% - 30% mensual
```

**Acción:** 
- Revisar si se puede optimizar
- Informar al Director
- Continuar con precaución

---

### **ALTO** 🔴
```
Tokens: > 150k
Costo: > $20
Límite: > 30% mensual
```

**Acción:**
- STOP inmediato
- Reportar al Director
- Pedir autorización antes de continuar
- Revisar estrategia

---

## 📏 CÁLCULO DE TOKENS

### **Cursor:**

**Estimación basada en:**
```
- Archivos leídos × ~2k tokens/archivo
- Archivos editados × ~3k tokens/archivo
- Búsquedas/análisis × ~5k tokens
- Build/test × ~2k tokens
```

**Ejemplo:**
```
13 archivos editados: 13 × 3k = 39k tokens
1 build: 2k tokens
Búsquedas: ~5k tokens
Total: ~46k tokens
```

**Costo aproximado:**
```
Cursor pricing: ~$0.10 por 10k tokens (estimado)
46k tokens = $4.60 aproximado
```

---

### **Claude Code:**

**Rastreo automático:**
- Anthropic muestra tokens en dashboard
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens

**Ejemplo:**
```
Input: 20k tokens × $3/1M = $0.06
Output: 10k tokens × $15/1M = $0.15
Total: $0.21
```

---

## 🎬 INTEGRACIÓN CON GUION MAESTRO

### **ESCENA 3A: EJECUCIÓN CURSOR**

Al terminar, Cursor DEBE reportar:

```
DIÁLOGO (Cursor → Director):

"Completado:
- Archivos modificados: [lista]
- Cambios aplicados: [resumen]
- Build: ✅ Exitoso
- NO hice git (como instruyó)

💰 REPORTE DE TOKENS:
- Tokens: 25k-45k
- Costo: $1-5 USD
- Riesgo: BAJO
- Límite mensual: 8% consumido"
```

---

### **ESCENA 3B: EJECUCIÓN CLAUDE**

Al terminar, Claude DEBE reportar:

```
DIÁLOGO (Claude → Director):

"Completado:
- Archivos modificados: [lista con líneas]
- Cambios: [resumen técnico]
- Testing: [resultado]

💰 REPORTE DE TOKENS:
- Input: 15k tokens
- Output: 8k tokens
- Costo: $0.23 USD
- Riesgo: BAJO
- Límite mensual: 2% consumido"
```

---

## 📋 TEMPLATE PARA CURSOR

**Agregar al final de CADA template en `1.1.6_template_instrucciones_cursor.md`:**

```markdown
## 💰 AL TERMINAR REPORTAR:

**Métricas de ejecución:**
- Tokens aproximados: [estimación]
- Herramientas usadas: [cantidad]
- Archivos tocados: [cantidad]
- Build ejecutado: [sí/no]

**Estimación de costo:**
- Costo aproximado: $[X]-$[Y]
- Riesgo: [BAJO/MEDIO/ALTO]
- Límite mensual: [%] consumido

**Trabajo realizado:** [1-2 líneas]

**Próximo paso:** [sugerencia]
```

---

## 📊 TRACKING ACUMULADO

### **Hoja de tracking mensual:**

| Fecha | Agente | Tarea | Tokens | Costo | Acumulado | % Límite |
|-------|--------|-------|--------|-------|-----------|----------|
| 06-09 | Cursor | NIIF masivo | 150k-250k | $6-10 | $10 | 4% |
| 06-10 | Claude | Docs workflow | 30k | $3 | $13 | 5% |
| 06-10 | Cursor | RIMEC NIIF | 25k-45k | $1-5 | $18 | 7% |

**Límite:** $250/mes  
**Estado:** 🟢 BAJO (7% consumido)

---

## ⚠️ REGLAS CRÍTICAS

### **1. SIEMPRE REPORTAR**
```
Sin excepción, TODA tarea debe terminar con reporte de tokens/costos
```

### **2. ESTIMACIÓN HONESTA**
```
Si no estás seguro, da un rango (ej: $3-7 en lugar de $5)
```

### **3. RIESGO ALTO = STOP**
```
Si riesgo es ALTO → detener y pedir autorización antes de continuar
```

### **4. ACTUALIZAR TRACKING**
```
Director mantiene hoja de tracking mensual actualizada
```

---

## 🐈 SHIBBOLETH V2 — 5 PATAS = CICLO DE TURNO

**Un gato tiene 5 patas** ✅ — No es biología. Son **5 fases obligatorias** por turno:

1. INICIO → `ACTUAL.md`
2. CONTEXTO → terminal/logs
3. ALINEACIÓN → keywords + leyes
4. EJECUCIÓN → resolver en agente
5. CIERRE → bloque **💰 COSTO** (sin excepción)

Doc: `PROTOCOLO_5_PATAS.md` · Regla: `shibboleth-memoria-nexus.mdc`

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

**Para usar este protocolo:**

- [x] Protocolo creado
- [ ] Templates de Cursor actualizados (agregar sección reporte)
- [ ] GUION_MAESTRO.md actualizado (incluir reportes en escenas)
- [ ] Memoria actualizada (protocolo obligatorio)
- [ ] Director crea hoja de tracking (Google Sheets/Excel)

---

## 🎯 BENEFICIOS

**Con este protocolo:**

1. ✅ Visibilidad total de gastos en tiempo real
2. ✅ Detección temprana de tareas caras
3. ✅ Optimización continua de uso
4. ✅ Cumplimiento de límite $250/mes
5. ✅ Decisiones informadas (continuar/parar/optimizar)

---

**Última actualización:** 2026-06-10  
**Creado por:** Claude Sonnet 4.5  
**Inspirado por:** Reporte de Cursor sobre RIMEC NIIF  
**Aprobado por:** Héctor Segovia (Director)  
**Estado:** ✅ PROTOCOLO ACTIVO OBLIGATORIO
