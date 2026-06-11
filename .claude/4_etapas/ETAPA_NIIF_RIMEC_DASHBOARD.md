# ETAPA: NIIF RIMEC DASHBOARD - EN PROGRESO

**Fecha inicio:** 2026-06-10  
**Estado:** EN EJECUCIÓN - Cursor trabajando  
**Ejecutor:** Cursor (refactoring masivo)  
**Verificador:** Claude Code

---

## 🎯 OBJETIVO

Completar migración NIIF en RIMEC Dashboard:
- Fondo oscuro → claro NIIF (#f1f5f9)
- Texto blanco → neutral (#1e293b)
- Borders blancos → slate (#cbd5e1)

---

## 📋 ARCHIVOS OBJETIVO

**RIMEC Dashboard (tema oscuro → claro):**

1. `src/app/rimec/ImmersiveClient.tsx`
   - Layout principal
   - Header
   - Sidebar
   - Navegación tabs

2. `src/app/rimec/components/MundoDashboard.tsx`
   - KPIs cards
   - Gráfico evolución mensual
   - Gráficos radiales
   - Tabla detallada

3. Otros componentes RIMEC si necesario

---

## 🔄 CAMBIOS ESPERADOS

### **Fondos:**
```diff
- bg-slate-950 from-slate-900 to-black
+ bg-app-bg (#f1f5f9 celeste NIIF)

- bg-black/40
+ bg-white

- bg-white/5
+ bg-white
```

### **Textos:**
```diff
- text-white
+ text-neutral-ink

- text-white/60
+ text-neutral-muted

- text-white/40
+ text-slate-500
```

### **Borders:**
```diff
- border-white/10
+ border-slate-200

- border-white/20
+ border-slate-300
```

### **Interacciones:**
```diff
- hover:bg-white/10
+ hover:bg-blue-50/40

- hover:text-yellow-400
+ hover:text-rimec-azul
```

---

## 💰 PRESUPUESTO

**Límite tarea:** $10 USD  
**Estimado:** $3-5 USD  
**Monitoreo:** Conteo de tokens solicitado a Cursor

---

## ⏳ ESTADO ACTUAL

**Cursor:** Ejecutando cambios  
**Claude:** Esperando para verificar  
**Director:** Monitoreando tokens

---

## ✅ CRITERIOS DE VERIFICACIÓN

**Técnicos:**
- [ ] Build sin errores
- [ ] Dev server OK
- [ ] No errores TypeScript

**Visuales:**
- [ ] Fondo celeste claro (no oscuro)
- [ ] Texto oscuro legible
- [ ] Cards blancas con sombra
- [ ] Borders grises suaves

**Funcionales:**
- [ ] Tabs funcionan
- [ ] Filtros funcionan
- [ ] Gráficos renderizan
- [ ] Datos se muestran

---

## 📊 POST-VERIFICACIÓN

**Si verificación OK:**
1. Integrar cambios a main
2. Push a producción
3. Verificar en Vercel
4. Cerrar etapa

**Si hay problemas:**
1. Reportar al Director
2. Decidir: ajustar o revertir

---

**Inicio:** 2026-06-10  
**Responsable ejecución:** Cursor  
**Responsable verificación:** Claude Code  
**Aprobador final:** Héctor Segovia
