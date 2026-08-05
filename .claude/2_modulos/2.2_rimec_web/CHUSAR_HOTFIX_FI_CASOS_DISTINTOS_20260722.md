# CHUSAR — Hotfix FI mezcla CASOS distintos (R-FI-1)

**Subcuenta:** **2.2.1.19** · padre RIMEC Web  
**Error:** `4.01.06.001`  
**Fecha:** 2026-07-22  
**Keyword Director:** Bug urgente + Documenta + despliega  
**Estado:** ✅ Deploy prod · commit `30a23b8` · Vercel Ready (solo hotfix; WIP slider/local sin push)

---

## Ley (inviolable)

**R-FI-1:** una factura interna = **1 PP × 1 Marca × 1 Caso**.  
Prohibido mezclar `caso_id` distintos en la misma FI.

## Qué falló

Fragmentación del carrito por **texto** `caso` con fallback «Sin caso» → colapso de ids distintos.

## Fix

| Archivo | Cambio |
|---------|--------|
| `lib/facturaCasoClave.ts` | Clave canónica `id:` / `nom:` / `sin_caso` |
| `store/sesionVenta.ts` | `fragmentarCarrito` por `caso_id` |
| `app/carrito/page.tsx` | Match descuentos FI por `caso_id` |
| `scripts/confirmar_carrito_vendedor.mjs` | Mismo split |
| `scripts/_smoke_fi_caso_split.ts` | Smoke PASS |

## Deploy (quirúrgico)

Orden Director «despliega bug urgente» 2026-07-22.

| Campo | Valor |
|-------|--------|
| Repo | `rimec-web` `main` |
| Commit | `30a23b8` |
| Vercel | Production Ready (~31s) |
| Prod | https://rimec-web.vercel.app |
| **NO incluido** | slider precios · filtros catálogo WIP · etapas · Report · monorepo Nexus |

---

**CHUSAR — integrado**
