# 🏭 VENTA EN TIENDA - Sistema Multi-Proveedor

> **Confecciones (`tipo_v2_id=2`):** pautas de Línea, Referencia=`K`, Material=`{linea}K`, Color, Grada → **[CONFECCIONES_TIPO_V2_2.md](./CONFECCIONES_TIPO_V2_2.md)**

**Fecha:** 7 junio 2026  
**REVELACIÓN CRÍTICA:** Este proyecto NO es solo POS - Es el LABORATORIO para expandir Nexus más allá de calzados

---

## 🎯 LA GRAN EXPANSIÓN

### De Mono-Proveedor a Multi-Proveedor

```
NEXUS/RIMEC HISTÓRICO:
━━━━━━━━━━━━━━━━━━━━━━━
  Proveedor: 654 (Calzados únicamente)
  Marcas: Beira Rio, Vizzano, Moleca, Modare, etc.
  Protocolo imagen: 4 pilares (linea-ref-mat-color)
  Agrupación: Linea + Ref + Material
  
  
VENTA EN TIENDA = LABORATORIO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Proveedor 654: Calzados (actual)
  Proveedor 638: Kyly - Confecciones (NUEVO)
  
  Marcas nuevas procesadas:
    - Kily ✅
    - Milon ✅
    - (Antes solo en sales_report, ahora en Nexus completo)
  
  Protocolo imagen: MÚLTIPLE por proveedor
  Agrupación: DINÁMICA por proveedor
```

### Por Qué es un Laboratorio

**Si funciona aquí → Se expande a todo Nexus:**

```
1. Sistema multi-proveedor funciona en tiendas
   ↓
2. Protocolo de imágenes flexible validado
   ↓
3. Agrupaciones dinámicas probadas
   ↓
4. Marcas Kily/Milon procesadas correctamente
   ↓
5. EXPANSIÓN A TODO NEXUS/RIMEC
   ↓
6. Sistema puede incorporar CUALQUIER proveedor
```

---

## 📊 MODIFICACIONES A `registro_st_vt_rc_reposicion`

### Cambio 1: Columna `cliente_id`

**Antes:**
```sql
CREATE TABLE registro_st_vt_rc_reposicion (
  -- ... columnas existentes
  origen_holding TEXT, -- "Fernando", "San Martin", etc.
);
```

**Ahora:**
```sql
ALTER TABLE registro_st_vt_rc_reposicion
ADD COLUMN cliente_id INT REFERENCES cliente_v2(id_cliente);

-- Mapeo:
-- "Fernando Adultos" → 2100
-- "Fernando Niños" → 2900
-- "San Martin Adultos" → 2400
-- "San Martin Niños" → 2700
-- "Palma Adultos" → 3100
-- "Palma Niños" → 3200

UPDATE registro_st_vt_rc_reposicion
SET cliente_id = CASE
  WHEN lower(origen_holding) LIKE '%fernando%' AND marca IN (SELECT descp_marca FROM marca_v2 WHERE descp_marca IN ('Molekinha', 'Molekinho')) THEN 2900
  WHEN lower(origen_holding) LIKE '%fernando%' THEN 2100
  WHEN lower(origen_holding) LIKE '%san%martin%' AND marca IN (SELECT descp_marca FROM marca_v2 WHERE descp_marca IN ('Molekinha', 'Molekinho')) THEN 2700
  WHEN lower(origen_holding) LIKE '%san%martin%' THEN 2400
  WHEN lower(origen_holding) LIKE '%palma%' AND marca IN (SELECT descp_marca FROM marca_v2 WHERE descp_marca IN ('Molekinha', 'Molekinho')) THEN 3200
  WHEN lower(origen_holding) LIKE '%palma%' THEN 3100
END;
```

### Cambio 2: Nueva Columna `tipo_v2_id` (FK)

**CRÍTICO:** Para confecciones necesitamos tipo de prenda

```sql
ALTER TABLE registro_st_vt_rc_reposicion
ADD COLUMN tipo_v2_id INT REFERENCES tipo_v2(id_tipo);

-- Esta columna permite:
-- - Clasificar prendas de confección (remera, pantalón, vestido, etc.)
-- - Mantener compatibilidad con calzados (tipo = NULL o tipo de calzado)
-- - Agrupación flexible por proveedor
```

**Tabla `tipo_v2` (debe existir o crear):**
```sql
-- Si no existe, crear
CREATE TABLE IF NOT EXISTS tipo_v2 (
  id_tipo SERIAL PRIMARY KEY,
  codigo_tipo TEXT UNIQUE NOT NULL,
  descp_tipo TEXT NOT NULL,
  proveedor_id INT, -- 654 = Calzados, 638 = Confecciones
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tipo_v2_proveedor ON tipo_v2(proveedor_id);
CREATE INDEX idx_tipo_v2_codigo ON tipo_v2(codigo_tipo);

-- Ejemplos de tipos
INSERT INTO tipo_v2 (codigo_tipo, descp_tipo, proveedor_id) VALUES
  -- Calzados (654)
  ('SANDALIA', 'Sandalia', 654),
  ('ZAPATO', 'Zapato', 654),
  ('BOTA', 'Bota', 654),
  
  -- Confecciones (638 - Kyly)
  ('REMERA', 'Remera', 638),
  ('PANTALON', 'Pantalón', 638),
  ('VESTIDO', 'Vestido', 638),
  ('BUZO', 'Buzo', 638),
  ('SHORT', 'Short', 638);
```

### Cambio 3: Proceso ETL con FK tipo_v2

```typescript
/**
 * ETL modificado para resolver tipo_v2_id desde Excel
 */
async function importarExcelConTipo(archivoExcel: File) {
  // 1. Leer Excel
  const rows = await leerExcel(archivoExcel);
  
  // 2. Para cada fila, resolver FK de tipo
  const rowsConFK = await Promise.all(
    rows.map(async (row) => {
      // Buscar tipo en tipo_v2
      const { data: tipo } = await supabase
        .from('tipo_v2')
        .select('id_tipo')
        .eq('codigo_tipo', row.tipo) // Columna "tipo" del Excel
        .single();
      
      return {
        ...row,
        tipo_v2_id: tipo?.id_tipo || null,
        cliente_id: mapearClienteId(row.origen_holding, row.marca)
      };
    })
  );
  
  // 3. Insertar en registro_st_vt_rc_reposicion
  await supabase
    .from('registro_st_vt_rc_reposicion')
    .insert(rowsConFK);
}
```

---

## 🏭 SISTEMA MULTI-PROVEEDOR

### Proveedor 654: Calzados (Actual)

**Características:**
- Marcas: Beira Rio, Vizzano, Moleca, Modare, BR Sport, Actvitta, Molekinha, Molekinho, Chinelo
- Protocolo imagen: **4 pilares** (linea-ref-material-color)
- Agrupación primaria: Linea + Referencia + Material
- Agrupación secundaria: Linea + Referencia
- Pilares críticos: Talla (número de calzado)

**Path imagen:**
```
https://supabase.co/storage/productos/{linea_id}.jpg
o
https://supabase.co/storage/productos/{linea_id}-{ref_id}.jpg
```

### Proveedor 638: Kyly - Confecciones (NUEVO)

**Características:**
- Marcas: **Kily, Milon** (antes solo en sales_report, ahora procesadas completas)
- Protocolo imagen: **DIFERENTE** (1, 2 o 3 pilares - por definir)
- Agrupación primaria: **Por definir** (puede ser Linea + Tipo)
- Agrupación secundaria: **Por definir**
- Pilares críticos: Talle de ropa (S, M, L, XL, o numérico)

**Path imagen (ejemplos posibles):**
```
Opción A: Solo linea
https://supabase.co/storage/productos/kyly/{linea_id}.jpg

Opción B: Linea + Tipo
https://supabase.co/storage/productos/kyly/{linea_id}-{tipo_id}.jpg

Opción C: Linea + Tipo + Color
https://supabase.co/storage/productos/kyly/{linea_id}-{tipo_id}-{color_id}.jpg
```

### Tabla de Comparación

| Aspecto | Proveedor 654 (Calzados) | Proveedor 638 (Kyly Confecciones) |
|---------|--------------------------|-----------------------------------|
| **Tipo producto** | Calzados | Ropa/Confecciones |
| **Marcas** | Beira Rio, Vizzano, Moleca, etc. | **Kily, Milon** |
| **Pilares imagen** | 4 (linea-ref-mat-color) | 1-3 (por definir) |
| **Agrupación 1ª** | Linea + Ref + Material | **Por definir** |
| **Agrupación 2ª** | Linea + Ref | **Por definir** |
| **Talla/Talle** | Numérico (34-44) | Texto (S/M/L) o numérico |
| **Estado en Nexus** | ✅ Procesado completo | ⏳ Nuevo - laboratorio |

---

## 🖼️ SISTEMA DE IMÁGENES MULTI-PROTOCOLO

### Arquitectura Flexible

**Función helper dinámica por proveedor:**

```typescript
// Constantes de protocolo por proveedor
const PROTOCOLO_IMAGENES = {
  654: { // Calzados
    pilares: ['linea_id'],
    path: 'productos',
    extension: 'jpg'
  },
  638: { // Kyly Confecciones
    pilares: ['linea_id', 'tipo_v2_id'], // Ejemplo: 2 pilares
    path: 'productos/kyly',
    extension: 'jpg'
  }
} as const;

/**
 * Obtener URL de imagen según proveedor
 */
function getImagenProducto(producto: {
  proveedor_id: number;
  linea_id: number;
  referencia_id?: number;
  material_id?: number;
  color_id?: number;
  tipo_v2_id?: number;
}): string {
  const protocolo = PROTOCOLO_IMAGENES[producto.proveedor_id];
  
  if (!protocolo) {
    throw new Error(`Proveedor ${producto.proveedor_id} no tiene protocolo de imágenes`);
  }
  
  // Construir nombre según pilares definidos
  const nombreParts = protocolo.pilares.map(pilar => {
    return producto[pilar as keyof typeof producto];
  });
  
  const nombreImagen = nombreParts.join('-');
  
  return `${SUPABASE_STORAGE}/${protocolo.path}/${nombreImagen}.${protocolo.extension}`;
}

// Uso:
const urlCalzado = getImagenProducto({
  proveedor_id: 654,
  linea_id: 1
}); 
// → "https://supabase.co/storage/productos/1.jpg"

const urlConfeccion = getImagenProducto({
  proveedor_id: 638,
  linea_id: 5,
  tipo_v2_id: 10
}); 
// → "https://supabase.co/storage/productos/kyly/5-10.jpg"
```

### Tabla de Configuración (Futuro)

```sql
-- Tabla para configurar protocolos dinámicamente
CREATE TABLE protocolo_imagenes_proveedor (
  id SERIAL PRIMARY KEY,
  proveedor_id INT NOT NULL,
  pilares TEXT[] NOT NULL, -- ['linea_id', 'tipo_v2_id']
  path_base TEXT NOT NULL,
  extension TEXT DEFAULT 'jpg',
  separador TEXT DEFAULT '-',
  activo BOOLEAN DEFAULT true,
  
  UNIQUE(proveedor_id)
);

-- Insertar protocolos
INSERT INTO protocolo_imagenes_proveedor (proveedor_id, pilares, path_base) VALUES
  (654, ARRAY['linea_id'], 'productos'),
  (638, ARRAY['linea_id', 'tipo_v2_id'], 'productos/kyly');
```

---

## 🔄 AGRUPACIÓN DINÁMICA POR PROVEEDOR

### Sistema Flexible de Agrupación

**Tabla de configuración:**

```sql
CREATE TABLE agrupacion_proveedor (
  id SERIAL PRIMARY KEY,
  proveedor_id INT NOT NULL,
  nivel INT NOT NULL, -- 1 = primaria, 2 = secundaria
  pilares TEXT[] NOT NULL, -- Columnas a usar para agrupar
  nombre_agrupacion TEXT,
  
  UNIQUE(proveedor_id, nivel)
);

-- Calzados (654)
INSERT INTO agrupacion_proveedor (proveedor_id, nivel, pilares, nombre_agrupacion) VALUES
  (654, 1, ARRAY['linea_id', 'referencia_id', 'material_id'], 'Agrupación Primaria Calzados'),
  (654, 2, ARRAY['linea_id', 'referencia_id'], 'Agrupación Secundaria Calzados');

-- Confecciones (638) - Por definir según necesidad
INSERT INTO agrupacion_proveedor (proveedor_id, nivel, pilares, nombre_agrupacion) VALUES
  (638, 1, ARRAY['linea_id', 'tipo_v2_id'], 'Agrupación Primaria Confecciones'),
  (638, 2, ARRAY['linea_id'], 'Agrupación Secundaria Confecciones');
```

**Función dinámica de agrupación:**

```typescript
async function agruparProductos(
  proveedor_id: number,
  nivel: number, // 1 o 2
  productos: any[]
) {
  // 1. Obtener configuración de agrupación
  const { data: config } = await supabase
    .from('agrupacion_proveedor')
    .select('pilares')
    .eq('proveedor_id', proveedor_id)
    .eq('nivel', nivel)
    .single();
  
  if (!config) {
    throw new Error(`No hay configuración de agrupación nivel ${nivel} para proveedor ${proveedor_id}`);
  }
  
  // 2. Agrupar dinámicamente según pilares
  const grupos = new Map();
  
  productos.forEach(producto => {
    // Crear clave de agrupación
    const clave = config.pilares
      .map(pilar => producto[pilar])
      .join('-');
    
    if (!grupos.has(clave)) {
      grupos.set(clave, []);
    }
    grupos.get(clave).push(producto);
  });
  
  return Array.from(grupos.values());
}

// Uso:
const gruposCalzados = await agruparProductos(654, 1, productosCalzados);
// → Agrupa por linea + ref + material

const gruposConfecciones = await agruparProductos(638, 1, productosConfecciones);
// → Agrupa por linea + tipo_v2
```

---

## 🎯 MARCAS KILY Y MILON - Procesamiento Completo

### Antes: Solo en sales_report

```sql
-- Estas marcas existían en marca_v2 pero NO se procesaban en Nexus
SELECT * FROM marca_v2 WHERE descp_marca IN ('Kily', 'Milon');
-- Resultado: existen en DB

-- Pero en módulos de Nexus (importación, stock, etc.):
-- ❌ No aparecían
-- ❌ No se importaban
-- ❌ No se calculaban precios
-- ❌ Solo aparecían en sales_report (reporte externo)
```

### Ahora: Procesamiento Completo en Venta Tienda

```sql
-- Con proveedor 638, Kily y Milon se procesan completamente:

-- 1. En importación Excel
INSERT INTO registro_st_vt_rc_reposicion (
  marca_id, -- FK a marca_v2 donde descp_marca = 'Kily'
  proveedor_id, -- 638
  tipo_v2_id, -- FK a tipo_v2 (remera, pantalón, etc.)
  -- ... resto de columnas
);

-- 2. En depósitos de tienda
INSERT INTO deposito_tienda_fernando_adultos (
  marca_id, -- Kily procesada ✅
  proveedor_id, -- 638
  -- ... resto de columnas
);

-- 3. En tickets
INSERT INTO tickets (
  marca_id, -- Kily registrada ✅
  -- ... resto de columnas
);

-- 4. En informes retail (futuro)
SELECT m.descp_marca, SUM(t.cantidad)
FROM tickets t
JOIN marca_v2 m ON t.marca_id = m.id_marca
WHERE m.descp_marca IN ('Kily', 'Milon')
GROUP BY m.descp_marca;
-- ✅ Informes completos de confecciones
```

### Ventaja Estratégica

**Sistema ya preparado para cualquier marca:**

```
marca_v2 tiene TODAS las marcas
  ├─ Calzados: Beira Rio, Vizzano, etc. (proveedor 654)
  ├─ Confecciones: Kily, Milon (proveedor 638)
  └─ Futuro: Cualquier marca nueva

Solo falta:
  1. Asignar proveedor_id
  2. Configurar protocolo de imágenes
  3. Definir agrupaciones
  
Y el sistema las procesa automáticamente ✅
```

---

## 🔬 VENTA EN TIENDA = ENTORNO CONTROLADO

### Por Qué Empezar Aquí

**Ventajas de usar tiendas como laboratorio:**

1. **Escala Controlada**
   - 6 tiendas vs 100+ clientes en Nexus completo
   - Fácil de monitorear y corregir

2. **Datos Reales**
   - Ventas reales de confecciones
   - Feedback inmediato de vendedores

3. **Sin Romper Nexus Principal**
   - Módulos de importación/stock siguen con calzados
   - Venta tienda es módulo aislado

4. **Iteración Rápida**
   - Probar protocolo de imágenes
   - Ajustar agrupaciones
   - Refinar proceso

5. **Si Funciona → Expandir**
   ```
   Éxito en tiendas
     ↓
   Validar protocolo multi-proveedor
     ↓
   Expandir a importación Nexus
     ↓
   Expandir a stock y precios
     ↓
   Sistema multi-proveedor completo
   ```

---

## 📋 ROADMAP DE IMPLEMENTACIÓN

### Fase 1: Preparación DB (AHORA)

```sql
-- 1. Modificar registro_st_vt_rc_reposicion
ALTER TABLE registro_st_vt_rc_reposicion
ADD COLUMN cliente_id INT REFERENCES cliente_v2(id_cliente),
ADD COLUMN tipo_v2_id INT REFERENCES tipo_v2(id_tipo),
ADD COLUMN proveedor_id INT DEFAULT 654; -- Añadir para claridad

-- 2. Crear tipo_v2 si no existe
CREATE TABLE IF NOT EXISTS tipo_v2 (...);

-- 3. Poblar tipo_v2 con tipos de confecciones
INSERT INTO tipo_v2 (codigo_tipo, descp_tipo, proveedor_id) VALUES (...);

-- 4. Crear tablas de configuración
CREATE TABLE protocolo_imagenes_proveedor (...);
CREATE TABLE agrupacion_proveedor (...);
```

### Fase 2: ETL Multi-Proveedor

```typescript
// Modificar importación Excel para soportar:
// - Calzados (654) → Como siempre
// - Confecciones (638) → Nueva lógica
//   - Resolver tipo_v2_id
//   - Aplicar protocolo diferente
//   - Cliente_id según marca
```

### Fase 3: Depósitos con 2 Proveedores

```sql
-- Los 6 depósitos ahora almacenan:
CREATE TABLE deposito_tienda_fernando_adultos (
  -- ... columnas existentes
  proveedor_id INT NOT NULL,
  tipo_v2_id INT REFERENCES tipo_v2(id_tipo),
  -- ...
  
  CHECK(proveedor_id IN (654, 638))
);
```

### Fase 4: UI Tablet Multi-Producto

```typescript
// Tablet muestra:
// - Calzados (imágenes con protocolo 654)
// - Confecciones (imágenes con protocolo 638)
// - Agrupación dinámica por proveedor
// - Filtro por tipo de producto (calzado/ropa)
```

### Fase 5: Validación y Ajuste

```
- Vender confecciones reales
- Generar tickets mixtos (calzados + ropa)
- Validar imágenes carguen correctamente
- Ajustar protocolos según necesidad
```

### Fase 6: Expansión a Nexus (Futuro)

```
- Si todo funciona en tiendas
- Expandir multi-proveedor a importación Nexus
- Expandir a cálculo de precios
- Sistema completo multi-proveedor
```

---

## 🎯 IMPACTO ESTRATÉGICO

### De Calzados a Multi-Producto

```
NEXUS ANTES:
  └─ Sistema especializado en calzados únicamente
  
NEXUS DESPUÉS (con este proyecto):
  ├─ Calzados (654)
  ├─ Confecciones (638)
  └─ Arquitectura para CUALQUIER proveedor futuro
```

### Valor Competitivo

**Flexibilidad Total:**
- Agregar nuevo proveedor = configurar protocolo
- No requiere cambiar código base
- Sistema escalable infinitamente

**Marcas Kily y Milon:**
- De "solo en reportes" a "procesadas completas"
- Absorción de línea confecciones de bazzar

**Laboratorio Validado:**
- Probar en entorno controlado
- Escalar sin riesgo
- Innovación continua

---

## ✅ PRÓXIMOS PASOS

**PREGUNTAS CRÍTICAS PARA DEFINIR:**

1. **Protocolo de imágenes Kyly (638):**
   - ¿Cuántos pilares usa? (1, 2, 3?)
   - ¿Qué pilares? (linea, tipo, color?)
   - ¿Path en Supabase Storage?

2. **Agrupación confecciones:**
   - ¿Primaria: Linea + Tipo?
   - ¿Secundaria: Solo Linea?

3. **Talle vs Talla:**
   - ¿Confecciones usa tabla talla_v2?
   - ¿O nueva tabla talle_ropa?
   - ¿Formato: S/M/L o numérico?

4. **Excel confecciones:**
   - ¿Qué columnas trae el Excel de Kyly?
   - ¿Cómo identificamos tipo de prenda?

**Una vez definido → Implementación directa.**

---

**ESTE PROYECTO YA NO ES SOLO POS.**  
**ES LA PUERTA A NEXUS MULTI-PROVEEDOR.**  
**KYLY ES EL PRIMER EXPERIMENTO.**  
**SI FUNCIONA → NEXUS SE TRANSFORMA COMPLETAMENTE.**

🏭🏭🏭
