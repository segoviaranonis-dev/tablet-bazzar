# Protocolo Cursor — Autonomía agente (sin clics por paso)

**Código:** `5.01.00.019`  
**Autoridad:** Director Héctor Segovia · **2026-06-16**  
**Motivo:** Aprobar cada edit/comando es **desperdicio de tiempo** — el Director valida **solo el resultado**.

---

## Principio

| Capa | Quién configura | Alcance |
|------|-----------------|--------|
| **Cursor IDE (una vez)** | Director — 2 min UI | **Todos** los agentes en esa PC |
| **`~/.cursor/permissions.json`** | Archivo en disco (ya creado) | Terminal + MCP allowlist global |
| **`Nexus_Core/.cursor/permissions.json`** | Archivo en disco (ya creado) | Reglas extra holding |
| **Regla Cursor holding** | `.cursor/rules/director-autonomia-cursor.mdc` | Comportamiento chat (no pedir «¿sigo?») |
| **Memoria `.claude/`** | **Sagrada** — sigue `MEMORIA_SAGRADA.md` | Auto-run **no** autoriza escribir memoria |

**No hay que pedírselo a cada agente.** Una config Cursor + permissions.json = todos los chats Agent/Composer heredan.

---

## Paso A — UI Cursor (Director, una sola vez)

1. Ventana **Editor Window** (arriba derecha — no Agents Window).
2. `Ctrl+Shift+J` → **Cursor Settings** (no VS Code Settings).
3. **Agents → Applying Changes** → **Inline Diffs = OFF**  
   → auto-keep: edits van directo a disco, **sin Accept por archivo**.
4. **Agents → Run Mode** → **Auto-review** (recomendado) o **Run Everything** (cero prompts terminal; más riesgo).
5. Protecciones **ON**: borrado archivos · dotfiles · archivos externos.
6. Reiniciar Cursor.

### Si no ves «Applying Changes»

Estás en **Agents Window** o Settings de VS Code. Cambiá a Editor Window y repetí.

### Nombres confusos (referencia)

| Popup / foro | Setting real |
|--------------|--------------|
| Auto Keep | **Inline Diffs OFF** |
| YOLO / auto-run terminal | **Run Mode** + `permissions.json` |

---

## Paso B — Archivos ya en disco (agente / Claude Code)

| Archivo | Función |
|---------|---------|
| `C:\Users\hecto\.cursor\permissions.json` | Allowlist terminal global + hints Auto-review |
| `C:\Users\hecto\Nexus_Core\.cursor\permissions.json` | Extra Nexus (build, bloqueo deploy prod) |

Cursor relee el archivo al guardar. Con allowlist en JSON, el editor in-app de allowlist puede quedar **solo lectura** — normal.

**Requisito:** Run Mode en Cursor **no** puede ser «Ask Every Time» (deprecado). Usar Auto-review o Run Everything.

---

## Paso C — Flujo Director (validar resultado, no diffs)

Antes de tarea grande:

```powershell
git status
git commit -am "checkpoint antes agente"
# o git stash
```

Después:

- **Leer terminal** del comando (no asumir éxito por `Ready in` solo — revisar GET 500, `MODULE_NOT_FOUND`, exit code)
- `npm run build` / smoke navegador / ruta afectada
- Mal → `git reset --hard HEAD~1` · Report dev roto → `npm run dev:clean:3001` (ver `4.02.02.002`)

---

## Qué sigue pidiendo clic (normal)

| Caso | Por qué |
|------|---------|
| Comando en `block_instructions` | push, reset --hard, borrado masivo |
| Smart Mode / clasificador Auto-review | Comando ambiguo o riesgoso |
| Escritura `.claude/` | Agente debe respetar memoria sagrada aunque Cursor deje escribir |

---

## Herramientas fuera de Cursor (config aparte)

| Herramienta | Dónde |
|-------------|-------|
| Claude Code (extensión) | Permisos propios VS Code |
| Gemini / Antigravity | Producto aparte |
| Cursor CLI | `~/.cursor/cli-config.json` — permisos CLI separados |

---

## Verificación rápida

1. Abrí Agent en cualquier repo Nexus.
2. Pedí un cambio trivial + `npm run build`.
3. **Esperado:** sin Accept por archivo (Inline Diffs off); terminal corre con pocos o cero Allow.
4. Revisá solo build / UI.

---

## Enlaces

- `MEMORIA_SAGRADA.md` — memoria holding indiscutible
- `permissions.json` reference — https://cursor.com/docs/reference/permissions
- Regla holding — `Nexus_Core/.cursor/rules/director-autonomia-cursor.mdc`

---

**Shibboleth:** 7 años · **Una config Cursor · Todos los agentes · Resultado > diffs**
