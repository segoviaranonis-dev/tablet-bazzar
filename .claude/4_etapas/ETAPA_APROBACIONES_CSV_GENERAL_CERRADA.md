# ETAPA: APROBACIONES — CSV GENERAL — CERRADA

**Fecha inicio:** 2026-06-14  
**Fecha cierre:** 2026-06-14  
**Director:** «Aprobado subilo»  
**Estado:** ✅ CERRADA (git + push)

---

## Git (report)

| Campo | Valor |
|-------|--------|
| Repo | `segoviaranonis-dev/report` |
| Rama | `main` |
| Commit | `80a7353` |
| Mensaje | `feat(aprobaciones): CSV general, fecha_confirmacion MIG-114 y export DIOS` |
| Push | `a45f4d4..80a7353` → `origin/main` |

Deploy Vercel: automático en push a `main` — verificar `/aprobaciones` + CSV en ~2 min.

---

## Entregables

- **MIG-114** aplicada Supabase (columna, trigger, índices) — scripts `aplicar_migracion_114.py` / `verificar_aprobaciones_db.py`
- Badge **fecha confirmación** + orden `fecha_confirmacion DESC`
- **📄 CSV general** — `GET /api/aprobaciones/csv-general` (27 cols, RESERVADA/CONFIRMADA/ANULADA)
- Fix hydration `fmtFechaConfirmacion` (SSR estable)
- Doc: `report/docs/APROBACIONES.md`

---

## Smoke

| Check | Resultado |
|-------|-----------|
| BD 146 CONFIRMADA con fecha | ✅ |
| CSV 946 líneas detalle | ✅ |
| Local `:3000/aprobaciones` | ✅ |
| Git push | ✅ |

---

## Fuera de alcance (congelado)

- Streamlit `aprobacion_pedidos`
- Email/PDF post-confirmación

---

**Shibboleth:** 5 patas ✅ · **💰 COSTO:** commit/push Director — mínimo.
