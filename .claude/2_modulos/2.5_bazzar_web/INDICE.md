# 2.5 BAZZAR WEB — Catálogo público + Checkout

**Tipo:** App Next.js B2C  
**Repo:** `bazzar-web/`  
**Estado:** ✅ Etapa catálogo :3002 **CERRADA** 2026-07-16  
**Última actualización:** 2026-08-02 · cierre integridad+grada · **2.5.1.11** catálogo · **publica**  

**Etapa cerrada hoy:** [ETAPA_AUDITORIA_INTEGRIDAD…CERRADA](../../4_etapas/ETAPA_AUDITORIA_INTEGRIDAD_STOCK_BAZZAR_WEB_20260801_CERRADA.md) · `AUDITORIA-INTEGRIDAD-STOCK-BAZZAR-20260801`  
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
| — | [LEY_ETIQUETA_NIVEL_SUPERIOR_UI.md](../../../1_fundamentos/1.3_politicas/LEY_ETIQUETA_NIVEL_SUPERIOR_UI.md) | **5.01.00.020** · UI «Superior» — botón protocolo precios en reposición |
| **2.5.1.12** | **[CHUSAR_ACTVITTA_PRENDAS_DPE_PE_20260802.md](./CHUSAR_ACTVITTA_PRENDAS_DPE_PE_20260802.md)** | ACTVITTA PRENDAS · DPE COD.GRUPO · PE P/M/G/GG · ALM contaminado |
| **2.5.1.11** | **[CHUSAR_CATALOGO_GRADA_FILTROS_SIAMESES_RECETEO_20260802.md](./CHUSAR_CATALOGO_GRADA_FILTROS_SIAMESES_RECETEO_20260802.md)** | Catálogo · 638 PPD + PRENDAS PE · filtros siameses · **publica** / receteo |
| **2.5.1.10** | **[CHUSAR_GRADA_SIAMESE_ESTADISTICAS_STOCK_20260802.md](./CHUSAR_GRADA_SIAMESE_ESTADISTICAS_STOCK_20260802.md)** | **Grada siamese** · Estadísticas=base · catálogo+Depósito Web chips+qty |
| **2.5.1.9** | **[PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md](../../3_arquitectura/3.2_venta_tienda/PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md)** | **Grada abierta 638** · am_talle · ok_grada · error **4.05.03.002** · **3.02.00.638** |
| **2.5.1.8** | **[CHUSAR_ADECUACION_BAZZAR_RIMEC_AUDITORIA_SENIOR_20260802.md](./CHUSAR_ADECUACION_BAZZAR_RIMEC_AUDITORIA_SENIOR_20260802.md)** | Anti-mediocridad · gaps · roadmap F0–F4 · F0–F2 locales |
| **2.5.1.7** | **[CHUSAR_AUDITORIA_LOCAL_STOCK_BAZZAR_WEB_20260802.md](./CHUSAR_AUDITORIA_LOCAL_STOCK_BAZZAR_WEB_20260802.md)** | **Estadísticas de Stock** · v2.4 · fotos · orden 638 |
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

**Depósito Web (Report):** https://rimec-report.vercel.app/bazzar-web/deposito-web · ALM_WEB_01 ~1132 pares (post-ajuste 2026-07-16)

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
