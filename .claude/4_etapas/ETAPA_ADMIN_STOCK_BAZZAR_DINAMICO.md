# ETAPA — Panel Depósito · Hiedra Venenosa (admin dinámico)

**Código:** **2.3.2.1.1** · padre **2.3.2.1**  
**Estado:** ✅ **CERRADA 2026-07-03** · ver [ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO_CERRADA.md](./ETAPA_ADMIN_STOCK_BAZZAR_DINAMICO_CERRADA.md)  
**App:** Report · `/depositos-bazzar`  
**Visión:** [VISION_PANEL_DEPOSITO_HIEDRA_2.3.2.1.1.md](../../../report/docs/VISION_PANEL_DEPOSITO_HIEDRA_2.3.2.1.1.md)  
**CHUSAR:** [CHUSAR_ADMIN_STOCK_BAZZAR_DINAMICO.md](../2_modulos/2.3_report/depositos/CHUSAR_ADMIN_STOCK_BAZZAR_DINAMICO.md)  
**Registro integración:** [CHUSAR_DEPOSITO_INTEGRACION_COMPLETA_20260628.md](../2_modulos/2.3_report/depositos/CHUSAR_DEPOSITO_INTEGRACION_COMPLETA_20260628.md)  
**Mensajería:** [CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md](../2_modulos/2.3_report/depositos/CHUSAR_MENSAJERIA_DEPOSITO_TABLET.md)  
**Doc app:** [ADMIN_STOCK_BAZZAR_DINAMICO.md](../../../report/docs/ADMIN_STOCK_BAZZAR_DINAMICO.md)

---

## Objetivo

**Report = Hiedra Venenosa** — panel administrativo único. Desde **Panel Depósito** el operador gobierna:

1. **Stock operativo** — paridad Retail · sync · bandeja POS · diagnóstico.
2. **Depósito sectorizado** — sectores definidos por **5 pilares** (línea · referencia · material · color · grada).
3. **Reglas comerciales** — descuentos · promociones · liquidación · registros controlados **por sector**.
4. **Muestrario** — control de muestras · reposición desde admin.
5. **Mensajería → Tablet** — alertas (reposición · liquidación · destacar · promos) recibidas en módulo depósito tablet (reflejo operativo).

**Éxito =** todo lo anterior desde `/depositos-bazzar` · tablet ejecuta y confirma · sin mezclar Sales Report.

---

## Arquitectura dos capas

| Capa | Producto | Rol |
|------|----------|-----|
| Mando | Report `/depositos-bazzar` | Crear reglas · sectores · alertas · sync |
| Reflejo | Tablet `/deposito` · `/cadena` | Stock POS · recibir alertas · ack |

---

## Contexto stock (3 mundos)

| Mundo | Tabla | Rol |
|-------|-------|-----|
| Verdad Retail | `registro_st_vt_rc_reposicion` | Import Excel |
| Stock piso | `deposito_1_{id}_tienda` | Tablet vende · sectores |
| Reserva POS | `ticket_bandeja_cajero` | Guard sync |

---

## Fases

### Bloque A — Stock dinámico (base operativa)

| Fase | Entregable | Estado |
|------|------------|--------|
| 0 | Doc CHUSAR · etapa · índice :3004 | ✅ |
| 0b | **Visión Hiedra + mensajería CHUSAR** | ✅ 2026-06-24 |
| 1 | Paridad · contadores bandeja · badge ABIERTO/PENDIENTE | ⏳ |
| 2 | Pre-sync diagnóstico integrado UI | ⏳ |
| 3 | Sync inteligente · guard 409 · mensajes operador | ⏳ |
| 4 | Reset POS desde admin (confirmación) | ⏳ |
| 5 | Smoke 6 tiendas · evidencia | ⏳ |
| **1.1** | **Tab Operativa calzado** · triángulo + grilla + cantidad/grada + vitales + precio + caso BCL | ✅ [CHUSAR](../2_modulos/2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_DEPOSITO.md) · precio/caso 2026-06-28 |
| **1.1b** | **Tab Operativa confecciones** · tablas filtrantes L/R/Color · thumb `imagen_nombre` | 🟢 [CHUSAR](../2_modulos/2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_CONFECCIONES.md) · UI 📋 |
| **1.2** | **Tab Filtros por índice** · puente Motor Precios → stock Bazzar | ✅ [CHUSAR](../2_modulos/2.3_report/depositos/CHUSAR_FILTROS_POR_INDICE_DEPOSITO.md) · cierre 2026-06-27 |
| **1.3** | **CSV sdfm · Hiedra Venenosa** · import molecular · dual 654/638 | 🟡 [CHUSAR 1.3](../2_modulos/2.3_report/depositos/CHUSAR_IMPORT_CSV_HIEDRA_VENENOSA.md) · [pilares+bulk 1.3.3](../2_modulos/2.3_report/depositos/CHUSAR_IMPORT_CSV_PILARES_PROVISION.md) · UI ✅ · ritual 4708 ⏳ |
| **1.3b** | Modo MERGE · preview API | MERGE ✅ · preview 📋 |

### Bloque B — Sectorización pilares

| Fase | Entregable | Estado |
|------|------------|--------|
| 6 | CRUD sectores (filtros 5 pilares) · preview pares afectados | 📋 |

### Bloque C — Reglas comerciales

| Fase | Entregable | Estado |
|------|------------|--------|
| 7 | Descuentos · promociones · reglas por sector · vigencia | 📋 |

### Bloque D — Muestrario

| Fase | Entregable | Estado |
|------|------------|--------|
| 8 | Flag muestrario · reposición · auditoría admin | 📋 |

### Bloque E — Mensajería Report → Tablet

| Fase | Entregable | Estado |
|------|------------|--------|
| 9 | Migración `deposito_alerta` · API Report crear/listar | 📋 |
| 10 | UI tablet bandeja alertas · ack · badge header | 📋 |

---

## Fuera de alcance

- Sales Report (`registro_ventas_general_v2`)
- Mutación pilares desde panel depósito
- Reglas comerciales creadas en tablet
- Sync guardado/averiado (ETL pendiente)
- Escritura en `ticket_pos_staging` / `ticket_venta_pos` (legacy)

---

## URLs dev

| App | URL |
|-----|-----|
| Panel admin | http://localhost:3001/depositos-bazzar |
| Tablet depósito | http://localhost:3002/deposito |
| Navegador etapas | http://localhost:3004/etapas/t/2.3.2.1.1 |

---

**Shibboleth:** Chayanne el mejor
