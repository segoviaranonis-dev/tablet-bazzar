# OT-MOTOR-OPTIMIZADO-FINAL-001 — Motor Paso 3: SQL punta a punta + UX Dirección

**Estado:** `PENDIENTE_EJECUCION`  
**Fecha:** 2026-05-18  
**Decisión Director:** **Opción C — Paquete completo** (consultorías 522 cerradas)  
**Ejecutor único de código:** **Claude Code** (VS Code)  
**Repo:** `C:\Users\hecto\Nexus_Core\control_central`  
**Auditoría:** Cursor (Auto) — veredicto PASS solo con JSON + RESPUESTA en disco  

**Meta innegociable:** 91 SKUs — de **~147 s** a **&lt;10 s** en Paso 3 (localhost o Cloud, post-migraciones).

---

## Al terminar

Escribí en: **`ot/RESPUESTA_EJECUTOR.md`**  
JSON: **`control_central/OT-MOTOR-OPTIMIZADO-FINAL-001-EVIDENCIA.json`**

### Prerrequisito humano (Director — Héctor)

- **Migraciones 052 y 053** deben quedar en disco (ya existen); Héctor las ejecuta en el **SQL Editor de Supabase** cuando Claude confirme commit.
- Claude **no** aplica 052/053 en prod salvo que el Director lo pida explícitamente.

---

## Objetivo gerencial

Velocidad punta a punta y pantalla impecable para Dirección en **Paso 3 — Cálculo automático** del Motor de Precios.

---

## Alcance unificado (absorbe OT-520 + OT-524 + hotfix 522 + UX 522)

| Bloque | Origen | Entregable |
|--------|--------|------------|
| **A** | OT-520 | Migraciones `052`, `053` verificadas; `USE_CALCULO_SQL`; función `calcular_precio_lista_evento_sql` |
| **B** | OT-524 | Migración `054`: `resolver_pilares_sql()` — FK línea/ref/material set-based |
| **C** | Hotfix 522 | Caché acotada (`build_pillar_cache(skus_df)`), prefetch materiales, `ANY` en `asegurar_pilares` — **commitear** |
| **D** | Gemini 522 | UX Paso 3: 5 fases negocio, insignias ⚡/🐢, ocultar «Iniciar cálculo» si `n_bd > 0`, copy anti-recarga Cloud |

**Fuera de alcance:** OT-521 rimec-web login; cambios en `registro_ventas_general_v2`.

---

## Fase A — Cerrar OT-520 (Postgres cálculo precios)

1. Verificar en repo:
   - `migrations/052_precio_lista_indice_triplete.sql`
   - `migrations/053_calcular_precio_lista_evento_sql.sql`
   - `logic.py`: `cargar_staging_precio_lista`, `calcular_precio_lista_sql`, `limpiar_staging_precio_lista`
   - `ui.py`: `USE_CALCULO_SQL = True`
2. Si falta algo respecto a `ot/en_curso/OT-MOTOR-SQL-520-001.md`, completarlo.
3. Script paridad: `scripts/verificar_paridad_calculo_sql.py` — documentar en RESPUESTA cómo correrlo post-migración.

---

## Fase B — OT-524 FK pilares SQL masivo

**Archivo nuevo:** `migrations/054_resolver_pilares_sql.sql`

Función mínima (ajustar a esquema real):

```sql
-- resolver_pilares_sql(p_proveedor_id, arrays de códigos, descripciones material)
-- UPSERT/SELECT masivo linea, referencia, material
-- RETURN: linea_cod, ref_cod, mat_cod, linea_id, referencia_id, material_id
```

**Python:** `logic.py`

- `resolver_pilares_evento_sql(proveedor_id, skus_df) -> dict` (misma forma que `build_pillar_cache`).
- Paso 3 (`ui.py`): reemplazar cadena `build_pillar_cache` + loop `get_or_create_*` por resolver SQL cuando `USE_CALCULO_SQL` y migración 054 aplicada; fallback al hotfix 522 si SQL falla (log + mensaje).

**Índices:** Si `\d linea` en prod no muestra índice en `(proveedor_id, codigo_proveedor)`, incluir en 054 `CREATE INDEX IF NOT EXISTS` idempotente.

---

## Fase C — Git (obligatorio)

1. Incluir en **un commit** (o dos lógicos) todo el paquete:
   - Hotfix 522 (`logic.py`, `pillar_fk.py`, `ui.py` parcial).
   - Fases A + B + D.
2. Mensaje sugerido: `feat(motor): Paso 3 SQL punta a punta + UX Dirección (OT optimizado final)`
3. **Push** a remoto si el Director tiene remoto configurado; si no, indicar en RESPUESTA.
4. **No** commitear `.env` ni secretos.

---

## Fase D — UX Paso 3 (spec Gemini 522 — implementar en código)

Referencia copy: `ot/RESPUESTA_ANTIGRAVITY.md` §3.

| Requisito | Implementación |
|-----------|----------------|
| **5 fases negocio** | Textos en `proceso_largo` / `avanzar()`: Validación políticas → Sincronización catálogo → Cálculo SKUs → Resguardo servidor → Consolidación |
| **Sin jerga** | Eliminar «caché de pilares» en UI; usar «Sincronizando catálogo de validación…» |
| **Insignias** | Si `USE_CALCULO_SQL`: `⚡ MOTOR ULTRA-RÁPIDO (SQL en Postgres)`; else `🐢 MOTOR TRADICIONAL (Python)` |
| **n_bd > 0** | Ocultar o colapsar «Iniciar cálculo»; destacar botón oro **Continuar al Paso 4** |
| **Anti-recarga** | `st.warning` explícito: no recargar pestaña durante cálculo (deadlock Cloud) |
| **>60 s** | `st.info` con nota de rendimiento Cloud (hasta ~180 s en sincronización inicial si aplica) |

Archivos típicos: `modules/rimec_engine/ui.py`, `ui_proceso.py`.

---

## Pruebas (evidencia JSON)

| ID | Criterio | PASS si |
|----|----------|---------|
| T1 | Tiempo Paso 3 | 91 SKUs **&lt;10 s** tras 052+053+054 en Supabase (log o captura) |
| T2 | Paridad precios | `verificar_paridad_calculo_sql.py` → `diff_count = 0` |
| T3 | UX | 5 fases visibles; insignia SQL; botón recuperación si `n_bd>0` |
| T4 | Git | Commit(s) con hash en RESPUESTA |

Si T1/T2 no se pueden correr sin migraciones en prod: `auditoria_auto: CONDICIONAL` + instrucciones para Héctor.

---

## Prohibidos

- `TRUNCATE CASCADE` en biblioteca/pilares
- `auditoria_auto: PASS` en JSON (solo Cursor)
- Parches UI que reemplacen resolución FK en BD
- Decir «listo» sin `RESPUESTA_EJECUTOR.md` + JSON en disco

---

## Plantilla RESPUESTA_EJECUTOR (copiar al archivo al terminar)

```markdown
## Cabecera
| OT ID | OT-MOTOR-OPTIMIZADO-FINAL-001 |
| Ejecutor | Claude Code |
| Estado final | LISTO_PARA_AUDITORIA \| BLOQUEADO |

## 1. Resumen Director (5 líneas)
...

## 2. Entregables
| Commit | hash |
| Migraciones | 052, 053, 054 rutas |
| JSON | OT-MOTOR-OPTIMIZADO-FINAL-001-EVIDENCIA.json |

## 3. Pruebas T1–T4
| ID | PASS/FAIL/CONDICIONAL | Nota |

## 4. Instrucciones Supabase para Héctor
1. Ejecutar 052...
2. Ejecutar 053...
3. Ejecutar 054...

## 5. Preguntas para Cursor
| # | Pregunta | Contexto |
```

---

## Referencias

- `ot/RESPUESTA_EJECUTOR.md` (consultoría 522 Claude — REFINAR)
- `ot/RESPUESTA_ANTIGRAVITY.md` (consultoría 522 Gemini — copy UX)
- `ot/en_curso/OT-MOTOR-SQL-520-001.md`
- `control_central/OT-MOTOR-CACHE-522-CONSULTA-EVIDENCIA.json`
