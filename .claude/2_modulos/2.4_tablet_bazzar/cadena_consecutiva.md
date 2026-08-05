# Cadena consecutiva — Resumen módulo

> **Nombre producto (2026-06-17):** **Ventas** — `view-modes` id `ventas` · Chusar: [CHUSAR_TABLET_VENTAS.md](./CHUSAR_TABLET_VENTAS.md) · Sub-sesión: [SUBSESION_TABLET_VENTAS_20260617.md](../../4_etapas/SUBSESION_TABLET_VENTAS_20260617.md)

**App doc completa:** [`tablet-bazzar/docs/CADENA_CONSECUTIVA.md`](../../../tablet-bazzar/docs/CADENA_CONSECUTIVA.md)  
**Navegación:** [`tablet-bazzar/docs/NAVEGACION_CADENA.md`](../../../tablet-bazzar/docs/NAVEGACION_CADENA.md)  
**Memoria cuestionario:** [`tablet-bazzar/docs/MEMORIA_CADENA_UI.md`](../../../tablet-bazzar/docs/MEMORIA_CADENA_UI.md)  
**Ley agrupación:** [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md)  
**Propuesta cierre:** [ETAPA_TABLET_CADENA_UI_NAV_PROPUESTA_CIERRE.md](../../4_etapas/ETAPA_TABLET_CADENA_UI_NAV_PROPUESTA_CIERRE.md)  
**Estado:** UI + filtros listos en taller (2026-06-11)

---

## Qué hace

Modo de navegación **marca → cadena L+R** para tablet:

1. Elegir depósito, filtrar (**GRADA** opcional), ver **grilla con miniaturas** y **INGRESAR** o tap tarjeta (`/cadena`) — [CHUSAR 2.4.2.6](./CHUSAR_TABLET_CADENA_GRADA_GRILLA.md)
2. Recorrer pares línea+referencia ordenados numéricamente
3. Foto hero = color activo del material (L+R+Mat) seleccionado
4. **Footer:** naipes horizontales por material (nivel 1)
5. **Sidebar:** cadena L+R vertical (si >1 ref) + mazo colores
6. Filtros estilo/referencia en paneles colapsables
7. Teclado ←→↑↓ y gestos (sin ◀▶ visibles)

---

## Decisiones de diseño (2026-06-11)

- **2 niveles:** L+R+Mat (footer) · color (mazo) · L+R cadena (sidebar)
- **Anti-duplicación:** `buildCarouselWindow` — no repetir la misma tarjeta
- **URL refs:** `1184|1101` una clave; varias separadas por coma
- **Paneles colapsables:** Estilo / Referencia ocultos hasta tap en hero
- **100% táctil + teclado:** `use-touch-nav` + `use-cadena-keyboard`
- **Backend titanio:** catálogo server-side; ver `BACKEND_POS.md`

---

## Pendiente

- Filtro Color (panel colapsable)
- Precio LPN (API server + Motor)
- Carrito / ticket ORO
- Git push + Vercel prod

---

## SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-11
