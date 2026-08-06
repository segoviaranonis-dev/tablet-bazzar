# CHUSAR — AB-CR · chip ESCOLAR (d45=08) · referencia completa

**Código:** `2.2.1.45`  
**Fecha:** 2026-08-06 (ampliado Documenta · Protocolo Chusar activado)  
**App referencia:** RIMEC Web `:3001` · paridad parcial Report  
**Error:** [`4.01.04.008`](../../5_errores/detalle/4.01.04.008_rimec-web-abcr-escolar-chip-invisible.md) ✅ **RESUELTO prod**  
**Instalación en otros módulos:** [CHUSAR_PROTOCOLO_INSTALACION_FILTROS_PE_ABCR.md](./CHUSAR_PROTOCOLO_INSTALACION_FILTROS_PE_ABCR.md) (**2.2.1.47**)  
**Marco orígenes:** [CHUSAR_PROTOCOLO_DOS_ORIGENES_CUATRO_CANERIAS.md](./CHUSAR_PROTOCOLO_DOS_ORIGENES_CUATRO_CANERIAS.md) (**2.2.1.46**)  
**Sesión día:** [CHUSAR_SESION_20260806_FILTROS_PRECIO_PARENTESIS.md](./CHUSAR_SESION_20260806_FILTROS_PRECIO_PARENTESIS.md) (**2.2.1.50**)  
**Estado:** 🟢 Prod https://rimec.com.py · lote `bcc476c` (cadena ESCOLAR del día)

---

## 0 · Qué es ESCOLAR (y qué no es)

| Es | No es |
|----|--------|
| Opción de la dimensión **AB-CR** (Tipo1 PE tipológico) | Chip de **Tipo comercial** (Normal / Promo / LIQ) |
| Subconjunto PE hermético (diccionario / COD.GRUPO) | Estilo de molécula («ESCOLARES» en ESTILO) |
| Cadena comercial **REGULAR** (grupo uno) | Liquidación ni Promo |
| Id sintético sidebar **`-8`** | FK real de tabla `tipo_1` (CERRADO sigue `tipo_1_id=2`) |

**Fuente de negocio (Carlos / Excel stock y grupos + seed):**

- Marcas típicas: **MOLEKINHA** / **MOLEKINHO**
- Excel tipifica: `descp_tipo_1` / temporada **CERRADO** + **`sdrm_tipo1=ESCOLAR`**
- Dígito calzado **d45 = `08`** en `COD.GRUPO` 10 dígitos (ej. `0502080000`, `0602080000`)
- Seed `cadena_pe`: **REGULAR** (no LIQ)

**Stock vivo (auditoría 2026-08-06):** ~40 filas PE con saldo en grupos `0502080000` / `0602080000` · `sdrm_tipo1=ESCOLAR` · `tipo_1_id=2` (CERRADO en FK).

---

## 1 · Órdenes Director (hilo)

1. *«va ir a esta dimensión mete ahí el escolar por ahora»* → AB-CR.  
2. *«no se ve los escolares · Documenta el fallo»* → error `4.01.04.008`.  
3. *«estamos aun con 5 · ejecuta en local»* → fix `isAbcrSyntheticTipoId` + separación `peTieneSubfamiliaAccesorios`.  
4. *«perfecto documenta hasta el menor detalle … instalación en otros módulos · Protocolo Chusar activado»* → este doc + **2.2.1.47**.

---

## 2 · IDs sintéticos AB-CR (mapa canónico)

| Id | Label UI | Módulo | ¿Accesorios? | ¿Sobrevive `normalizeFilterItems`? |
|----|----------|--------|--------------|-------------------------------------|
| **-1** | CARTERAS | Accesorios | **Sí** | Sí (`isAbcrSyntheticTipoId`) |
| **-2** | ANTEOJOS | Accesorios | **Sí** | Sí |
| **4** | MEDIAS | Tipológico PE | No | Sí (id &gt; 0, FK/convención) |
| **-8** | ESCOLAR | Tipológico PE | **No** | Sí **solo si** `isAbcrSyntheticTipoId(-8)` |

**Ley anti-regresión:** todo id &lt; 0 nuevo en AB-CR debe:

1. Entrar en `isAbcrSyntheticTipoId` (si no, `dedupeFilterItemsById` lo borra).  
2. **No** entrar en `peTieneSubfamiliaAccesorios` salvo que sea Carteras/Anteojos (−1/−2).  
3. Tener `rowMatches*` propio y exclusión respecto del FK “padre” (ej. CERRADO vs ESCOLAR).

---

## 3 · Ley de match de fila

Archivo: `rimec-web/lib/filtros/pe-modulo-escolar.ts` (par: `report/src/lib/filtros/pe-modulo-escolar.ts`).

```
esFilaEscolar(row) ⇔
  codGrupoEsEscolar(cod_grupo)     // calzado · d45=08 · NO confecciones 10–15
  OR esLabelEscolar(sdrm_tipo1)
  OR esLabelEscolar(descp_tipo_1 | tipo_1)
```

`codGrupoEsEscolar`:

1. `normalizeCodGrupo10` (10 dígitos).  
2. Si marca d01–d02 ∈ {10…15} → **false** (confecciones: d45 no es cadena escolar).  
3. `g.slice(4, 6) === '08'`.

**Cadena comercial:** `cadenaComercialDesdeCodGrupo` mapea d45=`08` → **`REGULAR`** (`codGrupoCadena.ts` / `CALZ_D45_CADENA` Report). ESCOLAR **no** abre chip LIQ ni Promo.

---

## 4 · Merge sidebar AB-CR

Archivo: `pe-abcr-tipo1.ts` · `mergePeAbcrTipo1Items`.

Orden de construcción:

1. Carteras / Anteojos (sintéticos −1/−2).  
2. MEDIAS (id 4) siempre.  
3. Temporada fija: `ABIERTO → ACT ROPAS → CERRADO → ESCOLAR → INVIERNO → VERANO`.  
4. Resto alfabético.

**ESCOLAR se inyecta siempre** (`byLabel.set('ESCOLAR', ABCR_ESCOLAR_ITEM)`), aunque la meta BD no traiga label ESCOLAR (porque el FK sigue siendo CERRADO).

Alias valorizado: `pe-valorizado-tipo1.ts` · `ESCOLAR → ESCOLAR`.

---

## 5 · Match de filtro (OR entre chips)

`rowMatchesPeAbcrTipo1(row, tipo1Ids)`:

| Id seleccionado | Condición |
|-----------------|-----------|
| `-8` | `esFilaEscolar(row)` |
| `4` | `esFilaMedias(row)` |
| `> 0` (FK) | `tipo_1_id === id` **y** `!esFilaEscolar(row)` |

Así, chip **CERRADO** no mezcla Molekinha escolar; chip **ESCOLAR** las toma.

---

## 6 · Pipeline memoria RIMEC Web (`applyMemoryFilters`)

`catalogoFilters.ts` cuando `tipo_ids` no vacío:

1. `synthKeys` = ids &lt; 0 **excepto −8** → map a subtipo accesorios (−1/−2).  
2. `abcrIds` = ids &gt; 0 **o** `=== -8`.  
3. Si hay synthKeys → AND con `rowMatchesAccesoriosSubtipo`.  
4. Si hay abcrIds → `rowMatchesPeAbcrTipo1(..., abcrIds)`.

Report operativa: misma lógica en `report/src/lib/depositos/operativa-filters.ts` (`tipo1Ids`).

---

## 7 · Pipeline meta → sidebar (dónde se rompió y el fix)

```
RPC / buildFiltros
  → tipos FK (CERRADO=2, ABIERTO=1, …)
  → stripAccesoriosFromMetaIfCalzado / mergeTiposCatalogoTodos
  → mergePeAbcrTipo1Items  …… inyecta -8 ESCOLAR
  → JSON filtros.todosTipos
  → CatalogoClient: normalizeFilterItems(todosTipos)
       → dedupeFilterItemsById
            → if (id < 0 && !isAbcrSyntheticTipoId(id)) CONTINUE  // ← borraba -8
  → sidebar AB-CR
```

**Fix (2026-08-06):**

| Función | Regla correcta |
|---------|----------------|
| `isAbcrSyntheticTipoId` | −1 ∨ −2 ∨ **−8** |
| `peTieneSubfamiliaAccesorios` | **solo** −1 ∨ −2 (nunca −8) |

Si se unifican las dos funciones otra vez → grilla vacía al filtrar ESCOLAR (trata todo como módulo accesorios).

**Nota UI:** `MULTI · N` en el título AB-CR = **cantidad de chips seleccionados**, no el total de opciones del listado.

---

## 8 · Archivos tocados (inventario)

### RIMEC Web

| Archivo | Cambio |
|---------|--------|
| `lib/filtros/pe-modulo-escolar.ts` | **Nuevo** · id −8 · match |
| `lib/filtros/pe-abcr-tipo1.ts` | TEMPORADA + merge + rowMatches |
| `lib/filtros/pe-valorizado-tipo1.ts` | Alias ESCOLAR |
| `lib/filtros/modulo-accesorios.ts` | synthetic −8 · peTieneSubfamilia solo −1/−2 |
| `lib/catalogoFilters.ts` | applyMemoryFilters bifurca −8 |
| `lib/pilares/codGrupoCadena.ts` | d45=`08` → REGULAR |
| `scripts/_smoke_escolar_abcr.ts` | Smoke merge + PE + memoria |

### Report (paridad)

| Archivo | Cambio |
|---------|--------|
| `src/lib/filtros/pe-modulo-escolar.ts` | Par |
| `src/lib/filtros/pe-abcr-tipo1.ts` | Par |
| `src/lib/filtros/pe-valorizado-tipo1.ts` | Alias |
| `src/lib/filtros/modulo-accesorios.ts` | peTieneSubfamilia solo −1/−2 |
| `src/lib/depositos/operativa-filters.ts` | Match tipo1Ids con ESCOLAR |
| `src/lib/pilares/cod-grupo-decode.ts` | `CALZ_D45_CADENA["08"]="REGULAR"` |

---

## 9 · Smoke

```bash
cd rimec-web
npx tsx scripts/_smoke_escolar_abcr.ts
```

Esperado:

- `HAS_ESCOLAR true` · id `-8`  
- `PE_ESCOLAR_ROWS` ≥ 1 (típicamente ~40)  
- `MEM_FILTER_ESCOLAR` = filas escolares · decoy CERRADO excluido  
- `PASS_ESCOLAR_ABCR`

UI: `:3001` · Todos · Calzado · AB-CR · chip **ESCOLAR** · Molekinha/Molekinho.

---

## 10 · Deploy

Prod rimec-web sellada `f408fc2`. Este cambio es **local** hasta cierre de etapa u orden directa del Director.

---

**Shibboleth:** Andrés, el que viene.
