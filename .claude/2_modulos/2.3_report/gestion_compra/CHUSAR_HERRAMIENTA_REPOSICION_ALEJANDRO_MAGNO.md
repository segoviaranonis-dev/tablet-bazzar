# CHUSAR — Herramienta de reposición!!! · Alejandro Magno (culminación)

**Código:** **2.3.1.22**  
**Keyword:** **Documenta** · Director 2026-07-14 («documenta al por menor»)  
**Estado:** 🟢 v1 código local · sellado memoria  
**App:** Report · http://localhost:3000/herramienta-reposicion  
**Hub AM:** `/rimec?mundo=panel-control` → botón **Herramienta de reposición!!! →**  
**Shibboleth:** Andrés, el que viene.

---

## 0 · Verificación previa (antes de Documenta)

| Capa | Resultado 2026-07-14 |
|------|----------------------|
| Código Report `/herramienta-reposicion` | ✅ Implementado (merge + API + grilla + link hub) |
| Patrón Disp+Venta / 3 entidades en Moria | ✅ Ya existía (`2.3.1.18` · `2.3.1.12`) |
| Nombre + 4 paneles «reposición» en PROTOCOLO / CHUSAR AM | ❌ **No estaba** → este CHUSAR lo sella |
| Mock UI (STOCK's naranja · VENTAS acordeón) | ✅ Tarjeta alineada al mock Director |

**Conclusión:** la planificación **no** estaba nombrada en Alejandro Magno hasta este Documenta; el **patrón de datos** sí. Ahora queda **canónica** bajo AM.

---

## 1 · Qué es

**Culminación de la estrategia Alejandro Magno:** una sola grilla de artículos (molécula) que junta, en sumas duras (sin clientes):

| # | Panel de datos | Origen | Dónde se ve en UI |
|---|----------------|--------|-------------------|
| 1 | **Pronta entrega · disponible** | PPD PE · saldo | Bloque **STOCK's** (pill borde verde + badge naranja) |
| 2 | **Compra previa · disponible** | PPD CP · saldo por quincena | Bloque **STOCK's** (pill azul + badge naranja) |
| 3 | **Compra previa · ejecutada / vendida** | PPD CP · `pares_vendidos` por quincena | Acordeón **VENTAS** · subtítulo Compra previa (badge verde) |
| 4 | **PROGRAMADO · cantidad** | PPD cat. 3 · vendido (si hay) o inicial | Acordeón **VENTAS** · **PROGRAMADO** (badge verde) |

No es el hub de KPIs (ese sigue compacto). No sustituye `/stock-pronta-entrega`, `/stock-transito`, `/stock-programado` — los **une** para reposición macro.

---

## 2 · Leyes Alejandro Magno que obedece

Padres:

- [PROTOCOLO_ALEJANDRO_MAGNO_PUERTA_CHUNA.md](../../1_fundamentos/1.1_protocolos/PROTOCOLO_ALEJANDRO_MAGNO_PUERTA_CHUNA.md)
- [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)
- [CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md](./CHUSAR_PATRON_DISPONIBLE_VENTA_ALEJANDRO_MAGNO.md) (**2.3.1.18**)
- [CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md](./CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md)
- [CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md](./CHUSAR_GRILLA_STOCK_TRES_CATEGORIAS_VISION.md) (**2.3.1.21**)

| Ley | Aplicación en reposición |
|-----|--------------------------|
| Un PPD · tres entidades | Merge filas PE + CP + PROGRAMADO |
| Disponible = saldo · Venta = `pares_vendidos` | STOCK's = disponibles · VENTAS = ejecutado/programado |
| PROGRAMADO 100% eficiente | Panel 4: cantidad dura (vendido o inicial); sin browse Web |
| Sin compradores en esta vista | **Prohibido** desglose cliente/cadena |
| Hub sin grilla embebida | Grilla solo en `/herramienta-reposicion` |

---

## 3 · Clave de artículo (dato duro)

```text
molécula = linea + referencia + material + color
UI código = {linea}.{referencia}
```

Misma clave que `moleculeKeyVentas` / grillas AM. Las **gradas se suman** dentro de la molécula. Las **quincenas** (`quincena_arribo.descripcion`) parten filas STOCK/VENTAS CP y PROGRAMADO.

PE: etiqueta fija **`Pronta entrega`** (no mezcla quincenas de tránsito).

---

## 4 · Fórmulas de suma (al por menor)

```text
PE disponible      = Σ saldo PPD  donde quincena = 'Pronta entrega' / entidad STOCK PE
CP disponible[q]   = Σ saldo PPD  Compra previa · quincena_desc = q
CP vendido[q]      = Σ pares_vendidos Compra previa · quincena_desc = q
PROGRAMADO[q]      = Σ (pares_vendidos > 0 ? pares_vendidos : cantidad_inicial) · cat. 3 · q
```

Saldo fila = `cantidad` / `GREATEST(cantidad_pares − pares_vendidos, 0)` según query sectorial existente.

**KPI cabecera página:** suma de totales de todas las moléculas mostradas (tras filtros UI).

---

## 5 · UI canónica (mock Director)

```
┌─ tarjeta ─────────────────────────────┐
│ MOLEKINHA                             │
│ [ imagen ]                            │
│ 2358.100                    Sin LPN   │
│                                       │
│ STOCK's                               │
│ ┌─ borde azul ─────────────────────┐  │
│ │ 1ra Q. Agosto          [12 p] naranja │
│ │ 1ra Q. Octubre         [48 p]       │
│ │ Pronta entrega (borde verde) [36 p] │
│ └─────────────────────────────────┘  │
│                                       │
│ VENTAS  [acordeón abrir/cerrar]       │
│ ┌─ borde verde ────────────────────┐  │
│ │ Compra previa                    │  │
│ │   1ra Q. Agosto        [12] verde│  │
│ │   1ra Q. Octubre       [12]      │  │
│ │ PROGRAMADO                       │  │
│ │   1ra Q. Agosto        [12]      │  │
│ └──────────────────────────────────┘  │
└───────────────────────────────────────┘
```

- Acordeón agrupa los **bloques principales de VENTAS** (CP ejecutada + PROGRAMADO).
- STOCK's permanece siempre visible (disponibles).
- Sin lista de clientes.

---

## 6 · Código Report (rutas absolutas lógicas)

| Pieza | Path |
|-------|------|
| Página | `report/src/app/herramienta-reposicion/page.tsx` |
| Client | `report/src/components/herramienta-reposicion/HerramientaReposicionClient.tsx` |
| Card | `report/src/components/herramienta-reposicion/ReposicionArticuloCard.tsx` |
| Merge | `report/src/lib/herramienta-reposicion/merge-reposicion.ts` |
| Query orquestación | `report/src/lib/herramienta-reposicion/queries.ts` |
| API | `GET /api/herramienta-reposicion` → `report/src/app/api/herramienta-reposicion/route.ts` |
| Fuentes | `listImportadoProductos` · `listTransitoProductos` · `listProgramadoProductos` |
| Hub link | `report/src/app/rimec/components/MundoPanelControl.tsx` |
| Middleware | `ROLE_ROUTES` + matcher `/herramienta-reposicion` · API |

Auth: mismo universo Report `rol_id=1` (middleware).

---

## 7 · Relación con hojas sectoriales

| Hoja | Rol vs reposición |
|------|-------------------|
| `/stock-pronta-entrega` | Micro PE · misma fuente PE |
| `/stock-transito` (+ disponible/ventas) | Micro CP · misma fuente CP |
| `/stock-programado` | Micro PROGRAMADO |
| `/herramienta-reposicion` | **Macro fusión** · decisión de reponer |

Alejandro Magno (hub) apunta a reposición como **siguiente lente** después de los tres KPIs.

---

## 8 · Pendiente operativo

- [ ] Smoke visual Director con sesión (SKU tipo mock 2358.100)
- [ ] Deploy Report (solo cierre etapa u orden **despliega**)
- [ ] Filtros biblioteca / llegada multi (opcional v2)
- [ ] Memoria-web HTML gemelo (si Director usa gemelo)

---

## 9 · Ratificación Director

1. Culminación AM · una grilla.  
2. Cuatro paneles de cantidad: PE disp · CP disp · CP vend · PROGRAMADO.  
3. Sumas 100% dato duro · sin clientes.  
4. Compra previa dispon+ejecutada visibles; VENTAS bajo acordeón junto a PROGRAMADO.  
5. Documentado en Moria tras verificación (este archivo).

**Niveles tarjeta (N1/N2/N3):** [CHUSAR_REPOSICION_NIVELES_AM.md](./CHUSAR_REPOSICION_NIVELES_AM.md) · **2.3.1.23** · Documenta 2026-07-15.

**Ordenamiento 4 KPIs + overlay:** [CHUSAR_ORDENAMIENTO_COMPRA_PREVIA_REPOSICION.md](./CHUSAR_ORDENAMIENTO_COMPRA_PREVIA_REPOSICION.md) · **2.3.1.24** · Documenta 2026-07-15.

**Handoff cierre (dep. FI 5000):** [CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md](./CHUSAR_HANDOFF_CIERRE_AM_FACTURA_5000.md) · **2.3.1.25** · Documenta 2026-07-15.

**Integrado:** Documenta · Cursor Auto · 2026-07-14
