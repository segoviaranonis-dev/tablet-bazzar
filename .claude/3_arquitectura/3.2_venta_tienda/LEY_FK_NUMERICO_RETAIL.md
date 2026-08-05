# Ley FK numérico — Retail / importación pilares

**Código:** `3.02.00.011`  
**Integrado:** Chusar 2026-06-16 · ratificación Director  
**Relacionado:** [pilares_rimec.md](../../1_fundamentos/1.2_leyes/pilares_rimec.md) · P0 nomenclatura · [CHUSAR_IMPORT_CONFECCIONES_MEMORIA.md](./CHUSAR_IMPORT_CONFECCIONES_MEMORIA.md)

---

## Decisión Director (2026-06-16)

> Cada pilar tiene **PK propio** (`linea.id`, `referencia.id`, …) y **código de proveedor** (`codigo_proveedor`, bigint STYLE).  
> **Exigencia:** todo se maneja por **FK numérico** (`linea_id`, `referencia_id`, …) — **nunca jamás texto** para filtros, agrupamientos, JOINs ni lógica de negocio.

---

## Modelo triplete — por qué existe (Director 2026-06-16)

Un mismo número de proveedor **no es universal**. `1184` en **654** (calzado) ≠ `1184` en **638** (confecciones). Por eso la identidad del pilar en catálogo es **compuesta**:

```
┌─────────────────────────────────────────────────────────────┐
│  PRE-PILAR (catálogo)          │  OPERACIÓN (staging, PP,   │
│  linea · referencia · …        │  depósitos, tickets…)      │
├────────────────────────────────┼────────────────────────────┤
│  id              ← PK Nexus    │  linea_id        ← FK      │
│  proveedor_id    ← 654 | 638    │  referencia_id   ← FK      │
│  codigo_proveedor← lo que ve   │  material_id     ← FK      │
│                    el proveedor│  color_id        ← FK      │
└────────────────────────────────┴────────────────────────────┘
         UNIQUE (proveedor_id, codigo_proveedor) por pilar
```

| Capa | Qué guarda | Quién lo usa |
|------|------------|--------------|
| **Pre-pilar** | `id` + `proveedor_id` + `codigo_proveedor` (+ descripción) | Import upsert · resolución Excel→FK |
| **Operación** | Solo `{pilar}_id` (FK a `id`) | SQL · filtros · agrupaciones · depósitos · tablet |
| **UI** | JOIN al catálogo → mostrar `codigo_proveedor` / texto humano | Vendedor ve «1184»; sistema trabaja `linea_id=8842` |

**Regla:** el código del proveedor (número o letra normalizada a bigint/text en catálogo) **nunca** es clave de JOIN en tablas operativas. Solo en catálogo + copia denormalizada opcional en staging.

**Lookup canónico import:**

```sql
SELECT id FROM linea
WHERE proveedor_id = :pid AND codigo_proveedor = :codigo;
-- → linea_id para la fila operativa
```

Referencia además exige `linea_id` en el par (ref depende de línea).

---

## Ley ya existente en Moria

| Fuente | Texto |
|--------|--------|
| `1.2_leyes/pilares_rimec.md` | **LEY FK-FIRST** — Excel es entrada; se resuelve a FK enteras; **prohibido operar con códigos/texto sin resolver FK** |
| `.cursor/rules/rimec-nomenclatura-pilares-p0.mdc` | FK siempre `{pilar}_id`; `codigo_proveedor` solo en catálogo o copia denormalizada |
| `063_registro_st_vt_rc_reposicion.sql` | Staging lleva `linea_id`, `referencia_id`, `material_id`, `color_id` + dimensiones FK |
| `3.2_venta_tienda/depositos.md` | «Filosofía FK» — Doble corazón pilares + cliente |

**Conclusión:** la exigencia del Director **ya es ley holding**; lo que faltaba documentar es la **brecha del hotfix actual**.

---

## Qué permite el texto en staging (solo auditoría)

Columnas **denormalizadas** en `registro_st_vt_rc_reposicion`:

| Columna | Rol permitido |
|---------|----------------|
| `linea_codigo_proveedor` | Trazabilidad Excel · display · re-resolución si FK NULL |
| `referencia_codigo_proveedor` | Idem |
| `excel_material_code` / `excel_color_code` | Idem |
| `grada` | Talle en la fila de movimiento (no siempre FK `talla_id` en retail tienda) |

**Prohibido:** que Report, filtros, depósitos, tablet o KPIs lean **solo** estas columnas cuando existe (o debe existir) `{pilar}_id`.

---

## Brecha: `RETAIL_IMPORT_FAST` (hotfix 2026-06-15)

En `st_vt_rc_import.py`:

```python
RETAIL_IMPORT_FAST = True
# → resolve_retail_fks(..., auto_provision_lr=False)
```

| Campo | Con FAST=True hoy | Ley Director |
|-------|-------------------|--------------|
| `material_id`, `color_id` | FK numérico (o sentinela OTROS) | ✅ parcial |
| `marca_id`, `genero_id`, `grupo_estilo_id`, `tipo_1_id` | FK OTROS | ⚠️ FK sí, pero no semántica real |
| **`linea_id`, `referencia_id`** | **NULL forzado** | ❌ **viola FK-FIRST** |
| Texto L+R en fila | Siempre escrito | OK solo como copia |

**Veredicto:** el modo rápido fue **incendio ayer** (velocidad); **no es estado objetivo**. Preparar confecciones implica **volver a resolver L+R+M+C a FK** en import (alta perezosa en pilares si falta catálogo).

---

## Confecciones (638) y la «K»

Borrador Kyly decía ref **`K` en texto retail** sin pilar `referencia` bigint. Eso **choca** con la ley FK del Director.

**Camino alineado:**

1. Alta en pilar `referencia` con **`codigo_proveedor` bigint** acordado por proveedor (ej. convención numérica, no letra suelta en JOINs).
2. Fila `linea_referencia` para enriquecimiento estilo/tipo_1.
3. Staging: `referencia_id` **obligatorio**; texto `referencia_codigo_proveedor` = copia legible.

**Pendiente Director:** definir en reglas 638 el **código numérico canónico** de la ref sintética (no dejar «K» como única verdad operativa).

---

## Checklist import «preparado» (FK completo)

- [ ] `RETAIL_IMPORT_FAST = False` (o rama confecciones siempre con provision)
- [ ] `resolve_retail_fks`: toda fila sale con `linea_id`, `referencia_id`, `material_id`, `color_id` ≠ NULL (salvo fila rechazada con log)
- [ ] Report `/retail`: filtros y agrupaciones solo por `{pilar}_id`
- [ ] Reglas por proveedor documentan mapeo Excel → `codigo_proveedor` → upsert → FK
- [ ] Smoke: 0 filas staging con FK NULL en pilares 1–4

---

## Referencias código

| Archivo | Función |
|---------|---------|
| `st_vt_rc_import.py` | `RETAIL_IMPORT_FAST`, `insert_batch` |
| `fk_resolve.py` | `resolve_retail_fks`, `provision_missing_linea_referencia_pairs` |
| `core/pilares/` | Motor compartido upsert (OT leyes importación) |

**Shibboleth:** 7 años
