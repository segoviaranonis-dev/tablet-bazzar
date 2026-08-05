# SUB-SESIÓN — Tablet · Vendedor · Staging · prep cierre

**ID:** `SUBSESION-TABLET-VENDEDOR-STAGING-20260622`  
**Fecha:** 2026-06-22  
**Estado:** 🟡 **PRE-CIERRE DOC** → ✅ doc indexada 2026-06-24 · smoke venta ⏳  
**Etapa padre:** [ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md](./ETAPA_TABLET_TICKETS_POS_STOCK_REPORT.md)  
**CHUSAR:** [CHUSAR_TABLET_VENDEDOR_STAGING.md](../2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_VENDEDOR_STAGING.md) (`2.4.2.3.1`)

---

## Objetivo sub-sesión

Dejar **indexada y verificable** la capa vendedor + staging antes del smoke de venta real y del cierre formal de 2.4.2.3.

---

## Entregables documentación (Chusar 2026-06-22)

| Entregable | Ruta | Estado |
|------------|------|--------|
| CHUSAR vendedor + staging | `.claude/2_modulos/2.4_tablet_bazzar/CHUSAR_TABLET_VENDEDOR_STAGING.md` | ✅ |
| Índice módulo 2.4 | `.claude/2_modulos/2.4_tablet_bazzar/INDICE.md` | ✅ actualizado |
| Índice app | `tablet-bazzar/docs/README.md` | ✅ actualizado |
| CHUSAR tickets (padre) | `CHUSAR_TICKETS_POS_STOCK.md` | ✅ alineado staging |
| Arquitectura 3 capas | `tablet-bazzar/docs/ARQUITECTURA_SESION_STOCK_ORO.md` | ✅ |
| Prueba manual | `tablet-bazzar/docs/PRUEBA_VENDEDOR_STAGING.md` | ✅ |
| Navegador etapas | `nexus-navegador-holding/config/etapas.json` | ✅ |
| Árbol módulos | `nexus-navegador-holding/config/arbol-modulos.json` | ✅ 2.4.2.3.1 |
| CODIGO_MAESTRO | regenerado vía script | ✅ |

---

## Entregables código (ya implementados · local)

- `vendedor_bazzar` + 4 vendedores RRHH  
- `PosCartSheet` · CERRAR con cliente + vendedor  
- `VendedorEnteSwitch` · cambio vendedor mismo ente  
- `VendedorContext` · sin localStorage  
- `tickets-staging.ts` · stock atómico sesión  
- Migraciones 001–004 aplicadas Supabase compartida  

---

## Criterio cierre sub-sesión

1. Smoke E2E: cédula → código **36** → CERRAR → staging → ORO → visible Report operativa.  
2. Evidencia JSON en `tablet-bazzar/docs/evidencia/`.  
3. Director ordena **Cierra etapa** o sub-sesión.  
4. Claude Code: commit + deploy tablet.

---

## Evidencia

- Apertura doc: `tablet-bazzar/docs/evidencia/SUBSESION_VENDEDOR_STAGING_APERTURA_20260622.json`  
- Cierre: pendiente post-smoke

---

**Siguiente paso:** prueba venta en `localhost:3000` antes de declarar cerrada.
