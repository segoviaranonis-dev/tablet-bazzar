# CHUSAR — OTROS en Estilo/Tipo1 · PE vs maestra

**Código:** **2.3.5.18**  
**Fecha:** 2026-08-17  
**Keyword:** Documenta · despliega  
**Padres:** **2.3.5.17** editores PE · **2.3.5.14** visión L×R · **2.3.5.9** AB-CR OTROS  
**App:** Report `:3000/stock-pronta-entrega`  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES · 2026-08-17**

---

## 0 · Pregunta Director

¿Existe la opción **OTROS** (estilo / tipo 1) en Stock Pronta Entrega?

---

## 1 · Auditoría BD (2026-08-17)

| Ámbito | Resultado |
|--------|-----------|
| Maestro `grupo_estilo_v2` | **Sí** — `id_grupo_estilo = 600000` · `descp = OTROS` |
| Maestro `tipo_1` | **No** — cero filas con OTROS |
| Stock PE (`stock_pronta_entrega_rimec` × L×R) | **0** filas con estilo OTROS · **0** con tipo1 OTROS · total ~11.746 |
| `linea_referencia` global | **365** L×R con `grupo_estilo_id = 600000` — **ninguna** entra al PE actual |

Script: `report/scripts/_audit_otros_pe.mjs`

---

## 2 · Por qué no se ve en UI PE

Los chips / MOLÉCULA **Estilo** y **Tipo 1** se arman desde las filas del stock filtrado (`buildOperativaOpciones` / cascada).

Sin filas PE con FK → estilo OTROS, **el chip no aparece** aunque exista en la maestra.

Confecciones PE hoy: estilos reales (CAMISETA, BLUSA, …) · Tipo1 = VERANO/INVIERNO (AB-CR), no OTROS.

**OTROS en AB-CR (2.3.5.9)** = chip de subfamilia/accesorios en sidebar — **≠** `grupo_estilo_v2.OTROS`.

---

## 3 · Plan macro (ratificado Director)

1. Fortalecer **maestra** L×R (estilo + tipo_1 en `linea_referencia`).  
2. Fortalecer **FK** en stock / PPD / vistas.  
3. Edición fácil (PE + Admin LR) → filtros de herramientas leen FK.

Ver OTROS en PE implica **asignar** estilo `600000` (o valor real) a L×R del stock PE — no inventar chip fantasma.

---

## 4 · Relacionados

- Editores PE: **2.3.5.17**  
- Visión linea vs L×R: **2.3.5.14**  
- ACT PRENDAS / chip OTROS AB-CR: **2.3.5.9**

---

**Documenta 2026-08-17 — OTROS maestro sí · PE stock no · filtros = FK del stock.**
