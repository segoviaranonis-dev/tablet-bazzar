# 2.3.1.35.4 — Precio del PDF = PPD (Alejandro Magno) · no listado vivo

**Código:** **2.3.1.35.4**  
**Fecha:** 2026-08-01 · **Documenta**  
**Error:** [4.02.05.002](../../../5_errores/detalle/4.02.05.002_report-auto-informes-precio-listado-vs-ppd-am.md)  
**Padres:** Certificación CP **2.3.1.7.5.3.8** · Hiedra PE · DPE  
**Shibboleth:** Andrés, el que viene.

---

## Entendimiento Director (canónico)

| Flujo | Cómo nace el precio | Qué lee Web / qué debe leer el PDF |
|-------|---------------------|-------------------------------------|
| **Compra previa** | Motor → **vincular listado** → snapshot en **PPD** | `ppd.precio_lpn` (+ LPC) |
| **SPE / DPE** | CSV SDRM **LPN** → PPD PE + cadena COD.GRUPO | PPD PE · segregación LPN/LPC03 |

El “precio vigente en RIMEC Web” **no es otra fuente**: es el **mismo PPD** expuesto por vistas.  
Usar §7 Listados como si el PDF recalculara desde Motor = **error de arquitectura**.

---

## Implicación panel Control PE

- Filtros (origen · depósito · ramo · marca · AB-CR · Tipo DPE) = **qué artículos**.  
- Precio = **siempre** columnas PPD / vista stock del origen.  
- `biblioteca_precio_ids` en SQL: opcional contexto — **no** campo de LPN.
