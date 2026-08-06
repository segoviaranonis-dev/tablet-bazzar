# CHUSAR — Motor precio WEB · CASO = DPE · etiqueta **NORMAL**

**Código:** **2.5.1.19**  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta**  
**Módulo:** Report `/bazzar-web/motor-precio`  
**Padre DPE:** [CHUSAR_LEY_DPE_SIN_BCL_20260727.md](../2.3_report/deposito_rimec/CHUSAR_LEY_DPE_SIN_BCL_20260727.md) (**2.3.1.10.1.2.1**)  
**Shibboleth:** Andrés, el que viene.

---

## Ley de etiqueta (Director · 2026-08-06)

| Concepto | Valor canónico RIMEC |
|----------|----------------------|
| Cadena comercial “base” (no promo / no liq / no común) | **NORMAL** |
| Alias técnico interno (decoder / BD legacy) | `REGULAR` |
| UI · CASO Motor WEB · diccionario PE | **NORMAL** — **prohibido** mostrar `REGULAR` |

Opciones DPE (triunvirato Excel `COD.GRUPO`):

**NORMAL** · **PROMOCIONAL** · **LIQUIDACION** · **COMUN**

---

## Qué fallaba

1. Motor armaba CASO = `DEFAULT` leyendo `fi.caso` = `PE · sdrm####` (etiqueta de archivo, no DPE).  
2. Tras cablear DPE, el CASO mostraba **`REGULAR`** (token interno del decoder) en vez de **NORMAL**.

---

## Fix

| Pieza | Cambio |
|-------|--------|
| `lpn-caso-sql.ts` | Prioridad CASO: BCL → **DPE** (`v_stock_pe_rimec.cadena_comercial`) → FI → Stock Sano → DEFAULT |
| Mapa DPE→CASO WEB | `REGULAR` **→** `NORMAL` · resto igual |
| `caso_precio_web_regla` | Regla **NORMAL** +50% activa · **REGULAR** desactivada (legacy) |
| Markup | PROMOCIONAL 40% · NORMAL / LIQUIDACION / COMUN / DEFAULT 50% |

Archivos:

- `report/src/lib/bazzar-web/motor-precio/lpn-caso-sql.ts`
- `report/src/lib/bazzar-web/compra-web/queries.ts` (paridad DPE en caso_nombre)

---

## Smoke 2026-08-06 (post-sdrm3901)

| CASO | SKUs ALM_WEB (orden) |
|------|----------------------|
| NORMAL | mayoría (ex-REGULAR) |
| LIQUIDACION / PROMOCIONAL | según `COD.GRUPO` |
| DEFAULT | residual sin match PE |

UI: hard refresh http://localhost:3000/bazzar-web/motor-precio

---

## Nota siamese

Filtros PE / decoder pueden seguir usando token interno `REGULAR`; al **mostrar** o al **CASO WEB** → siempre **NORMAL**.  
Paridad: `diccionario-pe.ts` / `peDiccionarioClient` ya mapeaban `REGULAR` → etiqueta UI `NORMAL`.
