# Protocolo Documentación Chusar

**Código:** `5.01.00.015` · **Palabra reservada:** **Documentación Chusar** (también *Documentacion Chusar*)  
**Autoridad:** Director — **solo él** ordena cuándo documentar.  
**Ley universal:** [`LEY_UNIVERSAL_DOCUMENTACION_DIRECTOR.md`](../1.3_politicas/LEY_UNIVERSAL_DOCUMENTACION_DIRECTOR.md) — crear · actualizar · guardar · **eliminar** docs = solo orden expresa.  
**Regla Cursor:** `.cursor/rules/protocolo-director-palabras-clave.mdc` · `.cursor/rules/ley-universal-documentacion-director.mdc`

---

## Qué es

Integrar en la **memoria del holding** el contexto de la **tarea/etapa abierta** — una sola vez, cuando el Director lo pide. **No** es documentar cada paso del trabajo.

**Gemelo visual:** la integración Chusar tiene hermano en `memoria-web/` (ver `CHUSAR_MEMORIA_WEB.md`). Índice + secundaria `.claude/` ↔ HTML = mismo árbol, dos caras.

---

## Cuándo actuar

| Situación | Agente |
|-----------|--------|
| Director dice **Documentación Chusar** (frase **exacta**) | Integrar contexto actual → memoria (ver abajo) |
| Director dice **Documenta** (frase **exacta**) | Crear/actualizar `.md` + código en catálogo |
| Director dice *registra*, *chusar*, *anota*, *documentar* | **No escribir** — pedir keyword exacta + archivos |
| Construcción normal (sin palabra) | **No documentar** salvo que el Director lo pida |

---

## Qué hacer al recibir «Documentación Chusar»

1. Leer **`4_etapas/ACTUAL.md`** — identificar etapa/tarea abierta.
2. Leer terminal, archivos tocados y decisión tomada en el turno.
3. Integrar **solo lo relevante** en el estamento correcto:
   - Etapa activa → actualizar doc etapa o nota en `ACTUAL.md` si el Director lo indicó
   - Decisión arquitectura → `3_arquitectura/` o módulo Moria
   - Cierre parcial → índice + `CODIGO_MAESTRO` **solo si** hubo `.md` nuevo
4. **Sincronizar tablero visual Director:** actualizar **`memoria-web/`** (HTML multipágina — ver `CHUSAR_MEMORIA_WEB.md`). Punto de entrada: `memoria-web/index.html` · puntero vivo: `4-etapas/actual.html`. Legacy `ETAPAS_VIVO.html` redirige al sitio.
5. **Sincronizar Navegador Holding (obligatorio — badge NEW):**
   - **`nexus-navegador-holding/config/arbol-modulos.json`** — nodo con `code`, `slug`, `md`, `"nuevo": true` en el padre correcto (Report 2.3 / Tablet 2.4 / etc.).
   - Si hubo **deploy Vercel** de un producto: **`config/productos.json`** → mover `"ultimoDeployActivo": true` **solo** al slug desplegado (portada `/modulos` muestra NEW ahí).
   - Verificar en navegador: http://localhost:3004/modulos y la ruta del submódulo — debe verse badge **NEW** antes de dar por cerrado el Chusar.
6. **No** volcar chat ni pasos intermedios. **No** crear docs por cada commit o subpaso.
7. Integrar en disco y navegador (pasos 3–5 arriba).
8. **Cerrar la conversación** con el bloque **§ Cierre Chusar** (abajo) + **Pata 5** (`Listo para tu orden.` + **💰 COSTO**). **Sin paso 8 = Chusar incompleto = violación recurrente.**

---

## § Cierre conversación — OBLIGATORIO (paso 8)

Tras **Documentación Chusar** o **Documenta** con integración en memoria, el **último mensaje al Director** incluye **en este orden**:

### A · Confirmación integración (checklist)

```
CHUSAR — integrado

Etapa/código: [ej. PANEL-CONTROL-CABECERA-2026 · 2.4.3.7]
Docs: [rutas .md tocadas]
Navegador: arbol-modulos.json [✅ nodos + NEW] · etapas.json [✅ si aplica]
Verificar UI: http://localhost:3004/modulos/[slug] [Director / ⏳ pendiente]
Pendiente: [solo si falta PASS piso, memoria-web, deploy, etc.]
```

| Check | Obligatorio |
|-------|-------------|
| Rutas `.md` + códigos subcuenta | ✅ |
| `ACTUAL.md` si etapa viva | ✅ |
| `arbol-modulos.json` + `"nuevo": true` | ✅ si doc nuevo |
| `etapas.json` | ✅ si tocó etapa |
| `:3004` verificado | ⏳ agente indica URL; Director confirma visual |
| `memoria-web/` legacy | Solo si Director usa gemelo HTML |

### B · Pata 5 — sin excepción

```
Listo para tu orden.

💰 COSTO
Tokens: ~Xk
Costo: ~$X.XX
Riesgo: NINGUNO 🟢
Terminal: Ok | Fail | NO VERIFICADA 🔴
```

**Prohibido terminar Chusar con:** solo lista de archivos · «listo» · pregunta abierta sin COSTO · omitir checklist A.

Reglas Cursor: `cierre-turno-obligatorio-nexus.mdc` · `PROTOCOLO_5_PATAS.md` Pata 5 · error `4.05.01.001`.

---

## Confirmación al Director (contenido paso 8A)

Qué se integró y dónde (rutas + códigos) · URLs navegador con NEW · pendientes explícitos.

---

## Prohibido (sin orden explícita)

- Documentar cada paso mientras se construye
- Crear `.md` «por las dudas» al terminar un fix
- Rellenar manual §3 u OT sin que el Director haya dicho Documenta / Documentación Chusar

---

## Relación con otras keywords

| Keyword | Rol |
|---------|-----|
| **Documentación Chusar** | Integrar memoria + **`memoria-web/`** + **`arbol-modulos.json`** (`nuevo: true`) + **`productos.json`** (`ultimoDeployActivo` si deploy) |
| **Consulta etapas** · **Etapas abiertas** · **ETAPAS_VIVO** | Navegar/actualizar **`memoria-web/index.html`** + `ACTUAL.md` |
| **Documenta** | Director manda **escribir** doc formal (disco + índice) |
| **Verifica índice y documentación** | Abrir secundaria bajo demanda |
| Shibboleth Chuna | **7 años** — ingreso agente; no implica documentar |

---

## Agente no encuentra memoria (diagnóstico local)

**Síntoma:** `grep chusar` → 0 resultados · solo aparece `CONTEXTO_PPT.md` con «tres patas».

| Causa | Qué hacer |
|-------|-----------|
| Workspace **incorrecto** (`/workspace`, sub-repo solo, clone vacío) | Abrir **`C:\Users\hecto\Nexus_Core`** como raíz |
| Busca en apps (`control_central/`, `report/`) | Memoria vive en **`.claude/`** |
| Confunde shibboleth | Gato → **7 años**. «5 patas» = fases de turno, no el gato. «3 patas» = legacy `8_historico/CONTEXTO_PPT.md` — **ignorar** |
| Palabra clave | `CHUSAR` (mayúsculas en filenames): `CHUSAR_LISTO_PROVEEDORES.md`, `CHUSAR_IMPORT_CONFECCIONES_MEMORIA.md`, este protocolo |

**Rutas canónicas (existen en disco local Nexus_Core):**

```
.claude/MORIA_PRIMARIA.md
.claude/4_etapas/ACTUAL.md
.claude/1_fundamentos/1.1_protocolos/PROTOCOLO_DOCUMENTACION_CHUSAR.md
.claude/3_arquitectura/3.2_venta_tienda/CHUSAR_*.md
```

**Verificación rápida:** leer `MORIA_PRIMARIA.md` §0 → responder shibboleth con **7 años** (no 4, 5 ni 13).

---

## Programa Navegador *(2026-06-17 · Chusar ACTIVO)*

El holding expone etapas y documentación con **Nexus Navegador Holding** (`nexus-navegador-holding/`, puerto **3004**):

| Pantalla | URL | Rol |
|----------|-----|-----|
| Protocolo Chusar | http://localhost:3004/chusar | Shibboleth · keywords · reglas agente |
| Portal 4 · Etapas | http://localhost:3004/etapas | Trabajo vivo · orden copiable |
| Portal 2 · Módulos | http://localhost:3004/modulos | Índice documental por módulo |

Doc Moria del programa: [`CHUSAR_NAVEGADOR_PROGRAMA.md`](../CHUSAR_NAVEGADOR_PROGRAMA.md) · config máquina: `nexus-navegador-holding/config/chusar.json`

Complementa (no reemplaza) `memoria-web/` — gemelo HTML legacy.

---

**Shibboleth:** 7 años · Chuna · Memoria la maneja el Director
