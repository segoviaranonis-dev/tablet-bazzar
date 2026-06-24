# Triángulo header — Tablet Bazzar

**Canónico holding:** `Nexus_Core/.claude/3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md`

## Implementación

| Archivo | Rol |
|---------|-----|
| `lib/server/pilar-triangulo.ts` | JOINs y expresiones COALESCE pilar → staging |
| `lib/server/catalogo-sql.ts` | `fromClause` — filtros, catálogo, ingresar |
| `components/cadena/FiltrosCabecera.tsx` | UI chips género · marca · estilo · **tipo_1** · tipo_v2 (categoría) |
| `app/api/deposito/[id]/filtros/route.ts` | Agregados vía `catalogo-sql` |

## Regla operativa

Cambio en Report `/pilares` → `UPDATE linea` / `linea_referencia` → próximo request tablet lee pilares con `LEFT JOIN linea` + `linea_referencia`. **No** hace falta sync depósito.

## Diferencia vs RIMEC Web

| Dimensión | Tablet chip | Fuente SQL |
|-----------|-------------|------------|
| **Categoría** | `tipo_v2` | CALZADO / CONFECCIONES (`deposito.tipo_v2_id`) |
| **Tipo 1** | ABIERTO · CERRADO · CARTERAS · MEDIAS… | `linea_referencia.tipo_1_id` → `COALESCE(lr.tipo_1_id, s.tipo_1_id)` |

Report análisis depósito usa `d.genero_id` denormalizado (incluye filas sin stock). Tablet filtros solo `cantidad > 0`.

Doc POS completo: [LOGICA_OPERATIVA_POS_BAZZAR.md](./LOGICA_OPERATIVA_POS_BAZZAR.md) §10
