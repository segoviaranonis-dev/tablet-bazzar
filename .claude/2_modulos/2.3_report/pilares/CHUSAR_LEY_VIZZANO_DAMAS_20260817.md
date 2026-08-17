# CHUSAR — Ley VIZZANO = DAMAS (carteras · anteojos · calzado)

**Código:** **2.3.5.16**  
**Fecha:** 2026-08-17  
**Keyword:** Documenta + ratifica en DB (Director)  
**App:** Report · BATCH mapa SDRM `/pilares` · maestra `linea`  
**Batch ref:** `sdrm0849`  
**Commit mapa:** `c4e7e22`  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES · 2026-08-17**

---

## Orden Director

> *todo vizzano es damas incluso sus carteras y anteojos*

---

## Problema visible

Vista previa mapa `sdrm0849`: filas **VIZZANO** · **CARTERAS** · columna **GÉNERO = —**.

La BD ya tenía `linea.genero_id = DAMAS` en líneas VIZZANO; el **mapa COD.GRUPO** no aporta dígito de género para CARTERAS/LENTES → preview quedaba vacío y confundía.

---

## Ley (indiscutible)

| Marca | Género | Alcance |
|-------|--------|---------|
| **VIZZANO** (`marca_id` / COD.GRUPO `02`) | **DAMAS** | Calzado · **CARTERAS** · **ANTEOJOS/LENTES** · MEDIAS · resto de tipo_1 |

No depende de TIPO2 FEM/MASC ni de dígitos 07–08 cuando el artículo es accesorio.

---

## Ratificación BD (2026-08-17)

| Métrica | Valor |
|---------|-------|
| `genero` DAMAS id | **1** |
| `marca_v2` VIZZANO id | **2** |
| Líneas activas VIZZANO | **436** |
| Tras UPDATE idempotente | **436 DAMAS · 0 NULL** |
| LR tipo1 CARTERAS | **102** líneas · todas con DAMAS |

Script: `report/scripts/_ratify_vizzano_damas.ts --apply` → `PASS_VIZZANO_DAMAS`

---

## Código (mapa)

`report/src/lib/pilares/sdrm-pilares-map.ts`:

- `isMarcaVizzano` · `MARCA_VIZZANO_GENERO_LEY = "DAMAS"`
- `resolvePilaresFromCodGrupo` fuerza **DAMAS** si marca VIZZANO (aunque COD.GRUPO no traiga género)

Smoke: `npx tsx scripts/_smoke_vizzano_damas_map.ts` → `PASS_VIZZANO_DAMAS_MAP`

---

## Smoke Director

1. BATCH `sdrm0849` → **Vista previa**: VIZZANO/CARTERAS → GÉNERO **DAMAS** (tras deploy del mapa).  
2. Admin Líneas · marca VIZZANO → género DAMAS en grilla.  
3. No hace falta re-aplicar mapa solo por género: BD ya ratificada.

---

## Relacionados

- Mapa SDRM 654 **2.3.5.8** · PE=SDRM **2.3.5.12** · visión cobertura **2.3.5.14**  
- COD.GRUPO decode · `cod-grupo-decode.ts`
