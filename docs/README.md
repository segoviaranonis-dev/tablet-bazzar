# Tablet Bazzar — Documentación técnica

**App:** PWA POS para vendedores en tiendas Bazzar  
**Repo:** `tablet-bazzar/`  
**Puerto dev:** 3002  
**Deploy:** `tablet-bazzar.vercel.app` (pendiente env producción)

---

## Qué es

Ejecutor de venta en tienda física. **Report** administra y monitorea; **Tablet** consume el depósito local de cada tienda con UI táctil.

| Rol | Proyecto |
|-----|----------|
| Vendedor / SU en piso | `tablet-bazzar/` |
| Dirección / sync depósitos | `report/` (acordeón Bazzar) |

---

## Documentos de esta carpeta

| Documento | Contenido |
|-----------|-----------|
| [COMO_EJECUTAR.md](./COMO_EJECUTAR.md) | Entorno, `.env.local`, dev, build |
| [MODOS_VISTA.md](./MODOS_VISTA.md) | Panel de control y rutas |
| [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md) | Modo cadena: navegación, filtros, UI BR |
| [NAVEGACION_CADENA.md](./NAVEGACION_CADENA.md) | Teclado, 2 niveles, refs URL, smoke test |
| [MEMORIA_CADENA_UI.md](./MEMORIA_CADENA_UI.md) | Resumen denso (cuestionario / verificación) |
| [API_DEPOSITO.md](./API_DEPOSITO.md) | Endpoints catálogo y status |
| [BACKEND_POS.md](./BACKEND_POS.md) | Capa SQL titanio — filtros, ingresar, live |
| [IMAGENES_PRODUCTO.md](./IMAGENES_PRODUCTO.md) | Thumbs, convención L-R-M-C, prefetch |

---

## Documentación holding (`.claude/`)

| Documento | Ruta |
|-----------|------|
| Índice módulo 2.4 | `.claude/2_modulos/2.4_tablet_bazzar/INDICE.md` |
| Agrupación 2 niveles (LEY) | `.claude/2_modulos/2.4_tablet_bazzar/agrupacion_dos_niveles.md` |
| Etapa activa | `.claude/4_etapas/ETAPA_TABLET_BAZZAR.md` |
| Propuesta cierre cadena UI | `.claude/4_etapas/ETAPA_TABLET_CADENA_UI_NAV_PROPUESTA_CIERRE.md` |
| Depósitos 6 tiendas | `.claude/3_arquitectura/3.2_venta_tienda/depositos.md` |

---

## Estado al 2026-06-11 (cadena UI + filtros — propuesta cierre)

| Área | Estado |
|------|--------|
| Auth JWT + middleware | ✅ |
| Panel modos de vista | ✅ |
| Depósito con fotos (grid) | ✅ |
| Cadena consecutiva — UI 2 niveles + teclado | ✅ |
| Fix filtros / INGRESAR / refs URL | ✅ |
| Backend titanio (filtros / ingresar / cadena / live) | ✅ |
| Botón INGRESAR + sesión POS 12 h | ✅ |
| Stock live 3 ubicaciones | ✅ |
| Precio LPN desde Motor | ⏳ |
| Carrito / tickets ORO | ⏳ |
| PWA offline | ⏳ |
| Deploy Vercel prod + git push | ⏳ |

**Propuesta cierre:** `.claude/4_etapas/ETAPA_TABLET_CADENA_UI_NAV_PROPUESTA_CIERRE.md`  
**Bug P0 filtros:** `BUG_FILTROS_BUSQUEDA.md` (RESUELTO)

**Depósito prueba:** Fernando Adultos (`cliente_id` 2100) — ~5.660 SKUs.

---

**Última actualización:** 2026-06-11 (propuesta cierre sub-etapa cadena UI)
