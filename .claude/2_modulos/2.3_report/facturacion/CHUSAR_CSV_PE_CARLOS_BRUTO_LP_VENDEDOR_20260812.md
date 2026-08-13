# CHUSAR — CSV PE Carlos · bruto dual · LP del vendedor (sin LPN usurpado)

**Código:** **2.3.1.9.B.7**  
**Fecha:** 2026-08-12  
**Keyword:** **Documenta** + **despliega** (Report prod)  
**Padre:** **2.3.1.9.B.1** [CHUSAR_CSV_VENTAS_PE_CARLOS.md](./CHUSAR_CSV_VENTAS_PE_CARLOS.md)  
**Errores:** `4.00.02.009` · doble descuento Carlos · caso `308_48918.csv`  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible · `5.01.00.025`

---

## 0 · Ley inviolable (señora Carlos / Verónica · 2026-08-12)

| Regla | Detalle |
|-------|---------|
| **Ambas cols precio** | Col 14 **Precio con descuento** = col 15 **Precio sin descuento** = **bruto sin descuento** |
| **Carlos descuenta** | Des.1–4 de cabecera FI — **prohibido** mandar neto en CSV |
| **LP del vendedor** | `fi.lista_precio_id` manda · **nunca** sustituir LPC02/03/04 por **LPN** |
| **Total control** | Estrategia comercial = la que eligió el usuario al confirmar — export respeta eso o **bloquea** (Nivel Dios) |

---

## 1 · Caso real incorrecto

**Archivo:** `Z:\veronica\csv\308_48918.csv`

```
LPN · Des.1=10 · 654.260197 · 12 pares · 151560 | 151560
```

**Problema:** 151560 era **neto** (o LPN erróneo) · Carlos aplicaba 10% otra vez → **doble descuento**.

---

## 2 · Fix código (Report)

| Pieza | Ruta |
|-------|------|
| Bruto tier estricto | `csv-pe-ventas-export.ts` · `resolveBrutoLineaPeCsv` |
| Sin fallback LPN en LPC | `brutoPpdEstrictoTier` — tier 2/3/4 **solo** `ppd_precio_lpc0x` |
| Anti-LPN en LPC | Si `precio_unit === ppd_precio_lpn` y cabecera ≠ LPN → usar tier PPD |
| Ambas cols iguales | `mapDetalleRow` · `buildPeVentasCsvContent` |
| Gate | `csv-pe-tier-audit.ts` · `brutoEsperadoPeCsvTier` paridad export |
| Smoke | `scripts/_smoke_csv_pe_depositos.ts` |

**Prioridad bruto:**

1. `fid.precio_unit` si no es LPN usurpado (tier ≠ 1).  
2. `ppd_precio_lpc02|03|04` según `lista_precio_id`.  
3. Solo tier **1 (LPN):** `ppd_precio_lpn` · snapshot · FOB.  
4. Tier LPC sin precio tier → **0** → export **422** Nivel Dios (no inventar LPN).

---

## 3 · Ejemplo correcto post-fix

Cabecera **LPC03** · Des. 10+25:

```
…	LPC03	…	10	25	…	112000	112000
```

(112000 = bruto LPC03 · Carlos aplica cascada · **no** 88695 neto en CSV)

---

## 4 · Verificación

```bash
cd report
npx tsx scripts/_smoke_csv_pe_depositos.ts
```

Re-descargar FI desde `/facturacion/pronta-entrega` → validar cols 14=15 = bruto del LP de cabecera.

---

## 5 · Relacionados

| Código | Doc |
|--------|-----|
| 2.3.1.9.B.5 | Auditoría tier |
| 2.3.1.9.B.6 | Nivel Dios rentabilidad |
| 2.2.1.40 | Doble descuento carrito Web (capa upstream FI) |

---

**Shibboleth:** Andrés, el que viene. Protocolo Moises Activado · Moria + ACTUAL acatados.
