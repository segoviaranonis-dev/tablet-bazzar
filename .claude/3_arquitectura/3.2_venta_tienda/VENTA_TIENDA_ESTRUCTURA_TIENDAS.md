# Venta en Tienda - Estructura de Tiendas Bazzar

**Fecha:** 7 junio 2026  
**Contexto:** Sistema POS tablets - Parte estrategia "Hiedra venenosa" (absorción)  
**Importancia:** CRÍTICA - Herramienta clave para avanzar en estrategia de absorción

---

## 🏪 Estructura de Tiendas

### 6 Tiendas Virtuales en 5 Ubicaciones Físicas

| Tienda Virtual | cliente_id | Ubicación Física | Marcas Permitidas |
|----------------|------------|------------------|-------------------|
| **Fernando Adultos** | 2100 | Avda. Fernando de la Mora | Todas excepto Molekinha/Molekinho |
| **Fernando Niños** | 2900 | Avda. Fernando de la Mora | Solo Molekinha + Molekinho |
| **San Martin Adultos** | 2400 | San Martin | Todas excepto Molekinha/Molekinho |
| **San Martin Niños** | 2700 | San Martin | Solo Molekinha + Molekinho |
| **Palma Adultos** | 3100 | Palma | Todas excepto Molekinha/Molekinho |
| **Palma Niños** | 3200 | Palma | Solo Molekinha + Molekinho |

---

## 📍 Ubicaciones Físicas

### 1. Avda. Fernando de la Mora
- **2 tiendas virtuales:**
  - Adultos (2100)
  - Niños (2900)
- **Stock físico:** Compartido pero diferenciado lógicamente

### 2. San Martin
- **2 tiendas virtuales:**
  - Adultos (2400)
  - Niños (2700)
- **Stock físico:** Compartido pero diferenciado lógicamente

### 3. Palma
- **2 tiendas virtuales:**
  - Adultos (3100)
  - Niños (3200)
- **Stock físico:** Compartido pero diferenciado lógicamente

---

## 🏷️ Filtrado de Marcas por Tienda

### Tiendas NIÑOS (2900, 2700, 3200)
**SOLO pueden ver:**
- **Molekinha** (marca_id en marcas_v2)
- **Molekinho** (marca_id en marcas_v2)

**Query ejemplo:**
```sql
SELECT * FROM stock_tienda_realtime s
JOIN marca_v2 m ON s.marca_id = m.id_marca
WHERE s.tienda_id IN (2900, 2700, 3200)
  AND m.descp_marca IN ('Molekinha', 'Molekinho');
```

### Tiendas ADULTOS (2100, 2400, 3100)
**Ven todas las marcas EXCEPTO:**
- Molekinha
- Molekinho

**Query ejemplo:**
```sql
SELECT * FROM stock_tienda_realtime s
JOIN marca_v2 m ON s.marca_id = m.id_marca
WHERE s.tienda_id IN (2100, 2400, 3100)
  AND m.descp_marca NOT IN ('Molekinha', 'Molekinho');
```

---

## 🗄️ Estructura Tabla: `stock_tienda_realtime`

```sql
CREATE TABLE stock_tienda_realtime (
  id SERIAL PRIMARY KEY,
  
  -- Pilares (FK a pilares v2)
  linea_id INT NOT NULL REFERENCES linea_v2(id_linea),
  referencia_id INT NOT NULL REFERENCES referencia_v2(id_referencia),
  material_id INT NOT NULL REFERENCES material_v2(id_material),
  color_id INT NOT NULL REFERENCES color_v2(id_color),
  talla_id INT NOT NULL REFERENCES talla_v2(id_talla),
  marca_id INT NOT NULL REFERENCES marca_v2(id_marca), -- IMPORTANTE para filtro
  
  -- SKU único
  sku TEXT NOT NULL, -- Formato: "LIN-REF-MAT-COL-TAL"
  
  -- Tienda (cliente_id de cliente_v2)
  tienda_id INT NOT NULL REFERENCES cliente_v2(id_cliente),
  tienda_nombre TEXT NOT NULL, -- "Fernando Adultos", "Fernando Niños", etc.
  tipo_tienda TEXT NOT NULL CHECK(tipo_tienda IN ('ADULTOS', 'NIÑOS')),
  ubicacion_fisica TEXT NOT NULL, -- "Fernando", "San Martin", "Palma"
  
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
  CHECK(stock_disponible >= 0),
  CHECK(tienda_id IN (2100, 2900, 2400, 2700, 3100, 3200))
);

-- Índices para performance
CREATE INDEX idx_stock_tienda_tipo ON stock_tienda_realtime(tienda_id, tipo_tienda, stock_disponible);
CREATE INDEX idx_stock_marca ON stock_tienda_realtime(marca_id, tienda_id);
CREATE INDEX idx_stock_ubicacion ON stock_tienda_realtime(ubicacion_fisica, tipo_tienda);
```

---

## 🎯 Mapeo Tienda ID → Nombre

```typescript
// Constante para mapeo rápido
export const TIENDAS_BAZZAR = {
  2100: { nombre: "Fernando Adultos", tipo: "ADULTOS", ubicacion: "Fernando" },
  2900: { nombre: "Fernando Niños", tipo: "NIÑOS", ubicacion: "Fernando" },
  2400: { nombre: "San Martin Adultos", tipo: "ADULTOS", ubicacion: "San Martin" },
  2700: { nombre: "San Martin Niños", tipo: "NIÑOS", ubicacion: "San Martin" },
  3100: { nombre: "Palma Adultos", tipo: "ADULTOS", ubicacion: "Palma" },
  3200: { nombre: "Palma Niños", tipo: "NIÑOS", ubicacion: "Palma" }
} as const;

export const TIENDAS_NINOS = [2900, 2700, 3200];
export const TIENDAS_ADULTOS = [2100, 2400, 3100];

export const MARCAS_NINOS = ['Molekinha', 'Molekinho'];
```

---

## 🔑 Reglas de Negocio Críticas

### 1. Filtrado Automático por Tipo de Tienda

**Al cargar stock para tienda NIÑOS:**
```typescript
async function cargarStockTiendaNinos(tiendaId: number) {
  const { data } = await supabase
    .from('stock_tienda_realtime')
    .select(`
      *,
      marca:marca_v2(descp_marca)
    `)
    .eq('tienda_id', tiendaId)
    .in('marca.descp_marca', ['Molekinha', 'Molekinho'])
    .gt('stock_disponible', 0);
  
  return data;
}
```

**Al cargar stock para tienda ADULTOS:**
```typescript
async function cargarStockTiendaAdultos(tiendaId: number) {
  const { data } = await supabase
    .from('stock_tienda_realtime')
    .select(`
      *,
      marca:marca_v2(descp_marca)
    `)
    .eq('tienda_id', tiendaId)
    .not('marca.descp_marca', 'in', '(Molekinha,Molekinho)')
    .gt('stock_disponible', 0);
  
  return data;
}
```

### 2. Sincronización Diaria por Tienda

**Proceso ETL debe diferenciar:**
- Importar stock con `marca_id`
- Asignar a tienda correcta según marca:
  - Molekinha/Molekinho → Tiendas NIÑOS (2900, 2700, 3200)
  - Otras marcas → Tiendas ADULTOS (2100, 2400, 3100)

### 3. Tickets con Tienda Correcta

```sql
-- Al generar ticket, verificar que tienda_id sea válida
CREATE OR REPLACE FUNCTION generar_ticket(
  p_sku TEXT,
  p_tienda_id INT,
  p_vendedor_id INT,
  p_cliente_cedula TEXT,
  p_cantidad INT
) RETURNS UUID AS $$
BEGIN
  -- Validar tienda_id
  IF p_tienda_id NOT IN (2100, 2900, 2400, 2700, 3100, 3200) THEN
    RAISE EXCEPTION 'Tienda inválida: %', p_tienda_id;
  END IF;
  
  -- ... resto de la lógica
END;
$$ LANGUAGE plpgsql;
```

---

## 📱 Implicaciones para UI Tablet

### Login por Tienda

**Al iniciar sesión, vendedor selecciona:**
1. **Ubicación física:** Fernando / San Martin / Palma
2. **Tipo de tienda:** Adultos / Niños

**Esto determina:**
- `tienda_id` (cliente_id)
- Filtrado automático de productos
- Tickets generados con tienda correcta

### Visualización de Stock

**Opción A: Mostrar solo stock de tienda actual**
```
📱 Fernando Niños (Logueado)
━━━━━━━━━━━━━━━━━━━━━━━
Stock Disponible: 145 pares
```

**Opción B: Mostrar stock de las 3 ubicaciones (mismo tipo)**
```
📱 Fernando Niños (Logueado)
━━━━━━━━━━━━━━━━━━━━━━━
Fernando: 145 pares
San Martin: 89 pares
Palma: 67 pares
```

**PREGUNTA CRÍTICA:** ¿Los vendedores necesitan ver stock de otras tiendas o solo de la suya?

---

## 🎯 Estrategia "Hiedra Venenosa" - Absorción

### Objetivo
Sistema POS genera tickets → CSV → Sistema legal absorbe → Factura legal

### Flujo de Absorción
```
1. Vendedor vende en tablet (tienda_id correcto)
   ↓
2. Ticket generado con cliente_id de tienda
   ↓
3. CSV exportado con estructura legal
   ↓
4. Sistema legal importa CSV
   ↓
5. Factura legal generada automáticamente
   ↓
6. RIMEC absorbe facturación completa de bazzar
```

### Ventaja Competitiva
- **Control total** de stock en tiempo real
- **Trazabilidad** completa (vendedor, tienda, timestamp)
- **Integración gradual** sin romper sistema existente
- **6 puntos de venta** sincronizados simultáneamente

---

## ✅ Próximos Pasos

1. ✅ Estructura de tiendas documentada
2. ⏳ Ver bosquejo UI para diseño tablet
3. ⏳ Definir si mostrar stock de otras tiendas o solo actual
4. ⏳ Diseñar flujo de login (ubicación + tipo)
5. ⏳ Implementar filtrado automático por marca según tipo tienda
6. ⏳ Crear función helper `getTiendaInfo(tiendaId)` para UI

---

**IMPORTANCIA ESTRATÉGICA:**
Esta herramienta es la llave para avanzar en la estrategia de absorción. 
Cada ticket generado es un paso más hacia el control total del sistema de facturación de bazzar.
