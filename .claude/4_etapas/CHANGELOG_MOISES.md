# CHANGELOG MOISES — lotes post-baseline

**Baseline:** `MOISES-BASELINE-20260807` · 2026-08-07  
**Protocolo:** `5.01.00.022` · [CHUSAR_MOISES_CORTE_BASELINE_Y_LOTES_20260807.md](../1_fundamentos/1.1_protocolos/CHUSAR_MOISES_CORTE_BASELINE_Y_LOTES_20260807.md)  
**Regla:** Andrés / su Cursor **solo** aplican ítems de lotes aquí listados. Todo lo demás del baseline es **inmutable**.

---

## Baseline (congelado — no re-aplicar)

| ID | Fecha | Contenido |
|----|-------|-----------|
| `MOISES-BASELINE-20260807` | 2026-08-07 | Moria `.claude/` al corte · cierres independencia en `memoria-web/` · Protocolo Moises `5.01.00.021` · este sistema de lotes `5.01.00.022` · sync OPS→backup **OFF** |

**Empaque WhatsApp baseline:** ver `memoria-web/LOTE_MOISES_INSTRUCCIONES_WHATSAPP.md`

---

## Lote abierto (acumula hasta próximo envío)

> Cuando el Director diga “armar lote” / envíe WhatsApp, se **cierra** esta sección → pasa a “Lotes cerrados” con ID `MOISES-LOTE-YYYYMMDD`.

| # | Fecha | Qué | Índices / código | Git | DB | Estado |
|---|-------|-----|------------------|-----|-----|--------|
| 1 | 2026-08-07 | Espíritu + examen Andrés `5.01.00.023` · docs en moria_chusar = guía de actualizaciones · zip lo arma Héctor | `CHUSAR_MOISES_ESPIRITU_Y_EXAMEN…` · `EXAMEN_NIVEL_ANDRES_MOISES.md` | No | No | 🆕 |
| 2 | 2026-08-07 | Protocolo Chusar Activado completo `5.01.00.024` · pregunta trampa · producto **2.6 Respaldo activo** USD 28k–42k · cotización :3004 | `CHUSAR_PROTOCOLO_CHUSAR_ACTIVADO_COMPLETO…` · `cotizacion-productos.ts` | No | No | 🆕 |
| 3 | 2026-08-07 | **Pregunta trampa** guía no-programadores `5.01.00.025` · metodología qué/cómo/Andrés · typo intencional · arbol `2.0.3` NEW | `CHUSAR_PREGUNTA_TRAMPA_20260807.md` · índices · `CODIGO_MAESTRO` | No | No | 🆕 |

**Cómo agregar una fila (agentes Héctor con Documenta):**  
1. Alta del doc/código **en lenguaje claro** (qué / cómo / qué hace Andrés).  
2. Marca en `INDICE.md`: `🆕 MOISES post-20260807 · fecha`.  
3. Una línea en esta tabla.  
4. Sync a `moria_chusar/content/claude` cuando Héctor prepare su zip.  
5. No sync automático. No insistir en armar el zip (lo hace Héctor).

---

## Lotes cerrados (histórico enviado a Andrés)

| ID lote | Enviado | Ítems | Notas |
|---------|---------|-------|-------|
| *(ninguno aún)* | — | — | Baseline aparte del primer lote incremental |

---

## Instrucción fija al Cursor (PC Andrés)

```
Leé 5.01.00.022 + este CHANGELOG.
Aplicá SOLO el lote indicado por Héctor.
Baseline = inmutable.
Git/DB solo si el lote lo lista.
Sync OPS Héctor = PROHIBIDO.
```
