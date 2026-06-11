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
| Depósitos 6 tiendas | `.claude/3_arquitectura/3.2_venta_tienda/depositos.md` |

---

## Estado al 2026-06-11 (noche — sub-etapa cerrada)

| Área | Estado |
|------|--------|
| Auth JWT + middleware | ✅ |
| Panel modos de vista | ✅ |
| Depósito con fotos (grid) | ✅ |
| Cadena consecutiva — UI táctil BR | ✅ |
| Backend titanio (filtros / ingresar / cadena / live) | ✅ |
| Botón INGRESAR + sesión POS 12 h | ✅ |
| Stock live 3 ubicaciones (poll 4 s) | ✅ |
| Precio LPN desde Motor | ⏳ |
| Carrito / tickets ORO | ⏳ |
| PWA offline | ⏳ |
| Deploy Vercel prod + `DATABASE_URL` | ⏳ |

**Depósito prueba:** Fernando Adultos (`cliente_id` 2100) — ~5.660 SKUs.

**Doc backend:** [BACKEND_POS.md](./BACKEND_POS.md)

---

**Última actualización:** 2026-06-11 (cierre sub-etapa)
