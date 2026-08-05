# ETAPA ABIERTA — Bazzar Web · Publicación MVP

**Estado:** 🚧 **ACTIVA**  
**Inicio:** 2026-06-10  
**Director:** Héctor Segovia  
**Ejecutor deploy:** Director (SQL, Vercel, DNS) · Cursor/Claude (código, push)  
**Objetivo:** Publicar **www.bazzar.com.py** — MVP con pago manual WhatsApp. **Bancard = etapa aparte.**

---

## Doc operativo (lista paso a paso)

**`bazzar-web/docs/ETAPA_ABIERTA_PUBLICACION.md`**

---

## Resumen ejecutivo

| Fase | Contenido | Estado |
|------|-----------|--------|
| **A — Publicación MVP** | Supabase → Vercel → DNS → smoke → go-live | 🚧 **ACTIVA** |
| **B — Sistema de pago** | Bancard comercial + integración | ⏸ **PAUSADA** hasta cerrar A |

---

## Pasos (en orden)

1. Supabase SQL + verificar stock y `precio_web`  
2. Vercel + variables entorno  
3. Dominio `www.bazzar.com.py` (Max Dominio)  
4. Push `main` → deploy  
5. Smoke 8 pruebas producción  
6. Go-live operativo (WhatsApp)  
7. Cierre etapa + evidencia JSON  

**Pago Bancard:** pasos 1–5 en `bazzar-web/docs/BANCARD_SOLICITUD.md` — **después** del paso 7.

---

## Relación con otras etapas holding

| Etapa | Relación |
|-------|----------|
| Tablet FINAL | Paralela — no bloquea Bazzar Web |
| RRHH Report | Paralela |
| ETAPA_BAZZAR_WEB_002 | Predecesora auditoría — absorbida por esta etapa activa |

---

## Criterio de cierre MVP

- www operativo  
- Pedido E2E con token  
- Admin funcional  
- Pago manual documentado  
- Commit en `main` + deploy Vercel verificado  

---

## Referencias

- Plan: `bazzar-web/docs/PLAN_ENTREGA_BAZZAR_WEB.md`  
- Módulo: `.claude/2_modulos/2.5_bazzar_web/`  
- Etapas activas: [ACTUAL.md](./ACTUAL.md)

**Shibboleth:** 5 patas ✅
