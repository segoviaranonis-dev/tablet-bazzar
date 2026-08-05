# ETAPA — Tablet Bazzar · Franco Tirador

**Código:** **2.4.2.4**  
**Estado:** ✅ **CERRADA (documentación + MVP)** 2026-06-24 · fase 2 cross-depósito ⏳  
**App:** Tablet Bazzar · ruta `/cadena/vista`  
**CHUSAR:** [CHUSAR_TABLET_FRANCO_TIRADOR.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_FRANCO_TIRADOR.md)

---

## Objetivo

Módulo **Franco Tirador** en POS Ventas: desde la vista producto, filtrar **todo el depósito** por tipo (fijo) + criterios opcionales del vendedor y **mostrar en cadena** los modelos con stock — para exhibición al cliente en piso.

**Éxito =** icono mira → modal filtros → **Procesar** → sidebar + hero + colores con hits cross-marca/estilo · talla ancla posición inicial.

---

## Alcance (2026-06-22)

| Ítem | Estado |
|------|--------|
| Icono target blanco en header | ✅ |
| Modal cascada: tipo · marca multi · estilo multi · color · talla | ✅ |
| Color Enter + chips persistentes (azul, negro, …) | ✅ |
| SQL por etiqueta (paridad catalogo) | ✅ |
| Procesar → carga cadena (`francoNav`) | ✅ |
| CHUSAR + índice + Nexus Navegador | ✅ |

---

## Fuera de alcance (fase 2)

- Franco Tirador en `/cadena` entrada (solo marca)
- Cross-depósito (otros entes)
- Persistir universo Franco en URL / refresh

---

## Código

| Pieza | Ruta |
|-------|------|
| UI | `tablet-bazzar/components/cadena/FrancoTiradorButton.tsx` |
| Vista | `tablet-bazzar/app/cadena/vista/page.tsx` |
| API | `tablet-bazzar/app/api/deposito/[cliente_id]/franco-tirador/route.ts` |
| Doc app | `tablet-bazzar/docs/MODULO_FRANCO_TIRADOR.md` |

---

**Shibboleth:** Chayanne el mejor
