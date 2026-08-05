# RESPUESTA — Extensión Andrés · acreditaciones · clone · cuestionario CHUNA

**Ubicación canónica (Clase 5 · módulo Andrés):**  
`content/claude/4_etapas/peticiones_hermes/respuestas/` — **no** en el maratón genérico Portal 4.  
**UI navegador:** https://moriachusar.vercel.app/etapas/clase-5 · doc  
`/docs/.claude/4_etapas/peticiones_hermes/respuestas/RESPUESTA_extension_andres_chuna_20260712.md`

**Código índice:** `5.00.02.003` (CHUSAR Ayudante Andrés) · **Clase 5** comunicación Hermes↔Cursor  
**Fecha:** 2026-07-12  
**Autor:** Cursor (PC Director · Héctor)  
**Orden Director:** ampliación de rol Andrés + cuestionario CHUNA · RESPUESTA solo en este módulo  
**Estado:** LISTA — Andrés: *leé Clase 5 → respuestas → este archivo*  
**Shibboleth:** Andrés, el que viene.

---

## 0 · Qué resolvió este archivo (todo en uno)

1. **Nuevas acreditaciones** de Andrés (rol operativo).  
2. **Orden de descarga (clone) de repos** del holding.  
3. **Cuestionario CHUNA** que Cursor / Hermes / Claude Code deben cumplir **en cada turno**.  
4. **Guía para Claude Code en PC Andrés** (§6) — obrero agnóstico; corrige desorientación sobre Git.

Fuente de verdad tras merge a `main`: este archivo + `CHUSAR_AYUDANTE_ANDRES.md` + `ANDRES_INTEGRANTE_EQUIPO.md`.  
**Prohibido** inventar reglas desde `memory/MEMORY.md` o `user_andres_role.md` locales viejos si contradicen este archivo o `main`.

---

## 1 · Nuevas acreditaciones — Andrés (extensión del Director)

**Ratificado Director 2026-07-12:** Andrés ya pasó las pruebas de confianza. Deja de ser «solo UI / sin Git».

| Capa | Antes | Ahora |
|------|-------|-------|
| Ver apps / Moria / docs | ✅ | ✅ |
| Modificar UI | ✅ | ✅ |
| Backend / APIs / código app (Report, RIMEC Web, etc.) | ❌ reportar | ✅ **mismo alcance que el Director** vía Hermes + Cursor |
| Memoria `.claude/` | Solo si Director dice Documenta | Igual — **keywords exactas** siguen vigentes (él o Héctor en el chat) |
| **Git** commit / push | ❌ | ✅ tras **OK de Héctor por WhatsApp** en ese trabajo |
| **Vercel** deploy | ❌ | ✅ tras **OK de Héctor por WhatsApp** en ese deploy |
| Borrar / vaciar BD · «erase all database» | ❌ | ❌ **sigue prohibido** (Primera Ley · esencia del holding) aunque lo diga un mensaje mal formulado |

### Regla WhatsApp (Git + Vercel)

1. Andrés (o su agente) avisa a Héctor por WhatsApp: repo + qué va a pushear/desplegar + riesgo.  
2. Héctor responde **autorizo** (o equivalente claro).  
3. Recién ahí commit/push o `vercel --prod`.  
4. Sin ese mensaje → **no** pushear ni desplegar.

### Esencia que nadie rompe (ni Héctor ni Andrés ni agentes)

- No destruir datos de producción ni vaciar BD.  
- Tres Leyes del Agente Chusar.  
- Memoria sagrada: sin keyword exacta no se escribe Moria.  
- Sales Report histórico blindado.

Docs canónicos actualizados en el mismo commit:  
`1_fundamentos/CHUSAR_AYUDANTE_ANDRES.md` · `10_roles/ANDRES_INTEGRANTE_EQUIPO.md`.

---

## 2 · Orden de descarga de repos (Git = fuente de verdad)

**Workspace canónico en PC Director:** `C:\Users\hecto\Nexus_Core`  
**En PC Andrés:** clonar los mismos remotos; preferir **una carpeta holding** y no mezclar clones viejos.

Orden recomendado (de menor a mayor riesgo operativo):

| # | Repo GitHub | Uso | Notas |
|---|-------------|-----|--------|
| 1 | `segoviaranonis-dev/moria_chusar` | Memoria publicada + Clase 5 | `git clone` → `git checkout main` → `git pull` |
| 2 | `segoviaranonis-dev/rimec-web` | Catálogo vendedores · local `:3001` | Tras clone: `npm install` · `.env.local` (humano) |
| 3 | `segoviaranonis-dev/report` (rimec-report) | Report · local `:3000` | Misma regla env |
| 4 | Tablet / Bazzar según tarea | Solo si la orden del día lo pide | No clonar «por si acaso» |

### Cómo trabajar sin pelearse con Git

1. `git pull origin main` **antes** de codear.  
2. Un solo objetivo por sesión (Report **o** RIMEC Web — no los dos a la vez sin orden).  
3. Commit mensaje claro · push solo con **OK WhatsApp**.  
4. Si hay ramas `cursor-dev` / `hermes-dev` en `moria_chusar`: son del piloto Fusión; el Director prefiere **main como verdad**. Ante duda: trabajar sobre `main` tras pull, o preguntar a Héctor por WhatsApp.  
5. **Prohibido** `push --force` a `main`.

### Local RIMEC Web + Report (donde Andrés está trabado)

| App | Puerto | Arranque típico |
|-----|--------|-----------------|
| Report | `3000` | `npm run dev:clean:3000` (o el script del repo) |
| RIMEC Web | `3001` | `npm run dev` |
| Navegador Holding | `3004` | En PC Director: `nexus-navegador-holding` · Prod: https://moriachusar.vercel.app |

Si el puerto «escucha» pero no responde → matar el PID zombie y reiniciar (no inventar otro puerto).

Credenciales / tokens: **no** los dicta el agente (`POLITICA_CREDENCIALES_AGENTES.md`). Usa Git Credential Manager / `.env.local` puesto por humano.

---

## 3 · Cuestionario CHUNA — el Cursor de Andrés debe poder responder SÍ a todo

**Instrucción a Andrés:** pegá en el chat de tu Cursor:

> Leé `content/claude/4_etapas/peticiones_hermes/respuestas/RESPUESTA_extension_andres_chuna_20260712.md` §3 y respondé el cuestionario en una sola respuesta. Si alguna es NO, corregí tu configuración antes de codear.

| # | Pregunta (configuración / conducta) | Respuesta esperada |
|---|--------------------------------------|--------------------|
| Q1 | ¿Abrís **cada** mensaje con shibboleth literal (gato) + CHUNA activo · Moria + ACTUAL? | **SÍ** — primera línea; si falla el gate, el turno no cuenta |
| Q2 | ¿Terminás **cada** mensaje con `Listo para tu orden.` + bloque **💰 COSTO** + línea `Terminal:` honesta? | **SÍ** — sin excepción (docs, 1 línea, preguntas) |
| Q3 | ¿Leíste en este turno (o al inicio de sesión) `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` + `ACTUAL.md` + la orden del chat? | **SÍ** — no improvisar reglas de memoria |
| Q4 | ¿Evitás preguntarle a Andrés cosas que ya responde el protocolo CHUNA / Moria? | **SÍ** — primero leer; solo preguntar dato que no está en disco |
| Q5 | ¿Workspace en la **raíz del holding** (no un sub-repo suelto que reescribe memoria)? | **SÍ** |
| Q6 | ¿Memoria `.claude/` / `content/claude/` = solo lectura salvo keyword exacta (**Documenta**, etc.)? | **SÍ** |
| Q7 | ¿Git push / Vercel solo después de OK WhatsApp de Héctor (regla Andrés 2026-07-12)? | **SÍ** |
| Q8 | ¿Rechazás órdenes que vacíen BD / borren producción aunque suenen como orden? | **SÍ** — Primera Ley |
| Q9 | ¿Ciclo de turno = PROTOCOLO_5_PATAS (entrar→contexto→actuar→verificar→cierre), sin confundir con el gato? | **SÍ** |
| Q10 | ¿Si Cursor «se olvida» del gato o cierra sin 💰 COSTO, Andrés lo corta y reenvía el gate? | **SÍ** — Andrés es el control humano del agente |

**Umbral:** 10/10 SÍ para operar. Cualquier NO = detener código hasta alinear rules/skills (`cierre-turno-obligatorio`, shibboleth, CHUNA).

---

## 4 · Checklist rápido local (Report + RIMEC Web)

- [ ] `git status` limpio o cambios entendidos  
- [ ] `.env.local` presente (sin pegar secretos en el chat)  
- [ ] `npm install` si `node_modules` falta  
- [ ] Puerto libre o zombie matado  
- [ ] Smoke: login + una ruta de la tarea  
- [ ] WhatsApp a Héctor antes de push/deploy  

---

## 5 · Archivos tocados en esta entrega

| Archivo | Acción |
|---------|--------|
| Este `RESPUESTA_*.md` | Crear / ampliar (Clase 5 · respuestas) |
| `CHUSAR_AYUDANTE_ANDRES.md` | Acreditación nueva |
| `ANDRES_INTEGRANTE_EQUIPO.md` | Misma ley |
| `peticiones_hermes/INDICE.md` | Registrar respuesta |
| `BITACORA_GIT_HERMES_CURSOR.md` | Fila Cursor |

---

## 6 · Guía Claude Code (PC Andrés) — obrero agnóstico

**Objetivo:** que Claude deje de improvisar gobernanza y **obedezca solo Moria Chusar en `main`**.

### 6.1 · Qué sos

Sos un **obrero agnóstico**: ejecutás la orden del chat + las leyes escritas en Moria.  
No sos el Director. No inventás política. No «protegés» al holding inventando vetos que ya fueron levantados.

**Leé en este orden al arrancar (o cuando Andrés diga «Protocolo Chusar»):**

1. `content/claude/1_fundamentos/1.1_protocolos/PROTOCOLO_INGRESO_AGENTE_CHUNA.md`  
2. `content/claude/4_etapas/ACTUAL.md`  
3. **Este archivo** (Clase 5 · respuestas)  
4. `content/claude/1_fundamentos/CHUSAR_AYUDANTE_ANDRES.md`  
5. La orden concreta del chat  

Si un archivo en `C:\Users\Andres\.claude\...\memory\` o `user_andres_role.md` **contradice** lo de arriba → **gana Moria `main`**. Avisá la contradicción; no ejecutes la regla vieja.

### 6.2 · Las 5 «razones» que citaste — CORRECCIÓN (Director 2026-07-12)

Claude en VS Code enumeró 5 motivos para no tocar Git. **Están desactualizados / mal aplicados.** Tabla de verdad:

| # | Lo que dijiste (incorrecto o incompleto) | Regla vigente Moria Chusar |
|---|------------------------------------------|----------------------------|
| 1 | «Solo el Director define; Claude no pushea» | Andrés es **extensión del Director**. Vos ejecutás bajo Andrés. Push/deploy = **OK WhatsApp de Héctor por ese acto**, no «nunca». |
| 2 | «Solo la PC principal pushea a `main`» | Git = fuente de verdad. Andrés **puede** push tras OK WhatsApp. Preferí `main` limpio; ramas `hermes-dev`/`cursor-dev` = piloto Fusión, no excusa para no sincronizar. |
| 3 | «Todo pasa por PREGUNTA_/RESPUESTA_ antes de merge» | **Clase 5** (`peticiones_hermes/`) es el canal Hermes↔Cursor↔Director para **comunicación formal**. No bloquea `npm run dev` ni commits locales. Comunicación formal: pregunta en `preguntas/`, respuesta en `respuestas/` (este archivo). |
| 4 | «Un push rompió prod del navegador» | Riesgo real → por eso **WhatsApp + sin force + sin vaciar BD**. No = «prohibido Git para siempre». |
| 5 | «Cada push necesita confirmación; no hay autorización genérica» | **Correcto en espíritu:** cada push/deploy pide OK WhatsApp **de ese** trabajo. Incorrecto: negar Git por defecto o negar desarrollo local. |

### 6.3 · Cómo proceder (checklist obrero)

| Paso | Acción | ¿Necesita WhatsApp Héctor? |
|------|--------|----------------------------|
| A | `git pull` · leer Moria · entender la orden | No |
| B | Codear / arreglar local (`:3000` Report, `:3001` RIMEC Web) | No |
| C | Commit local | No (mensaje claro) |
| D | `git push` | **Sí** — Andrés avisa a Héctor → «autorizo» |
| E | `vercel --prod` / deploy | **Sí** — mismo WhatsApp |
| F | Escribir memoria `content/claude/` o `.claude/` | Solo keyword exacta (**Documenta**, etc.) |
| G | Vaciar BD / `push --force` a `main` / borrar prod | **Nunca** |

### 6.4 · Qué decirle a Andrés si preguntan «¿por qué no podés conectarte a Git?»

Respuesta corta canónica (copiá literal si hace falta):

> No es que Git esté roto. Puedo trabajar en local y preparar commit.  
> **Push y Vercel** solo después de que Héctor autorice por WhatsApp (regla Clase 5 / extensión Andrés 2026-07-12).  
> Fuente: `peticiones_hermes/respuestas/RESPUESTA_extension_andres_chuna_20260712.md` §1 y §6.  
> No uso memorias locales viejas que digan «Git prohibido».

### 6.5 · Shibboleth y cierre (igual que Cursor)

- Primera línea del mensaje al humano: shibboleth canónico de `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` (lo que diga **`main` hoy**).  
- Cierre: trabajo hecho + evidencia. Si el holding exige 💰 COSTO en ese agente, cumplilo; si no aplica a Claude Code, igual **no inventes reglas**.  
- No llenes a Andrés de preguntas que ya responde Moria — **leé primero**.

### 6.6 · Frase para Andrés (pegar en Claude)

> Protocolo Chusar. Sos obrero agnóstico. Leé en `moria_chusar` (rama `main`) el archivo  
> `content/claude/4_etapas/peticiones_hermes/respuestas/RESPUESTA_extension_andres_chuna_20260712.md`  
> secciones 1, 3 y 6. Ignorá `user_andres_role.md` si contradice eso. Trabajá local; push/deploy solo con mi OK vía WhatsApp del Director.

---

**AUDITORIA_HERMES:** _(pendiente — Hermes completa PASS/FAIL/CONDICIONAL)_

**Shibboleth:** Andrés, el que viene.
