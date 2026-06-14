# ETAPA 1 — OPS + Storage (fundación imágenes)

**Estado:** ACTIVA — comenzamos aquí  
**Fecha inicio:** 2026-06-14  
**Prioridad:** Precisión en archivo + velocidad de red (1 request por thumb)  
**Ejecutor:** Claude Code (scripts + upload) · Cursor (auditoría PASS/FAIL)  
**Bloquea:** Etapa 2 Velocidad · Etapa 3 Precisión · etapa final tickets

---

## Objetivo

Que **≥95% de los SKUs** usados en Tablet cadena tengan tiers `sm/md/lg` en Supabase generados con **fit contain** (punta y tacón visibles), eliminando doble HTTP y tarjetas fallback azul.

**No es objetivo de esta etapa:** tocar `vista/page.tsx`, hero CSS, payload API ni tickets.

---

## Hallazgos documentados (auditoría)

### H1 — Scripts ops ausentes en disco

**Verificado:** `control_central/tools/` solo contiene `convertir_miniaturas_retail.py`.

| Script esperado | Estado | Referenciado en |
|-----------------|--------|-----------------|
| `subir_miniaturas_supabase.py` | ❌ ausente | Protocolo, `regenerar_storage_4215_1034.py` |
| `protocolo_imagenes_cerrar_gap.py` | ❌ ausente | `PUNTO_CRITICO_RECORTE_CALZADO.md`, etapa diseño |
| `regenerar_storage_4215_1034.py` | ✅ existe | Hotfix 1 SKU — plantilla |

**Impacto:** Cierre masivo imposible; solo caso unitario 4215.1034 resuelto.

---

### H2 — Gap Storage por marca

Patrón observado en piso y docs:

```text
GET productos/sm/L-R-M-C.jpg  → 404
GET productos/L-R-M-C.jpg     → 200 (flat ~200px, a menudo crop legacy)
```

| Marca | Hallazgo doc | Impacto |
|-------|--------------|---------|
| ACTVITTA | Parcial; 4215.1034 PASS post-regen | Resto SKUs sin auditar |
| VIZZANO | ~160/348 previews FAIL HEAD `sm/` | ~46% doble request + azul |
| Otras | Sin auditoría | Riesgo desconocido |

**Impacto velocidad:** 2 round-trips por thumbnail cuando `sm/` falta.  
**Impacto precisión:** crop lateral en tiers no regenerados (foto 800×545 → cuadrado con cover).

---

### H3 — Pipeline local mal nombrado

**Archivo:** `control_central/tools/convertir_miniaturas_retail.py` L413

```python
tamanios_dict = {f"thumb_{t}": t for t in tamanios_lista}  # ❌
```

Protocolo exige salida en `sm/`, `md/`, `lg/`. El dict canónico `TAMANIOS` (L55–59) existe pero **no se usa en `main()`**.

**Impacto:** Lotes locales en `thumb_200/` no alimentan upload Supabase sin renombrar manual.

---

### H4 — Lógica contain correcta pero no aplicada masivamente

`crear_miniatura()` L78–98 — **fit contain + padding blanco** ✅ (alineado a `PUNTO_CRITICO_RECORTE_CALZADO.md`).

Caso fundador demostró el fix:

| Métrica | Antes (lg Storage) | Después (regen) |
|---------|-------------------|-----------------|
| margin_l_px | 0 | 24 |
| margin_r_px | 0 | 24 |
| Zapato completo | ❌ | ✅ |

Evidencia: `docs/evidencia/HERO_CASO_4215_1034.json`, `4215-1034-lg-FIXED.jpg`

---

### H5 — Origen fotos disponible localmente

**Ruta canónica:** `C:\Users\hecto\Documents\Prg_locales\proyectos\imagenes\`  
**Salida local:** `...\miniaturas\sm|md|lg\`

Ejemplo verificado: `4215-1034-28458-98904.jpg` — 800×545 horizontal, zapato completo en origen.

---

### H6 — Documentación vs realidad (drift)

| Doc dice | Disco dice |
|----------|------------|
| `protocolo_imagenes_cerrar_gap.py` [x] hecho | Archivo no existe |
| `subir_miniaturas_supabase.py` [x] hecho | Archivo no existe |
| ACTVITTA gap cerrado | Solo evidencia parcial / 1 SKU |

**Acción:** Actualizar checklist protocolo cuando scripts existan y PASS auditoría.

---

## Actividades Etapa 1 (orden de ejecución)

### Fase 1A — Restaurar toolchain (Claude Code)

| # | Tarea | Criterio PASS |
|---|-------|---------------|
| 1 | Restaurar o reescribir `subir_miniaturas_supabase.py` | `python tools/subir_miniaturas_supabase.py --help` OK |
| 2 | Restaurar o reescribir `protocolo_imagenes_cerrar_gap.py` | `--auditar` corre sin error |
| 3 | Fix `convertir_miniaturas_retail.py` → salida `sm/md/lg` | Carpetas correctas en `miniaturas/` |

**OT sugerida:** `OT-TABLET-STORAGE-GAP-001` en `.claude/6_ot/COLA.md`

---

### Fase 1B — Auditoría baseline (Cursor)

| # | Tarea | Criterio PASS |
|---|-------|---------------|
| 4 | `--auditar` por marca (ACTVITTA, VIZZANO, resto) | Reporte JSON en `docs/evidencia/` |
| 5 | Muestra 10 SKUs: medir márgenes JPEG `lg/` | Script tipo `auditar_hero_4215_1034.ts` |
| 6 | HEAD 200 en `sm/` por marca | % documentado |

**Entregable:** `docs/evidencia/STORAGE_BASELINE_ETAPA1.json`

---

### Fase 1C — Cierre Storage (Claude Code)

| # | Tarea | Criterio PASS |
|---|-------|---------------|
| 7 | `convertir_miniaturas_retail.py` lote origen → `miniaturas/sm|md|lg` | Contain verificado en muestra |
| 8 | `subir_miniaturas_supabase.py` por tier | Upload sin error masivo |
| 9 | `protocolo_imagenes_cerrar_gap.py --cerrar --marca ACTVITTA` | Log + evidencia |
| 10 | `--cerrar --marca VIZZANO` | ≥95% HEAD `sm/` |
| 11 | Resto marcas en cadena tablet | Misma regla |

**Origen preferido:** `imagenes/` local (800×545) — no re-escalar tier ya recortado.

---

### Fase 1D — Verificación y cierre etapa (Cursor audita)

| # | Tarea | Criterio PASS |
|---|-------|---------------|
| 12 | `--verificar` post-cierre | Reporte PASS |
| 13 | Re-auditar márgenes ≥10 SKUs aleatorios por marca | margin_l/r ≥ 8 px en horizontal |
| 14 | Tablet piso: 5 marcas, sidebar sin azul masivo | Director spot-check |
| 15 | Actualizar `NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md` checklist | [x] solo con evidencia |

**Entregable cierre:** `docs/evidencia/ETAPA_1_OPS_STORAGE_CERRADA.json`

---

## Criterios de cierre Etapa 1 (todos obligatorios)

- [ ] Scripts `subir_*` y `protocolo_*` presentes y ejecutables
- [ ] `convertir_miniaturas_retail.py` escribe `sm/md/lg`
- [ ] VIZZANO ≥95% HEAD 200 en `sm/`
- [ ] ACTVITTA ≥95% HEAD 200 en `sm/` (no solo 4215.1034)
- [ ] Muestra auditoría márgenes: ≥90% PASS contain
- [ ] Evidencia JSON baseline + cierre en `docs/evidencia/`
- [ ] Cursor auditoría: **PASS**
- [ ] Director: visto en piso (mínimo 1 marca problemática)

---

## Riesgos y mitigación

| Riesgo | Mitigación |
|--------|------------|
| Origen local incompleto vs BD | `--auditar` lista gaps; flat Storage solo si origen no existe |
| Re-crop al re-escalar tier viejo | Siempre desde `imagenes/` o flat de alta resolución |
| CDN cache post-upload | QA con `?v=` o Ctrl+Shift+R |
| Tiempo lote 3700+ imgs | Heartbeat 60s; por marca |

---

## Fuera de alcance Etapa 1

- Payload API cadena (→ Etapa 2)
- Hero fallback / parpadeo (→ Etapa 3)
- Tickets ORO / carrito (→ etapa final)
- Helpers report/rimec-web (holding — OT aparte)

---

## Referencias

| Recurso | Ruta |
|---------|------|
| Punto crítico | `.claude/2_modulos/2.1_control_central/docs/PUNTO_CRITICO_RECORTE_CALZADO.md` |
| Caso 4215.1034 | `docs/evidencia/HERO_CASO_4215_1034.json` |
| Script unitario | `scripts/regenerar_storage_4215_1034.py` |
| Script auditoría | `scripts/auditar_hero_4215_1034.ts` |
| Plan 3 etapas | `PLAN_TRES_ETAPAS_PRE_FINAL.md` |
| Auditoría madre | `AUDITORIA_PRE_ETAPA_FINAL.md` |

---

**Siguiente paso inmediato:** VIZZANO `--cerrar` en curso (background). ACTVITTA **PASS 100%**.

**Ejecutado local 2026-06-14:**
- Scripts creados en `control_central/tools/`
- `convertir_miniaturas_retail.py` → salida `sm/md/lg`
- ACTVITTA: 249/249 sm PASS (`STORAGE_AUDIT_ACTVITTA_20260614_145136.json`)
- VIZZANO: baseline 686/1565 — cierre en curso

**Registrado por Cursor — Etapa 1 ACTIVA.**
