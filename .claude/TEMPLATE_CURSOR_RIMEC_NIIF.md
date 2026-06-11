# INSTRUCCIONES PARA CURSOR — RIMEC SALES REPORT NIIF

## CONTEXTO
El módulo RIMEC Sales Report (`/rimec`) actualmente usa tema OSCURO (fondo negro, texto blanco) que está FUERA de los estándares NIIF institucionales.

Necesita migración completa a tema CLARO NIIF:
- Fondo celeste claro #f1f5f9
- Texto oscuro legible
- Cards blancas con sombra
- Azul institucional RIMEC #002B4E

---

## TAREA ESPECÍFICA

Migrar completamente `/rimec` de tema OSCURO a tema CLARO NIIF:

1. **Layout principal** (ImmersiveClient.tsx)
   - Fondo oscuro → celeste NIIF
   - Header oscuro → blanco con sombra
   - Sidebar oscuro → blanco
   - Navegación tabs oscura → clara

2. **Dashboard** (MundoDashboard.tsx)
   - KPI cards oscuras → blancas
   - Gráficos con fondo oscuro → fondo claro
   - Texto blanco → texto oscuro

3. **Componentes RIMEC** (Mundos, Tablas, Filtros)
   - Todos los fondos oscuros → claros
   - Todo el texto blanco → oscuro
   - Borders blancos → slate grises

---

## REGLAS ESTRICTAS (NO NEGOCIABLES)

### Git:
- [ ] Trabajar en rama actual: **main**
- [ ] NO crear nuevas ramas
- [ ] **GUARDAR los cambios en archivos** (muy importante)
- [ ] NO hacer git commit
- [ ] NO hacer git push
- [ ] NO crear PR

### Archivos:
- [ ] Modificar SOLO: `src/app/rimec/**/*.tsx`
- [ ] NO tocar: otros módulos fuera de /rimec
- [ ] **GUARDAR todos los archivos editados**

### Costo:
- [ ] Límite de sesión: 100k tokens estimados
- [ ] Si excede 50K tokens → PARAR y reportar

### Build/Deploy:
- [ ] SÍ hacer `npm run build` al terminar (para verificar)
- [ ] NO hacer deploy
- [ ] NO instalar dependencias nuevas

---

## CAMBIOS ESPECÍFICOS

### **Reemplazos masivos OBLIGATORIOS:**

### Fondos:
**Reemplazar:**
- `bg-slate-950`, `bg-black`, `to-black`, `from-slate-*`, `via-slate-*`

**Por:**
- `bg-app-bg`, `bg-white`, `bg-rimec-azul/5` o equivalentes claros

**Regla:** NO debe quedar fondo general oscuro en `/rimec`

---

### Texto:
**Reemplazar:**
- `text-white`, `text-white/*`, `text-slate-*`

**Por:**
- `text-neutral-ink`, `text-neutral-ink-muted`, `text-rimec-azul`

**Excepción:** Mantener `text-rimec-text-white` SOLO sobre fondos `bg-rimec-azul`

---

### Bordes:
**Reemplazar:**
- `border-white/*`

**Por:**
- `border-rimec-azul/10`, `border-rimec-azul/15`, `border-neutral-300`

---

### Cards:
**Reemplazar:**
- `bg-white/5`, `bg-black/*`

**Por:**
- `bg-white`, `bg-app-bg`, `shadow-sm`, `border-rimec-azul/15`

---

### Header:
**Usar cabecera global auto-ocultable:**
- El header debe aparecer al mover mouse arriba
- Se oculta cuando no se usa
- NO crear headers distintos por módulo
- Reutilizar componente existente

---

### Interacciones:
**Reemplazar:**
- `hover:bg-white/10`, `hover:bg-white/20`

**Por:**
- `hover:bg-blue-50/40`, `hover:bg-slate-100`

---

### Sombras y efectos:
**Reemplazar:**
- `shadow-[0_0_10px_rgba(255,255,255,0.3)]`
- `drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]`

**Por:**
- `shadow-md`, `shadow-sm`
- `drop-shadow-sm`

---

## ARCHIVOS PRIORITARIOS

### 1. **ImmersiveClient.tsx** (CRÍTICO)
**Ubicación:** `src/app/rimec/ImmersiveClient.tsx`

**Línea 142:** Cambiar fondo principal:
```tsx
// ANTES:
bg-slate-950 ... from-slate-900 via-slate-950 to-black

// DESPUÉS:
bg-app-bg (o bg-[#f1f5f9])
```

**Línea 143:** Cambiar header:
```tsx
// ANTES:
border-b border-white/10 bg-black/40

// DESPUÉS:
border-b border-slate-200 bg-white shadow-md
```

**Sidebar:** Cambiar panel lateral:
```tsx
// ANTES:
bg-white/5 border-white/10

// DESPUÉS:
bg-white border-slate-200 shadow-lg
```

---

### 2. **MundoDashboard.tsx** (CRÍTICO)
**Ubicación:** `src/app/rimec/components/MundoDashboard.tsx`

**KPI Cards:**
```tsx
// ANTES:
bg-white/5 border-white/10

// DESPUÉS:
bg-white border-2 border-slate-200 shadow-md
```

**Gráficos Recharts:**
```tsx
// ANTES:
CartesianGrid stroke="rgba(255,255,255,0.05)"
tick={{ fill: "rgba(255,255,255,0.5)" }}

// DESPUÉS:
CartesianGrid stroke="#e2e8f0"
tick={{ fill: "#475569" }}
```

---

### 3. **Otros componentes** (si tienen tema oscuro)
- `ImmersiveFiltersPanel.tsx`
- `MundoClientes.tsx`
- `MundoMarcas.tsx`
- `MundoVendedores.tsx`
- `TablaJerarquica.tsx`
- Otros archivos `.tsx` en `src/app/rimec/components/`

---

## COLORES NIIF OBLIGATORIOS

**Usar SOLO estos colores:**

### Azul RIMEC (principal):
```
#002B4E  → rimec-azul
#001829  → rimec-azul-dark
#003d6b  → rimec-azul-light
```

### Naranja BAZZAR (acento):
```
#ea580c  → bazzar-naranja
#c2410c  → bazzar-naranja-dark
```

### Fondos:
```
#f1f5f9  → app-bg (celeste claro)
#e2e8f0  → app-bg-alt
#ffffff  → card-bg (blanco puro)
```

### Neutros:
```
#1e293b  → neutral-ink (texto principal)
#64748b  → neutral-muted (texto secundario)
#cbd5e1  → slate-300 (borders)
#e2e8f0  → slate-200 (borders suaves)
```

---

## VERIFICACIÓN OBLIGATORIA

**Al terminar, ejecutar y pegar resultado:**

```bash
git status --short
git diff --stat
git diff -- src/app/rimec/ImmersiveClient.tsx
npm run build
```

### Criterios de aceptación:

✅ **git status --short** muestra archivos modificados  
✅ **git diff --stat** NO está vacío  
✅ **/rimec NO contiene:**
- `bg-slate-950`
- `to-black`
- `bg-black`
- `border-white`
- `text-white` (salvo casos justificados sobre `bg-rimec-azul`)

✅ **Build exitoso**

---

## AL TERMINAR REPORTAR:

### 📋 Trabajo realizado:
1. Lista COMPLETA de archivos modificados
2. Resumen de cambios por archivo
3. Errores encontrados (si hubo)
4. **Resultado comandos verificación** (pegar output completo)
5. **Build:** npm run build → [✅ exitoso / ❌ falló]

### 💰 REPORTE DE TOKENS Y COSTOS (OBLIGATORIO):

**Métricas de ejecución:**
- **Tokens aproximados:** [estimación ej: 40k-80k]
- **Herramientas usadas:** [cantidad de edits/búsquedas]
- **Archivos tocados:** [cantidad exacta]
- **Build ejecutado:** [sí/no - resultado]

**Estimación de costo:**
- **Costo aproximado:** $[X]-$[Y] USD
- **Riesgo:** [BAJO / MEDIO / ALTO]
- **Límite mensual:** [%] consumido estimado

**Próximo paso sugerido:** [qué hacer después]

---

## VERIFICACIÓN POST-TAREA

- Claude Code revisará tus cambios con `git diff`
- Director verificará visualmente en `http://localhost:3000/rimec`
- Director aprobará antes de commit/push

---

## IMPORTANTE - NO OLVIDAR

1. ✅ **GUARDAR todos los archivos editados** (no solo trabajar en memoria)
2. ✅ Hacer `npm run build` para verificar que compila
3. ✅ Reportar tokens y costos al terminar
4. ✅ NO hacer git commit/push/PR
5. ✅ Los cambios deben quedar en archivos locales para que `git diff` los vea

---

**Protocolo:** `.claude/1_fundamentos/1.1_protocolos/reporte_tokens_costos.md`  
**Guion Maestro:** `.claude/GUION_MAESTRO.md` (Escena 3A)  
**Fecha:** 2026-06-10
