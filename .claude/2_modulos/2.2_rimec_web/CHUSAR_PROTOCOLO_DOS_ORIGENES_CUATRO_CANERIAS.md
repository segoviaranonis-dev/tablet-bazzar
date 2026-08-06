# CHUSAR — Protocolo dos orígenes · cuatro cañerías (CP ∥ PE)

**Código:** `2.2.1.46`  
**Fecha:** 2026-08-06  
**Keyword:** **Documenta** · Protocolo Chusar activado  
**App:** RIMEC Web `:3001` (convergencia UI) · paridad filtros Report donde aplique  
**Estado:** 🟢 Ley viva · local · ⛔ prod sellada `f408fc2`  
**Padre operativo:** [CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md](./CHUSAR_PROTOCOLO_HERMANOS_SIAMESES.md) (**2.2.1.44**)

---

## 0 · Veredicto Director (2026-08-06)

RIMEC Web une **dos divisiones herméticas** de producto. Cada una tiene su origen de verdad, sus filtros y sus subgrupos de venta. **No se mezclan leyes** entre orígenes; solo **convergen** en la misma grilla (modo Todos / fusión SKU).

| # | División | Origen de tipificación | Ámbito ramo | Hermético |
|---|----------|------------------------|-------------|-----------|
| **1** | **CP** — Compra previa | Biblioteca de **casos** (`descp_caso` / BCL / caso precio) | Calzado + Confecciones | Sí |
| **2** | **PE** — Pronta entrega | **Diccionario** pronta entrega + traducción **grupo uno** (`COD.GRUPO` / `pe_diccionario_cadena` / flags) | Calzado + Confecciones | Sí |

**Siempre son 4 cañerías** (proveedor × origen):

| Cañería | Proveedor | Origen | Vista stock |
|---------|-----------|--------|-------------|
| CP-calzado | **654** | `TRÁNSITO_PP` | `v_stock_rimec` |
| PE-calzado | **654** | `PRONTA_ENTREGA` | `v_stock_pe_rimec` |
| CP-confecciones | **638** | `TRÁNSITO_PP` | `v_stock_rimec` |
| PE-confecciones | **638** | `PRONTA_ENTREGA` | `v_stock_pe_rimec` |

Código fetch: `rimec-web/lib/catalogoPaginado.ts` (`cpCalzadoFilters` · `peCalzadoFilters` · `cpConfeccionesFilters` · `peConfeccionesFilters`).

---

## 1 · Hermetismo CP

- Tipifica por **caso de biblioteca**, no por `es_promo` / `es_liquidacion` / dígitos COD.GRUPO.
- Subconjunto comercial del chip **Tipo** (hermanos siameses): **Normal** · **Promo** (+ Carteras como módulo aparte, no confundir).
- **No existe liquidación en CP.** No hay columna `es_liquidacion` en tránsito; no hay badge LIQ CP; no hay latido `cp-liquidacion`.
- Shell / badge promo CP: biblioteca caso `PROMOCIONAL` → componente `PromoCasoBadge` → texto grilla **`PROMO`** (doc visual **2.2.1.21.G1**).

### NORMAL en CP (ley Director)

> **NORMAL = todo lo que venga de compra previa que no sea promo.**

Implementación canónica del chip «Normal»: casos biblioteca `CASOS_TIPO_NORMAL` en `filtro-tipo-canonico.ts` (`ACT-BRSPORT`, `BR-VZ-MD-MKA-O`, `BR-VZ-MD-ML-MKA-O`, …). Caso `PROMOCIONAL` → chip Promo. **No hay tercer chip LIQ en CP.**

---

## 2 · Hermetismo PE

- Tipifica por **diccionario PE** + decoder **grupo uno** (dígitos Carlos) + flags vista (`es_promo`, `es_liquidacion`, `cadena_comercial`).
- Prioridad comercial (ley siamese): **LIQ → Promo → Normal** (`2.2.1.18` · `4.01.04.002`).
- Subgrupos de venta / filtros en curso (dimensiones PE, no sustituyen el hermetismo CP):
  - Comercial Tipo: **NORMAL** (cadena `REGULAR`) · **PROMOCIONAL** · **LIQUIDACION** · **COMUN**
  - AB-CR / tipología: ABIERTO · CERRADO · **ESCOLAR** (d45=`08`, doc **2.2.1.45** · error `4.01.04.008`) · MEDIAS · etc.
- Badge promo PE: `PeProBadge` → texto grilla **`PRO`** (≠ texto CP).
- Badge liquidación PE: `PeLiqBadge` → **`LIQ`** (exclusivo PE).

### LIQUIDACIÓN (ley Director)

> **Liquidación es exclusiva de PE.** CP no la tiene.

Señales PE: `es_liquidacion` · `cadena_comercial=LIQUIDACION` · calzado 654 `d45=04` · confecciones 638 `d67=04`.

---

## 3 · Puntos de coincidencia (mismo filtro comercial)

### 3.1 PROMOCIONAL — misma cosa, dos etiquetas de grilla

| Origen | Señal tipificación | Etiqueta grilla | Filtro chip |
|--------|--------------------|-----------------|-------------|
| **CP** | Caso biblioteca `PROMOCIONAL` | **`PROMO`** | `tipo_grupos` / id **promo** |
| **PE** | `es_promo` · cadena `PROMOCIONAL` · d45=`02` (654) / d67=`03` (638) | **`PRO`** | mismo id **promo** |

**Ley:** son la **misma categoría comercial**. El filtro Promo **incluye ambos orígenes** en modo Todos. No inventar un chip «PRO» distinto de «PROMO» en la dimensión Tipo.

> **Nota oral vs canónico (2026-08-06):** en conversación se invirtió el nombre de las etiquetas. **Canónico en código y 2.2.1.21.G1:** CP = **PROMO** · PE = **PRO**. La sustancia (mismo filtro Promo) no cambia.

### 3.2 NORMAL — coincidencia de intención

| Origen | Qué entra en Normal |
|--------|---------------------|
| **CP** | Casos biblioteca no promocionales (ley: «todo CP que no sea promo») |
| **PE** | Cadena **REGULAR** · etiqueta UI diccionario **NORMAL** · sin LIQ ni Promo |

**Ley filtro:** chip Normal **no** debe listar filas que latean PRO/PROMO/LIQ (badge = filtro · `2.2.1.18`).

### 3.3 LIQUIDACIÓN — sin coincidencia en CP

| Origen | ¿Tiene LIQ? |
|--------|-------------|
| **CP** | **No** |
| **PE** | **Sí** (única) |

En modo Todos + filtro LIQ: tipifica **solo filas PE**; el CP no se reclasifica como liquidación (`catalogoFilters` · comentario «CP no tiene es_liquidacion»).

---

## 4 · Convergencia en RIMEC Web

```
RIMEC Web grilla
├── Cañería CP-calzado (654)     ─┐
├── Cañería PE-calzado (654)     ─┼─ Calzado · leyes por origen
├── Cañería CP-conf (638)        ─┤
└── Cañería PE-conf (638)        ─┘─ Confecciones · leyes por origen
         │
         ▼
   Modo Todos / fusión SKU · mismos chips Tipo (Normal · Promo · LIQ)
   · LIQ solo pega PE · Promo une CP+PE · Normal une CP no-promo + PE REGULAR
```

Docs fusión / latidos: `CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md` · **2.2.1.21.G1** · **2.2.1.28** (LEY TODOS).

---

## 5 · Archivos canónicos (auditoría 2026-08-06)

| Rol | Ruta |
|-----|------|
| Filtro Tipo Web | `rimec-web/lib/filtros/filtro-tipo-canonico.ts` |
| Filtro Tipo Report | `report/src/lib/filtros/filtro-tipo-canonico.ts` |
| Chips PE diccionario | `rimec-web/lib/filtros/filtro-tipo-pe-diccionario.ts` |
| Decoder COD.GRUPO | `rimec-web/lib/pilares/codGrupoCadena.ts` |
| peDiccionario | `rimec-web/lib/peDiccionario.ts` |
| Latidos shell | `rimec-web/lib/catalogoShellLatidos.ts` |
| 4 cañerías fetch | `rimec-web/lib/catalogoPaginado.ts` |
| Badge CP PROMO | `rimec-web/components/catalog/PromoCasoBadge.tsx` |
| Badge PE PRO | `rimec-web/components/catalog/PeProBadge.tsx` |
| Badge PE LIQ | `rimec-web/components/catalog/PeLiqBadge.tsx` |
| ESCOLAR AB-CR | `rimec-web/lib/filtros/pe-modulo-escolar.ts` |

---

## 6 · Enlaces Moria (no duplicar sustancia)

| Código | Doc | Rol |
|--------|-----|-----|
| **2.2.1.44** | Protocolo hermanos siameses | Maestro cascada / grupo uno / TODOS |
| **2.2.1.18** | Filtro Tipo siamese | LIQ > Promo > Normal |
| **2.2.1.21.G1** | Visual casino | Badges PRO / PROMO / LIQ |
| **2.2.1.25** · **2.2.1.27** · **2.2.1.28** | Tres hermanos / LEY TODOS | PE + home |
| **2.2.1.45** | AB-CR ESCOLAR | Subgrupo PE (no es LIQ) · referencia completa |
| **2.2.1.47** | Instalación filtros PE/AB-CR | Checklist portar a otros módulos |
| **2.3.1.10.1.2** | Diccionario grupo uno Excel | Decoder 654/638 |
| **2.3.1.10.1.2.1** | Ley DPE sin BCL | PE no tipifica con BCL |
| Errores | `4.01.04.002` · `4.01.04.007` · `4.01.04.008` | Promo/Normal · paginación · chip escolar |

---

## 7 · Checklist agente (antes de tocar Tipo / badges / cañerías)

1. ¿La fila es CP o PE? → aplicar **solo** la ley de ese origen.  
2. ¿Filtro Promo? → incluir CP `PROMOCIONAL` **y** PE promo (misma categoría).  
3. ¿Filtro Normal? → CP no-promo + PE REGULAR; **excluir** filas con badge PRO/PROMO/LIQ.  
4. ¿Filtro LIQ? → **solo PE**; nunca inventar LIQ en CP.  
5. ¿654 vs 638? → respetar cañería (calzado ≠ confecciones).  
6. ¿AB-CR ESCOLAR / MEDIAS? → dimensión PE tipológica; **no** confundir con chip Tipo comercial.  
7. ¿Cambio en Web? → chequear hermano Report el mismo turno (**2.2.1.44**).

---

**Shibboleth:** Andrés, el que viene.
