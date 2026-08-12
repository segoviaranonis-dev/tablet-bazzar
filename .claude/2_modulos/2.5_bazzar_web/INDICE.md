# 2.5 BAZZAR WEB — Catálogo público + Checkout

**Tipo:** App Next.js B2C  
**Repo:** `bazzar-web/`  
**Estado:** ✅ Etapa catálogo :3002 **CERRADA** 2026-07-16  
**Última actualización:** 2026-08-12 · **Primera compra+EDB 2.5.1.34** · sellos **2.5.1.33** · Bancard Laura 2.5.1.32 · 🆕 MOISES  




**Etapa (aparcada · meta 01-09):** [ETAPA_FINAL_BAZZAR_WEB_20260806.md](../../4_etapas/ETAPA_FINAL_BAZZAR_WEB_20260806.md) · `FINAL-BAZZAR-WEB-20260806`  
**CHUSAR lanzamiento:** [CHUSAR_FINAL_BAZZAR_WEB_LANZAMIENTO_20260901.md](./CHUSAR_FINAL_BAZZAR_WEB_LANZAMIENTO_20260901.md) (**2.5.1.18**) · FOCO holding cedido a Situación financiera Rimec (**2.3.1.50**)  
**Etapa cerrada previa:** [ETAPA_PRUEBA_BAZZAR_WEB_FASE1…CERRADA](../../4_etapas/ETAPA_PRUEBA_BAZZAR_WEB_FASE1_RECETEO_20260802_CERRADA.md) · `PRUEBA-BAZZAR-WEB-FASE1-20260802`  
**Auditorías:** [integridad CERRADA](../../4_etapas/ETAPA_AUDITORIA_INTEGRIDAD_STOCK_BAZZAR_WEB_20260801_CERRADA.md) · [Depósito Web CERRADA](../../4_etapas/ETAPA_AUDITORIA_DEPOSITO_WEB_20260801_CERRADA.md)  
**Catálogo histórico:** [ETAPA_BAZZAR_WEB_CATALOGO_3002_20260716_CERRADA.md](../../4_etapas/ETAPA_BAZZAR_WEB_CATALOGO_3002_20260716_CERRADA.md)

---

## Descripción

E-commerce **cliente final Bazzar**. Separado de RIMEC Web (B2B mayoristas).

| App | Clientes | Tabla |
|-----|----------|-------|
| **Bazzar Web** | Consumidor final tiendas | `cliente_web` |
| RIMEC Web | Mayoristas | `cliente_v2` |

---

## CHUSAR — operaciones documentadas

| Código | Doc | Tema |
|--------|-----|------|
| **2.5.1.34** | **[CHUSAR_PRIMERA_COMPRA_SIM_DESEMPENO_EDB_20260812.md](./CHUSAR_PRIMERA_COMPRA_SIM_DESEMPENO_EDB_20260812.md)** | 🟡 **FOCO** · 1ª compra pedido nº1 · sim desempeño EDB · misma etapa integridad 2 · 🆕 MOISES post-20260807 · 2026-08-12 |
| **2.5.1.33** | **[CHUSAR_MOTOR_PRECIO_SELLOS_FANTASMAS_PURGE_20260812.md](./CHUSAR_MOTOR_PRECIO_SELLOS_FANTASMAS_PURGE_20260812.md)** | 🟢 **Sellos fantasmas** · purge huérfanos · CONFLICTO solo sello real · prueba limpia · 🆕 MOISES post-20260807 · 2026-08-12 |
| **2.5.1.32** | **[CHUSAR_BANCARD_CONTACTO_LAURA_STANDBY_FOTO_20260811.md](./CHUSAR_BANCARD_CONTACTO_LAURA_STANDBY_FOTO_20260811.md)** | ⏳ **Bancard** · Laura Vera WhatsApp · standby cambio foto · aguardando · 🆕 MOISES |
| **2.5.1.31** | **[CHUSAR_MAPA_CARRITO_HECTOR_PE_PRE_BAZZAR_20260811.md](./CHUSAR_MAPA_CARRITO_HECTOR_PE_PRE_BAZZAR_20260811.md)** | 🟢 **Mapa** · carrito Héctor PE 1258/163M · paridad UI · puente Bazzar · 🆕 MOISES |
| **2.5.1.30** | **[CHUSAR_INTEGRIDAD_2_BANCARD_EDB_20260811.md](./CHUSAR_INTEGRIDAD_2_BANCARD_EDB_20260811.md)** | 🟢 **FOCO** · 2ª integridad · Bancard + EDB · prep carga stock · protocolos · 🆕 MOISES |
| **2.7.2** | **[../2.7_delivery_bazzar/CHUSAR_EDB_FOCO_PENDIENTE_BAZZAR_WEB_20260811.md](../2.7_delivery_bazzar/CHUSAR_EDB_FOCO_PENDIENTE_BAZZAR_WEB_20260811.md)** | EDB siglas · pendientes B1–E9 · Protocolo Chusar Activado · 🆕 |
| **2.5.1.29** | **[CHUSAR_RECETEO_PRUEBAS_FACTURA1_20260810.md](./CHUSAR_RECETEO_PRUEBAS_FACTURA1_20260810.md)** | 🟢 Receteo ALM_WEB · mapa 1718→0 · pedido nº 1 · etapa pruebas · 🆕 MOISES |
| **2.5.1.28** | **[CHUSAR_CHECKOUT_MAPA_ENTREGA_DELIVERY_20260810.md](./CHUSAR_CHECKOUT_MAPA_ENTREGA_DELIVERY_20260810.md)** | 🗺️ Checkout mapa · pin · geoloc · sugerencias · prep D/C/D · Delivery · 🆕 MOISES |
| **2.5.1.27** | **[CHUSAR_BOVEDA_ORO_WEB_CONTROL_PAGO_DELIVERY_20260810.md](./CHUSAR_BOVEDA_ORO_WEB_CONTROL_PAGO_DELIVERY_20260810.md)** | 🏆 Bóveda Oro WEB · panel Report · Bancard · Delivery · futuro contable · 🆕 MOISES |
| **2.5.1.26** | **[CHUSAR_ERROR_BAZZAR_CARRITO_IMAGEN_NIIF_20260810.md](./CHUSAR_ERROR_BAZZAR_CARRITO_IMAGEN_NIIF_20260810.md)** | ✅ Error · Mi Pedido sin foto · cascada NIIF partida · **4.05.05.001** · 🆕 MOISES |
| **2.5.1.25** | **[CHUSAR_ERROR_BAZZAR_638_PRECIO_TALLE_FALSO_PASS_20260810.md](./CHUSAR_ERROR_BAZZAR_638_PRECIO_TALLE_FALSO_PASS_20260810.md)** | 🔴 Error · un precio vs multi-LPN PPD · falso PASS · **4.05.03.004** · ley 638 única · norte/Faro · 🆕 MOISES |
| **2.5.1.24** | **[CHUSAR_IMAGEN_PORTADA_MARCAS_INICIO_20260807.md](./CHUSAR_IMAGEN_PORTADA_MARCAS_INICIO_20260807.md)** | Inicio/hero · Storage `productos/portada/` · orden marcas · `objectPosition` 4:5 · keyword **imagen de portada** · `2.01.04.024` · 🆕 MOISES post-20260807 |
| **2.5.1.23** | **[CHUSAR_CATALOGO_GRILLA_638_PRECIO_TALLE_20260807.md](./CHUSAR_CATALOGO_GRILLA_638_PRECIO_TALLE_20260807.md)** | 🟡 PARCIAL · UI buckets · **no** paridad multi-LPN · ver **2.5.1.25** |
| **2.5.1.22** | **[CHUSAR_MOTOR_PRECIO_PUBLICADO_PENDIENTE_20260806.md](./CHUSAR_MOTOR_PRECIO_PUBLICADO_PENDIENTE_20260806.md)** | Motor · pestañas Publicado/Pendiente · multi-select · puerta tienda · conflictos CASO · **hijos sellos: 2.5.1.33** |
| **2.5.1.36** | **[CHUSAR_MEGA_MENU_REBAJAS_TRES_PANELES_20260812.md](./CHUSAR_MEGA_MENU_REBAJAS_TRES_PANELES_20260812.md)** | Mega Rebajas 3 paneles · género·marca·estilo · portada BR Sport · 🆕 2026-08-12 |
| **2.5.1.35** | **[CHUSAR_FILTROS_AMIGABLES_METRICAS_SIAMESES_20260812.md](./CHUSAR_FILTROS_AMIGABLES_METRICAS_SIAMESES_20260812.md)** | Filtros amigables desde métricas siameses · FOCO · 🆕 2026-08-12 |
| **2.5.1.21** | **[CHUSAR_MOTOR_PRECIO_CASCADA_SIAMESE_20260806.md](./CHUSAR_MOTOR_PRECIO_CASCADA_SIAMESE_20260806.md)** | Motor Guardián · cascada PE siamese · UI flotante · deploy Report |
| **2.5.1.20** | **[CHUSAR_FILTROS_SIAMESES_DEPOSITO_BAZZAR_CATALOGO_20260806.md](./CHUSAR_FILTROS_SIAMESES_DEPOSITO_BAZZAR_CATALOGO_20260806.md)** | Cascada dimensión→molécula **DW↔BZ** · AB-CR tipología · **2.2.1.44** |
| **2.5.1.19** | **[CHUSAR_MOTOR_PRECIO_CASO_DPE_NORMAL_20260806.md](./CHUSAR_MOTOR_PRECIO_CASO_DPE_NORMAL_20260806.md)** | Motor CASO ← DPE · etiqueta **NORMAL** (no REGULAR) · sdrm3901 |
| **2.5.1.18** | **[CHUSAR_FINAL_BAZZAR_WEB_LANZAMIENTO_20260901.md](./CHUSAR_FINAL_BAZZAR_WEB_LANZAMIENTO_20260901.md)** | Final Bazzar Web · **aparcada** · go-live **01-09-2026** · etapa `FINAL-BAZZAR-WEB-20260806` |
| — | [LEY_ETIQUETA_NIVEL_SUPERIOR_UI.md](../../../1_fundamentos/1.3_politicas/LEY_ETIQUETA_NIVEL_SUPERIOR_UI.md) | **5.01.00.020** · UI «Superior» — botón protocolo precios en reposición |
| **2.5.1.17** | **[CHUSAR_TRP_GRADAS_INFANTIL_PPD_HUERFANO_20260805.md](./CHUSAR_TRP_GRADAS_INFANTIL_PPD_HUERFANO_20260805.md)** | TRP ≠ FI · tallas &lt;20 + PPD huérfano · PE-237 resync · **4.05.03.001** |
| **2.5.1.16** | **[CHUSAR_HANDOFF_STOCK_5000_TRP_638_CIERRE_DIA_20260802.md](./CHUSAR_HANDOFF_STOCK_5000_TRP_638_CIERRE_DIA_20260802.md)** | **Handoff noche** · PE-237 12/12 TRP · fix `4.05.03.003` · Compra Web mañana |
| **2.5.1.15** | **[CHUSAR_STOCK_INICIAL_PEDIDO_5000_KYLY_PARIDAD_20260802.md](./CHUSAR_STOCK_INICIAL_PEDIDO_5000_KYLY_PARIDAD_20260802.md)** | Pedido 5000 → ALM · Kyly abierta=cerrada ley · fix extract TRP |
| **2.5.1.14** | **[CHUSAR_HEADER_FILTROS_SIAMESES_BAZZAR_20260802.md](./CHUSAR_HEADER_FILTROS_SIAMESES_BAZZAR_20260802.md)** | Header amputado · Dimensiones/Molécula · smoke filtros |
| **2.5.1.13** | **[CHUSAR_PURGE_BAZZAR_WEB_RECETEO_VACIO_20260802.md](./CHUSAR_PURGE_BAZZAR_WEB_RECETEO_VACIO_20260802.md)** | **Purge ALM_WEB vacío** · sin devolver a RIMEC · Compra Web / FI 5000 · fase 1 cerrada |
| **2.5.1.12** | **[CHUSAR_ACTVITTA_PRENDAS_DPE_PE_20260802.md](./CHUSAR_ACTVITTA_PRENDAS_DPE_PE_20260802.md)** | ACTVITTA PRENDAS · DPE COD.GRUPO · PE P/M/G/GG · ALM contaminado |
| **2.5.1.11** | **[CHUSAR_CATALOGO_GRADA_FILTROS_SIAMESES_RECETEO_20260802.md](./CHUSAR_CATALOGO_GRADA_FILTROS_SIAMESES_RECETEO_20260802.md)** | Catálogo · 638 PPD + PRENDAS PE · filtros siameses · **publica** / receteo |
| **2.5.1.10** | **[CHUSAR_GRADA_SIAMESE_ESTADISTICAS_STOCK_20260802.md](./CHUSAR_GRADA_SIAMESE_ESTADISTICAS_STOCK_20260802.md)** | **Grada siamese** · Estadísticas=base · catálogo+Depósito Web chips+qty |
| **2.5.1.9** | **[PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md](../../3_arquitectura/3.2_venta_tienda/PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md)** | **Grada abierta 638** · am_talle · ok_grada · error **4.05.03.002** · **3.02.00.638** |
| **2.5.1.8** | **[CHUSAR_ADECUACION_BAZZAR_RIMEC_AUDITORIA_SENIOR_20260802.md](./CHUSAR_ADECUACION_BAZZAR_RIMEC_AUDITORIA_SENIOR_20260802.md)** | Anti-mediocridad · gaps · roadmap F0–F4 · F0–F2 locales |
| **2.5.1.7** | **[CHUSAR_AUDITORIA_LOCAL_STOCK_BAZZAR_WEB_20260802.md](./CHUSAR_AUDITORIA_LOCAL_STOCK_BAZZAR_WEB_20260802.md)** | **Estadísticas de Stock** · v2.4 · fotos · orden 638 |
| **2.5.1.6.1** | **[CHUSAR_AUDITORIA_ESTILO_SIAMESE_LR_PE_20260812.md](./CHUSAR_AUDITORIA_ESTILO_SIAMESE_LR_PE_20260812.md)** | Por estilo · siamese LR+PE · no OTROS hardcode · 🆕 2026-08-12 |
| **2.5.1.6** | **[CHUSAR_AUDITORIA_INTEGRIDAD_STOCK_BAZZAR_WEB_20260801.md](./CHUSAR_AUDITORIA_INTEGRIDAD_STOCK_BAZZAR_WEB_20260801.md)** | Report panel 2 cuadros · **CERRADA** con oleada |
| **2.5.1.5** | **[CHUSAR_MOTOR_PRECIO_IMAGENES_NIIF_20260801.md](./CHUSAR_MOTOR_PRECIO_IMAGENES_NIIF_20260801.md)** | **NIIF** · thumbs Motor precio · códigos 654 · Ley `2.01.04.021` |
| **2.5.1.4** | **[CHUSAR_MOTOR_PRECIO_LPN_CASO_PPD_HUERFANO_20260801.md](./CHUSAR_MOTOR_PRECIO_LPN_CASO_PPD_HUERFANO_20260801.md)** | **Fix** · LPN/CASO Motor precio · ppd_id huérfano · 107/107 |
| **2.5.1.3** | **[CHUSAR_AUDITORIA_DEPOSITO_WEB_REPORT_20260801.md](./CHUSAR_AUDITORIA_DEPOSITO_WEB_REPORT_20260801.md)** | Depósito Web Report · etapa **CERRADA** 2026-08-02 |
| **2.5.1.2** | **[CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md](./CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md)** | **Depósito Web · grada 8/12 · purge 5000 · cache API** |
| 2.5.1.1 | [ETAPA … CERRADA](../../4_etapas/ETAPA_BAZZAR_WEB_CATALOGO_3002_20260716_CERRADA.md) | Cierre etapa Stock Sano · NIIF · :3002 |
| — | **[CHUSAR_CHECKOUT_CLIENTE_CEDULA.md](./CHUSAR_CHECKOUT_CLIENTE_CEDULA.md)** | Carrito → checkout → cédula → `cliente_web` |
| — | [CHUSAR_CATALOGO_GRILLA_VENTA_ABIERTA.md](../../../bazzar-web/docs/CHUSAR_CATALOGO_GRILLA_VENTA_ABIERTA.md) | Grilla SANO · Stock Sano · v_stock_web |
| — | [ESTADO_BAZZAR_WEB_2026.md](../../../bazzar-web/docs/ESTADO_BAZZAR_WEB_2026.md) | Snapshot histórico (pre-grada ficticia) |
| — | [docs/CONTEXT.md](../../../bazzar-web/docs/CONTEXT.md) | Contexto app |

**Depósito Web (Report):** https://rimec-report.vercel.app/bazzar-web/deposito-web · ALM_WEB_01 post-purge (**2.5.1.13**) · TRP PE-237 ENVIADO (**2.5.1.16**) · integridad CUADRA (**2.5.1.17**) · falta confirmar recepción (orden)

---

## Flujo carrito (resumen)

1. `CartContext` + `CartDrawer` en catálogo  
2. `/checkout` — cédula con autocomplete (`buscarClientePorCedula`)  
3. `crearPedido` — upsert `cliente_web` + `pedido_web`

**Código:** `app/actions/checkout.ts` · `app/(public)/checkout/page.tsx`

---

## Índice Moria / Portal

http://localhost:3004/modulos/bazzar-web

---

## Réplica Tablet

Tablet POS debe usar la **misma tabla `cliente_web`** — ver:

`.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_POS_CLIENTE_CEDULA.md`

---

## NIIF / marca

Naranja institucional `#ea580c` · Navy `#1E3A5F` en catálogo web.

---

**Shibboleth:** Andrés, el que viene.
