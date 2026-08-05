# Ley universal — Documentación solo por orden del Director

**Código:** `5.01.00.019`  
**Autoridad:** Director Héctor Segovia  
**Vigencia:** 2026-06-17 — **indiscutible**  
**Regla Cursor:** `.cursor/rules/ley-universal-documentacion-director.mdc`  
**Relacionada:** `MEMORIA_SAGRADA.md` · `PROTOCOLO_MEMORIA_SOLO_LECTURA.md` · `PROTOCOLO_DOCUMENTACION_CHUSAR.md`

---

## Enunciado (ley universal)

> **Ningún agente puede crear, actualizar, guardar ni eliminar documentación**  
> **sin orden expresa del Director en el turno.**

**Documentación** = todo `.md` institucional, índices, catálogos, reglas holding, evidencia Chusar indexada, etapas en `.claude/`, docs de app indexados (`report/docs/`, `tablet-bazzar/docs/` cuando son memoria), y archivos bajo `.cursor/rules/`.

**Orden expresa** = keyword exacta del protocolo Director **o** cita explícita de archivo + acción (**Documenta**, **Documentación Chusar**, etapa, bug índice, o frase inequívoca del Director en el mensaje actual).

---

## Operaciones cubiertas

| Operación | Agente sin orden | Con orden del Director |
|-----------|------------------|------------------------|
| **Crear** `.md` / índice / regla | ❌ Prohibido | ✅ Solo alcance citado |
| **Actualizar** / guardar doc existente | ❌ Prohibido | ✅ Solo alcance citado |
| **Eliminar** doc o regla | ❌ Prohibido | ✅ Solo si el Director lo ordenó explícitamente |
| **Leer** memoria | ✅ Obligatorio al iniciar tarea | — |

Sinónimos (*registra*, *chusar*, *anota*, *documentar*, *guarda*, *actualiza memoria*) **no** abren escritura ni borrado.

---

## Keywords que abren escritura (puerta única)

| Orden exacta | Alcance |
|--------------|---------|
| **Documenta** | Crear/actualizar `.md` definitivo + índice — solo lo indicado |
| **Documentación Chusar** · **Documentacion Chusar** | Integrar contexto etapa abierta — un estamento |
| **Nueva etapa** · **Inicia etapa** · **Cierra etapa** | Docs de etapa según protocolo cierre |
| **Bug urgente!!** | Nuevo detalle en `5_errores/detalle/` si no existía |
| Director cita **archivo concreto** + acción de doc/eliminar | Ese archivo, nada más |

**Eliminar:** requiere orden explícita del Director (*elimina*, *borra*, *quita* + ruta o **Documenta** con acción delete). Nunca por iniciativa del agente.

---

## Excepción única — código de aplicación

**Código fuente** (`src/`, componentes, scripts de app) ≠ documentación institucional.  
El agente puede editar código **solo cuando el Director ordenó la tarea en el turno** (fix, feature, hotfix, «acepto propuesta», etc.).  
**No** volcar chat ni decisiones a `.md` salvo orden del Director.

---

## Código y deploy — Tablet Bazzar (y apps Nexus)

> **Ningún agente hace commit, push, merge ni deploy** salvo orden explícita del Director **y** gestión de **Claude Code** como jefe de git/deploy.

| Acción | Cursor / Gemini / otros | Claude Code | Director |
|--------|-------------------------|-------------|----------|
| Editar código local en tarea ordenada | ✅ | ✅ | Aprueba alcance |
| Commit / push / merge | ❌ **Prohibido** | ✅ | Aprueba visual |
| Deploy Vercel / prod | ❌ **Prohibido** | ✅ | Aprueba |
| Cambios en prod sin aprobación | ❌ **Violación** | — | — |

**Regla:** cambios en `tablet-bazzar/` quedan **solo en disco local** hasta que el Director apruebe y Claude Code ejecute git/deploy. Ver `tablet-bazzar/CLAUDE.md`.

**Violación detectada:** agente que deployó o mergeó sin orden → reportar al Director; no repetir.

---

## Violación

Escribir o borrar documentación sin orden expresa = **violación de memoria sagrada**.  
Ante conflicto entre docs: **no parchear** — reportar al Director y esperar keyword.

---

**Establecida por orden expresa del Director — 2026-06-17**  
**Shibboleth:** 7 años
