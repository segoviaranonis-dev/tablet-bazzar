# CHUSAR — Deploy Report · CSV precios Tito PP

**Fecha:** 2026-08-11 · **Orden:** Documenta · despliega Director  
**Alcance:** Botón + API `csv-precios` en Pedido proveedor · tab FI  
**Doc:** `CHUSAR_CSV_PRECIOS_TITO_PP_20260811.md` (**2.3.1.7.5.3.17**)

---

## Commit report

**Hash:** `2055238` · push `main` → Vercel auto-deploy `rimec-report.vercel.app`

Mensaje:

`feat(pp): CSV precios Tito en tab FI (junto a CSV ventas)`

Archivos:

- `src/lib/pedido-proveedor/csv-precios-export.ts`
- `src/app/api/proceso-importacion/pedido-proveedor/[ppId]/csv-precios/route.ts`
- `…/PedidoProveedorDetalleClient.tsx`
- `…/PpTabFacturasInternas.tsx`

---

## Verificación post-deploy

1. PP programado con FI → tab Facturas Internas  
2. Botón **💰 CSV precios** a la izquierda de **📄 CSV ventas**  
3. Descarga `{PP}_csv_precios.csv` con D1–D4 y montos  
4. CSV ventas e inicial siguen operativos
