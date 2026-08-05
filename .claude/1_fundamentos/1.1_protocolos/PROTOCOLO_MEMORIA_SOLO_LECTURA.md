# Protocolo memoria holding — SOLO LECTURA

**Código:** `5.01.00.017`  
**Ley suprema:** [`MEMORIA_SAGRADA.md`](./MEMORIA_SAGRADA.md) (`5.01.00.018`) — **indiscutible**  
**Autoridad:** Director Héctor Segovia · **2026-06-16**  
**Regla Cursor:** `.cursor/rules/memoria-solo-lectura-nexus.mdc`

---

## Memoria sagrada (Director)

> **La memoria es sagrada. Siempre. Siempre. Indiscutible.**

Detalle canónico: **`MEMORIA_SAGRADA.md`**. Este protocolo es el **portón operativo**; no contradice la ley sagrada.

---

## Ley (Director)

> **Primaria y secundaria = solo lectura para agentes.**  
> **Nadie escribe** en memoria holding **sin consentimiento explícito** del Director.  
> **Solo el Director** decide qué es **desarrollo** (borrador, chat, código) y qué es **definitivo** (memoria en disco).

Los agentes **leen** Moria e índices. **No** «corrigen», «actualizan» ni «unifican» memoria por iniciativa propia.

---

## Qué es primaria vs secundaria

| Capa | Ruta | Agente |
|------|------|--------|
| **Primaria** | `MORIA_PRIMARIA.md` | **Solo leer** títulos y rutas |
| **Secundaria** | Resto `.claude/**` | **Solo leer** la ruta que indique la tarea o el Director |
| **Reglas holding** | `.cursor/rules/*.mdc`, `.cursorrules` | **Solo leer** — no editar salvo **Documenta** |
| **Catálogo** | `CODIGO_MAESTRO.md` | **Solo leer** — no regenerar salvo **Documenta** |

Doc operativa de app (`report/docs/`, `tablet-bazzar/docs/` indexados): **misma regla sagrada** salvo orden del Director.

---

## Portón de escritura (obligatorio — 4 pasos)

**Antes de cualquier `Write` / `StrReplace` en rutas protegidas:**

| Paso | Pregunta | Si falla |
|------|----------|----------|
| **1** | ¿El mensaje del Director contiene keyword **exacta**? (ver tabla abajo) | **Abortar** — no escribir |
| **2** | ¿Solo hay sinónimo? (*registra*, *chusar*, *anota*, *documentar*) | **Abortar** — pedir keyword + archivos |
| **3** | ¿Alcance acotado a lo ordenado o estamento Chusar? | **Abortar** — proponer lista en chat |
| **4** | ¿Es «fix» de contradicción en memoria? | **Abortar** — avisar conflicto al Director |

**Sin pasar los 4 pasos → violación de memoria sagrada.**

---

## Cuándo SÍ puede escribir un agente

Solo si el Director **lo ordenó en el turno** con **keyword exacta**:

| Orden exacta | Alcance |
|--------------|---------|
| **Documenta** | Crear/actualizar `.md` **definitivo** + índice/catálogo — **solo** lo que el Director indicó |
| **Documentación Chusar** · **Documentacion Chusar** | Integrar contexto de etapa abierta — **un** estamento; **no** inventar protocolos |
| **Nueva etapa** / **Inicia etapa** / **Cierra etapa** | Docs de etapa según 1.1.10 |
| **Bug urgente!!** | Solo **nuevo** detalle en `5_errores/detalle/` si no existía en índice |
| Cita **archivo concreto** + **Documenta** | Ese archivo, nada más |

**No abren memoria:** «registra en chusar», «actualiza la memoria», «corrige el protocolo», «unifica docs», «deja documentado».

---

## Desarrollo vs definitivo

| Estado | Dónde vive | Quién escribe |
|--------|------------|-------------|
| **Desarrollo** | Chat, código, terminal, evidencia local | Agente — **no** volcar a `.claude/` |
| **Definitivo** | `.claude/`, índices, reglas holding | **Solo** con orden del Director |

El agente **no** declara nada definitivo. El Director dice cuándo pasa de desarrollo a memoria.

---

## Prohibido (sin excepción — indiscutible)

- Tocar primaria o secundaria «porque encontré contradictorio»
- Crear `*_INCIDENTE_*`, `*_POINTER_*`, «leyes supremas» o parches memoria
- Usar `CONTEXTO_PPT.md` para reescribir Moria — **histórico revocado** en shibboleth
- Editar memoria desde workspace incorrecto (sub-repo solo, cloud, `empty-window`)
- «Corregir» shibboleth, Chusar o protocolos sin **Documenta**
- Escribir en **6+ archivos** con una sola orden Chusar sin alcance explícito

---

## Ante conflicto o duda

1. **No editar memoria**
2. Decir al Director qué doc contradice qué
3. Esperar orden (**Documenta**, archivo citado, etc.)

---

## Shibboleth canónico

«¿Cuántas patas tiene un gato?» → **Chayanne el mejor** — `PROTOCOLO_INGRESO_AGENTE_CHUNA.md`  
Ignorar: tres patas (`CONTEXTO_PPT`), 13, 4, 5.

---

## Workspace

Verdad memoria holding: `C:\Users\hecto\Nexus_Core` (raíz). Sub-repos **no** autorizan escribir `.claude/`.

---

**Shibboleth:** 7 años · **Memoria sagrada · Solo lectura · Definitivo = solo Director**
