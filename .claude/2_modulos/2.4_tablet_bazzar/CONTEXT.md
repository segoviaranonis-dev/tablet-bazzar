# Módulo: Tablet Bazzar — POS Móvil

> Leer antes de modificar `tablet-bazzar/` o trabajar en modos de vista POS.

**Índice holding:** `2.4_tablet_bazzar`  
**Repo:** `tablet-bazzar/` (Next.js 16)  
**Estado:** Producción · Etapa 2 cerrada (cadena + backend titanio)  
**Última actualización:** 2026-06-11

---

## Qué hace

Tablet Bazzar es el **ejecutor POS** para vendedores en las 6 tiendas Bazzar.

**Rol en el ecosistema:**

| Sistema | Función |
|---------|---------|
| **Tablet Bazzar** | Ejecutor (venta, fotos, stock en tienda) |
| **Report** | Administrador (sync depósitos, KPIs) |

**Estrategia:** Fase 1 de Hiedra Venenosa (Infiltración) — tablet consume depósitos sincronizados por Report.

---

## Arquitectura

### Stack tecnológico

```
Frontend:  Next.js 16 (App Router + Turbopack)
           TypeScript · Tailwind CSS v4
           Fuentes: Geist + Cormorant Garamond (cadena)

Backend:   PostgreSQL Supabase (DATABASE_URL server-side)
           Server Actions · API Routes
           Backend titanio: lib/server/

Auth:      JWT (jose) + cookie tablet-session
           8h validity · httpOnly

Deploy:    Vercel (tablet-bazzar.vercel.app)
Dev:       localhost:3002
```

### Estructura del repo

```
tablet-bazzar/
├── app/
│   ├── page.tsx                    Panel modos de vista
│   ├── login/page.tsx              Auth JWT
│   ├── deposito/page.tsx           Grid stock + fotos
│   ├── cadena/
│   │   ├── page.tsx                Selector marca
│   │   └── vista/page.tsx          Cadena consecutiva
│   └── api/
│       ├── auth/                   Login endpoint
│       └── deposito/               Catálogo APIs
├── components/
│   ├── ProductImage.tsx            Imagen con fallback
│   └── cadena/                     UI cadena (naipes, filtros)
├── lib/
│   ├── server/                     Backend titanio (filtros, ingresar, live)
│   ├── cadena.ts                   Agrupación L+R, L+R+Mat
│   ├── cadena-filtros.ts           Lógica filtros entrada
│   ├── codigo-busqueda.ts          Parser códigos vendedor
│   ├── product-image.ts            Resolución paths imágenes
│   ├── prefetch-images.ts          Prefetch vecinos
│   ├── depositos-config.ts         Config 6 tiendas
│   └── view-modes.ts               Definición modos vista
├── docs/                           Documentación técnica app
│   ├── README.md
│   ├── COMO_EJECUTAR.md
│   ├── CADENA_CONSECUTIVA.md
│   ├── MEMORIA_CADENA_UI.md
│   ├── MODOS_VISTA.md
│   ├── API_DEPOSITO.md
│   └── IMAGENES_PRODUCTO.md
└── middleware.ts                   Auth guard
```

---

## Modos de vista implementados

| Modo | Ruta | Descripción | Doc |
|------|------|-------------|-----|
| **Panel** | `/` | Selector de modo (grid 2x2) | `docs/MODOS_VISTA.md` |
| **Depósito con fotos** | `/deposito` | Grid tradicional stock | `docs/MODOS_VISTA.md` |
| **Cadena consecutiva** | `/cadena` | Navegación táctil L+R → colores | `docs/CADENA_CONSECUTIVA.md` |

**Futuro:** Búsqueda rápida, tickets ORO, modo offline PWA.

---

## Ley de agrupación (CRÍTICO)

### Dos niveles de agrupación

**Tablet Bazzar usa agrupación específica para POS:**

```
NIVEL 1 — AGRUPACIÓN PRINCIPAL
(linea + referencia + material)
└─ Define el PRECIO
└─ Una tarjeta en catálogo

    NIVEL 2 — VARIANTES COLOR
    (color_id dentro del mismo L+R+Mat)
    └─ Mismo precio
    └─ Stock por color + grada
```

**Documento ley:** [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md)

### Por qué estos pilares

1. **El precio nace aquí.** Motor de Precios RIMEC resuelve `precio_lista` hasta **L+R+material**. Color no altera LPN.
2. **Misma lógica importadora.** Pedido Proveedor, FI y catálogo RIMEC usan este triplete.
3. **Una tarjeta = un producto "de precio".** Colores son variantes debajo.

**Clave de grupo:**
```typescript
group_key_principal = `${linea_id}:${referencia_id}:${material_id}`
```

**Implementación:** `lib/cadena.ts` (build cadena L+R, grupos L+R+Mat)

---

## Depósitos (6 tiendas Bazzar)

### Configuración

| Tienda | Tabla BD | Cliente ID | Ubicación |
|--------|----------|------------|-----------|
| Fernando Adultos | `deposito_tienda_fernando_adultos` | 2100 | Fernando |
| Fernando Niños | `deposito_tienda_fernando_ninos` | 2200 | Fernando |
| Luque Adultos | `deposito_tienda_luque_adultos` | 2300 | Luque |
| Luque Niños | `deposito_tienda_luque_ninos` | 2400 | Luque |
| España Adultos | `deposito_tienda_espana_adultos` | 2500 | España |
| España Niños | `deposito_tienda_espana_ninos` | 2600 | España |

**Config:** `lib/depositos-config.ts`  
**API:** `docs/API_DEPOSITO.md`

### Estructura de datos

**Filas en depósito (nivel molécula):**
```sql
SELECT 
  linea_id, referencia_id, material_id, color_id,
  grada, cantidad,
  linea_codigo_proveedor, referencia_codigo_proveedor,
  material_code, color_code,
  marca_id, genero_id, grupo_estilo_id
FROM deposito_tienda_fernando_adultos
WHERE cantidad > 0
```

**Tablet agrupa hacia arriba** por `(linea_id, referencia_id, material_id)` para catálogo.

---

## Autenticación

### Flujo

1. Login: `POST /api/auth/login` con `usuario` + `password`
2. Valida contra `usuario_v2` (BD Supabase)
3. Genera JWT (8h validity) con payload:
   ```json
   {
     "userId": 123,
     "usuario": "vendedor1",
     "rol": 1
   }
   ```
4. Set cookie `tablet-session` (httpOnly, secure en prod)
5. Middleware protege rutas (redirect a `/login` si no autenticado)

### Roles

| Rol | Acceso tablet |
|-----|---------------|
| **1** (Admin) | ✅ Acceso total |
| **2** (Supervisor) | ✅ Solo ADMIN/SU |
| **3** (Vendedor) | ❌ → Report, no tablet (política actual) |

**Archivo:** `middleware.ts`, `app/api/auth/login/route.ts`

---

## Modo cadena consecutiva

### Qué hace

Navegación **marca → cadena L+R ordenada** optimizada para tablets landscape:

1. `/cadena` — Selector de depósito y marca
2. `/cadena/vista` — Vista consecutiva:
   - Abre en menor L+R de la cadena (orden numérico)
   - Foto hero grande = **Grupo 1** (L+R+material activo)
   - **Arriba:** colores **Grupo 2** (L+R, sin material)
   - **Abajo:** colores **Grupo 1** (L+R+material · precio)
   - Navegar: swipe / ‹ › = siguiente L+R
   - Buscar 🔍: `linea.referencia` | `L.R-Mat` | `L.R-M-Color`

### Decisiones de diseño (2026-06-11)

| Aspecto | Decisión |
|---------|----------|
| **Paneles filtros** | Colapsables (Estilo izq, Referencia der) — tap en hero abre |
| **Aside fotos** | Inviolable — naipes verticales + mazo siempre visible |
| **Interacción** | 100% táctil (gestos ←→ ↑↓, targets ≥52px) |
| **Estilo visual** | Banana Republic (crema/carbón, serif Cormorant, `.chip-br`) |
| **Performance** | Thumbs 200px + prefetch vecinos |
| **Arquitectura** | Backend titanio (`lib/server/`) — agrupación server-side |

**Docs:** 
- `docs/CADENA_CONSECUTIVA.md` (completa)
- `docs/MEMORIA_CADENA_UI.md` (cuestionario decisiones)
- [cadena_consecutiva.md](./cadena_consecutiva.md) (resumen holding)

---

## Integraciones

### Con Report (administrador)

| Función Report | Uso en Tablet |
|----------------|---------------|
| Sync depósitos | Tablet consume tablas `deposito_tienda_*` |
| KPIs tienda | (futuro) Métricas vendedor |
| Admin productos | Tablet lee stock actualizado |

**Report** es el **cerebro** (sincroniza, administra).  
**Tablet** es el **ejecutor** (vende, consume).

### Con Motor de Precios (futuro)

**Pendiente OT:**
- Tablet debe leer LPN vía triplete `(linea_id, referencia_id, material_id)`
- Join con evento vigente + caso tienda Bazzar
- Server Action: `getPrecioLPN(triplete)` → consulta Motor

**Referencia:** `1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md`

### Con Supabase

**Tablas principales:**
- `deposito_tienda_*` (6 tablas) — catálogo por tienda
- `usuario_v2` — autenticación
- `cliente_web` (futuro) — clientes finales

**Conexión:** `DATABASE_URL` server-side (no anon key)

---

## Imágenes de producto

### Convención de nombres

```
Nivel 1 (grupo principal):
productos/{linea}-{referencia}-{material}.jpg

Nivel 2 (variante color):
productos/{linea}-{referencia}-{material}-{color}.jpg
```

**Fallback:** Si no existe imagen de color → usa imagen de material.

### Performance

- **Thumbnails:** 200px width (optimización Vercel)
- **Prefetch:** Vecinos ±1 en cadena
- **Componente:** `ProductImage.tsx` con skeleton

**Doc:** `docs/IMAGENES_PRODUCTO.md`

---

## Estado de implementación (2026-06-11)

| Componente | Estado | Nota |
|------------|--------|------|
| Auth JWT + middleware | ✅ | Cookie httpOnly |
| Panel modos de vista | ✅ | Grid 2x2 |
| API catálogo 6 depósitos | ✅ | `/api/deposito/[id]` |
| Depósito con fotos (grid) | ✅ | Modo clásico |
| **Cadena consecutiva** | ✅ | **UI táctil BR completa** |
| Backend titanio | ✅ | `/filtros`, `/ingresar`, `/live` |
| Paneles colapsables | ✅ | Estilo + Ref |
| Aside fotos (vertical + mazo) | ✅ | Inviolable |
| Filtros estilo/ref (multi) | ✅ | SQL entrada |
| Prefetch miniaturas | ✅ | Vecinos ±1 |
| **Filtro color** | ⏳ | Mismo patrón colapsable |
| **Precio LPN** | ⏳ | Join Motor Precios |
| **Tickets ORO / carrito** | ⏳ | Nueva etapa |
| **PWA offline** | ⏳ | Service worker |
| **Deploy Vercel prod** | ⏳ | Config pendiente |

**Datos cargados:** Fernando Adultos (2100) — ~5.660 SKUs.

---

## Backend titanio

### Qué es

**Backend titanio** = funciones server-side robustas que:
- Agrupan datos en servidor (no cliente)
- Ejecutan queries SQL optimizadas
- Retornan solo lo necesario

**Ubicación:** `lib/server/` (no exportado a cliente)

### Funciones implementadas (cadena)

| Endpoint | Archivo | Función |
|----------|---------|---------|
| `/filtros` | `lib/server/filtros.ts` | Cargar opciones estilo/ref disponibles |
| `/ingresar` | `lib/server/ingresar.ts` | Build inicial cadena + nav |
| `/cadena` | `lib/server/cadena.ts` | Get pares L+R específicos |
| `/live` | `lib/server/live.ts` | Stock live 4s polling |

**Beneficios:**
- No expone lógica SQL al cliente
- Reduce payload (agrupa antes de enviar)
- Centraliza reglas de negocio

---

## Errores conocidos resueltos

*(Ninguno documentado aún)*

Si existen hotfixes, documentar aquí con link a `.claude/5_errores/`

---

## Scripts de mantenimiento

*(Ninguno específico aún)*

Si existen scripts de sync/verificación, documentar aquí.

---

## Reglas para agentes

1. **Agrupación SIEMPRE L+R+Mat · color** — nunca inventar otra lógica.
2. **Precio desde Motor** — tablet no calcula, lee desde triplete.
3. **Backend titanio obligatorio** — no mover lógica SQL al cliente.
4. **Docs en repo primero** — `.claude/` solo holding/leyes.
5. **100% táctil** — targets ≥52px, no hover states.
6. **Report es cerebro** — tablet NO sincroniza, solo consume.

---

## Documentación extendida

### En `.claude/2_modulos/2.4_tablet_bazzar/`

- [INDICE.md](./INDICE.md) — índice general módulo
- [04_tablet_bazzar.md](./04_tablet_bazzar.md) — arquitectura detallada
- [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md) — **LEY agrupación L+R+Mat · color**
- [cadena_consecutiva.md](./cadena_consecutiva.md) — resumen modo cadena

### En `tablet-bazzar/docs/` (repo)

- `README.md` — índice técnico app
- `COMO_EJECUTAR.md` — dev, env, puertos
- `CADENA_CONSECUTIVA.md` — modo cadena completo
- `MEMORIA_CADENA_UI.md` — cuestionario decisiones
- `MODOS_VISTA.md` — panel y rutas
- `API_DEPOSITO.md` — APIs catálogo
- `IMAGENES_PRODUCTO.md` — thumbs, prefetch

### En arquitectura (holding)

- `3_arquitectura/3.2_venta_tienda/depositos.md`
- `3_arquitectura/3.2_venta_tienda/tickets_oro.md`
- `3_arquitectura/3.2_venta_tienda/multi_proveedor.md`

---

## Shibboleth V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-11  
**Responsable documentación:** Claude Code (unificación CONTEXT.md)
