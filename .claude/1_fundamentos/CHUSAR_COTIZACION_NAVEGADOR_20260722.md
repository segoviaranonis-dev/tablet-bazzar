# CHUSAR — Navegador · cotización · deploy 2026-07-22

**Código:** **2.0.3** · **App:** `nexus-navegador-holding/`  
**Prod:** https://moriachusar.vercel.app · **Local:** http://localhost:3004  
**Orden:** **Documenta** + deploy Vercel Director 2026-07-22

---

## Cambio de corte

1. **`/cotizacion`** — sección **Módulos en curso · valor actual**.
2. **Logística OK (2.3.1.28)** — valor proporcional **⅓** → **USD 7.500 – 10.500** (reposición total módulo USD 22.500 – 31.500).
3. Tarjeta resumen **En desarrollo (valor proporcional)** en grid ejecutivo.
4. Metodología actualizada **2026-07-22**.

Doc módulo: [CHUSAR_COTIZACION_VALOR_ACTUAL_20260722.md](../2_modulos/2.3_report/logistica_ok/CHUSAR_COTIZACION_VALOR_ACTUAL_20260722.md)

---

## Deploy

| Campo | Valor |
|-------|--------|
| Proyecto | `nexus-navegador-holding` → Vercel **moriachusar** |
| Región | `gru1` (`vercel.json`) |
| Prebuild | `npm run sync:holding` copia `.claude` → `content/holding` |

Verificar post-deploy: `/cotizacion` · `/etapas` · tarjeta Logística OK en trabajo vivo.

---

**Integrado:** 2026-07-22 · **Documenta**
