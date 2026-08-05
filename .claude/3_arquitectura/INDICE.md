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
- `3.2_venta_tienda/multi_proveedor.md` - Multi-proveedor en tienda (654 / 638)
- **`3.2_venta_tienda/CONFECCIONES_TIPO_V2_2.md`** - **Pautas pilares Kyly (`tipo_v2_id=2`)**
- **`3.2_venta_tienda/LEY_FK_NUMERICO_RETAIL.md`** - **FK siempre · hotfix FAST documentado**
- **`3.2_venta_tienda/REGLAS_PROVEEDORES_INDICE.md`** - **Reglas por proveedor (Chusar 2026-06-16)**
- **`3.2_venta_tienda/PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md`** - **★ Grada abierta 638 · am_talle · 638≠654 · Bazzar ok_grada (`3.02.00.638`)**
- **`3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md`** - **Marco género→marca→estilo · `/pilares` → RIMEC Web + Tablet**
- **`3.2_venta_tienda/CABECERA_DE_FILTROS.md`** - **Mapa + estándar réplica · nombre canónico CABECERA DE FILTROS · todas las apps**
- **`3.2_venta_tienda/GRILLA_RIMEC.md`** - **★ Grilla Rimec · clave Director · cabecera + moléculas + dato duro + extender (`3.2.00.002`)**
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
- **`3.3_integracion/PUENTE_MOTOR_PRECIOS_DEPOSITO_BAZZAR.md`** - **Puente biblioteca → stock Bazzar (Filtros por índice)**

---

## 📊 RESUMEN

| # | Área | Archivos | Temas Clave |
|---|------|----------|-------------|
| 3.1 | Sales Report | 3 | 8 tablas, KPIs, SQL |
| 3.2 | Venta Tienda | 5 | Depósitos, Tickets, Multi-proveedor, **Confecciones tipo_v2=2** |
| 3.3 | Integración | 3 | FK, Eventos, Trazabilidad |

---

**Shibboleth V2:** Un gato tiene 5 patas ✅