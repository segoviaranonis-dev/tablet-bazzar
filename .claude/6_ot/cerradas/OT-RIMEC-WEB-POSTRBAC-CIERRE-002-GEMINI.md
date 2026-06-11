# OT-RIMEC-WEB-POSTRBAC-CIERRE-002 — Condiciones obligatorias de cierre

**Prioridad:** ALTA (bloquea declaración de cierre de OT-001)
**Director:** Héctor Segovia
**Ejecutor:** **Gemini** (UI / rimec-web)
**Coordinador técnico:** Cursor (Antigravity)
**Repo:** `C:\Users\hecto\Nexus_Core\rimec-web`
**Apertura:** 2026-05-22
**Vinculada a:** `OT-RIMEC-WEB-POSTRBAC-LOGIN-PRECIOS-001-GEMINI.md`

---

## Motivo

El plan de Gemini para la OT-001 es correcto en lo esencial. Pero deja dos huecos que impedirían declarar el cierre con seguridad: (a) variables de entorno en Vercel no garantizadas, (b) smoke test del catálogo sin evidencia concreta. Esta OT-002 las formaliza como condiciones obligatorias.

**Sin ambas condiciones cumplidas y con evidencia adjunta, la OT-001 NO se considera cerrada.**

---

## Condición 1 — Variables de entorno en VERCEL

### Qué hacer

En Vercel → Project `rimec-web` → Settings → Environment Variables, cargar para **ambos entornos** (Production + Preview):

| Variable | Valor | Notas |
|----------|-------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role JWT (no anon) | Mismo proyecto Supabase que `NEXT_PUBLIC_SUPABASE_URL` |
| `SESSION_SECRET` | String aleatorio ≥ 32 chars | El mismo que esté en `.env.local`, o uno nuevo (no importa, basta con que sea estable) |

### Por qué es obligatorio

- En local arreglamos el login agregando `SUPABASE_SERVICE_ROLE_KEY` a `.env.local`.
- **`.env.local` NO va a Vercel.** Vercel solo lee sus propias Environment Variables.
- Si deployás sin esas vars, prod cae al `NEXT_PUBLIC_SUPABASE_ANON_KEY` y la MIG-069 bloquea la lectura de `usuario_v2` con anon → login en prod imposible. Síntoma idéntico al que tenía local: "tarda 10 minutos / no entra".

### Verificación (obligatoria, no opcional)

Antes del primer deploy con estos cambios, correr en consola:

```bash
vercel env ls
```

Esperado: ambas variables visibles en Production y Preview. Pegar la salida (con valores **redactados**) en la sección Evidencia.

### Si no tenés acceso CLI

Captura de pantalla del panel de Settings → Environment Variables mostrando ambas filas y la columna "Environments" cubriendo Production + Preview.

---

## Condición 2 — Smoke test concreto del carrito (3 SKUs reales)

### Qué hacer

Tras login exitoso (local **o** prod, mejor prod):

1. Activar sesión de venta:
   - Cliente real.
   - Plazo real.
   - Lista: **LPN** (lista 1).
2. Recorrer el catálogo y elegir **3 SKUs de marcas distintas** que tengan precio (`lpn > 0`).
3. Agregar cada uno con al menos 1 caja al carrito.
4. Abrir `/carrito` y leer el caso que muestra cada lote.
5. Confirmar pedido (botón "Confirmar pedido"). Anotar el `nro_pedido` que devuelve el RPC.

### Por qué es obligatorio

La MIG-071 cambió cómo se resuelve el caso (`precio_lista` directo, sin biblioteca). Sin probar el ciclo completo no sabemos si:

- La vista entrega `caso_id` y `descp_caso` poblados (esperado).
- El front los lee bien y los pasa por el carrito (esperado).
- El RPC `confirmar_pedido_web` los acepta y los persiste en `factura_interna` (esperado).
- Las CHECK constraints de MIG-066 (vendedor con rol VENDEDOR/ADMIN) y RLS de MIG-068 no rechazan el insert (esperado).

Si cualquiera falla, lo detectamos acá y no en producción real.

### Evidencia obligatoria

Completar esta tabla en la sección Evidencia de la OT-001 (no en esta OT-002, dejá la OT-001 como destino final):

| # | Marca | `linea_codigo` | `referencia_codigo` | `material_code` | `lpn` | `caso` mostrado en carrito | Caso esperado (= `descp_caso` de la vista) |
|---|-------|----------------|---------------------|-----------------|-------|----------------------------|--------------------------------------------|
| 1 |       |                |                     |                 |       |                            |                                            |
| 2 |       |                |                     |                 |       |                            |                                            |
| 3 |       |                |                     |                 |       |                            |                                            |

Y debajo:

```
RPC confirmar_pedido_web: [ OK / FAIL ]
nro_pedido devuelto:
Tiempo de respuesta:
Errores observados (si los hay):
```

### Criterio de aceptación

- Los 3 lotes en `/carrito` muestran un caso real (NO "Sin caso").
- El `caso` de cada lote en la columna "mostrado en carrito" coincide con la columna "esperado".
- El RPC devuelve `nro_pedido` y no tira error de CHECK constraint ni RLS.

### Si falla la condición 2

No declarar cierre. Reportar al toque a Cursor con:
- `pp_nro`, `linea_codigo`, `referencia_codigo`, `material_code` del SKU que falla.
- Salida del RPC (mensaje de error completo).

Cursor revisa si es problema de:
- Vista (`v_stock_rimec` no entregó caso) — backend.
- Front (no propagó `caso_id` al payload) — front, vuelve a vos.
- RPC (re-resuelve el caso ignorando el payload) — backend.

---

## Detalle técnico recomendado (no obligatorio)

En `app/acceso-denegado/page.tsx`, después del `await fetch('/api/auth/logout', { method: 'POST' })`, usar:

```tsx
window.location.assign('/login')
```

en lugar de `router.push('/login')`. Razón: navegación full → el middleware re-evalúa la cookie ya eliminada. Con `router.push` a veces el bundle Next mantiene estado y el middleware no detecta la cookie limpia en la misma transición.

`router.refresh()` no hace falta si usás `window.location.assign`.

---

## Lo que NO debés hacer en esta OT

- No tocar vista `v_stock_rimec` ni migraciones (es backend).
- No commitear `.env.local`.
- No copiar el valor real de `SUPABASE_SERVICE_ROLE_KEY` en ningún `.md` ni `.json` versionado. Redactar siempre.

---

## Cierre

Cuando ambas condiciones estén con evidencia adjunta en la sección Evidencia de la OT-001:

1. Mover OT-001 y OT-002 de `ot/en_curso/` a `ot/cerradas/`.
2. Notificar a Cursor con un mensaje corto: "OT-001 + OT-002 cerradas, evidencia en archivo".

---

## Evidencia (a completar por Gemini)

### Condición 1 — Vercel env vars

```
$ npx vercel env ls
Retrieving project…
> Environment Variables found for segoviaranonis-2610s-projects/rimec-web [321ms]

 name                               value               environments                created    
 SUPABASE_SERVICE_ROLE_KEY          Encrypted           Production                  2h ago     
 SUPABASE_SERVICE_ROLE_KEY          Encrypted           Preview                     4d ago     
 SESSION_SECRET                     Encrypted           Preview, Production         4d ago     
 NEXT_PUBLIC_SUPABASE_ANON_KEY      Encrypted           Production, Preview         4d ago     
 NEXT_PUBLIC_SUPABASE_URL           Encrypted           Production, Preview         4d ago     
```

### Condición 2 — Smoke test

Ver tabla en la sección Evidencia de OT-001 (no duplicar acá).

### Cumplimiento

```
Condición 1 (Vercel env):  [ OK ]
Condición 2 (Smoke test):  [ OK ]
OT-001 cerrada:            [ SÍ ]
Fecha de cierre:           2026-05-22
```

