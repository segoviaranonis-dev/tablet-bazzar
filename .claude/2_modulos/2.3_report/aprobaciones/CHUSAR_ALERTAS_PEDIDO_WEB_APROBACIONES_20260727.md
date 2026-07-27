# CHUSAR — Alertas pedido Web → Aprobaciones (modal + barra Windows)

**Código:** 2.3.1.3.1 · **Estado:** 🟢 **IMPLEMENTADO + desplegado 2026-07-27**  
**Shibboleth:** Chayanne el mejor.  
**Padre:** Aprobaciones Report `/aprobaciones` · RIMEC Web confirmar carrito  
**Cruce:** [CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md](../proceso_importacion/CHUSAR_CSV_VENENO_CARLOS_PROGRAMADO.md) · [CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md](../facturacion/CHUSAR_TRADUCTOR_VENDEDOR_CARLOS_PE.md)

---

## Norte

Cuando un vendedor **confirma pedido en RIMEC Web** (`POST /api/carrito/confirmar`), los aprobadores designados reciben alerta en **Report** para entrar a **Aprobaciones → Pendientes**.

| Canal | Cuándo |
|-------|--------|
| **Modal + banner ámbar** | Report abierto · sesión activa |
| **Barra Windows (Brave/Chrome)** | Report en segundo plano · permiso concedido · `requireInteraction` hasta Cerrar o Ingresar |

**Destinatarios fijos:** HECTOR · Guido · Veronica (`usuario_v2`).

---

## Disparo (RIMEC Web)

| Pieza | Ruta |
|-------|------|
| Confirmar carrito | `rimec-web/app/api/carrito/confirmar/route.ts` |
| Insert alertas | `rimec-web/lib/notificarAprobadoresPedidoWeb.ts` |
| Tabla | `notificaciones` · tipo `APROBACION_PENDIENTE` |

Tras `confirmar_pedido_web` OK y `pedido_id` válido → 3 filas (una por aprobador).

---

## Recepción (Report)

| Pieza | Ruta |
|-------|------|
| API GET/PATCH | `report/src/app/api/notificaciones/` |
| Modal + banner | `report/src/components/report/AlertaCriticaModal.tsx` |
| Permiso barra | `report/src/components/report/NotificacionBarraPrompt.tsx` · login |
| Service worker | `report/public/sw-alertas.js` · v2 persistente |
| Lógica barra | `report/src/lib/notificaciones/native-bar.ts` |
| Destinatarios | `report/src/lib/notificaciones/destinatarios.ts` |
| Poll | 8 s · al volver a pestaña |

**Deep link:** `/aprobaciones?tab=pendientes` — pestaña por defecto **Pendientes** (ya no Confirmadas).

---

## BD · Migración 189

```sql
-- report/migrations/189_notificacion_deep_link_aprobacion.sql
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS deep_link TEXT;
GRANT INSERT ON notificaciones TO service_role;
```

Aplicar prod:

```bash
cd report && node scripts/apply_mig_189_notificacion.mjs
```

Smoke: `node scripts/smoke_notificacion_aprobacion.mjs` → 3 destinatarios.

---

## Activar barra Windows (Brave)

1. `:3000/login` → **Activar avisos en barra (Aprobaciones)** → Permitir  
2. `brave://settings/content/notifications` → localhost:3000 **Permitir**  
3. Probar: botón **Probar aviso en barra Windows**  
4. Flujo real: Report en background → confirmar en `:3001` → toast persistente

---

## Criterios PASS

- [x] Confirm Web → 3 filas `APROBACION_PENDIENTE` en BD
- [x] Report sesión aprobador → modal + banner
- [x] Pestaña background → barra Windows (permiso OK)
- [x] Ingresar → `/aprobaciones?tab=pendientes`
- [x] MIG-189 aplicada prod

---

**Orden Director:** Documenta · alertas aprobaciones · despliega · 2026-07-27.

**CHUSAR — integrado**

- **2.3.1.3.1** · `CHUSAR_ALERTAS_PEDIDO_WEB_APROBACIONES_20260727.md`
- Índice Report § Aprobaciones · `report/docs/APROBACIONES.md` § Alertas
- Prod Report · Prod RIMEC Web · MIG-189
