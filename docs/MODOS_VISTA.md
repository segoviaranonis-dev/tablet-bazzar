# Modos de vista

Registro en `lib/view-modes.ts`. El panel `/` lista solo modos con `enabled: true`.

## Modos activos

### Depósito con fotos (`/deposito`)

- Grid plano de SKUs del depósito seleccionado
- Agrupación visual por **marca** (chips)
- Búsqueda por texto
- Imágenes vía `ProductImage` (thumbs primero)

### Cadena consecutiva (`/cadena` → `/cadena/vista`)

- Selector **depósito** + **marca**
- Navegación por pares **L+R** ordenados numéricamente (menor primero)
- Ver [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md)

## Extender

Agregar entrada en `VIEW_MODES` y crear ruta bajo `app/`. No duplicar lógica de pilares fuera de `lib/cadena.ts`.

---

**Última actualización:** 2026-06-10
