# CHUSAR — Multi-proveedor pilares

**Integrado:** 2026-06-16 · **Import producción:** 2026-06-16 ✅  
**Estado:** Import mixto **OK** · fichas Director + motor precios 638 pendientes  
**Etapa:** [ETAPA_IMPORT_MULTI_PROVEEDOR_PAUSADA.md](../../4_etapas/ETAPA_IMPORT_MULTI_PROVEEDOR_PAUSADA.md)

---

## Leyes fijas

| Ley | Doc |
|-----|-----|
| Triplete: `id` + `proveedor_id` + `codigo_proveedor` | [LEY_FK_NUMERICO_RETAIL.md](./LEY_FK_NUMERICO_RETAIL.md) |
| FK-FIRST · P0 | `pilares_rimec.md` · `rimec-nomenclatura-pilares-p0.mdc` |
| Import retail | `politicas-importacion-pilares.mdc` |

---

## Proveedores (aislados — no mezclar)

| Proveedor | `proveedor_id` | `tipo_v2_id` | Ficha |
|-----------|----------------|--------------|-------|
| Beira Rio calzado | **654** | 1 | [REGLAS_PROVEEDOR_654.md](./REGLAS_PROVEEDOR_654.md) |
| Kyly confecciones | **638** | 2 | [REGLAS_PROVEEDOR_638.md](./REGLAS_PROVEEDOR_638.md) |

Índice: [REGLAS_PROVEEDORES_INDICE.md](./REGLAS_PROVEEDORES_INDICE.md)

---

## Import producción (2026-06-16)

| Métrica | Valor |
|---------|--------|
| Excel | `VENTA y STOCK BZ+RC.xlsx` |
| Staging | 50.979 filas · reemplazo total |
| Calzado 654 | 42.609 · FK 0 NULL |
| Kyly 638 | 8.370 · FK 0 NULL |
| Build | `2026-06-10-c2` |
| Migraciones | 116 (proveedor 638) · 117 (UNIQUE por proveedor) |

**Regla diaria:** mismo flujo Streamlit Retail o CLI `--commit` — borrón y cuenta nueva.

---

## Pendiente Chusar

1. Listado Director → completar fichas 654/638 (faja, imágenes, marcas)
2. Motor precios 638
3. OT cierre gerencial (opcional)

**Shibboleth:** 7 años
