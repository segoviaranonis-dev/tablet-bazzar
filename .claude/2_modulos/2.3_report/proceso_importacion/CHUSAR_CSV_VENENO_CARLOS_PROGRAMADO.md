# CHUSAR — CSV veneno Carlos · PROGRAMADO

**Código:** 2.3.1.7.5.3.4 · **Estado:** 🟢 **v2 · 1 FI = 1 bloque SHOP** · 2026-07-10  
**Shibboleth:** Chayanne el mejor.  
**Conjunto:** [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](./PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md) · [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](../deposito_rimec/ESTRATEGIA_HIEDRA_VENENOSA_PE.md)

---

## Norte estratégico (Director · 2026-07-07 · v2 2026-07-10)

Con el botón **📄 CSV** en tab **Facturas Internas** del PP, Nexus **inyecta el veneno** en el **sistema legal de Carlos** — mismo formato de archivo que el operador legacy usa hoy. Objetivo: **desplazar** el flujo manual Streamlit/Excel sin cambiar el receptor.

> **Hiedra venenosa · Alejandro Magno:** el holding crece dentro del host hasta absorberlo. Este CSV es la **punta de lanza** del corte PROGRAMADO. **Cadena:** IC = FI Nexus = **1 bloque SHOP** = **1 factura Carlos**.

### Fix v2 (Director · 2026-07-10)

| Antes (v1) | Ahora (v2) |
|------------|------------|
| Bloque CSV = `cliente_id + plazo` | Bloque CSV = **`factura_interna.id`** |
| Varios IC mismo cliente → **1 factura Carlos** | **1 IC → 1 FI → 1 SHOP** (repetir código cliente) |
| PP-17: 98 FI → ~32 bloques SHOP | PP-17: **98 FI → 98 bloques SHOP** |

Código: `buildCsvCarlosContent` · `fetchCsvCarlosRows` · `ORDER BY fi.id, fid.id`.

---

## Referencia canónica en disco

| Campo | Valor |
|-------|--------|
| **Archivo ejemplo** | `csv's/programado/8604-26.csv` |
| **Proforma** | `8604/2026` · `PRG_8604-2026` |
| **Nombre descarga** | `{proforma}-{aa}.csv` → **`8604-26.csv`** |
| **Caso PP** | PP-2026-0015 · 10 FI · 10.032 pares |

---

## UI Report

| Pieza | Detalle |
|-------|---------|
| **Ruta** | `/proceso-importacion/pedido-proveedor/[ppId]?tab=fi` |
| **Botón** | **📄 CSV** · esquina derecha cabecera tab FI (marca roja Director) |
| **Visible si** | PROGRAMADO: ≥1 FI (RESERVADA o CONFIRMADA) · CP: ≥1 FI CONFIRMADA |
| **API** | `GET /api/proceso-importacion/pedido-proveedor/[ppId]/csv-ventas` |
| **Código** | `report/src/lib/pedido-proveedor/csv-ventas-export.ts` |

---

## Formato archivo (sistema Carlos — NO 21 cols MAPA)

| # | Regla |
|---|--------|
| 1 | Separador **`;`** (punto y coma) |
| 2 | **Fila 1** = texto instructivo legacy (copiado de `8604-26.csv`) |
| 3 | **Fila 2** = header `SHOP;'STYL.E;BRAND;…` |
| 4 | **SHOP** = `cliente_id` solo en **inicio de bloque factura** |
| 5 | Bloque = **1 `factura_interna`** (PROGRAMADO: 1 IC = 1 FI = 1 bloque). **Repetir SHOP** aunque el `cliente_id` sea el mismo |
| 6 | **'STYL.E** = comilla simple + `linea.referencia` (truco Excel) |
| 7 | Cols grada · CASO · ESTILO · ABoCR = desde PPD / `precio_lista` (v2) |
| 8 | **CANT PARES** = pares por línea FI |
| 9 | **Vendedor** = `vendedor_v2.id_vendedor` numérico (ej. 29) |
| 10 | **Cobrador** = **90** fijo |
| 11 | Encoding UTF-8 **con BOM** |

### Estados FI incluidos

| Categoría PP | Estados exportados |
|--------------|-------------------|
| **PROGRAMADO** (`categoria_id=3`) | RESERVADA + CONFIRMADA |
| **Compra previa** | Solo CONFIRMADA |

---

## Deuda v2 (siguiente iteración)

- [x] **1 FI = 1 bloque SHOP** (v2 · 2026-07-10) — paridad IC↔factura Carlos
- [ ] Smoke import real en sistema Carlos con CSV regenerado (8051-26 · 8604-26)
- [ ] Reclamos Alfredo post-smoke — validar vendedor · grada · caso
- [ ] Paridad marca×caso en FI programado (preventa no acumula 2 marcas) — OT aparte
- [ ] Paridad 21 cols MAPA (`MAPA_CSV_VENTAS_PP.md`) como export alternativo si hace falta

---

## Diagrama veneno

```text
Nexus Report (tab FI · PP PROGRAMADO)
    ↓ 📄 CSV
8604-26.csv  (formato Carlos · ; · SHOP blocks)
    ↓ import manual / batch
Sistema legal Carlos  ←── objetivo desplazamiento
```

---

**Índice:** [INDICE.md](./INDICE.md) · **Hiedra:** [ESTRATEGIA_HIEDRA_VENENOSA_PE.md](../deposito_rimec/ESTRATEGIA_HIEDRA_VENENOSA_PE.md)
