# CHUSAR — Segundo reclamo Guido · Comentario General · Ola 2 SF

**Código:** **2.3.1.50.32**  
**Fecha:** 2026-08-12  
**Keyword:** **Protocolo chusar activado** · **Documenta** · **despliega**  
**Fuente:** `Z:\hector\SF\08.SITUACION FINANCIERA 01082026.xlsx` · pestaña **Comentario General** + **Cuadro**  
**Padres:** `2.3.1.50.11` (G1–G11) · `2.3.1.50.30` (reclamos 1ª respuesta) · `2.3.1.50.9` (Ola 2)

---

## 0 · Pipeline Guido (segundo reclamo)

```
TXT sucio → Detalle (cuotas) → + TIPO COBRO (clientes.xlsx) → Cuadro (pivot) → Sit Fin filas verdes
```

**PV Y PROG:** Guido · **«LO VEREMOS LUEGO»** — fuera de Ola 2 (SF-REC-006 → `diferido`).

---

## 1 · Ejecución Nexus (2026-08-12)

| Script | Rol |
|--------|-----|
| `_gen_ola2_cuadro_guido.py` | Extrae Cuadro Excel 08 → parchea `molecular-al-0308.json` |
| `_audit_mapa_excel_txt.py` | Origen `ola2_cuadro` en mapa canon |
| `_gen_comparacion_ago_jul.py` | `agosto_sitfin` = canon Guido en 5 conceptos |
| `_run_cierre_completo_al.py` | Orquestador (+ Ola 2 + comparación) |

**Artefacto:** `report/src/lib/situacion-financiera/ola2-cuadro-0308.json`

---

## 2 · Tabla verificación Director (ANTES → DESPUÉS)

Ruta prod: **`/situacion-financiera`** → pestaña **Comparación** → columna **Sit Fin ago** vs **Canon ago** (Δ debe ser **0**).

| Concepto | ANTES (Ola 1 · stock/aging) | DESPUÉS (Ola 2 · Cuadro Guido) |
|----------|----------------------------|--------------------------------|
| **SALDO DE CLIENTES** | 6.817.427.272 | **850.641.935** |
| **MERCADERÍAS A ENTREGAR** | 5.825.010.035 | **43.753.616** |
| **VENCIDOS A 30 DÍAS** | 1.644.155.423 | **747.227.807** |
| **VENCIDOS A 60 DÍAS** | 197.468.699 | **264.450.447** |
| **PAGO LUISITO** | 2.015.617.848 | **521.838.248** |

**Cheques ago** (SF-REC-001): sin cambio · **1.943.223.316** Gs.

**Fidelidad post-Ola2:** 13/14 conceptos Sit Fin = canon admin (92,9 %) · el pendiente es **PV Y PROG** (diferido).

---

## 3 · Reclamos catalog.json

| Código | Estado | nexusDespues |
|--------|--------|--------------|
| SF-REC-002 | cerrado | 850.641.935 |
| SF-REC-003 | cerrado | 43.753.616 |
| SF-REC-004 | cerrado | 747.227.807 |
| SF-REC-005 | cerrado | 264.450.447 |
| SF-REC-006 | **diferido** | PV — Ola 3 |
| SF-REC-007 | cerrado | 521.838.248 |

---

## 4 · Mensaje para Guido (cuando Director confirme)

Guido: aplicamos tu pipeline del **Comentario General** — Cuadro OK/A ENTREGAR/LUISITO alimenta Sit Fin en Report. Los cinco puntos (clientes, mercaderías, venc. 30/60, Luisito) ya coinciden con tu Excel 08. **PV Y PROG** queda para la ola que acordamos («lo vemos luego»). Pestaña **Reclamos Guido** actualizada.

---

## 5 · Próximo (Ola 3)

- Motor `explotar_cuotas` sobre intake TXT + `clientes.xlsx` en repo (sin depender solo del Excel 08).
- SF-REC-006 PV Y PROG por Fecha Entrega + plazo.
