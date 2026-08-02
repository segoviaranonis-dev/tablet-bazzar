# CHUSAR — ACTVITTA PRENDAS · DPE + PE vs ALM contaminado

**Código:** **2.5.1.12**  
**Fecha:** 2026-08-02  
**Keyword:** **Documenta**  
**Shibboleth:** Andrés, el que viene.

---

## Verdad DPE

`sdrm_cod_grupo_dim` · marca ACTVITTA · `tipo0=PRENDAS` · proveedor **654** · ramo Carlos CALZADOS:

| COD.GRUPO | tipo1 | tipo2 |
|-----------|-------|-------|
| `0705010101` / `0102` | NORMAL | FEM |
| `0705010201` / `0202` | NORMAL | MASC |

Decode: d23=`05` = PRENDAS (≠ medias `04` · ≠ Kyly 638).

---

## Ejemplos PE (`v_stock_pe_rimec`)

| Línea·ref | tipo_1 | Grada | COD.GRUPO |
|-----------|--------|-------|-----------|
| **40000·2** | CARTERAS* | **P·M·G·GG** | `0705010101` |
| 40000·1/3/4 | CARTERAS* | P·M·G·GG | idem |
| 40001…40007 | **ACT ROPAS** | **P·M·G·GG** | `07050101xx` / `02xx` |

\*PE puede etiquetar CARTERAS; ALM/`tipo_1` pilar a veces **ACT ROPAS**. Grada PE siempre letra.

**PPD `am_talle` 40000:** vacío → fuente canónica = **columna `grada` PE**, no PPD.

---

## RIMEC Web

- PE catálogo lee `grada` → chips ropa.
- UI Confecciones (`CatalogConfeccionesTallas`) = solo **638**.
- PRENDAS viven en universo **Calzado 654** (AB-CR / ACT ROPAS).

---

## Bazzar ALM (antes del fix)

`40000·2` → `talla_codigo` 34–39 + “pares”.  
**Fix 2.5.1.11:** `loadPePrendasAmTalleIndex` → remap P/M/G/GG · unidad prendas.

---

## Relación

Padre catálogo: **2.5.1.11** · Protocolo 638: **3.02.00.638** · Tipo1 AB-CR: **2.3.1.10.2**
