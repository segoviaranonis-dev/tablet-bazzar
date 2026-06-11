# ETAPA: TABLET BAZZAR — CADENA + BACKEND TITANIO — CERRADA

**Fecha inicio:** 2026-06-10  
**Fecha cierre:** 2026-06-11 (noche)  
**Ejecutor:** Cursor (Auto)  
**Director:** «Cierra etapa, documenta, buenas noches»  
**Estado:** ✅ CERRADA (taller local · git pendiente push)

---

## Objetivo

Catálogo POS **100 % servidor**: filtros, ingreso de turno, cadena filtrada y stock en vivo — sin dump de miles de SKUs al navegador. Preparado para día de oferta (60 tablets, cero latencia crítica en cliente).

---

## Entregables

### APIs (SQL indexado, pilares FK)

| Ruta | Rol |
|------|-----|
| `GET /api/deposito/[id]/filtros` | Chips género/marca/estilo/tipo + marcas/refs agregadas |
| `POST /api/deposito/[id]/ingresar` | Sesión POS (`tablet-pos-ingreso`, 12 h) + URL vista + posición |
| `GET /api/deposito/[id]/cadena` | Cadena `ParLineaRef[]` construida en servidor |
| `GET /api/deposito/[id]/live` | Stock local + 3 ubicaciones (poll 4 s) |
| `GET /api/deposito/[id]/catalogo` | Refactor SQL compartido (`catalogo-sql.ts`) |

### Librería servidor

```
tablet-bazzar/lib/server/
├── catalogo-sql.ts    — WHERE parametrizado, agregados, molécula
├── cadena-server.ts   — build, resolver marca, posición inicial
└── pos-sesion.ts      — JWT cookie ingreso turno
```

### UI

- `/cadena` — filtros vía API (debounce 180 ms), botón **INGRESAR** fijo
- `/cadena/vista` — carga `/cadena`, stock live en hero (Fernando / Palma / San Martín)
- Paneles Estilo/Ref colapsables · aside naipes + mazo **siempre visible**

### Build

```
npm run build  → ✅ OK (Next.js 16.2.7)
```

---

## Verificación

| Check | Resultado |
|-------|-----------|
| TypeScript | ✅ |
| Rutas API registradas | ✅ |
| Sin catálogo completo en cliente (entrada/vista) | ✅ |
| Poll stock `/live` | ✅ 4 s |
| Cookie sesión POS post-ingresar | ✅ |

**Pendiente Director (visual):** smoke en `:3002` Fernando Adultos 2100.

---

## Git (`tablet-bazzar/`)

**Estado al cierre:** cambios en taller, **sin commit/push**.

```
Último commit: 115dc04 feat: Sistema de autenticación completo - Etapa 1
Pendiente: app/cadena/, app/api/deposito/, lib/server/, docs/, components/
```

**Próximo paso (cuando Director diga «subilo»):**

```bash
cd tablet-bazzar
git checkout -b cursor/tablet-cadena-backend-titanio
git add app/ components/ lib/ docs/ ...
git commit -m "feat(cadena): backend SQL titanio — filtros, ingresar, live"
git push -u origin cursor/tablet-cadena-backend-titanio
```

Deploy Vercel: tras merge + `DATABASE_URL` + `TABLET_SESSION_SECRET` en prod.

---

## Fuera de alcance (siguiente sprint)

- Carrito / tickets ORO
- Precio LPN Motor en API
- Report monitoreo tickets
- PWA offline / service worker
- Índices parciales extra (111 ya cubre FK básicas)

---

## Documentación actualizada

| Doc | Ruta |
|-----|------|
| API depósito | `tablet-bazzar/docs/API_DEPOSITO.md` |
| Backend POS | `tablet-bazzar/docs/BACKEND_POS.md` |
| Cadena UI | `tablet-bazzar/docs/CADENA_CONSECUTIVA.md` |
| README app | `tablet-bazzar/docs/README.md` |
| Etapa madre | `.claude/4_etapas/ETAPA_TABLET_BAZZAR.md` |
| ACTUAL | `.claude/4_etapas/ACTUAL.md` |

---

## Próxima etapa sugerida

**Tablet Etapa 2b — Tickets ORO:** carrito + `ticket_detalle` FK pilares + precio LPN server-side.

---

**Cierre formal:** 2026-06-11 · Director Héctor Segovia  
**Shibboleth Memoria V2:** 5 patas ✅
