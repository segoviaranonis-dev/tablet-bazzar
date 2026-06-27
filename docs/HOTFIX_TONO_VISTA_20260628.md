# Hotfix — filtro TONO en vista cadena

**Fecha:** 2026-06-27 (deploy) · documentado 2026-06-28  
**Commit:** `9569eb2`  
**Prod:** https://tablet-bazzar.vercel.app/cadena

---

## Problema

Con TONO seleccionado en `/cadena`, al pulsar INGRESAR la vista mostraba colores de **otros tonos** (ej. VINO `1184.1101` con filtro marrón).

---

## Fix

| Archivo | Cambio |
|---------|--------|
| `lib/cadena-entrada-filtros.ts` | `buildVistaQuery` incluye `tonos` y `sin_tono` |
| `lib/filtros-url.ts` | `cadenaStockQueryFromSearchParams` conserva TONO |
| `lib/server/catalogo-sql.ts` | `filtrosSqlCadenaVista` usa filtros completos |

---

## Verificación

1. `/cadena` → elegir un TONO → INGRESAR.
2. Confirmar que solo aparecen colores del tono filtrado.
3. Hard refresh si la URL vieja quedó en caché.

Moria: `.claude/5_errores/detalle/4.03.02.002_cadena-vista-tono-filtro-anulado.md`
