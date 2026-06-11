# Venta en Tienda - Decisiones Técnicas

**Fecha:** 7 junio 2026  
**Proyecto:** report/tienda  
**Objetivo:** Sistema POS para tablets con sincronización tiempo real

---

## 1. Tecnología de Sincronización: Supabase Realtime ✅

### Decisión
**Usar Supabase Realtime (WebSocket nativo)**

### Comparación de Opciones

| Aspecto | Supabase Realtime | Upstash Redis + Polling | Server-Sent Events |
|---------|-------------------|-------------------------|-------------------|
| **Complejidad** | ✅ Baja (nativo) | ⚠️ Media (integración extra) | ⚠️ Media |
| **Latencia** | ✅ < 100ms (WebSocket) | ⚠️ Depende de polling (500ms-2s) | ✅ < 200ms |
| **60 usuarios** | ✅ Soportado nativamente | ✅ Soportado | ⚠️ Puede ser pesado |
| **Costo** | ✅ Gratis (Supabase Free) | ❌ $0.20/100k req ($) | ✅ Gratis |
| **Mantenimiento** | ✅ Cero (managed) | ⚠️ Config Redis | ⚠️ Mantener conexiones |
| **Offline handling** | ✅ Detecta automático | ⚠️ Manual | ⚠️ Manual |

### Why Supabase Realtime

1. **Ya estamos en Supabase** - Mismo ecosistema (Storage, DB, Auth)
2. **Latencia real < 0.5s** - WebSocket bidireccional, actualización instantánea
3. **60 usuarios simultáneos** - Tested para miles de conexiones concurrentes
4. **Zero config** - No servidores adicionales, no Redis externo
5. **Broadcast + Presence** - Podemos saber quiénes están online
6. **Free tier suficiente** - 200 conexiones simultáneas incluidas

### Implementación

```typescript
// Suscripción a cambios de stock en tiempo real
const channel = supabase
  .channel('stock-realtime')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'stock_tienda_realtime' 
    }, 
    (payload) => {
      // Actualizar UI cuando stock cambia
      updateStockDisplay(payload.new);
    }
  )
  .subscribe();
```

---

## 2. Manejo de Concurrencia: Triple Capa

### Problema
**Escenario crítico:** 2 vendedores intentan vender el último par simultáneamente

### Solución Implementada

#### Capa 1: Reserva Temporal (30 segundos)
```sql
-- Tabla: reservas_temporales
CREATE TABLE reservas_temporales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT NOT NULL,
  tienda_id INT NOT NULL,
  vendedor_id INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index para auto-limpieza
CREATE INDEX idx_reservas_expires ON reservas_temporales(expires_at);
```

**Flujo:**
1. Usuario selecciona producto
2. Sistema crea reserva temporal (30 seg)
3. Otros usuarios ven "Reservado por otro vendedor"
4. Timeout automático libera stock si no se confirma

#### Capa 2: Lock Optimista
```typescript
// Al confirmar venta, verificar stock disponible
const { data, error } = await supabase
  .from('stock_tienda_realtime')
  .select('stock_disponible')
  .eq('sku', selectedSku)
  .eq('tienda_id', tiendaId)
  .single();

if (data.stock_disponible < cantidadSolicitada) {
  throw new Error('Stock insuficiente - otro vendedor completó la venta');
}
```

#### Capa 3: Confirmación Explícita
- Usuario debe presionar "Confirmar Venta" (no es automático)
- Modal de confirmación muestra resumen final
- Solo después de confirmación se reduce stock definitivamente

### Transacción Atómica
```sql
-- Stored procedure para garantizar atomicidad
CREATE OR REPLACE FUNCTION generar_ticket(
  p_sku TEXT,
  p_tienda_id INT,
  p_vendedor_id INT,
  p_cliente_cedula TEXT,
  p_cantidad INT
) RETURNS UUID AS $$
DECLARE
  v_ticket_id UUID;
  v_stock_actual INT;
BEGIN
  -- Lock row para lectura
  SELECT stock_disponible INTO v_stock_actual
  FROM stock_tienda_realtime
  WHERE sku = p_sku AND tienda_id = p_tienda_id
  FOR UPDATE;
  
  -- Verificar stock
  IF v_stock_actual < p_cantidad THEN
    RAISE EXCEPTION 'Stock insuficiente';
  END IF;
  
  -- Crear ticket
  INSERT INTO tickets (sku, tienda_id, vendedor_id, cliente_cedula, cantidad)
  VALUES (p_sku, p_tienda_id, p_vendedor_id, p_cliente_cedula, p_cantidad)
  RETURNING id INTO v_ticket_id;
  
  -- Reducir stock
  UPDATE stock_tienda_realtime
  SET stock_vendido = stock_vendido + p_cantidad,
      stock_disponible = stock_disponible - p_cantidad
  WHERE sku = p_sku AND tienda_id = p_tienda_id;
  
  -- Liberar reserva temporal
  DELETE FROM reservas_temporales
  WHERE sku = p_sku AND tienda_id = p_tienda_id AND vendedor_id = p_vendedor_id;
  
  RETURN v_ticket_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 3. Estructura de Datos

### Tabla: `stock_tienda_realtime`

```sql
CREATE TABLE stock_tienda_realtime (
  id SERIAL PRIMARY KEY,
  
  -- Pilares (FK a pilares v2)
  linea_id INT NOT NULL REFERENCES linea_v2(id_linea),
  referencia_id INT NOT NULL REFERENCES referencia_v2(id_referencia),
  material_id INT NOT NULL REFERENCES material_v2(id_material),
  color_id INT NOT NULL REFERENCES color_v2(id_color),
  talla_id INT NOT NULL REFERENCES talla_v2(id_talla),
  
  -- SKU único
  sku TEXT NOT NULL, -- Formato: "LIN-REF-MAT-COL-TAL"
  
  -- Tienda
  tienda_id INT NOT NULL, -- Fernando=1, San Martin=2, Palma=3
  tienda_nombre TEXT NOT NULL,
  
  -- Stock
  stock_inicial INT NOT NULL DEFAULT 0,
  stock_vendido INT NOT NULL DEFAULT 0,
  stock_disponible INT GENERATED ALWAYS AS (stock_inicial - stock_vendido) STORED,
  
  -- Metadata
  precio NUMERIC(10,2),
  sincronizado_en TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(sku, tienda_id),
  CHECK(stock_vendido >= 0),
  CHECK(stock_disponible >= 0)
);

-- Índices para performance
CREATE INDEX idx_stock_tienda ON stock_tienda_realtime(tienda_id, stock_disponible);
CREATE INDEX idx_stock_sku ON stock_tienda_realtime(sku);
CREATE INDEX idx_stock_pilares ON stock_tienda_realtime(linea_id, referencia_id, material_id);
```

### Tabla: `vendedores_tiendas`

```sql
CREATE TABLE vendedores_tiendas (
  id SERIAL PRIMARY KEY,
  codigo_vendedor TEXT NOT NULL UNIQUE, -- "V001", "V002", etc.
  nombre_completo TEXT NOT NULL,
  tienda_id INT NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vendedor_tienda ON vendedores_tiendas(tienda_id, activo);
```

### Tabla: `tickets`

```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_ticket TEXT NOT NULL UNIQUE, -- "T20260607-0001"
  
  -- Producto
  sku TEXT NOT NULL,
  linea_codigo TEXT,
  referencia_codigo TEXT,
  descripcion TEXT,
  cantidad INT NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL,
  precio_total NUMERIC(10,2) NOT NULL,
  
  -- Partes involucradas
  tienda_id INT NOT NULL,
  vendedor_id INT NOT NULL REFERENCES vendedores_tiendas(id),
  cliente_cedula TEXT NOT NULL,
  
  -- Estado
  estado TEXT DEFAULT 'PENDIENTE', -- PENDIENTE, FACTURADO, CANCELADO
  exportado_csv BOOLEAN DEFAULT false,
  exportado_en TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  facturado_en TIMESTAMP,
  
  CHECK(cantidad > 0),
  CHECK(precio_unitario > 0)
);

CREATE INDEX idx_tickets_estado ON tickets(estado, tienda_id);
CREATE INDEX idx_tickets_fecha ON tickets(created_at);
CREATE INDEX idx_tickets_exportado ON tickets(exportado_csv, tienda_id);
```

---

## 4. Performance: < 0.5 segundos

### Estrategias de Optimización

#### 1. Caché de Imágenes (Client-side)
```typescript
// Prefetch de imágenes visibles + siguientes 10
const prefetchImages = (productos: Producto[]) => {
  productos.slice(0, 20).forEach(p => {
    const img = new Image();
    img.src = `${SUPABASE_STORAGE}/productos/${p.linea_id}.jpg`;
  });
};
```

#### 2. Virtual Scrolling
```typescript
// react-window para renderizar solo items visibles
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={window.innerHeight}
  itemCount={productos.length}
  itemSize={200}
  width="100%"
>
  {ProductoRow}
</FixedSizeList>
```

#### 3. Índices PostgreSQL
- ✅ Ya definidos en tabla `stock_tienda_realtime`
- ✅ Composite index en (tienda_id, stock_disponible)
- ✅ Index en SKU para búsqueda rápida

#### 4. Edge Functions (Opcional)
```typescript
// Supabase Edge Function para queries complejas
// Deploy cerca de usuario (baja latencia)
export default async (req: Request) => {
  const { tienda_id, filtros } = await req.json();
  
  // Query optimizada con joins pre-calculados
  const stock = await queryStockOptimizado(tienda_id, filtros);
  
  return new Response(JSON.stringify(stock), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

---

## 5. Sincronización Diaria desde Excel

### Proceso ETL

```typescript
// API Route: /api/admin/sincronizar-stock
export async function POST(request: Request) {
  const { tienda_id } = await request.json();
  
  // 1. Leer datos de registro_st_vt_rc_reposicion
  const { data: stockExcel } = await supabase
    .from('registro_st_vt_rc_reposicion')
    .select('*')
    .eq('tipo_movimiento', 'stock')
    .eq('origen_holding', getTiendaNombre(tienda_id));
  
  // 2. Resetear stock_inicial en stock_tienda_realtime
  await supabase.rpc('resetear_stock_inicial', { p_tienda_id: tienda_id });
  
  // 3. Importar nuevo stock
  const stockNuevo = stockExcel.map(row => ({
    sku: generarSKU(row),
    linea_id: row.linea_id,
    referencia_id: row.referencia_id,
    material_id: row.material_id,
    color_id: row.color_id,
    talla_id: row.talla_id,
    tienda_id,
    stock_inicial: row.cantidad,
    stock_vendido: 0, // Reset diario
    precio: row.precio_unitario
  }));
  
  await supabase.from('stock_tienda_realtime').upsert(stockNuevo);
  
  return Response.json({ success: true, registros: stockNuevo.length });
}
```

### Stored Procedure: Resetear Stock

```sql
CREATE OR REPLACE FUNCTION resetear_stock_inicial(p_tienda_id INT)
RETURNS void AS $$
BEGIN
  -- Mantener stock_vendido del día, resetear stock_inicial
  UPDATE stock_tienda_realtime
  SET stock_inicial = 0,
      stock_vendido = 0, -- Reset completo diario
      sincronizado_en = NOW()
  WHERE tienda_id = p_tienda_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Exportación CSV para Sistema Legal

### Formato CSV

```csv
CODIGO_TICKET,FECHA,HORA,TIENDA,VENDEDOR,CLIENTE_CEDULA,SKU,LINEA,REFERENCIA,CANTIDAD,PRECIO_UNIT,PRECIO_TOTAL
T20260607-0001,2026-06-07,14:30:25,Fernando,V012,4567890-1,L01-R023-M01-C05-T38,ACTV001,REF001,1,100000,100000
```

### API Endpoint

```typescript
// /api/tienda/exportar-tickets
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tienda_id = searchParams.get('tienda_id');
  const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0];
  
  // Obtener tickets pendientes de exportar
  const { data: tickets } = await supabase
    .from('tickets')
    .select(`
      *,
      vendedor:vendedores_tiendas(codigo_vendedor)
    `)
    .eq('tienda_id', tienda_id)
    .eq('exportado_csv', false)
    .gte('created_at', `${fecha}T00:00:00`)
    .lt('created_at', `${fecha}T23:59:59`);
  
  // Generar CSV
  const csv = generarCSV(tickets);
  
  // Marcar como exportados
  await supabase
    .from('tickets')
    .update({ exportado_csv: true, exportado_en: new Date().toISOString() })
    .in('id', tickets.map(t => t.id));
  
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="tickets_${tienda_id}_${fecha}.csv"`
    }
  });
}
```

---

## 7. Sin Conexión = Bloqueado

### Detección y UI

```typescript
'use client';

import { useEffect, useState } from 'react';

export function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (!isOnline) {
    return (
      <div className="fixed inset-0 bg-red-600 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            ⚠️ Sin Conexión a Internet
          </h1>
          <p className="text-gray-700 mb-4">
            El sistema de ventas requiere conexión activa para funcionar.
            Por favor, verifica tu conexión WiFi.
          </p>
          <div className="animate-pulse text-red-600">
            Esperando conexión...
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}
```

---

## Resumen de Decisiones

| Aspecto | Decisión | Tecnología |
|---------|----------|------------|
| **Sincronización** | Supabase Realtime | WebSocket nativo |
| **Concurrencia** | Triple capa | Reservas + Lock optimista + Confirmación |
| **Performance** | < 0.5s | Virtual scroll + Caché imágenes + Índices DB |
| **Stock** | Tabla nueva | `stock_tienda_realtime` con sync diaria |
| **Tickets** | CSV export | API endpoint descargable |
| **Offline** | Bloqueado | UI error si no hay conexión |
| **Auth** | Tablet compartida | Login tienda + código vendedor al vender |

---

**Siguiente paso:** Recibir bosquejo UI para diseñar interfaz optimizada para tablets.
