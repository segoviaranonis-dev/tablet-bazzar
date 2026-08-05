# DOC — Proceso PROGRAMADO completo · Errores y soluciones · Handoff

**Código:** **2.3.1.7.5.3.9**  
**Fecha:** 2026-07-11  
**Estado:** 🟢 **CANÓNICO** — cadena end-to-end `categoria_id=3` · Alejandro Magno  
**Alcance:** **Todo** el proceso de programación — no solo PP-28 ni solo lote Chusa  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Qué cubre este documento

Registro pormenorizado del **proceso PROGRAMADO completo** en Report:

| Fase | Subcuenta | Qué hace |
|------|-----------|----------|
| A | **2.3.1.7.1–7.2** | Motor de precios · import Excel · cierre evento |
| B | **2.3.1.7.3** | Intención de compra PROGRAMADO · bandeja · autorización |
| B′ | **2.3.1.7.3.3** | Inyección Excel batch (412+ IC) |
| C | **2.3.1.7.4** | Digitación · asignar IC → PP programación |
| D | **2.3.1.7.5** | Pedido proveedor · 4 pestañas |
| D1 | **7.5.3.3** | Import proforma Excel · PPD · pilares |
| D2 | **7.5.3.5** | Administrador IC · Protocolo Chusa |
| D3 | **7.5.3.5.1** | Lote FI · excepción sin LPN |
| E | **7.5.3.2** | Tab FI · CSV veneno Carlos · PDF |

**Casos reales documentados:** PP-15 · PP-16 · PP-17 · PP-19 · **PP-28 (piloto Chusa 2026-07-11)**.

**Doc hijo PP-28 lote:** [DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) — detalle sesión 11/07.

---

## 2 · Mapa end-to-end (orden obligatorio)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  A · MOTOR DE PRECIOS (2.3.1.7.1 / 7.2)                                 │
│  Excel proveedor → biblioteca → preview → conversión → cierre evento    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                ↓ precio_evento_id CERRADO
┌─────────────────────────────────────────────────────────────────────────┐
│  B · INTENCIÓN DE COMPRA (2.3.1.7.3) · categoria_id = 3                 │
│  UI nueva IC  OR  inyección Excel batch (412+)                          │
│  → PENDIENTE → AUTORIZADO                                               │
└───────────────────────────────┬─────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  C · DIGITACIÓN (2.3.1.7.4) · ramo=programado                           │
│  Asignar nro. fábrica Beira Rio → crear/ampliar PP · intencion_compra_pedido │
└───────────────────────────────┬─────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  D · PEDIDO PROVEEDOR (2.3.1.7.5) · categoria_id = 3                    │
│  Tab ICs → Tab Admin IC → Tab Stock → Tab FI                            │
└───────────────────────────────┬─────────────────────────────────────────┘
                                ↓
        ┌───────────────────────┼───────────────────────┐
        ↓                       ↓                       ↓
   D1 Import              D2 Chusa N1-N3           E CSV veneno
   proforma Excel         Lote FI ~2 min           post-FI
   PPD + pilares          115 FI PP-28             8051-26.csv
```

### 2.1 Dos capas de verdad (crítico)

| Capa | Qué mide | Ejemplo PP-28 |
|------|----------|---------------|
| **Cabecera (Chusa)** | Filas IC = PF = FI | 115 |
| **Molécula (KPI PP)** | Pares F9 · artículos · SALDO | 9400 p · 912 art · SALDO = inicial − reservado |

**No confundir:** 115 filas IC **≠** saldo 0 hasta que **todos** los PPD estén reservados en FI.

---

## 3 · Fase A — Motor de precios

**Ruta:** `/proceso-importacion/motor-precios/importacion-precios/nuevo`  
**Doc:** [CHUSAR_MOTOR_PRECIOS](../motor_precios/CHUSAR_MOTOR_PRECIOS.md) · [CHUSAR_IMPORTACION_PRECIOS](./CHUSAR_IMPORTACION_PRECIOS.md)

### 3.1 Secuencia

| Paso | Pantalla | Validación PASS |
|------|----------|-----------------|
| 0 | Carga Excel | Archivo Beira Rio · hojas por marca |
| 1 | Memoria | Biblioteca · casos · copiar bib anterior |
| 2 | Preview | SKUs · pilares · avisos |
| 3 | Conversión | Bulk pilares · chunks 400 |
| 4 | Cierre | Evento **CERRADO** · `precio_evento_id` disponible |

### 3.2 Errores y soluciones — Motor

| # | Síntoma | Causa | Solución | Ref |
|---|---------|-------|----------|-----|
| M1 | `null value in column "proveedor_id"` en `referencia` | INSERT referencia sin `proveedor_id` NOT NULL | `getOrCreateReferencia` incluye `proveedor_id` | `evento-pilares.ts` · 2026-07-05 |
| M2 | Conversión **504** ~2388 SKUs prod | N× queries pilares · timeout 60s | `PilaresBulkResolver` + chunks 400 + `maxDuration=300` | `fcd2fba` · [CHUSAR_DEPLOY_ALFREDO](./CHUSAR_DEPLOY_ALFREDO_20260709.md) |
| M3 | Biblioteca Memoria timeout | N× connect pool | TX única + maxDuration 300 | `211e32d` |
| M4 | Evento sin LPN para SKUs PP | Listado incompleto | Completar motor · **no bloquea FI** con excepción `sin_lpn` | Admin IC 2026-07-11 |

---

## 4 · Fase B — Intención de compra PROGRAMADO

**Ruta:** `/proceso-importacion/intencion-compra` · `?ramo=programado`  
**Doc:** [CHUSAR_INTENCION_COMPRA](./CHUSAR_INTENCION_COMPRA.md)

### 4.1 Reglas IC PROGRAMADO

| Campo | Regla |
|-------|-------|
| `categoria_id` | **3** (PROGRAMADO) |
| `id_cliente` | Código SHOP comercial |
| `id_marca` | Una IC = una marca (granularidad comercial) |
| `listado_precio_id` | 1=LPN · 2=LPC02 · 3=LPC03 · 4=LPC04 |
| `precio_evento_id` | Evento **cerrado** del motor |
| `estado` | PENDIENTE → AUTORIZADO → DIGITADO |

### 4.2 Fase B′ — Inyección Excel batch

**Doc:** [CHUSAR_INYECCION_DATOS_TRANSITO_IC](./CHUSAR_INYECCION_DATOS_TRANSITO_IC.md) · ✅ **373 IC** · etapa cerrada 2026-07-09

| # | Síntoma | Causa | Solución |
|---|---------|-------|----------|
| I1 | 412+ IC imposibles por UI | Formulario no escala | Script batch Excel → `intencion_compra` |
| I2 | Orden invertido IC | Script inicial | Fix orden IC-0112→0484 · [CHUSAR_INYECCION_IC_EJECUCION](./CHUSAR_INYECCION_IC_EJECUCION_20260709.md) |
| I3 | FK inválidas en lote | Cliente/marca inexistente | Preview validación antes INSERT |

---

## 5 · Fase C — Digitación

**Ruta:** `/proceso-importacion/digitacion?ramo=programado`  
**Doc:** [CHUSAR_DIGITACION](./CHUSAR_DIGITACION.md)

### 5.1 Secuencia

| Paso | Acción | Resultado BD |
|------|--------|--------------|
| 1 | Bandeja PENDIENTES · IC AUTORIZADO sin PP | Lista IC programado |
| 2 | Asignar → nro. fábrica Beira Rio | `intencion_compra_pedido` |
| 3 | Crear PP o ampliar existente | PP `categoria_id=3` ABIERTO |
| 4 | IC → estado DIGITADO | Puente IC↔PP |

### 5.2 Errores y soluciones — Digitación / PP

| # | Síntoma | Causa | Solución | Ref |
|---|---------|-------|----------|-----|
| D1 | Asignar IC JSON vacío prod | Deadlock `getNextNumeroPp` en TX | Fix TX · `945ccb4` | Deploy Alfredo |
| D2 | UI IC default cliente 276 STOCK | Semántica CP en rama programado | Replanteo SHOP · guía cabecera | PP-16 · 2026-07-09 |
| D3 | Vincular listado falla prod | Solo Python en Vercel | TS `vincularListadoAPp` | `945ccb4` |
| D4 | `a.connect is not a function` | Pool efímero mal configurado | `pg.Pool` max:1 + retry | `9ebc2c6` |

---

## 6 · Fase D1 — Import proforma (tab Stock)

**Ruta:** `…/pedido-proveedor/[ppId]?tab=stock`  
**Doc:** [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md)

### 6.1 Secuencia obligatoria

| Paso | Acción | Validación |
|------|--------|------------|
| 0 | PP creado · ICs vinculadas · evento listado | `precio_evento_id` en IC |
| 1 | Subir `.xls/.xlsx` Beira Rio | Columna **J = SHOP** · **I = BRAND** |
| 2 | **Preview** SHOP×BRAND | Cruce `id_cliente` + marca IC |
| 3 | Confirmar import | Avisos Δ pares OK · no errores fatales |
| 4 | `populate_pp_from_proforma` | PPD + pilares FK · `_shop` en `grades_json` |

⛔ **Obsoleto:** FI automática 1 IC = 1 FI · `buildProgramadoFiJobs` · ratificar IC→FI.

### 6.2 Errores y soluciones — Import proforma

| # | Síntoma | Causa | Solución | Caso |
|---|---------|-------|----------|------|
| P1 | **722 PPD · 0 FI** | `categoria_id === 3` falla con string `'3'` Postgres | `Number(categoria_id)` | PP-16 · `4.02.03.006` |
| P2 | Preview SHOP contradictorio | `Map` claves string vs number en `id_cliente` | `Number(id_cliente)` | PP-16 |
| P3 | Preview 5+ min sin feedback | Sin overlay | `ProcesoImportacionWaitOverlay` + maxDuration 300 | PP-16 |
| P4 | Import falla prod | Python no en Vercel | Motor TS `proforma-programado-engine.ts` | `644f091` |
| P5 | Botón borrar no responde prod | Python borrar | `borrarImportacionTs` | PP-16 |
| P6 | «Hay ventas» al borrar · Web=0 | Gate usaba `pares_vendidos` reserva FI | Gate = `venta_transito` + FI CONFIRMADA | [CHUSAR_BORRAR_IMPORT](./CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO.md) |
| P7 | **Shop 286 = 5 marcas fantasma** | `inferProformaDetalleFromPpdAndIcs` ignoraba Excel | Preview SHOP×BRAND canónico · `_shop` desde col J | PP-28 · [CHUSAR_RECONSTRUCCION_SHOP](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) |
| P8 | Precio FI solo LPN | Motor una columna | `aritmetica-programado.ts` 4 tiers LPC | PP-16 |
| P9 | FOB descuentos mal | % tratado como fracción 0–1 | `calcFobAjustadoPct` divide `/100` | PP-16 |
| P10 | KPI `total_vendido` inflado | Sumaba vt + pares_vendidos | `GREATEST(SUM(vt), SUM(pv))` | PP-16 |
| P11 | Badge LP falso positivo | Join naive FI↔IC | Join vendedor + pares cercanos | `detail-query.ts` |

### 6.3 Pilares en import

| Pilar | Fuente Excel | Regla |
|-------|--------------|-------|
| `linea` + `referencia` | STYLE | `parsear_linea_referencia` |
| `material` / `color` | MATERIAL CODE / COLOR CODE | Enriquecimiento no inverso |
| `grades_json` | Curva CALCE | Matriz grada · `_shop` col J |

Doc leyes: `.cursor/rules/politicas-importacion-pilares.mdc`

---

## 7 · Fase D2 — Administrador IC + Protocolo Chusa

**Ruta:** `…/pedido-proveedor/[ppId]?tab=admin-ic`  
**Doc:** [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) · [PROTOCOLO_CHUSA](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md)

### 7.1 UI canónica (2026-07-11)

| Elemento | Estado |
|----------|--------|
| 2 columnas IC \| PF | ✅ |
| Panel central DnD | ⛔ eliminado camino feliz |
| Botón **Generar N facturas · un clic** | ✅ Protocolo Chusa N3 |
| Overlay ~2 min | ✅ |
| Celebración post-lote | ✅ `ChusaLoteCelebracionOverlay` |

### 7.2 Protocolo Chusa — 3 niveles

```
N1: contador IC === contador PF
    ↓
N2: canon renglón × renglón (cliente · marca · cant.)
    ↓
N3: botón lote habilitado
```

Desajuste vendedor → corregir IC en `?tab=ics` · PF = verdad en cantidad/caso.

### 7.3 Errores y soluciones — Admin IC / Lote FI

| # | Síntoma | Causa | Solución |
|---|---------|-------|----------|
| A1 | POST lote **400** · IC 1168 | PPD sin LPN | Fallback LPN en `loadSkusPpd` |
| A2 | Parejas incoherentes | Body cliente ≠ servidor | `construirParejasLoteChusa` solo servidor |
| A3 | **120 FI** vs **115 IC** | Re-ejecutar lote | Guard `n_fi > n_esperadas` → **409** |
| A4 | Página **500** | `.next` corrupto · build con dev activo | `npm run dev:clean:3000` |
| A5 | Build TSX syntax error | `))}` duplicado | Fix `PpTabAdministradorIc.tsx` |
| A6 | Saldo **124** con **0 FI** | Borrar FI no reseteaba stock | `borrarFiReservadasProgramado` |
| A7 | Saldo **124** con **115 FI** | 13 PPD omitidos sin LPN | Crear FI con `sin_lpn: true` · precio 0 · ámbar |
| A8 | UI «completada» con exceso | `loteCompleto` usaba `>=` | Igualdad exacta `===` |
| A9 | Monto/plazo IC no persistía | PATCH incompleto | PATCH `monto_bruto` + `id_plazo` |
| A10 | Canon rojo engañoso | Ring verde global | Solo rojo pulsante en 3 cols canon |

Detalle PP-28: [DOC_ADMIN_IC_LOTE_PP28](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) §4.

---

## 8 · Fase E — Tab FI · CSV veneno · cierre

**Ruta:** `…/pedido-proveedor/[ppId]?tab=fi`  
**Doc:** [CHUSAR_PP_TAB_FI](./CHUSAR_PP_TAB_FI.md) · [CHUSAR_CSV_VENENO_CARLOS](./CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md)

### 8.1 Secuencia post-lote

| Paso | Acción | PASS |
|------|--------|------|
| 1 | Verificar **115 FI** RESERVADA | Contador tab FI = IC |
| 2 | Revisar líneas **ámbar sin LPN** | ~13 en PP-28 · precio 0 |
| 3 | KPI cabecera **Saldo = 0** | Todos PPD reservados |
| 4 | Export **CSV veneno** | `8051-26.csv` · bloques SHOP |
| 5 | Smoke instrumento venta AM | [CHUSAR_PROGRAMADO_INSTRUMENTO_VENTA_AM](./CHUSAR_PROGRAMADO_INSTRUMENTO_VENTA_AM.md) |

### 8.2 Errores prod conocidos (workaround)

| Feature | Motivo | Workaround |
|---------|--------|------------|
| PDF FI | Sin Python Vercel | Local · Claude Code |
| Recalcular FI masivo | Solo Python | `/recalcular-fi` local |
| Deploy prod | Solo Claude Code + Director | Local hasta orden |

---

## 9 · Tabla casos reales PP PROGRAMADO

| PP | Registro | Proforma | IC | PPD | FI | Estado | Doc |
|----|----------|----------|----|----|-----|--------|-----|
| 15 | PP-2026-0015 | 8604/2026 | 10 | — | — | Referencia protocolo | PROTOCOLO_IMPORT |
| **16** | PP-2026-0016 | 8600-4121 | 39 | 722 | 39 | ✅ Cerrado | [CHUSAR_PP16](./CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md) |
| **17** | PP-2026-0017 | 5436/2026 | 98 | — | — | 🟡 Handoff | [CHUSAR_PP17](./CHUSAR_PP17_TERCERA_PROFORMA_PROGRAMADO.md) |
| 19 | PP-2026-0019 | 8051/2026 | 108 | — | — | Expone límite 1IC=1FI | CHUSAR_ADMIN_IC |
| **28** | PP-2026-0019 | 8051/2026 | **115** | 912 | **115** | 🟢 Piloto Chusa | [DOC PP-28 lote](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) |

---

## 10 · Inventario código (por fase)

| Fase | Archivos principales |
|------|---------------------|
| Motor | `evento-pilares.ts` · `PilaresBulkResolver` · rutas importación precios |
| Import proforma | `proforma-programado-engine.ts` · `proforma-snapshot.ts` · `aritmetica-programado.ts` |
| Admin IC | `PpTabAdministradorIc.tsx` · `administrador-ic-monto.ts` · `administrador-ic-generar-fi.ts` |
| Lote API | `generar-fi-lote/route.ts` |
| KPI / saldo | `detail-query.ts` · `proforma-programado-engine.ts` (`borrarFiReservadasProgramado`) |
| UI FI | `PpFiCard.tsx` · `linea-snapshot-display.ts` |

---

## 11 · Operaciones de rescate (reintentos)

### 11.1 Borrar import proforma

**Cuándo:** PPD corrupto · `_shop` mal · reimport limpio.  
**Gate:** sin FI CONFIRMADA · sin `venta_transito`.  
**Doc:** [CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO](./CHUSAR_BORRAR_IMPORT_PROFORMA_PROGRAMADO.md)

### 11.2 Borrar FI RESERVADA + reset stock

**Cuándo:** lote duplicado (120 vs 115) · reintentar Chusa.  
**Función:** `borrarFiReservadasProgramado(ppId)` — restaura `pares_vendidos`.

### 11.3 Dev server limpio

```powershell
cd report; npm run dev:clean:3000
```

**Cuándo:** MODULE_NOT_FOUND · 500 · `.next` corrupto.

---

## 12 · Checklist réplica — todos los PP PROGRAMADO

Por cada PP en `?ramo=programado`:

| # | Check | PASS |
|---|-------|------|
| 1 | Evento precios cerrado vinculado | ☐ |
| 2 | ICs AUTORIZADAS → DIGITADAS en PP | ☐ |
| 3 | Import proforma · preview SHOP×BRAND OK | ☐ |
| 4 | PPD > 0 · `_shop` canónico Excel | ☐ |
| 5 | Admin IC · N1+N2 Chusa verde | ☐ |
| 6 | Sin FI corruptas previas (o borrar) | ☐ |
| 7 | Lote un clic · overlay ~2 min | ☐ |
| 8 | IC = PF = FI (exacto) | ☐ |
| 9 | Saldo KPI = 0 | ☐ |
| 10 | Revisar ámbar sin LPN | ☐ |
| 11 | CSV veneno export | ☐ |

**Orden sugerido mañana:** PP-28 smoke → CSV → PP-17 → resto lista programado.

---

## 13 · Handoff 2026-07-12

| Prioridad | Tarea |
|-----------|-------|
| 🔴 | Smoke PP-28 completo (§12 filas 7–10) |
| 🔴 | CSV 8051-26 |
| 🟡 | Réplica PP-17 (98 IC) con checklist §12 |
| 🟡 | Script wrapper `borrarFiReservadasProgramado` |
| ⬜ | Validación Chusa 100% server-side |
| ⬜ | Deploy prod (solo Claude Code) |

**Etapa viva:** `ADMIN-IC-PP28-20260711` · [ACTUAL.md](../../../4_etapas/ACTUAL.md)

---

## 14 · Referencias cruzadas

| Doc | Código | Tema |
|-----|--------|------|
| [CHUSAR_CICLO_IMPORTACION_REPORT](./CHUSAR_CICLO_IMPORTACION_REPORT.md) | 2.3.1.7 | Hub padre |
| [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) | 7.5.3.3 | Import Excel |
| [CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE](./CHUSAR_PP16_PROGRAMADO_EXITO_DETALLE.md) | 7.5.3.3.4 | Primer éxito real |
| [CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28](./CHUSAR_RECONSTRUCCION_SHOP_PROFORMA_PP28.md) | 7.5.3.7 | Fix _shop |
| [PROTOCOLO_CHUSA_ADMIN_IC_LOTE](./PROTOCOLO_CHUSA_ADMIN_IC_LOTE.md) | 7.5.3.5.1 | Lote |
| [DOC_ADMIN_IC_LOTE_PP28](./DOC_ADMIN_IC_LOTE_PROGRAMADO_PP28_ERRORES_SOLUCIONES_20260711.md) | 7.5.3.5.3 | Sesión 11/07 |
| [CHUSAR_DEPLOY_ALFREDO_20260709](./CHUSAR_DEPLOY_ALFREDO_20260709.md) | 7.5.3.3.6 | Prod fixes |
| [CHUSAR_INYECCION_DATOS_TRANSITO_IC](./CHUSAR_INYECCION_DATOS_TRANSITO_IC.md) | 7.3.3 | Batch IC |

---

**Documenta 2026-07-11 — Proceso PROGRAMADO completo · todos los errores y soluciones · handoff réplica · Director.**
