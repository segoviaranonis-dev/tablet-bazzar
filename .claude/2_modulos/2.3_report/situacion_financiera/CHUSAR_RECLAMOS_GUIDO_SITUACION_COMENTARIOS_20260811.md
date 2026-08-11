# CHUSAR — Reclamos Guido · hoja «Situacion Comentarios» (08 SF AL)

**Código:** **2.3.1.50.30**  
**Fecha:** 2026-08-11  
**Keyword:** **Documenta** · **despliega**  
**Fuente:** `Z:\hector\SF\08.SITUACION FINANCIERA 01082026.xlsx` · pestaña **Situacion Comentarios**  
**Capturas:** `temp/sf_guido_comentarios/image1–5.png`  
**Padres:** `2.3.1.50.11` (G1–G11) · `2.3.1.50.20` (plantilla) · `2.3.1.50.28` (P4/P5/P7)

> **Principio:** Guido es director de finanzas y canon operativo. Nexus **no debate** — documenta, alinea y cablea su lógica (`cuadro_vencimientos_html.py` · `analisis_cobros.py`).

---

## 0 · Mensaje para Guido (Héctor puede reenviar)

Guido: recibimos los seis comentarios de la hoja **Situacion Comentarios** del Excel del 01/08. Tenés razón en los seis puntos: Nexus hoy mezcla **stock de corte TXT** con **proyección por cuotas** que vos ya resolviste en el cuadro. Estamos cableando tu motor (`explotar_cuotas` + `clientes.xlsx` + `condiciones_pago.csv`) al pipeline y a Report. La pestaña **Reclamos Guido** en `/situacion-financiera` refleja respuesta fila por fila. Gracias por la paciencia y por las capturas — especialmente cliente 910 sin fecha entrega y SALEMMA 1323/2048.

---

## 1 · Comentario 1 — SALDO DE CLIENTES

| Campo | Valor |
|-------|-------|
| **Texto Guido** | Tomar **SALDO CLIENTES DETALLADO AL 03-08**; sumar **por cuota** según plazo de factura; solo clientes **OK**; vencimiento hasta **último día hábil del mes**. |
| **Captura** | `image2.png` — UI SF con nota «explosión cuotas Guido pendiente» |
| **Regla canon** | G4 · `construir_conceptos` → `saldo_cli` = `{OK}` × bucket **M** (`ago-26`) |

### Qué hace Nexus hoy

- Parser `parse_saldos_detallado` suma **stock total** del TXT (~6.817M Gs) sin tipo cobro ni cuotas.
- Celda Sit Fin = manual / pendiente; molecular replica el mismo total para todos los meses.
- Motor Guido (`explotar_cuotas`) **existe** en intake colaborador pero **no alimenta** `generar_sit_fin.py`.

### Respuesta a Guido

**Tenés razón.** El número de la fila no es el saldo bruto del TXT: es la **suma de cuotas OK** cuyo vencimiento cae en el mes del informe (hasta último día hábil). Nexus lo tenía marcado como pendiente explícitamente; no es un descuido tuyo — es deuda nuestra P7/P4.

### Acción

| Prioridad | Tarea | Estado |
|-----------|-------|--------|
| P7 | Cablear `explotar_cuotas` → T14 `sf_proyeccion_cuota` → fila SALDO DE CLIENTES | **abierto** · Ola 2 |
| UI | Pestaña Reclamos + acordeón molecular «explosión cuotas» documentado | **hecho** 2026-08-11 |

---

## 2 · Comentario 2 — MERCADERÍAS A ENTREGAR

| Campo | Valor |
|-------|-------|
| **Texto Guido** | **No** PV y PROG. Tomar saldo detallado; facturas **sin fecha entrega** en el TXT. |
| **Captura** | `image3.png` (PV/PROG en mercadería) · `image4.png` — cliente **910**, facturas **9124771** y **9125426** sin **FECHA ENTREGA** |
| **Regla canon** | G7 · fila cuadro **A ENTREGAR** · entrega asumida día 4 si falta fecha |

### Qué hace Nexus hoy

- Molecular `mercaderia:{mes}` = **mismo nodo que** `pv:{mes}` desde **PV Y PROG.txt** (~5.825M ref).
- Mapa canon fila 13: `origen: excel_prevision` pero ref cruzada incorrecta a PV.

### Respuesta a Guido

**Correcto.** Mercadería a entregar viene del **saldo detallado** (operación real sin `Fecha_Entrega`), no del universo PV/PROG. La captura del 910 confirma el patrón: facturas con saldo y campo entrega vacío. Nexus usó PV como atajo; lo retiramos de esa fila.

### Acción

| Prioridad | Tarea | Estado |
|-----------|-------|--------|
| P7 | `build_mercaderia()` desde saldo det + regla G7 (no PV TSV) | **abierto** |
| Parser | Enriquecer `parse_saldos_detallado` con columna `Fecha_Entrega` cuando TXT la trae | **abierto** |
| Doc | Separar molecular `mercaderia:*` ≠ `pv:*` en mapa | **hecho** 2026-08-11 |

---

## 3 · Comentario 3 — VENCIDOS A 30 DÍAS

| Campo | Valor |
|-------|-------|
| **Texto Guido** | Solo **OK + Luisito**, cuotas **1–30 días**; clientes **1323** y **2048** (SALEMMA) → **difícil cobro**, no aquí. |
| **Captura** | `image5.png` — códigos 1323/2048 en vencidos 30 |
| **Regla canon** | `venc30` = `{OK, LUISITO}` × bucket **M-1** (jul-26 para informe ago) |

### Qué hace Nexus hoy

- `aging["v30"]` = Σ saldo donde `0 < Dias_Vencido <= 30` **sin filtro tipo cobro** (~1.644M Gs AUTO).
- SALEMMA entra en aging OK porque el TXT no trae tipo cobro; el filtro vive solo en scripts colaborador.

### Respuesta a Guido

**Totalmente de acuerdo.** Vencidos 30 del Sit Fin no son el aging crudo del ERP: son cuotas OK/Luisito del mes anterior. SALEMMA (1323, 2048) va a **DIF.COBRO** — ya lo tenemos en molecular `dificil:*` pero el pipeline AUTO de v30 aún no lo excluye.

### Acción

| Prioridad | Tarea | Estado |
|-----------|-------|--------|
| P5 | Reemplazar `Dias_Vencido` crudo por cuota + tipo cobro + bucket M-1 | **abierto** |
| P5 | Excluir SALEMMA/DIFICIL de filas v30/v60 Sit Fin | **abierto** |
| Molecular | `build_tipo_cobro_saldo_txt` ya segrega SALEMMA → DIF.COBRO | **referencia** |

---

## 4 · Comentario 4 — VENCIDOS A 60 DÍAS

| Campo | Valor |
|-------|-------|
| **Texto Guido** | Igual que v30 pero **31–60 días**, **OK + Luisito**. |
| **Regla canon** | `venc60` = `{OK, LUISITO}` × bucket **M-2** |

### Qué hace Nexus hoy

- Misma brecha que C3: `31 <= Dias_Vencido <= 60` (~197M Gs) sin tipo cobro.

### Respuesta a Guido

**Misma lógica que el punto 3** — aplicamos bucket M-2 y filtro OK/Luisito. No replicamos SALEMMA ni aging total ERP en esta fila.

### Acción

| Prioridad | Tarea | Estado |
|-----------|-------|--------|
| P5 | Unificar fix C3+C4 en motor cuotas T14 | **abierto** |

---

## 5 · Comentario 5 — PV Y PROG A COBRAR

| Campo | Valor |
|-------|-------|
| **Texto Guido** | Total ago/set/oct cuadra con TXT pero **mal ordenado**; cuotas por **Fecha Entrega + plazo** en el mes correcto. |
| **Captura** | `image1.png` — fórmula Excel `SI(O(Plazo-rmc="CONS";"OBS"); ImporteTotalCuotas; suma buckets − PAGADO)` |
| **Regla canon** | G4 · PV/OK del saldo detallado con explosión cuotas (no confundir con TSV PV Y PROG crudo) |

### Qué hace Nexus hoy

- `parse_pv_prog` suma `Importe_Cuota` por fechas embebidas en cols 10+ del TSV.
- Total ref ~5.825M puede coincidir en magnitud pero **distribución mensual** no sigue Fecha Entrega + condiciones de pago.

### Respuesta a Guido

**El total nos orienta; la forma no.** Entendemos la fórmula del Excel: CONS/OBS van distinto; el resto es suma de buckets menos pagado. Nexus debe proyectar cuotas desde entrega + plazo (`condiciones_pago.csv`), no confiar solo en vencimientos precocinados del TSV.

### Acción

| Prioridad | Tarea | Estado |
|-----------|-------|--------|
| P7 | PV mes desde cuadro Guido / T14, no `parse_pv_prog` directo en Sit Fin | **abierto** |
| UI | Documentar fórmula Guido en pestaña Reclamos | **hecho** 2026-08-11 |

---

## 6 · Comentario 6 — PAGO LUISITO

| Campo | Valor |
|-------|-------|
| **Texto Guido** | Cuotas a vencer en el mes, TIPO COBRO **Luisito**. |
| **Regla canon** | G8 · `pago_lui` = `{LUISITO}` × bucket **M** · entrega día >20 → día 5 mes siguiente |

### Qué hace Nexus hoy

- Molecular `luisito:{mes}` = **stock total** LUISITO del TXT (~2.015M) replicado en todos los meses.
- Celda Excel PAGO LUISITO = manual; ≠ cuota del mes.

### Respuesta a Guido

**Correcto.** Luisito en el Sit Fin es **cuota del mes**, no saldo acumulado de cartera LUISITO. La regla día >20 ya está en tu cuadro; Nexus debe usarla al poblar T14.

### Acción

| Prioridad | Tarea | Estado |
|-----------|-------|--------|
| P4 | Separar stock TXT (acordeón audit) vs cuota mes (celda Sit Fin) | **abierto** |
| P4 | Regla G8 en pipeline | **abierto** |

---

## 7 · Observación final Guido

> Misma lógica: fecha entrega → división cuotas → TIPO COBRO → cadenas; PV y PROG hasta mes del último cobro.

**Respuesta:** Aceptado como **especificación única** para Ola 2. Un solo motor (`explotar_cuotas` + `clientes.xlsx` + `condiciones_pago.csv` + cadena Nexus) alimenta las seis filas + DIF.COBRO. No más atajos por fila.

---

## 8 · Matriz resumen

| # | Concepto | Guido manda | Nexus hoy (error) | Fix |
|---|----------|-------------|-------------------|-----|
| 1 | SALDO CLIENTES | Cuotas OK × M | Stock TXT total | T14 + cuadro |
| 2 | MERCADERÍAS | Sin entrega · saldo det | PV Y PROG.txt | G7 saldo det |
| 3 | VENC. 30 | OK+Luisito M-1 | Aging crudo + SALEMMA | Tipo cobro + cuota |
| 4 | VENC. 60 | OK+Luisito M-2 | Idem | Idem |
| 5 | PV Y PROG | Cuotas por entrega+plazo | TSV vencimientos | Cuadro Guido |
| 6 | PAGO LUISITO | Cuota LUISITO × M | Stock LUISITO total | G8 + T14 |

---

## 9 · UI Report

- Pestaña **Reclamos Guido** · `/situacion-financiera` · código `reclamos-guido-0308.ts`
- Plantilla filas 2–7 actualizada en `2.3.1.50.20`

---

## 10 · Shibboleth

Andrés, el que viene. Protocolo Moises Activado · Moria + ACTUAL acatados.
