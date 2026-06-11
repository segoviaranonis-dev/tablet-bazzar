# OT-CARRITO-MULTIDISPOSITIVO — MIG-080 a 082 + endpoints rimec-web

**Fecha:** 2026-05-22  
**Contrato firmado:** carrito en BD (no localStorage), 1 por usuario, sin reserva, Validar obligatorio 60 s, FOR UPDATE en CONFIRMAR.

---

## Backend (Supabase) — listo para aplicar

| MIG | Archivo | Función |
|-----|---------|---------|
| 077 | `077_vincular_match_por_codigos.sql` | Segundo paso de snapshot por códigos denormalizados — cierra 8% PP-2026-0006 |
| 080 | `080_carrito_persistente_multidispositivo.sql` | Tablas `carrito_sesion`, `carrito_item`, RLS service-only, Realtime publicado |
| 081 | `081_fn_carrito_validar_y_confirmar_atomico.sql` | `carrito_validar()` con token UUID 60s + `carrito_token_vigente()` |
| 082 | `082_rpc_confirmar_pedido_web_token_y_lock.sql` | `confirmar_pedido_web` extendido: token obligatorio, `FOR UPDATE` por PPD, revalidación precio, limpia carrito al OK |

**Scripts de apply:**
- `scripts/aplicar_mig_077_y_rebackfill_pp6.py` — aplica 077 + re-vincula PP 6 + reporta cobertura
- `scripts/aplicar_mig_080_082.py` — aplica 080/081/082 + verifica tablas y funciones

---

## Frontend (rimec-web) — endpoints listos

| Método | Ruta | Acción |
|--------|------|--------|
| GET    | `/api/carrito/sesion` | Devuelve cabecera + items del usuario |
| PUT    | `/api/carrito/sesion` | Crea/actualiza cabecera (cliente, plazo, descuentos) |
| DELETE | `/api/carrito/sesion` | Cierra venta (vacía items y cabecera) |
| POST   | `/api/carrito/items` | Agrega o incrementa SKU (upsert sobre `(id_usuario, det_id)`) |
| DELETE | `/api/carrito/items` | Vacía todos los items |
| PATCH  | `/api/carrito/items/[det_id]` | Cambia cantidad (0 = elimina) |
| DELETE | `/api/carrito/items/[det_id]` | Quita SKU específico |
| POST   | `/api/carrito/validar` | Llama RPC; devuelve `{ estado, token, expira_en, items }` |

Todos validan sesión via cookie `rimec_session`. Usan `getSupabaseAdmin()` (SERVICE_ROLE_KEY) para bypass RLS service-only.

**Nuevo:** `lib/supabaseAdmin.ts` — cliente server-side cacheado.

---

## Reglas de comportamiento implementadas

| Decisión Director | Implementación |
|-------------------|----------------|
| A — Re-vincular solo si ABIERTO | `vincular_listado_a_pp` valida `pp.estado='ABIERTO'` + `pares_vendidos=0` |
| C — `precio_lista` solo staging Alfredo | Vista MIG-076 no lee `precio_lista`; snapshot va a PPD |
| E — solo `lpn` en web | Frontend lee `precio_lpn`; `lpc02..04` persistidos invisibles |
| F — No reserva stock | `agregar item` solo inserta; stock se verifica en CONFIRMAR |
| G — Gana el primero | RPC arroja `STOCK_INSUFICIENTE` en transacción bloqueada |
| H — Validar obligatorio 60s | Token UUID emitido por `carrito_validar`, verificado por `carrito_token_vigente` |
| 1 carrito por usuario | PK `(id_usuario)` en `carrito_sesion`, PK `(id_usuario, det_id)` en `carrito_item` |

---

## Próximo paso (frontend)

1. Reescribir `store/sesionVenta.ts` para **leer/escribir** vía endpoints `/api/carrito/*` en lugar de `localStorage`.
2. Suscribir Realtime `carrito_sesion` + `carrito_item` filtrando `id_usuario` para sync multidispositivo.
3. Agregar botón **VALIDAR** en `app/carrito/page.tsx` con UI de diferencias + timer 60 s + bloqueo de **CONFIRMAR** hasta token vigente.
4. Pasar `p_validacion_token` a la llamada RPC `confirmar_pedido_web`.

---

## Aplicar (orden estricto)

```powershell
cd C:\Users\hecto\Nexus_Core\control_central

# 1) Cerrar el 8% PP6
python scripts\aplicar_mig_077_y_rebackfill_pp6.py

# 2) Carrito en BD
python scripts\aplicar_mig_080_082.py
```

**Criterio de éxito:**
- 077: `v_stock_rimec` muestra **953/953** o reporta residuales con detalle de catálogo (no del motor de precios).
- 080–082: tablas `carrito_sesion`, `carrito_item` creadas, funciones `carrito_validar`, `carrito_token_vigente`, `vincular_listado_a_pp`, `confirmar_pedido_web` presentes.

Después: smoke test BZZP completo con el carrito en BD.
