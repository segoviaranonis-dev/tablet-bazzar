# CHUSAR — Cabecera PP · Biblioteca de casos (política) vs listado (operación)

**Código:** **2.3.1.7.5.3.13**  
**Decisión Director:** 2026-07-21  
**Estado:** 🟢 **CANÓNICO v4** — cabecera biblioteca · BCL reconstruye PF · **Admin IC grilla simple** (sin empareje auto)  
**Ruta:** `/proceso-importacion/pedido-proveedor/[ppId]` · cabecera · tab Admin IC  
**Shibboleth:** Andrés, el que viene.

**v4 (2026-07-21):** Admin IC **simple** — contadores IC/PF independientes (total cabeceras); orden cliente→marca→cantidad; **sin** IC virtuales ni banner huérfanas. Ver [CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721](./CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721.md). Cirugía Excel PP-17: script `cirugia_ic5436_pp26.mjs`.

**v3 (2026-07-21 noche):** Admin IC con **modo biblioteca** — filas IC virtuales 1:1 con PF (cliente×marca×caso); banners canon/contadores corregidos; API sin thumbnails en carga inicial. Deploy Report **`b0d018a`**. *(Superseded en grilla por v4; BCL cabecera sigue.)*

**v2 (2026-07-21 tarde):** al cambiar biblioteca, pre-facturas se **reconstruyen completas** desde **BCL cabecera** (no PELE evento IC). Marca PF = marca IC (caso ≠ marca · ej. BEIRA RIO + CHINELO).

**Padre:** [CHUSAR_PP_CABECERA_EDITABLE.md](./CHUSAR_PP_CABECERA_EDITABLE.md) (**2.3.1.7.5.3**)  
**Motor:** [CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md](../motor_precios/CHUSAR_MAPA_MOTOR_ESTRATEGIAS_CASOS_BIBLIOTECAS.md) §3.1 · [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md)

---

## Ley — política ≠ operación

| Capa | Contiene | Cardinalidad | Tabla / FK |
|------|----------|--------------|------------|
| **Cabecera PP** | **Biblioteca de casos** (Corazón 1 · estrategia) | **1 activa** por PP | `pedido_proveedor.biblioteca_precio_id` |
| **IC (CP)** | Listado de precios | 1 por IC | `intencion_compra.precio_evento_id` |
| **Pre-factura / FI (programado)** | Listado de precios | **1 por factura interna** | `precio_evento` vía líneas / cabecera FI |
| **PP completo** | — | **N listados** (flexibilidad mercado) | Varios eventos en ICs distintas |

⛔ **Prohibido** en cabecera: selector de **listado de precios** — es operativo, no político.  
✅ **Listado** vive en tab Stock (vincular por PP/IC), Administrador IC, encabezado FI — **elección manual** siempre.

---

## Regla PF / FI — célula atómica

| Regla | Detalle |
|-------|---------|
| **R-PF-1** | Pre-factura agrupa **`SHOP × marca × caso`** (programado) |
| **R-FI-1** | Factura interna = **1 cliente × 1 marca × 1 caso** — sin mezclar |
| **R-LP-1** | **1 listado (`precio_evento_id`) por FI** — no split fino dentro de la misma célula |
| **R-BCL-1** | El **caso** de cada línea sale de **`biblioteca_caso_linea`** si hay `biblioteca_precio_id` en cabecera; si no, PELE del evento IC |
| **R-BCL-2** | Al **cambiar biblioteca**, todas las PF anteriores quedan **obsoletas** — se eliminan splits · FI · y se recalculan PF en vivo con BCL nueva |
| **R-MARCA-PF-1** | Columna **Marca** en PF = **marca IC** (`marca_v2`), nunca el nombre del **caso** (CHINELO es caso, no marca) |

Doc PF: [CHUSAR_ADMINISTRADOR_IC_PROGRAMADO](./CHUSAR_ADMINISTRADOR_IC_PROGRAMADO.md) · clave `pf_key = id_cliente|id_marca|caso`.

---

## Botón «Cambiar biblioteca» — flujo destructivo total

Operadores profesionales · cambio **retroactivo** en cualquier momento (PP no ENVIADO/ANULADO).

```
1. Operador elige biblioteca (manual) en cabecera
2. Confirma texto destructivo (borra TODAS las FI del PP)
3. POST …/cambiar-biblioteca
   → UPDATE pedido_proveedor.biblioteca_precio_id
   → DELETE factura_interna + detalle (todas)
   → RESET admin_ic_pf_splits = []
   → Limpia logistica_pendiente_confirmacion del PP
   → RECONSTRUYE admin_ic (loadAdministradorIcPp) con BCL nueva
4. Respuesta JSON incluye admin_ic · n_pf · casos_pf · pares_pf
5. UI limpia cache Admin IC · escribe snapshot · tab admin-ic
6. Admin IC · orden cliente→marca→cantidad · contadores IC/PF totales · usuario alinea manual
7. Asigna listado manual por IC / PF / FI
8. Genera / imprime nuevas FI
```

| Paso | Automático v3 | Manual obligatorio |
|------|---------------|-------------------|
| Cambio biblioteca PP | ✅ | Elegir bib + confirmar |
| Borrar FI + splits | ✅ | Confirmación doble |
| Regenerar PF (BCL cabecera) | ✅ mismo POST | — |
| Marca PF desde IC | ✅ | — |
| Alinear grilla IC↔PF | — | ✅ manual · orden fijo · división PF (÷) |
| Listado por FI/IC | — | ✅ manual · sin default |
| Generar FI | — | ✅ botón lote Admin IC |

---

## Código v3 Report

| Pieza | Ruta |
|-------|------|
| Ley + POST cambio + rebuild PF | `report/src/lib/pedido-proveedor/cabecera-biblioteca.ts` |
| **Contexto caso BCL cabecera** | `report/src/lib/pedido-proveedor/pp-caso-context.ts` |
| Admin IC · PF desde PPD+IC | `report/src/lib/pedido-proveedor/administrador-ic-query.ts` |
| **Chusa modo biblioteca · IC virtual** | `report/src/lib/pedido-proveedor/administrador-ic-monto.ts` |
| Mapa BCL / PELE | `report/src/lib/motor-precios/caso-linea-evento.ts` |
| FI · caso desde BCL | `report/src/lib/pedido-proveedor/proforma-programado-engine.ts` |
| API admin IC | `…/administrador-ic/route.ts` → `chusa_modo_biblioteca` |
| API lote FI | `…/administrador-ic/generar-fi-lote/route.ts` |
| API cambio bib | `…/pedido-proveedor/[ppId]/cambiar-biblioteca/route.ts` |
| UI Admin IC | `PpTabAdministradorIc.tsx` |
| UI cabecera | `PpCabeceraBibliotecaPanel.tsx` |
| Cache Admin IC | `pp-detalle-ui-cache.ts` → `clearAdminIcCache` |
| Detalle query | `detail-query.ts` → `biblioteca_precio_id`, `biblioteca_nombre` |

### Modo biblioteca — PF (caso BCL) · Admin IC v4

La **biblioteca cabecera** sigue definiendo **caso** en líneas PF (`biblioteca_caso_linea`). La **grilla Admin IC v4** ya **no** expande IC virtuales ni filtra contadores.

| Comportamiento | Detalle |
|----------------|---------|
| **PF** | Agrupa PPD por `id_cliente \| id_marca \| caso` (BCL) |
| **IC grilla** | Una fila por cabecera IC · orden `cmpAdminFilasGrilla` |
| **Contadores** | IC total ≠ PF total hasta que operador cuadre |
| **Lote FI** | `ordenarUniversoLoteChusa` · fila i ↔ fila i |
| **Carga API** | Sin thumbnails en snapshot inicial (v3) |

Doc v4: [CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721](./CHUSAR_ADMIN_IC_CHUSA_SIMPLE_20260721.md).

### Modo biblioteca — Chusa Admin IC (v3 · obsoleto grilla)

<details>
<summary>Histórico v3 — no usar como referencia UI</summary>

| Comportamiento | Detalle |
|----------------|---------|
| **IC grilla** | `expandIcFilasChusaBiblioteca` — 1 fila virtual por PF emparejable |
| **IC huérfana** | Banner ámbar |
| **Lote FI** | `modoBiblioteca: true` — bloqueaba huérfanas |

</details>

⛔ **78 IC cabecera ≠ 74 PF** es esperado antes de alinear: una IC física puede cubrir varios casos → varias filas virtuales; IC sin proforma quedan huérfanas.

### Prioridad fuente caso (`loadPpCasoContext`)

```
SI pedido_proveedor.biblioteca_precio_id IS NOT NULL:
  mapa línea → caso = biblioteca_caso_linea (BCL)
  nombres caso = caso_precio_biblioteca activos
SINO SI evento IC:
  mapa = precio_evento_linea_excepcion (PELE)
SINO:
  vacío
```

⛔ Con biblioteca en cabecera **no** se mezcla PELE del evento IC para agrupar PF.

### Marca vs caso (CHINELO)

Proforma Excel puede traer **CHINELO** en columna marca. Reglas:

- **Caso** = BCL / PELE / precio_lista (`resolveCasoMotorPrecios`)
- **Marca PF** = IC vinculada (`pickIcForPpdRow`) — ej. cliente 663 → **BEIRA RIO** + caso **CHINELO**

### Auditoría local

```bash
cd report
npx tsx scripts/audit_pf_biblioteca_pp38.mjs 38
```

Esperado PP-38 + BIBLIOTECA MAYO #9: `reconstruccion_completa_biblioteca_mayo: true` · `motor_caso_usa_bcl_mayo: true`.

**Evidencia 2026-07-21:** PP-38 · 74 PF · casos PF = ACT-BRSPORT, BR-VZ, CHINELO, CLASICOS, TENIS (todos los casos BCL con líneas en PPD).

**Evidencia v3 local:** PP-38 · 73 IC alineadas + 1 huérfana · sin banner rojo masivo «canon error vendedor». Deploy prod **`b0d018a`**.

```bash
cd report
npx tsx scripts/audit_chusa_ic_pf_programado.ts 38
```

---

## Mapa bibliotecas activas prod (2026-07-21 · proveedor 654)

| ID | Biblioteca | Casos | Uso |
|----|------------|-------|-----|
| 8 | POLITICA JUNIO 2026 | 5 | Política vigente junio |
| **9** | **BIBLIOTECA MAYO 2026** | **7** | **Mayo · CLASICOS · TENIS · CARTERAS** |
| 7 | Biblioteca Junio26 (7200) | 5 | Operativa |
| 6 | prueba | 5 | Sandbox |
| 5 | Biblioteca 1905 | 5 | Canónica histórica |
| 1,2,4 | CP 7447-* | 0 | Ocultar en selector (vacías) |

Listados = `precio_evento` con `biblioteca_precio_id` → script `report/scripts/_diag_bibliotecas_listados.mjs` · audit PF `audit_pf_biblioteca_pp38.mjs`.

---

## Qué NO hace v3 (iteración 4)

- Auto-aplicar biblioteca a todos los `precio_evento` del PP
- Auto-proponer último listado cerrado
- Historial de bibliotecas en el mismo PP
- Lote FI con **una misma IC** repartida en **2+ casos** sin división PF (÷) previa
- Thumbnails en carga inicial Admin IC (lazy en expandir artículo — pendiente)
- Cambio biblioteca con FI CONFIRMADA sin confirmación explícita

---

## Iteración 1 (obsoleto parcial)

- PF usaban solo PELE evento IC aunque cabecera tuviera otra biblioteca — **corregido v2**
- Marca PF = columna Excel proforma — **corregido v2** (marca IC)

---

## Índice errores relacionados

| Código | Tema |
|--------|------|
| 4.02.03.010 | Admin IC botón verde no recalcula FI |
| 4.02.03.012 | Vincular listado PP |

**CHUSAR — integrado** · índice **2.3.1.7.5.3.13** · v3 Chusa modo biblioteca · deploy `b0d018a` · 2026-07-21
