# CHANGELOG MOISES — lotes post-baseline

**Baseline:** `MOISES-BASELINE-20260807` · 2026-08-07  
**Protocolo:** `5.01.00.022` · [CHUSAR_MOISES_CORTE_BASELINE_Y_LOTES_20260807.md](../1_fundamentos/1.1_protocolos/CHUSAR_MOISES_CORTE_BASELINE_Y_LOTES_20260807.md)  
**Regla:** Andrés / su Cursor **solo** aplican ítems de lotes aquí listados. Todo lo demás del baseline es **inmutable**.

---

## Baseline (congelado — no re-aplicar)

| ID | Fecha | Contenido |
|----|-------|-----------|
| `MOISES-BASELINE-20260807` | 2026-08-07 | Moria `.claude/` al corte · cierres independencia en `memoria-web/` · Protocolo Moises `5.01.00.021` · este sistema de lotes `5.01.00.022` · sync OPS→backup **OFF** |

**Empaque WhatsApp baseline:** ver `memoria-web/LOTE_MOISES_INSTRUCCIONES_WHATSAPP.md`

---

## Lote abierto (acumula hasta próximo envío)

> Cuando el Director diga “armar lote” / envíe WhatsApp, se **cierra** esta sección → pasa a “Lotes cerrados” con ID `MOISES-LOTE-YYYYMMDD`.

| # | Fecha | Qué | Índices / código | Git | DB | Estado |
|---|-------|-----|------------------|-----|-----|--------|
| 88 | 2026-08-17 | **ME-3 matriz emparejamiento** `5.01.00.035` · SHA 3/3 DELTA · BD drift · ventas SAME · mig ABSENT Moises · Documenta | CHUSAR §3 · ETAPA ME-3 · ACTUAL · evidencia ME3 | Sí holding | Solo lectura OPS∥Moises | 🆕 |
| 87 | 2026-08-17 | **ME-2 smoke Moises** `5.01.00.035` · `*-x` 200 · SQL conteos pilares/PE · RLS anon=0 · Protocolo Chusar Activado+Documenta | CHUSAR §5 · ETAPA ME-1/2 · ACTUAL · evidencia local MOISES_ACCESOS | Sí holding | Solo lectura Moises | 🆕 |
| 86 | 2026-08-17 | **Moises chequeo emparejamiento** `5.01.00.035` · etapa abierta · Git/Supabase/Vercel aislados · guardrails · Protocolo Moises+Documenta | CHUSAR+ETAPA · ACTUAL · INDICE protocolos · arbol 2.0.7 · etapas.json | Sí holding | No | 🆕 |
| 85 | 2026-08-17 | **Documentación Chusar lote pilares** · push untracked 2.3.5.5→19 · índices · árbol NEW · productos Report deploy · Protocolo Chusar Activado | INDICE pilares/2.3 · arbol · ACTUAL · CHANGELOG | Sí holding | No | 🆕 |
| 84 | 2026-08-17 | **Admin LR STOCK Todos/CP/PE** `2.3.5.19` · thumb CP 654 vía `v_stock_rimec` · Documenta+**despliega** | CHUSAR_ADMIN_LR_STOCK… · INDICE pilares/2.3 · ACTUAL | Sí report | No | 🆕 |
| 83 | 2026-08-17 | **Ley VIZZANO=DAMAS** `2.3.5.16` · carteras/anteojos · mapa fuerza DAMAS · BD 436 ratificadas · Documenta | CHUSAR_LEY_VIZZANO… · INDICE pilares · ACTUAL · sdrm-pilares-map | Local Report (mapa) | Sí `linea.genero_id` | 🆕 |
| 82 | 2026-08-17 | **Admin LR fotos 654/638** `2.3.5.15` · thumb PPD · stem sin 0-0 · PE=SDRM · error **4.90.03.012** · Documenta+**despliega** · `5087efd` | CHUSAR_ADMIN_LR_FOTOS… · INDICE pilares/2.3/errores · ACTUAL | Sí report | No | 🆕 |
| 81 | 2026-08-17 | **Deploy AM integridad Magno** `2.3.1.22.2` · audit tol.0 + clasificación · **4.02.03.028** RESUELTO · Documenta+**despliega** · `209fa73` | CHUSAR_DEPLOY_AM… · 2.3.1.30 enmienda · INDICE · ACTUAL | Sí report | No | 🆕 |
| 80 | 2026-08-17 | **AM programado ≠ STOCK/CP** `2.3.1.22.1` · error **4.02.03.028** · peras≠manzanas · caso 4117 · Documenta+fix local Report | CHUSAR_AM_PROGRAMADO… · detalle 028 · INDICE gestion_compra/2.3/errores · merge/totales/card | Local Report → absorbido #81 | No | 🆕 |
| 79 | 2026-08-17 | **UI filtro precio Desde/Hasta** `2.2.1.60` · rediseño + fix mangos independientes · Documenta+**despliega** | CHUSAR_UI_FILTRO_PRECIO… · INDICE 2.2 · FiltroPrecioRango · filtroPrecioRangoSync | Sí rimec-web | No | 🆕 |
| 78 | 2026-08-17 | **Consolidado+re-audit CP∥PE+deploy** `2.2.1.59` · matriz problemas · multi-grada · cascada · AB-CR · Documenta+**despliega** · commits `66d408f`/`bbbcdb6` · alias rimec.com.py | CHUSAR_CONSOLIDADO… · INDICE 2.2 · ACTUAL · scripts audit grillas | Sí rimec-web | No | 🆕 |
| 77 | 2026-08-17 | **Multi-grada mostrar todo** `2.2.1.58` · error **4.01.07.008** · merge color exige `gradas_fmt` · Gricelda 1185.702 · audit 0 · Documenta+local | CHUSAR_MULTI_GRADA… · detalle 008 · INDICE 2.2/errores · siameses §5.2 · ACTUAL | Local Web | No | 🆕 |
| 76 | 2026-08-17 | **Cascada meta chi** `4.01.04.012` bis · `es_liquidacion`/`cod_grupo` solo PE · Estilo acota RASTRERAS · smoke combos · Documenta | detalle 012 · audit 2.2.1.57 · catalogoFilters · filtros/route · smoke script | Local Web | No | 🆕 |
| 75 | 2026-08-17 | **Audit cascada filtros** `2.2.1.57` · error **4.01.04.012** · consolidado CASOS 638 ACTUAL≠NORMAL · AB-CR ABIERTO/CERRADO/VERANO/INVIERNO · Documenta | CHUSAR_AUDIT_FILTROS… · detalle 012 · INDICE 2.2/errores · ACTUAL | Local Web | No | 🆕 |
| 74 | 2026-08-16 | **Error 4.01.04.011** filtro CHINELO `chi` descartado por whitelist URL · Documenta+fix local `:3001` | detalle error · tipo-grupos-url.ts · INDICE errores/2.2 | Local Web | No | 🆕 |
| 73 | 2026-08-16 | **Tipo=CASOS** refuerzo `2.2.1.56` · UI label Tipo intacto · COMUN/LIQ herencia SDRM · Documenta+local `:3001` · Protocolo chusar | CHUSAR_CANON_CASOS… · INDICE 2.2 · sidebar Web | Local :3001 | No | 🆕 |
| 72 | 2026-08-16 | **Canon CASOS** `2.2.1.56` · CHI·Normal≠Actual·638 bib seed · Chinelo→Beira · filtros Web+AM local · Documenta+ejecuta | CHUSAR_CANON_CASOS… · filtro-tipo* · cod-grupo-caso-filtro · seed script | Local Web+Report | bib 638 + marca Beira | 🆕 |
| 71 | 2026-08-16 | **CHINELO deuda arq** `2.3.5.7` · no es marca · caso · marca=Beira Rio · no fix 8448→Chinelo · hipótesis OT futura | CHUSAR_MARCA_CHINELO… corregido · INDICE · ACTUAL | No | No | 🆕 |
| 70 | 2026-08-16 | ~~CHINELO = marca~~ **ANULADO por #71** · equívoco agente al leer diccionario | ver lote 71 | No | No | ❌ |
| 69 | 2026-08-16 | **Admin Líneas siameses** `2.3.5.5.3` · Dimensiones∥Molécula · Buscar 5831 · Failed to fetch · Documenta · Protocolo siameses | CHUSAR_ADMIN_PILARES_LINEAS_SIAMES… · INDICE pilares · maestro 44 | Local Report | No | 🆕 |
| 68 | 2026-08-16 | **Etapa PE Stock × TONO** `2.3.5.3.2` · filtro cabecera + edición círculo · una verdad `color.tono_canon` · Documenta+abre etapa | CHUSAR_PE_STOCK_TONO… · ETAPA_PE_STOCK… · ACTUAL · etapas.json · INDICE pilares | No | No | 🆕 |
| 67 | 2026-08-16 | **Diccionarios traductores** `2.3.5.6` · hub tono/usuarios cuadrados · 3 pestañas PE 133 / vendedor CSV / plazo · Documenta+ejecuta local · Protocolo chusar activado | CHUSAR_DICCIONARIOS_TRADUCTORES… · INDICE pilares · ACTUAL | Local Report | No | 🆕 |
| 66 | 2026-08-16 | **Cierre FOCO Bazzar móvil** `2.5.1.42.c` · mapa pendientes ACTUAL · presentación agente · Documenta · Protocolo chusar activado | CHUSAR_DISENO_MOVIL_CERRADO… · ACTUAL · INDICE 2.5 | No | No | 🆕 |
| 65 | 2026-08-14 | **Ley abstracción color=principio TONO** · pilar estable · FK+tono en Admin · Documenta · profundidad siguiente orden | CHUSAR_PILAR_COLOR_TONO_CANON § · 2.3.5.5.2 · ACTUAL | No | No | 🆕 |
| 64 | 2026-08-14 | **Deploy Color tono miniatura** `2.3.5.5.2` · Vista 80px+zoom · orden 1–4 · thumbs API · PATCH rápido · Documenta+**despliega** Report | CHUSAR_COLOR_TONO… · CHUSAR_DEPLOY_REPORT_COLOR… · ACTUAL | Sí report | Lectura retail · nombre ciegos | 🆕 |
| 64 | 2026-08-14 | **Bazzar diseño móvil pasada 2 + deploy** `2.5.1.42` · re-audit escapes · prod `a7e3bef` · Documenta+despliega · Protocolo chusar activado | CHUSAR_DISENO_MOVIL… · DEPLOY… · INDICE 2.5 · ACTUAL | Sí bazzar-web | No | 🆕 |
| 63 | 2026-08-14 | **Cierre contacto Moises OPS** `5.01.00.033` · handoff Andrés · FOCO orilla cerrado · ACTUAL nuevo FOCO · Documenta · Protocolo chusar activado | `CHUSAR_MOISES_ENTORNO_AISLADO_CONTACTO_CERRADO…` · INDICE protocolos · ACTUAL | No | No | 🆕 |
| 62 | 2026-08-13 | **Examen final clon aislado** `5.01.00.032` · `EXAMEN_FINAL_CONFIG_ENTORNO_AISLADO_MOISES.md` · 11 fases · ACTA WhatsApp · Documenta · Protocolo chusar activado | EXAMEN_FINAL… · GUIA · LEEME | No | No | 🆕 |
| 60 | 2026-08-13 | **Config entorno Cursor** `5.01.00.031.b` · `MOISES_CONFIG_ENTORNO_CURSOR_20260813.md` · COSTOS + puertos + env + accesos agente · Documenta · Protocolo chusar activado | MOISES_CONFIG… · GUIA_ENTRADA · ACTUAL | No | No | 🆕 |
| 59 | 2026-08-13 | **FOCO Moises entorno aislado** `5.01.00.031` · cutover `rimec.py@gmail.com` · guía agente nuevo · diagnóstico gh/git roto · zip moria_chusar · Documenta · Protocolo chusar activado | `CHUSAR_PROTOCOLO_MOISES_ENTORNO_AISLADO…` · `MOISES_GUIA_AGENTE_ENTRADA.md` · ACTUAL | No | No | 🆕 |
| 58 | 2026-08-13 | **FOCO Color tono miniatura** `2.3.5.5.2` · thumb 1ª coincidencia exacta `color_code` 654 · Report `/pilares/color` · Documenta+ejecuta local · Protocolo Chusar Activado | CHUSAR_COLOR_TONO_MINIATURA… · ACTUAL · INDICE pilares | Local Report | Lectura retail | 🆕 |
| 57 | 2026-08-13 | **Filtros catálogo &lt;1s** `2.5.1.41` · snapshot TTL 30s · pg pool · enrich condicional · loading null · smoke p95 309ms · Documenta+**despliega** · Protocolo Chusar Activado | CHUSAR 2.5.1.41 · deploy filtros latencia · ACTUAL | Sí bazzar-web | No | 🆕 |
| 56 | 2026-08-13 | **FOCO imágenes stock web CERRADO** `2.5.1.40` · Ley §**4.6** Verifica las imágenes · gate `auditar_sanear…` · `4.90.03.011` · caso 4317 · Documenta+**despliega** Bazzar · Protocolo Chusar Activado | CHUSAR 2.5.1.40 · 2.01.04.025 · deploy catálogo imágenes · ACTUAL | Sí bazzar-web | Storage copy stems | 🆕 |
| 55 | 2026-08-13 | **Sanea siameses AP** `2.3.5.5.1` · definición = panel Dimensiones∥Molécula (captura Web) · `PilaresLrFiltrosSidebar` · retracta pills naranja · Documenta+ejecuta | CHUSAR 2.3.5.5.1 · maestro 44 §0 · mapeo 52 · regla Cursor siameses | Local Report | No | 🆕 |
| 54 | 2026-08-13 | **Admin L×R CABECERA siames W** `2.3.5.5.1` · hermano **AP** · (v1 pills — **retractado** por lote 55) | ver lote 55 | Local Report | No | ⚠ |
| 53 | 2026-08-13 | **FOCO Administrador Pilares** `2.3.5.5` · orden módulo + mapa filtros estilo/marca/género · ley nada sin credenciales/FK · Documenta · Protocolo Chusar · Bancard en espera | `CHUSAR_ADMINISTRADOR_PILARES_FOCO…` · INDICE pilares · ACTUAL | No | No | 🆕 |
| 52 | 2026-08-13 | **Cierre `sugerencia:`** `5.01.00.030` · opinión + siguiente paso · Protocolo Chusar Activado · Documenta+ejecuta · hooks CHUNA | `CHUSAR_CIERRE_SUGERENCIA…` · cierre-turno · chuna-stop-gate · CHUNA §7 | No (reglas+Moria) | No | 🆕 |
| 51 | 2026-08-13 | **Bancard Single Buy óptimo** `2.5.1.39` · iframe+confirm+EDB · CSP VPOS · smoke MD5 · Documenta+**despliega** Bazzar · Protocolo Chusar Activado · keys Laura pendientes | `CHUSAR_BANCARD_SINGLE_BUY…` · `CHUSAR_DEPLOY_BAZZAR_BANCARD…` · INDICE 2.5 | Sí bazzar-web | No | 🆕 |
| 50 | 2026-08-12 | **Absorción ECC→Chusar cero costo** `5.01.00.029` · quality-gate nativo · smoke adverso · **NO** plugin ECC · Protocolo Chusar Activado · Documenta | `CHUSAR_ABSORCION_ECC…` · `scripts/chusar-quality-gate.mjs` · regla Cursor | No (local Nexus) | No | 🆕 |
| 49 | 2026-08-12 | **Mapeo filtros siameses** `2.2.1.52` + **Moises↔Chusar entornos** `5.01.00.028` · EDB código+docs · **despliega** rimec+report+bazzar · Protocolo Chusar Activado | `CHUSAR_MAPEO_FILTROS…` · `CHUSAR_MOISES_CHUSAR_ENTORNOS…` · INDICE 2.2 | Sí 3 apps | No EDB Vercel | 🆕 |
| 48 | 2026-08-12 | **Bancard Laura** respuesta · contrato+cédula+3DS · PDFs en `docs/bancard-laura-20260812` · standby keys | handoff Moises · mail RE bazzar.com.py | No | No | 🆕 |
| 47 | 2026-08-12 | **EDB miniaturas CSP + Documenta** `2.7.3.1` · error `4.05.05.002` · **despliega** Bazzar · **omite deploy :3005** | `CHUSAR_EDB_MINIATURAS…` · `CHUSAR_DEPLOY_BAZZAR_EDB_OMITE_3005…` · INDICE 2.7 | Sí bazzar-web | No EDB Vercel | 🆕 |
| 47 | 2026-08-13 | **CSV ventas CASO∥LISTADO** `2.3.1.7.5.3.20` · bug urgente · dos columnas · Documenta+**despliega** Report | `CHUSAR_CSV_VENTAS_CASO_LISTADO…` · csv-ventas-export | Sí Report | No | 🆕 |
| 46 | 2026-08-12 | **EDB recepción 3 acordeones + mapa día** `2.7.3` · geo depto/ciudad/distrito desde snapshot mapa · Documenta+ejecuta | `CHUSAR_EDB_RECEPCION_3_ACORDEONES…` · envios · Recepcion · MapaVivo · sql/002 | Local EDB | `destino_*` geo | 🆕 |
| 45 | 2026-08-12 | **1ª compra Bazzar evidencia + pendientes** `2.5.1.34.1` · id=3 · DBZ-000003 · cierre paréntesis · Documenta | `CHUSAR_PRIMERA_COMPRA_EVIDENCIA…` · ACTUAL · 2.7.2 B2/E1 | No (doc) | Lectura | 🆕 |
| 44 | 2026-08-12 | **Mega nav/portadas/encuadre** `2.5.1.38` · Rebajas·Damas·Caballeros·Niñas·Niños · BR Sport solo Caballeros · objectPosition niñas/niños · Documenta+**despliega** · Protocolo Chusar Activado | `CHUSAR_MEGA_NAV_PORTADAS…` · header-nav · genero-mega · imagen-portada | Sí bazzar-web | No | 🆕 |
| 43 | 2026-08-12 | **Vendedor Bazzar BZZ* Carlos 90** `2.3.1.7.5.3.19` · error `4.02.03.027` · corrige 026 · Documenta+**despliega** | `CHUSAR_VENDEDOR_BAZZAR_BZZ…` · vendedor-pp-integridad · canon | Sí Report | Repair FI PP6 BZZ* | 🆕 |
| 42 | 2026-08-12 | **Import PE UI body Next 15.5** `2.3.1.10.1.7` · 32 MB · usuario sin agente · Documenta+**despliega** Report | `CHUSAR_IMPORT_PE_SDRM_UI_BODY…` · deploy · PeImportSdrmButton · next.config | Sí Report | No | 🆕 |
| 41 | 2026-08-12 | **Primera compra + sim EDB** `2.5.1.34` · misma etapa integridad 2 · checklist F1–F9 · Documenta | `CHUSAR_PRIMERA_COMPRA_SIM_DESEMPENO_EDB…` · ACTUAL · índices 2.5/2.7 | No (doc) | No | 🆕 |
| 40 | 2026-08-12 | **Motor sellos fantasmas** `2.5.1.33` · purge huérfanos GET · CONFLICTO solo sello con eco WEB · Documenta+Chusar Activado+**despliega** Report | `CHUSAR_MOTOR_PRECIO_SELLOS_FANTASMAS…` · deploy · types/catalogo/API | Sí Report | Purge `motor_precio_sello` LAB/prod al GET | 🆕 |
| 39 | 2026-08-11 | **Aprobación Gral por molécula** `2.3.1.3.7` · botón en tarjeta · solo familia FI · Documenta+local | `CHUSAR_APROBACION_GRAL_MOLECULA…` · PedidoPendienteCard · API | Local Report | No | 🆕 |
| 38 | 2026-08-11 | **Bancard** contacto Laura Vera WhatsApp · standby cambio foto · aguardando respuesta · Documenta | `CHUSAR_BANCARD_CONTACTO_LAURA…` · **2.5.1.32** · BANCARD_SOLICITUD · ACTUAL | No | No | 🆕 |
| 37 | 2026-08-11 | **Mapa carrito Héctor PE pre-Bazzar** `2.5.1.31` · 1258/163M paridad UI · Documenta · prueba 2 | `CHUSAR_MAPA_CARRITO_HECTOR_PE…` · script `_map_carrito_hector_pe_prueba2` · ACTUAL | No (doc+script) | Lectura carrito | 🆕 |
| 31 | 2026-08-11 | **EDB** siglas + FOCO pendientes Bazzar Web+Delivery · Protocolo Chusar Activado · schema delivery · mapa vivo | `CHUSAR_EDB_FOCO_PENDIENTE…` · **2.7.2** · ACTUAL · arbol NEW | No | schema `delivery.*` local | 🆕 |
| 30 | 2026-08-10 | **Cascada L-R-M-C siamese** AM+Web · alerta cierre · vaciado PP abierto · Protocolo Chusar Activado · **deploy prod** | `CHUSAR_DEPLOY_CASCADA_LRMC…` · `2.3.1.29.2` | Sí Report `0235202` · Web `3b5b031` | No | 🆕 |
| 1 | 2026-08-07 | Espíritu + examen Andrés `5.01.00.023` · docs en moria_chusar = guía de actualizaciones · zip lo arma Héctor | `CHUSAR_MOISES_ESPIRITU_Y_EXAMEN…` · `EXAMEN_NIVEL_ANDRES_MOISES.md` | No | No | 🆕 |
| 2 | 2026-08-07 | Protocolo Chusar Activado completo `5.01.00.024` · pregunta trampa · producto **2.6 Respaldo activo** USD 28k–42k · cotización :3004 | `CHUSAR_PROTOCOLO_CHUSAR_ACTIVADO_COMPLETO…` · `cotizacion-productos.ts` | No | No | 🆕 |
| 3 | 2026-08-07 | **Pregunta trampa** guía no-programadores `5.01.00.025` · metodología qué/cómo/Andrés · typo intencional · arbol `2.0.3` NEW | `CHUSAR_PREGUNTA_TRAMPA_20260807.md` · índices · `CODIGO_MAESTRO` | No | No | 🆕 |
| 4 | 2026-08-07 | **Bitácora** `2.3.1.51` + **blindaje carrito** `2.2.1.42` · Documenta · Chusar Activado · **deploy prod** orden «despliega» | `CHUSAR_BITACORA_…` · `CHUSAR_BLINDAJE_CARRITO_…` · etapa BITACORA | Sí (rimec-web + report) | MIG-201/202 | 🆕 |
| 5 | 2026-08-07 | **Bazzar portada inicio** `2.5.1.24` · grilla + `objectPosition` modelo · holding `2.01.04.024` · Documenta · Chusar Activado · **deploy bazzar-web** | `CHUSAR_IMAGEN_PORTADA_…` · `imagen-portada.ts` · `ImagenPortada` | Sí (bazzar-web) | No | 🆕 |
| 6 | 2026-08-07 | **CSV bóveda PE** `2.3.1.9.B.2.1` · hotfix bug urgente · deploy Report `3ed6e3a` · orden «publicar y desplegar» | `CHUSAR_BOVEDA_CSV_DESCARGA_20260807` · `CHUSAR_DEPLOY_REPORT_BOVEDA_CSV_20260807` | Sí Report prod | No | 🆕 |
| 7 | 2026-08-07 | **Audit tier CSV PE** `2.3.1.9.B.5` · gate export · alias `4.02.04.005` · Documenta | `CHUSAR_CSV_PE_AUDITORIA_TIER_20260807` · `csv-pe-tier-audit.ts` | Local Report | No | 🆕 |
| 8 | 2026-08-07 | **CSV PE Nivel Dios rentabilidad** `2.3.1.9.B.6` · **`4.00.02.009`** · deploy Report · Documenta «publica» | `CHUSAR_CSV_PE_RENTABILIDAD_NIVEL_DIOS_20260807` · `CHUSAR_DEPLOY_REPORT_CSV_PE_RENTABILIDAD_20260807` | Sí Report prod | No | 🆕 |
| 9 | 2026-08-10 | **Hotfix D1 FI PE editable** `2.2.1.51` · error `4.01.04.010` · usuario controla cascada · Documenta · Chusar Activado · **deploy rimec-web** | `CHUSAR_DESCUENTOS_FI_PE_D1_EDITABLE_…` · `EditorDescuentosFi` · `resolverDescuentosFiPe` | Sí (rimec-web) | No | 🆕 |
| 9 | 2026-08-07 | **Situación financiera** FOCO reabierto · auditoría borrador cobros `2.3.1.50.1` · SF-MAPA cobros v1 `2.3.1.50.2` · intake colaborador · Documenta | `CHUSAR_AUDITORIA_BORRADOR_COBROS…` · `CHUSAR_SF_MAPA_COBROS_V1…` · etapa SF · `etapas.json` | No | No | 🆕 |
| 10 | 2026-08-09 | **SF pipeline TXT→Sit Fin** `2.3.1.50.3` · intake corte AL 03-08 · clasificador huellas ERP · `run_corte.py` · Documenta+ejecuta | `CHUSAR_PIPELINE_TXT_SF_AL_NEXUS…` · `pipeline/` · out LAB | No | No | 🆕 |
| 11 | 2026-08-09 | **SF tablas staging T01–T12** `2.3.1.50.4` · MIG-203 · persistencia + variaciones · seed huellas AL · Documenta (plan) | `CHUSAR_SF_TABLAS_STAGING…` · `203_sf_tablas_staging.sql` · `persistencia.py` | No | MIG-203 LAB | 🆕 |
| 12 | 2026-08-09 | **SF módulo hub Report** `2.3.1.50.5` · `/situacion-financiera` · Documenta+**publica** prod | `CHUSAR_MODULO_HUB_SITUACION_FINANCIERA…` · hub-modules · page+API | Sí Report prod | No | 🆕 |
| 13 | 2026-08-09 | **SF pestañas versiones Guido + gráficos** `2.3.1.50.6` · Documenta+**publica** | `CHUSAR_SF_PESTANAS_VERSIONES_GUIDO…` · tabs Report | Sí Report prod | No | 🆕 |
| 14 | 2026-08-09 | **SF molecular TXT + colores** `2.3.1.50.7` · acordeón Gs→línea limpia · Documenta+**publica** | `CHUSAR_SF_MOLECULAR_TXT_COLORES…` · molecular JSON · Excel AL | Sí Report prod | No | 🆕 |
| 15 | 2026-08-09 | **SF auditoría + inventario intake AL** `2.3.1.50.8` · cobertura 19 archivos · DIF.COBRO Excel · Documenta+**publica** | `CHUSAR_SF_AUDITORIA_INVENTARIO_INTAKE…` · Auditoría mapa | Sí Report prod | No | 🆕 |
| 16 | 2026-08-09 | **Norte Plan Maestro + absorción** `5.01.00.026` · `2.3.1.50.9` · filosofía caja→banca · Clase 7 `:3004/plan-maestro` · integrado a Chusar Activado · Documenta+Moises | `CHUSAR_NORTE_PLAN_MAESTRO…` · `CHUSAR_SF_ABSORCION…` · `5.01.00.024` §5 | No (nav local) | No | 🆕 |
| 17 | 2026-08-10 | **SF comparación Jul↔Ago** `2.3.1.50.10` · ref admin oro · botón Activar comparación % · anti-parche · Luisito TXT×clientes · Documenta | `CHUSAR_SF_COMPARACION_JUL_AGO…` · `SitFinComparacionPanel` · `comparacion-ago-vs-jul.json` | Local Report | No | 🆕 |
| 18 | 2026-08-10 | **SF reglas Guido canon** `2.3.1.50.11` · G1–G11 · cliente_cadena · gate · Documenta+**publica** | `CHUSAR_SF_REGLAS_GUIDO_CANON…` · `CHUSAR_DEPLOY_REPORT_SF_REGLAS_GUIDO…` | Sí Report prod | No | 🆕 |
| 19 | 2026-08-10 | **SF ISLA Faro Alejandría** `2.3.1.50.12` · aislamiento total · sin resultados Nexus · Documenta | `CHUSAR_SF_ISLA_FARO_ALEJANDRIA…` · `isla.ts` | Local Report | No | 🆕 |
| 20 | 2026-08-10 | **SF alerta Δ burbuja + comparación USD Jul↔Ago** `2.3.1.50.13` · Documenta+ejecuta | `CHUSAR_SF_ALERTA_DESCUADRE_Y_COMPARACION_USD…` · `BadgeAlerta` · panel USD | Local Report | No | 🆕 |
| 21 | 2026-08-10 | **SF burbuja archivos reales Guido** `2.3.1.50.14` · Excel+TXT con nombre intake · tamaño ↑ · Documenta+**publica** | `CHUSAR_SF_BURBUJA_ARCHIVOS_REALES_GUIDO…` · `alerta-inconsistencia.ts` | Sí Report prod | No | 🆕 |
| 22 | 2026-08-10 | **SF canones admin Jul/Ago Guido** `2.3.1.50.15` · UI % solo `Z:\hector\SF\07…`↔`08…` · Documenta+**despliega** | `CHUSAR_SF_CANONES_ADMIN_JUL_AGO_GUIDO…` · `_gen_comparacion_ago_jul.py` | Sí Report prod | No | 🆕 |
| 23 | 2026-08-10 | **SF AL excluido de comparativa** `2.3.1.50.16` · burbuja solo canones · SF AL=contexto · Documenta+**publica** | `CHUSAR_SF_AL_EXCLUIDO_COMPARATIVA_CANONES…` · `alerta-inconsistencia.ts` | Sí Report prod | No | 🆕 |
| 24 | 2026-08-10 | **SF burbuja solo canon↔TXT** `2.3.1.50.17` · sin SF AL · sin Δ fuera Jul/Ago · Documenta+**despliega**+**publica** | `CHUSAR_SF_BURBUJA_SOLO_CANON_TXT…` · `BadgeAlertaSitFin` | Sí Report prod | No | 🆕 |
| 25 | 2026-08-10 | **SF Registros TXT Hiedra + cabecera** `2.3.1.50.18` · pestaña · 9 requeridos · Faro `50.19` · plantilla reclamos `50.20` · Documenta+**ejecuta**+**despliega** · zip Moises Héctor | `CHUSAR_SF_REGISTROS_TXT…` · `SitFinRegistrosTxtTab` · `registros-txt-erp.json` · `cabecera_meta.py` | Sí Report prod | No | 🆕 |
| 26 | 2026-08-10 | **SF STOCK ifstgp4 · 3 TXT 1/depósito** `2.3.1.50.21` · monto Dls×STOCK · grupo uno · hermano sdrm#### · flujo normal Faro · Documenta | `CHUSAR_SF_STOCK_IFSTGP4…` · padrón/registros `ifstgp4` · clasificador `stock_por_grupo` | Local Report | No | 🆕 |
| 27 | 2026-08-10 | **Moises handoff Faro + prep previsto×cobrado julio** `2.3.1.50.22`+`50.23` · hecho/pendiente/próximo · Protocolo Chusar+Moises Activado · Documenta · zip Héctor→Andrés | `CHUSAR_SF_MOISES_HANDOFF…` · `CHUSAR_SF_PREPARACION_PREVISTO_COBRADO…` | No (doc) | No | 🆕 |
| 28 | 2026-08-10 | **Burbuja sin SF AL** `2.3.1.50.24` · mapa `archivoTxt`=SF AL · guarda TXT · audit PASS · Documenta+**publica** | `CHUSAR_SF_BURBUJA_SIN_SF_AL…` · deploy · `alerta-inconsistencia.ts` · mapas scrub | Sí Report prod | No | 🆕 |
| 29 | 2026-08-10 | **Reclamo Guido cheques ago** `2.3.1.50.25` · TXT TOTAL=canon 08 · parser OBS · audit 6 TXT PASS · Documenta+**publica** | `CHUSAR_SF_RECLAMO_GUIDO_CHEQUES_AGO…` · deploy · `parsers.py` · molecular | Sí Report prod | No | 🆕 |
| 30 | 2026-08-10 | **Burbuja solo mismo objeto** `2.3.1.50.26` · off ⚠ Luisito/previsión/aging · allowlist cheques · Documenta+**despliega** · commit `7fee0f2` | `CHUSAR_SF_BURBUJA_SOLO_MISMO_OBJETO…` · `alerta-inconsistencia.ts` | Sí Report `7fee0f2` | No | 🆕 |
| 31 | 2026-08-10 | **TXT manda · no maquillar** `2.3.1.50.27` · nunca 0 con ▸ · Documenta · commit `656382f` | `CHUSAR_SF_TXT_MANDA…` · deploy · `SitFinExcelAlTab` | Sí Report `656382f` | No | 🆕 |
| 32 | 2026-08-10 | **Pendientes Faro consolidados** `2.3.1.50.28` · handoff `50.22` actualizado · Documenta | `CHUSAR_SF_PENDIENTES_FARO…` · handoff | No (doc) | No | 🆕 |
| 33 | 2026-08-10 | **SF v1 CERRADA** `2.3.1.50.29` · etapa `SITUACION-FINANCIERA…` · FOCO → PE LPC `2.2.1.52.2` · Documenta+cierre `:3004` | `CHUSAR_SF_V1_CERRADA…` · `ETAPA_…_CERRADA` · `etapas.json` · `ETAPA_PE_LPC…` | No (doc+nav) | No | 🆕 |
| 34 | 2026-08-10 | **Inicia etapa Delivery Bazzar** `2.7.1` · transporte empresa independiente · hub Report `/delivery-bazzar` · FOCO `:3004` | `CHUSAR_DELIVERY_BAZZAR_CONSTITUCION…` · `ETAPA_DELIVERY…` · hub-modules | Local Report | No | 🆕 |
| 35 | 2026-08-10 | **Receteo Bazzar Web pruebas** `2.5.1.29` · mapa 1718→0 · seq pedido=1 · Documenta+etapa `BAZZAR-WEB-PRUEBAS-FACTURA1` | `CHUSAR_RECETEO_PRUEBAS_FACTURA1…` · purge + `_reset_pedido_web_seq` | No (BD LAB) | Purge ALM1 | 🆕 |
| 36 | 2026-08-11 | **2ª integridad Bancard+EDB** `2.5.1.30` · protocolos bóveda/siameses · prep carga stock · Documenta+Inicia etapa | `CHUSAR_INTEGRIDAD_2_BANCARD_EDB…` · `ETAPA_…INTEGRIDAD_2…` · ACTUAL · `2.7.2` | No (doc) | No | 🆕 |

**Cómo agregar una fila (agentes Héctor con Documenta):**
  
1. Alta del doc/código **en lenguaje claro** (qué / cómo / qué hace Andrés).  
2. Marca en `INDICE.md`: `🆕 MOISES post-20260807 · fecha`.  
3. Una línea en esta tabla.  
4. Sync a `moria_chusar/content/claude` cuando Héctor prepare su zip.  
5. No sync automático. No insistir en armar el zip (lo hace Héctor).

---

## Lotes cerrados (histórico enviado a Andrés)

| ID lote | Enviado | Ítems | Notas |
|---------|---------|-------|-------|
| *(ninguno aún)* | — | — | Baseline aparte del primer lote incremental |

---

## Instrucción fija al Cursor (PC Andrés)

```
Leé 5.01.00.022 + este CHANGELOG.
Aplicá SOLO el lote indicado por Héctor.
Baseline = inmutable.
Git/DB solo si el lote lo lista.
Sync OPS Héctor = PROHIBIDO.
```
