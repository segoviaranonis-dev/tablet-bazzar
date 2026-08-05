# RRHH — Funcionamiento actual (Report)

**Código Moria:** `2.06.00.001`  
**Estado:** ✅ Cerrado en producción (2026-06-16)  
**App:** `report/` · Next.js · Supabase PostgreSQL (`DATABASE_URL`)  
**URL:** `rimec-report.vercel.app/rrhh` · dev `:3000/rrhh`

**Aislamiento:** No usa pilares Retail (`linea`, `referencia`, …). No toca `registro_ventas_general_v2` (Sales Report blindado).

---

## Qué hace hoy

Módulo interno de **Recursos Humanos** del holding Nexus (RIMEC + tiendas Bazzar + Bazzar Web):

1. **Listado de funcionarios** (`/rrhh`) — grid por ente, filtros departamento/cargo/búsqueda, resumen vacaciones del año en curso.
2. **Gestión de vacaciones** (`/rrhh/vacaciones`) — sistema **DUAL** días + horas por funcionario y año fiscal.
3. **Registro** — rangos de fechas (días hábiles L–V) o fracciones de horas (0.5h–8h; 8h = 1 día).
4. **Historial** — líneas atómicas en `vacaciones_detalle`, eliminables con recálculo de contadores.

---

## Acceso y auth

| Rol (`rol_id`) | Rutas | APIs |
|----------------|-------|------|
| **1** (admin) | `/rrhh`, `/rrhh/vacaciones` | `/api/rrhh/*` |
| **2** (supervisor) | idem | idem |

Middleware: `report/src/middleware.ts` — sesión firmada `report_session`; **no** RLS Supabase anon en cliente.

---

## Rutas y pantallas

| Ruta | Componente | Datos |
|------|------------|-------|
| `/rrhh` | `RRHHClient.tsx` | `fetchEntes`, `fetchFuncionarios`, `fetchEstadisticas` |
| `/rrhh/vacaciones` | `VacacionesClient.tsx` | `fetchVacaciones`, `fetchEstadisticasVacaciones` |

**Modal funcionario:** `FuncionarioModalOptimizado.tsx` — lazy load `DateRangePicker` / `HourPicker`; muestra **días y horas tomadas**; sync al cambiar funcionario (fix etapa 3b).

**Historial:** `HistorialVacacionesModal.tsx` — lectura vía `GET /api/rrhh/vacaciones/historial`.

---

## APIs REST (server)

| Método | Ruta | Tablas que escribe/lee |
|--------|------|------------------------|
| POST | `/api/rrhh/vacaciones/registrar-dias` | `vacaciones`, `vacaciones_detalle` |
| POST | `/api/rrhh/vacaciones/registrar-horas` | `vacaciones`, `vacaciones_detalle` |
| GET | `/api/rrhh/vacaciones/historial` | `vacaciones_detalle` (+ join `vacaciones`) |
| DELETE | `/api/rrhh/vacaciones/eliminar-detalle` | `vacaciones_detalle`, actualiza `vacaciones` |

Queries en `report/src/app/rrhh/lib/rrhh-queries.ts` y `report/src/app/rrhh/vacaciones/lib/queries.ts` — pool directo, sin PostgREST.

---

## Tablas en PostgreSQL (las que usa RRHH)

### Diagrama

```
entes (1) ──< funcionarios (N)
                    │
                    └──< vacaciones (1 por funcionario × año)
                              │
                              └──< vacaciones_detalle (historial)
```

### `entes`

Entidades del holding (empresa / tienda).

| Columna clave | Uso en app |
|---------------|------------|
| `id_ente` PK | FK `funcionarios.ente_id` |
| `codigo` | Orden y filtros (1=RIMEC …) |
| `nombre`, `tipo` | UI listados |

### `funcionarios`

Maestro de empleados.

| Columna clave | Uso en app |
|---------------|------------|
| `id_funcionario` PK | FK `vacaciones.funcionario_id` |
| `ente_id` | JOIN `entes` |
| `nombre_completo`, `ci` | Búsqueda e identificación |
| `departamento`, `cargo` | Filtros |
| `fecha_ingreso_ips`, `antiguedad_anios` | Cálculo días legales |
| `jerarquia_organizacional` | Árbol org. (script `agregar_jerarquia_rrhh.sql`) |

### `vacaciones`

**Saldo anual** por funcionario (una fila por `funcionario_id` + `anio`).

| Columna | Tipo / notas |
|---------|----------------|
| `tipo_vacacion` | `'DIAS'` \| `'HORAS'` \| `'MIXTO'` — producción: **MIXTO** para todos |
| `dias_totales`, `dias_tomados` | Enteros; ley PY 12/18/30 vía `calcular_dias_legales()` |
| `dias_pendientes` | **GENERATED** `dias_totales - dias_tomados` |
| `horas_totales`, `horas_tomadas` | NUMERIC; banco horas gerentes |
| `horas_pendientes` | **GENERATED** `horas_totales - horas_tomadas` |
| `activo`, `notas` | Soft delete / observaciones |

### `vacaciones_detalle`

**Histórico atómico** de cada toma (días u horas).

| Columna | Uso |
|---------|-----|
| `vacacion_id` | FK → `vacaciones.id_vacacion` ON DELETE CASCADE |
| `fecha_inicio`, `fecha_fin` | Período registrado |
| `dias_tomados`, `horas_tomadas` | Cantidad de esa línea |
| `estado` | `pendiente` \| `aprobado` \| `rechazado` \| `cancelado` (workflow reservado) |
| `aprobado_por` | FK opcional → `funcionarios` |

Al registrar/eliminar, las APIs actualizan **sumas** en `vacaciones` en la misma transacción (CTE).

### `v_vacaciones_funcionarios` (vista)

Vista consolidada definida en migración **080** (funcionario + ente + % uso).  
**La app no la consulta hoy** — usa JOINs explícitos en TypeScript (misma información).

### Funciones SQL auxiliares (migración 080)

| Función | Propósito |
|---------|-----------|
| `calcular_dias_legales(antiguedad_anios)` | 12 / 18 / 30 días según antigüedad |
| `inicializar_vacaciones_anio(anio)` | Alta filas `vacaciones` para todos los activos |

### Tablas que **no** usa RRHH

- Pilares Retail: `linea`, `referencia`, `material`, `color`, `talla`
- Sales Report: `registro_ventas_general_v2` y maestras de ventas históricas
- Auth Report: cookie de sesión local; credenciales en env, no tabla RRHH dedicada

---

## Migraciones y scripts SQL (repo)

| Archivo | Contenido |
|---------|-----------|
| `report/RRHH_COMPLETO.sql` | Bootstrap entes + funcionarios |
| `report/rrhh_schema.sql` | Esquema base |
| `report/rrhh_vacaciones_schema.sql` | Vacaciones (legacy previo 080) |
| `report/migrations/080_vacaciones_sistema_dual_reset.sql` | **Canónico** dual días/horas + vista |
| `report/migrations/090_indices_performance_rrhh.sql` | 11 índices performance |
| `report/agregar_jerarquia_rrhh.sql` | Columna `jerarquia_organizacional` |

Import inicial: `report/importar_rrhh_rimec.py` (48 funcionarios RIMEC).

---

## Reglas de negocio vigentes

- **Días:** solo hábiles L–V; validación contra `dias_pendientes`.
- **Horas:** 0.5h–8h por registro; 8h incrementan también contador de días en API horas.
- **Gerentes:** consumen **horas**; UI debe mostrar horas tomadas aunque `dias_tomados = 0` (fix 3b).
- **Año:** filtro default = año calendario actual en queries SSR.

---

## Fix etapa 3b (modal vacaciones) — cerrado 2026-06-16

**Problema:** API persistía horas pero modal mostraba «0 Tomados»; `useEffect` pisaba estado tras refresh.

**Solución:** sync solo al abrir otro funcionario; updater funcional en `handleSuccess`; resumen muestra horas; evitar `router.refresh` en hot path.

Archivos: `FuncionarioModalOptimizado.tsx`, `VacacionesClient.tsx`.

Doc etapa: [ETAPA_RRHH_INVESTIGACION_VACACIONES_MODAL.md](../../4_etapas/ETAPA_RRHH_INVESTIGACION_VACACIONES_MODAL.md)

---

## Fuera de scope (no implementado)

- Workflow aprobación jefe → RRHH
- Notificaciones email/SMS
- PDF por funcionario
- Integración nómina
- Tiendas Bazzar: funcionarios fuera del lote RIMEC inicial (solo esquema listo)

---

## Referencias

- Índice módulo: [INDICE.md](./INDICE.md)
- Esquema detallado tablas base: [diseño_bd.md](./diseño_bd.md)
- Cierre etapa: [ETAPA_RRHH_CERRADA.md](../../4_etapas/ETAPA_RRHH_CERRADA.md)
- Error deploy histórico: `5_errores/detalle/4.02.01.001_rrhh-404-vercel.md`

**Shibboleth:** 7 años
