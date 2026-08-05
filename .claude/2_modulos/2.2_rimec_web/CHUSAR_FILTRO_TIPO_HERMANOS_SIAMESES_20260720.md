# CHUSAR — Hermanos siameses · Filtro Tipo (AM ↔ RIMEC Web)

**Código:** `2.2.1.18` · cruza `2.3.1.26` (AM)  
**Fecha:** 2026-07-20  
**Keyword:** Documenta · hotfix filtro PE  
**Shibboleth:** Andrés, el que viene.

---

## Ley

**Alejandro Magno** (`/herramienta-reposicion`) y **RIMEC Web** (catálogo CP/PE) son
**hermanos siameses** en el filtro canónico **Tipo**.

| Grilla | App | Módulo canónico |
|--------|-----|-----------------|
| Alejandro Magno | Report | `report/src/lib/filtros/filtro-tipo-canonico.ts` |
| Catálogo vendedores | RIMEC Web | `rimec-web/lib/filtros/filtro-tipo-canonico.ts` |

### Protocolo CHUSAR (inviolable · 2026-07-20)

1. Si se repara el filtro Tipo / promo / liquidación en **RIMEC Web**, **en el mismo turno** se chequea y se alinea **Alejandro Magno**.
2. Si se repara en **AM**, **en el mismo turno** se chequea y se alinea **RIMEC Web**.
3. **Prohibido** divergir versiones de la ley sin deuda documentada + orden del Director.
4. Regla Cursor alwaysApply: `.cursor/rules/hermanos-siameses-filtro-tipo.mdc`

### Extensión cabecera (Director · 2026-07-20)

Además del filtro **Tipo**, la **cabecera molécula** es siamesa: **`nro_pedido_externo`** (Nº preventa Carlos) + **`quincena_arribo_id`** (24 elementos FECHA DE EMBARQUE) deben propagarse juntos en AM, Web, PDF y CSV. Mapa: [CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md](../2.3_report/gestion_compra/CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md) (`2.3.1.31`) · consolidación: [CHUSAR_SESION_DURO_PREVENTA_UI_PRECIOS_20260720.md](../2.3_report/gestion_compra/CHUSAR_SESION_DURO_PREVENTA_UI_PRECIOS_20260720.md) (`2.3.1.32`).

**Prohibido** divergir reglas. Un fix en una grilla **obliga** el mismo criterio en la otra
en el mismo turno (o documentar deuda explícita).

---

## Prioridad exclusiva (canónica)

1. **Liquidación** — `es_liquidacion` · `cadena_comercial=LIQUIDACION`
2. **Promo** — `es_promo` · `cadena_comercial=PROMOCIONAL` · caso `PROMOCIONAL`
3. **Carteras / Normal** — casos biblioteca snapshot o BCL línea→caso

Badge UI y filtro **deben coincidir**. Si la tarjeta late PROMO, **no** puede pasar el chip **Normal**.

---

## Vulnerabilidad 2026-07-20 · línea 1395 PE

| Campo vista `v_stock_pe_rimec` | Valor |
|-------------------------------|--------|
| `linea_codigo` | **1395** |
| `descp_caso` / snapshot | `BR-VZ-MD-ML-MKA-O` (**Normal**) |
| `es_promo` | **true** |
| `cadena_comercial` | **PROMOCIONAL** |

**Síntoma:** PE + Tipo **Normal** (+ carpeta abiertos) mostraba 1395 con badge PROMO.  
**Causa:** filtro tipaba solo por `descp_caso`/BCL; ignoraba `es_promo` / cadena promo.  
**Fix:** `esPromoRow` exclusivo antes de Normal · memoria pasa `es_promo`.

Error: `4.01.04.002` · Doc detalle en `5_errores/detalle/`.

---

## Checklist al tocar Tipo

- [ ] ¿Misma prioridad LIQ > Promo > Carteras/Normal en Report y Web?
- [ ] ¿`es_promo` / cadena PROMOCIONAL en señales de fila?
- [ ] ¿Smoke: Normal no lista línea con badge PROMO?
- [ ] ¿Ambas grillas responden `3 → 2 → 1 → Aplicando filtro…` al seleccionar?
- [ ] ¿Índice actualizado en ambas ramas (2.2 y 2.3)?

---

## Respuesta visual de filtros — extensión siamesa

La paridad AM ↔ Web incluye la percepción de respuesta durante la latencia:

- Secuencia rápida `3 → 2 → 1`; luego `Aplicando filtro… · [dimensión]`.
- Duración total 2.100 ms; cada cuenta dura 260 ms.
- No bloquea multiselección (`pointer-events-none`).
- Cada cambio reinicia la secuencia y anuncia el filtro más reciente.
- Accesible mediante `role=status` y `aria-live=polite`.

| App | Archivo UI | Integración |
|-----|------------|-------------|
| Web | `components/catalog/FiltroAplicandoOverlay.tsx` | `app/CatalogoClient.tsx` |
| AM | `components/herramienta-reposicion/FiltroAplicandoOverlay.tsx` | `HerramientaReposicionClient.tsx` |

Detalle consolidado: [CHUSAR_SESION_DURO_PREVENTA_UI_PRECIOS_20260720.md](../2.3_report/gestion_compra/CHUSAR_SESION_DURO_PREVENTA_UI_PRECIOS_20260720.md) §10 (`2.3.1.32`).

---

## Extensión PE diccionario (2026-07-25 · doc 2.2.1.25)

En **Pronta Entrega** el sidebar Tipo usa **diccionario COD.GRUPO** (NORMAL · PROMOCIONAL · LIQUIDACION · COMUN), no chips CP title-case. CP sigue biblioteca caso en AM/Web CP.

## Alejandro Magno · deuda diccionario PE (2026-07-26 · doc 2.2.1.27)

**AM** (`/herramienta-reposicion`) aún filtra filas PE con `rowMatchesTipoGrupos` (biblioteca CP). **Siguiente objetivo:** mismo diccionario PE que Stock PE + Web + tabla visión general Panel Control. Ver [CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md](./CHUSAR_HERMANO3_AM_DICCIONARIO_PE_20260726.md).

---

**Relacionados:** [CHUSAR_REPOSICION_SIDEBAR_MULTISELECT_TONO.md](../2.3_report/gestion_compra/CHUSAR_REPOSICION_SIDEBAR_MULTISELECT_TONO.md) · [CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md](./CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md) · [CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md](./CHUSAR_FILTROS_PE_TRES_HERMANOS_SIAMESES_20260725.md) (**2.2.1.25** · 2/3 siameses) · [CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md](../2.3_report/gestion_compra/CHUSAR_NUMERO_PREVENTA_CARLOS_DATO_DURO.md) (**cabecera siamese** · preventa + quincena 1–24)
