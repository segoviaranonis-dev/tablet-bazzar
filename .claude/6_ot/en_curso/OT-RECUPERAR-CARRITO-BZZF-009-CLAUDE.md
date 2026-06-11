# OT-DIAGNOSTICO-CADENA-PRECIOS-009 — Encontrar dónde se rompe el vínculo de precio

**Prioridad:** URGENTE — bloqueo de ventas en producción  
**Director:** Héctor Segovia  
**Ejecutor:** Claude Code  
**Apertura:** 2026-05-22

---

## Contexto que cambia el diagnóstico

El Director **confirmó** que Alfredo carga todos los precios y todos los casos en `precio_lista`. **No falta data.** Entonces el problema NO es "PPs sin evento de precio" — el problema es que **algo en la cadena de JOINs de `v_stock_rimec` no está matcheando**.

Cobertura actual (OT-004): **953 SKUs con stock, 0 con `lpn`**. No es coincidencia: hay una **regla rota** en el vínculo, no un dato faltante.

---

## La cadena que debe cumplirse (vista actual MIG-070/071)

Para que un SKU muestre precio en el catálogo, **TODO** esto debe ser verdadero simultáneamente:

| # | Tabla | Condición |
|---|-------|-----------|
| 1 | `pedido_proveedor` | `estado IN ('ABIERTO','ENVIADO')` |
| 2 | `intencion_compra_pedido` | `pedido_proveedor_id = pp.id` y `precio_evento_id IS NOT NULL` |
| 3 | `intencion_compra` | `id_marca = ppd.id_marca` (o `ppd.id_marca IS NULL`) |
| 4 | `linea` | `codigo_proveedor = ppd.linea` y `proveedor_id = pp.proveedor_importacion_id` |
| 5 | `referencia` | `codigo_proveedor = ppd.referencia` y `linea_id = linea.id` |
| 6 | `material` | `codigo_proveedor = ppd.material_code` y `proveedor_id = pp.proveedor_importacion_id` |
| 7 | `precio_lista` | `evento_id = ev.precio_evento_id` Y `linea_id = linea.id` Y `referencia_id = referencia.id` Y `material_id = material.id` |

Si **cualquiera** de esos 7 vínculos falla → precio NULL.

---

## Tareas

### 1. Elegir 3 SKUs de muestra del catálogo

```sql
SELECT pp_id, pp_nro, det_id, descp_marca, linea_codigo, referencia_codigo, material_code, descp_color, cantidad_pares
FROM public.v_stock_rimec
WHERE cajas_disponibles > 0
ORDER BY descp_marca, linea_codigo
LIMIT 3;
```

Anotá los 3 `det_id` y `pp_id` resultantes. **Sobre estos 3 se hace todo el diagnóstico.**

### 2. Rastreo paso a paso (por cada `det_id` muestra)

**Plantilla — reemplazar `:det_id` y `:pp_id`:**

```sql
-- PASO 1: ¿el PP está ABIERTO/ENVIADO?
SELECT id, numero_registro, estado, proveedor_importacion_id
FROM public.pedido_proveedor WHERE id = :pp_id;

-- PASO 2: ¿el PP tiene intencion_compra_pedido con evento de precio?
SELECT icp.id, icp.pedido_proveedor_id, icp.intencion_compra_id, icp.precio_evento_id,
       ic.id_marca AS ic_marca,
       (SELECT id_marca FROM public.pedido_proveedor_detalle WHERE id = :det_id) AS ppd_marca
FROM public.intencion_compra_pedido icp
JOIN public.intencion_compra ic ON ic.id = icp.intencion_compra_id
WHERE icp.pedido_proveedor_id = :pp_id;

-- PASO 3: ¿el código de línea del PP matchea con la tabla `linea`?
SELECT ppd.id AS det_id, ppd.linea AS codigo_linea_pp,
       l.id AS linea_id, l.codigo_proveedor AS codigo_linea_tabla,
       pp.proveedor_importacion_id AS proveedor_pp,
       l.proveedor_id AS proveedor_linea
FROM public.pedido_proveedor_detalle ppd
JOIN public.pedido_proveedor pp ON pp.id = ppd.pedido_proveedor_id
LEFT JOIN public.linea l
  ON l.codigo_proveedor::text = ppd.linea
 AND l.proveedor_id = pp.proveedor_importacion_id
WHERE ppd.id = :det_id;

-- PASO 4: ¿el código de referencia del PP matchea con la tabla `referencia`?
SELECT ppd.id AS det_id, ppd.referencia AS codigo_ref_pp,
       r.id AS referencia_id, r.codigo_proveedor AS codigo_ref_tabla, r.linea_id
FROM public.pedido_proveedor_detalle ppd
JOIN public.pedido_proveedor pp ON pp.id = ppd.pedido_proveedor_id
LEFT JOIN public.linea l ON l.codigo_proveedor::text = ppd.linea AND l.proveedor_id = pp.proveedor_importacion_id
LEFT JOIN public.referencia r ON r.codigo_proveedor::text = ppd.referencia AND r.linea_id = l.id
WHERE ppd.id = :det_id;

-- PASO 5: ¿el código de material del PP matchea con la tabla `material`?
SELECT ppd.id AS det_id, ppd.material_code AS codigo_mat_pp,
       m.id AS material_id, m.codigo_proveedor AS codigo_mat_tabla,
       m.proveedor_id AS proveedor_material
FROM public.pedido_proveedor_detalle ppd
JOIN public.pedido_proveedor pp ON pp.id = ppd.pedido_proveedor_id
LEFT JOIN public.material m
  ON m.codigo_proveedor::text = ppd.material_code
 AND m.proveedor_id = pp.proveedor_importacion_id
WHERE ppd.id = :det_id;

-- PASO 6: con los IDs resueltos arriba, ¿hay fila en precio_lista?
-- Reemplazar :evento_id (del paso 2), :linea_id (paso 3), :ref_id (paso 4), :mat_id (paso 5)
SELECT pl.id, pl.evento_id, pl.linea_id, pl.referencia_id, pl.material_id,
       pl.lpn, pl.lpc02, pl.caso_id, pl.nombre_caso_aplicado
FROM public.precio_lista pl
WHERE pl.evento_id = :evento_id
  AND pl.linea_id = :linea_id
  AND pl.referencia_id = :ref_id
  AND pl.material_id = :mat_id;

-- PASO 6b (si paso 6 vuelve vacío): ¿hay precio para esa línea/ref en ESE evento ignorando material?
SELECT pl.id, pl.linea_id, pl.referencia_id, pl.material_id, pl.lpn
FROM public.precio_lista pl
WHERE pl.evento_id = :evento_id
  AND pl.linea_id = :linea_id
  AND pl.referencia_id = :ref_id
LIMIT 5;

-- PASO 6c: ¿hay precio para esa linea/ref en CUALQUIER evento?
SELECT pl.id, pl.evento_id, pl.linea_id, pl.referencia_id, pl.material_id, pl.lpn
FROM public.precio_lista pl
WHERE pl.linea_id = :linea_id
  AND pl.referencia_id = :ref_id
LIMIT 5;
```

### 3. Conclusión por SKU

Por cada uno de los 3 SKUs, indicar en qué paso (1 → 6c) se cortó la cadena. Patrones esperables:

- **Corte en paso 2** → falta vincular evento al PP en Streamlit (Alfredo o quien corresponda).
- **Corte en paso 3/4/5** → códigos de línea/referencia/material del PP **no coinciden** con los del catálogo. Mismatch de proveedor o codificación diferente entre Excel del listado vs PP cargado.
- **Corte en paso 6 pero 6b devuelve filas** → mismatch SOLO de material. Bug de carga: el material_id de `precio_lista` no es el mismo que el de `pedido_proveedor_detalle`.
- **Corte en paso 6b pero 6c devuelve filas** → mismatch de evento: el listado fue cargado en evento distinto al que está vinculado al PP.
- **Paso 6c vacío** → de verdad no hay precio en `precio_lista` para ese SKU (descartar antes de culpar a la cadena).

---

## Evidencia (entregar `OT-DIAGNOSTICO-CADENA-PRECIOS-009-EVIDENCIA-CLAUDE.md`)

```
SKU 1: det_id=____, pp_id=____, linea/ref/material=____ / ____ / ____
  Paso 1: PASS / FAIL — detalle: ____
  Paso 2: PASS / FAIL — precio_evento_id=____
  Paso 3: PASS / FAIL — linea_id resuelto=____
  Paso 4: PASS / FAIL — referencia_id resuelto=____
  Paso 5: PASS / FAIL — material_id resuelto=____
  Paso 6: PASS / FAIL — fila precio_lista encontrada: SI/NO
  Si FAIL: paso 6b y 6c
  **CONCLUSIÓN:** el corte está en el paso ___ porque ____

SKU 2: [mismo formato]
SKU 3: [mismo formato]

PATRÓN COMÚN: ____
RECOMENDACIÓN AL DIRECTOR: ____
```

---

## NO HACER

- ❌ No correr `aplicar_vista_stock_cli.py` ni recrear la vista. La vista está bien — el problema es el dato.
- ❌ No tocar `precio_lista`, `intencion_compra_pedido` ni `pedido_proveedor_detalle` con UPDATE/INSERT.
- ❌ No abrir Streamlit ni `rimec-web/`. Solo diagnóstico DB.
- ❌ Si encontrás el corte, **NO lo arregles** — entregá la evidencia para que el Director decida.
