# ETAPA CERRADA — Stock PE calzado 654 · compra previa operativa

**Code:** `STOCK-PE-CALZADO-654-20260729`  
**Fecha cierre:** 2026-07-29  
**Keyword Director:** **cierra esa Etapa Stock PE** · calzado **654** · compra previa ya operativa  
**Módulo Moria:** **2.3.1.10** · Web PE/CP · Aprobaciones **2.3.1.3**  
**Apps:** Report `/stock-pronta-entrega` · RIMEC Web catálogo PE · `/aprobaciones`  

---

## Alcance cerrado (ratificado Director)

| Pieza | Estado |
|-------|--------|
| Stock PE calzado **654** (import sdrm / DPE · Web) | ✅ Operativo |
| **Compra previa** (CP) | ✅ Ya estaba cerrada / ejercida antes de este acto |
| Descuentos PE · PROMO sin +10 % LP03 · siamese Estilo/Género pilares | ✅ 2.3.1.10.1.* / 2.2.1.34–35 |
| Aprobaciones UI Pendiente · Aprobado · Anulado (SSR liviano) | ✅ **2.3.1.3.2** · Report `3588f9c` |
| Batch `sdrm2121` import + overwrite Guido | ✅ Operativo (**2.3.1.10.1.5**) · asignación % puede seguir en piso |

## Fuera de este cierre

| Code / tema | Nota |
|-------------|------|
| `LOGISTICA-RIMEC-TXT-20260728` | **Sigue `en_curso`** |
| PE confecciones **638** | Otro paquete · no este cierre |
| Fix nav carrito→catálogo (Seguir comprando) | Código local Web · deploy pendiente si Director ordena |

---

## Cierre Navegador (:3004) — OBLIGATORIO

| Check | Hecho |
|-------|:-----:|
| `etapas.json` → `trabajoVivo[].estado` = `"hecho"` (fila STOCK-PE-CALZADO-654) | ✅ |
| Entrada en `cerradasPorModulo.report` | ✅ |
| `ultimaCerradaPorModulo.report` | ✅ |
| `actualizado` bump en raíz JSON | ✅ |
| Verificado `:3004/etapas` (tarjeta PE 654 fuera de «Trabajando ahora»; Logística + CP confecciones abiertas) | ✅ |

**Shibboleth:** Andrés, el que viene.
