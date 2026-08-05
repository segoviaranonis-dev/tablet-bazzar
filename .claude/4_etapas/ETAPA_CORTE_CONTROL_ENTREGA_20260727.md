# CORTE CONTROL — Entrega 2026-07-27

**Tipo:** Operativo post-cierre · **sin** fila `en_curso` en Navegador  
**Orden Director:** 2026-07-26 · cerrar todo · desplegar · integridad bancaria

## Objetivo mañana

**1 compra prueba** validando:

| Capa | Qué probar |
|------|------------|
| PE NORMAL | precio LPC03/LPC04 · descuento dictado |
| PE PROMO | caso PROMOCIONAL · LPN |
| PE LIQ | badge LIQ · split FI |
| PE COMUN | cadena comercial · no mezclar con N/P/LIQ |
| CP | por caso biblioteca · confecciones 638 |
| D1 | comisión ≠ descuento UI |
| LP03 | grado 1 = +10 % adicional |
| FI | montos = Σ líneas · centena Gs · segregación marca |

## Apps

- Web: `https://rimec-web.vercel.app` · cliente prueba
- Report: `https://rimec-report.vercel.app` · Aprobaciones · Logística OK
- Scripts: `rimec-web/scripts/smoke_ley_precios.ts` · `_smoke_pe_pp_split.ts` · `_audit_fi_hector_mix.ts`

## Regla

Integridad **bancaria**: todo monto FI/PP/aprobación debe cuadrar con snapshot carrito ± descuento aplicado.
