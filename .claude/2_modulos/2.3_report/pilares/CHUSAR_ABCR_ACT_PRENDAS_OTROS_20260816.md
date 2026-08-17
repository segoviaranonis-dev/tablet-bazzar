# CHUSAR — AB-CR · Canon ACT PRENDAS + OTROS

**Código:** **2.3.5.9**  
**Fecha:** 2026-08-16  
**Keyword:** Documenta + ejecuta (Director: sanear filtro AB-CR · OTROS sin dato · canon ACT PRENDAS)  
**App:** Report `:3000/stock-pronta-entrega` · RIMEC Web (siamese)  
**Línea 1 agente:** Si pienso en el lo entiendo, pero si me lo explicarlo es imposible  
**🆕 MOISES post-20260807 · 2026-08-16**

---

## Ley

| Concepto | Canon UI / BD |
|----------|----------------|
| **ACT ROPAS** + **PRENDAS** + **ACT. ROPAS** | **ACT PRENDAS** (`tipo_1.id = 5`) |
| Sin `tipo_1` / vacío / `(sin tipo 1)` | **OTROS** (chip sintético `id = -9`) |
| Anteojos | Chip **ANTEOJOS** (no mostrar LENTES crudo) |

**Tipo no se hereda** (ver **2.3.5.8**). El filtro solo **refleja** maestros + COD.GRUPO; el usuario completa OTROS en `/pilares/linea-referencia`.

---

## Qué estaba enfermo

1. Chip **ACT ROPAS** vs diccionario **PRENDAS** (misma mercadería Actvitta 40000+).
2. Filas sin tipo **invisibles** en AB-CR (no había bucket).
3. Label **LENTES** crudo en vez de **ANTEOJOS**.
4. Alias no colapsados → lista sucia.

---

## Ejecutado

| Capa | Cambio |
|------|--------|
| BD | `UPDATE tipo_1 SET descp_tipo_1 = 'ACT PRENDAS' WHERE id_tipo_1 = 5` |
| `pe-valorizado-tipo1.ts` | aliases + OTROS · Report + rimec-web |
| `pe-abcr-tipo1.ts` | TEMPORADA con ACT PRENDAS · chip OTROS · ANTEOJOS UI |
| `operativa-filters.ts` | colapso por label canónico · match OTROS `-9` |
| `catalogoFilters.ts` | paridad Web |
| `cod-grupo-decode.ts` | d23=`05` → **ACT PRENDAS** |
| Query grilla PE | COALESCE vacío → `OTROS` |

Scripts: `_canon_act_prendas_bd.ts` · `_reporte_tipo_sdrm_654_638.ts`

---

## Orden chips AB-CR (sano)

CARTERAS · ANTEOJOS · MEDIAS · **ABIERTO** · **ACT PRENDAS** · **CERRADO** · ESCOLAR · **INVIERNO** · **VERANO** · **OTROS**  
(solo los presentes en el stock vivo)

Temporada calzado (**ABIERTO / CERRADO / VERANO / INVIERNO**) vive en `TEMPORADA_ORDER` (`pe-abcr-tipo1`) — saneado junto a ACT PRENDAS · ver también auditoría Web **2.2.1.57**.

---

## Smoke Director

1. `:3000/stock-pronta-entrega` → AB-CR: **ACT PRENDAS** (no ACT ROPAS) · **OTROS** si hay huecos · **ANTEOJOS** (no LENTES).
2. Marcar **OTROS** → solo moléculas sin tipo.
3. Marcar **ACT PRENDAS** → Actvitta 40000+ / prendas.
4. RIMEC Web catálogo PE: mismo canon (hermanos siameses).

---

## Relacionados

- Mapa SDRM L+R **2.3.5.8** · CHINELO deuda **2.3.5.7**
- AB-CR accesorios **2.3.1.10.2** · Escolar chip **2.2.1.45**
