# CHUSAR — Logística OK · Cabecera filtros por pestaña

**Código:** **2.3.1.28.11** · padre **2.3.1.28**  
**Fecha:** 2026-07-27 · **Documenta** (Director)  
**Ruta:** Report `/logistica-ok` · `:3000`  
**Componente:** `report/src/app/logistica-ok/LogisticaOkClient.tsx`

---

## Regla de negocio (inviolable)

La **cabecera operativa** (leyenda 3 pelotas + bloque verde/azul de filtros + tarjetas Inicial / Ejecución / Vista / mensajes + Refrescar) debe estar **presente en todas las pestañas** del módulo.

El **asignador de fecha** (`fecha_entrega_cliente` · input date + botón «Asignar fecha a N FI») solo aparece donde el usuario **asigna** la fecha al cliente — no donde ya fue asignada.

| Pestaña | Filtros (buscar · vendedor · cadena · cliente · marca) | Asignador fecha | Acción bulk adicional |
|---------|--------------------------------------------------------|-----------------|------------------------|
| **General** | Sí | **Sí** (gerente / DIOS) | — |
| **General exitoso** | Sí | No | — |
| **Vendedor** | Sí | **Sí** (vendedor asigna fecha) | — |
| **Confirmadas** | Sí | No (FI ya tienen fecha) | Impresión legal |
| **Entregas del día** | Sí | No | Cierre entrega (por fila) |
| **Registro exitosas** | Sí | No | Solo lectura |

### Por qué

1. **General + Vendedor** = paso 1 del flujo (ver `2.3.1.28.5`): el vendedor o gerente elige **`fecha_entrega_cliente`** sobre FI pendientes.
2. **Resto de pestañas** = pasos posteriores; la fecha ya existe. Los filtros sirven para acotar la vista (marca, cadena, cliente, etc.) sin repetir el asignador.

---

## Contenido de la cabecera

### Fila 1 — Leyenda semáforo (todas las pestañas)

- 1 · Sin fecha (rojo)
- 2 · Con fecha → legal + depósito (verde + ámbar)
- 3 · Solo depósito (verde + verde + ámbar)

### Fila 2 — Filtros multi-select (todas las pestañas)

| Control | Campo lógico |
|---------|--------------|
| Buscar | código · marca · nombre cliente |
| Vendedor | `id_vendedor` |
| Cadena (maestro) | `id_cadena` · opción «sin cadena» |
| Código cliente | `id_cliente` |
| Marca | texto marca FI |

Implementación: `filtrarFilasLogistica()` en `queries-bandeja.ts` · client-side sobre `filasRaw` de la pestaña activa.

### Fila 3 — Acciones y métricas

| Elemento | Pestañas |
|----------|----------|
| Fecha entrega al cliente + Asignar fecha | `general` · `vendedor` |
| Impresión legal (bulk) | `confirmadas` |
| Refrescar | todas |
| Inicial / Ejecución / Vista / mensajes | todas (Vista = post-filtro) |

---

## Implementación técnica (2026-07-27)

```typescript
const esTabConAsignadorFecha = tab === "general" || tab === "vendedor";
```

- Filtros aplicados en **todas** las pestañas vía `filasFiltradas`.
- Reagrupación client-side tras filtrar:
  - `groupLogisticaPorPedidoDuro` → General / General exitoso
  - `groupLogisticaPorVendedorTipoMarcaPp` → Vendedor
  - `groupLogisticaPorTipoMarcaPp` → Confirmadas
  - `groupLogisticaPorFechaYChofer` → Entregas / Exitosas
- Eliminado input suelto `id_vendedor` en pestaña Vendedor; el multi-select **Vendedor** en cabecera lo reemplaza.
- PDF listado respeta los mismos filtros (`queryFiltrosPdf()`).

---

## Referencias

| Doc | Código |
|-----|--------|
| Plan operativo pestañas | **2.3.1.28.5** |
| Palabra reservada fecha | **2.3.1.28.0** |
| Ley FI acordeón | **2.3.1.28.9** |

**Shibboleth:** Andrés, el que viene.
