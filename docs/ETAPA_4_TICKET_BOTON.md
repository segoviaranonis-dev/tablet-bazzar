# ETAPA 4 — Botón tikeCT (Ticket ORO · inicio)

**Fecha apertura:** 2026-06-14  
**Estado:** ABIERTA — esperando 1.ª instrucción Director  
**App:** `tablet-bazzar/` · puerto dev **3002**  
**Etapa madre:** `.claude/4_etapas/ETAPA_TABLET_BAZZAR.md`

---

## Objetivo

Implementar el **botón tikeCT** en el flujo POS Tablet: primer paso operativo hacia **tickets ORO** (venta en tienda con trazabilidad por pilares, tienda y vendedor).

**Éxito de etapa (a definir con Director):** vendedor en `/cadena/vista` (u otra ruta acordada) puede disparar tikeCT sobre la molécula activa y el sistema registra o prepara línea de ticket con datos canónicos server-side.

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

## Preguntas abiertas (1.ª instrucción Director)

1. **Ubicación UI:** ¿tikeCT en hero `/cadena/vista`, footer, panel flotante o ruta nueva `/ticket`?
2. **Comportamiento:** ¿añade al carrito (N líneas) o emite ticket directo (1 tap = 1 línea)?
3. **Precio:** ¿mostrar LPN antes de confirmar o permitir borrador sin precio?
4. **Cliente:** ¿obligatorio cédula antes del primer ítem o ticket anónimo BORRADOR?
5. **Persistencia:** ¿solo Supabase o borrador local + sync (offline)?
6. **Nombre canónico:** confirmar si **tikeCT** es label final o placeholder de producto.

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
| Etapa holding | `.claude/4_etapas/ETAPA_TABLET_TICKET_BOTON.md` |

---

**Shibboleth Memoria V2:** 5 patas ✅
