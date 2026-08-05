# CHUSAR — Ecosistema · Puerta única · Cinco capas · Codificación

**Código:** `5.00.01.001` · **Ratificado:** Director · 2026-07-07  
**Audiencia:** Todo agente IA · Andrés · cualquier recluta  
**Shibboleth:** Andrés, el que viene.

> **Una sola puerta de entrada:** [`1.1_protocolos/PROTOCOLO_INGRESO_AGENTE_CHUNA.md`](./1.1_protocolos/PROTOCOLO_INGRESO_AGENTE_CHUNA.md) (`5.01.00.001`).  
> **Este doc** explica **qué es Chusar**, **qué es Moria**, **cómo se unen**, **cómo se codifica** y **cómo se interconectan las cinco capas de memoria**.

---

## 1 · Tres nombres — no confundir

| Nombre | Qué es | Dónde vive |
|--------|--------|------------|
| **Chusar** | Nombre **legado** de la metodología (pre-2026-08-04) | Docs `CHUSAR_*` · archivo histórico |
| **Protocolo Moises** | **Metodología viva** del holding (mismo contenido que Chusar) | `5.01.00.021` · etapa Moises · keywords Moises |
| **Moria** | **Documentación canónica en disco** — verdad operativa, leyes, módulos, errores, etapas | `.claude/` en `Nexus_Core` |
| **Moria Chusar** | Unión publicada legado | Web + navegador (ver §3) |
| **moria-moises** | Unión publicada en orilla cerrada (PC aislada) | Se crea en mudanza Moises |

**Regla:** **Protocolo Moises Activado** = cómo se gobierna la memoria (antes: Chusar). Moria = qué está escrito. moria-moises = cómo se expone en la orilla nueva.

---

## 2 · Puerta única — orden de lectura agente

```
┌─────────────────────────────────────────────────────────────┐
│  PASO 0 · Shibboleth → Andrés, el que viene. Protocolo Moises Activado │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 1 · PROTOCOLO_INGRESO_AGENTE_CHUNA.md (5.01.00.001)   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 2 · MORIA_PRIMARIA.md — solo títulos + Leyes §0       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 3 · 4_etapas/ACTUAL.md — etapa viva ahora             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 4 · Secundaria UNA ruta — INDICE del módulo en tarea  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 5 · Ciclo turno → PROTOCOLO_5_PATAS.md (5 fases)      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 6 · Cierre 💰 COSTO + Terminal: (Ley 0.13)          │
└─────────────────────────────────────────────────────────────┘
```

**Prohibido:** otra puerta · leer Moria entera · escribir `.claude/` sin keyword exacta.

---

## 3 · Cinco capas de memoria — interconexión

Son **cinco herramientas/capas** que forman un **solo organismo**. Deben estar **sincronizadas** cuando el Director ordena **Documentación Chusar**.

| # | Capa | Rol | Ruta / URL | Quién escribe |
|---|------|-----|------------|---------------|
| **1** | **Primaria** | Índice títulos + leyes §0 — ahorro tokens | `.claude/MORIA_PRIMARIA.md` | Director vía **Documenta** |
| **2** | **Secundaria Moria** | Verdad completa — CHUSAR, leyes, módulos, errores | `.claude/**` | Director vía keyword exacta |
| **3** | **Catálogo contable** | Plan de cuentas `C.LL.SS.NNN` — saber qué hace cada doc | `CODIGO_MAESTRO.md` · `PLAN_CODIFICACION.md` | Regenerar script tras lote |
| **4** | **Trabajo vivo** | Etapa abierta · qué se está haciendo **ahora** | `4_etapas/ACTUAL.md` + `nexus-navegador-holding/config/etapas.json` | **Nueva etapa** / **Cierra etapa** |
| **5** | **Exposición Moria Chusar** | Cualquier IA entiende políticas y decisiones **en web** | Ver tabla abajo | Sync con Documentación Chusar |

### Capa 5 — dos caras publicadas (hermanas)

| Cara | Repo / app | Dev | Prod | Función |
|------|------------|-----|------|---------|
| **A · Docs espejo** | `moria_chusar/` | `:3010` | https://moriachusar.vercel.app | Markdown espejo `content/claude/` — lectura pura |
| **B · Navegador programa** | `nexus-navegador-holding/` | `:3004` | Vercel proyecto Moria_chusar | Portal **Módulos** (2) + **Etapas** (4) + árbol `1.1.1.1` + badge NEW |

**Interconexión obligatoria:**

```
Moria (.claude/)  ──Documentación Chusar──►  etapas.json + arbol-modulos.json
       │                                              │
       └──────────────── sync ────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     moria_chusar/content/claude/     nexus-navegador :3004
     (docs publicados)                (etapas + módulos + NEW)
```

**Legacy:** `memoria-web/` HTML — gemelo antiguo · no perpetuar · ver `CHUSAR_MEMORIA_WEB.md`.

Doc navegador: [`CHUSAR_NAVEGADOR_PROGRAMA.md`](./CHUSAR_NAVEGADOR_PROGRAMA.md) · doc espejo: [`CHUSAR_MEMORIA_WEB.md`](./CHUSAR_MEMORIA_WEB.md)

---

## 4 · Codificación `C.LL.SS.NNN` — plan de cuentas contable

**Formato:** `Clase · Grupo · Subgrupo · Secuencial` — como asientos contables: **hasta el último componente** si hace falta.

```
C . LL . SS . NNN
│   │    │    └── Documento #001–999 en ese subgrupo
│   │    └─────── Submódulo / tema (01–99)
│   └──────────── Producto / área (01–99)
└──────────────── Clase estamento Moria (0–9)
```

### Clases (nivel 1)

| Clase | Estamento | Carpeta |
|-------|-----------|---------|
| **0** | Meta Moria | Raíz `.claude/` meta |
| **1** | Director · roles | `10_roles/` |
| **2** | Proyectos / apps | `2_modulos/2.x_*` |
| **3** | Manual funciones | `3_manual_funciones/` |
| **4** | Errores | `5_errores/` |
| **5** | Leyes · protocolos | `1_fundamentos/` |
| **6** | Etapas | `4_etapas/` |
| **7** | Arquitectura | `3_arquitectura/` |
| **8** | OT | `6_ot/` |
| **9** | Auditorías | `7_auditorias/` |

### Profundidad `1.1.1.1` — ejemplo real

La numeración **no se detiene** en producto. Cada pantalla, API o componente puede tener subcuenta:

| Código | Qué es |
|--------|--------|
| `2.3` | Report (producto) |
| `2.3.1` | Grupo RIMEC importadora |
| `2.3.1.7` | Proceso importación |
| `2.3.1.7.1` | Motor de precios |
| `2.3.1.7.1.1` | Biblioteca histórico |
| `2.3.1.7.1.1.1` | Clon casos bib→bib |
| `2.3.1.7.2.2` | Preview asignar línea→caso |

**Regla agente:** antes de codear un módulo → buscar su código en `INDICE.md` del módulo · si no existe → **no inventar** — pedir al Director.

Doc motor+estrategias: [`2_modulos/2.3_report/motor_precios/CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md`](../2_modulos/2.3_report/motor_precios/CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md)

Plan completo: [`PLAN_CODIFICACION.md`](../PLAN_CODIFICACION.md) · catálogo: [`CODIGO_MAESTRO.md`](../CODIGO_MAESTRO.md)

---

## 5 · Palabras clave del Director — puerta de escritura

**Sin keyword exacta en el turno → cero escritura en memoria.**

| # | Keyword | Acción |
|---|---------|--------|
| 1 | **Bug urgente!!** · bug urgente · hotfix urgente | PARÉNTESIS · preguntar app+módulo+síntoma · luego errores |
| 2 | **Inicia etapa** · **Nueva etapa** | `ETAPA_*.md` + `ACTUAL.md` |
| 3 | **Cierra etapa** · **CERRAR ETAPA** | Cierre Moria + **`etapas.json`** mismo turno |
| 4 | **Pilares** | Leyes FK · nomenclatura P0 |
| 5 | ¿Cuántas patas tiene un gato? | **Andrés, el que viene.** + 💰 COSTO |
| 6 | ¿Cómo estará la barranca? | que el sapo la sube al trote |
| 7 | **Documenta** | `.md` + índice + código catálogo |
| 8 | **Documentación Chusar** | Integrar etapa + sync capas 4 y 5 |
| 9 | Verifica el índice… | Solo **leer** secundaria |
| 10 | **Memoria sagrada** / solo lectura | Prohibido Write en `.claude/` |

Tabla extendida: [`PALABRAS_CLAVE_DIRECTOR.md`](./1.1_protocolos/PALABRAS_CLAVE_DIRECTOR.md)

---

## 6 · Protocolo 5 Patas — ciclo de **turno** (≠ gato)

**No confundir** con el shibboleth. Las 5 patas = **fases internas de cada respuesta**:

| Pata | Fase | Obligatorio |
|------|------|-------------|
| **1** | INICIO — Moria títulos + ACTUAL | Sí |
| **2** | CONTEXTO — terminal/logs antes de preguntar | Sí |
| **3** | ALINEACIÓN — keywords · leyes · matriz roles | Sí |
| **4** | EJECUCIÓN — resolver en Cursor, no delegar | Sí |
| **5** | CIERRE — 💰 COSTO + `Terminal:` honesto | Sí |
| **5b** | CHUSAR integrado — si hubo Documentación Chusar | Sí |

Doc: [`PROTOCOLO_5_PATAS.md`](./1.1_protocolos/PROTOCOLO_5_PATAS.md)

---

## 7 · Tres Leyes del Agente Chusar

Todo modelo, todo turno — [`LEYES_TRES_AGENTE_CHUSAR.md`](./1.2_leyes/LEYES_TRES_AGENTE_CHUSAR.md):

1. **Primera** — No daño a Chusar · mejores prácticas · no inacción.
2. **Segunda** — Obedecer al Director salvo Primera.
3. **Tercera** — Proteger contexto salvo Primera/Segunda.

---

## 8 · Equipo IA + repos producto — quién hace qué

| Actor | Rol | Git / deploy | Memoria |
|-------|-----|--------------|---------|
| **Director** | Decisiones · keywords · definitivo | Aprueba commit/push | Dueño Moria |
| **Cursor** | Ejecutor masivo · terminal · UI | **No** commit/push | Lee · escribe solo con keyword |
| **Claude Code** | Arquitecto · BD · migraciones · git | Commit + Vercel con OK visual | Lee · Documenta con orden |
| **Gemini / Antigravity** | Diseño UI puntual | Según OT | Lee |
| **Andrés** | Primer ayudante · UI · aprendizaje | **No** git/backend | Lee Moria Chusar :3004 |

Apps producto (código, no memoria): `control_central/` · `report/` · `rimec-web/` · `bazzar-web/` · `tablet-bazzar/` — ver [`CHUSAR_ESTRUCTURA_HOLDING.md`](./CHUSAR_ESTRUCTURA_HOLDING.md)

---

## 9 · Checklist Documentación Chusar — sync cinco capas

Cuando el Director dice **Documentación Chusar**:

| # | Capa | Acción |
|---|------|--------|
| 1 | Secundaria | Integrar decisión en `.md` correcto + índice módulo |
| 2 | ACTUAL | Actualizar si etapa viva |
| 3 | CODIGO_MAESTRO | Registrar código si doc nuevo |
| 4 | `etapas.json` | Si tocó etapa · `estado` / cerradas |
| 5 | `arbol-modulos.json` | `"nuevo": true` · smoke :3004 |
| 6 | moria_chusar | Push espejo si aplica (Claude Code / Director) |
| 7 | Cierre | Bloque **CHUSAR — integrado** + 💰 COSTO |

Doc paso a paso: [`PROTOCOLO_DOCUMENTACION_CHUSAR.md`](./1.1_protocolos/PROTOCOLO_DOCUMENTACION_CHUSAR.md)

---

## 10 · Mapa rápido — «¿dónde busco?»

| Necesidad | Ruta |
|-----------|------|
| Entrar al holding | `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` |
| Qué etapa está abierta | `4_etapas/ACTUAL.md` · http://localhost:3004/etapas |
| Código de un módulo | `2_modulos/2.x/INDICE.md` |
| Error hotfix | `5_errores/INDICE_ERRORES.md` |
| Motor + estrategias + casos | `motor_precios/CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md` |
| Roles accesos | `MATRIZ_ROLES_ACCESOS_HOLDING.md` |
| Estructura repos | `CHUSAR_ESTRUCTURA_HOLDING.md` |
| Docs en web | https://moriachusar.vercel.app |
| Programa etapas | http://localhost:3004/chusar |

---

## 11 · Responsabilidad agente (Director · 2026-07-07)

| Obligación | Detalle |
|------------|---------|
| **Una puerta** | CHUNA → Moria títulos → ACTUAL → una secundaria |
| **Codificación** | Respetar `C.LL.SS.NNN` · no crear módulos sin código en plan |
| **Cinco capas** | Al documentar, sincronizar disco + etapas + navegador |
| **Keywords** | Exactas · sinónimos no abren memoria |
| **No contradecir** | Si docs legacy dicen «Chayanne» / «7 años» → canónico = **Andrés, el que viene.** (CHUNA §2) |

---

**Índice padre:** [`INDICE.md`](./INDICE.md) · **Estructura:** [`CHUSAR_ESTRUCTURA_HOLDING.md`](./CHUSAR_ESTRUCTURA_HOLDING.md)
