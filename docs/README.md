# Tablet Bazzar — Documentación técnica

**App:** PWA POS para vendedores en tiendas Bazzar  
**Repo:** `tablet-bazzar/`  
**Puerto dev:** **3000** (`npx next dev -p 3000`)  
**Deploy:** `tablet-bazzar.vercel.app` (pendiente push cambios POS/vendedor)

---

## Qué es

Ejecutor de venta en tienda física. **Report** administra y monitorea; **Tablet** consume el depósito local de cada tienda con UI táctil.

| Rol | Proyecto |
|-----|----------|
| Vendedor / SU en piso | `tablet-bazzar/` |
| Dirección / sync depósitos / caja | `report/` |

**Índice holding (leer primero):** `.claude/2_modulos/2.4_tablet_bazzar/INDICE.md`

---

## Etapa activa — POS bandeja única v2

| Documento | Contenido |
|-----------|-----------|
| **[LOGICA_OPERATIVA_POS_BAZZAR.md](./LOGICA_OPERATIVA_POS_BAZZAR.md)** | **Doc canónico v2** — estados, stock, CERRAR, funciones |
| [REGLAS_BANDEJA_UNICA_POS.md](./REGLAS_BANDEJA_UNICA_POS.md) | Reglas inviolables resumidas |
| [ARQUITECTURA_SESION_STOCK_ORO.md](./ARQUITECTURA_SESION_STOCK_ORO.md) | 3 capas stock · ciclo sesión |
| [MICRO_ECOSISTEMA_POS_BAZZAR.md](./MICRO_ECOSISTEMA_POS_BAZZAR.md) | Tablet ↔ Report ↔ BD |
| [../../.claude/4_etapas/ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md](../../.claude/4_etapas/ETAPA_POS_BAZZAR_DOCUMENTACION_CERRADA.md) | **✅ Cierre doc Moria** |
| [../report/docs/INDICE_POS_BAZZAR.md](../report/docs/INDICE_POS_BAZZAR.md) | Índice central holding |
| [ETAPA_TICKETS_POS_STOCK.md](./ETAPA_TICKETS_POS_STOCK.md) | ⚠️ Histórico pre-v2 (dual staging) |
| [PRUEBA_VENDEDOR_STAGING.md](./PRUEBA_VENDEDOR_STAGING.md) | Smoke manual pre-cierre |

| Franco Tirador | **[MODULO_FRANCO_TIRADOR.md](./MODULO_FRANCO_TIRADOR.md)** | Sniper · Procesar carga cadena |

**CHUSAR holding:** `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_FRANCO_TIRADOR.md` · POS v2 → `LOGICA_OPERATIVA_POS_BAZZAR.md`

---

## Documentos por área

### Operación y dev

| Documento | Contenido |
|-----------|-----------|
| [COMO_EJECUTAR.md](./COMO_EJECUTAR.md) | Entorno, `.env.local`, dev, build |
| [MODOS_VISTA.md](./MODOS_VISTA.md) | Panel de control y rutas |
| [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) | Producción |

### Ventas / cadena

| Documento | Contenido |
|-----------|-----------|
| [CADENA_CONSECUTIVA.md](./CADENA_CONSECUTIVA.md) | Modo cadena: navegación, filtros, UI |
| [NAVEGACION_CADENA.md](./NAVEGACION_CADENA.md) | Teclado, 2 niveles, refs URL |
| [MEMORIA_CADENA_UI.md](./MEMORIA_CADENA_UI.md) | Resumen denso (cuestionario) |
| [HOTFIX_VENTAS_STANDS_STOCK_PAR_LR.md](./HOTFIX_VENTAS_STANDS_STOCK_PAR_LR.md) | Stands par L+R · `/live` |
| **[MODULO_FRANCO_TIRADOR.md](./MODULO_FRANCO_TIRADOR.md)** | **Franco Tirador · filtros · Procesar → cadena** |
| [ESTILO_CATALOGO_BAZZAR_NIIF.md](./ESTILO_CATALOGO_BAZZAR_NIIF.md) | Ley visual salón |

### Depósito / backend

| Documento | Contenido |
|-----------|-----------|
| [API_DEPOSITO.md](./API_DEPOSITO.md) | Endpoints catálogo y status |
| [BACKEND_POS.md](./BACKEND_POS.md) | Capa SQL — filtros, ingresar, live |
| [MODULO_DEPOSITO_FOTOS.md](./MODULO_DEPOSITO_FOTOS.md) | Grid molécula + fotos |
| [MODULO_DEPOSITO_HEADER_PILARES.md](./MODULO_DEPOSITO_HEADER_PILARES.md) | Header pilares depósito |
| [TRIANGULO_HEADER_PILARES.md](./TRIANGULO_HEADER_PILARES.md) | JOIN pilares cadena |
| [MODULO_EMPAQUE.md](./MODULO_EMPAQUE.md) | Empaque P-13 (pendiente) |

### Imágenes / diseño

| Documento | Contenido |
|-----------|-----------|
| [IMAGENES_PRODUCTO.md](./IMAGENES_PRODUCTO.md) | Thumbs, hero v16-fill-host |
| **[ETAPA_ASPECTO_VISUAL_CIERRE.md](./ETAPA_ASPECTO_VISUAL_CIERRE.md)** | ✅ CERRADA · hero cadena |

### Evidencia

Carpeta [`evidencia/`](./evidencia/) — JSON de cierres y aperturas de sub-sesiones.

---

## Documentación holding (`.claude/`)

| Documento | Ruta |
|-----------|------|
| **Índice módulo 2.4** | `.claude/2_modulos/2.4_tablet_bazzar/INDICE.md` |
| **CONTEXT** | `.claude/2_modulos/2.4_tablet_bazzar/CONTEXT.md` |
| Etapa tickets | `.claude/4_etapas/ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md` |
| Sub-sesión vendedor | `.claude/4_etapas/SUBSESION_TABLET_VENDEDOR_STAGING_20260622.md` |
| Navegador | http://localhost:3004/modulos → Tablet Bazzar |

---

## Estado al 2026-06-24

| Área | Estado |
|------|--------|
| Auth JWT + middleware | ✅ |
| Cadena + stands + carrito | ✅ |
| Bandeja única + CERRAR → caja | ✅ v2 |
| Validación stock reabrir FI_FA | ✅ |
| Migración 009 FI_FA | ✅ local |
| Deploy Vercel + git push | ⏳ |

**Depósito prueba:** Fernando Adultos (`cliente_id` 2100) — 6256 filas.

---

**Última actualización:** 2026-06-24 · Doc canónico POS v2 indexado
