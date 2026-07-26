# DEPLOY Report · 2026-07-26

**Commit:** `2a18c90` · repo `segoviaranonis-dev/report`  
**URL:** https://rimec-report.vercel.app  
**Orden:** Director — despliegue completo

---

## Alcance

| Módulo | Rutas |
|--------|-------|
| Listado motor FI | `/proceso-importacion/pedido-proveedor/[ppId]?tab=fi` |
| Logística OK | `/logistica-ok` |
| PP cierre Carlos | PP tab FI · import CSV |
| Hiedra PE | `/stock-pronta-entrega` |

---

## Etapas cerradas

| Code | Doc |
|------|-----|
| `LISTADO-MOTOR-FI-PP-20260726` | [ETAPA_LISTADO_MOTOR_FI_PP_20260726_CERRADA.md](../../4_etapas/ETAPA_LISTADO_MOTOR_FI_PP_20260726_CERRADA.md) |
| `LOGISTICA-OK-20260719` | [ETAPA_LOGISTICA_OK_20260719_CERRADA.md](../../4_etapas/ETAPA_LOGISTICA_OK_20260719_CERRADA.md) |
| `HIEDRA-VENENOSA-PE-REPORT-20260726` | [ETAPA_HIEDRA_VENENOSA_PE_REPORT_20260726_CERRADA.md](../../4_etapas/ETAPA_HIEDRA_VENENOSA_PE_REPORT_20260726_CERRADA.md) |
| `PP-LOGISTICA-CIERRE-20260726` | [ETAPA_PP_LOGISTICA_CIERRE_20260726_CERRADA.md](../../4_etapas/ETAPA_PP_LOGISTICA_CIERRE_20260726_CERRADA.md) |

---

## Migraciones BD (aplicar prod si faltan)

167–184 — ver `report/migrations/` · scripts `apply-mig-*.mjs`

---

## Smoke post-deploy

1. https://rimec-report.vercel.app/logistica-ok
2. https://rimec-report.vercel.app/proceso-importacion/pedido-proveedor/38?tab=fi
3. https://rimec-report.vercel.app/stock-pronta-entrega

---

**Documenta:** Director 2026-07-26
