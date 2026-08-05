# Diseño Base de Datos — Módulo RRHH

**Última actualización:** 2026-06-16

---

## ESQUEMA GENERAL

```
┌─────────────┐
│   entes     │
│  (5 filas)  │
└──────┬──────┘
       │ 1
       │ N
┌──────┴──────────┐
│  funcionarios   │
└────────┬────────┘
         │ 1 por año
         │ N
┌────────┴────────┐     ┌─────────────────────┐
│   vacaciones    │ 1──<│ vacaciones_detalle  │
│  (saldo anual)  │     │   (histórico)       │
└─────────────────┘     └─────────────────────┘
```

**Relaciones:** `entes` → `funcionarios` → `vacaciones` → `vacaciones_detalle`

**Vista:** `v_vacaciones_funcionarios` (consolidado; la app usa JOINs en TS).

**Operación completa:** [FUNCIONAMIENTO_ACTUAL.md](./FUNCIONAMIENTO_ACTUAL.md)

---

## 🏢 TABLA: `entes`

### Propósito

Normalizar las entidades del holding Nexus:
- Empresas: RIMEC, Bazzar Web
- Tiendas: Fernando, San Martín, Palma

**Por qué normalizar:**
- ✅ Evitar duplicación de nombres
- ✅ Facilitar reportes por ente
- ✅ Escalabilidad (agregar nuevas tiendas)
- ✅ Consistencia de datos

### DDL Completo

```sql
CREATE TABLE entes (
  -- PK
  id_ente SERIAL PRIMARY KEY,
  
  -- Datos
  codigo INTEGER UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('empresa', 'tienda')),
  
  -- Metadatos
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Constraint: tipo debe ser 'empresa' o 'tienda'
ALTER TABLE entes ADD CONSTRAINT ck_ente_tipo 
  CHECK (tipo IN ('empresa', 'tienda'));

-- Índice único en código
CREATE UNIQUE INDEX idx_entes_codigo ON entes(codigo);

-- Comentarios
COMMENT ON TABLE entes IS 'Entidades del holding Nexus (empresas + tiendas)';
COMMENT ON COLUMN entes.codigo IS 'Código único del ente (1-5)';
COMMENT ON COLUMN entes.tipo IS 'Tipo: empresa | tienda';
```

### Datos Iniciales

```sql
INSERT INTO entes (codigo, nombre, tipo) VALUES
  (1, 'RIMEC', 'empresa'),
  (2, 'Fernando', 'tienda'),
  (3, 'San Martín', 'tienda'),
  (4, 'Palma', 'tienda'),
  (5, 'Bazzar Web', 'empresa')
ON CONFLICT (codigo) DO NOTHING;
```

### Estructura de Datos

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| `id_ente` | SERIAL | NO | auto | PK auto-incremental |
| `codigo` | INTEGER | NO | - | Código único (1-5) |
| `nombre` | TEXT | NO | - | Nombre del ente |
| `tipo` | TEXT | NO | - | 'empresa' \| 'tienda' |
| `activo` | BOOLEAN | NO | true | Soft delete |
| `created_at` | TIMESTAMP | NO | NOW() | Fecha creación |

### Índices

| Nombre | Tipo | Columnas | Propósito |
|--------|------|----------|-----------|
| `entes_pkey` | PRIMARY KEY | id_ente | PK |
| `idx_entes_codigo` | UNIQUE | codigo | Búsqueda por código |

### Constraints

| Nombre | Tipo | Definición |
|--------|------|------------|
| `ck_ente_tipo` | CHECK | tipo IN ('empresa', 'tienda') |
| `entes_codigo_key` | UNIQUE | codigo |

---

## 👥 TABLA: `funcionarios`

### Propósito

Registro normalizado de empleados del holding con:
- Datos personales
- Información laboral
- Cálculo de antigüedad
- Relación con ente

### DDL Completo

```sql
CREATE TABLE funcionarios (
  -- PK
  id_funcionario SERIAL PRIMARY KEY,
  
  -- FK a ente
  ente_id INTEGER NOT NULL REFERENCES entes(id_ente) ON DELETE RESTRICT,
  
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
  fecha_ingreso_ips DATE NOT NULL,
  
  -- Antigüedad (calculada)
  antiguedad_anios INTEGER,
  antiguedad_meses INTEGER,
  
  -- Metadatos
  activo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Índices
CREATE INDEX idx_funcionarios_ente ON funcionarios(ente_id);
CREATE UNIQUE INDEX idx_funcionarios_ci ON funcionarios(ci);
CREATE INDEX idx_funcionarios_departamento ON funcionarios(departamento);
CREATE INDEX idx_funcionarios_cargo ON funcionarios(cargo);
CREATE INDEX idx_funcionarios_activo ON funcionarios(activo);
CREATE INDEX idx_funcionarios_nombre ON funcionarios(nombre_completo);

-- Comentarios
COMMENT ON TABLE funcionarios IS 'Empleados del holding Nexus';
COMMENT ON COLUMN funcionarios.nombre_completo IS 'Generado automáticamente desde nombres + apellidos';
COMMENT ON COLUMN funcionarios.ci IS 'Cédula de identidad (único)';
COMMENT ON COLUMN funcionarios.antiguedad_anios IS 'Años de antigüedad (calculado al insertar/actualizar)';
```

### Estructura de Datos

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| `id_funcionario` | SERIAL | NO | auto | PK |
| `ente_id` | INTEGER | NO | - | FK a entes |
| **Datos personales** |
| `nombres` | TEXT | NO | - | Nombres |
| `apellidos` | TEXT | NO | - | Apellidos |
| `nombre_completo` | TEXT | NO | generado | nombres + ' ' + apellidos |
| `ci` | TEXT | NO | - | Cédula única |
| `sexo` | CHAR(1) | YES | - | M \| F |
| `fecha_nacimiento` | DATE | YES | - | Fecha de nacimiento |
| **Datos laborales** |
| `departamento` | TEXT | NO | - | Departamento |
| `cargo` | TEXT | NO | - | Cargo |
| `item` | INTEGER | YES | - | Número de ítem |
| `fecha_ingreso_ips` | DATE | NO | - | Fecha ingreso IPS |
| **Antigüedad** |
| `antiguedad_anios` | INTEGER | YES | - | Años completos |
| `antiguedad_meses` | INTEGER | YES | - | Meses adicionales |
| **Metadatos** |
| `activo` | BOOLEAN | NO | true | Soft delete |
| `created_at` | TIMESTAMP | NO | NOW() | Fecha creación |
| `updated_at` | TIMESTAMP | NO | NOW() | Última actualización |

### Índices

| Nombre | Tipo | Columnas | Propósito | Cardinalidad estimada |
|--------|------|----------|-----------|----------------------|
| `funcionarios_pkey` | PRIMARY KEY | id_funcionario | PK | 100% único |
| `idx_funcionarios_ente` | INDEX | ente_id | JOIN con entes | ~10 valores |
| `idx_funcionarios_ci` | UNIQUE | ci | Búsqueda por CI | 100% único |
| `idx_funcionarios_departamento` | INDEX | departamento | Filtro dpto | ~15 valores |
| `idx_funcionarios_cargo` | INDEX | cargo | Filtro cargo | ~30 valores |
| `idx_funcionarios_activo` | INDEX | activo | Soft delete | 2 valores |
| `idx_funcionarios_nombre` | INDEX | nombre_completo | Búsqueda texto | 100% único |

### Constraints

| Nombre | Tipo | Definición |
|--------|------|------------|
| `funcionarios_ente_id_fkey` | FOREIGN KEY | REFERENCES entes(id_ente) ON DELETE RESTRICT |
| `funcionarios_ci_key` | UNIQUE | ci |
| `funcionarios_sexo_check` | CHECK | sexo IN ('M', 'F') |

### Columnas Generadas

**`nombre_completo`:**
```sql
nombre_completo TEXT GENERATED ALWAYS AS (nombres || ' ' || apellidos) STORED
```

**Ventajas:**
- ✅ No requiere mantenimiento manual
- ✅ Siempre sincronizado
- ✅ Optimizado para búsqueda (índice)
- ✅ No consume espacio extra en INSERT

---

## 🔄 TRIGGERS Y FUNCIONES

### Actualizar `updated_at` automáticamente

```sql
-- Función genérica
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger en funcionarios
CREATE TRIGGER trigger_update_funcionarios_updated_at
  BEFORE UPDATE ON funcionarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Calcular antigüedad automáticamente (Opcional)

```sql
-- Función para calcular antigüedad
CREATE OR REPLACE FUNCTION calcular_antiguedad(fecha_ingreso DATE)
RETURNS TABLE(anios INTEGER, meses INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_ingreso))::INTEGER,
    EXTRACT(MONTH FROM AGE(CURRENT_DATE, fecha_ingreso))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar antigüedad
CREATE OR REPLACE FUNCTION actualizar_antiguedad()
RETURNS TRIGGER AS $$
DECLARE
  v_antiguedad RECORD;
BEGIN
  SELECT * INTO v_antiguedad FROM calcular_antiguedad(NEW.fecha_ingreso_ips);
  
  NEW.antiguedad_anios := v_antiguedad.anios;
  NEW.antiguedad_meses := v_antiguedad.meses;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_antiguedad
  BEFORE INSERT OR UPDATE OF fecha_ingreso_ips ON funcionarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_antiguedad();
```

---

## 📊 QUERIES COMUNES

### 1. Listar funcionarios con ente

```sql
SELECT 
  f.id_funcionario,
  f.nombre_completo,
  f.ci,
  f.cargo,
  f.departamento,
  f.antiguedad_anios,
  f.antiguedad_meses,
  e.nombre AS ente_nombre,
  e.tipo AS ente_tipo
FROM funcionarios f
INNER JOIN entes e ON e.id_ente = f.ente_id
WHERE f.activo = true
ORDER BY f.apellidos, f.nombres;
```

### 2. Contar funcionarios por ente

```sql
SELECT 
  e.nombre AS ente,
  COUNT(f.id_funcionario) AS total_funcionarios
FROM entes e
LEFT JOIN funcionarios f ON f.ente_id = e.id_ente AND f.activo = true
GROUP BY e.id_ente, e.nombre
ORDER BY e.codigo;
```

### 3. Antigüedad promedio por departamento

```sql
SELECT 
  departamento,
  COUNT(*) AS total,
  ROUND(AVG(antiguedad_anios), 1) AS antiguedad_promedio_anios
FROM funcionarios
WHERE activo = true
GROUP BY departamento
ORDER BY antiguedad_promedio_anios DESC;
```

### 4. Buscar por nombre o CI

```sql
SELECT 
  nombre_completo,
  ci,
  cargo,
  departamento
FROM funcionarios
WHERE activo = true
  AND (
    nombre_completo ILIKE '%maría%'
    OR ci ILIKE '%123%'
  )
ORDER BY apellidos;
```

### 5. Funcionarios próximos a jubilarse (ejemplo)

```sql
SELECT 
  nombre_completo,
  fecha_nacimiento,
  EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))::INTEGER AS edad,
  antiguedad_anios
FROM funcionarios
WHERE activo = true
  AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento)) >= 55
ORDER BY fecha_nacimiento;
```

---

## 🔒 PERMISOS Y SEGURIDAD

### Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE entes ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;

-- Policy: Admin puede ver todo
CREATE POLICY admin_all_funcionarios ON funcionarios
  FOR ALL
  TO authenticated
  USING (
    (SELECT rol_id FROM usuario_v2 WHERE id_usuario = auth.uid()) = 1
  );

-- Policy: Supervisor solo lectura
CREATE POLICY supervisor_read_funcionarios ON funcionarios
  FOR SELECT
  TO authenticated
  USING (
    (SELECT rol_id FROM usuario_v2 WHERE id_usuario = auth.uid()) IN (1, 2)
  );
```

### Grants

```sql
-- Service role (backend)
GRANT ALL ON entes TO service_role;
GRANT ALL ON funcionarios TO service_role;
GRANT ALL ON SEQUENCE entes_id_ente_seq TO service_role;
GRANT ALL ON SEQUENCE funcionarios_id_funcionario_seq TO service_role;

-- Anon (no debe tener acceso a RRHH)
REVOKE ALL ON entes FROM anon;
REVOKE ALL ON funcionarios FROM anon;
```

---

## 📏 VALIDACIONES

### Check Constraints

```sql
-- Sexo: solo M o F
ALTER TABLE funcionarios ADD CONSTRAINT ck_sexo
  CHECK (sexo IN ('M', 'F'));

-- Fecha ingreso no puede ser futura
ALTER TABLE funcionarios ADD CONSTRAINT ck_fecha_ingreso
  CHECK (fecha_ingreso_ips <= CURRENT_DATE);

-- Antigüedad >= 0
ALTER TABLE funcionarios ADD CONSTRAINT ck_antiguedad_positiva
  CHECK (antiguedad_anios >= 0 AND antiguedad_meses >= 0);
```

### Application-level Validations

```typescript
// src/lib/rrhh/validations.ts

export function validarCI(ci: string): boolean {
  // CI paraguaya: 7-8 dígitos
  return /^\d{7,8}$/.test(ci.replace(/\D/g, ''));
}

export function validarEdad(fecha_nac: string): boolean {
  const edad = calcularEdad(fecha_nac);
  return edad >= 18 && edad <= 80; // Rango razonable
}

export function calcularEdad(fecha_nac: string): number {
  const hoy = new Date();
  const nac = new Date(fecha_nac);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
    edad--;
  }
  return edad;
}
```

---

## TABLA: `vacaciones`

Saldo anual por funcionario (única fila por `funcionario_id` + `anio`).

| Columna | Tipo | Notas |
|---------|------|-------|
| `id_vacacion` | SERIAL PK | |
| `funcionario_id` | INTEGER FK | → `funcionarios.id_funcionario` |
| `anio` | INTEGER | Año fiscal |
| `tipo_vacacion` | VARCHAR(10) | `DIAS` \| `HORAS` \| `MIXTO` |
| `dias_totales`, `dias_tomados` | INTEGER | Ley 12/18/30 |
| `dias_pendientes` | INTEGER GENERATED | `dias_totales - dias_tomados` |
| `horas_totales`, `horas_tomadas` | NUMERIC(8,2) | Banco horas |
| `horas_pendientes` | NUMERIC GENERATED | `horas_totales - horas_tomadas` |
| `activo`, `notas` | | |

Migración canónica: `report/migrations/080_vacaciones_sistema_dual_reset.sql`

---

## TABLA: `vacaciones_detalle`

Histórico atómico de cada registro de vacaciones.

| Columna | Tipo | Notas |
|---------|------|-------|
| `id_detalle` | SERIAL PK | |
| `vacacion_id` | INTEGER FK | ON DELETE CASCADE |
| `fecha_inicio`, `fecha_fin` | DATE | Período |
| `dias_tomados` | INTEGER | Default 0 |
| `horas_tomadas` | NUMERIC(6,2) | Default 0 |
| `estado` | VARCHAR(20) | pendiente / aprobado / … |
| `aprobado_por` | INTEGER FK | → `funcionarios` (opcional) |

---

## Columna extra: `funcionarios.jerarquia_organizacional`

TEXT — árbol org. (`1`, `1.1`, `1.1.1`, …). Script: `report/agregar_jerarquia_rrhh.sql`

---

## 🔗 REFERENCIAS

- **Migración base:** `report/RRHH_COMPLETO.sql`, `report/rrhh_schema.sql`
- **Migración vacaciones:** `report/migrations/080_vacaciones_sistema_dual_reset.sql`
- **Índices:** `report/migrations/090_indices_performance_rrhh.sql`
- **Funcionamiento app:** [FUNCIONAMIENTO_ACTUAL.md](./FUNCIONAMIENTO_ACTUAL.md)
- **Queries TS:** `report/src/app/rrhh/lib/rrhh-queries.ts`, `report/src/app/rrhh/vacaciones/lib/queries.ts`

---

**Última actualización:** 2026-06-16
