# CHUSAR — Deploy Report · Emparejamiento vendedor PP

**Fecha:** 2026-08-11 · **Orden:** Documenta · despliega Director  
**Alcance:** Hotfix display vendedor_v2 en PP/FI/Logística/CSV · PP 94 audit OK  
**Error:** `4.02.03.026` · **Módulo:** **2.3.1.7.5.3.18**  
**Doc:** `CHUSAR_EMPAREJAMIENTO_VENDEDORES_PP_20260811.md`

---

## Commit report

**Hash:** `dfd1e31` · push `main` → Vercel auto-deploy `rimec-report.vercel.app`

`fix(pp): emparejamiento vendedor_v2 en FI PP y Logistica`

Archivos: `vendedor-pp-integridad.ts` · detail-query · csv-ventas · fi-pdf · fi-pp-actions · logistica queries-bandeja · audit script

---

## Verificación post-deploy

1. PP 94 tab FI → subtítulo **GIANINA** (no BZZP) en 94-PV001  
2. Logística OK → CSV sin error Tito/CLASICOS donde IC = CESAR  
3. `npx tsx scripts/_audit_pp_vendedor_integridad.ts 94` → ok: true
