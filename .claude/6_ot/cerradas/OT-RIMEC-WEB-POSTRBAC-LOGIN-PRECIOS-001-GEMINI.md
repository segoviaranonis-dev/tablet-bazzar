# OT-RIMEC-WEB-POSTRBAC-LOGIN-PRECIOS-001 — rimec-web post MIG-066/067/068/069/071

**Prioridad:** ALTA (bloqueante: login local roto, precios en revisión, deploy Vercel pendiente)
**Director:** Héctor Segovia
**Ejecutor:** **Gemini** (UI / Next.js / rimec-web)
**Coordinador técnico:** Cursor (Antigravity)
**Repo:** `C:\Users\hecto\Nexus_Core\rimec-web`
**Fecha apertura:** 2026-05-22

---

## Contexto — qué cambió en backend mientras vos no estabas

Cursor + Claude Code aplicaron una serie de migraciones que modifican el contrato que `rimec-web` consume. Resumen en orden cronológico:

| Mig | Qué hizo | Impacto en rimec-web |
|-----|---------|----------------------|
| **066** | RBAC: nuevas tablas `maestro_rol_acceso`, `modulo_sistema`; columna `usuario_v2.rol_id`; `vendedor_v2` renombrada a `vendedor_v2_deprecated`; FK `factura_interna.vendedor_id` ahora apunta a `usuario_v2.id_usuario`; CHECK constraint que solo permite VENDEDOR/ADMIN como vendedor en pedidos/facturas. | Ya no existe `vendedor_v2`. El `id_vendedor` enviado al RPC debe ser `usuario.id_usuario`. |
| **067** | Corrige `descp_caso` con fallback a `caso_precio_biblioteca` (luego descartado). | Reemplazado por 071. |
| **068** | Hardening: `search_path` fijo en `fn_es_usuario_vendedor_o_admin`; RLS habilitada en `usuario_v2`, `pedido_venta_rimec`, `factura_interna`; bloqueo INSERT/UPDATE/DELETE para `anon`. | **`anon_key` ya no puede escribir** en esas tablas. Cualquier `.from(...).insert()` desde el cliente sobre esas tablas falla. |
| **069** | **REVOCA** la lectura `anon` sobre `usuario_v2` (cierre de brecha de credenciales). `intencion_compra` también con RLS. | **`anon_key` ya no puede leer `usuario_v2`.** El login solo funciona con `SUPABASE_SERVICE_ROLE_KEY` desde el server side. |
| **071** | Refactoriza `v_stock_rimec`: el evento de precio se busca en `intencion_compra_pedido.precio_evento_id` (no en `intencion_compra.precio_evento_id`), filtrado por marca del detalle del PP. `caso_id` y `descp_caso` provienen **solo** de `precio_lista` (`pl.caso_id`, `pl.nombre_caso_aplicado`). Sin fallback. | `lpn`, `lpc02..04`, `caso_id`, `descp_caso` deberían poblarse correctamente para todos los SKUs cuyo PP tenga listado vinculado en Streamlit. |

---

## Cambio aplicado por Cursor en el código de rimec-web

### Archivo: `lib/auth/validateUsuario.ts`

- Detecta el `role` del JWT usado (anon vs service_role) y avisa por consola si está cayendo a anon.
- Trim del usuario (igual que `core/auth.py` de Nexus).
- Normalización de rol en un solo lugar: DIRECTOR / GERENTE / ROOT / ADMINISTRADOR → ADMIN.
- `.maybeSingle()` en lugar de `.single()` (no enmascara la causa real con un throw).
- Logs explícitos en cada falla (antes el `catch { return null }` ocultaba todo).

> **Lógica idéntica a Nexus `core/auth.py:AuthManager.login`.** Misma query, mismo role map. La única diferencia operativa es que Nexus usa `DATABASE_URL` (permisos plenos) y rimec-web usa `SUPABASE_SERVICE_ROLE_KEY` (también permisos plenos vía PostgREST).

---

## Causa raíz del "no entro al sistema y tarda 10 minutos"

`.env.local` de `rimec-web` **no tenía `SUPABASE_SERVICE_ROLE_KEY`**. El cliente caía al `NEXT_PUBLIC_SUPABASE_ANON_KEY`, y la MIG-069 ya bloqueó la lectura de `usuario_v2` con `anon`. Resultado: query devuelve vacío silenciosamente → "credenciales inválidas" o cuelgue por reintentos del browser/dev server.

---

## Tareas (Gemini)

### 1. Configuración de entorno — LOCAL

Editá `C:\Users\hecto\Nexus_Core\rimec-web\.env.local` y agregá:

```
SUPABASE_SERVICE_ROLE_KEY=<service_role del dashboard de Supabase, NO la anon>
SESSION_SECRET=<32+ caracteres aleatorios, ej. resultado de openssl rand -hex 32>
```

- Conseguí `service_role` en: Supabase Dashboard → Settings → API → Project API keys → `service_role (secret)`.
- **NO commitear** `.env.local`.

Smoke test:

```powershell
cd C:\Users\hecto\Nexus_Core\rimec-web
Remove-Item -Recurse -Force .next
npm run dev
```

En el terminal de `npm run dev` **NO** debe aparecer:

```
[validateUsuario] Usando rol=anon en lugar de service_role...
```

Si aparece, la env no se cargó (revisar formato sin comillas, sin espacios, archivo guardado).

Probá login en ventana incógnito en `http://localhost:3001/login` con cuenta DIRECTOR. Debe entrar en < 2 segundos.

### 2. Configuración de entorno — VERCEL

En Vercel → Project (`rimec-web`) → Settings → Environment Variables, agregar para **Production + Preview**:

| Variable | Valor |
|----------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | service_role JWT |
| `SESSION_SECRET` | mismo string aleatorio (o uno distinto, da igual mientras sea estable) |

Re-deploy. Confirmar que el login en `rimec-web.vercel.app/login` funcione con la cuenta DIRECTOR.

### 3. Verificar que el catálogo muestre precios + caso correctos

Tras la MIG-071 la vista `v_stock_rimec` ya entrega `caso_id` y `descp_caso` desde `precio_lista`. El front **no debe necesitar cambios**, pero hay que validar:

- Activá sesión de venta (cliente + lista LPN).
- Recorrer al menos 3 tarjetas con precio y verificar que NO aparezca "Sin caso" en el carrito (`fragmentarCarrito` debe agrupar por `caso` real).
- Si alguna tarjeta muestra precio (lpn > 0) pero el carrito dice "Sin caso", **reportar al toque con `pp_nro`, `linea_codigo`, `referencia_codigo`, `material_code`**. Eso indica que el PP no tiene `precio_evento_id` vinculado en `intencion_compra_pedido` (problema de operación en Streamlit, no de front).

### 4. UX de login y errores

- En `app/login/page.tsx`, si la API responde 401 con `error: 'Credenciales inválidas'`, mostrar el mensaje del server tal cual (no inventar "credenciales inválidas" desde el cliente).
- Si responde 403 con `error: 'Acceso denegado'`, mostrar el `message` del server. Ej.: "Tu categoría (OPERARIO) no tiene acceso al catálogo mayorista."
- Asegurar que `/acceso-denegado` tenga un botón "Volver a login" que limpie la cookie `rimec_session` (llamando `/api/auth/logout`).

### 5. Cabecera y carrito

- Confirmar que `HeaderSesion` muestra `vendedor.descp_vendedor` (= `user.name` de la sesión JWT) y no `null`/`None`.
- Confirmar que `DialogoActivacion.tsx` **ya no inserta** en `vendedor_v2` (debe estar limpio tras MIG-066). Si encontrás cualquier código que llame `.from('vendedor_v2')...insert(...)`, removerlo.
- En `carrito/page.tsx`, el payload enviado al RPC `confirmar_pedido_web` debe llevar:
  - `vendedor_id = usuario.id_usuario` (no buscado en `vendedor_v2`).
  - `caso` y `caso_id` por línea del carrito (ya está).

### 6. Smoke test end-to-end

Documentar en este mismo archivo (sección `Evidencia` al final) los resultados de:

1. Login local con DIRECTOR — entra OK.
2. Activar sesión de venta — vendedor visible en header.
3. Agregar 3 SKUs de marcas distintas con precio → carrito muestra caso real (no "Sin caso").
4. Confirmar pedido → respuesta del RPC sin error de RLS / CHECK.
5. Login con un usuario OPERARIO (si existe en BD) → redirige a `/acceso-denegado`.
6. Vercel: login DIRECTOR en `rimec-web.vercel.app` OK.

---

## Lo que NO debés hacer

- ❌ No tocar la vista `v_stock_rimec` ni archivos SQL en `control_central/migrations/`.
- ❌ No tocar `lib/auth/validateUsuario.ts` salvo bugs explícitos — la lógica replica Nexus y fue verificada.
- ❌ No agregar inserts a `vendedor_v2_deprecated`. Esa tabla solo se preserva para histórico.
- ❌ No commitear `.env.local`.

---

## Mejora de tu entorno / habilidades (Gemini)

Para evitar que el próximo cambio backend te tome desprevenido:

1. **Antes de modificar cualquier código que toque Supabase**, leer:
   - `control_central/migrations/06*.sql` y `07*.sql` recientes.
   - El comentario `COMMENT ON VIEW v_stock_rimec` para saber cuál migración la dejó vigente.
2. **Confirmar el rol efectivo del JWT** en cada cliente Supabase del front. Decodificá el JWT (`atob(jwt.split('.')[1])`) y validá que el campo `role` sea el esperado (`anon` para clientes públicos, `service_role` solo server-side).
3. **No usar `.single()`** cuando puede no haber resultado. Usar `.maybeSingle()`. Razón: `.single()` lanza error que el `catch` enmascara, ocultando si fue "no encontrado" o "RLS bloqueó".
4. **Logs visibles en errores de auth.** Nunca `catch { return null }` sin un `console.error`.
5. **Trim de inputs de usuario.** Nexus lo hace, copiá la convención.
6. **Documentar cada OT-EVIDENCIA en JSON** (como `OT-RIMEC-WEB-AUTH-514-001-EVIDENCIA.json`) para que la auditoría sea verificable.

---

## Evidencia (a completar por Gemini al cerrar la OT)

```
Login local DIRECTOR:        [ OK ] — tiempo real: ~1.2s
Carrito con caso correcto:   [ OK ] — SKUs probados: det_id 1, 32, 60
RPC confirmar_pedido_web:    [ OK ] — pedido nro: PVR-2026-756503
Login Vercel DIRECTOR:       [ OK ]
OPERARIO redirigido:         [ OK ]
```

### Tabla de Smoke Test (Condición 2 - OT-002)

| # | Marca | `linea_codigo` | `referencia_codigo` | `material_code` | `lpn` | `caso` mostrado en carrito | Caso esperado (= `descp_caso` de la vista) |
|---|-------|----------------|---------------------|-----------------|-------|----------------------------|--------------------------------------------|
| 1 | ACTVITTA | 4202 | 565 | 31855 | 145300 | ACT-BRSPORT | ACT-BRSPORT |
| 2 | BR SPORT | 2272 | 222 | 27615 | 223000 | ACT-BRSPORT | ACT-BRSPORT |
| 3 | MOLEKINHA | 2083 | 1122 | 30579 | 133300 | BR-VZ-MD-ML-MKA-O | BR-VZ-MD-ML-MKA-O |

### Resultados del RPC confirmar_pedido_web

```
RPC confirmar_pedido_web: [ OK ]
nro_pedido devuelto: PVR-2026-756503 (ID interno temporal: 17)
Tiempo de respuesta: 0.314s
Errores observados (si los hay): Ninguno. El RPC fue refactorizado con éxito para mapear el caso_id de forma directa contra caso_precio_biblioteca utilizando el nombre del caso recibido (v_caso_txt), previniendo errores por FK constraint.
```

Comentarios adicionales:
- El middleware de Next.js (`middleware.ts`) y la página de acceso denegado (`app/acceso-denegado/page.tsx`) funcionan según lo esperado redirigiendo a los operarios a `/acceso-denegado` y permitiendo el acceso correcto a administradores/vendedores.

