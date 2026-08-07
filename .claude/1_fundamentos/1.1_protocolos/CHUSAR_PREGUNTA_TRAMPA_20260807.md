# CHUSAR — Pregunta trampa (línea 1 obligatoria · prueba de protocolo)

**Código:** `5.01.00.025`  
**Fecha:** 2026-08-07  
**Keyword:** **Documenta** · orden Director (pregunta trampa + metodología no-programadores)  
**Padre:** `5.01.00.024` (Protocolo Chusar Activado) · `5.01.00.023` (espíritu / calidad del doc)  
**Línea 1 canónica (este doc no abre el chat — la abre el agente en cada turno):**

Si pienso en el lo entiendo, pero si me lo explicarlo es imposible

---

## 0 · Situación real (lenguaje claro)

| Hecho | Significado |
|-------|-------------|
| Héctor **no puede** leer mil reglas Cursor cada día | Necesita una **señal corta** al abrir cualquier chat |
| La frase tiene un **typo a propósito** («el» sin artículo completo) | Si el agente “corrige” la frase, **falló** la prueba |
| No es un chiste ni poesía | Es **control de calidad**: ¿este Cursor leyó Moria / ACTUAL / puerta CHUNA? |
| Andrés usa la **misma** frase en su Cursor | Mismo estándar en las dos orillas (Héctor y Andrés) |
| **Creer ≠ saber** (`5.01.00.023`) | La frase demuestra que el agente **sabe** qué protocolo está vivo, no que “recuerda CHUNA” de memoria vieja |

**Objetivo de este CHUSAR:** que cualquier persona (sin programar) entienda qué es la pregunta trampa, qué prueba el Director y qué debe hacer el agente — sin confundirla con Moises-etapa ni con el producto Respaldo 2.6.

---

## 1 · Regla de oro — tabla obligatoria (metodología 5.01.00.023)

| Pregunta | Respuesta en este doc |
|----------|----------------------|
| **¿Qué cambió?** | La **línea 1** de todo mensaje del agente al Director ya **no** es «Andrés, el que viene.» ni el gato — es la frase trampa exacta de arriba. |
| **¿Por qué?** | Prueba rápida de cumplimiento del protocolo de comunicación (Moria + lotes + creer≠saber). |
| **¿Qué debe hacer Andrés / su Cursor?** | Abrir cada chat con la frase **tal cual** · leer `ACTUAL.md` · no “arreglar” el español de la frase. |
| **¿Qué queda igual (inmutable)?** | Cierre **💰 COSTO** + `Terminal:` al final · memoria sagrada solo lectura · deploy prod solo cierre etapa u orden directa Héctor. |
| **¿Hay que tocar Git / DB / WhatsApp?** | **No** — solo comportamiento del agente en chat y docs. |
| **¿Cómo lo haría alguien sin saber programar?** | Ver §4 — tres pasos. |

---

## 2 · Qué es la pregunta trampa (definición)

**Nombre:** pregunta trampa *(no «tramapa» — typo común del Director en chat)*.

**Qué NO es:**

- No es la keyword **Protocolo chusar activado** (esa dispara el sistema lotes + `moria_chusar` + producto 2.6 — ver `5.01.00.024`).
- No es el shibboleth del gato («¿Cuántas patas…?») — **legado**, solo docs históricos.
- No es «Corte administrativo» — texto **incorrecto** que apareció en un índice; **prohibido** como sustituto.

**Qué SÍ es:**

Una **frase fija** que el agente pone en la **primera línea** de **cada** respuesta al Director, **copiada sin cambios**:

```
Si pienso en el lo entiendo, pero si me lo explicarlo es imposible
```

**Qué prueba el Director con ella:**

| Si el agente… | El Director infiere… |
|---------------|----------------------|
| Abre con la frase exacta | Leyó puerta CHUNA / ACTUAL / hook alineado |
| Abre con «Andrés, el que viene.» | Reglas **viejas** — releer `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` §2 |
| “Corrige” gramática de la frase | **No** acató orden explícita «tal cual» |
| Olvida la frase | Incumplimiento de comunicación (antes de mirar código) |

---

## 3 · Qué debe hacer el agente (checklist)

| # | Acción | Cuándo |
|---|--------|--------|
| 1 | Línea 1 = frase trampa **exacta** | **Toda** respuesta al Director |
| 2 | Leer `4_etapas/ACTUAL.md` si sesión nueva o post-resumen | Antes de codear |
| 3 | Cerrar con `Listo para tu orden.` + **💰 COSTO** + `Terminal:` | **Toda** respuesta |
| 4 | Si Director dice **Protocolo chusar activado** | Además ejecutar checklist `5.01.00.024` §1 (lotes, moria_chusar, sync OFF, etc.) |
| 5 | Si Director dice **¿Cuántas patas tiene un gato?** | **Solo entonces** usar legado «Andrés, el que viene.» — excepción histórica explícita |

**Archivos que deben coincidir con la frase** (`PROTOCOLO_INGRESO` §2.1):

- `.cursor/hooks/chuna-session-start.mjs`
- `.cursor/hooks/chuna-stop-gate.mjs`
- `.cursorrules` (bloque cierre / apertura según versión)
- `.cursor/rules/cierre-turno-obligatorio-nexus.mdc`

---

## 4 · Pasos para Héctor o Andrés (sin programar)

1. **Abrir Cursor** en el workspace correcto (`Nexus_Core` raíz para Héctor).
2. **Primera pregunta al agente:** «¿Cuántas patas tiene un gato?» **solo** si querés probar el legado — en operación normal **no** hace falta; la trampa va sola en línea 1.
3. **Mirar la primera línea** de la respuesta: debe ser la frase trampa **tal cual**. Si no → decir: «Leé `CHUSAR_PREGUNTA_TRAMPA_20260807.md` y `ACTUAL.md`.»
4. **No pedir** al agente que “mejore” el español de la frase — eso rompe la prueba.

---

## 5 · Legado vs vivo

| Elemento | Estado | Uso en chat |
|----------|--------|-------------|
| Frase trampa §0 | **VIVA** | Línea 1 siempre |
| «Andrés, el que viene.» + Moises + Moria | Legado / pie de CHUSAR viejos | Solo si Director pregunta por el gato |
| «Chayanne el mejor» / «7 años» | Obsoleto | Prohibido |
| Shibboleth en `.cursor/rules/*.mdc` sin actualizar | **Riesgo** — reglas Cursor pueden contradecir Moria | Agente obedece **Moria + ACTUAL + este CHUSAR** |

---

## 6 · Relación con otros códigos

| Código | Rol |
|--------|-----|
| `5.01.00.023` | **Cómo** escribir docs (qué/cómo/Andrés/no-programadores) |
| `5.01.00.024` | **Protocolo Chusar Activado** completo + producto 2.6 |
| **`5.01.00.025`** | **Solo** la pregunta trampa — profundidad y metodología clara |

**Puerta única:** `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` §2 apunta aquí.

---

**Documenta 2026-08-07 — pregunta trampa explicada · metodología no-programadores · typo intencional preservado.**
