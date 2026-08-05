# Copiar casos desde biblioteca anterior — 2.3.1.7.2.1.1

**Subcuenta:** **2.3.1.7.2.1.1** · **Padre:** [2.3.1.7.2.1 Memoria](./IMPORTACION_PRECIOS.md#paso-1-memoria) · **Corazón 2**  
**CHUSAR:** [CHUSAR_COPIAR_CASOS_BIBLIOTECA.md](./CHUSAR_COPIAR_CASOS_BIBLIOTECA.md)  
**Report UI:** `/proceso-importacion/motor-precios/importacion-precios/nuevo/memoria?evento_id=`  
**Streamlit:** `_paso_biblioteca_seleccion` · `_paso_1_memoria` · `aplicar_biblioteca_a_evento`  
**Actualizado:** 2026-06-19

---

## Qué resuelve

Tras **Paso 0** (`precio_evento` creado, sin casos), el operador debe **copiar la matriz comercial** desde una **biblioteca anterior** (histórico `biblioteca_precio`) al listado activo. Sin este paso el evento queda con `precio_evento_caso` vacío y `biblioteca_precio_id` NULL — error operativo grave.

**Cardinalidad:** la misma biblioteca puede alimentar **varios** listados (1:N); cada listado referencia **una** biblioteca origen — [CHUSAR_MAPA §3.1](../motor_precios/CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md).

**Botón canónico (Report):** «Copiar casos de biblioteca anterior» (alias operativo de «Aplicar al listado»).

---

## Origen Streamlit (paridad)

| Momento | UI | Acción |
|---------|-----|--------|
| Tras Paso 0 | `bib_select` · `render_seleccion_biblioteca_post_carga` | Elegir biblioteca · aplicar al evento |
| Paso 1 Memoria | `_paso_1_memoria` | Origen = último evento **cerrado** **o** biblioteca · «Usar como plantilla» |

**Motor Python:**

| Función | Archivo | Efecto |
|---------|---------|--------|
| `aplicar_biblioteca_a_evento` | `biblioteca_maestro.py` | Copia casos + líneas BCL → matriz evento · setea FK |
| `vincular_biblioteca_a_evento` | idem | `UPDATE precio_evento SET biblioteca_precio_id` |
| `persistir_caso_matriz_evento` | `logic.py` | 1 caso → `precio_evento_caso` + `precio_evento_linea_excepcion` |
| `vaciar_matriz_evento` | `logic.py` | Limpia matriz previa si `reemplazar_matriz=true` |
| `duplicar_biblioteca` | `biblioteca_maestro.py` | **No** es esta función — clona maestro `biblioteca_precio` entero (Corazón 1) |

---

## Mapeo tablas BD (obligatorio)

### Lectura (origen)

| Tabla | Columnas / join | Rol |
|-------|-----------------|-----|
| `biblioteca_precio` | `id`, `nombre`, `proveedor_id`, `activo` | Maestro biblioteca elegida |
| `caso_precio_biblioteca` | parámetros caso + `marcas`, `lineas`, `regla_redondeo` | Casos comerciales |
| `biblioteca_caso_linea` | `biblioteca_id`, `caso_biblioteca_id`, `linea_id` | Alcance por línea (BCL) |
| `linea` | `id`, `codigo_proveedor`, `proveedor_id` | Resolución código → FK |

### Escritura (destino)

| Tabla | Columnas | Rol |
|-------|----------|-----|
| `precio_evento` | `biblioteca_precio_id` | FK trazabilidad listado ← biblioteca origen |
| `precio_evento_caso` | `evento_id`, `nombre_caso`, `dolar_politica`, `factor_conversion`, descuentos, `marcas`, `regla_redondeo` | Casos del listado |
| `precio_evento_linea_excepcion` | `caso_id`, `linea_id`, `evento_id` | Contenedor líneas por caso |

### No tocar en este paso

| Tabla | Motivo |
|-------|--------|
| `precio_lista` | SKUs se calculan en Preview/Paso 3+ |
| `registro_ventas_general_v2` | Sales Report blindado |

---

## Flujo Report (plan implementación)

```
Paso 0 OK (evento_id)
    → Memoria (2.3.1.7.2.1)
        → GET bibliotecas proveedor (listBibliotecas)
        → GET evento + matriz actual
        → [Botón] Copiar casos de biblioteca anterior
            → POST aplicar-biblioteca { biblioteca_id, reemplazar_matriz: true }
            → aplicarBibliotecaAEvento (TS)
        → Matriz visible (precio_evento_caso > 0)
    → Paso 2 Casos
```

---

## API Report

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| GET | `/api/motor-precios/eventos/[id]` | — | `evento` + `biblioteca` + `matriz.casos` |
| GET | `/api/motor-precios/biblioteca?proveedor_id=` | — | `bibliotecas[]` · `canonica` |
| POST | `/api/motor-precios/eventos/[id]/aplicar-biblioteca` | `{ biblioteca_id, reemplazar_matriz? }` | `{ ok, n_casos, biblioteca_id, evento }` |

**Lib TS:** `report/src/lib/motor-precios/evento-biblioteca.ts` · `evento-matriz.ts` · `evento-queries.ts`

---

## UI Report (criterios)

| Elemento | Comportamiento |
|----------|----------------|
| Selector | Todas las `biblioteca_precio` activas del `proveedor_id` del evento (incl. CP PRUEBA, Biblioteca 1905, etc.) |
| Badge canónica | Resaltar biblioteca 1905 si existe |
| Botón primario | «Copiar casos de biblioteca anterior» |
| Confirmación | Si `matriz.casos_count > 0` y `reemplazar_matriz` → aviso reemplazo |
| Bloqueo Paso 2 | Hasta `matriz.casos_count > 0` |
| Toast éxito | `N casos copiados · biblioteca #ID · FK biblioteca_precio_id` |

---

## Reglas de negocio

1. **Mismo proveedor:** biblioteca origen debe tener `proveedor_id` = evento.
2. **Exclusividad BCL:** si biblioteca origen tiene línea en dos casos → rechazar (validar antes de copiar).
3. **Evento cerrado:** no copiar si `precio_evento.estado = 'cerrado'`.
4. **SKUs existentes:** si `precio_lista` tiene filas → `vaciar_matriz_evento` falla — no reemplazar matriz sin OT.
5. **Idempotencia operativa:** re-aplicar misma biblioteca con `reemplazar_matriz=true` = matriz limpia + copia de nuevo.

---

## Estado implementación

| Pieza | Estado |
|-------|--------|
| Doc índice + CHUSAR | ✅ 2026-06-19 |
| API `aplicar-biblioteca` | ✅ |
| UI botón + selector Memoria | 🟡 renombrar/afinar UX |
| Confirmación reemplazo | 📋 |
| Paridad plantilla evento cerrado (Memoria Streamlit) | 📋 fase 2 |

---

## Referencias

- [IMPORTACION_PRECIOS.md](./IMPORTACION_PRECIOS.md)
- [motor_precios/HISTORIAL_BIBLIOTECAS.md](../motor_precios/HISTORIAL_BIBLIOTECAS.md)
- `control_central/modules/rimec_engine/biblioteca_maestro.py` L1266–1297

---

**Shibboleth:** Chayanne el mejor
