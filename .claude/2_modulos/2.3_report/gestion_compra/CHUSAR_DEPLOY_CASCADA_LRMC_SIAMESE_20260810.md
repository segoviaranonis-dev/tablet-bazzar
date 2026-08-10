# CHUSAR — Deploy cascada L-R-M-C siamese (AM + RIMEC Web)

**Código:** **2.3.1.29.2**  
**Keyword:** **despliega** · **Protocolo chusar activado** · Director 2026-08-10  
**Estado:** 🟢 prod READY  
**Padre:** [CHUSAR_PP_ABIERTO…](./CHUSAR_PP_ABIERTO_REPOSICION.md) · Web [CHUSAR_CASCADA_FILTROS…](../../2.2_rimec_web/CHUSAR_CASCADA_FILTROS_CATALOGO_20260805.md) · siamese **2.2.1.44**

---

## 1 · Qué salió a prod

| App | Commit | Deploy | Alias |
|-----|--------|--------|-------|
| **Report** (AM) | `0235202` | `dpl_HdLpUMSLJseNm1GQTGrMDNSm4Se8` | https://report-plum-one.vercel.app · https://rimec-report.vercel.app |
| **RIMEC Web** | `3b5b031` | `dpl_FSSgKZ48caN1WiZcAAJhLDK4wBz2` | https://rimec.com.py · https://rimec-web.vercel.app |

**Incluye también (Report):** cierre optimista alerta operativa · script `vaciar_pp_abierto.mjs` (KPI PP abierto = 0 ya en BD).

---

## 2 · Cascada L-R-M-C

Molécula: **Estilo → Línea → Referencia → Material → Color**.  
Cambiar padre limpia hijos. Facetas acotadas (no universo maestras con filtros). Buscar pega `L-R-M-C`.

Smoke local: `npx tsx scripts/smoke_cascada_lrmc_am.mts` → **PASS**.

---

## 3 · Verificar Director

1. https://rimec-report.vercel.app/herramienta-reposicion — Molécula con **Referencia** · alerta **Cerrar** instantáneo · PP abierto **0**.
2. https://rimec.com.py — catálogo sidebar **Referencia** entre Línea y Material.

---

## 4 · Protocolo Chusar Activado

Sistema Moises + lotes + `moria_chusar` + sync OFF + norte Plan Maestro `5.01.00.026` · zip Héctor.

**Última actualización:** 2026-08-10 · deploy orden Director
