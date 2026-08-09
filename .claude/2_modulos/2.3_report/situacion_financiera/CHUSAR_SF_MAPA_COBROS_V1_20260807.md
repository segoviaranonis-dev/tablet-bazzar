# CHUSAR — SF-MAPA v1 · pipeline cobros / CxC (sin Sales Report)

**Código:** **2.3.1.50.2**  
**Fecha:** 2026-08-07  
**Sub-etapa:** SF-MAPA (fase 1 — cobros)  
**Auditoría:** [CHUSAR_AUDITORIA_BORRADOR_COBROS_COLABORADOR_20260807.md](./CHUSAR_AUDITORIA_BORRADOR_COBROS_COLABORADOR_20260807.md)  
**Constitución:** **2.3.1.50** §4.2 DSO · CCC (parcial) · §6 Fuentes  
**Intake:** `report/scripts/situacion-financiera/intake/colaborador-20260807/`  
**🆕 MOISES post-20260807 · 2026-08-07**

---

## 0 · Alcance y prohibiciones

| Incluye | Excluye |
|---------|---------|
| Columnas del pipeline colaborador (TXT→CSV→proyección→cruce) | JOIN a `registro_ventas_general_v2` (**F4** · Sales Report blindado) |
| Equivalencias **candidatas** en Supabase holding | Mutar pilares · asientos contables inventados |
| Puente a ratios **DSO** y tramo cobros del flujo operativo | DIO / DPO / estados IAS completos (otras fases SF-MAPA) |

---

## 1 · Pipeline físico (hoy)

```
ERP TXT fijo
  pagos | saldos | ventas | cheques_depositados | cheques_vencer
        → limpiador.py (RECETAS)
        → CSV Informes

detalle_auditable_*.csv  (proyección cuotas — AUSENTE en intake)
        + CSV pagos
        → analisis_cobros.py
        → HTML Control_Cobros_<MES>  (no producto Report)
```

Rutas esperadas por el script (`config_gf.BASE_GF`):

- Proyección: `{BASE_GF}/Situacion/Informes/{MES}/detalle_auditable*.csv`
- Pagos: `{BASE_GF}/Analisis/{MES}/*pago*.csv` o Informes

---

## 2 · Inventario de columnas

### 2.1 Proyección (`detalle_auditable` — DictReader)

| Columna | Rol en motor | Ratio / uso SF |
|---------|--------------|----------------|
| `NRO_FACTURA` | Clave linaje (norm) | CxC por documento |
| `SALDO_CUOTA` | Previsto (skip si 0) | CxC / DSO numerador parcial |
| `NOMBRE_CLIENTE` | Dimensión | Concentración clientes (§4.5) |
| `CODIGO_CLIENTE` | Dimensión / exclusiones | Maestro clientes |
| `FILA_CUADRO` | Concepto flujo | Flujo operativo buckets |
| `COLUMNA_CUADRO` | Bucket vencimiento | Aging / cascada |
| `FECHA_ENTREGA` | Fecha operativa | DSO / aging |
| `TIPO_OPERACION` | Plazo / tipo | Condición crédito |
| `FECHA_VENCIMIENTO` | Vto cuota | Aging 30/60 / difícil |
| `NUM_CUOTA` / `TOTAL_CUOTAS` | Cuota | Linaje cuota |

### 2.2 Pagos (CSV post-`limpiador` · tipo `pagos`)

| Columna | Rol | Uso SF |
|---------|-----|--------|
| `Cliente` | Nombre | Dimensión |
| `Cod_Cliente` | Código | Maestro |
| `Fecha` / `Fecha2` | Fechas movimiento | Periodo cobro |
| `Nro_Factura` | Clave cruce | Atribución cobro→factura |
| `Cod_Oper` | Operación | Clasificación |
| `Importe_Gs` | Importe línea | Control |
| `Tipo` | Forma pago → cat (caja/cheque/ret/desc/otros) | Composición cobro |
| `Num` | Referencia | Linaje |
| `Importe2` | **Importe pagado** (motor usa este) | Cobrado del periodo |

### 2.3 Saldos (CSV · tipo `saldos`)

| Columna | Rol | Uso SF |
|---------|-----|--------|
| `Nro_Factura` | Documento | Stock CxC |
| `Cod_Cliente` | Cliente | Maestro |
| `Fecha_Factura` / `Fecha_Entrega` | Fechas | Aging |
| `Tipo_Oper` / `Cod_Cob` / `Cod_Vend` | Clasificación | Crédito / vendedor |
| `Importe` / `Saldo` | Original / saldo | **CxC saldo** |
| `Dias_Vencido` | Aging nativo ERP | DSO / mora |
| `Monto2` / `Monto3` | Auxiliares ERP | Revisar semántica en LAB |

### 2.4 Ventas (CSV · tipo `ventas`) — **solo contexto crédito, no Sales Report**

| Columna | Rol | Uso SF |
|---------|-----|--------|
| `Nro_Cliente` / `Cliente` | Cliente | Dimensión |
| `Nro_Vend` / `Tipo_Oper` | Vendedor / operación | Analítica |
| `Fecha` / `Nro_Factura` | Documento | Linaje |
| `Importe` / `Moneda` / `PV` | Monto / FX / punto venta | Ventas a crédito del periodo → **denominador DSO** (fuente ERP, **no** `registro_ventas_general_v2`) |

### 2.5 Cheques

| Receta | Columnas clave | Uso SF |
|--------|----------------|--------|
| `cheques_depositados` | Banco, Nro_Cheque, Cod_Cliente, Importe, fechas | Liquidez / composición cobro |
| `cheques_vencer` | Banco, Nro_Cheque, Fecha_Vto, Importe, Moneda, Cod_Cliente | CxC instrumentada / riesgo |

### 2.6 Tablas auxiliares intake

| Archivo | Uso |
|---------|-----|
| `Tablas/clientes*.xlsx` | Maestro offline códigos/nombres |
| `Tablas/condiciones_pago.csv` | Plazos → buckets / tipo operación |

---

## 3 · Equivalencias candidatas Supabase (holding)

> **Candidatas** = hipótesis de mapeo para la siguiente iteración SF-MAPA. Validar existencia/schema en LAB antes de cablear ratios. **Prohibido** usar Sales Report histórico.

| Concepto pipeline | Candidata holding (a validar) | Notas |
|-------------------|-------------------------------|-------|
| Código / nombre cliente | Tablas maestro cliente / `usuario` comercial / catálogo clientes Rimec (nombre exacto en schema actual) | Preferir código negocio ERP = `Cod_Cliente` |
| Factura / saldo CxC | Staging o tablas operativas de facturación / cuentas a cobrar **si existen** en proyecto financiero; si no → **nueva vista `sf_cxc_*`** alimentada desde ERP o import | Hoy el intake es la fuente de verdad de cobros |
| Pagos / recibos | Misma familia staging `sf_cobros_*` / import mes | `Tipo` → enum forma pago |
| Condición pago | Catálogo plazos (par a `condiciones_pago.csv`) | |
| Ventas periodo (DSO) | Serie financiera propia / ERP ventas crédito — **nunca** `registro_ventas_general_v2` | F4 |
| Cheques | `sf_cheques_*` o columnas en cobros | |
| FX | Tabla tasas holding (§ F6) — aún no en intake | |

**Política de materialización recomendada (fase siguiente):**

1. Tablas staging inmutables por `batch_id` + mes (`sf_intake_pagos`, `sf_intake_saldos`, …).  
2. Vista linaje `sf_cxc_factura_cuota` (proyección + saldo + aging).  
3. Vista cruce `sf_cobro_atribuido` (pago→factura→bucket).  
4. Motor ratios lee **solo** vistas versionadas — no el HTML.

---

## 4 · De columnas a ratios (puente)

| Ratio constitución | Numerador / insumos de este mapa | Falta (otras fuentes) |
|--------------------|----------------------------------|------------------------|
| **DSO** | CxC (`Saldo` / suma `SALDO_CUOTA`) ÷ Ventas crédito periodo × días | Política días; definición “ventas a crédito” |
| **CCC** | DSO (este mapa) | **DIO** (stock) + **DPO** (CxP) |
| Flujo operativo cobros | Previsto/cobrado por concepto (`FILA`×`COLUMNA`) + caja/cheque/ret/desc | Capex, CxP pagos, etc. |
| Concentración clientes | Agregado por `CODIGO_CLIENTE` sobre cobros/CxC | Umbrales Director (§4.6) |
| Aging / difícil cobro | `Dias_Vencido` + buckets `COLUMNA_CUADRO` + flags DIFICIL/SALEMMA del HTML | Política semáforo |

---

## 5 · Criterio de cierre de SF-MAPA cobros v1

- [x] Inventario columnas pipeline documentado  
- [x] Candidatas Supabase listadas sin Sales Report  
- [x] Puente DSO / CCC parcial / flujo cobros  
- [ ] Validar schema real en Supabase (LAB)  
- [ ] Aportar `config_gf` + `detalle_auditable` y archivar una corrida LAB como evidencia (no NIIF)

---

## 6 · Registro

| Campo | Valor |
|-------|-------|
| Autor | Cursor (Auto) |
| FOCO | `SITUACION-FINANCIERA-RIMEC-20260806` |
| Siguiente | Validar tablas/vistas CxC en Supabase · MVP ratios con linaje |
