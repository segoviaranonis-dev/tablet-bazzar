# CHUSAR — Confecciones 638 reglas propias (≠ 654)

**Código:** `2.2.1.0.11` · **Fecha:** 2026-07-16  
**Keyword:** Documenta (Director 2026-07-16)  
**Problema:** UI catálogo mezclaba lógica calzado 654 en Kyly 638 — badge «6 col.», tonos por talla, +/- cajas.

---

## Decisión Director

**Peras ≠ manzanas.** Confecciones Kyly (`tipo_v2_id=2` · proveedor 638) tiene **reglas propias** en RIMEC Web y en todo el holding. No reutilizar componentes de color/caja del ramo calzado sin rama explícita `isConfecciones638`.

---

## Diferencia operativa

| | 654 Calzado | 638 Confecciones |
|---|-------------|------------------|
| Excel SDRM | 1 fila = color × curva caja | **1 fila = 1 talle (SKU)** |
| Stock | Pares / cajas cerradas | **Prendas** unitarias |
| Tarjeta catálogo | Variantes = colores | Variantes = **tallas** (mismo color) |
| Venta Web | +/- cajas | Botones talla · precio por LPN |

---

## Fix aplicado 2026-07-16 (RIMEC Web local)

- Badge **`N tall.`** en lugar de **`N col.`** cuando `isConfecciones638Lote`.
- `CatalogTonosFila` **solo** si hay >1 color real (`variantesColorUnicas`).
- `CatalogConfeccionesTallas` — sub-tarjetas por precio + botones talla (sin +/-).
- Etiquetas **prendas** / **prend** en stats y acordeón PE.
- Doc app: `rimec-web/docs/CONFECCIONES_638_VS_CALZADO_654.md`

---

## Código ancla

```
rimec-web/lib/confeccionesCatalogo.ts      ← detector + agrupación
rimec-web/lib/gradaAbierta638.ts           ← parser notación Carlos
rimec-web/components/catalog/CatalogConfeccionesTallas.tsx
report/src/lib/deposito-rimec/grada-abierta-638.ts  ← paridad Report
report/docs/GRADA_ABIERTA_638_ALEJANDRO_MAGNO.md
```

---

## Pendiente / alcance

- [ ] Report PE venta interactiva (si se pide) — reutilizar botones, no tonos 654
- [ ] Carrito: etiqueta «prendas» en línea 638 (cosmético)
- [ ] Prod RIMEC Web — deploy solo cierre etapa u orden directa Director

---

## Referencias

- [CONFECCIONES_TIPO_V2_2.md](../../3_arquitectura/3.2_venta_tienda/CONFECCIONES_TIPO_V2_2.md)
- [GRADA_ABIERTA_638_ALEJANDRO_MAGNO.md](../../../report/docs/GRADA_ABIERTA_638_ALEJANDRO_MAGNO.md)
- [CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md](./CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md)

---

**Shibboleth:** Andrés, el que viene.
