# 2.3.1.35.12 — PDF Stock PE · Confecciones 638 · pivot precio

**Código:** **2.3.1.35.12**  
**Fecha:** 2026-08-04 · **Documenta**  
**Padre:** Automatización **2.3.1.35** · Espíritu cocina **2.3.1.35.11** · Reglas 638 propias (memoria confecciones)  
**Shibboleth:** Andrés, el que viene.

---

## Eureka

Layout **654** (grada caja + un precio) **no** aplica a confecciones **638**. Cocina mezclaba cantidades/precios (ej. línea con varios LPN → PDF mostraba uno).

**Ley:** `638 ≠ 654`. Pivot = **precio**; debajo **tallas/prendas**.

---

## Implementación

| Pieza | Ruta |
|-------|------|
| Generador | `report/src/lib/automatizacion-informes/generar-pdf-stock-pe-638.ts` |
| Agrupación | `agrupar638PorPrecio` · tarjeta L+R+M+C · buckets por precio |
| Cable cocina | `run-envio.ts` · si `ramoPdf === "CONFECCIONES"` → generador 638 |
| Calzado | sigue `generar-pdf-stock-pe.ts` (654) |

Cabecera: `STOCK PRONTA ENTREGA · PROVEEDOR 638` · nombre = `MARCA · TIPO0 · TIPO1 · TIPO2`.

---

## Smoke

| Archivo | Grupo | Nota |
|---------|-------|------|
| `.tmp/pdf-638-smoke/KYLY_G1001020100_NR_LPN.pdf` | FEM VERANO ACTUAL | 1668 prendas · layout OK |
| Ver tipificación visual | — | error **4.02.05.004** · doc **2.3.1.35.13** |

---

## Relacionados

- [2.3.1.35.13](./CHUSAR_DPE_TIPIFICACION_VS_VISUAL_TEMPORADA_20260804.md) — DPE vs aspecto temporada  
- [2.3.1.35.11](./CHUSAR_ESPIRITU_GENERADOR_133_LPN_LPC03_LPC04_20260802.md) — cocina 133×3  
- Pendientes: [PENDIENTES_COCINA_PDF_BANDEJA_20260804.md](../../../4_etapas/PENDIENTES_COCINA_PDF_BANDEJA_20260804.md)
