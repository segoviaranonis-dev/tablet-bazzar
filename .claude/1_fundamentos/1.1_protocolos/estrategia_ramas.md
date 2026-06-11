# 1.1.8 ESTRATEGIA DE RAMAS GIT

**Tipo:** PROTOCOLO GIT  
**Nivel:** CRÍTICO - Control de versiones  
**Última actualización:** 2026-06-10

---

## 🎯 PRINCIPIO FUNDAMENTAL

**Las ramas son HERRAMIENTAS, no PROBLEMAS.**

Cuando se usan correctamente:
- ✅ Aíslan trabajo en progreso
- ✅ Permiten experimentación segura
- ✅ Facilitan code review
- ✅ Protegen main de código roto

---

## 🌿 NAMING CONVENTION

### **Formato obligatorio:**

```
<tipo>/<nombre-descriptivo-corto>
```

### **Tipos permitidos:**

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat/` | Nueva funcionalidad | `feat/niif-completo` |
| `fix/` | Corrección de bug | `fix/retail-null-filters` |
| `refactor/` | Refactoring sin cambio funcional | `refactor/motor-precios` |
| `docs/` | Solo documentación | `docs/workflow-hibrido` |
| `chore/` | Mantenimiento (deps, config) | `chore/update-deps` |
| `test/` | Agregar/modificar tests | `test/retail-integration` |
| `perf/` | Optimización de performance | `perf/query-stock-retail` |

---

### **Nombres descriptivos:**

✅ **BUENOS:**
```
feat/depositos-bazzar-6-tiendas
fix/rimec-dashboard-chart-overflow
refactor/nomenclatura-p0-pilares
docs/motor-precios-dos-corazones
```

❌ **MALOS:**
```
feat/nuevo          (¿nuevo qué?)
fix/bug             (¿qué bug?)
refactor/codigo     (¿qué código?)
test                (sin tipo, sin descripción)
```

---

## 🔄 CICLO DE VIDA DE UNA RAMA

### **1. CREACIÓN (Claude Code)**

```bash
# Claude Code ejecuta:
git checkout -b feat/niif-completo
git push -u origin feat/niif-completo
```

**Criterios para crear rama:**
- ✅ Tarea > 1 archivo modificado
- ✅ Cambio que necesita review
- ✅ Trabajo que tomará > 1 hora
- ✅ Experimentación que puede fallar

**NO crear rama cuando:**
- ❌ Cambio urgente hotfix (1 archivo, < 15 min)
- ❌ Typo en documentación
- ❌ Ajuste de config trivial

---

### **2. TRABAJO (Cursor o Claude según tarea)**

```bash
# Estado de la rama:
main (protegido) ←→ feat/niif-completo (trabajo)
```

**Reglas durante trabajo:**

1. **Commits frecuentes (Claude Code)**
   ```bash
   git commit -m "feat(retail): aplicar NIIF a RetailStockBoard"
   git commit -m "feat(ventas-fotos): migrar colores a paleta institucional"
   ```

2. **NO push hasta que esté listo**
   - Trabajo 100% local
   - Push SOLO cuando funcione

3. **Sincronizar con main si es rama larga**
   ```bash
   git checkout feat/niif-completo
   git merge main  # Traer cambios de main
   ```

---

### **3. VERIFICACIÓN (Claude Code)**

Antes de integrar a main:

```bash
# Testing completo
npm run build    # ✅ Build exitoso
npm run dev      # ✅ Dev server OK
npm run test     # ✅ Tests pasan (si existen)

# Code review (Claude Code)
git diff main...feat/niif-completo  # Revisar todos los cambios
```

**Checklist de verificación:**
- [ ] Build sin errores
- [ ] Dev server funciona
- [ ] Funcionalidad testeada manualmente
- [ ] No hay console.log olvidados
- [ ] No hay código comentado sin razón
- [ ] Commits tienen mensajes descriptivos

---

### **4. INTEGRACIÓN (Claude Code + aprobación Director)**

```bash
# 1. Asegurar que main esté actualizado
git checkout main
git pull origin main

# 2. Merge de la rama
git merge feat/niif-completo --no-ff

# 3. Resolver conflictos si hay (Claude Code)

# 4. Testing post-merge
npm run build
npm run dev

# 5. Push a producción (SOLO si Director aprueba)
git push origin main
```

**Flags importantes:**
- `--no-ff`: Crea merge commit (historial claro)
- `--squash`: Comprime commits (opcional para ramas con muchos commits temporales)

---

### **5. LIMPIEZA (Claude Code)**

Después de merge exitoso:

```bash
# Borrar rama local
git branch -d feat/niif-completo

# Borrar rama remota
git push origin --delete feat/niif-completo
```

**Excepciones (NO borrar):**
- Ramas de release (`release/v1.2.0`)
- Ramas de hotfix activas
- Ramas de experimentos documentados

---

## 🏗️ ARQUITECTURA DE RAMAS

### **Modelo: GitHub Flow simplificado**

```
main (producción)
  │
  ├─ feat/niif-completo
  │   └─ [trabajo] → merge → DELETE
  │
  ├─ fix/retail-filters
  │   └─ [trabajo] → merge → DELETE
  │
  └─ refactor/nomenclatura-p0
      └─ [trabajo] → merge → DELETE
```

**NO usamos:**
- ❌ Git Flow (develop, release branches) → demasiado complejo
- ❌ Ramas permanentes de features
- ❌ Ramas por persona (feat/hector-algo)

---

## 📏 REGLAS DE RAMAS

### **Regla 1: Main siempre deployable**

```
main = lo que está en producción (o puede estarlo)
```

- ✅ Código funcional
- ✅ Build exitoso
- ✅ Tests pasan
- ❌ NUNCA código roto en main

---

### **Regla 2: Ramas de corta vida**

```
Vida útil de rama: 1-5 días MAX
```

**Por qué:**
- Ramas largas → conflictos difíciles
- Merge temprano → integración continua
- Feedback rápido

**Si rama vive > 5 días:**
- Considerar dividir en tareas más pequeñas
- O mergear parcialmente (feature flags)

---

### **Regla 3: Una rama = una tarea**

```
❌ feat/niif-y-depositos-y-fixes
✅ feat/niif-completo
✅ feat/depositos-bazzar (rama separada)
```

**Por qué:**
- Code review más fácil
- Rollback más simple si algo falla
- Historial más claro

---

### **Regla 4: SOLO Claude Code maneja git**

```
❌ Cursor crea rama
❌ Cursor hace commit
❌ Cursor hace push
❌ Cursor hace merge

✅ Claude Code crea rama
✅ Claude Code hace commit
✅ Claude Code hace push
✅ Claude Code hace merge
```

**Excepción:** Director puede hacer git manual si quiere

---

### **Regla 5: Commit messages descriptivos**

**Formato:**
```
<tipo>(<scope>): <mensaje corto>

<descripción opcional más larga>
```

**Ejemplos:**
```bash
✅ feat(retail): aplicar paleta NIIF a RetailStockBoard
✅ fix(ventas-fotos): corregir query con pilares null
✅ refactor(motor-precios): documentar dos corazones
✅ docs(workflow): agregar estrategia híbrida Cursor+Claude
✅ chore(deps): actualizar Next.js 15.5.18

❌ "cambios"
❌ "fix"
❌ "wip"
❌ "asdf"
```

---

## 🚨 MANEJO DE CONFLICTOS

### **Cuando hay conflicto en merge:**

```bash
# 1. Claude Code detecta conflicto
git merge feat/niif-completo
# Auto-merging src/app/retail/page.tsx
# CONFLICT (content): Merge conflict in src/app/retail/page.tsx

# 2. Claude lee el conflicto
git diff --check

# 3. Claude resuelve (eligiendo cambios correctos)
# Edita archivo con conflicto

# 4. Marca como resuelto
git add src/app/retail/page.tsx

# 5. Completa merge
git commit
```

**Claude Code es responsable de:**
- Identificar QUÉ causó conflicto
- Decidir qué cambios mantener
- Verificar que resultado funcione
- Reportar al Director si hay duda

---

## 📊 MONITOREO DE RAMAS

### **Comando útil: ver todas las ramas**

```bash
# Ramas locales
git branch

# Ramas remotas
git branch -r

# Todas las ramas
git branch -a

# Ramas con último commit
git branch -v
```

---

### **Detectar ramas huérfanas (olvidadas)**

```bash
# Ramas remotas ya mergeadas
git branch -r --merged main

# Ramas locales ya mergeadas
git branch --merged main
```

**Acción:** Borrar ramas mergeadas que ya no se usan

---

### **Ramas de Cursor descontroladas**

Si Cursor creó ramas sin permiso:

```bash
# Listar ramas de Cursor
git branch -r | grep cursor/

# Borrar TODAS las ramas de Cursor no autorizadas
git push origin --delete cursor/agent-memory-report-e0c3
git push origin --delete cursor/fix-report-home-images-style-e0c3
# ... etc
```

---

## 🎯 CASOS DE USO

### **Caso 1: Feature nueva (NIIF completo)**

```bash
# 1. Crear rama (Claude)
git checkout -b feat/niif-completo
git push -u origin feat/niif-completo

# 2. Trabajo (Cursor ejecuta, Claude commits)
# ... 39 archivos modificados
git commit -m "feat(niif): aplicar paleta institucional completa"

# 3. Testing (Claude)
npm run build  # ✅
npm run dev    # ✅

# 4. Push (Claude)
git push origin feat/niif-completo

# 5. Integración (Claude + aprobación Director)
git checkout main
git merge feat/niif-completo --no-ff
git push origin main

# 6. Limpieza (Claude)
git branch -d feat/niif-completo
git push origin --delete feat/niif-completo
```

**Timeline:** 2-3 días de vida de rama

---

### **Caso 2: Hotfix urgente (sin rama)**

```bash
# Bug crítico en producción, fix < 15 min

# 1. Fix directo en main (Claude)
git checkout main
# ... editar archivo
git commit -m "fix(retail): corregir crash con filtro null"
git push origin main

# 2. Deploy inmediato
vercel deploy --prod
```

**No se necesita rama** → demasiado simple y urgente

---

### **Caso 3: Experimento (puede fallar)**

```bash
# 1. Crear rama experimental (Claude)
git checkout -b experiment/virtual-scroll-retail

# 2. Trabajo (intentar virtualización)
# ... código experimental

# 3. Testing
npm run dev  # ❌ Performance peor

# 4. Decisión: DESCARTAR
git checkout main
git branch -D experiment/virtual-scroll-retail  # -D fuerza borrado

# NO se mergea, experimento fallido descartado
```

**Ventaja:** Main nunca se afectó, experimento seguro

---

## 📋 TEMPLATE PARA CREAR RAMA

```bash
# TEMPLATE: Crear rama nueva

# 1. Asegurar main actualizado
git checkout main
git pull origin main

# 2. Crear rama
git checkout -b <tipo>/<nombre-descriptivo>

# Ejemplo:
git checkout -b feat/depositos-bazzar-6-tiendas

# 3. Push inicial (tracking)
git push -u origin <nombre-rama>

# 4. Verificar que se creó
git branch -v

# 5. Notificar a Director
echo "Rama creada: <nombre-rama>"
echo "Trabajo en progreso: <descripción>"
```

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

## 📝 RESUMEN EJECUTIVO

**Ramas SÍ, pero controladas:**

1. ✅ Naming convention estricto: `tipo/nombre-descriptivo`
2. ✅ Vida corta: 1-5 días MAX
3. ✅ Una tarea = una rama
4. ✅ SOLO Claude Code maneja git
5. ✅ Merge con `--no-ff` para historial claro
6. ✅ Borrar ramas después de merge
7. ✅ Main siempre deployable

**Control total:**
- Claude crea, Claude mergea, Claude borra
- Cursor NUNCA toca git
- Director aprueba antes de merge a main

---

**Última actualización:** 2026-06-10  
**Responsable:** Claude Sonnet 4.5  
**Aprobado por:** Héctor Segovia (Director)  
**Estado:** ✅ ACTIVO - Estrategia oficial
