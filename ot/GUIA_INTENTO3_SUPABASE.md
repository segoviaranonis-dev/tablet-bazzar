# Guía Intento 3 — Supabase + purga (Director Héctor)

**Intento 2:** Fracaso estructural — columnas `descuento_*_aplicado` faltaban / función 053b con nombres incorrectos (`d1_aplicado`).  
**Intento 3:** Limpieza local → migraciones → listado nuevo → Paso 3.

---

## Paso 1 — Limpieza segura (local)

Con Streamlit **cerrado**:

```powershell
cd C:\Users\hecto\Nexus_Core\control_central
.\venv\Scripts\python.exe scripts\purgar_solo_eventos_precio.py
```

| Se borra | Se conserva |
|----------|----------------|
| `precio_evento`, `precio_evento_caso`, `precio_lista` | `linea`, `referencia`, `material`, `color` |
| `precio_evento_linea_excepcion`, `precio_auditoria` | `biblioteca_precio`, plantillas, `biblioteca_caso_linea` |
| `precio_lista_staging` | Pilares y catálogos maestros |

Verificación esperada: `Listados restantes: 0`, contadores de línea/referencia **sin cambio**.

---

## Paso 2 — SQL Editor Supabase (orden estricto)

Ejecutá **un archivo completo por vez**, en este orden. Rutas en repo:

| Orden | Archivo | Qué hace |
|-------|---------|----------|
| **1** | `control_central/migrations/052_precio_lista_indice_triplete.sql` | Índices en `precio_lista` |
| **2** | `control_central/migrations/053_calcular_precio_lista_evento_sql.sql` | Solo tabla `precio_lista_staging` + índice |
| **3** | `control_central/migrations/053b_fix_columnas_aplicado.sql` | **Columnas `*_aplicado`** + función definitiva (3 cols: total, duracion_ms, error) |

**Si 053 falla con `42P13 cannot change return type`:** es normal si ya existía la función de un intento previo. **Ignorá 053** si **053b** terminó en Success. La función válida es solo la de 053b.
| **4** | `control_central/migrations/054_resolver_pilares_sql.sql` | `resolver_pilares_sql` (opcional motor rápido) |

**Recomendado si nunca aplicaste contenedor por evento:**

| 0 (opcional) | `control_central/migrations/043_contenedor_lineas_evento.sql` | `evento_id` en excepciones + UNIQUE por listado |

### Comprobar después del paso 3

Archivo listo: `control_central/migrations/VERIFICAR_INTENTO3.sql`

Debe listar columnas `descuento_*_aplicado` y firma función `bigint, numeric, text`.

**Post-049:** vaciá staging huérfano si no corriste purga Python:

```sql
TRUNCATE precio_lista_staging RESTART IDENTITY;
```

---

## Paso 3 — App

```powershell
.\streamlit_run.ps1
```

Motor → listado **nuevo** → Paso 3. Terminal: sin error `d1_aplicado`; SQL debe insertar **N > 0** precios.

---

## Archivos en disco (Cursor, 2026-05-18)

- `053b` corregido (nombres columnas + `ALTER TABLE` idempotente)
- `purgar_solo_eventos_precio` incluye `TRUNCATE precio_lista_staging`
- Registro: `ot/REGISTRO_INTENTOS_MOTOR.md`
- Cola: `ot/COLA.md` → **INTENTO 3**

*Sin commit Git hasta cierre de etapa.*
