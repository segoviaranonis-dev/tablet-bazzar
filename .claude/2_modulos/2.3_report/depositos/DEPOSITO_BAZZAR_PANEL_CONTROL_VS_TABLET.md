# Depósito Bazzar — Panel control (Report) vs ejecución (Tablet)

**Código plan:** `2.3.6.01`  
**Ratificado:** 2026-06-27 · orden Director **Documenta**  
**Cabecera filtros:** [CABECERA_DE_FILTROS.md](../../../3_arquitectura/3.2_venta_tienda/CABECERA_DE_FILTROS.md)  
**Operativa:** [CHUSAR_VISTA_OPERATIVA_DEPOSITO.md](./CHUSAR_VISTA_OPERATIVA_DEPOSITO.md)

---

## Ley de arquitectura (indiscutible)

| Producto | Rol | Qué es | Qué **no** es |
|----------|-----|--------|----------------|
| **Report · Depósito Bazzar** | **Panel de control** | Admin sync · 18 tablas · KPIs · operativa consulta · artículos · pilares | Herramienta de venta en piso |
| **Tablet Bazzar** | **Herramienta de ejecución** | `/cadena` venta POS · carrito · tickets · empaque | Panel gerencial · no reemplaza Report |

**Misma verdad BD:** `deposito_1_{cliente_id}_tienda` (y guardado/averiado en Report).  
**Distinta responsabilidad UI:** Report **manda y observa** · Tablet **ejecuta** la venta.

---

## Rutas canónicas

| Canal | App | Puerto local | Ruta principal | CABECERA DE FILTROS |
|-------|-----|--------------|----------------|---------------------|
| Panel control | Report | **3001** | `/depositos-bazzar/[cliente_id]?tab=operativa` | `TrianguloHeaderDeposito.tsx` · **bajo** header depósito + tabs |
| Ejecución venta | Tablet | **3000** | `/cadena` → `/cadena/vista` | `FiltrosCabecera.tsx` · entrada + INGRESAR |
| Consulta rápida tablet | Tablet | 3000 | `/deposito` | secundaria · no panel control |

**Error grave a evitar:** tratar `/cadena` (tablet) como «el depósito Bazzar» gerencial. El módulo etapa **Depósito Bazzar** vive en **Report**.

---

## Layout Report operativa (caso OK biblioteca)

```
┌─ Header página: Depósito Fernando · Adultos · TIENDA ─────────┐
├─ Tabs: Análisis | Operativa | Filtros por índice | Artículos        │
├─ CABECERA DE FILTROS (bloque único, sin repetir título tienda) │
│  Género → Marca → Estilo → Tipo 1 → Categoría → Línea         │
│  → Buscar → TONO                                               │
├─ Grilla cards · orden pares totales DESC                       │
└────────────────────────────────────────────────────────────────┘
```

Implementación: `report/.../TrianguloHeaderDeposito.tsx` · alias export `CabeceraFiltrosDeposito.tsx`.

---

## Casos OK — biblioteca CABECERA DE FILTROS

| # | Caso | Report operativa | Tablet `/cadena` |
|---|------|:----------------:|:----------------:|
| 1 | Nombre UI | **CABECERA DE FILTROS** | **CABECERA DE FILTROS** |
| 2 | Orden 8 filas | ✅ completo (+ Línea) | ✅ sin Línea en entrada |
| 3 | TONO círculos | ✅ `FiltroTonoOperativa` | ✅ `FiltroTonoRow` |
| 4 | Vacío = todos | ✅ FK arrays vacíos | ✅ labels vacíos |
| 5 | Cascada excluir | ✅ `buildOperativaOpciones` | ✅ `filasEntradaFiltradas` |
| 6 | Grilla orden | ✅ `totalPares` DESC post-agrupar | N/A (lista refs por pares SQL) |
| 7 | Posición | Bajo header depósito | Bajo banda entrada ventas |

Copiar **lógica** del estándar · no clonar SQL tablet en Report sin mapper FK.

---

## Quién muta qué

| Acción | Report | Tablet |
|--------|:------:|:------:|
| Sync retail → depósito | ✅ | ❌ |
| Ver 3 categorías (tienda/guardado/averiado) | ✅ | solo tienda |
| Filtrar stock operativa | ✅ | ✅ entrada cadena |
| Vender / carrito / ticket | ❌ | ✅ |
| Asignar TONO pilar (gerente) | ✅ pilares admin | ✅ hero cadena (rol 1) |

---

**Shibboleth:** 7 años · Depósito Bazzar = Report · Tablet = ejecución.
