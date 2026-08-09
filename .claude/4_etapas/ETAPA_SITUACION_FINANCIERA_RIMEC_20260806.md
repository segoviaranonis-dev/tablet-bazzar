# ETAPA — Situación financiera Rimec

**ID:** `SITUACION-FINANCIERA-RIMEC-20260806`  
**Estado:** 🟢 **EN CURSO · FOCO** (2026-08-09 · pipeline TXT corte AL)  
**Módulo:** Report · **2.3.1.50**  
**Ejecutor:** Cursor  

**CHUSAR:**  
- Constitución [2.3.1.50](../2_modulos/2.3_report/situacion_financiera/CHUSAR_SITUACION_FINANCIERA_RIMEC_CONSTITUCION_20260806.md)  
- Pipeline TXT [2.3.1.50.3](../2_modulos/2.3_report/situacion_financiera/CHUSAR_PIPELINE_TXT_SF_AL_NEXUS_20260809.md)

---

## Checklist

| # | Ítem | Estado |
|---|------|:------:|
| 1 | Constitución | ✅ |
| 2 | Auditoría borrador cobros | ✅ |
| 3 | SF-MAPA cobros v1 | ✅ |
| 4 | Intake corte AL 03-08 + clasificador TXT | ✅ 2026-08-09 |
| 5 | Corrida LAB → `SF_NEXUS_03-08-26.xlsx` + HTML | ✅ |
| 5b | Tablas T01–T12 + MIG-203 + persistencia/variaciones | ✅ 2026-08-09 |
| 5c | Módulo hub Report + Documenta+publica `5e36e76` | ✅ 2026-08-09 |
| 6 | Cuadrar deltas cheques / filtros funcionario | ⏳ |
| 7 | UI Report `/situacion-financiera` · hub + pestañas Guido **2.3.1.50.6** | ✅ |
| 7b | Cablear cuadro/verdes reales al peso Excel | ⏳ |
| 8 | Staging Supabase + ratios | ⏳ |
| 9 | Cierre canónico | ⏳ |

---

## Comando LAB

```bat
cd report\scripts\situacion-financiera\pipeline
python run_corte.py
```

---

**Documenta + ejecuta 2026-08-09 — mapear TXT = puerta de variaciones ERP.**
