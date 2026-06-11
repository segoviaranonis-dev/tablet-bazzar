# OT-DEPLOY-UX-SESION-VIEJA-005 — Commit + deploy de fixes UX de sesión vieja

**Prioridad:** ALTA — usuarios en producción afectados
**Director:** Héctor Segovia
**Ejecutor:** **Gemini** (git + Vercel)
**Coordinador técnico:** Cursor
**Apertura:** 2026-05-22

---

## Cambios a desplegar

Cursor implementó **7 fixes** de UX en `rimec-web/` para resolver el incidente reportado por el vendedor (carrito persistido entre días sin aviso de que los precios cambiaron) **y** las observaciones críticas del review externo (estado "no verificable" vs "sin precio", sincronización entre pestañas, botón revalidar siempre visible).

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `store/sesionVenta.ts` | Agregado `activatedAt: string \| null` al store + helpers `esSesionDeOtroDia()` y `esSesionAntigua()` + acción `eliminarItems(detIds)` para limpieza masiva. Exportada constante `STORAGE_KEY_SESION` para suscripción cross-tab |
| `app/CatalogoGrid.tsx` | `HeaderSesion` muestra **cliente** (no vendedor) como protagonista. Banner amarillo cuando `esSesionDeOtroDia(activatedAt)` = true. **Botón "🔄 Revalidar" siempre visible** + "Cerrar venta" + "Iniciar venta nueva". Tarjetas "Sin precio" con tooltip explicativo y badge rojo cuando el ítem está en carrito |
| `app/carrito/page.tsx` | **Estado tri-modal `idle / validating / verified / unverifiable`** para no confundir "sin precio" con "no se pudo verificar". Banner naranja específico cuando Supabase no responde con botón "Reintentar verificación". Banner amarillo cuando hay huérfanos confirmados. Botón CONFIRMAR PEDIDO bloqueado en cualquier estado distinto de `verified && huérfanos=0`. Listener de `storage` event para revalidar cuando otra pestaña modifica el carrito |
| `app/page.tsx` | Filtra Supabase con `gt('cajas_disponibles', 0)` para no descargar decenas de miles de filas agotadas |
| `app/layout.tsx` | Envuelve la app en `<SesionSyncProvider>` para activar la sincronización entre pestañas a nivel global |
| `app/components/SesionSyncProvider.tsx` | **Archivo nuevo.** Componente cliente que escucha el evento `storage` del navegador y dispara `useSesion.persist.rehydrate()` cuando otra pestaña modifica `rimec_sesion_venta` en localStorage. Sin esto, dos pestañas abiertas podrían mostrar estados divergentes del carrito |
| `components/DialogoActivacion.tsx` | (sin cambios en esta OT, ya estaba al día) |

### Distinciones críticas para el smoke test

- **"Sin precio" (badge gris)** = DB respondió y dijo `lpn IS NULL`. Estado normal, lista activa no cubre ese SKU.
- **"⚠ Sin precio (en carrito)" (badge rojo)** = mismo caso pero el ítem está en tu carrito. Hay que quitarlo.
- **"🔌 No se pudo verificar el precio ahora" (banner naranja)** = Supabase no respondió. **NO ASUMIR** que está todo bien. Reintentar.

---

## Tareas

### 1. Validar build local

```powershell
cd C:\Users\hecto\Nexus_Core\rimec-web
npm run build
```

Debe terminar **sin errores TypeScript**. Si hay, pegarlos y volver con Cursor antes de continuar.

### 2. Smoke test manual local (10 min — extendido)

1. `npm run dev` → http://localhost:3001
2. Login con `HECTOR` (o el director que prefieras).
3. Activar venta con cualquier cliente mayorista + Lista LPN.
4. Agregar 2-3 cajas al carrito.

**Test A — Banner de sesión vieja:**

5. Abrir DevTools → `Application` → `Local Storage` → `rimec_sesion_venta` → editar manualmente `activatedAt` a un timestamp de **ayer** (ej. `"2026-05-21T10:00:00.000Z"`).
6. Recargar el catálogo.
7. ✅ Aparece banner amarillo "Sesión iniciada el 21-05 ...".

**Test B — Botón "🔄 Revalidar" siempre visible:**

8. Restaurar `activatedAt` a una fecha de hoy.
9. Recargar.
10. ✅ En la barra negra de venta debe verse el botón `🔄 Revalidar` al lado de `Cerrar venta`. Al click, dispara `router.refresh()` y recarga el catálogo.

**Test C — Estado "no se pudo verificar" (CRÍTICO):**

11. Abrir DevTools → `Network` → marcar `Offline` (o usar `Block request URL` sobre `*.supabase.co`).
12. Ir a `/carrito`.
13. ✅ Aparece banner **naranja** "🔌 No se pudo verificar el precio ahora" con botón "Reintentar verificación".
14. ✅ El botón CONFIRMAR PEDIDO se queda gris y dice "Verificación pendiente — reintentá arriba".
15. Quitar el bloqueo de red, click "Reintentar verificación".
16. ✅ El banner naranja desaparece. Si no hay huérfanos, el botón CONFIRMAR se habilita.

**Test D — Sincronización entre pestañas:**

17. Abrir el carrito en **dos pestañas** simultáneamente (`Ctrl+Click` en /carrito).
18. En la pestaña A, eliminar un ítem cualquiera (botón 🗑️ Quitar).
19. Pasar a la pestaña B (sin recargar).
20. ✅ La pestaña B refleja la eliminación automáticamente en ≤ 1 segundo.

**Test E — Items huérfanos verificados:**

21. Recargar el carrito. Editar localStorage para inyectar un `det_id` falso, ej. `999999999`, dentro de `carrito`. Recargar.
22. ✅ Aparece banner amarillo "1 ítem perdió su precio" + botón "Quitar 1 ítem sin precio".
23. Click. ✅ El ítem desaparece y se habilita CONFIRMAR.

Si todos los tests pasan, continuar al commit.

### 3. Commit

```powershell
cd C:\Users\hecto\Nexus_Core\rimec-web
git add store/sesionVenta.ts app/CatalogoGrid.tsx app/carrito/page.tsx app/page.tsx app/layout.tsx app/components/SesionSyncProvider.tsx
git status
```

Mensaje de commit (HEREDOC):

```
ux(sesion): manejar sesion vieja, items huerfanos y red caida con estado tri-modal

Un vendedor dejó una sesión abierta de ayer para hoy y al volver algunas
tarjetas aparecían como "Sin precio" con el botón + desactivado. Causa:
carrito y lista de precios se persisten en localStorage indefinidamente
mientras v_stock_rimec se refresca cada 60s. Si el director cambia el
precio_evento_id en Nexus Core, los SKUs persistidos pierden precio sin
aviso al usuario.

Review externo identificó además que la versión original confundía
"precio inexistente en DB" con "precio no verificable por red caída",
dejando al usuario confirmar pedidos sin certeza.

Cambios:
- Store: activatedAt ISO + esSesionDeOtroDia / esSesionAntigua + accion
  eliminarItems(detIds) + STORAGE_KEY_SESION exportada
- HeaderSesion: muestra cliente como protagonista (antes mostraba vendedor),
  banner amarillo cuando la sesion es de un dia calendario anterior, con
  "Refrescar catalogo" e "Iniciar venta nueva". Boton "Revalidar" siempre
  visible al lado de "Cerrar venta"
- Tarjeta "Sin precio": tooltip explicativo + badge rojo cuando el item esta
  en carrito
- Carrito: estado tri-modal idle/validating/verified/unverifiable para no
  confundir "sin precio" con "no se pudo verificar". Banner naranja con
  "Reintentar verificacion" cuando Supabase no responde. Banner amarillo con
  "Quitar N items sin precio" cuando hay huerfanos confirmados. Boton
  CONFIRMAR bloqueado salvo en estado verified&&huerfanos=0. Listener de
  storage event para revalidar cuando otra pestana modifica el carrito
- SesionSyncProvider: nuevo componente cliente que escucha storage event y
  rehidrata el store cuando otra pestana modifica localStorage. Envuelto en
  layout para activacion global
- Catalogo: filtra cajas_disponibles>0 en Supabase para evitar descargar
  decenas de miles de filas agotadas (mejora de rendimiento)

Co-authored-by: Cursor <noreply@cursor.com>
```

### 4. Push y deploy

```powershell
git push origin main
npx vercel --prod
```

Esperar al "Deployment ready" y pegar la URL.

### 5. Smoke test en producción (3 min)

Repetir el paso 2 contra `rimec-web.vercel.app`. Confirmar:
- Banner amarillo aparece si activatedAt es de ayer.
- "Sin precio (en carrito)" sale con badge rojo si el ítem está en el carrito.
- En `/carrito`, si hay huérfanos, el botón CONFIRMAR queda bloqueado con texto "Resolvé N ítem(s) sin precio".

---

## Cierre

Al cerrar la OT, dejar registro en `walkthrough.md` con:
- Hash de commit
- URL del deployment de Vercel
- Captura del banner amarillo en producción

Mover esta OT a `ot/cerradas/`.

---

## NO HACER

- ❌ No modificar la lógica del store ni de `HeaderSesion`. Cursor ya las dejó al día.
- ❌ No tocar la DB ni `control_central/`. Eso es responsabilidad de Claude (OT-004).
- ❌ Si el `npm run build` falla, NO intentes parchear con `// @ts-ignore` o `any`. Volvé y avisá a Cursor.
