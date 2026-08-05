# MORIA PRIMARIA — Índice de títulos (sin contenido)

**Puerta única agente:** `1_fundamentos/1.1_protocolos/PROTOCOLO_INGRESO_AGENTE_CHUNA.md` — **leer primero**.  
**Ecosistema Chusar:** `1_fundamentos/CHUSAR_ECOSISTEMA_PUERTA_UNICA.md` — Chusar · Moria · Moria Chusar · 5 capas · `C.LL.SS.NNN`.  
**Casa:** `C:\Users\hecto\Nexus_Core\` · workspace padre, no sub-repo solo.  
**Memoria:** primaria + secundaria = **sagrada · solo lectura** — escribir **solo** con keyword **exacta** del Director (**Documenta** · **Documentación Chusar**). Ley: `MEMORIA_SAGRADA.md`.  
**Detalle:** abrir **solo** la ruta secundaria que indique la tarea o el Director.

**Regla tokens:** aquí van **títulos y rutas**. Prohibido pegar párrafos de los hijos.

---

## 0 · LEYES INQUEBRANTABLES *(todos los modelos — Cursor, Claude, Gemini)*

| # | Ley | Obligatorio |
|---|-----|-------------|
| **0.1** | **Memoria holding** → `.claude/` (numeración + código). **Doc operativa app** → `[repo]/docs/` **indexada** en `CODIGO_MAESTRO` (clase 2 · grupo 90). Raíz holding: solo `README.md` + `SECURITY.md` | Sí |
| **0.2** | **Memoria primaria = solo lectura.** Secundaria (`.claude/**`) = **solo lectura** salvo consentimiento explícito del Director (**Documenta**, **Documentación Chusar**, etapa, bug índice, archivo citado). Ver §0.10 | Sí |
| **0.3** | **«Documenta»** — **solo orden del Director.** Crear `.md` + código en catálogo. **Prohibido** documentar cada paso al construir | Sí |
| **0.8** | **«Documentación Chusar»** — **solo orden del Director.** Integrar contexto de la **tarea/etapa abierta** (`ACTUAL.md`) en memoria. Ver `PROTOCOLO_DOCUMENTACION_CHUSAR.md`. La memoria la maneja el Director | Sí |
| **0.9** | **Entorno cerrado y profesional:** agente entra por **primaria** (`MORIA_PRIMARIA` + `ACTUAL.md`), acata órdenes precisas. **Prohibido adivinar** — si falta dato, secundaria bajo demanda o pregunta al Director. Mapa de tablas BD = obra en curso (Nexus → Report) | Sí |
| **0.4** | **Entorno de desarrollo:** holding Nexus_Core · Supabase única verdad · pilares FK · Sales Report blindado · OT en `ot/` · etapas en `4_etapas/ACTUAL.md` | Sí |
| **0.5** | **Estructura antes de crear:** consultar `1_fundamentos/1.3_politicas/ESTRUCTURA_OBLIGATORIA.md` — sin carpetas nuevas sin aprobación | Sí |
| **0.6** | **Codificación plan de cuentas:** cada `.md` tiene código `C.LL.SS.NNN` en `CODIGO_MAESTRO.md`. Reglas en `PLAN_CODIFICACION.md`. Regenerar: `python control_central/scripts/generar_codigo_maestro.py` | Sí |
| **0.7** | **Raíz `.claude/`** solo meta: `MORIA_PRIMARIA` · `INDICE_MAESTRO` · `PLAN_CODIFICACION` · `CODIGO_MAESTRO` | Sí |
| **0.10** | **Memoria SOLO LECTURA** — primaria + secundaria + reglas holding: **prohibido editar** sin consentimiento del Director. **Solo el Director** decide desarrollo vs definitivo. `PROTOCOLO_MEMORIA_SOLO_LECTURA.md` | Sí |
| **0.11** | **Memoria SAGRADA — indiscutible.** Siempre. Siempre. Sin keyword exacta → cero escritura. Sinónimos no valen. `MEMORIA_SAGRADA.md` | Sí |
| **0.12** | **Tres Leyes del Agente (Chusar).** Primera: no daño a Chusar + mejores prácticas + no inacción. Segunda: obediencia Director salvo Primera. Tercera: proteger contexto salvo Primera/Segunda. `1.2_leyes/LEYES_TRES_AGENTE_CHUSAR.md` | Sí |
| **0.13** | **Cierre Pata 5 — indiscutible.** Todo mensaje al Director termina con `Listo para tu orden.` + 4 líneas bajo **💰 COSTO** incluyendo **`Terminal:`**. Sin excepción. `.cursorrules` · `cierre-turno-obligatorio-nexus.mdc` · `4.05.01.001` | Sí |

### Respuesta canónica al shibboleth *(obligatoria, corta)*

Cuando el Director pregunta *¿cuántas patas tiene un gato?*:

> **Andrés, el que viene.** Protocolo Moises Activado · Moria + ACTUAL acatados.

Canónico: `PROTOCOLO_INGRESO_AGENTE_CHUNA.md` §2 · `CHUSAR_PROTOCOLO_MOISES_ACTIVADO_20260804.md` (`5.01.00.021`). Legacy «CHUNA activo» / «Chayanne» / «7 años» = histórico.

### Cierre de turno *(obligatorio en todo mensaje — Ley 0.13)*

Terminar **siempre** con este bloque (6 líneas). Copiar plantilla de `.cursorrules`:

```
Listo para tu orden.

💰 COSTO
Tokens: ~Xk
Costo: ~$X.XX
Riesgo: NINGUNO 🟢
Terminal: Ok | Fail | NO VERIFICADA 🔴
```

CHUNA §7 · `cierre-turno-obligatorio-nexus.mdc` · error `4.05.01.001` si falta.
---

## 1 · Director

| # | Título | Secundaria |
|---|--------|------------|
| 1.1 | Datos personales | *(reservado Director — no en repo)* |
| 1.2 | Comunicación en 3 frases | `6_ot/TARJETA_DIRECTOR.md` |
| 1.3 | Equipo y roles | `10_roles/EQUIPO_Y_ROLES.md` |
| 1.4 | Matriz roles y accesos | `1_fundamentos/1.3_politicas/MATRIZ_ROLES_ACCESOS_HOLDING.md` |

---

## 2 · Proyectos (mapa holding)

| # | Título | Secundaria |
|---|--------|------------|
| 2.1 | Nexus · Control Central | `2_modulos/2.1_control_central/INDICE.md` |
| 2.1.1 | Ubicación local | `control_central/` · puerto **8501** |
| 2.1.2 | Ubicación Git | repo `control_central` dentro de `Nexus_Core` |
| 2.2 | Report (Sales / Retail / **RRHH 2.3.10**) | `2_modulos/2.3_report/INDICE.md` |
| 2.2.1 | Local | `report/` · puerto **3000** (dev) |
| 2.2.2 | Git / Vercel | repo `report` · `rimec-report.vercel.app` |
| 2.3 | Bazzar Web | `2_modulos/2.5_bazzar_web/INDICE.md` |
| 2.4 | RIMEC Web | `2_modulos/2.2_rimec_web/INDICE.md` |
| 2.5 | Tablet Bazzar | `2_modulos/2.4_tablet_bazzar/INDICE.md` |
| 2.8 | Enlaces repos (conector) | `2_modulos/ENLACES_REPOS.md` |
| 2.9 | Mapa repos holding | `1_fundamentos/MAPA_REPOS.md` |
| **2.10** | **Estructura holding (Chusar)** | `1_fundamentos/CHUSAR_ESTRUCTURA_HOLDING.md` |
| **2.11** | **Ecosistema Chusar · puerta única** | `1_fundamentos/CHUSAR_ECOSISTEMA_PUERTA_UNICA.md` |

---

## 3 · Manual de funciones *(títulos por módulo)*

Índice completo: `3_manual_funciones/INDICE.md`

| # | Título | Secundaria |
|---|--------|------------|
| 3.1 | Control Central · funciones | `3_manual_funciones/INDICE.md#31` |
| 3.2 | Report · funciones | `3_manual_funciones/INDICE.md#32` |
| 3.3 | RIMEC Web · funciones | `3_manual_funciones/INDICE.md#33` |
| 3.4 | Bazzar Web · funciones | `3_manual_funciones/INDICE.md#34` |
| 3.5 | Tablet Bazzar · funciones | `3_manual_funciones/INDICE.md#35` |

Cada función hija lleva: **objetivo · funcionamiento · glosario** (solo en secundaria).

---

## 4 · Errores *(índice por módulo)*

| # | Título | Secundaria |
|---|--------|------------|
| 4.1 | **Índice errores** *(solo títulos · plan de cuentas)* | `5_errores/INDICE_ERRORES.md` (`4.00.00.001`) |
| 4.2 | Protocolo **Bug urgente!!** | `1_fundamentos/1.1_protocolos/protocolo_errores.md` |
| 4.3 | Detalle errores | `5_errores/detalle/` |

---

## 5 · Palabras clave y protocolos

| # | Título | Secundaria |
|---|--------|------------|
| 5.1 | Tabla keywords Director | `1_fundamentos/1.1_protocolos/PALABRAS_CLAVE_DIRECTOR.md` |
| 5.2 | Shibboleth Chuna (ingreso agente) | `1_fundamentos/1.1_protocolos/PROTOCOLO_INGRESO_AGENTE_CHUNA.md` |
| 5.3 | Protocolo ciclo turno (5 fases) | `1_fundamentos/1.1_protocolos/PROTOCOLO_5_PATAS.md` |
| 5.4 | Leyes generales | `1_fundamentos/1.2_leyes/` · `1_fundamentos/INDICE.md` |
| 5.5 | Contrato arquitectura | `1_fundamentos/CONTRATO_ARQUITECTURA.md` |
| 5.6 | **Documentación Chusar** | `1_fundamentos/1.1_protocolos/PROTOCOLO_DOCUMENTACION_CHUSAR.md` |
| 5.7 | **Documenta** | Crear `.md` + catálogo · **solo orden Director** · §0.3 |
| 5.8 | **Verifica índice y documentación** | Primaria → ruta secundaria |
| 5.10 | **Problemas de imagen** · *infección* · marco violado | **OBLIGATORIO antes de código** (sin esperar al Director): ① `2_modulos/2.1_control_central/docs/LEY_UNIVERSAL_IMAGENES_PRODUCTO.md` (`2.01.04.021`) ② `5_errores/INDICE_ERRORES.md` § 4.90.03 (título match) ③ pie → `5_errores/detalle/` ④ si recorte Storage → anexo `PUNTO_CRITICO_RECORTE_CALZADO.md` |
| 5.11 | **Metodología operativa** *(multi-frente · tokens)* | `1_fundamentos/1.1_protocolos/METODOLOGIA_OPERATIVA_HOLDING.md` |
| 5.12 | OT — cola y respuesta | `6_ot/INDICE.md` · `6_ot/COLA.md` |
| 5.13 | **Memoria solo lectura** | `1_fundamentos/1.1_protocolos/PROTOCOLO_MEMORIA_SOLO_LECTURA.md` — nadie escribe `.claude/` sin orden |

---

## 6 · Etapas *(trabajo actual)*

| # | Título | Secundaria |
|---|--------|------------|
| 6.1 | Etapas abiertas | `4_etapas/ACTUAL.md` |
| 6.1b | **Tablero visual Director** | `memoria-web/index.html` · `CHUSAR_MEMORIA_WEB.md` |
| 6.2 | Protocolo nueva / cerrar etapa | `protocolo_etapas.md` (keyword) · `1.1.10_protocolo_cierre_etapa.md` (6 pasos) · regla `cierre-etapa-navegador.mdc` |
| 6.3 | Etapas cerradas | `4_etapas/` · `4_etapas/realizadas/` |

---

## 7 · Arquitectura y decisiones *(secundaria bajo demanda)*

| # | Título | Secundaria |
|---|--------|------------|
| 7.1 | Índice arquitectura | `3_arquitectura/INDICE.md` |
| 7.2 | Pilares (5) | `1_fundamentos/1.2_leyes/pilares_cinco.md` |
| 7.3 | Integración FK / eventos | `3_arquitectura/3.3_integracion/` |

---

## 8 · Auditorías · OT · evidencia *(solo si aplica)*

| # | Título | Secundaria |
|---|--------|------------|
| 8.1 | OT en curso | `6_ot/en_curso/INDICE_OT.md` |
| 8.2 | Auditorías | `7_auditorias/INDICE.md` |

---

## 9 · Codificación *(plan de cuentas — resumen)*

| Clase | Estamento | Catálogo |
|-------|-----------|----------|
| 0 | Meta Moria | `PLAN_CODIFICACION.md` · `CODIGO_MAESTRO.md` |
| 1 | Director / roles | clase 1 en catálogo |
| 2 | Proyectos | clase 2 · `2_modulos/` |
| 3 | Manual funciones | clase 3 |
| 4 | Errores | clase 4 · `5_errores/` |
| 5 | Leyes y protocolos | clase 5 · `1_fundamentos/` |
| 6 | Etapas | clase 6 · `4_etapas/` *(no `etapas/` legacy)* |
| 7 | Arquitectura | clase 7 · `3_arquitectura/` |
| 8 | OT | clase 8 · `6_ot/` |
| 9 | Auditorías | clase 9 · `7_auditorias/` |

**Detalle completo:** abrir `CODIGO_MAESTRO.md` solo la fila que necesites.

---

**Índice maestro (mapa carpetas):** `INDICE_MAESTRO.md`  
**Actualizado:** 2026-06-16 · Director: Héctor Segovia
