# TABLET BAZZAR - Arquitectura y Decisiones Técnicas

**Fecha:** 2026-06-08  
**Estado:** Fase preparatoria completada  
**Objetivo:** Sistema POS para vendedores en tienda física

---

## 🎯 VISIÓN GENERAL

### Problema a resolver
Los vendedores en tienda física (Fernando, San Martín, Palma × Adultos/Niños) necesitan:
- Registrar ventas rápidamente
- Crear tickets de venta con pilares
- Gestionar clientes (cliente_web)
- Trabajar con/sin internet
- Acceso desde cualquier tablet

### Solución
**Dos componentes integrados:**

```
┌─────────────────────────────────────────────────────────────┐
│                     TABLET BAZZAR                            │
│                                                              │
│  ┌──────────────────────┐      ┌─────────────────────────┐  │
│  │  PWA Independiente   │      │   Report (Monitoreo)    │  │
│  │  tablet-bazzar/      │      │   report/tablet-bazzar  │  │
│  ├──────────────────────┤      ├─────────────────────────┤  │
│  │ Vendedores CREAN     │──┬──→│ Admin MONITOREA         │  │
│  │ tickets en tienda    │  │   │ tickets (ORO)           │  │
│  │                      │  │   │                         │  │
│  │ - Login código (22)  │  │   │ - Dashboard ventas      │  │
│  │ - Buscar productos   │  │   │ - Analytics tickets     │  │
│  │ - Crear ticket       │  │   │ - Reportes por tienda   │  │
│  │ - Registrar cliente  │  │   │ - KPIs vendedores       │  │
│  │ - Offline-first      │  │   │ - Auditoria             │  │
│  └──────────────────────┘  │   └─────────────────────────┘  │
│                            │                                 │
│                            ↓                                 │
│                    ┌──────────────┐                          │
│                    │   Supabase   │                          │
│                    │              │                          │
│                    │ - tickets    │                          │
│                    │ - cliente_web│                          │
│                    │ - usuarios_  │                          │
│                    │   tablet     │                          │
│                    │ - depositos  │                          │
│                    └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 DECISIÓN 1: TECNOLOGÍA → NEXT.JS PWA

### Opciones evaluadas
1. ✅ **Next.js PWA** (ELEGIDA)
2. ❌ React Native
3. ❌ Android Nativo

### Razones de la decisión

**Next.js PWA gana por:**

| Criterio | Next.js PWA | React Native | Android |
|----------|-------------|--------------|---------|
| Costo | $0 | $124/año | $25 |
| Tiempo desarrollo | Rápido | Medio | Lento |
| Actualizaciones | Instantáneas | 1-3 días | 1-3 días |
| Plataformas | Todas | Android+iOS | Solo Android |
| Expertise equipo | Alto | Bajo | Muy bajo |
| Deploy | git push | App Store | Play Store |
| Offline | Service Workers | Nativo | Nativo |

**Ventajas clave:**
- ✅ Funciona en cualquier tablet (Android, iPad, Windows)
- ✅ Instalable como app nativa
- ✅ Actualizaciones sin esperar aprobaciones
- ✅ $0 costo adicional (Vercel Pro ya pagado)
- ✅ Mismo stack que Report/Bazzar-web
- ✅ Deploy en 2 minutos

**Instalación del vendedor:**
```
1. Abre Chrome en tablet
2. Navega a: tablet.bazzar.com.py
3. Chrome pregunta: "¿Instalar aplicación?"
4. Toca "Instalar"
5. Icono aparece en pantalla principal
6. Funciona como app nativa
```

---

## 🏗️ DECISIÓN 2: ARQUITECTURA → PROYECTO SEPARADO

### ¿Por qué separar de Report?

**Report vs Tablet Bazzar:**

| Aspecto | Report | Tablet Bazzar |
|---------|--------|---------------|
| **Usuario** | Dirección (5-10) | Vendedores (60+) |
| **Dónde** | Oficina | Tienda física |
| **Dispositivo** | Desktop | Tablet |
| **Internet** | Siempre | Puede fallar |
| **UI** | Desktop-first | Touch-first |
| **Propósito** | Analizar | Crear tickets |
| **Actualizar** | Controlado | Frecuente |

**Estructura aprobada:**
```
Nexus_Core/
├── control_central/     # Streamlit (Aprobaciones FI)
├── report/              # Next.js (Dashboards dirección)
│   └── tablet-bazzar/   # Dashboard monitoreo tickets ← ORO
├── rimec-web/           # Next.js (Vendedores B2B)
├── bazzar-web/          # Next.js (E-commerce B2C)
└── tablet-bazzar/       # Next.js PWA (POS tienda) ← NUEVO
```

**Beneficios:**
1. ✅ Deploy independiente (no afecta Report)
2. ✅ UI optimizada para touch
3. ✅ Dominio propio (profesional)
4. ✅ Escalabilidad (60+ vendedores)
5. ✅ Testing en producción sin riesgo

---

## 👤 DECISIÓN 3: USUARIOS → TABLA DEDICADA

### Tabla: `usuarios_de_tablet`

**Por qué NO reutilizar `usuario_v2`:**
- `usuario_v2` = Usuarios de Nexus/RIMEC (dirección, admin)
- Vendedores de tienda = Otro ecosistema

**Estructura creada:**
```sql
CREATE TABLE usuarios_de_tablet (
  id BIGSERIAL PRIMARY KEY,
  
  -- Datos personales
  cedula VARCHAR(20) NOT NULL UNIQUE,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  
  -- Código de vendedor (login rápido)
  codigo_vendedor INTEGER NOT NULL UNIQUE,  -- Ejemplo: 22
  
  -- Estado
  activo BOOLEAN DEFAULT TRUE,
  
  -- Auditoría
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_usuarios_tablet_codigo ON usuarios_de_tablet(codigo_vendedor);
CREATE INDEX idx_usuarios_tablet_cedula ON usuarios_de_tablet(cedula);
CREATE INDEX idx_usuarios_tablet_activo ON usuarios_de_tablet(activo) WHERE activo = TRUE;
```

**Flujo de autenticación (definido por Director):**
```
[Pendiente - Director definirá el flujo exacto]
```

**Futuro: Huella digital**
- Tablets modernas soportan WebAuthn API
- Biometría como alternativa al código
- Implementable cuando tengan tablets con lector

---

## 👥 DECISIÓN 4: CLIENTES → REUTILIZAR `cliente_web`

### Tabla: `cliente_web`

**Por qué reutilizar:**
- ✅ Cliente puede comprar online Y en tienda
- ✅ Historial unificado
- ✅ Trazabilidad completa

**Campos existentes:**
```sql
cliente_web:
  id
  cedula         -- Campo clave (3833142)
  email
  telefono
  direccion
  created_at
  updated_at
```

**Nuevo campo (futuro):**
```sql
canal_registro VARCHAR(10) DEFAULT 'TIENDA'
-- 'TIENDA' = Registrado en tienda física (20 años de historia)
-- 'WEB'    = Registrado en bazzar-web (nuevo)
```

**Respeto a la tienda física:**
- Default 'TIENDA' porque llevan 20 años operando
- Bazzar Web es el canal NUEVO
- La base de clientes existente es de tienda

---

## 🎫 TICKETS = ORO DEL NEGOCIO

### ¿Qué es un ticket?

**Venta en tienda física:**
```
Vendedor: María (código 22)
Cliente: Héctor (cédula 3833142)
Tienda: Fernando Adultos
Productos:
  - MOLEKINHO 2400-139 T.35 × 2 pares
  - MOLEKINHA 2305-1579 T.36 × 1 par
Total: 3 pares
```

### Tabla: `tickets` (a diseñar)

**Campos propuestos (pendiente confirmar):**
```sql
tickets:
  id
  numero_ticket       -- Autoincrementable por tienda
  vendedor_tablet_id  -- FK → usuarios_de_tablet
  cliente_web_id      -- FK → cliente_web
  tienda_id           -- 2100, 2900, 2400, etc.
  fecha_venta
  total_pares
  total_monto
  estado              -- BORRADOR, CONFIRMADO, ANULADO
  created_at

ticket_detalle:
  id
  ticket_id
  combinacion_id      -- FK → combinacion (5 pilares)
  cantidad            -- Pares vendidos
  precio_unitario
  subtotal
```

**Por qué es ORO:**
1. Representa venta REAL (no proyección)
2. Trazabilidad completa con pilares
3. Performance de vendedores
4. Inventario real-time
5. Comisiones y metas
6. Analytics de tienda

---

## 🏪 MÓDULO EN REPORT: MONITOREO

### Propósito

**Report → Tablet Bazzar:**
- ✅ Dashboard de tickets creados
- ✅ Analytics por tienda
- ✅ Performance de vendedores
- ✅ KPIs (tickets/día, pares/ticket, etc.)
- ✅ Auditoria y trazabilidad

**NO es para:**
- ❌ Crear tickets (eso lo hace PWA)
- ❌ Usar en tablet (optimizado desktop)

### Estado actual

**Archivo:** `report/src/app/tablet-bazzar/page.tsx`  
**Estado:** Placeholder - En construcción

**Contenido actual:**
```typescript
// Página placeholder que explica:
// - Módulo en construcción
// - Próximas funcionalidades
// - Registro vendedores, tickets, etc.
```

**Cuando PWA esté listo:**
```typescript
// Dashboard con:
// - Tabla de tickets recientes
// - Gráficos de ventas por tienda
// - Ranking de vendedores
// - Alertas y anomalías
```

---

## 🔐 PERMISOS Y ROLES

### Report (actual)

**Roles actualizados:**
```typescript
ROLE_ROUTES = {
  1: ['/tablet-bazzar'],  // Admin - Monitoreo completo
  2: ['/tablet-bazzar'],  // Retail - Monitoreo de su área
  3: []                    // Vendedor B2B - Sin acceso
}
```

**APIs:**
```typescript
ROLE_API_ROUTES = {
  1: [/^\/api\/tablet-bazzar\//],  // Admin - Todo
  2: [/^\/api\/tablet-bazzar\//],  // Retail - Filtrado por tienda
  3: []
}
```

### Tablet Bazzar PWA (futuro)

**Solo un tipo de usuario:**
- Vendedor de tienda
- Login por código numérico (22)
- Sin roles complejos
- Todos ven misma interfaz
- Filtros por tienda_id automáticos

---

## 🧩 PILARES Y CÓDIGO PROVEEDOR

### Verificación completada

**Los 5 pilares están listos para múltiples proveedores:**

```sql
-- Constraint en cada tabla pilar:
UNIQUE(proveedor_id, codigo_proveedor)

-- Permite:
Proveedor A → código 2400
Proveedor B → código 2400
-- Sin conflictos ✅
```

**Tablas verificadas:**
- ✅ `linea` → UNIQUE(proveedor_id, codigo_proveedor)
- ✅ `referencia` → UNIQUE(proveedor_id, linea_id, codigo_proveedor)
- ✅ `material` → UNIQUE(proveedor_id, codigo_proveedor)
- ✅ `color` → UNIQUE(proveedor_id, codigo_proveedor)
- ✅ `talla` → talla_etiqueta (universal)

**Migración:** `migrations/004_refaccion_identidad.sql`

---

## 📊 HUB COMERCIAL - ESTADO ACTUAL

### Acordeones reorganizados

**🏢 RIMEC (Azul) - Roles: 1, 3**
- 📊 RIMEC — Ventas `[1]`
- 🖼️ Ventas + Fotos `[1, 3]`
- ✅ Aprobaciones `[1]`

**🏪 BAZZAR (Verde) - Roles: 1, 2**
- 👟 Stock / Retail `[1, 2]`
- 🏪 Depósitos Bazzar `[1, 2]`
- 📱 Tablet Bazzar `[1, 2]` ← NUEVO (monitoreo)

**📄 Recursos Adicionales**
- 📄 Anexo Documental `[1]`

---

## 📂 ARCHIVOS CREADOS

### Base de datos
```
control_central/migrations/016_usuarios_de_tablet.sql
```

### Report (módulo monitoreo)
```
report/src/app/page.tsx                      # Módulo agregado
report/src/app/tablet-bazzar/page.tsx        # Placeholder
report/middleware.ts                          # Rutas autorizadas
report/src/components/report/NexusGlobalHeader.tsx  # Navbar
```

---

## 🚀 PRÓXIMOS PASOS

### Fase 1: Setup proyecto PWA (Próxima sesión)
1. Crear proyecto `tablet-bazzar/` en Nexus_Core
2. Setup Next.js con PWA
3. Configurar Supabase
4. Crear estructura base

### Fase 2: UI/UX Tablet (A definir)
1. Diseño touch-first
2. Login por código
3. Búsqueda de productos
4. Creación de tickets

### Fase 3: Offline-first (A definir)
1. Service Workers
2. Caché local
3. Sincronización

### Fase 4: Integración Report (A definir)
1. Dashboard de tickets
2. Analytics
3. Reportes

---

## 💎 FILOSOFÍA: EL ORO SON LOS TICKETS

**Por qué:**
- Tickets = Ventas reales (no proyecciones)
- Con pilares = Trazabilidad molecular
- Por vendedor = Performance y comisiones
- Por tienda = Inventario real-time
- Por cliente = Historial de compras

**Objetivo:**
```
Vendedor crea ticket en tablet
→ Sube a Supabase
→ Director monitorea en Report
→ Analytics en tiempo real
→ Decisiones basadas en datos
```

---

## 📝 DECISIONES PENDIENTES DEL DIRECTOR

El Director debe definir:
1. **Flujo de autenticación exacto** (dónde y cómo usar código_vendedor)
2. **Estructura tabla tickets** (confirmar campos propuestos)
3. **Flujo de creación de ticket** (paso a paso)
4. **Reglas de negocio** (descuentos, métodos pago, etc.)
5. **Diseño UI/UX** (colores, layout, botones)

---

## 🎯 ESTADO ACTUAL

✅ **Arquitectura decidida**  
✅ **Tecnología elegida (Next.js PWA)**  
✅ **Proyecto separado aprobado**  
✅ **Tabla usuarios_de_tablet creada**  
✅ **Módulo placeholder en Report**  
✅ **Pilares verificados para multi-proveedor**  
✅ **Permisos configurados**

⏸️ **Pausado - Próxima sesión: Crear proyecto PWA**

---

**Documentado por:** Claude Sonnet 4.5  
**Fecha:** 2026-06-08  
**Co-Authored-By:** Héctor Segovia (Director)
