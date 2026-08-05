# CHUSAR — Grupo uno · Diccionario PE · tres archivos Excel

**Subcuenta:** **2.3.1.10.1.2** · padre [Depósito RIMEC](./INDICE.md) · [Traductor Nexus](./CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md)  
**Código Moria:** **2.3.1.10.1.2**  
**Fecha:** 2026-07-24  
**Keyword Director:** Protocolo Chusar activado · **Documentación Chusar**  
**Palabra reservada:** **grupo uno**  
**Estado:** 🟢 **VIGENTE** — diccionario MIG-180 ejecutado local · UI NORMAL/PROMO/LIQ

---

## 1 · Palabra reservada «grupo uno»

| Campo | Valor |
|-------|-------|
| **Keyword exacta** | **grupo uno** |
| **Significado** | Primer grupo de **cadena comercial + descuento D1** del traductor PE Nexus — independiente del motor de precios y de la biblioteca BCL de tránsito/programado |
| **Ley DPE** | BCL **no incide** en segregación PE — ver [CHUSAR_LEY_DPE_SIN_BCL_20260727.md](./CHUSAR_LEY_DPE_SIN_BCL_20260727.md) (**2.3.1.10.1.2.1**) |
| **Alcance** | Stock Pronta Entrega · FI · carrito RIMEC Web · filtros Report `/stock-pronta-entrega` |
| **Grupos futuros** | **grupo dos**, **grupo tres**, … = otras combinaciones `COD.GRUPO` / columnas Excel → otro descuento — **solo** cuando el Director ordene rastrear la combinación |

> **Regla UI:** la cadena `REGULAR` en BD se muestra siempre como **NORMAL** (mayúsculas). Headers de filtros PE = **solo mayúsculas**.

---

## 2 · Grupo uno — tres cadenas · tres descuentos D1

Tabla canónica `pe_diccionario_cadena` (MIG-180) · función `pe_descuento_diccionario()`:

| Etiqueta UI | Valor BD `cadena_pe` | D1 | Flags PE |
|-------------|----------------------|-----|----------|
| **NORMAL** | `REGULAR` | **4 %** | `es_liquidacion=false` · `es_promo=false` |
| **PROMOCIONAL** | `PROMOCIONAL` | **2 %** | `es_promo=true` |
| **LIQUIDACION** | `LIQUIDACION` | **2 %** | `es_liquidacion=true` |

**FI (R-FI-2):** 1 factura = 1 PP × marca × caso × **cadena grupo uno**. Promo y liquidación nunca comparten FI con normal.

**Código:** `report/migrations/180_pe_diccionario_cadena.sql` · `report/scripts/ejecutar_diccionario_pe.mjs` · `rimec-web/lib/peDiccionario.ts`

---

## 3 · Los tres archivos Excel/CSV (estrategia Mario Bros)

Fuentes analizadas **2026-07-24** para construir el traductor `COD.GRUPO` → cadena grupo uno.  
Ver también [CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md](../facturacion/CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md).

### Archivo 1 — Stock operativo PE (principal)

| Campo | Valor |
|-------|-------|
| **Nombre** | `sdrm1021.csv` |
| **Ruta repo** | `Nexus_Core/csv's/stock's/sdrm1021.csv` |
| **Rol** | **Verdad de stock** — artículos, saldos por depósito (`S00_D1`, `S00_DEP2`, `S00_D3`), LPN, `COD.GRUPO` |
| **Filas** | ~12 070 |
| **Columnas clave** | `CODIGO ARTICULO` · `COD.GRUPO` (10 dígitos) · LPN · columnas depósito |
| **Estilo 638 PE** | Archivo 3 · hoja *Stock rimec* · col **`ULT-PREC-`** por **`COD-COLOR`** (= línea Kyly) · doc **2.2.1.29** |
| **Batch activo local** | `pe-import-1784921538902-sdrm1021` |
| **Import UI** | Botón «Import Pronta Entrega» · `PeImportSdrmButton` |

### Archivo 2 — Traductor Carlos COD.GRUPO

| Campo | Valor |
|-------|-------|
| **Nombre** | `sdrm0849 (1).xlsx` |
| **Ruta típica** | `Downloads/sdrm0849 (1).xlsx` |
| **Rol** | **Mapa semántico Carlos** — cada `COD.GRUPO` con `TIPO0`, `TIPO1`, `TIPO2`, `MARCA` |
| **Filas** | ~12 121 |
| **Uso Nexus** | Seed → `sdrm_cod_grupo_dim` (123 grupos activos · 10 carteras excluidas) |
| **Script** | `report/scripts/_analisis_biblioteca_carlos_pe.py` · `smoke_pe_panel_sdrm0849.mjs` |

### Archivo 3 — Stock valorizado (etiquetas comerciales)

| Campo | Valor |
|-------|-------|
| **Nombre** | `Stock valorizado 07-07-26.xlsx` |
| **Hoja** | *Stock rimec* |
| **Ruta típica** | `Downloads/Stock valorizado 07-07-26.xlsx` |
| **Rol** | **Control de etiquetas** — cruza `Cod. Art. Carlos` con `Tipo 1`, `Tipo 11`, `Tipo 2`, `Marca2` |
| **Filas** | ~12 167 |
| **Uso Nexus** | Validación labels Excel vs dígitos `COD.GRUPO` — **gana dígito** si hay conflicto |

---

## 4 · Decoder dígitos → grupo uno

| Proveedor | Posición dígitos | Mapa cadena PE |
|-----------|------------------|----------------|
| **654 calzado** | pos 45 (díg. 5–6) | `01`→REGULAR · `02`→PROMOCIONAL · `04`→LIQUIDACION |
| **638 confecciones** | pos 67 (díg. 7–8) | `01`/`02`→REGULAR (ACTUAL/ANTERIOR) · `03`→PROMOCIONAL · `04`→LIQUIDACION |

**Código:** `report/src/lib/pilares/cod-grupo-decode.ts` · `rimec-web/lib/pilares/codGrupoCadena.ts`

**Exclusión:** grupos `CARTERAS` / `CARTERA` → **fuera** del filtro grupo uno (módulo propio).

**Filtro Categoría Calzado (RIMEC Web):** `ramo_tipo=CALZADO` muestra solo calzado en las **tres cadenas grupo uno** (NORMAL · PROMO · LIQ). Carteras **no** entran salvo chip **Tipo → Carteras**. Doc error: [CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md](../../2.2_rimec_web/CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md) (**2.2.1.24** · `4.01.04.003`).

---

## 5 · Artefactos generados (grupo uno)

| Artefacto | Ruta |
|-----------|------|
| Seed 133 grupos | `report/src/lib/pe/biblioteca-cadena-carlos.seed.json` |
| Tabla dimensión | `sdrm_cod_grupo_dim` (MIG-161) |
| Tabla diccionario D1 | `pe_diccionario_cadena` (MIG-180) |
| Vista impacto | `v_pe_diccionario_impacto` |
| Script ejecución | `report/scripts/ejecutar_diccionario_pe.mjs` |
| API Report | `/api/stock-pronta-entrega/diccionario` |
| API Web monitoreo | `/api/pe/diccionario-monitoreo` |

### Impacto catálogo PE (corte local 2026-07-24)

| Cadena UI | Moléculas | Pares saldo | D1 |
|-----------|-----------|-------------|-----|
| NORMAL | 5 681 | 143 138 | 4 % |
| LIQUIDACION | 1 449 | 23 812 | 2 % |
| PROMOCIONAL | 559 | 16 865 | 2 % |

---

## 6 · UI — dónde se ve grupo uno

| App | Ruta | Elemento |
|-----|------|----------|
| **Report** | `/stock-pronta-entrega` | Fila **COMERCIAL**: TODOS · **NORMAL** · PROMOCIONAL · LIQUIDACION |
| **Report** | idem | Barra **DICCIONARIO PRONTA ENTREGA** |
| **Report** | idem | Badge tarjeta PE (molécula) |
| **RIMEC Web** | Catálogo PE | [CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md](../../2.2_rimec_web/CHUSAR_GRUPO_UNO_VISUAL_CASINO_PE_WEB.md) · NORMAL/PRO/LIQ |
| **RIMEC Web** | Catálogo PE | `PeProBadge` · `PeLiqBadge` · convive CP azul |

Headers filtros PE: **DEPÓSITO · COMERCIAL · GÉNERO · MARCA · ESTILO · TEMPORADA/TIPO 1 · LÍNEA · BUSCAR** — solo mayúsculas.

---

## 7 · Grupo dos+ (pendiente Director)

El Director indicó que **rastreará otra combinación** para establecer **otro descuento** (grupo dos). Hasta entonces:

- **No** inventar cadenas ni % adicionales.
- **Sí** documentar aquí cuando llegue la orden con: archivo Excel · columnas · regla dígitos · % D1 propuesto.

---

## 8 · Referencias

- [CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md](./CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md) — estrategia dual biblioteca
- [CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md](../facturacion/CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md) — análisis cruce artículos
- [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](./ESTRATEGIA_HIEDRA_VENENOSA_PE.md) — Alejandro Magno · PPD PE
- [MAPA_CSV_SDRM_STOCK_PRONTA_ENTREGA.md](../../../report/docs/MAPA_CSV_SDRM_STOCK_PRONTA_ENTREGA.md) — mapa import CSV

**Orden Director:** Documenta checkpoint · derivar etapas · 2026-07-24.

**Handoff agentes:** [HANDOFF_DICCIONARIO_GRUPO_UNO_20260724.md](../../4_etapas/HANDOFF_DICCIONARIO_GRUPO_UNO_20260724.md)
