# ACTUAL — 2026-08-04

**Actualizado:** 2026-08-04 · Plan handoff Moises ratificado (PC aislada + moria-moises)  
**Shibboleth:** Andrés, el que viene.

---

## 🟢 ÚNICA ETAPA VIVA — Moises

| Campo | Valor |
|-------|--------|
| **Code** | `MOISES-20260804` |
| **Doc** | [ETAPA_MOISES_20260804.md](./ETAPA_MOISES_20260804.md) |
| **Carta** | [ETAPA_MOISES_CARTA_CONSTITUCION_20260804.md](./ETAPA_MOISES_CARTA_CONSTITUCION_20260804.md) |
| **Corte** | [ETAPA_CORTE_ADMINISTRATIVO_MOISES_20260804.md](./ETAPA_CORTE_ADMINISTRATIVO_MOISES_20260804.md) |
| **Protocolo vivo** | **Protocolo Moises Activado** (Chusar = legado / sustancia igual) |
| **Plan** | Estipular → auditar → deploy + git **segoviaranonis** → **PC aislada** lee Moises → preguntas técnicas → crea **moria-moises** |
| **Cuenta ancla nueva** | `rimec.py@gmail.com` + Cursor en PC aislada |
| **Técnico ahora** | Agente lo resuelve **auditando** (no interrogar Director por cada var) |

---

## Secuencia (no saltar)

1. ✅ Estipular (docs + carta + corte + protocolo nombre)  
2. ✅ Auditar + **Documenta** Protocolo Moises en Chusar (`5.01.00.021`)  
3. ✅ Push productos `segoviaranonis-dev` (report `0011122` · rimec-web `ac54e0f` · bazzar `602c268` · control_central · tablet · moria `a511045`)  
4. ✅ Deploy disparado por git (smoke HTTP OK) · confirmar Ready en Vercel  
5. ⏳ Descarga en PC aislada  
6. ⏳ Agente nuevo: leer Moises → Q1–Q7 → **moria-moises**

---

## Deploy

| Ítem | Estado |
|------|--------|
| Push/deploy orilla actual | Solo con orden Director (parte del plan Moises) |
| Cutover cuenta `rimec.py` | En **PC aislada**, tras leer Moises |
| Portal | http://localhost:3004/etapas |
