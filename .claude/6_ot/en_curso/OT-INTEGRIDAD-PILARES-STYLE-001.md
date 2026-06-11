# OT-INTEGRIDAD-PILARES-STYLE-001 — Pilares enteros + FK en todo el flujo

**Prioridad:** P0  
**Ejecutor:** Claude Code  
**Auditor:** Cursor  
**Director:** Héctor Segovia  
**Módulos:** Pedido Proveedor (proforma) + Motor de Precios + `precio_lista`

---

## Ley fundamental (no negociable)

1. **Pilares Línea y Referencia son siempre enteros** (códigos proveedor), nunca floats con separador de miles en UI.
2. En **proforma Excel**, columna **C = STYLE** con texto tipo **`1184.100`**: el **punto** separa **Línea** (izquierda) de **Referencia** (derecha). Ejemplo: `1184.100` → línea `1184`, ref `100`.
3. **Fuente de verdad relacional:** `(linea_id, referencia_id, material_id)` en `precio_lista` y cruces PP/FI.  
   Columnas denormalizadas (`linea_codigo`, `referencia_codigo`) son **cache de display**, rellenadas desde FK o desde parse — nunca sustituyen al JOIN por `id`.

**Prohibido:** parches que solo arreglen una pantalla; JOINs incorrectos `pl.linea_codigo = l.id::text`; `int(float("1184.100"))` → `1184` perdiendo referencia.

---

## Síntomas reportados (Director + capturas)

| # | Pantalla | Síntoma |
|---|----------|---------|
| 1 | PP → Detalle importación / stock | **Ref. = `nan`**, **Código** duplica **Línea**; STYLE no partido (ej. línea `1122828` sin ref) |
| 2 | PP → Precios de este stock | 197 artículos sin precio; columnas vacías aunque evento tiene precios |
| 3 | PP → Explorador listado precios evento #1 | **LPN, Línea, Ref., Material = `—`** pero **LPC02/03/04 y caso sí tienen valor** (91 filas) |

**Interpretación:** El cálculo SQL **sí corrió** (FK en `linea_id`/`referencia_id`/`material_id` en INSERT 053b), pero **la UI de PP lee mal** y/o **el parse STYLE en proforma/listado rompe referencia**.

---

## Hallazgos Cursor (investigación — no implementar parches sueltos)

### A. Parser STYLE (proforma) — existe pero fragile

| Archivo | Función |
|---------|---------|
| `modules/rimec_engine/hiedra.py` | `parsear_linea_referencia(valor_celda)` — `split(".", 1)` → `(int, int\|None)` |
| `modules/pedido_proveedor/logic.py` | `parse_proforma()` — col STYLE = `2 + offset` (col C), llama parser |

**Riesgos:**

- Excel guarda STYLE como **número** (`1184.1` en vez de `1184.100`) → ref `1` en vez de `100`.
- Valor sin punto (`1122828`) → solo línea, `ref_cod=""` → UI `nan`.
- `str(row.iloc[col])` sobre float grande pierde estructura `NNN.NNN`.

**Acción OT:** leer celda STYLE como **texto** (openpyxl / `dtype` / converters); normalizar con `parsear_linea_referencia`; validar filas sin ref cuando el negocio exige triplete.

---

### B. Motor listado Excel — NO usa parser STYLE

| Archivo | Función | Problema |
|---------|---------|----------|
| `modules/rimec_engine/logic.py` | `_extraer_hoja_layout_bacera()` | Col A=línea, B=ref **separadas** — OK para Bacera |
| Mismo | `_mapear_columnas()` | Header `STYLE` → columna `linea` **entera**, sin split |
| Mismo | `_parse_codigo_pilar()` | `int(float("1184.100"))` → **1184**, pierde `.100` |

Si el listado de precios del Motor trae `1184.100` en una sola columna, **referencia se pierde** → staging omite fila o FK incompleto.

**Acción OT:** función única `normalizar_linea_referencia_desde_excel(linea_raw, ref_raw)` usada en Motor + Hiedra + proforma; si `linea_raw` contiene `.` y `ref_raw` vacío → split.

---

### C. `precio_lista` — INSERT SQL 053b sin códigos denormalizados

Migración `053b_fix_columnas_aplicado.sql` — `INSERT` incluye:

- `linea_id`, `referencia_id`, `material_id` ✅  
- **NO** `linea_codigo`, `referencia_codigo`, `material_descripcion` ❌

Python `guardar_precio_lista()` sí los escribe. Tras Paso 3 SQL, códigos texto en `precio_lista` quedan **NULL**.

---

### D. Pedido Proveedor — JOINs incorrectos (causa principal pantalla 3)

**Archivo:** `modules/pedido_proveedor/logic.py`

#### `get_lista_precios_completa()` ~L2546-2548 — **BUG**

```sql
LEFT JOIN linea     l ON l.id::text = pl.linea_codigo      -- INCORRECTO
LEFT JOIN referencia r ON r.id::text = pl.referencia_codigo
LEFT JOIN material   m ON m.id::text = pl.material_descripcion
```

Debe alinearse a Motor (`get_precio_lista_completa` en `rimec_engine/logic.py` ~L2479):

```sql
LEFT JOIN linea     l ON l.id  = pl.linea_id
LEFT JOIN referencia r ON r.id = pl.referencia_id
LEFT JOIN material   m ON m.id = pl.material_id
```

Display: `COALESCE(l.codigo_proveedor::text, pl.linea_codigo, '—')`.

#### `get_skus_con_precio_para_fi()` ~L2676-2678 — **BUG**

```sql
LEFT JOIN precio_lista pl ON pl.linea_codigo = l.id::TEXT
                         AND pl.material_descripcion = m.id::TEXT
```

Debe usar `pl.linea_id = l.id AND pl.referencia_id = ref.id AND pl.material_id = m.id` (+ `evento_id`).

#### `get_precios_stock_pp()` ~L1786-1793 — **OK**

Ya cruza `precio_lista` con `linea_id` + `material_id` (documentar si negocio exige también `referencia_id`).

---

## Alcance de implementación (Claude)

### Fase 1 — Contrato único de pilares (código)

1. Crear `modules/rimec_engine/pillar_parse.py` (o extender `hiedra.py`):
   - `parsear_linea_referencia()` (mover o re-exportar)
   - `normalizar_triplete_excel(linea_cell, ref_cell=None) -> (linea:int, ref:int|None, warnings)`
   - Manejo Excel numérico / trailing zeros en referencia (política documentada en docstring)

2. Usar en:
   - `parse_proforma()` / `populate_pp_from_proforma`
   - `leer_excel_proveedor` / `_extraer_hoja_layout_bacera` / `_extraer_hoja_por_nombres`
   - `_normalizar_codigos_skus` (reemplazar `_parse_codigo_pilar` directo en linea/ref)

### Fase 2 — `precio_lista` siempre legible

1. **Migración 055** (o amend 053b): en `calcular_precio_lista_evento_sql`, en el `INSERT` añadir:

   ```sql
   linea_codigo = s.linea_codigo,
   referencia_codigo = s.ref_codigo,
   material_descripcion = COALESCE(s.material_desc, m.descripcion::text)
   ```

   (Ajustar nombres columnas staging.)

2. Script backfill one-shot para evento #1 y futuros:

   ```sql
   UPDATE precio_lista pl SET
     linea_codigo = l.codigo_proveedor::text,
     referencia_codigo = r.codigo_proveedor::text,
     material_descripcion = m.descripcion
   FROM linea l, referencia r, material m
   WHERE pl.linea_id = l.id AND pl.referencia_id = r.id AND pl.material_id = m.id
     AND (pl.linea_codigo IS NULL OR pl.referencia_codigo IS NULL);
   ```

### Fase 3 — Pedido Proveedor lecturas

1. Corregir `get_lista_precios_completa`, `get_skus_con_precio_para_fi`, buscar en `pedido_proveedor/logic.py` cualquier patrón `pl.linea_codigo = l.id`.
2. Alinear nombres columnas UI con Motor (Línea, Ref., Cód.Mat).
3. Revisar cruce stock sin precio (197 artículos): tras JOIN correcto, diagnosticar si falta match triplete vs solo linea+material.

### Fase 4 — Pruebas obligatorias

| ID | Prueba | PASS |
|----|--------|------|
| T1 | Proforma con STYLE `1184.100` → PP detalle Línea=1184, Ref=100 (enteros) | |
| T2 | Motor listado con STYLE en col A → mismo split | |
| T3 | Paso 3 SQL → `SELECT linea_id, referencia_id, linea_codigo, referencia_codigo FROM precio_lista WHERE evento_id=X` todos poblados | |
| T4 | PP explorador evento → Línea/Ref/LPN visibles (no `—`) | |
| T5 | PP precios stock → LPN/caso para SKUs con match en listado | |
| T6 | `get_skus_con_precio_para_fi` devuelve LPN > 0 donde aplique | |

---

## Protocolo GIT (Claude)

```powershell
cd C:\Users\hecto\Nexus_Core
git status
git diff --stat
```

**Commit solo si el Director lo pide.** Mensaje sugerido:

```
Fix integridad pilares STYLE→FK en precio_lista y lecturas PP.

Unifica parse linea.referencia, corrige JOINs por linea_id/referencia_id y backfill códigos denormalizados tras SQL 053b.
```

**NO push** sin orden explícita.

---

## Protocolo auditoría Cursor (post-Claude)

Cursor completa `ot/RESPUESTA_AUDITORIA_INTEGRIDAD-PILARES.md`:

- [ ] Un solo módulo de parse STYLE
- [ ] Cero JOINs `pl.linea_codigo = l.id::text` en PP
- [ ] 053b/055 inserta o backfill códigos
- [ ] Captura pantalla PP explorador con Línea/Ref numéricos
- [ ] Query evidencia en Supabase

**Veredicto:** PASS / FAIL

---

## Archivos esperados tocados

- `modules/rimec_engine/pillar_parse.py` (nuevo) o `hiedra.py`
- `modules/rimec_engine/logic.py`
- `modules/pedido_proveedor/logic.py`
- `migrations/055_precio_lista_backfill_codigos_sql.sql` (nuevo)
- `migrations/053b_fix_columnas_aplicado.sql` (amend INSERT si aplica)
- `scripts/backfill_precio_lista_codigos.py` (opcional)
- `ot/RESPUESTA_EJECUTOR.md` § OT-INTEGRIDAD-PILARES-STYLE-001

---

## Handoff

Al terminar, Claude escribe en `ot/RESPUESTA_EJECUTOR.md` y avisa: **«Listo para auditoría Cursor OT-INTEGRIDAD-PILARES-STYLE-001»**.

*Investigación Cursor 2026-05-19 — OT para ejecución Claude Code.*
