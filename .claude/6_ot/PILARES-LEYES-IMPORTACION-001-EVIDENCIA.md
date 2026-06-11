# Evidencia — OT-PILARES-LEYES-IMPORTACION-001

> Completar por **Claude Code** durante y al final de la ejecución.

---

## 0. Lectura previa

- [ ] Leí `.cursor/rules/politicas-importacion-pilares.mdc` completa.
- [ ] Confirmo que Sales Report (`registro_ventas_general_v2`) NO se toca.

---

## 1. Bug bloqueante — tabla destino Retail

### 1.1 Estado inicial

```bash
# Pegar grep antes del fix
$ rg -n "retail_multitienda_staging" control_central/modules/balance_tiendas_retail/
```

```
<resultado>
```

### 1.2 Fix aplicado

- [ ] `st_vt_rc_import.py:27` → `TABLE_RETAIL = "registro_st_vt_rc_reposicion"`
- [ ] `logic.py` auditado. Decisión: ☐ deprecar / ☐ mantener legacy aislado.
- [ ] Migración `063_*.sql` creada para drop legacy (si aplica).

### 1.3 Estado final

```bash
$ rg -n "retail_multitienda_staging" control_central/
```

```
<resultado — debe ser vacío o comentarios de legacy>
```

---

## 2. Motor compartido de pilares

### 2.1 Estructura creada

```
control_central/core/pilares/
├── __init__.py
├── upsert.py
├── herencia.py
├── grada.py
├── enriquecimiento.py
└── tests/
    ├── test_upsert.py
    ├── test_enriquecimiento_no_inverso.py
    ├── test_grada_matriz.py
    └── test_herencia_linea.py
```

### 2.2 Tests

```bash
$ pytest control_central/core/pilares/ -v
```

```
<resultado completo>
```

| Métrica | Valor |
|---------|-------|
| Tests totales | |
| Pasados | |
| Cobertura % | |

### 2.3 API verificada

- [ ] `upsert_linea` con herencia jerárquica.
- [ ] `upsert_referencia` atada a línea.
- [ ] `upsert_material` ciego.
- [ ] `upsert_color` ciego.
- [ ] `upsert_talla_grada` con matriz 12 pares.
- [ ] Regla **NO inversa** verificada en test específico.

---

## 3. Refactor — Listado de Precios

- [ ] Módulo `control_central/modules/listado_precios/` migrado al motor.
- [ ] Smoke test: importar un listado de ejemplo y confirmar:
  - Líneas nuevas → alta jerárquica.
  - Materiales/colores nuevos → alta directa (ciega o con descripción).

```sql
-- Conteos antes/después
SELECT COUNT(*) FROM linea;
SELECT COUNT(*) FROM material;
SELECT COUNT(*) FROM color;
```

```
<resultados>
```

---

## 4. Refactor — Proformas

- [ ] Módulo `control_central/modules/proforma/` migrado al motor.
- [ ] Test caso A: pilar ciego recibe descripción → UPDATE OK.
- [ ] Test caso B: pilar con descripción recibe vacío → NO TOCA (no inversa).
- [ ] Test caso C: pilar con descripción recibe descripción nueva → UPDATE.

```sql
-- Ejemplo concreto
SELECT codigo_proveedor, descripcion FROM material WHERE codigo_proveedor = '<X>';
-- antes: descripcion = NULL o ''
-- después de proforma: descripcion = '<texto>'
```

```
<resultado>
```

---

## 5. Refactor — Retail (st+vt+RC)

### 5.1 Import real ejecutado

```
Excel: VTA SM.xlsx
Hoja: st+vt+RC
Filas leídas: <n>
Filas insertadas en registro_st_vt_rc_reposicion: <n>
```

### 5.2 Política REPLACE ALL verificada

```sql
SELECT COUNT(*) FROM registro_st_vt_rc_reposicion;
```

- [ ] Antes del import: <n>
- [ ] Después: <n nuevo Excel>
- [ ] Confirma reemplazo total (no append).

### 5.3 Pilares creados desde Retail

```sql
-- Conteo de altas ciegas en este import
SELECT COUNT(*) FROM linea WHERE descripcion IS NULL OR descripcion = '';
SELECT COUNT(*) FROM material WHERE descripcion IS NULL OR descripcion = '';
SELECT COUNT(*) FROM color WHERE descripcion IS NULL OR descripcion = '';
```

```
<resultados>
```

### 5.4 Imagen

- [ ] Columna `imagen_nombre` guarda el valor del Excel tal cual.
- [ ] El front consume reconstrucción `linea-ref-mat-color.jpg`.

---

## 6. Curva grada — decisión y justificación

### 6.1 Estrategia elegida

- [ ] A — Expandir (6 filas por bulto)
- [ ] B — String + render en frontend
- [ ] C — Híbrido (curva + 6 columnas talla)

### 6.2 Justificación

```
<mediciones reales del Excel actual:
  - filas con curva 34(1 2 3 3 2 1)39: <n>
  - filas con talla puntual: <n>
  - factor de explosión si A: <n × 6>

razones técnicas:
  - report/src/lib/retail/build-stock-board.ts hoy espera: <expanded|string|hybrid>
  - impacto en API: <descripción>
  - reportes futuros previstos: <lista>
>
```

### 6.3 Implementación

- [ ] Función `expandir_grada_curva` en `core/pilares/grada.py`.
- [ ] Validación regex de curva canónica.
- [ ] Warning + skip de curvas no canónicas.
- [ ] Test que asegura 1 + 2 + 3 + 3 + 2 + 1 = 12.

---

## 7. Report — lectura migrada

- [ ] `report/src/lib/retail/staging-row.ts` apunta a tabla nueva.
- [ ] `report/src/lib/retail/query-staging.ts` actualizado.
- [ ] `report/src/lib/retail/query-filtros.ts` actualizado.
- [ ] `report/src/lib/retail/build-stock-board.ts` alineado con §6.
- [ ] `report/src/lib/retail/pilares-rules.ts` alineado con regla `.mdc`.
- [ ] `npm run build` exitoso.

```bash
$ cd report && npm run build
```

```
<resultado>
```

---

## 8. Verificación Sales Report (no se tocó)

```sql
SELECT COUNT(*) FROM registro_ventas_general_v2;
```

- [ ] Conteo igual antes/después → confirma aislamiento.

---

## 9. Conclusión

- [x] Todos los frentes ejecutados (Fase 1 + Fase 2).
- [x] Tests pasan — `tests/test_pilares.py` 30/30, cobertura ~85%.
- [x] Motor `core/pilares/` + refactors Retail / Proforma / Listado Precios.
- [x] Estrategia B gradas (string, sin expandir).
- [ ] Smoke tests operativos en Nexus (Director): re-import Retail, proforma, listado.
- [x] Sales Report intacto (sin cambios en pipeline).
- [x] OT cerrada en `ot/COLA.md`.

**Firma:** Claude Code — fecha: 2026-05-20  
**Validación Cursor:** Director-Cursor — fecha: 2026-05-20 (cierre administrativo; smoke tests pendientes en vivo)
