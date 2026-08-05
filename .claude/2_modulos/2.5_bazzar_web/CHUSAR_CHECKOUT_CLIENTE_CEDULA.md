# CHUSAR — Bazzar Web · Carrito · Checkout · Cliente por cédula

**Versión:** 1.0  
**Fecha:** 2026-06-20  
**Decisión Director:** Documenta · réplica Tablet POS  
**Código fuente:** repo `bazzar-web/`  
**App dev:** http://localhost:3003 (o puerto configurado)  
**Shibboleth:** 7 años

---

## Qué es (y qué NO es)

| Ámbito | Tabla / modelo | App |
|--------|----------------|-----|
| **Cliente final Bazzar (B2C)** | `public.cliente_web` | **Bazzar Web** ← este doc |
| Cliente mayorista RIMEC (B2B) | `cliente_v2` · tipo MAYORISTA | **RIMEC Web** — otro flujo (`DialogoActivacion`) |

**Regla holding:** clientes de tiendas Bazzar ≠ clientes RIMEC. No cruzar tablas ni APIs.

---

## Flujo UX (canónico)

```mermaid
flowchart LR
  A[Catálogo /catalogo] --> B[Tap talla → +1 par]
  B --> C[CartDrawer abierto]
  C --> D[Ir a confirmar pedido]
  D --> E[/checkout]
  E --> F[Input cédula debounce 600ms]
  F --> G{cliente_web?}
  G -->|Sí| H[Autocompleta nombre/apellido]
  G -->|No| I[Usuario completa manual]
  H --> J[Confirmar pedido]
  I --> J
  J --> K[pedido_web + reserva stock]
```

1. **Catálogo** — `ProductoCard` agrega par al carrito (`CartContext`).
2. **Drawer** — `CartDrawer` → botón **Ir a confirmar pedido** → `/checkout`.
3. **Checkout** — campo **Cédula** con debounce; si existe en BD, rellena nombre/apellido.
4. **Confirmar** — upsert `cliente_web` + insert `pedido_web` + reserva stock.

---

## Archivos clave (bazzar-web)

| Pieza | Ruta |
|-------|------|
| Contexto carrito | `lib/cart/CartContext.tsx` |
| Drawer lateral | `lib/cart/CartDrawer.tsx` |
| Botón header | `lib/cart/CartDrawer.tsx` → `CartButton` |
| Página checkout | `app/(public)/checkout/page.tsx` |
| Server actions | `app/actions/checkout.ts` |
| Layout con provider | `app/(public)/layout.tsx` |

---

## API servidor — `buscarClientePorCedula`

**Archivo:** `app/actions/checkout.ts`

```typescript
// Autocomplete por cédula — solo nombre/apellido; rate-limited
export async function buscarClientePorCedula(cedula: string): Promise<ClienteAutocomplete | null>
```

| Paso | Detalle |
|------|---------|
| Rate limit | 20 req / 60s por IP (`buscar-cedula`) |
| Normalización | Solo dígitos; regex `^[0-9]{5,15}$` |
| Query | `cliente_web` WHERE `cedula` = :c |
| Retorno | `{ cedula, nombre, apellido }` o `null` |
| **No expone** | email, teléfono, dirección en autocomplete |

---

## Tabla `cliente_web`

| Columna | Uso checkout |
|---------|--------------|
| `cedula` | PK lógica · unique |
| `nombre` | Obligatorio en pedido |
| `apellido` | Opcional |
| `email` | Obligatorio formulario |
| `telefono` | Obligatorio (celular WhatsApp) |
| `direccion` | Entrega |
| `updated_at` | Upsert en `crearPedido` |

**Upsert en confirmación:** `onConflict: 'cedula'` — proforma enriquece datos si el cliente ya existía.

---

## Checkout UI — comportamiento cédula

**Archivo:** `app/(public)/checkout/page.tsx`

| Estado | UI |
|--------|-----|
| `< 6` dígitos | Sin búsqueda |
| Buscando | Spinner naranja en input |
| Encontrado | ✓ verde + mensaje «Cliente registrado — datos completados» |
| No encontrado | Formulario manual (nombre, email, teléfono, dirección) |

**Debounce:** 600 ms tras dejar de tipear.

**Validación formulario (zod):** cédula 5–10, teléfono min 7, email, dirección min 5.

---

## Pedido — `crearPedido`

Tras validar carrito y stock (`v_stock_web`, RPC `reservar_stock`):

1. Upsert `cliente_web`
2. Insert `pedido_web` (estado `PENDIENTE`, token acceso)
3. Insert `pedido_web_detalle` por ítem

**Almacén:** `ALM_WEB_01` vía tabla `almacen`.

---

## Seguridad

- Server Actions only (no expone service role al browser)
- Rate limits en búsqueda y creación pedido
- Autocomplete **no** devuelve PII completa

---

## Réplica Tablet (referencia)

Tablet debe **reutilizar la misma tabla `cliente_web`** y el mismo patrón UX (cédula → autocomplete), pero persistir venta en **`ticket_venta_pos`** (1 ticket/par), no `pedido_web`.

**Doc destino:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_POS_CLIENTE_CEDULA.md`

---

## Verificación manual

1. Agregar par en catálogo → abrir drawer → checkout  
2. Cédula existente → nombre autocompletado  
3. Cédula nueva → completar form → pedido OK  
4. Confirmar fila en `cliente_web` y `pedido_web`

---

**Última actualización:** 2026-06-20 · Chusar · Director
