# CHUSAR — Tablet · Depósito header pilares (paridad RIMEC Web)

**Sub-sesión:** [SUBSESION_TABLET_DEPOSITO_HEADER_PILARES_20260617_CERRADA.md](../../4_etapas/SUBSESION_TABLET_DEPOSITO_HEADER_PILARES_20260617_CERRADA.md)  
**Estado:** ✅ CERRADA 2026-06-17 · **Superseded layout:** toolbar piso [2.4.3.7](./CHUSAR_TABLET_DEPOSITO_TOOLBAR_PISO.md) + CABECERA [2.4.3.6](./CHUSAR_TABLET_DEPOSITO_CABECERA_ESTANDAR.md)

---

## Qué es

Cabecera de **clasificación de producto** en `/deposito` — misma lógica que RIMEC Web catálogo, alimentada por **pilares en lectura**. Complementa el grid molécula ([CHUSAR_TABLET_DEPOSITO_FOTOS.md](./CHUSAR_TABLET_DEPOSITO_FOTOS.md)).

| # | Elemento | Notas |
|---|----------|-------|
| 1 | Género | Chips táctiles · FK `genero_id` |
| 2 | Marca | Pills · FK `marca_id` |
| 3 | Estilo | Pills · `grupo_estilo_id` |
| 4 | Línea · Color · Tipo 1 | Dropdowns multiselect |
| 5 | Buscar modelos… | Texto ILIKE |
| 6 | Paleta color | Círculos hex · sin Ofertas |

**Excluido:** Llegada/ETA · Ofertas (solo mayorista RIMEC Web).

---

## UX tablet

- Shell NIIF + **naranja Bazzar**
- Selector depósito FER/PAL/SM **independiente** del género
- **Ocultar filtros** → barra compacta + grid ~90% `100dvh`
- TOP **80** default · **200 · 500 · 1000** por marca

---

## Código

| Pieza | Ruta |
|-------|------|
| Estado filtros URL | `lib/deposito-filters.ts` |
| SQL cascada | `lib/server/deposito-filtros-sql.ts` |
| UI | `components/deposito/DepositoFiltrosHeader.tsx` |
| API chips | `GET /api/deposito/{id}/filtros-header` |
| API grid | `GET /api/deposito/{id}?genero_id=…&limit=80` |

Ventas `/cadena` sigue en `/filtros` (labels texto) — **no mezclar**.

---

## Manual funciones

Enlace procedimiento: §3.5 Tablet · depósito consulta stock visual — [INDICE.md](../../3_manual_funciones/INDICE.md)

Marco pilares: [TRIANGULO_HEADER_PILARES.md](../../3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md)

---

**Shibboleth:** 7 años
