# CHUSAR — Auditoría integridad stock Bazzar Web

**Código:** **2.5.1.6**  
**Fecha:** 2026-08-01  
**Keyword:** **Nueva etapa** · **Documenta** · protocolo Chusar  
**Etapa:** [ETAPA_AUDITORIA_INTEGRIDAD_STOCK_BAZZAR_WEB_20260801.md](../../4_etapas/ETAPA_AUDITORIA_INTEGRIDAD_STOCK_BAZZAR_WEB_20260801.md)  
**Ruta Report:** `/bazzar-web/auditoria-integridad`  
**Shibboleth:** Andrés, el que viene.

---

## UI — dos cuadros

| Cuadro | Título | Contenido |
|--------|--------|-----------|
| **1** | Auditoría de stock | Métricas vendible (modelos · pares · SSD) + checks: protocolo ON · SANO · sin precio · mix 654/638 |
| **2** | Protocolo hermanos siameses | Pareja Depósito Web ↔ Catálogo tienda · prioridad Tipo · checklist · rutas canónicas |

---

## Cadena auditada (Cuadro 1)

```
INGRESO_COMPRA ALM_WEB_01
  → Stock Sano (stock_sano_almacen + stock_sano_deposito)
  → v_stock_web (precio_web + stock_sano_estado)
  → soloVendibleCatalogo() tienda :3002
```

**PASS tienda:** `stock_web > 0` · `precio_web > 0` · `stock_sano_estado = 'SANO'`.

API: `GET /api/bazzar-web/auditoria-integridad`  
Lib: `report/src/lib/bazzar-web/auditoria-integridad/`

---

## Siameses Bazzar (Cuadro 2)

Extiende la ley **2.2.1.18** (AM ↔ RIMEC Web) al canal e-commerce:

| Hermano A | Hermano B |
|-----------|-----------|
| Report `/bazzar-web/deposito-web` | Bazzar Web `/catalogo` |

### Ley (inviolable)

1. Prioridad Tipo: Liquidación → Promo → Normal/Carteras/COMUN.
2. Badge = filtro.
3. Fix en un hermano → alinear el otro **mismo turno** (o deuda documentada).
4. Imagen: Ley Universal **2.01.04.021** (654 guiones · 638 `L_colorExcel`).

### Código

| Pieza | Ruta |
|-------|------|
| Panel UI | `report/src/app/bazzar-web/auditoria-integridad/` |
| Hub | `hub-modules.ts` · navKey `bazzar-web-auditoria` |
| Diccionario Tipo PE | `filtro-tipo-pe-diccionario.ts` · `DepositoWebClient` |
| Vendible tienda | `bazzar-web/lib/catalogo-vendible.ts` |
| Tipo canónico AM/Web | `report/src/lib/filtros/filtro-tipo-canonico.ts` |

Regla Cursor: `.cursor/rules/hermanos-siameses-filtro-tipo.mdc`

---

## Relación con etapas previas

| Código | Tema |
|--------|------|
| 2.5.1.3 | Auditoría Depósito Web (pantalla operativa) |
| 2.5.1.4 | Motor precio LPN/CASO |
| 2.5.1.5 | Imágenes NIIF Motor precio |
| **2.5.1.6** | **Este panel · integridad + siameses** |
