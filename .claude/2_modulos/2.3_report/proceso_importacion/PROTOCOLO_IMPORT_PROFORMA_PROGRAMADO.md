# Protocolo — Import proforma PROGRAMADO (Alejandro Magno)

**Código:** 2.3.1.7.5.3.3 · **Categoría PP/IC:** `categoria_id = 3` · `compra_previa = false`  
**Caso referencia:** proforma **8604/2026** · **10.032 pares** · **10 ICs** · columna **SHOP**  
**Estado:** 🟢 **Import PPD + preview SHOP×BRAND** · Admin IC etapa PP-28 · **FI automática 1 IC = 1 FI ⛔ ABANDONADA 2026-07-10**  
**Replanteo:** [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) (**2.3.1.7.5.3.5**)  
**Casos reales:** PP-15 (10 IC) · PP-16 (39 IC) · PP-17 (98 IC) · **PP-19 (108 IC) — expone límite estrategia vieja**

**Shibboleth:** Chayanne el mejor

---

## ⛔ Obsoleto desde 2026-07-10 (Director)

| Regla anterior | Estado |
|----------------|--------|
| Paso 5 · **N FI automáticas · 1 FI por IC** | **ABANDONADA** — ver Administrador de IC |
| Motor `buildProgramadoFiJobs` · ratificar **IC→FI** | Congelar · no extender |
| CSV 108 bloques IC con FI vacías | Parche · no norte |

**Norte nuevo:** proforma genera FI **como Compra previa** (cliente × marca × caso); IC en panel izquierdo; **vinculación manual por monto** en tab **Administrador de IC**.

---

## Norte (import PPD — sigue vigente)

---

## Secuencia obligatoria (manual en UI) — actualizado 2026-07-21

| Paso | Acción | Validación |
|------|--------|------------|
| **0** | PP creado · ICs vinculadas · listado RIMEC · **biblioteca cabecera** (programado con BCL) | Evento único en ICs |
| **1** | Director sube `.xls/.xlsx` en tab **Stock** | Archivo Beira Rio |
| **2** | **Preview totales** | `SUM(pares IC) === SUM(pares proforma)` · tabla SHOP×marca Excel **sin** agrupar IC |
| **3** | Confirmar import — **cola por lotes** | Overlay: Analizando → Realizando i/N → 100% exitoso · ver ley **2.3.1.7.5.3.3.10** |
| **4** | Import ejecuta **`ppd_plan` + `ppd`×N** | PPD + pilares **por slice 120 SKUs** · retoma si 504 · **sin FI automática** |
| **5** | **Administrador de IC** | Alineación manual IC↔PF · FI por lote Chusa |

**Doc deploy 2026-07-21:** [CHUSAR_PP_PROGRAMADO_IMPORT_PROFORMA_20260721](./CHUSAR_PP_PROGRAMADO_IMPORT_PROFORMA_20260721.md) (**2.3.1.7.5.3.3.7**)  
**Ley import extensa (cola Vercel):** [LEY_IMPORTACION_EXTENSA_COLA_VERCEL](./LEY_IMPORTACION_EXTENSA_COLA_VERCEL.md) (**2.3.1.7.5.3.3.10**) · matriz errores **4.02.03.017–020**

**Prohibido:** preview que agrupe 2+ IC en una fila · gate por match SHOP×marca · FI automática al confirmar import.

---

## Columna SHOP (proforma Beira Rio)

| Col Excel | Campo parser | Uso |
|-----------|--------------|-----|
| I | `brand` | Marca · cruza con `id_marca` de la IC |
| J | `shop` | **Código cliente** → `intencion_compra.id_cliente` · persiste en `grades_json._shop` |

### Preview e import (2026-07-11 — reconstrucción PP-28)

| Regla | Detalle |
|-------|---------|
| **Emparejamiento canónico** | **SHOP × BRAND** (Excel) ↔ **id_cliente × marca** (IC) |
| **Prohibido** | Inferir `_shop` repartiendo PPD por cupo IC agregado por cliente (`inferProformaDetalleFromPpdAndIcs`) |
| **Desajuste pares** | **Aviso** en preview — no bloquea import PPD; cuadratura en **Administrador de IC** |
| **Borrar import** | Limpia PPD + FI + **`pp_proforma_filas`** |

Doc caso real: [CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) · shop 286 = 1 marca en Excel (BEIRA RIO).

Ejemplo 8604/2026 — 10 grupos / 10.032 pares (1 IC por shop simple):

| SHOP | Pares proforma | IC | Pares IC |
|------|----------------|-----|----------|
| 2674 | 1188 | IC-2026-0062 | 1188 |
| 2198 | 1188 | IC-2026-0061 | 1188 |
| 2200 | 1188 | IC-2026-0063 | 1188 |
| 2197 | 1188 | IC-2026-0060 | 1188 |
| 2590 | 1140 | IC-2026-0066 | 1140 |
| 945 | 1140 | IC-2026-0064 | 1140 |
| 1578 | 1140 | IC-2026-0065 | 1140 |
| 2894 | 1140 | IC-2026-0067 | 1140 |
| 2849 | 360 | IC-2026-0068 | 360 |
| 3016 | 360 | IC-2026-0069 | 360 |

---

## Pilares (FK)

Cada fila proforma → molécula PPD:

- `STYLE` → `linea` + `referencia` (`parsear_linea_referencia`)
- `MATERIAL CODE` / `COLOR CODE` → lookup `material` / `color` por `codigo_proveedor`
- Curva → `grades_json` + `grada`
- Enriquecimiento no inverso en material/color si proforma trae texto

FI detalle usa `ppd_id` + snapshot desde PPD · LPN join `precio_lista` por `(evento_id, linea_id, referencia_id, material_id)`.

Descuentos FI: **de la IC** (`descuento_1…4` en % entero) · no descuentos PP FOB.

---

## APIs Report

| Método | Ruta | Rol |
|--------|------|-----|
| POST | `…/proforma/preview` | Preview SHOP↔IC sin escribir BD |
| POST | `…/proforma` | Import programado (preview interno + PPD + N FI) |
| POST | `…/proforma/borrar` | Reintento · solo sin FI CONFIRMADA |

Script CLI: `control_central/scripts/report_import_proforma_pp.py` (`--preview`, `--borrar-import`).

---

## CSV veneno Carlos — export tab FI (v1 · 2026-07-07)

**Doc:** [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md)  
**Referencia:** `csv's/programado/8604-26.csv` · nombre **`8604-26.csv`**

| Pieza | Detalle |
|-------|---------|
| Botón | **📄 CSV** · tab FI · PP detalle |
| API | `GET …/pedido-proveedor/[ppId]/csv-ventas` |
| Formato | `;` · fila instructiva + header SHOP · bloques cliente+plazo |
| Norte | Inyectar veneno en **sistema legal Carlos** · desplazamiento Hiedra |

**Estado:** 🟡 primer intento — cols grada/GRUPO vacías como archivo ejemplo.

---

## Reintento / borrado

`borrar_importacion_pp`: permitido si **no** hay `venta_transito` y **no** hay FI `CONFIRMADA`. Elimina FI RESERVADA + PPD.

---

## Validación smoke (PP-2026-0015)

- [ ] Preview: 10 emparejamientos · todos `match: true` · 10.032 pares
- [ ] PPD: 836 moléculas · 10.032 pares inicial
- [ ] FI: **10** RESERVADA · suma pares FI = 10.032 · cada FI `cliente_id` = SHOP
- [ ] Tab FI desbloqueada en Report
- [ ] CSV `8604-26.csv` descargado · paridad visual vs `csv's/programado/8604-26.csv`

---

**Índice:** [INDICE.md](./INDICE.md) · **Tab Stock:** [CHUSAR_PP_TAB_STOCK.md](./CHUSAR_PP_TAB_STOCK.md)
