# CHUSAR — CSV ventas PE · sistema Carlos (stock pronta entrega)

**Subcuenta:** **2.3.1.9.B.1** · Facturación Pronta entrega  
**Ratificado:** 2026-07-09 · **Formato DEPOSITO cabecera:** 2026-08-04 · orden Director **Documenta**  
**Hijo:** [CHUSAR_CSV_PE_DEPOSITO_CABECERA_20260804.md](./CHUSAR_CSV_PE_DEPOSITO_CABECERA_20260804.md) **2.3.1.9.B.3**  
**Pendientes:** [CHUSAR_PENDIENTES_PE_CSV_20260804.md](./CHUSAR_PENDIENTES_PE_CSV_20260804.md) **2.3.1.9.B.4**  
**Conjunto:** [CHUSAR_FACTURACION_PRONTA_ENTREGA.md](./CHUSAR_FACTURACION_PRONTA_ENTREGA.md)

**Shibboleth:** Andrés, el que viene.

---

## Norte

Inyectar ventas **Pronta entrega** confirmadas en el **sistema legal Carlos**.  
Este CSV es **veneno**: **prohibido** cambiar cantidad, nombre u orden de columnas sin orden expresa del Director.

---

## Formato canónico (15 columnas · TSV · CRLF · UTF-8 sin BOM)

```
Cliente	Cod. Oper.	F. Pedido	Lista precios	cobrador	vendedor	DEPOSITO	Des. 1	Des. 2	Des. 3	Des. 4	Codigo Articulo	Cant. Pares	Precio con descuento	Precio sin descuento
```

**Precios (2026-08-12):** cols 14 y 15 = **mismo bruto** del `lista_precio_id` del vendedor (LPN/LPC02/03/04). **Prohibido** LPN si eligió LPC. Doc **2.3.1.9.B.7**.

| # | Columna | Rol |
|---|---------|-----|
| 1–6 | Cliente … vendedor | **Cabecera FI** — solo 1ª fila de datos |
| 7 | **DEPOSITO** | **Cabecera FI** — `S00_D1` \| `S00_DEP2` \| `S00_D3` **una sola vez** |
| 8–11 | Des. 1–4 | Cabecera FI |
| 12 | Codigo Articulo | Por artículo · barra SDRM |
| 13 | **Cant. Pares** | Por artículo · **una** columna de cantidad |
| 14–15 | Precios | Por artículo · **ambas = bruto sin descuento** del LP de cabecera · Carlos aplica Des. · ver **2.3.1.9.B.7** |

**Auditoría tier (2026-08-07):** [CHUSAR_CSV_PE_AUDITORIA_TIER_20260807.md](./CHUSAR_CSV_PE_AUDITORIA_TIER_20260807.md) **2.3.1.9.B.5** · [CHUSAR_CSV_PE_RENTABILIDAD_NIVEL_DIOS_20260807.md](./CHUSAR_CSV_PE_RENTABILIDAD_NIVEL_DIOS_20260807.md) **2.3.1.9.B.6** · **`4.00.02.009`** Nivel Dios rentabilidad · gate en cada export · **prod**.

### Ejemplo patrón Director

`vendedor=25` · `DEPOSITO=S00_D1` · `Cant. Pares=10` (valores de ejemplo; el export usa datos reales de la FI).

Filas 2+: cols 1–11 **vacías**; solo Codigo Articulo · Cant. Pares · precios.

### Rechazado (2026-08-04)

Tres columnas `S00_D1|S00_DEP2|S00_D3` como cantidades por artículo — **no** es el veneno Carlos.

---

## UI Report

| Pieza | Detalle |
|-------|---------|
| **Ruta** | `/facturacion/pronta-entrega` |
| **Botón** | **Descargar CSV** · tarjeta FI expandida |
| **Gate** | Solo FI **CONFIRMADA** |
| **API** | `GET /api/facturacion/[nro]/csv` |
| **Código** | `report/src/lib/facturacion/csv-pe-ventas-export.ts` |

---

## Mapeo Nexus → Carlos

| Col CSV | Fuente Nexus |
|---------|----------------|
| Cliente | `fi.cliente_id` |
| Cod. Oper. | `resolveCodOperCarlos` / `fi.cod_oper_carlos` |
| F. Pedido | `dd/mm/yyyy` |
| Lista precios | `listaPrecioLabel` |
| cobrador | **90** fijo |
| vendedor | Código Carlos · traductor **2.3.1.9.F** · HECTOR → **90** |
| **DEPOSITO** | `columna_stock_legal` / `deposito_codigo` → `S00_D1\|DEP2\|D3` |
| Des. 1–4 | `fi.descuento_*` · vacío si 0 |
| Codigo Articulo | Barra SDRM staging / snapshot |
| Cant. Pares | `fid.pares` |
| Precio sin / con | **Bruto tier** `lista_precio_id` · ambas cols iguales · **2.3.1.9.B.7** |

---

## Smoke

```bash
cd report
npx tsx scripts/_smoke_csv_pe_depositos.ts
```

| Prueba | Resultado |
|--------|-----------|
| 15 cols · DEPOSITO col G · Cant. Pares col M | 🟢 smoke |
| Import real Carlos | ⏳ Director |
| Deploy Report prod | ⏳ cierre etapa / orden directa |

---

**Índice:** [INDICE.md](./INDICE.md)
