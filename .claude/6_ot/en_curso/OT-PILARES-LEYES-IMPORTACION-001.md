# OT-PILARES-LEYES-IMPORTACION-001 — Leyes de Importación y Mutación de Pilares

> **Ejecutor:** Claude Code  
> **Supervisión:** Cursor (Director controla a ambos)  
> **Repositorios:** `control_central/` (Nexus) + `report/` (Next.js)  
> **Acceso requerido:** filesystem completo + Supabase (Claude tiene ambos)  
> **Prioridad:** ALTA — bloquea import Retail real con datos finales

---

## Encuadre

El Director establece **tres fuentes únicas** de nutrición de los pilares
`linea`, `referencia`, `material`, `color`, `talla_grada`:

1. **Listado de Precios** (`control_central/modules/listado_precios/`).
2. **Facturas Proformas** (`control_central/modules/proforma/`).
3. **Importación Masiva de Retail** — Excel `st+vt+RC`
   (`control_central/modules/balance_tiendas_retail/`).

Las tres deben compartir el **mismo motor de pilares** y respetar las leyes
documentadas en:

```
.cursor/rules/politicas-importacion-pilares.mdc
```

**LEER PRIMERO ese archivo** antes de tocar código. Es la fuente de verdad.

---

## Decisiones de Director (cerradas)

| Tema | Decisión |
|------|----------|
| Tabla destino Retail | `registro_st_vt_rc_reposicion` (migración 060). Report leerá de aquí. |
| Acceso de Claude | Total: report + control_central + Supabase. |
| Imagen de producto | Reconstrucción `linea-ref-mat-color.jpg`. El campo `IMAGEN` del Excel queda en columna auditoría. |
| Saneamiento retroactivo | NO. Reglas aplican solo a futuras importaciones. |
| Curva grada (materialización en BD) | **ABIERTA** — Claude debe proponer y justificar (ver §6). |

---

## Bug bloqueante a corregir como primer paso

`control_central/modules/balance_tiendas_retail/st_vt_rc_import.py:27`

```python
TABLE_RETAIL = "retail_multitienda_staging"  # ❌ tabla vieja
```

Debe quedar:

```python
TABLE_RETAIL = "registro_st_vt_rc_reposicion"  # ✅ tabla nueva (migración 060)
```

Auditar **todo el módulo** (`logic.py` también) y migrar TODA referencia a
`retail_multitienda_staging` → `registro_st_vt_rc_reposicion`. Si hay queries
de DDL/DML residuales contra la vieja, decidir:

- Si `retail_multitienda_staging` ya no se usa en ningún front → migración
  `063_drop_retail_multitienda_staging.sql` (con backup previo opcional).
- Si la usa algún otro flujo legacy → mantener pero **desconectar** del
  módulo Retail nuevo.

Documentar la decisión en evidencia.

---

## Alcance — 6 frentes

### 1. Motor compartido de pilares (`control_central/core/pilares/`)

Crear paquete Python nuevo. Estructura mínima:

```
control_central/core/pilares/
    __init__.py
    upsert.py
    herencia.py
    grada.py
    enriquecimiento.py
    tests/
        test_upsert.py
        test_enriquecimiento_no_inverso.py
        test_grada_matriz.py
        test_herencia_linea.py
```

API obligatoria (firma en §8 de la regla `.mdc`).

Garantías:

- **Idempotencia** — mismo input devuelve mismo `id`.
- **Regla no inversa** — sección 6 de la regla.
- **Transaccional por fila** — un error no aborta el lote, registra warning.
- **Devuelve `id` int para usar como FK aguas abajo**.
- **Cobertura de tests** ≥ 80 % sobre las funciones públicas.

### 2. Refactor — Listado de Precios

`control_central/modules/listado_precios/` debe usar el motor compartido en
lugar de mutar pilares directamente. Aplica:

- Protocolo de agregación jerárquica para líneas nuevas (§3.1 regla).
- Inserción ciega de material y color por código numérico (§3.2 regla).
- Matriz estática de 12 pares cuando aparezca curva (§7 regla).

Mantener idempotencia del listado (re-cargar no duplica precios).

### 3. Refactor — Proformas

`control_central/modules/proforma/` debe:

- Usar el motor compartido para upsert de pilares.
- Aplicar la **regla no inversa** de enriquecimiento (§4.2 + §6 regla).
- Tratar la proforma como **fuente canónica de descripciones** (§4.1 regla).
- Probar caso: pilar previamente "ciego" (sin descripción) recibe
  descripción de proforma → UPDATE; pilar con descripción recibe vacío →
  NO TOCAR.

### 4. Refactor — Retail (st+vt+RC)

`control_central/modules/balance_tiendas_retail/st_vt_rc_import.py`:

- **Fix tabla destino** (ver bug bloqueante arriba).
- Reemplazar `_resolve_pillar_fks` por llamadas al motor compartido.
- Mantener política **REPLACE ALL** (purga total + insert lote).
- Procesar curva `CALCE` con la matriz estática (§7 regla).
- Imagen: reconstrucción `linea-ref-mat-color.jpg` (no usar el nombre del
  Excel para el bucket). Almacenar nombre Excel en columna `imagen_nombre`
  como auditoría.

### 5. Lectura desde `report/`

`report/src/lib/retail/` debe pasar a leer **`registro_st_vt_rc_reposicion`**
(no `retail_multitienda_staging`). Ajustar:

- `staging-row.ts` — tipo + mapeo de columnas.
- `query-staging.ts` — query principal.
- `query-filtros.ts` — agregaciones por pilar.
- `build-stock-board.ts` — si depende de la representación de curva, alinear
  con la decisión §6 de esta OT.
- `pilares-rules.ts` — alinear con la nueva regla `.mdc`.

Mantener el contrato del API (`/api/retail/*`) estable si es posible. Si hay
breaking changes, documentar en evidencia y dejar warning visible.

### 6. Pregunta abierta — materialización de la curva 34(1 2 3 3 2 1)39

Claude debe **proponer + justificar + implementar** una de las tres
estrategias:

| Estrategia | Pro | Contra | Implicaciones |
|------------|-----|--------|---------------|
| **A · Expandir** | 1 fila Excel con curva → 6 filas BD (una por talla). Frontend trivial; sumas SQL directas. | Multiplica volumen ×6. Si el Excel trae 902 filas con `RIMEC stock`, resultan ~5.400 filas BD. | Columnas `talla` (int) + `cantidad` (int) por fila. Curva original se puede guardar en columna `curva_original` como auditoría. |
| **B · String + render** | Conserva semántica de bulto. Volumen 1:1. | Frontend debe explotar la curva en cada render. Sumas requieren `CROSS JOIN LATERAL unnest()` o CTE. | Columna `grada` (text) preserva `34(1 2 3 3 2 1)39`. |
| **C · Híbrido** | Reportes pivot inmediatos. Volumen 1:1. | Esquema más ancho (6 columnas `cant_34..cant_39`). Curvas no canónicas complican. | Columna `grada` (text) + 6 columnas int por talla. |

**Criterios de decisión sugeridos:**

- ¿Cuántas filas reales tiene el Excel actual? (multiplicar ×6 si A).
- ¿`report/src/lib/retail/build-stock-board.ts` ya espera curva expandida o
  curva-string? Auditar antes de elegir.
- ¿Hay reportes futuros que requieran pivot por talla? (favorece C).

Claude debe documentar la decisión en la evidencia con **mediciones reales**
y luego ejecutar el plan elegido.

---

## Entregables

| # | Archivo | Tipo |
|---|---------|------|
| 1 | `control_central/core/pilares/` (paquete completo + tests) | Nuevo |
| 2 | `control_central/migrations/063_*.sql` (si hace falta DDL en pilares) | Nuevo opcional |
| 3 | `control_central/modules/listado_precios/` | Refactor |
| 4 | `control_central/modules/proforma/` | Refactor |
| 5 | `control_central/modules/balance_tiendas_retail/st_vt_rc_import.py` | Fix + refactor |
| 6 | `control_central/modules/balance_tiendas_retail/logic.py` | Auditar legacy |
| 7 | `report/src/lib/retail/*` | Alinear lectura a `registro_st_vt_rc_reposicion` |
| 8 | `ot/PILARES-LEYES-IMPORTACION-001-EVIDENCIA.md` | Evidencia obligatoria |

---

## Reglas operativas

- **No tocar** `Sales Report` ni `registro_ventas_general_v2`.
- **No saneamiento retroactivo** sobre pilares ya cargados.
- **Tests primero** en el motor de pilares — sin tests, la OT NO se cierra.
- **Migraciones SQL** numeradas correlativas (la próxima libre es **063**).
- **Backups** antes de DROP de tabla legacy si aplica.
- **Commits atómicos** por frente (uno por sección 1-5).

---

## Aceptación

La OT se cierra cuando:

1. Tests del motor de pilares pasan (`pytest control_central/core/pilares/`).
2. Import Retail real con `VTA SM.xlsx` (hoja `st+vt+RC`) completa exitosamente
   contra `registro_st_vt_rc_reposicion`.
3. Conteos de evidencia muestran:
   - Líneas nuevas insertadas en `linea` con herencia aplicada.
   - Materiales/colores nuevos en ciego.
   - Curva expandida/preservada según decisión §6.
4. Listado de precios y proforma siguen funcionando (smoke tests).
5. `report/` muestra el catálogo Retail leyendo de la nueva tabla.
6. Regla `.cursor/rules/politicas-importacion-pilares.mdc` revisada y
   confirmada como vigente.

---

## Comandos sugeridos (al cierre)

```bash
cd C:\Users\hecto\Nexus_Core\control_central
pytest core/pilares/ -v
python scripts/verify_retail_db.py   # confirmar tabla destino correcta

cd C:\Users\hecto\Nexus_Core\report
npm run build                          # debe compilar sin errores
```

---

**Estado:** ✅ CERRADA (2026-05-20) · **Ejecutor:** Claude Code · **Commits:** `9eb2e05`, `00f50bb`, `ca8ae36`
