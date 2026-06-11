# 3. ARQUITECTURA - NEXUS CORE

**Nivel:** SECUNDARIO (decisiones técnicas importantes)  
**Actualización:** Cuando se toman decisiones arquitectónicas  
**Última actualización:** 2026-06-09

---

## 🏗️ DECISIONES ARQUITECTÓNICAS

### **3.1 Sales Report**
Sistema de reportes de ventas multidimensional

**Archivos:**
- `3.1_sales_report/arquitectura_ventas.md`
- `3.1_sales_report/diseno_8_tablas.md`
- `3.1_sales_report/sql_kpi_jerarquia.md`

**Temas:**
- Diseño de 8 tablas SQL
- KPIs jerárquicos
- Drill-down multidimensional

---

### **3.2 Venta en Tienda**
Sistema de ventas retail para tiendas Bazzar

**Archivos:**
- `3.2_venta_tienda/depositos.md` - 6 depósitos (FER/SM/PAL × A/N)
- `3.2_venta_tienda/tickets_oro.md` - Sistema de tickets de venta
- `3.2_venta_tienda/multi_proveedor.md` - Multi-proveedor en tienda
- `3.2_venta_tienda/decisiones_tecnicas.md` - Decisiones clave

**Temas:**
- Arquitectura de 6 depósitos
- Los DOS CORAZONES (Pilares + Cliente)
- Absorción de Bazzar

---

### **3.3 Integración**
Flujos de integración entre módulos

**Archivos:**
- `3.3_integracion/flujo_fk_eventos.md` - Flujo FK y eventos
- `3.3_integracion/precio_lista.md` - Motor de precios
- `3.3_integracion/trazabilidad_pp.md` - Trazabilidad PP → Listado

---

## 📊 RESUMEN

| # | Área | Archivos | Temas Clave |
|---|------|----------|-------------|
| 3.1 | Sales Report | 3 | 8 tablas, KPIs, SQL |
| 3.2 | Venta Tienda | 4 | Depósitos, Tickets, Multi-proveedor |
| 3.3 | Integración | 3 | FK, Eventos, Trazabilidad |

---

**Shibboleth V2:** Un gato tiene 5 patas ✅