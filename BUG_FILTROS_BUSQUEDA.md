# 🐛 BUG CRÍTICO: Sistema de Filtros y Búsqueda No Funciona

> **Estado: ✅ RESUELTO (2026-06-11)** — taller local · pendiente commit Director  
> **Causa raíz:** param URL `refs=1184|1101` se partía con `.split("|")` → `["1184","1101"]` → SQL 0 filas  
> **Fix:** `parseReferenciaKeysParam` / `serializeReferenciaKeysParam` en `lib/filtros-url.ts`  
> **Doc:** [NAVEGACION_CADENA.md](./docs/NAVEGACION_CADENA.md) · [BACKEND_POS.md](./docs/BACKEND_POS.md)

---

# (Histórico del diagnóstico)

**Proyecto:** Tablet Bazzar (Next.js 16 + PostgreSQL)  
**Fecha:** 2026-06-11  
**Severidad:** CRÍTICA - Bloquea funcionalidad principal

---

## 📋 SÍNTOMAS

### 1. Error "Elegí una marca o acotá la búsqueda"
- **Dónde:** Página `/cadena` al presionar botón INGRESAR
- **Cuándo:** Cuando el usuario NO selecciona filtros específicos
- **Esperado:** Debería permitir ingresar sin filtros para ver TODO el catálogo
- **Actual:** Muestra error y bloquea el ingreso

### 2. "Sin stock en esta marca" cuando SÍ hay stock
- **Dónde:** Página `/cadena/vista` después de ingresar
- **Cuándo:** Al buscar por texto (ej: "1184") y presionar INGRESAR
- **Esperado:** Debería mostrar las referencias encontradas con stock
- **Actual:** Muestra página vacía con mensaje "Sin stock en esta marca"

### 3. Click en referencia específica también falla
- **Dónde:** Página `/cadena` al hacer click en una referencia de la lista
- **Cuándo:** Después de filtrar por búsqueda
- **Esperado:** Debería cargar la vista con esa referencia
- **Actual:** Carga vista vacía sin stock

---

## 🔍 PASOS PARA REPRODUCIR

### Escenario A: Sin filtros
```
1. Ir a http://localhost:3002/cadena
2. NO seleccionar ningún filtro
3. Presionar botón "INGRESAR"
4. ❌ Error: "Elegí una marca o acotá la búsqueda"
5. ✅ Esperado: Debería ingresar con primera marca disponible
```

### Escenario B: Con búsqueda
```
1. Ir a http://localhost:3002/cadena
2. Escribir "1184" en el campo BUSCAR
3. Esperar que aparezcan 14 referencias (ej: 1184.1101, 1184.1161, etc.)
4. Presionar botón "INGRESAR"
5. ❌ Actual: Carga vista de VIZZANO pero dice "Sin stock en esta marca"
6. ✅ Esperado: Debería mostrar las 14 referencias con stock
```

### Escenario C: Click en referencia
```
1. Ir a http://localhost:3002/cadena
2. Escribir "1184" en BUSCAR
3. Hacer click en referencia "1184.1101" de la lista
4. ❌ Actual: Vista vacía "Sin stock"
5. ✅ Esperado: Debería cargar vista con esa referencia específica
```

---

## 🔬 DIAGNÓSTICO REALIZADO

### ✅ Verificaciones que PASARON:

1. **Queries SQL funcionan correctamente:**
```sql
-- Query ejecutada directamente retorna 20 filas
SELECT * FROM deposito_tienda_fernando_adultos s
LEFT JOIN marca_v2 mv ON mv.id_marca = s.marca_id
WHERE s.cantidad > 0
  AND trim(s.linea_codigo_proveedor::text) ILIKE '%1184%'
  AND mv.descp_marca = 'VIZZANO'
LIMIT 20;

-- ✅ Retorna: 20 filas de 1184.1101 con stock
```

2. **Base de datos tiene datos correctos:**
   - ✅ Tabla `deposito_tienda_fernando_adultos` existe
   - ✅ Columna `tipo_v2_id` existe
   - ✅ Datos de referencia 1184.* existen con stock
   - ✅ Marca VIZZANO existe

3. **Endpoints responden:**
   - ✅ `/api/deposito/2100/filtros` retorna 200 OK
   - ✅ `/api/deposito/2100/ingresar` retorna 200 OK
   - ✅ `/api/deposito/2100/cadena` retorna 200 OK

### ❌ Problemas identificados:

1. **Espacios en blanco en códigos de BD:**
   - Códigos almacenados como: `" 1184 "` (con espacios)
   - Queries SQL usan `trim()`: `"1184"`
   - Funciones TypeScript NO usaban `trim()`: `" 1184 "`
   - **Resultado:** Las claves NO coinciden entre SQL y TypeScript

2. **Restricción incorrecta en `resolverMarcaIngreso`:**
   - Función retorna `null` cuando hay múltiples marcas sin filtro específico
   - Endpoint muestra error "Elegí una marca"
   - **Debería:** Auto-seleccionar primera marca disponible

---

## 🛠️ INTENTOS DE SOLUCIÓN (NO FUNCIONARON)

### Intento 1: Agregar `trim()` a funciones de generación de claves
```typescript
// Archivo: lib/cadena.ts

// ANTES:
export function keyLR(row) {
  return `${row.linea_codigo_proveedor}|${row.referencia_codigo_proveedor}`;
}

// DESPUÉS:
export function keyLR(row) {
  return `${String(row.linea_codigo_proveedor).trim()}|${String(row.referencia_codigo_proveedor).trim()}`;
}
```

**Archivos modificados:**
- `lib/cadena.ts` líneas 35-44 (funciones keyLR, keyLRM, keyLRMC)
- `lib/cadena.ts` líneas 99-112 (asignaciones de linea/referencia)

**Resultado:** ❌ Error persiste

### Intento 2: Auto-seleccionar primera marca
```typescript
// Archivo: lib/server/cadena-server.ts

// ANTES:
if (marca) return { marca };
return null;  // ❌ Causa error "Elegí una marca"

// DESPUÉS:
if (marca) return { marca };
if (marcas.length > 0) return { marca: marcas[0]!.marca };  // Auto-select
return null;
```

**Archivo modificado:**
- `lib/server/cadena-server.ts` líneas 52-56

**Resultado:** ❌ Error persiste

---

## 📂 ARCHIVOS RELEVANTES

### Backend (Server-side)
```
app/api/deposito/[cliente_id]/
├── filtros/route.ts          # Endpoint que lista filtros/referencias
├── ingresar/route.ts          # Endpoint que procesa INGRESAR
└── cadena/route.ts            # Endpoint que carga vista cadena

lib/server/
├── cadena-server.ts           # Lógica: resolverMarcaIngreso, filtrarParesServer
└── catalogo-sql.ts            # Builders SQL: sqlFilasStock, buildWhere, appendBuscar
```

### Frontend
```
app/cadena/
├── page.tsx                   # Página principal de filtros
└── vista/page.tsx             # Vista de cadena (carrusel)

lib/
├── cadena.ts                  # buildCadenaFromFilas, keyLR, keyLRM
├── cadena-filtros.ts          # Filtros client-side
└── filtros-url.ts             # Conversión filtros <-> URL params
```

### Base de Datos
```
Tabla: deposito_tienda_fernando_adultos
Columnas clave:
- linea_codigo_proveedor (text)      # ⚠️ Puede tener espacios
- referencia_codigo_proveedor (text) # ⚠️ Puede tener espacios
- material_code (text)                # ⚠️ Puede tener espacios
- color_code (text)                   # ⚠️ Puede tener espacios
- marca_id (bigint)
- cantidad (numeric)
```

---

## 🎯 FLUJO TÉCNICO DEL BUG

### Flujo INGRESAR (con búsqueda "1184"):

```mermaid
1. Usuario escribe "1184" → filtros.buscar = "1184"
2. POST /api/deposito/2100/ingresar
   Body: { buscar: "1184", generos: [], marcas: [], ... }

3. Backend ejecuta:
   - sqlMarcasAgregado(tabla, filtros)
     → WHERE buscar ILIKE '%1184%'
     → Retorna: [{ marca: "VIZZANO" }]
   
   - sqlReferenciasAgregado(tabla, filtros)
     → WHERE buscar ILIKE '%1184%'
     → Retorna: [{ key: "1184|1101", marca: "VIZZANO", ... }, ...]

4. resolverMarcaIngreso(filtros, marcas, referencias)
   - Detecta q = "1184"
   - Busca ref que empiece con "1184"
   - ✅ Encuentra: { marca: "VIZZANO", refKey: "1184|1101" }

5. filtros.marcaCadena = "VIZZANO"
   filtros.referenciaKeys = ["1184|1101"]

6. sqlFilasStock(tabla, filtros)
   WHERE:
     - cantidad > 0
     - buscar ILIKE '%1184%'
     - marca = 'VIZZANO'
   ✅ Retorna: 20 filas de 1184.1101

7. buildCadenaServer(filas, "VIZZANO")
   - Agrupa por keyLR(fila)
   - ⚠️ PROBLEMA: keyLR usa códigos SIN trim()
   - Si BD tiene " 1184" → key = " 1184| 1101"
   - Pero SQL generó "1184|1101"
   - ❌ NO COINCIDEN

8. filtrarParesServer(pares, filtros)
   - Filtra por referenciaKeys = ["1184|1101"]
   - Busca par.key === "1184|1101"
   - Encuentra par.key === " 1184| 1101"
   - ❌ NO COINCIDE → Filtra TODO → pares = []

9. Genera URL: /cadena/vista?q=1184&marca=VIZZANO&refs=1184|1101

10. Vista carga /api/deposito/2100/cadena?q=1184&marca=VIZZANO&refs=1184|1101
    - Mismo flujo → pares = []
    - ❌ "Sin stock en esta marca"
```

---

## 💡 HIPÓTESIS DE CAUSA RAÍZ

### Hipótesis Principal: Inconsistencia en formato de claves

**Evidencia:**
1. ✅ Queries SQL directas SÍ retornan datos
2. ✅ Endpoint `/filtros` SÍ muestra referencias
3. ❌ Endpoint `/cadena` retorna `paresAll = []`
4. ❌ `buildCadenaFromFilas` debe estar filtrando incorrectamente

**Causa probable:**
- BD tiene espacios: `linea_codigo_proveedor = " 1184 "`
- SQL usa `trim()`: genera key `"1184|1101"`
- TypeScript NO usa `trim()`: genera key `" 1184| 1101"`
- Filtro `referenciaKeys.includes(par.key)` falla
- Resultado: array vacío

### Hipótesis Secundaria: Problema en `buildCadenaFromFilas`

**Posible issue:**
- Línea 71: `const deMarca = filas.filter((f) => f.marca === marcaFiltro && f.cantidad > 0);`
- Si `f.marca` tiene espacios: `" VIZZANO "` vs `"VIZZANO"`
- Filter elimina todas las filas
- Resultado: cadena vacía

---

## 🔧 SOLUCIONES PROPUESTAS PARA CURSOR

### Solución 1: LIMPIAR DATOS EN BD (Recomendado)
```sql
-- Ejecutar en PostgreSQL
UPDATE deposito_tienda_fernando_adultos
SET 
  linea_codigo_proveedor = trim(linea_codigo_proveedor),
  referencia_codigo_proveedor = trim(referencia_codigo_proveedor),
  material_code = trim(material_code),
  color_code = trim(color_code)
WHERE 
  linea_codigo_proveedor != trim(linea_codigo_proveedor)
  OR referencia_codigo_proveedor != trim(referencia_codigo_proveedor)
  OR material_code != trim(material_code)
  OR color_code != trim(color_code);

-- Lo mismo para otras tablas deposito_tienda_*
```

### Solución 2: Normalizar en TODAS las funciones
```typescript
// Crear función utilitaria
function cleanCode(code: string | number | null): string {
  if (code == null) return '';
  return String(code).trim();
}

// Aplicar en TODOS los lugares:
// 1. lib/cadena.ts - keyLR, keyLRM, keyLRMC
// 2. lib/cadena.ts - buildCadenaFromFilas (línea 71, 99, 111)
// 3. lib/server/catalogo-sql.ts - Todas las queries
// 4. Comparaciones de marca (línea 71 de buildCadenaFromFilas)
```

### Solución 3: Verificar campo `marca`
```typescript
// lib/cadena.ts línea 71
const deMarca = filas.filter((f) => 
  f.marca?.trim() === marcaFiltro?.trim() && f.cantidad > 0
);
```

### Solución 4: Debug logging
```typescript
// Agregar en buildCadenaFromFilas
console.log('🔍 buildCadenaFromFilas DEBUG:');
console.log('  marcaFiltro:', JSON.stringify(marcaFiltro));
console.log('  filas.length:', filas.length);
console.log('  sample marca:', JSON.stringify(filas[0]?.marca));
console.log('  deMarca.length:', deMarca.length);
console.log('  sample key:', keyLR(deMarca[0] || {}));
```

---

## ✅ VALIDACIÓN DE FIX

Después de aplicar el fix, verificar:

1. **Test directo:**
```bash
cd tablet-bazzar
node scripts/test-bug-1184.js  # Debe retornar 20 filas
```

2. **Test UI - Sin filtros:**
- Ir a /cadena
- Presionar INGRESAR (sin seleccionar nada)
- ✅ Debe ingresar con primera marca

3. **Test UI - Con búsqueda:**
- Escribir "1184" en buscar
- Ver que aparezcan ~14 referencias
- Presionar INGRESAR
- ✅ Debe cargar vista con las referencias

4. **Test UI - Click referencia:**
- Hacer click en "1184.1101"
- ✅ Debe cargar vista con esa referencia específica

---

## 📊 IMPACTO

**Severidad:** CRÍTICA  
**Usuarios afectados:** TODOS (vendedores en tablet)  
**Funcionalidad bloqueada:**
- ✅ Filtros funcionan (chips, búsqueda)
- ❌ INGRESAR no funciona
- ❌ Vista de cadena siempre vacía
- ❌ No pueden navegar el catálogo

**Workaround:** NINGUNO - Sistema inutilizable

---

## 🔗 CONTEXTO ADICIONAL

**Stack:**
- Next.js 16.2.7 (App Router + Turbopack)
- PostgreSQL (Supabase)
- TypeScript 5.x

**Arquitectura:**
- Tablet POS system para vendedores
- Modo "cadena consecutiva" = navegación táctil por catálogo
- Agrupación L+R+Mat (precio) · Color (variantes)

**Restricciones:**
- Sistema debe funcionar offline (PWA)
- Performance crítica (vendedores en tienda)
- Datos vienen de carga masiva desde ERP

---

## 📝 NOTAS ADICIONALES

1. Claude intentó fix con `trim()` pero error persiste
2. Hot reload puede no estar aplicando cambios (verificar)
3. Puede necesitar `rm -rf .next && npm run dev`
4. Verificar que no haya caché de BD en servidor
5. Considerar agregar índices en BD para `trim(codigo)`

---

**Responsable:** Cursor (código) + Director (aprobación)  
**Prioridad:** P0 - BLOQUEANTE  
**Fecha límite:** Inmediato

---

## 🎯 ACCIÓN REQUERIDA

Cursor, por favor:

1. **Verificar** si los códigos en BD tienen espacios
2. **Aplicar** normalización con `trim()` en TODAS las funciones
3. **O** ejecutar UPDATE en BD para limpiar datos
4. **Validar** que los 3 escenarios funcionen
5. **Reportar** solución aplicada

**Archivos críticos a revisar:**
- `lib/cadena.ts` (buildCadenaFromFilas, keyLR)
- `lib/server/cadena-server.ts` (resolverMarcaIngreso)
- `lib/server/catalogo-sql.ts` (buildWhere, appendBuscar)
