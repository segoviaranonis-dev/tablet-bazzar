# Reporte Técnico: MIG-070 - Refactorización Transaccional de Precios Estrictos

**Autor:** Claude Code bajo directiva de Héctor Segovia  
**Fecha:** 22 de Mayo, 2026  
**Estado:** PASS (Sistema Blindado)  

---

## 1. Filosofía de la Migración

Siguiendo el mandato de **Precios Transaccionales Estrictos (MIG-070)**, se ha aplicado la **Opción A (Estricta)**:
*   **Sin Enmascaramiento:** El sistema no debe ocultar fallas administrativas u omisiones operativas. Si un Pedido Proveedor (`pedido_proveedor`) en estado activo carece de una intención de compra con evento comercial asignado, los precios y el caso asociado deben retornar estrictamente `NULL`.
*   **Desacople de Biblioteca:** La tabla `caso_precio_biblioteca` se mantiene como base de configuración histórica y de reglas en Streamlit, pero queda completamente fuera del catálogo de ventas web (`v_stock_rimec`).
*   **Trazabilidad Inalterable:** El RPC de confirmación de pedido hereda los datos del caso directamente desde el payload enviado por el frontend (lo que el vendedor visualizó en su pantalla), eliminando cualquier tipo de recálculo o resolución tardía en la base de datos.

---

## 2. Fase 1: Pre-Validación y Diagnóstico

Antes de la aplicación de la migración en la base de datos, se ejecutaron diagnósticos que revelaron el estado real del inventario en tránsito:

*   **Pedidos Proveedores Activos sin Evento Comercial:** **9 Pedidos Proveedores** huérfanos detectados:
    *   `PP-2026-0001` (Estado: ABIERTO, Sin Evento)
    *   `PP-2026-0002` (Estado: ABIERTO, Sin Evento)
    *   `PP-2026-0003` (Estado: ABIERTO, Sin Evento)
    *   `PP-2026-0004` (Estado: ABIERTO, Sin Evento)
    *   `PP-2026-0005` (Estado: ABIERTO, Sin Evento)
    *   `PP-2026-0006` (Estado: ABIERTO, Sin Evento)
    *   `PP-2026-0007` (Estado: ABIERTO, Sin Evento)
    *   `PP-2026-0008` (Estado: ABIERTO, Sin Evento)
    *   `PP-2026-0009` (Estado: ABIERTO, Sin Evento)
*   **SKUs Afectados en Catálogo:** **953 SKUs** que quedarán con precios y caso en `NULL` debido a la ausencia de evento asignado en estos 9 PPs.

---

## 3. Fase 2: Ajuste del RPC `confirmar_pedido_web`

Se inspeccionó y reforzó el RPC de checkout para garantizar la Ley de Trazabilidad:
*   **Extracción de Payload:** El RPC extrae `caso` y `caso_id` directamente del JSON del carrito (`v_factura->>'caso'` y `v_factura->>'caso_id'`).
*   **Inserción Directa:** Inserta estos valores de forma directa e inmutable en `factura_interna`.
*   **Sin Recálculo:** Se eliminó cualquier JOIN o subquery a `caso_precio_biblioteca` o `precio_lista` durante la confirmación de la orden, blindando el precio pactado con el cliente contra cambios posteriores en la base de datos.

---

## 4. Fase 3: Certificación y Validación Post-Migración

Tras aplicar la migración SQL dentro de una transacción única controlada, las queries de verificación arrojaron resultados de conformidad absoluta:

1.  **Validación Q1 (Desacople de Biblioteca - PASS):** **0** referencias a la tabla `caso_precio_biblioteca` dentro del código fuente DDL de la vista `public.v_stock_rimec`.
2.  **Validación Q2 (Integridad de NULLs - PASS):** El conteo final en base de datos arrojó exactamente **953 SKUs** con `caso_id IS NULL`, validando que la Opción A Estricta opera correctamente sin fallbacks.
3.  **Validación Q3 (Trazabilidad en checkout - PASS):** Confirmada la herencia de payload de carrito sin recálculos ni re-resolución en base de datos.

---

## 5. Conclusiones y Próximos Pasos Operativos

El sistema queda 100% blindado y certificado en **PASS** para producción.
*   **Acción del Negocio:** Se requiere que los usuarios del búnker asignen los eventos comerciales correspondientes a los **9 PPs huérfanos** desde Streamlit (Nexus Core) para que los 953 SKUs vuelvan a reflejar precios y casos válidos en el catálogo de rimec-web.
