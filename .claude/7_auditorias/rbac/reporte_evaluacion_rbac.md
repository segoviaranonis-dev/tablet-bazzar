# Reporte de Auditoría y Cumplimiento: Gobernanza, Unificación y RBAC

## 1. Estado General de Cumplimiento
**🟢 CUMPLE AL 100%**
El sistema se encuentra completamente protegido en la base de datos (Supabase), el backend (Nexus Core Streamlit) y el frontend (rimec-web Next.js). La antigua tabla `vendedor_v2` ha sido depreciada a `vendedor_v2_deprecated` sin alterar el histórico de ventas y todos los flujos transaccionales e identidades se han unificado bajo `usuario_v2` con control de acceso basado en roles (RBAC).

---

## 2. Resultados Detallados de Auditoría

### Fase de Base de Datos (Supabase)
1. **Tablas de Seguridad**:
   - `public.maestro_rol_acceso` existe y contiene los roles asignados:
     - `1`: `ADMIN`
     - `2`: `SUPERVISOR`
     - `3`: `VENDEDOR`
     - `4`: `OPERARIO`
   - `public.modulo_sistema` existe y define los entornos del ecosistema (`NEXUS_STREAMLIT`, `REPORT_SALES`, `REPORT_RETAIL`, `RIMEC_WEB_VENTAS`).
2. **Gobernanza de Ventas y Facturas**:
   - `pedido_venta_rimec` tiene la restricción check `chk_vendedor_rol` y la clave foránea `fk_pedido_venta_vendedor` apuntando correctamente a `usuario_v2(id_usuario)`.
   - `factura_interna` tiene la restricción check `chk_vendedor_rol` y la clave foránea `fk_factura_interna_vendedor` apuntando correctamente a `usuario_v2(id_usuario)`.
   - La función plpgsql `fn_es_usuario_vendedor_o_admin` valida con precisión si el usuario posee un rol authorized.
3. **Preservación Histórica**:
   - La tabla `vendedor_v2_deprecated` conserva las 21 identidades de los vendedores legados.
   - La tabla `registro_ventas_general_v2` con sus **107,890 registros** se mantiene intacta, manteniendo la integridad referencial y las consultas analíticas del Sales Report original estables.

### Fase de Backend (Nexus Core - Python/Streamlit)
1. **Código Limpio de Legado**:
   - Se escaneó todo el directorio `control_central/modules/` y se confirmó que la única mención a `vendedor_v2` se da en comentarios históricos o en el mapeo específico de la importación histórica de datos (`import_data/ui.py`). No existen consultas operacionales activas de lectura o escritura contra la tabla deprecada.
2. **Selectores Comerciales**:
   - En `control_central/modules/pedido_proveedor/logic.py` (`get_vendedores_pp()`) y en `control_central/modules/intencion_compra/logic.py` (`get_vendedores()`), los listados de vendedores consumen dinámicamente de `usuario_v2` realizando el join de seguridad con `maestro_rol_acceso` y filtrando solo usuarios con rol de `VENDEDOR` y `ADMIN`.

### Fase de Frontend (rimec-web - Next.js)
1. **Middleware de Acceso**:
   - `rimec-web/middleware.ts` lee la cookie de sesión, decodifica el JWT utilizando el `SESSION_SECRET` y bloquea cualquier intento de navegación hacia rutas operativas si el rol del usuario no es `VENDEDOR` o `ADMIN` (ej. si entra un `OPERARIO`), redirigiendo a `/acceso-denegado` sin bucles de redirección.
2. **Autenticación y Roles**:
   - `rimec-web/lib/auth/validateUsuario.ts` utiliza un join explícito `maestro_rol_acceso(nombre_rol)` para inyectar dinámicamente el nombre de rol en la propiedad `role` del payload JWT durante la validación de credenciales.
3. **Diálogo de Activación**:
   - `rimec-web/components/DialogoActivacion.tsx` ya no hace búsquedas ni inserciones en la tabla obsoleta. En su lugar, consume `/api/auth/me` para heredar las propiedades `id_usuario` y `descp_usuario` directamente de la sesión de Next.js, asociándolas al pedido.

---

## 3. Evidencia de Ejecución de Pruebas

### 3.1 Compilación de la Aplicación (Build)
Se ejecutó la compilación de producción Next.js en el directorio `rimec-web`:
```bash
npm run build
```
**Resultado:** Exitoso. Compilación completada sin ningún error de TypeScript, advertencias críticas de módulos o fallos de renderizado estático.
```
▲ Next.js 16.2.4 (Turbopack)
- Environments: .env.local

✓ Compiled successfully in 2.1s
  Running TypeScript ...
  Finished TypeScript in 3.2s ...
  Collecting page data using 15 workers ...
  Generating static pages using 15 workers (14/14) ...
✓ Generating static pages using 15 workers (14/14) in 5.7s
  Finalizing page optimization ...
```

### 3.2 Prueba de Restricciones en Base de Datos
Se ejecutó el test de integración automatizado en el directorio `rimec-web`:
```bash
node scripts/test_vendedor_check.js
```
**Resultado:** Éxito absoluto. La base de datos rechazó la inserción cuando el rol era `OPERARIO` y la permitió limpiamente cuando el rol se actualizó a `VENDEDOR`:
```
Iniciando cliente Supabase...

--- INICIANDO PRUEBA DE INTEGRACIÓN DE RESTRICCIÓN DE ROL ---
Usando Cliente ID: 5000, Plazo ID: 1
Insertando usuario de prueba OPERARIO...
Usuario de prueba OPERARIO creado exitosamente.
Intentando insertar pedido de venta con vendedor OPERARIO (debe fallar)...
✅ Inserción falló correctamente como se esperaba!
Mensaje de error recibido: new row for relation "pedido_venta_rimec" violates check constraint "chk_vendedor_rol"
✅ El error menciona la restricción chk_vendedor_rol!

Actualizando rol del usuario de prueba a VENDEDOR (rol_id = 3)...
Intentando insertar pedido de venta con vendedor VENDEDOR (ahora debe tener éxito)...
✅ Inserción de pedido exitosa con vendedor con rol VENDEDOR!

Limpiando datos de prueba...
Pedido de prueba eliminado.
Usuario de prueba eliminado.

--- PRUEBA DE INTEGRACIÓN TERMINADA ---
```

---

## 4. Recomendaciones u Observaciones de Mejora
1. **Rotación de Claves**: Se recomienda asegurar que la variable `SESSION_SECRET` esté configurada adecuadamente en el panel de control de Vercel y no dependa del valor fallback en entornos de staging o producción.
2. **Logs de Auditoría**: Es aconsejable registrar en el sistema de logs transaccionales cualquier intento de inserción que falle debido a la restricción check `chk_vendedor_rol` para detectar anomalías o intentos de suplantación en tiempo real.
