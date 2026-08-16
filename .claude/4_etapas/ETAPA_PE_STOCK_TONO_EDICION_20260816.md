# ETAPA — Stock PE · filtro + edición TONO (una verdad)

**Código etapa:** `PE-STOCK-TONO-EDICION-20260816`  
**Subcuenta Moria:** **2.3.5.3.2**  
**Keyword:** **Documenta** · **abre esta etapa**  
**Abierta:** 2026-08-16  
**Estado:** 🟡 **EN CURSO**  
**CHUSAR:** [CHUSAR_PE_STOCK_TONO_FILTRO_EDICION_20260816.md](../2_modulos/2.3_report/pilares/CHUSAR_PE_STOCK_TONO_FILTRO_EDICION_20260816.md)  
**App:** Report `http://localhost:3000/stock-pronta-entrega`  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible · `5.01.00.025`

---

## Objetivo

Habilitar en **Stock Pronta Entrega**:

1. **Filtro TONO** en cabecera (círculos + Sin asignar).  
2. **Edición de tono** en el círculo de la tarjeta (junto a marca) → PATCH al pilar `color.tono_canon`.  
3. **Una sola fuente de verdad** = Administrador `/pilares/color` · todas las apps consumen.

---

## Alcance

| Incluye | No incluye |
|---------|------------|
| UI PE Operativa · `PeCardMiniatura` · cabecera filtro | Sales Report |
| Reusar `color_tono_estandar` + API pilares | Nuevo modelo de tono |
| Paridad visual con filtro TONO Web/Tablet | Deploy prod sin cierre |

---

## Sub-etapas

| ID | Entregable | Estado |
|----|------------|--------|
| PE-TONO-1 | Spec CHUSAR + mapa herramientas | ✅ |
| PE-TONO-2 | Filtro cabecera PE | ✅ |
| PE-TONO-3 | Editor círculo tarjeta + PATCH | ✅ |
| PE-TONO-3b | Confirmación cable Admin↔PE + Documenta | ✅ 2026-08-16 · una verdad `color.tono_canon` |
| PE-TONO-3c | Deploy Report (orden Director) | 🟡 este turno |
| PE-TONO-4 | Smoke PE ↔ Web/Tablet misma etiqueta | ⏳ |
| PE-TONO-5 | Cierre etapa + `etapas.json` | ⏳ |

---

## FOCO previo pausado

Diccionarios traductores **2.3.5.6** — queda en mapa pendientes; no cerrado.

---

## Cierre Navegador (:3004) — al cerrar

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → `trabajoVivo[].estado` = `"hecho"` | ☐ |
| Entrada en `cerradasPorModulo.report` | ☐ |
| `actualizado` bump | ☐ |
| Verificado `:3004/etapas` | ☐ |

---

**Shibboleth:** Andrés, el que viene.
