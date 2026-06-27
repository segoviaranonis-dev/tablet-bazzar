# Deploy — Depósito Operativa + Tablet Cajas · 2026-06-27

**Etapa:** [ETAPA_DEPOSITO_OPERATIVA_TABLET_CAJAS_CERRADA.md](../../.claude/4_etapas/ETAPA_DEPOSITO_OPERATIVA_TABLET_CAJAS_CERRADA.md)  
**Build local:** ✅ tablet + report PASS  
**Estado:** listo para commit + push (Claude Code o Director «Subilo»)

---

## 1. Tablet Bazzar

**Repo:** `tablet-bazzar/` · **Prod:** https://tablet-bazzar.vercel.app

```powershell
cd tablet-bazzar
npm run build
git add app/deposito/page.tsx `
  app/api/deposito/status/route.ts `
  app/api/deposito/[cliente_id]/route.ts `
  lib/depositos-config.ts `
  lib/depositos/agrupar-cajas.ts `
  components/deposito/GrillaCajasDeposito.tsx `
  components/deposito/TablaGradaDeposito.tsx `
  docs/evidencia/CIERRE_DEPOSITO_CAJAS_20260627.json `
  docs/DEPLOY_PREPARACION_20260627.md
git commit -m "feat(deposito): agrupacion cajas matriz 18 entes

- Grilla L+R+mat+color con tabla grada por talla
- Status API expone 18 tablas + resumen categorias
- depositos-config alineado Report (ENTES_MAP, CATEGORIA_META)
- Fetch limit=all para agrupacion completa

Co-Authored-By: Cursor <cursor@cursor.com>"
git push origin main
```

### Smoke post-deploy tablet

1. https://tablet-bazzar.vercel.app/deposito — login Bazzar
2. Selector 6 tiendas · FER-A default
3. Cards con badge `p` · tabla tallas · contador cajas/pares
4. `/api/deposito/status` → `"tablas_total": 18`

---

## 2. Report

**Repo:** `report/` · **Prod:** https://rimec-report.vercel.app

```powershell
cd report
npm run build
git add src/app/depositos-bazzar/ `
  src/lib/depositos/ `
  src/app/api/depositos/
git commit -m "feat(depositos): operativa cabecera cantidad grada vitales filtros indice

- Acordeon unico CABECERA DE FILTROS
- Cantidad y Grada independientes con Aplicar
- Vitales KPI pares/productos filtrados
- Tab Filtros por indice puente Motor Precios
- Grilla operativa agrupacion cajas centrada

Co-Authored-By: Cursor <cursor@cursor.com>"
git push origin main
```

### Smoke post-deploy report

1. `/depositos-bazzar/2100?tab=operativa`
2. Acordeón filtros · bloque cantidad · grada · vitales
3. `?tab=filtros-indice` — líneas BCL proveedor 654

---

## 3. Holding (Nexus_Core)

Tras push submodules, actualizar puntero en monorepo si aplica:

```powershell
cd C:\Users\hecto\Nexus_Core
git add tablet-bazzar report .claude/4_etapas/ETAPA_DEPOSITO_OPERATIVA_TABLET_CAJAS_CERRADA.md
git commit -m "docs(etapa): cierre deposito operativa tablet cajas 20260627"
```

---

## Variables Vercel (sin cambios)

Tablet: `DATABASE_URL` · `TABLET_SESSION_SECRET` · `NEXT_PUBLIC_SUPABASE_*`  
Report: mismas credenciales BD · `REPORT_SESSION_VERSION=4`

Ver [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)

---

**Preparado Cursor — 2026-06-27**
