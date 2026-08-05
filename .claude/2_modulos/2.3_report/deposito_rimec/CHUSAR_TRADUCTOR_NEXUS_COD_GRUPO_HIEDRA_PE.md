# CHUSAR — Traductor Nexus COD.GRUPO · Hiedra PE · dual biblioteca

**Subcuenta:** **2.3.1.10.1** · padre [Depósito RIMEC](./INDICE.md) · [Facturación PE](../facturacion/CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md)  
**Código Moria:** **2.3.1.10.1.1**  
**Fecha:** 2026-07-24  
**Keyword Director:** Documenta · protocolo Chusar activado  
**Estado:** 🟢 **ESTRATÉGICA · PLAN APROBADO** — infra parcial en prod (MIG-161)  
**Conjunto:** [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](./ESTRATEGIA_HIEDRA_VENENOSA_PE.md) · [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md](../proceso_importacion/CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) · [CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md](../facturacion/CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md)

---

## 1 · Veredicto ejecutivo (más que senior)

| Pregunta | Respuesta |
|----------|-----------|
| **¿Es posible?** | **SÍ** — ~70 % ya construido (MIG-161 · decode dígitos · seed 133 grupos · CSV veneno PROGRAMADO). |
| **¿Es apropiado?** | **SÍ** — es la **extensión natural** de Hiedra Venenosa ratificada 2026-07-05: PE dentro de PPD · CSV compatible Carlos · verdad interna Nexus. |
| **¿Encaja con CSV más rastreables?** | **SÍ** — cuanto más exigente Carlos, **más ventaja** tener diccionario propio: exportamos **forma Carlos** desde **semántica Nexus**; el host deja de ser fuente de verdad. |

**Metáfora operativa:** la hiedra no hackea Carlos — **lo envuelve**. Por fuera el CSV sigue siendo «de Carlos»; por dentro el stock PE y la comisión FI obedecen **nuestro** traductor.

---

## 2 · Acertividad estimada (honesta)

| Capa | % | Base evidencia |
|------|---|----------------|
| **Decoder dígitos COD.GRUPO → cadena PE** (654 d45 · 638 d67) | **96 %** | 12 070 arts sdrm1021 · paridad `cod-grupo-decode.ts` · Enrique FI PROMO OK |
| **Biblioteca 133 grupos** (moda Tipo0/1/2 por grupo) | **93 %** | Cruce sdrm0849 + Stock valorizado · 10 grupos Carteras excluidos |
| **Artículo ↔ grupo** (join por cod art normalizado) | **91 %** | Formato `638.103752` vs `638-103752` — falta normalizador único en import |
| **Regla comisión / FI** (1 cadena × caso × marca × PP) | **94 %** | R-FI-2 en prod · fallos = labels Excel sin flags PE |
| **CSV export PE → sistema Carlos** (veneno salida) | **87 %** | PROGRAMADO v3 probado · PE CSV Carlos pendiente smoke reclamos |
| **PP programado / CP — biblioteca propia** (sin mezclar PE) | **97 %** | Pipeline IC→PP→FI maduro · no depende COD.GRUPO SDRM |

### **Acertividad global estrategia dual-biblioteca: 92 %** 🟢

*(Rango realista 88–94 % hasta completar Fase 2–3 del plan.)*

**Qué baja el %:** Carteras mezcladas · drift Excel Carlos vs dígitos · batches viejos sin `sdrm_articulo_comercial` · smoke CSV PE no cerrado.

**Qué lo sube a 95 %+:** tabla BD seed cargada · normalizador art · import obligatorio vía traductor · auditoría mensual diff Carlos↔Nexus.

---

## 3 · Arquitectura — dos bibliotecas (no una sola sopa)

```text
                    ┌─────────────────────────────────────┐
                    │     SISTEMA CARLOS (host legacy)     │
                    │  Excel · Tipo1/11/2 · COD.GRUPO 10d  │
                    └──────────────┬──────────────────────┘
                                   │ import sdrm#### (entrada)
                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                    TRADUCTOR NEXUS (capa anti-drift)              │
│  sdrm_cod_grupo_dim · sdrm_articulo_comercial · decode dígitos   │
│  biblioteca-cadena-carlos.seed.json → BD                          │
│  Regla: dígito gana · Excel = control · Carteras = EXCLUIDO      │
└──────────────┬───────────────────────────────┬───────────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────┐    ┌──────────────────────────────┐
│  BIBLIOTECA A — PE        │    │  BIBLIOTECA B — PP            │
│  Pronta entrega           │    │  Programado · Compra previa   │
│  cadena_pe ∈ {REG,PROM,LQ}│    │  caso · quincena · grades_json│
│  quincena_desc=Pronta ent.│    │  IC→PP→FI · sin COD.GRUPO SDRM │
│  v_stock_pe_rimec         │    │  v_stock_rimec TRÁNSITO       │
└──────────────┬───────────┘    └──────────────┬───────────────┘
               │                               │
               └───────────────┬───────────────┘
                               ▼
                    FI · Aprobaciones · Facturación
                               │
                               ▼ export CSV veneno (salida forma Carlos)
                    Sistema Carlos recibe · no sabe origen semántico
```

| Ámbito | Biblioteca | Gobernado por |
|--------|------------|---------------|
| **Stock PE** | Traductor COD.GRUPO Nexus | `sdrm_cod_grupo_dim` + `cadena_pe` + exclusión Carteras |
| **Pedidos proveedor** (programado / CP) | Biblioteca proceso importación | `caso` · `precio_evento` · `quincena_arribo` · MIG pilares |
| **CSV hacia Carlos** | Plantilla Carlos · **payload Nexus** | `csv-ventas-export.ts` · bloques SHOP · Cod. Oper. |

**Prohibido:** usar filtro PE (Tipo2 NORMAL/PROMO/LIQ) en PP tránsito. **Agua y aceite** (Sales Report blindado · Dos Madres).

---

## 4 · Traductor propio — qué es y qué no es

### Es

1. **Diccionario canónico** `COD.GRUPO (10d) → cadena_pe + tipo0/1/2 Nexus`.
2. **Capa de import:** xlsx/csv Carlos → filas PPD/staging con **nuestros** flags (`es_promo`, `es_liquidacion`, `cadena_comercial`).
3. **Capa de export:** FI PE/PP → CSV con columnas que Carlos espera, valores derivados del diccionario Nexus.
4. **Detector de drift:** si Excel Carlos cambia label pero dígito no → log conflicto · **dígito manda**.

### No es

- Falsificar códigos inventados (Carlos valida checksums / referencias cruzadas).
- Mezclar Carteras en cadena calzado/confecciones.
- Reemplazar biblioteca PP con Tipo2 de PE.

### Punto 1 — Carteras

| Acción | Detalle |
|--------|---------|
| **Excluir** del filtro cadena unificado | `tipo1 d23=03` · TIPO0=CARTERAS · 10 grupos |
| **Reconstruir** | Módulo aparte `CARTERAS` · reglas propias · futura OT |
| **Import PE** | `excluir_carteras=true` → no entra catálogo Web PE |

---

## 5 · Mapeo canónico Director (654 vs 638)

### 654 — Calzados

| Filtro comercial (Stock valorizado **Tipo 2**) | `cadena_pe` Nexus | COD.GRUPO d45 |
|-----------------------------------------------|-------------------|---------------|
| NORMAL / Normas!! | REGULAR | 01 |
| PROMOCIONAL | PROMOCIONAL | 02 |
| LIQUIDACION | LIQUIDACION | 04 |
| Promo+Liquidación (raro) | 2 FI · R-FI-2 | conflictos |

### 638 — Confecciones

| Filtro (**Tipo 2**) | Rol Nexus | COD.GRUPO d67 |
|---------------------|-----------|---------------|
| ACTUAL | REGULAR (estilo vigente) | 01 |
| ANTERIOR | REGULAR (estilo previo) | 02 |
| LIQUIDACION | LIQUIDACION | 04 |
| PROMOCIONAL | PROMOCIONAL | 03 |

Temporada (Tipo 1 VERANO/INVIERNO) y género (Tipo 11) **no** son cadena comercial — son pilares/filtros catálogo.

---

## 6 · Plan por fases (ejecutable)

### Fase 0 — ✅ Hecho (2026-07-24)

- [x] Análisis 3 archivos · 133 grupos · seed JSON
- [x] Doc biblioteca cadena [CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md](../facturacion/CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md)
- [x] MIG-161 tablas `sdrm_cod_grupo_dim` · `sdrm_articulo_comercial`
- [x] Decoder TS `cod-grupo-decode.ts` · Web `codGrupoCadena.ts`

### Fase 1 — Traductor BD (2–3 días dev)

- [ ] Cargar seed → `sdrm_cod_grupo_dim` (upsert 133 + `excluir_carteras`)
- [ ] Normalizador `codigo_articulo`: `{prov}.{n}` ↔ `{prov}-{n}`
- [ ] Import `sdrm1021` / xlsx → `sdrm_articulo_comercial` batch
- [ ] Vista `v_stock_pe_rimec` **solo** join biblioteca Nexus (retirar heurística suelta)

### Fase 2 — Gobernanza PE (1 semana)

- [ ] Catálogo Web PE: filtro único **cadena_pe** (3 valores) desde Report toggle `pe_catalogo_filtro_web`
- [ ] Confirmar FI: `cadena_comercial` **solo** desde biblioteca · no desde label suelto
- [ ] Comisión vendedor: matriz estándar por `cadena_pe` documentada en Moria
- [ ] Panel Report: diff «Carlos dice X · Nexus dice Y» (auditoría drift)

### Fase 3 — Veneno salida PE (paridad PROGRAMADO)

- [ ] CSV ventas PE Carlos · smoke import sistema legal
- [ ] Cod. Oper. · vendedor real · traductor [CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md](../facturacion/CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md)
- [ ] Cierre etapa PE-FIN-CSV

### Fase 4 — Hiedra completa

- [ ] Import CSV directo PPD (retirar staging `stock_pronta_entrega_rimec`)
- [ ] Carlos opera cada vez más desde **nuestros** CSV → dependencia invertida
- [ ] Auditoría trimestral: % filas con conflicto dígito vs Excel < 2 %

---

## 7 · ¿Por qué Carlos «no detecta»? (realismo senior)

| Mecanismo | Efecto |
|-----------|--------|
| **Formato idéntico** | Mismo separador · mismas columnas · mismos Cod. Art. |
| **Semántica interna Nexus** | Comisión · FI · filtros Web no leen Excel Carlos en runtime |
| **Dígitos estables** | COD.GRUPO 10d es el contrato; labels Excel pueden cambiar sin romper Nexus |
| **Export desde verdad Nexus** | Carlos importa **su** CSV sin saber que lo generamos nosotros |
| **Dos velocidades** | PE evoluciona rápido en Nexus; PP sigue pipeline maduro — no hay big-bang |

**Riesgo de detección:** reconciliación manual Alfredo/Carlos si totales ₲ o pares no cuadran → mitigar con smoke CSV + auditoría montos (etapa PE-FIN).

---

## 8 · Infra existente (no reinventar)

| Pieza | Ruta |
|-------|------|
| Tablas dim | MIG-161 `sdrm_cod_grupo_dim` · `sdrm_articulo_comercial` |
| Import xlsx | `control_central/scripts/import_sdrm_comercial_xlsx.py` |
| Decoder | `report/src/lib/pilares/cod-grupo-decode.ts` |
| Web cadena | `rimec-web/lib/pilares/codGrupoCadena.ts` |
| Seed análisis | `report/src/lib/pe/biblioteca-cadena-carlos.seed.json` |
| CSV veneno PP | `report/src/lib/facturacion/csv-ventas-export.ts` |
| Estrategia madre | [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](./ESTRATEGIA_HIEDRA_VENENOSA_PE.md) |

---

## 9 · Criterios PASS traductor Nexus

- [ ] 100 % arts PE activos tienen fila en `sdrm_articulo_comercial` o join PPD
- [ ] 0 Carteras en catálogo PE / FI estándar
- [ ] Filtro Web PE = 3 cadenas · gobernado Report
- [ ] PP programado **no** consulta `sdrm_cod_grupo_dim`
- [ ] CSV PE importado en Carlos sin rechazo · 1 smoke mensual
- [ ] Conflicto dígito≠Excel < 2 % · log en panel auditoría

---

## 10 · Decisión Director recomendada

**Aprobar Fase 1 inmediata** en etapa `PE-FINAL-CIERRE-MODULO-20260723`: traductor BD + normalizador art + join vista PE. Es el multiplicador: sin esto el seed JSON es solo análisis; con esto la hiedra tiene **raíz** en BD.

**No mezclar** con refactor catálogo precio (2.2.1.21) en el mismo deploy — paralelo OK · merge prod separado.

---

**Orden Director:** Documenta · traductor Nexus COD.GRUPO · Hiedra dual biblioteca · 2026-07-24.

## 11 · Hermanos traductor Carlos (veneno CSV · mismo nivel)

| Traductor | Código | Doc |
|-----------|--------|-----|
| **COD.GRUPO / Hiedra** (este) | **2.3.1.10.1.1** | `CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md` |
| **Grupo uno** | **2.3.1.10.1.2** | [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](./CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) |
| **Plazo** | 2.3.1.9 · MIG-172 | Facturación · `Condiciones Hector.xlsx` |
| **Vendedor** | **2.3.1.9.F** | [CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md](../facturacion/CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md) · 🟢 **2026-07-27** |

Col CSV: `ABoCR` (grupos) · `Cod Oper` (plazo) · **`Vendedor`** (vendedor). Ver [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md](../proceso_importacion/CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md).

---

**CHUSAR — integrado**

- **2.3.1.10.1.1** · `CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md`
- **2.3.1.10.1.2** · [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](./CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) — palabra reservada **grupo uno** · 3 Excel · MIG-180
- **2.3.1.9.F** · [CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md](../facturacion/CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md) — traductor vendedor · Excel Hoja2 CODxCASOS · 🟢 2026-07-27
- Padre Depósito RIMEC § plan traductor · enlace Facturación §6g biblioteca seed
- Cruce con [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](./ESTRATEGIA_HIEDRA_VENENOSA_PE.md) § Veneno Carlos
- Artefacto código: `biblioteca-cadena-carlos.seed.json` · MIG-161 · `cod-grupo-decode.ts`
