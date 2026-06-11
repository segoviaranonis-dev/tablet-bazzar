# Sistema de Etapas - Protocolo de Trabajo

**Tipo:** PRIMARIO (Consulta obligatoria antes de cualquier cambio de código)

---

## 📁 ESTRUCTURA

```
etapas/
├── ACTUAL.md           ← ETAPA EN CURSO (vacío = NO CODE)
├── README.md           ← Este archivo (explicación del sistema)
└── realizadas/         ← Etapas completadas (archivo histórico)
    ├── 2026-06-09_hotfix_pv_global.md
    ├── 2026-06-08_migracion_fi_pv.md
    └── ...
```

---

## 🔒 PROTOCOLO

### **ANTES DE CAMBIAR CÓDIGO:**

1. ✅ Leer `ACTUAL.md`
2. ✅ Verificar que hay objetivo definido
3. ✅ Confirmar que el cambio está alineado con el objetivo

### **SI `ACTUAL.md` ESTÁ VACÍO:**

❌ **NO SE PUEDE CAMBIAR CÓDIGO**  
✅ Preguntar al Director por nueva etapa

---

## 🔄 FLUJO DE ETAPAS

### **1. Nueva Etapa (Inicio)**

Palabras clave: `"Nueva Etapa"`

**Acciones:**
1. Director define objetivo
2. Claude escribe objetivo en `ACTUAL.md`
3. Claude crea lista de tareas con `TodoWrite`
4. Trabajo inicia (SOLO LOCAL)

### **2. Trabajo en Progreso**

**Acciones:**
1. Cambios solo en local
2. Actualizar tareas en `TodoWrite`
3. Mantener `ACTUAL.md` actualizado con progreso

### **3. Cerrar Etapa (Fin)**

Palabras clave: `"Cerrar Etapa"`

**Acciones:**
1. Documentar trabajo en `.claude/modulos/` (si aplica)
2. Mover `ACTUAL.md` → `realizadas/FECHA_titulo.md`
3. Limpiar `ACTUAL.md` (dejar en estado "NINGUNO")
4. Git: add + commit + push
5. Verificar deploy en Vercel

---

## 📝 FORMATO DE `ACTUAL.md`

```markdown
# ETAPA ACTUAL

## 🎯 OBJETIVO
[Descripción clara del objetivo]

## 📋 TAREAS EN PROGRESO
- [ ] Tarea 1
- [x] Tarea 2 completada
- [ ] Tarea 3

## ✅ COMPLETADAS
(Lista de tareas terminadas)

## 📝 NOTAS
(Decisiones, blockers, etc.)
```

---

## 🗂️ FORMATO DE ARCHIVO REALIZADO

**Nombre:** `YYYY-MM-DD_titulo_corto.md`

**Ejemplo:** `2026-06-09_hotfix_pv_global.md`

**Contenido:**
- Objetivo cumplido
- Cambios realizados
- Archivos modificados
- Commits
- Deploy

---

**Shibboleth V2:** Un gato tiene 5 patas ✅
