# 🏗️ VENTA EN TIENDA - ARQUITECTURA DE DEPÓSITOS

**Fecha:** 7 junio 2026  
**Importancia:** 🔴 CRÍTICA - MEGA PROYECTO ESTRATÉGICO  
**Contexto:** PRIMER PUENTE entre sistema RIMEC y tiendas físicas bazzar

---

## 🎯 VISIÓN ESTRATÉGICA

### El Salto Histórico

```
ANTES: Sistema RIMEC emulaba solo IMPORTACIÓN
        └─> Entrada a importadora ✅
        
AHORA:  Sistema RIMEC alcanza las TIENDAS FÍSICAS
        └─> Primer contacto directo con retail ✅
        └─> Inicio de ABSORCIÓN real de bazzar
```

### Filosofía del Proyecto

**Tomar un simple CSV de stock y:**
1. Estructurarlo con pilares RIMEC (FK total)
2. Crear proceso administrativo completo por detrás
3. Emular parte operativa de empresa a absorber
4. Integrar TODAS las tablas del ecosistema
5. Información aparece "al segundo" (precisión milimétrica)

**Resultado:** Mega sistema operativo que absorbe tiendas bazzar

---

## 🏪 ESTRUCTURA FÍSICA REAL

### 3 Ubicaciones × 2 Tiendas Contiguas = 6 Tiendas Físicas

#### 📍 Fernando de la Mora (Avda. Fernando)
```
┌─────────────────┐  ┌─────────────────┐
│ BAZZAR ADULTOS  │  │ BAZZAR NIÑOS    │
│   (Cliente 2100)│  │   (Cliente 2900)│
│                 │  │                 │
│ Depósito: FER-A │  │ Depósito: FER-N │
└─────────────────┘  └─────────────────┘
    Lado a lado en misma ubicación física
```

#### 📍 San Martin
```
┌─────────────────┐  ┌─────────────────┐
│ BAZZAR ADULTOS  │  │ BAZZAR NIÑOS    │
│   (Cliente 2400)│  │   (Cliente 2700)│
│                 │  │                 │
│ Depósito: SM-A  │  │ Depósito: SM-N  │
└─────────────────┘  └─────────────────┘
    Lado a lado en misma ubicación física
```

#### 📍 Palma
```
┌─────────────────┐  ┌─────────────────┐
│ BAZZAR ADULTOS  │  │ BAZZAR NIÑOS    │
│   (Cliente 3100)│  │   (Cliente 3200)│
│                 │  │                 │
│ Depósito: PAL-A │  │ Depósito: PAL-N │
└─────────────────┘  └─────────────────┘
    Lado a lado en misma ubicación física
```

---

## 🗄️ ARQUITECTURA DE DATOS - 6 TABLAS DE DEPÓSITO

### Concepto Clave

**NO es una tabla unificada.**  
**SON 6 tablas separadas que replican el sistema físico de depósitos de bazzar.**

### Esquema por Depósito

Cada tienda física tiene su propia tabla de depósito:

```sql
-- 1. FERNANDO ADULTOS (2100)
CREATE TABLE deposito_tienda_fernando_adultos (
  id SERIAL PRIMARY KEY,
  
  -- Pilares FK (filosofía del FK total)
  linea_id INT NOT NULL REFERENCES linea_v2(id_linea),
  referencia_id INT NOT NULL REFERENCES referencia_v2(id_referencia),
  material_id INT NOT NULL REFERENCES material_v2(id_material),
  color_id INT NOT NULL REFERENCES color_v2(id_color),
  talla_id INT NOT NULL REFERENCES talla_v2(id_talla),
  marca_id INT NOT NULL REFERENCES marca_v2(id_marca),
  
  -- SKU único (generado desde pilares)
  sku TEXT NOT NULL UNIQUE,
  
  -- Códigos proveedor (desde pilares)
  linea_codigo_proveedor TEXT,
  referencia_codigo_proveedor TEXT,
  
  -- Stock
  stock_inicial INT NOT NULL DEFAULT 0,
  stock_vendido INT NOT NULL DEFAULT 0,
  stock_disponible INT GENERATED ALWAYS AS (stock_inicial - stock_vendido) STORED,
  
  -- Precio
  precio_unitario NUMERIC(10,2) NOT NULL,
  
  -- Metadata
  cliente_id INT NOT NULL DEFAULT 2100 CHECK(cliente_id = 2100),
  sincronizado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CHECK(stock_vendido >= 0),
  CHECK(stock_disponible >= 0),
  CHECK(precio_unitario > 0)
);

-- Índices para performance milimétrica
CREATE INDEX idx_fer_a_disponible ON deposito_tienda_fernando_adultos(stock_disponible) WHERE stock_disponible > 0;
CREATE INDEX idx_fer_a_marca ON deposito_tienda_fernando_adultos(marca_id);
CREATE INDEX idx_fer_a_sku ON deposito_tienda_fernando_adultos(sku);
CREATE INDEX idx_fer_a_pilares ON deposito_tienda_fernando_adultos(linea_id, referencia_id, material_id);

-- Trigger para actualizar timestamp
CREATE TRIGGER update_fer_a_timestamp
  BEFORE UPDATE ON deposito_tienda_fernando_adultos
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 2. FERNANDO NIÑOS (2900)
CREATE TABLE deposito_tienda_fernando_ninos (
  -- Misma estructura
  -- cliente_id INT NOT NULL DEFAULT 2900 CHECK(cliente_id = 2900)
  -- Solo marcas Molekinha/Molekinho permitidas vía trigger
);

-- 3. SAN MARTIN ADULTOS (2400)
CREATE TABLE deposito_tienda_sanmartin_adultos (
  -- cliente_id INT NOT NULL DEFAULT 2400 CHECK(cliente_id = 2400)
);

-- 4. SAN MARTIN NIÑOS (2700)
CREATE TABLE deposito_tienda_sanmartin_ninos (
  -- cliente_id INT NOT NULL DEFAULT 2700 CHECK(cliente_id = 2700)
);

-- 5. PALMA ADULTOS (3100)
CREATE TABLE deposito_tienda_palma_adultos (
  -- cliente_id INT NOT NULL DEFAULT 3100 CHECK(cliente_id = 3100)
);

-- 6. PALMA NIÑOS (3200)
CREATE TABLE deposito_tienda_palma_ninos (
  -- cliente_id INT NOT NULL DEFAULT 3200 CHECK(cliente_id = 3200)
);
```

### Triggers para Marcas (Tiendas Niños)

```sql
-- Trigger: Solo Molekinha/Molekinho en tiendas niños
CREATE OR REPLACE FUNCTION validar_marcas_ninos()
RETURNS TRIGGER AS $$
DECLARE
  v_marca_nombre TEXT;
BEGIN
  -- Obtener nombre de marca
  SELECT descp_marca INTO v_marca_nombre
  FROM marca_v2
  WHERE id_marca = NEW.marca_id;
  
  -- Validar que sea Molekinha o Molekinho
  IF v_marca_nombre NOT IN ('Molekinha', 'Molekinho') THEN
    RAISE EXCEPTION 'Tienda niños solo puede tener marcas Molekinha o Molekinho. Marca recibida: %', v_marca_nombre;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a las 3 tiendas niños
CREATE TRIGGER validar_marcas_fernando_ninos
  BEFORE INSERT OR UPDATE ON deposito_tienda_fernando_ninos
  FOR EACH ROW
  EXECUTE FUNCTION validar_marcas_ninos();

CREATE TRIGGER validar_marcas_sanmartin_ninos
  BEFORE INSERT OR UPDATE ON deposito_tienda_sanmartin_ninos
  FOR EACH ROW
  EXECUTE FUNCTION validar_marcas_ninos();

CREATE TRIGGER validar_marcas_palma_ninos
  BEFORE INSERT OR UPDATE ON deposito_tienda_palma_ninos
  FOR EACH ROW
  EXECUTE FUNCTION validar_marcas_ninos();
```

---

## 🔄 SINCRONIZACIÓN EN TIEMPO REAL - Precisión Milimétrica

### Supabase Realtime en las 6 Tablas

```typescript
// Sistema de suscripción a TODAS las tiendas del mismo tipo

// Cliente conectado a: Fernando Niños (2900)
const setupRealtimeSync = (tipoTienda: 'ADULTOS' | 'NINOS') => {
  const tablas = tipoTienda === 'NINOS' 
    ? [
        'deposito_tienda_fernando_ninos',
        'deposito_tienda_sanmartin_ninos',
        'deposito_tienda_palma_ninos'
      ]
    : [
        'deposito_tienda_fernando_adultos',
        'deposito_tienda_sanmartin_adultos',
        'deposito_tienda_palma_adultos'
      ];
  
  // Suscribirse a las 3 tiendas del mismo tipo
  const channels = tablas.map(tabla => 
    supabase
      .channel(`${tabla}-changes`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tabla
        },
        (payload) => {
          console.log(`[${tabla}] Stock actualizado:`, payload);
          updateStockDisplay(payload);
        }
      )
      .subscribe()
  );
  
  return channels;
};
```

### Flujo de Sincronización Instantánea

```
VENDEDOR A (Fernando Niños) genera ticket:
  1. Click "Generar Ticket" → Molekinha Ref001, 1 par
     ↓
  2. Stored procedure reduce stock en deposito_tienda_fernando_ninos
     ↓
  3. Supabase Realtime dispara evento "postgres_changes"
     ↓
  4. TODOS los tablets conectados reciben evento INSTANTÁNEAMENTE:
     - VENDEDOR B (Fernando Niños) → Ve stock: 24 (antes 25)
     - VENDEDOR C (San Martin Niños) → Ve stock Fernando: 24
     - VENDEDOR D (Palma Niños) → Ve stock Fernando: 24
     ↓
  5. UI actualiza en < 100ms (precisión milimétrica)
```

---

## 📊 VISTA UNIFICADA PARA TABLETS

### Vista SQL que une las 3 tiendas del mismo tipo

```sql
-- Vista: Stock consolidado tiendas NIÑOS
CREATE VIEW v_stock_consolidado_ninos AS
SELECT 
  sku,
  linea_id,
  referencia_id,
  material_id,
  color_id,
  talla_id,
  marca_id,
  linea_codigo_proveedor,
  referencia_codigo_proveedor,
  
  -- Stock por tienda
  MAX(CASE WHEN cliente_id = 2900 THEN stock_disponible ELSE 0 END) AS stock_fernando,
  MAX(CASE WHEN cliente_id = 2700 THEN stock_disponible ELSE 0 END) AS stock_sanmartin,
  MAX(CASE WHEN cliente_id = 3200 THEN stock_disponible ELSE 0 END) AS stock_palma,
  
  -- Stock total
  SUM(stock_disponible) AS stock_total,
  
  -- Precio (mismo en las 3 tiendas)
  MAX(precio_unitario) AS precio_unitario

FROM (
  SELECT sku, linea_id, referencia_id, material_id, color_id, talla_id, marca_id,
         linea_codigo_proveedor, referencia_codigo_proveedor,
         stock_disponible, precio_unitario, cliente_id
  FROM deposito_tienda_fernando_ninos
  
  UNION ALL
  
  SELECT sku, linea_id, referencia_id, material_id, color_id, talla_id, marca_id,
         linea_codigo_proveedor, referencia_codigo_proveedor,
         stock_disponible, precio_unitario, cliente_id
  FROM deposito_tienda_sanmartin_ninos
  
  UNION ALL
  
  SELECT sku, linea_id, referencia_id, material_id, color_id, talla_id, marca_id,
         linea_codigo_proveedor, referencia_codigo_proveedor,
         stock_disponible, precio_unitario, cliente_id
  FROM deposito_tienda_palma_ninos
) AS consolidado

GROUP BY sku, linea_id, referencia_id, material_id, color_id, talla_id, marca_id,
         linea_codigo_proveedor, referencia_codigo_proveedor
HAVING SUM(stock_disponible) > 0;

-- Misma vista para ADULTOS
CREATE VIEW v_stock_consolidado_adultos AS
-- Similar estructura pero con las 3 tiendas adultos
```

### Query en Tablet (Fernando Niños)

```typescript
// Cargar stock consolidado de las 3 tiendas niños
const { data: productos } = await supabase
  .from('v_stock_consolidado_ninos')
  .select(`
    *,
    linea:linea_v2(codigo_proveedor, descp_linea),
    referencia:referencia_v2(codigo_proveedor, descp_referencia),
    marca:marca_v2(descp_marca),
    color:color_v2(descp_color),
    talla:talla_v2(numero_talla)
  `)
  .order('stock_total', { ascending: false });

// Resultado en UI:
// Molekinha Ref001:
//   Fernando: 25 | San Martin: 15 | Palma: 8
```

---

## 🔄 PROCESO ETL: Excel → Depósitos (Filosofía FK)

### Transformación del CSV Simple a Estructura Pilares + Cliente

```typescript
/**
 * ETL: Convierte CSV retail simple en estructura FK completa (Doble Corazón)
 * 
 * CSV entrada (registro_st_vt_rc_reposicion):
 *   - linea_codigo_proveedor, referencia_codigo_proveedor, material, color, talla
 *   - cantidad, precio
 *   - origen_holding (para determinar tienda)
 * 
 * Salida (deposito_tienda_X):
 *   - ❤️ PRIMER CORAZÓN: FK pilares resueltos
 *     └─> linea_id, referencia_id, material_id, color_id, talla_id, marca_id
 *   - 💚 SEGUNDO CORAZÓN: Cliente/Tienda FK
 *     └─> cliente_id (6 IDs de cliente_v2 → Conexión RIMEC + NEXUS)
 *   - SKU generado
 *   - Stock estructurado
 */

async function importarStockATiendas() {
  // 1. Leer CSV retail
  const { data: stockExcel } = await supabase
    .from('registro_st_vt_rc_reposicion')
    .select('*')
    .eq('tipo_movimiento', 'stock');
  
  // 2. Resolver FK de pilares (filosofía del FK)
  const stockConPilares = await Promise.all(
    stockExcel.map(async (row) => {
      // Buscar FK en tablas pilares v2
      const { data: linea } = await supabase
        .from('linea_v2')
        .select('id_linea, codigo_proveedor')
        .eq('codigo_proveedor', row.linea_codigo_proveedor)
        .single();
      
      const { data: referencia } = await supabase
        .from('referencia_v2')
        .select('id_referencia, codigo_proveedor')
        .eq('codigo_proveedor', row.referencia_codigo_proveedor)
        .single();
      
      // ... similar para material, color, talla, marca
      
      return {
        linea_id: linea.id_linea,
        referencia_id: referencia.id_referencia,
        // ... resto de FKs
        sku: generarSKU(linea.id_linea, referencia.id_referencia, /*...*/),
        stock_inicial: row.cantidad,
        precio_unitario: row.precio_unitario
      };
    })
  );
  
  // 3. Separar por marca (adultos vs niños)
  const stockNinos = stockConPilares.filter(s => 
    ['Molekinha', 'Molekinho'].includes(s.marca_nombre)
  );
  
  const stockAdultos = stockConPilares.filter(s => 
    !['Molekinha', 'Molekinho'].includes(s.marca_nombre)
  );
  
  // 4. Distribuir a las 6 tablas de depósito
  // (Aquí necesitas lógica de cómo se distribuye el stock por tienda)
  
  await supabase.from('deposito_tienda_fernando_ninos').upsert(stockNinos);
  await supabase.from('deposito_tienda_fernando_adultos').upsert(stockAdultos);
  // ... etc para las 6 tiendas
}
```

### Generación de SKU desde Pilares

```typescript
function generarSKU(
  linea_id: number,
  referencia_id: number,
  material_id: number,
  color_id: number,
  talla_id: number
): string {
  return `L${linea_id.toString().padStart(4, '0')}-R${referencia_id.toString().padStart(4, '0')}-M${material_id.toString().padStart(3, '0')}-C${color_id.toString().padStart(3, '0')}-T${talla_id.toString().padStart(3, '0')}`;
}

// Ejemplo: L0001-R0023-M001-C005-T038
```

---

## 🎫 SISTEMA DE TICKETS - Integrado con Depósitos

### Stored Procedure por Depósito

```sql
-- Generar ticket desde Fernando Niños
CREATE OR REPLACE FUNCTION generar_ticket_fernando_ninos(
  p_sku TEXT,
  p_vendedor_id INT,
  p_cliente_cedula TEXT,
  p_cantidad INT
) RETURNS UUID AS $$
DECLARE
  v_ticket_id UUID;
  v_stock_actual INT;
BEGIN
  -- Lock row para evitar concurrencia
  SELECT stock_disponible INTO v_stock_actual
  FROM deposito_tienda_fernando_ninos
  WHERE sku = p_sku
  FOR UPDATE;
  
  -- Verificar stock
  IF v_stock_actual < p_cantidad THEN
    RAISE EXCEPTION 'Stock insuficiente en Fernando Niños. Disponible: %, Solicitado: %', v_stock_actual, p_cantidad;
  END IF;
  
  -- Crear ticket
  INSERT INTO tickets (sku, tienda_id, vendedor_id, cliente_cedula, cantidad)
  VALUES (p_sku, 2900, p_vendedor_id, p_cliente_cedula, p_cantidad)
  RETURNING id INTO v_ticket_id;
  
  -- Reducir stock EN ESTA TIENDA
  UPDATE deposito_tienda_fernando_ninos
  SET stock_vendido = stock_vendido + p_cantidad,
      actualizado_en = NOW()
  WHERE sku = p_sku;
  
  -- ↑ Este UPDATE dispara Supabase Realtime
  -- ↑ Todos los tablets conectados ven el cambio INSTANTÁNEAMENTE
  
  RETURN v_ticket_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 🌐 INTEGRACIÓN TOTAL CON ECOSISTEMA RIMEC + NEXUS

### Filosofía del FK - Doble Corazón del Sistema

```
deposito_tienda_X
  │
  ├─> ❤️ PRIMER CORAZÓN: Pilares RIMEC
  │   ├─> linea_id → linea_v2 (FK)
  │   │   └─> codigo_proveedor ✅
  │   │   └─> descp_linea ✅
  │   │
  │   ├─> referencia_id → referencia_v2 (FK)
  │   │   └─> codigo_proveedor ✅
  │   │   └─> descp_referencia ✅
  │   │
  │   ├─> material_id → material_v2 (FK)
  │   │   └─> descp_material ✅
  │   │
  │   ├─> color_id → color_v2 (FK)
  │   │   └─> descp_color ✅
  │   │
  │   ├─> talla_id → talla_v2 (FK)
  │   │   └─> numero_talla ✅
  │   │
  │   └─> marca_id → marca_v2 (FK)
  │       └─> descp_marca ✅
  │
  └─> 💚 SEGUNDO CORAZÓN: Cliente/Tienda (RIMEC + NEXUS)
      └─> cliente_id → cliente_v2 (FK)
          ├─> Conexión RIMEC: Facturación/Tickets ✅
          └─> Conexión NEXUS: Traspasos de mercaderías (FUTURO) 🔮
```

### Doble Función del cliente_id

**PRESENTE (RIMEC):**
- Identificar tienda para facturación
- Generar tickets con cliente correcto
- CSV para sistema legal

**FUTURO (NEXUS):**
- **Traspasos de mercaderías entre tiendas**
- Conexión con datos operativos de NEXUS
- Sistema unificado de movimientos de stock

**Resultado:** Información aparece "al segundo" porque TODO está conectado vía FK doble.

**Ejemplo de query "al segundo":**
```sql
SELECT 
  d.sku,
  d.stock_disponible,
  l.codigo_proveedor AS linea_codigo,
  l.descp_linea,
  r.codigo_proveedor AS ref_codigo,
  r.descp_referencia,
  m.descp_marca,
  c.descp_color,
  t.numero_talla,
  cl.descp_cliente AS tienda
FROM deposito_tienda_fernando_ninos d
JOIN linea_v2 l ON d.linea_id = l.id_linea
JOIN referencia_v2 r ON d.referencia_id = r.id_referencia
JOIN marca_v2 m ON d.marca_id = m.id_marca
JOIN color_v2 c ON d.color_id = c.id_color
JOIN talla_v2 t ON d.talla_id = t.id_talla
JOIN cliente_v2 cl ON d.cliente_id = cl.id_cliente
WHERE d.stock_disponible > 0;
```

---

## 🔄 VISIÓN FUTURA: Traspasos de Mercaderías (NEXUS)

### Segundo Corazón - Conexión con NEXUS

**Por qué los 6 depósitos tienen relación con cliente_id:**

```
Excel básico
  ↓ 
ETL
  ↓
FK resueltos:
  ├─> linea_v2, referencia_v2, material_v2, color_v2, talla_v2, marca_v2
  └─> cliente_id (6 IDs de clientes RIMEC) ← SEGUNDO CORAZÓN
      └─> Conexión futura con NEXUS para traspasos
  ↓
6 depósitos estructurados
  ↓
Información "al segundo" + Traspasos entre tiendas
```

### Escenario Futuro: Traspasos Inteligentes

**Ejemplo de flujo futuro:**

```
VENDEDOR (Fernando Niños):
  "Cliente quiere Molekinha Ref001 talla 38"
  
  Stock actual:
    Fernando: 0 ❌
    San Martin: 5 ✅
    Palma: 2 ✅

SISTEMA:
  1. Detecta stock en otras tiendas del mismo tipo
  2. Vendedor solicita traspaso desde San Martin
  3. Sistema genera:
     ├─> Orden de traspaso (NEXUS)
     ├─> Reduce stock San Martin
     └─> Incrementa stock Fernando (en tránsito)
  4. Mensajero físico lleva el par
  5. Sistema confirma recepción
  6. Stock actualizado en tiempo real
```

### Estructura de Traspasos (FUTURO)

```sql
-- Tabla futura: traspasos_tiendas
CREATE TABLE traspasos_tiendas (
  id SERIAL PRIMARY KEY,
  
  -- Origen y destino (cliente_id de cliente_v2)
  tienda_origen_id INT NOT NULL REFERENCES cliente_v2(id_cliente),
  tienda_destino_id INT NOT NULL REFERENCES cliente_v2(id_cliente),
  
  -- Producto
  sku TEXT NOT NULL,
  cantidad INT NOT NULL,
  
  -- Estado del traspaso
  estado TEXT NOT NULL CHECK(estado IN ('SOLICITADO', 'EN_TRANSITO', 'RECIBIDO', 'CANCELADO')),
  
  -- Trazabilidad
  solicitado_por INT REFERENCES vendedores_tiendas(id),
  solicitado_en TIMESTAMP DEFAULT NOW(),
  despachado_en TIMESTAMP,
  recibido_en TIMESTAMP,
  
  -- Conexión con NEXUS (futuro)
  nexus_movimiento_id INT, -- FK a tabla de movimientos NEXUS
  
  -- Metadata
  observaciones TEXT,
  
  CHECK(tienda_origen_id != tienda_destino_id)
);

-- Índices
CREATE INDEX idx_traspasos_estado ON traspasos_tiendas(estado, tienda_destino_id);
CREATE INDEX idx_traspasos_sku ON traspasos_tiendas(sku, estado);
```

### Flujo de Sincronización con Traspasos

```typescript
// Generar traspaso desde tablet
async function solicitarTraspaso(
  skuSolicitado: string,
  tiendaOrigenId: number,
  tiendaDestinoId: number,
  cantidad: number,
  vendedorId: number
) {
  // 1. Verificar stock en tienda origen
  const { data: stockOrigen } = await supabase
    .from(`deposito_tienda_${getTablaNombre(tiendaOrigenId)}`)
    .select('stock_disponible')
    .eq('sku', skuSolicitado)
    .single();
  
  if (stockOrigen.stock_disponible < cantidad) {
    throw new Error('Stock insuficiente en tienda origen');
  }
  
  // 2. Crear orden de traspaso
  const { data: traspaso } = await supabase
    .from('traspasos_tiendas')
    .insert({
      tienda_origen_id: tiendaOrigenId,
      tienda_destino_id: tiendaDestinoId,
      sku: skuSolicitado,
      cantidad,
      solicitado_por: vendedorId,
      estado: 'SOLICITADO'
    })
    .select()
    .single();
  
  // 3. Reservar stock en origen (no vendido, pero comprometido)
  await supabase.rpc('reservar_stock_traspaso', {
    p_sku: skuSolicitado,
    p_tienda_id: tiendaOrigenId,
    p_cantidad: cantidad,
    p_traspaso_id: traspaso.id
  });
  
  // 4. Notificar a tienda origen (Supabase Realtime)
  // Tablet en San Martin recibe notificación: "Traspaso solicitado por Fernando"
  
  return traspaso;
}
```

### Por qué es el "Segundo Corazón"

**Primer Corazón (Pilares FK):**
- Define QUÉ es el producto (linea, ref, material, color, talla, marca)
- Información descriptiva completa
- Integración con catálogo RIMEC

**Segundo Corazón (Cliente FK + NEXUS):**
- Define DÓNDE está el producto (tienda/depósito)
- Define CÓMO se mueve (traspasos)
- Conexión con operaciones físicas NEXUS

**Juntos forman el sistema completo:**
```
QUÉ (Pilares) + DÓNDE (Cliente) + CÓMO SE MUEVE (Traspasos NEXUS)
= Sistema Operativo Completo de Retail
```

### Ventaja Competitiva de Traspasos

**Sin sistema de traspasos:**
```
Cliente: "¿Tienen talla 38?"
Vendedor: "No, lo siento"
Cliente: Se va sin comprar ❌
```

**Con sistema de traspasos:**
```
Cliente: "¿Tienen talla 38?"
Vendedor: "En esta tienda no, pero tengo 5 en San Martin"
Vendedor: [Solicita traspaso en tablet]
Sistema: "Traspaso confirmado, llega en 30 minutos"
Cliente: Espera y compra ✅
```

**Resultado:**
- ✅ Cero ventas perdidas
- ✅ Stock unificado de las 3 ubicaciones
- ✅ Cliente satisfecho
- ✅ Absorción completa de operación bazzar

---

## 🎯 VALOR ESTRATÉGICO DEL PROYECTO

### Por qué es un Mega Proyecto

**1. Primer Puente Real a Retail**
```
RIMEC antes: Solo importación
RIMEC ahora: Importación + TIENDAS FÍSICAS
```

**2. Sistema Completo de Absorción**
```
CSV simple → FK total → Depósitos → Tickets → CSV legal → Factura
                ↓
        RIMEC controla TODO el ciclo
```

**3. Valor Gigantesco**
- 6 tiendas físicas sincronizadas
- Precisión milimétrica (< 100ms)
- 60 usuarios simultáneos
- Sistema escalable a más tiendas

**4. Tecnología de Punta**
- Supabase Realtime (WebSocket)
- Pilares FK (filosofía RIMEC)
- PostgreSQL stored procedures
- TypeScript + Next.js

---

## 📝 DOCUMENTACIÓN CRÍTICA

**Este documento es LA BASE del mega proyecto.**

**Próximos pasos:**
1. ✅ Arquitectura de 6 depósitos documentada
2. ⏳ Ver bosquejo UI
3. ⏳ Diseñar flujo login por tienda
4. ⏳ Implementar sistema de sincronización
5. ⏳ Crear proceso ETL completo
6. ⏳ Testing con 60 usuarios simultáneos

---

**NIVEL DE IMPORTANCIA:** 🔴🔴🔴 MÁXIMA  
**IMPACTO:** Histórico - Primer contacto RIMEC con retail físico  
**ESTRATEGIA:** Absorción gradual de bazzar vía tecnología superior
