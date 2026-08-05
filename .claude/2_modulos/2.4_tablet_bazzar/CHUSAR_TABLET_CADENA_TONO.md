# CHUSAR — Tablet Cadena · filtro TONO

**Subcuenta:** **2.4.2.5** · padre **2.3.5.3** ✅ cerrado  
**Estado:** ✅ **ACTIVO** — hotfix publicado 2026-06-27 · etapa padre cerrada 2026-06-28  
**Error índice:** [4.03.02.002](../../5_errores/detalle/4.03.02.002_cadena-vista-tono-filtro-anulado.md)  
**Pilar color (Report):** [CHUSAR_PILAR_COLOR_TONO_CANON.md](../2.3_report/pilares/CHUSAR_PILAR_COLOR_TONO_CANON.md) · [ETAPA CERRADA](../../4_etapas/ETAPA_PILAR_COLOR_TONO_CANON_CERRADA.md)

---

## Qué es

Filtro **TONO** en modo cadena tablet: el operador elige tonos canónicos (Negro, Marino, Bronce…) en `/cadena` y esa selección **debe persistir** en `/cadena/vista` y en todo refetch SQL.

**Sales Report** — blindado · no usa pilares.

---

## Flujo canónico

```
/cadena (entrada)
  → chips TONO + sin_tono opcional
  → INGRESAR
/cadena/vista?…&tonos=Marrón|Bronce&sin_tono=0
  → SQL catalogo con mismos filtros
  → patch pilar tono en memoria (UI) sin refetch extra
```

---

## Archivos clave (tablet-bazzar)

| Archivo | Rol |
|---------|-----|
| `lib/cadena-entrada-filtros.ts` | `buildVistaQuery` — serializa `tonos` / `sin_tono` |
| `lib/filtros-url.ts` | `cadenaStockQueryFromSearchParams` — conserva TONO en query |
| `lib/server/catalogo-sql.ts` | `filtrosSqlCadenaVista` — no strip tonos |
| `lib/tono/patch-cadena-tono.ts` | Asignación tono pilar en memoria (colores ya cargados) |
| `lib/server/tono-sql.ts` | Predicados SQL tono_canon / estandar |

---

## Reglas operativas

1. **Entrada manda:** tonos elegidos en `/cadena` llegan intactos a vista y APIs de stock cadena.
2. **No strip en vista:** prohibido `filtrosUrlSinTonoEntrada` (o equivalente) en cadena/vista.
3. **Patch ≠ filtro:** el patch pilar enriquece UI; **no** sustituye el WHERE SQL de tonos.
4. **sin_tono=1:** filas color sin `tono_canon` asignado — parámetro URL explícito.

---

## Smoke producción

URL: https://tablet-bazzar.vercel.app/cadena

1. TONO Marrón → INGRESAR → sin colores VINO u otro tono en refs filtradas.
2. Cambiar tono en entrada → nueva URL con `tonos=` actualizado.

Deploy: commit `9569eb2` · doc app [HOTFIX_TONO_VISTA_20260628.md](../../../tablet-bazzar/docs/HOTFIX_TONO_VISTA_20260628.md)

---

*CHUSAR 2.4.2.5 · Actualizado 2026-06-28*
