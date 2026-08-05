# Auditoría repos — Moises (orilla segoviaranonis)

**Fecha:** 2026-08-04  
**Etapa:** `MOISES-20260804`  
**Objetivo:** alinear origin con la versión de esta PC (código producto + docs) y desplegar.

## Post-sync (ejecutado)

| Repo | Push | HEAD sync | Notas |
|------|------|-----------|--------|
| **report** | ✅ `main` | `0011122` | Incluye `vendedor-fi-display.ts` · pdf-gerencial |
| **rimec-web** | ✅ `main` | `ac54e0f` | Sync producto (sin basura) |
| **bazzar-web** | ✅ `main` | `602c268` | Sync producto |
| **control_central** | ✅ `main` | `a546e50` | Sync selectivo (no 90k basura) |
| **tablet-bazzar** | ✅ `main` | `5608121` | Sync app |
| **moria_chusar** | ✅ `main` | `a511045` | Protocolo Moises + etapa en `content/claude` |
| **Nexus_Core holding** | ⚠ rama `moises-holding` | `d3c263e` | `master`↔`tablet-bazzar` non-fast-forward; docs en rama + mirror moria |
| **nexus-navegador-holding** | NOGIT | — | `etapas.json` en commit holding `moises-holding` |

## Política aplicada

**Incluido:** src/app/lib/migrations/configs producto · docs Moises.  
**Excluido:** `.env` · `.tmp` · probes masivos · xlsx/pdf sueltos.

## Deploy

| Canal | Estado |
|-------|--------|
| Git → Vercel (auto por push `main`) | Disparado en report · rimec-web · bazzar-web · moria_chusar |
| CLI `vercel` local | No instalado en PATH |
| Smoke HTTP | report **200** · moriachusar **200** · rimec-web **308** (redirect, vivo) |
| Verificación Ready en dashboard | ⏳ Director confirma builds verdes en Vercel |

## Protocolo

**Protocolo Moises Activado** documentado en Chusar `5.01.00.021`.
