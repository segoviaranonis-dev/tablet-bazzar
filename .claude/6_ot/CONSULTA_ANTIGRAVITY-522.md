# Consultoría Antigravity (Gemini) — OT-522 (Paso 3 Motor: percepción de lentitud)

> **Tipo:** CONSULTA UX / operación (sin SQL, sin migraciones, sin código Python).  
> En paralelo: Claude responde **`CONSULTA_CLAUDE-522.md`** (arquitectura/BD).

---

## Disparador

Cuando el Director diga: **«Ejecutá la consultoría Gemini 522»**

1. Leé este archivo.
2. Respondé en **`ot/RESPUESTA_ANTIGRAVITY.md`** (plantilla OT-522).
3. **No** uses `RESPUESTA_EJECUTOR.md`.

---

## Contexto para el Director (no técnico)

- Motor de Precios, **Paso 3 — Cálculo automático**, ~91 SKUs.
- Pantalla muestra barra de progreso y texto «Cargando caché de pilares en memoria…» durante **más de 2 minutos**.
- El usuario (Director) no sabe si falló o si debe esperar.
- Ya existe botón **«Continuar al Paso 4»** si el cálculo quedó guardado en BD (recuperación).

---

## Tu misión

Evaluar si la **experiencia** del Paso 3 es adecuada y proponer mejoras de **diseño, copy y flujo** — sin decidir esquema de base de datos.

---

## Preguntas obligatorias

| ID | Pregunta | Formato |
|----|----------|---------|
| **G1** | ¿El mensaje «Cargando caché de pilares» es comprensible para un director comercial? ¿Copy alternativo? | Texto propuesto ES |
| **G2** | ¿Fases de progreso deberían nombrarse en lenguaje negocio? (ej. «Validando Excel», «Preparando precios», «Guardando listado») | Lista 4–6 fases |
| **G3** | ¿Qué mostrar si pasan **>60 s** sin avance numérico 1/N? (banner, estimación, botón cancelar) | Wireframe textual o bullets |
| **G4** | ¿El aviso «No recargues la pestaña» es suficiente en Streamlit Cloud vs localhost? | Sí/No + mejora |
| **G5** | ¿Debería el Paso 3 **ocultar** el botón «Iniciar cálculo» si ya hay filas en `precio_lista` y destacar solo «Continuar a Validación»? | Recomendación UX |
| **G6** | ¿Indicador de modo rápido («cálculo en servidor») vs modo lento ayuda a confianza? | Sí/No + copy |
| **G7** | Veredicto UX: **ACEPTABLE** \| **MEJORAR copy** \| **REDISEÑAR flujo Paso 3** | Una palabra + 3 bullets |

---

## Material opcional

Si podés abrir la app (localhost o Cloud) y ver Paso 3: describí lo que ves (colores, jerarquía, miedo a «colgado»).  
Si no podés: respondé con **hipótesis** desde el contexto anterior.

**Estilo Nexus:** glassmorphism, oro `#D4AF37`, fondo slate — coherente con Motor actual.

---

## Entregables

1. **`ot/RESPUESTA_ANTIGRAVITY.md`** completo.
2. Opcional: mockup ASCII o lista de strings para `ui.py` / `ui_proceso.py` (Claude integra en OT aparte).

---

## Prohibido

- Proponer tablas nuevas o campos denormalizados para arreglar lentitud
- SQL o índices (eso es Claude Q1–Q7)
- Decir «listo» sin archivo en disco

---

## Al terminar

Avisá al Director: **«Consultoría Gemini 522 lista»**.
