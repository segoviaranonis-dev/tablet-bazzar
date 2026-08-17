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

## 4 · Próximo paso operativo

Director entrega (chat o vault local, **no** commit):

- Git: org/repo + token con alcance mínimo  
- Supabase: project ref + URL + service_role **solo si** hace falta monitor (preferir anon + SQL read)  
- Vercel: team + project IDs Moises  

Luego Cursor corre **ME-2** smoke lectura.

---

**Documenta 2026-08-17 — etapa Moises chequeo emparejamiento abierta · 5.01.00.035.**
