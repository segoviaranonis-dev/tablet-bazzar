# CHUSAR — Catálogo Bazzar · grada ropa + filtros siameses · precarga receteo

**Código:** **2.5.1.11**  
**Fecha:** 2026-08-02  
**Keyword:** **Documenta** · **Cierra etapa** · **publica** (Director)  
**App:** Bazzar Web `:3002/catalogo`  
**Etapa:** `AUDITORIA-INTEGRIDAD-STOCK-BAZZAR-20260801` → **CERRADA**  
**Shibboleth:** Andrés, el que viene.

---

## Contexto

Antes del **receteo** de Bazzar Web (carga real desde RIMEC / PE), el catálogo tienda debía:

1. Dejar de pintar grada zapato **34–39** en Kyly (638) y ACTVITTA PRENDAS (654).
2. Traer filtros **hermanos siameses** (Ramo + Tipo) alineados a RIMEC Web.
3. Vender en **caja abierta** (qty por talle), no curva cerrada 8/12.

---

## Entregables código

| Pieza | Ruta |
|-------|------|
| Filtro Tipo siamese | `bazzar-web/lib/filtros/filtro-tipo-canonico.ts` |
| Enrich 638 PPD | `bazzar-web/lib/catalogo/enrich-grada-638.ts` → `loadPpdAmTalleIndex` |
| Enrich 654 PRENDAS PE | mismo · `loadPePrendasAmTalleIndex` (DPE `tipo0=PRENDAS`) |
| Catálogo page | `app/(public)/catalogo/page.tsx` · ramo · tipo · remap |
| Filtros UI | `FiltrosCatalogo.tsx` · Todos/Calzado/Confecciones · Normal/Promo/… |
| Card | `ProductoCard.tsx` · `pares` vs `prendas` · chips talle×qty |

---

## Reglas grada (caja abierta)

| Universo | Fuente talle | Unidad | Prohibido |
|----------|--------------|--------|-----------|
| **638 Kyly** | PPD `am_talle` | prendas | `talla_codigo` ALM 34–39 |
| **654 PRENDAS** (ACTVITTA ACT ROPAS) | PE `v_stock_pe_rimec.grada` → P/M/G/GG | prendas | idem ALM |
| **654 calzado** | `talla_codigo` ALM | pares | — |

Stock ALM se **reparte** entre talles canónicos (Σ = total Web). Carrito reusa `combinacion_id` del pool ALM.

---

## Filtros siameses

| Chip | Comportamiento |
|------|----------------|
| Ramo Calzado | `proveedor_importacion_id=654` · excluye carteras por defecto (Mario Bros) |
| Ramo Confecciones | `proveedor_importacion_id=638` |
| Tipo Normal/Promo/Liquidación/Carteras | `filtro-tipo-canonico` · señales `stock_sano_caso` + estilo |

Paridad madre: `rimec-web/lib/filtros/filtro-tipo-canonico.ts` (**2.2.1.18**).

---

## Smoke PASS (local)

| Check | Evidencia |
|-------|-----------|
| Kyly Confecciones | chips 1·P·4·6·8·10… · prendas |
| ACTVITTA 40000·2 | chips **P·M·G·GG** · 8 prendas (desde PE) |
| Σ stock | igual a ALM pre-remap |

---

## Receteo — nota ops

Tras deploy: carga real ALM_WEB / Stock Sano desde pipeline RIMEC.  
Esta UI **no inventa** talles: solo traduce contaminación ALM con verdad **PPD (638)** o **PE PRENDAS (654)**.

**Deploy:** autorizado en cierre etapa + orden **publica** Director 2026-08-02.

---

## Relación

| Código | Rol |
|--------|-----|
| **2.5.1.7** | Estadísticas de Stock LOCAL |
| **2.5.1.8** | Roadmap adecuación F0–F4 |
| **2.5.1.10** | Grada siamese Estadísticas↔catálogo |
| **2.5.1.12** | Mapa DPE/PE ACTVITTA PRENDAS |
| **3.02.00.638** | Protocolo grada abierta holding |
