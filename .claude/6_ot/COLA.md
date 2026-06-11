# Cola OT — Nexus Core

**Actualizado:** 2026-05-20 — **Leyes de Importación de Pilares delegadas a Claude Code**

---

## OT CERRADA — Leyes de Importación de Pilares ✅

| OT | Ejecutor | Estado |
|----|----------|--------|
| `OT-PILARES-LEYES-IMPORTACION-001` | **Claude Code** | ✅ **COMPLETADA** (Fase 1 + Fase 2) |

**Entregables:** `core/pilares/` (upsert, herencia, grada, enriquecimiento) · `tests/test_pilares.py` (30/30, ~85%) · refactors Retail / Proforma / Listado Precios  
**Regla:** `.cursor/rules/politicas-importacion-pilares.mdc` · **Estrategia gradas:** B (string, sin expandir)  
**Commits:** `9eb2e05`, `00f50bb`, `ca8ae36`  
**Evidencia:** `ot/PILARES-LEYES-IMPORTACION-001-EVIDENCIA.md`  
**Smoke tests:** ✅ `OT-PILARES-SMOKE-TESTS-004` PASS (`62def01`)

---

## OT CERRADA — Smoke tests pilares ✅

| OT | Ejecutor | Veredicto |
|----|----------|-----------|
| `OT-PILARES-SMOKE-TESTS-004` | **Claude Code** | ✅ **PASS** (5/5 tests) |

**Script:** `control_central/scripts/smoke_test_pilares.py` · **Commit:** `62def01`  
**Evidencia:** `ot/PILARES-SMOKE-TESTS-004-EVIDENCIA.md`

**Resumen:** Retail 1497 filas (0 sin grada, FKs 100%) · Proforma §6 OK · Listado herencia OK · Sales 107890 intacto · pytest 30/30 (85% cov).

**Ecosistema pilares:** OT-001 + OT-004 → **cerrado y validado en Supabase**.

---

## OT CERRADA — Retail filtros 6 pilares ✅

| OT | Ejecutor | Veredicto |
|----|----------|-----------|
| `OT-REPORT-RETAIL-FILTROS-6-PILARES-005` | **Claude Code** | ✅ **PASS** (5/5 bugs · 6/6 filtros) |

**Filtros operativos:** Género + Marca + Estilo + Línea + Color (por `color_id`) + Tipo 1  
**Cambios verificados:** `retail-filters.ts`, `query-filtros.ts`, `staging-row.ts`, `RetailFiltrosHeader.tsx`, `RetailStockClient.tsx`  
**Evidencia:** `ot/REPORT-RETAIL-FILTROS-6-PILARES-005-EVIDENCIA.md`  
**Dev server:** `http://localhost:3002/retail`

Capturas operativas por filtro pendientes de Director.

---

## FOCO ACTUAL — RIMEC Web (`rimec-web/`)

| OT | Estado |
|----|--------|
| `OT-RIMEC-WEB-FILTRO-ETA-001` | ✅ CERRADA |
| `OT-RIMEC-WEB-MARCA-COLORES-001` | ✅ CERRADA |

**Siguiente:** deploy/commit si aún no está en `main` · probar en localhost:3001.

**Paralelo baja prioridad:** `OT-EQUIPO-RIMEC-WEB-521-001` (login Vercel).

---

## OT diseño — Gemini (UI)

| OT | Ejecutor | Acción |
|----|----------|--------|
| `OT-REPORT-RETAIL-TARJETAS-COMPACTAS-006` | **Gemini** | **Solo foto más chica + grilla más densa** (2→4 cols). Las 4 tablas Tienda/RIMEC NO se tocan. |
| `OT-REPORT-RETAIL-TEMA-CLARO-001` | **Gemini** | Migrar `/retail` (cliente + filtros + rejilla) al estilo claro editorial — usa `report-*` |
| `OT-RIMEC-WEB-ETA-POSICION-002` | **Gemini** | Mover chip ETA al lateral derecho de la fila Marca · Línea · Referencia |
| `OT-RIMEC-WEB-ETA-TAMANO-003` | **Gemini** | **Aumentar tamaño** del chip ETA (`text-sm`, más padding) — pedido Director |

**Archivos:**
- `ot/en_curso/OT-RIMEC-WEB-ETA-POSICION-002.md`
- `ot/en_curso/OT-RIMEC-WEB-ETA-TAMANO-003.md`

```
OT-RIMEC-WEB-ETA-TAMANO-003 — Chip ETA más grande (legible en móvil)
Repo: rimec-web/app/CatalogoGrid.tsx
Ver ot/en_curso/OT-RIMEC-WEB-ETA-TAMANO-003.md
(Si falta ubicación: aplicar también OT-002 antes)
```

---

## OT ACTIVA — Reset focal (Claude Code)

| OT | Ejecutor | Acción |
|----|----------|--------|
| `OT-RESET-FOCAL-IC-PP-LISTADOS-001` | **Claude Code** | Dry-run + execute reset focal (IC + PP + Digitación + Listados) |

**Conserva:** pilares + biblioteca + Sales Report + Retail + downstream.  
**Archivo:** `ot/en_curso/OT-RESET-FOCAL-IC-PP-LISTADOS-001.md`  
**Migración:** `control_central/migrations/062_reset_focal_ic_pp_listados.sql`  
**Script:** `control_central/scripts/reset_focal_ic_pp_listados.py`

```
PRIORIDAD ALTA — OT-RESET-FOCAL-IC-PP-LISTADOS-001
cd C:\Users\hecto\Nexus_Core\control_central
python scripts\reset_focal_ic_pp_listados.py --dry-run
python scripts\reset_focal_ic_pp_listados.py --execute --confirm RESET-FOCAL-CONFIRMADO
```

---

## OT MÁXIMA PRIORIDAD — Catálogo vacío multi-origen

| OT | Ejecutor | Acción |
|----|----------|--------|
| `OT-RIMEC-WEB-TARJETAS-MULTI-ORIGEN-001` | **Claude Code** | Ejecutar **061** en Supabase + probar :3001 |

**Causa:** migración 059 filtró `aprobado/cerrado` en vez de `ABIERTO/ENVIADO`.  
**Fix:** `control_central/migrations/061_fix_v_stock_rimec_estados_catalogo.sql`

```
MÁXIMA PRIORIDAD — OT-RIMEC-WEB-TARJETAS-MULTI-ORIGEN-001
Ejecutar 061 en Supabase, verificar COUNT(*) v_stock_rimec > 0, probar http://localhost:3001
```

---

## OT ACTIVA — Retail DB (Claude Code)

| OT | Ejecutor | Acción |
|----|----------|--------|
| `OT-RETAIL-ST-VT-RC-001` | **Claude Code** | Verificar Supabase + migración 060 + evidencia |

**Archivo:** `ot/en_curso/OT-RETAIL-ST-VT-RC-001.md`  
**Evidencia:** `ot/RETAIL-ST-VT-RC-001-EVIDENCIA.md`

### Copiar a Claude

```
Ejecutá OT-RETAIL-ST-VT-RC-001 en C:\Users\hecto\Nexus_Core\control_central.
Leé ot/en_curso/OT-RETAIL-ST-VT-RC-001.md y completá ot/RETAIL-ST-VT-RC-001-EVIDENCIA.md
```

---

## OT — Streamlit deploy (cerrar cuando Director confirme)

## OT ACTIVA — Director: restart Streamlit (post-deploy)

**Git:** ✅ Claude — commit `7d97535` en `main`  
**Remote:** https://github.com/segoviaranonis-dev/ventas_por_mes_rimec.git

| Paso | Quién | Acción |
|------|--------|--------|
| 1 | ~~Claude~~ | ✅ push OK |
| 2 | **Director** | `git pull origin main` + **reiniciar** Streamlit |
| 3 | **Usuarios** | Ctrl+F5 si la UI se ve vieja |

**Archivo OT:** `ot/en_curso/OT-DEPLOY-STREAMLIT-PASO3-001.md`  
**Respuesta:** `ot/RESPUESTA_EJECUTOR.md`

### Copiar a Claude

```
Ejecuta la OT
```

**Incluye en el commit (mínimo):**

- `modules/rimec_engine/ui.py` — fix Paso 3 `re_paso3_run`
- `modules/pedido_proveedor/` — borrar/reimportar + precios triplete
- `migrations/055_*.sql`, `056_nomenclatura_pilares_p0.sql`
- Docs/reglas nomenclatura P0 si están en el diff

**Supabase:** 055 + 056 ya aplicados en prod por Director — no re-ejecutar.

---

## Ley P0 — nomenclatura (referencia)

`control_central/docs/RIMEC_NOMENCLATURA_PILARES.md`

---

## Auditoría Paso 3 (Cursor — solo lectura)

**¿Fix en disco?** SÍ (`re_paso3_run`). **¿En Streamlit live?** Solo tras push + restart.  
Detalle: `ot/AUDITORIA_PASO3_ESTADO.md`

| Síntoma | Causa más probable |
|---------|-------------------|
| Log solo «esperando eventos…» | App **sin reiniciar** (código viejo) |
| No hay botón verde | Ya hay precios → usar **Paso 4** |
| Caja roja debajo | Ley género / marca / SQL |

---

## Paralelo — operación comercial

| Tarea | Estado |
|-------|--------|
| Supabase 055 + 056 | Director OK |
| Fix Paso 3 en disco | OK |
| Git push | ✅ `7d97535` |
| Streamlit restart | **AHORA — Director** |
| PP reimport + Paso 3 cálculo | Tras deploy |

---

## Historial

| OT | Estado |
|----|--------|
| OT-DEPLOY-STREAMLIT-PASO3-001 | **ACTIVA** |
| OT-NOMENCLATURA-PILARES-001 | Código en disco — cerrar tras deploy |
| OT-INTEGRIDAD-PILARES-STYLE-001 | PASS_COND + 055/056 |
