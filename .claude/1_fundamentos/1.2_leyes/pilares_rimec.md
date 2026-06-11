# 1.2.1 LOS 5 PILARES RIMEC

**Tipo:** LEY FUNDAMENTAL  
**Nivel:** Identidad molecular del artículo  
**Última actualización:** 2026-06-09

---

## 🧬 PILARES CANÓNICOS

| # | Pilar | Tabla | FK | Código | Descripción |
|---|-------|-------|-----|--------|-------------|
| **1** | **Línea** | `linea_v2` | `linea_id` | `codigo_proveedor` | Modelo/línea proveedor |
| **2** | **Referencia** | `referencia_v2` | `referencia_id` | `codigo_proveedor` | Variante dentro línea |
| **3** | **Material** | `material_v2` | `material_id` | `codigo_proveedor` | Acabado/material |
| **4** | **Color** | `color_v2` | `color_id` | `codigo_proveedor` | Color |
| **5** | **Grada/Talla** | `talla_v2` | `talla_id` | `talla_etiqueta` | Talle (número calzado) |

---

## 🔬 COMBINACIÓN = MOLÉCULA ESTABLE

**5 FK → tabla `combinacion`:**
```sql
combinacion(
  linea_id,
  referencia_id,
  material_id,
  color_id,
  talla_id
)
```

**Cada combinación única** = 1 artículo específico vendible/stockeable

---

## ⚖️ LEY FK-FIRST

**Excel/CSV son entrada, NO fuente viva.**

Todo dato externo:
1. Cruza aduana de pilares
2. Se resuelve a FK enteras
3. Opera con identidad molecular

**Prohibido:** Operar con códigos/textos sin resolver FK primero

---

## 🧮 MOTOR DE PRECIOS

**Cotiza hasta:** `linea + referencia + material` (triplete)

**Tabla:** `precio_lista(linea_id, referencia_id, material_id, evento_id)`

**Color y talla:**
- Identifican stock/venta
- NO cambian precio
- Son dimensiones de inventario

---

## 📐 GRADA (Dos Notaciones)

### **Importadora (Caja Cerrada)**
```
35(1 2 3 3 2 1)40
```
- Rango: 35 a 40
- Cantidades: 1+2+3+3+2+1 = 12 pares por caja
- BD: `ppd.grada` (texto) + `ppd.grades_json` (desglose)

### **Tiendas (Números Abiertos)**
```
N°35=1, N°36=1, N°37=1, ..., N°40=1
```
- Stock/venta web por talla explícita

---

## 🏗️ ARQUITECTURA FK

```
linea ──┐
referencia ──┼── linea_referencia (atributos L+R)
         │
         └── combinacion (5 FK)
                │
                ├── movimiento_detalle
                ├── pedido_proveedor_detalle
                ├── factura_interna_detalle
                └── retail_multitienda_staging
```

---

## 🔍 TRAZABILIDAD MOLECULAR

**Cadena típica:**
```
precio_evento → precio_lista (L+R+Mat)
    ↓
intencion_compra → pedido_proveedor
    ↓
factura_interna / movimiento_detalle (combinacion_id)
    ↓
historia auditable
```

**Objetivo:** Responder para cualquier par vendido:
- ¿De qué listado/caso/evento salió?
- ¿En qué IC/PP?
- ¿Qué distribución de gradas?

---

## 💡 WHY

Sin pilares bien cargados → NO hay SO, solo pantallas

Con pilares + FK + eventos → Importadora opera con:
- ✅ Verdad molecular
- ✅ Historia auditable
- ✅ Trazabilidad completa

---

**Shibboleth V2:** Un gato tiene 5 patas ✅
