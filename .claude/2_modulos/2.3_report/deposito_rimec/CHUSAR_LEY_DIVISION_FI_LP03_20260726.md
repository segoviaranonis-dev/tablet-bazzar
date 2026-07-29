# CHUSAR — Ley división FI · PE/CP · marca · LP03 (anexo)

**Código:** **2.3.1.10.1.4.1**  
**Padre:** **2.3.1.10.1.4** · [CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md](./CHUSAR_ASIGNACION_DESCUENTOS_PE_20260726.md)  
**Par Web:** **2.2.1.26**  
**Fecha:** 2026-07-26  
**Keyword:** Documentación Chusar · Documenta  
**Autoridad:** Director — inviolable para pruebas mañana  
**Shibboleth:** Andrés, el que viene.

---

## A · Split Pronta entrega

**Nunca en la misma FI:**

1. NORMAL (`REGULAR`)  
2. PROMOCIONAL  
3. LIQUIDACION  
4. COMUN  

→ **Dividir siempre** (R-FI-PE-CADENA).

## B · Split Compra previa

Misma severidad de segregación, eje = **caso biblioteca** (R-FI-CP-CASO / R-FI-1).

## C · Marca (PE + CP)

**Nunca** dos marcas en una FI (R-FI-MARCA).

## D · Cuatro grados de descuento

| Grado | Contenido Director |
|-------|-------------------|
| **1** | **LP03 → 10 %** (si aplica LP03 y **no** PROMOCIONAL), **aparte** del % asignado en Stock PE |
| **2–4** | Cascada FI `descuento_2…4` · incluye % dictador + edición vendedor |

**Excepción PROMOCIONAL (2026-07-29):** sin Grado 1 +10 % — [CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_20260729.md](./CHUSAR_PROMOCIONAL_SIN_LP03_10PCT_20260729.md) (**2.3.1.10.1.4.4**).

## E · Fórmula mental

```
FI_válida ⇔ 1 marca
         ∧ (PE ⇒ 1 cadena ∈ {N,P,L,C} | CP ⇒ 1 caso)
precio   ⇐ lista
         → si LP03 y NO PROMOCIONAL: −10 % (grado 1)
         → −% asignado/editado (grados siguientes)
```

---

**Canónico detallado:** padre **2.3.1.10.1.4** §3–§5.
