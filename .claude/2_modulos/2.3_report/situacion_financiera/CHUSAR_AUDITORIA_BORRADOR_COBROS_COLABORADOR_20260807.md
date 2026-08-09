# CHUSAR — Auditoría borrador cobros colaborador → constitución SF

**Código:** **2.3.1.50.1**  
**Fecha:** 2026-08-07  
**Keyword:** Documenta · Protocolo Chusar Activado  
**Constitución:** [CHUSAR_SITUACION_FINANCIERA_RIMEC_CONSTITUCION_20260806.md](./CHUSAR_SITUACION_FINANCIERA_RIMEC_CONSTITUCION_20260806.md) (**2.3.1.50**)  
**Intake:** `report/scripts/situacion-financiera/intake/colaborador-20260807/`  
**Etapa:** `SITUACION-FINANCIERA-RIMEC-20260806` · FOCO reabierto  
**🆕 MOISES post-20260807 · 2026-08-07**

---

## 0 · Veredicto (una línea)

El colaborador **no entregó** el módulo Situación financiera NIIF. Entregó un **motor offline de control de cobros** (proyectado vs cobrado por bucket / flujo de caja del mes) + HTML interactivo. **Se acepta como insumo SF-MAPA (CxC / DSO / flujo operativo).** **Se rechaza** como producto final Report `/situacion-financiera`.

---

## 1 · Qué sí aporta

| Aporte | Uso en constitución |
|--------|---------------------|
| Linaje factura → bucket → forma de pago (caja / cheque / ret / desc) | Espíritu **F2** (linaje) en CSV |
| Separación previsto vs cobrado | Espíritu **F3** (hecho ≠ estimado) |
| Aging / vencidos 30–60 / difícil cobro | Insumo **DSO** y semáforo CxC (§4.2) |
| Cruce proyección × pagos ERP (TXT→CSV vía `limpiador.py`) | Prototipo pipeline de fuentes externas |
| Conceptos de flujo de caja operativo RIMEC (buckets) | Puente a flujo operativo / CCC (parcial) |
| No toca Sales Report | Cumple **F4** |

---

## 2 · Qué no es

| No es | Por qué |
|-------|---------|
| Estados IAS 1 / flujos IAS 7 completos | Solo cobros/CxC operativo |
| Ratios mandatorios §4 (corriente, CCC completo, ROE…) | Falta inventario, CxP, PnL, patrimonio |
| App Report `/situacion-financiera` | HTML local sin roles (**F7** / **F8**) |
| Una verdad en Supabase (**F1**) | Carpetas + CSV + `config_gf` ausente |
| Módulo NIIF “top banco” (**F12** como producto) | Dashboard sin mapa Nexus previo (**F10**) |

---

## 3 · Checklist F1–F12

| Principio | Estado | Nota |
|-----------|:------:|------|
| **F1** Una verdad financiera | ❌ | Offline; sin BD holding |
| **F2** Linaje obligatorio | ✅ espíritu | Filas CSV con factura/cuota/bucket |
| **F3** Hecho ≠ estimado | ✅ espíritu | Previsto vs cobrado separados |
| **F4** Sales Report blindado | ✅ | Sin JOIN a `registro_ventas_general_v2` |
| **F5** Pilares ≠ contabilidad | ✅ | No muta pilares |
| **F6** FX explícito | ⚠ débil | Moneda en TXT ventas/cheques; no política FX módulo |
| **F7** Menor privilegio | ❌ | HTML local; sin matriz roles Report |
| **F8** Hermetismo | ❌ | Archivo local / LAB; no capa auth |
| **F9** No fiscalizar de contrabando | ✅ N/A | Retenciones como categoría de cobro, no SET |
| **F10** Evolución por etapas | ❌ como entrega | Saltó a “dashboard” sin SF-MAPA Nexus |
| **F11** Comparabilidad | ⚠ | Depende de mes `MES` y CSVs del mes; políticas no versionadas |
| **F12** Ambición top | ⚠ método | Útil para CxC; no sustituye estados/ratios NIIF |

---

## 4 · Paquete recibido (gaps)

**Presente en intake:** `analisis_cobros.py`, `limpiador.py`, TXT julio/agosto, `Tablas/clientes*.xlsx`, `condiciones_pago.csv`.

**Ausente (script no corre solo):**

- `config_gf.py` (`BASE_GF`, `MES`, `ANON`)
- `detalle_auditable_*.csv` (proyección)
- CSV pagos limpio en árbol `Situacion/Informes/<MES>` / `Analisis/<MES>`
- `trazabilidad.py` / launcher LAB (si existían fuera de la carpeta)

**Smoke:** listar dependencias = FAIL de corrida hasta que el Director aporte proyección + `config_gf`. No inventar números NIIF.

---

## 5 · Mapa conceptual: cobros → DSO / CCC / flujo operativo

```
TXT ERP (pagos, saldos, ventas, cheques)
        → limpiador.py → CSV
        → (+ detalle_auditable proyección)
        → analisis_cobros.py
        → buckets previsto/cobrado + aging

Insumo SF-MAPA (v1 cobros):
  CxC saldo / aging  →  DSO
  Cobros del periodo →  numerador flujo operativo (parcial)
  CCC = DIO + DSO − DPO  →  este borrador solo aporta DSO (y flujo cobros);
                            DIO/DPO = otras fuentes (stock / CxP) — fuera de este intake
```

**Siguiente paso concreto:** [CHUSAR_SF_MAPA_COBROS_V1_20260807.md](./CHUSAR_SF_MAPA_COBROS_V1_20260807.md) — columnas pipeline + candidatas Supabase. **No** reescribir NIIF desde el HTML de ~2000 líneas.

---

## 6 · Decisiones de integración (Director / agente)

| Decisión | Valor |
|----------|-------|
| ¿Es el módulo SF? | **No** |
| ¿Se archiva intake? | **Sí** (inmutable) |
| ¿Se porta HTML a Report ya? | **No** (norte UI = tablero gerencial + motor ratios §6 constitución) |
| ¿FOCO etapa? | **Sí** — reabierto 2026-08-07 |
| ¿Sales Report? | **Blindado** — prohibido cruzar |

---

## 7 · Registro

| Campo | Valor |
|-------|-------|
| Auditor | Cursor (Auto) |
| Orden | Implementar plan auditoría cobros → constitución SF · Documenta implícita en plan + ejecución |
| Índice | [INDICE.md](./INDICE.md) |
