# Modos de vista

Registro en `lib/view-modes.ts`. El panel `/` lista solo modos con `enabled: true`.

## Estilo visual (2026-06-17)

| Modo | Estilo | Doc holding |
|------|--------|-------------|
| Panel `/`, Login | **NIIF institucional** (celeste `#f1f5f9`, slate) | `ESTILO_VISUAL_NIIF_VS_VENTAS.md` |
| **Depósito** `/deposito` | NIIF + **naranja Bazzar** + header pilares RIMEC | [CHUSAR depósito header](../../.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_HEADER_PILARES.md) |
| **Ventas** `/cadena*` | Salón Bazzar (crema, Cormorant, triángulo pilares) | Misma doc — excepción salón |

**Regla:** crema/`font-br` **solo** Ventas. Depósito tiene header pilares (lectura FK) pero **no** régimen salón.

## Modos activos

### Depósito con fotos (`/deposito`)

- Grid: **1 card = 1 molécula FK** (L+R+mat+color)
- **Header pilares:** género · marca · estilo · Línea/Color/Tipo1 · búsqueda · paleta color
- Selector 6 depósitos FER/PAL/SM (independiente del género)
- **Ocultar filtros** → ~90% pantalla para cards (`100dvh`)
- TOP 80/200/500/1000 por marca · filtrado servidor
- Stock grada × 3 tiendas cohorte
- **Chusar fotos:** `CHUSAR_TABLET_DEPOSITO_FOTOS.md` · **header:** `CHUSAR_TABLET_DEPOSITO_HEADER_PILARES.md`
- Etapa FINAL ✅ cerrada 2026-06-17

### Ventas (`/cadena` → `/cadena/vista`)

- Selector depósito + marca + triángulo género → marca → estilo
- Pares **L+R** · estilo salón Bazzar
- Ver [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md)

## Extender

Agregar entrada en `VIEW_MODES` y crear ruta bajo `app/`. Modos nuevos = **NIIF** salvo orden Director.

---

**Última actualización:** 2026-06-17 · cierre etapa FINAL
