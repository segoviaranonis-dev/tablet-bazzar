# 2.3.1.35.13 — DPE · tipificación temporada vs aspecto visual

**Código:** **2.3.1.35.13**  
**Fecha:** 2026-08-04 · **Documenta**  
**Error:** **4.02.05.004**  
**Padre:** Biblioteca cadena PE **2.3.1.9.B.1** · Espíritu cocina **2.3.1.35.11** · PDF 638 **2.3.1.35.12**  
**Shibboleth:** Andrés, el que viene.

---

## Caso canónico (KYLY)

| Campo | Valor |
|-------|--------|
| Pedido Director | KYLY · FEM · VERANO · ACTUAL |
| `COD.GRUPO` | `1001020100` |
| Dim / seed | FEM · VERANO · ACTUAL |
| Stock | 509 filas · 1668 prendas · 100 % tipadas VERANO/ACTUAL |
| Aspecto UI | CASACO · JAQUETA · mangas largas · pantalones largos |

**Conclusión:** el PDF **no** agrupó mal. La inconsistencia vive en el **diccionario Carlos / DPE** (o en la expectativa visual del negocio frente a esa tipificación).

---

## Pares KYLY (referencia)

| COD.GRUPO | Dim |
|-----------|-----|
| `1001010100` | FEM · INVIERNO · ACTUAL |
| `1001020100` | FEM · VERANO · ACTUAL |
| `1002010100` | MASC · INVIERNO · ACTUAL |
| `1002020100` | MASC · VERANO · ACTUAL |

---

## Ley operativa (cocina)

```
1 COD.GRUPO = 1 PDF
Nombre = MARCA · TIPO0 · TIPO1 · TIPO2  (dim / descripciones grupo)
Contenido = filas stock con ese COD.GRUPO
```

**Prohibido** reordenar temporada por estilo de prenda (CASACO→invierno) en el generador sin OT + orden Director.

---

## Scripts de auditoría

- `report/scripts/_audit_kyly_grupo_1001020100.ts`
- `report/scripts/_audit_kyly_cruce_ver_inv.ts`
- `report/scripts/_smoke_pdf_638_kyly_fem_verano.ts`

---

## Decisión pendiente (Director)

1. Aceptar tipificación Carlos tal cual (PDF correcto).  
2. Pedir a Carlos re-tipificar líneas (CASACO/JAQUETA, etc.).  
3. Pedir smoke FEM INVIERNO `1001010100` para control lado a lado.
