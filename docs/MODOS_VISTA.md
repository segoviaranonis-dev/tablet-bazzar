# Modos de vista

Registro en `lib/view-modes.ts`. El panel `/` lista solo modos con `enabled: true`.

## Estilo visual (2026-06-16)

| Modo | Estilo | Doc holding |
|------|--------|-------------|
| Panel `/`, Depósito, Login | **NIIF institucional** (celeste `#f1f5f9`, azul RIMEC, slate) | `.claude/2_modulos/2.4_tablet_bazzar/ESTILO_VISUAL_NIIF_VS_VENTAS.md` |
| **Ventas** `/cadena*` | Salón Bazzar (crema, Cormorant, triángulo pilares) | Misma doc — excepción única |

**Regla:** triángulo header y tokens crema **solo** en Ventas. Depósito = grid simple, sin triángulo.

## Modos activos

### Depósito con fotos (`/deposito`)

- Grid plano: **1 card = 1 molécula FK** (L+R+mat+color) — **no** una card por grada
- Selector 6 depósitos + chips marca + búsqueda
- Imágenes sm/ · tap lightbox lg/
- Tablas stock grada × 3 tiendas cohorte (Adultos o Niños)
- UI **NIIF** — no triángulo pilares (triángulo = solo Ventas)
- **Chusar:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_FOTOS.md`
- **Sub-sesión:** ✅ CERRADA 2026-06-17

### Ventas (`/cadena` → `/cadena/vista`)

- Selector **depósito** + **marca** + triángulo género → marca → estilo
- Navegación por pares **L+R** ordenados numéricamente (menor primero)
- Estilo salón Bazzar (crema / naranja / `font-br`)
- Ver [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md)

## Extender

Agregar entrada en `VIEW_MODES` y crear ruta bajo `app/`. Modos nuevos salvo orden explícita Director = **NIIF**. No duplicar lógica de pilares fuera de `lib/cadena.ts`.

---

**Última actualización:** 2026-06-17
