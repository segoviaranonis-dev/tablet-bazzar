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

### 4.01.04.003 · Calzado mezcla carteras (violación Mario Bros / grupo uno)

*Detalle: `.claude/5_errores/detalle/4.01.04.003_rimec-web-calzado-carteras-mario-bross.md`* · ✅ **RESUELTO local 2026-07-24** · MIG-181 + exclusión CARTERAS en Calzado · doc `2.2.1.24` · ⏳ deploy prod

### 4.01.04.004 · Tarjeta 638 subtítulo estilo siamese (CONFECCIONES / VERANO / código línea)

*Detalle: `.claude/5_errores/detalle/4.01.04.004_rimec-web-638-estilo-tarjeta-siamese.md`* · ✅ **RESUELTO 2026-07-27** · Web deploy · backfill PE valorizado ULT-PREC- · doc `2.2.1.29` · **638 ONLY**

### 4.01.04.005 · Lightbox 638 duplica COLORES (tallas tratadas como colores)

*Detalle: `.claude/5_errores/detalle/4.01.04.005_rimec-web-638-lightbox-colores-duplicados-tallas.md`* · ✅ **RESUELTO 2026-07-27** · Web `899f1dc` · doc `2.2.1.30` · **638 ONLY**

### 4.01.04.006 · Doble descuento carrito/FI (snapshot neto → LPN → cascada + F5 20 %)

*Detalle: `.claude/5_errores/detalle/4.01.04.006_rimec-web-doble-descuento-snapshot-lpn.md`* · ✅ **FIX local + RECALC PE-237-010** 2026-08-03 · pedido **237** · proveedor **654** · doc `2.2.1.40` · ⏳ deploy Web

### 4.01.04.007 · Cascada LÍNEA 841 · grilla LIQ corta (hasMore) · malentendido grupo uno

*Detalle: `.claude/5_errores/detalle/4.01.04.007_rimec-web-paginacion-cascada-grupo-uno.md`* · ✅ **FIX local** 2026-08-06 · paginación TODOS + multi-marca + protocolo maestro **2.2.1.44** · ⏳ deploy Web

### 4.01.04.008 · AB-CR ESCOLAR chip invisible (`normalizeFilterItems` tira id -8)

*Detalle: `.claude/5_errores/detalle/4.01.04.008_rimec-web-abcr-escolar-chip-invisible.md`* · ✅ **RESUELTO local** 2026-08-06 · `isAbcrSyntheticTipoId(-8)` · docs **2.2.1.45** · **2.2.1.47** · ⏳ deploy Web

### 4.01.05.001 · Pronta entrega muestra tarjetas Compra previa (quincenas PP)

*Detalle: `.claude/5_errores/detalle/4.01.05.001_rimec-web-pe-muestra-tarjetas-cp.md`* · ✅ **RESUELTO UI 2026-07-17** · deferred origen + validación warm cache · doc `2.2_rimec_web/CHUSAR_CORTE_20260717_HEADER_PRECIOS_PE.md`

### 4.01.06.001 · FI mezcla CASOS distintos al confirmar (R-FI-1)

*Detalle: `.claude/5_errores/detalle/4.01.06.001_rimec-web-fi-mezcla-casos.md`* · ✅ **DEPLOY PROD 2026-07-22** · `30a23b8` · Vercel Ready · doc `2.2_rimec_web/CHUSAR_HOTFIX_FI_CASOS_DISTINTOS_20260722.md`

### 4.01.06.002 · FI mezcla PROMO + LIQUIDACIÓN (R-FI-2 · COD.GRUPO Carlos)

*Detalle: `.claude/5_errores/detalle/4.01.06.002_rimec-web-fi-mezcla-promo-liquidacion.md`* · ✅ **DEPLOY PROD 2026-07-22** · `c7dc656`+`db17dd8` · Vercel Ready · doc `2.2_rimec_web/CHUSAR_HOTFIX_FI_PROMO_LIQUIDACION_COD_GRUPO_20260722.md` (**2.2.1.20**)

### 4.01.07.001 · Catálogo — filtros vacíos «Sin opciones» (prod)

*Detalle: `.claude/5_errores/detalle/4.01.07.001_rimec-web-catalogo-filtros-vacios-prod.md`* · ✅ **RESUELTO 2026-07-24** · `7c45166` · post-auditoría CP · `/api/catalogo/filtros` timeout

### 4.01.07.002 · PE_PP_MIXTO — FI PE mezcla PP 33+35 (Gricelda)

*Detalle: `.claude/5_errores/detalle/4.01.07.002_rimec-web-pe-pp-mixto-carrito-sintetico.md`* · ✅ **RESUELTO 2026-07-24** · `272cc99` · MIG-173 · carrito pp_id sintético único

### 4.01.07.003 · Carrito PE — botón «Editar descuentos» ausente

*Detalle: `.claude/5_errores/detalle/4.01.07.003_rimec-web-pe-editar-descuentos-ausente.md`* · 🟡 **FIX LOCAL 2026-07-24** · facturas lote · sin push · CHUSAR `2.2.1.22`

### 4.01.07.004 · Aprobaciones — «Sin grada» en FI PE (snapshot vacío)

*Detalle: `.claude/5_errores/detalle/4.01.07.004_report-aprobaciones-sin-grada-pe.md`* · 🟡 **PARCIAL 2026-07-24** · sim PVR-891496 OK · fallback `ppd.grada` pendiente · CHUSAR `2.2.1.22`

### 4.01.07.005 · HECHO HISTÓRICO — Enrique sin zapatos · pérdida de ingresos

*Detalle: `.claude/5_errores/detalle/4.01.07.005_hecho-historico-enrique-zapatos-ingresos.md`* · 🔴 **CRÍTICA ABIERTA 2026-07-24** · primera falla con daño de ingresos a persona · CHUSAR `2.2.1.23`

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

### 4.02.03.022 · CP — Vincular listado · PPD desincronizado · Web/FI precio viejo

*Detalle: `.claude/5_errores/detalle/4.02.03.022_cp-pp-vincular-listado-ppd-desincronizado-web.md`* · ✅ **RESCATE 2026-07-23** · ✅ **CERT MIG-177 2026-07-24** · [CHUSAR 2.3.1.7.5.3.8](../2_modulos/2.3_report/proceso_importacion/CHUSAR_CERTIFICACION_PRECIOS_CP_RIMEC.md)

### 4.02.03.023 · Confirmar pedido — LPC03 payload 127000 vs BD 127008 (centena)

*Detalle: `.claude/5_errores/detalle/4.02.03.023_confirmar-pedido-lpc03-centena-bd-web.md`* · ✅ **RESUELTO 2026-07-24** · MIG-178 · report `5087687` · eslabón G4 auditoría CP

### 4.02.03.024 · Logística OK — PE invisible General (pre-sync Web · CONFIRMADA)

*Detalle: `.claude/5_errores/detalle/4.02.03.024_logistica-pe-invisible-pre-sync-aprobacion.md`* · ✅ **RESUELTO 2026-07-27** · MIG-187 · acordeón PE · auto-refresh · CHUSAR `2.3.1.28.12` · `2.3.1.28.13`

### 4.02.03.013 · PDF FI tab PP — Python ausente en Vercel

*Detalle: `.claude/5_errores/detalle/4.02.03.013_pdf-fi-prod-sin-python.md`* · ✅ **RESUELTO 2026-07-14** · `run-fi-pdf.ts` + pdf-lib · push `7b7d5d7`

### 4.02.02.004 · Ventas + Fotos PDF — serverless 25 filas vs banner 80

*Detalle: `.claude/5_errores/detalle/4.02.02.004_ventas-fotos-pdf-25-vs-80-serverless.md`* · ✅ **RESUELTO 2026-07-10** · commit `b60fd9d`

### 4.02.02.005 · Sales Report `/rimec` — filtros cascada categorías reset / UI `#1 #2`

*Detalle: `.claude/5_errores/detalle/4.02.02.005_sales-report-filtros-cascada-categorias.md`* · ✅ **RESUELTO 2026-07-24** · commits `5415a05`→`622f564` · **v1.0.3** · CHUSAR [CHUSAR_SALES_REPORT_FILTROS_CASCADA.md](../2_modulos/2.3_report/CHUSAR_SALES_REPORT_FILTROS_CASCADA.md)

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

*Detalle: `.claude/5_errores/detalle/4.02.03.016_am-pp-abierto-cp-vendido-sin-trazabilidad.md`* · ✅ **RESUELTO 2026-07-21** · canónico `dd4379d` · cache `a3fc3fd` · mol `2305` / `2135`

### 4.02.03.018 · PP import programado — 504 Vercel al confirmar proforma

*Detalle: `.claude/5_errores/detalle/4.02.03.018_pp-import-504-vercel-timeout-confirmar.md`* · ✅ **RESUELTO 2026-07-23** · commit `6683aca` · cola definitiva **`75be90a`** · doc **2.3.1.7.5.3.3.9**

### 4.02.03.019 · PP import programado — lotes falsos (pilares archivo completo en lote 1)

*Detalle: `.claude/5_errores/detalle/4.02.03.019_pp-import-lotes-falsos-pilares-slice-completo.md`* · ✅ **RESUELTO 2026-07-23** · éxito PP-30 · ley **2.3.1.7.5.3.3.10**

### 4.02.03.020 · Build Vercel — material_label ausente en ProformaRow

*Detalle: `.claude/5_errores/detalle/4.02.03.020_build-material-label-proforma-row.md`* · ✅ **RESUELTO 2026-07-23** · commit `22faede`

### 4.02.03.021 · Logística OK — multi-selección fecha/vendedor solo 1 FI OK

*Detalle: `.claude/5_errores/detalle/4.02.03.021_logistica-ok-bulk-multi-solo-uno-ok.md`* · ✅ **RESUELTO 2026-07-23** · lote SQL `ANY($1)` + asignar `id_vendedor` · **2.3.1.28**

### 4.02.04.001 · Import PE CSV Vercel — spawn python ENOENT

*Detalle: `.claude/5_errores/detalle/4.02.04.001_report-import-pe-vercel-python-enoent.md`* · 🟡 **MITIGADO 2026-07-24** · 501 Vercel · CLI local · CHUSAR `2.2.1.22`

### 4.02.04.002 · Purge PE bloqueado por FK FI→PP (33/35)

*Detalle: `.claude/5_errores/detalle/4.02.04.002_report-purge-pe-fk-fi-pp.md`* · ✅ **RESUELTO 2026-07-24** · pipeline limpia PPD · PP cáscara

### 4.02.04.003 · Report `:3000` zombie + modal Import 0 p

*Detalle: `.claude/5_errores/detalle/4.02.04.003_report-3000-zombie-modal-import-cero.md`* · ✅ **RESUELTO 2026-07-24** · kill + `dev:3000` · no re-importar

### 4.02.04.004 · Facturación — colisión `fi.vendedor_id` usuario ↔ `vendedor_v2` (Guido↔Patricia)

*Detalle: `.claude/5_errores/detalle/4.02.04.004_fi-vendedor-id-colision-usuario-vendedor-v2.md`* · ✅ **RESUELTO 2026-08-03** · helper display · PE/tránsito/bóveda/Aprobaciones · CHUSAR `2.3.1.9.F`

### 4.02.05.001 · Automatización informes · marcas sin cascada ramo / tipo_v2

*Detalle: `.claude/5_errores/detalle/4.02.05.001_report-auto-informes-marcas-sin-cascada-ramo.md`* · ✅ **RESUELTO local 2026-08-01** · CALZADO mezclaba PIPA/NANAI (confecciones) · meta `?ramo=` + poda UI · **2.3.1.35**

### 4.02.05.002 · Automatización informes · listado Motor como precio PDF (vs PPD AM)

*Detalle: `.claude/5_errores/detalle/4.02.05.002_report-auto-informes-precio-listado-vs-ppd-am.md`* · 🟡 **DOCUMENTADO 2026-08-01** · PDF debe usar PPD LPN/LPC (AM) · no `precio_lista` vigente · **2.3.1.35.4**

### 4.02.05.003 · Bandeja Automatización · vista forzada vs destinatario (anti-saturación)

*Detalle: `.claude/5_errores/detalle/4.02.05.003_bandeja-auto-vista-forzada-vs-destinatario.md`* · ✅ **CORREGIDO 2026-08-02** · agente debió pedir sesión HECTOR · no forzar `verTodas` · **2.3.1.36**

### 4.02.05.004 · DPE KYLY · título VERANO · prendas con aspecto invierno

*Detalle: `.claude/5_errores/detalle/4.02.05.004_dpe-kyly-verano-visual-invierno.md`* · 🟡 **DOCUMENTADO 2026-08-04** · cocina no mezcló · tipificación Carlos vs visual · **2.3.1.35.13** · grupo `1001020100`

### 4.02.05.005 · Cocina automática 06:00 · sin disparo (reloj / horario)

*Detalle: `.claude/5_errores/detalle/4.02.05.005_cocina-auto-0600-sin-disparo-reloj.md`* · 🟡 **FRACASO 2026-08-05** · autos en **15:00** · 0×06:00 · worker/cron cloud pendiente · plan reintento **2026-08-06** · **2.3.1.35.14**

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

### 4.05.01.001 · Chusar — cierre conversación omitido

*Detalle: `.claude/5_errores/detalle/4.05.01.001_chusar-cierre-conversacion-omitido.md`*

### 4.05.02.001 · Etiqueta «Dios» visible en UI — ofensiva al usuario

*Detalle: `.claude/5_errores/detalle/4.05.02.001_ui-etiqueta-dios-ofensiva-usuario.md`* · ✅ **RESUELTO 2026-07-16** · ley `5.01.00.020`

### 4.05.03.001 · Bazzar Compra · gradas TRP ≠ pares FI

*Detalle: `.claude/5_errores/detalle/4.05.03.001_bazzar-compra-gradas-fi-delta.md`* · ✅ **RESUELTO 2026-08-05** · infantil &lt;20 + PPD huérfano · PE-237 CUADRA · CHUSAR **2.5.1.17**

### 4.05.03.002 · Bazzar Web · FAIL grada 638 sin am_talle (ok_stock PASS)

*Detalle: `.claude/5_errores/detalle/4.05.03.002_bazzar-638-ok-grada-sin-am-talle.md`* · 🟡 **ABIERTO 2026-08-02** · ALM_WEB sin `am_talle` · protocolo **3.02.00.638** · fix F1 roadmap **2.5.1.8**

### 4.05.03.003 · Traspaso PE · sin combinación talla 638 (grada incompleta)

*Detalle: `.claude/5_errores/detalle/4.05.03.003_traspaso-pe-sin-combinacion-talla-638.md`* · ✅ **RESUELTO 2026-08-02** · `ensureTallaId` + match mat/col · CHUSAR **2.5.1.16** · PE-237 12/12 ENVIADO

### 4.05.04.001 · Nexus_Core `origin` apunta a tablet-bazzar.git

*Detalle: `.claude/5_errores/detalle/4.05.04.001_nexus-core-origin-apunta-tablet-bazzar.md`* · 🟡 **PARKING FIN DE SEMANA** · prod OK hoy · no push desde raíz

---

## 4.90 · Transversal — Infra / nube

### 4.90.01.001 · Supabase bloqueado por facturación (DNS caído · holding offline)

*Detalle: `.claude/5_errores/detalle/4.90.01.001_supabase-proyecto-bloqueado-facturacion.md`* · ✅ **RESTABLECIDO 2026-08-03** (pago Andrés / sesión GitHub) · 🟡 pendiente alertas · owners · backup

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
