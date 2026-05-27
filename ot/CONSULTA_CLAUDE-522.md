# Consultoría Claude Code — OT-522 (Paso 3 Motor: caché de pilares)

> **Tipo:** CONSULTA (sin implementar código salvo que recomiendes una OT nueva).  
> **No reemplaza** OT-MOTOR-SQL-520 (auditoría pendiente migraciones 052/053).  
> **Contexto:** El Director reportó **>2 min** en Paso 3 con mensaje «Cargando caché de pilares» para **91 SKUs**. Cursor aplicó un hotfix; vos evaluás si es la **mejor** estrategia.

---

## Disparador

Cuando el Director diga: **«Ejecutá la consultoría Claude 522»**

1. Leé este archivo completo + `docs/CONTRATO_ARQUITECTURA.md` (§ anti-patrones).
2. Respondé en **`ot/RESPUESTA_EJECUTOR.md`** (plantilla OT-522).
3. **No** modifiques `COLA.md` ni cierres con `auditoria_auto: PASS`.

---

## Problema observado

| Hecho | Detalle |
|-------|---------|
| Síntoma | Paso 3 Motor atascado ~147 s en «Cargando caché de pilares en memoria…» (91 SKUs) |
| Causa probable (Cursor) | `build_pillar_cache(proveedor_id)` cargaba **todo** el catálogo del proveedor (3 SELECT sin filtro) + N round-trips en materiales |
| OT-520 | `USE_CALCULO_SQL = True` — cálculo final en Postgres; **antes** del SQL sigue resolución FK en Python |

---

## Cambio ya aplicado por Cursor (para auditar, no asumir correcto)

| Archivo | Cambio |
|---------|--------|
| `modules/rimec_engine/logic.py` | `build_pillar_cache(proveedor_id, skus_df)` — caché acotada con `ANY(:codes)` |
| | `prefetch_materiales_para_listado()` — altas material en una transacción |
| `modules/rimec_engine/pillar_fk.py` | `asegurar_pilares_para_listado` — verificación líneas faltantes en **1 query** (antes N) |
| `modules/rimec_engine/ui.py` | Pasa `skus_resueltos` a caché; más mensajes de progreso |

**Commits:** pendiente de empaquetar por Claude si validás el enfoque.

---

## Preguntas obligatorias (respondé cada una)

| ID | Pregunta | Formato respuesta |
|----|----------|-------------------|
| **Q1** | ¿La caché acotada al listado es **suficiente** y alineada al contrato (P2, anti-patrón N+1)? ¿Riesgos? | Sí/No/Parcial + riesgos |
| **Q2** | ¿Mejor mover resolución FK (línea/ref/material) a **SQL set-based** antes de `precio_lista_staging` (extender 053 o función nueva)? | Recomendación + esbozo SQL |
| **Q3** | ¿`provisionar_pilares_desde_skus` sigue siendo cuello de botella (loop por par línea+ref)? ¿Bulk upsert en una transacción? | Sí/No + propuesta |
| **Q4** | ¿Índices faltantes en `(proveedor_id, codigo_proveedor)` para `linea`, `referencia`, `material`? ¿Migración 054? | Lista índices |
| **Q5** | ¿Interactúa bien con **OT-520** (`calcular_precio_lista_evento_sql`) o hay duplicación de trabajo? | Diagrama o bullets |
| **Q6** | ¿Alternativa superior: vista materializada / tabla staging de pilares por evento? | Pros/contras |
| **Q7** | Veredicto: **MANTENER hotfix** \| **REFINAR** \| **REVERTIR** \| **NUEVA OT implementación** | Una palabra + justificación |

---

## Entregables de esta consultoría

1. **`ot/RESPUESTA_EJECUTOR.md`** — §1 resumen, §4 tabla Q1–Q7, §5 veredicto recomendado.
2. Opcional: **`control_central/OT-MOTOR-CACHE-522-CONSULTA-EVIDENCIA.json`** con `checks` por pregunta (sin PASS final de auditoría).
3. Si recomendás **NUEVA OT**: borrador de título + 3 fases máximo en §6 de RESPUESTA.

---

## Prohibido en esta consultoría

- Aplicar migraciones en Supabase sin OT de implementación
- `TRUNCATE CASCADE` en biblioteca/pilares
- Parches que dedupliquen en Streamlit lo resoluble en BD (salvo caché de lectura acotada justificada)
- Decir «listo» sin llenar `RESPUESTA_EJECUTOR.md`

---

## Referencias

- `control_central/migrations/052_precio_lista_indice_triplete.sql`
- `control_central/migrations/053_calcular_precio_lista_evento_sql.sql`
- `control_central/modules/rimec_engine/logic.py` — `build_pillar_cache`, `prefetch_materiales_para_listado`
- `control_central/docs/CONTROL_INTEGRIDAD_HOLDING.md` — P2, P7

---

## Al terminar

Avisá al Director: **«Consultoría Claude 522 lista»** (archivo en disco, no solo chat).
