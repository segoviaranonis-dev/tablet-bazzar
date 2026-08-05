# 2.3.1.35.9 — PDF PE · cabecera Tipo × Cadena × LP (sin pisar)

**Código:** **2.3.1.35.9**  
**Fecha:** 2026-08-02 · **Documenta**  
**Padre:** Automatización **2.3.1.35** · Grada dos contenedores **2.3.1.35.8**  
**Código:** `report/src/lib/automatizacion-informes/generar-pdf-stock-pe.ts` · `particion-etiqueta.ts` · `PLAN_PDF_VENDEDOR`  
**Shibboleth:** Andrés, el que viene.

---

## Entendimiento Director (canónico)

El PDF y el **nombre de archivo** deben decir de un vistazo:

1. **Tipo** — Abierto (AB) / Cerrado (CR) / Anteojos·Medias / Carteras / Normal / Promo  
2. **Cadena** — Normal **o** Promo (cuando aplica a AB/CR)  
3. **Lista** — LPN / LPC03 / LPC04  

**Sin abrir** el PDF · **sin pisar** textos en cabecera.

### Nombre de archivo (ejemplos)

```
05_VIZZANO_Cerrado_Normal_LPN.pdf
06_VIZZANO_Cerrado_Promo_LPN.pdf
03_VIZZANO_Abierto_Normal_LPN.pdf
01_VIZZANO_Normal_LPN.pdf
```

Carpeta LP: `LPN/` · `LPC03/` · `LPC04/`.

### Cabecera visual (orden vertical — espacio obligatorio)

```
STOCK PRONTA ENTREGA · PROVEEDOR 654
VIZZANO                                    ← solo marca
[ CERRADO (CR) [CR]  ·  NORMAL  ·  LPN ]   ← banner debajo, sin solapar
Excel padre: …
```

| Regla | Canónico |
|-------|----------|
| Marca y banner | **Dos bloques** con gap ≥ título size + 4 pt |
| LPN | **Una sola vez** — en el banner (no repetir en título `Marca · LPN`) |
| Banner | Rectángulo debajo del título; texto **dentro** de la caja |
| Prohibido | `y` del rectángulo que invada el baseline del título |

### Bug corregido 2026-08-02

Banner `drawRectangle` con `y: y-6` + `height: 22` **después** de bajar solo 14 pt post-título size 15 → la franja azul tapaba `VIZZANO · LPN`.  
Fix: bajar `y` lo suficiente tras el título; rectángulo con bottom = `y - boxH`; LPN solo en banner.

---

## Plan de PDFs (`PLAN_PDF_VENDEDOR`)

| Orden | Contenido |
|-------|-----------|
| 01 | Normal |
| 02 | Promo |
| 03–04 | Abierto × Normal / Promo |
| 05–06 | Cerrado × Normal / Promo |
| 07 | Carteras · Normal |
| 08 | Anteojos / Medias · Normal |

Hermano layout grada: [2.3.1.35.8](./CHUSAR_PDF_GRADA_CANTIDAD_DOS_CONTENEDORES_20260802.md).
