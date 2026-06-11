# Evidencia — OT-PILARES-SMOKE-TESTS-004

**Ejecutor:** Claude Code  
**Fecha:** 2026-05-20  
**Veredicto final:** ✅ **PASS**

**Script:** `control_central/scripts/smoke_test_pilares.py`  
**Commit:** `62def01`

---

## Test 5 — pytest

- [x] **30/30 passed** (~0.56s)
- [x] Cobertura ~85% (`core/pilares/`)

---

## Test 4 — Sales Report blindado

| Momento | COUNT `registro_ventas_general_v2` |
|---------|-------------------------------------|
| Antes / Después | **107890** (sin cambios) |

- [x] Aislamiento absoluto preservado

---

## Test 1 — Retail (st+vt+RC)

| Métrica | Valor |
|---------|-------|
| total | 1497 |
| sin_grada | **0** |
| curva_canonica | 160 (10.7%) |
| talla_simple | 901 (60.2%) |
| FKs dimensionales | **100%** (linea, ref, marca, material, color) |

- [x] `registro_st_vt_rc_reposicion` operativa
- [x] Gradas reales (no solo `(sin grada)`)

---

## Test 2 — Proforma (regla no inversa §6)

- [x] Material `codigo=7286`, descripción `PELICA` — **no se vacía** al import sin descripción
- [x] `upsert_material()` respeta §6
- [x] 5 materiales ciegos disponibles para enriquecimiento futuro

---

## Test 3 — Listado precios (herencia §3.1)

- [x] 5 líneas recientes con `marca_id`, `genero_id`, `grupo_estilo_id` poblados
- [x] 0 líneas con sentinela RETAIL_OTROS (herencia desde plantillas)

---

## Conclusión

| Test | Resultado |
|------|-----------|
| 1 Retail | ✅ PASS |
| 2 Proforma | ✅ PASS |
| 3 Listado | ✅ PASS |
| 4 Sales | ✅ PASS |
| 5 pytest | ✅ PASS |

**Motor compartido validado en Supabase:** idempotencia, no inversa, herencia jerárquica, matriz grada 12 pares, Sales blindado.

**Firma:** Claude Code — 2026-05-20  
**Validación Cursor:** Director-Cursor — 2026-05-20 (cierre administrativo)
