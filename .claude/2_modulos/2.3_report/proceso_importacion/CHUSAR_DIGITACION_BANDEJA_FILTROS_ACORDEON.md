# CHUSAR — Digitación bandeja · acordeón embarque + filtros multi-select

**Código:** `2.3.1.7.4.4`  
**Fecha:** 2026-07-20  
**App:** Report · `/proceso-importacion/digitacion`  
**Estado:** 🟢 deploy orden Director

---

## Qué es

Mejora de la vista **Pendientes** (ramos Compra previa y PROGRAMADO):

1. **Acordeón por FECHA DE EMBARQUE** — cada grupo muestra **N IC · N clientes · total pares**.
2. **Columnas** Vendedor (desde `vendedor_v2` / IC) y **Nro. fábrica** (vacío en pendientes sin puente PP; se completa al asignar).
3. **Cabecera de filtros multi-select** (sin selección = mostrar todo) sobre todos los campos visibles:
   IC · Vendedor · Marca · Cliente · Nro. pedido fábrica · Estado · Creada · Pares · Evento · Fecha de embarque.
4. Convivencia con **multi-asignar** PROGRAMADO (`2.3.1.7.4.3`): checkboxes por fila / por grupo / visibles filtradas → barra **Asignar N →**.

## Código

| Pieza | Ruta |
|-------|------|
| Hub UI | `report/src/app/proceso-importacion/digitacion/components/DigitacionHubClient.tsx` |
| Agrupar | `groupIcPendientesPorEmbarque` en `bandeja-query.ts` |
| Query | `listIcPendientesDigitacion` (+ `vendedor`, `quincena_arribo_id`) |

## Relacionados

- [CHUSAR_DIGITACION.md](./CHUSAR_DIGITACION.md)
- [CHUSAR_DIGITACION_MULTI_ASIGNAR_PROGRAMADO.md](./CHUSAR_DIGITACION_MULTI_ASIGNAR_PROGRAMADO.md)

**Shibboleth:** Andrés, el que viene.
