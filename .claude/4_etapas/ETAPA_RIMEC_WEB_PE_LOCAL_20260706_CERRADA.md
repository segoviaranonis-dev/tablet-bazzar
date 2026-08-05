# ETAPA: RIMEC WEB · PE + CP — CERRADA (go-live)

**Código:** `RIMEC-WEB-PE-LOCAL-20260706` · **2.2.1.2**  
**Fecha inicio:** 2026-07-06  
**Fecha cierre:** 2026-07-12  
**Ejecutor:** Cursor (Auto)  
**Director:** Héctor Segovia — **Cierra etapa** + **Despliega**  
**Estado:** ✅ CERRADA

---

## Objetivo

Catálogo RIMEC Web **Compra previa + Pronta entrega** (calzado + confecciones) validado en local y desplegado a prod.

---

## Entregables

| Entrega | Evidencia |
|---------|-----------|
| Precio PE LPC03 → fallback LPN | `getPrecioActivoPe` · commits `2cccc0e` · `c757dbf` |
| Smoke CP + PE calzado + PE confecciones | PASS 2026-07-12 |
| `npm run build` | PASS |
| CHUSAR go-live | [CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md](../2_modulos/2.2_rimec_web/CHUSAR_RIMEC_WEB_GO_LIVE_CP_PE.md) |
| Deploy prod | orden Director **Despliega** · tip **`c757dbf`** · push `e380dd7..c757dbf` · https://rimec-web.vercel.app |

---

## Pruebas post-deploy (regla Director 2026-07-12)

Todas las FI / pedidos generados en prueba con usuario **Héctor · Nivel Dios** se **eliminan o revierten** al terminar la prueba, **solo con orden explícita** del Director.  
Doc: [CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md](../2_modulos/2.2_rimec_web/CHUSAR_PRUEBAS_HECTOR_DIOS_REVERSION.md)

---

## Cierre Navegador (:3004) — OBLIGATORIO

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → `trabajoVivo[].estado` = `"hecho"` | ✅ |
| Entrada en `cerradasPorModulo.rimec-web` | ✅ |
| `actualizado` bump en raíz JSON | ✅ |
| Verificado `:3004/etapas` (tarjeta fuera del maratón) | ⏳ Director |

---

**Shibboleth:** Andrés, el que viene.
