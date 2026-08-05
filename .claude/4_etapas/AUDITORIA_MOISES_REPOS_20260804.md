# Auditoría repos — Moises (orilla segoviaranonis)

**Fecha:** 2026-08-04  
**Etapa:** `MOISES-20260804`  
**Objetivo:** alinear origin con la versión de esta PC (código producto + docs) y desplegar.

## Snapshot pre-sync

| Repo | Branch | HEAD (pre) | Dirty (approx) | Origin |
|------|--------|------------|----------------|--------|
| report | main | 39887ca | ~570 | segoviaranonis-dev/report |
| rimec-web | main | 54f52da | ~82 | segoviaranonis-dev/rimec-web |
| bazzar-web | main | 8864b1e | ~31 | segoviaranonis-dev/bazzar-web |
| control_central | main | b77e2ea | ~197 | segoviaranonis-dev/ventas_por_mes_rimec |
| tablet-bazzar | main | 516825e | ~119 | segoviaranonis-dev/tablet-bazzar |
| moria_chusar | main | abfa2c4 | ~3 | segoviaranonis-dev/moria_chusar |
| Nexus_Core (holding) | (root) | — | docs Moises | origin → tablet-bazzar (auditar) |
| nexus-navegador-holding | — | NOGIT | etapas.json local | — |

## Política de sync (esta corrida)

**Incluir:** `src/` · `app/` · `lib/` · `migrations/` numeradas · configs app · docs Moises/Chusar en holding.  
**Excluir:** `.env*` · `.tmp/` · `tmp/` · `node_modules/` · `*.log` · dumps xlsx masivos · scripts `_probe/_tmp` salvo ya trackeados.

## Post-sync

(Completar tras push/deploy en el mismo turno.)
