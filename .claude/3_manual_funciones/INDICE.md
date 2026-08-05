# 3 · MANUAL DE FUNCIONES — Solo títulos

**Tipo:** Memoria secundaria (estructura).  
**Uso:** El agente abre **solo** el `.md` hijo que corresponda a la tarea.

Formato por función: **3.x.y.z** = objetivo · funcionamiento · glosario (archivos separados cuando existan).

**Migración Streamlit → Report:** [MIGRACION_STREAMLIT_REPORT.md](./MIGRACION_STREAMLIT_REPORT.md) (`3.00.00.002`)

---

## 3.1 · Control Central (Nexus Streamlit)

| # | Función | Objetivo | Funcionamiento | Glosario |
|---|---------|----------|----------------|----------|
| 3.1.1 | Motor de Precios | `2_modulos/2.1_control_central/docs/` *(motor en repo)* | `1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md` | nomenclatura P0 |
| 3.1.2 | Pedido Proveedor / PP | — | `control_central/.cursor/rules/rimec-listado-pp-fi.mdc` | listado · FI · PP |
| 3.1.3 | Aprobaciones (Streamlit) | `2_modulos/2.1_control_central/modules/aprobacion_pedidos/CONTEXT.md` | `MAPA_DATOS_PV.md` | PV · FI |
| 3.1.4 | Retail / Balance tiendas | `2_modulos/2.1_control_central/docs/RETAIL_IMPORT_MODULO.md` | `3_arquitectura/3.2_venta_tienda/` | st+vt+RC |
| 3.1.5 | Sales Report (legacy CC) | `2_modulos/2.1_control_central/modules/sales_report/CONTEXT.md` | `GESTION_DETALLADA_MAPA_TABLA8.md` | 8 tablas |
| 3.1.6 | Compra Web / FI | `2_modulos/2.1_control_central/docs/COMPRA_WEB_LEY_FI.md` | `control_central/.cursor/rules/rimec-ley-fi-card.mdc` | FI card |
| 3.1.7 | Ejecución local | — | `2_modulos/2.1_control_central/docs/COMO_EJECUTAR.md` | puerto 8501 |

---

## 3.2 · Report (Next.js)

| # | Función | Objetivo | Funcionamiento | Glosario |
|---|---------|----------|----------------|----------|
| 3.2.1 | Sales Report `/rimec` | `2_modulos/2.3_report/docs/DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md` | KPI jerarquía doc | maestras (sin pilares) |
| 3.2.2 | Retail `/retail` | `2_modulos/2.3_report/docs/RETAIL_FILTERS_ROBUSTNESS_REPORT.md` | filtros 6 pilares | retail |
| 3.2.3 | Ventas Fotos | `2_modulos/2.3_report/PRUEBAS_CARGA_IMAGENES_PDF.md` | PDF | — |
| 3.2.4 | Aprobaciones `/aprobaciones` | etapa NIIF cerrada | port Streamlit → Next | PV · FI |
| 3.2.5 | Administrador Pilares `/pilares` | `report/docs/ADMINISTRADOR_PILARES.md` · [CHUSAR pilares](../2_modulos/2.3_report/pilares/CHUSAR_ADMINISTRADOR_PILARES.md) | ✅ cerrado · thumb L×R 2026-06-19 | 2.3.5 / 2.3.5.1 / 2.3.5.2 |
| 3.2.6 | **Depósitos Bazzar admin** | [CHUSAR_ADMIN_DEPOSITOS_REPORT.md](../2_modulos/2.6_depositos_bazzar/CHUSAR_ADMIN_DEPOSITOS_REPORT.md) | sync 6 tiendas · `/depositos-bazzar` | cliente_id |
| 3.2.10 | RRHH `/rrhh` · **2.3.10** | `2_modulos/2.3_report/rrhh/INDICE.md` | `4_etapas/ETAPA_RRHH.md` | funcionarios |
| 3.2.7 | Auth / roles | `2_modulos/2.3_report/sistema_permisos.md` | `MATRIZ_ROLES_ACCESOS_HOLDING.md` | rol_id |

---

## 3.3 · RIMEC Web

| # | Función | Objetivo | Funcionamiento | Glosario |
|---|---------|----------|----------------|----------|
| 3.3.1 | Catálogo / filtros | `2_modulos/2.2_rimec_web/README.md` | `3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md` · `rimec-web/lib/atributosLinea.ts` | triángulo · v_stock_rimec |
| 3.3.2 | Preventas / carrito | — | `2_modulos/2.2_rimec_web/arquitectura_molecular.md` | PP · origen |
| 3.3.3 | Estadísticas | — | API `/estadisticas` | stock PP |

---

## 3.4 · Bazzar Web

| # | Función | Objetivo | Funcionamiento | Glosario |
|---|---------|----------|----------------|----------|
| 3.4.1 | E-commerce MVP | `2_modulos/2.5_bazzar_web/NEXUS_OBJETIVO_ACTUAL.md` | `4_etapas/ETAPA_BAZZAR_WEB_PUBLICACION.md` | precio_web |
| 3.4.2 | Roadmap | `2_modulos/2.5_bazzar_web/ROADMAP_ECOMMERCE.md` | — | — |

---

## 3.5 · Tablet Bazzar

| # | Función | Objetivo | Funcionamiento | Glosario |
|---|---------|----------|----------------|----------|
| 3.5.1 | POS / cadena Ventas | [CHUSAR_TABLET_VENTAS.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_VENTAS.md) | [SUBSESION ventas cerrada](../4_etapas/SUBSESION_TABLET_VENTAS_20260617_CERRADA.md) · `TRIANGULO_HEADER_PILARES.md` | triángulo · depósitos |
| 3.5.2 | Depósito consulta stock | [CHUSAR_TABLET_DEPOSITO_FOTOS.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_FOTOS.md) | grid molécula · stock red 3 tiendas | molécula |
| 3.5.3 | Depósito filtros pilares | [CHUSAR_TABLET_DEPOSITO_HEADER_PILARES.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_HEADER_PILARES.md) | header RIMEC · cascada FK · colapsar panel | pilares lectura |
| 3.5.4 | Depósito vidriera estrellas | [CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_VIDRIERA_ESTRELLAS.md) | jefa salón faltantes ⭐ | molécula |
| 3.5.5 | **Prueba integridad stock** | [CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_PRUEBA_INTEGRIDAD_STOCK_BAZZAR.md) | **mañana Fase 1** · Fase 2 sync 6 | cliente_id |
| 3.5.6 | Tickets ORO (pendiente) | [SUBSESION_TABLET_TICKETS_20260617.md](../4_etapas/SUBSESION_TABLET_TICKETS_20260617.md) | `tablet-bazzar/docs/ETAPA_4_TICKET_BOTON.md` | tikeCT · carrito |

**Etapa tablet:** [ETAPA_TABLET_DISENO.md](../4_etapas/ETAPA_TABLET_DISENO.md) 🟢 ACTIVA

---

**Shibboleth:** 7 años · Primaria: `MORIA_PRIMARIA.md`
