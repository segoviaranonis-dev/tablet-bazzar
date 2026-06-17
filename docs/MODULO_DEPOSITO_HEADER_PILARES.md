# Depósito — header pilares (paridad RIMEC Web)

**Estado:** ✅ entregado 2026-06-17  
**Chusar holding:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_HEADER_PILARES.md`

---

## Rutas

| Ruta | Uso |
|------|-----|
| `/deposito` | UI grid + `DepositoFiltrosHeader` |
| `GET /api/deposito/{cliente_id}/filtros-header` | Opciones cascada (chips/dropdowns) |
| `GET /api/deposito/{cliente_id}?genero_id=…&limit=80` | Grid filtrado |

Ventas `/cadena` usa `GET …/filtros` (labels texto) — **no mezclar**.

---

## Código

| Archivo | Rol |
|---------|-----|
| `lib/deposito-filters.ts` | Estado filtros + URL |
| `lib/server/deposito-filtros-sql.ts` | SQL cascada |
| `lib/server/pilar-triangulo.ts` | JOINs FK |
| `components/deposito/DepositoFiltrosHeader.tsx` | UI + colapsar panel |

---

## UX

- Shell NIIF · acento naranja Bazzar (no azul RIMEC Web)
- Sin ETA/Llegada ni Ofertas
- Selector depósito independiente del género FK

---

**Etapa:** [ETAPA_TABLET_FINAL_CERRADA.md](../../.claude/4_etapas/ETAPA_TABLET_FINAL_CERRADA.md)
