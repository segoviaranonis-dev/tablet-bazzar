# CHUSAR — CSV ventas PE Carlos · col DEPOSITO cabecera (veneno legal)

**Código:** **2.3.1.9.B.3** · padre [CHUSAR_CSV_VENTAS_PE_CARLOS.md](./CHUSAR_CSV_VENTAS_PE_CARLOS.md) **2.3.1.9.B.1**  
**Ratificado:** Director · **Documenta** + protocolo Chusar · 2026-08-04  
**Código:** `report/src/lib/facturacion/csv-pe-ventas-export.ts`

**Shibboleth:** Andrés, el que viene.

---

## Ley (inviolable)

El CSV que se inyecta al **sistema legal Carlos** es **veneno**.  
**Prohibido** alterar:

- cantidad de columnas  
- nombres de columnas  
- orden de columnas  

sin orden expresa del Director.

---

## Formato canónico (15 columnas · TSV · CRLF)

```
Cliente	Cod. Oper.	F. Pedido	Lista precios	cobrador	vendedor	DEPOSITO	Des. 1	Des. 2	Des. 3	Des. 4	Codigo Articulo	Cant. Pares	Precio sin descuento	Precio con descuento
```

| # | Columna | Rol |
|---|---------|-----|
| 1–6 | Cliente … vendedor | **Cabecera FI** — solo 1ª fila de datos |
| 7 | **DEPOSITO** | **Cabecera FI** — valor único `S00_D1` \| `S00_DEP2` \| `S00_D3` |
| 8–11 | Des. 1–4 | Cabecera FI |
| 12 | Codigo Articulo | Por artículo · barra SDRM `654.…` / `638.…` |
| 13 | **Cant. Pares** | Por artículo · **una** columna de cantidad |
| 14–15 | Precios | Por artículo |

### Ejemplo Director (patrón)

| Campo | Valor ejemplo |
|-------|----------------|
| vendedor | `25` (código Carlos) |
| DEPOSITO | `S00_D1` |
| Cant. Pares | `10` |

```
930	CR-90-150	04/08/2026	LPC03	90	25	S00_D1	10	25			654.260.157	10	131400	88695
										654.xxx.yyy	2	…	…
```

**DEPOSITO** y **vendedor** aparecen **una sola vez** (fila 1 de datos). Filas siguientes: cols 1–11 vacías.

---

## Rechazo explícito (2026-08-04)

| Propuesta incorrecta | Por qué se rechazó |
|----------------------|--------------------|
| Tres columnas `S00_D1` · `S00_DEP2` · `S00_D3` como cantidades | Cambia el formato · no es el veneno Carlos |
| Repetir depósito por artículo | El depósito es dato de **cabecera**, no de línea |

---

## Mapeo Nexus → DEPOSITO

| Nexus | Valor CSV DEPOSITO |
|-------|---------------------|
| `deposito_codigo=D1` / `columna_stock_legal=S00_D1` | `S00_D1` |
| `DEP2` / `S00_DEP2` | `S00_DEP2` |
| `D3` / `S00_D3` | `S00_D3` |
| Sin dato | default `S00_D3` (PE) |

---

## Otras leyes vigentes (mismo export)

| Ley | Detalle |
|-----|---------|
| Neto post-descuento | **Sin** redondeo a centena · cascada exacta (`precioNetoCascada`) |
| Vendedor | Código Carlos · traductor **2.3.1.9.F** · HECTOR → **90** |
| Caso PE | Enriquecido `PE · sdrm… · REGULAR\|PROMOCIONAL\|LIQUIDACION` al confirmar |
| Codigo Articulo | Barra SDRM · rastrea prefijo **654** (calzado) / **638** (confecciones) |

---

## Smoke

```bash
cd report && npx tsx scripts/_smoke_csv_pe_depositos.ts
```

Esperado: 15 cols · `DEPOSITO` en col G · `Cant. Pares` en col M · DEPOSITO vacío en fila 2.

---

## Pendiente operativo

| # | Ítem | Estado |
|---|------|--------|
| 1 | Import real CSV en Carlos (piso) | ⏳ Director |
| 2 | Deploy Report prod (solo cierre etapa / orden directa) | ⏳ |
| 3 | FI históricas con `precio_neto` floored (88600) — CSV ya recalc exacto | 🟢 export |
| 4 | Documentar en Excel Hoja2 si hace falta fila HECTOR formal | ⏳ Excel |

---

**CHUSAR — integrado** (ver cierre turno agente)
