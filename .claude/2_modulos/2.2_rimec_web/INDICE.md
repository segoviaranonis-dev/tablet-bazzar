# 2.2 RIMEC WEB - Catálogo Vendedores

**Tipo:** Módulo Web Público  
**Tecnología:** Next.js + Vercel  
**Estado:** Producción  
**URL:** https://rimec-web.vercel.app  
**Última actualización:** 2026-07-16 · deploy descuentos FI + liquidación + casos (**2.2.4.0.13**)

---

## 🎯 DESCRIPCIÓN

RIMEC Web es el catálogo digital para vendedores de RIMEC.

**Funciones principales:**
- Catálogo de productos con imágenes
- Preventas por vendedor
- Carrito de compras
- Confirmación de pedidos
- Autenticación por rol

---

## 📂 ESTRUCTURA

```
2.2_rimec_web/
├── INDICE.md (este archivo)
├── README.md
├── docs/
│   ├── arquitectura.md
│   ├── CLAUDE.md
│   └── DIAGNOSTICO_VERCEL.md
└── scripts/
    └── README (diagnóstico)
```

---

## 📚 DOCUMENTOS CLAVE

### **Configuración**
- **README.md** - Documentación principal del proyecto
- **CLAUDE.md** - Instrucciones para Claude Code

### **Diagnóstico y Deploy**
- **DIAGNOSTICO_VERCEL.md** - Diagnóstico de deploy en Vercel
- **scripts/** - Scripts de diagnóstico

### **Arquitectura**
- **arquitectura.md** - Arquitectura del sistema

### **Hotfix UI · Nivel Superior (2026-07-16)**
- **[LEY_ETIQUETA_NIVEL_SUPERIOR_UI.md](../../1_fundamentos/1.3_politicas/LEY_ETIQUETA_NIVEL_SUPERIOR_UI.md)** — **5.01.00.020** · login `:3001` muestra SUPERIOR · error `4.05.02.001` ✅

### **Imágenes NIIF (2026-07-06)**
- **[CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md](./CHUSAR_NIIF_IMAGENES_PRONTA_ENTREGA.md)** — tiers sm/md/lg · ProductImage · PE + carrito + modal (paridad Tablet depósito)
- **[PROTOCOLO_IMAGENES_CARGA_INTEGRAL_RIMEC_WEB.md](./PROTOCOLO_IMAGENES_CARGA_INTEGRAL_RIMEC_WEB.md)** — **2026-07-07** · keywords `imagen` / `desbordamiento` / prefetch PE tras CP · default Calzados en PE
- **Import batch:** [CHUSAR_IMPORT_IMAGENES_BATCH.md](../2.1_control_central/docs/CHUSAR_IMPORT_IMAGENES_BATCH.md) · keyword **Importar imágenes**

### **Hotfix catálogo + deploy sellado (2026-07-06)**
- **[CHUSAR_HOTFIX_CATALOGO_DEPLOY_20260706.md](./CHUSAR_HOTFIX_CATALOGO_DEPLOY_20260706.md)** — MIG-138 · filtros BD · prod `f408fc2` congelada
- **Etapa PE (CERRADA):** [ETAPA_RIMEC_WEB_PE_LOCAL_20260706_CERRADA.md](../../4_etapas/ETAPA_RIMEC_WEB_PE_LOCAL_20260706_CERRADA.md)
- **Deploy prod:** [CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md](../../1_fundamentos/1.1_protocolos/CHUSAR_DEPLOY_PROD_SOLO_CIERRE_ETAPA.md)

### **Catálogo · dual cache CP↔PE (2026-07-13 · ★ producto)**
- **[CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md](./CHUSAR_DUAL_CACHE_CATALOGO_INSTANTANEO.md)** — **2.2.1.0.2** · ≥30 tarjetas CP+PE · cambio pestaña instantáneo
- **[CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md](./CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md)** — **2.2.1.0.3** · sessionStorage CP↔PE · marca/línea/búsqueda/tono compartidos
- **[DOC_AUDITORIA_LATENCIA_CATALOGO_20260713.md](./DOC_AUDITORIA_LATENCIA_CATALOGO_20260713.md)** — **2.2.1.0.5** · auditoría latencia · plan 7 tareas · etapa ✅ [ETAPA_CATALOGO_LATENCIA_20260713_CERRADA](../../4_etapas/ETAPA_CATALOGO_LATENCIA_20260713_CERRADA.md) (2026-07-16)
- **[CHUSAR_CATALOGO_LATENCIA_T2T7_DEPLOY_20260714.md](./CHUSAR_CATALOGO_LATENCIA_T2T7_DEPLOY_20260714.md)** — **2.2.1.0.7** · MIG-152 RPC meta · filtros SQL · cache warm · deploy prod 2026-07-14
- **[DOC_VULNERABILIDAD_PRECIO_LIGHTBOX_20260714.md](./DOC_VULNERABILIDAD_PRECIO_LIGHTBOX_20260714.md)** — **2.2.1.0.8** · fuga precio pre-activación (lightbox + acordeón) · `4.01.04.001` ✅ UI 2026-07-15
- **[CHUSAR_CLIENTE_5000_PRUEBAS.md](./CHUSAR_CLIENTE_5000_PRUEBAS.md)** — **2.2.1.0.9** · cliente 5000 = pruebas · cruza cierre AM [**2.3.1.25**](../2.3_report/gestion_compra/CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md) 🟡
- **[CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md](./CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md)** — **2.2.1.0.4** · 📋 pill **Todos** · fusión SKU CP+PE · paneles apilados · grada PE vía `ppd.grada` (MIG-150)
- **[CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md](./CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md)** — **2.2.1.0.6** · fix filtro 👕 Confecciones · meta CP+PE · sessionStorage · imágenes 638 94,4%
- **[CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md](./CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md)** — **2.2.1.0.11** · **638 ≠ 654** · peras/manzanas · tallas vs colores · botones precio
- **[CHUSAR_CATALOGO_LATENCIA_CIERRE_20260716.md](./CHUSAR_CATALOGO_LATENCIA_CIERRE_20260716.md)** — **2.2.1.0.12** · **CERRADA** latencia + T8 confecciones · índice integrado · `ETAPA_CATALOGO_LATENCIA_20260713_CERRADA.md`
- **[CHUSAR_PENDIENTES_HANDOFF_CURSOR_20260714.md](./CHUSAR_PENDIENTES_HANDOFF_CURSOR_20260714.md)** — **2.2.1.0.7** · handoff consolidado · esperando Nueva etapa
### **Grilla Rimec (2026-07-14 · ★ clave Director)**
- **[GRILLA_RIMEC.md](../../3_arquitectura/3.2_venta_tienda/GRILLA_RIMEC.md)** — **3.2.00.002** · estándar holding · cabecera + acordeón dato duro + toggle
- **[CHUSAR_GRILLA_RIMEC.md](./CHUSAR_GRILLA_RIMEC.md)** — **2.2.1.11** · implementación referencia catálogo · deploy `96870f3`
- **[CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md](./CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md)** — **2.2.1.0.10** · sub-bloque acordeón
- **[CHUSAR_AUDITORIA_PRE_PROD_20260713.md](./CHUSAR_AUDITORIA_PRE_PROD_20260713.md)** — OK local + checklist pre-deploy
- **[CHUSAR_POST_IMPORT_STOCK_VALIDAR_CARRITOS.md](./CHUSAR_POST_IMPORT_STOCK_VALIDAR_CARRITOS.md)** — **2.2.4.0.2** · VALIDAR tras import stock real
- **[CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md](./CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md)** — **2.2.4.0.1** · RPC bypass PE · enrich CP+PE · anti-doble confirm · duplicado PVR pendiente anular
- **[CHUSAR_DESCUENTOS_FI_TRANSACCION_20260715.md](./docs/CHUSAR_DESCUENTOS_FI_TRANSACCION_20260715.md)** — **2.2.4.0.12** · descuentos por FI · MIG-160 **aplicada** · floor Gs. · modal Guardar descuento · Aprobaciones
- **[CHUSAR_MARCA_LIQUIDACION_PE.md](./CHUSAR_MARCA_LIQUIDACION_PE.md)** — **2.2.1.0.13** · badge Liq. PE · `es_liquidacion` · filtro comercial
- **[CHUSAR_DEPLOY_DESCUENTOS_LIQUIDACION_CASOS_20260716.md](./CHUSAR_DEPLOY_DESCUENTOS_LIQUIDACION_CASOS_20260716.md)** — **2.2.4.0.13** · deploy prod Web+Report · casos PP/PC/PE · orden directa Director

### **Handoff Cursor (2026-07-09 noche)**
- **[CURSOR_CONTINUAR_RIMEC_WEB_PE_LOCAL.md](../../1_fundamentos/1.1_protocolos/CURSOR_CONTINUAR_RIMEC_WEB_PE_LOCAL.md)** — pendientes mañana · terminales cerradas · checklist smoke

### **CABECERA DE FILTROS catálogo (2026-07-08 · solo local)**
- **[CHUSAR_CATALOGO_CABECERA_FILTROS.md](./CHUSAR_CATALOGO_CABECERA_FILTROS.md)** — **2.2.1.1** · Género→TONO · pills naranja · enrich `color.tono_canon` · hotfix columna vista
- Estándar holding: [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)

### **Go-live CP + PE (2026-07-12 · CERRADA · prod `c757dbf`)**
- **[CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md](./CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md)** — **2.2.1.2** · mapa 3 vías · tip `c757dbf` · https://rimec-web.vercel.app
- **[DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md](./DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md)** — **2.2.1.2.1** · hotfix PE caja cerrada + «+» carteras · Track 3
- **[DOC_HANDOFF_CURSOR_PE_RESIDUAL_20260712.md](./DOC_HANDOFF_CURSOR_PE_RESIDUAL_20260712.md)** — **2.2.1.2.2** · sesión Cursor 12-07 · 1 par/click residual · ⚠ vs DOC_BUG · parking Track 3
- **[CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md](./CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md)** — **2.2.1.2.1** · FI/PVR prueba → revertir solo con orden explícita
- **[CHUSAR_REVERSION_PVR_A_CARRITO_COMPLETA.md](./CHUSAR_REVERSION_PVR_A_CARRITO_COMPLETA.md)** — **2.2.1.2.3** · checklist 7 pasos · PVR-144866 lecciones · purge test 5000
- **Etapa CERRADA:** [ETAPA_RIMEC_WEB_PE_LOCAL_20260706_CERRADA.md](../../4_etapas/ETAPA_RIMEC_WEB_PE_LOCAL_20260706_CERRADA.md)

### **PROMOCIONAL · LPC03 + badge PROMO (2026-07-07 · solo local)**
- **[CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md](./CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md)** — **2.2.1.0.1** · LPN=LPC03=LPC04 · pill verde · precio por lote
- **Regla motor:** [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](../2.3_report/motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) (**2.3.1.7.1.0.1**)
- **Regla Director:** documentar cada micro-objetivo local antes de Git/Vercel

### **Corte control 2026-07-15 · precios · latencia · tono (★ Documenta)**
- **[CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md](./CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md)** — **2.2.1.0.11** · ley LPN/LPC · MIG-151/156/157 local · tono único ficha · arranque frío >1 min (diagnóstico) · ⛔ sin deploy

---

**Última actualización:** 2026-07-16 · **2.2.4.0.13** deploy descuentos + liquidación + casos

---

## Auth y accesos (✅ cerrado 2026-06-10)

| Tema | Doc |
|------|-----|
| Matriz login Bazzar ADMIN/VENDEDOR | `lib/auth/roles.ts` → `puedeAccederRimecWeb()` |
| Verificación password | `lib/auth/verifyPassword.ts` |
| Etapa cierre | [ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md](../../4_etapas/ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md) |

**Regla:** `rol_id=2` + `VENDEDOR` → 403 en login. ADMIN tienda → catálogo + carrito.

---

## 🚨 ERRORES CONOCIDOS

### **HOTFIX_001 - pv_global null crash**
**Ubicación:** `5_errores/HOTFIX_001_PV_GLOBAL_NULL_CRASH.md`

**Síntoma:** `Cannot read properties of null (reading 'toString')`  
**Causa:** `pv_global` era null en algunos registros  
**Solución:** Defensive programming con `pv_global || 0`

**Estado:** ✅ Resuelto

---

## 🔗 DOCUMENTACIÓN RELACIONADA

- **CABECERA DE FILTROS** *(estándar holding · `FiltrosCatalogo`)*: [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)
- **Errores:** `5_errores/INDICE.md`
- **Pilares RIMEC:** `1_fundamentos/1.2_leyes/pilares_rimec.md`

---

## 🐈 SHIBBOLETH

**Andrés, el que viene.** CHUNA activo · Moria + ACTUAL acatados.

---

**Última actualización:** 2026-06-10 · accesos BZZ Fase 2 cerrada
