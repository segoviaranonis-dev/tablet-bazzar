# 1.3.4 NIIF - Estándar Visual Institucional

**Versión:** 1.0  
**Fecha:** 2026-06-09  
**Aplicación:** Report (todos los módulos), Retail, RRHH, Aprobaciones — y **tablet Bazzar salvo Ventas**  
**Shibboleth:** 7 años

---

## 🎨 PALETA OFICIAL NIIF

### Colores Primarios

| Uso | Color | Código | Clase Tailwind |
|-----|-------|--------|----------------|
| **Azul RIMEC** (principal) | <span style="color:#002B4E">███</span> | `#002B4E` | `rimec-azul`, `bg-rimec-azul`, `text-rimec-azul` |
| **Celeste Fondo** | <span style="color:#f1f5f9">███</span> | `#f1f5f9` | `bg-[#f1f5f9]` |
| **Blanco Tarjetas** | <span style="color:#ffffff">███</span> | `#ffffff` | `bg-white` |

### Grises Institucionales (Slate)

| Uso | Código | Clase Tailwind |
|-----|--------|----------------|
| Textos principales | `#0f172a` | `text-slate-900` |
| Textos secundarios | `#475569` | `text-slate-600` o `text-slate-700` |
| Textos terciarios | `#64748b` | `text-slate-500` |
| Bordes | `#e2e8f0` | `border-slate-200` |
| Fondos hover | `#f1f5f9` | `bg-slate-100` |
| Scrollbar track | `#cbd5e1` | Hex directo `#cbd5e1` |
| Scrollbar thumb | `#94a3b8` | Hex directo `#94a3b8` |

### Colores Auxiliares (Permitidos)

| Uso | Color | Código | Clase Tailwind |
|-----|-------|--------|----------------|
| **Ámbar** (advertencias) | <span style="color:#d97706">███</span> | `#d97706` | `amber-600`, `amber-700` |
| **Verde** (éxito) | <span style="color:#16a34a">███</span> | `#16a34a` | `green-600` |
| **Rojo** (errores) | <span style="color:#dc2626">███</span> | `#dc2626` | `red-600` |
| **Azul Hover** | <span style="color:#eff6ff">███</span> | `#eff6ff` | `blue-50/40` |

---

## ⛔ COLORES PROHIBIDOS (Tema Oscuro)

### ❌ Nunca usar:

```css
/* Amarillos (tema oscuro inmersivo) */
text-yellow-*, bg-yellow-*, border-yellow-*

/* Blancos con transparencia */
text-white/[número], bg-white/[número], border-white/[número]

/* Negros con transparencia */
bg-black/*, text-black/*, border-black/*

/* Fondos oscuros */
bg-slate-950, bg-slate-900, bg-slate-800
```

---

## ✅ CHECKLIST DE VERIFICACIÓN NIIF

### 📋 Errores Comunes Detectados (2026-06-09)

#### 🔴 CRÍTICOS (Requieren atención inmediata)

- [ ] **MundoDashboard.tsx** (~430 líneas)
  - [ ] `text-yellow-*` → `text-rimec-azul` o `text-slate-*`
  - [ ] `text-white/*` → `text-slate-900/700/600`
  - [ ] `bg-white/[0.04]` → `bg-white` o `bg-slate-50`
  - [ ] `border-white/10` → `border-slate-200`
  - [ ] `bg-black/*` → `bg-white` o `bg-slate-100`

- [ ] **TablaJerarquiaMarcaVendedor.tsx**
  - [ ] `bg-slate-950/95` → `bg-white`
  - [ ] `text-white/*` → `text-slate-*`
  - [ ] `border-white/15` → `border-slate-200`
  - [ ] `bg-black/20` → `bg-slate-50` o `bg-white`
  - [ ] `hover:bg-white/[0.07]` → `hover:bg-blue-50/40`

- [ ] **TablaJerarquica.tsx**
  - [ ] `bg-slate-950/95` → `bg-white`
  - [ ] `text-white/*` → `text-slate-*`
  - [ ] `border-white/*` → `border-slate-200`
  - [ ] `bg-black/20` → `bg-slate-50`
  - [ ] `text-yellow-200/95` → `text-rimec-azul`

#### 🟡 PARCIALES (Residuos puntuales)

- [ ] **MundoMarcas.tsx**
  - [ ] `text-yellow-400` en columnas → `text-rimec-azul`
  - [ ] `border-white/30` → `border-slate-200`
  - [ ] `bg-black/20` → `bg-slate-50`
  - [ ] `border-white/5` → `border-slate-100`

- [ ] **MundoVendedores.tsx**
  - [ ] `text-yellow-400` (nombres) → `text-rimec-azul`
  - [ ] `bg-yellow-400` (barras) → `bg-rimec-azul` o `bg-amber-500`
  - [ ] `border-yellow-400/50` → `border-rimec-azul/50`

- [ ] **MundoClientes.tsx**
  - [ ] `border-yellow-400/60` → `border-rimec-azul`
  - [ ] `bg-yellow-500/15` → `bg-blue-50`
  - [ ] `text-yellow-200` → `text-rimec-azul`
  - [ ] `focus:border-yellow-400` → `focus:border-rimec-azul`

- [ ] **ImmersiveFiltersPanel.tsx**
  - [ ] `text-yellow-400/80` → `text-rimec-azul`
  - [ ] `focus:border-yellow-400` → `focus:border-rimec-azul`
  - [ ] `border-white/10` → `border-slate-200`

---

## 🔧 PATRONES DE REEMPLAZO MASIVO

### Textos

```typescript
// Principales
text-white/70    → text-slate-700
text-white/55    → text-slate-600
text-white/40    → text-slate-500
text-white/35    → text-slate-400
text-white       → text-slate-900

// Amarillos
text-yellow-400  → text-rimec-azul
text-yellow-200  → text-slate-700
text-yellow-100  → text-slate-600
```

### Fondos

```typescript
bg-white/5       → bg-white
bg-white/10      → bg-slate-50
bg-white/[0.04]  → bg-slate-50
bg-black/20      → bg-slate-50
bg-black/30      → bg-white
bg-slate-950     → bg-white
```

### Bordes

```typescript
border-white/10  → border-slate-200
border-white/15  → border-slate-200
border-white/30  → border-slate-300
border-yellow-*  → border-rimec-azul
```

### Hover States

```typescript
hover:bg-white/10       → hover:bg-blue-50/40
hover:bg-white/20       → hover:bg-slate-100
hover:text-yellow-400   → hover:text-rimec-azul
hover:border-yellow-*   → hover:border-rimec-azul
```

### Gráficos (Recharts)

```typescript
// CartesianGrid
stroke="rgba(255,255,255,0.05)" → stroke="#e2e8f0"

// Tick (ejes)
tick={{ fill: "rgba(255,255,255,0.5)" }} → tick={{ fill: "#475569" }}

// Labels
fill="rgba(255,255,255,0.6)" → fill="#64748b"
```

---

## 🔍 COMANDO DE VERIFICACIÓN

### Buscar residuos no-NIIF:

```bash
# Amarillos
grep -rn "text-yellow\|bg-yellow\|border-yellow" src/app/rimec/

# Blancos con transparencia
grep -rn "text-white/\|bg-white/[0-9]\|border-white/" src/app/rimec/

# Negros
grep -rn "bg-black/\|bg-slate-9[5-9][0-9]" src/app/rimec/

# Verificación completa
grep -rEn "(text-yellow|bg-yellow|border-yellow|text-white/|bg-white/[0-9]|bg-black/|bg-slate-9[5-9][0-9])" src/app/rimec/components/
```

---

## 📐 REGLAS ESTRICTAS

### ✅ SÍ permitido:

1. **Fondos:** `bg-white`, `bg-[#f1f5f9]`, `bg-slate-50`, `bg-slate-100`
2. **Textos:** `text-slate-*` (400-900), `text-rimec-azul`
3. **Bordes:** `border-slate-*` (200-300), `border-rimec-azul`
4. **Hover:** `hover:bg-blue-50/40`, `hover:bg-slate-100`
5. **Auxiliares:** `green-*`, `red-*`, `amber-*` (solo advertencias/estados)

### ❌ NO permitido:

1. **Tema oscuro:** `yellow-*`, `white/*`, `black/*`, `slate-950`
2. **Transparencias oscuras:** `bg-white/5`, `border-white/10`
3. **Gradientes oscuros:** `from-slate-900`, `via-slate-950`
4. **Sombras oscuras:** `shadow-yellow-*`, `shadow-white/*`

---

## 📊 COMPONENTES CRÍTICOS

### Tarjetas institucionales

```tsx
<div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-md">
  <h3 className="text-rimec-azul font-semibold mb-4">Título</h3>
  <p className="text-slate-600">Contenido</p>
</div>
```

### Pills de navegación

```tsx
<button className={
  activo 
    ? "bg-rimec-azul text-white shadow-md px-4 py-2 rounded-lg"
    : "text-slate-600 hover:text-rimec-azul hover:bg-blue-50/40 px-4 py-2 rounded-lg"
}>
  Tab
</button>
```

### Tablas NIIF

```tsx
<table className="w-full">
  <thead className="bg-slate-50 border-b-2 border-slate-200">
    <tr className="text-xs uppercase tracking-wide text-slate-600">
      <th className="px-4 py-3 text-left">Columna</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-slate-100 hover:bg-blue-50/40">
      <td className="px-4 py-3 text-slate-900">Dato</td>
    </tr>
  </tbody>
</table>
```

---

## 🎯 CRITERIOS DE APROBACIÓN

Un componente/módulo cumple NIIF cuando:

1. ✅ **Cero colores amarillos** (`yellow-*`)
2. ✅ **Cero transparencias blancas** (`white/*`)
3. ✅ **Cero fondos negros** (`black/*`)
4. ✅ **Cero fondos oscuros** (`slate-950`, `slate-900`)
5. ✅ **Build sin errores** (`npm run build`)
6. ✅ **Verificación visual** en navegador

---

## 📝 NOTAS

- **NIIF = Normas Internacionales de Información Financiera** (contexto: reportes institucionales)
- **Colores institucionales** en conversación del Director = esta paleta NIIF (azul RIMEC + celeste + slate)
- **Azul RIMEC** (`#002B4E`) es el color corporativo principal
- **Paleta slate** proporciona jerarquía visual profesional
- **Fondo celeste** (`#f1f5f9`) reduce fatiga visual vs blanco puro
- **NO alterar lógica de negocio** al migrar estilos

---

## 📱 TABLET BAZZAR — Catálogo Ventas (2026-06-20)

Rutas `/cadena` y `/cadena/vista` usan **NIIF + naranja Bazzar** (mismo shell que el resto de tablet). Inspiración: `bazzar-web` catálogo.

**Doc:** `tablet-bazzar/docs/ESTILO_CATALOGO_BAZZAR_NIIF.md` · `2_modulos/2.4_tablet_bazzar/ESTILO_VISUAL_NIIF_VS_VENTAS.md`

**Retirado:** excepción crema/Banana Republic (`#f4f1ec`, Cormorant).

---

**Última auditoría:** 2026-06-09 (8 archivos con violaciones detectadas)  
**Chusar tablet dual:** 2026-06-16  
**Director:** Héctor Segovia
