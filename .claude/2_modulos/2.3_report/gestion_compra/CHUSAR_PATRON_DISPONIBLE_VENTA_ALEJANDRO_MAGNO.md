# CHUSAR — Patrón Disponible y Venta · Alejandro Magno · Panel macro

**Código:** **2.3.1.18**  
**Ratificado:** Director · 2026-07-08  
**Etapa:** [ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md](../../../4_etapas/ETAPA_OPERATIVO_ALEJANDRO_MAGNO.md) · **2.3.1.12**  
**Shibboleth:** Andrés, el que viene.

> **Propósito:** fijar el **patrón transversal** del holding — cada madre comercial tiene **dos circuitos** (proceso/tránsito vs pronta entrega) con métricas **Disponible + Venta**, salvo **programado** (solo venta · disponibilidad 100% eficiente). El **Panel de Control** es la lente **macro** sobre los tres grupos usando la **grilla estándar de productos**.

**Padres:** [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md) · [CHUSAR_MERCADERIA_EN_TRANSITO.md](./CHUSAR_MERCADERIA_EN_TRANSITO.md) · [CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md](./CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md)

---

## 1 · Ley gemela — dos circuitos por madre

Así como **Facturación** y **Depósito RIMEC** ya tienen par **proceso + pronta entrega**, **Pedido Proveedor** y el **Panel Alejandro Magno** siguen la **misma simetría**.

| Madre | Circuito A · **Proceso / tránsito** | Circuito B · **Pronta entrega** |
|-------|-------------------------------------|----------------------------------|
| **Facturación** | `/facturacion/transito` | `/facturacion/pronta-entrega` |
| **Depósito RIMEC** | `/deposito-rimec/proceso` | `/stock-pronta-entrega` *(ex importado)* |
| **Pedido Proveedor** | Lista + detalle **Compra previa** · venta en tránsito | Import CSV PE → PPD `quincena_desc = 'Pronta entrega'` |
| **Panel estrategia** | `/stock-transito` | `/stock-pronta-entrega` |

Docs gemelos: [CHUSAR_FACTURACION_PRONTA_ENTREGA.md](../facturacion/CHUSAR_FACTURACION_PRONTA_ENTREGA.md) · [CHUSAR_DEPOSITO_RIMEC.md](../deposito_rimec/CHUSAR_DEPOSITO_RIMEC.md)

---

## 2 · Métricas canónicas — Disponible y Venta

### 2.1 · Fórmula (molécula PPD)

```text
INICIAL   = cantidad_pares          (comprado / importado)
VENDIDO   = pares_vendidos          (canónico · paridad Web / FI confirmada)
DISPONIBLE = GREATEST(inicial − vendido, 0)   ← «Saldo» en UI
```

**Prohibido en KPI Panel y estrategia:** sumar `venta_transito` legacy cuando existe `pares_vendidos` canónico. Ver [CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md](./CHUSAR_PANEL_CONTROL_COMPRA_PREVIA.md).

### 2.2 · UI grilla estándar (`GrillaPeImportadora` + `showVentas`)

| Bloque tarjeta | Label UI | Campo |
|----------------|----------|-------|
| Comprado | Comprado / Inicial | `cantidad_inicial` |
| Vendido | Vendido | `pares_vendidos` |
| Pie tarjeta | Saldo … p | **Disponible** (`cantidad` / saldo vivo) |

Componentes: `PeCardMiniatura` · `GradaImportadoraAcordeon` · vitales `TransitoVentasVitales` / `PeVentasRegistroBar`.

---

## 3 · Por entidad Alejandro Magno

| Entidad | PP / origen | Disponible + Venta | Programado especial |
|---------|-------------|--------------------|---------------------|
| **STOCK · Pronta entrega** | CSV → staging/PPD PE | ✅ **Disponible + Venta** | — |
| **COMPRA PREVIA · Tránsito** | IC → PP → PPD · Web `TRÁNSITO_PP` | ✅ **Disponible + Venta** | Catálogo RIMEC Web |
| **PROGRAMADO** | IC cat. 3 → PP · proforma SHOP | ⚡ **Solo Venta** (macro) | Disponibilidad **100% eficiente** |

### 3.1 · Compra previa — dos capas (ratificado Director)

| Capa | Ruta | Rol |
|------|------|-----|
| **Pedido Proveedor compra previa** | `/proceso-importacion/pedido-proveedor?ramo=compra_previa` | Operativa · cabecera · proforma · IC · FI · digitación |
| **Venta en tránsito** | `/stock-transito` | Estrategia · **Disponible + Venta** · grilla multi-PP · bibliotecas · Llegada |

Detalle un PP: `…/pedido-proveedor/[ppId]?tab=stock` — grilla moléculas **vendibles** del lote (misma fórmula, universo = 1 PP).

Doc operativa PP: [CHUSAR_UNIVERSO_TRANSITO_PP.md](../proceso_importacion/CHUSAR_UNIVERSO_TRANSITO_PP.md) · [CHUSAR_PP_TAB_STOCK.md](../proceso_importacion/CHUSAR_PP_TAB_STOCK.md)

### 3.2 · Programado — solo venta (100% eficiente)

**Ley Director:** el lote programado **no** compite en catálogo Web · toda la mercadería nace para **venta directa** (FI por IC/SHOP). No hay «saldo ocioso» en el sentido CP — la eficiencia es **100%**: lo importado es objeto de facturación.

| Capa | Ruta | KPI macro |
|------|------|-----------|
| **Pedido Proveedor programado** | `…/pedido-proveedor?ramo=programado` | Operativa · proforma 8604 · 10 FI |
| **Venta programado** | `/stock-programado` | **Vendido** protagonista · Inicial referencia · saldo secundario |

Panel hub tarjeta **PROGRAMADO**: muestra Inicial/Vendido/Saldo por paridad SQL, pero la **grilla estrategia** enfatiza **venta** (`showVentas`) — no simula catálogo «disponible para browse».

Doc: [CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md](./CHUSAR_STOCK_PROGRAMADO_ESTRATEGIA_VENTAS.md) · [PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md](../proceso_importacion/PROTOCOLO_IMPORT_PROFORMA_PROGRAMADO.md)

---

## 4 · Panel de Control — lente macro

**Ruta hub:** `/rimec?mundo=panel-control`

```text
                    PANEL DE CONTROL (macro)
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   STOCK · PE          COMPRA PREVIA          PROGRAMADO
   Disp + Venta         Disp + Venta           Solo venta
        │                     │                     │
        └────────── Ver productos → ────────────────┘
                              │
                    GRILLA ESTÁNDAR PRODUCTOS
              (cabecera TrianguloHeaderDeposito + GrillaPeImportadora)
```

| Regla | Contenido |
|-------|-----------|
| Hub | **Solo KPIs** · sin grilla embebida · [CHUSAR_PANEL_CONTROL_HUB_NAVEGACION](./CHUSAR_PANEL_CONTROL_HUB_NAVEGACION.md) |
| Interior | Hoja independiente · cabecera estándar + grilla · análisis **macro→micro** |
| Unificación | **Una grilla** (`GrillaPeImportadora`) · `showVentas` según entidad |
| **Culminación** | **[Herramienta de reposición!!!](./CHUSAR_HERRAMIENTA_REPOSICION_ALEJANDRO_MAGNO.md)** · `/herramienta-reposicion` · **2.3.1.22** · fusión PE+CP+PROG en una grilla |
| CP paridad | KPI COMPRA PREVIA = Estadísticas RIMEC Web |

**Pregunta que responde el Panel:** ¿Cómo va la venta de cada grupo (PE · tránsito CP · programado) a nivel holding, antes de entrar al PP individual?

---

## 5 · Mapa completo rutas (ratificación 2026-07-08)

| Grupo ventas | Operativa (PP / bandeja) | Estrategia Disp+Venta | Facturación gemela | Depósito gemelo |
|--------------|--------------------------|------------------------|--------------------|-----------------|
| **PE** | Import CSV · `/deposito-rimec` | `/stock-pronta-entrega` | `/facturacion/pronta-entrega` | `/stock-pronta-entrega` |
| **CP tránsito** | `/pedido-proveedor?ramo=compra_previa` | `/stock-transito/disponible` · `/stock-transito/ventas` | `/facturacion/transito` | `/deposito-rimec/proceso` |
| **Programado** | `/pedido-proveedor?ramo=programado` | `/stock-programado` *(solo venta)* | FI directa · CSV 8604 | — *(sin catálogo)* |

---

## 6 · Implementación Report (estado)

| Pieza | Estado |
|-------|--------|
| Hub Panel 3 tarjetas compactas | ✅ |
| `/stock-transito` Disp+Venta | ✅ |
| `/stock-pronta-entrega` Disp+Venta | ✅ |
| `/stock-programado` venta (`showVentas`) | ✅ |
| **`/herramienta-reposicion`** (4 paneles · culminación) | ✅ v1 local · **2.3.1.22** |
| PP lista ramos CP/programado | ✅ |
| PP detalle grilla comercial `?tab=stock` | ⚠️ paridad parcial (Ala Norte plano) |
| Facturación gemela transito/PE | ✅ doc · UI |
| Depósito gemelo proceso/importado | ✅ |

---

## 7 · Smoke estrategia

1. Panel hub → tres KPIs coherentes con Estadísticas Web (CP).
2. **Ver productos →** CP → grilla con Comprado/Vendido/Saldo por molécula.
3. Programado → grilla enfatiza vendido · sin expectativa catálogo Web.
4. PP compra previa detalle → misma molécula que fila en `/stock-transito` (mismo `ppd_id`).
5. Facturación transito vs PE discrimina origen sin duplicar tablas FI.

---

## Índice

- [CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md](./CHUSAR_ALEJANDRO_MAGNO_TRES_ENTIDADES.md)
- [CHUSAR_PANEL_CORAZON_CASO_PRUEBA_DUAL.md](./CHUSAR_PANEL_CORAZON_CASO_PRUEBA_DUAL.md)
- [MAPA_PANEL_CP_TRANSITO_STOCK_VENTAS.md](./MAPA_PANEL_CP_TRANSITO_STOCK_VENTAS.md)
- [INDICE.md](./INDICE.md)
