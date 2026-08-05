# PROPUESTA DE CIERRE — Tablet Bazzar · Cadena UI + Filtros

**Protocolo:** `.claude/1_fundamentos/1.1_protocolos/1.1.10_protocolo_cierre_etapa.md`  
**Fecha propuesta:** 2026-06-11  
**Ejecutor:** Cursor (Auto)  
**Estado:** ✅ **CERRADA** — ver [ETAPA_TABLET_CADENA_UI_NAV_CERRADA.md](./ETAPA_TABLET_CADENA_UI_NAV_CERRADA.md)

---

## Objetivo de la sub-etapa

Modo **cadena consecutiva** usable en piso: filtros/INGRESAR operativos, agrupación 2 niveles sin duplicar fotos, navegación táctil + teclado alineada a la ley POS.

---

## Entregables

### Fix P0 — Filtros y búsqueda

| Item | Archivo / nota |
|------|----------------|
| Parser URL `refs` (pipe interno) | `lib/filtros-url.ts` |
| Normalización marca/claves | `lib/cadena.ts`, `lib/server/cadena-server.ts` |
| INGRESAR búsqueda amplia | `resolverMarcaIngreso` — sin forzar una ref |
| Evidencia | `BUG_FILTROS_BUSQUEDA.md` → RESUELTO |

### UI navegación 2 niveles

| Item | Archivo |
|------|---------|
| Footer = materiales L+R+Mat | `CarruselMateriales.tsx` |
| Sidebar L+R solo si >1 ref | `app/cadena/vista/page.tsx` |
| Mazo colores (nivel 2) | `MazoMaterialNaipes.tsx` |
| Sin duplicar naipes | `buildCarouselWindow` en `lib/cadena-carousel.ts` |
| Teclado ←→ ↑↓ sin botones visibles | `lib/use-cadena-keyboard.ts` |

### Documentación

| Doc | Ruta |
|-----|------|
| Navegación cadena | `tablet-bazzar/docs/NAVEGACION_CADENA.md` |
| Cadena consecutiva (actualizado) | `tablet-bazzar/docs/CADENA_CONSECUTIVA.md` |
| Memoria cuestionario | `tablet-bazzar/docs/MEMORIA_CADENA_UI.md` |
| Backend POS (refs URL) | `tablet-bazzar/docs/BACKEND_POS.md` |
| Índice módulo 2.4 | `.claude/2_modulos/2.4_tablet_bazzar/INDICE.md` |

---

## Verificación técnica

| Check | Resultado |
|-------|-----------|
| `npm run build` | ✅ OK (Next.js 16.2.7) |
| API `/cadena?refs=1184\|1101&q=1184&marca=VIZZANO` | ✅ `totalFilas` > 0, `paresAll` > 0 |
| Vista sin clones en footer | ✅ materiales distintos |
| Flechas teclado ←→ ↑↓ | ✅ |
| Sin ◀▶ visibles | ✅ |

---

## Smoke test Director (visual)

```text
1. http://localhost:3002 → login
2. /cadena → Fernando Adultos → buscar 1184 → INGRESAR
3. Vista VIZZANO con stock (no "Sin stock en esta marca")
4. Footer: tarjetas material distintas; ↑↓ cambia color; ←→ cambia material/ref
5. Click ref 1184.1101 en lista → vista con hero y stock live
```

---

## Git — pendiente Director

**Estado taller:** cambios locales sin commit/push (salvo commits previos de backend titanio).

**Cuando Director diga «subilo»:**

```bash
cd tablet-bazzar
git status --short
git checkout -b cursor/tablet-cadena-ui-filtros
git add app/ components/ lib/ docs/ BUG_FILTROS_BUSQUEDA.md
git commit -m "fix(cadena): filtros refs URL, navegación 2 niveles y teclado"
git push -u origin cursor/tablet-cadena-ui-filtros
```

Deploy Vercel: requiere `DATABASE_URL` + `TABLET_SESSION_SECRET` en prod.

---

## Fuera de alcance (siguiente sprint)

- Carrito / tickets ORO
- Precio LPN Motor en API
- Filtro color panel colapsable
- PWA offline
- Report monitoreo tickets

---

## Relación con etapas previas

| Etapa | Doc |
|-------|-----|
| Backend titanio | `.claude/4_etapas/ETAPA_TABLET_CADENA_BACKEND_TITANIO_CERRADA.md` |
| Etapa madre Tablet | `.claude/4_etapas/ETAPA_TABLET_BAZZAR.md` |

**Próxima etapa sugerida:** Tablet 2b — Tickets ORO + precio LPN server-side.

---

**Shibboleth Memoria V2:** 5 patas ✅
