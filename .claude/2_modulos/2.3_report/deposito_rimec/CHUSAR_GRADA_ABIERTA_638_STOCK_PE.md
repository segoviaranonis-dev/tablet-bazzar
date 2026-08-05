# CHUSAR — Grada abierta 638 · Stock Pronta Entrega (Report)

**Código:** **2.3.1.10.12** · **Fecha:** 2026-07-16  
**Etapa cerrada:** [ETAPA_CATALOGO_LATENCIA_20260713_CERRADA.md](../../../4_etapas/ETAPA_CATALOGO_LATENCIA_20260713_CERRADA.md) (T8 + Report PE)  
**App doc:** [GRADA_ABIERTA_638_ALEJANDRO_MAGNO.md](../../../../report/docs/GRADA_ABIERTA_638_ALEJANDRO_MAGNO.md)

---

## Norte

Kyly **638** en PE = **1 fila Excel = 1 talle = 1 SKU PPD**. Unidad **prenda** (no par · no caja cerrada 654).

Ejemplo pivot SDRM (Milon 13751 · color K0452):

| LPN | Grada | Uds |
|-----|-------|-----|
| 89900 | 1(1)1 · 2(1)2 · 3(1)3 | 8+5+2 = **15** |
| 108800 | 4(1)4 · 6(1)6 · 8(1)8 | 7+3+2 = **12** |
| | **Total** | **27** |

---

## Report — rutas

| Pieza | Ruta |
|-------|------|
| Parser grada Carlos | `report/src/lib/deposito-rimec/grada-abierta-638.ts` |
| Agrupación tarjeta PE | `report/src/lib/depositos/agrupar-pe-importadora.ts` |
| UI tarjeta | `PeCardMiniatura.tsx` · `GradaImportadoraAcordeon.tsx` |
| Resumen KPI (fix timeout) | `queries-resumen.ts` — **1 query** CTE |
| Migración AM venta unitaria | `migrations/165_am_modo_venta_grada_abierta.sql` |
| Import staging → PPD | `control_central/scripts/migrate_pe_staging_to_ppd.py` |
| Mapa SDRM pilares | `report/src/lib/pilares/sdrm-pilares-map.ts` |

---

## RIMEC Web — paridad venta

Ver [CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md](../../2.2_rimec_web/CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md) · `rimec-web/docs/CONFECCIONES_638_VS_CALZADO_654.md`

---

## Anti-patrones

1. Tratar `variantes[]` / filas PPD 638 como **colores** (654).
2. Dividir `saldo_pares` por `pares_por_caja` cuando vista contamina ppc=saldo.
3. Agrupar tallas distintas bajo un solo precio si LPN difiere.

---

**Shibboleth:** Andrés, el que viene.
