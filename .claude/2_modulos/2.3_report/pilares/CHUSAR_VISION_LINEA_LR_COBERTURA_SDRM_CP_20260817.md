# CHUSAR — Visión maestra · `linea` vs L×R · cobertura SDRM/CP · Medias / ACT PRENDAS

**Código:** **2.3.5.14**  
**Fecha:** 2026-08-17  
**Keyword:** Documenta · despliega :3004  
**Padres:** **2.3.5.12** (maestra→FK · scope SDRM/PE) · **2.3.5.9** (ACT PRENDAS) · **2.2.1.61** (siames AB-CR+Tipo) · **2.2.1.44** (mostrar todo)  
**App:** Admin LR `:3000/pilares/linea-referencia` · catálogos Web/AM (lectura FK)  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES · 2026-08-17**

---

## 0 · Por qué existe este doc

El Director ordenó: **no solo mirar filtros** — asegurar que **ni un artículo** de **SDRM** ni del **resultante de compra previa (CP)** quede fuera; y fijar el mapa mental **sin contradicciones** con la memoria ya sellada.

Este archivo es la **visión general** que une Admin Pilares + AB-CR + Tipo (CASOS).

---

## 1 · Mapa canónico (dónde vive cada cosa)

| Qué decide | Tabla | Campo | UI Admin |
|------------|-------|-------|----------|
| **Marca** | `linea` | `marca_id` | `/pilares/lineas` · Dimensiones |
| **Género** | `linea` | `genero_id` | `/pilares/lineas` |
| **Estilo** (ramo visual: CALZADO, CONFECCIONES, …) | `linea_referencia` | `grupo_estilo_id` → `grupo_estilo` | `/pilares/linea-referencia` |
| **Tipo 1 / AB-CR** (forma: MEDIAS, ACT PRENDAS, ABIERTO, CARTERAS, …) | `linea_referencia` | `tipo_1_id` → `tipo_1` | `/pilares/linea-referencia` · chip AB-CR en catálogos |
| **Tipo / CASOS** (Liquidación · Promo · Normal · Actual · …) | **No** es columna L×R | Señales cadena / biblioteca / COD.GRUPO / `es_promo` | Filtro **Tipo** siamese (**2.2.1.18** · **2.2.1.61**) |

### Anti-contradicción (obligatoria)

| Frase del Director | Lectura canónica (sin chocar con **2.2.1.61**) |
|--------------------|--------------------------------------------------|
| «Medias: estilo **confecciones** y tipo 1 **medias**» | `grupo_estilo` ≈ **CONFECCIONES** + `tipo_1` = **MEDIAS** |
| «ACT PRENDAS para las ropas … bajo el estilo confecciones» | Mismo estilo **CONFECCIONES** + `tipo_1` = **ACT PRENDAS** (`id` 5 · **2.3.5.9**) |
| «filtros de casos bajo el estilo confecciones» | En **operación de grilla**, al filtrar ramo/estilo Confecciones, los chips **tipo_1** (MEDIAS / ACT PRENDAS / …) clasifican la mercadería. El filtro **CASOS/Tipo** (LIQ>Promo>Normal) es **otro eje** (costos cadena) — **no** sustituye `tipo_1_id`. |

**Prohibido** documentar o implementar: «CASOS = tipo_1» o «ACT PRENDAS vive en `linea`».

---

## 2 · Ley de cobertura (mostrar todo · cero huérfanos)

Hereda **2.3.5.12** + **2.2.1.44**:

1. **Maestra L×R** = verdad de FKs de filtros (estilo · tipo_1 · marca/género vía `linea`).
2. **SDRM / PE / CP** = **scope** (qué entra al universo de trabajo), **no** fuente de marca/estilo/tipo.
3. **Sin filtro activo** → debe listarse **todo** el scope (SDRM stock vivo · CP resultante con stock/qty>0).
4. **Con filtros** → todo artículo del scope debe poder **caer en algún chip** (incl. **OTROS** / huecos · **2.3.5.9**). Nada “desaparece” por falta de bucket.
5. Gemelos 654↔638: **no** cruzar por código proveedor; match por `linea_id` / FKs.

### Auditoría 2026-08-17 (evidencia)

| Universo | Métrica | Resultado |
|----------|---------|-----------|
| SDRM stock positivo | líneas sin fila `linea_referencia` | **0** |
| SDRM | líneas `linea` inactiva en scope | **0** |
| LR 654 + estilo CONFECCIONES | `tipo_1` ACT PRENDAS | **34** filas |
| LR 654 + estilo CONFECCIONES | `tipo_1` MEDIAS | **30** filas |
| CP `v_stock_rimec` qty>0 no-PE | líneas **sin** `linea_referencia` | **0** ✅ (era 4 · remediado PP14 · **2.3.1.7.5.3.12**) |

**Histórico (resuelto 2026-08-17):** las 4 CP sin LR eran PP **14** / 8894/26 (2382, 2879, 5589, 8596). Causa: import sin motor LR (**4.02.03.009**). Fix: gate + backfill — ver [CHUSAR_GATE_LR…](../proceso_importacion/CHUSAR_GATE_LR_OBLIGATORIO_PROFORMA_20260817.md).

~~**4 CP sin LR**~~ — tabla deuda retirada; audit `cp_lineas_sin_lr=0`.

Script: `report/scripts/_audit_cobertura_sdrm_cp_sin_filtro.ts` · remediación `backfill_pp_pilares_from_ppd.ts`.

---

## 3 · Relación Admin LR ↔ catálogo

| Capa | Rol |
|------|-----|
| Admin `/pilares/linea-referencia` | Edita FKs; filtros Dim/Mol = herramientas de **navegación** del maestro |
| PE botón Admin | Scope = **SDRM venta hoy** (**2.3.5.12**) |
| Web / AM AB-CR | Lee `tipo_1` (+ sintéticos) · canon **2.2.1.61** / **2.3.5.9** |
| Web / AM Tipo | Lee CASOS · **no** edita L×R |

---

## 4 · Checklist agente (antes de tocar filtros)

1. [ ] ¿El cambio puede **ocultar** un artículo SDRM o CP con stock? → abortar o añadir bucket OTROS.  
2. [ ] ¿Marca/género? → `linea`. ¿Estilo / MEDIAS / ACT PRENDAS? → `linea_referencia`.  
3. [ ] ¿CASOS Promo/Normal? → filtro Tipo (**2.2.1.61**), no `tipo_1_id`.  
4. [ ] Siamese: toqué Web ⇒ chequear Report (y al revés) el mismo turno.  
5. [ ] Actualizar este doc + índice **2.3.5** + árbol `:3004` si cambia la ley.

---

## 5 · Navegador

Nodo árbol: **2.3.5.14** bajo Administrador Pilares · hermano documental **2.2.1.61** en Catálogo Web.

---

**Documenta 2026-08-17 — visión Director sin contradicciones · cobertura SDRM/CP.**
