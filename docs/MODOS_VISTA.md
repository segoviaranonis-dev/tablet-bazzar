# Modos de vista

Registro en `lib/view-modes.ts`. El panel `/` lista solo modos con `enabled: true`.

## Estilo visual (2026-06-20)

| Modo | Estilo | Doc |
|------|--------|-----|
| Panel `/`, Depósito, Login | NIIF + naranja acento | `ESTILO_VISUAL_NIIF_VS_VENTAS.md` |
| **Ventas** `/cadena*` | NIIF + naranja retail (bazzar-web) | `ESTILO_CATALOGO_BAZZAR_NIIF.md` |

**Regla:** shell celeste `#f1f5f9` en toda la app. Naranja `#ea580c` = marca Bazzar. Sin crema salón.

## Modos activos

### Depósito con fotos (`/deposito`)

- Grid plano de SKUs del depósito seleccionado (TOP 80 por marca vía SQL)
- Selector 6 depósitos Bazzar + búsqueda por texto
- Imágenes vía `ProductImage` thumb sm/
- UI **NIIF** — no triángulo pilares (triángulo = solo Ventas)
- **Chusar:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_FOTOS.md`
- **Sub-sesión:** `.claude/4_etapas/SUBSESION_TABLET_DEPOSITO_FOTOS_20260617.md`

### Ventas (`/cadena` → `/cadena/vista`)

- Selector **depósito** + **marca** + triángulo género → marca → estilo
- Navegación por pares **L+R** ordenados numéricamente (menor primero)
- Filtros triángulo género → marca → estilo + chips naranja
- Estilo **Bazzar NIIF** (gradiente header, cards, CTA naranja) — ver [ESTILO_CATALOGO_BAZZAR_NIIF.md](./ESTILO_CATALOGO_BAZZAR_NIIF.md)
- Ver [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md)

## Extender

Agregar entrada en `VIEW_MODES` y crear ruta bajo `app/`. Modos nuevos salvo orden explícita Director = **NIIF**. No duplicar lógica de pilares fuera de `lib/cadena.ts`.

---

**Última actualización:** 2026-06-17
