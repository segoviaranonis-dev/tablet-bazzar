# Plan de Evaluación y Auditoría del Proyecto: Unificación de Usuarios y RBAC

Este documento contiene las instrucciones precisas para que **Claude / Cursor** ejecuten una auditoría de código e infraestructura sobre la migración a Control de Acceso Basado en Roles (RBAC) y la unificación de identidades en `usuario_v2`.

Al finalizar la ejecución de este plan, el agente de IA debe generar un **Reporte de Cumplimiento (Compliance Report)** detallando sus hallazgos en cada sección.

---

## Instrucciones para el Agente Auditor (Claude / Cursor)

Por favor, ejecuta las siguientes tareas de inspección de código y base de datos en el espacio de trabajo local. Reporta el estado de cada punto como **CUMPLE**, **NO CUMPLE** o **ADVERTENCIA**, junto con la evidencia (código, consultas o salida de consola).

---

### Paso 1: Verificación de Esquema y Gobernanza en Supabase (Base de Datos)
El agente debe inspeccionar el estado actual de la base de datos de Supabase ejecutando consultas directas o analizando los esquemas activos.

#### Lista de Verificación (Checklist):
1. [ ] **Tablas de Seguridad**: Confirmar que las tablas `public.maestro_rol_acceso` y `public.modulo_sistema` existen en el esquema público con sus roles y columnas correctas.
2. [ ] **Gobernanza de Ventas (Restricción CHECK)**: Verificar que la tabla `public.pedido_venta_rimec` tiene la restricción check `chk_vendedor_rol` apuntando a la función `fn_es_usuario_vendedor_o_admin`.
3. [ ] **Gobernanza de Facturas (Restricción CHECK)**: Verificar que la tabla `public.factura_interna` tiene la restricción check `chk_vendedor_rol` apuntando a la función `fn_es_usuario_vendedor_o_admin`.
4. [ ] **Preservación Histórica**: Confirmar que la tabla `vendedor_v2_deprecated` existe y que las FKs históricas de `registro_ventas_general_v2` se mantienen estables.

---

### Paso 2: Auditoría del Backend (Nexus Core - Python/Streamlit)
El agente debe realizar búsquedas de texto (grep / regex) en el directorio `control_central` para verificar que no haya "fugas de legado" (referencias activas a la antigua tabla `vendedor_v2`).

#### Lista de Verificación (Checklist):
1. [ ] **Código Limpio de Legado**: Comprobar que ningún archivo `.py` en la carpeta `control_central/modules/` realice operaciones de lectura/escritura (`SELECT`, `INSERT`, `UPDATE`, `JOIN`) contra la tabla `vendedor_v2` (exceptuando comentarios o el mapeo específico de imports históricos en `import_data/ui.py`).
2. [ ] **Selectores Comerciales**: Verificar que en `control_central/modules/pedido_proveedor/logic.py` y `control_central/modules/intencion_compra/logic.py`, las funciones que listan vendedores (ej. `get_vendedores_pp()`) obtengan sus datos desde `usuario_v2` filtrando por roles autorizados en `maestro_rol_acceso` (`rol_id` 1 o 3).

---

### Paso 3: Auditoría del Frontend (rimec-web - Next.js)
El agente debe inspeccionar el directorio `rimec-web` para validar la lógica del catálogo mayorista y la sesión del usuario.

#### Lista de Verificación (Checklist):
1. [ ] **Middleware de Acceso**: Inspeccionar `rimec-web/middleware.ts`. Confirmar que lee la sesión `rimec_session` descodificando el JWT con la clave `SESSION_SECRET` y que redirige a `/acceso-denegado` si el atributo `role` no es `'VENDEDOR'` ni `'ADMIN'`.
2. [ ] **Autenticación y Roles**: Analizar `rimec-web/lib/auth/validateUsuario.ts` para constatar que el query a la base de datos realiza el join `maestro_rol_acceso(nombre_rol)` para inyectar dinámicamente la categoría de la sesión.
3. [ ] **Diálogo de Activación**: Analizar `rimec-web/components/DialogoActivacion.tsx`. Verificar que se eliminó el consumo y la inserción (`insert`) en `vendedor_v2` y que en su lugar se asigna el objeto `vendedor` mapeando las propiedades `id_usuario` y `name` directamente de la sesión `/api/auth/me`.

---

### Paso 4: Ejecución de Pruebas de Integración
El agente debe ejecutar de forma local la suite de validación y documentar la respuesta del servidor Supabase.

#### Tareas a ejecutar:
1. **Compilación de la App**: Ejecutar en `rimec-web`:
   ```bash
   npm run build
   ```
   *El agente debe verificar que compile exitosamente sin errores de compilación ni TypeScript.*
   
2. **Prueba de Inserción Restringida**: Ejecutar en el directorio `rimec-web`:
   ```bash
   node scripts/test_vendedor_check.js
   ```
   *El agente debe verificar y capturar la salida de consola, comprobando:*
   - [ ] Que el intento con un usuario `OPERARIO` falló debido al check `chk_vendedor_rol`.
   - [ ] Que el intento con un usuario `VENDEDOR` se insertó correctamente.
   - [ ] Que todos los registros temporales creados fueron eliminados en la fase de limpieza.

---

## Estructura del Reporte Esperado de Claude/Cursor
El reporte final generado por el agente de IA debe tener el siguiente formato markdown:

```markdown
# Reporte de Auditoría y Cumplimiento: Gobernanza, Unificación y RBAC

## 1. Estado General de Cumplimiento
[🟢 CUMPLE AL 100% / 🟡 CUMPLE CON ADVERTENCIAS / 🔴 NO CUMPLE]

## 2. Resultados Detallados de Auditoría
- **Fase de Base de Datos**: [Detalle de tablas y constraints check verificadas + código SQL de prueba]
- **Fase de Backend**: [Verificación de código Python limpio de vendedor_v2 + get_vendedores]
- **Fase de Frontend**: [Verificación de Middleware, validateUsuario y DialogoActivacion]

## 3. Evidencia de Ejecución de Pruebas
- **Prueba de TypeScript / Build**: [Log de compilación]
- **Prueba de Restricciones en Base de Datos**: [Consola de test_vendedor_check.js]

## 4. Recomendaciones u Observaciones de Mejora
[Si las hubiera]
```
