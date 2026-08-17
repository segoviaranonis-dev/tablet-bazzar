# PDM-C — DNS / aborto OPS (post-smoke)

**Código:** **5.01.00.036** §6  
**Estado:** DOCUMENTADO — ejecutar solo con smoke PDM-B verde  
**Fecha:** 2026-08-17

## Antes de tocar DNS

1. Report-x · web-x · bazzar `/inicio` = HTTP 200 (cuenta `rimec-nexus`).  
2. SHA/contenido PDM alineado (o commit mirror Andrés pusheado).  
3. BD PDM = `yvuwdbc…` (no mezclar OPS).  
4. Director confirma: **«DNS PDM»** o **hagamos un pdm** fase C.

## Dominios → proyectos Vercel PDM

| Dominio mercado | Proyecto Vercel (`rimec-nexus`) | Alias histórico |
|-----------------|----------------------------------|-----------------|
| (report app) | `rimec-report` | `rimec-report-x.vercel.app` |
| `rimec.com.py` · `www.rimec.com.py` | `rimec-web` | `rimec-web-x.vercel.app` |
| `bazzar.com.py` · `www.bazzar.com.py` | `bazzar-web` | `bazzar-web-x.vercel.app` |
| Navegador / Moria holding | `nexus-navegador` (crear si falta) | URL Vercel PDM |

Pasos Vercel: Project → Settings → Domains → Add → actualizar DNS en registrador (A/CNAME según Vercel).

## Aborto operativo OPS (`segoviaranonis-dev`)

Después del cutover DNS:

1. Dejar de usar deploys `segoviaranonis-dev` como **prod mercado**.  
2. Remotes OPS = **backup/archivo** hasta orden de apagado.  
3. **No borrar** org/repos en este PDM-1.  
4. Local Héctor: seguir desarrollando; cada **PDM** empuja a `rimec-nexus`.

## Rollback

Si mercado falla: apuntar dominios otra vez a proyectos legacy Héctor; avisar Andrés; no borrar PDM.
