# 2.3.1.35.10 — PDF PE · espejo LPC03 (Grupo 1)

**Código:** **2.3.1.35.10**  
**Fecha:** 2026-08-02 · **Documenta**  
**Padre:** Automatización **2.3.1.35** · Contrato bandeja **2.3.1.36.2** · DPE Grupo uno **2.3.1.10.1.2**  
**Código app:** `report/src/lib/automatizacion-informes/query-particion-pe.ts` · `run-envio.ts` · `PdfCandyAccordions.tsx`  
**Shibboleth:** Andrés, el que viene.

---

## Eureka (Director · 2026-08-02)

1. **Diccionario Grupo 1** = `COD.GRUPO` (Excel sdrm0849 col **D**) × stock (CSV sdrm#### · campo `COD.GRUPO`).  
2. Calzado prefijos **01–09** · piloto automatizado **VIZZANO = 02**.  
3. **1 COD.GRUPO = 1 PDF** · nombre = combinación de descripciones del grupo (`MARCA · TIPO0 · TIPO1 · TIPO2`).  
4. **Espejo LPC03:** la misma partición Grupo 1 se genera también bajo carpeta **`LPC03/`** con precio **LPC03** (PPD AM).  
5. Bandeja: acordeones **PDF · LPN** y **PDF · LPC03** (espejo) → Marca → Abierto · Cerrado · Carteras · botón = pares.

### Nombre de archivo (ejemplos)

```
LPN/01_VIZZANO_ABIERTO_NORMAL_LPN.pdf
LPC03/01_VIZZANO_ABIERTO_NORMAL_LPC03.pdf
LPN/05_VIZZANO_CERRADO_NORMAL_BOTA_LPN.pdf
LPC03/05_VIZZANO_CERRADO_NORMAL_BOTA_LPC03.pdf
```

**Ley:** nunca mezclar LP en un mismo PDF · 0 filas → 0 archivo · fotos obligatorias.

---

## Plan de generación

| Campo | Valor |
|-------|--------|
| `LPS_ORDEN` | `LPN` · `LPC03` (piloto) |
| Partición | `listGruposDpeConStock` × `fetchParticionStockPePorGrupo` |
| Precio | `coalesce(lpc03, lpn)` · si LPC03 vacío en PPD = **espejo LPN** (mismo stock) |
| Adjunto | `total_pares` (mig **196**) · UI botón |

**Nota operativa 2026-08-02:** en stock local VIZZANO `lpc03`/`lpc04` están NULL → el espejo genera con precio LPN y carpeta/nombre **LPC03** (estructura idéntica). Cuando PPD llene LPC03, gana ese precio.

LPC04 quedó fuera del **piloto VIZZANO**. Espíritu cocina total (Director): **LPN + LPC03 + LPC04** × 133 grupos — ver **2.3.1.35.11**.

---

## UI bandeja (`/mensajes-internos`)

```
PDFS · PRONTA ENTREGA
  PDF · LPN
    VIZZANO
      Abierto · Cerrado · Carteras  → PDF (botón = N pares)
  PDF · LPC03          ← espejo
    VIZZANO
      Abierto · Cerrado · Carteras  → PDF (botón = N pares)
```

---

## Referencias

- [CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md](../deposito_rimec/CHUSAR_GRUPO_UNO_DICCIONARIO_PE_EXCEL.md) **2.3.1.10.1.2**  
- [CHUSAR_CONTRATO_ENVIO_PDF_BANDEJA_20260802.md](../mensajes_internos/CHUSAR_CONTRATO_ENVIO_PDF_BANDEJA_20260802.md) **2.3.1.36.2**  
- [CHUSAR_PDF_CABECERA_TIPO_CADENA_LP_20260802.md](./CHUSAR_PDF_CABECERA_TIPO_CADENA_LP_20260802.md) **2.3.1.35.9**  

**Orden Director:** Documenta · espejo LPC03 · 2026-08-02.
