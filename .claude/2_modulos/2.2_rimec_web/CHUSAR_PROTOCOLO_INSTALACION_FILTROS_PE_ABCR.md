# CHUSAR — Protocolo de instalación · filtros PE / AB-CR en otros módulos

**Código:** `2.2.1.47`  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta** · Protocolo Chusar activado  
**Propósito:** Checklist **reutilizable** para portar a cualquier superficie del holding el mismo comportamiento de filtros PE (AB-CR tipológico + Tipo comercial) ya estabilizado en RIMEC Web.  
**Referencia viva ESCOLAR:** [CHUSAR_ABCR_ESCOLAR_CHIP_20260806.md](./CHUSAR_ABCR_ESCOLAR_CHIP_20260806.md) (**2.2.1.45**)  
**Marco CP∥PE:** [CHUSAR_PROTOCOLO_DOS_ORIGENES_CUATRO_CANERIAS.md](./CHUSAR_PROTOCOLO_DOS_ORIGENES_CUATRO_CANERIAS.md) (**2.2.1.46**)  
**Siameses:** [CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md](./CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md) (**2.2.1.44**)  
**Estado:** 🟢 Listo para órdenes de instalación módulo a módulo

---

## 0 · Cuándo usar este protocolo

El Director dirá, en sustancia: *instalá estos filtros / el funcionamiento AB-CR / ESCOLAR / Tipo PE en [módulo X]*.

Antes de código:

1. Leer **este archivo completo**.  
2. Leer **2.2.1.45** (detalle ESCOLAR) y **2.2.1.46** (hermetismo CP vs PE).  
3. Identificar si el módulo toca **solo PE**, **solo CP**, o **Todos (fusión)**.  
4. Aplicar checklist §3–§7.  
5. Smoke + reporte al Director. **Sin deploy prod** salvo cierre etapa u orden directa.

---

## 1 · Capas que hay que instalar (no mezclar)

| Capa | Qué filtra | Origen | Ejemplo chips |
|------|------------|--------|---------------|
| **A · Tipo comercial** | Grupo uno / biblioteca | PE: diccionario · CP: caso | NORMAL · PROMO(CIONAL) · **LIQ solo PE** |
| **B · AB-CR tipológico** | Tipo1 / tipología stock | PE (y meta CP si aplica) | ABIERTO · CERRADO · **ESCOLAR** · MEDIAS · INVIERNO · … |
| **C · Accesorios AB-CR** | Submódulo | PE/CP señales | CARTERAS (−1) · ANTEOJOS (−2) |
| **D · Molécula** | Estilo→Línea→Material→Color | Cascada | BOTAS · … (**no** meter ESCOLAR aquí) |

**ESCOLAR = capa B.** Promo/Normal/LIQ = capa A. No instalar ESCOLAR como estilo (capa D).

---

## 2 · Parejas de archivos canónicos (copiar lógica, no reinventar)

### Tipológico AB-CR / ESCOLAR

| Rol | RIMEC Web | Report (par) |
|-----|-----------|--------------|
| Señales ESCOLAR | `rimec-web/lib/filtros/pe-modulo-escolar.ts` | `report/src/lib/filtros/pe-modulo-escolar.ts` |
| Merge + match AB-CR | `rimec-web/lib/filtros/pe-abcr-tipo1.ts` | `report/src/lib/filtros/pe-abcr-tipo1.ts` |
| Alias label | `rimec-web/lib/filtros/pe-valorizado-tipo1.ts` | `report/src/lib/filtros/pe-valorizado-tipo1.ts` |
| Sintéticos / anti-accesorios | `rimec-web/lib/filtros/modulo-accesorios.ts` | `report/src/lib/filtros/modulo-accesorios.ts` |
| Decoder d45=`08`→REGULAR | `rimec-web/lib/pilares/codGrupoCadena.ts` | `report/src/lib/pilares/cod-grupo-decode.ts` |

### Tipo comercial (capa A)

| Rol | Ruta Web |
|-----|----------|
| Prioridad LIQ&gt;Promo&gt;Normal | `rimec-web/lib/filtros/filtro-tipo-canonico.ts` |
| Chips PE diccionario | `rimec-web/lib/filtros/filtro-tipo-pe-diccionario.ts` |
| Badges | `PromoCasoBadge` (CP **PROMO**) · `PeProBadge` (PE **PRO**) · `PeLiqBadge` (**LIQ**) |

### Aplicación del filtro sobre filas

| Superficie | Función |
|------------|---------|
| Catálogo Web | `applyMemoryFilters` · `catalogoFilters.ts` |
| Operativa / depósito Report | `applyOperativaFilters` · `operativa-filters.ts` |
| Meta sidebar Web | `mergePeAbcrTipo1Items` vía `catalogoMetaRpc` / `mergeTiposCatalogoTodos` |

---

## 3 · Checklist de instalación (obligatorio)

### 3.1 Inventario del módulo destino

- [ ] ¿Qué app? (Report AM · Stock PE · Tablet · Bazzar · Streamlit · otra)  
- [ ] ¿Qué vista/tabla? (`v_stock_pe_rimec` · `v_stock_rimec` · operativa depósito · …)  
- [ ] ¿Trae `cod_grupo`, `sdrm_tipo1`, `tipo_1_id`, `descp_tipo_1`?  
- [ ] ¿Tiene sidebar AB-CR / Tipo1 o solo Tipo comercial?  
- [ ] ¿Normaliza opciones con “tirar id &lt; 0”? → ver §4

### 3.2 Copiar / alinear señales

- [ ] Archivo `pe-modulo-escolar` (o import compartido si el monorepo lo permite).  
- [ ] `PE_TIPO1_ESCOLAR_ID = -8` **mismo número** en todos los módulos (keys React / URL `tipo_ids=-8`).  
- [ ] `esFilaEscolar` idéntico (d45=`08` + label ESCOLAR).  
- [ ] Decoder: d45=`08` → cadena **REGULAR**.

### 3.3 Merge de opciones sidebar

- [ ] Llamar `mergePeAbcrTipo1Items` (o equivalente) **después** de leer meta FK.  
- [ ] Inyectar ESCOLAR siempre (no depender de que BD tenga fila tipo_1 ESCOLAR).  
- [ ] Orden temporada incluye ESCOLAR tras CERRADO.

### 3.4 Match al filtrar filas

- [ ] Si `tipo_ids` / `tipo1Ids` contiene `-8` → `esFilaEscolar`.  
- [ ] Si contiene FK CERRADO (u otro &gt;0) → **excluir** `esFilaEscolar`.  
- [ ] Accesorios (−1/−2) en rama aparte; **no** usar `id < 0` como sinónimo de accesorios.

### 3.5 Normalización de meta (trampa clásica)

- [ ] Cualquier `dedupe` / `normalize` que descarte `id < 0` debe whitelist: **−1, −2, −8** (y futuros sintéticos tipológicos).  
- [ ] `isAbcrSyntheticTipoId` ⊇ sintéticos tipológicos + accesorios.  
- [ ] `peTieneSubfamiliaAccesorios` ⊆ **solo −1/−2**.

### 3.6 Hermetismo CP∥PE

- [ ] ESCOLAR / d45 / `sdrm_tipo1` **solo aplican a PE** (o filas con COD.GRUPO PE).  
- [ ] No tipificar CP con dígitos escolares.  
- [ ] LIQ sigue exclusivo PE (**2.2.1.46**).  
- [ ] Promo = misma categoría CP+PE (etiquetas PROMO vs PRO).

### 3.7 Siameses

- [ ] Si el módulo es hermano de Web o AM → mismo turno alinear el par (**2.2.1.44**).  
- [ ] Prohibido dejar una grilla con ESCOLAR y la otra sin, sin deuda documentada.

### 3.8 Smoke mínimo

- [ ] Merge sidebar contiene label `ESCOLAR` id `-8`.  
- [ ] Filtro solo ESCOLAR → filas d45=`08` / `sdrm_tipo1=ESCOLAR` · count &gt; 0 si hay stock.  
- [ ] Filtro solo CERRADO → **0** filas escolares.  
- [ ] Filtro solo ESCOLAR → **no** vaciar por falso positivo accesorios.  
- [ ] UI: chip visible tras hard refresh.

Referencia smoke Web: `rimec-web/scripts/_smoke_escolar_abcr.ts`.

---

## 4 · Anti-patrones (lecciones 4.01.04.008)

| # | Anti-patrón | Efecto | Correcto |
|---|-------------|--------|----------|
| 1 | `if (id < 0) drop` sin whitelist | Chip ESCOLAR invisible | Whitelist −1/−2/−8 |
| 2 | `peTieneSubfamiliaAccesorios = id < 0` | Grilla 0 al elegir ESCOLAR | Solo −1/−2 |
| 3 | Meter ESCOLAR en ESTILO / molécula | Director no lo encuentra en AB-CR | Dimensión AB-CR |
| 4 | Tratar d45=`08` como LIQ/PROMO | Rompe grupo uno | Cadena REGULAR |
| 5 | Confiar en `tipo_1_id` ESCOLAR en BD | No existe FK; sigue CERRADO=2 | Match por d45 / sdrm_tipo1 |
| 6 | Instalar solo Web y olvidar Report | Divergencia siamese | Par en mismo turno |
| 7 | Deploy prod sin orden | Violación sellado | Local hasta cierre/orden |

---

## 5 · Módulos candidatos (mapa para próximas órdenes)

| Módulo | App | Qué instalar primero | Notas |
|--------|-----|----------------------|-------|
| Catálogo vendedores | RIMEC Web | **Hecho** (referencia) | `:3001` |
| Operativa / depósito PE | Report | Match + meta AB-CR | `operativa-filters` ya parcial |
| Alejandro Magno | Report | Paridad Tipo + AB-CR si UI lo muestra | Maestro **2.2.1.44** |
| Stock pronta entrega UI | Report | `stock-pe-filters` + meta | Usa operativa debajo |
| Tablet Bazzar | tablet-bazzar | Solo si Director ordena PE tipológico | Matriz roles |
| Bazzar Web | bazzar-web | Idem | No asumir |
| Streamlit Nexus | control_central | Solo con OT | Distinto stack |

Al recibir la orden de instalación, el agente **marca la fila** del módulo y ejecuta §3 sin reabrir diseño de negocio.

---

## 6 · Contrato URL / estado de filtros

Para superfícies Web compatibles con catálogo:

| Param | Valor ESCOLAR |
|-------|----------------|
| `tipo_ids` | `-8` (puede ir en lista CSV con otros ids) |
| `origen_tipo` | `PRONTA_ENTREGA` o `TODOS` (match solo pega filas PE escolares) |
| `ramo_tipo` | `CALZADO` (escolares calzado 654) |

No inventar `tipo_ids=escolar` string; el id numérico **-8** es la clave.

---

## 7 · Orden de trabajo recomendado (por módulo)

```
1. Leer 2.2.1.47 + 2.2.1.45 + 2.2.1.46
2. Diff archivos canónicos Web ↔ destino
3. Portar pe-modulo-escolar + pe-abcr (o import)
4. Enganchar merge en meta/sidebar
5. Enganchar match en filter de filas
6. Auditar normalize / id < 0
7. Smoke script o UI
8. Si hermano → repetir en par
9. Reportar Director · sin Documenta extra salvo que pida
10. Deploy solo con puerta canónica
```

---

## 8 · Criterio de aceptación (Definition of Done)

Un módulo tiene ESCOLAR / AB-CR PE **instalado** cuando:

1. El chip **ESCOLAR** es visible en la dimensión AB-CR (o equivalente).  
2. Filtrar ESCOLAR muestra stock escolar real (si existe en esa vista).  
3. CERRADO no lista esos arts.  
4. Tipo comercial Normal/Promo/LIQ sigue las leyes **2.2.1.46**.  
5. Smoke automatizable o evidencia UI al Director.  
6. Par siamese alineado o deuda explícita en chat/OT.

---

**Shibboleth:** Andrés, el que viene.
