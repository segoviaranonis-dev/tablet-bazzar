# CHUSAR — Moises · chequeo de emparejamiento (Git · Supabase · Vercel)

**Código:** **5.01.00.035**  
**Fecha:** 2026-08-17  
**Keyword:** **Documenta** · Protocolo Moises Activado · **habre etapa**  
**Etapa:** `MOISES-CHEQUEO-EMPAREJAMIENTO-20260817`  
**Padres:** **5.01.00.021** · **5.01.00.022** · **5.01.00.033** · **5.01.00.034** · incidente **4.90.01.002**  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES · 2026-08-17**

---

## 0 · Qué / por qué / qué hace Andrés

| Pregunta | Respuesta |
|----------|-----------|
| **¿Qué?** | Chequeo de que el clon aislado (Moises) **empareja** con OPS: mismo código desplegado, BD sana, Vercel vivo — sin sync ciego. |
| **¿Por qué?** | Tras examen/config, hay que **saber** (no creer) si Git/Supabase/Vercel aislados responden igual que la orilla Héctor. |
| **¿Qué hace Andrés?** | En PC aislada: mantener org `rimec.py` · no mezclar credenciales OPS · enviar ACTA si 2FA/gh bloquea. En OPS: Director entrega accesos a Cursor para monitor + deploys duales bajo orden. |

---

## 1 · Estrategia (Director) — ratificada

1. Accesos Cursor → **Git + Supabase + Vercel** de la versión aislada.  
2. **Despliegues simultáneos** OPS ∥ Moises cuando diga **despliega**.  
3. **Monitor in situ** BD Moises (health, conteos, drift migraciones).

### Opinión agente

**A favor.** Cierra el hueco “documentado ≠ vivo”.  
**Sin oposición** a la etapa. Condiciones = guardrails §2.

---

## 2 · Guardrails (inviolables)

| ID | Regla |
|----|--------|
| G1 | Secretos Moises fuera de git OPS |
| G2 | BD: leer primero; escribir solo orden expresa |
| G3 | No mezclar `DATABASE_URL` OPS ↔ Moises |
| G4 | Vercel Moises ≠ prod legacy Héctor |
| G5 | Sync OPS→Moises **OFF** |
| G6 | 2FA `4.90.01.002` puede bloquear — reportar, no inventar PASS |

---

## 3 · Matriz de emparejamiento (ME-3)

| Capa | OPS (Héctor) | Moises (Andrés) | Check |
|------|--------------|-----------------|-------|
| Git SHA app | `main` report/web/… | fork/org aislada | mismo commit o delta documentado |
| Vercel URL | rimec-report / rimec-web / … | URLs `-x` / org rimec.py | HTTP 200 + versión |
| Supabase | proyecto prod OPS | proyecto Moises | schema mig · conteos muestra |
| RLS / roles | prod | clon | smoke lectura |

---

## 4 · ME-1 — Accesos recibidos (orilla Héctor)

**Carpeta canónica (fuera de git OPS):** `C:\Users\hecto\MOISES_ACCESOS\20260817\`

| Artefacto | Ubicación | Nota |
|-----------|-----------|------|
| Cofre + ACTA | `entorno-aislado\` | secretos **no** a chat ni a `Nexus_Core` |
| Dump BD | `base-de-datos.zip` (~262 MB) | JSON+JPG `respaldo-supabase-rimec` · 157 tablas |
| Código mirror | `Nexus_Core_moises\Nexus_Core\` | solo `report` · `rimec-web` · `bazzar-web` |
| Org Git | `rimec-nexus` | user `nexusrimec-ux` |
| Supabase | ref `yvuwdbciaxodfvrwmvff` | host `*.supabase.co` |
| Vercel | `rimec-report-x` · `rimec-web-x` · `bazzar-web-x` | team `rimec-nexus` |

**SHA disco mirror (15-ago):** report `f99c0a2` · rimec-web `10ea772` · bazzar-web `51cfe8c`

---

## 5 · ME-2 — Smoke 2026-08-17 (lectura)

Evidencia local (no git): `MOISES_ACCESOS\20260817\evidencia-me2\ME2_SMOKE_*.md`

### A · Vercel `*-x`

| URL | Resultado |
|-----|-----------|
| `https://rimec-report-x.vercel.app` | ✅ HTTP **200** |
| `https://rimec-web-x.vercel.app` | ✅ HTTP **200** |
| `https://bazzar-web-x.vercel.app` | ⚠️ raíz **307** · `/inicio` y `/catalogo` ✅ **200** |
| `*/api/health` (3 apps) | ❌ **404** (ruta no existe en mirror) |

Header report: `x-vercel-cache=HIT` · región `gru1`.

### B · Supabase lectura

| Canal | Resultado |
|-------|-----------|
| REST anon `Prefer: count=exact` en pilares/PE | HTTP 200 pero `Content-Range: */0` → **RLS oculta filas a anon** |
| SQL pooler (solo SELECT count) | ✅ **PASS** — datos reales |

**Conteos Moises (SQL, 2026-08-17):**

| Tabla | count |
|-------|------:|
| linea | 4 648 |
| referencia | 16 011 |
| material | 32 368 |
| color | 4 112 |
| talla | 42 |
| linea_referencia | 14 893 |
| combinacion | 2 779 |
| stock_pronta_entrega_rimec | 11 934 |
| registro_ventas_general_v2 | 121 097 |

### C · Veredicto ME-2

| Check | Estado |
|-------|--------|
| Vercel apps vivas | ✅ (bazzar vía `/inicio`) |
| BD alcanzable + pilares/PE con filas | ✅ |
| Anon REST = fuente de verdad | ❌ usar SQL/service o sesión auth (RLS) |
| Emparejamiento SHA OPS vs `*-x` | ⏳ **ME-3** |

---

## 6 · Próximo · ME-3

Matriz: SHA `main` OPS vs mirror/`*-x` · drift schema/mig · RLS anon vs service · no sync.

---

**Documenta 2026-08-17 — ME-1+ME-2 ejecutados · 5.01.00.035.**
