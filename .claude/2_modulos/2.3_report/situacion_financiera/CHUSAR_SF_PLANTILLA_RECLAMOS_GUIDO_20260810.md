# Plantilla · Registro reclamos Guido (Sit Fin / Faro)

**Código:** **2.3.1.50.20**  
**Fecha:** 2026-08-10  
**Keyword:** **Documenta**  
**Uso:** copiar una fila por reclamo · no parchear JSON molecular

| # | Fecha | Concepto Sit Fin | Canon (07/08 path) | TXT / programa if* | Δ / síntoma | Decisión Guido | Estado |
|---|-------|------------------|--------------------|--------------------|-------------|----------------|--------|
| 1 | 2026-08-10 | CHEQUES A VENCER ago | `08…01082026` = 1.943.223.316 | `1.CHEQUES…AGO26` TOTAL = 1.943.223.316 | Sit Fin −27.457.000 (parser OBS) | TXT=canon · fix parser | **cerrado** · publica `f333749` |
| 2 | 2026-08-11 | SALDO DE CLIENTES | Cuotas OK × M | Stock TXT total ~6.817M | Sin explosión cuotas | Cuadro Guido · T14 | **en_curso** · `50.30` |
| 3 | 2026-08-11 | MERCADERÍAS A ENTREGAR | Saldo det sin entrega | PV Y PROG.txt proxy | Cliente 910 sin FECHA ENTREGA | G7 · no PV | **en_curso** · `50.30` |
| 4 | 2026-08-11 | VENCIDOS 30 DÍAS | OK+Luisito M-1 | Aging crudo + SALEMMA 1323/2048 | Mal clasificados | DIF.COBRO SALEMMA | **abierto** · `50.30` |
| 5 | 2026-08-11 | VENCIDOS 60 DÍAS | OK+Luisito M-2 | Aging crudo Dias_Vencido | Idem v30 | T14 bucket M-2 | **abierto** · `50.30` |
| 6 | 2026-08-11 | PV Y PROG A COBRAR | Cuotas entrega+plazo | TSV vencimientos cols 10+ | Mal ordenado por mes | Cuadro Guido | **abierto** · `50.30` |
| 7 | 2026-08-11 | PAGO LUISITO | Cuota LUISITO × M | Stock LUISITO total ~2.015M | ≠ cuota mes | G8 regla día >20 | **abierto** · `50.30` |

**Estados:** `abierto` · `verificado_canon` · `verificado_txt` · `cerrado` · `no_aplica_sf_al`

**Ley:** Comparativa oficial = canones. Burbujas = solo canon↔TXT Jul/Ago. SF AL no decide.
