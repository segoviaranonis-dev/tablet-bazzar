# Cadena consecutiva — Resumen módulo

**App doc completa:** [`tablet-bazzar/docs/CADENA_CONSECUTIVA.md`](../../../tablet-bazzar/docs/CADENA_CONSECUTIVA.md)  
**Memoria cuestionario:** [`tablet-bazzar/docs/MEMORIA_CADENA_UI.md`](../../../tablet-bazzar/docs/MEMORIA_CADENA_UI.md)  
**Ley agrupación:** [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md)  
**Estado:** UI cerrada paneles colapsables + aside fotos (2026-06-11)

---

## Qué hace

Modo de navegación **marca → cadena L+R** para tablet:

1. Elegir depósito y marca (`/cadena`)
2. Recorrer pares línea+referencia ordenados numéricamente
3. Foto hero grande, variantes L+R+material como naipes de colores
4. Filtros táctiles estilo/referencia en **paneles ocultos** hasta tap en hero
5. Carrusel vertical + mazo colores **siempre visibles** a la derecha
6. Búsqueda por código vendedor

---

## Decisiones de diseño (2026-06-11)

- **Paneles colapsables:** Estilo (izq) y Referencia (der) ocultos por defecto; tap en nombre estilo o `L.R` del hero abre/cierra
- **Aside inviolable:** naipes verticales + mazo — no eliminar aunque filtro vacíe el hero (`paresNav`)
- **100% táctil:** gestos ←→ ↑↓, targets ≥52px
- **Estilo Banana Republic:** crema/carbón, serif Cormorant, `.chip-br`
- **Velocidad:** thumbs + prefetch vecinos
- **Sin parches en cliente:** agrupación en `lib/cadena.ts` desde filas API

---

## Pendiente

- Filtro Color (mismo patrón colapsable)
- Precio LPN (API server + Motor)
- Enlace a carrito / ticket ORO

---

## SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-11
