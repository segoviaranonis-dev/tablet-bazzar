# CHUSAR — Deploy Report · CSV precios Tito PP

**Fecha:** 2026-08-11 · **Orden:** Documenta · despliega Director  
**Alcance:** Botón + API `csv-precios` en Pedido proveedor · tab FI  
**Doc:** `CHUSAR_CSV_PRECIOS_TITO_PP_20260811.md` (**2.3.1.7.5.3.17**)

---

## Commit report

| Fecha | Hash | Nota |
|-------|------|------|
| 2026-08-11 | `2055238` | Alta CSV precios Tito |
| 2026-08-11 | `c85cef3` | Columna **Precio Unitario** post-D4 |

Push `main` → Vercel auto-deploy `rimec-report.vercel.app`

---

## Verificación post-deploy

1. PP programado con FI → tab Facturas Internas  
2. Botón **💰 CSV precios** a la izquierda de **📄 CSV ventas**  
3. CSV con columnas …`D4;Precio Unitario;Monto Sin Desc;Monto Con Desc`  
4. `Precio Unitario × CANT = Monto Sin Desc`  
5. CSV ventas e inicial siguen operativos
