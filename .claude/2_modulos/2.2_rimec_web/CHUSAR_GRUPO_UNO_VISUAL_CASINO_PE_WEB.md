# CHUSAR — Grupo uno · Visual casino PE · Catálogo RIMEC Web

**Subcuenta:** **2.2.1.21.G1** · padre [RIMEC Web INDICE](../INDICE.md) · [Grupo uno Excel](../../2.3_report/deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md)  
**Código Moria:** **2.2.1.21.G1**  
**Fecha:** 2026-07-24  
**Keyword Director:** Protocolo Chusar activado · **Documentación Chusar**  
**Palabra reservada:** **grupo uno**  
**Estado:** 🟢 **LOCAL :3001** — convive CP (compras previas) + PE diccionario

---

## 1 · Objetivo

Aplicar **psicología de color casino** al catálogo RIMEC Web para el **grupo uno** del diccionario PE (NORMAL · PROMOCIONAL · LIQUIDACIÓN), **sin mezclar** con el shell azul de **Compras Previas (CP)** en la misma grilla.

| Origen | Shell | Latido | Etiqueta |
|--------|-------|--------|----------|
| **CP** (tránsito) | Fucsia pastel | `catalog-card-casino-fucsia` | **PROMO** · pill borde · texto oscuro (Corazón 1) |
| **PE NORMAL** | Gris/slate pastel | **No** | — |
| **PE PROMOCIONAL** | Fucsia pastel | **Sí** · 1,65 s | **PRO** · fucsia claro · texto oscuro (diccionario PE) |
| **PE LIQUIDACIÓN** | Oro pastel | **Sí** · 1,65 s · **≠ promo** | **LIQ** oro · esquina imagen |
| **Fusión CP+PE** | Violeta | No | Hereda PRO/LIQ del lote PE hero |

Shell promo CP+PE comparten latido **fucsia**. LIQ PE mantiene **`catalog-card-casino-oro`**. Badges: `catalog-pe-pro-badge` (PRO) · `catalog-cp-promo-badge` (PROMO) · `catalog-pe-liq-badge` (LIQ).

---

## 2 · Reglas visuales (Director 2026-07-24)

### NORMAL (REGULAR en BD)

- Fondo: `from-slate-100/80` · borde slate suave.
- **Sin latido** · sin etiqueta en imagen.
- D1 4 % (carrito · diccionario MIG-180).

### PROMOCIONAL

- Fondo shell: fucsia pastel (`catalog-card-casino-fucsia`) — **≠ LIQ oro**.
- Etiqueta **`PRO`** — cabecera PE · gradiente claro · **texto fucsia oscuro legible**.
- Etiqueta CP **`PROMO`** — pill borde grueso · texto oscuro · biblioteca caso.
- Detección PE: diccionario (`es_promo` / cadena / COD.GRUPO).
- Matriz: `catalogoShellLatidos.ts` · doc **2.2.1.25** · **2.2.1.27**.

### LIQUIDACIÓN

- Fondo: oro/ámbar pastel (`from-amber-50/90`).
- Clase shell: `catalog-card-casino-oro` · animación 1,65 s.
- Etiqueta **`LIQ`** dorada — **esquina superior derecha de la imagen** del calzado/confección.
- Badge LIQ tiene latido propio (`catalog-pe-liq-badge`) al **mismo ritmo** que el borde.

---

## 3 · Convivencia CP + PE en grilla

Doc base: [CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md](./CHUSAR_CATALOGO_TODOS_CP_PE_FUSION.md)

```
Filtro «Todos» / sin origen
    ├── Tarjeta CP  → shell azul · pp_id positivo · biblioteca caso
    └── Tarjeta PE  → shell grupo uno · pp_id negativo · diccionario COD.GRUPO
         └── Mismo SKU → tarjeta fusionada violeta · acordeón multi-lote
```

**Verificación local:** `:3001` → catálogo → origen vacío o alternar CP ↔ PE → tres cadenas PE visibles junto a CP.

---

## 4 · Código

| Pieza | Ruta |
|-------|------|
| Resolver visual PE | `rimec-web/lib/catalogoPeVisual.ts` |
| Badge PRO | `rimec-web/components/catalog/PeProBadge.tsx` |
| Badge LIQ | `rimec-web/components/catalog/PeLiqBadge.tsx` |
| Shell tarjeta | `rimec-web/components/catalog/CatalogTarjetaDeposito.tsx` |
| Grilla catálogo | `rimec-web/app/CatalogoGrid.tsx` |
| Animaciones casino | `rimec-web/app/globals.css` · `catalog-casino-pulse-fucsia` · `catalog-casino-pulse-oro` |
| Comercial / cadena | `rimec-web/lib/catalogoComercial.ts` |
| Diccionario D1 carrito | `rimec-web/lib/peDiccionario.ts` |

---

## 5 · CSS — ritmo casino unificado

```css
/* 1,65 s — PRO fucsia + LIQ oro · mismo ease-in-out */
.catalog-card-casino-fucsia { animation: catalog-casino-pulse-fucsia 1.65s … }
.catalog-card-casino-oro    { animation: catalog-casino-pulse-oro 1.65s … }
.catalog-pe-liq-badge        { animation: catalog-pe-liq-badge-pulse 1.65s … }
```

Legacy verde LIQ (`catalog-card-liquidacion-pulse`) **retirado** del catálogo Web grupo uno.

---

## 6 · Smoke local

1. `:3001` — login vendedor RIMEC.
2. Catálogo — filtro origen **Pronta Entrega** → tarjetas NORMAL (gris) · PRO (fucsia+latido) · LIQ (oro+LIQ arriba derecha).
3. Origen **Compras previas** → azul · sin PRO/LIQ PE.
4. **Todos** → mezcla CP azul + PE grupo uno en misma grilla.
5. Carrito PE vacío cabecera → D1 automático 4/2/2 según cadena.

---

## 7 · Referencias

- [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../../2.3_report/deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md)
- [CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md](./CHUSAR_ERROR_CALZADO_CARTERAS_MARIO_BROSS_20260724.md) — pill **Calzado** excluye carteras · `4.01.04.003`
- [CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md](../../2.3_report/deposito_rimec/CHUSAR_TRADUCTOR_NEXUS_COD_GRUPO_HIEDRA_PE.md)
- [CHUSAR_MARCA_LIQUIDACION_PE.md](./CHUSAR_MARCA_LIQUIDACION_PE.md) — superseded visual LIQ verde · usar este doc

**Orden Director:** Protocolo Chusar · visual casino grupo uno · CP+PE conviven · 2026-07-24.

**Handoff agentes:** [HANDOFF_DICCIONARIO_GRUPO_UNO_20260724.md](../../4_etapas/HANDOFF_DICCIONARIO_GRUPO_UNO_20260724.md)
