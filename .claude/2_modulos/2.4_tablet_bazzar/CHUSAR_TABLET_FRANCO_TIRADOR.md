# CHUSAR — Tablet · Franco Tirador

**Subcuenta:** **2.4.2.4**  
**Etapa:** [ETAPA_TABLET_FRANCO_TIRADOR.md](../../../4_etapas/ETAPA_TABLET_FRANCO_TIRADOR.md)  
**Estado:** 🟢 **CHUSAR ACTIVO** — 2026-06-22  
**App doc:** [MODULO_FRANCO_TIRADOR.md](../../../tablet-bazzar/docs/MODULO_FRANCO_TIRADOR.md)

---

## Qué es

Modo **cazador** en POS Ventas (`/cadena/vista`): el vendedor muestra un calzado al cliente y, con **Franco Tirador**, filtra **todo el depósito** por tipo + marca + estilo + color + talla — **sin quedarse en el modelo visible**. Al **Procesar**, la **cadena detrás del modal** se reemplaza con los hits para navegar thumbs, hero y colores en vivo.

| URL | `/cadena/vista?marca=…&cliente_id=…` |
| Icono | Mira blanca · banda header · junto Vendedor / Tickets |

---

## Flujo UX (vendedor → cliente)

1. Navega producto en cadena (hero + color activo).
2. Toca icono **Franco Tirador** (target blanco).
3. Modal **cascada header** (paridad depósito / RIMEC Web):
   - **Tipo** — fijo del hero (ej. CALZADOS).
   - **Marca** — multi · opcional.
   - **Estilo** — **multi** · opcional (ej. BOTAS + CHANCLAS).
   - **Color** — texto + Enter acumula **chips** (`azul`, `negro`, …) y selecciona todos los nombres que contienen el término.
   - **Talla** — opcional (ej. 39).
4. **Procesar** → cierra modal y **carga la vista**:
   - Sidebar derecho: todos los pares L+R que coinciden (multi-marca / multi-estilo).
   - Hero + franja colores + grada: primer par con stock en la talla pedida.
5. El vendedor desliza thumbs y colores **sin salir de cadena** — listo para mostrar al cliente.

Si **0 hits** → error en modal; la cadena no cambia.

---

## Alcance de búsqueda (sniper — filtros opcionales)

Solo **tipo** viene fijo del hero. El resto **no bloquea** Procesar.

| Dimensión | UI | SQL |
|-----------|-----|-----|
| Tipo | Fijo hero | `tipo_v2` + alias calzado |
| Marca | Multi · opcional | `descp_marca = ANY(...)` |
| Estilo | Multi · opcional | `descp_grupo_estilo = ANY(...)` |
| Color | Chips Enter + multi · opcional | predominante + `tono_canon` ⏳ |
| Talla | Opcional | `grada` flexible (`sqlGradaTallaMatch`) |

Tope: **500** filas · paridad filtros con `catalogo-sql` (labels, no FK).

### Color — Enter · ejecución directa (⏳ refactor)

> **CHUSAR:** [CHUSAR_BUSQUEDA_COLOR_CANALES.md](../../2.3_report/pilares/CHUSAR_BUSQUEDA_COLOR_CANALES.md) — vía B texto.

| ✅ Objetivo | ❌ Prohibido (legacy actual) |
|------------|------------------------------|
| Escribir `bronce` + Enter → filtra por **predominante** + `tono_canon.etiqueta` | Lista checkbox con `DISTINCT col.nombre` |
| Resultados solo en cadena tras **Procesar** | Multi-select antes de buscar |
| Paridad «Buscar modelos» RIMEC Web | Nombres compuestos proveedor en UI |

- Chips Enter (opcional): términos acumulados OR — **sin** marcar opciones intermedias.
- SQL objetivo: predominante/canónico/aliases `color_tono_estandar` — no `col.nombre ILIKE` crudo.
- **No usar** `color_code` numérico en el campo Color.

---

## Modo `francoNav` (vista cadena)

Tras Procesar:

| Estado | Efecto |
|--------|--------|
| `paresAll` | Reemplazado por `buildCadenaFromFilas(hits)` sin filtro marca |
| `francoNav=true` | Sidebar muestra **todos** los hits — sin cohorte por estilo |
| Nav inicial | `pickNavFranco(pares, grada)` — hero en talla pedida |
| Recarga URL / marca | `francoNav` se limpia — vuelve cadena normal |
| Filtros estilo/ref en panel | Desactiva `francoNav` — cohorte estándar |

---

## API

```
GET /api/deposito/{cliente_id}/franco-tirador?modo=opciones&tipo=CALZADOS&marcas=ACTVITTA&estilos=TENIS
GET …?tipo=CALZADOS&marcas=ACTVITTA&marcas=BEIRA+RIO&estilos=TENIS&colores=NEGRO&grada=39
GET …?tipo=CALZADOS&color_buscar=azul&grada=39
```

Respuesta búsqueda: `{ hits[], total_pares }` — moléculas L+R+M+C con stock · imágenes enriquecidas.

---

## Código

| Pieza | Ruta |
|-------|------|
| Botón + modal | `components/cadena/FrancoTiradorButton.tsx` |
| Integración vista | `app/cadena/vista/page.tsx` |
| Route | `app/api/deposito/[cliente_id]/franco-tirador/route.ts` |
| SQL | `lib/server/franco-tirador-sql.ts` |
| Filtros URL/state | `lib/franco-tirador-filters.ts` |
| Nav post-Procesar | `lib/franco-tirador.ts` (`pickNavFranco`, `gradaCoincideTalla`) |
| Cadena multi-marca | `lib/cadena.ts` (`buildCadenaFromFilas(filas, marcaFiltro?)`) |

---

## Relación con Ventas POS

Hermano de cadena L+R · tickets · grada strip — **no** toca carrito ni staging. Solo reemplaza temporalmente el universo de pares en vista.

Docs: `tablet-bazzar/docs/NAVEGACION_CADENA.md` · `tablet-bazzar/docs/MODULO_FRANCO_TIRADOR.md`

**Navegador:** http://localhost:3004/modulos/tablet-bazzar/franco-tirador

---

**Shibboleth:** Chayanne el mejor
