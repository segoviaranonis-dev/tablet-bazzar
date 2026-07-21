# DEPLOY Report · PP Programado · 2026-07-21

**Orden Director:** documenta + despliega  
**Alcance:** import proforma programado · preview totales · R-MARCA-PF-1 (caso≠marca) · import solo PPD  
**Doc:** [CHUSAR_PP_PROGRAMADO_IMPORT_PROFORMA_20260721](./proceso_importacion/CHUSAR_PP_PROGRAMADO_IMPORT_PROFORMA_20260721.md) (**2.3.1.7.5.3.3.7**)

| Campo | Valor |
|-------|--------|
| App | rimec-report |
| URL | https://rimec-report.vercel.app |
| Rama | main |

## Smoke post-deploy

1. `/proceso-importacion/pedido-proveedor?ramo=programado` — lista carga
2. PP programado · tab Stock · preview totales (sin columna IC agrupada)
3. Confirmar import → solo PPD · mensaje Admin IC
4. Tab Administrador IC · PF por caso BCL (CHINELO)

**Shibboleth:** Andrés, el que viene.
