# 2.3.1.50 Situación financiera Rimec — índice Moria

**Código:** **2.3.1.50**  
**App:** `report/` · ruta norte `/situacion-financiera`  
**Estado:** 🟢 **FOCO** · módulo hub publicado `/situacion-financiera`  
**Actualizado:** 2026-08-09 · 🆕 MOISES post-20260807 · 2026-08-09

---

## Documentos

| Code | Doc | Rol |
|------|-----|-----|
| **2.3.1.50** | [CHUSAR_SITUACION_FINANCIERA_RIMEC_CONSTITUCION_20260806.md](./CHUSAR_SITUACION_FINANCIERA_RIMEC_CONSTITUCION_20260806.md) | **Constitución** NIC/IFRS · ratios · política módulo |
| **2.3.1.50.1** | [CHUSAR_AUDITORIA_BORRADOR_COBROS_COLABORADOR_20260807.md](./CHUSAR_AUDITORIA_BORRADOR_COBROS_COLABORADOR_20260807.md) | Auditoría borrador colaborador vs F1–F12 |
| **2.3.1.50.2** | [CHUSAR_SF_MAPA_COBROS_V1_20260807.md](./CHUSAR_SF_MAPA_COBROS_V1_20260807.md) | SF-MAPA cobros · columnas + candidatas Supabase |
| **2.3.1.50.3** | [CHUSAR_PIPELINE_TXT_SF_AL_NEXUS_20260809.md](./CHUSAR_PIPELINE_TXT_SF_AL_NEXUS_20260809.md) | Pipeline TXT sucios → SF Nexus · clasificador |
| **2.3.1.50.4** | [CHUSAR_SF_TABLAS_STAGING_VARIACIONES_20260809.md](./CHUSAR_SF_TABLAS_STAGING_VARIACIONES_20260809.md) | T01–T14 · MIG-203 · variaciones |
| **2.3.1.50.5** | [CHUSAR_MODULO_HUB_SITUACION_FINANCIERA_20260809.md](./CHUSAR_MODULO_HUB_SITUACION_FINANCIERA_20260809.md) | Módulo hub Report · Documenta+publica |
| Etapa | [ETAPA_SITUACION_FINANCIERA_RIMEC_20260806.md](../../../4_etapas/ETAPA_SITUACION_FINANCIERA_RIMEC_20260806.md) | FOCO `SITUACION-FINANCIERA-RIMEC-20260806` |
| Intake cobros | `report/scripts/situacion-financiera/intake/colaborador-20260807/` | Script funcionario cobros |
| Intake corte AL | `report/scripts/situacion-financiera/intake/corte-AL-03-08-26/` | Paquete D: SF AL 03-08 |
| Pipeline | `report/scripts/situacion-financiera/pipeline/run_corte.py` | Ejecutar LAB |
| Migración LAB | `report/migrations/203_sf_tablas_staging.sql` | T01–T12 (no prod auto) |

---

## Norte

Módulo gerencial de **información financiera** (no solo UI NIIF visual) para importadora RIMEC — estándar top país/mundo. Borrador cobros = insumo CxC/DSO, **no** el módulo NIIF completo.
