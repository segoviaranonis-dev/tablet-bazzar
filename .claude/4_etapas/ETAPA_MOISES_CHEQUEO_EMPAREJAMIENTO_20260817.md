# ETAPA — Moises · chequeo de emparejamiento (Git · Supabase · Vercel)

**Código etapa:** `MOISES-CHEQUEO-EMPAREJAMIENTO-20260817`  
**Código CHUSAR:** **5.01.00.035**  
**Fecha apertura:** 2026-08-17  
**Keyword:** **habre etapa** · **Documenta** · Protocolo Moises Activado  
**Estado:** 🟢 **EN CURSO**  
**Ejecutor:** Cursor (orilla Héctor OPS · accesos aislados Moises cuando Director los entregue)  
**Padres:** **5.01.00.021** Moises · **5.01.00.022** lotes · **5.01.00.033** contacto cerrado · **5.01.00.034** handoff · incidente **4.90.01.002**  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible

---

## 0 · Objetivo

Verificar **emparejamiento** entre orilla OPS (Héctor) y **versión aislada Andrés (Moises)**: mismos artefactos desplegados, BD coherente, sin sync ciego OPS↔Moises.

Estrategia Director (ratificada con guardrails agente):

1. Entregar a Cursor accesos **Git + Supabase + Vercel** de la org/proyecto **aislado** (rimec.py / Moises).  
2. Cursor hace **despliegues simultáneos** (OPS vs Moises) cuando el Director diga **despliega**.  
3. Cursor **monitorea in situ** la BD Moises (lectura primero) y reporta drift vs OPS.

---

## 1 · Opinión agente (aceptada)

**A favor.** Es el camino correcto para “creer ≠ saber” en el clon.

**Sin oposición a abrir etapa**, con condiciones:

| # | Guardrail |
|---|-----------|
| G1 | Secretos Moises **solo** en env Cursor / `.env.moises.local` — **nunca** commit a `Nexus_Core` OPS ni zip público |
| G2 | BD Moises: **monitor = SELECT/lecturas** primero; INSERT/migración/prod write **solo** orden expresa del turno |
| G3 | **Prohibido** mezclar `DATABASE_URL` Héctor prod con proyecto Moises en el mismo proceso |
| G4 | Vercel Moises = proyecto/org **aislada** — no redeploy prod `segoviaranonis-dev` desde credenciales Moises |
| G5 | Sync OPS→Moises sigue **OFF** — emparejar = comparar, no fusionar |
| G6 | Incidente **2FA** `4.90.01.002` puede bloquear `gh` hasta rendición Andrés — no fingir PASS |

---

## 2 · Sub-etapas

| ID | Qué | Estado |
|----|-----|--------|
| **ME-0** | Documenta + etapa + árbol + índices | ✅ |
| **ME-1** | Director entrega accesos (Git org · Supabase project · Vercel team) | ✅ 2026-08-17 · carpeta `MOISES_ACCESOS` |
| **ME-2** | Smoke lectura BD Moises (conteos pilares / PE / health) | ✅ 2026-08-17 · ver CHUSAR §5 |
| **ME-3** | Matriz emparejamiento: commit SHA · URL Vercel · schema/mig drift | ✅ 2026-08-17 · estricto **NO** · ver CHUSAR §3 |
| **ME-4** | Despliegue dual (orden **despliega**) + monitor post-deploy | ⏳ |
| **ME-5** | Informe PASS/FAIL + acta Director | ⏳ |

---

## 3 · Fuera de alcance (por ahora)

- Cutover prod legacy → Moises (Fase I examen)  
- Sync automático lotes  
- Apagar Supabase/Git Héctor  

---

## 4 · Docs

- CHUSAR: `CHUSAR_MOISES_CHEQUEO_EMPAREJAMIENTO_20260817.md` (**5.01.00.035**)  
- Contacto cerrado: **5.01.00.033** · Examen: **5.01.00.032** · Handoff: **5.01.00.034**

---

**Inicia etapa 2026-08-17 — Moises chequeo emparejamiento.**
