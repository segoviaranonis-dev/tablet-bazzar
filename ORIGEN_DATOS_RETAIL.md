# 📊 ORIGEN DE DATOS - TABLET BAZZAR

**Proyecto:** Tablet Bazzar (POS Móvil)  
**Fecha:** 2026-06-11  
**Responsable:** Claude Code

---

## 🔄 FLUJO COMPLETO DE DATOS

### **Vista General**

```
Excel VTA SM (st+vt+RC)
        ↓
Control Central/Report (Import)
        ↓
registro_st_vt_rc_reposicion (Tabla staging)
        ↓
Report (Sincronización/Transformación)
        ↓
deposito_{N}_{ubicacion}_{adultos|ninos}_tienda (6 tablas)
        ↓
Tablet Bazzar (Consumo)
```

---

## 📂 ORIGEN: EXCEL VTA SM

### **Archivo Excel**
- **Nombre:** VTA SM (Ventas San Martín)
- **Hoja específica:** `st+vt+RC` (Stock + Venta + Reposición/Recepción)
- **Otras hojas:** NO se importan para Tablet Bazzar

### **Contenido de la hoja `st+vt+RC`**
```
Datos de stock y movimientos por tienda BAZZAR:
- Línea, Referencia, Material, Color (códigos proveedor)
- IDs de pilares (linea_id, referencia_id, material_id, color_id)
- Marca, Género, Estilo, Tipo
- Grada (tallas)
- Cantidad por SKU
- Origen holding (tienda)
```

**Ejemplo de fila:**
```
linea_codigo_proveedor: 1184
referencia_codigo_proveedor: 1101
material_code: SINT
color_code: NEGRO
marca: VIZZANO
genero: DAMAS
cantidad: 3
origen_holding: Fernando
```

---

## 🗄️ ETAPA 1: STAGING (Control Central/Report)

### **Tabla:** `registro_st_vt_rc_reposicion`

**Ubicación:** PostgreSQL Supabase (misma BD que Tablet)

**Migración:** `control_central/migrations/060_registro_st_vt_rc_reposicion.sql`

**Proceso de import:**
1. Control Central módulo "Retail (st+vt+RC)"
2. Usuario selecciona archivo Excel VTA SM
3. Lee SOLO hoja `st+vt+RC`
4. **DELETE completo** de tabla (reemplazo total)
5. INSERT nuevo contenido del Excel

**Código:**
```python
# control_central/modules/balance_tiendas_retail/st_vt_rc_import.py
# control_central/modules/balance_tiendas_retail/ui.py
```

**Características:**
- Reemplazo total en cada import (no acumulativo)
- Batch ID generado por import
- Solo para filtros e imágenes en Retail Report
- NO se mezcla con `registro_ventas_general_v2` (Sales Report)

---

## ⚙️ ETAPA 2: SINCRONIZACIÓN/TRANSFORMACIÓN (Report)

### **Proceso:** Report → Depósitos

**Report** actúa como **cerebro** del sistema:
- Lee `registro_st_vt_rc_reposicion`
- Agrupa por tienda (usando `origen_holding`)
- Transforma a nivel molécula (SKU individual)
- Escribe en tablas `deposito_*_*_*_tienda`

### **Tablas destino:** 6 tablas de depósito

| Tienda | Tabla BD | Cliente ID |
|--------|----------|------------|
| Fernando Adultos | `deposito_2_fernando_adultos_tienda` | 2100 |
| Fernando Niños | `deposito_2_fernando_ninos_tienda` | 2900 |
| San Martín Adultos | `deposito_3_sanmartin_adultos_tienda` | 2400 |
| San Martín Niños | `deposito_3_sanmartin_ninos_tienda` | 2700 |
| Palma Adultos | `deposito_1_palma_adultos_tienda` | 3100 |
| Palma Niños | `deposito_1_palma_ninos_tienda` | 3200 |

**Estructura de cada tabla:**
```sql
CREATE TABLE deposito_2_fernando_adultos_tienda (
  -- IDs (FKs a pilares)
  linea_id bigint,
  referencia_id bigint,
  material_id bigint,
  color_id bigint,
  marca_id bigint,
  genero_id bigint,
  grupo_estilo_id bigint,
  tipo_v2_id integer,
  
  -- Códigos proveedor (para agrupación)
  linea_codigo_proveedor text,
  referencia_codigo_proveedor text,
  material_code text,
  color_code text,
  
  -- Descripciones
  marca text,
  genero text,
  estilo text,
  tipo_v2 text,
  descp_material text,
  descp_color text,
  
  -- Stock
  grada text,           -- Tallas disponibles
  cantidad numeric,     -- Stock disponible
  
  -- Metadatos
  cliente_id integer,   -- 2100 (Fernando Adultos)
  batch_id uuid,
  created_at timestamp,
  
  -- Otros
  imagen_nombre text,   -- Link a imágenes de producto
  tipo_movimiento text,
  excel_material_code text,
  excel_color_code text
);
```

**Características:**
- Nivel molécula: cada fila = un SKU (L+R+M+C+Talla)
- Incluye FKs para joins con pilares
- Incluye códigos proveedor (pueden tener espacios ⚠️)
- Campo `cantidad` con stock disponible

---

## 📱 ETAPA 3: CONSUMO (Tablet Bazzar)

### **Modo de lectura:** Server-side SQL

**Tablet NO descarga todo** — ejecuta queries específicas:

1. **Endpoint `/api/deposito/[cliente_id]/filtros`**
   ```sql
   SELECT marca, COUNT(*) 
   FROM deposito_2_fernando_adultos_tienda
   WHERE cantidad > 0
   GROUP BY marca;
   ```

2. **Endpoint `/api/deposito/[cliente_id]/cadena`**
   ```sql
   SELECT *
   FROM deposito_2_fernando_adultos_tienda
   WHERE cantidad > 0
     AND marca = 'VIZZANO'
     AND linea_codigo_proveedor ILIKE '%1184%'
   ORDER BY linea_codigo_proveedor, referencia_codigo_proveedor;
   ```

3. **Agrupación en TypeScript** (Backend Titanio)
   ```typescript
   // lib/cadena.ts - buildCadenaFromFilas()
   // Agrupa nivel molécula → Pares L+R
   //   Nivel 1: L + R + Material (precio, foto base)
   //   Nivel 2: Color (variantes)
   ```

**Config tiendas:**
```typescript
// lib/depositos-config.ts
export const DEPOSITOS = [
  {
    cliente_id: 2100,
    ente: "Fernando",
    tipo: "ADULTOS",
    tabla: "deposito_2_fernando_adultos_tienda",
  },
  // ... 5 más
];
```

---

## 🔗 DEPENDENCIAS E INTEGRACIONES

### **Sistema que genera datos:**
- **Control Central** - Import Excel → staging

### **Sistema que sincroniza:**
- **Report** - Transform staging → depósitos

### **Sistema que consume:**
- **Tablet Bazzar** - Read depósitos → UI POS

### **Sistema que administra:**
- **Report** - Admin productos, KPIs, traspasos

---

## ⚠️ PROBLEMAS CONOCIDOS

### **1. Espacios en códigos proveedor**
```sql
-- En BD pueden estar:
linea_codigo_proveedor = " 1184 "  -- Con espacios

-- Tablet debe usar trim():
WHERE trim(linea_codigo_proveedor) = '1184'
```

**Fix:** Aplicar `trim()` en todas las funciones de generación de claves.

### **2. Sincronización manual**
- Datos NO se actualizan automáticamente
- Requiere import manual de Excel en Control Central
- Report debe ejecutar sync manual
- No hay validación de freshness de datos

### **3. Sin offline-first real**
- Tablet depende de conexión a Supabase
- No hay caché local de datos
- PWA offline pendiente

---

## 📋 VERIFICACIÓN DE DATOS

### **Verificar en Supabase:**

```sql
-- Ver estructura de tabla
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'deposito_2_fernando_adultos_tienda'
ORDER BY ordinal_position;

-- Conteo de SKUs por tienda
SELECT 
  'Fernando Adultos' AS tienda,
  COUNT(*) AS total_skus,
  COUNT(*) FILTER (WHERE cantidad > 0) AS con_stock
FROM deposito_2_fernando_adultos_tienda;

-- Verificar espacios en códigos
SELECT 
  linea_codigo_proveedor,
  length(linea_codigo_proveedor) AS len,
  trim(linea_codigo_proveedor) AS trimmed
FROM deposito_2_fernando_adultos_tienda
WHERE linea_codigo_proveedor != trim(linea_codigo_proveedor)
LIMIT 10;

-- Sample de datos
SELECT 
  linea_codigo_proveedor,
  referencia_codigo_proveedor,
  material_code,
  color_code,
  marca,
  cantidad,
  grada
FROM deposito_2_fernando_adultos_tienda
WHERE cantidad > 0
LIMIT 10;
```

---

## 🎯 FLUJO IDEAL (FUTURO)

```
ERP/Sistema Externo
        ↓ (API automática)
Supabase (trigger)
        ↓
deposito_*_*_*_tienda (update incremental)
        ↓
Tablet Bazzar (subscripción realtime)
        ↓
PWA offline-first (cache local)
```

**Pendiente:**
- Automatizar import desde ERP
- Realtime subscriptions (Supabase)
- Cache IndexedDB en PWA
- Service Worker para offline

---

## 📚 DOCUMENTACIÓN RELACIONADA

### **Tablet Bazzar:**
- `.claude/2_modulos/2.4_tablet_bazzar/CONTEXT.md` - Arquitectura completa
- `tablet-bazzar/lib/depositos-config.ts` - Config 6 tiendas
- `tablet-bazzar/lib/cadena.ts` - Agrupación L+R

### **Report:**
- `.claude/2_modulos/2.3_report/INDICE.md` - Módulos Report
- `.claude/2_modulos/2.3_report/docs/RETAIL_FILTERS_ROBUSTNESS_REPORT.md` - Filtros Retail

### **Control Central:**
- `.claude/6_ot/en_curso/OT-RETAIL-ST-VT-RC-001.md` - Import Excel Retail
- `control_central/migrations/060_registro_st_vt_rc_reposicion.sql` - Migración

### **Arquitectura:**
- `.claude/3_arquitectura/3.2_venta_tienda/decisiones_tecnicas.md` - Decisiones técnicas
- `.claude/3_arquitectura/3.2_venta_tienda/depositos.md` - Arquitectura depósitos

---

## ✅ RESUMEN EJECUTIVO

**Origen final:** Excel VTA SM (hoja `st+vt+RC`)

**Flujo:**
1. Control Central importa Excel → `registro_st_vt_rc_reposicion`
2. Report sincroniza → 6 tablas codificadas `deposito_{N}_{ubicacion}_{adultos|ninos}_tienda`
3. Tablet Bazzar consulta → Server-side SQL
4. Backend Titanio agrupa → UI cadena consecutiva

**Responsables:**
- **Import:** Control Central
- **Sync:** Report
- **Consume:** Tablet Bazzar
- **Admin:** Report

**Estado:**
- ✅ Import funcionando
- ✅ Tablas depósito pobladas
- ✅ Tablet consumiendo datos
- ⚠️ Sincronización manual
- ⏳ Offline-first pendiente

---

**Fecha:** 2026-06-11  
**Responsable:** Claude Code  
**Validado por:** Director
