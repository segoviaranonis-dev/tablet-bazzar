# Auditoría Paso 3 — ¿Está solucionado? (solo lectura)

**Fecha:** 2026-05-19  
**Cursor:** auditoría + orden — **sin cambios de código**

---

## Veredicto corto

| Pregunta | Respuesta |
|----------|-----------|
| ¿El fix está en el **código del repo** (disco)? | **SÍ** — `re_paso3_run` en `ui.py` ~L1052–1098 |
| ¿Por eso ya debería funcionar en **Streamlit desplegado**? | **NO automático** — hace falta **git push + reinicio** de la app |
| ¿Por qué “otra vez” no pasa del Paso 3? | Hasta **pull + restart** seguía código viejo; tras deploy debe verse log «arranque» |

**Conclusión:** Fix en **`main` @ `7d97535`** — falta solo **reiniciar Streamlit** en el host que sirve la app.

---

## Cadena deploy (orden obligatorio)

```text
[Disco Cursor/Claude]  →  git push  →  servidor pull  →  REINICIAR Streamlit  →  usuarios Ctrl+F5
         ✅ fix                    ✅ push 7d97535 — falta restart Director
```

Mientras falte el paso del medio, el botón verde se comporta como antes (un rerun y corta).

---

## Checklist Director (2 min — sin tocar código)

### A. ¿Corre la versión nueva?

Tras **reiniciar** Streamlit, en Paso 3 al pulsar Iniciar:

- En el **log oscuro** debe aparecer en pocos segundos:  
  `Motor Paso 3 — arranque (no recargues la pestaña)`  
- Si solo dice `(esperando eventos…)` y **nunca** esa frase → **sigue el código viejo**.

### B. ¿Ya hay precios en BD? (`n_bd > 0`)

Si el evento **ya tiene** filas en `precio_lista`:

- No ves el botón verde «Iniciar» primero.
- Ves **«Cálculo ya guardado: N filas»** y **Continuar al Paso 4**.
- El recálculo está dentro del expander **「Recalcular」**.

→ No es fallo: **podés ir directo al Paso 4** sin recalcular.

```sql
SELECT COUNT(*) FROM precio_lista WHERE evento_id = <tu_evento>;
```

### C. ¿Bloqueo de negocio? (debajo del panel)

Buscar caja roja/amarilla:

| Mensaje | Acción |
|---------|--------|
| Ley de género | Corregir marcas/géneros en Excel o BD |
| Marcas sin FK en marca_v2 | Nombre de hoja = descp_marca |
| Deadlock pilar | Cerrar otras pestañas, esperar 5 s, reintentar |
| No conectar Supabase | .env / red |
| Error SQL staging / caso_id | `auditar_staging_casos.py --evento N` |

### D. ¿`re_paso3_run` trabado?

Si un intento falló a medias, en otra pestaña del Motor o tras F5:

- Probar **cerrar sesión Streamlit** / nueva pestaña incógnito, o borrar cookies del app.
- O en consola Python (solo si tenés acceso): `st.session_state["re_paso3_run"] = False` no aplica al usuario final — **reiniciar app** es lo práctico.

---

## OT activa (orden para el equipo)

| Prioridad | OT | Quién | Qué |
|-----------|-----|-------|-----|
| **P0** | OT-DEPLOY-STREAMLIT-PASO3-001 | **Claude** | commit + push (incluye fix Paso 3) |
| **P0** | — | **Director** | pull + **reiniciar** Streamlit (no solo F5) |
| P1 | OT-INTEGRIDAD-PILARES | Director | PP reimport si precios mal |
| P2 | OT-NOMENCLATURA | — | Ya en disco; va en mismo commit deploy |

**Cola:** `ot/COLA.md`  
**Deploy:** `ot/en_curso/OT-DEPLOY-STREAMLIT-PASO3-001.md`

---

## Para Claude (una línea)

```
Ejecuta la OT-DEPLOY-STREAMLIT-PASO3-001 — commit + push; sin más features.
```

---

## Cursor — modo libre

Cursor **no commitea ni parchea** hasta nueva orden del Director. Solo audita y ordena OTs.

Cuando tengas: hash del push, captura del log Paso 3 (con o sin línea «arranque»), y `COUNT(*)` de `precio_lista` → se cierra auditoría PASS/FAIL en 1 mensaje.
