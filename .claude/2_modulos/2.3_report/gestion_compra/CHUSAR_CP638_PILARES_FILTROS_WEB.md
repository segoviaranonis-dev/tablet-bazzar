# CHUSAR — CP 638 pilares · filtros RIMEC Web · Excel Stock primavera

**Código:** **2.3.1.33.1** · **Fecha:** 2026-07-23  
**Keyword:** Documenta (Director 2026-07-23)  
**Etapa:** [ETAPA_IMPORT_CP_CONFECCIONES_20260721.md](../../../4_etapas/ETAPA_IMPORT_CP_CONFECCIONES_20260721.md)  
**Padre:** [CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md](./CHUSAR_IMPORT_CP_CONFECCIONES_638_AM.md) · **2.3.1.33**

---

## Problema Director

Filtros sidebar RIMEC Web `:3001` CP confecciones **4092 / PP-49** despoblados o incorrectos (AB-CR, Estilo, Género).

---

## Causa raíz

1. **Import** usaba `cod_grupo: "10"` fijo — ignoró col Excel **Grupo** (COD.GRUPO 10 dígitos).
2. **Estilo 638** ≠ pilar ACTUAL/ANTERIOR de COD.GRUPO — en 638 la regla Director es **col J Descripción** (BLUSA, CONJ FEM…).
3. **Web** forzaba `ramo_tipo=CALZADO` al entrar CP — excluía filas `CONFECCIONES`.

---

## Mapa Excel → Nexus (638)

| Excel | Columna | Destino BD / PPD | Filtro Web |
|-------|---------|------------------|------------|
| **Grupo** | F | COD.GRUPO → marca · género · tipo_1 | Marca · Género · AB-CR |
| **Descripción** | J | `grupo_estilo_id` + `referencia.descripcion` + `ppd.descp_material` | **Estilo CP** (col J) |
| **Valorizado PE** | **ULT-PREC-** | idem + backfill PE | **Estilo PE** (archivo 3 grupo uno) |
| **Color** | M | `ppd.descp_color` + tono color | Color / familias |
| **GEN** | AB | control género (FEM/MASC) | validación COD.GRUPO |
| **Mat** | I | hash `K{linea}` — sin material codificado | trámite · grilla `descp_material · descp_color` |

### Trampita referencia (638)

Material no codifica tipo de prenda. Ref sintética **`K`** (`codigo 11`) con **`referencia.descripcion = col J`**. Grilla actual intacta.

---

## Scripts backfill (Report · local)

| Script | Qué hace |
|--------|----------|
| `report/scripts/backfill_pilares_cp638_excel_grupo.mts` | COD.GRUPO col F → genero · marca · tipo_1 · estilo ACTUAL |
| `report/scripts/backfill_estilo_j_cp638.mts` | Col J → `grupo_estilo_v2` (BLUSA…) · ref.descripcion |
| `report/scripts/backfill_pe638_estilo_valorizado.mts` | PE · valorizado **`ULT-PREC-`** → ref · lr · ppd (grupo uno archivo 3) |
| `report/scripts/_audit_pilares_cp638.mjs` | Auditoría v_stock_rimec PP-49 |

**Import futuro:** `import_cp4092_primavera_638.mts` lee col **Grupo** + **GEN**.

---

## Fix Web (local · sin deploy prod)

| Archivo | Cambio |
|---------|--------|
| `CatalogoFiltrosSidebar.tsx` | CP no fuerza `ramo_tipo=CALZADO` |
| `Header.tsx` | link CP sin ramo calzado |
| `catalogoMetaRpc.ts` | TODOS+CONFECCIONES merge CP 638 + PE |
| `FiltrosCatalogo.tsx` | pill CP `ramo_tipo: ''` |

**Smoke URL:** `http://localhost:3001/?origen_tipo=CP&ramo_tipo=CONFECCIONES`

---

## Estado datos PP-49 (2026-07-23)

| Métrica | Valor |
|---------|-------|
| Filas stock | **919** |
| AB-CR poblado | **919/919** (INVIERNO + VERANO) |
| Estilo col J | **919/919** (9 estilos) |
| Género | **919/919** (NINAS + NINOS) |
| Marcas | KYLY + MILON |

Estilos sidebar: BLUSA · CAMISETA · CICLISTA · CONJ FEM · CONJ MASC · LEGGING · PIJAMA FEM · POLO MASC · VESTIDO.

---

## Pendiente etapa (no pilares)

| # | Item | Estado |
|---|------|--------|
| 1 | 460 prendas Milon sin Pedido Externo | ⏳ Director |
| 2 | Smoke fotos + tallas CP Web | ⏳ |
| 3 | Panel AM split CP calzado/confecciones | ⏳ 2.3.1.11 |
| 4 | Deploy RIMEC Web fixes prod | ⏳ cierre etapa |
| 5 | Material pill duplica estilo (col J) | 🟡 cosmético |

---

## Referencias

- [CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md](../../2.2_rimec_web/CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md)
- [CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md](../../2.2_rimec_web/CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md)
- `report/src/lib/pilares/cod-grupo-decode.ts`

---

**Shibboleth:** Andrés, el que viene.
