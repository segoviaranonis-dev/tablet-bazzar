# OT-INVESTIGACION-CATALOGO-VACIO-001 — Frontend / UX rimec-web

**Prioridad:** ALTA (bloqueante UX producción)  
**Director:** Héctor Segovia  
**Ejecutor:** **Gemini** (UI / Next.js client / rimec-web)  
**Receptor del informe:** **Cursor** (Antigravity / Director técnico)  
**Repo principal:** `C:\Users\hecto\Nexus_Core\rimec-web`  
**Estado:** ABIERTA (2026-05-21)

---

## Contexto observado

1. En producción (`rimec-web.vercel.app`) el último deploy `370f8c7` se llama "trigger redeploy - fix env vars". Vercel ofrece **Instant Rollback** al `563563c` previo (catálogo + estadísticas).
2. En local (`http://localhost:3001`) el catálogo se renderiza, pero con **0 modelos / 0 pares**, y aparece un cuadro amarillo de diagnóstico:

   ```
   Catálogo vacío — diagnóstico rápido
   - Filas en v_stock_rimec: 0
   - Tras filtros URL: 0 · con cajas > 0: 0 · tarjetas: 0
   - App catálogo: http://localhost:3001 (no :3000)
   - Supabase: TypeError: Headers.set: "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ… NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ…" is an invalid header value.
   ```

3. Los filtros (Línea / Color / Tipo 1 / ETA) se muestran pero **no se pueden usar** porque no hay datos.
4. Header de RIMEC sí muestra: Damas / Niñas / Niños / Caballeros, Catálogo, Carrito, Pedidos, **Estadísticas**, usuario "HECTOR".
5. Estadísticas debería mostrar el árbol PP → Género → Marca → Estilo → 5 pilares; no se ha verificado si carga.

---

## Objetivo

Confirmar el **alcance UI** del problema y verificar que la solución defensiva aplicada por Cursor en `lib/supabase.ts` no rompe pantallas existentes ni filtra mensajes técnicos a usuarios reales.

---

## Tareas

### 1. Catálogo (`/`) en local

- Limpiar `.next/`:
  ```powershell
  cd C:\Users\hecto\Nexus_Core\rimec-web
  Remove-Item -Recurse -Force .next
  npm run dev
  ```
- Abrir `http://localhost:3001` y capturar:
  - Encabezado (Damas/Niñas/Niños/Caballeros + Estadísticas).
  - Bloque amarillo de diagnóstico (texto completo).
  - Sección **Filtros** (Línea / Color / Tipo 1 / ETA).
  - Cards (cuántas se renderizan).
- Repetir con `?marca_id=4`, `?grupo_estilo_id=1`, `?linea_ids=…`, `?colores=…`, `?eta_fechas=…` — anotar si los filtros URL llegan al SSR.

### 2. Estadísticas (`/estadisticas`) en local

- Login si requiere middleware.
- Verificar:
  - Filtros (PP / Género / Marca / Estilo).
  - KPIs (Inicial / Vendido / Saldo / SKUs / Marcas / PPs).
  - Árbol jerárquico (PP-2026-XXXX → DAMAS → VIZZANO → Sin estilo → SKUs).
- Confirmar si los datos vienen de la misma `v_stock_rimec` o de otra ruta.

### 3. Pantalla de pedidos (`/pedidos`) y carrito (`/carrito`)

- Confirmar que cargan y que la sesión funciona.
- Si dependen de Supabase y la ANON está saneada, deben funcionar también.

### 4. Validar el saneamiento de Cursor

Archivos a leer y comentar (no editar):

- `rimec-web/lib/supabaseEnv.ts` (nuevo).
- `rimec-web/lib/supabase.ts` (refactor).
- `rimec-web/lib/auth/validateUsuario.ts` (refactor).
- `rimec-web/app/page.tsx` (mensaje diagnóstico extendido).

Preguntas:

1. ¿El mensaje extendido "La clave ANON llegó duplicada…" es apropiado para un usuario final? ¿Debería esconderse en producción y mostrarse solo en `NODE_ENV=development`?
2. ¿El recuadro amarillo de diagnóstico debería ocultarse si Supabase responde OK pero la vista realmente está vacía (sin PP ABIERTO/ENVIADO)?
3. ¿Hay otras pantallas (catálogo, carrito, pedidos, estadísticas) que importan `from '@/lib/supabase'` y necesitarían el mismo saneamiento de la URL/key, o ya basta con el cliente compartido?

### 5. Diferencia producción vs local

Si tenés acceso al deploy Vercel:

- ¿En `rimec-web.vercel.app` aparece el mismo recuadro amarillo o las cards se muestran?
- Capturar `Network` → request a `*.supabase.co/rest/v1/v_stock_rimec` y leer header `apikey` (truncado).
  - Si en prod el header es válido y en local no → confirma que el valor corrupto está en Windows local.
  - Si en prod también es inválido → confirma que la var en Vercel está duplicada.

### 6. Accesibilidad y UX del diagnóstico

- Verificar contraste del recuadro amarillo (cumple WCAG AA).
- Proponer cómo mostrarlo:
  - En **dev**: full detalle técnico.
  - En **prod**: mensaje neutro tipo "Catálogo temporalmente sin stock. Reintentá en unos minutos." + botón "Reintentar".

---

## Entregables para Cursor

Crear `ot/INVESTIGACION-CATALOGO-VACIO-001-EVIDENCIA-GEMINI.md` con:

1. Capturas (`.png` o ASCII) de cada pantalla probada.
2. Tabla:

   | Pantalla | Local OK | Prod OK | Mensaje técnico visible al usuario | Acción propuesta |
   |---|---|---|---|---|
   | `/` catálogo | ❓ | ❓ | sí/no | … |
   | `/estadisticas` | ❓ | ❓ | sí/no | … |
   | `/pedidos` | ❓ | ❓ | sí/no | … |
   | `/carrito` | ❓ | ❓ | sí/no | … |

3. Veredicto sobre el saneamiento (`lib/supabaseEnv.ts`): correcto / falta cubrir más pantallas / sugerir mejor UX del diagnóstico.
4. Recomendación de UI para el mensaje de error en producción (dev vs prod).
5. **No** tocar SQL ni leyes de pilares; cualquier hallazgo de datos se lo pasa a Claude.

---

## Restricciones

- Solo `rimec-web/` (no `report/`, no `control_central/`).
- No modificar `Sales Report` ni `registro_ventas_general_v2`.
- No cambiar las migraciones ni los pilares.
- Si necesitás credenciales o variables, **no las pegues en evidencias** — referenciá `.env.local` por nombre solamente.

---

## Cómo entregar

- Commit con la evidencia en `ot/INVESTIGACION-CATALOGO-VACIO-001-EVIDENCIA-GEMINI.md`.
- Si proponés un cambio en `app/page.tsx` o en `lib/supabase.ts` para mejorar UX del diagnóstico, esperá que Cursor consolide con la OT de Claude antes de aplicar.
