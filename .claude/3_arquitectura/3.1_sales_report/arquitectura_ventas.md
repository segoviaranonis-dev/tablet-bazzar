# SALES REPORT (VENTAS) — Arquitectura Completa

**Módulo**: RIMEC → Ventas (Sales Report v1)  
**Ruta**: `/rimec`  
**Tipo**: Dashboard Inmersivo de Análisis de Ventas  
**Fecha Mapeo**: 2026-06-09

---

## 📋 ÍNDICE

1. [Descripción General](#descripción-general)
2. [Arquitectura de Alto Nivel](#arquitectura-de-alto-nivel)
3. [Flujo de Datos](#flujo-de-datos)
4. [Componentes Principales](#componentes-principales)
5. [APIs y Backend](#apis-y-backend)
6. [Lógica de Negocio](#lógica-de-negocio)
7. [Tipos de Datos](#tipos-de-datos)
8. [Mundos (Vistas)](#mundos-vistas)
9. [Tablas Jerárquicas](#tablas-jerárquicas)
10. [Filtros y Cascada](#filtros-y-cascada)
11. [Modelo de Datos DB](#modelo-de-datos-db)
12. [Cálculos y KPIs](#cálculos-y-kpis)

---

## 📖 DESCRIPCIÓN GENERAL

**Sales Report (Ventas)** es un dashboard inmersivo multidimensional que permite analizar ventas desde 4 perspectivas diferentes ("Mundos"):

- **Dashboard**: KPIs globales, evolución mensual, participación calzado/confección
- **Clientes**: Segmentación cartera (crecimiento/riesgo/sin compra), jerarquía cadena→cliente→marca
- **Marcas**: Ranking de marcas, cumplimiento objetivo, evolución
- **Vendedores**: Ranking vendedores, clientes activos, cumplimiento

### Características Clave

✅ **Snapshot Único**: Una sola consulta POST devuelve todos los datos  
✅ **Inmersivo**: Fondo oscuro con gradientes, visualizaciones interactivas  
✅ **Drill-Down**: Tablas jerárquicas con expansión (cadena → cliente → marca → mes)  
✅ **Filtros Cascada**: Selectores se actualizan según datos disponibles  
✅ **Modo Demo**: Datos mock si DATABASE_URL no configurada  
✅ **Performance**: Pool PostgreSQL singleton, queries paralelas

---

## 🏗️ ARQUITECTURA DE ALTO NIVEL

```
┌─────────────────────────────────────────────────────────────┐
│                      ImmersiveClient                         │
│                    (Estado + Coordinación)                   │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬───────────┬───────────┐
        │           │           │           │           │
   ┌────▼────┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐ ┌────▼─────┐
   │Dashboard│ │Clientes│ │ Marcas │ │Vendedor│ │  Filtros │
   │  Mundo  │ │ Mundo  │ │ Mundo  │ │ Mundo  │ │  Panel   │
   └────┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └────┬─────┘
        │          │          │          │           │
        └──────────┴──────────┴──────────┴───────────┘
                              │
                    ┌─────────▼──────────┐
                    │   FullSnapshot     │
                    │   (1 objeto JSON)  │
                    └─────────┬──────────┘
                              │
                   ┌──────────▼───────────┐
                   │  POST /api/rimec/    │
                   │  full-snapshot       │
                   └──────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
         │ Pivot   │    │Jerarquía│    │ Cascada │
         │ Query   │    │ Query   │    │ Domains │
         └────┬────┘    └────┬────┘    └────┬────┘
              │               │               │
              └───────────────┴───────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   PostgreSQL       │
                    │   v_ventas_pivot   │
                    │   categoria_v2     │
                    │   cliente_v2       │
                    └────────────────────┘
```

---

## 🔄 FLUJO DE DATOS

### 1. **Carga Inicial**

```typescript
ImmersiveClient
  ↓
useEffect → fetch('/api/rimec/meta')
  ↓
si configured=true → consultar()
  ↓
POST /api/rimec/full-snapshot
  ↓
setSnapshot(response)
  ↓
Renderizar Mundo activo
```

### 2. **Cambio de Filtros**

```typescript
Usuario cambia filtro (ej: mes)
  ↓
setFiltros(new)
  ↓
Usuario click "Consultar"
  ↓
consultar() → POST /api/rimec/full-snapshot
  ↓
Backend: buildPivotSql(filtros) + buildJerarquiaSql(filtros)
  ↓
Queries paralelas a PostgreSQL
  ↓
buildFullSnapshotResponse(rows, filtros, jerarquia)
  ↓
fetchCascadeDomains(pool, filtros) → actualizar selectores
  ↓
setSnapshot(response)
  ↓
Actualizar cascada de filtros
```

### 3. **Snapshot en 3 Pasos**

```sql
-- Paso 1: Pivot Query (datos transaccionales)
SELECT 
  cliente, codigo_cliente, cadena, marca, vendedor,
  mes, mes_idx,
  SUM(monto_26) as monto_2026,
  SUM(monto_25) as monto_2025,
  SUM(monto_objetivo) as monto_objetivo
FROM v_ventas_pivot
WHERE [filtros]
GROUP BY cliente, marca, vendedor, mes
ORDER BY cliente, marca, mes_idx

-- Paso 2: Jerarquía Query (agrupación cadena×cliente×marca×mes)
SELECT
  cadena.id_cadena,
  cadena.descp_cadena,
  cliente.id_cliente,
  cliente.descp_cliente,
  marca.id_marca,
  marca.descp_marca,
  mes_idx,
  SUM(monto_2025) as monto_2025,
  SUM(monto_2026) as monto_2026,
  SUM(monto_objetivo) as monto_objetivo
FROM v_ventas_pivot
WHERE [filtros]
GROUP BY id_cadena, id_cliente, id_marca, mes_idx
ORDER BY id_cadena, id_cliente, id_marca, mes_idx

-- Paso 3: Cascada (dominios disponibles)
SELECT DISTINCT marca FROM v_ventas_pivot WHERE [filtros-partial]
SELECT DISTINCT cadena FROM v_ventas_pivot WHERE [filtros-partial]
-- etc...
```

---

## 🧩 COMPONENTES PRINCIPALES

### `/src/app/rimec/page.tsx`
**Propósito**: Entry point del módulo  
**Función**: Renderiza `<ImmersiveClient />`

### `/src/app/rimec/ImmersiveClient.tsx`
**Propósito**: Cliente principal, orquestador  
**Responsabilidades**:
- Estado global (filtros, snapshot, loading, error)
- Fetch meta + snapshot
- Cambio de mundos
- Cascada de filtros
- Modo demo

**Estado**:
```typescript
meta: MetaApi | null              // ¿DB configurada?
filtros: SalesReportFilters       // Filtros actuales
snapshot: FullSnapshotResponse    // Datos completos
loading: boolean                  // Cargando?
err: string | null                // Error?
mundo: MundoId                    // Vista activa
hasSyncedOnce: boolean            // Primera carga?
```

**Métodos**:
- `consultar()` - POST /api/rimec/full-snapshot
- `handleDemo()` - Cargar datos mock
- Cascada automática (useEffect post-snapshot)

---

## 🌍 MUNDOS (VISTAS)

### 1. **MundoDashboard**
**Archivo**: `/src/app/rimec/components/MundoDashboard.tsx`

**Secciones**:
1. **KPIs Hero** - Monto período, objetivo, variación, clientes activos
2. **Gráfico Radial Cumplimiento** - Círculo animado con % objetivo
3. **Gráfico Área Participación** - Calzado vs Confección (2025/2026)
4. **Tabla Evolución Mensual** - Mes, Real 2025, Objetivo, Real 2026, Desvío%
   - Subtotales por semestre
   - Total anual con highlight

**Datos consumidos**:
- `snapshot.kpis`
- `snapshot.evolucion_mensual`
- `snapshot.participacion`

---

### 2. **MundoClientes**
**Archivo**: `/src/app/rimec/components/MundoClientes.tsx`

**Secciones**:
1. **Buscador** - Filtrar por nombre, código, cadena, marca
2. **Gráfico Line** - Evolución 3 segmentos (crecimiento/riesgo/sin compra)
3. **Tabs Segmentación**:
   - **Crecimiento**: Clientes con variación positiva vs año anterior
   - **Riesgo**: Clientes con caída en ventas
   - **Sin Compra**: Clientes que no compraron en período
4. **Cartera Completa** - Todos los clientes unificados
5. **Tabla Jerárquica** - Drill-down: Cadena → Cliente → Marca → Mes

**Datos consumidos**:
- `snapshot.clientes_crecimiento`
- `snapshot.clientes_riesgo`
- `snapshot.clientes_sin_compra`
- `snapshot.jerarquia_clientes`

**Lógica de Segmentación**:
```typescript
Crecimiento: variacion_pct > 0
Riesgo: variacion_pct < 0 && monto_2026 > 0
Sin Compra: monto_2026 === 0
```

---

### 3. **MundoMarcas**
**Archivo**: `/src/app/rimec/components/MundoMarcas.tsx`

**Secciones**:
1. **Ranking Marcas** - Top por monto actual
2. **Tabla Detallada**:
   - Marca
   - Monto 2026
   - Monto 2025
   - Objetivo
   - Variación %
   - Cumplimiento %
3. **Gráfico Barras** - Comparativo top 10 marcas

**Datos consumidos**:
- `snapshot.ranking_marcas`

**Cálculos**:
```typescript
variacion_pct = ((monto_2026 - monto_2025) / monto_2025) * 100
cumplimiento_pct = (monto_2026 / objetivo) * 100
```

---

### 4. **MundoVendedores**
**Archivo**: `/src/app/rimec/components/MundoVendedores.tsx`

**Secciones**:
1. **Ranking Vendedores** - Top por monto actual
2. **Tabla Detallada**:
   - Vendedor
   - Monto 2026
   - Monto 2025
   - Objetivo
   - Variación %
   - Cumplimiento %
   - Clientes Activos
3. **Gráfico Barras** - Comparativo vendedores
4. **Drill-down por Vendedor** - Ver clientes asignados

**Datos consumidos**:
- `snapshot.ranking_vendedores`

---

## 🎛️ FILTROS Y CASCADA

### ImmersiveFiltersPanel
**Archivo**: `/src/app/rimec/components/ImmersiveFiltersPanel.tsx`

**Filtros Disponibles**:
1. **Objetivo %** - Incremento esperado vs año anterior (default: 30%)
2. **Departamento** - CALZADO / CONFECCION / TODOS
3. **Categorías** - Multi-select (ej: NIÑOS, ADULTOS, SANDALIA)
4. **Meses** - Multi-select (ENE-DIC)
5. **Marcas** - Multi-select
6. **Cadenas** - Multi-select (sin cadena = "S/C")
7. **Vendedores** - Multi-select
8. **Cliente Exacto** - Búsqueda por código

**Cascada Automática**:
Después de cada snapshot, el cliente ajusta los filtros a valores válidos:

```typescript
// Si el departamento seleccionado no existe en cascada.departamentos
const depOk = cascada.departamentos.includes(filtros.departamento);
if (!depOk) {
  setFiltros(f => ({ ...f, departamento: cascada.departamentos[0] }));
}
```

**Tipo de Filtros**:
```typescript
export type SalesReportFilters = {
  objetivo_pct: number;           // % incremento esperado
  departamento: string;           // CALZADO | CONFECCION | TODOS
  categoria_ids: number[];        // [1, 2, 5]
  meses: string[];                // ["ENERO", "FEBRERO"]
  cadenas: string[];              // ["CASA GONZALEZ", "S/C"]
  clientes: string[];             // (no usado en snapshot)
  vendedores: string[];           // ["MARIA LOPEZ"]
  marcas: string[];               // ["NIKE", "ADIDAS"]
  id_cliente_exacto: string | null; // "12345"
};
```

---

## 🗄️ APIs Y BACKEND

### 1. **GET /api/rimec/meta**
**Archivo**: `/src/app/api/rimec/meta/route.ts`

**Propósito**: Verificar si DATABASE_URL está configurada

**Respuesta**:
```json
{
  "configured": true
}
```
o
```json
{
  "configured": false,
  "error": "DATABASE_URL no definida"
}
```

---

### 2. **POST /api/rimec/full-snapshot**
**Archivo**: `/src/app/api/rimec/full-snapshot/route.ts`

**Propósito**: Consulta única que devuelve todos los datos del dashboard

**Request Body**:
```json
{
  "objetivo_pct": 30,
  "departamento": "CALZADO",
  "categorias": ["NIÑOS"],
  "meses": [1, 2, 3],
  "marcas": ["NIKE"],
  "cadenas": ["CASA LOPEZ"],
  "vendedores": ["MARIA"]
}
```

**Response** (FullSnapshotResponse):
```json
{
  "configured": true,
  "kpis": {
    "monto_periodo": 150000000,
    "monto_objetivo": 130000000,
    "variacion_pct": 15.38,
    "clientes_activos": 45,
    "monto_periodo_anterior": 120000000
  },
  "evolucion_mensual": [
    {
      "mes": "ENERO",
      "real_2026": 50000000,
      "objetivo": 43000000,
      "real_2025": 40000000,
      "desvio_pct": 16.28
    }
  ],
  "participacion": {
    "y2025": {
      "calzado": { "monto": 80000000, "pct": 66.67 },
      "confeccion": { "monto": 40000000, "pct": 33.33 }
    },
    "y2026": {
      "calzado": { "monto": 100000000, "pct": 66.67 },
      "confeccion": { "monto": 50000000, "pct": 33.33 }
    }
  },
  "clientes_crecimiento": [...],
  "clientes_riesgo": [...],
  "clientes_sin_compra": [...],
  "ranking_marcas": [...],
  "ranking_vendedores": [...],
  "detalle_operativo": [...],
  "jerarquia_clientes": [...],
  "meta": {
    "periodo": "2026",
    "objetivo_pct": 30,
    "departamento": "CALZADO",
    "generado_at": "2026-06-09T12:34:56Z"
  },
  "cascada": {
    "departamentos": ["CALZADO", "CONFECCION", "TODOS"],
    "categorias": [
      { "id_categoria": 1, "nombre": "NIÑOS" },
      { "id_categoria": 2, "nombre": "ADULTOS" }
    ],
    "meses_nombres": ["ENERO", "FEBRERO", "MARZO"],
    "marcas": ["NIKE", "ADIDAS", "PUMA"],
    "cadenas": ["CASA LOPEZ", "S/C"],
    "vendedores": ["MARIA", "JUAN"]
  }
}
```

**Flujo Interno**:
1. Verificar `isRimecDatabaseConfigured()`
2. Parsear filtros del body
3. Resolver categoría nombres → IDs
4. `buildPivotSql(filtros)` + `buildJerarquiaSql(filtros)`
5. Ejecutar queries en paralelo
6. `enrichPivotRows()` - agregar columnas calculadas
7. `buildFullSnapshotResponse()` - construir bloques de datos
8. `fetchCascadeDomains()` - obtener opciones válidas
9. Devolver JSON completo

---

### 3. **POST /api/rimec/analysis** (legacy)
**Archivo**: `/src/app/api/rimec/analysis/route.ts`

**Estado**: Deprecado en favor de `/full-snapshot`

---

## 📊 LÓGICA DE NEGOCIO

### `/src/lib/rimec/sales-logic.ts`

**Función Principal**: `getFullAnalysisPackage(pivotRows, filtros)`

**Responsabilidad**: Agregar y segmentar filas del pivot

**Bloques Generados**:
1. **KPIs globales** - suma de montos, variación, clientes únicos
2. **Evolución mensual** - agrupar por mes_idx
3. **Cartera segmentada** - filtrar por variación_pct
4. **Ranking marcas** - agrupar por marca, ordenar por monto
5. **Ranking vendedores** - agrupar por vendedor, ordenar por monto
6. **Cartera completa** - todos clientes con montos

**Funciones Auxiliares**:
- `aggByKeys(rows, groupKeys, sumKeys)` - Agrupar y sumar
- `enrichVariacion(rows)` - Calcular % variación vs objetivo
- `calcVariacionPct(actual, objetivo)` - Fórmula variación

---

### `/src/lib/rimec/variacion-objetivo.ts`

**Función**: `variacionPctVsObjetivo(objetivo, real)`

**Fórmula**:
```typescript
if (objetivo === 0) return null;
return ((real - objetivo) / objetivo) * 100;
```

**Ejemplo**:
```typescript
variacionPctVsObjetivo(100, 130) // → +30%
variacionPctVsObjetivo(100, 80)  // → -20%
variacionPctVsObjetivo(0, 50)    // → null
```

---

### `/src/lib/rimec/pivot-query.ts`

**Función**: `buildPivotSql(filtros)`

**Propósito**: Construir query SQL con filtros dinámicos

**Estructura SQL**:
```sql
SELECT
  cliente,
  codigo_cliente,
  cadena,
  marca,
  vendedor,
  mes,
  mes_idx,
  SUM(monto_26) as monto_2026,
  SUM(monto_25) as monto_2025,
  (SUM(monto_25) * (1 + $objetivo_pct / 100)) as monto_objetivo
FROM v_ventas_pivot
WHERE 1=1
  AND ($departamento = 'TODOS' OR departamento = $departamento)
  AND mes_idx = ANY($meses)
  AND (ARRAY_LENGTH($marcas) = 0 OR marca = ANY($marcas))
  AND (ARRAY_LENGTH($cadenas) = 0 OR cadena = ANY($cadenas))
  AND (ARRAY_LENGTH($vendedores) = 0 OR vendedor = ANY($vendedores))
  AND categoria_id = ANY($categoria_ids)
GROUP BY cliente, codigo_cliente, cadena, marca, vendedor, mes, mes_idx
ORDER BY cliente, marca, mes_idx
```

**Parámetros Parametrizados**:
```typescript
{
  text: "SELECT ... WHERE mes_idx = ANY($1) ...",
  values: [[1,2,3], "CALZADO", [1,2], ...]
}
```

**Función**: `enrichPivotRows(rows, objetivo_pct)`

**Propósito**: Agregar columnas calculadas a cada fila

**Columnas Agregadas**:
- `monto_actual` (alias de monto_2026)
- `monto_objetivo` (calculado)
- `variacion_pct` (vs objetivo)

---

### `/src/lib/rimec/cliente-jerarquia-query.ts`

**Función**: `buildJerarquiaSql(filtros)`

**Propósito**: Query para tabla jerárquica (Cadena → Cliente → Marca → Mes)

**SQL**:
```sql
SELECT
  cadena.id_cadena,
  cadena.descp_cadena,
  cliente.id_cliente,
  cliente.descp_cliente,
  marca.id_marca,
  marca.descp_marca,
  mes_idx,
  SUM(monto_2025) as monto_2025,
  SUM(monto_2026) as monto_2026,
  (SUM(monto_2025) * (1 + $objetivo_pct / 100)) as monto_objetivo
FROM v_ventas_pivot
LEFT JOIN cadena_v2 ON ...
LEFT JOIN cliente_v2 ON ...
LEFT JOIN marca_v2 ON ...
WHERE [filtros]
GROUP BY id_cadena, descp_cadena, id_cliente, descp_cliente, id_marca, descp_marca, mes_idx
ORDER BY descp_cadena, descp_cliente, descp_marca, mes_idx
```

**Función**: `mapJerarquiaQueryRows(rows, objetivo_pct)`

**Propósito**: Mapear filas DB a tipo TypeScript

**Salida**:
```typescript
[
  {
    id_cadena: 5,
    descp_cadena: "CASA LOPEZ",
    id_cliente: 123,
    descp_cliente: "MARIA GONZALEZ",
    id_marca: 42,
    descp_marca: "NIKE",
    mes_idx: 1,
    monto_2025: 5000000,
    monto_2026: 6500000,
    monto_objetivo: 6500000,
    variacion_vs_objetivo_pct: 0
  },
  ...
]
```

---

### `/src/lib/rimec/cascade-domains.ts`

**Función**: `fetchCascadeDomains(pool, filtros)`

**Propósito**: Obtener valores únicos para cada selector

**Queries** (6 consultas paralelas):
```sql
-- 1. Departamentos
SELECT DISTINCT departamento FROM v_ventas_pivot
WHERE [filtros-minus-departamento]

-- 2. Categorías
SELECT DISTINCT categoria_id, categoria FROM v_ventas_pivot
WHERE [filtros-minus-categoria]

-- 3. Meses
SELECT DISTINCT mes FROM v_ventas_pivot
WHERE [filtros-minus-mes]
ORDER BY mes_idx

-- 4. Marcas
SELECT DISTINCT marca FROM v_ventas_pivot
WHERE [filtros-minus-marca]
ORDER BY marca

-- 5. Cadenas
SELECT DISTINCT cadena FROM v_ventas_pivot
WHERE [filtros-minus-cadena]
ORDER BY cadena

-- 6. Vendedores
SELECT DISTINCT vendedor FROM v_ventas_pivot
WHERE [filtros-minus-vendedor]
ORDER BY vendedor
```

**Salida**:
```typescript
{
  departamentos: ["CALZADO", "CONFECCION", "TODOS"],
  categorias: [
    { id_categoria: 1, nombre: "NIÑOS" },
    { id_categoria: 2, nombre: "ADULTOS" }
  ],
  meses_nombres: ["ENERO", "FEBRERO", ...],
  marcas: ["NIKE", "ADIDAS", ...],
  cadenas: ["CASA LOPEZ", "S/C"],
  vendedores: ["MARIA", "JUAN", ...]
}
```

---

### `/src/lib/rimec/build-full-snapshot.ts`

**Función**: `buildFullSnapshotResponse(rows, filtros, jerarquia)`

**Propósito**: Construir objeto completo a partir de filas pivot

**Algoritmo**:
1. Calcular KPIs globales
2. Agrupar por mes → evolución mensual
3. Calcular participación calzado/confección
4. Segmentar clientes (crecimiento/riesgo/sin compra)
5. Ranking marcas (top por monto)
6. Ranking vendedores (top por monto)
7. Detalle operativo (todas las filas)
8. Metadata

**Función**: `getMockFullSnapshot(filtros)`

**Propósito**: Generar datos de ejemplo (modo demo)

---

### `/src/lib/rimec/pool.ts`

**Propósito**: Pool PostgreSQL singleton

**Función**: `getRimecPool()`

**Configuración**:
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,              // Conexiones máximas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
```

**Función**: `isRimecDatabaseConfigured()`

**Propósito**: Verificar si DATABASE_URL existe

---

## 📐 TIPOS DE DATOS

### FullSnapshotResponse
**Archivo**: `/src/lib/rimec/full-snapshot-types.ts`

```typescript
export type FullSnapshotResponse = {
  configured: true;
  kpis: FullSnapshotKpis;
  evolucion_mensual: FullSnapshotEvolucionMes[];
  participacion: FullSnapshotParticipacion;
  clientes_crecimiento: FullSnapshotClienteTabla[];
  clientes_riesgo: FullSnapshotClienteTabla[];
  clientes_sin_compra: FullSnapshotClienteSinCompra[];
  ranking_marcas: FullSnapshotRankingMarca[];
  ranking_vendedores: FullSnapshotRankingVendedor[];
  detalle_operativo: FullSnapshotDetalleRow[];
  jerarquia_clientes: FullSnapshotJerarquiaLeaf[];
  meta: FullSnapshotMeta;
  cascada: FullSnapshotCascada;
};
```

### FullSnapshotKpis
```typescript
export type FullSnapshotKpis = {
  monto_periodo: number;            // Ventas período actual
  monto_objetivo: number;           // Meta según % objetivo
  variacion_pct: number | null;     // % diferencia vs objetivo
  clientes_activos: number;         // Clientes con compra > 0
  monto_periodo_anterior: number;   // Ventas año anterior
};
```

### FullSnapshotEvolucionMes
```typescript
export type FullSnapshotEvolucionMes = {
  mes: string;            // "ENERO"
  real_2026: number;      // Venta actual
  objetivo: number;       // Meta del mes
  real_2025: number;      // Venta año anterior
  desvio_pct: number;     // % vs objetivo
};
```

### FullSnapshotParticipacion
```typescript
export type FullSnapshotParticipacion = {
  y2025: FullSnapshotParticipacionYear;
  y2026: FullSnapshotParticipacionYear;
};

export type FullSnapshotParticipacionYear = {
  calzado: { monto: number; pct: number };
  confeccion: { monto: number; pct: number };
};
```

### FullSnapshotClienteTabla
```typescript
export type FullSnapshotClienteTabla = {
  id_cliente: number;
  codigo: string;
  nombre: string;
  cadena: string;
  monto_2026: number;
  monto_2025: number;
  variacion_pct: number | null;
  marca_principal: string;
};
```

### FullSnapshotJerarquiaLeaf
```typescript
export type FullSnapshotJerarquiaLeaf = {
  id_cadena: number;
  descp_cadena: string;
  id_cliente: number;
  descp_cliente: string;
  id_marca: number;
  descp_marca: string;
  mes_idx: number;
  monto_2025: number;
  monto_2026: number;
  monto_objetivo: number;
  variacion_vs_objetivo_pct: number | null;
};
```

---

## 🗂️ TABLAS JERÁRQUICAS

### TablaJerarquica
**Archivo**: `/src/app/rimec/components/TablaJerarquica.tsx`

**Propósito**: Tabla expandible con 4 niveles de drill-down

**Niveles**:
1. **Cadena** (nivel 0) - Suma todos clientes de la cadena
2. **Cliente** (nivel 1) - Suma todas marcas del cliente
3. **Marca** (nivel 2) - Suma todos meses de la marca
4. **Mes** (nivel 3) - Detalle mensual (hoja final)

**Datos**:
```typescript
const data = snapshot.jerarquia_clientes;
// Array de hojas (ya sumadas en PostgreSQL)
```

**Algoritmo de Agrupación**:
```typescript
// Agrupar hojas por cadena
const cadenas = groupBy(data, 'id_cadena');

// Para cada cadena, agrupar por cliente
cadenas.forEach(cadena => {
  const clientes = groupBy(cadena.hojas, 'id_cliente');
  
  // Para cada cliente, agrupar por marca
  clientes.forEach(cliente => {
    const marcas = groupBy(cliente.hojas, 'id_marca');
    
    // Cada marca tiene sus meses (hojas finales)
  });
});
```

**Interacción**:
- Click en fila → expandir/colapsar
- Indentación visual por nivel
- Suma automática de subtotales
- Color por variación (verde/rojo)

---

### TablaJerarquiaMarcaVendedor
**Archivo**: `/src/app/rimec/components/TablaJerarquiaMarcaVendedor.tsx`

**Propósito**: Vista alternativa agrupando por Marca → Vendedor

---

### TablaJerarquiaVendedorCadenaClienteMarcaMes
**Archivo**: `/src/app/rimec/components/TablaJerarquiaVendedorCadenaClienteMarcaMes.tsx`

**Propósito**: Vista drill-down desde Vendedor

**Niveles**:
1. Vendedor
2. Cadena
3. Cliente
4. Marca
5. Mes

---

## 🗃️ MODELO DE DATOS DB

### Vista Principal: `v_ventas_pivot`

**Columnas**:
```sql
CREATE VIEW v_ventas_pivot AS
SELECT
  -- IDs
  cliente_id,
  codigo_cliente,
  cadena_id,
  marca_id,
  vendedor_id,
  categoria_id,
  
  -- Descripciones
  cliente,
  cadena,
  marca,
  vendedor,
  categoria,
  
  -- Departamento
  departamento,  -- CALZADO | CONFECCION
  
  -- Temporal
  mes,          -- "ENERO"
  mes_idx,      -- 1-12
  anio,         -- 2026
  
  -- Montos
  monto_26,     -- Venta 2026
  monto_25,     -- Venta 2025 mismo mes
  
  -- Metadata
  fecha_factura,
  numero_factura
FROM
  facturas_items fi
  JOIN facturas f ON fi.factura_id = f.id
  JOIN cliente_v2 c ON f.cliente_id = c.id_cliente
  LEFT JOIN cadena_cliente_v2 cc ON c.id_cliente = cc.id_cliente
  LEFT JOIN cadena_v2 cad ON cc.id_cadena = cad.id_cadena
  JOIN marca_v2 m ON fi.marca_id = m.id_marca
  JOIN vendedor_v2 v ON f.vendedor_id = v.id_vendedor
  JOIN categoria_v2 cat ON fi.categoria_id = cat.id_categoria
WHERE
  anio IN (2025, 2026)
```

**Índices Recomendados**:
```sql
CREATE INDEX idx_pivot_cliente ON v_ventas_pivot(cliente_id);
CREATE INDEX idx_pivot_marca ON v_ventas_pivot(marca_id);
CREATE INDEX idx_pivot_vendedor ON v_ventas_pivot(vendedor_id);
CREATE INDEX idx_pivot_mes ON v_ventas_pivot(mes_idx);
CREATE INDEX idx_pivot_depto ON v_ventas_pivot(departamento);
CREATE INDEX idx_pivot_categoria ON v_ventas_pivot(categoria_id);
```

---

### Tablas Relacionadas

#### `cliente_v2`
```sql
CREATE TABLE cliente_v2 (
  id_cliente SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE,
  nombre VARCHAR(200),
  activo BOOLEAN DEFAULT true
);
```

#### `cadena_v2`
```sql
CREATE TABLE cadena_v2 (
  id_cadena SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT
);
```

#### `cadena_cliente_v2`
```sql
CREATE TABLE cadena_cliente_v2 (
  id_cadena INTEGER REFERENCES cadena_v2(id_cadena),
  id_cliente INTEGER REFERENCES cliente_v2(id_cliente),
  PRIMARY KEY (id_cadena, id_cliente)
);
```

#### `marca_v2`
```sql
CREATE TABLE marca_v2 (
  id_marca SERIAL PRIMARY KEY,
  nombre VARCHAR(100)
);
```

#### `vendedor_v2`
```sql
CREATE TABLE vendedor_v2 (
  id_vendedor SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  activo BOOLEAN DEFAULT true
);
```

#### `categoria_v2`
```sql
CREATE TABLE categoria_v2 (
  id_categoria SERIAL PRIMARY KEY,
  descp_categoria VARCHAR(100)
);
```

---

## 🧮 CÁLCULOS Y KPIs

### 1. **Monto Objetivo**
```typescript
monto_objetivo = monto_2025 * (1 + objetivo_pct / 100)
```

**Ejemplo**:
```typescript
monto_2025 = 100,000,000  // Gs. 100M
objetivo_pct = 30         // 30% incremento
monto_objetivo = 100,000,000 * 1.3 = 130,000,000  // Gs. 130M
```

---

### 2. **Variación % vs Objetivo**
```typescript
variacion_pct = ((monto_2026 - monto_objetivo) / monto_objetivo) * 100
```

**Ejemplo**:
```typescript
monto_2026 = 150,000,000
monto_objetivo = 130,000,000
variacion_pct = ((150 - 130) / 130) * 100 = +15.38%
```

---

### 3. **Variación % vs Año Anterior**
```typescript
variacion_interanual = ((monto_2026 - monto_2025) / monto_2025) * 100
```

**Ejemplo**:
```typescript
monto_2026 = 150,000,000
monto_2025 = 100,000,000
variacion_interanual = ((150 - 100) / 100) * 100 = +50%
```

---

### 4. **Cumplimiento %**
```typescript
cumplimiento_pct = (monto_2026 / monto_objetivo) * 100
```

**Ejemplo**:
```typescript
monto_2026 = 150,000,000
monto_objetivo = 130,000,000
cumplimiento_pct = (150 / 130) * 100 = 115.38%
```

---

### 5. **Participación %**
```typescript
participacion_calzado = (monto_calzado / monto_total) * 100
participacion_confeccion = (monto_confeccion / monto_total) * 100
```

---

### 6. **Clientes Activos**
```sql
SELECT COUNT(DISTINCT cliente_id)
FROM v_ventas_pivot
WHERE monto_26 > 0
```

---

### 7. **Segmentación Cartera**

**Crecimiento**:
```typescript
variacion_pct > 0
```

**Riesgo**:
```typescript
variacion_pct < 0 && monto_2026 > 0
```

**Sin Compra**:
```typescript
monto_2026 === 0
```

---

## 🎨 ESTILO VISUAL

### Tema Inmersivo
**Archivo**: `/src/app/rimec/chart-theme.ts`

**Colores**:
```typescript
export const COLOR_REAL_ACTUAL = "#38bdf8";     // Cyan brillante
export const COLOR_OBJETIVO = "#fbbf24";        // Amarillo objetivo
export const COLOR_REAL_ANTERIOR = "#94a3b8";   // Gris anterior
```

**Fondo**:
```css
background: linear-gradient(
  135deg,
  #070b12 0%,     /* void */
  #0c1220 50%,    /* ink */
  #111827 100%    /* panel */
)
```

**Tipografía**:
- Títulos: `text-yellow-200` o `text-cyan-400`
- Textos: `text-white/88` o `text-white/72`
- Sutiles: `text-white/40`

---

## 📦 DEPENDENCIAS

### Visualización
- `recharts` - Gráficos (BarChart, LineChart, AreaChart)
- `framer-motion` - Animaciones y transiciones

### Backend
- `pg` (node-postgres) - Pool PostgreSQL
- `next` - Framework

### Utilidades
- `@/modules/sales-report` - Constantes compartidas (MESES, MES_MAP)

---

## 🚀 PERFORMANCE

### Optimizaciones Implementadas

1. **Pool PostgreSQL Singleton**
   - Una instancia reutilizada
   - Max 10 conexiones
   - Timeout 5s

2. **Queries Paralelas**
   - `Promise.all([pivotQuery, jerarquiaQuery])`
   - Reduce latencia a ~50%

3. **Cascada Paralela**
   - 6 queries DISTINCT simultáneas
   - Timeout total < 1s

4. **Modo Demo**
   - Mock data si DB no configurada
   - Respuesta instantánea

5. **Snapshot Único**
   - 1 request devuelve todo
   - Evita waterfalls

### Métricas Esperadas

| Operación | Latencia |
|-----------|----------|
| GET /api/rimec/meta | < 100ms |
| POST /api/rimec/full-snapshot | 800-2000ms |
| Pivot Query (sin índices) | 1500ms |
| Pivot Query (con índices) | 300ms |
| Jerarquía Query | 500ms |
| Cascada (6 queries) | 800ms |
| Mock Demo | < 50ms |

---

## 🔐 SEGURIDAD

### Variables de Entorno

**Requerida**:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
```

**Opcional**:
```env
NODE_ENV=development  # Para debug SQL
```

### Validación Input

1. **Filtros**:
   - Categoría IDs: `Number.isFinite(n) && n > 0`
   - Meses: `x >= 1 && x <= 12`
   - Strings: sanitizados por pg (prepared statements)

2. **SQL Injection**:
   - ✅ Usa prepared statements (`$1`, `$2`)
   - ✅ Nunca concatena strings
   - ✅ Valida tipos antes de query

---

## 📝 TESTING

### Modo Demo
Activar si `DATABASE_URL` no configurada:

```typescript
if (!dataLive) {
  return <Button onClick={handleDemo}>Ver Demo</Button>
}
```

### Datos Mock
**Archivo**: `/src/lib/rimec/build-full-snapshot.ts`

Función `getMockFullSnapshot(filtros)` genera:
- 50 clientes simulados
- 12 meses de evolución
- Participación calzado/confección
- Ranking marcas y vendedores

---

## 🐛 TROUBLESHOOTING

### Error: "DATABASE_URL no configurada"
**Solución**: Crear `.env.local` con `DATABASE_URL`

### Error: "Consulta error - timeout"
**Causa**: Query muy lenta sin índices  
**Solución**: Crear índices recomendados

### Error: "Respuesta inválida"
**Causa**: Vista `v_ventas_pivot` no existe  
**Solución**: Crear vista en PostgreSQL

### Cascada no actualiza selectores
**Causa**: Filtros fuera del dominio disponible  
**Solución**: Verificar datos en DB para filtros actuales

### Jerarquía vacía
**Causa**: No hay datos que cumplan filtros  
**Solución**: Ampliar rango de meses o quitar filtros

---

## 🔄 FLUJO COMPLETO RESUMIDO

```
1. Usuario ingresa a /rimec
   ↓
2. ImmersiveClient monta
   ↓
3. fetch('/api/rimec/meta')
   ↓
4. Si configured=true → consultar()
   ↓
5. POST /api/rimec/full-snapshot
   ↓
6. Backend:
   - buildPivotSql(filtros)
   - buildJerarquiaSql(filtros)
   - Promise.all([pivot, jerarquia])
   ↓
7. enrichPivotRows(rows)
   ↓
8. buildFullSnapshotResponse(rows, filtros, jerarquia)
   ↓
9. fetchCascadeDomains(pool, filtros)
   ↓
10. Response JSON con 10 bloques de datos
   ↓
11. setSnapshot(response)
   ↓
12. Actualizar cascada de filtros
   ↓
13. Renderizar Mundo Dashboard (default)
   ↓
14. Usuario cambia a Mundo Clientes
   ↓
15. Renderizar MundoClientes con mismo snapshot
   ↓
16. Usuario expande tabla jerárquica
   ↓
17. Click en cadena → expandir clientes
   ↓
18. Click en cliente → expandir marcas
   ↓
19. Click en marca → mostrar meses
   ↓
20. Usuario cambia filtros → consultar() → reiniciar ciclo
```

---

## 📚 REFERENCIAS

- **OT-INFORME-003**: Especificación original del módulo
- **Paridad Python**: `/modules/sales_report/logic.py` (Streamlit legacy)
- **Vista DB**: `v_ventas_pivot` (contrato datos)

---

**Fin de Documentación**  
*Generado: 2026-06-09*  
*Por: Claude Sonnet 4.5*