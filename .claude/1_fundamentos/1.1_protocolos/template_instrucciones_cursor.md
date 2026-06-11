# 1.1.6 TEMPLATES DE INSTRUCCIONES PARA CURSOR

**Tipo:** PROTOCOLO OPERATIVO  
**Nivel:** CRÍTICO - Control de Cursor  
**Última actualización:** 2026-06-10

---

## 🎯 PROPÓSITO

Templates específicos para dar instrucciones a Cursor con:
- ✅ Control total de ramas
- ✅ Límites de costo claros
- ✅ Scope bien definido
- ✅ Sin autonomía git

---

## 📋 TEMPLATE BASE (Copiar/Pegar)

```markdown
# INSTRUCCIONES PARA CURSOR

## CONTEXTO
[Explicar QUÉ hay que hacer y POR QUÉ]

## TAREA ESPECÍFICA
[Lista numerada de acciones exactas]

## REGLAS ESTRICTAS (NO NEGOCIABLES)

### Git:
- [ ] Trabajar en rama actual: [NOMBRE_RAMA]
- [ ] NO crear nuevas ramas
- [ ] NO hacer git commit
- [ ] NO hacer git push
- [ ] NO crear PR/MR

### Archivos:
- [ ] Modificar SOLO: [LISTA DE ARCHIVOS O PATRÓN]
- [ ] NO tocar otros archivos
- [ ] NO borrar archivos existentes

### Costo:
- [ ] Límite de sesión: [X] tokens estimados
- [ ] Si excede 50K tokens → PARAR y reportar

### Build/Deploy:
- [ ] NO hacer npm run build
- [ ] NO hacer npm run deploy
- [ ] NO instalar nuevas dependencias sin consultar

## CAMBIOS ESPECÍFICOS
[Detallar EXACTAMENTE qué cambiar]

## AL TERMINAR REPORTAR:

### 📋 Trabajo realizado:
1. Lista de archivos modificados
2. Resumen de cambios por archivo
3. Errores encontrados (si hubo)
4. Build/test ejecutado (si corresponde)

### 💰 REPORTE DE TOKENS Y COSTOS (OBLIGATORIO):

**Métricas de ejecución:**
- Tokens aproximados: [estimación ej: 25k-45k]
- Herramientas usadas: [cantidad de llamadas/edits]
- Archivos tocados: [cantidad]
- Build ejecutado: [sí/no - cuántas veces]

**Estimación de costo:**
- Costo aproximado: $[X]-$[Y] USD
- Riesgo: [BAJO / MEDIO / ALTO]
- Límite mensual: [%] consumido estimado

**Próximo paso sugerido:** [qué hacer después]

## VERIFICACIÓN POST-TAREA
- Claude Code revisará tus cambios
- Director aprobará antes de commit/push

**Protocolo:** Ver `.claude/1_fundamentos/1.1_protocolos/reporte_tokens_costos.md`
```

---

## 📝 TEMPLATES POR TIPO DE TAREA

### **1. REFACTORING DE ESTILOS/COLORES**

```markdown
# CURSOR: REFACTORING NIIF COMPLETO

## CONTEXTO
El proyecto Nexus Core usa paleta institucional NIIF:
- RIMEC: Azul #002B4E
- BAZZAR: Naranja #ea580c
- Fondos: Celeste #f1f5f9

Hay 39 archivos con colores legacy (marrones, beige, stone) que deben migrarse.

## TAREA ESPECÍFICA
1. Reemplazar colores legacy por NIIF en 39 archivos
2. Actualizar tailwind.config.ts con paleta NIIF
3. Asegurar contraste WCAG AA

## REGLAS ESTRICTAS

### Git:
- [ ] Rama actual: feat/niif-completo
- [ ] NO crear otras ramas
- [ ] NO hacer commit/push

### Archivos:
- [ ] Modificar SOLO: src/app/**/*.tsx, tailwind.config.ts
- [ ] NO tocar: .claude/, docs/, scripts/

### Costo:
- [ ] Límite: 100K tokens (refactoring masivo)
- [ ] Si excede → PARAR

## CAMBIOS ESPECÍFICOS

### Colores a reemplazar:
```
stone-50  → slate-50
stone-100 → slate-100
stone-200 → slate-200
stone-500 → neutral-muted
stone-700 → neutral-ink

#4a3f35 → #002B4E  (RIMEC azul)
#8b7355 → #ea580c  (BAZZAR naranja)
#f5f1e8 → #f1f5f9  (fondo celeste)
#faf8f3 → #ffffff  (card blanco)
```

### Archivos prioritarios:
1. src/app/retail/components/RetailStockBoard.tsx
2. src/app/ventas-fotos/VentasFotosClient.tsx
3. src/app/rimec/components/*.tsx
4. tailwind.config.ts

## AL TERMINAR REPORTAR:
1. Archivos modificados (lista completa)
2. Colores eliminados vs agregados
3. Contraste WCAG verificado
```

---

### **2. RENOMBRADO MASIVO DE VARIABLES**

```markdown
# CURSOR: RENOMBRAR VARIABLES NOMENCLATURA P0

## CONTEXTO
Migración a nomenclatura P0:
- linea_articulo → linea_id
- codigo_proveedor → referencia_id
- Nombres descriptivos en español

## TAREA ESPECÍFICA
1. Renombrar variables en 25 archivos SQL/TypeScript
2. Actualizar tipos TypeScript
3. Mantener compatibilidad con queries existentes

## REGLAS ESTRICTAS

### Git:
- [ ] Rama actual: refactor/nomenclatura-p0
- [ ] NO commit/push

### Archivos:
- [ ] SOLO: src/lib/**/*.ts, src/types/**/*.ts
- [ ] NO: componentes React (eso lo hace Claude después)

### Costo:
- [ ] Límite: 50K tokens

## CAMBIOS ESPECÍFICOS

### Renombrados:
```
linea_articulo     → linea_id
codigo_proveedor   → referencia_id
codigo_material    → material_id
codigo_color       → color_id
codigo_talla       → talla_id
```

### Archivos:
- src/lib/retail/*.ts
- src/types/pilares.ts
- src/lib/ventas-fotos/*.ts

## AL TERMINAR REPORTAR:
1. Archivos modificados
2. Cantidad de renombrados por tipo
3. Verificar que no rompiste queries SQL
```

---

### **3. GENERACIÓN DE COMPONENTES CON PATRÓN**

```markdown
# CURSOR: GENERAR COMPONENTES DEPOSITOS BAZZAR

## CONTEXTO
Sistema de 6 depósitos BAZZAR (3 tiendas × 2 tipos: Adultos/Niños)
Necesitamos componentes para cada depósito con patrón consistente.

## TAREA ESPECÍFICA
1. Crear 6 componentes DepositoCard
2. Usar patrón existente de src/app/depositos-bazzar/components/DepositoCard.tsx
3. Aplicar colores NIIF (naranja BAZZAR)

## REGLAS ESTRICTAS

### Git:
- [ ] Rama actual: feat/depositos-bazzar
- [ ] NO commit/push

### Archivos:
- [ ] Crear SOLO en: src/app/depositos-bazzar/components/
- [ ] NO modificar archivos existentes

### Costo:
- [ ] Límite: 30K tokens (generación limitada)

## CAMBIOS ESPECÍFICOS

### Componentes a crear:
```
DepositoFernandoAdultos.tsx  (cliente_id: 2100)
DepositoFernandoNinos.tsx    (cliente_id: 2900)
DepositoSanMartinAdultos.tsx (cliente_id: 2400)
DepositoSanMartinNinos.tsx   (cliente_id: 2700)
DepositoPalmaAdultos.tsx     (cliente_id: 3100)
DepositoPalmaNinos.tsx       (cliente_id: 3200)
```

### Patrón base:
Usar DepositoCard.tsx como template:
- Props: cliente_id, ente, tipo, registros
- Colores: Adultos → naranja, Niños → verde esmeralda
- Botón sync individual

## AL TERMINAR REPORTAR:
1. Componentes creados (6)
2. Props utilizadas
3. NO hagas testing
```

---

### **4. MIGRACIÓN DE PATRÓN (Hooks, Context, etc.)**

```markdown
# CURSOR: MIGRAR CLASS COMPONENTS A HOOKS

## CONTEXTO
Componentes legacy usan class components.
Migración a functional components + hooks para mejor performance.

## TAREA ESPECÍFICA
1. Convertir 8 class components a functional
2. Migrar state a useState
3. Migrar lifecycle a useEffect

## REGLAS ESTRICTAS

### Git:
- [ ] Rama actual: refactor/hooks-migration
- [ ] NO commit/push

### Archivos:
- [ ] SOLO: src/app/rimec/components/*.tsx (los que tengan class)
- [ ] NO tocar: otros módulos

### Costo:
- [ ] Límite: 60K tokens

## CAMBIOS ESPECÍFICOS

### Componentes a migrar:
```
MundoDashboard.tsx      (class → functional)
MundoVendedores.tsx     (class → functional)
MundoMarcas.tsx         (class → functional)
... [lista completa]
```

### Patrón de migración:
```typescript
// ANTES
class MundoDashboard extends Component {
  state = { loading: true }
  componentDidMount() { ... }
}

// DESPUÉS
function MundoDashboard() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { ... }, [])
}
```

## AL TERMINAR REPORTAR:
1. Componentes migrados
2. Hooks utilizados por componente
3. Funcionalidad preservada (sí/no)
```

---

## 🚨 EJEMPLO DE INSTRUCCIONES MALAS (NO USAR)

### ❌ EJEMPLO MALO 1: Demasiado genérico

```markdown
Cursor, arreglá el código para que se vea mejor.
```

**Problemas:**
- No especifica QUÉ arreglar
- No define "mejor"
- Sin límites
- Sin control

---

### ❌ EJEMPLO MALO 2: Sin restricciones git

```markdown
Aplicá NIIF a todos los archivos y hacé commit cuando termines.
```

**Problemas:**
- Le da permiso de commit (NO)
- No especifica rama
- Sin límite de costo

---

### ❌ EJEMPLO MALO 3: Scope indefinido

```markdown
Mejorá la performance del proyecto.
```

**Problemas:**
- Muy amplio (podría tocar TODO)
- Sin archivos específicos
- Sin medible "mejora"

---

## ✅ CHECKLIST PRE-EJECUCIÓN

Antes de dar instrucciones a Cursor, verificar:

- [ ] Rama creada y checkout hecho (por Claude)
- [ ] Template completado con detalles específicos
- [ ] Límite de tokens definido
- [ ] Archivos específicos listados
- [ ] Reglas git incluidas (NO commit/push)
- [ ] Reportes esperados claros

---

## 📊 MONITOREO DURANTE EJECUCIÓN

**Mientras Cursor trabaja:**

1. **Ver dashboard de Cursor:**
   - Tokens consumidos en tiempo real
   - Si supera 50% del límite → advertir

2. **Archivos modificados:**
   - Revisar que solo toca los permitidos
   - Si modifica otros → STOP

3. **Tiempo estimado:**
   - Refactoring: 10-30 min
   - Generación: 5-15 min
   - Si excede 1 hora → revisar

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

## 📝 PLANTILLA RÁPIDA (1 MINUTO)

**Para copiar y completar rápido:**

```
CURSOR: [TÍTULO TAREA]

TAREA: [1 línea que explique QUÉ]

RAMA: [nombre-rama]
ARCHIVOS: [patrón o lista]
NO: commit, push, otras ramas

CAMBIOS:
- [cambio 1]
- [cambio 2]
- [cambio 3]

LÍMITE: [X]K tokens

REPORTAR: archivos modificados + resumen
```

---

**Última actualización:** 2026-06-10  
**Responsable:** Claude Sonnet 4.5  
**Aprobado por:** Héctor Segovia (Director)  
**Estado:** ✅ ACTIVO
