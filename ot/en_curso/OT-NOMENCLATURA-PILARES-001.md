# OT-NOMENCLATURA-PILARES-001 — Léxico único en todo Nexus

**Prioridad:** P0 (paralela a integridad pilares; no bloquea 055 backfill)  
**Director:** Héctor Segovia  
**Estado:** FASE 1–3 CÓDIGO EN DISCO — pendiente Supabase 056 + PP reimport (Director)

---

## Asignación ejecutores (Director 2026-05-19)

| Agente | Repo / carpeta | Entregable |
|--------|----------------|------------|
| **Cursor** | `control_central/` | `ot/RESPUESTA_AUDITORIA_NOMENCLATURA_NEXUS.md` |
| **Claude Code** | `rimec-web/`, `bazzar-web/` | `ot/RESPUESTA_EJECUTOR.md` |
| **Gemini** | `report/src/` | `ot/RESPUESTA_ANTIGRAVITY.md` |

**Esta pasada:** solo inventario (grep + tablas). Sin commit. Sin refactor.

---

## Problema

Mismo concepto con nombres distintos: `linea_id`, `id_linea`, `codigo_linea`, `linea_codigo`, `codi_linea`, JOINs por texto vs FK. Un solo proyecto debe hablar un solo idioma.

---

## Ley (resumen)

| Concepto | Nombre único |
|----------|--------------|
| ID Nexus | `id` (catálogo) · `{pilar}_id` (FK) |
| Número proveedor | `codigo_proveedor` · denormalizado `{pilar}_codigo_proveedor` |
| Texto | `descp_*` / columnas documentadas |

Doc: `control_central/docs/RIMEC_NOMENCLATURA_PILARES.md`  
Regla agentes: `control_central/.cursor/rules/rimec-nomenclatura-pilares-p0.mdc`

---

## Plan por fases

### Fase 0 — Contrato (HECHO 2026-05-19)

- [x] Doc canónico
- [x] Regla Cursor `alwaysApply`
- [x] Entrada en `MEMORIA_SISTEMA.md`
- [x] Índice OT + cronología

### Fase 1 — Motor + parser

- [ ] `parse_proforma` → import desde `pillar_parse` (no `hiedra` duplicado)
- [ ] Staging / `leer_excel_proveedor`: variables `*_codigo_proveedor`
- [ ] Bacera layout: STYLE en col A con `normalizar_triplete_excel`
- [ ] Grep `control_central/modules/rimec_engine/` sin alias prohibidos

### Fase 2 — Pedido Proveedor

- [ ] Queries: solo JOIN `pl.{pilar}_id`
- [ ] UI: etiquetas español OK; keys DataFrame canónicas
- [ ] `_lookup_lpn_evento`: quitar rama `linea_codigo = l.id::text`

### Fase 3 — SQL / Supabase

- [ ] Migración: renombrar `precio_lista.linea_codigo` → `linea_codigo_proveedor` (o vista compat)
- [ ] Actualizar `053b` / `055` INSERT con nombres nuevos
- [ ] Director ejecuta en ventana acordada

### Fase 4 — Retail + scripts + web RPC

- [ ] `balance_tiendas_retail/fk_resolve.py`
- [ ] `scripts/import_*`, vistas `v_stock_web` (alias deprecación)

### Fase 5 — Cierre

- [ ] Script `scripts/auditar_nomenclatura_pilares.py` (grep CI)
- [ ] Auditoría Cursor PASS
- [ ] Archivar OT

---

## Criterios de aceptación global

1. Cero usos nuevos de alias prohibidos (lista en doc).
2. Cero JOINs `linea` por `linea_codigo` en módulos activos PP/Motor.
3. `MEMORIA_SISTEMA` + regla P0 referenciados en todo PR de pilares.

---

## Git

Commit solo si Director lo pide. Fase 0 puede ir en commit `docs: nomenclatura pilares P0` cuando autorice.
