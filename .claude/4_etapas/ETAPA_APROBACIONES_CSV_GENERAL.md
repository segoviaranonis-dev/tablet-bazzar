# ETAPA: APROBACIONES — CSV GENERAL (REPORT CANÓNICO)

**Fecha inicio:** 2026-06-14  
**Estado:** ✅ **CERRADA** — ver [ETAPA_APROBACIONES_CSV_GENERAL_CERRADA.md](./ETAPA_APROBACIONES_CSV_GENERAL_CERRADA.md) · commit `80a7353`  
**Director:** Report = panel de control RIMEC · Streamlit congelado para Aprobaciones

---

## Política

| Herramienta | Aprobaciones |
|-------------|--------------|
| **Report** `/aprobaciones` | ✅ **CANÓNICO** |
| **Streamlit** `aprobacion_pedidos` | ⏸ **CONGELADO** |

Spec legacy 21 cols: `control_central/modules/pedido_proveedor/MAPA_CSV_VENTAS_PP.md`

---

## Objetivo

CSV general (27 cols) + **fecha confirmación** visible y ordenada — BD robusta (trigger + índices), sin depender de Streamlit.

---

## Entregables — ✅ COMPLETOS (local + Supabase)

| # | Entregable | Evidencia |
|---|------------|-----------|
| 1 | **MIG-114** columna + trigger + índices | Aplicada Supabase 2026-06-14 · 146 CONFIRMADA con fecha |
| 2 | Scripts ops | `scripts/aplicar_migracion_114.py`, `verificar_aprobaciones_db.py` |
| 3 | Badge **Fecha confirmación** | `FiCard.tsx` · formato estable SSR (`fmtFechaConfirmacion`) |
| 4 | Orden confirmadas | `fecha_confirmacion DESC` en queries |
| 5 | **📄 CSV general** | `GET /api/aprobaciones/csv-general` · gate DIOS · check schema 503 |
| 6 | Export 27 cols | `csv-general-export.ts` · RESERVADA/CONFIRMADA/ANULADA |
| 7 | `confirmarFi` | `fecha_confirmacion = NOW()` + trigger BD backup |
| 8 | Middleware | `/api/aprobaciones/*` gate Nivel Dios |
| 9 | Doc | `report/docs/APROBACIONES.md` |

### Smoke BD (2026-06-14)

```
python scripts/verificar_aprobaciones_db.py
→ OK schema | FI exportables: 150 | líneas CSV: 946
→ OK: todas las CONFIRMADA tienen fecha_confirmacion
```

### Smoke UI local

- URL: `http://localhost:3000/aprobaciones` (sesión DIOS)
- 146 confirmadas · badge ámbar fecha · botón CSV general
- Hydration mismatch fecha: **corregido** (`aprobaciones-utils.ts`)

---

## PROPUESTA DE CIERRE — paso 2 protocolo

**Repo:** `report` (`segoviaranonis-dev/report`)  
**Rama sugerida:** `cursor/aprobaciones-csv-general-114`  
**Tipo:** `feat(aprobaciones)`

### Archivos a incluir en commit (solo esta etapa)

```
migrations/114_fi_fecha_confirmacion.sql
scripts/aplicar_migracion_114.py
scripts/aplicar_migracion_114.mjs
scripts/verificar_aprobaciones_db.py
docs/APROBACIONES.md
src/app/aprobaciones/**          (FiCard, Client, queries, mutations, csv, db-schema)
src/app/api/aprobaciones/csv-general/**
src/middleware.ts
src/components/report/NexusHeaderZen.tsx   (nav DIOS)
src/app/page.tsx                           (hub aprobaciones)
```

**Espejo SQL (opcional, repo control_central):** `control_central/migrations/114_fi_fecha_confirmacion.sql`

**Excluir del commit:** `src/app/rrhh/**`, scripts debug login, `RRHH_*.sql`, etc.

### Mensaje commit sugerido

```
feat(aprobaciones): CSV general, fecha_confirmacion MIG-114 y export DIOS

- MIG-114: columna, trigger trg_fi_fecha_confirmacion, índices CSV
- GET /api/aprobaciones/csv-general (27 cols, todos estados FI)
- Badge fecha confirmación + orden DESC; fmt SSR estable
- Scripts aplicar/verificar migración
```

### Checklist cierre (Director)

```
[ ] Smoke local OK (fecha + CSV descargado)
[ ] Director: "Aprobado" / "Subilo"
[ ] git commit + push rama o main
[ ] Vercel deploy ~2 min → /aprobaciones producción
[ ] git pull PC local · working tree limpio (solo archivos etapa)
[ ] Declarar ETAPA CERRADA → mover doc a *_CERRADA.md
```

**Estado actual:** ⏸ **PENDIENTE APROBACIÓN** — no push sin orden explícita.

---

## Fuera de alcance

- Streamlit `aprobacion_pedidos` (congelado)
- Email/PDF post-confirmación
- RRHH (etapa paralela)

---

## Referencias

- Doc técnico: `report/docs/APROBACIONES.md`
- Etapa anterior cerrada: `ETAPA_APROBACIONES_NIVEL_DIOS_CERRADA.md`
- Protocolo: `.claude/1_fundamentos/1.1_protocolos/1.1.10_protocolo_cierre_etapa.md`

**Última actualización:** 2026-06-14 · **Shibboleth:** 5 patas ✅
