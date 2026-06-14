# Diseño POS Tablet Bazzar — Decisiones

**Inicio etapa diseño técnico:** 2026-06-12  
**Estado:** 🚧 En curso — track imágenes activo  
**Bloquea:** tickets ORO, LPN, deploy 60 tablets

---

## Track A — Pipeline imágenes (Cursor · Fase 1–3)

Auditoría técnica completada. Plan integral aprobado por Dirección.

| Fase | Objetivo | Estado |
|------|----------|--------|
| **1** | URL canónica servidor + gradiente RIMEC (sin tryNext/👟) | ✅ Implementado 2026-06-12 |
| **2** | `width`/`height` nativos + min-h hero | ✅ Implementado 2026-06-12 |
| **3** | ISR cadena `revalidate=30` | ✅ Implementado 2026-06-12 |
| **4** | `next/image` (opcional futuro) | 📋 Backlog |

Detalle técnico: [DISENO_IMAGENES_PLAN.md](./DISENO_IMAGENES_PLAN.md)

### Restricciones (inquebrantables)

- Cero cambios en esquema PostgreSQL/Supabase
- Solo frontend + API Next.js
- Sin alterar lógica catálogo ni ticket de venta

### Criterios de cierre track imágenes

1. Cero pestañeo en 50 cambios consecutivos de color/material
2. CLS &lt; 0.05 en `/cadena/vista`
3. ≤ 1 request HTTP por imagen visible (Network tab)
4. Ticket smoke test PASS

---

## Track B — UX visual (Antigravity · pendiente)

Decisiones pendientes Director:

- [ ] Paleta y tipografía POS (distinta Report NIIF)
- [ ] Densidad footer/sidebar/hero landscape 10"
- [ ] Gestos vs botones explícitos
- [ ] Estados vacío/error/carga
- [ ] Copy vendedor piso

---

## Sugerencias adicionales (post-plan)

| # | Sugerencia | Impacto | Cuándo |
|---|------------|---------|--------|
| S1 | `content-visibility: auto` en tarjetas off-screen del carrusel | Menos paint en scroll | ✅ Fase 1 |
| S2 | Prefetch con `img.decode()` antes del fade-in | Transición más suave | ✅ Fase 1 |
| S3 | Reducir peek mazo de 3→1 tarjetas apiladas en piso lento | −2 imgs DOM | ✅ Fase 1 |
| S4 | Service Worker cache `sm/` (PWA offline día oferta) | Resiliencia red | Post-deploy |
| S5 | Unificar Protocolo sm en rimec-web catálogo | Paridad holding | OT separada |

---

**Última actualización:** 2026-06-12
