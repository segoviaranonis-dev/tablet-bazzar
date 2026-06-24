# ETAPA 4 — Botón tikeCT (Ticket ORO · inicio)

> **⚠️ Superseded parcial (2026-06-22):** etapa vigente → [ETAPA_TICKETS_POS_STOCK.md](./ETAPA_TICKETS_POS_STOCK.md) · holding [ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md](../../../.claude/4_etapas/ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md)

**Fecha apertura:** 2026-06-14  
**Estado:** EN CURSO — carrito POS v1 implementado 2026-06-14  
**App:** `tablet-bazzar/` · puerto dev **3002**  
**Etapa madre:** `.claude/4_etapas/ETAPA_TABLET_FINAL.md` (única etapa tablet abierta)

---

## Objetivo

Implementar **tikeCT** en Tablet POS: misma **lógica de compra** que Bazzar Web (tap grada/talla → 1 par), pero **sin compartir tablas** con bazzar-web. Cada app persiste en su propio modelo.

**Regla Director:** **1 ticket por cada par** vendido.

**Patrón UX (referencia only):** `PATRON_VENTA_REFERENCIA_BAZZAR_WEB.md`

**Éxito de etapa (a definir):** vendedor toca grada en cadena → feedback inmediato → al confirmar, N tickets (1 por par) con validación server-side en tablas Tablet.

---

## Contexto — qué ya existe

| Área | Estado | Nota |
|------|--------|------|
| Auth JWT + sesión POS 12 h | ✅ | Login → INGRESAR |
| Cadena consecutiva UI | ✅ | Hero, sidebar, mazo, teclado |
| Backend titanio | ✅ | `/filtros`, `/ingresar`, `/cadena`, `/live` |
| Stock live 3 ubicaciones | ✅ | Poll por molécula activa |
| Precio LPN (Motor) | ⏳ | Sin API server en tablet |
| Tabla `tickets` / `ticket_detalle` | ⏳ | Sin migración en repo |
| Carrito / botón venta | ⏳ | **Esta etapa** |
| Report monitoreo tickets | ⏳ | Post-MVP |

Referencias arquitectura: `.claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md` · `depositos.md`

---

## Fuera de alcance inicial (salvo orden Director)

- **Integración BD con bazzar-web** (`pedido_web`, `v_stock_web`, etc.)
- Deploy 60 tablets
- PWA offline / sync cola
- Dashboard Report tickets
- Conexión módulo Retail a tickets
- Cierre gap Storage imágenes (Etapa 1 pre-final)

---

## Dependencias conocidas

| Dependencia | Impacto en tikeCT |
|-------------|-------------------|
| Molécula activa en cadena | `linea_id`, `referencia_id`, `material_id`, `color_id`, grada/talla |
| `cliente_id` depósito | Tienda (segundo corazón) |
| Vendedor sesión | `codigo_vendedor` desde login |
| Precio unitario | Requiere LPN Motor — **decisión pendiente** si tikeCT bloquea sin precio |
| Cliente comprador | `cliente_web` / cédula — **decisión pendiente** si va en mismo botón o paso posterior |

---

## Implementado (v1 POS)

| Pieza | Ruta |
|-------|------|
| Estado carrito | `lib/cart/PosCartContext.tsx` · `localStorage` `tablet_pos_cart_v1` |
| Tira grada (tap = +1 par) | `components/pos/GradaVentaStrip.tsx` |
| Sheet cobro | `components/pos/PosCartSheet.tsx` |
| API confirmar | `POST /api/tickets/confirm` |
| Migración BD (pendiente apply) | `supabase/migrations/001_ticket_venta_pos.sql` |

**Flujo piso:** cadena → tocar grada → flash → botón Venta → COBRAR (cédula opcional).

---

1. **UI grada:** ¿botones de talla como Bazzar Web, o 1 botón tikeCT sobre molécula activa?
2. **Buffer:** ¿lista local de pares antes de confirmar, o ticket inmediato en cada tap?
3. **Precio LPN:** ¿bloquea tap sin precio o ticket BORRADOR?
4. **Cliente comprador:** ¿cédula antes del primer par o post-lote?
5. **Nombre canónico:** ¿**tikeCT** es label final?

---

## Fases propuestas (borrador — no ejecutar sin orden)

```
F0 — Alineación Director (esta conversación)
F1 — Esquema BD tickets + ticket_detalle (Claude Code, migración)
F2 — API server POST línea / carrito (tablet-bazzar)
F3 — UI botón tikeCT + feedback táctil (Antigravity / Cursor)
F4 — Smoke: 1 venta prueba depósito 2100 + evidencia JSON
```

---

## Ejecutores

| Rol | Responsabilidad |
|-----|-----------------|
| Director | Prioridad, UX botón, criterio cierre |
| Claude Code | Migraciones SQL, APIs ticket, LPN |
| Cursor | OT, auditoría PASS/FAIL, doc etapa |
| Antigravity | UI touch botón / carrito flotante |

---

## Evidencia de cierre (cuando aplique)

- `tablet-bazzar/docs/evidencia/ETAPA_4_TICKET_BOTON_EVIDENCIA.json`
- Smoke: login → cadena → tikeCT → fila en BD verificable
- `auditoria_auto: PASS` en OT asociada

---

## Documentos relacionados

| Doc | Ruta |
|-----|------|
| Plan pre-final | `PLAN_TRES_ETAPAS_PRE_FINAL.md` |
| Cadena UI | `CADENA_CONSECUTIVA.md` |
| Backend POS | `BACKEND_POS.md` |
| Tickets = ORO | `.claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md` |
| Patrón venta (ref. Bazzar Web) | `PATRON_VENTA_REFERENCIA_BAZZAR_WEB.md` |

---

**Shibboleth Memoria V2:** 5 patas ✅
