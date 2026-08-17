# CHUSAR — Error de arquitectura: CHINELO modelado como marca (es caso)

**Código:** **2.3.5.7**  
**Fecha:** 2026-08-16 (corregido mismo día — Director)  
**Estado:** 🔴 **DEUDA ARQUITECTURA** · documentado · **sin fix de código** hasta OT futura  
**Keyword:** Documenta (Director: Chinelo no es marca; marca = Beira Rio; Chinelo = caso)  
**Shibboleth:** Andrés, el que viene.  
**🆕 MOISES post-20260807 · 2026-08-16**

---

## Veredicto del Director (ley viva)

| Pregunta | Respuesta |
|----------|-----------|
| ¿CHINELO es marca en el negocio? | **No.** |
| ¿Cuál es la marca real? | **BEIRA RIO** |
| ¿Qué es CHINELO en la verdad comercial? | Un **caso** (estrategia / familia comercial), no un pilar `marca` |
| ¿Qué hay hoy en el sistema? | Prefijo COD.GRUPO **`09`** → `marca_v2.id=9` label **CHINELO** (error de modelado) |

La primera versión de este CHUSAR (**«CHINELO es marca»**) quedó **anulada** por el Director. Queda solo como registro del equívoco del agente al leer el diccionario Carlos sin imaginación de negocio.

---

## El error de arquitectura

### Qué pasó

Carlos / el diccionario PE de 10 dígitos puso **CHINELO** en el slot de **marca** (dígitos 1–2 = `09`), al mismo nivel que BEIRA RIO (`01`), VIZZANO (`02`), etc.

### Por qué es error

En calzado brasileño, *chinelo* nombra un **tipo/familia de producto** (y en RIMEC opera como **caso comercial**), no una marca de fábrica. La marca de ese universo es **Beira Rio** (y líneas afiliadas). Modelar Chinelo como `marca_v2` **mezcla dos mundos**:

| Mundo | Pregunta | Tabla / concepto correcto |
|-------|----------|---------------------------|
| **Marca** | ¿Quién fabrica / firma el producto? | `marca_v2` → **BEIRA RIO** |
| **Caso** | ¿Con qué reglas / familia comercial se vende? | Caso en biblioteca / evento (`caso_precio_biblioteca`, `precio_evento_caso`, BCL) → **CHINELO** |

**Falta de imaginación del diseño original:** no hubo slot limpio para «caso embebido en COD.GRUPO», entonces se inventó una marca fantasma `09 CHINELO`.

### Consecuencia operativa (conflicto vivo)

| Línea | Depósito | COD.GRUPO (dígitos 1–2) | `linea.marca` en pilares | Lectura correcta según Director |
|-------|----------|-------------------------|--------------------------|----------------------------------|
| **8448** | **654** | **09** «CHINELO» | **BEIRA RIO** | El **pilar tiene razón** en marca. El **diccionario miente** al llamar marca a Chinelo. |

**Prohibido** “arreglar” 8448 cambiando la línea a marca CHINELO: eso **profundiza** el error.  
**Ejecutado local 2026-08-16 (2.2.1.56):** líneas caso Chinelo / `marca_id=9` → **BEIRA RIO**; filtro chip **CHI**; bib 638 seed.

---

## Hipótesis del Director (pendiente — no ejecutar)

Trabajo futuro (cuando el Director abra OT / etapa):

1. **Reconocer** `09` como **código operativo legado**, no como verdad de `marca_v2`.
2. **Marca canónica** de ese universo: **BEIRA RIO** (`01` / id 1) — o la que el Director fije en OT.
3. **CHINELO** migrar / mapear a **caso comercial** (biblioteca / evento / filtro), no a `marca`.
4. Decoder `GRUPO_DIGITO_MARCA["09"]` y UI diccionarios: dejar de enseñar «09 = marca Chinelo» como ley; documentar **alias legado → caso**.
5. Tridente / filtros AM·Web: dejar de exigir `linea.marca = CHINELO` cuando el grupo es `09-…`.
6. Smoke adverso: líneas `09-*` con marca Beira Rio = **PASS esperado**, no conflicto.

**Fuera de alcance hoy:** migraciones BD, rename `marca_v2` id 9, deploy, cambiar decoder en código. Solo memoria + mapa de deuda.

---

## Qué debe hacer el agente mientras tanto

1. Si el Director pregunta «¿Chinelo es marca?» → **No; es caso; marca = Beira Rio; el `09` es deuda.**
2. No proponer corrección de líneas 8448 → CHINELO.
3. No inventar fix de filtros «Chinelo marca» en Web/AM sin OT.
4. Al auditar tridente: marcar choques `09` vs BEIRA RIO como **conflicto de arquitectura documentado (2.3.5.7)**, no como error de carga de línea.

---

## Código legado (estado actual — no verdad de negocio)

```
GRUPO_DIGITO_MARCA["09"] = { id_marca: 9, label: "CHINELO" }
```

Archivo: `report/src/lib/pilares/cod-grupo-decode.ts`  
UI: `/pilares/diccionarios-traductores` (sigue mostrando 09 como marca hasta OT).

---

## Relacionados

- Diccionarios traductores **2.3.5.6**
- Admin líneas siameses **2.3.5.5.3** (buscar `8448`)
- Mapa casos vs entidad: `motor_precios/CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md`
- Regla holding: caso en evento, **no** en `linea.caso_id` (legacy)
- Grupo uno PE **2.3.1.10.1.2**
