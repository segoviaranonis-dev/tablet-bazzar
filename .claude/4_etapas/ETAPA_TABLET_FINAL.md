# ETAPA ABIERTA — Tablet Bazzar · FINAL

**Fecha unificación:** 2026-06-10 (inicio POS) · **consolidada:** 2026-06-10  
**Estado:** ✅ **CERRADA** — ver [ETAPA_TABLET_FINAL_CERRADA.md](./ETAPA_TABLET_FINAL_CERRADA.md) · diseño [ETAPA_TABLET_DISENO_CERRADA.md](./ETAPA_TABLET_DISENO_CERRADA.md)  
**Ejecutores:** Claude Code (código · ops Storage · SQL) · Cursor (auditoría · cadena/imágenes) · Antigravity (UX visual)  
**Verificador:** Cursor · **Aprobación cierre:** Director  

---

## Objetivo único

Llevar **Tablet Bazzar** a estado **listo para piso** (6 tiendas · 60+ vendedores): POS estable, imágenes correctas, cadena rápida, diseño aprobado, **tickets ORO** operativos y camino claro a deploy.

**Éxito =** vendedor en tablet real puede navegar catálogo sin parpadeos/recortes, emitir ticket trazable por pilares + tienda + cliente; Director aprueba cierre con evidencia PASS.

---

## Qué unifica esta etapa (antes fragmentado)

| Doc anterior | Ahora |
|--------------|-------|
| `ETAPA_TABLET_BAZZAR.md` (POS madre) | → Track **Producto + tickets** |
| `ETAPA_TABLET_DISENO_INVESTIGACION.md` | → Track **Diseño + imágenes + UX** |
| `ETAPA_TABLET_TICKET_BOTON.md` (tikeCT) | → Track **Tickets ORO** |
| Plan 3 fases pre-final (`PLAN_TRES_ETAPAS_PRE_FINAL.md`) | → Tracks **OPS · Velocidad · Precisión** (sub-fases internas) |

**Regla:** no abrir nuevas etapas tablet salvo orden explícita Director. Todo el trabajo tablet vive aquí.

---

## Tracks de trabajo (paralelos permitidos)

### Track 1 — OPS + Storage (imágenes)

**Estado:** ✅ **CERRADO** — [ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md](./ETAPA_PROTOCOLO_IMAGENES_100_CERRADA.md)

| Ítem | Estado |
|------|--------|
| Erradicación contain 654 tablet | ✅ 6677/6686 · 9 omitidas |
| Hero frontend lg/ progresivo + lightbox | ✅ |
| Doc módulo Chusar | ✅ [MODULO_IMAGENES_PRODUCTO.md](../2_modulos/2.4_tablet_bazzar/MODULO_IMAGENES_PRODUCTO.md) |

**Herramienta:** `control_central/tools/erradicar_recorte_tablet.py`  
**Doc ops:** `tablet-bazzar/docs/ETAPA_1_OPS_STORAGE.md`

---

### Track 2 — Velocidad cadena (F1)

**Meta:** navegación color/material/L+R sin flicker perceptible; prefetch + decode cache.

| Ítem | Estado |
|------|--------|
| V1/V2/V4/V7/V8 | ✅ |
| V3/V5/V6 (TTFB · payload · poll) | ⏳ pendiente medición |
| Prefetch vecindad cadena | ✅ |
| Decode cache compartido | ✅ |
| **Triángulo header — JOIN pilares en lectura** | ✅ 2026-06-16 — [SUBSESION](./SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md) |
| **Calidad hero lg + zoom lightbox** | ✅ [SUBSESION CERRADA](./SUBSESION_TABLET_CALIDAD_IMAGEN_20260616_CERRADA.md) |
| **Sub-sesión Ventas (ex cadena consecutiva)** | 🟢 2026-06-17 — [SUBSESION](./SUBSESION_TABLET_VENTAS_20260617.md) · **Cursor** |

**Doc:** `tablet-bazzar/docs/CADENA_NAV_PERF.md` · `TRIANGULO_HEADER_PILARES.md`

---

### Track 3 — Precisión + diseño UX

**Estado:** ✅ **CERRADA** 2026-06-10 — ver `tablet-bazzar/docs/ETAPA_DISENO_CIERRE.md`

| Ítem | Estado |
|------|--------|
| Fases 1–3 pipeline imágenes | ✅ |
| Hero contain + tier lg | ✅ |
| Dock unificado + coloresLR + carrito | ✅ |
| Selección tile-selected legible | ✅ |
| Parpadeo (mitigación decode cache) | ✅ código |
| Sidebar naipes compacto | ✅ |

**Deuda ops (Track 1):** VIZZANO Storage · QA 50 swaps piso — no reabre diseño.

---

### Track 4 — Producto POS + tickets ORO (tikeCT)

**Meta:** flujo venta desde molécula activa → ticket en Supabase.

| Ítem | Estado |
|------|--------|
| Login JWT + sesión POS 12 h | ✅ |
| Depósito grid + modo **Ventas** (`/cadena`) | ✅ |
| **Sub-sesión Depósito con fotos** | 🟢 2026-06-17 — [SUBSESION](./SUBSESION_TABLET_DEPOSITO_FOTOS_20260617.md) · **Cursor** |
| Backend titanio (`/cadena`, `/filtros`, `/live`) | ✅ |
| Navegación 2 niveles + teclado | ✅ |
| Botón **tikeCT** + carrito | ⏳ en curso |
| Esquema `tickets` + `ticket_detalle` FK pilares | ⏳ |
| Precio LPN (Motor) server-side | ⏳ |
| Buscar/alta cliente `cliente_web` | ⏳ |
| Report monitoreo tickets | ⏳ placeholder |

**Doc operativo tikeCT:** `tablet-bazzar/docs/ETAPA_4_TICKET_BOTON.md`  
**Arquitectura tickets:** `.claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md`

---

### Track 5 — Deploy (gate final)

**Estado:** ⏸ **PAUSADO** hasta PASS tracks 1–4 en piso.

- Vercel `tableta-bazzar.vercel.app` + `DATABASE_URL` producción  
- 60 tablets — post MVP ticket + gap imágenes cerrado  
- Auth escala 60 vendedores — **decisión Director pendiente** (`usuario_v2` vs `usuarios_de_tablet`)

---

## Sub-etapas ya cerradas (historial)

| Etapa | Doc |
|-------|-----|
| Cadena backend titanio | [ETAPA_TABLET_CADENA_BACKEND_TITANIO_CERRADA.md](./ETAPA_TABLET_CADENA_BACKEND_TITANIO_CERRADA.md) |
| Cadena UI + filtros | [ETAPA_TABLET_CADENA_UI_NAV_CERRADA.md](./ETAPA_TABLET_CADENA_UI_NAV_CERRADA.md) |
| Etapa 1 histórica (auth PWA) | `.claude/TABLET_BAZZAR_ETAPA_1_COMPLETADA.md` |

---

## Criterios de cierre de la etapa FINAL

1. **Storage:** ≥95% HEAD 200 en `sm/` y `lg/` por marca activa en Bazzar  
2. **UX piso:** Director — «diseño aprobado» + 50 swaps sin parpadeo  
3. **Ticket:** smoke venta depósito 2100 → fila en BD + evidencia JSON  
4. **Report:** ruta monitoreo con ticket real visible  
5. **Protocolo 5 patas:** rama · aprobación · git · deploy · PC sync (`1.1.10_protocolo_cierre_etapa.md`)

**Auditoría cierre:** `tablet-bazzar/docs/evidencia/AUDITORIA_CIERRE_PRE_FINAL_*.json` — hoy **FAIL global · NO CERRAR**

---

## Documentación canónica

| Tema | Ruta |
|------|------|
| **Esta etapa (única abierta tablet)** | `.claude/4_etapas/ETAPA_TABLET_FINAL.md` |
| **Sub-sesión Ventas (Cursor)** | `.claude/4_etapas/SUBSESION_TABLET_VENTAS_20260617.md` |
| **Sub-sesión Depósito con fotos (Cursor)** | `.claude/4_etapas/SUBSESION_TABLET_DEPOSITO_FOTOS_20260617.md` |
| **Chusar Ventas** | `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_VENTAS.md` |
| **Chusar Depósito con fotos** | `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_DEPOSITO_FOTOS.md` |
| **Sub-sesión triángulo pilares (pausada)** | `.claude/4_etapas/SUBSESION_TABLET_TRIANGULO_PILARES_20260616.md` |
| Triángulo header canónico | `.claude/3_arquitectura/3.2_venta_tienda/TRIANGULO_HEADER_PILARES.md` |
| Etapas holding | `.claude/4_etapas/ACTUAL.md` |
| Plan 3 fases (sub-tracks) | `tablet-bazzar/docs/PLAN_TRES_ETAPAS_PRE_FINAL.md` |
| Backend POS | `tablet-bazzar/docs/BACKEND_POS.md` |
| Imágenes producto | `tablet-bazzar/docs/IMAGENES_PRODUCTO.md` |
| Protocolo imágenes Nexus | `.claude/2_modulos/2.1_control_central/docs/NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md` |
| Agrupación 2 niveles (LEY POS) | `.claude/2_modulos/2.4_tablet_bazzar/agrupacion_dos_niveles.md` |
| Arquitectura maestra | `.claude/TABLET_BAZZAR_ARQUITECTURA.md` |
| 6 depósitos | `.claude/3_arquitectura/3.2_venta_tienda/depositos.md` |

---

## Fuera de alcance (salvo orden Director)

- Facturación legal / CSV export  
- Tocar Sales Report (`registro_ventas_general_v2`)  
- Reemplazar Motor de precios RIMEC  
- Deploy producción masivo sin PASS criterios arriba  

---

**Unificado por orden Director — 2026-06-10**  
**Shibboleth V2:** 5 patas ✅
