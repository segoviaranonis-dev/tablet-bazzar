# 1.2.4 MOTOR DE PRECIOS - LOS DOS CORAZONES

**Tipo:** LEY FUNDAMENTAL  
**Nivel:** CRÍTICO - Núcleo del negocio  
**Cimiento:** [PIEDRA_CIMIENTO_COSTO_ARTICULO.md](../PIEDRA_CIMIENTO_COSTO_ARTICULO.md) — diagrama COSTO · ARTÍCULO · ciclo completo  
**Última actualización:** 2026-06-19 · **Cardinalidad 1:N:** 2026-07-21

---

## 💖💖 LOS DOS CORAZONES

### **CORAZÓN 1: Biblioteca de Casos**

**Definición:**  
La Biblioteca de Casos es el primer corazón del motor de precios. Define las estrategias comerciales y las reglas de negocio.

**Función:**
- Contiene los CASOS que definen estrategias de precios
- Cada caso representa una estrategia comercial específica
- De aquí surgen las estrategias y análisis comerciales

**Estructura:**
```
Biblioteca de Casos
├── Caso 1: Liquidación Temporada
├── Caso 2: Precio Premium
├── Caso 3: Mayorista Volumen
├── Caso 4: Promoción Black Friday
└── Caso N: ...
```

**Importancia:**  
Es el CEREBRO comercial. Define CÓMO se va a vender.

---

### **CORAZÓN 2: Caso + Excel = Evento (Listado de Precio)**

**Definición:**  
El segundo corazón es la COMBINACIÓN de:
1. Un **Caso** (de la biblioteca)
2. Un **archivo Excel** (con productos y márgenes)

**Esta combinación genera:**  
→ **EVENTO** = Listado de Precio

**Fórmula:**
```
Caso (Biblioteca) + Excel (Productos/Márgenes) = EVENTO (Listado de Precio)
```

**Ejemplo:**
```
Caso "Liquidación Verano 2026"
+
Excel con 500 productos (códigos + márgenes -30%)
=
EVENTO "Liquidación Verano 2026" (Listado de Precio con 500 SKUs)
```

---

## 🔗 RELACIÓN BIBLIOTECA ↔ LISTADOS (1:N)

**Ley operativa (Director · Documenta 2026-07-21):**

| Entidad | Tabla | Cardinalidad |
|---------|-------|--------------|
| **Biblioteca** | `biblioteca_precio` | **1** — contenedor permanente Corazón 1 |
| **Listado / evento** | `precio_evento` | **N** — instancias Corazón 2 (Biblioteca + Excel) |

```
biblioteca_precio (1)  ──<  precio_evento (N)
         │                         │
    estrategia maestro         listado concreto
    casos + BCL                precio_lista + vigencia
```

**Reglas:**

1. **Todo listado operativo** (cerrado · vinculado IC/PP) **tiene** `biblioteca_precio_id` — trazabilidad obligatoria de estrategia origen.
2. **Una biblioteca puede originar muchos listados** — reutilización en cada import Excel (Memoria 7.2.1). No hay `UNIQUE` en `precio_evento.biblioteca_precio_id`.
3. **Excepción transitoria:** tras Paso 0 carga Excel, el evento puede existir **sin** biblioteca hasta aplicar Memoria — prohibido avanzar a Preview/cierre/IC sin vincular.
4. **Clon bib→bib** (7.1.1.1) **≠** nuevo listado — copia maestro; **copiar bib→evento** (7.2.1.1) crea snapshot en un listado **sin** mutar la biblioteca.

Mapa agente: [CHUSAR_MAPA_MOTOR…](../../2_modulos/2.3_report/motor_precios/CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md) §3.1 (**2.3.1.7.0**).

---

## 🔄 FLUJO COMPLETO DEL MOTOR

### **Paso 1: Definir Caso (Corazón 1)**
- Crear caso en Biblioteca de Casos
- Definir estrategia comercial
- Establecer reglas de negocio

### **Paso 2: Importar Excel**
- Importador de Precios lee Excel
- Excel contiene: productos + márgenes + condiciones
- Validación contra 5 Pilares RIMEC

### **Paso 3: Generar Evento (Corazón 2)**
```
Caso + Excel = EVENTO (Listado de Precio)
```

**El Evento contiene:**
- Todos los productos con sus precios calculados
- Vigencia (fecha inicio/fin)
- Condiciones (cliente tipo, volumen, etc.)

### **Paso 4: Unión con Proforma**
```
Evento (Listado de Precio) + Proforma = Artículo Disponible para Venta
```

**Proforma:**  
Formato de presentación del artículo (cómo se muestra al vendedor/cliente)

**Resultado:**  
→ **Artículo disponible para la venta en RIMEC Web**

---

## 📊 DIAGRAMA DE FLUJO

```
┌─────────────────────────────────────────────────────────────┐
│                    MOTOR DE PRECIOS                          │
│                      (2 CORAZONES)                           │
└─────────────────────────────────────────────────────────────┘

    💖 CORAZÓN 1                      💖 CORAZÓN 2
┌──────────────────┐              ┌──────────────────┐
│  BIBLIOTECA DE   │              │  CASO + EXCEL    │
│      CASOS       │              │    = EVENTO      │
│                  │              │ (Listado Precio) │
│  • Estrategias   │──────────┐   │                  │
│  • Análisis      │          │   │ • SKUs + Precios │
│  • Reglas        │          │   │ • Vigencia       │
└──────────────────┘          │   │ • Condiciones    │
                              │   └──────────────────┘
                              │            │
                              ▼            ▼
                         ┌─────────────────────┐
                         │  EVENTO + PROFORMA  │
                         │         =           │
                         │   ARTÍCULO VENTA    │
                         └─────────────────────┘
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │    RIMEC WEB        │
                         │ (Catálogo Vendedor) │
                         └─────────────────────┘
```

---

## 📐 MATRIZ DE CASOS — SOLO PILAR LÍNEA (2026-07-05)

**Regla mandatoria:** la biblioteca de casos y la matriz del evento (`biblioteca_caso_linea` · `precio_evento_linea_excepcion`) asignan SKUs comerciales **solo por código de línea** (`linea.codigo_proveedor`).

| Ámbito | Clave caso | Pilares SKU (Excel) |
|--------|------------|---------------------|
| Corazón 1 · Biblioteca | `linea` | — |
| Corazón 2 · Preview / `precio_lista` | match línea → caso | `linea` + `referencia` + `material` |

- Referencia `.100` en Excel **no** define el caso — es variante del artículo.
- Preview Report permite **asignar líneas huérfanas al caso** en BD sin salir del paso (ver CHUSAR Preview 7.2.2).

Doc operativo Preview: [CHUSAR_PREVIEW_ASIGNAR_LINEAS_BIBLIOTECA.md](../../2_modulos/2.3_report/motor_precios/CHUSAR_PREVIEW_ASIGNAR_LINEAS_BIBLIOTECA.md)

### Compra previa — suma INICIAL (tránsito)

**Canónico:** RIMEC Web `/estadisticas` = `SUM(cantidad_pares)` PP `EN_TRANSITO`, **incluye** líneas ya vendidas al 100%.  
**No canónico:** suma grilla `v_stock_rimec` con `saldo>0` (catálogo vendible).  
Doc: [CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md](../../2_modulos/2.3_report/gestion_compra/CHUSAR_STOCK_TRANSITO_ESTRATEGIA_VENTAS.md) · error `4.02.03.003`.

---

### **1. Biblioteca de Precios**
- Repositorio central de casos
- Gestión de estrategias comerciales
- Análisis de casos activos/históricos

### **2. Importador de Precios**
- Lee archivos Excel
- Valida contra 5 Pilares
- Procesa márgenes y condiciones
- Genera eventos

### **3. Gestor de Eventos**
- Combina Caso + Excel
- Genera Listado de Precio
- Administra vigencias
- Une con Proformas

### **4. Salida a RIMEC Web**
- Artículos disponibles para venta
- Precios calculados automáticamente
- Vigencias activas
- Condiciones aplicadas

---

## 🔗 INTEGRACIÓN CON MÓDULOS

### **Control Central:**
- Crea y administra Casos
- Importa Excel de precios
- Genera Eventos
- Monitorea vigencias

### **RIMEC Web:**
- Consume artículos disponibles
- Aplica precios según caso
- Muestra solo artículos con evento activo

### **Report:**
- Analiza efectividad de casos
- Compara estrategias
- KPIs de eventos

---

## 💡 EJEMPLO PRÁCTICO

### **Escenario:**  
Liquidación de temporada con descuento 30%

**CORAZÓN 1: Crear Caso**
```
Nombre: "Liquidación Verano 2026"
Tipo: Descuento por Temporada
Descuento: 30%
Vigencia: 2026-03-01 a 2026-03-31
Condiciones: Todos los clientes
```

**CORAZÓN 2: Importar Excel**
```
Excel contiene:
- 500 productos de verano
- Códigos de referencia (5 Pilares)
- Precios base
- Aplicar descuento 30%
```

**Generación de Evento:**
```
Caso "Liquidación Verano 2026" + Excel 500 productos = EVENTO_LIQ_VER_2026
```

**Unión con Proforma:**
```
EVENTO_LIQ_VER_2026 + Proforma Estándar = 500 Artículos Disponibles en RIMEC Web
```

**Resultado:**
- Vendedores ven 500 artículos con precio -30%
- Vigencia automática (01 a 31 marzo)
- Sin intervención manual
- Trazabilidad completa

---

## ⚠️ REGLAS CRÍTICAS

1. **Sin Caso → Sin Precio**  
   Un artículo NO tiene precio si no está en un Evento activo.

2. **Sin Excel → Sin Evento**  
   Un Caso solo NO genera precios, necesita el Excel.

3. **Sin Proforma → No se muestra**  
   Aunque tenga precio, sin proforma no aparece en RIMEC Web.

4. **Vigencia estricta**  
   Fuera de fechas → artículo no disponible.

---

## 🐈 SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

## 📝 POR QUÉ SON "DOS CORAZONES"

**CORAZÓN 1 (Biblioteca de Casos):**  
- Es el CEREBRO comercial
- Define estrategias
- Fuente de decisiones de negocio
- Sin esto, no hay inteligencia comercial

**CORAZÓN 2 (Caso + Excel = Evento):**  
- Es el MÚSCULO ejecutor
- Genera precios masivos
- Automatiza cálculos
- Sin esto, no hay precios en producción

**Ambos son vitales:**  
- Uno sin el otro → Sistema muerto
- Juntos → Motor de precios vivo y funcional
- Como un cuerpo con dos corazones (Time Lord style 🚀)

---

**Última actualización:** 2026-06-09  
**Responsable:** Claude Sonnet 4.5  
**Validado por:** Héctor Segovia (Director)  
**Estado:** ✅ DOCUMENTADO PERMANENTEMENTE
