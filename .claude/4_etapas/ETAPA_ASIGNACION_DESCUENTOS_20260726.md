# ETAPA — Asignación de descuentos PE (dictador)

**Código etapa:** `ASIGNACION-DESCUENTOS-PE-20260726`  
**Código Moria:** **2.3.1.10.1.4** (Report Stock PE) · **2.2.1.26** (RIMEC Web · factura/aprobaciones)  
**Estado:** 🟢 **EN CURSO** · foco maratón  
**Fecha apertura:** 2026-07-26  
**Keyword Director:** Nueva etapa · Documenta · Documentación Chusar  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

Centralizar el descuento de **Pronta entrega**: ya no lo define el vendedor «a gusto». Un **impositor / dictador** en Report Stock PE asigna el %; RIMEC Web lo incrusta en el artículo; la factura sale con ese descuento. Si el vendedor altera el %, Aprobaciones lo **pinta** (sombra) para que el admin lo vea.

---

## Ley acordada (Director 2026-07-25/26)

| # | Regla |
|---|--------|
| 1 | Descuento = **porcentaje** · entero o decimal (ej. **7.5**) |
| 2 | Se aplica a **todas las moléculas** del universo filtrado (dato de grilla / molécula) |
| 3 | El vendedor **puede** subir, bajar o alterar el % — libertad total en carrito |
| 4 | Aprobaciones: casilla **blanca** = % dictado intacto · **sombreada** = editado por vendedor |
| 5 | Botón en barra **FILTRO CATÁLOGO RIMEC WEB** (`/stock-pronta-entrega`) activa el módulo |
| 6 | Modo activo → **desaparecen las grillas**; trabajo **inverso**: filtrar → asignar % |
| 7 | El % viaja a **RIMEC Web** e incrusta en artículo → factura con descuento |
| 8 | **Ley general de descuentos** + **división FI** (PE cadenas · CP casos · marca) + **LP03 grado 1 = +10 %** — ✅ documentada 2026-07-26 |

---

## UX Report (modo Asignación)

1. Usuario pulsa botón **Asignación de descuentos** (junto a TODOS / NORMAL / PROMO / LIQ / COMUN).
2. Grilla + vitales de producto **se ocultan**.
3. Quedan filtros DIMENSIONES / MOLÉCULA (+ barra filtro catálogo).
4. Con el universo filtrado, el sistema pide **asignar descuento** (%).
5. Confirmación → persistencia → sync Web.

---

## Apps tocadas

| App | Rol |
|-----|-----|
| Report `:3000` `/stock-pronta-entrega` | Botón · modo sin grilla · asignación % |
| RIMEC Web `:3001` | Incrustar % en artículo · carrito · factura |
| Report Aprobaciones | Pintar casilla si vendedor editó % |

---

## Sub-etapas

| Code | Qué | Estado |
|------|-----|--------|
| ASIG-DOC | Documentación Chusar + etapa | ✅ |
| ASIG-LEY | Ley general descuentos + LP03 + 4 grados | ✅ |
| ASIG-DIV-FI | Split FI: PE NORMAL/PROMO/LIQ/COMUN · CP casos · marca | ✅ |
| ASIG-UI-PE | Botón + modo inverso Stock PE | ⏳ |
| ASIG-PERSIST | Persistencia % por molécula + API sync | ⏳ |
| ASIG-WEB | Incrustar en Web · factura | ⏳ |
| ASIG-APROB | Pintura blanco/sombra en Aprobaciones | ⏳ |
| ASIG-SMOKE | Pruebas E2E (meta: mañana) | ⏳ |

---

## Doc Chusar

[CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md) (**2.3.1.10.1.4**)  
Anexo ley: [CHUSAR_LEY_DIVISION_FI_LP03_20260726.md](../2_modulos/2.3_report/deposito_rimec/CHUSAR_LEY_DIVISION_FI_LP03_20260726.md) (**2.3.1.10.1.4.1**)

---

## Prohibido

- Deploy prod sin cierre de etapa u orden directa Director.
- Dejar que el vendedor sea la **fuente** del descuento (solo puede alterar con traza).
- Mezclar Sales Report / pilares ajenos.
