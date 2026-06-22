# Crear biblioteca — Motor de Precios

**Subcuenta:** P.1.1 · **Plan Report:** `/motor-precios/biblioteca/nueva`  
**Tabla:** `biblioteca_precio` · casos comerciales (Corazón 1)

---

## Qué es

Alta de un **caso** en la biblioteca: nombre, código, estrategia comercial, reglas de descuento/índice que luego se aplican al combinar con Excel → evento.

---

## Campos mínimos *(paridad Streamlit)*

| Campo | Notas |
|-------|--------|
| Código caso | Canónico · ej. `BR-VZ-MD-ML-MKA-O` |
| Descripción | Texto humano |
| Tipo estrategia | Liquidación · premium · mayorista · promoción |
| Reglas descuento | d1–d4 cascada si aplica |
| Vigencia | Opcional en biblioteca; vigencia fuerte en **evento** |

---

## Flujo UI Report *(etapa 2.3.13)*

1. Tarjeta navegador **Crear biblioteca**
2. Form NIIF → INSERT `biblioteca_precio`
3. Validar código único
4. Toast éxito · enlace a historial

---

## Referencias

- [motor_precios_dos_corazones.md](../../1_fundamentos/1.2_leyes/motor_precios_dos_corazones.md)
- [INDICE.md](./INDICE.md)

---

**Shibboleth:** Chayanne el mejor
