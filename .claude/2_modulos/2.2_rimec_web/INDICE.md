# 2.2 RIMEC WEB - Catálogo Vendedores

**Tipo:** Módulo Web Público  
**Tecnología:** Next.js + Vercel  
**Estado:** Producción  
**URL:** https://rimec-web.vercel.app  
**Última actualización:** 2026-08-04 · extirpación PDF Catálogo **2.2.1.41** · hotfix TODOS+Calzado **2.2.1.39**

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

### **Extirpación botón PDF Catálogo (2026-08-04 · Documenta)**
- **[CHUSAR_EXTIRPACION_BOTON_PDF_CATALOGO_20260804.md](./CHUSAR_EXTIRPACION_BOTON_PDF_CATALOGO_20260804.md)** — **2.2.1.41** · botón dorado fuera · sustituye cocina PE bandeja · **no va en el próximo deploy**

### **Etapa activa · Hotfix TODOS+Calzado (2026-08-01 · bug urgente)**
- **[ETAPA_HOTFIX_CATALOGO_TODOS_CALZADO_20260801.md](../../4_etapas/ETAPA_HOTFIX_CATALOGO_TODOS_CALZADO_20260801.md)** — **2.2.1.39** · landing vendedores · timeout prod · fix local ✅
- **[CHUSAR_HOTFIX_CATALOGO_TODOS_CALZADO_20260801.md](./CHUSAR_HOTFIX_CATALOGO_TODOS_CALZADO_20260801.md)** — **2.2.1.39** · batch CP/PE · RPC eficiente · filtros degradado

### **Etapa activa · CP confecciones (2026-07-29 · pausa foco)**
- **[ETAPA_CP_CONFECCIONES_OK_20260729.md](../../4_etapas/ETAPA_CP_CONFECCIONES_OK_20260729.md)** — **2.2.1.36** · Compra previa confecciones **638** · `:3001` · EN CURSO

### **Catálogo · percepción velocidad (2026-07-28 · pre-entrega · local)**
- **[CHUSAR_CATALOGO_PERCEIVED_PERFORMANCE_20260728.md](./CHUSAR_CATALOGO_PERCEIVED_PERFORMANCE_20260728.md)** — **2.2.1.33** · skeleton 30 · SWR · overlay no bloquea · prefetch scroll · rollback · fin de semana = índices BD

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

### **CABECERA DE FILTROS catálogo (2026-07-08 · actualizado 2026-07-17)**
- **[CHUSAR_CORTE_20260717_HEADER_PRECIOS_PE.md](./CHUSAR_CORTE_20260717_HEADER_PRECIOS_PE.md)** — **2.2.1.14** · corte Documenta+despliega: header CP/PE · fuga precios confecciones · PE≠PP
- **[CHUSAR_HEADER_ORIGEN_CP_PE_20260717.md](./CHUSAR_HEADER_ORIGEN_CP_PE_20260717.md)** — **2.2.1.13** · header Compra previa \| Pronta entrega · sin mega género · filtros URL conservados
- **[CHUSAR_CATALOGO_CABECERA_FILTROS.md](./CHUSAR_CATALOGO_CABECERA_FILTROS.md)** — **2.2.1.1** · Tono · sidebar Dimensiones/Molécula · enrich `color.tono_canon`
- Estándar holding: [CABECERA_DE_FILTROS.md](../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)

### **Go-live CP + PE (2026-07-12 · CERRADA · prod `c757dbf`)**
- **[CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md](./CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md)** — **2.2.1.2** · mapa 3 vías · tip `c757dbf` · https://rimec-web.vercel.app
- **[DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md](./DOC_BUG_PE_CAJAS_CERRADAS_PLUS_CARTERAS_20260713.md)** — **2.2.1.2.1** · hotfix PE caja cerrada + «+» carteras · Track 3
- **[DOC_HANDOFF_CURSOR_PE_RESIDUAL_20260712.md](./DOC_HANDOFF_CURSOR_PE_RESIDUAL_20260712.md)** — **2.2.1.2.2** · sesión Cursor 12-07 · 1 par/click residual · ⚠ vs DOC_BUG · parking Track 3
- **[CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md](./CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md)** — **2.2.1.2.1** · FI/PVR prueba → revertir solo con orden explícita
- **[CHUSAR_REVERSION_PVR_A_CARRITO_COMPLETA.md](./CHUSAR_REVERSION_PVR_A_CARRITO_COMPLETA.md)** — **2.2.1.2.3** · checklist 7 pasos · PVR-144866 lecciones · purge test 5000
- **Etapa CERRADA:** [ETAPA_RIMEC_WEB_PE_LOCAL_20260706_CERRADA.md](../../4_etapas/ETAPA_RIMEC_WEB_PE_LOCAL_20260706_CERRADA.md)

### **Sesión 2026-07-20 · Preventa · UI dato duro · Centena (★ Documenta)**
- **[CHUSAR_SESION_DURO_PREVENTA_UI_PRECIOS_20260720.md](../2.3_report/gestion_compra/CHUSAR_SESION_DURO_PREVENTA_UI_PRECIOS_20260720.md)** — **2.3.1.32** · consolidación rigurosa · mapa código · smoke
- **[CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md](./CHUSAR_ACORDEON_DATO_DURO_CATALOGO.md)** — **2.2.1.0.10** · dos filas CP · colores · center · nowrap
- **[CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md](../2.3_report/gestion_compra/CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md)** — **2.3.1.31** · mapa superficies · checklist

### **PROMOCIONAL · LPC03 + badge PROMO (2026-07-07 · solo local)**
- **[CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md](./CHUSAR_PROMOCIONAL_UI_LPC03_LOCAL.md)** — **2.2.1.0.1** · LPN=LPC03=LPC04 · pill verde · precio por lote
- **Regla motor:** [CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md](../2.3_report/motor_precios/CHUSAR_EXCEPCION_PROMOCIONAL_LPC03_LPN.md) (**2.3.1.7.1.0.1**)
- **Redondeo centena:** [CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md](../2.3_report/motor_precios/CHUSAR_REGLA_REDONDEO_CENTENA_PROXIMA.md) (**2.3.1.7.1.0.2** · Documenta 2026-07-20)
- **Sin +10 % LP03 (2026-07-29):** [CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_WEB_20260729.md](./CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_WEB_20260729.md) — **2.2.1.34** · anti doble descuento · par **2.3.1.10.1.4.4**
- **Siamese Estilo/Género pilares (2026-07-29):** [CHUSAR_SIAMESE_ESTILO_GENERO_PILARES_20260729.md](./CHUSAR_SIAMESE_ESTILO_GENERO_PILARES_20260729.md) — **2.2.1.35** · FK `/pilares` · anti 638↔654 · par AM/DPE **2.3.1.10.1.6**
- **Imagen hold sin parpadeo (2026-07-29):** [CHUSAR_IMAGEN_HOLD_SIN_PARPADEO_20260729.md](./CHUSAR_IMAGEN_HOLD_SIN_PARPADEO_20260729.md) — **2.2.1.37** · ProductImage · lightbox · Seguir comprando SPA
- **Scope ramo por usuario 654/638 (2026-07-30):** [CHUSAR_CATALOGO_SCOPE_RAMO_POR_USUARIO_20260730.md](./CHUSAR_CATALOGO_SCOPE_RAMO_POR_USUARIO_20260730.md) — **2.2.1.38** · DARIO/PATRICIA solo 638 · resto vendedores solo 654 · accesos `:3004`
- **Regla Director:** documentar cada micro-objetivo local antes de Git/Vercel

### **Compras masivas · stress test cliente 5000 (2026-07-19 · ★ PARÉNTESIS EOD)**
- **[CHUSAR_COMPRAS_MASIVAS_STRESS_5000_20260719.md](./CHUSAR_COMPRAS_MASIVAS_STRESS_5000_20260719.md)** — **2.2.1.17** · stress CP+PE · solo 5000 · purge EOD · [ETAPA_COMPRAS_MASIVAS_CLIENTE_5000_20260719.md](../../4_etapas/ETAPA_COMPRAS_MASIVAS_CLIENTE_5000_20260719.md)

### **Handoff previo a nueva etapa (2026-07-20)**
- **[CHUSAR_HANDOFF_PRE_NUEVA_ETAPA_20260720.md](./CHUSAR_HANDOFF_PRE_NUEVA_ETAPA_20260720.md)** — bug urgente RIMEC Web pendiente de ruta/síntoma · Report local `.next` pendiente · portón de nueva etapa

### **Protocolo unificado · Hermanos siameses (2026-08-06 · ★ Documenta · MAESTRO)**
- **[CHUSAR_HOTFIX_LPN_LPC03_TACHADO_IGUAL_20260806.md](./CHUSAR_HOTFIX_LPN_LPC03_TACHADO_IGUAL_20260806.md)** — **2.2.1.49** · tachado LPN≠LPC03 · PE+CP · error `4.01.04.009` · Documenta + depliega 2026-08-06
- **[CHUSAR_AUDITORIA_FILTROS_GRILLA_META_20260806.md](./CHUSAR_AUDITORIA_FILTROS_GRILLA_META_20260806.md)** — **2.2.1.48** · auditoría grilla∥molécula · solo-PE AB-CR · acotar sintéticos · live cliente · Documenta 2026-08-06
- **[CHUSAR_PROTOCOLO_INSTALACION_FILTROS_PE_ABCR.md](./CHUSAR_PROTOCOLO_INSTALACION_FILTROS_PE_ABCR.md)** — **2.2.1.47** · checklist instalación AB-CR/ESCOLAR/Tipo PE en otros módulos · Documenta 2026-08-06
- **[CHUSAR_PROTOCOLO_DOS_ORIGENES_CUATRO_CANERIAS.md](./CHUSAR_PROTOCOLO_DOS_ORIGENES_CUATRO_CANERIAS.md)** — **2.2.1.46** · CP biblioteca ∥ PE diccionario · 4 cañerías 654/638 · Promo=PROMO+PRO · Normal · LIQ solo PE · Documenta 2026-08-06
- **[CHUSAR_ABCR_ESCOLAR_CHIP_20260806.md](./CHUSAR_ABCR_ESCOLAR_CHIP_20260806.md)** — **2.2.1.45** · AB-CR ESCOLAR referencia completa · `4.01.04.008` ✅ local · Documenta 2026-08-06
- **[CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md](./CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md)** — **2.2.1.44** · palabra reservada **aplica el protocolo hermanos siameses** · grupo uno · cascada · mostrar todo · paginación · cardKey · checklist · errores `4.01.04.007` · regla Cursor

### **Filtro Tipo · hermanos siameses AM↔Web (2026-07-20 · ★ Documenta + fix)**
- **[CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md](./CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md)** — **2.2.1.18** · hijo del maestro **2.2.1.44** · LIQ>Promo>Normal · `es_promo` gana · filtro `3→2→1→Aplicando` · error `4.01.04.002`
- **[CHUSAR_HOTFIX_FI_CASOS_DISTINTOS_20260722.md](./CHUSAR_HOTFIX_FI_CASOS_DISTINTOS_20260722.md)** — **2.2.1.19** · R-FI-1 · no mezclar CASOS en una FI · error `4.01.06.001` · deploy `30a23b8`
- **[CHUSAR_HOTFIX_FI_PROMO_LIQUIDACION_COD_GRUPO_20260722.md](./CHUSAR_HOTFIX_FI_PROMO_LIQUIDACION_COD_GRUPO_20260722.md)** — **2.2.1.20** · R-FI-2 · LIQ≠PROMO · COD.GRUPO Carlos dígito cadena · error `4.01.06.002`

### **Cabecera hueca + filtro precio (2026-07-23 · ★ Inicia etapa + Documenta)**
- **[CHUSAR_CABECERA_HUECA_PRECIO_ESTADO_20260723.md](./CHUSAR_CABECERA_HUECA_PRECIO_ESTADO_20260723.md)** — **2.2.1.21** · **teclado ↔ slider espejo + SQL** (misma consulta) · venta en cabecera · [ETAPA_RIMEC_WEB_CABECERA_PRECIO_20260723.md](../../4_etapas/ETAPA_RIMEC_WEB_CABECERA_PRECIO_20260723.md)

### **PE · descuentos · grada · import sdrm1021 (2026-07-24 · ★ Documenta)**
- **[CHUSAR_PE_DESCUENTO_GRADA_IMPORT_ERRORES_20260724.md](./CHUSAR_PE_DESCUENTO_GRADA_IMPORT_ERRORES_20260724.md)** — **2.2.1.22** · auditoría 12043/184031 · sim Enrique PVR-891496 · errores `4.01.07.003`–`004` · `4.02.04.001`–`003`
- **[CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md](./CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md)** — **2.2.1.21.G1** · palabra reservada **grupo uno** · NORMAL slate · PRO fucsia · LIQ oro · latido casino 1,65 s · CP+PE conviven
- **[HANDOFF diccionario grupo uno](../../4_etapas/HANDOFF_DICCIONARIO_GRUPO_UNO_20260724.md)** — checkpoint 2026-07-24 · derivar etapas

### **HECHO HISTÓRICO · Enrique zapatos / ingresos (2026-07-24 · ★ Documenta)**
- **[CHUSAR_HECHO_HISTORICO_ENRIQUE_ZAPATOS_INGRESOS_20260724.md](./CHUSAR_HECHO_HISTORICO_ENRIQUE_ZAPATOS_INGRESOS_20260724.md)** — **2.2.1.23** · 🔴 primera falla crítica con pérdida de ingresos de persona · `4.01.07.005`

### **Calzado ≠ Carteras · Mario Bros / grupo uno (2026-07-24 · ★ Documenta)**
- **[CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md](./CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md)** — **2.2.1.24** · pill Calzado = NORMAL/PROMO/LIQ solo · carteras módulo propio · error `4.01.04.003` · MIG-181
- **[CHUSAR_ESTILO_TARJETA_638_TRIUNVIRATO_20260727.md](./CHUSAR_ESTILO_TARJETA_638_TRIUNVIRATO_20260727.md)** — **2.2.1.29** · subtítulo tarjeta estilo CP col J + PE ULT-PREC- · **638 ONLY** · error `4.01.04.004` · deploy 2026-07-27
- **[CHUSAR_LIGHTBOX_638_COLORES_DEDUPE_20260727.md](./CHUSAR_LIGHTBOX_638_COLORES_DEDUPE_20260727.md)** — **2.2.1.30** · lightbox carrusel COLORES dedupe tallas · **638 ONLY** · error `4.01.04.005` · deploy `899f1dc` 2026-07-27

### **Filtros PE · tres hermanos siameses · 3/3 (2026-07-26 · ★ Documenta)**
- **[CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md](./CHUSAR_LEY_TODOS_TRES_HERMANOS_SIAMESES_20260726.md)** — **2.2.1.28** · **LEY TODOS** · enmienda Web home Calzado+Todos (**2.2.1.31**) · checklist grillas
- **[CHUSAR_HOME_CALZADO_TODOS_OVERLAY_ORDEN_20260727.md](./CHUSAR_HOME_CALZADO_TODOS_OVERLAY_ORDEN_20260727.md)** — **2.2.1.31** · home Calzado+Todos · overlay 30s fotos · orden L+R+M+C · deploy `0fdc7a5`
- **[CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md](./CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md)** — **2.2.1.25** · Report 99/99 · paridad 100% · Web + AM ✅
- **[CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md](./CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md)** — **2.2.1.27** · Hermano 3 + AM diccionario PE
- Report espejo: [CHUSAR_FILTROS_PE_SIAMESE_REPORT_WEB.md](../2.3_report/deposito_rimec/CHUSAR_FILTROS_PE_SIAMESE_REPORT_WEB.md) (**2.3.1.10.1.3**)

### **Asignación de descuentos PE · dictador (2026-07-26 · ★ Documenta + etapa)**
- Report canónico: [CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md](../2.3_report/deposito_rimec/CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md) (**2.3.1.10.1.4** · par **2.2.1.26**)
- Ley split + LP03: [CHUSAR_LEY_DIVISION_FI_LP03_20260726.md](../2.3_report/deposito_rimec/CHUSAR_LEY_DIVISION_FI_LP03_20260726.md) (**2.3.1.10.1.4.1**)
- **[CHUSAR_COMISION_D1_NO_DESCUENTO_UI_20260726.md](./CHUSAR_COMISION_D1_NO_DESCUENTO_UI_20260726.md)** — **2.2.1.26.1** · D1 diccionario = **comisión** · no imprimir Desc. · badge **PE-LIQ / PE-NORMAL / PE-PROMO / PE-COMUN**
- Etapa: [ETAPA_ASIGNACION_DESCUENTOS_20260726.md](../../4_etapas/ETAPA_ASIGNACION_DESCUENTOS_20260726.md) · PE N/P/LIQ/COMUN · CP casos · marca · LP03 +10 %

### **Hotfix precisión bancaria catálogo (2026-07-19 · ★ Documenta + deploy prod)**
- **[CHUSAR_HOTFIX_CATALOGO_PRECISION_BANCARIA_20260719.md](./CHUSAR_HOTFIX_CATALOGO_PRECISION_BANCARIA_20260719.md)** — **2.2.1.16** · arranque Todos · audit 30 s · TIPO+BCL · pulse Promo/LIQ · badge acordeón `4.02.04.002` · www.rimec.com.py

### **Hotfix AB-CR CARTERAS/ANTEOJOS · siamese Report (2026-07-27 · ★ Documentación Chusar + publica)**
- **[CHUSAR_HOTFIX_ABCR_CARTERAS_ANTEOJOS_WEB_20260727.md](./CHUSAR_HOTFIX_ABCR_CARTERAS_ANTEOJOS_WEB_20260727.md)** — **2.2.1.32** · `tipo_ids=-1/-2` · traductor PE 90000 · Vizzano 60 carteras + 4 anteojos · error `4.01.04.003`

### **Cascada filtros catálogo · dimensión + molécula (2026-08-05 · ★ Documenta · local)**
- **[CHUSAR_ACUSACION_OVERSELL_CP_CARRITO_20260805.md](./CHUSAR_ACUSACION_OVERSELL_CP_CARRITO_20260805.md)** — **2.2.1.43** · SR PV 4099/4100 · FC 1426/26 · ⏳ **reporte enviado · esperando respuesta** · [etapa](../../4_etapas/ETAPA_CP_OVERSELL_ACUSACION_20260805.md)
- **[CHUSAR_CASCADA_FILTROS_CATALOGO_20260805.md](./CHUSAR_CASCADA_FILTROS_CATALOGO_20260805.md)** — **2.2.1.42** · hotfix **2026-08-06** bug urgente Marca→Línea 841 · `needRowsScan`+`acotarMetaRpcDesdeFilas` · `genero_codigos` · MIG-199 · ⛔ sin deploy

### **Doble descuento snapshot↔LPN · Patricia / 654 (2026-08-03 · ★ Documenta)**
- **[CHUSAR_DOBLE_DESCUENTO_SNAPSHOT_LPN_20260803.md](./CHUSAR_DOBLE_DESCUENTO_SNAPSHOT_LPN_20260803.md)** — **2.2.1.40** · F5 20 % + cascada doble · error `4.01.04.006` · pedido **237** · FI **PE-237-010** · recalc APPLY · anti-propagación 654

### **Overlay sincronizando · arranque frío (2026-07-17 · ★ Documenta + deploy)**
- **[CHUSAR_OVERLAY_SINCRONIZANDO_CATALOGO_20260717.md](./CHUSAR_OVERLAY_SINCRONIZANDO_CATALOGO_20260717.md)** — **2.2.1.15** · 30 s · fotos · % por reloj · restaurado `0fdc7a5` · cruza **2.2.1.31**

### **Corte control 2026-07-15 · precios · latencia · tono (★ Documenta)**
- **[CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md](./CHUSAR_CORTE_CONTROL_20260715_PRECIOS_LATENCIA_TONO.md)** — **2.2.1.0.11** · ley LPN/LPC · MIG-151/156/157 local · tono único ficha · arranque frío >1 min (diagnóstico) · ⛔ sin deploy

---

**Última actualización:** 2026-08-05 · **2.2.1.43** acusación oversell CP carrito · etapa observación

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
