# CHUSAR — Tablet · Depósito · Agrupación por cajas · Matriz 18

**Subcuenta:** **2.4.3.4** · Tablet Bazzar  
**Padre:** [CHUSAR_TABLET_DEPOSITO_FOTOS.md](./CHUSAR_TABLET_DEPOSITO_FOTOS.md) · **2.4.3**  
**Etapa cierre:** [ETAPA_DEPOSITO_OPERATIVA_TABLET_CAJAS_CERRADA.md](../../4_etapas/ETAPA_DEPOSITO_OPERATIVA_TABLET_CAJAS_CERRADA.md)  
**Paridad Report:** [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](../2.3_report/depositos/CHUSAR_VISTA_OPERATIVA_DEPOSITO.md)  
**Nomenclatura 18:** [NOMENCLATURA_DEPOSITOS_BAZZAR.md](../2.6_depositos_bazzar/NOMENCLATURA_DEPOSITOS_BAZZAR.md)  
**Estado:** ✅ **CERRADA** — 2026-06-27

---

## Qué es

Evolución de `/deposito`: **1 tarjeta = 1 caja** (molécula L+R+material+color) con **tabla grada × stock** por talla — paridad visual con Report Operativa y cadena POS.

| Capa | Ubicación |
|------|-----------|
| Ruta | `/deposito` · `app/deposito/page.tsx` |
| Grilla | `components/deposito/GrillaCajasDeposito.tsx` |
| Tabla grada | `components/deposito/TablaGradaDeposito.tsx` |
| Agrupación | `lib/depositos/agrupar-cajas.ts` |
| API productos | `GET /api/deposito/[cliente_id]?limit=all` |
| API matriz 18 | `GET /api/deposito/status` → `matriz[]` + `resumen` |
| Config | `lib/depositos-config.ts` · `DEPOSITOS_MATRIZ` (18) · `DEPOSITOS` (6 tienda) |

---

## Matriz 18 · entes

```text
6 tiendas × 3 categorías = 18 tablas public.deposito_{1|2|3}_{cliente_id}_{tienda|guardado|averiado}
```

| cliente_id | Código | Ente | Tipo |
|------------|--------|------|------|
| 2100 | FER-A | Fernando | Adultos |
| 2900 | FER-N | Fernando | Niños |
| 2400 | SM-A | San Martin | Adultos |
| 2700 | SM-N | San Martin | Niños |
| 3100 | PAL-A | Palma | Adultos |
| 3200 | PAL-N | Palma | Niños |

**Tablet selector:** solo **nivel 1 · tienda** (6).  
**Status API:** expone las **18** tablas con conteos · categoría · flag `tablet`.

Helpers: `getDepositoConfig(cliente_id, categoria)` · `getDepositosByCategoria()` · `ENTES_MAP` · `DEPOSITOS_MAP`.

---

## Ley de caja (molécula)

```typescript
moleculeKey = `${linea}-${referencia}-${material_code}-${color_code}`
```

Dentro de cada caja: sumar `cantidad` por `grada` → columnas talla · fila stock · badge **total pares**.

Orden grilla: `totalPares DESC` · desempate `key`.

---

## UI card

| Elemento | Origen |
|----------|--------|
| Foto sm/ | `ProductImage` · thumb → flat |
| Badge naranja | `totalPares` + `p` |
| Marca | uppercase |
| Código | `{linea}.{referencia}` |
| Subtítulo | descp_material · descp_color |
| Tabla | ente badge + tallas + stock naranja + estilo pie |

Contador cabecera grilla: **N cajas** · **M pares** · código depósito (`compactStats` en toolbar piso).

**Toolbar piso (2026-06-10):** [CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md](./CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md) · ATRÁS · tabs · CABECERA cerrada default.

**Integridad grada:** [CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md](./CHUSAR_TABLET_DEPOSITO_GRADA_INTEGRIDAD.md) · TOP/marca = cajas · scroll horizontal `TablaGradaDeposito`.

---

## API status (matriz)

```json
{
  "configured": true,
  "depositos": [ /* 6 tienda */ ],
  "matriz": [ /* 18 entradas */ ],
  "resumen": {
    "tablas_total": 18,
    "tiendas": 6,
    "categorias": [ /* tienda/guardado/averiado */ ]
  }
}
```

---

## Diferencia vs CHUSAR fotos legacy

| | Fotos 2026-06-17 | Cajas 2026-06-27 |
|---|------------------|------------------|
| Unidad | molécula + stock red 3 tiendas | **caja local** + tabla grada |
| Límite | TOP 80/marca | `limit=all` agrupado |
| Tablas extra | `StockRedGradaTables` | `TablaGradaDeposito` (1 tienda activa) |

Componentes stock red siguen en repo para cadena/otros modos — `/deposito` usa grilla cajas.

---

## Dev · smoke

```bash
cd tablet-bazzar && npm run dev   # :3000
/deposito · cliente 2100 · hard refresh
```

---

**Documenta — orden Director — 2026-06-27**
