# CHUSAR — Mapa SDRM 654 → maestros línea + referencia (auditoría + mutación)

**Código:** **2.3.5.8**  
**Fecha:** 2026-08-16  
**Keyword:** Documenta (Director: mapear SDRM 654 · L+R · herencia consecutivo · SQL · hallazgos)  
**Batch auditado:** `sdrm5801`  
**Scripts:** `report/scripts/_audit_mapa_sdrm_654_lr.ts` · `_audit_mapa_sdrm_654_detalle.ts` · `_rollback_chinelo_marca_8448.ts`  
**Evidencia:** `ot/en_curso/EVIDENCIA_MAPA_SDRM_654_LR_AUDIT.json` · `…_APPLY.json`  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES post-20260807 · 2026-08-16**

---

## Universo (SQL)

| Métrica | Valor |
|---------|-------|
| Batch PE 654 | **sdrm5801** · 5.560 filas |
| Líneas distintas en SDRM | **769** |
| Pares L·R en SDRM | **2.525** |
| Líneas maestro 654 activas | **1.768** |
| Intersección SDRM ∩ maestro | **769** (100% cubierto) |
| Solo maestro (sin SDRM) | **999** |
| Solo SDRM sin maestro | **0** |
| Pares SDRM sin `referencia` | **0** |
| LR incompletas (tipo1∨estilo NULL) pre-apply | **431** |

Clave de negocio: **`linea.codigo_proveedor`** / **`referencia.codigo_proveedor`** — **nunca** `linea.id` ni `referencia.id` Nexus.

Ejemplo Director **1184 / 1185:** ambos en SDRM; ids Nexus `50` / `51` ≠ códigos Carlos. Ordenar siempre por `codigo_proveedor` numérico.

---

## Ley de herencia (este trabajo)

Para líneas **en maestro y no en SDRM**:

> Donante = **siguiente** `codigo_proveedor` numérico mayor (ej. huérfana `1184` ← donante `1185`), **no** vecino inferior Retail 1.1, **no** `id` Nexus.

| Estado pre-apply (999 huérfanas) | n |
|----------------------------------|---|
| YA_ALINEADA vs donante siguiente | 969 |
| NECESITA_HERENCIA | 29 |
| SIN_DONANTE (`2000810`) | 1 |

**Nota vs Retail:** `herencia.py` / CHUSAR CSV usa **vecino inferior**. Aquí el Director mandó **siguiente consecutivo**. Queda documentado; no unificar sin OT.

---

## Diffs / hallazgos

### H1 — Marca diccionario vs `linea.marca_id` (pre-apply)

| Línea | SDRM d01-02 | Pilar antes | Acción |
|-------|-------------|-------------|--------|
| **2589** | 06 MOLEKINHO | MOLEKINHA | ✅ corregido → 6 |
| **5831** | 06 MOLEKINHO | MOLECA | ✅ corregido → 6 |
| **70000** | 03 MODARE | BR SPORT | ✅ corregido → 3 |
| **8448** | 09 «CHINELO» | BEIRA RIO | ⛔ **NO tocar** — deuda **2.3.5.7** (Chinelo = caso, no marca) |

Post-apply marca (excl. 09): **765+3 OK**; 8448 restaurado a **BEIRA RIO**.

### H2 — Tipo d03-04 vs `tipo_1` (8 “conflictos”)

Líneas **40000–40007**: diccionario dice **PRENDAS**; LR vive como **ACT ROPAS** (salvo 40007 sample ABIERTO).

**No se pisó.** Requiere mapa alias `PRENDAS ↔ ACT ROPAS` (Actvitta ropa) antes de mutar.

### H3 — Provision L/R

Cero altas: todo par SDRM ya existía en `linea` / `referencia` / `linea_referencia`.

### H4 — Mutación aplicada (selectiva)

| Paso | Filas |
|------|-------|
| Marca (01–08) | **4** (luego rollback 8448 → net **3**) |
| Herencia marca/género siguiente | **33** |
| LR NULL ← COD.GRUPO SDRM | **123** |
| LR NULL ← herencia huérfana | **140** |
| Rollback anti-09 | **8448**, **7505**, **8359** |

### H5 — Herencia peligrosa vía marca fantasma `09`

Donantes con `marca_id=9` (CHINELO modelado mal) contaminaban huérfanas (**7505**, **8359**). Revertidas. Regla: herencia de marca **no** debe propagar `id_marca=9` hasta OT 2.3.5.7.

### H6 — Sin donante

Línea **`2000810`**: sin siguiente consecutivo; queda como está (marca VIZZANO).

---

## SQL canónico (reproducible)

```sql
-- Sets L
WITH sdrm AS (
  SELECT DISTINCT btrim(linea_codigo_proveedor::text) AS lc
  FROM stock_pronta_entrega_rimec WHERE proveedor_id = 654 AND linea_codigo_proveedor IS NOT NULL
), lin AS (
  SELECT btrim(codigo_proveedor::text) AS lc FROM linea WHERE proveedor_id = 654 AND activo
)
SELECT
  (SELECT COUNT(*) FROM sdrm) AS en_sdrm,
  (SELECT COUNT(*) FROM lin) AS maestro,
  (SELECT COUNT(*) FROM sdrm s JOIN lin l ON l.lc = s.lc) AS inter,
  (SELECT COUNT(*) FROM lin l LEFT JOIN sdrm s ON s.lc = l.lc WHERE s.lc IS NULL) AS solo_maestro;

-- Herencia plan (siguiente codigo_proveedor)
-- ver script _audit_mapa_sdrm_654_lr.ts CTE huerfanas + LATERAL lc_num >
```

Re-ejecutar auditoría:

```bash
cd report && npx tsx scripts/_audit_mapa_sdrm_654_lr.ts
# mutar (excluye 09): npx tsx scripts/_audit_mapa_sdrm_654_lr.ts --apply
```

---

## Prohibido

- Usar `linea.id` / `referencia.id` como clave Carlos.
- Forzar marca `09` → CHINELO (ver **2.3.5.7**).
- Pisar **ACT ROPAS** con **PRENDAS** sin mapa alias.
- Confundir herencia **siguiente** (este doc) con vecino **inferior** Retail.

---

## Relacionados

- Diccionarios PE **2.3.5.6** · CHINELO deuda **2.3.5.7**
- Provision PE SDRM `CHUSAR_PLAN_IMPORT_PE_SDRM0849_PILARES.md`
- Motor mapa `report/src/lib/pilares/aplicar-mapa-sdrm.ts`
