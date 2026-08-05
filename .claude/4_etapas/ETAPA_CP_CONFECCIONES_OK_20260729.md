# ETAPA — CP confecciones ok · catálogo 638

**Code:** `CP-CONFECCIONES-OK-20260729`  
**Código módulo:** **2.2.1.36** · RIMEC Web · ramo **638**  
**Estado:** ⬛ **CERRADA ADMINISTRATIVA** 2026-08-04 · [CERRADA](./ETAPA_CP_CONFECCIONES_OK_20260729_CERRADA.md) · corte Moises  
**Apertura:** 2026-07-29 · keyword Director **Nueva etapa** · «CP confecciones ok»  
**App:** http://localhost:3001/?origen_tipo=TRÁNSITO_PP&ramo_tipo=CONFECCIONES  
**Antecedente cerrado:** [ETAPA_IMPORT_CP_CONFECCIONES_638_20260721_CERRADA.md](./ETAPA_IMPORT_CP_CONFECCIONES_638_20260721_CERRADA.md) · [ETAPA_STOCK_PE_CALZADO_654_20260729_CERRADA.md](./ETAPA_STOCK_PE_CALZADO_654_20260729_CERRADA.md) (PE 654 cerrado hoy)  
**Shibboleth:** Andrés, el que viene.

---

## Objetivo

Dejar **Compra previa confecciones 638** operativa en RIMEC Web al mismo nivel de madurez que calzado 654 CP+PE: grilla vendible, filtros pilares, tarjetas/lightbox **638 ≠ 654**, carrito y smoke end-to-end.

---

## Alcance Fase 1

| # | Entregable | Estado |
|---|------------|--------|
| 1 | Origen **TRÁNSITO_PP** + pill **Confecciones** · grilla con tarjetas CP | ✅ smoke local 2026-07-29 |
| 2 | Meta sidebar CP 638 (marca Kyly/Milon/RIMEC · estilos confecciones · sin calzado 654) | ✅ |
| 3 | Tarjeta triunvirato estilo 638 (col J CP) · subtítulo material/color | ✅ verificar [CHUSAR_ESTILO_TARJETA_638](../2_modulos/2.2_rimec_web/CHUSAR_ESTILO_TARJETA_638_TRIUNVIRATO_20260727.md) |
| 4 | Lightbox colores dedupe tallas · panel precio 638 | ☐ parpadeo color pendiente |
| 5 | Percepción velocidad catálogo (SWR 30 · cache Confecciones) | ☐ [2.2.1.33](../2_modulos/2.2_rimec_web/CHUSAR_CATALOGO_PERCEIVED_PERFORMANCE_20260728.md) |
| 5b | Imagen hold sin parpadeo nombre (ProductImage · lightbox) | ✅ [2.2.1.37](../2_modulos/2.2_rimec_web/CHUSAR_IMAGEN_HOLD_SIN_PARPADEO_20260729.md) · Documenta+publica 2026-07-29 |
| 5c | Scope ramo por login (DARIO/PATRICIA solo 638 · resto vendedores solo 654) | ✅ [2.2.1.38](../2_modulos/2.2_rimec_web/CHUSAR_CATALOGO_SCOPE_RAMO_POR_USUARIO_20260730.md) · Documenta+despliega 2026-07-30 |
| 6 | Pill **Todos** CP+PE confecciones sin mezclar calzado | ☐ [2.2.1.0.6](../2_modulos/2.2_rimec_web/CHUSAR_AUDITORIA_FILTRO_RAMO_CONFECCIONES_3001.md) |
| 7 | Carrito CP confecciones · aprobaciones | ☐ smoke |
| 8 | Deploy prod RIMEC Web | ☐ solo cierre etapa u orden **DESPLIGA** Director |

---

## Regla de oro

**638 confecciones ≠ 654 calzado** — peras y aceite. Toda rama tras `isConfecciones638Lote()` / `tipo_v2_id===2`. Doc: [CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md](../2_modulos/2.2_rimec_web/CHUSAR_CONFECCIONES_REGLAS_PROPIAS_638.md).

---

## Fuera de alcance (salvo orden)

- PE confecciones (etapa aparte si Director la pide).
- Pilares / import masivo Kyly (Report · IC/PP).
- Logística Rimec TXT (**sigue en curso** en paralelo).

---

## Smoke mínimo cierre

1. `:3001` → Compra previa → Confecciones → ≥30 tarjetas · marcas 638.
2. Lightbox: 1 miniatura por color · tallas en acordeón.
3. Carrito → aprobación sin regresión calzado 654.

---

## Ops Documenta (2026-08-02)

| Hecho | Doc |
|-------|-----|
| Reimport PP-49 **Hoja2** · **986 SKUs · 4988 prendas** | [CHUSAR_REIMPORT_CP638_PP49_20260802.md](../2_modulos/2.3_report/gestion_compra/CHUSAR_REIMPORT_CP638_PP49_20260802.md) · **2.3.1.33.3** |
| Protocolo gradas 638 holding | [PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md](../3_arquitectura/3.2_venta_tienda/PROTOCOLO_GRADA_ABIERTA_638_HOLDING.md) · **3.02.00.638** |
| Error Bazzar ok_grada | [4.05.03.002](../5_errores/detalle/4.05.03.002_bazzar-638-ok-grada-sin-am-talle.md) |
| Handoff cierre día | [PENDIENTES_INICIO_DIA_20260803.md](./PENDIENTES_INICIO_DIA_20260803.md) |

**Pendiente mañana:** Motor 4 líneas Milon (175 pares) · imágenes/precio tarjetas · lightbox · carrito · `am_talle` ALM Bazzar.

---

## Cierre Navegador (:3004) — al decir «Cierra etapa»

| Check | Hecho |
|-------|:-----:|
| `ETAPA_CP_CONFECCIONES_OK_20260729_CERRADA.md` | ☐ |
| `ACTUAL.md` + índice **2.2** | ☐ |
| `etapas.json` → `estado: "hecho"` + `cerradasPorModulo.rimec-web` | ☐ |
| Verificado `:3004/etapas` | ☐ |
