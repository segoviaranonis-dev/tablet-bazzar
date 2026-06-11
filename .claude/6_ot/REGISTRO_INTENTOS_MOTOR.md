# Registro de intentos — Motor de Precios (Director)

| Intento | Fecha | Veredicto | Notas |
|---------|-------|-----------|-------|
| **1** | 2026-05-18 | **Fracaso total** | PELE gkpj/f405, UI rota, SQL 0 filas silencioso, datos inconsistentes |
| **2** | 2026-05-18 ~22:01 | **Fracaso estructural por columnas faltantes** | Destape error OK: staging 91, caso_id válidos. SQL: `column "d1_aplicado" of relation "precio_lista" does not exist` — **053b en repo usaba nombres incorrectos**; columnas reales = `descuento_1_aplicado` (004). ~153 s Paso 3. |
| **3** | 2026-05-18 (SQL) | **Migraciones OK** (Director) | 049 reset OK. 052 OK. **053 falló 42P13** (función ya existía) — **ignorar**. **053b OK** (columnas + función 3 cols). **054 OK**. Siguiente: listado nuevo + Paso 3 en app. |

---

## Intento 2 — cierre técnico

- **No fue** fallo de `caso_id` en staging (JOIN OK: casos 57, 58).
- **Sí fue** esquema Supabase desalineado con función 053b.
- Corrección en disco: `053b_fix_columnas_aplicado.sql` (ALTER columnas + `descuento_N_aplicado` en INSERT).

## Intento 3 — checklist Director

- [ ] `scripts/purgar_solo_eventos_precio.py`
- [ ] Migraciones Supabase (guía orden)
- [ ] `streamlit_run.ps1` → Paso 3 → N precios en `precio_lista` > 0

---

*Actualizado Cursor — preparación Intento 3*
