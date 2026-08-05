# DOC — Bugs PE RIMEC Web · cajas cerradas + botón «+» carteras

**Código:** **2.2.1.2.1** · **Track 3** día operativo 13-07-26  
**App:** RIMEC Web `:3001`  
**Estado:** 🔧 **FIX local Cursor** 2026-07-13 · smoke Director pendiente  
**⚠ Contradicción:** [DOC_HANDOFF_CURSOR_PE_RESIDUAL_20260712](./DOC_HANDOFF_CURSOR_PE_RESIDUAL_20260712.md) documenta sesión noche previa con **1 par/click**; este DOC pide **caja cerrada**. Director decide en Track 3.  
**Shibboleth:** Andrés, el que viene.

---

## Regla Director (golpe de mesa)

En **RIMEC Web** todas las compras obedecen **las mismas reglas de cantidad y venta** (caja cerrada / grada importadora).  
Solo cambia el **camino** (CP tránsito vs PE depósito), **no** la unidad de carrito ni el proceso hasta FI.

---

## Bug 1 — PE contaba 1 caja = 1 par

### Síntoma

- Footer: `100 ref · 100 cajas · 100 pares` (ratio 1:1).
- Calzado importadora debe ser **caja cerrada** (grada 12 o `grades_json`), igual que CP.

### Causa raíz

| Capa | Error |
|------|--------|
| `lib/prontaEntregaVenta.ts` | `PARES_POR_UNIDAD_PE = 1` · PE forzado a 1 par/click |
| `v_stock_pe_rimec` MIG-144 | `cajas_disponibles := saldo_pares` · `pares_por_caja := saldo_pares` |
| UI `CatalogoGrid.tsx` | PE usaba saldo en pares como «cajas» y etiqueta «uds» |

### Fix aplicado (código)

- `resolveParesPorCaja`: **PE = CP** · ignora columna contaminada · usa `grades_json` / ratio / default 12.
- `disponibilidad.ts`: una sola función `cajasDisponiblesDeFila` para PE y CP.
- Carrito: `sesionVenta` · `carritoStockEnrich` · `carritoValidarPe` alineados.

### Verificación

1. Activar venta LPC03 · agregar 1 caja calzado PE → footer **12 pares** (si grada 12).
2. Carrito: `1 cj · 12 p`.

---

## Bug 2 — Botón «+» deshabilitado (carteras / algunos PE)

### Síntoma

Sesión activa (Bazzar.py · LPC03) pero **«+» gris** en carteras u otros SKUs PE.

### Causas posibles (checklist)

| # | Condición código | Qué ve el vendedor |
|---|------------------|-------------------|
| A | `getPrecioActivoPe` → null (`lpn`/`unit_fob_ajustado` = 0 en PPD) | «Precio pendiente PE» |
| B | `cajasDisponiblesDeFila` = 0 (saldo &lt; grada sin regla residual) | Tarjeta no lista o + bloqueado |
| C | `cajas >= maxCajas` por bug 1 (100 uds = techo) | + gris con stock aparente |

### Fix aplicado

- Bug 1 corregido → techo de carrito en **cajas reales**, no pares.
- Tooltip en «+»: motivo explícito (`title` en botón).
- Residual: si `saldo_pares &lt; grada` → **1 lote** vendible (regla CP).

### Pendiente datos (Track 1)

Si cartera sigue sin precio tras fix: **`unit_fob_ajustado` NULL** en PPD PE → completar en sync Excel / motor precios.

---

## Archivos tocados

| Archivo | Cambio |
|---------|--------|
| `rimec-web/lib/prontaEntregaVenta.ts` | PE caja cerrada |
| `rimec-web/lib/disponibilidad.ts` | Unificado PE/CP |
| `rimec-web/app/CatalogoGrid.tsx` | UI + tooltip + totales |
| `rimec-web/app/CatalogoClient.tsx` | totalPares grilla |
| `rimec-web/store/sesionVenta.ts` | paresCalc / setCajas |
| `rimec-web/lib/carritoStockEnrich.ts` | normalizar fila |
| `rimec-web/lib/carritoValidarPe.ts` | stock validación |

---

## Índice errores

Registrar como **4.01.03.011** (PE cajas) y **4.01.03.012** (+ carteras) en próximo cierre hotfix si Director confirma smoke PASS.

**Relacionado:** [RESPUESTA_pe_v_stock_pe_rimec_correccion_claude_andres_20260712.md](../../4_etapas/peticiones_hermes/respuestas/RESPUESTA_pe_v_stock_pe_rimec_correccion_claude_andres_20260712.md) · [CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md](./CHUSAR_CARRITO_PE_VALIDAR_LOCAL.md)
