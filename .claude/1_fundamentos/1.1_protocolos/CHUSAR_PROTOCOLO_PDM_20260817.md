# CHUSAR — Protocolo PDM (Producto Disponible para el Mercado)

**Código:** **5.01.00.036**  
**Fecha:** 2026-08-17  
**Keyword:** **PDM** · **hagamos un pdm** · **Protocolo PDM** · **Documenta**  
**Etapa:** `PDM-CUTOVER-20260817`  
**Padres:** **5.01.00.035** (chequeo emparejamiento) · **5.01.00.021** Moises · **5.01.00.032** examen  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES · PDM · 2026-08-17**

---

## 0 · Qué / por qué / qué hace Andrés

| Pregunta | Respuesta |
|----------|-----------|
| **¿Qué?** | Pasar código y deploys a la cuenta de **producto disponible para el mercado**: `nexus.rimec@gmail.com` · org GitHub **`rimec-nexus`** · Vercel team **`rimec-nexus`** · Supabase **`yvuwdbciaxodfvrwmvff`**. |
| **¿Por qué?** | Aborto operativo de la orilla legacy `segoviaranonis-dev` como prod de mercado; cero incertidumbre (triple verificación). |
| **¿Qué hace Andrés?** | Tras cada PDM de Héctor: **re-ejecutar el mismo protocolo PDM** en PC aislada (pull SHA · remotes solo `rimec-nexus` · redeploy `*-x` · smoke). Eso completa el 3.º pilar de certeza. |

**Interpretación agente:** «Moises» / «entorno aislado» / **PDM** = esta orilla mercado — **no** `segoviaranonis-dev`.

---

## 1 · Keyword viva

| Frase Director | Acción |
|----------------|--------|
| **PDM** · **hagamos un pdm** · **Protocolo PDM** | Ejecutar fases PDM-A→D del alcance vigente |
| **Documenta** (con PDM) | Actualizar este CHUSAR + etapa + índices + mapa Andrés |
| **despliega** (dentro de PDM) | Redeploy Vercel cuenta `rimec-nexus` (`*-x` + navegador) |

**No es PDM:** sync ciego OPS→Moises sin orden · copiar `.env` Héctor a PDM · borrar org legacy sin orden.

---

## 2 · Herramientas Moises / PDM (canónico = 9)

| # | Herramienta |
|---|-------------|
| 1–4 | Repos: `report` · `rimec-web` · `bazzar-web` · `moria_moisses` |
| 5–7 | Vercel: `rimec-report-x` · `rimec-web-x` · `bazzar-web-x` |
| 8 | Supabase `yvuwdbciaxodfvrwmvff` |
| 9 | Identidad Gmail + GitHub `nexusrimec-ux` + 2FA |

Extras examen (WhatsApp/EDB) = fuera del PDM-1 núcleo.

---

## 3 · Alcance PDM-1 (este corte)

**Incluye:** Report · RIMEC Web · Bazzar Web · Moria/Navegador (`:3004` + Vercel PDM).  
**Cola PDM-2:** `tablet-bazzar` · `control_central` / `ventas_por_mes_rimec` · `informes_correo` · delivery/Streamlit.

**Tres fuentes = mismo SHA (verdad = PC Director):**

1. Disco local Héctor (`Nexus_Core/<app>`)  
2. Git OPS `segoviaranonis-dev/<app>` (archivo hasta aborto DNS)  
3. Git PDM `rimec-nexus/<app>`

---

## 4 · Fases

### PDM-A — Empareje Git
- Remote `pdm` → `https://github.com/rimec-nexus/<app>.git`
- Push SHA local → `main` PDM (contenido local manda; historial mirror 15-ago puede no ser ancestro).
- OPS `origin` al día si estaba atrás.
- **Prohibido** copiar `.env.local` OPS → PDM.

### PDM-B — Deploy cuenta mercado
- Redeploy `*-x` desde SHA emparejados.
- Navegador holding `:3004` + proyecto Vercel PDM.
- Smoke HTTP + matriz SHA.

### PDM-C — DNS / aborto OPS (post-smoke)
- Apuntar dominios de mercado a Vercel `rimec-nexus` **solo** con smoke verde.
- `segoviaranonis-dev` deja de ser prod mercado; queda backup hasta orden de apagado.

### PDM-D — Andrés (triple certeza)
1. Héctor ejecuta PDM (este protocolo).  
2. Vercel `*-x` vivo verificado.  
3. Andrés **re-ejecuta PDM** en aislado → 3.ª verificación.

---

## 5 · Mapa de instrucciones — Andrés (pegar / imprimir)

### Reglas inviolables
1. Navegador / CLI solo `nexus.rimec@gmail.com` · GitHub `nexusrimec-ux`.  
2. `git remote -v` = **solo** `github.com/rimec-nexus/*`.  
3. `.env.local` = Supabase **`yvuwdbc…`** — nunca keys Héctor/`extrlc…`.  
4. Secretos solo en `cofre/` — no chat, no WhatsApp, no git.  
5. Sin orden **PDM** / **despliega**: no push · no Vercel.

### Checklist re-PDM (Andrés)
```
[ ] gh auth / git = nexusrimec-ux
[ ] git fetch origin && git rev-parse --short HEAD  == SHA que pasó Héctor (report/web/bazzar)
[ ] remotes solo rimec-nexus
[ ] vercel --scope rimec-nexus  → redeploy rimec-report-x · rimec-web-x · bazzar-web-x
[ ] smoke: report-x · web-x · bazzar-x/inicio = HTTP 200
[ ] anotar ACTA fecha + SHA en bitácora aislada
[ ] avisar a Héctor: «PDM Andrés PASS» + SHA
```

### Si FAIL
- No tocar DNS.  
- No mezclar org legacy.  
- Reportar bloqueo (2FA / token / SHA distinto).

---

## 6 · DNS checklist (fase C — post-smoke)

| Dominio mercado | Destino PDM |
|-----------------|-------------|
| Report (si aplica) | proyecto `rimec-report-x` |
| `rimec.com.py` / www | proyecto `rimec-web-x` |
| `bazzar.com.py` / www | proyecto `bazzar-web-x` |
| Moria/Navegador (URL PDM) | proyecto navegador holding en `rimec-nexus` |

**Ejecutar DNS solo después de smoke PDM-B verde.**

---

## 7 · Evidencia / lotes

- Empareje ME-3 previo: **5.01.00.035** (estricto NO → PDM fuerza identidad).  
- Evidencia local Héctor: `MOISES_ACCESOS\20260817\evidencia-pdm\`  
- CHANGELOG Moises lote PDM.

---

**Documenta 2026-08-17 — Protocolo PDM 5.01.00.036 abierto · PDM-1 en ejecución.**
