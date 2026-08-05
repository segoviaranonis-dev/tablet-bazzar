# CHUSAR — Metodología IC administrativa (liviana)

**Código:** **2.3.1.7.3.4**  
**Fecha:** 2026-07-18 · Director **Documenta**  
**Padre:** [CHUSAR_INTENCION_COMPRA.md](./CHUSAR_INTENCION_COMPRA.md) · [CHUSAR_INYECCION_DATOS_TRANSITO_IC.md](./CHUSAR_INYECCION_DATOS_TRANSITO_IC.md)  
**Aplicación:** Report PP · inject · UI  
**Shibboleth:** Andrés, el que viene.

---

## Doctrina

La **intención de compra** es un proceso **administrativo**. No es el lugar de las restricciones comerciales duras.

| Campo | Rol |
|-------|-----|
| Cliente · vendedor · marca · pares · plazo · quincena | Identidad operativa |
| `monto_bruto` | Puede ser **0** (cliente especial) |
| `descuento_1..4` | **Verdad de cabecera** → heredan Pre-FI / FI / CSV |
| `listado_precio_id` · `precio_evento_id` | **Opcionales** en alta IC |

Las restricciones de listado, evento y precio se aplican en **RIMEC Web** y en el **proceso de facturación / FI**, no al crear la IC.

---

## UI Pedido Proveedor (fix 2026-07-18)

- Tab IC: muestra y edita D1–D4; PATCH persiste y recalcula `monto_neto`.
- Admin IC: etiqueta compacta `25+10` bajo monto.
- Guardar IC **no** exige LP aunque sea PROGRAMADO.

---

## Inject / adaptar

- LP y evento: opcionales (null OK).
- ERP (`COD.CLIENTE`, `LIST.PREC`, …): marca/vendedor por **nombre** (COD ERP ≠ FK Nexus).
- Quincena: texto (`2DA JULIO`) o código numérico 1–24.
- Scripts: `adaptar_excel_ic_chusar.mjs` · `inject_ic_programado_excel.mjs`

---

## Nota Digitación

El puente Digitación → PP **sí** pide `precio_evento_id` en la API actual (puente `intencion_compra_pedido`). Eso no contradice la IC liviana: el evento se fija al **asignar al PP**, no al inyectar la IC.

---

**Evidencia lote:** [CHUSAR_IC_LOTE_0839_PP24_20260718.md](./CHUSAR_IC_LOTE_0839_PP24_20260718.md)
