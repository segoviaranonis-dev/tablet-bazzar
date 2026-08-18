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
[ ] En mirror Héctor o pull: push commits PDM sync a rimec-nexus (report/web/bazzar) — Héctor NO tiene auth a repos privados
[ ] git fetch origin && git rev-parse --short HEAD  == SHA publicado
[ ] remotes solo rimec-nexus
[ ] vercel --scope rimec-nexus  → verificar rimec-report-x · rimec-web-x · bazzar-web-x · nexus-navegador
[ ] smoke HTTP 200
[ ] anotar ACTA fecha + SHA en bitácora aislada
[ ] avisar a Héctor: «PDM Andrés PASS» + SHA
```

**Bloqueo Héctor 2026-08-17:** `git ls-remote rimec-nexus/*` → Repository not found (sin token `nexusrimec`). Andrés debe pushear desde PC aislada o dejar **PAT** en cofre.

**Cuidados praxis (leer):** §8 de este doc · padre Moises **5.01.00.021** — C1…C12 (SPOF auth, secretos, env, Git≠Vercel, EVIDENCIA, force push, DNS, keywords).
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

### 7.1 · EVIDENCIA Andrés — Git PASS (2026-08-17)

```
PDM Andrés — Git PASS
report main: 15aa4f7
rimec-web main: 978195f
bazzar-web main: a7e3bef
match tabla Héctor: SI
vercel redeploy: NO
smoke *-x: PASS (puede ser build anterior al force)
nota: force main rimec-nexus · Sin DNS
```

**Validación OPS Cursor:** smoke cruzado 200 / 308 / 200 · SHA = tabla bundles.  
**Pendiente:** redeploy Vercel PDM (aire = SHA nuevo) · DNS solo con orden.

---

## 8 · Cuidados · praxis entorno aislado (anti mala praxis)

> Origen: incertidumbre del Director 2026-08-17 — **no inmiscuirse** en la PC de Andrés; sí **dejar ley escrita** para agentes/Andrés.  
> Padre Moises: **5.01.00.021**.

| # | Cuidado | Por qué (seguidilla PDM) | Praxis correcta |
|---|---------|--------------------------|-----------------|
| **C1** | **Auth Git PDM = único dueño Andrés** | Héctor no puede `ls-remote` `rimec-nexus` → SPOF | PAT de solo-lectura o colaborador de emergencia en cofre · o bundles + EVIDENCIA obligatoria |
| **C2** | **Secretos solo cofre** | `accesosapp.md` con DB/token en claro; riesgo de pegar en chat | Nunca repetir valores en WhatsApp/Cursor chat · rotar si se filtró |
| **C3** | **No mezclar `.env` OPS ↔ PDM** | `vercel link` puede “Updated .env.local” | Tras cualquier link/deploy PDM: verificar `NEXT_PUBLIC_SUPABASE_URL` = proyecto correcto · `.vercel` no dejar linkeado en disco OPS |
| **C4** | **Git ≠ Vercel** | Deploy CLI subió código sin push Git | Mercado “vivo” en Vercel **no** cierra PDM hasta SHA en `rimec-nexus` + EVIDENCIA |
| **C5** | **Verdad = commit, no working tree sucio** | Sync robocopy de disco sucio ≠ SHA limpio Héctor | Bundles desde `HEAD` committed · tabla SHA en la orden |
| **C6** | **Force push es excepción PDM** | Autorizado una vez para reemplazar mirror 15-ago | No normalizar `--force` · solo con orden MD del Director |
| **C7** | **Handoff = MD + EVIDENCIA, no “dale y listo”** | Zip a Cursor Andrés | Andrés devuelve bloque EVIDENCIA; Héctor/Cursor valida SHA |
| **C8** | **2FA / recovery** | Incidente celular (`4.90.01.002`) | Recovery codes en cofre + pendrive · no un solo dispositivo |
| **C9** | **Tooling asimétrico** | `gh`/CLI faltan o cuelgan en una orilla | Antes de PDM: `gh` + `vercel` versión mínima en ambas PCs |
| **C10** | **Keywords mandan** | Examen decía STOP commit; PDM ordena push | Sin **PDM** / **despliega** / orden MD: no push ni deploy en aislado |
| **C11** | **DNS es fase aparte** | Tentación de apuntar dominios al primer 200 | Solo tras smoke + orden **DNS PDM** |
| **C12** | **Director no audita el escritorio de Andrés** | Confianza + protocolo | Control por EVIDENCIA/SHA/smoke — no por mirar su PC |

**Frase para agentes:** si ves una de estas praxis → **parar**, citar **C#**, pedir corrección; no “arreglar callado” la orilla ajena.

---

**Documenta 2026-08-17 — Protocolo PDM 5.01.00.036 · §8 cuidados praxis · PDM-1 en curso.**
