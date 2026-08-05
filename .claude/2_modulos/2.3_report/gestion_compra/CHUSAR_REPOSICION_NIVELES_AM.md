# CHUSAR — Niveles de tarjeta · Herramienta reposición · Alejandro Magno

**Código:** **2.3.1.23**  
**Keyword:** **Documenta** · Director 2026-07-15  
**Estado:** 🟢 Política + código local · **2.3.1.23**  
**Implementado:** 2026-07-15 · `nivel-am.ts` · chip N1/N2/N3 · orden grilla · mapa inmutable
**App:** Report · `/herramienta-reposicion`  
**Padre:** [CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md](./CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md) (**2.3.1.22**)  
**Shibboleth:** Andrés, el que viene.

---

## 1 · Propósito

Clasificar cada **tarjeta molécula** (L+R+material+color) de la herramienta de reposición en **tres niveles**, según cuántas de las **cuatro categorías Alejandro Magno** tienen datos **> 0 pares**.

Sirve para **ordenar la grilla**, **priorizar reposición** y **leer de un vistazo** la madurez comercial del artículo (stock + ventas ejecutadas + programado).

---

## 2 · Las cuatro categorías (ejes AM)

Cada tarjeta puede exponer hasta **4 bloques de verdad**. Son **independientes**: una quincena CP en STOCK no implica venta CP ni programado.

| Eje | Nombre Director | Bloque UI | Origen datos (`ReposicionArticulo`) | Presencia |
|-----|-----------------|-----------|-------------------------------------|-----------|
| **A** | **Compra previa** (disponible) | STOCK's · pill quincena (borde azul) + badge naranja | `stock[]` **sin** etiqueta «Pronta entrega» | ∃ bucket con `pares > 0` |
| **B** | **Pronta entrega** (disponible) | STOCK's · pill «Pronta entrega» (borde verde) + badge naranja | `stock[]` con `label === "Pronta entrega"` | `pares > 0` |
| **C** | **Venta de compra previa** (ejecutada) | VENTAS acordeón · subtítulo **Compra previa** (badge verde) | `ventasCp[]` | ∃ bucket con `pares > 0` |
| **D** | **Ventas programados** | VENTAS acordeón · **PROGRAMADO** (badge verde) | `ventasProgramado[]` | ∃ bucket con `pares > 0` |

**Regla dura:** contar presencia por **suma agregada > 0** en la molécula, no por «existir fila vacía» ni por número de quincenas.

Referencia código: `report/src/lib/herramienta-reposicion/merge-reposicion.ts` · UI `ReposicionArticuloCard.tsx`.

---

## 3 · Niveles de clasificación

Sea `n` = cantidad de ejes A–D presentes (0–4).

| Nivel | Condición | Significado operativo |
|-------|-----------|------------------------|
| **Nivel 1** | `n = 4` | **Completo AM** — el artículo cruza las cuatro dimensiones: CP en depósito, PE en depósito, ventas CP ejecutadas y programado con movimiento. **Tarjeta referencia** (ej. captura Director VIZZANO). |
| **Nivel 2** | `n = 2` o `n = 3` | **Incompleto** — participa en la estrategia pero **falta al menos un eje** (típico: falta programado o falta venta CP). Sigue siendo accionable; revisar qué panel falta. |
| **Nivel 3** | `n = 1` | **Monocategoría** — solo un eje con datos. Caso frecuente: **solo Pronta entrega** en STOCK's, sin CP ni VENTAS. Mínima señal para reposición macro. |

**Casos borde:**

| `n` | Tratamiento |
|-----|-------------|
| `0` | Sin datos AM — **no mostrar** en grilla o bandeja «Sin señal» (fuera de niveles 1–3). |
| `4` | Siempre **Nivel 1** aunque haya una sola quincena en cada panel. |

**Orden de grilla recomendado (Director):** Nivel 1 → Nivel 2 → Nivel 3 → (sin señal).

---

## 4 · Análisis tarjeta ejemplo — VIZZANO `6291.900`

Captura Director 2026-07-15 · molécula **6291 · 900** · LPN **146.200**.

### STOCK's (naranja)

| Etiqueta | Pares | Eje |
|----------|------:|-----|
| 1ra Q. de Agosto | 48 | **A** Compra previa disp. |
| 1ra Q. de Octubre | 60 | **A** Compra previa disp. |
| Pronta entrega | 72 | **B** PE disp. |

### VENTAS (verde · acordeón)

| Subbloque | Etiqueta | Pares | Eje |
|-----------|----------|------:|-----|
| Compra previa | 1ra Q. de Agosto | 12 | **C** Venta CP ejecutada |
| PROGRAMADO | 1ra Q. de Septiembre | 8 | **D** Programado |
| PROGRAMADO | 2da Q. de Septiembre | 12 | **D** Programado |

### Conteo

| Eje | ¿Presente? |
|-----|------------|
| A CP stock | ✅ (48+60) |
| B PE stock | ✅ (72) |
| C Venta CP | ✅ (12) |
| D Programado | ✅ (8+12) |

**Resultado: `n = 4` → Nivel 1 (completo AM).**

Total acordeón VENTAS mostrado: **32 p** (= 12 CP vendido + 20 programado), coherente con `totales.cpVendido + totales.programado`.

---

## 5 · Implementación (código Report · 2026-07-15)

| Pieza | Ruta |
|-------|------|
| Motor nivel | `report/src/lib/herramienta-reposicion/nivel-am.ts` |
| Mapa al cargar API | `buildNivelAmMap(articulos)` en `HerramientaReposicionClient.tsx` |
| Chip tarjeta | `ReposicionArticuloCard.tsx` · prop `nivelAm` |
| Orden grilla | `compareReposicionPorNivel` · N1 → N2 → N3 |
| Filtro opcional vista | Botones N1/N2/N3 (cuentan dataset **completo**, no recalculan) |
| Smoke | `report/scripts/smoke_nivel_am.ts` |

### Ley inmutable (Director)

> El nivel de cada molécula se calcula **una sola vez** al recibir `GET /api/herramienta-reposicion` y se guarda en `nivelesPorKey`.  
> **Ningún filtro operativo** (género, marca, tono, búsqueda, solo stock, sin imagen) **recalcula ni cambia** el nivel de una tarjeta visible.

Los filtros solo **ocultan** tarjetas; el chip **N1/N2/N3** de una tarjeta que sigue en grilla es el mismo que al cargar.

---

## 6 · Algoritmo canónico

Ubicación: `report/src/lib/herramienta-reposicion/nivel-am.ts`

```typescript
const PE = /^pronta\s*entrega$/i;

export type NivelAm = 1 | 2 | 3 | 0;

export function ejesPresentes(a: ReposicionArticulo): boolean[] {
  const cpStock = a.stock.some((b) => !PE.test(b.label) && b.pares > 0);
  const peStock = a.stock.some((b) => PE.test(b.label) && b.pares > 0);
  const ventaCp = a.ventasCp.some((b) => b.pares > 0);
  const programado = a.ventasProgramado.some((b) => b.pares > 0);
  return [cpStock, peStock, ventaCp, programado];
}

export function nivelAm(a: ReposicionArticulo): NivelAm {
  const n = ejesPresentes(a).filter(Boolean).length;
  if (n === 0) return 0;
  if (n === 4) return 1;
  if (n === 1) return 3;
  return 2; // n === 2 || n === 3
}
```

**UI pendiente v2:** badge color por nivel en leyenda hub · export CSV con columna nivel.

---

## 7 · Relación con paneles AM existentes

| Panel legacy AM | Eje reposición |
|-----------------|------------------|
| PE disponible (`/stock-pronta-entrega`) | **B** |
| CP disponible (`/stock-transito`) | **A** |
| CP vendido (Panel CP / tránsito) | **C** |
| Programado (`/stock-programado`) | **D** |

**Nivel 1** = la tarjeta de reposición es el **espejo fusionado** de los cuatro paneles con señal simultánea.

---

## 8 · Leyes que no se violan

- **Sin compradores** en esta vista — niveles usan sumas molécula, no cadena/cliente.
- **Sales Report blindado** — niveles solo leen PPD / merge reposición, no `registro_ventas_general_v2`.
- **Quincenas** son etiquetas dentro de un eje; no multiplican el conteo de categorías.

---

## 9 · Checklist agente

1. ¿Los 4 ejes se detectan con `pares > 0` agregado?
2. ¿VIZZANO 6291.900 clasifica **Nivel 1**?
3. ¿Solo PE 72 p sin CP ni VENTAS → **Nivel 3**?
4. ¿CP stock + PE stock sin ventas → **Nivel 2** (`n=2`)?
5. ~~Implementación UI~~ ✅ 2026-07-15 · mapa inmutable + chip + orden.

---

**Documenta** Director 2026-07-15 · política + código niveles tarjeta reposición AM.

**Integrado:** Documenta · Cursor · 2026-07-15 · `nivel-am.ts` · smoke OK
