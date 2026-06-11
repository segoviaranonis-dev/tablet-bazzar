# ORDEN PARA CURSOR — REPORT NIIF COMPLETO

## CONTEXTO CRÍTICO

El módulo **Report completo** debe someterse 100% a los estándares NIIF institucionales.

Actualmente hay **14 archivos** con tema OSCURO o colores legacy (stone, beige) que violan NIIF.

**Esta es la orden FINAL para eliminar TODO lo que no sea NIIF.**

---

## OBJETIVO TOTAL

**Migrar TODO el proyecto Report a NIIF:**

✅ NIIF = Fondo celeste claro (#f1f5f9) + texto oscuro + cards blancas + azul RIMEC + naranja BAZZAR  
❌ NO NIIF = Oscuro, stone, beige, brown, marrones

---

## ARCHIVOS QUE NECESITAN CORRECCIÓN (14)

### **RIMEC - Sales Report (7 archivos) - CRÍTICO**

1. `src/app/rimec/ImmersiveClient.tsx` ⚠️ CRÍTICO
   - **Línea 142:** Fondo oscuro `bg-slate-950 ... to-black`
   - Cambiar: tema oscuro completo → claro NIIF

2. `src/app/rimec/components/MundoDashboard.tsx` ⚠️ CRÍTICO
   - Cards oscuras, gráficos oscuros
   - Cambiar: todo oscuro → blanco NIIF

3. `src/app/rimec/components/ImmersiveFiltersPanel.tsx`
4. `src/app/rimec/components/MundoClientes.tsx`
5. `src/app/rimec/components/MundoMarcas.tsx`
6. `src/app/rimec/components/MundoVendedores.tsx`
7. `src/app/rimec/components/TablaJerarquica.tsx`
8. `src/app/rimec/components/TablaJerarquiaMarcaVendedor.tsx`
9. `src/app/rimec/components/TablaJerarquiaVendedorCadenaClienteMarcaMes.tsx`
10. `src/app/rimec/RimecClient.tsx`

**Cambios:** Eliminar TODO rastro de tema oscuro

---

### **RETAIL - Stock/Retail (3 archivos)**

11. `src/app/retail/components/RetailStockBoard.tsx`
12. `src/app/retail/RetailStockClient.tsx`
13. `src/app/retail/components/RetailProductImage.tsx`

**Cambios:** Eliminar `stone-*`, asegurar NIIF completo

---

### **DEPÓSITOS BAZZAR (1 archivo)**

14. `src/app/depositos-bazzar/[cliente_id]/page.tsx`

**Cambios:** Verificar paleta naranja BAZZAR institucional

---

## REGLAS ESTRICTAS

### Git:
- [ ] Trabajar en rama actual: **main**
- [ ] **GUARDAR TODOS los archivos editados** ⚠️ CRÍTICO
- [ ] NO crear ramas nuevas
- [ ] NO hacer git commit
- [ ] NO hacer git push
- [ ] NO crear PR

### Scope:
- [ ] Modificar SOLO los 14 archivos listados arriba
- [ ] NO tocar otros módulos
- [ ] **GUARDAR cambios en disco** (no solo en memoria)

### Costo:
- [ ] Límite: 150k tokens máximo
- [ ] Si excede 100k → reportar y continuar solo si es necesario

### Build:
- [ ] SÍ hacer `npm run build` al terminar
- [ ] Build DEBE pasar sin errores

---

## CAMBIOS OBLIGATORIOS

### ❌ ELIMINAR COMPLETAMENTE:

```tsx
// Fondos oscuros:
bg-slate-950
bg-slate-900
to-black
from-black
via-slate-*
bg-black
bg-black/*

// Fondos legacy:
bg-stone-*
stone-50
stone-100
beige
brown

// Textos blancos (salvo excepciones):
text-white (reemplazar por text-slate-900)
text-white/* (reemplazar por text-slate-*)

// Borders blancos:
border-white/*

// Amarillos legacy:
yellow-400
amber-400 (salvo semantic warning)
```

---

### ✅ USAR SOLO:

```tsx
// Fondos NIIF:
bg-app-bg             // #f1f5f9 celeste
bg-white              // blanco puro
bg-card-bg            // alias de white
bg-rimec-azul/5       // azul muy suave
bg-bazzar-naranja/5   // naranja muy suave

// Textos NIIF:
text-neutral-ink      // #1e293b oscuro
text-neutral-muted    // #64748b medio
text-slate-900        // muy oscuro
text-slate-700        // oscuro
text-slate-600        // medio
text-rimec-azul       // #002B4E institucional
text-bazzar-naranja   // #ea580c institucional
text-rimec-text-white // SOLO sobre bg-rimec-azul

// Borders NIIF:
border-slate-200      // #e2e8f0 suave
border-slate-300      // #cbd5e1 medio
border-rimec-azul/10  // azul muy suave
border-neutral-300

// Cards NIIF:
bg-white + border-2 + border-slate-200 + shadow-md
```

---

## VERIFICACIÓN OBLIGATORIA

**Al terminar, ejecutar estos comandos y pegar TODO el output:**

```bash
# 1. Ver archivos modificados
git status --short

# 2. Ver estadísticas de cambios
git diff --stat

# 3. Ver cambio específico en archivo crítico
git diff src/app/rimec/ImmersiveClient.tsx | head -100

# 4. Buscar residuos de tema oscuro
grep -r "bg-slate-950\|to-black\|bg-black\|border-white" src/app/rimec/ --include="*.tsx" || echo "✅ No quedan fondos oscuros"

# 5. Build
npm run build
```

---

## CRITERIOS DE ACEPTACIÓN

Para que la tarea se considere COMPLETA:

✅ **git status --short** muestra 14 archivos modificados  
✅ **git diff --stat** NO está vacío  
✅ **grep residuos** devuelve "✅ No quedan fondos oscuros"  
✅ **ImmersiveClient.tsx línea 142** ya NO tiene `bg-slate-950 ... to-black`  
✅ **npm run build** pasa sin errores  
✅ **NO se hizo commit/push** (git log sin nuevos commits)

---

## REPORTE OBLIGATORIO AL TERMINAR

### 📋 Trabajo realizado:

```
Archivos modificados:
1. src/app/rimec/ImmersiveClient.tsx - [resumen cambios]
2. src/app/rimec/components/MundoDashboard.tsx - [resumen]
...
14. src/app/depositos-bazzar/[cliente_id]/page.tsx - [resumen]

Build: npm run build → [✅ exitoso / ❌ falló con error X]
```

### 🔍 Output de comandos de verificación:

```bash
[Pegar output completo de los 5 comandos de verificación]
```

### 💰 REPORTE DE TOKENS Y COSTOS:

```
Tokens aproximados: [Xk-Yk]
Herramientas usadas: [N] edits/búsquedas
Archivos tocados: 14
Costo estimado: $[X]-$[Y] USD
Riesgo: [BAJO/MEDIO/ALTO]
Límite mensual: [%] consumido
```

### ✅ Checklist final:

- [ ] 14 archivos modificados
- [ ] git status --short pegado
- [ ] git diff --stat pegado
- [ ] grep residuos = sin oscuros
- [ ] Build exitoso
- [ ] NO commit/push
- [ ] Tokens reportados

---

## IMPORTANTE - NO OLVIDAR

1. ✅ **GUARDAR todos los 14 archivos en disco**
2. ✅ Ejecutar los 5 comandos de verificación
3. ✅ Pegar TODO el output
4. ✅ Reportar tokens/costos
5. ✅ NO hacer git commit/push/PR
6. ✅ Si algo falla en build → reportar el error exacto

---

## MÓDULOS YA CON NIIF (NO TOCAR)

✅ `/ventas-fotos` - Ya tiene NIIF  
✅ `/aprobaciones` - Ya tiene NIIF  
✅ `/depositos-bazzar` (página principal) - Ya tiene NIIF

**Solo corregir los 14 archivos listados arriba.**

---

**Protocolo completo:** `.claude/1_fundamentos/1.1_protocolos/reporte_tokens_costos.md`  
**Fecha:** 2026-06-10  
**Responsable verificación:** Claude Code  
**Aprobador final:** Héctor Segovia (Director)
