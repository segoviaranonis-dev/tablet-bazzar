# Módulo: RRHH — Recursos Humanos

> Leer antes de trabajar en gestión de funcionarios del holding Nexus.

**Índice holding:** `2.3_report/rrhh` · subcuenta **2.3.10**  
**Repo:** `report/` (Next.js)  
**Estado:** En desarrollo  
**Última actualización:** 2026-06-11

---

## 🎯 QUÉ HACE

**Sistema de Gestión de Vacaciones** del holding Nexus con soporte DUAL:

### Objetivo Principal: Procesar Vacaciones

**1. Vacaciones por DÍAS (funcionarios regulares)**
- Según ley paraguaya: 12/18/30 días por antigüedad
- Cálculo automático
- Registro días tomados/pendientes

**2. Vacaciones por HORAS (gerentes/supervisores)**  
- **Política interna:** flexibilidad para cargos gerenciales
- Banco de horas (1 día = 8 horas)
- Permite fracciones: medio día (4h), 2.5h, etc.
- **PLUS exclusivo** para Gerente, Supervisor, Coordinador, Director

### Entidades cubiertas:
- RIMEC (empresa matriz)
- Tiendas Bazzar: Fernando, San Martín, Palma
- Bazzar Web

---

## 🏗️ ARQUITECTURA

### Stack Tecnológico

```
Frontend:  Next.js 14+ (App Router)
           TypeScript · Tailwind CSS v4
           NIIF UI (paleta RIMEC Azul #002B4E)

Backend:   PostgreSQL Supabase (DATABASE_URL server-side)
           Server Actions · API Routes
           
Auth:      Heredado de Report (rol-based)
           
Deploy:    Vercel (rimec-report.vercel.app/rrhh)
Dev:       localhost:3003/rrhh
```

### Estructura del Módulo

```
report/
├── src/app/rrhh/
│   ├── page.tsx                      — Lista funcionarios (server component)
│   ├── RRHHClient.tsx                — Componente client con filtros
│   └── components/
│       ├── FuncionarioCard.tsx       — Tarjeta individual
│       ├── FiltrosRRHH.tsx           — Panel de filtros
│       └── EstadisticasRRHH.tsx      — KPIs (total, antigüedad promedio)
│
├── src/lib/rrhh/
│   ├── queries.ts                    — SQL queries (getFuncionarios, getEntes)
│   ├── types.ts                      — TypeScript interfaces
│   └── utils.ts                      — Cálculos (antigüedad, edad)
│
└── migrations/
    └── 070_create_rrhh_tables.sql    — Tablas entes + funcionarios
```

---

## 🗄️ BASE DE DATOS

### Tabla: `entes`

**Propósito:** Normalizar entidades del holding (empresas + tiendas)

```sql
CREATE TABLE entes (
  id_ente SERIAL PRIMARY KEY,
  codigo INTEGER UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,              -- 'empresa' | 'tienda'
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO entes (codigo, nombre, tipo) VALUES
  (1, 'RIMEC', 'empresa'),
  (2, 'Fernando', 'tienda'),
  (3, 'San Martín', 'tienda'),
  (4, 'Palma', 'tienda'),
  (5, 'Bazzar Web', 'empresa');
```

**Campos:**
- `id_ente`: PK auto-incremental
- `codigo`: Código único (1-5)
- `nombre`: Nombre del ente
- `tipo`: empresa | tienda
- `activo`: Soft delete

---

### Tabla: `funcionarios`

**Propósito:** Registro normalizado de empleados por ente

```sql
CREATE TABLE funcionarios (
  id_funcionario SERIAL PRIMARY KEY,
  ente_id INTEGER REFERENCES entes(id_ente),
  
  -- Datos personales
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  nombre_completo TEXT GENERATED ALWAYS AS (nombres || ' ' || apellidos) STORED,
  ci TEXT UNIQUE NOT NULL,
  sexo CHAR(1) CHECK (sexo IN ('M', 'F')),
  fecha_nacimiento DATE,
  
  -- Datos laborales
  departamento TEXT NOT NULL,
  cargo TEXT NOT NULL,
  item INTEGER,
  fecha_ingreso_ips DATE,
  
  -- Antigüedad (calculada al insertar/actualizar)
  antiguedad_anios INTEGER,
  antiguedad_meses INTEGER,
  
  -- Metadatos
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_funcionarios_ente ON funcionarios(ente_id);
CREATE INDEX idx_funcionarios_ci ON funcionarios(ci);
CREATE INDEX idx_funcionarios_departamento ON funcionarios(departamento);
CREATE INDEX idx_funcionarios_activo ON funcionarios(activo);
```

**Campos clave:**
- `ente_id`: FK a tabla entes (normalización)
- `nombre_completo`: Generado automáticamente
- `ci`: Cédula única (índice para búsqueda rápida)
- `antiguedad_*`: Calculado desde fecha_ingreso_ips

---

## 📊 DATOS INICIALES

### Origen: Excel RIMEC

**Archivo:** `C:\Users\hecto\Nexus_Core\DATOS EMPLEADOS 2026.xlsx`

**Estructura Excel:**
```
Columnas:
- DEPARTAMENTO
- ANTIG.YY (años)
- ANTIG.MM (meses)
- ITEM
- NOMBRE Y APELLIDO
- CARGO
- SEXO
- C.I.
- FECHA NAC.
- INGRESO IPS
- HOY
```

**Registros:** 48 funcionarios de RIMEC

**Mapeo a BD:**
```
DEPARTAMENTO      → funcionarios.departamento
ANTIG.YY          → funcionarios.antiguedad_anios
ANTIG.MM          → funcionarios.antiguedad_meses
ITEM              → funcionarios.item
NOMBRE Y APELLIDO → split → nombres + apellidos
CARGO             → funcionarios.cargo
SEXO              → funcionarios.sexo
C.I.              → funcionarios.ci
FECHA NAC.        → funcionarios.fecha_nacimiento
INGRESO IPS       → funcionarios.fecha_ingreso_ips
```

**ente_id:** Todos los 48 → `1` (RIMEC)

---

## 🎨 INTERFAZ DE USUARIO

### Ruta: `/rrhh`

**Layout:**
```
┌─────────────────────────────────────────────┐
│ [Header NIIF: RIMEC Logo + Tabs]           │
├─────────────────────────────────────────────┤
│ RECURSOS HUMANOS                            │
│                                             │
│ [Filtros: Ente | Departamento | Buscar]    │
│                                             │
│ KPIs:                                       │
│  Total: 48  |  Antigüedad prom: 12.5 años  │
│                                             │
│ ┌───────────────┬───────────────┬──────────┐│
│ │ Card Func 1   │ Card Func 2   │ Card 3   ││
│ │ Nombre        │ Nombre        │ Nombre   ││
│ │ Cargo         │ Cargo         │ Cargo    ││
│ │ Dpto          │ Dpto          │ Dpto     ││
│ │ 15 años       │ 12 años       │ 10 años  ││
│ └───────────────┴───────────────┴──────────┘│
│                                             │
│ [Paginación: 1 2 3 ... 10]                 │
└─────────────────────────────────────────────┘
```

### Componentes NIIF

**Paleta RIMEC:**
```css
Azul:       #002B4E  (RGB 0, 43, 78)
Azul Dark:  #001829
Azul Light: #003d6b
Fondo app:  #f1f5f9  (Celeste griseado)
Cards:      #ffffff  (Blanco puro)
```

**Componentes usados:**
- `Button.tsx` — Acciones
- `TextInput.tsx` — Búsqueda
- `LoadingState.tsx` — Skeleton cards
- `NexusHeaderZen.tsx` — Header unificado

---

## 🔍 FILTROS

### Filtros disponibles

| Filtro | Tipo | Opciones |
|--------|------|----------|
| **Ente** | Select | RIMEC, Fernando, San Martín, Palma, Bazzar Web |
| **Departamento** | Select | ADMINISTRACION, VENTAS, LOGISTICA, etc. |
| **Cargo** | Select | Dinámico desde BD |
| **Búsqueda** | Text | Nombres, apellidos, CI |

### Query con filtros

```typescript
// src/lib/rrhh/queries.ts

export async function getFuncionarios(filtros: FiltrosRRHH) {
  const { ente_id, departamento, cargo, buscar } = filtros;
  
  let query = supabase
    .from('funcionarios')
    .select(`
      *,
      ente:entes(id_ente, nombre, tipo)
    `)
    .eq('activo', true);
  
  if (ente_id) query = query.eq('ente_id', ente_id);
  if (departamento) query = query.eq('departamento', departamento);
  if (cargo) query = query.eq('cargo', cargo);
  if (buscar) {
    query = query.or(`
      nombre_completo.ilike.%${buscar}%,
      ci.ilike.%${buscar}%
    `);
  }
  
  return query.order('apellidos', { ascending: true });
}
```

---

## 📐 TIPOS TYPESCRIPT

```typescript
// src/lib/rrhh/types.ts

export interface Ente {
  id_ente: number;
  codigo: number;
  nombre: string;
  tipo: 'empresa' | 'tienda';
  activo: boolean;
  created_at: string;
}

export interface Funcionario {
  id_funcionario: number;
  ente_id: number;
  
  // Personales
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  ci: string;
  sexo: 'M' | 'F';
  fecha_nacimiento: string; // ISO date
  
  // Laborales
  departamento: string;
  cargo: string;
  item: number | null;
  fecha_ingreso_ips: string; // ISO date
  
  // Antigüedad
  antiguedad_anios: number;
  antiguedad_meses: number;
  
  // Meta
  activo: boolean;
  created_at: string;
  updated_at: string;
  
  // Join
  ente?: Ente;
}

export interface FiltrosRRHH {
  ente_id?: number;
  departamento?: string;
  cargo?: string;
  buscar?: string;
}

export interface EstadisticasRRHH {
  total: number;
  antiguedad_promedio_anios: number;
  por_departamento: { departamento: string; count: number }[];
  por_sexo: { sexo: string; count: number }[];
}
```

---

## 🔄 INTEGRACIONES

### Con Report (proyecto padre)

| Función Report | Uso en RRHH |
|----------------|-------------|
| Header NIIF | Heredado (mismo layout) |
| Auth/Roles | RRHH lee rol usuario actual |
| Paleta RIMEC | Colores institucionales |
| DB Supabase | Misma conexión |

### Con Matriz de Roles

**Acceso al módulo RRHH:**

| Rol | Nombre | Acceso /rrhh |
|-----|--------|--------------|
| 01 | ADMIN | ✅ Total |
| 02 | SUPERVISOR | ✅ Solo lectura |
| 03 | VENDEDOR | ❌ Sin acceso |
| 04 | TIENDA | ❌ Sin acceso |

**Implementación:**
```typescript
// middleware o server action
if (![1, 2].includes(user.rol_id)) {
  return redirect('/'); // No autorizado
}
```

---

## 📊 CASOS DE USO

### 1. Consultar funcionarios de un ente
```
Usuario: Admin
Filtro: Ente = "RIMEC"
Resultado: Lista 48 funcionarios
```

### 2. Buscar por nombre
```
Usuario: Supervisor
Búsqueda: "María"
Resultado: Funcionarios con "María" en nombre/apellidos
```

### 3. Ver antigüedad por departamento
```
Usuario: Admin
Filtro: Departamento = "ADMINISTRACION"
Resultado: 12 funcionarios, antigüedad promedio 14.2 años
```

---

## ⚠️ CONSIDERACIONES

### Performance
- Indexar campos de búsqueda frecuente (ci, departamento)
- Paginación obligatoria (50 items por página)
- Cache de entes (no cambian frecuentemente)

### Privacidad
- CI visible solo para Admin (rol_id = 1)
- Fecha nacimiento opcional (GDPR)
- Soft delete (no borrar registros)

### Validaciones
- CI único (constraint en BD)
- Sexo: solo M/F
- Fecha ingreso <= HOY
- Antigüedad calculada automáticamente

---

## 🚀 PRÓXIMOS PASOS

1. Crear migración `070_create_rrhh_tables.sql`
2. Script importación Excel → PostgreSQL
3. Implementar componentes Next.js
4. Testing con 48 funcionarios RIMEC
5. Deploy a Vercel

---

## 🔗 REFERENCIAS

- **Etapa activa:** `.claude/4_etapas/ACTUAL.md`
- **Diseño BD:** `./diseño_bd.md`
- **Carga inicial:** `./carga_inicial.md`
- **NIIF UI:** `.claude/ETAPA_NIIF_UI_COMPLETA.md`
- **Matriz roles:** `.claude/1_fundamentos/1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md`

---

**Última actualización:** 2026-06-11  
**Responsable:** Claude Code
