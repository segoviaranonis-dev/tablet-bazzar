# ORDEN PARA CURSOR: CLONAR APROBACIONES A NEXT.JS

**Tipo:** CLONADO MASIVO  
**Ejecutor:** Cursor  
**Verificador:** Claude Code  
**Fecha:** 2026-06-10

---

## 🎯 OBJETIVO

**Clonar módulo "Aprobación de Pedidos" de Streamlit a Next.js (Report)**

**Estrategia:** CALCAR/CLONAR tal cual está
- NO corregir errores de diseño ahora
- NO mejorar lógica ahora
- SÍ replicar funcionalidad exacta
- Correcciones después según Director

---

## 📂 ARCHIVOS ORIGEN (Streamlit)

### **Ubicación:** `C:\Users\hecto\Nexus_Core\control_central\`

```
streamlit_apps/aprobaciones.py              (archivo principal)
modules/aprobacion_pedidos/logic.py         (lógica negocio - 71KB)
modules/aprobacion_pedidos/ui.py            (UI completa - 38KB)
modules/aprobacion_pedidos/ui_fast.py       (UI rápida - 11KB)
```

---

## 📂 ARCHIVOS DESTINO (Next.js)

### **Ubicación:** `C:\Users\hecto\Nexus_Core\report\src\app\aprobaciones\`

**Crear esta estructura:**

```
report/src/app/aprobaciones/
├── page.tsx                          # Página principal (entrada)
├── AprobacionesClient.tsx            # Componente cliente principal
├── components/
│   ├── PedidoCard.tsx               # Card de pedido
│   ├── FacturaCard.tsx              # Card de factura interna
│   ├── ItemRow.tsx                  # Fila de item
│   ├── AprobacionModal.tsx          # Modal aprobar
│   ├── RechazoModal.tsx             # Modal rechazar
│   └── EstadoBadge.tsx              # Badge estado
└── lib/
    ├── aprobaciones-logic.ts        # Lógica de negocio (clon logic.py)
    └── aprobaciones-queries.ts      # Queries SQL
```

---

## 🗄️ BASE DE DATOS

**Tablas a usar:**

```sql
-- Tabla principal
pedido_venta_rimec (
  id, nro_pedido, created_at,
  vendedor_id, cliente_id,
  total_monto, total_pares,
  estado, plazo_id, lista_precio_id,
  descuento_1, descuento_2, descuento_3, descuento_4,
  fecha_aprobacion, fecha_rechazo, motivo_rechazo
)

-- Relaciones
cliente_v2 (id_cliente, descp_cliente)
usuario_v2 (id_usuario, descp_usuario)
factura_interna_pedido (id, nro_factura, pp_id, marca, caso, total_pares, total_monto, estado)
```

**Estados:**
- `PENDIENTE` - amarillo
- `APROBADO` - verde
- `RECHAZADO` - rojo

---

## 🎨 DISEÑO (NIIF)

**NO uses los estilos de Streamlit, usa NIIF:**

### **Colores:**
```typescript
// Fondos
bg-app-bg (#f1f5f9)
bg-white (cards)

// RIMEC
text-rimec-azul (#002B4E)
bg-rimec-azul (#002B4E)

// Estados
PENDIENTE: bg-yellow-100 text-yellow-800
APROBADO:  bg-green-100 text-green-800
RECHAZADO: bg-red-100 text-red-800
```

### **Componentes:**
- Cards blancas con sombra
- Bordes `border-slate-200`
- Botones NIIF (usa componentes existentes)
- Modales NIIF (usa componentes existentes)

---

## 📝 FUNCIONALIDAD A CLONAR

### **1. Vista Principal**
```typescript
// Mostrar lista de pedidos
- Últimos 50 pedidos (ORDER BY id DESC LIMIT 50)
- Filtros por estado (TODOS, PENDIENTE, APROBADO, RECHAZADO)
- Badge de estado visible
- Información resumida: nro, cliente, vendedor, total, pares
```

### **2. Card de Pedido**
```typescript
// Información del pedido
- Nro pedido
- Cliente (nombre)
- Vendedor (nombre)
- Fecha creación
- Total monto (formato moneda)
- Total pares
- Estado (badge)
- Plazos y descuentos
- Botones: "Ver Detalle", "Aprobar", "Rechazar"
```

### **3. Detalle de Pedido**
```typescript
// Mostrar facturas internas
- Lista de facturas del pedido
- Cada factura muestra:
  - Nro factura
  - PP ID
  - Marca
  - Caso
  - Total pares
  - Total monto
  - Lista de items (linea, ref, mat, color, talla, cant, precio)
```

### **4. Aprobar Pedido**
```typescript
// Modal de aprobación
- Confirmar acción
- Ejecutar UPDATE:
  UPDATE pedido_venta_rimec
  SET estado = 'APROBADO',
      fecha_aprobacion = NOW()
  WHERE id = ?

- Mensaje éxito
- Refrescar lista
```

### **5. Rechazar Pedido**
```typescript
// Modal de rechazo
- Input motivo (obligatorio)
- Confirmar acción
- Ejecutar UPDATE:
  UPDATE pedido_venta_rimec
  SET estado = 'RECHAZADO',
      fecha_rechazo = NOW(),
      motivo_rechazo = ?
  WHERE id = ?

- Mensaje éxito
- Refrescar lista
```

---

## 🔌 CONEXIÓN A BD

**Usa Supabase existente:**

```typescript
import { createClient } from '@/lib/supabase-server'

// En Server Component
const supabase = createClient()
const { data, error } = await supabase
  .from('pedido_venta_rimec')
  .select(`
    *,
    cliente:cliente_v2(descp_cliente),
    vendedor:usuario_v2(descp_usuario)
  `)
  .order('id', { ascending: false })
  .limit(50)
```

**O usa PostgreSQL directo si es necesario:**

```typescript
import { sql } from '@vercel/postgres'

const pedidos = await sql`
  SELECT ...
  FROM pedido_venta_rimec p
  LEFT JOIN cliente_v2 c ON p.cliente_id = c.id_cliente
  LEFT JOIN usuario_v2 v ON p.vendedor_id = v.id_usuario
  ORDER BY p.id DESC
  LIMIT 50
`
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Estructura Base**
- [ ] Crear carpeta `src/app/aprobaciones/`
- [ ] Crear `page.tsx` (Server Component)
- [ ] Crear `AprobacionesClient.tsx` (Client Component)
- [ ] Conectar a base de datos
- [ ] Query básica de pedidos

### **Fase 2: Componentes UI**
- [ ] `PedidoCard.tsx` - Card de pedido
- [ ] `EstadoBadge.tsx` - Badge estado
- [ ] `FacturaCard.tsx` - Card factura
- [ ] `ItemRow.tsx` - Fila de item

### **Fase 3: Acciones**
- [ ] `AprobacionModal.tsx` - Modal aprobar
- [ ] `RechazoModal.tsx` - Modal rechazar
- [ ] Server Actions para aprobar/rechazar
- [ ] Revalidación de datos

### **Fase 4: Detalle**
- [ ] Vista detalle de pedido
- [ ] Carga de facturas
- [ ] Carga de items
- [ ] Navegación pedido ← → detalle

### **Fase 5: Filtros**
- [ ] Filtro por estado
- [ ] Contador por estado
- [ ] Búsqueda por nro pedido (opcional)

---

## 🚨 CRÍTICO - NO OLVIDAR

### **1. Server Actions (para aprobar/rechazar)**
```typescript
// src/app/aprobaciones/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

export async function aprobarPedido(pedidoId: number) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('pedido_venta_rimec')
    .update({
      estado: 'APROBADO',
      fecha_aprobacion: new Date().toISOString()
    })
    .eq('id', pedidoId)

  if (error) throw error

  revalidatePath('/aprobaciones')
  return { success: true }
}

export async function rechazarPedido(pedidoId: number, motivo: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('pedido_venta_rimec')
    .update({
      estado: 'RECHAZADO',
      fecha_rechazo: new Date().toISOString(),
      motivo_rechazo: motivo
    })
    .eq('id', pedidoId)

  if (error) throw error

  revalidatePath('/aprobaciones')
  return { success: true }
}
```

### **2. Formato de Moneda**
```typescript
// Usar MoneyDisplay existente
import { MoneyDisplay } from '@/components/ui/MoneyDisplay'

<MoneyDisplay amount={pedido.total_monto} currency="PYG" />
```

### **3. Formato de Fecha**
```typescript
// Usar date-fns
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const fechaFormateada = format(new Date(pedido.created_at), "dd MMM yyyy HH:mm", { locale: es })
```

---

## ✅ VERIFICACIÓN OBLIGATORIA

**Después de implementar, ejecutá:**

```bash
# 1. Verificar archivos creados
ls -R src/app/aprobaciones/

# 2. Build
npm run build

# 3. Estado git
git status --short
git diff --stat

# 4. Contar archivos
find src/app/aprobaciones -type f | wc -l
```

**Reportar:**
- Archivos creados (cantidad)
- Build (✅ OK / ❌ ERROR)
- Warnings (si hay)

---

## 🎯 CRITERIOS DE ÉXITO

**La implementación es exitosa si:**

✅ Carga lista de pedidos  
✅ Muestra información correcta (cliente, vendedor, monto, pares)  
✅ Badges de estado funcionan  
✅ Puede aprobar pedido (UPDATE en BD)  
✅ Puede rechazar pedido con motivo (UPDATE en BD)  
✅ Muestra detalle con facturas  
✅ Muestra items de cada factura  
✅ Filtros por estado funcionan  
✅ Build sin errores  
✅ UI en estilo NIIF (no Streamlit)

---

## 💰 REPORTE DE TOKENS

**Al terminar, reportá:**

```markdown
IMPLEMENTACIÓN APROBACIONES NEXT.JS

Archivos creados: [cantidad]
Líneas de código: [total]
Build: [✅ OK / ❌ ERROR]

Tokens: [estimado]
Costo: [estimado]
Riesgo: [BAJO/MEDIO/ALTO]

Estado: PENDIENTE VERIFICACIÓN CLAUDE
```

---

## 🚫 QUÉ NO HACER

❌ NO corregir errores de diseño de Streamlit ahora  
❌ NO mejorar la lógica ahora  
❌ NO agregar features extras  
❌ NO cambiar nombres de campos de BD  
❌ NO optimizar queries ahora  

✅ SÍ clonar exacto  
✅ SÍ usar NIIF para estilos  
✅ SÍ reportar cuando termines  

---

**IMPORTANTE:** Guardá TODOS los archivos en disco antes de reportar.

---

**Inicio:** Cuando estés listo  
**Fin:** Cuando reportes completado + build OK  
**Siguiente:** Claude verifica y corrige
