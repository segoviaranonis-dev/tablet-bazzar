# Matriz de roles y accesos — Holding Nexus (CANÓNICA)

**Aprobada por:** Director (Héctor Segovia)  
**Fecha:** 2026-06-11  
**Etapa:** ROLES Y ACCESOS (activa)  
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

### BAZZAR — `rol_id = 2`

| Categoría | RIMEC WEB | RIMEC-REPORT | STREAMLIT (Nexus) | TABLET BAZZAR |
|-----------|-----------|--------------|-------------------|---------------|
| **ADMIN** | **PROHIBIDO** | Solo report **BAZZAR** (sin vista/opciones RIMEC) | **PROHIBIDO** | **TOTAL** |
| **VENDEDOR** | **PROHIBIDO** | **PROHIBIDO** | **PROHIBIDO** | **TOTAL** |

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

### BAZZAR (`rol_id = 2`)

- **Nunca** RIMEC WEB ni Streamlit.
- **Report:** solo módulos Bazzar (`/retail`, `/depositos-bazzar`, vista tablet admin); **ocultar** hub RIMEC (Sales, Aprobaciones, RIMEC ventas…).
- **Tablet Bazzar PWA:** TOTAL para ADMIN y VENDEDOR tienda.

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
| BAZZAR ADMIN (2+ADMIN) | `/retail`, `/depositos-bazzar`, `/tablet-bazzar` |
| BAZZAR VENDEDOR (2+VENDEDOR) | `/tablet-bazzar` (PWA directa; Report monitor según política) |

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

- Etapa activa: `.claude/4_etapas/ETAPA_ROLES_Y_ACCESOS.md`
- Report Aprobaciones: `report/docs/APROBACIONES.md`
- Palabras clave Director: `.claude/1_fundamentos/1.1_protocolos/PALABRAS_CLAVE_DIRECTOR.md`
- Memoria Claude: `memory/reference_matriz_roles_accesos.md`

---

**Última actualización:** 2026-06-11 — Matriz aprobada por Director (imagen gerencial).
