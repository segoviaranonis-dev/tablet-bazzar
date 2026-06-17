# Triángulo header — Tablet Bazzar

**Canónico holding:** `Nexus_Core/.claude/3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md`

## Implementación

| Archivo | Rol |
|---------|-----|
| `lib/server/pilar-triangulo.ts` | JOINs y expresiones COALESCE pilar → staging |
| `lib/server/catalogo-sql.ts` | `fromClause` — filtros, catálogo, ingresar |
| `components/cadena/FiltrosCabecera.tsx` | UI chips género · marca · estilo · tipo_v2 |
| `app/api/deposito/[id]/filtros/route.ts` | Agregados vía `catalogo-sql` |

## Regla operativa

Cambio en Report `/pilares` → `UPDATE linea` / `linea_referencia` → próximo request tablet lee pilares con `LEFT JOIN linea` + `linea_referencia`. **No** hace falta sync depósito.

## Diferencia vs RIMEC Web

Tablet chip **Tipo** = `tipo_v2` (CALZADO/CONFECCIONES) del depósito. RIMEC Web dropdown **Tipo 1** = `linea_referencia.tipo_1_id`.
