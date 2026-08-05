# 2.3.1.35.11 — Espíritu del generador PDF PE · 133 × LPN · LPC03 · LPC04

**Código:** **2.3.1.35.11**  
**Fecha:** 2026-08-02 · **Documenta** · protocolo Chusar  
**Padre:** Automatización **2.3.1.35** · Espejo Grupo 1 **2.3.1.35.10** · Biblioteca cadena PE **2.3.1.9.B.1** · Bandeja **2.3.1.36**  
**Shibboleth:** Andrés, el que viene.

---

## Eureka (Director · 2026-08-02)

El generador **no** cocina “a pedido por vendedor”. Cocina la **cocina completa** del stock Pronta Entrega según el diccionario Grupo 1.

1. **Irremediable:** hay que generar los **133** PDF por lista de precio (uno por cada `COD.GRUPO` con stock).  
2. **Tres espejos LP:** la misma partición Grupo 1 se materializa en **LPN**, **LPC03** y **LPC04** (carpetas y nombre de archivo por LP).  
3. **Director (vista total):** ve **133 LPN + 133 LPC03 + 133 LPC04** (hasta **399** archivos cuando hay stock en los 133 grupos).  
4. **Usuarios / vendedores:** lo que cada uno ve en bandeja **no** se decide en la cocina — se programa después con el **asignador** (subset de grupos / marcas / LP).  
5. **Piloto VIZZANO (02):** prueba de espíritu (matriz Abierto·Cerrado·Carteras × casos) — **no** es el techo del sistema.

### Fórmula canónica

```
1 COD.GRUPO (Grupo 1, con stock)  →  1 PDF por LP
LP ∈ { LPN, LPC03, LPC04 }
Cocina Director = ∪ (grupo × LP)
Vista usuario   = filtro(asignador) ⊆ Cocina
```

**Ley:** nunca mezclar LP en un mismo PDF · 0 filas → 0 archivo · fotos obligatorias · nombre = descripciones del grupo (`MARCA · TIPO0 · TIPO1 · TIPO2`).

---

## Capas (no confundir)

| Capa | Qué hace | Quién |
|------|----------|--------|
| **Cocina** (`run-envio` / prep T−10) | Genera **todos** los PDF Grupo1 × LP | Sistema |
| **Depósito** (mensajes internos) | Adjunta PDF a bandeja destino | Automatización → **2.3.1.36** |
| **Asignador** *(próximo)* | Decide **qué subset** recibe cada usuario | Config / admin |
| **Bandeja UI** | Muestra solo lo depositado al destinatario de la sesión | `/mensajes-internos` |

**Prohibido** achicar la cocina “porque el vendedor solo ve Moleca”. El achique es del **asignador**, no del generador.

---

## Totales de referencia

| Concepto | Valor |
|----------|--------|
| Grupos diccionario PE (seed) | **133** (`biblioteca-cadena-carlos.seed.json`) |
| LP obligatorias cocina Director | **LPN · LPC03 · LPC04** |
| Techo archivos (133 grupos × 3 LP) | **399** |
| Piloto medido (VIZZANO) | 12 grupos con stock × LPN+LPC03 = **24 PDF** · ~**8 min** |

**Orden de magnitud:** pasar de 24 → ~399 PDF implica corrida larga (fotos = cuello de botella). Prep T−10 (**2.3.1.35.7**) sigue vigente.

**Precio:** PPD Alejandro Magno · `coalesce(lp_pedido, lpn)` cuando el LP pedido viene NULL (espejo stock; ver **2.3.1.35.10**).

---

## UI bandeja — espíritu Director

```
PDFS · PRONTA ENTREGA
  PDF · CALZADO | CONFECCIONES   ← tipo_v2
    PDF · LPN | LPC03 | LPC04
      Marca → familia → PDF (botón = pares)
```

Detalle UI cierre día: **2.3.1.36.6**. Botón = **pares**. El asignador podrá ocultar ramas a no-Directores; el Director conserva el árbol completo.

---

## Estado / pendiente

| Ítem | Estado |
|------|--------|
| Ley 1 COD.GRUPO = 1 PDF · nombre descripción | ✅ **2.3.1.35.10** |
| Espejo LPC03 piloto VIZZANO | ✅ |
| Cocina **133 × LPN+LPC03+LPC04** local HECTOR | ✅ **408 PDF** · msg **#21** · ~95 min · **2.3.1.36.6** |
| LPC04 en `LPS_ORDEN` | ✅ |
| Path `{tipo_v2}/{LP}/…` | ✅ |
| **Asignador** (qué ve cada usuario) | ⏳ **mañana** |
| Reloj / prep T−10 del banquete completo | ⏳ mañana |
| Deploy prod | ⏳ cierre etapa u orden directa |

---

## Referencias

- [CHUSAR_PDF_ESPEJO_LPC03_GRUPO1_20260802.md](./CHUSAR_PDF_ESPEJO_LPC03_GRUPO1_20260802.md) **2.3.1.35.10**  
- [CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md](../facturacion/CHUSAR_BIBLIOTECA_CADENA_CARLOS_PE.md) **2.3.1.9.B.1** · seed 133  
- [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) **2.3.1.10.1.2**  
- [CHUSAR_CONTRATO_ENVIO_PDF_BANDEJA_20260802.md](../mensajes_internos/CHUSAR_CONTRATO_ENVIO_PDF_BANDEJA_20260802.md) **2.3.1.36.2**  
- [CHUSAR_PREP_PDF_T_MENOS_10_20260802.md](./CHUSAR_PREP_PDF_T_MENOS_10_20260802.md) **2.3.1.35.7**  

**Orden Director:** Documenta · protocolo Chusar · espíritu 133 × LPN/LPC03/LPC04 · asignador después · 2026-08-02.
