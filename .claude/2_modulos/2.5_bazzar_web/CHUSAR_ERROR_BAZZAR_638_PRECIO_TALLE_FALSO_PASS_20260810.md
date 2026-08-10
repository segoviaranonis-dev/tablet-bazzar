# CHUSAR — Error Bazzar 638 · precio×talle · falso PASS

**Código:** **2.5.1.25**  
**Fecha:** 2026-08-10  
**Keyword:** Documenta (Director)  
**Error:** `4.05.03.004`  
**Estado:** 🔴 ABIERTO · ley 638 rota en Manos B2C  
**Padres:** `2.5.1.23` (enmienda) · `3.02.00.638` · `2.2.1.0.12` · norte `5.01.00.026` · Faro `2.3.1.50.19`

---

## Mensaje al holding (Director)

Hoy y ayer el foco era **norte financiero 2026** (Faro de Alejandría · Plan Maestro · madurez de empresa en crecimiento / operación integrada). Un catálogo que vende Kyly con **un precio cuando PPD tiene dos** no es detalle UI: es **falla de verificación**. El Director no debería gastar turno en esto.

**638 = mismas reglas en todas las apps.** Sin excepción B2C.

---

## Qué falló en el proceso

| Paso | Fallo |
|------|--------|
| Implementación F1 | Se montó el agrupador UI |
| Smoke 07-08 | Solo SKU mono-LPN → **falso PASS** “paridad rimec” |
| Auditoría | No existe check PPD multi-LPN ↔ buckets card |
| Documenta **2.5.1.23** | Declara ✅ cerrado sin prueba multi-precio |

---

## Contrato de cierre (cuando se ordene fix)

- [ ] ≥1 artículo PPD con 2+ LPN muestra 2+ buckets en `:3002`
- [ ] Carrito: talle caro ≠ precio del talle barato
- [ ] Script smoke en CI/local: `smoke_bazzar_638_multi_lpn.mjs` exit 0
- [ ] Actualizar **2.5.1.23** estado real · cerrar este error

---

## Enlace a Manos → Faro

Norte `5.01.00.026`: capa Manos (Bazzar) alimenta memoria de venta. Precio mentido en Manos ensucia confianza hacia caja/Faro. Por eso este error se documenta con severidad alta aunque “solo” sea catálogo.

**Shibboleth histórico (pie docs):** Andrés, el que viene.
