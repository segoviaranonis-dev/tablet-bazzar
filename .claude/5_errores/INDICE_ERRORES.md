# ÍNDICE DE ERRORES — Plan de cuentas (clase 4)

**Código:** `4.00.00.001`  
**Keyword:** **Bug urgente!!**  
**Regla:** Aquí **solo títulos**. Cada ítem lleva en el pie la ruta del detalle. Problema = error.

---

## 4.01 · RIMEC Web

### 4.01.01.001 · Crash pv_global null en preventas

*Detalle: `.claude/5_errores/detalle/4.01.01.001_crash-pv-global-null.md`*

### 4.01.02.001 · Turbopack HMR chunk corrupto — dev local (3001)

*Detalle: `.claude/5_errores/detalle/4.01.02.001_rimec-web-turbopack-hmr-chunk.md`*

### 4.01.03.001 · Login Bazzar VENDEDOR bloqueado en prod (BZZS)

*Detalle: `.claude/5_errores/detalle/4.01.03.001_rimec-web-login-bazzar-vendedor-bloqueado.md`* · ✅ **RESUELTO 2026-07-07** · commit `e380dd7` · deploy `dpl_2ERKN7yrXBjj2k1tyeywRXY47ywN`

### 4.01.04.001 · Precios visibles sin activar venta (lightbox + acordeón lote + confecciones)

*Detalle: `.claude/5_errores/detalle/4.01.04.001_rimec-web-precio-lightbox-pre-activacion.md`* · ✅ **RESUELTO UI 2026-07-17** (reapertura confecciones) · doc `2.2_rimec_web/DOC_VULNERABILIDAD_PRECIO_LIGHTBOX_20260714.md` · residual API JSON opcional

### 4.01.04.002 · PE Tipo Normal deja pasar línea promocional (es_promo vs descp_caso)

*Detalle: `.claude/5_errores/detalle/4.01.04.002_rimec-web-tipo-normal-promo-es-promo.md`* · ✅ **DEPLOY 2026-07-20** · Web `7698eb8` · Report `af68346` · hermanos siameses AM↔Web · doc `2.2_rimec_web/CHUSAR_FILTRO_TIPO_HERMANOS_SIAMESES_20260720.md`

### 4.01.05.001 · Pronta entrega muestra tarjetas Compra previa (quincenas PP)

*Detalle: `.claude/5_errores/detalle/4.01.05.001_rimec-web-pe-muestra-tarjetas-cp.md`* · ✅ **RESUELTO UI 2026-07-17** · deferred origen + validación warm cache · doc `2.2_rimec_web/CHUSAR_CORTE_20260717_HEADER_PRECIOS_PE.md`

---

## 4.02 · Report

### 4.02.01.001 · RRHH 404 en Vercel

*Detalle: `.claude/5_errores/detalle/4.02.01.001_rrhh-404-vercel.md`*

### 4.02.01.002 · Crear biblioteca motor precios — POST ausente · JSON vacío

*Detalle: `.claude/5_errores/detalle/4.02.01.002_biblioteca-post-json-vacio.md`* · ✅ **RESUELTO 2026-07-02** · commit `7afb506`

### 4.02.01.003 · Motor precios Preview — pilares FK (`proveedor_id` · `marca_v2.id_marca`)

*Detalle: `.claude/5_errores/detalle/4.02.01.003_motor-precios-preview-pilares-fk.md`* · ✅ **RESUELTO 2026-07-05** · Alejandro Magno · `evento-pilares.ts`

### 4.02.02.002 · `.next` corrupto — chunk / routes-manifest (dev local)

*Detalle: `.claude/5_errores/detalle/4.02.02.002_report-next-chunk-corrupto.md`*

### 4.02.02.003 · Push main no actualiza rimec-report (proyecto Vercel duplicado)

*Detalle: `.claude/5_errores/detalle/4.02.02.003_vercel-rimec-report-git-no-deploy.md`* · ✅ **MITIGADO 2026-07-02** · ver también `4.02.01.002`

### 4.02.03.001 · Acreditación Report ignoraba ente del usuario

*Detalle: `.claude/5_errores/detalle/4.02.03.001_report-acreditacion-ente-ignorada.md`*

### 4.02.03.002 · Panel Control Compra previa ≠ Estadísticas RIMEC Web

*Detalle: `.claude/5_errores/detalle/4.02.03.002_panel-control-cp-estadisticas-web.md`* · ✅ **RESUELTO 2026-07-05**

### 4.02.03.003 · Stock Tránsito inicial ≠ Estadísticas Web

*Detalle: `.claude/5_errores/detalle/4.02.03.003_stock-transito-inicial-no-canonical.md`* · ✅ **RESUELTO 2026-07-05**

### 4.02.03.004 · «Dato duro» en UI Stock Tránsito

*Detalle: `.claude/5_errores/detalle/4.02.03.004_dato-duro-en-ui-stock-transito.md`* · ✅ **RESUELTO 2026-07-05**

### 4.02.03.005 · Aprobaciones FI LPC03 — listado mal vinculado (PPD snapshot viejo)

*Detalle: `.claude/5_errores/detalle/4.02.03.005_aprobaciones-fi-listado-vincular-erroneo.md`* · ✅ **RESUELTO 2026-07-07** (BD) · deploy Report ⏳

### 4.02.03.006 · Caso Alfredo — import proforma PROGRAMADO PP-16 sin FI

*Detalle: `.claude/5_errores/detalle/4.02.03.006_caso-alfredo-import-programado-pp16.md`* · ✅ **RESUELTO 2026-07-09** · 39 FI · 8.880 pares · etapa [ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md](../4_etapas/ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md)

### 4.02.03.007 · Bandeja IC/Digitación — orden Excel invertido roto por quincena

*Detalle: `.claude/5_errores/detalle/4.02.03.007_ic-bandeja-orden-quincena-vs-excel.md`* · ✅ **RESUELTO 2026-07-09** · commits `bd004c9` · `df38085` · prod Vercel READY

### 4.02.03.010 · Admin IC — botón verde no recalcula FI

*Detalle: `.claude/5_errores/detalle/4.02.03.010_admin-ic-boton-verde-no-recalcula-fi.md`* · 🟡 **PARCIAL 2026-07-12** · PP-0015 shop 2894 · hotfix `regenerar` API

### 4.02.03.012 · Vincular listado PP — FI no recalcula en prod (TS sin Python)

*Detalle: `.claude/5_errores/detalle/4.02.03.012_vincular-listado-prod-fi-sin-recalc.md`* · ✅ **RESUELTO 2026-07-14** · `recalcular-fis-pp.ts` · PP14 rescate BD · push `7b7d5d7`

### 4.02.03.013 · PDF FI tab PP — Python ausente en Vercel

*Detalle: `.claude/5_errores/detalle/4.02.03.013_pdf-fi-prod-sin-python.md`* · ✅ **RESUELTO 2026-07-14** · `run-fi-pdf.ts` + pdf-lib · push `7b7d5d7`

### 4.02.02.004 · Ventas + Fotos PDF — serverless 25 filas vs banner 80

*Detalle: `.claude/5_errores/detalle/4.02.02.004_ventas-fotos-pdf-25-vs-80-serverless.md`* · ✅ **RESUELTO 2026-07-10** · commit `b60fd9d`

### 4.02.03.008 · CSV Aprobaciones — grada metadata `_brand` en grades_json

*Detalle: `.claude/5_errores/detalle/4.02.03.008_csv-grada-metadata-brand-en-grades-json.md`* · ✅ **RESUELTO 2026-07-10** · commit `12edb60`

### 4.02.03.009 · Import proforma — motor pilares omitido (vulnerabilidad grave)

*Detalle: `.claude/5_errores/detalle/4.02.03.009_import-proforma-sin-motor-pilares.md`* · 🟡 **PARCIAL 2026-07-12** · motor TS · backfill · CHUSAR `2.3.1.7.5.3.10`

### 4.02.03.011 · Import PE sdrm — cadena staging≠PPD · Panel desincronizado

*Detalle: `.claude/5_errores/detalle/4.02.03.011_import-pe-sin-cadena-ppd-panel.md`* · 🟡 **CORRECCIÓN 2026-07-14** · pipeline `import_pe_sdrm_pipeline.py` · batch **sdrm0849**

### 4.02.03.014 · PP detalle FI — vendedor oculto (join IC erróneo)

*Detalle: `.claude/5_errores/detalle/4.02.03.014_pp-fi-vendedor-join-ic-oculto.md`* · ✅ **RESUELTO 2026-07-19** · PP-2026-0006 · PATCH vendedor editable

### 4.02.03.015 · CSV general Aprobaciones — líneas duplicadas (join linea sin proveedor)

*Detalle: `.claude/5_errores/detalle/4.02.03.015_csv-general-duplicado-linea-proveedor.md`* · ✅ **RESUELTO 2026-07-20** · `8585.102` ×2 · deploy `e333107`

### 4.02.03.016 · Alejandro Magno — PP abierto y CP vendido sin trazabilidad temporal

*Detalle: `.claude/5_errores/detalle/4.02.03.016_am-pp-abierto-cp-vendido-sin-trazabilidad.md`* · ✅ **RESUELTO 2026-07-21** · `2135.153` · PP abierto 36 ≠ venta histórica `PP-4081` 36

---

## 4.03 · Tablet Bazzar

### 4.03.01.001 · 500 en endpoint depósito filtros

*Detalle: `.claude/5_errores/detalle/4.03.01.001_deposito-filtros-500.md`*

### 4.03.02.001 · Cadena hero/carrusel — foto cortada (Storage crop)

*Detalle: `.claude/5_errores/detalle/4.03.02.001_tablet-cadena-hero-foto-cortada.md`* · **Pie transversal: `4.90.03.002`** · ✅ **RESUELTO 2026-06-16**

### 4.03.02.002 · Cadena vista — filtro TONO anulado (colores fuera de tono)

*Detalle: `.claude/5_errores/detalle/4.03.02.002_cadena-vista-tono-filtro-anulado.md`* · ✅ **RESUELTO 2026-06-27** · commit `9569eb2`

## 4.04 · Control Central

### 4.04.01.001 · Pedidos desincronizados PENDIENTE/CONFIRMADO

*Detalle: `.claude/5_errores/detalle/4.04.01.001_pedidos-desincronizados.md`*

---

## 4.05 · Holding · protocolo / UX

### 4.05.02.001 · Etiqueta «Dios» visible en UI — ofensiva al usuario

*Detalle: `.claude/5_errores/detalle/4.05.02.001_ui-etiqueta-dios-ofensiva-usuario.md`* · ✅ **RESUELTO 2026-07-16** · ley `5.01.00.020`

---

## 4.90 · Transversal — Imágenes

> **Entrada obligatoria agente:** leer **antes de código**  
> `.claude/2_modulos/2.1_control_central/docs/LEY_UNIVERSAL_IMAGENES_PRODUCTO.md` (`2.01.04.021`)  
> Anexo marco: `LEY_INTEGRIDAD_VISUAL_IMAGEN.md`  
> Keywords: *infección* · *marco violado* · *integridad visual* · `Importar imágenes` · `IMG-FAIL-OVERFLOW-THUMB`  
> Moria §5.10 · `protocolo_errores.md` PASO 1b

### 4.90.03.001 · Desbordamiento de miniatura en grilla

*Detalle: `.claude/5_errores/detalle/4.90.03.001_overflow-thumb-grilla.md`*

### 4.90.03.002 · Recorte calzado en tier Storage (sm/md/lg)

*Detalle: `.claude/5_errores/detalle/4.90.03.002_storage-crop-calzado.md`* · ✅ **RESUELTO 654** · [ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md](../4_etapas/ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md)

### 4.90.03.003 · Thumb carga URL plana sin sm/

*Detalle: `.claude/5_errores/detalle/4.90.03.003_tier-flat-sin-sm.md`*

### 4.90.03.004 · Padding en img desborda marco

*Detalle: `.claude/5_errores/detalle/4.90.03.004_padding-img-marco.md`*

### 4.90.03.005 · Hover scale rompe contención

*Detalle: `.claude/5_errores/detalle/4.90.03.005_hover-scale-thumb.md`*

### 4.90.03.006 · Grid depósitos — tarjeta cortada

*Detalle: `.claude/5_errores/detalle/4.90.03.006_layout-overflow-depositos.md`*

### 4.90.03.007 · Componente imagen distinto por pantalla

*Detalle: `.claude/5_errores/detalle/4.90.03.007_component-split-img.md`*

### 4.90.03.008 · Hero escala tier sm/

*Detalle: `.claude/5_errores/detalle/4.90.03.008_hero-sm-upscale.md`* · ✅ **RESUELTO 2026-06-16**

### 4.90.03.009 · PDF thumbs legacy (thumbs/ vs sm/)

*Detalle: `.claude/5_errores/detalle/4.90.03.009_pdf-thumbs-legacy.md`*

### 4.90.03.010 · Cadena foto cruzada (hero / sidebar)

*Detalle: `.claude/5_errores/detalle/4.90.03.010_cadena-hero-foto-cruzada.md`*

---

*Índice: `4.00.00.001` · Protocolo: `1_fundamentos/1.1_protocolos/protocolo_errores.md` · Shibboleth: 7 años*
