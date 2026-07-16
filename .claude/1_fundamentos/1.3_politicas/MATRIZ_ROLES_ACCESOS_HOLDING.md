# Matriz de roles y accesos — Holding Nexus (CANÓNICA)

**Aprobada por:** Director (Héctor Segovia)  
**Fecha:** 2026-06-11  
**Etapa:** ROLES Y ACCESOS — ✅ cerrada Fase 2 [ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md](../../4_etapas/ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md)  
**Fuente de verdad usuario:** `usuario_v2` (`rol_id` + `categoria`)

> Antes de crear un módulo nuevo o tocar auth/middleware: leer esta matriz.  
> Regla Cursor: `.cursor/rules/matri-roles-accesos-holding.mdc`

---

## Empresas y roles

| Rol | Empresa | Descripción |
|-----|---------|-------------|
| **1** | **RIMEC** | Importadora — operación, gerencia, vendedores mayoristas |
| **2** | **BAZZAR** | Retail tiendas — depósitos, tablet POS |

`categoria` matiza permisos dentro del rol (`ADMIN`, `VENDEDOR`, `DIOS`, etc.).

---

## Matriz completa (Director)

### RIMEC — `rol_id = 1`

| Categoría | RIMEC WEB | RIMEC-REPORT | STREAMLIT (Nexus) | TABLET BAZZAR |
|-----------|-----------|--------------|-------------------|---------------|
| **DIOS** | **TOTAL** | **TOTAL** | **TOTAL** | **TOTAL** |
| **ADMIN** | **TOTAL** | Todo **menos** Aprobación de pedidos | Todo **menos** Aprobación de pedidos | **TOTAL** |
| **VENDEDOR** | **TOTAL** | Solo módulo **Ventas con fotos** | **PROHIBIDO** | **PROHIBIDO** |
| **CAJA** | **PROHIBIDO** | Solo **Facturación Pronta Entrega** | **PROHIBIDO** | **PROHIBIDO** |

### BAZZAR — `rol_id = 2`

| Categoría | RIMEC WEB | RIMEC-REPORT | STREAMLIT (Nexus) | TABLET BAZZAR |
|-----------|-----------|--------------|-------------------|---------------|
| **ADMIN** | **TOTAL** (catálogo + carrito) | Solo report **BAZZAR** (sin vista/opciones RIMEC) | **PROHIBIDO** | **TOTAL** |
| **VENDEDOR** | **TOTAL** (catálogo + carrito + código cliente) | **PROHIBIDO** | **PROHIBIDO** | **TOTAL** (POS / compra tienda) |

---

## Leyes de interpretación

### Nivel Dios (`rol_id = 1` + `categoria = DIOS`)

- Máximo nivel del holding: **sin restricciones** en las cuatro herramientas.
- Incluye **Aprobación de pedidos** en Report y Streamlit (Nivel Dios / editor FI).
- Palabra clave holding: **Nivel Dios**.

### ADMIN RIMEC (`rol_id = 1` + `categoria = ADMIN`)

- Casi todo; **excluido** módulo Aprobación de pedidos (Report `/aprobaciones` + Streamlit `aprobacion_pedidos`).
- Ejemplo: Tito.

### VENDEDOR RIMEC (`rol_id = 1` + `categoria = VENDEDOR`)

- **RIMEC WEB:** catálogo/carrito completo.
- **Report:** únicamente `/ventas-fotos` (Ventas con fotos).
- **Streamlit y Tablet Bazzar:** no entran.

### CAJA RIMEC (`rol_id = 1` + `categoria = CAJA`)

- **Solo Report** · única ruta `/facturacion/pronta-entrega` (+ API facturación PE).
- Usuario canónico: **CAJA_RIMEC** · doc [CHUSAR_USUARIO_CAJA_RIMEC_PE.md](../../2_modulos/2.3_report/facturacion/CHUSAR_USUARIO_CAJA_RIMEC_PE.md) (**2.3.1.9.E**).
- **RIMEC Web · Streamlit · Tablet · resto Report:** PROHIBIDO.

### BAZZAR (`rol_id = 2`)

- **RIMEC WEB:** **ADMIN** y **VENDEDOR** tienda entran al catálogo mayorista (mismo nivel operativo que **ATI** en web: catálogo, carrito, código de cliente al confirmar).
- **Streamlit:** no entran.
- **Report:** solo **ADMIN** gerencial (ej. **IVO**) — módulos Bazzar (`/retail`, `/depositos-bazzar`, `/tablet-bazzar`); **VENDEDOR** tienda **no** entra a Report.
- **Tablet Bazzar PWA:** TOTAL para ADMIN y VENDEDOR tienda.

---

## Lenguaje Director — «roles de usuarios» (Bazzar tienda)

Cuando el Director habla de **roles de usuarios** en tiendas Bazzar, distingue **dos cuentas por sede**, no confundir con la matriz RIMEC importadora:

| Tipo | Categoría típica | Usuario ejemplo (San Martín) | Para qué |
|------|------------------|------------------------------|----------|
| **Cuenta compra tienda** | `VENDEDOR` · `rol_id=2` | **BZZS** (adultos) · **BZZSN** (niños) | Comprar/recibir de RIMEC en **RIMEC Web** — catálogo, carrito, ingresar **código de cliente** (paridad **ATI**) |
| **Cuenta gerencial tienda** | `ADMIN` · `rol_id=2` | **IVO** | **Report** módulos Bazzar completos + **Tablet** sin restricciones de gerente |

**Patrón nomenclatura:** `BZZ` + sede (`F` Fernando · `S` San Martín · `P` Palma) + segmento (`A` adultos · `N` niños). En BD pueden existir formas cortas (`BZZS`, `BZZP`) — mapear por depósito (`2400`, `2700`, …).

**Regla operativa:** la tienda que va a **comprar de RIMEC** usa la cuenta **VENDEDOR** de su segmento en RIMEC Web; el **gerente** usa su cuenta **ADMIN** en Report/Tablet.

**Hotfix auth web 2026-07-07:** `rimec-web/lib/auth/roles.ts` — eliminado bloqueo erróneo `rol_id=2 + VENDEDOR` en login (doc previa decía PROHIBIDO; Director ratificó acceso ATI).

---

## Mapeo técnico (implementación)

| Herramienta | Repo / ruta | Enforcement |
|-------------|-------------|-------------|
| RIMEC WEB | `rimec-web/` | Auth Supabase + policies |
| RIMEC-REPORT | `report/` | `middleware.ts`, home filter, `nivel-dios.ts` |
| STREAMLIT | `control_central/` | `AuthManager`, `registry`, `aduana_de_seguridad` |
| TABLET BAZZAR | `tablet-bazzar/` + `report/…/tablet-bazzar` | Auth tablet + roles |

### Report — rutas por fila de matriz

| Perfil | Rutas permitidas |
|--------|-------------------|
| DIOS (1+DIOS) | Todas incl. `/aprobaciones` |
| ADMIN (1+ADMIN) | `/`, `/rimec`, `/ventas-fotos`, `/retail`, `/depositos-bazzar`, `/tablet-bazzar`, `/informes` — **no** `/aprobaciones` |
| VENDEDOR (1+VENDEDOR) | `/ventas-fotos` |
| CAJA (1+CAJA) | `/facturacion/pronta-entrega` |
| BAZZAR ADMIN (2+ADMIN) | `/retail`, `/depositos-bazzar`, `/tablet-bazzar` |
| BAZZAR VENDEDOR (2+VENDEDOR) | `/tablet-bazzar` (PWA); **RIMEC Web** catálogo (no Report gerencial) |

---

## Colores (semántica UI gerencial)

| Color | Significado |
|-------|-------------|
| Verde | TOTAL — acceso completo a esa herramienta |
| Amarillo | Parcial — módulos específicos o exclusiones explícitas |
| Rojo | PROHIBIDO — no login o redirect/bloqueo |

---

## Auditoría SQL

```sql
SELECT id_usuario, descp_usuario, rol_id, UPPER(TRIM(categoria)) AS categoria
FROM usuario_v2
ORDER BY rol_id, categoria, descp_usuario;
```

---

## Documentos relacionados

- **Etapa cerrada (Fase 2 Bazzar):** `.claude/4_etapas/ETAPA_ACCESOS_HOLDING_BZZ_CERRADA.md`
- Etapa Fase 1: `.claude/4_etapas/ETAPA_ROLES_Y_ACCESOS_CERRADA.md`
- Ayuda memoria BZZ: `report/docs/AYUDA_MEMORIA_USUARIOS_ACCESOS_BZZ.md`
- Report accesos: `report/docs/ACCESOS_BZZ_RIMEC_WEB.md`
- Report Aprobaciones: `report/docs/APROBACIONES.md`
- Palabras clave Director: `.claude/1_fundamentos/1.1_protocolos/PALABRAS_CLAVE_DIRECTOR.md`

---

**Última actualización:** 2026-07-16 — categoría **CAJA** · usuario CAJA_RIMEC · solo Facturación PE Report.
