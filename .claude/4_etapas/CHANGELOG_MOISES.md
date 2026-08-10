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
