# CHUSAR — Cotización · Logística OK · valor actual ⅓

**Código:** **2.3.1.28.4** · **Etapa:** `LOGISTICA-OK-20260719`  
**Actualizado:** 2026-07-22 · orden **Documenta** Director  
**Shibboleth:** Andrés, el que viene.

---

## Regla Director (corte 2026-07-22)

El **valor actual** del módulo Logística OK en la cotización del Navegador (`:3004/cotizacion` · prod Moria Chusar) es **⅓ (un tercio)** del costo de reposición del módulo completo.

No confundir con % de fases del plan técnico: la fracción **comercial** la fija el Director.

---

## Cifras (metodología PM × USD 9.000)

| Concepto | PM | USD reposición |
|----------|-----|----------------|
| **Módulo completo** (2.3.1.28) | 2,5 – 3,5 | **USD 22.500 – 31.500** |
| **Valor actual entregado (⅓)** | ~0,83 – 1,17 | **USD 7.500 – 10.500** |

---

## Qué entra en el tercio documentado

| Pieza | Estado |
|-------|--------|
| MIG-167 · tabla puente · bandera PP | ✅ local / audit |
| Botón **Fecha de entrega Real** · sync FI | ✅ |
| UI `/logistica-ok` bandeja pendiente | ✅ local |
| Smoke vendedor/gerencia · **Publicar** | ⏳ |
| Mapa geo · cierre etapa | ⏳ fuera del tercio |

---

## Dónde vive en código

| Artefacto | Ruta |
|-----------|------|
| Datos cotización | `nexus-navegador-holding/src/lib/cotizacion-productos.ts` → `MODULOS_EN_DESARROLLO` |
| UI | `nexus-navegador-holding/src/components/CotizacionProductos.tsx` |
| Prod | https://moriachusar.vercel.app/cotizacion |

---

## Referencias

- [CHUSAR_LOGISTICA_OK_PLAN_ACCION.md](./CHUSAR_LOGISTICA_OK_PLAN_ACCION.md)
- [ETAPA_LOGISTICA_OK_20260719.md](../../../4_etapas/ETAPA_LOGISTICA_OK_20260719.md)
- [CHUSAR_NAVEGADOR_PROGRAMA.md](../../../1_fundamentos/CHUSAR_NAVEGADOR_PROGRAMA.md)

**Integrado:** 2026-07-22 · **Documenta**
