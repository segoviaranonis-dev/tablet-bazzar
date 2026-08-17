# CHUSAR — PE · editores Estilo + Tipo 1 · stem imagen 654/638

**Código:** **2.3.5.17**  
**Fecha:** 2026-08-17  
**Keyword:** Documenta · implementá en local  
**Padres:** **2.3.5.3.2** TONO PE · **2.3.5.14** visión L×R · **2.3.5.9** ACT PRENDAS  
**App:** Report `:3000/stock-pronta-entrega` · tab Operativa  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES · 2026-08-17**

---

## 0 · Orden Director

1. Dos editores multi (como TONO) en cabecera PE → **Estilo** + **Tipo 1**.  
2. En tarjeta: **Estilo** y **Tipo 1** visibles + editables.  
3. Nombre de imagen: **654** `L-R-M-C` · **638** `L-C`.

---

## 1 · Ley — una verdad

| UI | Verdad | API |
|----|--------|-----|
| Filtro chips Estilo / Tipo 1 | `OperativaFilterState.grupoEstiloIds` / `tipo1Ids` | cliente |
| Editor tarjeta | `linea_referencia.grupo_estilo_id` / `tipo_1_id` | `PATCH /api/pilares/linea-referencia` |
| Stem foto | Storage · `productImagePrimaryFileName` | 654 L+R+M+C · 638 L+C |

**Prohibido:** guardar estilo/tipo1 en staging SDRM o estado UI paralelo.

---

## 2 · Código

| Pieza | Path |
|-------|------|
| Filtro multi | `PeFiltroChipsMulti.tsx` |
| Editor tarjeta | `PeEditorEstiloTipo1.tsx` |
| Cabecera | `StockProntaEntregaClient.tsx` (barra Tono+Estilo+Tipo1) |
| Tarjeta | `PeCardMiniatura.tsx` · stem siempre visible |
| Query | `queries-productos-grilla.ts` → `linea_referencia_id` |
| PATCH clear | `api/pilares/linea-referencia` · rama `id` antes del gate «al menos uno» |

---

## 3 · Smoke

1. `:3000/stock-pronta-entrega` · chips Estilo/Tipo 1 filtran grilla.  
2. Clic Estilo/Tipo 1 en tarjeta → cambia label · Admin LR refleja.  
3. Bajo foto: stem `520-59-…` (654) o `L-C` (638).  
4. Si sin L×R: chip «Sin L×R» (no edita).  
5. Tras deploy código: `?fresh=1` o invalidar cache productos PE.

---

**Documenta 2026-08-17 — PE editores estilo/tipo1 + stem imagen.**
