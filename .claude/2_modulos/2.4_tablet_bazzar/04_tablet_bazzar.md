# MÓDULO 04: TABLET BAZZAR

**Tipo:** Next.js 16 / PWA  
**Puerto dev:** 3002  
**Estado:** Etapa 2 — cadena + backend titanio cerrados (2026-06-11). Siguiente: tickets ORO.

---

## DESCRIPCIÓN

POS para vendedores en tiendas Bazzar. Tablets landscape, táctil, offline-first (roadmap).

**Doc técnica app:** [`tablet-bazzar/docs/README.md`](../../../tablet-bazzar/docs/README.md)

---

## ARQUITECTURA

### Stack

- Next.js 16 (App Router + Turbopack)
- TypeScript · Tailwind CSS v4
- PostgreSQL Supabase (`DATABASE_URL` server-side)
- JWT (jose) + cookie `tablet-session`
- Fuentes: Geist + Cormorant Garamond (modo cadena)

### Estructura repo (2026-06-10)

```
tablet-bazzar/
├── app/
│   ├── page.tsx                 Panel modos de vista
│   ├── login/page.tsx
│   ├── deposito/page.tsx        Grid stock + fotos
│   ├── cadena/
│   │   ├── page.tsx             Selector marca
│   │   └── vista/page.tsx       Cadena consecutiva
│   └── api/
│       ├── auth/
│       └── deposito/
├── components/
│   ├── ProductImage.tsx
│   └── cadena/                  UI cadena (naipes, filtros, touch)
├── lib/
│   ├── cadena.ts                Agrupación L+R, L+R+Mat
│   ├── cadena-filtros.ts
│   ├── codigo-busqueda.ts
│   ├── product-image.ts
│   ├── prefetch-images.ts
│   ├── depositos-config.ts
│   └── view-modes.ts
├── docs/                        ← documentación app
└── middleware.ts
```

---

## AUTH (sin cambios Etapa 1)

- Login: `usuario_v2` · JWT 8h · cookie httpOnly
- Rol 1: acceso total · Rol 2: solo ADMIN/SU
- Vendedores → Report, no tablet (política actual)

Ver secciones auth en versiones anteriores de este doc.

---

## MODOS DE VISTA IMPLEMENTADOS

| Modo | Ruta | Doc |
|------|------|-----|
| Depósito con fotos | `/deposito` | `docs/MODOS_VISTA.md` |
| Cadena consecutiva | `/cadena` → `/cadena/vista` | `docs/CADENA_CONSECUTIVA.md` |

---

## DEPÓSITOS

6 tablas `deposito_tienda_*` · `cliente_id` 2100–3200.  
Config: `lib/depositos-config.ts` · API: `docs/API_DEPOSITO.md`

---

## ESTADO

### Completado

- Auth + middleware + login
- API catálogo y status depósitos
- **Backend titanio:** `/filtros`, `/ingresar`, `/cadena`, `/live` (`lib/server/`)
- Grid depósito con fotos
- Cadena: filtros entrada SQL, INGRESAR, vista server-side, stock live 4 s
- Cadena UI: naipes L+R, mazo colores, paneles colapsables, aside fijo
- Fix contraste UI tablet (chips `.chip-br`)

### Pendiente

- Carrito / tickets ORO
- Clientes `cliente_web`
- Precio LPN vía Motor (server)

---

## SHIBBOLETH V2

**Un gato tiene 5 patas** ✅

---

**Última actualización:** 2026-06-11
- PWA offline / service worker
- Deploy Vercel producción + git push sub-etapa

---

## DOCUMENTACIÓN RELACIONADA

- [INDICE.md](./INDICE.md)
- [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md)
- [cadena_consecutiva.md](./cadena_consecutiva.md)
- [ETAPA_TABLET_CADENA_BACKEND_TITANIO_CERRADA.md](../../4_etapas/ETAPA_TABLET_CADENA_BACKEND_TITANIO_CERRADA.md)
- [ETAPA_TABLET_BAZZAR.md](../../4_etapas/ETAPA_TABLET_BAZZAR.md)

---

**Última actualización:** 2026-06-11  
**Shibboleth V2:** Un gato tiene 5 patas
