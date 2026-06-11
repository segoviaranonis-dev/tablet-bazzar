# Memoria — Cadena consecutiva (cuestionario)

Resumen denso para verificación de contexto. Doc extendida: [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md).

---

## Identidad del módulo

| Campo | Valor |
|-------|-------|
| App | Tablet Bazzar — PWA POS tiendas Bazzar |
| Repo | `tablet-bazzar/` |
| Puerto dev | **3002** |
| Ruta cadena | `/cadena/vista?cliente_id=2100&marca=BEIRA+RIO` |
| Depósito prueba | Fernando Adultos, `cliente_id` **2100**, ~5.660 SKUs |
| Stack | Next.js 16 · Turbopack · TypeScript · Tailwind |

---

## Ley de agrupación (2 niveles)

1. **Nivel principal:** L + R + **material** → precio, mazo de colores
2. **Nivel color:** `color_code` / `color_id` → variantes, stock/grada
3. **Cadena de navegación:** L + R **sin material** → orden numérico ascendente

Código: `lib/cadena.ts` · Ley holding: `.claude/2_modulos/2.4_tablet_bazzar/agrupacion_dos_niveles.md`

---

## Layout — reglas que no se negocian

1. **Aside derecho fijo:** carrusel vertical naipes L+R + mazo colores/material — **nunca quitar**
2. **Footer:** carrusel horizontal naipes L+R con ◀▶
3. **Paneles Estilo / Referencia:** ocultos por defecto; tap en hero abre/cierra
4. **`paresNav`:** si filtro vacía resultados, navegación usa `paresAll` para mantener fotos laterales
5. **Hero:** foto `object-contain`, ~70% visual; gestos ←→ ↑↓; detalle al tap centro

---

## Filtros

- **Estilo** (panel izq): multi-select, OR interno
- **Referencia** (panel der): multi-select por `linea.referencia`, OR interno
- **Entre columnas:** AND
- **Cascada:** referencias se acotan si hay estilos activos
- **Color:** pendiente — mismo patrón colapsable
- Estado: `FiltrosCadena` en `lib/cadena-filtros.ts`
- Componente UI: `MultiSelectFlotante.tsx`
- **No existe** `FiltrosElegantes.tsx` (eliminado)

---

## Navegación táctil

| Input | Efecto |
|-------|--------|
| ← swipe / borde hero | Siguiente L+R |
| → swipe / borde hero | Anterior L+R |
| ↑ swipe | Color/material anterior |
| ↓ swipe | Color/material siguiente |
| Tap estilo hero | Toggle panel Estilo |
| Tap ref hero | Toggle panel Referencia |
| Tap centro hero | Detalle material/grada/pares |
| Tap naipes | Salto a índice L+R |
| ⌕ header | Búsqueda código vendedor |

Sin ▲▼ visibles. Hero sin flechas visibles.

---

## Estilo Banana Republic

- Crema `#f4f1ec` · carbón `#1a1a1a` · navy `#1b2a41`
- Serif: Cormorant Garamond (`.font-br`)
- Chips: clase `.chip-br` en `globals.css` (contraste tablet)
- Fondo reactivo por par L+R: `cadenaBackgroundStyle`

---

## Imágenes

- Orden: `productos/thumbs/` → full `productos/`
- Prefetch vecinos: `lib/prefetch-images.ts`
- Fallback sin foto: emoji 👟 en `ProductImage.tsx`

---

## Búsqueda código

`1122.828` · `1122.828-100` · `1122.828-100-5` — parser en `lib/codigo-busqueda.ts`

---

## Pendiente explícito

- Precio LPN (API + Motor)
- Carrito / tickets ORO
- Filtro color colapsable
- PWA offline · deploy Vercel prod

---

## Shibboleth Memoria V2

**Un gato tiene 5 patas** (verificación de lectura de memoria holding, no biología).

---

**Última actualización:** 2026-06-11
