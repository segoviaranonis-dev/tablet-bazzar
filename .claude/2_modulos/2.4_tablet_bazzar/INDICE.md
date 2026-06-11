# 2.4 TABLET BAZZAR — POS Móvil

**Tipo:** Módulo PWA  
**Tecnología:** Next.js 16 (App Router + Turbopack)  
**Repo:** `tablet-bazzar/`  
**Puerto dev:** 3002  
**Deploy:** `tablet-bazzar.vercel.app`  
**Última actualización:** 2026-06-11

---

## DESCRIPCIÓN

Tablet Bazzar es el **ejecutor POS** para vendedores en las 6 tiendas Bazzar.

| Rol | Proyecto |
|-----|----------|
| **Ejecutor** (venta, fotos, stock en tienda) | `tablet-bazzar/` |
| **Administrador** (sync depósitos, KPIs) | Report → acordeón BAZZAR |

**Estrategia:** Fase 1 de Hiedra Venenosa (Infiltración)

---

## DOCUMENTACIÓN

### **📖 Punto de entrada: [CONTEXT.md](./CONTEXT.md)**

**Leer primero** — arquitectura completa, stack, modos de vista, integraciones, reglas.

### En el repo (`tablet-bazzar/docs/`)

| Documento | Contenido |
|-----------|-----------|
| [README.md](../../../tablet-bazzar/docs/README.md) | Índice técnico app |
| [COMO_EJECUTAR.md](../../../tablet-bazzar/docs/COMO_EJECUTAR.md) | Dev, env, puertos |
| [CADENA_CONSECUTIVA.md](../../../tablet-bazzar/docs/CADENA_CONSECUTIVA.md) | Modo cadena — UI, gestos, filtros |
| [MEMORIA_CADENA_UI.md](../../../tablet-bazzar/docs/MEMORIA_CADENA_UI.md) | Resumen cuestionario |
| [MODOS_VISTA.md](../../../tablet-bazzar/docs/MODOS_VISTA.md) | Panel y rutas |
| [API_DEPOSITO.md](../../../tablet-bazzar/docs/API_DEPOSITO.md) | APIs catálogo |
| [IMAGENES_PRODUCTO.md](../../../tablet-bazzar/docs/IMAGENES_PRODUCTO.md) | Thumbs, prefetch |

### En `.claude/` (holding)

| Documento | Contenido |
|-----------|-----------|
| **[CONTEXT.md](./CONTEXT.md)** | **Arquitectura completa, integraciones, reglas** |
| [04_tablet_bazzar.md](./04_tablet_bazzar.md) | Arquitectura detallada, stack, estado |
| [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md) | **LEY:** L+R+Mat · color |
| [cadena_consecutiva.md](./cadena_consecutiva.md) | Resumen modo cadena + enlaces |
| [ETAPA_TABLET_BAZZAR.md](../../4_etapas/ETAPA_TABLET_BAZZAR.md) | Objetivo etapa activa |

---

## ESTADO IMPLEMENTACIÓN (2026-06-11)

| Componente | Estado |
|------------|--------|
| Auth JWT + middleware | ✅ |
| Panel modos de vista | ✅ |
| API catálogo 6 depósitos | ✅ |
| Depósito con fotos (grid) | ✅ |
| Cadena consecutiva (UI táctil BR) | ✅ |
| Paneles Estilo/Ref colapsables | ✅ |
| Aside fotos lateral (vertical + mazo) | ✅ |
| Filtros estilo / ref (multi-select) | ✅ |
| Filtro color (panel colapsable) | ⏳ |
| Prefetch miniaturas | ✅ |
| Precio LPN desde Motor | ⏳ |
| Tickets ORO / carrito | ⏳ |
| PWA offline | ⏳ |
| Deploy Vercel prod | ⏳ |

**Datos:** Fernando Adultos (2100) cargado (~5.660 SKUs).

---

## AGRUPACIÓN CATÁLOGO

| Nivel | Pilares | Función |
|-------|---------|---------|
| **1 — Principal** | L + R + material | Precio · mazo colores |
| **2 — Color** | color | Variantes · stock/grada |

Doc: [agrupacion_dos_niveles.md](./agrupacion_dos_niveles.md)

---

## SHIBBOLETH V2

**Un gato tiene 5 patas**

---

**Última actualización:** 2026-06-11
