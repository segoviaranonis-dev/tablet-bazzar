# ETAPA ABIERTA — Importación de programados

**ID:** `IMPORTACION-PROGRAMADOS-20260718`  
**Código:** **2.3.1.27** · Report · Proceso importación / stock PROGRAMADO (`categoria_id=3`)  
**Estado:** 🟢 **EN CURSO**  
**Apertura:** 2026-07-18 · orden Director **Nueva etapa** · **Documenta**  
**App (propuesta):** http://localhost:3000/proceso-importacion · `/stock-programado` · reposición AM panel PROGRAMADO  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

Maratón **Importación de programados**: **6 facturas proforma**, cada una con su **propósito de compra (IC)**. Importar IC como en etapas previas → **matching proforma ↔ IC** → import PPD → Admin IC. **Una por una.** Volumen estimado ~**USD 500.000** → severidad bancaria / aritmética exacta.

| Avance | Estado |
|--------|--------|
| Registro etapa + Portal :3004 | ✅ 2026-07-18 |
| Doc CHUSAR apertura + maratón | ✅ |
| Pausar etapa anterior (reposición filtro) | ✅ pausada (no cerrada) |
| Alcance: 6 PF · IC · matching · ~USD 500k | ✅ 2026-07-18 (orden Director) |
| Índice IC / matching (mapa docs) | ✅ ver maratón § protocolo |
| Tabla lote 6 filas (Director) | 🟢 fila #1 = PP-0024 / 0839 |
| Import IC lote #1 (0839) | ✅ 79 IC → PP-37 · [CHUSAR_IC_LOTE_0839](../2_modulos/2.3_report/proceso_importacion/CHUSAR_IC_LOTE_0839_PP24_20260718.md) |
| Import proforma #1 … #6 (secuencial) | ⏳ #3 PP-26 ✅ · siguiente #4 |
| Smoke local `:3000` por PP | ⏳ PP-37 |
| Deploy (solo cierre etapa u orden directa) | ⏳ |

---

## Contexto (memoria previa)

| Doc | Rol |
|-----|-----|
| [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](../2_modulos/2.3_report/proceso_importacion/PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) | Protocolo import proforma PROGRAMADO |
| [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md) | Panel `/stock-programado` |
| [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) | STOCK / CP / PROGRAMADO |
| [ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md](./ETAPA_PP16_ALFREDO_PROGRAMADO_CERRADA.md) | Caso PP-16 cerrado (referencia) |

**Doc canónico de esta etapa:** [CHUSAR_IMPORTACION_PROGRAMADOS_20260718.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_IMPORTACION_PROGRAMADOS_20260718.md)  
**Maratón proformas (Cursor + Director):** [CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md](../2_modulos/2.3_report/proceso_importacion/CHUSAR_MARATON_PROFORMAS_PROGRAMADO_20260718.md)

---

## Etapa anterior (pausada)

[ETAPA_REPOSICION_FILTRO_ADICIONAL_20260716.md](./ETAPA_REPOSICION_FILTRO_ADICIONAL_20260716.md) · `REPOSICION-FILTRO-ADICIONAL-20260716` · **2.3.1.26** — **PAUSADA** (no cerrada; retomar o **Cierra etapa** cuando Director ordene).

---

## Criterio de cierre

1. Flujo import PROGRAMADO documentado + smoke Director PASS.  
2. **Cierra etapa** → `ETAPA_*_CERRADA.md` + `etapas.json` `hecho` + :3004.

**No declarar cerrada** hasta protocolo completo.
