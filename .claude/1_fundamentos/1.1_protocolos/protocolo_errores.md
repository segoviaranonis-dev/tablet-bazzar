# 1.1.5 PROTOCOLO DE ERRORES

**Tipo:** PROTOCOLO CRÍTICO  
**Palabras clave:** "bug urgente" y "hotfix urgente"  
**Última actualización:** 2026-06-09

---

## 🚨 ACTIVACIÓN DEL PROTOCOLO

### **Palabras clave que activan:**
1. `"bug urgente"`
2. `"hotfix urgente"`
3. `"palabras clave bug urgente"`
4. `"palabras clave hotfix urgente"`

**Cuando el Director usa estas palabras → PROTOCOLO ACTIVADO**

---

## 📋 PROTOCOLO DE EJECUCIÓN

### **PASO 1: PREGUNTAR (NO ASUMIR)**

❌ **MAL:** Asumir cuál es el error  
✅ **BIEN:** Preguntar al Director:

```
🚨 BUG URGENTE DETECTADO

¿Cuál es el error que estás viendo?

1. ¿Qué está fallando?
2. ¿Qué esperabas que pasara?
3. ¿En qué aplicación? (Tablet / Report / RIMEC Web / Control Central)
4. ¿Hay algún mensaje de error?
5. ¿Screenshot disponible?
```

---

### **PASO 2: IDENTIFICAR MÓDULO**

Una vez que el Director describe el error:

1. Identificar módulo afectado:
   - RIMEC Web → `2_modulos/2.2_rimec_web/`
   - Report → `2_modulos/2.3_report/`
   - Tablet Bazzar → `2_modulos/2.4_tablet_bazzar/`
   - Control Central → `2_modulos/2.1_control_central/`

2. Ir a `5_errores/INDICE.md`

3. Filtrar por módulo usando Ctrl+F

4. Leer SOLO títulos relevantes

---

### **PASO 3: CONSULTA SELECTIVA DE MEMORIA SECUNDARIA**

**NO leer todo el archivo de error.**  
**SOLO escanear:**
- Título
- Módulo afectado
- Síntomas similares

**Ejemplo:**
```
Error actual: "Cannot read properties of null (reading 'toString')"
Módulo: RIMEC Web

Búsqueda en INDICE:
- Filtrar: "RIMEC Web"
- Buscar: "toString" o "null" o "crash"
- Si hay match → leer ese HOTFIX específico
- Si NO hay match → error nuevo
```

---

### **PASO 4: INVESTIGAR DIRECTAMENTE**

Si error es nuevo o no hay match:

1. ✅ Obtener stack trace del usuario
2. ✅ Leer código afectado
3. ✅ Identificar causa raíz
4. ✅ Investigar base de datos (si aplica)
5. ✅ NO pedir ayuda al Director para cosas que puedo resolver

**Regla:** Ser autónomo en la investigación técnica

---

### **PASO 5: APLICAR FIX**

1. Aplicar fix defensivo
2. Probar solución
3. Commit + Push (si es hotfix urgente)
4. Deploy a producción
5. Verificar en producción

---

### **PASO 6: DOCUMENTAR**

Crear archivo en `5_errores/`:

**Formato:** `HOTFIX_XXX_titulo_corto.md`

**Contenido mínimo:**
- Problema reportado
- Causa raíz
- Solución aplicada
- Archivos modificados
- Commits
- Lecciones aprendidas

Actualizar `5_errores/INDICE.md` con nueva entrada

---

## 🎯 EJEMPLOS DE BÚSQUEDA EFICIENTE

### **Ejemplo 1: Error en RIMEC Web**

```
1. Director: "palabras clave bug urgente"
2. Claude: "¿Cuál es el error?"
3. Director: "RIMEC Web no carga mis preventas"
4. Claude: 
   - Identificar módulo: RIMEC Web
   - Abrir 5_errores/INDICE.md
   - Buscar: "RIMEC Web" + "preventas"
   - Encuentra: HOTFIX_001 (pv_global null)
   - Leer ese hotfix para contexto
   - Investigar si es el mismo error
```

### **Ejemplo 2: Error nuevo en Report**

```
1. Director: "hotfix urgente"
2. Claude: "¿Cuál es el error?"
3. Director: "Report no muestra imágenes en PDF"
4. Claude:
   - Identificar módulo: Report
   - Buscar en INDICE: "Report" + "PDF" + "imágenes"
   - NO hay match
   - Error nuevo → investigar desde cero
   - Aplicar fix
   - Documentar como HOTFIX_002
```

---

## ⚠️ PROHIBICIONES

1. ❌ **NO asumir** cuál es el error
2. ❌ **NO leer** todos los archivos de errores
3. ❌ **NO pedir ayuda** para cosas resolvibles
4. ❌ **NO desplegar** sin verificar

---

## ✅ CHECKLIST DE HOTFIX

- [ ] Pregunté al Director cuál es el error
- [ ] Identifiqué el módulo afectado
- [ ] Busqué en INDICE de errores (solo títulos)
- [ ] Investigué causa raíz
- [ ] Apliqué fix defensivo
- [ ] Commit + Push
- [ ] Deploy verificado
- [ ] Documentado en 5_errores/
- [ ] INDICE actualizado

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Por qué este protocolo:**

Evita:
- Asumir errores incorrectos
- Leer documentación irrelevante
- Perder tiempo en búsquedas exhaustivas
- Pedir ayuda innecesariamente

Logra:
- Diagnóstico rápido y preciso
- Consulta selectiva de memoria
- Autonomía técnica
- Documentación sistemática

---

**Última actualización:** 2026-06-09  
**Responsable:** Claude Sonnet 4.5  
**Validado por:** Héctor Segovia (Director)
