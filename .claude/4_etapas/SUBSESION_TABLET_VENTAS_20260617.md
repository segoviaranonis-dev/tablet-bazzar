# SUB-SESIÓN — Tablet FINAL · Módulo Ventas

**ID:** `SUBSESION-TABLET-VENTAS-20260617`  
**Fecha inicio:** 2026-06-17  
**Estado:** ✅ **CERRADA** 2026-06-17 — ver [SUBSESION_TABLET_VENTAS_20260617_CERRADA.md](./SUBSESION_TABLET_VENTAS_20260617_CERRADA.md)
**Etapa madre:** [ETAPA_TABLET_FINAL.md](./ETAPA_TABLET_FINAL.md)  
**Shibboleth:** 7 años

---

## Jerarquía

| Nivel | Nombre | Estado |
|-------|--------|--------|
| **Etapa holding** | Tablet Bazzar · FINAL | ✅ ACTIVA |
| **Track** | Track 2 (velocidad) + Track 4 (POS/ticket) — módulo **Ventas** |
| **Sub-sesión anterior** | Triángulo header + pilares | ⏸ PAUSADA — [SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md](./SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md) |
| **Sub-sesión actual** | **Ventas** (ex cadena consecutiva) | 🟢 ACTIVA — este doc |

---

## Nomenclatura (Director)

| Antes | Ahora (producto / UI) | Código interno (sin rename masivo aún) |
|-------|----------------------|----------------------------------------|
| Cadena consecutiva | **Ventas** | `view-modes` id `ventas` · ruta `/cadena` · libs `lib/cadena*` · `components/cadena/` |

**Regla:** hablar **Ventas** con el Director; en código mantener `cadena` hasta OT de rename de rutas si aplica.

---

## Objetivo sub-sesión

Consolidar el modo **Ventas** en tablet para piso: triángulo pilares · navegación L+R · hero/imagen · colores · búsqueda código · camino a ticket ORO — sin regresiones de recorte/parpadeo (candado imágenes 654).

**Éxito parcial:** vendedor entra por panel → **Ventas** → depósito+marca → vista fluida con pilares correctos y hero estable.

---

## Alcance Cursor (este chat)

| Incluye | Excluye (otro ejecutor / pausado) |
|---------|-----------------------------------|
| `app/cadena/` · `app/cadena/vista/` | Deploy Track 5 |
| `lib/cadena*.ts` · `components/cadena/` | Ops Storage batch (Claude) |
| `lib/view-modes.ts` (id ventas) | Sub-sesión triángulo commit/deploy pendiente P1 bug |
| Imágenes hero en contexto Ventas | Motor precios LPN (Streamlit) |
| Filtros · teclado · prefetch cadena | Sales Report blindado |

---

## Administrador de tareas

### Contexto heredado ✅

| # | Ítem | Notas |
|---|------|-------|
| H1 | UI cadena 2 niveles + teclado | Cerrado etapa UI nav |
| H2 | JOIN pilares triángulo | Código OK · sub-sesión triángulo pausada pre-QA |
| H3 | `view-modes` renombrado a **Ventas** | `lib/view-modes.ts` id `ventas` |
| H4 | Hero lg-first · lightbox | Sub-sesión calidad imagen |

### En curso 🟢

| # | Tarea | Prioridad | Repo |
|---|-------|-----------|------|
| V1 | Chusar módulo Ventas (holding + app docs) | Alta | `.claude/` + `tablet-bazzar/docs/` |
| V2 | Alinear docs MODOS_VISTA / índices → nombre Ventas | Alta | tablet-bazzar |
| V3 | Smoke local `/cadena` tras cambios | Media | tablet-bazzar :3002 |
| V4 | Paridad filtros + búsqueda código en Ventas | Media | tablet-bazzar |
| V5 | Integración grada + carrito (Track 4) | Media | tablet-bazzar |

### Pendiente ⬜

| # | Tarea | Notas |
|---|-------|-------|
| P1 | Bug crítico imagen Director (heredado triángulo) | Standby hasta stack |
| P2 | Precio LPN server-side | API + Motor |
| P3 | tikeCT ticket confirm end-to-end | Track 4 |
| P4 | Rename rutas `/cadena` → `/ventas` | Solo con OT explícita |

---

## Documentación canónica

| Tema | Ruta |
|------|------|
| **Chusar Ventas (Cursor)** | [CHUSAR_TABLET_VENTAS.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_VENTAS.md) |
| Modo Ventas (app) | `tablet-bazzar/docs/CADENA_CONSECUTIVA.md` *(alias técnico)* |
| Modos vista | `tablet-bazzar/docs/MODOS_VISTA.md` |
| Navegación | `tablet-bazzar/docs/NAVEGACION_CADENA.md` |
| Triángulo pilares | `tablet-bazzar/docs/TRIANGULO_HEADER_PILARES.md` |
| Ley 2 niveles | `.claude/2_modulos/2.4_tablet_bazzar/agrupacion_dos_niveles.md` |
| Perf cadena | `tablet-bazzar/docs/CADENA_NAV_PERF.md` |
| Tickets ORO | `.claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md` |

---

## Evidencia cierre sub-sesión (futuro)

- `tablet-bazzar/docs/evidencia/SUBSESION_VENTAS_*_EVIDENCIA.json`
- Auditoría Cursor PASS/FAIL en § respuesta ejecutor

---

**Iniciada por orden Director — 2026-06-17**  
**Ejecutor:** Cursor · **Verificador:** Cursor · **Aprobación cierre:** Director
