# Patrón de venta — referencia Bazzar Web (solo lógica UX)

**Fecha:** 2026-06-14  
**Alcance:** Copiar **forma de compra** en la herramienta Tablet. **Cero** cruce de tablas con `bazzar-web`.

---

## Regla de oro

| | Bazzar Web | Tablet Bazzar |
|---|------------|---------------|
| Tablas | `pedido_web`, `v_stock_web`, `cliente_web` | Propias (`tickets`, depósito tienda, etc.) |
| Stock | Almacén web | Depósito `cliente_id` tienda |
| Unidad de venta | 1 tap talla = **1 par** | 1 tap grada/talla = **1 par → 1 ticket** |
| Integración BD | — | **Ninguna** con bazzar-web |

Bazzar Web es **referencia de interacción**, no fuente de datos.

---

## Patrón a replicar (herramienta)

```
Molécula visible (L+R+Mat+Color)
    → usuario toca grada/talla disponible
    → sistema agrega 1 par al buffer de venta (estado local o sesión)
    → feedback visual inmediato (flash / badge)
    → al confirmar: persistir N tickets (1 fila = 1 par)
    → servidor revalida stock y precio (no confiar solo en cliente)
```

Equivalente Bazzar Web (solo para comparar UX):

- `ProductoCard.handleAddTalla` → `CartContext.addItem` → flash en card
- Checkout → `crearPedido` re-lee stock/precio en servidor

En Tablet: mismo **ritmo** (tap → feedback → confirmar → validar server), distinto **backend**.

---

## Qué copiamos

- Tap atómico = 1 unidad (par)
- Botones de grada/talla deshabilitados sin stock
- Key única por molécula + variante talla
- Tope cantidad vs stock en UI
- Revalidación server al persistir (precio + disponibilidad)
- Feedback táctil sin bloquear navegación cadena

## Qué NO copiamos

- `v_stock_web`, `pedido_web`, `reservar_stock`, `cliente_web` checkout web
- Agrupación catálogo web (L+R+Mat → colores → tallas abiertas)
- Checkout con dirección/envío e-commerce

---

## Modelo Tablet acordado (Director)

**Generación de un ticket por cada par** — no carrito web multi-ítem compartido con Bazzar.

Flujo tentativo (pendiente instrucción UI):

1. Vendedor en cadena con molécula activa
2. Toca grada (o talla dentro de grada, según UI)
3. Se encola / registra **1 ticket** por ese par
4. Confirmación de lote o ticket inmediato (a definir)

---

## Referencia código Bazzar Web (lectura only)

| Pieza | Archivo |
|-------|---------|
| Tap talla → add | `bazzar-web/app/(public)/catalogo/ProductoCard.tsx` |
| Estado carrito | `bazzar-web/lib/cart/CartContext.tsx` |
| Drawer | `bazzar-web/lib/cart/CartDrawer.tsx` |
| Persistencia compra | `bazzar-web/app/actions/checkout.ts` |

---

**Shibboleth Memoria V2:** 5 patas ✅
