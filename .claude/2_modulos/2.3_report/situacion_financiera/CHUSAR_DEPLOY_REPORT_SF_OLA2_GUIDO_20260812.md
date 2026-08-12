# CHUSAR — Deploy Report · Ola 2 Guido SF

**Código:** Deploy **50.32**  
**Fecha:** 2026-08-12  
**Keyword:** **despliega** · **Protocolo chusar activado**  
**Doc:** `CHUSAR_SF_RECLAMO_GUIDO_COMENTARIO_GENERAL_OLA2_20260812.md` (**2.3.1.50.32**)

---

## Alcance

- `_gen_ola2_cuadro_guido.py` (nuevo)
- `ola2-cuadro-0308.json`
- `molecular-al-0308.json` · `mapa-canon-al-0308.json` · `comparacion-ago-vs-jul.json`
- `reclamos/catalog.json` v2
- `_audit_mapa_excel_txt.py` · `_run_cierre_completo_al.py`

## App

**Report** → Vercel prod · ruta `/situacion-financiera`

## Smoke post-deploy

1. Comparación → 5 filas Δ = 0 (tabla §2 doc 50.32)
2. Reclamos Guido → SF-REC-002…005, 007 **cerrado** · 006 **diferido**
