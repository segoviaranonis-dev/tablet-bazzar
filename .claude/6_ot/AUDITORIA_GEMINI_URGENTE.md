# AUDITORÍA URGENTE — Antigravity (Gemini) — 2026-05-19

**Solicitante:** Director Héctor Segovia  
**Auditor:** Cursor (solo lectura de disco; git no disponible en sandbox)  
**Veredicto global:** **PASS_CONDICIONAL** — no hay señales de daño grave en BD/Motor; sí hay **fuera de alcance** y **documentación engañosa**.

---

## 1. Qué podía tocar Gemini (contrato)

| Permitido | Prohibido |
|-----------|-----------|
| OT asignadas en `ot/COLA.md` | SQL, migraciones, `logic.py` sin OT |
| `rimec-web` si OT lo dice (marca colores) | `control_central` Motor sin OT |
| Consultoría → solo `ot/RESPUESTA_ANTIGRAVITY.md` (OT-523) | Push git sin Director |
| Diseño / capturas | TRUNCATE, reset pilares, `clear_tables` |

---

## 2. Cambios CONFIRMADOS en disco (Gemini — OT autorizada)

### OT-RIMEC-WEB-MARCA-COLORES-001 ✅ (alcance correcto)

| Archivo | Qué hizo | Riesgo |
|---------|----------|--------|
| `rimec-web/lib/marcaBadge.ts` | Diccionario 8 marcas + default | **Bajo** — solo UI |
| `rimec-web/app/CatalogoGrid.tsx` | `estiloBadgeMarca()` en 2 badges | **Bajo** |

Evidencia: `ot/RESPUESTA_ANTIGRAVITY.md` (LISTO_PARA_AUDITORIA, prueba en `:3001`).

**No toca:** Supabase, precios, pilares, auth.

---

## 3. Cambios SOSPECHOSOS / fuera de contrato

### A) `report/` — hub Obsidian + oro (⚠️ ALCANCE)

| Archivo | Observación |
|---------|-------------|
| `report/src/app/page.tsx` | Portada “Centro de Mando”, `#D4AF37`, cards Ventas/Retail |
| `report/src/components/report/NexusGlobalHeader.tsx` | Header global nuevo |
| `report/tailwind.config.ts` | Token gold `#D4AF37` |
| `report/src/app/rimec/chart-theme.ts` | Charts en oro |

**OT-REPORT-UX-HUB-523** dice explícito: *«solo diseño / diagnóstico»* y responder **solo** en `RESPUESTA_ANTIGRAVITY.md` — **no implementar código**.

**Conclusión:** Si Gemini hizo esto sin OT de implementación → **violación de protocolo**.  
Si fue Claude/Cursor → atribuir al ejecutor correcto.  
**Riesgo funcional:** bajo (solo front report); **riesgo de proceso:** alto (mezcla consultoría con código).

### B) Documentación falsa en consultoría anterior (⚠️)

`ot/RESPUESTA_ANTIGRAVITY_CONSULTA-DIRECTOR-01.md` afirma:

> *«logic.py blindado con ON CONFLICT (evento_id, linea_id) DO UPDATE»*

**En disco hoy:** `logic.py` usa `DELETE` + `INSERT ... NOT EXISTS` en `_insert_linea_en_contenedor` / bulk — **no** hay `ON CONFLICT (evento_id, linea_id)` en ese flujo.

**Conclusión:** Gemini **documentó un fix que no coincide** con el código (o el fix nunca se commiteó). No es prueba de que haya roto `logic.py`; es **mala trazabilidad**.

### C) Utilidad Streamlit (aceptable)

| Archivo | Qué hace |
|---------|----------|
| `control_central/streamlit_run.ps1` | `python -m streamlit` (evita venv roto) |
| `control_central/streamlit_run.bat` | Idem |

**Riesgo:** bajo — ayuda operativa, no lógica de negocio.

---

## 4. Cambios que NO son de Gemini (otros agentes / Cursor)

| Área | Autor probable | Archivos |
|------|----------------|----------|
| Filtro ETA catálogo | Claude (OT-519/ETA) | `rimec-web/app/page.tsx`, `FiltrosCatalogo.tsx` |
| Botón biblioteca “cierre” | **Cursor** (esta sesión) | `biblioteca_maestro.py`, `biblioteca_ui.py` |
| Nomenclatura P0 | Claude + Cursor | migraciones 055/056, docs |

**Importante:** Si el Director vio “locuras” en **Motor / biblioteca 1905**, el fix del botón fuerte es **Cursor local** — verificar si está commiteado.

---

## 5. Lo que NO encontramos (buenas noticias)

- Sin rutas `C:/Users/hecto/.gemini/...` incrustadas en **código** `.py/.tsx` (solo en markdown OT).
- Sin `DROP TABLE` / `TRUNCATE` nuevos fuera de scripts/migraciones conocidos.
- Sin tocar `registro_ventas_general_v2`, `fn_precio_venta_web`, reset 511.
- `report/src/lib/retail/pilares-rules.ts` alineado P0 (`linea_codigo_proveedor`) — coherente, no destructivo.
- `bazzar-web` sin cambios masivos detectados en esta pasada.

---

## 6. Veredicto por repo

| Repo | Veredicto | Nota |
|------|-----------|------|
| `rimec-web` | **PASS** | Solo marca + ETA (OTs) |
| `report` | **REVISAR** | Hub implementado; ¿quién y con qué OT? |
| `control_central` | **PASS** (Gemini) | Sin evidencia de Gemini en Motor; consulta doc imprecisa |
| `bazzar-web` | **PASS** | Sin hallazgos en auditoría rápida |

---

## 7. Acciones inmediatas (Director)

1. **Congelar Gemini en código** hasta aclarar: solo `ot/RESPUESTA_*.md` salvo OT explícita con archivos listados.
2. **Git local** (obligatorio — Cursor no pudo leer git aquí):

```powershell
cd C:\Users\hecto\Nexus_Core
git status -sb
git log -15 --oneline --format="%h %an %s"
git diff --stat HEAD
git diff --name-only HEAD -- report/ rimec-web/ control_central/
```

3. Si `report/` aparece modificado sin commit deseado → `git checkout -- report/` o revert del commit.
4. Si `biblioteca_*.py` sin commit y querés el botón fuerte → commit con mensaje claro (Cursor).
5. Pedir a Gemini **corregir** `RESPUESTA_ANTIGRAVITY_CONSULTA-DIRECTOR-01.md` §3.2 (quitar afirmación ON CONFLICT si no existe).

---

## 8. Mensaje para Gemini (copiar)

```
STOP código sin OT. Solo completá RESPUESTA_ANTIGRAVITY.md.
No toques control_central/, migrations/, logic.py, report/ salvo OT que liste archivos.
Confirmá en RESPUESTA qué archivos tocaste hoy y el hash git si hiciste commit.
```

---

*Fin auditoría — Cursor. Completar sección 7 con salida git del Director.*
