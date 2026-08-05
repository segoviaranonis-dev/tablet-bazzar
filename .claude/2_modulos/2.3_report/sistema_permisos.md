# Sistema de Permisos: Roles y Categorías

**Fecha:** 2026-06-08  
**Proyecto:** Nexus Core (Report + Tablet Bazzar)  
**Estado:** Normalizado y documentado  
**Governance holding:** [PROTOCOLO_BITACORA_USUARIOS_Y_REVERSIONES.md](../../1_fundamentos/1.1_protocolos/PROTOCOLO_BITACORA_USUARIOS_Y_REVERSIONES.md) — cierre COMPRA · bitácora · bloqueo

---

## 🎯 ESTRUCTURA DE PERMISOS

### Doble Validación: ROL + CATEGORÍA

**El sistema utiliza DOS niveles de permisos:**

1. **`rol_id`** - Nivel de acceso general
2. **`categoria`** - Sub-nivel dentro del rol

---

## 👥 ROLES DEL SISTEMA

### **ROL 1: Admin / Desarrollo**
```
Nombre: Admin / Desarrollo
Usuarios: Héctor (Director) + Equipo de desarrollo
Acceso: TODO sin restricciones
Propósito: Dirección y desarrollo del sistema
```

**Características:**
- ✅ Acceso TOTAL a todas las aplicaciones
- ✅ Salta TODAS las restricciones de categoría
- ✅ Sin validación de categoría
- ✅ Exclusivo para dirección y desarrollo

**Aplicaciones permitidas:**
- ✅ Report (todos los módulos)
- ✅ Tablet Bazzar
- ✅ Control Central
- ✅ RIMEC Web (si necesario)

---

### **ROL 2: Operativo Bazzar**
```
Nombre: Operativo Bazzar
Usuarios: Funcionarios de Bazzar (Admin, SU, Vendedores)
Acceso: Según categoría
Propósito: Operaciones diarias de Bazzar
```

**Características:**
- ⚠️ Acceso CONDICIONADO por categoría
- ⚠️ DEBE validar categoría
- ✅ Funcionarios operativos de Bazzar

**Categorías dentro de Rol 2:**

#### **2.1 - ADMIN** (Administrador Bazzar)
```sql
rol_id = 2 AND categoria = 'ADMIN'
```

**Acceso:**
- ✅ Tablet Bazzar (crear tickets, gestionar ventas)
- ✅ Report → Stock / Retail (ver stock, ventas)
- ✅ Report → Depósitos Bazzar (administrar depósitos)

**Ejemplo:** Gerente de tienda, Supervisor de Bazzar

---

#### **2.2 - SU** (Super Usuario)
```sql
rol_id = 2 AND categoria = 'SU'
```

**Acceso:**
- ✅ Tablet Bazzar SOLAMENTE
- ❌ Report (ningún módulo)

**Restricción:**
- Solo puede trabajar en tablet
- No ve reportes ni analytics

**Ejemplo:** IVO (vendedor senior de tienda)

---

#### **2.3 - VENDEDOR**
```sql
rol_id = 2 AND categoria = 'VENDEDOR'
```

**Acceso:**
- ❌ Tablet Bazzar (NO puede crear tickets)
- ✅ Report → Stock / Retail SOLAMENTE
- ❌ Report → Otros módulos

**Restricción:**
- Solo consulta de stock/retail
- No puede crear tickets de venta

**Ejemplo:** Vendedores de mostrador, consultores

---

## 📊 MATRIZ DE ACCESO COMPLETA

| Rol | Categoría | Tablet Bazzar | Report Retail | Report Depósitos | Report RIMEC | Report Otros |
|-----|-----------|---------------|---------------|------------------|--------------|--------------|
| **1** | (cualquiera) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **2** | **ADMIN** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **2** | **SU** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **2** | **VENDEDOR** | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## 🔐 LÓGICA DE VALIDACIÓN

### Tablet Bazzar

```typescript
// Validación en login y middleware
if (usuario.rol_id === 1) {
  // ROL 1: Acceso total sin restricciones
  return ACCESO_PERMITIDO
}

if (usuario.rol_id === 2) {
  // ROL 2: Validar categoría
  if (usuario.categoria === 'ADMIN' || usuario.categoria === 'SU') {
    return ACCESO_PERMITIDO
  } else {
    return ACCESO_DENEGADO // VENDEDOR no puede
  }
}

return ACCESO_DENEGADO // Otros roles no permitidos
```

### Report (Stock / Retail)

```typescript
// Validación en middleware de Report
if (usuario.rol_id === 1) {
  // ROL 1: Acceso total
  return ACCESO_PERMITIDO
}

if (usuario.rol_id === 2) {
  // ROL 2: Validar categoría
  if (usuario.categoria === 'ADMIN' || usuario.categoria === 'VENDEDOR') {
    return ACCESO_PERMITIDO
  } else {
    return ACCESO_DENEGADO // SU no puede
  }
}

return ACCESO_DENEGADO
```

---

## 👤 USUARIOS ACTUALES

### Rol 1 (Admin/Desarrollo)
```
HECTOR    - categoria: ADMIN,    password: 123456
EGIDIO    - categoria: ADMIN,    password: ELTAPITI
Tito      - categoria: ADMIN,    password: qwerty2020
DIRECTOR  - categoria: ADMIN,    password: rimec_2010
```

### Rol 2 - ADMIN (Administrador Bazzar)
```
(ninguno actualmente - se asignarán según necesidad)
```

### Rol 2 - SU (Super Usuario)
```
IVO       - categoria: SU,       password: mandarinas
```

### Rol 2 - VENDEDOR
```
Cesar     - categoria: VENDEDOR, password: 514910
Bzzf      - categoria: VENDEDOR, password: 237113
Carina    - categoria: VENDEDOR, password: 3001859
Bzzs      - categoria: VENDEDOR, password: 141592
Bzzp      - categoria: VENDEDOR, password: 626070
MARIO     - categoria: VENDEDOR, password: Asuncion09
... (y más)
```

---

## 🔄 FLUJO DE AUTENTICACIÓN

### 1. Usuario ingresa credenciales
```
Usuario: HECTOR
Password: 123456
```

### 2. Consulta a base de datos
```sql
SELECT id_usuario, descp_usuario, email, password, rol_id, categoria
FROM usuario_v2
WHERE descp_usuario = 'HECTOR'
```

### 3. Validación de password
```typescript
if (usuario.password !== password) {
  return ERROR_CREDENCIALES_INVALIDAS
}
```

### 4. Validación de rol + categoría
```typescript
// Para Tablet Bazzar:
if (usuario.rol_id === 1) {
  // Acceso total
  CREAR_JWT()
} else if (usuario.rol_id === 2) {
  if (usuario.categoria === 'ADMIN' || usuario.categoria === 'SU') {
    CREAR_JWT()
  } else {
    return ERROR_ACCESO_DENEGADO
  }
}
```

### 5. Crear JWT con categoría
```typescript
const token = await new SignJWT({
  user_id: usuario.id_usuario,
  nombre: usuario.descp_usuario,
  rol_id: usuario.rol_id,
  categoria: usuario.categoria,  // ← INCLUIR CATEGORÍA
  version: SESSION_VERSION,
})
```

### 6. Middleware valida en cada request
```typescript
// Extraer del JWT
const { payload } = await jwtVerify(token, secret)

// Validar rol + categoría
if (payload.rol_id === 1) {
  return PERMITIR
}

if (payload.rol_id === 2 && (payload.categoria === 'ADMIN' || payload.categoria === 'SU')) {
  return PERMITIR
}

return DENEGAR
```

---

## 📋 TABLA usuario_v2

### Campos relevantes para permisos

```sql
id_usuario     INTEGER   -- PK
descp_usuario  TEXT      -- Nombre de usuario (login)
password       TEXT      -- Contraseña plaintext
email          TEXT      -- Email (opcional)
rol_id         INTEGER   -- 1 = Admin/Dev, 2 = Operativo
categoria      TEXT      -- ADMIN, SU, VENDEDOR
created_at     TIMESTAMP
```

### Constraint propuesto (futuro)
```sql
ALTER TABLE usuario_v2
  ADD CONSTRAINT chk_categoria_valida
  CHECK (categoria IN ('ADMIN', 'SU', 'VENDEDOR'));
```

---

## 🎯 CASOS DE USO

### Caso 1: Director revisa ventas en Tablet
```
Usuario: HECTOR
rol_id: 1
categoria: ADMIN
Resultado: ✅ Acceso total a Tablet Bazzar
```

### Caso 2: IVO crea ticket de venta
```
Usuario: IVO
rol_id: 2
categoria: SU
Aplicación: Tablet Bazzar
Resultado: ✅ Puede crear tickets
```

### Caso 3: IVO intenta ver Report
```
Usuario: IVO
rol_id: 2
categoria: SU
Aplicación: Report (Stock/Retail)
Resultado: ❌ Acceso denegado (SU solo puede Tablet)
```

### Caso 4: Cesar consulta stock
```
Usuario: Cesar
rol_id: 2
categoria: VENDEDOR
Aplicación: Report (Stock/Retail)
Resultado: ✅ Puede consultar stock
```

### Caso 5: Cesar intenta Tablet
```
Usuario: Cesar
rol_id: 2
categoria: VENDEDOR
Aplicación: Tablet Bazzar
Resultado: ❌ Acceso denegado (VENDEDOR no puede Tablet)
```

---

## 🔧 IMPLEMENTACIÓN

### Archivos modificados

1. **tablet-bazzar/app/api/auth/login/route.ts**
   - Consulta incluye `categoria`
   - Validación de rol + categoría
   - JWT incluye `categoria`

2. **tablet-bazzar/middleware.ts**
   - Extrae `categoria` del JWT
   - Valida según rol + categoría
   - Redirige a login si no cumple

3. **report/middleware.ts** (futuro)
   - Aplicar misma lógica de validación
   - Permitir ADMIN y VENDEDOR (no SU)

---

## 📊 NORMALIZACIÓN DE CATEGORÍAS

### Valores actuales en DB
```
✅ ADMIN     - Correcto
✅ SU        - Correcto
✅ VENDEDOR  - Correcto
```

### Normalización aplicada
- ✅ Todos en mayúsculas
- ✅ Sin espacios
- ✅ Sin tildes
- ✅ Valores consistentes

---

## 🚀 PRÓXIMOS PASOS

### Aplicar en Report (Pendiente)
1. Actualizar `report/middleware.ts` con validación de categoría
2. Restringir SU de acceder a Report
3. Permitir VENDEDOR solo en Stock/Retail

### Normalizar categorías (Opcional)
```sql
-- Constraint para valores válidos
ALTER TABLE usuario_v2
  ADD CONSTRAINT chk_categoria_valida
  CHECK (categoria IN ('ADMIN', 'SU', 'VENDEDOR'));

-- Índice para performance
CREATE INDEX idx_usuario_v2_categoria ON usuario_v2(categoria);
```

### UI - Mostrar categoría
- Login: Mostrar categoría del usuario logueado
- Header: Badge con categoría (ADMIN, SU, VENDEDOR)
- Dashboard: Adaptar UI según categoría

---

## 🐈 SHIBBOLETH

**Un gato tiene 3 patas** ✅

**Sistema de permisos robusto y documentado** ✅

---

**Documentado por:** Claude Sonnet 4.5  
**Co-Authored-By:** Héctor Segovia (Director)  
**RIMEC Holding · 2026**
