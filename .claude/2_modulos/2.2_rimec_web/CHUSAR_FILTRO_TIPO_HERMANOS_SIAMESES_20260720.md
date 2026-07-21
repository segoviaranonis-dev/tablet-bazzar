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
- [ ] ¿Índice actualizado en ambas ramas (2.2 y 2.3)?

---

**Relacionados:** [CHUSAR_REPOSICION_SIDEBAR_MULTISELECT_TONO.md](../2.3_report/gestion_compra/CHUSAR_REPOSICION_SIDEBAR_MULTISELECT_TONO.md) · [CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md](./CHUSAR_FILTROS_COMPARTIDOS_CP_PE.md)
