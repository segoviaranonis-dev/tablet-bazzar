# Auditoría Cursor — OT-INTEGRIDAD-PILARES-STYLE-001

**Fecha:** 2026-05-19  
**Commit Claude declarado:** `547262e` (verificar en `control_central/.git`)  
**Veredicto global:** **PASS_CONDICIONAL** — código PP/Motor OK; **055 en Supabase con cuidado**; UI pendiente Director.

---

## Resumen ejecutivo

| Fase OT | Estado auditoría |
|---------|------------------|
| 1. `pillar_parse.py` | **PASS parcial** — Motor legacy por nombres sí; Bacera A–E y proforma aún sin unificar |
| 2. Migración 055 | **PASS** backfill UPDATE; **FIX Cursor** en Paso 2 (columnas `descuento_*_aplicado`, no `d1_aplicado`) |
| 3. JOINs PP | **PASS** en 2/3 funciones objetivo; queda fallback legacy en `_lookup_lpn_evento` |
| 4. Pruebas T1–T6 | **PENDIENTE DIRECTOR** |

---

## A. Código verificado

### A1. `pillar_parse.py` — PASS

- `parsear_linea_referencia('1184.100')` → `(1184, 100)` por `split(".", 1)`.
- `normalizar_triplete_excel()` para línea+ref+material.

### A2. Motor Excel — CONDICIONAL

| Ruta | Parser STYLE |
|------|----------------|
| `_extraer_hoja_por_nombres()` | ✅ `normalizar_triplete_excel` |
| `_extraer_hoja_layout_bacera()` | ❌ columnas A/B sin split si STYLE en A |
| `parse_proforma()` (PP) | ⚠️ sigue `hiedra.parsear_linea_referencia` (misma lógica, no import unificado) |

**Impacto proforma Ref `nan`:** no resuelto solo con Motor; hace falta leer STYLE como texto en Excel + usar `pillar_parse` en `parse_proforma` (fase 1 incompleta de OT).

### A3. Pedido Proveedor JOINs — PASS (objetivo pantalla 3)

**`get_lista_precios_completa()`** — corregido:

```2546:2548:control_central/modules/pedido_proveedor/logic.py
LEFT JOIN linea      l ON l.id = pl.linea_id
LEFT JOIN referencia r ON r.id = pl.referencia_id
LEFT JOIN material   m ON m.id = pl.material_id
```

Con FK poblados (evento #1), **Línea / Ref / Material / LPN deben dejar de ser `—`** en explorador (sin recalcular).

**`get_skus_con_precio_para_fi()`** — corregido triplete `linea_id` + `referencia_id` + `material_id`.

**`generar_stock_bazar()`** — ya usaba JOIN por códigos proveedor en `ppd` (OK).

**Pendiente menor:** `_lookup_lpn_evento()` conserva rama OR con `linea_codigo = l.id::text` (fallback legacy). No bloquea explorador.

---

## B. Migración 055 — PASS con corrección Cursor

### Paso 1 (UPDATE backfill) — aplicar en Supabase

```sql
-- Solo esta parte si aún no corriste 055 completa
UPDATE precio_lista pl SET ...
```

Tras aplicar, para evento **1**:

```sql
SELECT COUNT(*) AS total,
       COUNT(*) FILTER (WHERE linea_codigo IS NOT NULL AND referencia_codigo IS NOT NULL) AS con_codigos
FROM precio_lista WHERE evento_id = 1;
```

Esperado: `con_codigos = total` (91).

### Paso 2 (función SQL) — CRÍTICO

La versión inicial de Claude en `055_precio_lista_backfill_codigos.sql` reintroducía columnas **`d1_aplicado`** (rompe Intento 3).

**Cursor corrigió en disco** a `descuento_1_aplicado` … `descuento_4_aplicado` (alineado a `053b` en repo).

**Director:** pegar **055 completo desde disco actualizado** o, si ya aplicaste 055 viejo en Supabase, volver a ejecutar solo el bloque `DROP FUNCTION` + `CREATE` del archivo corregido.

**Alternativa segura:** mantener función actual de `053b_fix_columnas_aplicado.sql` y ejecutar **solo Paso 1** del 055 (UPDATE).

---

## C. Pruebas funcionales — PENDIENTE DIRECTOR

| ID | Acción | PASS |
|----|--------|------|
| C1 | Supabase: backfill Paso 1 de 055 | |
| C2 | PP → explorador evento #1: Línea/Ref/LPN numéricos (no `—`) | |
| C3 | PP → Precios stock: menos “sin precio” tras match triplete | |
| C4 | Re-import proforma STYLE `1184.100` → Línea=1184, Ref=100 | |

**Secuencia rápida:**

1. SQL Editor: Paso 1 de `055_precio_lista_backfill_codigos.sql`
2. `.\streamlit_run.ps1` → PP → explorador listado evento 1
3. Captura si C2 PASS → responder «PASS C»

No hace falta recalcular Paso 3 si los FK (`linea_id`, `referencia_id`) ya están en `precio_lista`.

---

## D. Git / proceso

- Claude reportó **push a `main`** — contradice regla habitual “sin push sin Director”. Registrar en acta si no fue autorizado.
- `RESPUESTA_EJECUTOR.md` en workspace **no incluye §7** al momento de esta auditoría (solo §6 Paso3); handoff Claude puede estar solo en mensaje de chat.

---

## Veredicto

| Bloque | Resultado |
|--------|-----------|
| Arquitectura JOIN PP | **PASS** |
| Migración 055 UPDATE | **PASS** (aplicar) |
| Migración 055 función | **PASS** tras fix columnas Cursor |
| Parser proforma unificado | **PENDIENTE** (OT follow-up recomendado) |
| UI explorador sin `—` | **PENDIENTE DIRECTOR** |

**Cierre OT:** `PASS_CONDICIONAL` → **`PASS`** cuando Director confirme C2.

---

*Auditoría Cursor — 2026-05-19*
