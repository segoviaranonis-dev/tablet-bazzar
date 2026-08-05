# PUERTA DE ENTRADA ÚNICA — Todo agente Nexus

**Código:** `5.01.00.001` · **Único doc de reglas al ingresar**  
**Mapa ecosistema:** [`CHUSAR_ECOSISTEMA_PUERTA_UNICA.md`](../CHUSAR_ECOSISTEMA_PUERTA_UNICA.md) (`5.00.01.001`) — Chusar · Moria · Moria Chusar · 5 capas · codificación  
**Relevo vivo:** [`CHUSAR_PROTOCOLO_MOISES_ACTIVADO_20260804.md`](./CHUSAR_PROTOCOLO_MOISES_ACTIVADO_20260804.md) (`5.01.00.021`) — **Protocolo Moises Activado**  
**Workspace:** `C:\Users\hecto\Nexus_Core` (raíz — no sub-repo solo)  
**Aprobado:** Director Héctor Segovia · 2026-06-16 · Moises 2026-08-04

---

## 1 · Reglas (memorizar — no hay otra puerta)

1. **Leer al iniciar:** `MORIA_PRIMARIA.md` (solo títulos) + `4_etapas/ACTUAL.md` + la orden del Director en el chat.
2. **Memoria sagrada — indiscutible.** Primaria y secundaria = **SOLO LECTURA**. Ley: `MEMORIA_SAGRADA.md`. Los agentes **consultan**, no mutan.
3. **Prohibido escribir memoria** salvo keyword **exacta** del Director **en el turno**: **Documenta** · **Documentación Moises** · **Documentación Chusar** (legado/sinónimo transición) · **Nueva etapa** · **Cierra etapa** · **Bug urgente!!**. Sinónimos (*registra*, *chusar*, *anota*) **no** valen → **cero** `.md` en `.claude/`.
4. **Portón obligatorio** antes de Write en memoria: ver `PROTOCOLO_MEMORIA_SOLO_LECTURA.md` (4 pasos). Sin portón = violación.
5. **Solo el Director** decide desarrollo vs **definitivo** (disco). El agente **no** «corrige» ni «unifica» docs.
6. **Conflicto entre archivos:** no parchear. Avisar al Director. Esperar orden.
7. **Trabajo:** código, terminal, verificación. Ciclo turno → `PROTOCOLO_5_PATAS.md` (5 fases internas, no confundir con el gato).
8. **Tres Leyes del Agente** — todo modelo, todo turno: `1.2_leyes/LEYES_TRES_AGENTE_CHUSAR.md` (archivo legado; sustancia bajo **Protocolo Moises Activado**). Primera: no daño a la memoria del holding + mejores prácticas + no inacción. Segunda: obediencia al Director salvo Primera. Tercera: proteger contexto salvo Primera/Segunda.

---

## 2 · Shibboleth

**Pregunta del Director:** «¿Cuántas patas tiene un gato?»

**Respuesta obligatoria — primera línea literal (Protocolo Moises Activado):**

> **Andrés, el que viene.** Protocolo Moises Activado · Moria + ACTUAL acatados.

Si el protocolo no está en disco o workspace incorrecto:

> **Andrés, el que viene.** Protocolo Moises **BLOQUEADO** (*POINTER* — workspace `Nexus_Core` raíz).

Legacy obsoleto: «CHUNA activo» (sustituido 2026-08-04) · «Chayanne el mejor» · «7 años» · 4, 5, 13, «tres patas».

**Prueba rápida:** si el agente no abre con esa línea → **no está en línea** con la metodología.

### 2.1 · Anti-fuga — hooks Cursor (obligatorio al cambiar shibboleth)

Si **sessionStart** inyecta una frase distinta a la que **stop gate** valida, el agente responde mal aunque Moria esté al día.

| Archivo | Debe coincidir con §2 |
|---------|------------------------|
| `.cursor/hooks/chuna-session-start.mjs` | texto inyectado al abrir sesión |
| `.cursor/hooks/chuna-stop-gate.mjs` | regex `Andrés, el que viene\.` |
| `.cursorrules` | bloque Shibboleth |
| `.cursor/rules/cierre-turno-obligatorio-nexus.mdc` | § Shibboleth |

**No confundir:** pies «**Shibboleth:** Andrés…» al final de CHUSAR/etapas = firma doc · **no** sustituyen la primera línea del chat. Pies con «Chayanne el mejor» en docs viejos = histórico — **no** usar en respuesta al gato.

---

## 3 · Palabras clave del Director (escritura en memoria)

| Keyword | Efecto |
|---------|--------|
| **Documenta** | Crear/actualizar `.md` definitivo + índice — solo lo indicado |
| **Documentación Moises** | Integrar contexto de etapa abierta en memoria (keyword viva) |
| **Documentación Chusar** | Legado / sinónimo de transición → mismo efecto que Documentación Moises |
| **Nueva etapa** / **Cierra etapa** | Docs de etapa según protocolo |
| **Bug urgente!!** | Índice errores + detalle nuevo si no existía |

Sin keyword = **solo leer** memoria y **escribir código** si la tarea lo pide.

Tabla completa: `PALABRAS_CLAVE_DIRECTOR.md`

---

## 4 · Dónde buscar contexto (leer, no tocar)

| Necesidad | Ruta |
|-----------|------|
| **Etapa prioritaria (Alejandro Magno)** | `4_etapas/ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md` · `gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md` · `PROTOCOLO_ALEJANDRO_MAGNO_PUERTA_CHUNA.md` |
| **Integrante Andrés (aprendizaje)** | `10_roles/ANDRES_INTEGRANTE_EQUIPO.md` |
| Índice títulos | `MORIA_PRIMARIA.md` |
| Etapa activa | `4_etapas/ACTUAL.md` |
| Errores | `5_errores/INDICE_ERRORES.md` → pie → detalle |
| Imágenes / infección | `LEY_INTEGRIDAD_VISUAL_IMAGEN.md` → § 4.90.03 |
| Pilares / retail | reglas Cursor + `politicas-importacion-pilares` |

---

## 5 · Prohibido

- Editar `.claude/`, `.cursor/rules/`, `CODIGO_MAESTRO` por iniciativa propia
- Crear `*_INCIDENTE_*`, «leyes supremas», parches memoria
- Documentar cada paso del build sin **Documenta**
- Workspace cloud / sub-repo solo para reescribir memoria holding

---

## 6 · Rigurosidad del portón (Director)

Metáfora: **portón de obra**. Si el agente respondió mal el gato, **no entró** — no opina ni toca memoria.

| Obligación | Comportamiento |
|------------|----------------|
| **Entrada** | Solo por este doc + `MORIA_PRIMARIA` + `ACTUAL.md` |
| **Vocabulario holding** | Chusar, infección, Kyly, pilares, OT… → **buscar en `.claude/`** antes de hablar |
| **Prohibido** | «No encuentro Chusar» / «grep 0» sin haber abierto `Nexus_Core` raíz |
| **Prohibido** | «No sé de qué hablás» si el término está en Moria, keywords o §4 arriba |
| **Si falta dato** | Decir **qué rutas leyó** + pregunta concreta al Director |
| **Legacy** | Pie «5 patas» / «Shibboleth V2» / «Chayanne el mejor» en docs viejos = **histórico**. Gato = **Andrés, el que viene.** |

Memoria completa solo lectura: `PROTOCOLO_MEMORIA_SOLO_LECTURA.md` (`5.01.00.017`).  
Ley indiscutible: `MEMORIA_SAGRADA.md` (`5.01.00.018`).

---

## 7 · Cierre de turno — OBLIGATORIO (todos los agentes)

**Sin excepciones.** Todo mensaje al Director termina así:

```
Listo para tu orden.

💰 COSTO
Tokens: ~Xk
Costo: ~$X.XX
Riesgo: NINGUNO 🟢
Terminal: Ok | Fail | NO VERIFICADA 🔴
```

| Campo | Regla |
|-------|--------|
| **Tokens / Costo** | Estimar el turno real (no copiar siempre el mismo número) |
| **Riesgo** | `NINGUNO 🟢` · `MEDIO 🟡` (BD/git) · `ALTO 🔴` (prod/datos) |
| **Terminal** | Si hubo comandos: leer salida antes de cerrar. Sin lectura → `NO VERIFICADA 🔴` |
| **Prohibido** | Omitir bloque · cierres libres · «¿algo más?» sin 💰 COSTO · `Terminal: Ok` inventado |

Regla Cursor (alwaysApply): `.cursor/rules/cierre-turno-obligatorio-nexus.mdc` — también en sub-repos (`rimec-web`, `report`, `control_central`, `bazzar-web`).

**Frase única del Director (ingreso + alineación):**

> ¿Cuántas patas tiene un gato?

Si responde bien → en línea. Si no → no confiar en el agente.

---

**Shibboleth:** Andrés, el que viene. · **Una puerta · Memoria = leer · Definitivo = solo Director**
