# CHUSAR — Admin LR · Botón PE = SDRM venta hoy (estilos priorizados)

**Código:** **2.3.5.12**  
**Fecha:** 2026-08-17  
**Keyword:** Documenta + ejecuta (Director: absorción Bazzar · vendibles SDRM · **maestra → FK filtros**)  
**App:** Report `:3000/pilares/linea-referencia`  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**Padres:** **2.3.5.11** UI/filtros · **2.3.5.10** estilo 638  
**🆕 MOISES · 2026-08-17** · ratificado Director 2026-08-17 (ley FK)

---

## 0 · Situación real (qué / cómo / Andrés)

| Pregunta | Respuesta |
|----------|-----------|
| **¿Qué pasó?** | Al absorber stock Bazzar en SDRM/PE quedaron **gemelos** (mismo código línea en 654 y 638). El botón Pronta entrega listaba PE sin exigir stock SDRM vendible → sandalias 654 en admin confecciones. |
| **¿Qué hay que hacer ahora?** | Al pulsar **📦 Pronta entrega**, el universo = artículos **disponibles para vender hoy**: PE ∩ SDRM con `tipo_movimiento=stock` y `cantidad>0`, mismo `tipo_v2`/`proveedor`. |
| **¿Para qué?** | Priorizar **estilos** de lo que hay que vender desde hoy (cascada Estilo ordenada por count del universo PE) **sin olvidar** que lo que se edita es la **maestra L×R**. |

---

## 0.1 · Ley madre — maestra L×R → FK de todos los filtros (inviolable)

**Esta pantalla edita una de las tablas maestras más importantes del holding.**

| Capa | Rol |
|------|-----|
| **`linea` + `linea_referencia`** (+ estilo · tipo 1 · marca · género) | **Única verdad** de FKs comerciales |
| **SDRM / PE / CP** | Solo **scope** (qué filas priorizar / editar hoy) — **no** son la verdad de filtros |
| **RIMEC Web · Alejandro Magno · Stock PE · cascadas** | **Consumen** esas FKs (`grupo_estilo_id`, `tipo_1_id`, `marca_id`, …) |

### Reglas

1. Todo PATCH de estilo / tipo 1 / marca / género en Admin LR **escribe la maestra**. Esa FK es la que verán **todos** los filtros del proyecto.  
2. **Prohibido** inventar, pisar o cruzar FKs desde staging SDRM o PE (absorción Bazzar ≠ fuente de verdad).  
3. **Prohibido** cruzar 654↔638 por `codigo_proveedor`: match siempre por `linea_id` + `proveedor_id` / `tipo_v2_id`.  
4. SDRM/PE **delimitan el universo de trabajo**; no sustituyen ni contaminan la maestra.  
5. Sales Report (`registro_ventas_general_v2`) sigue **blindado** — no pilares.

> Si se rompe una FK acá, se rompen los filtros en Web, AM y depósitos. Tratar cada auto-guarda como cambio de contrato del holding.

---

## 1 · Ley del botón (scope venta hoy)

1. **📦 Pronta entrega** = filtro **SDRM venta hoy** (scope sobre la maestra, no catálogo fantasma).  
2. SQL: `stock_pronta_entrega_rimec` ∩ `registro_st_vt_rc_reposicion` con:
   - `pe.tipo_v2_id` + `pe.proveedor_id` estrictos (638↔654 no se cruzan)
   - `s.tipo_movimiento = 'stock'` y `s.cantidad > 0`
   - match por **`linea_id`** (no por código proveedor)
   - depósito (`D1`/`DEP2`/`D3`) solo en PE  
3. Al activar PE: limpia molécula (cascada) y abre bloque Molécula.  
4. **Estilo · multi** consume **`cascada.estilos`** (count DESC del filtro), no el catálogo plano `maestras.estilos`.  
5. Título UI con PE activo: **Estilo · venta hoy · multi**.  
6. Cabecera Admin recuerda: **maestra → FK filtros · SDRM/PE = solo scope**.

---

## 2 · Qué no es

| No | Sí |
|----|-----|
| Listar todo PE histórico / fantasma | Solo PE con stock SDRM positivo (scope) |
| Match por `codigo_proveedor` (gemelos) | Match por `linea_id` + tipo |
| Estilos alfabéticos del maestro en molécula PE | Estilos priorizados por volumen vendible |
| SDRM como dueño de estilo/tipo | **Maestra L×R** dueña de FKs |

Sales Report sigue **blindado**.

---

## 3 · Archivos

| Archivo | Cambio |
|---------|--------|
| `report/src/lib/pilares/queries.ts` | PE ∩ SDRM stock qty>0 · cascada estilo · comentario ley FK |
| `PilaresLrFiltrosSidebar.tsx` | Botón PE → venta hoy · estilos cascada · hint scope/maestra |
| `LineaReferenciaAdminClient.tsx` | Cabecera + banner ley FK |
| `LineaReferenciaEditor.tsx` | Aviso al aplicar masivo sobre maestra |
| `scripts/_smoke_lr_filtro_pe_deposito.ts` | Assert sin gemelos 654 |

Smoke: `npx tsx scripts/_smoke_lr_filtro_pe_deposito.ts` → **PASS_LR_PE_DEPOSITO**

---

## 4 · Smoke Director

1. `:3000/pilares/linea-referencia?tipo_v2_id=2` → cabecera / banner **FK filtros**.  
2. Pulsar **📦 Pronta entrega** → total baja · hint scope · Estilo con counts.  
3. Códigos gemelo 8571/8585 **no** aparecen en 638 PE.  
4. Cambiar un estilo en grilla = muta `linea_referencia` (maestra), no staging.  
5. F5 conserva `origen_tipo=PRONTA_ENTREGA` en URL.

---

## Relacionados

**2.3.5.11** re-arq filtros · **2.3.5.10** col J · **2.3.5.5.1** siameses · **2.3.5.19** STOCK Todos/CP/PE · absorción Bazzar / PE pipeline · siameses filtro Tipo Web/AM
